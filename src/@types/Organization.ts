import type { User } from "./user";

export interface Organization {
  id? : number;
  name : string;
  createdBy : string;
  createdAt : Date;
  users : User[],
  logo?: string;
}