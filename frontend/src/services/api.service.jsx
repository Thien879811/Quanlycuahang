import axios from "axios";
const token = localStorage.getItem('ACCESS_TOKEN');
const commonConfig = {
    headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`
    },
};
// // This code sets up an interceptor for Axios responses
// axios.interceptors.response.use(
//     // For successful responses, simply return the response without modification
//     (response) => {
//         return response;
//     },
//     // For errors, we have a special handling
//     (error) => {
//         try {
//             // Extract the response from the error object
//             const { response } = error;
//             // If the response status is 401 (Unauthorized)
//             if (response.status === 401) {
//                 // Remove the access token from local storage
//                 // This is typically done when the user's session has expired or is invalid
//                 localStorage.removeItem("ACCESS_TOKEN");
//             }
//         } catch (err) {
//             // If there's an error in the error handling itself, log it to the console
//             console.error(err);
//         }
//         // After error handling, re-throw the error so it can be caught by the calling function
//         throw error;
//     }
// );

export default (baseURL) => {
    return axios.create({
    baseURL,
    ...commonConfig,
    });
};
