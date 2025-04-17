const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { Sequelize, DataTypes, Model, SequelizeUniqueConstraintError, Op } = require('sequelize');

server.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const JWT = require('jsonwebtoken');

server.use(express.json());
server.use(express.static('public'));
const PORT = process.env.PORT;


// Middleware
const timeLimit = '1h';
const SUPERSECRET = process.env.SECRETKEY;

const dbHandler = require('./dbHandler');
const { error } = require('console');

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

server.get('/parkhouse/capacity/:id', async (req, res) => {
    try {
        const { id } = req.params; // Az ID kiolvasása az útvonalból
        const parkhouse = await dbHandler.parkhouseTable.findOne({
            where: { id } // Dinamikus ID használata
        });

        if (parkhouse) {
            res.json({ capacity: parkhouse.capacity }); // Kapacitás visszaküldése
        } else {
            res.status(404).json({ error: 'Parkolóház nem található' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hiba történt a parkolóház kapacitás lekérdezése során' });
    }
});

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
        const userId = req.user.id;

        const user = await dbHandler.userTable.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] }
        });

        if (user) {
            //console.log("KOLBÁSZ");
            //console.log(user)
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
        console.log('Request body:', req.body); // Hibakereséshez

        if (!req.body.registerUser || !req.body.registerPassword || !req.body.registerEmail) {
            return res.status(400).json({ error: 'Hiányzó adat a regisztrációs kérésben!' });
        }

        const existingUser = await dbHandler.userTable.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.registerUser },
                    { email: req.body.registerEmail }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Már létezik ilyen felhasználónév vagy email cím!' });
        }

        const hashedPassword = await bcrypt.hash(req.body.registerPassword, 10);

        const carId = await dbHandler.userTable.getNextCarId();
        const reservationId = await dbHandler.userTable.getNextReservationId();

        const user = await dbHandler.userTable.create({
            username: req.body.registerUser,
            password: hashedPassword,
            email: req.body.registerEmail,
            role: 0,
            name: req.body.registerName,
            phone_num: req.body.registerPhone || '12345678',
            car_id: carId,
            reservation_id: reservationId
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
        error: 'Belépési hiba történt!!'
    });
});

// Bejelentkezés ID alapú tokennel
server.post('/login', loginLimiter, async (req, res) => {
    try {
        const user = await dbHandler.userTable.findOne({
            where: { username: req.body.loginUser }
        });

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
            id: user.id
        });
    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        res.status(500).json({ error: 'Bejelentkezési hiba!' });
    }
});

server.post('/registerCar', authenticate(), async (req, res) => {
    try {
        const { plate, height, type } = req.body;
        const user = await dbHandler.userTable.findOne({ where: { id: req.user.id } });
        const ownerId = user ? user.car_id : null;

        if (!plate || !height || !type) {
            return res.status(400).json({ error: 'Hiányzó adat az autó regisztrációhoz!' });
        }

        const existingCar = await dbHandler.carTable.findOne({
            where: { plate }
        });

        if (existingCar) {
            return res.status(400).json({ error: 'Ez a rendszám már regisztrálva van!' });
        }

        const car = await dbHandler.carTable.create({
            plate,
            height,
            type,
            owner_id: ownerId
        });

        res.status(201).json({
            message: 'Az autó sikeresen regisztrálva lett!',
            car
        });
    } catch (error) {
        console.error('Autó regisztrációs hiba:', error);
        res.status(500).json({ error: 'Hiba történt az autó regisztrációja során!' });
    }
});


server.put('/updateCar', authenticate(), async (req, res) => {
    try {
        const { plate, height, type } = req.body;
        const ownerId = req.user.id;


        if (!plate && !height && !type) {
            return res.status(400).json({ error: 'Nincs megadva módosítandó adat!' });
        }

        const car = await dbHandler.carTable.findOne({
            where: { owner_id: ownerId }
        });

        if (!car) {
            return res.status(404).json({ error: 'Az autó nem található vagy nem tartozik hozzád!' });
        }


        car.plate = plate || car.plate;
        car.height = height || car.height;
        car.type = type || car.type;

        await car.save();

        res.json({ message: 'Az autó adatai sikeresen frissítve!', car });
    } catch (error) {
        console.error('Autó adat módosítási hiba:', error);
        res.status(500).json({ error: 'Hiba történt az autó adatainak módosításakor!' });
    }
});




server.get('/parkhouses', async (req, res) => {
    try {
        const parkhouses = await dbHandler.parkhouseTable.findAll();
        res.json(parkhouses);
    } catch (error) {
        console.error('Hiba a parkolóházak lekérdezésekor:', error);
        res.status(500).json({ error: 'Nem sikerült lekérni a parkolóházakat' });
    }
});

server.put('/changePassword', authenticate(), async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await dbHandler.userTable.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'Felhasználó nem található!' });
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Hibás régi jelszó!' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Jelszó sikeresen frissítve!' });
    } catch (error) {
        console.error('Jelszó módosítási hiba:', error);
        res.status(500).json({ error: 'Hiba történt a jelszó módosítása során!' });
    }
});



//Admin lekérdezések

server.post('/loginAdmin', async (req, res) => {
    try {
        const user = await dbHandler.userTable.findOne({
            where: { username: req.body.loginUser, role: 2 }
        });

        if (!user || !user.password || !user.role) {
            return res.status(401).json({ error: 'Hibás felhasználónév, jelszó vagy nem megfelelő jogosultság.' });
        }

        const isValidPassword = await bcrypt.compare(req.body.loginPassword, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Hibás felhasználónév vagy jelszó' });
        }

        const token = JWT.sign(
            { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
            SUPERSECRET,
            { expiresIn: '1h' }
        );

        //console.log(token)
        //console.log(user)
        res.json({ "token": token, 'id': user.id, 'name': user.name, 'username': user.username, 'email': user.email, 'phone_num': user.phone_num, 'role': user.role });
    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        res.status(500).json({ error: 'Bejelentkezési hiba' });
    }
});

server.get('/profileAdmin', authenticate(), async (req, res) => {
    try {
        const user = await dbHandler.userTable.findAll()
        if (!user) {
            res.status(404).json({ error: "Nincs felhasználó!" })
        }
        else {
            res.json(user)
        }
    } catch (error) {
        console.error('profil lekérdezési hiba: ', error)
        res.status(500).json({ error: "Profil lekérdezési hiba!" })
    }
})

server.put('/profileDataUpdateAdmin/:id', authenticate(), async (req, res) => {
    try {
        const { username, password, name, email, phone_num } = req.body;

        const user = await dbHandler.userTable.findOne({ where: { id: req.params.id } });

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