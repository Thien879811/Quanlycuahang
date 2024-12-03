<?php

namespace App\Http\Controllers;

use App\Models\Catalory;
use Illuminate\Http\Request;

class CataloryController extends Controller
{
    public function create(Request $request){
        $catalory = Catalory::create([
            'catalogy_name' => $request->catalogy_name,
        ]);
        return response()->json($catalory);
    }

    public function getCatalory(Request $request){
        $cat = Catalory::all();
        return response()->json(
            $cat
        );
    }

    public function update(Request $request, $id){
        $catalory = Catalory::find($id);
        $catalory->update($request->all());
        return response()->json($catalory);
    }

    public function delete($id){
        $catalory = Catalory::find($id);
        $catalory->delete();
        return response()->json(['message' => 'Catalory deleted successfully']);
    }
}
