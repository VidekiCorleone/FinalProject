const express = require('express')
const server = express()
require('dotenv').config()
const cors = require('cors');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { Sequelize, DataTypes, Model, SequelizeUniqueConstraintError, Op } = require('sequelize');




server.use(cors({
    origin: 'http://localhost:3000', // Engedélyezd csak a szükséges domaint
    methods: ['GET', 'POST'], // Csak a használt HTTP metódusokat engedélyezd
}));
server.use(express.json())
server.use(express.static('public'))
const PORT = process.env.PORT

const JWT = require('jsonwebtoken')
//middleware

const timeLimit = '1h'
const SUPERSECRET = process.env.SECRETKEY

const dbHandler = require('./dbHandler')
const exp = require('constants');
const { error } = require('console');

// Szinkronizálási sorrend javítása
dbHandler.userTable.sync({ alter: true }) // A 'users' tábla előbb jön létre
    .then(() => dbHandler.carTable.sync({ alter: true })) // Ezután a 'cars' tábla
    .then(() => dbHandler.parkhouseTable.sync({ alter: true }))
    .then(() => dbHandler.reservationTable.sync({ alter: true }))
    .then(() => {
        server.listen(PORT, () => {
            console.log('A szerver a fut a ' + PORT + '-es porton');
        });
    })
    .catch((error) => {
        console.error('Hiba történt a táblák szinkronizálása során:', error);
    });


    const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 perces ablak
        max: 5, // Maximum 5 próbálkozás
        message: 'Túl sok próbálkozás. Kérlek várj!'
    });




server.get('/parkhouse/capacity', async (req, res) => {
    try {
        const parkhouse = await dbHandler.parkhouseTable.findOne({ // Javítva: dbHandler.parkhouse -> dbHandler.parkhouseTable
            where: {
                id: 1 // Az első parkolóház, vagy ahol a parkolóház azonosítója
            }
        });

        if (parkhouse) {
            res.json({ capacity: parkhouse.capacity });
        } else {
            res.status(404).json({ error: 'Parkolóház nem található' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a parkolóház kapacitás lekérdezése során' });
    }
    res.end()
})



const authenticate = () => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Érvénytelen token formátum' 
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = JWT.verify(token, SUPERSECRET);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Érvénytelen vagy lejárt token' 
        });
    }
};

server.get('/profile', authenticate(), async (req, res) => {
    try {
        const user = await dbHandler.userTable.findOne({
            where: { username: req.user.username },
            attributes: { exclude: ['password'] }
        });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Profil betöltési hiba' });
    }
});

server.post('/login', loginLimiter, async (req, res) => {
    try {
        const user = await dbHandler.userTable.findOne({
            where: { username: req.body.loginUser },
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Hibás felhasználónév vagy jelszó'
            });
        }

        const isValidPassword = await bcrypt.compare(
            req.body.loginPassword,
            user.password
        );

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Hibás felhasználónév vagy jelszó'
            });
        }

        const token = JWT.sign(
            { username: user.username, email: user.email, role: user.role },
            SUPERSECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Bejelentkezési hiba' });
    }
});


// Rate limiter middleware


// Regisztrációs endpoint
server.post('/register', async (req, res) => {
    try {
        // Validáció előtt
        const existingUser = await dbHandler.userTable.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.registerUser },
                    { email: req.body.registerEmail }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'Már létezik ilyen felhasználónév vagy email cím!'
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.registerPassword, 10);
        
        const user = await dbHandler.userTable.create({
            username: req.body.registerUser,
            password: hashedPassword,
            email: req.body.registerEmail,
            role: 0,
            name: req.body.registerName,
            phone_num: 12345678,
            reservation_id:0,
            car_id:0,

        });

        const token = JWT.sign(
            { username: user.username, email: user.email, role: user.role },
            SUPERSECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res.status(400).json({
                error: 'Már létezik ilyen felhasználónév vagy email cím!!'
            });
            
        }
        res.status(500).json({ error: 'Regisztrációs hiba'+ error });
    }
});

server.use((err, req, res, next) => {
    if (error instanceof Sequelize.UniqueConstraintError) {
        return res.status(400).json({
            error: 'Már létezik ilyen rekord',
            details: error.errors.map(e => e.message),
        });
    }
    
    if (err instanceof Sequelize.ValidationError) {
        return res.status(400).json({
            error: 'Érvényesítési hiba',
            details: err.errors.map(e => e.message)
        });
    }
    
    res.status(500).json({
        error: 'Belépési hiba történt'
    });
});

