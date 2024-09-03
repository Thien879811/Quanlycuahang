import {createBrowserRouter} from 'react-router-dom';
import Login from './views/login.jsx';
import Register from './views/register.jsx';
import DefaultLayout from './components/DefaultLayout.jsx';
import GuestLayout from './components/GuestLayout.jsx';
import Users from './views/users.jsx';
import UserForm from './views/UserForm.jsx';
import Home from './pages/Home.jsx';//
import ProductForm from './components/ProductForm.jsx';
import PayReturn from "./components/PayReturn.jsx";
import Pay from "./pages/Pay.jsx";
import Product from "./pages/Product.jsx"

const router = createBrowserRouter ([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate"/>
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
            },
            {
                path: '/vnpay/return',
                element: <PayReturn />
            },
            {
                path: '/product',
                element: <Product />
            },
            {
                path: '/create_product',
                element: <ProductForm />
            },
            {
                path: '/pay',
                element: <Pay />
            }
        ]
    },

    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element:  <Register />,
            }
        ]
    },
]);

export default router;

// http://localhost:3001/vnpay/return?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14568932&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan&vnp_PayDate=20240827140354&vnp_ResponseCode=00&vnp_TmnCode=OCKOQ6D2&vnp_TransactionNo=14568932&vnp_TransactionStatus=00&vnp_TxnRef=89186&vnp_SecureHash=39e070029891aa4fd6e24c5c5d8c654d762b9152e82379b5d334ec9647c2a0acf9d5cb16435381229cde4915fdd0c5355e57998443074453b9a63df3977880de