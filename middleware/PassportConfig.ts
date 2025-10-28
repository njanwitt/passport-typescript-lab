import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { userModel } from "../models/userModel";
import dotenv from "dotenv";
import passport from "passport";
import { getUserByEmailIdAndPassword } from "../controllers/userController";


export interface PassportStrategy {
    name: string;
    strategy: any;
}



export default class PassportConfig {
    /*
     FIX ME 😭
     The problem with this class is... if the caller forgets to call
     the addStrategies method...our program won't work. 

     Solution: You should refactor this class to take a constructor
     which receives strategies: PassportStrategy[]. Internally...call 
     the addStrategies method within the constructor and make addStragies
     private from the outside world. This way, we can GUARANTEE that our
     passport strategies are added when this class is created. ⭐️
    */


    constructor(strategies: PassportStrategy[] = []) {
        
        this.configureSerialization();

        this.addStrategies(strategies);
    }

    private configureSerialization(): void {
        
        passport.serializeUser((user: any, done) => {
            
            done(null, user?.id ?? user);
        });

        passport.deserializeUser((idOrUser: any, done) => {
            try {
                let user: any = null;
                let id: number;

                
                if (typeof idOrUser === "object" && idOrUser?.id != null) {
                    id = Number(idOrUser.id); 
                } else {
                    id = Number(idOrUser); 
                }

                if (typeof userModel.findById === "function") {
                    user = userModel.findById(id); 
                }

                done(null, user ?? null);
            } catch (err) {
                done(err as Error);
            }
        });
    }

    private addStrategies(strategies: PassportStrategy[]): void {
        strategies.forEach((passportStrategy) => {
            if (!passportStrategy || !passportStrategy.strategy) return;
            passport.use(passportStrategy.name, passportStrategy.strategy);
        });
    }
}