import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
    const context = useContext(UserContext);

        return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}>
                <div className="container">
                    <Link className="navbar-brand fw-bold" style={{ color: "#FF7A00", fontSize: "1.5rem" }} to="/">
                        {props.title}
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" style={{ color: "#333", fontWeight: "500" }} to="/">Domov</Link>
                            </li>
                            {context.user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{ color: "#333", fontWeight: "500" }} to="/publish">Objavi sliko</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{ color: "#333", fontWeight: "500" }} to="/profile">Profil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{ color: "#FF7A00", fontWeight: "600" }} to="/logout">Odjava</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" style={{ color: "#333", fontWeight: "500" }} to="/login">Prijava</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-warning ms-2" style={{ fontWeight: "500" }} to="/register">Registracija</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
