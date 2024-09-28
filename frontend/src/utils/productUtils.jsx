import { useState, useEffect } from 'react';
import product from '../services/product.service';
import { handleResponse } from '../functions/index';

const useProducts = () => {
  const [products, setOptions] = useState([]);
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await product.getAll();
        const data = handleResponse(response);
        // Transform data into the format required by BasicSelect
        setOptions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCatalogs();
  }, []);

  return {products};
};

export default useProducts;
