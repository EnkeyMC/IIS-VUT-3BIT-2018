export default class Observable {
    constructor(defaultValue) {
        this._lastValue = defaultValue;

        this.onChanged = () => {}
    }

    update(newValue) {
        if (this._lastValue !== newValue) {
            this._lastValue = newValue;
            this.onChanged(newValue);
        }
    }

    setOnChanged(callback) {
        this.onChanged = callback;
    }

    get() {
        return this._lastValue;
    }
}