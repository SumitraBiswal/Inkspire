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




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
           <App/>
             <ToastContainer position ="top-center" autoClose={2000} theme='colored'/>
        </WishlistProvider>
      </CartProvider>
          
    </AuthProvider>

    </BrowserRouter>
  </StrictMode>,
)
