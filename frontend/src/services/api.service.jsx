import axios from "axios";
const token = localStorage.getItem('ACCESS_TOKEN');
const commonConfig = {
    headers: {
    "Content-Type": "application/json",
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
