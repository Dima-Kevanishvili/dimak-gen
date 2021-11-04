import { gql } from "apollo-server";

export default gql`
  type User {
    email: String!
    id: String!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  union AuthResult = AuthResponse | ErrorResponse

  union MeReponse = User | ErrorResponse

  type Mutation {
    signupUser(data: UserCreateInput!): AuthResult!
    loginUser(data: UserLoginInput!): AuthResult!
  }

  type Query {
    me: MeReponse! @AuthNeeded
  }
  input UserLoginInput {
    email: String!
    password: String!
  }
  input UserCreateInput {
    email: String!
    password: String!
  }
`;
