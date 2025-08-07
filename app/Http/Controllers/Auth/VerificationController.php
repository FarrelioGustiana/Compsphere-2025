<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    /**
     * Show the email verification notice.
     *
     * @return Response
     */
    public function notice(Request $request)
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->route($request->user()->role . '.dashboard')
            : Inertia::render('Auth/VerifyEmail', [
                'status' => session('status'),
            ]);
    }

    /**
     * Verify the user's email address.
     *
     * @param  \Illuminate\Foundation\Auth\EmailVerificationRequest  $request
     * @return RedirectResponse
     */
    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route($request->user()->role . '.dashboard');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->route($request->user()->role . '.dashboard')->with('status', 'Email verified successfully!');
    }

    /**
     * Resend the email verification notification.
     *
     * @param  Request  $request
     * @return RedirectResponse
     */
    public function resend(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route($request->user()->role . '.dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'Verification link sent!');
    }
}
