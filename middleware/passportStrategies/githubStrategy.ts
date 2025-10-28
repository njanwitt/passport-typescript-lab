import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { userModel} from "../../models/userModel";

const clientID = process.env.GITHUB_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const callbackURL = process.env.CALLBACK_URL || "http://localhost:8000/auth/github/callback";




const githubStrategy = new GitHubStrategy(
    {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
    },

    /* FIX ME 😭 */
    async (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
            // getting email from Github
            const ghEmail: string | undefined =
                Array.isArray(profile?.emails) && profile.emails.length > 0
                    ? profile.emails[0].value
                    : undefined;

            // existing email
            let user = ghEmail ? userModel.findOne(ghEmail) : null;

            // Fallback: try username@github.com if not found
            if (!user && profile?.username) {
                const fallbackEmail = `${profile.username}@github.com`;
                user = userModel.findOne(fallbackEmail);
            }

            // Create a new user if none found
            if (!user) {
                user = userModel.create({
                    name: profile.displayName || profile.username || `github-${profile.id}`,
                    email: ghEmail ?? `${profile.username || profile.id}@github.com`,
                    password: "oauth", 
                    role: "user",
                });
            }

            console.log("True: GitHub login user:", user);
            return done(null, user);
        } catch (err) {
            console.error("False: GitHub Strategy Error:", err);
            return done(err);
        }
    }
);
const passportGitHubStrategy: PassportStrategy = {
    name: "github",
    strategy: githubStrategy,
};

export default passportGitHubStrategy;