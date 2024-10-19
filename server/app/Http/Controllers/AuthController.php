<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

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
}
