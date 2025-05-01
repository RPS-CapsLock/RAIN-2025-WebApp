import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function Logout(){

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;