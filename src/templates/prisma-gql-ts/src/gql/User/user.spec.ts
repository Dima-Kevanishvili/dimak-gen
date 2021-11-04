import startServer from "server";
import jwt from "jsonwebtoken";
import { expect } from "chai";
import { ApolloServer } from "apollo-server-express";
import truncateDatabase from "helpers/testHelpers/truncateDatabase";
import { INCORRECT_CREDENTIALS, UNAUTHENTICATED, USER_ALREADY_EXISTS } from "constants/ErrorCodes";
import runQuery from "helpers/testHelpers/runQuery";
const testQueries = {
  Signup: `
  mutation($data: UserCreateInput!) {
    signupUser(data: $data) {
      __typename
      ...on AuthResponse {
        user {
        email
      }
      token
    }
    ...on ErrorResponse {
      errorCode
      message
    }
    }
  }`,
  Login: `
  mutation($data: UserLoginInput!){
      loginUser(data: $data) {
        __typename
        ...on AuthResponse {
          user {
          email
        }
        token
      }
      ...on ErrorResponse {
        errorCode
        message
      }
      }
    }`,
  Me: `
  query Me {
    me {
      ... on ErrorResponse {
        __typename
        message
        errorCode
      }
      ... on User {
        __typename
        email
      }
    }
  }
  `,
};

let server: ApolloServer;

before(async () => {
  server = await startServer();
});

after(async () => {
  await server.stop();
});

beforeEach(async () => {
  return truncateDatabase();
});

describe("Auth Tests", async () => {
  it("Login: Should respond with error if not registered", async () => {
    const response = await runQuery(testQueries.Login, {
      email: "non@existent.com",
      password: "fakepassword",
    });
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("loginUser");
    expect(response.body.data.loginUser.__typename).to.eq("ErrorResponse");
    expect(response.body.data.loginUser.errorCode).to.eq(INCORRECT_CREDENTIALS.errorCode);
    expect(response.body.data.loginUser.message).to.eq(INCORRECT_CREDENTIALS.message);
    expect(response.body.data.loginUser.token).to.eq(undefined);
    expect(response.body.data.loginUser.user).to.eq(undefined);
  });

  it("Register: Should respond with token and user", async () => {
    const userData = {
      email: "some@email.com",
      password: "fakepassword",
    };
    const response = await runQuery(testQueries.Signup, userData);
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("signupUser");
    expect(response.body.data.signupUser.token).to.not.eq(null);
    expect(response.body.data.signupUser.user.email).to.eq(userData.email);
  });

  it("Register: Should respond with error if using same email", async () => {
    const userData = {
      email: "some@email.com",
      password: "fakepassword",
    };
    await runQuery(testQueries.Signup, userData);
    const response = await runQuery(testQueries.Signup, userData);

    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("signupUser");
    expect(response.body.data.signupUser.errorCode).to.eq(USER_ALREADY_EXISTS.errorCode);
    expect(response.body.data.signupUser.message).to.eq(USER_ALREADY_EXISTS.message);
    expect(response.body.data.signupUser.__typename).to.eq(USER_ALREADY_EXISTS.__typename);
    expect(response.body.data.signupUser.token).to.eq(undefined);
    expect(response.body.data.signupUser.user).to.eq(undefined);
  });

  it("Login: Should respond with token and user", async () => {
    const userData = {
      email: "some@email.com",
      password: "fakepassword",
    };
    await runQuery(testQueries.Signup, userData);
    const response = await runQuery(testQueries.Login, userData);
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("loginUser");
    expect(response.body.data.loginUser.__typename).to.eq("AuthResponse");
    expect(response.body.data.loginUser.errorCode).to.eq(undefined);
    expect(response.body.data.loginUser.message).to.eq(undefined);
    expect(response.body.data.loginUser.token).to.not.eq(undefined);
    expect(response.body.data.loginUser.user).to.not.eq(undefined);
    expect(response.body.data.loginUser.user.email).to.eq(userData.email);
  });
  it("Me: Should respond with user", async () => {
    const userData = {
      email: "some@email.com",
      password: "fakepassword",
    };
    await runQuery(testQueries.Signup, userData);
    const login = await runQuery(testQueries.Login, userData);
    const response = await runQuery(testQueries.Me, {}, login.body.data.loginUser.token);
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("me");
    expect(response.body.data.me.__typename).to.eq("User");
    expect(response.body.data.me.errorCode).to.eq(undefined);
    expect(response.body.data.me.message).to.eq(undefined);
    expect(response.body.data.me.email).to.eq(userData.email);
  });

  it("Me: Should respond with error if not authenticated", async () => {
    const response = await runQuery(testQueries.Me, {}, "setToNull");
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("me");
    expect(response.body.data.me.__typename).to.eq(UNAUTHENTICATED.__typename);
    expect(response.body.data.me.errorCode).to.eq(UNAUTHENTICATED.errorCode);
    expect(response.body.data.me.message).to.eq(UNAUTHENTICATED.message);
    expect(response.body.data.me.email).to.eq(undefined);
  });
  it("Me: Should respond with error if invalid token", async () => {
    const response = await runQuery(testQueries.Me, {}, "abc");
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("me");
    expect(response.body.data.me.__typename).to.eq(UNAUTHENTICATED.__typename);
    expect(response.body.data.me.errorCode).to.eq(UNAUTHENTICATED.errorCode);
    expect(response.body.data.me.message).to.eq(UNAUTHENTICATED.message);
    expect(response.body.data.me.email).to.eq(undefined);
  });
  it("Me: Should respond with error if empty token bearer", async () => {
    const response = await runQuery(testQueries.Me, {}, "");
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("me");
    expect(response.body.data.me.__typename).to.eq(UNAUTHENTICATED.__typename);
    expect(response.body.data.me.errorCode).to.eq(UNAUTHENTICATED.errorCode);
    expect(response.body.data.me.message).to.eq(UNAUTHENTICATED.message);
    expect(response.body.data.me.email).to.eq(undefined);
  });
  it("Me: Should respond with error if token has no sub", async () => {
    const token = jwt.sign({ some: "thing" }, process.env.JWT_SECRET as string);
    const response = await runQuery(testQueries.Me, {}, token);
    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("me");
    expect(response.body.data.me.__typename).to.eq(UNAUTHENTICATED.__typename);
    expect(response.body.data.me.errorCode).to.eq(UNAUTHENTICATED.errorCode);
    expect(response.body.data.me.message).to.eq(UNAUTHENTICATED.message);
    expect(response.body.data.me.email).to.eq(undefined);
  });
  it("Login: Should respond with error if password incorrect", async () => {
    const userData = {
      email: "some@email.com",
      password: "fakepassword",
    };
    await runQuery(testQueries.Signup, userData);
    const response = await runQuery(testQueries.Login, {
      email: userData.email,
      password: "incorrectPassword",
    });

    expect(response.body).to.not.haveOwnProperty("errors");
    expect(response.body).to.haveOwnProperty("data");
    expect(response.body.data).to.haveOwnProperty("loginUser");
    expect(response.body.data.loginUser.__typename).to.eq("ErrorResponse");
    expect(response.body.data.loginUser.errorCode).to.eq(INCORRECT_CREDENTIALS.errorCode);
    expect(response.body.data.loginUser.message).to.eq(INCORRECT_CREDENTIALS.message);
    expect(response.body.data.loginUser.token).to.eq(undefined);
    expect(response.body.data.loginUser.user).to.eq(undefined);
  });
});
