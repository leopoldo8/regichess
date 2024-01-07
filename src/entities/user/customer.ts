import Observable from "../../utils/observable";
import User, { IUserContactInfo } from ".";

export default class Customer extends Observable implements User {
  constructor(
    readonly persistentLayerId: string,
    readonly contactInfo: IUserContactInfo
  ) {
    super();
  }
}
