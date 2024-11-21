import {createBrowserRouter} from 'react-router-dom';
import Login from './views/login.jsx';
import Register from './views/register.jsx';
import DefaultLayout from './components/DefaultLayout.jsx';
import GuestLayout from './components/GuestLayout.jsx';
import Users from './views/users.jsx';
import UserForm from './views/UserForm.jsx';
import Home from './pages/Home.jsx';
import ProductForm from './components/ProductForm.jsx';
import PayReturn from "./components/PayReturn.jsx";
import Pay from "./pages/Pay.jsx";
import Product from "./pages/Product.jsx"
import Order from './pages/Order.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import WareHome from './pages/WareHome.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard/index.jsx';
import ProductAdmin  from './pages/admin/ProductAdmin.jsx';
import OrderAdmin from './pages/admin/OrderAdmin.jsx';
import StaffAdmin from './pages/admin/StaffAdmin.jsx';
import SupplierAdmin from './pages/admin/SupplierAdmin.jsx';
import SalesAdmin from './pages/admin/SalesAdmin.jsx';
import Vnpay from './pages/vnpay.jsx';
import ImportAdmin from './pages/admin/products/importAdmin.jsx';
import HistoryReceipt from './pages/admin/products/HistoryReceipt.jsx';
import ReceiptCheck from './pages/admin/products/ReceiptCheck.jsx';
import ReceiptCheckUser from './pages/Employee/CheckReceipt.jsx';
import InventoryReport from './pages/Employee/InventoryReport.jsx';
import ProductDisposal from './pages/admin/products/ProductDisposal.jsx';
import ProductDisposalEmployee from './pages/Employee/ProductDisposalEmployee.jsx';
import InventoryReportAdmin from './pages/admin/products/InventoryReportAdmin.jsx';
import CustomerAdmin from './pages/admin/CustomerAdmin.jsx';
import ImportProduct from './pages/admin/products/ImportProduct/ImportProduct.jsx';
import ReceiptProduct from './pages/admin/products/ImportProduct/ReceiptProduct.jsx';
import { useAuth } from './context/authprovider.jsx';

const router = createBrowserRouter ([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate"/>
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate"/>
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
                element:<Pay />
            },
            {
                path: '/orders',
                element:<Order />
            },
            {
                path: '/warehouse',
                element:<WareHome />
            },
            {
                path: '/vnpay/:id/:amount',
                element: <Vnpay />
            },
            {
                path: '/check-receipt',
                element: <ReceiptCheckUser />
            },
            {
                path: '/inventory-report',
                element: <InventoryReport />
            },
            {
                path: '/product-disposal',
                element: <ProductDisposalEmployee />
            }
        
        ]
    },

    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '/admin/users',
                element: <Users />
            },
            {
                path: '/admin',
                element: <Dashboard />
            },
            {
                path: '/admin/products',
                element: <ProductAdmin />
            },
            {
                path: '/admin/orders',
                element: <OrderAdmin />
            },
            {
                path: '/admin/suppliers',
                element: <SupplierAdmin />
            },
            {
                path: '/admin/staff',
                element: <StaffAdmin />
            },
            {
                path: '/admin/sales',
                element: <SalesAdmin />
            },
            {
                path: '/admin/import-product',
                element: <ImportAdmin />
            },
            // {
            //     path: '/admin/import-product',
            //     element: <ImportProduct />
            // },
            {
                path: '/admin/import-history',
                element: <HistoryReceipt />
            },
            {
                path: '/admin/inventory-check',
                element: <ReceiptCheck />
            },
            {
                path: '/admin/product-disposal',
                element: <ProductDisposal />
            },
            {
                path: '/admin/inventory-report',
                element: <InventoryReportAdmin />
            },
            {
                path: '/admin/customers',
                element: <CustomerAdmin />
            },
            {
                path: '/admin/receipt-product',
                element: <ReceiptProduct />
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