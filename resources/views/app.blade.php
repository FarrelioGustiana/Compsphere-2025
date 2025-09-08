<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @php
        $assetUrl = app()->environment('local') ? '' : asset('build/');
    @endphp
    
    @if(app()->environment('production'))
        <link rel="stylesheet" href="{{ $assetUrl }}resources/css/app.css">
        <script src="{{ $assetUrl }}resources/js/app.tsx" type="module"></script>
    @else
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @endif
    <link rel="icon" type="image/png" href="/assets/compsphere.png">
    @inertiaHead
</head>
<body style="background-color: #101828;">
    @routes
    @inertia
</body>
</html>