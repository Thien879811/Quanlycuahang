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

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit'
    });
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}


