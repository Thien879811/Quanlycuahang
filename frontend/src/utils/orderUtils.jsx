import { useState, useEffect } from 'react';
import useOrderProduct from './orderproduct';
import orderService from '../services/order.service';
import { debounce } from 'lodash';

// import useCustomer from './customerUtils';
// Hàm tạo đơn hàng
const createOrder = (products, nhanvien, khachhang, tonghoadon, pays_id) => {
    return {
        products,
        pays_id,
        nhanvien,
        khachhang,
        tonghoadon,
    };
};

const useOrder = () => {
    const { orderProducts,
      getTotalAmount,
      getTotalQuantity,
      clearOrderProduct,
     } = useOrderProduct();
    const [pays_id, setPays_id] = useState('1');
    const [nhanvien, setNhanvien] = useState('3');
    const customer = JSON.parse(localStorage.getItem('customer'));
    const [khachhang, setKhachhang] = useState('0');
    const [tonghoadon, setTonghoadon] = useState(getTotalAmount());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (customer && customer.id) {
            setKhachhang(customer.id);
        }
    }, [customer]);

    const createAndSendOrder = async () => {
        if (orderProducts.length === 0) {
            setError('Không có sản phẩm trong đơn hàng');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const orderDetails = createOrder(orderProducts, nhanvien, khachhang, tonghoadon, pays_id);
            console.log(orderDetails);

            const response = await orderService.create(orderDetails);
          
            const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
            const data = JSON.parse(cleanJsonString);

            localStorage.setItem('order_id', data.id);

        } catch (err) {
            setError(err.message);
            console.error('Lỗi khi tạo đơn hàng:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (order_id, status, pays_id) => {
        const response = await orderService.update(order_id, { status, pays_id });
    };
    
    const clearOrder = () => {
        localStorage.removeItem('order_id');
        setKhachhang('0');
        clearOrderProduct();
    };

    useEffect(() => {
        setTonghoadon(getTotalAmount());
    }, [orderProducts]);

    const handleCreateOrder = () => {
        if (orderProducts.length > 0) {
            createAndSendOrder();
        }
    };

    return {
        orderProducts,
        nhanvien,
        setNhanvien,
        khachhang,
        setKhachhang,
        tonghoadon,
        loading,
        error,
        handleCreateOrder,  // New function to trigger order creation
        updateOrder,
        clearOrder
    };
};

export default useOrder;
