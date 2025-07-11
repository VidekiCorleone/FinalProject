const {Sequelize, DataTypes, Model, Op} = require('sequelize')
require('dotenv').config()
const DBNAME = process.env.DBNAME
const USERNAME = 'root'
const PASSWORD = process.env.PASSWORD
const HOST = process.env.HOST

const dbHandler = new Sequelize(DBNAME,USERNAME,PASSWORD,{
    dialect:'mysql',
    host:HOST    
})

class User extends Model{

    static async getNextCarId() {
        try {
            const lastUser = await User.findOne({
                order: [['car_id', 'DESC']]
            });

            return lastUser ? lastUser.car_id + 1 : 1000; // Kezdő érték
        } catch (error) {
            console.error('getNextCarId error:', error);
            throw new Error('Cannot determine next car ID');
        }
    }

    static async getNextReservationId() {
        try {
            const lastUser = await User.findOne({
                order: [['reservation_id', 'DESC']]
            });

            return lastUser ? lastUser.reservation_id + 1 : 2000; // Kezdő érték
        } catch (error) {
            console.error('getNextReservationId error:', error);
            throw new Error('Cannot determine next reservation ID');
        }
    }

}

User.init({
    'id':{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    'name':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'car_id':{
        type: DataTypes.INTEGER,
        allowNull: true, // Engedélyezi a NULL értéket
        unique: true,
        
    },
    'reservation_id':{
        type: DataTypes.INTEGER,
        allowNull: true, // Engedélyezi a NULL értéket
        unique: true,
        
    },
    'email':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'phone_num':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'role':{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'username':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'password':{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize:dbHandler,
    modelName:'user'
})

class Parkhouse extends Model{}

Parkhouse.init({
    'id':{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    'capacity':{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'address':{
        type: DataTypes.STRING,
        allowNull: false
    },
    'rating':{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    'opening':{
        type: DataTypes.DATE,
        allowNull: false
    },
    'closing':{
        type: DataTypes.DATE,
        allowNull: false
    },
    'car_height':{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    'max_stay_time':{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    'parkslot_id':{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize:dbHandler,
    modelName:'parkhouse'
})

class Car extends Model{}

Car.init({
    'id':{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    'plate':{
        type:DataTypes.STRING,
        allowNull:false,
    },
    'height':{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    'type':{
        type:DataTypes.STRING,
        allowNull:false,
    },
    'owner_id':{
        type:DataTypes.INTEGER,
        allowNull:false 
    },
},{
    sequelize:dbHandler,
    modelName:'car'
})

class Reservation extends Model{};

Reservation.init({
    'id':{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    'active':{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    'inactive':{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    'reservation_time_hour':{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    'sum':{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    'reservation_owner_id':{
        type:DataTypes.INTEGER,
        allowNull:false

    },
    'park_slot':{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    'parkhouse_id':{
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model: 'parkhouses', // A 'Parkhouse' tábla neve
            key: 'id'            // A 'Parkhouse' tábla kulcsa
        }
    }
},{
   sequelize:dbHandler,
   modelName:'reservation'
})

class Rating extends Model{}

Rating.init({
    'id':{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    'user_id':{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    'parkhouse_id':{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    'rating':{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
   sequelize:dbHandler,
   modelName:'rating'
})

// Define associations
User.hasOne(Car, {
    foreignKey: 'owner_id',
    sourceKey: 'car_id',
    as: 'car'
});

Car.belongsTo(User, {
    foreignKey: 'owner_id',
    targetKey: 'car_id',
    as: 'owner'
});

User.hasOne(Reservation, {
    foreignKey: 'reservation_owner_id',
    sourceKey: 'reservation_id',
    as: 'reservation'
});

Reservation.belongsTo(User, {
    foreignKey: 'reservation_owner_id',
    targetKey: 'reservation_id',
    as: 'owner'
});

Parkhouse.hasMany(Reservation, {
    foreignKey: 'parkhouse_id',
    sourceKey: 'id',
    as: 'reservations'
});

Reservation.belongsTo(Parkhouse, {
    foreignKey: 'parkhouse_id',
    targetKey: 'id',
    as: 'parkhouse'
});

// A User modellhez tartozó metódusok hozzáadása
User.getNextCarId = async () => {
  try {
    const lastUser = await User.findOne({
      order: [['car_id', 'DESC']],
    });

    return lastUser ? lastUser.car_id + 1 : 1000; // Kezdő érték
  } catch (error) {
    console.error('getNextCarId error:', error);
    throw new Error('Cannot determine next car ID');
  }
};

User.getNextReservationId = async () => {
  try {
    const lastUser = await User.findOne({
      order: [['reservation_id', 'DESC']],
    });

    return lastUser ? lastUser.reservation_id + 1 : 2000; // Kezdő érték
  } catch (error) {
    console.error('getNextReservationId error:', error);
    throw new Error('Cannot determine next reservation ID');
  }
};

exports.userTable = User;
exports.parkhouseTable = Parkhouse;
exports.carTable = Car;
exports.reservationTable = Reservation;
exports.ratingTable = Rating;