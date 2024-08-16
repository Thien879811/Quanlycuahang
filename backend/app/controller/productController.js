const products = require("../models/productModel");
const multer = require('multer');
const path = require('path'); // Thêm thư viện path để xử lý đường dẫn



exports.getProduct = (req, res) =>{
    res.send({message : "create handler"});
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/app/uploads/');
  },
  filename: (req, file, cb) => {
    // Tạo tên file dựa trên ID sản phẩm và tên gốc của file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.body.productId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});



exports.create = async (req, res) => {
    console.log(req.body)
    // try {
    //     // Kiểm tra dữ liệu đầu vào
    //     if (!req.body) {
    //     return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    //     }

    //     // Lưu thông tin sản phẩm
    //     const product = await products.create(req.body);

    // //   const upload = multer({ storage: storage });

    //     // Lưu ảnh
    //     const image = req.file;
    //     // Cập nhật đường dẫn ảnh trong đối tượng product
    //     product.hinhanh = image.filename;
    //     console.log(image.filename)
    //     await product.save();

    //     res.status(201).json(product);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Lỗi khi tạo sản phẩm' });
    // }
}