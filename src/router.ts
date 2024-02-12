import { validate, v4 as uuidv4 } from "uuid";
import { Methods } from "./constants/methods";
import { StatusCodes } from "./constants/status-codes";
import { StatusMessages } from "./constants/status-messages";
import { RequestBody } from "./types/request-body.type";
import { RequestParameters } from "./types/request.type";
import { users } from "./data-base/users";
import { ResponseParameters } from "./types/response.type";
import { Endpoints } from "./constants/endpoints";

export class Router {
  constructor(hostName: string) {
    this.hostName = hostName;
  }
  public hostName: string;

  validateBody(body: RequestBody): { isValid: boolean; message?: string } {
    console.log(body);
    const schema = [
      { name: "username", type: "String" },
      { name: "age", type: "Number" },
      { name: "hobbies", type: "Array" },
    ];

    const bodyKeys = Object.keys(body);

    if (bodyKeys.length !== schema.length) {
      return {
        isValid: false,
        message: `status: ${StatusCodes.BAD_REQUEST}, message: ${StatusMessages.BAD_REQUEST}`,
      };
    }

    const errorFieldsObject: { field: string; errorMessage: string }[] = [];

    const validBodyFields = bodyKeys.map((key) => {
      const isField = schema.find((field, index) => {
        const bodyKeyType = Object.prototype.toString
          .call(body[key])
          .slice(8, -1);
        if (
          field.name === key &&
          bodyKeyType === field.type &&
          field.type !== "Array"
        ) {
          schema.slice(index, 1);
          return true;
        } else if (
          field.name === key &&
          bodyKeyType === field.type &&
          field.type === "Array"
        ) {
          const hobbies = body[key] as [];
          const isString = hobbies.every((hobby) => typeof hobby === "string");
          if (isString) return true;
          errorFieldsObject.push({
            field: key,
            errorMessage: `Invalid field ${key}`,
          });
          return false;
        } else {
          errorFieldsObject.push({
            field: key,
            errorMessage: `Invalid field ${key}`,
          });
          return false;
        }
      });
      return isField ? key : false;
    });

    const isValidBody = validBodyFields.every((field) => {
      return field !== false;
    });
    if (!isValidBody) {
      return {
        isValid: false,
        message: `status: ${StatusCodes.BAD_REQUEST}, message: ${StatusMessages.BAD_REQUEST}, invalid body`,
      };
    }

    return { isValid: true };
  }

  handlerRoute(request: RequestParameters) {
    const { body, endpoint, method } = request;

    const isPath =
      endpoint &&
      /\/api\/users\/*/.test(endpoint) &&
      endpoint.split("/").length === 4;

    if (isPath && method === Methods.GET) {
      const id = endpoint.split("/")[3] as string;
      const isValidId = validate(id);
      const user = users.find((user) => user.id === id);

      if (!isValidId) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: StatusMessages.BAD_REQUEST,
          message: "Invalid user id(not uuid), check id and try again",
        };
        return response;
      }
      if (isValidId && user) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.OK,
          statusMessage: StatusMessages.OK,
          data: user,
        };
        return response;
      } else if (isValidId && !user) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.NOT_FOUND,
          statusMessage: StatusMessages.NOT_FOUND,
          message: `User with id ${id} doesn't exist, check id, and try again`,
        };
        return response;
      }
    }

    if (isPath && method === Methods.DELETE) {
      const id = endpoint.split("/")[3] as string;
      const isValidId = validate(id);
      const user = users.find((user) => user.id === id);

      if (!isValidId) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: StatusMessages.BAD_REQUEST,
          message: "Invalid user id(not uuid), check id and try again",
        };
        return response;
      }
      if (isValidId && user) {
        users.splice(users.indexOf(user), 1);
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.NO_CONTENT,
          statusMessage: StatusMessages.NO_CONTENT,
          message: `User ${user.username} it was deleted`,
        };
        return response;
      } else if (isValidId && !user) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.NOT_FOUND,
          statusMessage: StatusMessages.NOT_FOUND,
          message: `User with id ${id} doesn't exist, check id, and try again`,
        };
        return response;
      }
    }

    if (isPath && method === Methods.PUT && body) {
      const id = endpoint.split("/")[3] as string;
      const isValidId = validate(id);
      const validateBodyFields = this.validateBody(body);
      const { isValid } = validateBodyFields;

      if (!isValidId) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: StatusMessages.BAD_REQUEST,
          message: "Invalid user id(not uuid), check id and try again",
        };
        return response;
      }

      if (!isValid) {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: StatusMessages.BAD_REQUEST,
          message:
            "Invalid required fields in body request, check all of them and try again",
        };
        return response;
      }

      if (isValidId && isValid) {
        const user = users.find((user) => user.id === id);

        if (user) {
          const updateUser = { id, ...body };
          users.splice(users.indexOf(user), 1, updateUser);
          const response: ResponseParameters = {
            method: method,
            statusCode: StatusCodes.OK,
            statusMessage: StatusMessages.OK,
            message: `User ${user.username} it was updated`,
            data: updateUser,
          };
          return response;
        } else if (!user) {
          const response: ResponseParameters = {
            method: method,
            statusCode: StatusCodes.NOT_FOUND,
            statusMessage: StatusMessages.NOT_FOUND,
            message: `User with id ${id} doesn't exist, check id, and try again`,
          };
          return response;
        }
      }
    } else if (isPath && method === Methods.PUT && !body) {
      const response: ResponseParameters = {
        method: method,
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: StatusMessages.NOT_FOUND,
        message: "Request body doesn't exist, fill request body, and try again",
      };
      return response;
    }

    switch (endpoint) {
      case "/": {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.NOT_FOUND,
          statusMessage: StatusMessages.NOT_FOUND,
          message: "invalid path, enter correct path",
        };
        return response;
      }

      case Endpoints.USERS: {
        if (method === Methods.GET) {
          const response: ResponseParameters = {
            method: method,
            statusCode: StatusCodes.OK,
            statusMessage: StatusMessages.OK,
            data: users,
          };
          return response;
        }
        if (method === Methods.POST && body) {
          const validateBodyFields = this.validateBody(body);
          const id = uuidv4();
          const { isValid, message } = validateBodyFields;

          if (isValid) {
            const newUser = { id, ...body };
            users.push(newUser);
            const response: ResponseParameters = {
              method: method,
              statusCode: StatusCodes.CREATE,
              statusMessage: StatusMessages.CREATE,
              data: newUser,
            };
            return response;
          } else {
            const response: ResponseParameters = {
              method: method,
              statusCode: StatusCodes.BAD_REQUEST,
              statusMessage: StatusMessages.BAD_REQUEST,
              message: message,
            };
            return response;
          }
        } else if (method === Methods.POST && !body) {
          const response: ResponseParameters = {
            method: method,
            statusCode: StatusCodes.BAD_REQUEST,
            statusMessage: StatusMessages.BAD_REQUEST,
            message: `Request body doesn't exist, check your request and try again`,
          };
          return response;
        } else {
          const response: ResponseParameters = {
            method: method,
            statusCode: StatusCodes.BAD_REQUEST,
            statusMessage: StatusMessages.BAD_REQUEST,
          };
          return response;
        }
      }

      default: {
        const response: ResponseParameters = {
          method: method,
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: StatusMessages.BAD_REQUEST,
          message: "Path doesn't exist, check request path and try again",
        };
        return response;
      }
    }
  }
}
