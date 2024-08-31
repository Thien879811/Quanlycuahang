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
        // $this->vnpayUrl = env('VNPAY_URL');
        // $this->returnUrl = env('VNPAY_RETURN_URL');
        // $this->notifyUrl = env('VNPAY_NOTIFY_URL');
        // $this->merchantCode = env('VNPAY_MERCHANT_CODE');
        // $this->secretKey = env('VNPAY_SECRET_KEY');
        $this->vnpayUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        $this->returnUrl ='http://localhost:3001/vnpay/return';
        $this->notifyUrl = 'http://127.0.0.1:8000/api/vnpay/notify';
        $this->merchantCode = 'OCKOQ6D2';
        $this->secretKey = 'CF3IWDIV06K0RTHOVBD25OXQKS4JSL5M';


// VNPAY_MERCHANT_CODE=OCKOQ6D2
// VNPAY_SECRET_KEY= EQGMWQ0FCL50HTQTG2CS7B9MTI95IU21
// VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
// VNPAY_RETURN_URL=http://127.0.0.1:8000/api/vnpay/return
// VNPAY_NOTIFY_URL=http://127.0.0.1:8000/api/vnpay/notify
    }

    public function pay(Request $request)
    {
        // $orderId = uniqid('5'); // Generate a unique order ID
        // $amount = $request->input('amount'); // Amount in VND
        // $orderInfo = 'Thanh toán';
        // $locale = 'vn'; // or 'en'

        // $vnp_Params = [
        //     "vnp_Version" => "2.0.0",
        //     "vnp_TmnCode" => $this->merchantCode,
        //     "vnp_Amount" => $amount * 100, // Convert amount to integer VND
        //     "vnp_Command" => "pay",
        //     "vnp_CreateDate" => date('YmdHis'),
        //     "vnp_CurrCode" => "VND",
        //     "vnp_OrderInfo" => $orderInfo,
        //     "vnp_OrderType" => "other",
        //     "vnp_ReturnUrl" => $this->returnUrl,
        //     "vnp_TxnRef" => date("YmdHis"),
        //     "vnp_Locale" => $locale,
        //     "vnp_BankCode"=>"VNPAYQR"
        // ];

        // ksort($vnp_Params); // Sort parameters by key
        // $query = http_build_query($vnp_Params);
        // $vnp_SecureHash = hash_hmac('sha512', $query, $this->secretKey); // Generate secure hash

        // $vnp_Params['vnp_SecureHash'] = $vnp_SecureHash;
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:3001/vnpay/return";
        $vnp_TmnCode = "OCKOQ6D2";//Mã website tại VNPAY 
        $vnp_HashSecret = "EQGMWQ0FCL50HTQTG2CS7B9MTI95IU21"; //Chuỗi bí mật
        
        $vnp_TxnRef = random_int(1,99999); //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        $vnp_OrderInfo = 'Thanh toan';
        $vnp_OrderType = 'billpayment';//'billpayment'
        $vnp_Amount = 100000 * 100;
        $vnp_Locale = 'vn' ;
        $vnp_BankCode = 'VNPAYQR';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
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
       
        
        $vnp_Url = $vnp_Url . "?" . $query;

        $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//  
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        // Log the URL for debugging
        Log::info('Generated VNPay URL:', ['url' =>  $vnp_Url]);

        return response()->json(['url' =>  $vnp_Url]);
    }


    public function return(Request $request)
    {
        $vnp_ResponseCode = $request->input('vnp_ResponseCode');
        $vnp_TxnRef = $request->input('vnp_TxnRef');
        $vnp_Amount = $request->input('vnp_Amount');
        $vnp_OrderInfo = $request->input('vnp_OrderInfo');

        // Save payment information to the database
        // Payment::create([
        //     'txn_ref' => $vnp_TxnRef,
        //     'amount' => $vnp_Amount / 100,
        //     'response_code' => $vnp_ResponseCode,
        //     'order_info' => $vnp_OrderInfo,
        // ]);

        return view('payment.return', compact('vnp_ResponseCode', 'vnp_TxnRef', 'vnp_Amount','vnp_OrderInfo'));
    }

    public function notify(Request $request)
    {
        // Handle VNPay notification here
        $vnp_ResponseCode = $request->input('vnp_ResponseCode');
        $vnp_TxnRef = $request->input('vnp_TxnRef');
        $vnp_Amount = $request->input('vnp_Amount');
        $vnp_OrderInfo = $request->input('vnp_OrderInfo');

        // Update payment status or perform other actions
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
