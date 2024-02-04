import Observer from "./observer";

export default class Observable {
	private readonly observers: Observer[];

	constructor () {
		this.observers = [];
	}

	public register(observer: Observer) {
		const index = this.observers.push(observer);

    return {
      remove: () => {
        this.observers.splice(index, 1);
      }
    };
	}

	protected notify<T = any>(event: string, data: T) {
		for (const observer of this.observers) {
			if (observer.event === event || observer.event === '*') {
				observer.callback(data);
			}
		}
	}
}

class GlobalObservable extends Observable {
  public globalNotify<T = any>(event: string, params?: T) {
    return this.notify<T | undefined>(event, params);
  }
}

export const globalObservable = new GlobalObservable();
