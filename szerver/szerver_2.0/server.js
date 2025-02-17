const express = require('express')
const server = express()
require('dotenv').config()

server.use(express.json())
server.use(express.static('public'))
const PORT = process.env.PORT

const JWT = require('jsonwebtoken')
//middleware

const timeLimit = '1h'
const SUPERSECRET = process.env.SECRETKEY


const dbHandler = require('./dbHandler')
const exp = require('constants')

dbHandler.car.sync({alter:true})
dbHandler.reservations.sync({alter:true})
dbHandler.users.sync({alter:true})
dbHandler.parkhouse.sync({alter:true})

server.get('/parkhouse/capacity', async (req, res) => {
    const parkhouse = await dbHandler.parkhouse.findOne({
        where: {
            id: 1 // Az első parkolóház, vagy ahol a parkolóház azonosítója
        }
    });

    if (parkhouse) {
        res.json({ capacity: parkhouse.capacity });
    } else {
        res.status(404).json({ error: 'Parkolóház nem található' });
    }
})

function authenticate(){
    return(req,res,next) =>{
        const token = req.headers.authorization
        if(!token || token.split(' ')[0].toLowerCase() != "bearer"){
            res.json({'message':'Hibás/nem létező bejelentkezési token'})
            res.end()
        }
        const bearerToken = token.split(' ')[1]
        try {
            const decodedData = JWT.verify(bearerToken,SUPERSECRET)
            req.username = decodedData.username
            req.email = decodedData.email
            req.role = decodedData.role
            next()
        }
        catch (error) {
            res.json({'message':error})
            res.end()
        }
    } 

}

server.get('/profile', authenticate() ,async(req, res)=>{
    
        res.json('A felhasználőnév: '+req.username + 'a role: '+req.role +' az email: '+req. email)
        res.end()
})

server.post('/login', async(req,res)=> {
    const user = await dbHandler.users.findOne({
        where:{
            username: req.body.loginUser,
            password: req.body.loginPassword
        }
    })
    if(!user){
        res.status(403)
        res.json({'message':'Nem létezik felhasználó ilyen bejelentkezési adatokkal'})
    }
    else{
        const token = await JWT.sign({username:user.username,email:user.email,role:user.role},SUPERSECRET,{expiresIn: timeLimit})
        res.status(201)
        res.json(token)
        
    }
    res.end()
})


server.post('/register', async(req,res)=>{
    const user = await dbHandler.users.findOne({
        where:{
            username: req.body.registerUser
        }
    })
    if(user){
        res.status(403)
        res.json({'message':'Már létezik ilyen felhasználónév'})
    }
    else{
        const email = await dbHandler.users.findOne({
            where:{
                email:req.body.registerEmail
            }
        })
        if(email){
            res.status(403)
            res.json({'message':'Már létezik felhasználó ezzel az email-lel'})
        }else{
            //id, name, car_id, email, phone_num, role, username, password
            await dbHandler.users.create({
                username: req.body.registerUser,
                role: req.body.registerRole,
                password: req.body.registerPassword,
                name: req.body.registerName,
                phone: req.body.registerPhone,
                email: req.body.registerEmail,
               

                
            })
            res.status(201)
            res.json({'message':'Sikeres regisztráció'})
        }
    }
    res.end()
})


server.listen(PORT,()=>{console.log('A szarod a fut a '+ PORT+ ' porton')})