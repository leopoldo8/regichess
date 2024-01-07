import Observable from "../../utils/observable";
import User, { IUserContactInfo } from ".";

export default class Guest extends Observable implements User {
  constructor(
    readonly generatedID: string,
    readonly contactInfo?: Partial<IUserContactInfo>
  ) {
    super();
  }
}
