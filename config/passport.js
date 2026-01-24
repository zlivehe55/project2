const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
          return done(null, false, { message: 'Email not registered' });
        }

        // Check if account is verified
        if (!user.isVerified) {
          return done(null, false, { message: 'Please verify your email before logging in' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
          // Update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

