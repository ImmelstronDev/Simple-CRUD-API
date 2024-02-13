import { User } from "./user.type";

export type RequestBody = Omit<User, "id">;
