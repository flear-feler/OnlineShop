import React from 'react';
import Login from './Components/Login/Login';
import AddFormG from './Components/AddGoodForm/AddFormG';
import AddFormC from './Components/AddCategoryForm/AddFormC';
import AddFormU from './Components/AddUserForm/AddFormU';
import ChangeFormC from './Components/ChangeCategoryForm/ChangeFormC';
import ChangeFormU from './Components/ChangeUserForm/ChangeFormU';
import ChangeFormG from './Components/ChangeGoodForm/ChangeFormG';
import AdminPanel from './Components/AdminPanel/AdminPanel';
import GoodsPage from './Components/GoodsPage/goodsPage';
import Cart from './Components/Cart/Cart';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter basename='/shop'>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/addGood' element={<AddFormG />} />
                <Route path='/addCategory' element={<AddFormC />} />
                <Route path='/addUser' element={<AddFormU />} />
                <Route path='/changeCategory' element={<ChangeFormC />} />
                <Route path='/changeUser' element={<ChangeFormU />} />
                <Route path='/changeGood' element={<ChangeFormG />} />
                <Route path='/adminPanel' element={<AdminPanel />} />
                <Route path='/goodsPage/:page_num/:search?' element={<GoodsPage />} />
                <Route path='/cart' element={<Cart />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
