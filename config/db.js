const mongoose = require('mongoose');

const config =  require('config');

const db = config.get('mongoDbURI');

const connectionDB = async () => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true
        },()=>{
            console.log('database is connected');
        });
    }catch(error) {
        console.log(error.message);
        //exit process with failure
        process.exit(1)
    }
}

module.exports = connectionDB;