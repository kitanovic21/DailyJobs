import type { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
}

export interface JwtPayload {
  sub: string; // id korisnika
  email: string;
}

// request nakon sto je guard postavio req.user
export type AuthRequest = Request & { user: AuthUser };