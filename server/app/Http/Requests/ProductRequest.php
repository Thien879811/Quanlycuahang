<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,gif|max:2048',
            'barcode' => 'required|string',
            'catalogy_id' => 'required|integer',
            'product_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'production_date' => 'required|date',
            'expiration_date' => 'required|date',
            'factory_id' => 'required|integer',
            'selling_price' => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'image.required' => 'Vui lòng chọn hình ảnh.',
            'image.image' => 'Hình ảnh phải là một tệp ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpeg, png, gif.',
            'image.max' => 'Hình ảnh không được lớn hơn 2MB.',

            'barcode.required' => 'Vui lòng nhập mã vạch.',
            'barcode.string' => 'Mã vạch phải là một chuỗi.',

            'catalogy_id.required' => 'Vui lòng chọn danh mục.',
            'catalogy_id.integer' => 'Danh mục phải là một số nguyên.',

            'product_name.required' => 'Vui lòng nhập tên sản phẩm.',
            'product_name.string' => 'Tên sản phẩm phải là một chuỗi.',
            'product_name.max' => 'Tên sản phẩm không được dài hơn 255 ký tự.',

            'selling_price.required' => 'Vui lòng nhập giá.',
            'selling_price.numeric' => 'Giá phải là một số.',
            'selling_price.min' => 'Giá phải lớn hơn 0.',

            'purchase_price.required' => 'Vui lòng nhập giá mua.',
            'purchase_price.numeric' => 'Giá mua phải là một số.',
            'purchase_price.min' => 'Giá mua phải lớn hơn 0.',

            'quantity.required' => 'Vui lòng nhập số lượng.',
            'quantity.integer' => 'Số lượng phải là một số nguyên.',
            'quantity.min' => 'Số lượng phải lớn hơn 0.',

            'production_date.required' => 'Vui lòng nhập ngày sản xuất.',
            'production_date.date' => 'Ngày sản xuất phải là một ngày.',

            'expiration_date.required' => 'Vui lòng nhập ngày hết hạng.',
            'expiration_date.date' => 'Ngày hết hạng phải là một ngày.',

            'factory_id.required' => 'Vui lòng chọn nhà sản xuất.',
            'factory_id.integer' => 'Nhà sản xuất phải là một số nguyên.',
        ];
    }
}
