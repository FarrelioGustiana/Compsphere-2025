<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\HacksphereRegistration;
use App\Models\HacksphereTeam;
use App\Models\HacksphereTeamMember;
use App\Models\Participant;
use App\Models\SubEvent;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Rules\Nik;

class ParticipantController extends Controller
{
    /**
     * Maximum team limits per category
     */
    protected $categoryLimits = [
        'high_school' => 10,
        'university' => 40, // Combined limit for university and non_academic
        'non_academic' => 40, // Combined limit for university and non_academic
    ];
    
    /**
     * Check if category has reached maximum team limit
     * 
     * @param string $category Category to check
     * @return bool True if limit reached, false otherwise
     */
    protected function categoryLimitReached($category)
    {
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        if (!$hacksphereEvent) {
            return false;
        }
        
        // For high school category, check specific limit
        if ($category === 'high_school') {
            $teamCount = Team::where('event_id', $hacksphereEvent->id)
                ->where('category', $category)
                ->count();
            
            return $teamCount >= $this->categoryLimits[$category];
        }
        
        // For university and non_academic, check combined limit
        if ($category === 'university' || $category === 'non_academic') {
            $combinedCount = Team::where('event_id', $hacksphereEvent->id)
                ->whereIn('category', ['university', 'non_academic'])
                ->count();
            
            return $combinedCount >= $this->categoryLimits[$category];
        }
        
        return false;
    }
    
    /**
     * Update twibbon link for Hacksphere event registration.
     * 
     * @param Request $request
     * @param int $eventId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateTwibbonLink(Request $request, $eventId)
    {
        $request->validate([
            'twibbon_link' => 'nullable|url',
        ]);

        // Find the user's registration for this event
        $registration = EventRegistration::where('user_id', Auth::id())
            ->where('event_id', $eventId)
            ->first();

        if (!$registration) {
            return redirect()->back()->with('error', 'You are not registered for this event.');
        }

        // Update the twibbon link
        $registration->twibbon_link = $request->twibbon_link;
        $registration->save();

        return redirect()->back()->with('success', $request->twibbon_link ? 'Twibbon link saved successfully.' : 'Twibbon link removed.');
    }
    /**
     * Display the participant dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $participantDetails = $user->participant;

        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'HACKSPHERE')->first();

        // Check if user is part of a Hacksphere team (either as leader or member)
        $hacksphereTeam = null;
        if ($hacksphereEvent) {
            // Check if user is a team leader
            $hacksphereTeam = Team::where('team_leader_id', $user->id)
                ->where('event_id', $hacksphereEvent->id)
                ->first();

            // If not a leader, check if user is a team member
            if (!$hacksphereTeam) {
                $teamMember = TeamMember::where('user_id', $user->id)
                    ->whereHas('team', function ($query) use ($hacksphereEvent) {
                        $query->where('event_id', $hacksphereEvent->id);
                    })
                    ->first();

                if ($teamMember) {
                    $hacksphereTeam = $teamMember->team;
                }
            }
        }

        // Get user's sub-event registrations
        $userSubEventRegistrations = EventRegistration::where('user_id', $user->id)
            ->whereNotNull('sub_event_id')
            ->with(['subEvent', 'event'])
            ->get();

        return Inertia::render('Participant/Dashboard', [
            'user' => $user,
            'participantDetails' => $participantDetails,
            'allEvents' => Event::all(),
            'registeredEvents' => $user->events,
            'userSubEventRegistrations' => $userSubEventRegistrations,
            'hacksphereTeam' => $hacksphereTeam ? [
                'id' => $hacksphereTeam->id,
                'team_name' => $hacksphereTeam->team_name,
                'team_code' => $hacksphereTeam->team_code,
                'is_leader' => $hacksphereTeam->team_leader_id === $user->id,
            ] : null,
        ]);
    }

    /**
     * Update participant profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'domicile' => 'string|max:255',
        ]);

        $participant = $user->participant;
        if ($participant) {
            $participant->update($validated);
        } else {
            $encryption_code = bin2hex(random_bytes(8));
            $user->participant()->create($validated + [
                'user_id' => $user->id,
                'encryption_code' => $encryption_code,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Register participant for an event.
     */
    public function registerEvent(Request $request, $eventId, QRCodeService $qrCodeService)
    {
        $user = $request->user();
        $participant = $user->participant;

        // Check if participant profile is complete
        if (
            !$participant ||
            !$participant->category ||
            !$participant->phone_number ||
            !$participant->date_of_birth
        ) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering.');
        }

        // Prevent duplicate registration
        $existingRegistration = EventRegistration::where('user_id', $participant->user_id)
            ->where('event_id', $eventId)
            ->first();

