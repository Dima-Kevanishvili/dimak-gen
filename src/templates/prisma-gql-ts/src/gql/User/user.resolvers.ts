import { MutationResolvers, QueryResolvers } from "@gql/generated/gqlTypes";
import { INCORRECT_CREDENTIALS, UNAUTHENTICATED, USER_ALREADY_EXISTS } from "constants/ErrorCodes";
import argon from "argon2";
import createUserJWT from "auth/createUserJWT";

const signupUser: MutationResolvers["signupUser"] = async (_p, args, { prisma }) => {
  const isExistingUser = await prisma.user.count({ where: { email: args.data.email } });
  if (isExistingUser) {
    return USER_ALREADY_EXISTS;
  }
  const hashedPassword = await argon.hash(args.data.password);
  const newUser = await prisma.user.create({
    data: {
      email: args.data.email,
      password: hashedPassword,
    },
  });
  const token = createUserJWT(newUser);
  return {
    __typename: "AuthResponse",
    user: newUser,
    token,
  };
};

const loginUser: MutationResolvers["loginUser"] = async (_p, args, { prisma }) => {
  const foundUser = await prisma.user.findUnique({ where: { email: args.data.email } });
  if (!foundUser) {
    return INCORRECT_CREDENTIALS;
  }
  const isPasswordCorrect = await argon.verify(foundUser.password, args.data.password);
  if (!isPasswordCorrect) {
    return INCORRECT_CREDENTIALS;
  }
  const token = createUserJWT(foundUser);
  return {
    __typename: "AuthResponse",
    user: foundUser,
    token,
  };
};

const me: QueryResolvers["me"] = (_p, _a, context) => {
  return { __typename: "User", ...context.user! };
};

export default {
  Query: {
    me,
  },
  Mutation: {
    signupUser,
    loginUser,
  },
};
