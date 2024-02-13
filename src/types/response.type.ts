import { Methods } from "src/constants/methods";
import { StatusCodes } from "src/constants/status-codes";
import { StatusMessages } from "src/constants/status-messages";
import { User } from "./user.type";

type customValue<T> = T[keyof T];

export type ResponseParameters = {
  method?: keyof typeof Methods;
  statusCode: customValue<typeof StatusCodes>;
  statusMessage: customValue<typeof StatusMessages>;
  data?: User[] | User;
  message?: string;
};
