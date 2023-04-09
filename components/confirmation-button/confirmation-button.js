class ConfirmationButton {

  element;
  _handler;
  _confirmed = false;
  _timer;

  constructor(handler) {
    this._handler = handler;

    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.innerHTML = "✖";
    this.element.classList.add(["confirmation-button"]);
    this.element.onclick = () => this._confirm();
  }

  _confirm() {
    if (this._confirmed) {
      this._confirmed = false;
      this.element.classList.remove(["confirmation-button_danger"]);
      clearTimeout(this._timer);
      this._handler();
    } else {
      this._confirmed = true;
      this.element.classList.add(["confirmation-button_danger"]);

      this._timer = setTimeout(() => {
        this._confirmed = false;
        this.element.classList.remove(["confirmation-button_danger"]);
      }, 2000);

    }
  }

}