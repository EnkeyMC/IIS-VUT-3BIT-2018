export default class Observable {
    constructor(defaultValue, onChangedCallback = null) {
        this._lastValue = defaultValue;

        if (onChangedCallback)
            this.onChanged = onChangedCallback;
        else
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

    triggerOnChanged() {
        this.onChanged(this._lastValue);
    }
}