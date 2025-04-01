import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRegistrationClick = () => {
    setShowRegistrationModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(false);
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://127.1.1.1:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          loginEmail: loginEmail,
          loginPassword: loginPassword,
        }),
      });
  
      const result = await response.json();
      if (response.status !== 200) {
        console.log(result.message);
        alert('Sikertelen bejelentkezés');
        return;
      }
  
      alert('Sikeres bejelentkezés');
      handleCloseModal();
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      alert('Bejelentkezési hiba történt!');
    }
  };

  const handleRegistrationSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          regName: regName,
          regPassword: regPassword,
          regEmail: regEmail,
          regPhone: regPhone || 'N/A', // Alapértelmezett érték, ha nincs megadva
        }),
      });
  
      const result = await response.json();
      if (response.status !== 201) {
        console.log(result.message);
        alert('Sikertelen regisztráció');
        return;
      }
  
      alert('Sikeres regisztráció');
      handleCloseModal();
    } catch (error) {
      console.error('Regisztrációs hiba:', error);
      alert('Regisztrációs hiba történt!');
    }
  };

  return (
    <>
      <div className="header">
        <img src="" alt="Logo" className="logo" />
        <span className="headerText">Cickányok parkolóháza</span>
      </div>
      <div className="card">
        <button className="login" onClick={handleLoginClick}>
          Login
        </button>
        <button className="registration" onClick={handleRegistrationClick}>
          Registration
        </button>
      </div>
      <div className="welcomeSign">
        <p>
          Üdvözöljük parkolóházunk weboldalán! Kényelmes és biztonságos parkolási lehetőségeket kínálunk, hogy az autója mindig jó kezekben legyen.
          Parkolóházunk modern biztonsági rendszerekkel van felszerelve, beleértve a 24 órás kamerarendszert és az őrzött bejáratokat, hogy Ön mindig
          nyugodt lehessen autója biztonságát illetően. Szolgáltatásaink közé tartozik az elektromos autók töltési lehetősége, a kényelmes fizetési
          módok, valamint a fedett parkolóhelyek, amelyek megvédik autóját az időjárás viszontagságaitól. Emellett különleges kedvezményeket kínálunk
          hosszú távú parkolás esetén, és rugalmas bérleti lehetőségeket biztosítunk, hogy minden igényt kielégítsünk. Látogasson el hozzánk, és
          tapasztalja meg a kényelmes és biztonságos parkolás élményét! Várjuk szeretettel!
        </p>
      </div>

      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Bejelentkezés</h2>
            <label htmlFor="loginEmail">Email:</label>
            <br />
            <input
              type="email"
              id="loginEmail"
              name="loginEmail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <br />
            <label htmlFor="loginPassword">Jelszó:</label>
            <br />
            <input
              type="password"
              id="loginPassword"
              name="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <br />
            <button className="logreg" onClick={handleLoginSubmit}>
              Bejelentkezés
            </button>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Regisztráció</h2>
            <label htmlFor="regEmail">Email:</label>
            <br />
            <input
              type="email"
              id="regEmail"
              name="regEmail"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <br />
            <label htmlFor="regName">Felhasználónév:</label>
            <br />
            <input
              type="text"
              id="regName"
              name="regName"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
            />
            <br />
            <label htmlFor="regPassword">Jelszó:</label>
            <br />
            <input
              type="password"
              id="regPassword"
              name="regPassword"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <br />
            <label htmlFor="regPhone">Telefonszám:</label>
            <br />
            <input
              type="tel"
              id="regPhone"
              name="regPhone"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
            />
            <br />
            <button className="logreg" onClick={handleRegistrationSubmit}>
              Regisztráció
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;