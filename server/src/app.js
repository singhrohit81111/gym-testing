const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes=require('./routes/user.routes');
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: `16Kb` }));
app.use(cors(
    {
        origin: ''
    }
));
app.use(cookieParser());

app.use('/api/v1/user',userRoutes);
app.use(errorHandlerMiddleware);

module.exports = app;