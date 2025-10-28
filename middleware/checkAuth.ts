/*
FIX ME (types) 😭
*/
import { Request, Response, NextFunction } from "express";

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (typeof (req as any).isAuthenticated === "function" && (req as any).isAuthenticated()) {
    return next();
  }

  if (req.session) {
    (req.session as any).messages = (req.session as any).messages || [];
    (req.session as any).messages.push("Please log in to view that resource");
  }

  res.redirect("/auth/login");
}


/*
FIX ME (types) 😭
*/
export function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (typeof (req as any).isAuthenticated === "function" && (req as any).isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return next();
}

