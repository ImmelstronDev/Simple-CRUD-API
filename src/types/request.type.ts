import { Methods } from "src/constants/methods";
import { RequestBody } from "./request-body.type";

export type RequestParameters = {
  method?: keyof typeof Methods;
  endpoint?: string;
  body?: RequestBody;
};
