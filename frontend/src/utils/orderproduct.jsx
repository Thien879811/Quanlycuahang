import { useState, useEffect, useCallback } from 'react';

const useOrderProduct = () => {
    const [orderProducts, setOrderProducts] = useState(() => {
        const savedProducts = localStorage.getItem('order_product');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    useEffect(() => {
        localStorage.setItem('order_product', JSON.stringify(orderProducts));
    }, [orderProducts]);

    const addProduct = useCallback((productCode, productName, image, price, quantity) => {
        const newProduct = {
            product_id: productCode,
            product_name: productName,
            image: image,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            discount: 0
        };

        setOrderProducts(prevProducts => [...prevProducts, newProduct]);
    }, []);

    const removeProduct = useCallback((productCode) => {
        setOrderProducts(prevProducts => 
            prevProducts.filter(product => product.product_id !== productCode)
        );
    }, []);

    const updateProductQuantity = useCallback((productCode, quantityChange) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_id === productCode) {
                    const newQuantity = Math.max(0, product.quantity + quantityChange);
                    return { ...product, quantity: newQuantity };
                }
                return product;
            });
            return updatedProducts;
        });
    }, []);

    const updateDiscount = useCallback((productCode, discount) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_id == productCode) {
                    return { ...product, discount: product.price * discount / 100 * 1};
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
                        // Tính số lần đủ điều kiện khuyến mãi dựa trên số lượng mua
                        const timesQualified = Math.floor(product.quantity / promotion.quantity);
                        if (timesQualified > 0) {
                            // Chỉ áp dụng giảm giá cho số lượng sản phẩm đủ điều kiện
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
                            discount: 0 // Không giảm giá sản phẩm chính
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
    }, []);

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

    const setVoucherCode = useCallback((voucherCode) => {
        setVoucherCode(voucherCode);
    }, []);

    const updateVoucherDiscount = useCallback((discount) => {
        
    }, []);

    return {
        orderProducts,
        addProduct,
        removeProduct,
        updateProductQuantity,
        updateProductDiscount,
        getTotalAmount,
        getTotalQuantity,
        getTotalDiscount,
        clearOrderProduct
    }; 
};

export default useOrderProduct;
