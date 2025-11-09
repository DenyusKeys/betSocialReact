import express from "express";
import session from 'express-session'; //Manage user sessions
import passport from 'passport';       //Core passport library
import passportConfig from './config/passport.js'
import dotenv from "dotenv";   
import cors from "cors";
import authRoutes from './routes/authRoutes.js'
import notesRoutes from "./routes/notesRoutes.js";
import  connectDB  from "./config/db.js";
import rateLimiter from "./middelware/rateLimiter.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(cors()); //Allows requests from all URL's
app.use(express.json()); //parse JSON bodies: req.body
app.use(rateLimiter);


//Simple custom middleware
app.use((req,res,next) => {
    console.log(`Request method is ${req.method} and URL is ${req.url}`);
    next();
})

//Configure express-session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,  //Used to sign the session ID cookie
        resave: false,                       //Don't resave session if unchanged
        saveUninitialized: false,            //Don't save empty sessions
    })
);

//Initialize passport for authentication
app.use(passport.initialize());

// Connect Passport to the session middleware
// This allows persistent login sessions
app.use(passport.session());

// Pass the passport instance to our config file
passportConfig(passport);


//If route starts with this, it will hit the notesRoutes.js
app.use('/api/auth', authRoutes);
app.use("/api/notes", notesRoutes);


//Better for production to connect to database before launching the application
connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server started on PORT:${PORT}`);
    });
})



//more functionality later
// app.use("/api/posts", postsRoutes); and do the same as you did for notes