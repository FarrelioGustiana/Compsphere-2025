<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\VerifyEmail;
use App\Notifications\ResetPassword;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'email_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }
    
    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
    
    /**
     * Get the participant associated with the user.
     */
    public function participant(): HasOne
    {
        return $this->hasOne(Participant::class);
    }
    
    /**
     * Get the judge profile associated with the user.
     */
    public function judgeProfile(): HasOne
    {
        return $this->hasOne(JudgeProfile::class);
    }
    
    /**
     * Get the admin profile associated with the user.
     */
    public function adminProfile(): HasOne
    {
        return $this->hasOne(AdminProfile::class);
    }
    
    /**
     * Get the events that the user has registered for.
     */
    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_registrations')
                    ->withPivot(['registration_date', 'registration_status', 'payment_status', 'payment_amount', 'payment_date', 'invoice_id'])
                    ->withTimestamps();
    }
    
    /**
     * Get all event registrations for this user.
     */
    public function eventRegistrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
    
    /**
     * Get all activity verifications this admin has verified.
     */
    public function verifiedActivities(): HasMany
    {
        return $this->hasMany(TeamActivityVerification::class, 'verified_by');
    }
    
    /**
     * Check if the user is a participant.
     */
    public function isParticipant(): bool
    {
        return $this->role === 'participant';
    }
    
    /**
     * Check if the user is a judge.
     */
    public function isJudge(): bool
    {
        return $this->role === 'judge';
    }
    
    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    /**
     * Determine if the user has verified their email address.
     *
     * @return bool
     */
    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified === true;
    }

    /**
     * Mark the given user's email as verified.
     *
     * @return bool
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified' => true,
        ])->save();
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmail);
    }

    /**
     * Get the email address that should be used for verification.
     *
     * @return string
     */
    public function getEmailForVerification(): string
    {
        return $this->email;
    }
    
    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPassword($token));
    }
}
