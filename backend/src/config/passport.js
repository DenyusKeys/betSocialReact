import {Strategy as LocalStrategy} from 'passport-local'; // Import strategy from passport
import User from '../models/User.js' //User model import to use for querying DB
import bcrypt from 'bcryptjs'; //Compares passwords

export default function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                
                const user = await User.findOne({ email }); //Find the user in DB by email
                if(!user) return done(null, false, { message: 'User not found'}); //If no user exists
                const isMatch = await bcrypt.compare(password, user.password); //Compare passwords in DB
                if(!isMatch) return done(null, false, { message: 'Incorrect password' }); //If passowrds don't match

                // If everything is valid, authentication succeeds
                // `done(null, user)` tells Passport the login is successful
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    )

    // Store the user ID in the session cookie
    // This is called whent he user logs in successfully
    passport.serializeUser((user, done) => done(null, user.id));

    //Retrieve full user object from the ID stored in the session
    //This runs on every request after login to keep the session active
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(err, null);
        }
    })
}

