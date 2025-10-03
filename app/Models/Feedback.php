<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'subject',
        'message',
        'feedback_type',
        'event_code',
        'rating',
        'status',
        'admin_response',
        'responded_by',
        'responded_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the user who submitted the feedback.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who responded to the feedback.
     */
    public function respondedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    /**
     * Get the display name for the feedback submitter.
     */
    public function getSubmitterNameAttribute(): string
    {
        if ($this->user) {
            return $this->user->first_name . ' ' . $this->user->last_name;
        }
        
        return $this->name ?? 'Anonymous';
    }

    /**
     * Get the display email for the feedback submitter.
     */
    public function getSubmitterEmailAttribute(): string
    {
        if ($this->user) {
            return $this->user->email;
        }
        
        return $this->email ?? 'No email provided';
    }

    /**
     * Scope for filtering by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by feedback type.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('feedback_type', $category);
    }

    /**
     * Scope for filtering by event code.
     */
    public function scopeByEventCode($query, $eventCode)
    {
        return $query->where('event_code', $eventCode);
    }
}
