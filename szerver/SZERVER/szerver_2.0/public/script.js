const baseUrl = 'http://127.1.1.1:3000'; // Cseréld le a PORT-ot az aktuális szerver portjára

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    registerName: document.getElementById('registerName').value,
    registerUser: document.getElementById('registerUser').value,
    registerEmail: document.getElementById('registerEmail').value,
    registerPassword: document.getElementById('registerPassword').value,
  };

  const response = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  alert(result.message || 'Hiba történt');
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    loginUser: document.getElementById('loginUser').value,
    loginPassword: document.getElementById('loginPassword').value,
  };

  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const token = await response.text();
  alert(token || 'Hiba történt');
});
