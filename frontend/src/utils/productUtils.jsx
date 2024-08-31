import { useState, useEffect } from 'react';
import product from '../services/product.service';

const useProducts = () => {
  const [products, setOptions] = useState([]);
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await product.getAll();

        const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
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
