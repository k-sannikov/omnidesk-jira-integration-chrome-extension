class Modal {

  element;
  form;
  _inputJiraKey;
  _errors;
  _spinner;
  _cancelBtn;
  _submitBtn;
  _link;
  _srcLink;

  constructor(srcLink) {
    this._srcLink = srcLink;
  }

  async init() {
    this.element = await Utils.getHtmlComponent("modal/modal.html");
    this.form = this.element.children[1].children[0];
    this._errors = this.element.children[1].children[1];
    this._spinner = this.element.children[0].children[0].children[1];
    this._inputJiraKey = this.form.children[1];
    this._cancelBtn = this.element.children[1].children[2].children[0]
    this._submitBtn = this.element.children[1].children[2].children[1]
    this._link = this.element.children[0].children[1].children[0];
    this._link.setAttribute("href", this._srcLink);

    // если клик за пределами окна, то мы его закрываем
    this.element.onclick = ({ currentTarget, target }) => {
      if (currentTarget == target) this.closeAndResetModal();
    }
    // при закрытии по нажатию на escape окно очищается
    this.element.oncancel = () => this.closeAndResetModal();
    // при закрытии по нажатию на кнопку "Отмена" окно очищается
    this._cancelBtn.onclick = () => this.closeAndResetModal();
    // очистка ошибок при вводе в input
    this._inputJiraKey.oninput = () => this.resetErrors();

    return this;
  }

  openModal() {
    this.element.showModal();
    document.body.classList.add("scroll-lock");
  }

  closeModal() {
    this.element.close();
    document.body.classList.remove("scroll-lock");
  }

  showSpinner() {
    this._spinner.style.display = "block";
  }

  hideSpinner() {
    this._spinner.style.display = "none";
  }

  disableSubmitButton() {
    this._submitBtn.disabled = true;
  }

  unlockSubmitButton() {
    this._submitBtn.disabled = false;
  }

  resetErrors() {
    this._errors.innerHTML = "";
  }

  closeAndResetModal() {
    this.closeModal();
    this.form.reset();
    this.resetErrors();
  }

  addErrors(errors) {
    errors.forEach(error => {
      let message = document.createElement("div");
      message.innerHTML = error;
      this._addErrorElement(message);
    });
  }

  _addErrorElement(errorElement) {
    this._errors.appendChild(errorElement);
  }
}
