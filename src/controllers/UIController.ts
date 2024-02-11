import { Subscription } from "../utils/observable";

abstract class UIController {
  abstract registerObservable(callback: () => void): Record<string, Subscription>;
}

export default UIController;
