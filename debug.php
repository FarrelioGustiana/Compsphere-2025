<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Current Time: " . now() . "\n\n";

$subEvents = \App\Models\SubEvent::whereHas('event', function($query) {
    $query->where('event_code', 'exposphere');
})->get();

foreach($subEvents as $subEvent) {
    echo "=== " . $subEvent->sub_event_name . " ===\n";
    echo "Start Time: " . $subEvent->start_time . "\n";
    
    $info = $subEvent->additional_info;
    if ($info) {
        echo "Registration Opens: " . ($info['registration_opens'] ?? 'N/A') . "\n";
        echo "Registration Closes: " . ($info['registration_closes'] ?? 'N/A') . "\n";
    }
    
    echo "Status: " . $subEvent->status . "\n";
    echo "Is Registration Open: " . ($subEvent->isRegistrationOpen() ? 'YES' : 'NO') . "\n";
    echo "\n";
}
