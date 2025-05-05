import { useContext } from "react";
import { UserContext } from "../userContext";
import { NavLink } from "react-router-dom";

function Header({ title }) {

    return (
        <header className="bg-gray-800 border-b border-gray-200 shadow-sm text-blue-50">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <div className="flex flex-wrap items-center justify-between">
                    <nav className="space-x-4 mb-2 md:mb-0">
                        <NavLink to="/" className="hover:bg-blue-600 hover:text-white">
                            Home
                        </NavLink>
                        <UserContext.Consumer>
                            {context => (
                                context.user ?
                                    <>
                                        <NavLink to="/profile" className="hover:bg-blue-600 hover:text-white">
                                            Profile
                                        </NavLink>
                                        <NavLink to="/logout" className="hover:bg-blue-600 hover:text-white">
                                            Logout
                                        </NavLink>
                                    </>
                                    :
                                    <>
                                        <NavLink to="/login" className="hover:bg-blue-600 hover:text-white">
                                            Login
                                        </NavLink>
                                        <NavLink to="/register" className="hover:bg-blue-600 hover:text-white">
                                            Register
                                        </NavLink>
                                    </>
                            )}
                        </UserContext.Consumer>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
