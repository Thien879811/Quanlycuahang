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
import { useStateContext } from './context/contextprovider.jsx';


const router = createBrowserRouter ([
    {
        path: '/admin',
        element: (
          
                <AdminLayout/>
        
        ),
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
            {
                path: '/admin/import-product/:id',
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
])

export default router;