        if ($existingRegistration) {
            return back()->with('info', 'You are already registered for this event.');
        }

        $event = Event::findOrFail($eventId);

        // Block direct registration to Talksphere - users must register to sub-events
        if ($event->event_code === 'talksphere') {
            return back()->with('error', 'Please register for specific Talksphere sub-events (Seminar, Talkshow, or Workshop) instead of the general event.');
        }

        try {
            DB::beginTransaction();

            // Create EventRegistration record
            $eventRegistration = EventRegistration::create([
                'user_id' => $participant->user_id,
                'event_id' => $event->id,
                'registration_date' => now(),
                'registration_status' => 'pending', // Will be updated to 'registered' after QR verification
                'payment_status' => $event->is_paid_event ? 'pending' : null,
                'payment_amount' => $event->is_paid_event ? 0 : null,
            ]);

            // Also maintain the pivot table relationship for backward compatibility
            if (!$user->events()->where('events.id', $eventId)->exists()) {
                $user->events()->attach($eventId, [
                    'registration_date' => now(),
                    'registration_status' => 'pending'
                ]);
            }

            // Generate QR code for Talksphere and Festsphere events
            if (in_array($event->event_code, ['talksphere', 'festsphere'])) {
                $qrCodeData = $qrCodeService->generateEventRegistrationQR($participant->user_id, $event->id);

                if ($qrCodeData) {
                    DB::commit();
                    return back()->with([
                        'success' => 'You have registered for the event! Your QR code has been generated.',
                        'qr_code_data' => $qrCodeData
                    ]);
                }
            }

            DB::commit();
            return back()->with('success', 'You have registered for the event!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Event registration error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred during registration. Please try again.');
        }
    }

    /**
     * Register participant for a sub-event.
     */
    public function registerSubEvent(Request $request, $subEventId, QRCodeService $qrCodeService)
    {
        Log::info('Sub-event registration attempt', ['subEventId' => $subEventId, 'userId' => $request->user()->id]);
        
        $user = $request->user();
        $participant = $user->participant;

        // Check if participant profile is complete
        if (
            !$participant ||
            !$participant->category ||
            !$participant->phone_number ||
            !$participant->date_of_birth
        ) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering.');
        }

        $subEvent = SubEvent::findOrFail($subEventId);
        $event = $subEvent->event;

        Log::info('Sub-event found', [
            'subEvent' => $subEvent->sub_event_name,
            'is_active' => $subEvent->is_active,
            'start_time' => $subEvent->start_time,
            'now' => now(),
            'isRegistrationOpen' => $subEvent->isRegistrationOpen()
        ]);

        // Check if sub-event registration is still open
        if (!$subEvent->isRegistrationOpen()) {
            Log::warning('Registration closed for sub-event', ['subEventId' => $subEventId]);
            return back()->with('error', 'Registration for this sub-event is no longer available.');
        }

        // Prevent duplicate registration for the same sub-event
        $existingSubEventRegistration = EventRegistration::where('user_id', $participant->user_id)
            ->where('event_id', $event->id)
            ->where('sub_event_id', $subEvent->id)
            ->first();

        Log::info('Duplicate check result', [
            'user_id' => $participant->user_id,
            'event_id' => $event->id,
            'sub_event_id' => $subEvent->id,
            'existing_registration' => $existingSubEventRegistration ? $existingSubEventRegistration->id : null
        ]);

        if ($existingSubEventRegistration) {
            Log::warning('Duplicate registration attempt blocked');
            return back()->with('info', 'You are already registered for this sub-event.');
        }

        try {
            DB::beginTransaction();

            // Create EventRegistration record for sub-event
            $eventRegistration = EventRegistration::create([
                'user_id' => $participant->user_id,
                'event_id' => $event->id,
                'sub_event_id' => $subEvent->id,
                'registration_date' => now(),
                'registration_status' => 'registered', // Set to registered immediately for sub-events
                'payment_status' => $event->is_paid_event ? 'pending' : null,
                'payment_amount' => $event->is_paid_event ? 0 : null,
            ]);

            Log::info('EventRegistration created successfully', [
                'registration_id' => $eventRegistration->id,
                'user_id' => $participant->user_id,
                'event_id' => $event->id,
                'sub_event_id' => $subEvent->id
            ]);

            // Also register for main event if not already registered (without sub_event_id)
            $mainEventRegistration = EventRegistration::where('user_id', $participant->user_id)
                ->where('event_id', $event->id)
                ->whereNull('sub_event_id')
                ->first();
                
            if (!$mainEventRegistration) {
                EventRegistration::create([
                    'user_id' => $participant->user_id,
                    'event_id' => $event->id,
                    'sub_event_id' => null, // Main event registration
                    'registration_date' => now(),
                    'registration_status' => 'registered'
                ]);
                
                Log::info('Main event registration created', [
                    'user_id' => $participant->user_id,
                    'event_id' => $event->id
                ]);
            }

            // Generate QR code for sub-event
            if (in_array($event->event_code, ['talksphere', 'festsphere'])) {
                Log::info('Generating QR code for sub-event registration', [
                    'user_id' => $participant->user_id,
                    'event_id' => $event->id,
                    'sub_event_id' => $subEvent->id,
                    'event_code' => $event->event_code
                ]);
                
                $qrCodeData = $qrCodeService->generateEventRegistrationQR($participant->user_id, $event->id, $subEvent->id);

                if ($qrCodeData) {
                    Log::info('QR code generated successfully', ['qr_data' => $qrCodeData]);
                    DB::commit();
                    return back()->with([
                        'success' => "You have registered for {$subEvent->sub_event_name}! Your QR code has been generated.",
                        'qr_code_data' => $qrCodeData
                    ]);
                } else {
                    Log::error('Failed to generate QR code for sub-event registration');
                }
            }

            DB::commit();
            return back()->with('success', "You have successfully registered for {$subEvent->sub_event_name}!");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sub-event registration error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred during registration. Please try again.');
        }
    }

    /**
     * Display the participant profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $participantDetails = $user->participant;

        return Inertia::render('Participant/Profile', [
            'user' => $user,
            'participantDetails' => $participantDetails,
        ]);
    }

    /**
     * Update participant NIK for Hacksphere event.
     */
    public function updateNik(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'nik' => ['required', new Nik, 'unique:participants,nik'],
        ]);

        $participant = $user->participant;
        if ($participant) {
            $participant->update([
                'nik' => $validated['nik']
            ]);
            return redirect()->back()->with('success', 'NIK updated successfully.');
        }

        return redirect()->back()->with('error', 'Please complete your profile first.');
    }

    /**
     * Handle the Hacksphere team registration process.
     */
    public function registerHacksphere(Request $request)
    {
        $user = $request->user();
        $participant = $user->participant;
        
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        // Force registration to be closed as of September 28, 2025
        $closingDate = \Carbon\Carbon::create(2025, 9, 28, 23, 59, 59);
        $now = now();
        
        // Check if current date is past the closing date or if registration is not open
        if (!$hacksphereEvent || $now >= $closingDate || !$hacksphereEvent->isRegistrationOpen()) {
            return back()->with('error', 'Hacksphere registration is now closed. Thank you for your interest.');
        }

        // Check if participant profile is complete
        if (
            !$participant ||
            !$participant->category ||
            !$participant->phone_number ||
            !$participant->date_of_birth
        ) {
            return redirect()->route('participant.profile')->with('error', 'Please complete your profile before registering for Hacksphere.');
        }

        // Check if category has reached maximum team limit
        $category = $request->input('team_category');
        if ($this->categoryLimitReached($category)) {
            $categoryName = $category === 'high_school' ? 'High School' : ($category === 'university' ? 'University' : 'Non-Academic');
            $message = $category === 'high_school'
                ? "Registration for High School category has reached the maximum limit of {$this->categoryLimits[$category]} teams."
                : "Registration for University and Non-Academic categories has reached the combined maximum limit of {$this->categoryLimits[$category]} teams.";
            
            return back()->with('error', $message);
        }
        
        // Validate the request data for team creation
        $validated = $request->validate([
            'team_name' => 'required|string|max:255',
            'team_leader_nik' => ['required', new Nik],
            'team_category' => 'required|string|in:high_school,university,non_academic',
            'team_leader_category' => 'required|string|in:high_school,university,non_academic|same:team_category',
            'team_leader_domicile' => 'required|string|max:255',
            'member1_email' => 'required|email|exists:users,email',
            'member1_nik' => ['required', new Nik],
            'member1_category' => 'required|string|in:high_school,university,non_academic|same:team_category',
            'member1_domicile' => 'required|string|max:255',
            'member2_email' => 'required|email|exists:users,email',
            'member2_nik' => ['required', new Nik],
            'member2_category' => 'required|string|in:high_school,university,non_academic|same:team_category',
            'member2_domicile' => 'required|string|max:255',
            'payment_initiated' => 'boolean',
            'payment_amount' => 'numeric',
            'twibbon_leader_link' => 'nullable|url|max:255',
            'twibbon_member1_link' => 'nullable|url|max:255',
            'twibbon_member2_link' => 'nullable|url|max:255',
        ]);

        // Check if the team leader is the authenticated user
        if ($participant->nik && $participant->nik !== $validated['team_leader_nik']) {
            return back()->with('error', 'The NIK provided for team leader does not match your NIK.');
        }

        // Update participant details if needed
        if (!$participant->nik) {
            $participant->update([
                'nik' => $validated['team_leader_nik'],
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['team_leader_domicile'],
            ]);
        } else {
            $participant->update([
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['team_leader_domicile'],
            ]);
        }

        // Generate a unique 8-digit team code
        do {
            $team_code = str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
        } while (Team::where('team_code', $team_code)->exists());

        // Create the team with the authenticated user as leader
        $hacksphereEvent = \App\Models\Event::where('event_code', 'hacksphere')->first();
        $team = Team::create([
            'team_name' => $validated['team_name'],
            'team_leader_id' => $user->id,
            'team_code' => $team_code,
            'event_id' => $hacksphereEvent->id,
            'category' => $validated['team_category'],
        ]);

        // Process member 1
        $member1User = \App\Models\User::where('email', $validated['member1_email'])->first();
        $member1Participant = $member1User->participant;

        if (!$member1Participant) {
            // Create participant record if it doesn't exist
            $encryption_code = bin2hex(random_bytes(8));
            $member1Participant = \App\Models\Participant::create([
                'user_id' => $member1User->id,
                'encryption_code' => $encryption_code,
                'nik' => $validated['member1_nik'],
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['member1_domicile'],
            ]);
        } else {
            // Update existing participant record
            $member1Participant->update([
                'nik' => $validated['member1_nik'],
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['member1_domicile'],
            ]);
        }

        // Process member 2
        $member2User = \App\Models\User::where('email', $validated['member2_email'])->first();
        $member2Participant = $member2User->participant;

        if (!$member2Participant) {
            // Create participant record if it doesn't exist
            $encryption_code = bin2hex(random_bytes(8));
            $member2Participant = \App\Models\Participant::create([
                'user_id' => $member2User->id,
                'encryption_code' => $encryption_code,
                'nik' => $validated['member2_nik'],
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['member2_domicile'],
            ]);
        } else {
            // Update existing participant record
            $member2Participant->update([
                'nik' => $validated['member2_nik'],
                'category' => $validated['team_category'],  // Menggunakan kategori tim
                'domicile' => $validated['member2_domicile'],
            ]);
        }

        // Add members to the team
        $team->members()->attach([$member1Participant->user_id, $member2Participant->user_id]);

        // Register all team members for the Hacksphere event
        $user->events()->attach($hacksphereEvent->id);
        $member1User->events()->attach($hacksphereEvent->id);
        $member2User->events()->attach($hacksphereEvent->id);

        // Get payment information
        $paymentStatus = (isset($validated['payment_initiated']) && $validated['payment_initiated']) ? 'pending' : null;
        $paymentAmount = isset($validated['payment_amount']) ? $validated['payment_amount'] : 150000; // Default to 150,000 IDR

        // Get Twibbon links
        $leaderTwibbonLink = $validated['twibbon_leader_link'] ?? null;
        $member1TwibbonLink = $validated['twibbon_member1_link'] ?? null;
        $member2TwibbonLink = $validated['twibbon_member2_link'] ?? null;

        // Create or update event registration records with payment status and twibbon links
        $this->updateEventRegistration($user->id, $hacksphereEvent->id, $paymentStatus, $paymentAmount, $leaderTwibbonLink);
        $this->updateEventRegistration($member1User->id, $hacksphereEvent->id, $paymentStatus, $paymentAmount, $member1TwibbonLink);
        $this->updateEventRegistration($member2User->id, $hacksphereEvent->id, $paymentStatus, $paymentAmount, $member2TwibbonLink);

        // Auto-generate QR codes for all team activities
        $qrCodeService = app(\App\Services\QRCodeService::class);
        $qrCodeService->bulkGenerateTeamQRCodes($team->id, $hacksphereEvent->id);

        $successMessage = 'Your team has been successfully registered for Hacksphere!';
        if (isset($validated['payment_initiated']) && $validated['payment_initiated']) {
            $successMessage .= ' Please complete your payment verification to access all features.';
        }

        // Redirect to payment status page instead of dashboard
        return redirect()->route('participant.hacksphere.payment-status', ['teamId' => $team->id])
            ->with('success', $successMessage);
    }
    /**
     * Handle the Hacksphere team registration process.
     */


    /**
     * Update or create event registration record with payment information and twibbon link
     *
     * @param int $userId
     * @param int $eventId
     * @param string $paymentStatus
     * @param float $paymentAmount
     * @param string|null $twibbonLink
     * @return void
     */
    protected function updateEventRegistration($userId, $eventId, $paymentStatus, $paymentAmount, $twibbonLink = null)
    {
        $registration = \App\Models\EventRegistration::updateOrCreate(
            ['user_id' => $userId, 'event_id' => $eventId],
            [
                'registration_status' => 'pending',
                'payment_status' => $paymentStatus,
                'payment_amount' => $paymentAmount,
                'twibbon_link' => $twibbonLink,
            ]
        );
    }

    /**
     * Validate team member email.
     */
    public function validateTeamMemberEmail(Request $request)
    {
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        // Force registration to be closed as of September 28, 2025
        $closingDate = \Carbon\Carbon::create(2025, 9, 28, 23, 59, 59);
        $now = now();
        
        // Check if current date is past the closing date or if registration is not open
        if (!$hacksphereEvent || $now >= $closingDate || !$hacksphereEvent->isRegistrationOpen()) {
            return response()->json([
                'valid' => false,
                'message' => 'Hacksphere registration is now closed. Thank you for your interest.'
            ]);
        }
        
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Check if user exists separately to provide a better error message
        $memberUser = \App\Models\User::where('email', $validated['email'])->first();

        if (!$memberUser) {
            return response()->json([
                'valid' => false,
                'message' => 'No user account found with this email. The person must have an account on our platform.'
            ]);
        }

        if ($memberUser->id === $request->user()->id) {
            return response()->json([
                'valid' => false,
                'message' => 'You cannot add yourself as a team member.'
            ]);
        }

        // Check if user is already registered for Hacksphere
        $hacksphereEvent = \App\Models\Event::where('event_code', 'hacksphere')->first();
        if ($hacksphereEvent && $memberUser->events()->where('events.id', $hacksphereEvent->id)->exists()) {
            return response()->json([
                'valid' => false,
                'message' => 'This user is already registered for Hacksphere.'
            ]);
        }

        return response()->json([
            'valid' => true,
            'user' => [
                'name' => $memberUser->full_name,
                'email' => $memberUser->email,
                'member_user_id' => $memberUser->id,
            ]
        ]);
    }

    /**
     * Validate team member NIK.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateTeamMemberNik(Request $request)
    {
        // Get Hacksphere event
        $hacksphereEvent = Event::where('event_code', 'hacksphere')->first();
        
        // Force registration to be closed as of September 28, 2025
        $closingDate = \Carbon\Carbon::create(2025, 9, 28, 23, 59, 59);
        $now = now();
        
        // Check if current date is past the closing date or if registration is not open
        if (!$hacksphereEvent || $now >= $closingDate || !$hacksphereEvent->isRegistrationOpen()) {
            return response()->json([
                'valid' => false,
                'message' => 'Hacksphere registration is now closed. Thank you for your interest.'
            ]);
        }
        
        $validated = $request->validate([
            'nik' => ['required', new Nik],
            'current_member_email' => 'required|string|email',
            'other_niks' => 'nullable|array'
        ]);

        // First, check if the email belongs to an existing user
        $memberUser = \App\Models\User::where('email', $validated['current_member_email'])->first();

        // If we found a user, check if they have a participant profile with this NIK
        if ($memberUser) {
            $memberParticipant = \App\Models\Participant::where('user_id', $memberUser->id)->first();

            // If this member already has this NIK in their profile, it's valid for them to use
            if ($memberParticipant && $memberParticipant->nik === $validated['nik']) {
                return response()->json([
                    'valid' => true,
                    'message' => 'This NIK matches your existing profile.'
                ]);
            }
        }

        // Check if the NIK already exists in the participants table (but not owned by this member)
        $existingParticipant = \App\Models\Participant::where('nik', $validated['nik'])->first();

        if ($existingParticipant) {
            // If this participant exists but has a different user_id than the current member
            if (!$memberUser || $existingParticipant->user_id !== $memberUser->id) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This NIK is already registered for Hacksphere.'
                ]);
            }
        }

        // Check if the NIK exists in the other team members in current form
        if (isset($validated['other_niks']) && is_array($validated['other_niks'])) {
            foreach ($validated['other_niks'] as $otherNik) {
                if ($otherNik === $validated['nik']) {
                    return response()->json([
                        'valid' => false,
                        'message' => 'This NIK is already being used by another team member in this form.'
                    ]);
                }
            }
        }

        return response()->json([
            'valid' => true,
            'message' => 'NIK is valid and unique.'
        ]);
    }
}
