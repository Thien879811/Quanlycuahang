
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import React from 'react';
import OrderSummary from './OrderSummary';

export default function DefaultLayout(){

    const {user, token} = useStateContext();
    if(!token){
        return <Navigate to='/login'/>
    }

    const order = {
        items: [
          { name: 'Item 1', quantity: 2, price: 9.99 },
          { name: 'Item 2', quantity: 1, price: 19.99 },
        ],
        subtotal: 39.97,
        tax: 3.20,
        total: 43.17,
      };
   
    return (
        <div id="defaultLayout">
        <div className="content">
           <header>
               <div>
                   Header
               </div>
               <div>
                <Link to='/home'>Thêm sản phẩm</Link>
               </div>
               <div>
                   <a href="#" className="btn-logout"> Logout</a>
               </div>
           </header>
           <main>
                <Outlet />

                <div className="App">
                    <OrderSummary order={order} />
                </div>

           </main>
           </div>
       </div>
    );
}