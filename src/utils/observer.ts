export default class Observer<T = any> {
	constructor (
    readonly event: string,
    readonly callback: (data: T) => void
  ) {}
}
