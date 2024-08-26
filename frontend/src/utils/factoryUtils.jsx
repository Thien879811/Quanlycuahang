import { useState, useEffect } from 'react';
import factoryService from '../services/factory.service';

const useFactory = () => {
  const [f_options, setOptions] = useState([]);
  const [f_loading, setLoading] = useState(true);
  const [f_error, setError] = useState(null);

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        const response = await factoryService.getAll();

        const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
        // Transform data into the format required by BasicSelect
        const transformedOptions = data.map(item => ({
          value: item.id,
          label: item.factory_name
        }));
        setOptions(transformedOptions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    fetchFactory();
  }, []);

  return { f_options, f_loading, f_error };
};

export default useFactory;
