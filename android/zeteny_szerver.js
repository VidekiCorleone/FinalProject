const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { Sequelize, DataTypes, Model, Op } = require('sequelize');

server.use(cors({
    origin: 'http://localhost:3000', // Engedélyezett kliens
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(express.json());
server.use(express.static('public'));
const PORT = process.env.PORT;

const JWT = require('jsonwebtoken');

// Middleware
const timeLimit = '1h';
const SUPERSECRET = process.env.SECRETKEY;

const dbHandler = require('./dbHandler');

dbHandler.userTable.sync({ alter: true })
    .then(() => dbHandler.carTable.sync({ alter: true }))
    .then(() => dbHandler.parkhouseTable.sync({ alter: true }))
    .then(() => dbHandler.reservationTable.sync({ alter: true }))
    .then(() => {
        server.listen(PORT, () => {
            console.log(`A szerver fut a ${PORT}-es porton`);
        });
    })
    .catch((error) => {
        console.error('Hiba történt a táblák szinkronizálása során:', error);
    });

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Túl sok próbálkozás. Kérlek várj!'
});

server.get('/parkhouse/capacity', async (req, res) => {
    try {
        const parkhouse = await dbHandler.parkhouseTable.findOne({
            where: { id: 1 }
        });

        if (parkhouse) {
            res.json({ capacity: parkhouse.capacity });
        } else {
            res.status(404).json({ error: 'Parkolóház nem található' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a parkolóház kapacitás lekérdezése során' });
    }
    res.end();
});

const authenticate = () => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Érvénytelen token formátum' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = JWT.verify(token, SUPERSECRET);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Érvénytelen vagy lejárt token' });
    }
};


server.get('/profile', authenticate(), async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await dbHandler.userTable.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] } // Ezt ideiglenesen módosítani kell, ha jelszót akarsz látnid
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Felhasználó nem található!' });
        }
    } catch (error) {
        console.error('Profil lekérdezési hiba:', error);
        res.status(500).json({ error: 'Profil lekérdezési hiba!' });
    }
});


server.put('/profileDataUpdate', authenticate(), async (req, res) => {
    try {
        const { username, password, name, email, phone_num } = req.body;
        const userId = req.user.id;
        

        const user = await dbHandler.userTable.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'Felhasználó nem található!' });
        }

        user.username = username || user.username;
        user.password = password ? await bcrypt.hash(password, 10) : user.password;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone_num = phone_num || user.phone_num;

        await user.save();
        res.json({ message: 'Adatok sikeresen frissítve', user });
    } catch (error) {
        console.error('Frissítési hiba:', error);
        res.status(500).json({ error: 'Hiba történt az adatok frissítésekor!' });
    }
});

// Felhasználó regisztráció
server.post('/register', async (req, res) => {
    try {
        if (!req.body.registerUser || !req.body.registerPassword || !req.body.registerEmail) {
            return res.status(400).json({ error: 'Hiányzó adat a regisztrációs kérésben!' });
        }

        const existingUser = await dbHandler.userTable.findOne({
            where: { [Op.or]: [{ username: req.body.registerUser }, { email: req.body.registerEmail }] }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Már létezik ilyen felhasználónév vagy email cím!' });
        }

        const hashedPassword = await bcrypt.hash(req.body.registerPassword, 10);

        const user = await dbHandler.userTable.create({
            username: req.body.registerUser,
            password: hashedPassword,
            email: req.body.registerEmail,
            role: 0,
            name: req.body.registerName,
            phone_num: req.body.registerPhone || '12345678'
        });

        const token = JWT.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            SUPERSECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        res.status(500).json({ error: 'Regisztrációs hiba!' });
    }
});

// Hibakezelés
server.use((err, req, res, next) => {
    if (err instanceof Sequelize.UniqueConstraintError) {
        return res.status(400).json({ error: 'Már létezik ilyen rekord', details: err.errors.map(e => e.message) });
    }
    
    if (err instanceof Sequelize.ValidationError) {
        return res.status(400).json({ error: 'Érvényesítési hiba', details: err.errors.map(e => e.message) });
    }
    
    res.status(500).json({ error: 'Belépési hiba történt!' });
});

// Bejelentkezés ID alapú tokennel
server.post('/login', loginLimiter, async (req, res) => {
    try {
        const user = await dbHandler.userTable.findOne({ where: { username: req.body.loginUser } });

        if (!user || !user.password) {
            return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
        }

        const isValidPassword = await bcrypt.compare(req.body.loginPassword, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
        }

        const token = JWT.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            SUPERSECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            id:user.id
            });
    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        res.status(500).json({ error: 'Bejelentkezési hiba!' });
    }
});
