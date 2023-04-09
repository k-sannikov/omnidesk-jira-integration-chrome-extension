class CreateBunchService {
  _omnideskCaseKey;
  _jiraDomain;
  _buttonContainer;
  _modal;
  _keyBunchController;
  _showIssuesService;

  constructor(buttonContainer, apiDomain, jiraDomain, omnideskCaseKey, showIssuesService) {
    this._buttonContainer = buttonContainer;
    this._jiraDomain = jiraDomain;
    this._omnideskCaseKey = omnideskCaseKey;
    this._keyBunchController = new KeyBunchController(apiDomain);
    this._showIssuesService = showIssuesService;
  }

  async insertModalToPage() {
    this._modal = await new Modal(`${this._jiraDomain}/servicedesk/customer/portal/46`).init();
    this._modal.form.onsubmit = async (event) => await this._keyBunchFormSubmit(event);
    document.body.append(this._modal.element);
  }

  insertOpenButtonToPage() {
    let button = new Button()
      .setText("Создать связку")
      .setOnClickHandler(() => this._modal.openModal());
    this._buttonContainer.append(button.element);
  }

  async _keyBunchFormSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let jiraIssueKey = formData.get("jiraIssueKey")

    let errors = new Validator(jiraIssueKey)
      .require()
      .maxLength(64)
      .errors;

    if (errors.length > 0) {
      this._modal.addErrors(errors);
      return;
    }

    this._modal.disableSubmitButton();
    this._modal.showSpinner();

    try {
      await this._createKeyBunch(jiraIssueKey.trim());
    } catch (error) {
      this._modal.closeAndResetModal();
      Utils.createToast("danger", "Сервер не отвечает");
      console.error(error);
    }
    
    this._modal.hideSpinner();
    this._modal.unlockSubmitButton();
  }

  async _createKeyBunch(jiraIssueKey) {

    let response = await this._keyBunchController.createBunch({
      omnideskCaseKey: this._omnideskCaseKey,
      jiraIssueKey: jiraIssueKey,
    });

    if (response.ok) {
      await this._showIssuesService.showIssues();
      this._modal.closeAndResetModal();
      Utils.createToast("success", "Связка создана");
    } else {
      await this._showErrors(response);
    }
  }

  async _showErrors(response) {
    switch (response.status) {
      case 400:
        let result = await response.json();
        this._modal.addErrors(result.errors)
        break;
      default:
        this._modal.closeAndResetModal();
        Utils.createToast("danger", "Ошибка сервера");
        break;
    }
  }
}
