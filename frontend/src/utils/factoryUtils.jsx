import { useState, useEffect } from 'react';
import factoryService from '../services/factory.service';
import { handleResponse } from '../functions';

const useFactory = () => {
  const [f_options, setOptions] = useState([]);
  const [factories, setFactories] = useState([]);

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        const response = await factoryService.getAll();

        const data = handleResponse(response);
        setFactories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFactory();
  }, []);

  return { factories };
};

export default useFactory;
