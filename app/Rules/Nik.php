<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Nik implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || !preg_match('/^[0-9]{16}$/', $value)) {
            $fail('The :attribute must be a 16-digit number.');
            return;
        }

        $dayPart = (int) substr($value, 6, 2);
        $monthPart = (int) substr($value, 8, 2);
        $yearPart = (int) substr($value, 10, 2);

        $day = $dayPart;
        if ($dayPart > 40) {
            $day = $dayPart - 40;
        }

        if ($monthPart < 1 || $monthPart > 12) {
            $fail('The :attribute contains an invalid month of birth.');
            return;
        }

        // Heuristic for 2-digit year
        $currentYearLastTwoDigits = (int) date('y');
        $year = ($yearPart > $currentYearLastTwoDigits) ? 1900 + $yearPart : 2000 + $yearPart;

        if (!checkdate($monthPart, $day, $year)) {
            $fail('The :attribute contains an invalid date of birth.');
            return;
        }
    }
}
