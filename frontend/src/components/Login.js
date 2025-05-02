import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        userContext.setUserContext(data);
    }

    return (
        <form onSubmit={Login}>
            {userContext.user ? <Navigate replace to="/" /> : ""}
            <input type="text" name="username" placeholder="Username"
             value={username} onChange={(e)=>(setUsername(e.target.value))}/>
             <input type="password" name="password" placeholder="Password"
             value={password} onChange={(e)=>(setPassword(e.target.value))}/>
             <input type="submit" name="submit" value="Log in"/>
        </form>
    );
}

export default Login;