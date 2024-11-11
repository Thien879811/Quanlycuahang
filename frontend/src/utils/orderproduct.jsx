import { useState, useEffect, useCallback } from 'react';
import orderUtils from './orderUtils';

const useOrderProduct = () => {
    const {orders, updateOrderProducts} = orderUtils();
    const [orderProducts, setOrderProducts] = useState(orders.details);
    const [voucherCode, setVoucherCode] = useState('');

    const updateDiscount = useCallback((productCode, discount) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_id === productCode) {
                    return { ...product, discount: product.price * discount / 100 * product.quantity};
                }
                return product;
            });
            return updatedProducts;
        });
    }, []);

    const updateProductDiscount = useCallback((productCode, promotions) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_id === productCode) {
                    const promotion = promotions.find(promo => 
                        promo.product_id === productCode &&
                        new Date(promo.start_date) <= new Date() &&
                        new Date(promo.end_date) >= new Date()
                    );

                    if (!promotion) {
                        return { ...product, discount: 0 };
                    }

                    if (promotion.quantity > 0) {
                        const timesQualified = Math.floor(product.quantity / promotion.quantity);
                        if (timesQualified > 0) {
                            const discountedQuantity = timesQualified * promotion.quantity;
                            return {
                                ...product,
                                discount: (product.price * promotion.discount_percentage / 100) * discountedQuantity
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
                        discount: (product.price * promotion.discount_percentage / 100) * product.quantity
                    };
                }
                return product;
            });

            return updatedProducts;
        });
    }, [updateDiscount]);

    const getTotalAmount = useCallback(() => {
        return orderProducts.reduce((total, product) => { 
            return total + (product.price * product.quantity - (product.discount || 0));
        }, 0);
    }, [orderProducts]);

    const getTotalDiscount = useCallback(() => {
        return orderProducts.reduce((total, product) => {
            const discountAmount = product.discount || 0;
            return total + discountAmount;
        }, 0);
    }, [orderProducts]);

    const getTotalQuantity = useCallback(() => {
        return orderProducts.reduce((total, product) => total + product.quantity, 0);
    }, [orderProducts]);

    const clearOrderProduct = useCallback(() => {
        setOrderProducts([]);
        localStorage.removeItem('order_product');
    }, []);

    const setVoucherCodeHandler = useCallback((code) => {
        setVoucherCode(code);
    }, []);

    const updateVoucherDiscount = useCallback((discount) => {
        setOrderProducts(prevProducts => {
            return prevProducts.map(product => ({
                ...product,
                voucherDiscount: product.price * discount / 100 * product.quantity
            }));
        });
    }, []);

    return {
        updateProductDiscount
    }; 
};

export default useOrderProduct;
