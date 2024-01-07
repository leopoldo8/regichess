import Observable from "../../utils/observable";

export interface IUserContactInfo {
  email: string;
  name: string;
  lastname: string;
}

export default abstract class User extends Observable {
  abstract contactInfo?: Partial<IUserContactInfo>;
}
