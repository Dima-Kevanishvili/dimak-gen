import { gql } from "apollo-server";

export default gql`
  directive @AuthNeeded on FIELD_DEFINITION
`;
