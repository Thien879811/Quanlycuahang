import { useState, useEffect, useCallback } from 'react';

const useOrderProduct = () => {
    const [orderProducts, setOrderProducts] = useState(() => {
        const savedProducts = localStorage.getItem('order_product');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    useEffect(() => {
        localStorage.setItem('order_product', JSON.stringify(orderProducts));
    }, [orderProducts]);

    const addProduct = useCallback((productCode, productName, price, quantity) => {
        const newProduct = {
            productCode,
            productName,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10)
        };

        setOrderProducts(prevProducts => [...prevProducts, newProduct]);
    }, []);

    const removeProduct = useCallback((productCode) => {
        setOrderProducts(prevProducts => 
            prevProducts.filter(product => product.productCode !== productCode)
        );
    }, []);

    const updateProductQuantity = useCallback((productCode, newQuantity) => {
        setOrderProducts(prevProducts =>
            prevProducts.map(product =>
                product.productCode === productCode
                    ? { ...product, quantity: parseInt(newQuantity, 10) }
                    : product
            )
        );
    }, []);

    const getTotalAmount = useCallback(() => {
        return orderProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
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
        getTotalAmount,
        getTotalQuantity,
        clearOrderProduct
    }; 
};

export default useOrderProduct;
