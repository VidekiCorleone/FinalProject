import { useState } from 'react';
import './App.css';
import clickSound from './assets/audio.mp3';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userData, setUserData] = useState(null); 
  const [showUserData, setShowUserData] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [activeView, setActiveView] = useState(null);

  const [loggedIN, setLoggedIN] = useState(!!sessionStorage.getItem('token'));
  const [parkhouses, setParkhouses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [feedbackView, setFeedbackView] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]); 
  const [selectedParkhouseId, setSelectedParkhouseId] = useState(null);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleRegistrationClick = () =>setShowRegistrationModal(true);
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
          registerUser: regName,
          registerPassword: regPassword,
          registerEmail: regEmail,
          registerPhone: regPhone,
          registerName: regName, 
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
    setUserData(null); 
    setShowUserData(false); 
    sessionStorage.removeItem('token'); 
    alert('Sikeres kijelentkezés!');
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://127.1.1.1:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'Application/JSON' },
        body: JSON.stringify({
          loginUser: loginUser,
          loginPassword: loginPassword,
        }),
      });

      const result = await response.json();
      if (response.status === 200) {
        sessionStorage.setItem('token', result.token);
        setLoggedIN(true);
        setUserData(null);
        setShowUserData(false);
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
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Nincs token! Jelentkezz be újra.');
        return;
      }

      const response = await fetch('http://127.1.1.1:3000/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setShowUserData(true);
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

  const fetchParkhouses = async () => {
    try {
      setShowUserData(false);
      const response = await fetch('http://127.1.1.1:3000/parkhouses');
      if (response.ok) {
        const data = await response.json();
        setParkhouses(data);
      } else {
        alert('Nem sikerült lekérni a parkolóházak listáját!');
      }
    } catch (error) {
      console.error('Hiba a parkolóházak lekérdezése során:', error);
      alert('Hiba történt a parkolóházak lekérdezése során!');
    }
  };

  const fetchReservations = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Nincs token! Jelentkezz be újra.');
        return;
      }

      const response = await fetch('http://127.1.1.1:3000/checkReservations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        alert('Nem sikerült lekérni a foglalásokat!');
      }
    } catch (error) {
      console.error('Hiba a foglalások lekérdezése során:', error);
      alert('Hiba történt a foglalások lekérdezése során!');
    }
  };

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      alert('Kérlek, válassz egy értékelést!');
      return;
    }
    if (!selectedParkhouseId) {
      alert('Nincs kiválasztva parkolóház!');
      return;
    }
    try {
      const response = await fetch('http://127.1.1.1:3000/rateParkhouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          parkhouseId: selectedParkhouseId,
          rating: selectedRating,
        }),
      });

      if (response.ok) {
        alert('Értékelés sikeresen mentve!');
        setFeedbackView(null);
        setActiveView('parkhouses');
        fetchParkhouses();
      } else {
        alert('Nem sikerült menteni az értékelést!');
      }
    } catch (error) {
      console.error('Hiba az értékelés mentése során:', error);
      alert('Hiba történt az értékelés mentése során!');
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://127.1.1.1:3000/feedbacks');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      } else {
        alert('Nem sikerült lekérni az értékeléseket!');
      }
    } catch (error) {
      console.error('Hiba az értékelések lekérdezése során:', error);
      alert('Hiba történt az értékelések lekérdezése során!');
    }
  };

  const Menu = () => (
    <>
      <div className="menu d-flex justify-content-start">
        <div className="menu-buttons bg-light p-3">
          <h1>Menü</h1>
          <div className="row">
            <div className="col-12 mb-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  setActiveView('userData');
                  handleShowUserData();
                }}
              >
                Saját adatok
              </button>
            </div>
            <div className="col-12 mb-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  setActiveView('parkhouses');
                  fetchParkhouses();
                }}
              >
                Parkolóházak listája
              </button>
            </div>
            <div className="col-12 mb-3">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  setActiveView('reservations');
                  fetchReservations();
                }}
              >
                Eddigi foglalásaim
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'userData' && showUserData && userData && (
        <div className="user-data">
          <h2>Felhasználói adatok</h2>
          <p><strong>Felhasználónév:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Telefonszám:</strong> {userData.phone_num}</p>
          <p><strong>Szerepkör:</strong> {
            userData.role === 1
              ? 'Felhasználó'
              : userData.role === 2
                ? 'Admin'
                : userData.role
          }</p>
          <p><strong>Rendszám:</strong> {userData.plate}</p>
          <p><strong>Típus:</strong> {userData.type}</p>
        </div>
      )}

      {activeView === 'parkhouses' && parkhouses.length > 0 && (
        <div className="parkhouse-list mt-4">
          <h2>Parkolóházak listája</h2>
          <div className="row">
            {parkhouses.map((parkhouse) => {
              const openingTime = new Date(parkhouse.opening);
              const closingTime = new Date(parkhouse.closing);

              const formattedOpening = openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              const formattedClosing = closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

              return (
                <div key={parkhouse.id} className="mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title"><strong>{parkhouse.name}</strong></h5>
                      <p className="card-text">
                        <strong>Cím:</strong> {parkhouse.address} <br />
                        <strong>Kapacitás:</strong> {parkhouse.capacity} <br />
                        <strong>Értékelés:</strong> {parkhouse.rating} <br />
                        <strong>Nyitás:</strong> {formattedOpening} <br />
                        <strong>Zárás:</strong> {formattedClosing}
                      </p>
                      <button
                        className="btn btn-sm btn-outline-success mt-2"
                        onClick={() => {
                          setSelectedParkhouseId(parkhouse.id);
                          setActiveView('feedback');
                          setFeedbackView('write');
                          setSelectedRating(0);
                        }}
                      >
                        Értékelés
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'reservations' && reservations.length > 0 && (
        <div className="reservation-list mt-4">
          <h2>Eddigi foglalásaim</h2>
          <ul className="list-group">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="list-group-item">
                <strong>Parkolóhely:</strong> {reservation.park_slot} - 
                <strong> Parkolóház ID:</strong> {reservation.parkhouse_id} - 
                <strong> Időtartam:</strong> {reservation.reservation_time_hour} óra - 
                <strong> Összeg:</strong> {reservation.sum} Ft
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeView === 'feedback' && (
        <div className="feedback-options mt-4">
          {!feedbackView && (
            <div>
              <h2>Visszajelzések</h2>
              <button
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => {
                  setFeedbackView('list');
                  fetchFeedbacks();
                }}
              >
                Eddigi értékelések
              </button>
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setFeedbackView('write')}
              >
                Értékelés írása
              </button>
            </div>
          )}

          {feedbackView === 'list' && (
            <div>
              <h2>Eddigi értékelések</h2>
              {feedbacks.length === 0 ? (
                <p>Nincs még értékelés.</p>
              ) : (
                <ul className="list-group">
                  {feedbacks.map((fb, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>Felhasználó:</strong> {fb.username || 'Ismeretlen'}<br />
                      <strong>Értékelés:</strong> {fb.rating} / 5<br />
                      <strong>Szöveg:</strong> {fb.comment || 'Nincs szöveges értékelés'}
                    </li>
                  ))}
                </ul>
              )}
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setFeedbackView(null)}
              >
                Vissza
              </button>
            </div>
          )}

          {feedbackView === 'write' && (
            <div>
              <h2>Értékelés írása</h2>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= selectedRating ? 'selected' : ''}`}
                    onClick={() => setSelectedRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button className="btn btn-primary mt-3" onClick={handleRatingSubmit}>
                Küldés
              </button>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setFeedbackView(null)}
              >
                Vissza
              </button>
            </div>
          )}
        </div>
      )}

      {activeView === null && (
        <div className="welcome-message">
          <h2>Üdvözlünk a Cickányok parkolóházában!</h2>
          <p>Válassz egy opciót a menüből.</p>
        </div>
      )}
    </>
  );

  const playSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  return (
    <>
      <div className="header d-flex align-items-center justify-content-between p-3 bg-primary text-white">
        <img src="./src/assets/smartcar.png" alt="Logo" className="logo" onClick={playSound} />
        <span className="headerText">Cickányok parkolóháza</span>
      </div>

      <div className="container text-center mt-5">
        {!loggedIN ? (
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <button className="btn btn-primary w-100 mb-3" onClick={handleLoginClick}>
                Login
              </button>
              <button className="btn btn-secondary w-100" onClick={handleRegistrationClick}>
                Registration
              </button>
            </div>
          </div>
        ) : (
          <Menu />
        )}
      </div>

      {loggedIN && (
        <button className="logout-button" onClick={handleLogout}>
          Kijelentkezés
        </button>
      )}

      {showLoginModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bejelentkezés</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="loginUser">Felhasználónév:</label>
                <input
                  type="text"
                  id="loginUser"
                  className="form-control"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                />
                <label htmlFor="loginPassword" className="mt-3">Jelszó:</label>
                <input
                  type="password"
                  id="loginPassword"
                  className="form-control"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleLoginSubmit}>
                  Bejelentkezés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Regisztráció</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="regEmail">Email:</label>
                <br />
                <input
                  type="email"
                  id="regEmail"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <br />
                <label htmlFor="regName">Felhasználónév:</label>
                <br />
                <input
                  type="text"
                  id="regName"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                <br />
                <label htmlFor="regPassword">Jelszó:</label>
                <br />
                <input
                  type="password"
                  id="regPassword"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <br />
                <label htmlFor="regPhone">Telefonszám:</label>
                <br />
                <input
                  type="tel"
                  id="regPhone"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleRegistrationSubmit}>
                  Regisztráció
                </button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Bezárás
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;