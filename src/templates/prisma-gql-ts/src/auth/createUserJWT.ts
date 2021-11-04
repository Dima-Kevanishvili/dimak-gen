import jwt, { Secret } from "jsonwebtoken";
import { User } from "@prisma/client";
import { jwtPayload } from "./jwtPayloadType";
const { JWT_SECRET } = process.env;

export default (user: User): string => {
  const payload: jwtPayload = {
    sub: user.id,
  };
  const token = jwt.sign(payload, JWT_SECRET as Secret);
  return token;
};
