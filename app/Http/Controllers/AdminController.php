<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $adminProfile = $user->adminProfile;
        
        // Get statistics for the admin dashboard
        $userStats = [
            'total' => User::count(),
            'participants' => User::where('role', 'participant')->count(),
            'judges' => User::where('role', 'judge')->count(),
            'admins' => User::where('role', 'admin')->count(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'adminProfile' => $adminProfile,
            'userStats' => $userStats,
        ]);
    }
    
    /**
     * Display the admin profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $adminProfile = $user->adminProfile;
        
        return Inertia::render('Admin/Profile', [
            'user' => $user,
            'adminProfile' => $adminProfile,
        ]);
    }
    
    /**
     * Display the user management page.
     */
    
    /**
     * Display event participants for a specific event
     * 
     * @param Request $request
     * @param string $eventCode
     * @return \Inertia\Response
     */
    public function eventParticipants(Request $request, $eventCode)
    {
        $user = $request->user();
        
        // Find the event by event_code
        $event = Event::where('event_code', $eventCode)->firstOrFail();
        
        // Get all registrations for this event with user and verification data
        $registrations = EventRegistration::where('event_id', $event->id)
            ->join('users', 'event_registrations.user_id', '=', 'users.id')
            ->join('participants', 'users.id', '=', 'participants.user_id')
            ->select(
                'event_registrations.id',
                'event_registrations.verification_code',
                'event_registrations.attendance_verified_at',
                'event_registrations.created_at as registration_date',
                'users.id as user_id',
                'users.first_name',
                'users.last_name',
                'users.email',
                'participants.phone_number',
                'participants.job_or_institution as institution',
                'participants.domicile'
            )
            ->orderBy('users.first_name')
            ->get();
        
        return Inertia::render('Admin/EventParticipants', [
            'user' => $user,
            'event' => $event,
            'registrations' => $registrations
        ]);
    }
    
    /**
     * Display the user management page.
     */
    public function users(Request $request)
    {
        $users = User::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->input('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->paginate(10)
            ->withQueryString();
            
        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }
}
