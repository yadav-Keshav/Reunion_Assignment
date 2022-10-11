require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./model/connectDB');
const router = require('./routes/router');


const app = express();
app.use(express.json());
app.use(cors());

// Connect to db
connectDB();

//Api endPoint
app.get("/",(req,res)=>{
    res.status(200).json({message:'Server is running'})
})
app.use("/api", router);
// middleware for handling error
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        error: errorMessage,
    });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is Listening on Port : ${PORT}`)
})

//Handling Unhandled Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Server is Closed Due to ${err.message}`);
    server.close();
    process.exit(1);
})