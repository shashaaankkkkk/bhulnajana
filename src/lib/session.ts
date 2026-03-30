import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import jwt from "jsonwebtoken";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function getMobileUser(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "default_secret") as { id: string; email: string; name: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getHybridUser(req: Request) {
  // Try Web Session first (Cookies)
  const webUser = await getCurrentUser();
  if (webUser?.id) return { id: webUser.id, name: webUser.name, email: webUser.email };

  // Try Mobile Token (Bearer Auth)
  const mobileUser = await getMobileUser(req);
  return mobileUser;
}
