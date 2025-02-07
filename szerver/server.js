const express = require('express')
const server = express()
require('dotenv').config()

server.use(express.json())
const PORT = process.env.PORT

const dbHandler = require('./dbHandler')
const exp = require('constants')
dbHandler.car.sync({alter:true})
dbHandler.reservations.sync({alter:true})
dbHandler.users.sync({alter:true})
dbHandler.parkhouse.sync({alter:true})


server.post('/register', async(req,res)=>{
    const user = await dbHandler.user.findOne({
        where:{
            username: req.body.username
        }
    })
    if(user){
        res.end(403)
        res.json({'error':'Már létezik ilyen felhasználónév'})
    }
    else{
        const email = await dbHandler.user.findOne({
            where:{
                email:req.body.email
            }
        })
        if(email){
            res.status(403)
            res.json({'error':'Már létezik felhasználó ezzel az email-lel'})
        }else{
            await dbHandler.user.create({
                name: req.body.name,
                car_id: req.body.car_id,
                email: req.body.email,
                phone_num: req.body.phone_num,
                role: req.body.role,
                username: req.body.username,
                password: req.body.password,
                
            })
        }
    }
    
})


server.listen(PORT,()=>{console.log('A szarod a fut a '+ PORT+ ' porton')})