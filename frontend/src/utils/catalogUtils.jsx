import { useState, useEffect } from 'react';
import cataloryService from '../services/catalory.service';
import { handleResponse } from '../functions';

const useCatalogs = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalogs = async () => {
    try {
      const response = await cataloryService.getAll();
      const data = handleResponse(response);
      setCatalogs(data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  };


  const createCatalog = async (catalog) => {
    const response = await cataloryService.create(catalog);
    fetchCatalogs();
  }

  const updateCatalog = async (catalog) => {
    const response = await cataloryService.update(catalog);
  }

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return { catalogs, loading, error , fetchCatalogs, createCatalog, updateCatalog};
};

export default useCatalogs;
