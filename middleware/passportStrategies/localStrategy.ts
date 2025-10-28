import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { Request } from "express";



const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password", passReqToCallback: false
  },
  (email: string, password: string, done: (err: any, user?: any, info?: any) => void) => {
    try {
      const user = getUserByEmailIdAndPassword(email, password);
      return user
        ? done(null, user)
        : done(null, false, {
          message: "Your login details are not valid. Please try again"
        });
    } catch (err) {
      return done(err);
    }
  }
);


/*
FIX ME (types) 😭
*/
passport.serializeUser(function (user: Express.User | { id?: number } | any, done: (err: any, id?: number | string) => void): void {
  // id property (number)
  const id = user && (user.id ?? user._id);
  done(null, id);
});



/*
FIX ME (types) 😭
*/
passport.deserializeUser(function (id: number, done: (err: any, user?: Express.User | null) => void): void {
  try {
    const user = getUserById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err, null);
  }
});


const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
