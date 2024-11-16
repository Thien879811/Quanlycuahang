<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        
        if(!Auth::attempt($data)){
            return response([
                'message' => 'Email or password are wrong'
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('main',['*'],now()->addHours(24))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }


    public function register(RegisterRequest $request ,Response $res)
    {
        $data = $request->validated();
      
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main',['*'],now()->addHours(24))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logout successfully'
            ]);
        }

        return response('', 204);
    }

    public function checkLoginStatus(Request $request)
    {
        $user = $request->user();

        $status = $user->currentAccessToken()->delete();
        if($status) {
            return response()->json([
                'logged_in' => true,
                'user' => $user
            ]);
        }

        return response()->json([
            'logged_in' => false
        ]);
    }

    public function getCurrentUser(Request $request)
    {
        $token = $request->bearerToken();

        $user = User::whereHas('tokens', function ($query) use ($token) {
            $query->where('token', hash('sha256', $token));
        })->first();

        return response()->json([
            'valid' => $user ? true : false,
            'user' => $user
        ]);
    }   

    public function verifyToken(Request $request)
    {
        $token = $request->input('token');
        $user = User::whereHas('tokens', function ($query) use ($token) {
            $query->where('token', hash('sha256', $token));
        })->first();
        
        return response()->json([
            'valid' => $user ? true : false,
            'user' => $user
        ]);
    }
    
    public function loginCustomer(Request $request)
    {
        $data = $request->all();
        $customer = Customer::where('phone', $data['phone'])->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Không tìm thấy khách hàng',
                'status' => 404
            ], 404);
        }

        if (!$customer->password && !$data['password']) {
            return response()->json([
                'message' => 'Vui lòng tạo mật khẩu',
                'requires_password' => true,
                'status' => 403,
                'data' => [
                    'requires_password' => true,
                    'message' => 'Vui lòng tạo mật khẩu'
                ]
            ], 403);
        }

        if (!$customer->password && $data['password']) {
            $customer->password = bcrypt($data['password']);
            $customer->save();
            return response()->json([
                'customer' => $customer,
                'message' => 'Tạo mật khẩu thành công'
            ]);
        }

        if ($customer->password && !$data['password']) {
            return response()->json([
                'message' => 'Vui lòng nhập mật khẩu',
                'requires_password' => true,
                'status' => 403,
                'data' => [
                    'requires_password' => true,
                    'message' => 'Vui lòng nhập mật khẩu'
                ]
            ], 403);
        }

        if ($customer->password && !Hash::check($data['password'], $customer->password)) {
            return response()->json([
                'message' => 'Mật khẩu không đúng',
                'status' => 401,
                'data' => [
                    'message' => 'Mật khẩu không đúng'
                ]
            ], 401);
        }


        return response()->json([
            'customer' => $customer,
            'message' => 'Đăng nhập thành công'
        ]);
    }

    public function registerCustomer(Request $request)
    {
        $data = $request->validate([
            'phone' => 'required',
            'name' => 'required|string', 
            'password' => 'required|min:6',
        ]);

        // Kiểm tra số điện thoại đã tồn tại chưa
        $existingCustomer = Customer::where('phone', $data['phone'])->first();
        if ($existingCustomer) {
            return response()->json([
                'success' => false,
                'message' => 'Số điện thoại đã được đăng ký'
            ], 400);
        }

        $data['password'] = bcrypt($data['password']);
        
        $customer = Customer::create([
            'phone' => $data['phone'],
            'name' => $data['name'],
            'password' => $data['password'],
            'diem' => 0,
        ]);
        
        return response()->json([
            'customer' => $customer,
            'success' => true,
            'message' => 'Đăng ký thành công'
        ], 201);
    }
}
