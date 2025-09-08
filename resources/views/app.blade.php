<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    @production
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @else
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @endproduction
    <link rel="icon" type="image/png" href="{{ asset('assets/compsphere.png') }}">
    @inertiaHead
</head>
<body style="background-color: #101828;">
    @routes
    @inertia
</body>
</html>