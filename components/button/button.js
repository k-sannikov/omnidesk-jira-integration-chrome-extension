class Button {

  element;

  constructor() {
    this.element = document.createElement("button");
    this.element.setAttribute("type", "button");
    this.element.classList.add(["button-usual"]);
  }

  addClasses(classNames = []) {
    this.element.classList.add(classNames);
    return this;
  }

  setOnClickHandler(handler) {
    this.element.onclick = handler;
    return this;
  }

  setText(text) {
    this.element.innerHTML = text;
    return this;
  }

  lockButton() {
    this.element.disabled = true;
  }

  unlockButton() {
    this.element.disabled = false;
  }
}