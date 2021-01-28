const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('config');
const router = Router();

router.post('/reg',async (req,res)=>{
    try{

        const {name,surname,email,password} = req.body;

        const candidate = await User.findOne({email});

        if(candidate){
            return res.status(400).json({message:'Такой пользователь уже есть!'})
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new User({name,surname,email,password:hashPassword});

        await newUser.save();

        return res.status(201).json({message:'Вы зарегистрированы!'})

    }catch(e){
        res.status(500).json({message:e.message})
    }
})

router.post('/log',async(req,res)=>{
    try{

        const {name,surname,email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:'Аккаунт не найден!'})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:'Пароль не верный'});
        }

        const token = jwt.sign(
            {userId:user.id},
            config.get('jwtSecret'),
            {expiresIn:'1h'}
        )

        res.json({token,userId:user.id})

    }catch(e){
        res.status(500).json({message:e.message})
    }
})

module.exports = router;