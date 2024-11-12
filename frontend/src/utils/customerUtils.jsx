import { useState, useEffect } from 'react';
import CustomerService from '../services/customer.service';
import useOrder from './orderUtils';
import { handleResponse } from '../functions/index';

const useCustomer = () => {
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem('customer')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openNewCustomer, setOpenNewCustomer] = useState(false);
    const [openCustomerInfo, setOpenCustomerInfo] = useState(false);

    const searchCustomerByPhone = async (phone) => {
        setLoading(true);
        setError(null);
        try {
            const response = await CustomerService.get(phone);

            const data = handleResponse(response);
   
            if (!data.error) {
                console.log('Customer data:', data);
                setCustomer(data);
                setOpenCustomerInfo(true);
                localStorage.setItem('customer', JSON.stringify(data));
                return data;
            } else {
                setOpenNewCustomer(true);
                console.log('No customer data found');
                localStorage.removeItem('customer');
                setCustomer(null);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while searching for the customer');
        } finally {
            setLoading(false);
        }
    };

    const updatePointCustomer = async (point) => {
        if (customer) {
            customer.diem = customer.diem + point;
            try {
                const response = await CustomerService.update(customer.id, customer);
                setCustomer(null);
                localStorage.removeItem('customer');
                console.log(response);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while updating the customer');
            }
        }
    };

    const createCustomer = async (customer) => {
        try {
            const response = await CustomerService.create(customer);

            const data = handleResponse(response);
            
            if(data !== null){
                localStorage.setItem('customer', JSON.stringify(data));
                setCustomer(data);
            }else{
                setCustomer(null);
                localStorage.removeItem('customer');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while creating the customer');
        }
    };

    return { 
        customer,
        loading,
        error, 
        searchCustomerByPhone, 
        updatePointCustomer, 
        createCustomer, 
        setCustomer ,
        openNewCustomer,
        openCustomerInfo,
        setOpenNewCustomer,
        setOpenCustomerInfo
    };
};

export default useCustomer;
