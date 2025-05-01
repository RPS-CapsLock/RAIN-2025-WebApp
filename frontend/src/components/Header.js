import { NavLink } from "react-router-dom";

function Header({ title }) {
    return (
        <header>
            <div>
                <h1>{title}</h1>
                <div>
                    <nav>
                        <NavLink to="/">
                            Home
                        </NavLink>

                        <NavLink to="/profile">
                            Profile
                        </NavLink>
                        <NavLink to="/logout">
                            Logout
                        </NavLink>

                        <NavLink to="/login">
                            Login
                        </NavLink>
                        <NavLink to="/register">
                            Register
                        </NavLink>
                </nav>
            </div>
        </div>
        </header >
    );
}

export default Header;
