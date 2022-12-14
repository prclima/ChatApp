const mongoose = require('mongoose')


    async function dbConnect(){
    try{
        const dbConnection = await mongoose.connect(process.env.BD_PORT, { useNewUrlParser: true })
        console.log("conectado ao banco")
    } catch(err){
        console.log(err)
    }
}

module.exports = {dbConnect};