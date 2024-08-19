const { log } = require("console");
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
    const upload = multer({ storage: storage });
    console.log(upload)
}