export enum StatusMessages {
  OK = "The request succeeded.",
  CREATE = "The request succeeded, and a new resource was created.",
  NO_CONTENT = "There is no content to send for this request.",
  BAD_REQUEST = " Bad request. The server cannot or will not process the request",
  NOT_FOUND = "Not found. The server cannot find the requested resource.",
  INTERNAL_SERVER_ERROR = "Internal server error. The server has encountered a situation it does not know how to handle.",
}
