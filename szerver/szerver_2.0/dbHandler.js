const {Sequelize, DataTypes, Model } = require('sequelize')
require('dotenv').config()
const DBNAME = process.env.DBNAME
const USERNAME = 'root'
const PASSWORD = process.env.PASSWORD
const HOST = process.env.HOST

const dbHandler = new Sequelize(DBNAME,USERNAME,PASSWORD,{
    dialect:'mysql',
    host:HOST    
})

class User extends Model{}

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
        allowNull: false
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
        type: DataTypes.STRING,
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

// exports.users = dbHandler.define('user',{    
// })

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
    'parkh_id':{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize:dbHandler,
    modelName:'parkhouse'
})

//exports.parkhouse = dbHandler.define('parkhouse',

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
        allowNull:false,
    }
},{
    sequelize:dbHandler,
    modelName:'car'
})


//exports.car = dbHandler.define('car',
//})

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
        allowNull:false
    }
},{
   sequelize:dbHandler,
   modelName:'reservation'
})

//exports.reservations=dbHandler.define('reservations',
//})

exports.userTable = User
exports.parkhouseTable = Parkhouse
exports.carTable = Car
exports.reservationTable = Reservation
