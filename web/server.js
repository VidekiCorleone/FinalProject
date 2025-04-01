const express = require('express')
const cors = require('cors')
const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')
const server = express()
const bcrypt = require('bcrypt')
require('dotenv').config()
const {Sequelize, DataTypes, Model,SequalizeUniqueConstraintError, Op} = require('sequelize')
const app = express()

// Middleware beállítások
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// CORS konfiguráció
{const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173'
];

server.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Nem engedélyezett eredet'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));}


// Adatbázis szinkronizáció
Promise.all([
    dbHandler.userTable.sync({ alter: true }),
    dbHandler.carTable.sync({ alter: true }),
    dbHandler.parkhouseTable.sync({ alter: true }),
    dbHandler.reservationTable.sync({ alter: true })
]).then(() => {
    server.listen(3000, () => {
        console.log('Szerver fut a 3000-es porton')
    })
}).catch(error => {
    console.error('Hiba a táblák szinkronizálása során:', error)
    process.exit(1)
})

server.post('/registration', async (req, res) => {
    try {
        console.log('Regisztrációs kérés:', req.body);

        if (!req.body.registerName || !req.body.registerPassword || !req.body.registerEmail) {
            return res.status(400).json({ error: 'Hiányzó adat a regisztrációs kérésben!' });
        }

        const existingUser = await dbHandler.userTable.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.registerName },
                    { email: req.body.registerEmail }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Már létezik ilyen felhasználónév vagy email cím!' });
        }

        const hashedPassword = await bcrypt.hash(req.body.registerPassword, 10);

        const user = await dbHandler.userTable.create({
            username: req.body.registerName,
            password: hashedPassword,
            email: req.body.registerEmail,
            role: 0,
            name: req.body.registerName,
            phone_num: req.body.registerPhone || '123456789',
            car_id: req.body.car_id || 0, // Alapértelmezett érték
            reservation_id: req.body.reservation_id || 0, // Alapértelmezett érték
        });

        return res.status(201).json({ message: 'Sikeres regisztráció' });
    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        return res.status(500).json({ error: 'Regisztrációs hiba történt!' });
    }
});

// Bejelentkezési végpont
server.post('/login', async (req, res) => {
    try {
        // Kötelező mezők ellenőrzése
        if (!req.body.loginEmail || !req.body.loginPassword) {
            return res.status(400).json({
                error: 'Hiányzó email vagy jelszó!'
            });
        }

        // Felhasználó keresése email alapján
        const user = await dbHandler.userTable.findOne({
            where: { email: req.body.loginEmail }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Hibás email vagy jelszó'
            });
        }

        // Jelszó ellenőrzése
        const isValidPassword = await bcrypt.compare(
            req.body.loginPassword,
            user.password
        );

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Hibás email vagy jelszó'
            });
        }

        // JWT token generálása
        const token = JWT.sign(
            {
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.SECRETKEY,
            { expiresIn: '1h' }
        );

        // Sikeres válasz
        return res.status(200).json({
            message: 'Sikeres belépés',
            token: token
        });

    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        return res.status(500).json({
            error: 'Bejelentkezési hiba történt!',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});