import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("Please add JWT_SECRET to .env.local");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const COOKIE_NAME = "teamflow_token";

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}
