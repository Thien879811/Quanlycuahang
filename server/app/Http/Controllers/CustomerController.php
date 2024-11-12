<?php

namespace App\Http\Controllers;

use App\Models\customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function get($id){
        $customer = Customer::find($id)->first();
        return response()->json($customer);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'diem' => 'required',
        ]);
        $customer = Customer::find($id);
        $customer->diem = $customer->diem + $validated['diem'];
        $customer->save();
        return response()->json($customer);
    }

    public function getOne($phone){

        $customer = Customer::where("phone",$phone)->first();

        if($customer){
            return response()->json($customer);
        }

        return response()->json(['error' => 'Không tìm thấy khách hàng']);
    }

    public function create(Request $request){
        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'diem' => 'required',
        ]);
        $customer = Customer::create($validated);
        return response()->json($customer);
    }
}
