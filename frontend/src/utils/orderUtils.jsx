import { useState, useEffect, useMemo, useCallback } from 'react';
import orderService from '../services/order.service';
import { handleResponse } from '../functions/index';
import useCustomer from './customerUtils';


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
            details: []
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

    const addProduct = (product) => {
        if(!orders.details) setOrders({details: []});
        setOrders(prevOrders => {
            const existingProduct = prevOrders.details.find(detail => detail.product_id === product.id);
            
            if (existingProduct) {
                const newOrders = {
                    ...prevOrders,
                    details: prevOrders.details.map(detail => 
                        detail.product_id === product.id
                        ? {...detail, soluong: detail.soluong + 1}
                        : detail
                    )
                };
                localStorage.setItem('order', JSON.stringify(newOrders));
                return newOrders;
            }

            const newOrders = {
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
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }

    const removeProduct = (product_id) => {
        setOrders(prevOrders => {
            const newOrders = {
                ...prevOrders,
                details: prevOrders.details.filter(detail => detail.product_id !== product_id)
            };
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

            const newOrders = {
                ...prevOrders,
                details: updatedDetails
            };
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }
    
    const updateDiscount = useCallback((productCode, discount) => {
        setOrders(prevOrders => {
            const updatedDetails = prevOrders.details.map(product => {
                if (product.product_id == productCode) {
                    return { ...product, discount: product.dongia * discount / 100 * product.soluong};
                }
                return product;
            });
            const newOrders = {...prevOrders, details: updatedDetails};
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
                    updateDiscount(promotion.present.product_id, promotion.discount_percentage);
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
            const newOrders = {...prevOrders, details: updatedDetails};
            localStorage.setItem('order', JSON.stringify(newOrders));
            return newOrders;
        });
    }, [updateDiscount]);

    // Hàm updateVoucher dùng để cập nhật voucher cho đơn hàng
    const updateVoucher = (voucher, discount) => {
        // Sử dụng setOrders để cập nhật state orders
        setOrders(prevOrders => {
            // Lấy tổng tiền đơn hàng trước khi áp dụng voucher
            const totalAmount = getTotalAmount;

            // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
            // Nếu đơn hàng không đạt giá trị tối thiểu thì hiện thông báo và giữ nguyên đơn hàng cũ
            if (voucher.min_value && totalAmount < parseFloat(voucher.min_value)) {
                alert(`Đơn hàng phải có giá trị tối thiểu ${voucher.min_value.toLocaleString()}đ để sử dụng voucher này`);
                return prevOrders;
            }

            // Tính số tiền được giảm dựa trên phần trăm giảm giá
            let discountAmount = (totalAmount * discount) / 100;

            // Kiểm tra và áp dụng giới hạn giảm giá tối đa nếu có
            if (voucher.max_value) {
                const maxValue = parseFloat(voucher.max_value);
                // Lấy giá trị nhỏ hơn giữa số tiền giảm và giới hạn tối đa
                discountAmount = Math.min(discountAmount, maxValue);
                // Tính lại phần trăm giảm giá dựa trên số tiền giảm đã được giới hạn
                discount = (discountAmount / totalAmount) * 100;
            }

            // Tạo đơn hàng mới với thông tin voucher đã cập nhật
            const newOrders = {
                ...prevOrders,
                voucher_id: voucher.id, // Lưu ID của voucher
                voucher_code: voucher.code, // Lưu mã voucher
                discount: parseFloat(discount.toFixed(2)) // Lưu phần trăm giảm giá, làm tròn 2 chữ số thập phân
            };

            // Lưu đơn hàng mới vào localStorage
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
