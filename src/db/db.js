const mongoose = require('mongoose');

const connectToDb = () => {
  return mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

}
connectToDb().then(_ => {
    if(process.env.NODE_ENV === 'development') {
        console.log(`connected to DB(${_.connection.host}/${_.connection.name}) Successfully!`);
    }
}, err => {
    if(process.env.NODE_ENV === 'development') {
        console.log(`\nOops! Could not create database connection \n ${err}`);
    }
});