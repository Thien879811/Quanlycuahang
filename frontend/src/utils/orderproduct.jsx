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
            localStorage.setItem('order_product', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    }, []);

    const updateProductDiscount = useCallback((productCode, discount, quantity, present) => {
        setOrderProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_id === productCode) {
                    if (quantity) {
                        const discountMultiplier = Math.floor(product.quantity / quantity);
                        if (discountMultiplier > 0) {
                            return {
                                ...product,
                                discount: (product.price * discount / 100) * discountMultiplier,
                                present: present ? present * discountMultiplier : null
                            };
                        }
                    } else {    // If quantity is not provided, apply discount to all products
                        return {
                            ...product,
                            discount: (product.price * discount / 100) * product.quantity,
                            present: present || null
                        };
                    }
                    return { ...product, discount: 0, present: null };
                }
                return product;
            });

            // Apply discount to present product if it exists
            if (present) {
                const presentProduct = updatedProducts.find(p => p.product_id === present);
                if (presentProduct) {
                    presentProduct.discount = presentProduct.price; // 100% discount for the present product
                }
            }

            localStorage.setItem('order_product', JSON.stringify(updatedProducts)); 
            return updatedProducts;
        });
    }, []);

    const getTotalAmount = useCallback(() => {
        return orderProducts.reduce((total, product) => { 
            return total + (product.price * product.quantity - product.discount);
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
