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
      const response = await fetch('http://127.0.0.1:3000/parkhouses');
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
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      <div className="menu-buttons bg-light p-3 rounded shadow w-100">
        <h1 className="h5 text-center mb-4">Menü</h1>
        <div className="row g-2">
          <div className="col-12">
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
          <div className="col-12">
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
          <div className="col-12">
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
  );

  const playSound = () => {
    const audio = new Audio(clickSound);
    audio.play();
  };

  return (
    <>
      {/* Fix fejléc */}
      <div className="container-fluid p-0 header-fixed">
        <div className="d-flex align-items-center justify-content-between bg-primary text-white px-3 py-2 position-relative header-bar">
          <div className="d-flex align-items-center">
            <img src="./src/assets/smartcar.png" alt="Logo" style={{height: 36, width: 36, objectFit: 'contain'}} className="me-2"/>
            <span className="fs-5 fw-bold">Cickányok parkolóháza</span>
          </div>
          {loggedIN && (
            <button
              className="btn btn-danger"
              style={{zIndex: 10}}
              onClick={handleLogout}
            >
              Kijelentkezés
            </button>
          )}
        </div>
      </div>

      {/* Tartalom paddinggel, hogy ne takarja a fejléc */}
      <div className="container-fluid main-content">
        <div className="row h-100">
          {/* Bal oldali menü (desktopon balra, mobilon felül) */}
          {loggedIN && (
            <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center align-items-center" style={{minHeight: '60vh'}}>
              <Menu />
            </div>
          )}

          {/* Középső tartalom */}
          <div className={`col-12 ${loggedIN ? 'col-md-9' : ''} d-flex flex-column align-items-center justify-content-center`}>
            <div className="w-100">
              {!loggedIN ? (
                <div className="row w-100 justify-content-center mt-5">
                  <div className="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center gap-2">
                    <button
                      className="btn btn-primary px-4 py-2 custom-btn-fit"
                      onClick={handleLoginClick}
                      style={{width: 'auto', minWidth: 0}}
                    >
                      Login
                    </button>
                    <button
                      className="btn btn-secondary px-4 py-2 custom-btn-fit"
                      onClick={handleRegistrationClick}
                      style={{width: 'auto', minWidth: 0}}
                    >
                      Registration
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Aktív opció tartalma */}
                  {activeView === 'userData' && showUserData && userData && (
                    <div className="user-data container mt-4">
                      <div className="card mx-auto" style={{maxWidth: 400}}>
                        <div className="card-body">
                          <h2 className="h5 mb-3">Felhasználói adatok</h2>
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
                      </div>
                    </div>
                  )}

                  {activeView === 'parkhouses' && parkhouses.length > 0 && (
                    <div className="container mt-4">
                      <h2 className="h5 mb-3 text-center">Parkolóházak listája</h2>
                      <div className="row g-3">
                        {parkhouses.map((parkhouse) => {
                          const openingTime = parkhouse.opening ? new Date(parkhouse.opening) : null;
                          const closingTime = parkhouse.closing ? new Date(parkhouse.closing) : null;

                          const formattedOpening =
                            openingTime && !isNaN(openingTime.getTime())
                              ? openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                              : 'N/A';
                          const formattedClosing =
                            closingTime && !isNaN(closingTime.getTime())
                              ? closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                              : 'N/A';

                          return (
                            <div key={parkhouse.id} className="col-12">
                              <div className="card shadow-sm">
                                <div className="card-body">
                                  <h5 className="card-title"><strong>{parkhouse.name}</strong></h5>
                                  <p className="card-text mb-2">
                                    <strong>Cím:</strong> {parkhouse.address} <br />
                                    <strong>Kapacitás:</strong> {parkhouse.capacity} <br />
                                    <strong>Értékelés:</strong> {parkhouse.rating} <br />
                                    <strong>Nyitás:</strong> {formattedOpening} <br />
                                    <strong>Zárás:</strong> {formattedClosing}
                                  </p>
                                  <button
                                    className="btn btn-sm btn-outline-success w-100"
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
                    <div className="container mt-4">
                      <h2 className="h5 mb-3 text-center">Eddigi foglalásaim</h2>
                      <ul className="list-group mx-auto" style={{maxWidth: 400}}>
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
                    <div className="container mt-4">
                      <div className="feedback-options mx-auto" style={{maxWidth: 400}}>
                        {feedbackView === 'write' && (
                          <div>
                            <h2 className="h5 mb-3 text-center">Értékelés írása</h2>
                            <div className="rating text-center mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`star ${star <= selectedRating ? 'selected' : ''}`}
                                  style={{fontSize: 32, cursor: 'pointer'}}
                                  onClick={() => setSelectedRating(star)}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <button className="btn btn-primary w-100 mb-2" onClick={handleRatingSubmit}>
                              Küldés
                            </button>
                            <button
                              className="btn btn-secondary w-100"
                              onClick={() => setFeedbackView(null)}
                            >
                              Vissza
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeView === null && (
                    <div className="welcome-message container mt-5">
                      <div className="card mx-auto p-4" style={{maxWidth: 400}}>
                        <h2 className="h5 text-center mb-3">Üdvözlünk a Cickányok parkolóházában!</h2>
                        <p className="text-center">Válassz egy opciót a menüből.</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
                <input
                  type="email"
                  id="regEmail"
                  className="form-control mb-2"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <label htmlFor="regName">Felhasználónév:</label>
                <input
                  type="text"
                  id="regName"
                  className="form-control mb-2"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                <label htmlFor="regPassword">Jelszó:</label>
                <input
                  type="password"
                  id="regPassword"
                  className="form-control mb-2"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <label htmlFor="regPhone">Telefonszám:</label>
                <input
                  type="tel"
                  id="regPhone"
                  className="form-control"
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