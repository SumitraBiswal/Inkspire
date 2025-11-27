import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from './Context/Authcontext.jsx'

import { WishlistProvider } from './Context/WishlistContext.jsx'
import CartProvider from './Context/CartContext.jsx'
import { OrderProvider } from './Context/OrderContext.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
                 <App/>
             <ToastContainer position ="top-center" autoClose={2000} theme='colored'/>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
          
    </AuthProvider>

    </BrowserRouter>
  </StrictMode>,
)
