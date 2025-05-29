import { useContext } from "react";
import { UserContext } from "../userContext";
import { NavLink } from "react-router-dom";

function Header({ title }) {
    const navButtonStyle = ({ isActive }) => ({
        padding: '0.5rem 1rem',
        margin: '0 0.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? '#3b82f6' : '#1f2937',
        color: isActive ? '#ffffff' : '#e5e7eb',
        border: isActive ? '1px solid #3b82f6' : '1px solid #374151',
        textDecoration: 'none',
        display: 'inline-block',
        '&:hover': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
        }
    });

    return (
        <header className="bg-gray-800 border-b border-gray-200 shadow-sm text-blue-50">
            <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <div className="flex flex-wrap items-center justify-between">
                    <nav className="space-x-4 mb-2 md:mb-0">
                        <NavLink to="/" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
                            Home
                        </NavLink>
                        <UserContext.Consumer>
                            {context => (
                                context.user ?
                                    <>
                                        <NavLink to="/profile" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
                                            Profile
                                        </NavLink>
                                        <NavLink to="/logout" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
                                            Logout
                                        </NavLink>
                                        <NavLink to="/profile" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
                                            Dasboard
                                        </NavLink>
                                    </>
                                    :
                                    <>
                                        <NavLink to="/login" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
                                            Login
                                        </NavLink>
                                        <NavLink to="/register" style={navButtonStyle} className="hover:bg-blue-600 hover:text-white">
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
