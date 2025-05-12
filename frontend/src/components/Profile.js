import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <div className="text-blue-50">
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1 className="text-blue-50">User profile</h1>
            <p className="text-blue-50">Username: {profile.username}</p>
            <p className="text-blue-50">Email: {profile.email}</p>
        </div>
    );
}

export default Profile;