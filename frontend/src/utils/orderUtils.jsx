import { useState, useEffect } from 'react';
import useOrderProduct from './orderproduct';
import orderService from '../services/order.service';
import useEmployee from './userUtils';
import { handleResponse } from '../functions/index';

// import useCustomer from './customerUtils';
// Hàm tạo đơn hàng
const createOrder = (products, nhanvien, khachhang, pays_id, voucher_code, discount) => {
    return {
        products,
        pays_id,
        nhanvien,
        khachhang,
        voucher_code,
        discount
    };
};

const useOrder = () => {
    const { 
        orderProducts,
        getTotalAmount,
        getTotalQuantity,
        clearOrderProduct,
     } = useOrderProduct();
     
    const [pays_id, setPays_id] = useState('1');
    const [employee, setEmployee] = useState();
    const [nhanvien, setNhanvien] = useState(() => {
        if (employee) {
            return employee.id;
        } else {
            return '1';
        }
    });
    const customer = JSON.parse(localStorage.getItem('customer'));
    const [khachhang, setKhachhang] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        if (localStorage.getItem('employee')) {
            setEmployee(JSON.parse(localStorage.getItem('employee')));
        }
    }, []);

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
            const orderDetails = createOrder(orderProducts, nhanvien, khachhang, pays_id, voucherCode, discount);
            const response = await orderService.create(orderDetails);
            const data = handleResponse(response);
            localStorage.setItem('order_id', data.id);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Lỗi khi tạo đơn hàng:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (order_id, status, pays_id) => {
        if (status === -1) {
            await orderService.cancelOrder(order_id);
            return;
        }
        try {
            const response = await orderService.update(order_id, { status, pays_id });
            return handleResponse(response);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const clearOrder = () => {
        localStorage.removeItem('order_id');
        setKhachhang('0');
        clearOrderProduct();
    };

    const handleCreateOrder = async () => {
        if (orderProducts.length > 0) {
            return await createAndSendOrder();
        }
        return null;
    };

    const updateVoucherDiscount = async (voucherCode, discountPercentage) => {
        setVoucherCode(voucherCode);
        setDiscount(discountPercentage);    
        try {
            const order_id = localStorage.getItem('order_id');
            await orderService.updateVoucher(order_id, { voucher_code: voucherCode, discount: discountPercentage });
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        orderProducts,
        nhanvien,
        setNhanvien,
        khachhang,
        setKhachhang,
        loading,
        error,
        handleCreateOrder,
        updateOrder,
        clearOrder,
        createAndSendOrder,
        updateVoucherDiscount,
        setVoucherCode,
        voucherCode,
        setDiscount,
        discount
    };
};

export default useOrder;
