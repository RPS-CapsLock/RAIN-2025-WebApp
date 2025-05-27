import React from "react";

function Main() {

const scrollToAbout = () => {
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: "smooth" });
  }
};

return (
    <div>
      {/* Hero Section */}
      <section
        className="container py-5"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#FF7A00" }}>
              Tvoj popoln koktejl. Kadarkoli. Kjerkoli.
            </h1>
            <p style={{ fontSize: "1.25rem", marginTop: "1rem", color: "#333" }}>
              Pametni paketomat za tvoje najljubše koktajle. Vedno sveži, vedno okusni in
              vedno pripravljeni v trenutku — s samo nekaj dotiki preko mobilne aplikacije.
            </p>
            <p style={{ fontSize: "1rem", marginTop: "1rem", color: "#555" }}>
              Razvajaj svoje čute kjerkoli in kadarkoli. Inovativen dizajn in tehnologija za popolno izkušnjo.
            </p>
            <button className="btn btn-warning btn-lg mt-4" onClick={scrollToAbout}>
              Izvedi več
            </button>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="/images/slika_cocktails.png"
              alt="CocktailBox Hero"
              className="img-fluid"
              style={{ borderRadius: "2rem", maxWidth: "90%" }}
            />
          </div>
        </div>
      </section>

      <section id="about"className="py-5" style={{ backgroundColor: "#FFF3E0", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div className="container text-center">
          <h2 className="mb-5" style={{ color: "#FF7A00" }}>Zakaj izbrati CocktailBox?</h2>
          <div className="row g-5">
            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded h-100">
                <h5>Hitrost</h5>
                <p>Prevzem koktajla v manj kot 60 sekundah — kadarkoli, kjerkoli.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded h-100">
                <h5>Okus</h5>
                <p>Premium koktajli iz svežih in kakovostnih sestavin, pripravljeni z ljubeznijo.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded h-100">
                <h5>Enostavnost</h5>
                <p>Naroči s telefonom in prevzemi brez čakanja. Preprosto in hitro.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-white shadow rounded h-100">
                <h5>Trajnost</h5>
                <p>Okolju prijazna embalaža in trajnostni materiali — za svetlo prihodnost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-2">
            <img
              src="/images/paketomat.png"
              alt="Kaj je CocktailBox"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-4" style={{ color: "#FF7A00" }}>Kaj je CocktailBox?</h2>
            <p>
              CocktailBox predstavlja prihodnost uživanja koktajlov. Samopostrežni sistem, ki ti omogoča, da s pomočjo enostavne mobilne aplikacije izbereš svoj najljubši koktajl, ga naročiš in prevzameš, ko ti najbolj ustreza.
            </p>
            <p>
              Naš napredni paketomat skrbi za optimalno temperaturo in svežino, zato so tvoji koktajli vedno pripravljeni v popolnem stanju. Brez čakalnih vrst, brez stresa.
            </p>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="container py-5" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <h2 className="text-center mb-5" style={{ color: "#FF7A00" }}>Zanimivosti o CocktailBoxu</h2>
        <div className="row text-center g-5">
          <div className="col-md-3">
            <h3>24/7</h3>
            <p>Dostopno neprekinjeno — tvoj koktajl, kadar ti najbolj paše.</p>
          </div>
          <div className="col-md-3">
            <h3>50+</h3>
            <p>Pestra izbira koktajlov — klasiki in moderne kreacije.</p>
          </div>
          <div className="col-md-3">
            <h3>90%</h3>
            <p>Visoko zadovoljstvo uporabnikov — priporočilo prijateljem zagotovljeno.</p>
          </div>
          <div className="col-md-3">
            <h3>Eco</h3>
            <p>Zavezani k varovanju okolja s pametnimi rešitvami embalaže.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
