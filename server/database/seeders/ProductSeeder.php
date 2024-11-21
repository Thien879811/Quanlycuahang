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
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/sting-dau.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Sting Vàng chai 330ml',
            'barcode' => '8934588173073',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/1725687730.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Pepsi chai 390ml',
            'barcode' => '8934588063001',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/pepsi-chai.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Pepsi lon 330ml',
            'barcode' => '8934588012112',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/pepsi-lon.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mirinda cam lon 330ml',
            'barcode' => '8934588882111',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/mirinda-lon.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mirinda xá xị chai 390ml',
            'barcode' => '8934588133138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/xaxi-chai.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Ô long Tea+ 455ml',
            'barcode' => '8934588873058',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/olong.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Coca chai 390ml',
            'barcode' => '8934588063002',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/coca.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Coca lon 330ml',
            'barcode' => '8935049501503',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/coca-lon.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Fanta cam 600ml',
            'barcode' => '1063023000008',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/fanta-cam-600ml.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Fanta cam lon 330ml',
            'barcode' => '8935049510222',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 1,
            'image' => '/images/fanta-lon-330.jpg',
            'purchase_price' => 7000,
        ]);

        //Mi an lien

        Product::create([
            'product_name' => 'Mì ly Hảo Hảo Handy',
            'barcode' => '8934563651138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/hao-hao-ly.png',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì ly Modern lẩu thái tôm',
            'barcode' => '8934563619138',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/modern-tom.png',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì ly Modern riêu cua',
            'barcode' => '5931046638139',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/modern-cua.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì Omachi trộn xốt tôm phomai trứng muối 105gr',
            'barcode' => '8936136160825',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 18000,
            'catalogy_id' => 2,
            'image' => '/images/omachi-xot.jpg',
            'purchase_price' => 13000,
        ]);
        Product::create([
            'product_name' => 'Mì Omachi Special Xốt Bò Hầm 92G',
            'barcode' => '8936136164892',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/omachi-bo.jpg',
            'purchase_price' => 5000,
        ]);
        Product::create([
            'product_name' => 'Mì Ly Handy Hảo Hảo Tomyum 67gr',
            'barcode' => '8934563653132',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/hao-hao-tomyum.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Phở trộn Cung Đình Kool bò xốt tương đen 80g',
            'barcode' => '8936010681361',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 18000,
            'catalogy_id' => 2,
            'image' => '/images/pho-tron.jpg',
            'purchase_price' => 12000,
        ]);
        Product::create([
            'product_name' => 'Mì SHIN 68g ly',
            'barcode' => '031146270606',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 14000,
            'catalogy_id' => 2,
            'image' => '/images/mi-shin.jpg',
            'purchase_price' => 9000,
        ]);
        Product::create([
            'product_name' => 'Mì Mini Doremon Hải Sản Chua Ngọt Acecook Ly 53G',
            'barcode' => '8934563680114',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 12000,
            'catalogy_id' => 2,
            'image' => '/images/mi-meo-hs.jpg',
            'purchase_price' => 7000,
        ]);
        Product::create([
            'product_name' => 'Mì Tô Nhớ Mãi Mãi Miến Sườn Heo',
            'barcode' => '8934563347130',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 16000,
            'catalogy_id' => 2,
            'image' => '/images/nho-mai.jpg',
            'purchase_price' => 10000,
        ]);


        //Snack 

        Product::create([
            'product_name' => 'Snack Poca Bánh Phồng Tôm Gói 29g',
            'barcode' => '8936079120337',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/poca-tom.jpg',
            'purchase_price' => 3000,
        ]);

        Product::create([
            'product_name' => 'Bánh Snack Poca Bò Lúc Lắc 60g',
            'barcode' => '8936079122249',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 10000,
            'catalogy_id' => 3,
            'image' => '/images/poca-bo-ll.jpg',
            'purchase_price' => 6000,
        ]);
        Product::create([
            'product_name' => 'Poca vị Gà quay da giòn 37g',
            'barcode' => '8936079120030',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/poca-ga.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Poca vị Mực lăn muối ớt 37g',
            'barcode' => '8936079120252',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/poca-muc.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Bắp Ngọt Oishi 32G',
            'barcode' => '8934803043075',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-bap.jpeg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack cà chua 40g Oishi',
            'barcode' => '8934803044638',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-cachua.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Hành Oishi Orion Rings 32G',
            'barcode' => '8934803043785',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-hanh.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Oishi Bánh Phồng Mực 32G',
            'barcode' => '8934803043815',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-muc.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Tôm Oishi Cay Đặc Biệt 40g',
            'barcode' => '8934803044270',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-cay.jpg',
            'purchase_price' => 3000,
        ]);
        Product::create([
            'product_name' => 'Snack Oishi Phô Mát Miếng 40g',
            'barcode' => '8934803043129',    
            'production_date' => '2024-01-01',
            'expiration_date' => '2024-01-01',
            'quantity' => 0,
            'selling_price' => 6000,
            'catalogy_id' => 3,
            'image' => '/images/oishi-phomat.jpg',
            'purchase_price' => 3000,
        ]);
    }


}
