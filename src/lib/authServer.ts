import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dmlab-tools-default-jwt-secret-key-change-in-production";

export interface AuthJwtPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}

/**
 * Hashes a plaintext password using bcrypt with 10 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT payload with an expiration of 7 days.
 */
export function signToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies a JWT token and returns the decoded payload, or null if invalid/expired.
 */
export function verifyToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Express middleware to authenticate requests via the Authorization header.
 * Sets `req.user` if valid. Returns 401 Unauthorized if missing or invalid.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please provide a valid Bearer token." });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }

  req.user = decoded;
  next();
}

/**
 * Optional authentication middleware: sets `req.user` if token is provided, but does not block.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}
