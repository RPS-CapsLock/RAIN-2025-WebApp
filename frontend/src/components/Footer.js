function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="text-center py-5" style={{ backgroundColor: "#FFF3E0", color: "#333", marginTop: "5rem" }}>
            <div className="container">
                <p className="mb-0" style={{ fontWeight: "500" }}>
                    © {year} CocktailBox
                </p>
            </div>
        </footer>
    );
}

export default Footer;