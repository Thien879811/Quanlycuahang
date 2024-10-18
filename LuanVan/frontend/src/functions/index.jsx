import useOrderProduct from "../utils/orderproduct";


export const handleResponse = (response) => {
    if (typeof response !== 'string') {
        console.error('Invalid response type:', typeof response);
        return null;
    }
    const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1');
    const data = JSON.parse(cleanJsonString);
    return data;
}

export const handleToken = (token) => {
    return token.split('|')[1];
}

export const handlePromotion = (promotion) => {

    const { updateProductQuantity } = useOrderProduct();

    const { orderProducts } = useOrderProduct();
	// khuyến mãi có sản phẩm không có điều kiện số lượng
    
    for (const promo of promotion) {
        const product = orderProducts.find(product => product.id === promo.product_id);
        if(!promo.quantity) {
            updateProductQuantity(promo.product_id, product.quantity, promo.discount_percentage);
        }
    }
   
    return promotion;
}

