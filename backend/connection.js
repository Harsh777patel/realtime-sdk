const mongoose = require('mongoose');
const url = "mongodb+srv://harsh:royalharsh4004@cluster0.i6jxwnb.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(url)

    .then((result) => {
        console.log('database connected');

    })
    .catch((err) => {
        console.log(err);


    });


module.exports = mongoose;