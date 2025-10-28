import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";


router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});


router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});






export default router;
