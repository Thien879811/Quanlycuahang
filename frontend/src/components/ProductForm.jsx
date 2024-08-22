import React, { useState,useEffect } from 'react';
import contactService from '../services/contact.service';
import axios from 'axios';
import productService from '../services/product.service';
import Select from 'react-select'
import BasicSelect from './Select';
import cataloryService from '../services/catalory.service';
import useCatalogs from '../utils/catalogUtils';


const ProductForm =  () => {

  // const [productName, setProductName] = useState('');
  // const [ngaysx, setNgaySx] = useState('');
  // const [hsd, setHsd] = useState('');
  const [image, setImage] = useState(null);
  // const [soluong, setSoLuong] = useState('');
  // const [gianhap, setGiaNhap] = useState('');
  // const [giaban, setGiaBan] = useState('');
  // const [catalogID, setCatalogID] = useState('');
  // const [barcode, setBarCode] = useState('');

  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);


  const [catalogID, setCatalogID] = useState('');

  const { options, loading, error: catalogError } = useCatalogs();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // // Basic validation
    // if (!productName || !ngaysx || !hsd || !soluong || !gianhap || !giaban || !image || !catalogID) {
    //   setError('Please fill in all fields.');
    //   return;
    // }
    
    const formData = {
    // 'productName': productName,
    // 'ngaysx': ngaysx,
    // 'hsd': hsd,
    // 'soluong': soluong,
    // 'gianhap': gianhap,
    // 'giaban' : giaban,
    'image': image,
    // 'catalogID': catalogID,
    }
    console.log(formData)
    try {
      const response = await productService.create(formData);
      console.log(response)
      // Optionally reset form fields here
    }catch (error) {
      // setError(error.response?.data?.message || error.message || 'An error occurred');
      // setSuccess(null);

      console.log(error)
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* <label>
        Danh Mục:
        <BasicSelect 
          value={catalogID} 
          onValue={(value) => setCatalogID(value)}   
          options={options}/>
      </label> */}

      {/* <label>
        Tên sản phẩm:
        <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
      </label>

      <label>
        Danh Mục:
        <input type="text" value={catalogID} onChange={(event) => setCatalogID(event.target.value)} />
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
        <input type="number" value={giaban} onChange={(event) => setBarCode(event.target.value)} />
      </label>



      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>} */}

      <label>
        Hình ảnh sản phẩm:
        <input type="file" onChange={handleImageChange} />
      </label>

      <button type="submit">Thêm sản phẩm</button>

      <img
            src={`http:\/\/127.0.0.1:8000\/images\/1724330198.png`} // Update the URL as needed
            alt="Uploaded"
            style={{ maxWidth: '500px', maxHeight: '500px' }}
          />
    </form>

  );
};

export default ProductForm;
