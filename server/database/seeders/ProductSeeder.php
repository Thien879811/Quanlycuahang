<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Product::create([
            'product_name' => 'Sting Dâu chai 330ml'  ,
            'barcode' => '8934588233074',
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/sting-dau.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Sting Vàng chai 330ml',
            'barcode' => '8934588173073',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/1725687730.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Pepsi chai 390ml',
            'barcode' => '8934588063001',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/pepsi-chai.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Pepsi lon 330ml',
            'barcode' => '8934588012112',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/pepsi-lon.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mirinda cam lon 330ml',
            'barcode' => '8934588882111',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/mirinda-lon.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mirinda xá xị chai 390ml',
            'barcode' => '8934588133138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/xaxi-chai.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Ô long Tea+ 455ml',
            'barcode' => '8934588873058',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/olong.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Coca chai 390ml',
            'barcode' => '8934588063002',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/coca.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Coca lon 330ml',
            'barcode' => '8935049501503',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/coca-lon.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Fanta cam 600ml',
            'barcode' => '1063023000008',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/fanta-cam-600ml.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Fanta cam lon 330ml',
            'barcode' => '8935049510222',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/fanta-lon-330.jpg',
            'factory_id' => 1,
            'purchase_price' => 7000,
        ]);

        //Mi an lien

        Product::create([
            'product_name' => 'Mì ly Hảo Hảo Handy',
            'barcode' => '8934563651138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/hao-hao-ly.png',
            'factory_id' => 2,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì ly Modern lẩu thái tôm',
            'barcode' => '8934563619138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/modern-tom.png',
            'factory_id' => 2,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì ly Modern riêu cua',
            'barcode' => '5931046638139',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/modern-cua.jpg',
            'factory_id' => 2,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì Omachi trộn xốt tôm phomai trứng muối 105gr',
            'barcode' => '8936136160825',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 18000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/omachi-xot.jpg',
            'factory_id' => 2,
            'purchase_price' => 13000,
        ]);
        Product::create([
            'product_name' => 'Mì Omachi Special Xốt Bò Hầm 92G',
            'barcode' => '8936136164892',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/omachi-bo.jpg',
            'factory_id' => 2,
            'purchase_price' => 5000,
        ]);
        Product::create([
            'product_name' => 'Mì Ly Handy Hảo Hảo Tomyum 67gr',
            'barcode' => '8934563653132',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/hao-hao-tomyum.jpg',
            'factory_id' => 2,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Phở trộn Cung Đình Kool bò xốt tương đen 80g',
            'barcode' => '8936010681361',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 18000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/pho-tron.jpg',
            'factory_id' => 2,
            'purchase_price' => 12000,
        ]);
        Product::create([
            'product_name' => 'Mì SHIN 68g ly',
            'barcode' => '031146270606',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 14000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/mi-shin.jpg',
            'factory_id' => 2,
            'purchase_price' => 9000,
        ]);
        Product::create([
            'product_name' => 'Mì Mini Doremon Hải Sản Chua Ngọt Acecook Ly 53G',
            'barcode' => '8934563680114',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 12000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/mi-meo-hs.jpg',
            'factory_id' => 2,
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì Tô Nhớ Mãi Mãi Miến Sườn Heo',
            'barcode' => '8934563347130',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 16000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/nho-mai.jpg',
            'factory_id' => 2,
            'purchase_price' => 10000,
        ]);


        //Snack 

        Product::create([
            'product_name' => 'Snack Poca Bánh Phồng Tôm Gói 29g',
            'barcode' => '8936079120337',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/poca-tom.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);

        Product::create([
            'product_name' => 'Bánh Snack Poca Bò Lúc Lắc 60g',
            'barcode' => '8936079122249',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/poca-bo-ll.jpg',
            'factory_id' => 3,
            'purchase_price' => 6000,
        ]);
        Product::create([
            'product_name' => 'Poca vị Gà quay da giòn 37g',
            'barcode' => '8936079120030',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/poca-ga.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Poca vị Mực lăn muối ớt 37g',
            'barcode' => '8936079120252',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/poca-muc.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Bắp Ngọt Oishi 32G',
            'barcode' => '8934803043075',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-bap.jpeg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack cà chua 40g Oishi',
            'barcode' => '8934803044638',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-cachua.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Hành Oishi Orion Rings 32G',
            'barcode' => '8934803043785',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-hanh.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Oishi Bánh Phồng Mực 32G',
            'barcode' => '8934803043815',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-muc.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Tôm Oishi Cay Đặc Biệt 40g',
            'barcode' => '8934803044270',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-cay.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Oishi Phô Mát Miếng 40g',
            'barcode' => '8934803043129',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 100,
            'selling_price' => 6000,
            'catalogy_id' => 1,
            'image' => 'http://127.0.0.1:8000/images/oishi-phomat.jpg',
            'factory_id' => 3,
            'purchase_price' => 3000,
        ]);
    }


}
