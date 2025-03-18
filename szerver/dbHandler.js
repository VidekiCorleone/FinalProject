const {Sequelize, DataTypes} = require('sequelize')
require('dotenv').config()
const DBNAME = process.env.DBNAME
const USERNAME = 'root'
const PASSWORD = process.env.PASSWORD
const HOST = process.env.HOST

const dbHandler = new Sequelize(DBNAME,USERNAME,PASSWORD,{
    dialect:'mysql',
    host:HOST
})

exports.users = dbHandler.define('user',{
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
})

exports.parkhouse = dbHandler.define('parkhouse',{
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
        type: DataTypes.DATE,
        allowNull: true
    },
    'parkh_id':{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

exports.car = dbHandler.define('car',{
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
    }
})

exports.reservations=dbHandler.define('reservations',{
    'id':{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    'active':{
        type:DataTypes.DATE,
        allowNull:false
    },
    'inactive':{
        type:DataTypes.DATE,
        allowNull:false
    },
    'reservation_time_day':{
        type:DataTypes.DATE,
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
    }
})