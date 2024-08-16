const express = require("express");
const product = require("../controller/productController");
const multer = require('multer');
const upload = multer({ dest: 'backend/app/uploads/' });

const router = express.Router();

router.route("/")
    .get(product.getProduct)
    .post(product.create)


module.exports = router;