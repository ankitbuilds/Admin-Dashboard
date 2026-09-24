import { useState } from 'react';
import {Routes, Route} from "react-router-dom";
import './App.css'
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path = "/login" element={<Login/>}/>
      <Route path = "/products" element={<Products/>}/>
      <Route
        path = "/products/:id"
        element = {<ProductDetails/>}
      ></Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default App
