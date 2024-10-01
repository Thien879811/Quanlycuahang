import { useEffect, useState } from "react";
import PromotionService from "../services/promotion.service";
import { handleResponse } from "../functions";

const usePromotion = () => {
    const [promotions, setPromotions] = useState([]);

    useEffect(()  => {
        const fetchPromotion = async () => {
           try {
            const res = await PromotionService.getPromotion();
            const data = handleResponse(res);
            setPromotions(data);
           } catch (error) {
            console.log(error);
           }
        }
        fetchPromotion();
    }, []);

    return {
        promotions
    };
}

export default usePromotion;