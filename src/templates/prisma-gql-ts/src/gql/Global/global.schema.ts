import { gql } from "apollo-server";

export default gql`
  type ErrorResponse {
    errorCode: String!
    message: String!
  }
`;
