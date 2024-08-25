import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";
import { authMiddleware, checkTokenIsValid } from "./lib/AuthMiddleware";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value as string;
  const secretKey = process.env.SECRET_KEY as string;
  const { pathname } = new URL(req.url);
  if (pathname.startsWith("/user")) {
    return authMiddleware(req);
  } else if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    if (token) {
      const isValid = await checkTokenIsValid(token, secretKey);
      if (isValid) {
        return NextResponse.redirect(new URL("/user", req.url));
      }
    }
  }
  return NextResponse.next();
}

// Helper function to decode Base64URL into a Uint8Array
function base64UrlDecode(base64Url: string): Uint8Array {
  // Convert Base64URL to standard Base64
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if necessary
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }

  // Decode Base64 string to a binary string
  const binaryString = atob(base64);

  // Convert binary string to a Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Polyfill for atob in environments without window
function atob(input: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = input.replace(/=+$/, "");
  let output = "";

  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
}

async function runMiddlewares(
  req: Request,
  middlewares: Array<(req: Request) => Promise<NextResponse | undefined>>
) {
  for (const middleware of middlewares) {
    const result = await middleware(req);
    if (result) {
      return result;
    }
  }
  return NextResponse.next(); // Proceed if no middleware returns a response
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/user/:path*",
//   runtime: "nodejs",
// };
