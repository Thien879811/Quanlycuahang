<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $vnpayUrl;
    protected $returnUrl;
    protected $notifyUrl;
    protected $merchantCode;
    protected $secretKey;

    public function __construct()
    {
        $this->vnpayUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        $this->returnUrl = 'http://localhost:3001/vnpay/return';
        $this->notifyUrl = 'http://127.0.0.1:8000/api/vnpay/notify';
        $this->merchantCode = 'OCKOQ6D2';
        $this->secretKey = 'EQGMWQ0FCL50HTQTG2CS7B9MTI95IU21';
    }

    public function pay(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'nullable|exists:orders,id',
            'amount' => 'nullable|numeric'
        ]);
        $vnp_TxnRef = $validated['order_id'];
        $vnp_OrderInfo = 'Thanh toan';
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $validated['amount'] * 100; // Convert to VND cents
        $vnp_Locale = 'vn';
        $vnp_BankCode = 'QR';
        $vnp_IpAddr = $request->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $this->merchantCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $this->returnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_BankCode" => $vnp_BankCode
        ];

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $this->vnpayUrl . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->secretKey);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        Log::info('Generated VNPay URL:', ['url' => $vnp_Url]);

        return response()->json(['url' => $vnp_Url]);
    }

    public function return(Request $request)
    {
        $vnp_ResponseCode = $request->input('vnp_ResponseCode');
        $vnp_TxnRef = $request->input('vnp_TxnRef');
        $vnp_Amount = $request->input('vnp_Amount');
        $vnp_OrderInfo = $request->input('vnp_OrderInfo');

        Payment::create([
            'txn_ref' => $vnp_TxnRef,
            'amount' => $vnp_Amount / 100,
            'response_code' => $vnp_ResponseCode,
            'order_info' => $vnp_OrderInfo,
        ]);

        return response()->json([
            'status' => $vnp_ResponseCode == '00' ? 'success' : 'failure',
            'message' => $vnp_ResponseCode == '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
            'data' => compact('vnp_ResponseCode', 'vnp_TxnRef', 'vnp_Amount', 'vnp_OrderInfo')
        ]);
    }

    public function notify(Request $request)
    {
        $vnp_ResponseCode = $request->input('vnp_ResponseCode');
        $vnp_TxnRef = $request->input('vnp_TxnRef');
        $vnp_Amount = $request->input('vnp_Amount');
        $vnp_OrderInfo = $request->input('vnp_OrderInfo');

        Payment::updateOrCreate(
            ['txn_ref' => $vnp_TxnRef],
            [
                'amount' => $vnp_Amount / 100,
                'response_code' => $vnp_ResponseCode,
                'order_info' => $vnp_OrderInfo,
            ]
        );

        return response()->json(['status' => 'success']);
    }
}



