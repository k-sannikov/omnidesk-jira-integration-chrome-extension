class Validator {
  _value;
  errors = [];

  constructor(value) {
    this._value = value;
  }

  require() {
    if (this._value.length == 0) {
      this.errors.push("Поле должно быть заполнено");
    }
    return this;
  }

  maxLength(max) {
    if (this._value.length > max) {
      this.errors.push(`Поле должно быть длиной не более ${max} символов`);
    }
    return this;
  }
}