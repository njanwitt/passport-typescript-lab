import express, { Request, Response } from "express";
import passport from "passport";
import { userModel } from "../models/userModel"; // mock user model

const router = express.Router();

// password hash
const hashPassword = (password: string) => password;

//LOGIN
router.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

//REGISTER
router.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Register" });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //if user exists
    const existingUser = userModel.findOne(email);
    if (existingUser) {
      (req as any).flash("error", "Email already registered");
      return res.redirect("/auth/register");
    }

    //create new user
    userModel.create({ name, email, password: hashPassword(password), role: "user" });

    (req as any).flash("success", "Registration successful! You can now login.");
    res.redirect("/auth/login");
  } catch {
    (req as any).flash("error", "Something went wrong during registration.");
    res.redirect("/auth/register");
  }
});

//GITHUB OAUTH -- need to set on Github too -- see setting
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login", failureFlash: true }),
  (req: Request, res: Response) => {
    (req as any).flash("success", "Logged in with GitHub!");
    res.redirect("/dashboard");
  }
);

//LOGOUT

router.get("/logout", (req: Request, res: Response) => {
  req.logout(err => {
    if (err) {
      (req as any).flash("error", "Logout failed.");
      return res.redirect("/dashboard");
    }
    (req as any).flash("success", "Logged out successfully.");
    res.redirect("/auth/login");
  });
});

export default router;
