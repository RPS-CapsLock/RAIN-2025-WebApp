# RAIN 2025 – Pametna spletna aplikacija za prevzem koktajlov

## Kaj aplikacija omogoča?

- Prijava in registracija z uporabo prepoznave obraza (Face ID)
- Uporabniški nadzor nad profilom in naročili
- Dodajanje in upravljanje koktajlov ter pijač
- Prevzem naročila iz enega izmed Paketnikov po mestu
- Upravljanje s paketniki in skeniranje QR kode
- Statistika in beleženje uspešnosti prevzemov
- Notifikacije in obvestila

---

## Kako uporabljati aplikacijo?

### 1. Namestitev in zagon

#### Backend (Express.js)
```bash
cd RAIN-2025-WebApp/backend
npm install
npm start
```

#### Frontend (React)
```bash
cd RAIN-2025-WebApp/frontend
npm install
npm start
```

### 2. Registracija in prijava
- V aplikaciji klikni “Register” in sledite postopku za zajem slike obraza.
- Ob uspešni registraciji se lahko prijavite z obrazno identifikacijo.
- Sistem preveri pristnost preko zalednega Face ID API-ja.

### 3. Naročilo koktajla
- Uporabnik lahko izbere obstoječi koktajl ali ustvari svojega.
- Po potrditvi naročila prejme obvestilo, ko je naročilo pripravljeno.

---

## Lokalno testiranje in razvoj

### Kloniranje repozitorija
```bash
git clone https://github.com/ime-uporabnika/RAIN-2025-WebApp.git
cd RAIN-2025-WebApp
```

### Konfiguracija IP naslova
Posodobi lokalni IP naslov znotraj `frontend/src/...` (če uporabljaš API lokalno):

```javascript
const API_URL = "http://<TVOJ-IP>:3001/api";
```

- Poskrbi, da sta telefon in računalnik v isti Wi-Fi mreži.
- Lokalni IP najdeš z `ipconfig` (Windows) ali `ifconfig` (Mac/Linux).

---

## Potrebna dovoljenja

Za pravilno delovanje aplikacije omogoči:

- Kamera (za prepoznavo obraza in skeniranje QR kode)
- Zvok (potrditev prevzema)
- Internet (komunikacija s strežnikom)

---

## Docker (neobvezno)

Za produkcijsko uporabo lahko uporabljaš Docker:

```bash
# Znotraj mape backend
docker build -t rain-backend .
docker run -p 3001:3001 rain-backend
```

---

## Struktura projekta

```
RAIN-2025-WebApp/
│
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── firebase.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.js
│   └── public/
│
└── .github/workflows/
```

---

## Testiranje

Testne skripte so definirane znotraj `backend/test/api.test.js`. Zaženete jih z:

```bash
cd backend
npm test
```

---

## Težave in rešitve

- **Napake pri gradnji frontend**:
  - Počisti predpomnilnik: `npm cache clean --force`
  - Ponovno namesti node_modules: `rm -rf node_modules && npm install`

- **Face ID ne deluje?**
  - Preveri povezavo do zunanjega AI API-ja za prepoznavo obraza
  - Preveri ustrezna dovoljenja

---

## Avtorji

Mitja Klajnšek, Jan Milošič, Rok Anžel
Ekipa CapsLock

Projekt RAIN 2025 je bil razvit v okviru pametne rešitve za avtomatiziran prevzem koktajlov.

