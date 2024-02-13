import "dotenv/config";
import { createServer as createServerHttp } from "node:http";
import { StatusCodes } from "./constants/status-codes";
import { StatusMessages } from "./constants/status-messages";
import { RequestBody } from "./types/request-body.type";
import { Methods } from "./constants/methods";
import { RequestParameters } from "./types/request.type";
import { Router } from "./router";
import { ResponseParameters } from "./types/response.type";

const requestToString = async (request) => {
  const result: string[] = [] as string[];
  for await (const item of request) {
    result.push(item.toString());
  }
  return result.join("");
};

export const App = () => {
  const server = createServerHttp(async (request, response) => {
    let body: RequestBody = {} as RequestBody;
    if (request.method === Methods.PUT || request.method === Methods.POST) {
      try {
        body = JSON.parse(await requestToString(request));
      } catch {
        response.writeHead(
          StatusCodes.INTERNAL_SERVER_ERROR,
          StatusMessages.INTERNAL_SERVER_ERROR,
          { "Content-Type": "application/json" }
        );
        response.end(
          JSON.stringify({ message: StatusMessages.INTERNAL_SERVER_ERROR })
        );
        return;
      }
    }

    console.log(body);

    const requestObject: RequestParameters = {
      endpoint: request.url,
      method: request.method as Methods,
      body: body as RequestBody,
    };

    const routes = new Router("localhost");
    const responseObject: ResponseParameters =
      routes.handlerRoute(requestObject);

    const { statusCode, statusMessage, data, message } = responseObject;

    const jsonData = data
      ? JSON.stringify(data)
      : message
      ? JSON.stringify({ message })
      : undefined;

    response.writeHead(statusCode, statusMessage, {
      "Content-Type": "application/json",
    });
    response.end(jsonData);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
};
