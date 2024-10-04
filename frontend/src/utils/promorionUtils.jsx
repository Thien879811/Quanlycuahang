import { useEffect, useState } from "react";
import PromotionService from "../services/promotion.service";
import { handleResponse } from "../functions";

const usePromotion = () => {
    const [promotions, setPromotions] = useState([]);
    
    const fetchPromotion = async () => {
        try {
            const res = await PromotionService.getPromotion();
            const data = handleResponse(res);
            setPromotions(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPromotion();
    }, []);

    const createPromotion = async (promotion) => {
        try {
            const res = await PromotionService.create(promotion);
            const dataResponse = handleResponse(res);
            if(dataResponse.error){
                return dataResponse.error;
            }
            await fetchPromotion(); // Refresh promotions after creating
        } catch (error) {
            console.log(error);
        }
    }

    const deletePromotion = async (id) => {
        try {
            const res = await PromotionService.delete(id);
            const data = handleResponse(res);
            await fetchPromotion(); // Refresh promotions after deleting
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const updatePromotion = async (id, promotion) => {
        try {
            const res = await PromotionService.update(id, promotion);
            const data = handleResponse(res);
            await fetchPromotion(); // Refresh promotions after updating
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        promotions,
        createPromotion,
        deletePromotion,
        updatePromotion,
        fetchPromotion
    };
}

export default usePromotion;