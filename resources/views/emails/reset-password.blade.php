<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Reset Your Password - Compsphere 2025</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        /* Base */
        body, body *:not(html):not(style):not(br):not(tr):not(code) {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
        }
        
        body {
            background-color: #0f172a; /* A darker, more space-like blue */
            color: #e2e8f0;
            height: 100%;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }
        
        /* Layout */
        .wrapper {
            background-color: #0f172a;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        .content {
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        /* Header */
        .header {
            padding: 40px 0;
            text-align: center;
        }
        
        .header img {
            max-width: 100px;
        }
        
        /* Body */
        .main-body {
            background-color: #1e293b;
            border-radius: 12px;
            border: 1px solid #334155;
            margin: 0 auto;
            padding: 40px;
            width: 100%;
            max-width: 570px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.1) inset;
        }

        @media only screen and (max-width: 600px) {
            .main-body {
                width: 100% !important;
                padding: 25px;
            }
        }
        
        /* Content */
        h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin-top: 0;
        }

        p {
            color: #cbd5e1;
            font-size: 16px;
            line-height: 1.6;
        }

        .button-container {
            padding: 25px 0;
            text-align: center;
        }
        
        .button {
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
            border-radius: 8px;
            color: #ffffff;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 28px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .subcopy {
            margin-top: 20px;
            text-align: center;
        }

        .subcopy p {
            font-size: 13px;
            color: #94a3b8;
        }

        .subcopy a {
            color: #3b82f6;
            text-decoration: none;
        }
        
        /* Footer */
        .footer {
            margin: 30px auto 0;
            padding: 0;
            text-align: center;
            width: 100%;
            max-width: 570px;
        }
        
        .footer p {
            color: #64748b;
            font-size: 12px;
        }

    </style>
</head>
<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Logo -->
                    <tr>
                        <td class="header">
                            <a href="{{ config('app.url') }}">
                                <img src="{{ $message->embed($logo) }}" alt="Compsphere Logo">
                            </a>
                        </td>
                    </tr>

                    <!-- Email Body -->
                    <tr>
                        <td width="100%" cellpadding="0" cellspacing="0">
                            <table class="main-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                                <!-- Body content -->
                                <tr>
                                    <td>
                                        <h1>Reset Your Password</h1>
                                        <p>
                                            You are receiving this email because we received a password reset request for your <strong>Compsphere 2025</strong> account. Please click the button below to reset your password.
                                        </p>

                                        <table class="button-container" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td align="center">
                                                    <a href="{{ $url }}" class="button" target="_blank">Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p>
                                            This password reset link will expire in 60 minutes.
                                        </p>
                                        
                                        <p>
                                            If you did not request a password reset, no further action is required.
                                        </p>
                                        
                                        <p>
                                            Best regards,<br>
                                            The Compsphere Team
                                        </p>

                                        <table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td>
                                                    <p>
                                                        If you're having trouble clicking the "Reset Password" button, copy and paste this URL into your browser:<br>
                                                        <a href="{{ $url }}">{{ $url }}</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td>
                            <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td align="center">
                                        <p>
                                            &copy; {{ date('Y') }} Compsphere. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
