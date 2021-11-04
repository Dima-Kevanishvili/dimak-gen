import { ErrorResponse } from "@gql/generated/gqlTypes";

export const USER_ALREADY_EXISTS: ErrorResponse = {
  __typename: "ErrorResponse",
  errorCode: "USER_ALREADY_EXISTS",
  message: "User with given email already exists",
};
export const INCORRECT_CREDENTIALS: ErrorResponse = {
  __typename: "ErrorResponse",
  errorCode: "USER_CREDENTIALS_INCORRECT",
  message: "Email or password is incorrect",
};

export const UNAUTHENTICATED: ErrorResponse = {
  __typename: "ErrorResponse",
  errorCode: "UNAUTHENTICATED",
  message: "Action needs authentication",
};
