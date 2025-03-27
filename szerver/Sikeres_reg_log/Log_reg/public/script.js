const baseUrl = 'http://localhost:3000'; // A helyes IP cím

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const data = {
            registerName: document.getElementById('registerName').value,
            registerUser: document.getElementById('registerUser').value,
            registerEmail: document.getElementById('registerEmail').value,
            registerPassword: document.getElementById('registerPassword').value,
        };
        
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Regisztrációs hiba');
        }

        const result = await response.json();
        alert(result.message || 'Sikeres regisztráció!');
    } catch (error) {
        alert(error.message || 'Hiba történt a regisztráció során');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const data = {
            loginUser: document.getElementById('loginUser').value,
            loginPassword: document.getElementById('loginPassword').value,
        };

        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Bejelentkezési hiba');
        }

        const token = await response.json();
        localStorage.setItem('authToken', token);
        alert('Sikeres bejelentkezés!');
    } catch (error) {
        alert(error.message || 'Hiba történt a bejelentkezés során');
    }
});

