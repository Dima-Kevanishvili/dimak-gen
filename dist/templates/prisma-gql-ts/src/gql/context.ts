import { PrismaClient, User } from "@prisma/client";
import { ExpressContext } from "apollo-server-express";
import getUserForContext from "auth/getUserForContext";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user: User | null;
}

export const context = async ({ req }: ExpressContext): Promise<Context> => {
  const token = req.headers.authorization || "";
  const user = await getUserForContext(token, prisma);
  return {
    prisma,
    user,
  };
};
