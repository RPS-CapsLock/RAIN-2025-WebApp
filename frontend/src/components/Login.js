import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        userContext.setUserContext(data);

    }

    return (
        <form onSubmit={Login} className="text-blue-50">
            {userContext.user ? <Navigate replace to="/" /> : ""}
            <input type="text" name="username" placeholder="Username" className="text-blue-50 border-1 border-indigo-500 rounded-lg mx-2"
             value={username} onChange={(e)=>(setUsername(e.target.value))}/>
             <input type="password" name="password" placeholder="Password" className="text-blue-50 border-1 border-indigo-500 rounded-lg mx-2"
             value={password} onChange={(e)=>(setPassword(e.target.value))}/>
             <input type="submit" name="submit" value="Log in" className="text-blue-50 border-1 border-indigo-500 rounded-lg mx-2"/>
             <label className="text-blue-50">{error}</label>
        </form>
    );
}

export default Login;