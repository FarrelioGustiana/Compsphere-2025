<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
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
     * Get the participant details associated with the user.
     */
    public function participantDetails(): HasOne
    {
        return $this->hasOne(ParticipantDetail::class);
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
}
