<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    public function getAll()
    {
        $users = User::with('staff')->get();
        $users = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'age' => $user->staff ? $user->staff->age : null,
                'phone' => $user->staff ? $user->staff->phone : null,
                'gioitinh' => $user->staff ? $user->staff->gioitinh : null,
                'address' => $user->staff ? $user->staff->address : null,
                'position' => $user->staff ? $user->staff->position : null,
                'created_at' => $user->created_at,
            ];
        });
        return response()->json($users);
    }

    public function getUserById($id){
        $user = User::find($id);
        return response()->json($user);
    }

    public function createUser(Request $request){
        // Check if user with the given email already exists
        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser) {
            return response()->json(['error' => 'User with this email already exists']);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $staff = Staff::create([
            'names' => $request->name,
            'age' => $request->age,
            'address' => $request->address,
            'phone' => $request->phone,
            'gioitinh' => $request->gioitinh,
            'position' => $request->position,
            'salary' => $request->salary,
            'user_id' => $user->id
        ]);
        return response()->json(['user' => $user, 'staff' => $staff, 'message' => 'User created successfully']);
    }

    public function updateUser(Request $request, $id){
        $user = User::find($id);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);
        $staff = Staff::find($id);
        $staff->update([
            'names' => $request->name,
            'age' => $request->age,
            'address' => $request->address,
            'phone' => $request->phone,
            'gioitinh' => $request->gioitinh,
            'position' => $request->position,
        ]);
        return response()->json($user);
    }

    public function getStaffByUserId($id){
        $staff = Staff::where('user_id', $id)->get();
        return response()->json($staff);
    }

    public function deleteUser($id){
        $user = User::find($id);
        $user->delete();
        return response()->json($user);
    }
}
