<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use HasFactory;

    protected $table = 'event_registrations';

    protected $fillable = [
        'user_id',
        'event_id',
        'registration_date',
        'registration_status',
        'payment_status',
        'payment_amount',
        'payment_date',
        'invoice_id',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
        'payment_date' => 'datetime',
        'payment_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}