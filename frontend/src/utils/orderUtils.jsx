import { useState, useEffect, useMemo, useCallback } from 'react';
import orderService from '../services/order.service';
import { handleResponse } from '../functions/index';
import useCustomer from './customerUtils';
import { Alert } from '@mui/material';
import { message } from 'antd';



const orderUtils = () => {
    const [orders, setOrders] = useState(() => {
        const savedOrder = localStorage.getItem('order');
        return savedOrder ? JSON.parse(savedOrder) : {
            staff_id: 1,
            customer_id: null,
            pays_id: 1,
            voucher_id: null,
            discount: 0,
            status: 0,
            details: [],
            max_value: 0,
            min_value: 0,
            voucher_code: null,
            discount_percentage: 0
        };
    });

    // Save to localStorage whenever orders changes
    useEffect(() => {
        localStorage.setItem('order', JSON.stringify(orders));
    }, [orders]);

    const getTotalAmount = useMemo(() => {
        if (!orders?.details) return 0;
        return orders.details.reduce((total, detail) => {
            return total + detail.soluong * detail.dongia;
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
            return total + (detail.discount || 0);
        }, 0);
    }, [orders?.details]);

    const recalculateVoucherDiscount = (newOrders) => {
        if (newOrders.voucher_code && newOrders.discount_percentage) {
            const totalAmount = newOrders.details.reduce((total, detail) => 
                total + detail.soluong * detail.dongia, 0
            );

            if (newOrders.min_value && totalAmount < parseFloat(newOrders.min_value)) {
                message.error(`Đơn hàng phải có giá trị tối thiểu ${newOrders.min_value.toLocaleString()}đ để sử dụng voucher này`);
                return {
                    ...newOrders,
                    voucher_id: null,
                    voucher_code: null,
                    discount: 0,
                    max_value: 0,
                    min_value: 0,
                    discount_percentage: 0
                };
            }

            let discountAmount = (totalAmount * newOrders.discount_percentage) / 100;

            if (newOrders.max_value && discountAmount > parseFloat(newOrders.max_value)) {
                discountAmount = parseFloat(newOrders.max_value);
            }

            return {
                ...newOrders,
                discount: discountAmount
            };
        }
        return newOrders;
    };

    const addProduct = (product) => {
        if(!orders.details) setOrders({details: []});
        setOrders(prevOrders => {
            const existingProduct = prevOrders.details.find(detail => detail.product_id === product.id);
            
            let newOrders;
            if (existingProduct) {
                newOrders = {
                    ...prevOrders,
                    details: prevOrders.details.map(detail => 
                        detail.product_id === product.id
                        ? {...detail, soluong: detail.soluong + 1}
                        : detail
                    )
                };
            } else {
                newOrders = {
                    ...prevOrders,
                    details: [
                        ...prevOrders.details,
                        {
                            product_id: product.id,
                            soluong: 1,
                            dongia: product.selling_price,
                            discount: 0,
                            product: {
                                product_name: product.product_name,
                                selling_price: product.selling_price,
                                image: product.image,
                            }
                        }
                    ]
                };
            }

            newOrders = recalculateVoucherDiscount(newOrders);
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }

    const removeProduct = (product_id) => {
        setOrders(prevOrders => {
            let newOrders = {
                ...prevOrders,
                details: prevOrders.details.filter(detail => detail.product_id !== product_id)
            };

            newOrders = recalculateVoucherDiscount(newOrders);
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }

    const updateQuantity = (product_id, quantity) => {
        setOrders(prevOrders => {
            const updatedDetails = prevOrders.details.map(detail => {
                if (detail.product_id === product_id) {
                    const newQuantity = detail.soluong + quantity;
                    if (newQuantity <= 0) {
                        return null; // Mark for removal
                    }
                    return { ...detail, soluong: newQuantity };
                }
                return detail;
            }).filter(detail => detail !== null); // Remove marked items

            let newOrders = {
                ...prevOrders,
                details: updatedDetails
            };

            newOrders = recalculateVoucherDiscount(newOrders);
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }
    
    const updateDiscount = useCallback((productCode, discount, present) => {
        setOrders(prevOrders => {
            const product = prevOrders.details.find(detail => detail.product_id == productCode);
            const updatedDetails = prevOrders.details.map(productPresent => {
                if (productPresent.product_id == present) {
                    if(productPresent.soluong > product.soluong){
                        return { ...productPresent, discount: productPresent.dongia * discount / 100 * product.soluong};
                    }
                    return { ...productPresent, discount: productPresent.dongia * discount / 100 * productPresent.soluong};
                }
                return productPresent;
            });

            let newOrders = {...prevOrders, details: updatedDetails};
            newOrders = recalculateVoucherDiscount(newOrders);
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }, []);

    const updateProductDiscount = useCallback((promotions) => {
        setOrders(prevOrders => {
            const updatedDetails = prevOrders.details.map(product => {
                const promotion = promotions.find(promo => 
                    promo.product_id === product.product_id &&
                    new Date(promo.start_date) <= new Date() &&
                    new Date(promo.end_date) >= new Date()
                );

                if (!promotion) {
                    return { ...product, discount: 0 };
                }

                if (promotion.quantity > 0) {
                    const timesQualified = Math.floor(product.soluong / promotion.quantity);
                    if (timesQualified > 0) {
                        const discountedQuantity = timesQualified * promotion.quantity;
                        return {
                            ...product,
                            discount: (product.dongia * promotion.discount_percentage / 100) * discountedQuantity
                        };
                    } else {
                        return { ...product, discount: 0 };
                    }
                }

                if (promotion.present) {
                    updateDiscount(promotion.product_id, promotion.discount_percentage, promotion.present.product_id);
                    return {
                        ...product,
                        discount: 0
                    };
                }

                return {
                    ...product,
                    discount: (product.dongia * promotion.discount_percentage / 100) * product.soluong
                };
            });

            let newOrders = {...prevOrders, details: updatedDetails};
            newOrders = recalculateVoucherDiscount(newOrders);
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }, [updateDiscount]);

    const updateVoucher = (voucher, discount) => {
        setOrders(prevOrders => {
            const totalAmount = getTotalAmount;

            if (voucher.min_value && totalAmount < parseFloat(voucher.min_value)) {
                message.error(`Đơn hàng phải có giá trị tối thiểu ${voucher.min_value.toLocaleString()}đ để sử dụng voucher này`);
                return prevOrders;
            }

            let discountAmount = (totalAmount * discount) / 100;

            if (voucher.max_value && discountAmount > parseFloat(voucher.max_value)) {
                discountAmount = parseFloat(voucher.max_value);
            }

            const newOrders = {
                ...prevOrders,
                voucher_id: voucher.id,
                voucher_code: voucher.code,
                discount: discountAmount,
                max_value: voucher.max_value,
                min_value: voucher.min_value,
                discount_percentage: voucher.discount_percentage
            };

            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }

    const updateCustomer = (customer_id) => {
        setOrders(prevOrders => {
            const newOrders = {
                ...prevOrders,
                customer_id: customer_id
            };
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }
    
    const createOrder = async () => {
        const dataRequest = {
            staff_id: orders.staff_id || 1,
            customer_id: orders.customer_id || null,
            pays_id: orders.pays_id || 1,
            voucher_code: orders.voucher_code || null,
            discount: orders.discount || 0,
            status: orders.status || 0,
            details: orders.details.map(detail => ({
                product_id: detail.product_id,
                soluong: detail.soluong,
                dongia: detail.dongia,
                discount: detail.discount || 0
            }))
        };
        try{
            const response = await orderService.create(dataRequest);
            const data = handleResponse(response);
            localStorage.setItem('order_id', JSON.stringify(data.id));
            return data;
        }catch(error){
            console.log(error);
        }
    }

    const updateOrder = async (id,data) => {
        try{
            const dataRequest = {
                staff_id: data.staff_id || 1,
                customer_id: data.customer_id || null,
                pays_id: data.pays_id || null,
                voucher_code: data.voucher_code || null,
                discount: data.discount || 0,
                status: data.status || 0,
                details: data.details.map(detail => ({
                    product_id: detail.product_id,
                    soluong: detail.soluong,
                    dongia: detail.dongia,
                    discount: detail.discount || 0
                }))
            };
            const response = await orderService.update(id, dataRequest);
        }catch(error){
            console.log(error);
        }
    }

    return {
        orders,
        getTotalAmount,
        getTotalQuantity,
        getTotalDiscount,
        addProduct,
        removeProduct,
        updateQuantity,
        updateDiscount,
        updateProductDiscount,
        updateVoucher,
        updateCustomer,
        createOrder,
        updateOrder
    };
}

export default orderUtils;
