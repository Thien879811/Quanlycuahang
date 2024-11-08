import { useState, useEffect } from 'react';
import productService from '../services/product.service';
import { handleResponse } from '../functions/index';

const useProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      const data = handleResponse(response);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await productService.create(productData);
      const data = handleResponse(response);
      if (data.success) {
        await fetchProducts(); // Refresh the products list
      }
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: 'An error occurred while creating the product.' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productService.update(id, productData);
      const data = handleResponse(response);
      if (data.success) {
        await fetchProducts(); // Refresh the products list
      }
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: 'An error occurred while updating the product.' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await productService.delete(id);
      const data = handleResponse(response);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, createProduct, updateProduct, deleteProduct };
};

export default useProducts;
