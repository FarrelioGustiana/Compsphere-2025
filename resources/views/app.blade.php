<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @vite('resources/js/app.tsx')
    <link rel="icon" type="image/png" href="/assets/compsphere.png">
    @inertiaHead
</head>
<body style="background-color: #101828;">
    @routes
    @inertia
</body>
</html>
