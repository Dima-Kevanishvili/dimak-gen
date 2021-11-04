import merge from "lodash/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import userResolvers from "./User/user.resolvers";
import userSchema from "./User/user.schema";
import globalSchema from "./Global/global.schema";
import authDirectiveSchema from "./Directives/authDirective.schema";
import authDirectiveTransformer from "./Directives/authDirective.transformer";

const typeDefs = [globalSchema, authDirectiveSchema, userSchema];
const resolvers = merge(userResolvers);
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
export default authDirectiveTransformer(executableSchema, "AuthNeeded");
