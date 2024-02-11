import "dotenv/config";
import { createServer as createServerHttp } from "node:http";
import { StatusCodes } from "./constants/status-codes";
import { StatusMessages } from "./constants/status-messages";

export const App = () => {
  const server = createServerHttp(async (_request, response) => {
    response.writeHead(StatusCodes.OK, StatusMessages.OK, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ data: "Yippee Ki-Yay!" }));
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
};
