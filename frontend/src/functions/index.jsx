export const handleResponse = (response) => {
    const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1');
    const data = JSON.parse(cleanJsonString);
    return data;
}

export const handleToken = (token) => {
    return token.split('|')[1];
}

