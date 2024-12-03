import express from 'express'; //express frame work initialization
import 'dotenv/config'; // importing and running dotenv's configuration setup
import routes from './routes/index.js';
import { dbConnection } from './config/db.config.js';
import config from './config/config.js';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';




//dotenv.config(); // loading environment variables from a .env file into process.env

dbConnection(); // This function is called to establish a connection to your database.

const app = express(); // initializing an Express application
//const bodyParser = require('body-parser');
//const cors = require('cors');//Enables Cross-Origin Resource Sharing.
//const PORT = process.env.PORT || 4000;

app.use(cors({
   // origin: ['http://localhost:5174','http://localhost:5173'],
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Add other HTTP methods if needed
    credentials: true  // Enable this if you need to send cookies or authorization headers
  }));
app.options('*', cors());

// -----------------------
// const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin, like mobile apps or curl requests
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // if you need to send cookies or use HTTP Authentication headers
// }));



//-------------------------

// middleware 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(mongoSanitize());

app.use(morgan('tiny'));//Morgan middleware with the 'tiny' format

// routes
app.use('/api/v2', routes);  // app.use('api/v1',routes);

//Error handling when there is no if match for route
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status =  404;
    next(error);
});

//Error handle middleware for all error
app.use((error, req,res,next) => {
    res.status(error.status || 500).json({
        status: false,
        error: error.message,

    });
});

// Check if PORT is defined
if (!config.PORT) {
    console.error('PORT is not defined in the configuration');
    process.exit(1);
}

//Starting the server
app.listen(config.PORT,() => {
    console.log(`Server is running at ${config.PORT}`);
});


