import React, { useState,useEffect } from 'react';
import contactService from '../services/contact.service';
import productService from '../services/product.service';
import BasicSelect from './Select';
import useCatalogs from '../utils/catalogUtils';
import useFactory from '../utils/factoryUtils';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';


const ProductForm =  () => {

  const [productName, setProductName] = useState('');
  const [ngaysx, setNgaySx] = useState('');
  const [hsd, setHsd] = useState('');
  const [image, setImage] = useState(null);
  const [soluong, setSoLuong] = useState('');
  const [gianhap, setGiaNhap] = useState('');
  const [giaban, setGiaBan] = useState('');
  const [barcode, setBarCode] = useState('');
  const [factoryID, setFactoryID] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const [catalogID, setCatalogID] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const { options, loading, error: catalogError } = useCatalogs();
  const { f_options, f_loading, error: f_Error } = useFactory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!productName || !ngaysx || !hsd || !soluong || !gianhap || !giaban || !image || !catalogID) {
      setError('Please fill in all fields.');
      return;
    }
    
    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('barcode', barcode);
    formData.append('production_date', ngaysx);
    formData.append('expiration_date', hsd);
    formData.append('quantity', soluong);
    formData.append('selling_price', gianhap);
    formData.append('purchase_price', giaban);
    formData.append('catalogy_id', catalogID);
    formData.append('image', image);
    formData.append('factory_id', factoryID);
    
    console.log(formData)
    try {
      const response = await productService.create(formData);
      
      window.location      
    }catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred');
      setSuccess(null);

      console.log(error)
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Set image preview URL
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <label>
        Danh Mục:
        <BasicSelect 
          value={catalogID} 
          onValue={(value) => setCatalogID(value)}   
          options={options}/>
      </label> 
      <label>
      <Box>
        Nhà cung cấp:
        <BasicSelect 
          value={factoryID} 
          onValue={(value) => setFactoryID(value)}   
          options={f_options}/>
          
            <Fab color="primary" aria-label="add">
              <AddIcon />
            </Fab>
      </Box>
      </label>

     <label>
        Tên sản phẩm:
        <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
      </label>
      <label>
        Ngày sản xuất:
        <input type="date" value={ngaysx} onChange={(event) => setNgaySx(event.target.value)} />
      </label>

      <label>
        Hạn sử dụng:
        <input type="date" value={hsd} onChange={(event) => setHsd(event.target.value)} />
      </label>

      <label>
        Số lượng:
        <input type="number" value={soluong} onChange={(event) => setSoLuong(event.target.value)} />
      </label>

      <label>
        Giá mua vào:
        <input type="number" value={gianhap} onChange={(event) => setGiaNhap(event.target.value)} />
      </label>

      <label>
        Giá bán ra:
        <input type="number" value={giaban} onChange={(event) => setGiaBan(event.target.value)} />
      </label>

      <label>
        Mã Vạch Sản Phẩm:
        <input type="number" value={barcode} onChange={(event) => setBarCode(event.target.value)} />
      </label>



      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <label>
        Hình ảnh sản phẩm:
        <input type="file" onChange={handleImageChange} />
      </label>

      <button type="submit">Thêm sản phẩm</button>

      

    </form>   


  );
};

export default ProductForm;
