import { useState, useEffect } from 'react';
import cataloryService from '../services/catalory.service';

const useCatalogs = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await cataloryService.getAll();

        const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
        // Transform data into the format required by BasicSelect
        const transformedOptions = data.map(item => ({
          value: item.id,
          label: item.catalogy_name
        }));
        setOptions(transformedOptions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  return { options, loading, error };
};

export default useCatalogs;
