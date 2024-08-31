<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Result</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <div class="container">
        <h1>Payment Result</h1>
        
        @if ($vnp_ResponseCode == '00')
            <div class="alert alert-success">
                <h2>Payment Successful</h2>
                <p><strong>Transaction Reference:</strong> {{ $vnp_TxnRef }}</p>
                <p><strong>Amount:</strong> {{ number_format($vnp_Amount / 100, 2) }} USD</p>
                <p><strong>Order Info:</strong> {{ $vnp_OrderInfo }}</p>
            </div>
        @else
            <div class="alert alert-danger">
                <h2>Payment Failed</h2>
                <p><strong>Transaction Reference:</strong> {{ $vnp_TxnRef }}</p>
                <p><strong>Amount:</strong> {{ number_format($vnp_Amount / 100, 2) }} USD</p>
                <p><strong>Order Info:</strong> {{ $vnp_OrderInfo }}</p>
                <p><strong>Response Code:</strong> {{ $vnp_ResponseCode }}</p>
            </div>
        @endif
    </div>
</body>
</html>
