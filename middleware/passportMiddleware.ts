import { Application } from "express";
import passport from "passport";
import PassportConfig from "./PassportConfig";
import { getUserByEmailIdAndPassword, getUserById } from "../controllers/userController";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";

import {Express} from "express";



// No need to actually pass the instance of passport since it returns a singleton
/* const passportConfig = new PassportConfig();
passportConfig.addStrategies([localStrategy /* passportGitHubStrategy */

export default function passportMiddleware(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());


  new PassportConfig([
    {
      name: "local",
      strategy: new LocalStrategy(
        { usernameField: "email" },
        async (email: string, password: string, done) => {
          try {
            const user = await getUserByEmailIdAndPassword(email, password);
            if (!user) return done(null, false, { message: "Invalid credentials" });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      ),
    },
    {
      name: "github",
      strategy: new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          callbackURL:
            process.env.GITHUB_CALLBACK_URL || "http://localhost:8000/auth/github/callback",
        },
        (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: (err: any, user?: any) => void
        ) => {
          try {
            const user = {
              id: profile.id,
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value,
              role: "user",
            };
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      ),
    },
  ]);
}