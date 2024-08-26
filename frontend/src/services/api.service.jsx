import axios from "axios";
const token ='5|QM8G97V7If2FizITf0BQeXLS08g4CEjWAApzOVep3fbe823b' //localStorage.getItem('ACCESS_TOKEN');
const commonConfig = {
    headers: {
    //"Content-Type": "application/json",
   'Content-Type': 'multipart/form-data',
    Accept: "application/json",
    Authorization: `Bearer ${token}`
    },
};
export default (baseURL) => {
    return axios.create({
    baseURL,
    ...commonConfig,
    });
};
