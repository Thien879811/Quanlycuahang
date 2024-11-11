import { useState, useEffect, useMemo, useCallback } from 'react';
import orderService from '../services/order.service';
import { handleResponse } from '../functions/index';
import useCustomer from './customerUtils';

const orderUtils = () => {
    const [order_id, setOrder_id] = useState(null);
    const [orders, setOrders] = useState({details: []});
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    const {customer} = useCustomer();

    const getTotalAmount = useMemo(() => {
        if (!orders?.details) return 0;
        return orders.details.reduce((total, detail) => {
            return total + (detail.soluong * detail.dongia);
        }, 0);
    }, [orders?.details]);

    const getTotalQuantity = useMemo(() => {
        if (!orders?.details) return 0;
        return orders.details.reduce((total, detail) => {
            return total + detail.soluong;
        }, 0);
    }, [orders?.details]);

    const getTotalDiscount = useMemo(() => {
        if (!orders?.details) return 0;
        return orders.details.reduce((total, detail) => {
            return total + detail.discount;
        }, 0);
    }, [orders?.details]);

    const getOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await orderService.get();
            const data = handleResponse(response);
            setOrders(data);
            localStorage.setItem('order_id', data.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const savedOrderId = localStorage.getItem('order_id');
        if (savedOrderId) {
            setOrder_id(savedOrderId);
        }
        getOrders();
    }, [getOrders]);

    useEffect(() => {
        if(customer?.id) {
            updateCustomer(customer.id);
        }
    }, [customer]);

    const updateOrderProducts = useCallback(async (order_id, data) => {
        try {
            setLoading(true);
            const response = await orderService.updateOrderProducts(order_id, data);
            const responseData = handleResponse(response);
            await getOrders();
            return responseData;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getOrders]);

    const updateProductQuantity = useCallback(async (order_id, product_id, quantity) => {
        try {
            setLoading(true);
            if (!orders) throw new Error('Order not found');

            const existingProduct = orders.details.find(detail => detail.product_id === product_id);
            
            let updatedProducts;
            if (existingProduct) {
                const newQuantity = existingProduct.soluong + quantity;
                if (newQuantity <= 0) {
                    // Remove product if quantity becomes 0 or negative
                    updatedProducts = orders.details
                        .filter(detail => detail.product_id !== product_id)
                        .map(detail => ({
                            order_id: detail.order_id,
                            product_id: detail.product_id,
                            soluong: detail.soluong,
                            dongia: detail.dongia,
                            discount: detail.discount
                        }));
                } else {
                    // Update quantity if greater than 0
                    updatedProducts = orders.details.map(detail => ({
                        order_id: detail.order_id,
                        product_id: detail.product_id,
                        soluong: detail.product_id === product_id ? newQuantity : detail.soluong,
                        dongia: detail.dongia,
                        discount: detail.discount
                    }));
                }
            } else {
                // Add new product if quantity is positive
                if (quantity > 0) {
                    updatedProducts = [
                        ...orders.details.map(detail => ({
                            order_id: detail.order_id,
                            product_id: detail.product_id,
                            soluong: detail.soluong,
                            dongia: detail.dongia,
                            discount: detail.discount
                        })),
                        {
                            order_id,
                            product_id,
                            soluong: quantity,
                            dongia: 0,
                            discount: 0
                        }
                    ];
                } else {
                    updatedProducts = orders.details.map(detail => ({
                        order_id: detail.order_id,
                        product_id: detail.product_id,
                        soluong: detail.soluong,
                        dongia: detail.dongia,
                        discount: detail.discount
                    }));
                }
            }

            const data = {
                details: updatedProducts,
                customer_id: orders.customer_id || null,
                staff_id: orders.staff_id || 1,
                status: orders.status || 0,
                pays_id: orders.pays_id || 1,
                voucher_code: orders.voucher_code || null,
                discount: orders.discount || 0
            };

            return await updateOrderProducts(order_id, data);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [orders, updateOrderProducts]);

   

   const removeProduct = useCallback(async (order_id, product_id) => {
        try {
            setLoading(true);
            if (!orders) throw new Error('Order not found');

            const updatedProducts = orders.details
                .filter(detail => detail.product_id !== product_id)
                .map(detail => ({
                    order_id: detail.order_id,
                    product_id: detail.product_id,
                    soluong: detail.soluong,
                    dongia: detail.dongia,
                    discount: detail.discount
                }));

            const data = {
                details: updatedProducts,
                customer_id: orders.customer_id || null,
                staff_id: orders.staff_id || 1,
                status: orders.status || 0,
                pays_id: orders.pays_id || 1,
                voucher_code: orders.voucher_code || null,
                discount: orders.discount || 0
            };

            return await updateOrderProducts(order_id, data);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [orders, updateOrderProducts]);

    const addProduct = useCallback(async (order_id, product_id, quantity, price) => {
        try {
            setLoading(true);
            if (!orders) throw new Error('Order not found');

            const existingProduct = orders.details.find(detail => detail.product_id === product_id);
            const updatedProducts = existingProduct
                ? orders.details.map(detail => ({
                    order_id: detail.order_id,
                    product_id: detail.product_id,
                    soluong: detail.product_id === product_id ? detail.soluong + quantity : detail.soluong,
                    dongia: detail.product_id === product_id ? price : detail.dongia,
                    discount: detail.discount,
                }))
                : [
                    ...orders.details.map(detail => ({
                        order_id: detail.order_id,
                        product_id: detail.product_id,
                        soluong: detail.soluong,
                        dongia: detail.dongia,
                        discount: detail.discount
                    })),
                    {
                        order_id,
                        product_id,
                        soluong: quantity,
                        dongia: price,
                        discount: 0
                    }
                ];

            const data = {
                details: updatedProducts,
                customer_id: orders.customer_id || null,
                staff_id: orders.staff_id || 1,
                status: orders.status || 0,
                pays_id: orders.pays_id || 1,
                voucher_code: orders.voucher_code || null,
                discount: orders.discount || 0
            };

            return await updateOrderProducts(order_id, data);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [orders, updateOrderProducts]);

    const updateVoucherDiscount = useCallback(async (voucher_code, discount_percentage) => {
        try {
            setLoading(true);
            if (!orders) throw new Error('Order not found');

            const data = {
                ...orders,
                voucher_code,
                discount: discount_percentage
            };

            return await updateOrderProducts(orders.id, data);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [orders, updateOrderProducts]);

    const updateCustomer = useCallback(async (customer_id) => {
        try {
            setLoading(true);
            if (!orders) throw new Error('Order not found');
         
            const data = {
                ...orders,
                customer_id
            };

            return await updateOrderProducts(orders.id, data);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [orders, updateOrderProducts]);

    return {
        order_id,
        orders,
        loading,
        error,
        getOrders,
        updateOrderProducts,
        updateProductQuantity,
        removeProduct,
        addProduct,
        updateVoucherDiscount,
        updateCustomer,
        getTotalAmount,
        getTotalQuantity,
        getTotalDiscount
    };
}

export default orderUtils;
