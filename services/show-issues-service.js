class ShowIssuesService {
  _omnideskCaseKey;
  _jiraDomain;
  _issuesContainer;
  _keyBunchController;

  constructor(issuesContainer, apiDomain, jiraDomain, omnideskCaseKey) {
    this._issuesContainer = issuesContainer;
    this._jiraDomain = jiraDomain;
    this._omnideskCaseKey = omnideskCaseKey;
    this._keyBunchController = new KeyBunchController(apiDomain);
  }

  async showIssues() {
    this._issuesContainer.innerHTML = "";
    try {
      let response = await this._keyBunchController.getBunchesByOmnideskKey(this._omnideskCaseKey);

      if (response.ok) {
        let result = await response.json();
        await this._insertKeyIssuesToPage(result.jiraIssues);
      }
    } catch (error) {
      this._issuesContainer.innerHTML = "Не удалось загрузить информацию с сервера"
      console.error(error);
    }
  }

  async _insertKeyIssuesToPage(issues) {
    issues.forEach(issue => {
      let url = `${this._jiraDomain}/servicedesk/customer/portal/${issue.portalId}/${issue.jiraIssueKey}`;

      let deleteBtn = new ConfirmationButton(async () => {
        await this._keyBunchController.deleteBunch(this._omnideskCaseKey, issue.jiraIssueId);
        await this.showIssues();
      });

      let keyRow = document.createElement("div");
      keyRow.classList.add(["key-row"]);

      keyRow.innerHTML = `<div>
        <div><a target="_blank" href="${url}">${issue.jiraIssueKey}</a></div>
        <div>${issue.jiraStatusName}</div>
      </div>`;

      keyRow.append(deleteBtn.element);

      this._issuesContainer.append(keyRow);
    });
  }
}
