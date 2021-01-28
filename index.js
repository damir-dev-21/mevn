const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();

const PORT = config.get('PORT') || 5000;
const mongoURI = config.get('mongoURI');

async function start(){
    try{

        await mongoose.connect(mongoURI,{
            useCreateIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        app.listen(PORT,()=>console.log(`App has been started on ${PORT}`));

    }catch(e){
        console.log('Server error',e.message);
        process.exit(1)
    }
}

start();