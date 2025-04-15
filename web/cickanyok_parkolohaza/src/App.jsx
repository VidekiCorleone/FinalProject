import { useState } from 'react';
import './App.css';
import clickSound from './assets/audio.mp3';

function App() {
  // Állapotok
  const [userData, setUserData] = useState(null); // Felhasználói adatok tárolása
  const [showUserData, setShowUserData] = useState(false); // Felhasználói adatok megjelenítésének állapota
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [loginUser, setLoginUser] = useState(''); // Felhasználónév állapot
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [carId, setCarId] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [loggedIN, setLoggedIN] = useState(!!sessionStorage.getItem('token'));

  // Eseménykezelők
  const handleLoginClick = () => setShowLoginModal(true);
  const handleRegistrationClick = () => setShowRegistrationModal(true);
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(false);
  };

  const handleRegistrationSubmit = async () => {
    try {
      const response = await fetch('http://127.1.1.1:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerUser: regName, // Correctly map the username
          registerPassword: regPassword,
          registerEmail: regEmail,
          registerPhone: regPhone,
          registerName: regName, // Include the name field
          carId: carId,
          reservationId
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Sikeres regisztráció');
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error('Regisztrációs hiba:', errorData);
        alert(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Regisztrációs hiba:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIN(false);
    setUserData(null); // Felhasználói adatok törlése
    setShowUserData(false); // Felhasználói adatok megjelenítésének alaphelyzetbe állítása
    sessionStorage.removeItem('token'); // Token törlése
    alert('Sikeres kijelentkezés!');
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://127.1.1.1:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          loginUser: loginUser, // Felhasználónév küldése
          loginPassword: loginPassword,
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        sessionStorage.setItem('token', result.token); // Token mentése
        setLoggedIN(true); // Bejelentkezési állapot frissítése
        setUserData(null); // Felhasználói adatok alaphelyzetbe állítása
        setShowUserData(false); // Felhasználói adatok megjelenítésének alaphelyzetbe állítása
        alert('Sikeres bejelentkezés!');
        handleCloseModal();
      } else {
        alert('Sikertelen bejelentkezés!');
        console.log(result.message);
      }
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      alert('Bejelentkezési hiba történt!');
    }
  };

  const handleShowUserData = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Token lekérése
      if (!token) {
        alert('Nincs token! Jelentkezz be újra.');
        return;
      }

      const response = await fetch('http://127.1.1.1:3000/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Token küldése a fejlécben
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Felhasználói adatok mentése az állapotba
        setShowUserData(true); // Megjelenítés engedélyezése
      } else {
        const errorData = await response.json();
        console.error('Hiba:', errorData.error);
        alert(`Hiba: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Hiba a felhasználói adatok lekérése során:', error);
      alert('Hiba történt a felhasználói adatok lekérése során.');
    }
  };

  // Komponensek
  const Menu = () => (
    <>
      <div className="menu">
        <h1>Menü</h1>
        <div className="menu-buttons">
          <button className="menu-button" onClick={handleShowUserData}>
            Saját adatok
          </button>
          <button className="menu-button">Parkolóházak listája</button>
          <button className="menu-button">Eddigi foglalásaim</button>
          <button className="menu-button">Visszajelzések</button>
        </div>
      </div>

      {showUserData && userData && (
        <div className="user-data">
          <h2>Felhasználói adatok</h2>
          <p><strong>Felhasználónév:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Telefonszám:</strong> {userData.phone_num}</p>
          <p><strong>Szerepkör:</strong> {userData.role === 0 ? 'Felhasználó' : userData.role}</p>
          <p><strong>Rendszám:</strong> {userData.plate}</p>
          <p><strong>Típus:</strong> {userData.type}</p>
        </div>
      )}
    </>
  );

  const playSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  // JSX Struktúra
  return (
    <>
      {/* Fejléc */}
      <div className="header">
        <img src="./src/assets/smartcar.png" alt="Logo" className="logo"  onClick={playSound}/>
        <span className="headerText">Cickányok parkolóháza</span>
      </div>

      {/* Fő tartalom */}
      {!loggedIN ? (
        <>
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
        </>
      ) : (
        <Menu />
      )}

      {/* Kijelentkezés gomb */}
      {loggedIN && (
        <button className="logout-button" onClick={handleLogout}>
          Kijelentkezés
        </button>
      )}

      {/* Bejelentkezési modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Bejelentkezés</h2>
            <label htmlFor="loginUser">Felhasználónév:</label>
            <br />
            <input
              type="text"
              id="loginUser"
              name="loginUser"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
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

      {/* Regisztrációs modal */}
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