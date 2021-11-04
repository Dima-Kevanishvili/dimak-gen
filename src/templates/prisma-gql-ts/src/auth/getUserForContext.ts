import jwt, { Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { jwtPayload } from "./jwtPayloadType";

const { JWT_SECRET } = process.env;
export default async (authorizationHeader: string, prisma: PrismaClient) => {
  if (!authorizationHeader) {
    return null;
  }

  const token = authorizationHeader.replace(/Bearer\s*/, "");

  if (!token) {
    return null;
  }
  try {
    const jwtPayload = jwt.verify(token, JWT_SECRET as Secret) as jwtPayload;
    if (!jwtPayload.sub) {
      return null;
    }
    const authUser = await prisma.user.findUnique({ where: { id: jwtPayload.sub } });
    return authUser;
  } catch (error) {
    return null;
  }
};
