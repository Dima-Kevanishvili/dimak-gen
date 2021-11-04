import request from "supertest";
const serverURL = `http://localhost:${process.env.PORT}`;

export default async (query: string, variables: { [key: string]: any }, token?: string) => {
  const response = await request(serverURL)
    .post("/")
    .set({ Authorization: token === "setToNull" ? "" : `Bearer ${token}` })
    .send({
      query: query,
      variables: {
        data: variables,
      },
    });
  return response;
};
