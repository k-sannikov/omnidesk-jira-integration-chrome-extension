class ReplacingLinksService {
  _apiDomain;
  _regexp;
  _chatContainer;
  _classesNoteContainer = "request-area all-added-answer-area added-note-area";
  _showIssuesService;
  

  constructor(apiDomain, jiraDomain, showIssuesService) {
    this._apiDomain = apiDomain;

    let searchableUrl = `${jiraDomain}/servicedesk/customershim/secure`;
    this._regexp = new RegExp(`^(${searchableUrl})(.+)`, "i");

    this._chatContainer = document.querySelector(".content-scrollable.nano.has-scrollbar .nano-content");
    let images = this._chatContainer.querySelectorAll("img");
    this._replaceLinks(images)

    this._showIssuesService = showIssuesService;
  }

  async initObserver() {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach(async mutation => await this._mutationHandler(mutation));
    });

    observer.observe(this._chatContainer, { childList: true, subtree: true });
  }

  async _mutationHandler(mutation) {
    mutation.addedNodes.forEach(async element => {
      if (element.nodeName == "DIV") {
        let elementClasses = element.getAttribute("class") || "";
        let isNote = elementClasses.replace(/ /g, "") == this._classesNoteContainer.replace(/ /g, "");
        if (isNote) {
          let images = element.querySelectorAll("img");
          this._replaceLinks(images);

          let result = element.innerHTML.match(/задача ".+?" изменила статус на/gmiu);
          if (result) {
            await this._showIssuesService.showIssues();
          }
        }
      }
    });
  }

  _replaceLinks(images) {
    images.forEach(img => {
      let resilt = this._createNewUrl(img.src);
      if (resilt) img.src = resilt;
    });
  }

  _createNewUrl(src) {
    let match = src.match(this._regexp)
    if (!match) return null;
    return this._apiDomain + match[2];
  }

}
