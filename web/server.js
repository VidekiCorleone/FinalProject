const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { Sequelize, DataTypes, Model, SequelizeUniqueConstraintError, Op, DATE } = require('sequelize');

const allowedOrigins = [
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
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
    .then(() => dbHandler.ratingTable.sync({ alter: true })) // EZT ADD HOZZÁ
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



//RESERVATION (down below)

const checkReservationExpiryOptimized = async () => {
    try {
        const now = new Date();

        // Csak azok a foglalások, amelyek kezdési ideje alapján lehetséges, hogy lejártak
        const reservations = await dbHandler.reservationTable.findAll({
            where: {
                active: true,
                start_time: {
                    [Op.lte]: new Date(now.getTime() - 2 * 60 * 60 * 1000) // Az elmúlt 2 órán belüli foglalások
                }
            }
        });

        const expiredReservations = [];
        reservations.forEach(async (reservation) => {
            const startTime = reservation.start_time;
            const expiryTime = new Date(startTime.getTime() + reservation.reservation_time_hour * 60 * 60 * 1000);

            if (now > expiryTime) {
                // A foglalás lejárt
                await reservation.update({ active: false, inactive: true });
                expiredReservations.push(reservation.id);
            }
        });

        console.log('Lejárt foglalások:', expiredReservations);
    } catch (error) {
        console.error('Hiba a foglalások ellenőrzésekor:', error);
    }
};

checkReservationExpiryOptimized();


server.get('/checkReservations', authenticate(), async (req, res) => {
    try {
        const reservations = await dbHandler.reservationTable.findAll({
            where: { active: true } // Csak az aktív foglalásokat ellenőrizd
        });

        const now = new Date();
        const expiredReservations = [];

        reservations.forEach(async (reservation) => {
            const startTime = reservation.start_time;
            const duration = reservation.reservation_time_hour; // Foglalási idő órában
            const expiryTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

            if (now > expiryTime) {
                // Frissítsd a státuszt, ha lejárt
                await reservation.update({ active: false, inactive: true });
                expiredReservations.push(reservation.id);
            }
        });

        res.json({ message: 'Foglalások ellenőrizve!', expiredReservations });
    } catch (error) {
        console.error('Hiba a foglalások ellenőrzésekor:', error);
        res.status(500).json({ error: 'Hiba történt a foglalások ellenőrzése során!' });
    }
});

setInterval(async () => {
    const reservations = await dbHandler.reservationTable.findAll({ where: { active: true } });
    const now = new Date();

    reservations.forEach(async (reservation) => {
        const startTime = reservation.start_time;
        const expiryTime = new Date(startTime.getTime() + reservation.reservation_time_hour * 60 * 60 * 1000);

        if (now > expiryTime) {
            await reservation.update({ active: false, inactive: true });
            console.log(`Foglalás ${reservation.id} lejárt.`);
        }
    });
}, 60000);





server.post('/reserve', authenticate(), async (req, res) => {
    try {
        const { slotId, parkhouseId, reserveTime } = req.body;
        const userId = req.user.id;
        

        // Ellenőrizd, hogy a parkolóhely szabad-e
        const existingReservation = await dbHandler.reservationTable.findOne({
            where: {
                park_slot: slotId,
                parkhouse_id: parkhouseId,
                active: true
            }
        });

        if (existingReservation) {
            return res.status(400).json({ error: 'A parkolóhely már foglalt!' });
        }
        
        // Új foglalás létrehozása
        const reservation = await dbHandler.reservationTable.create({
            
            park_slot: slotId,
            parkhouse_id: parkhouseId,
            reservation_owner_id: userId,
            active: true,
            inactive: false,
            reservation_time_hour: reserveTime,
            sum: 1300 ,
            start_time: req.body.startTime // Start time mentése

        });

        res.status(201).json({ message: 'Foglalás sikeresen létrehozva!', reservation });
    } catch (error) {
        console.error('Foglalási hiba:', error);
        res.status(500).json({ error: 'Hiba történt a foglalás során!' });
    }
});
// RESERVATION END!

server.post('/rateParkhouse', authenticate(), async (req, res) => {
    try {
        const { parkhouseId, rating } = req.body;
        const userId = req.user.id;

        if (!parkhouseId || !rating) {
            return res.status(400).json({ error: 'Hiányzó adatok!' });
        }

        // Új értékelés mentése
        await dbHandler.ratingTable.create({
            user_id: userId,
            parkhouse_id: parkhouseId,
            rating: rating
        });

        // Átlag újraszámolása
        const allRatings = await dbHandler.ratingTable.findAll({
            where: { parkhouse_id: parkhouseId }
        });

        const avg = allRatings.length > 0
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
            : 0;

        // Frissítsd a parkolóház rekordját az új átlaggal
        await dbHandler.parkhouseTable.update(
            { rating: avg },
            { where: { id: parkhouseId } }
        );

        res.json({ message: 'Értékelés sikeresen mentve!', averageRating: avg });
    } catch (error) {
        console.error('Hiba az értékelés mentése során:', error);
        res.status(500).json({ error: 'Hiba történt az értékelés mentése során!' });
    }
});

//Admin lekérdezések

//Login

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

//user routes

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

server.delete('/userProfileDeleteAdmin/:id', authenticate(), async (req, res) => {
    const user = await dbHandler.userTable.findOne({ where: { id: req.params.id } })

    if (!user) {
        return res.status(404).json({ error: 'Felhasználó nem található!' })
    }

    await dbHandler.userTable.destroy({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ 'message': 'Felhasználó sikeresen törölve!' }).end()
})

server.post('/registerUser', authenticate(), async (req, res) => {
    const existingUser = await dbHandler.userTable.findOne({
        where: {
            email: req.body.registerEmail
        }
    })

    try {
        if (existingUser) {
            return res.status(409).json({ error: "Már létezik felhasználó ilyen e-mail címmel!" })
        }
    
        const hashedPassword = await bcrypt.hash(req.body.registerPassword, 10);
    
        const carId = await dbHandler.userTable.getNextCarId();
        const reservationId = await dbHandler.userTable.getNextReservationId();
    
        const user = await dbHandler.userTable.create({
            username: req.body.registerUser,
            password: hashedPassword,
            email: req.body.registerEmail,
            role: req.body.registerRole,
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
        console.error("Létrehozási hiba!", error)
        res.status(500).json({ error : "Hiba történt a felhasználó létrehozásakor."})
    }
})

//reservation routes

server.get('/reservationAdmin', authenticate(), async (req, res) => {
    try {
        const reservation = await dbHandler.reservationTable.findAll()

        if (!reservation) {
            res.status(404).json({ error: "Nincs foglalás!" })
        }
        else {
            res.json(reservation)
        }
    } catch (error) {
        console.error('Foglalás lekérdezési hiba: ', error)
        res.status(500).json({ error: "Foglalás lekérdezési hiba!" })
    }
})

server.put('/reservationUpdateAdmin/:id', authenticate(), async (req, res) => {
    try {
        const { active, sum, reservation_owner_id, park_slot, parkhouse_id } = req.body;

        const reserve = await dbHandler.reservationTable.findOne({ where: { id: req.params.id } });

        if (!reserve) {
            return res.status(404).json({ error: 'Foglalás nem található!' });
        }

        reserve.active = active || reserve.active;
        reserve.sum = sum || reserve.sum
        reserve.reservation_owner_id = reservation_owner_id || reserve.reservation_owner_id;
        reserve.park_slot = park_slot || reserve.park_slot;
        reserve.parkhouse_id = parkhouse_id || reserve.parkhouse_id;

        await reserve.save();

        res.json({ message: 'Foglalás sikeresen frissítve', reserve });
    } catch (error) {
        console.error('Frissítési hiba:', error);
        res.status(500).json({ error: 'Hiba történt az foglalás frissítésekor!' });
    }
});

server.delete('/reservationDeleteAdmin/:id', authenticate(), async(req, res) => {
    const reserve = await dbHandler.reservationTable.findOne({
        where:{
            id: req.params.id
        }
    })

    if(!reserve){
        return res.status(404).json({ error : 'Foglalás nem található!'})
    }

    await dbHandler.reservationTable.destroy({
        where:{
            id: req.params.id
        }
    })
    res.status(200).json({'message' : 'Sikeres törlés!'}).end()
})

server.post('/registerReservationAdmin', authenticate(), async (req, res) => {
    const { start_time, resTime, resOwnId, slotId, parkhouseId } = req.body

    const existingReservation = await dbHandler.reservationTable.findOne({
        where: {
            active: true,
            park_slot: slotId,
            parkhouse_id: parkhouseId
        }
    })

    try {
        if (existingReservation) {
            return res.status(409).json({ error: "A parkolóhely foglalt!" })
        }
    
        const reserve = await dbHandler.reservationTable.create({
            start_time: start_time,
            active: true,
            inactive: false,
            reservation_time_hour: resTime,
            sum: resTime * 700,
            reservation_owner_id: resOwnId,
            park_slot: slotId,
            parkhouse_id: parkhouseId
        });
    
        res.status(201).json({ message : "Foglalás sikeresen létrehozva!", reserve })
        
    } catch (error) {
        console.error("Létrehozási hiba!", error)
        res.status(500).json({ error : "Hiba történt a foglalás létrehozásakor."})
    }
})

//parkhouse routes

server.get('/parkhouseAdmin', authenticate(), async (req, res) => {
    try {
        const garage = await dbHandler.parkhouseTable.findAll()

        if (!garage) {
            res.status(404).json({ error: "Nincs létező parkolóházad!" })
        }
        else {
            res.json(garage)
        }
    } catch (error) {
        console.error('Foglalás lekérdezési hiba: ', error)
        res.status(500).json({ error: "Foglalás lekérdezési hiba!" })
    }
})

server.put('/parkhousesUpdateAdmin/:id', authenticate(), async (req, res) => {
    try {
        const { name, capacity, address, opening, closing } = req.body;

        const pHouse = await dbHandler.parkhouseTable.findOne({ where: { id: req.params.id } });

        if (!pHouse) {
            return res.status(404).json({ error: 'Parkolóház nem található!' });
        }

        pHouse.name = name || pHouse.name;
        pHouse.capacity = capacity || pHouse.capacity;
        pHouse.address = address || pHouse.address;
        pHouse.opening = opening || pHouse.opening;
        pHouse.closing = closing || pHouse.closing;

        await pHouse.save();

        res.json({ message: 'Parkolóház sikeresen frissítve', pHouse });
    } catch (error) {
        console.error('Frissítési hiba:', error);
        res.status(500).json({ error: 'Hiba történt a parkolóház frissítésekor!' });
    }
})

server.delete('/parkhouseDeleteAdmin/:id', authenticate(), async(req, res) => {
    const pHouse = await dbHandler.parkhouseTable.findOne({
        where:{
            id: req.params.id
        }
    })

    if(!pHouse){
        return res.status(404).json({ error : 'Foglalás nem található!'})
    }

    await dbHandler.parkhouseTable.destroy({
        where:{
            id: req.params.id
        }
    })
    res.status(200).json({'message' : 'Sikeres törlés!'}).end()
})

server.post('/registerParkhouseAdmin', authenticate(), async (req, res) => {
    const { pName, pCapacity, add, open, close, cHeight, maxstay } = req.body

    const existingParkhouse = await dbHandler.parkhouseTable.findOne({
        where: {
            name: pName,
            address: add
        }
    })

    try {
        if (existingParkhouse) {
            return res.status(409).json({ error: "Ez a parkolóház már létezik!" })
        }
    
        const reserve = await dbHandler.parkhouseTable.create({
            name: pName,
            capacity: pCapacity,
            address: add,
            rating: 0, //default
            opening: open,
            closing: close,
            car_height: cHeight,
            max_stay_time: maxstay
        });
    
        res.status(201).json({ message : "Parkolóház sikeresen létrehozva!", reserve })
        
    } catch (error) {
        console.error("Létrehozási hiba!", error)
        res.status(500).json({ error : "Hiba történt a parkolóház létrehozásakor."})
    }
})

server.get('/feedbacks', authenticate(), async (req, res) => {
    try {
        const feedbacks = await dbHandler.ratingTable.findAll();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Nem sikerült lekérni az értékeléseket!' });
    }
});