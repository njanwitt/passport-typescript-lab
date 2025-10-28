// add more emoji if you have time to ejs
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";

import passportMiddleware from "./middleware/passportMiddleware";
import indexRoute from "./routes/indexRoute";
import authRoute from "./routes/authRoute";

const app = express();
const port = Number(process.env.PORT) || 8000;

const isProd = process.env.NODE_ENV === "production";
const viewsPath = isProd ? path.join(__dirname, "../views") : path.join(__dirname, "views");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);


import flash from "connect-flash";
app.use(flash());

//PASSPORT
passportMiddleware(app);


app.use((req, res, next) => {
  res.locals.isAuthenticated = (req as any).isAuthenticated?.() || false;
  res.locals.user = (req as any).user || null;
  res.locals.error = (req as any).flash("error") || [];
  res.locals.success = (req as any).flash("success") || [];
  next();
});

//ROUTES
app.use("/", indexRoute);
app.use("/auth", authRoute);

//HOME
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

//ERROR 
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Internal server error");
});

//SERVER
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
console.log(`🚀 Server has started on port ${port}`);

export default app;
