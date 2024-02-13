import { User } from "src/types/user.type";
import { v4 as uuidv4 } from "uuid";

export const users: User[] = [
  {
    id: uuidv4(),
    username: "Oby Van Kenoby",
    age: 40,
    hobbies: ["cut hands and legs", "say Hi"],
  },
];
