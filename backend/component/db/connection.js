const mongoose = require('mongoose');

const url= 'mongodb://localhost:27017/Bombay'

mongoose.set('strictQuery',true);

mongoose.connect(url,(err)=>{
    if(!err){console.log('db connected')}
    else{console.log('error')}
})