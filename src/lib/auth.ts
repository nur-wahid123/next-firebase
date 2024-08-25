import { jwtDecrypt, jwtVerify } from "jose";
import { sign, decode, verify } from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY as string;
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET as string;
export function getToken(body: {
  name?: string;
  email?: string;
  roles?: string;
}) {
  const token = sign(body, secretKey, {
    expiresIn: "2h",
  });
  return token;
}
export async function decrypt(token: string) {
  const sccess = new TextEncoder().encode(accessSecretKey);
  const { payload } = await jwtDecrypt(token, sccess);
  const userData: {
    name?: string;
    email?: string;
    roles?: string;
  } = {
    name: payload.name as string,
    email: payload.email as string,
    roles: payload.roles as string,
  };
  return userData;
}

export function getAccessToken(body: {
  name?: string;
  email?: string;
  roles?: string;
}) {
  const token = sign(body, accessSecretKey, {
    expiresIn: "15s",
  });
  return token;
}
