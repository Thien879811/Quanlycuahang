import { useEffect, useState, useCallback, useMemo } from "react";
import PromotionService from "../services/promotion.service";
import { handleResponse } from "../functions";

const usePromotion = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchPromotion = useCallback(async () => {
        try {
            setLoading(true);
            const res = await PromotionService.getPromotion();
            const data = handleResponse(res);
            setPromotions(data);
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPromotion();
    }, [fetchPromotion]);

    const activePromotions = useMemo(() => {
        const now = new Date();
        return promotions.filter(promo => 
            new Date(promo.start_date) <= now && 
            new Date(promo.end_date) >= now
        );
    }, [promotions]);

    const createPromotion = useCallback(async (promotion) => {
        try {
            setLoading(true);
            const res = await PromotionService.create(promotion);
            const dataResponse = handleResponse(res);
            if(dataResponse.error) {
                setError(dataResponse.error);
                return dataResponse.error;
            }
            setPromotions(prev => [...prev, dataResponse]);
            return dataResponse;
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePromotion = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await PromotionService.delete(id);
            const data = handleResponse(res);
            setPromotions(prev => prev.filter(promo => promo.id !== id));
            return data;
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePromotion = useCallback(async (id, promotion) => {
        try {
            setLoading(true);
            const res = await PromotionService.update(id, promotion);
            const data = handleResponse(res);
            setPromotions(prev => 
                prev.map(promo => promo.id === id ? {...promo, ...data} : promo)
            );
            return data;
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuantity = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await PromotionService.updateQuantity(id);
            const data = handleResponse(res);
            setPromotions(prev => 
                prev.map(promo => promo.id === id ? {...promo, quantity: data.quantity} : promo)
            );
            return data;
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        promotions: activePromotions,
        loading,
        error,
        createPromotion,
        deletePromotion,
        updatePromotion,
        fetchPromotion,
        updateQuantity
    };
}

export default usePromotion;