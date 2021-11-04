import { ApolloServer } from "apollo-server";
import { context } from "@gql/context";
import executableSchema from "@gql/schema";

const { PORT } = process.env;

const startServer = async () => {
  const server = new ApolloServer({ context, schema: executableSchema });
  const { url } = await server.listen({ port: PORT });
  console.info(`🚀 Server running on ${url}`);
  return server;
};

export default startServer;
