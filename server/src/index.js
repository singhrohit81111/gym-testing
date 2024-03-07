const app = require('./app');
const connectDB = require("./db");
const dotenv = require("dotenv");

dotenv.config({
    path: './.env'
})


connectDB().then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`connected successfully to port:${process.env.PORT}`);
    })
}).catch((error) => {
    console.log(error);
})

