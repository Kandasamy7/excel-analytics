import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token')
    // console.log("checking token:", token);
    if(!token){
        return  <Navigate to="/" replace/>
    }
    return <Outlet />   
}

export default PrivateRoute
