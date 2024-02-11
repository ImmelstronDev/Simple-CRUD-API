import { Methods } from "src/constants/methods";
import { StatusCodes } from "src/constants/status-codes";
import { StatusMessages } from "src/constants/status-messages";
import { User } from "./user.type";

export type Response = {
  method: keyof typeof Methods;
  statusCode: keyof typeof StatusCodes;
  statusMessage: keyof typeof StatusMessages;
  body?: User[] | User;
};
