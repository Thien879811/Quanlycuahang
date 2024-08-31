// import { useState, useEffect } from 'react';

// const useOrder = () => {
//   const [products, setProducts] = useState([]);
//   const [ngaytao, setNgaytao] = useState(true);
//   const [nhanvien, setNhanvien] = useState(null);
//   const [khachhang, setKhachhang] = useState(null);
//   const [tonghoadon, setTonghoadon] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Example effect to fetch data, adjust as needed
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Simulate fetching data
//         setLoading(true);
//         // Fetch data logic here
//         // setProducts(fetchedProducts);
//         // setNgaytao(fetchedNgaytao);
//         // setNhanvien(fetchedNhanvien);
//         // setKhachhang(fetchedKhachhang);
//         // setTonghoadon(fetchedTonghoadon);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { products, ngaytao, nhanvien, khachhang, tonghoadon, loading, error };
// };

// export default useOrder;


import { useState } from 'react';

// Hàm tạo đơn hàng mẫu (có thể được thay đổi tùy vào yêu cầu thực tế)
const createOrder = (products, ngaytao, nhanvien, khachhang, tonghoadon) => {
  return {
    products,
    ngaytao,
    nhanvien,
    khachhang,
    tonghoadon,
    createdAt: new Date().toISOString(),
  };
};

const useOrder = () => {
  const [products, setProducts] = useState([]);
  const [ngaytao, setNgaytao] = useState(true);
  const [nhanvien, setNhanvien] = useState(null);
  const [khachhang, setKhachhang] = useState(null);
  const [tonghoadon, setTonghoadon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tạo đơn hàng và lưu vào localStorage
  const saveOrderToLocalStorage = (orderDetails) => {
    localStorage.setItem('order', JSON.stringify(orderDetails));
  };

  // Xử lý thanh toán và gửi đơn hàng đến server
  const submitOrder = async () => {
    setLoading(true);
    try {
      // Tạo đơn hàng
      const orderDetails = createOrder(products, ngaytao, nhanvien, khachhang, tonghoadon);
      
      // Lưu đơn hàng vào localStorage
      saveOrderToLocalStorage(orderDetails);

      // Gửi đơn hàng đến server
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();
      // Xử lý thành công (có thể xóa đơn hàng từ localStorage nếu cần)
      localStorage.removeItem('order');
      console.log('Order submitted successfully:', result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, ngaytao, nhanvien, khachhang, tonghoadon, loading, error, submitOrder };
};

export default useOrder;

