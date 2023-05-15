(async () => {

  let sourceContainer = Utils.getElementByXPath("//*[@class='sidebar']//label/span[text()='Time Tracking']/../..");

  if (!sourceContainer) {
    throw new Error("Не найден контейнер для вставки контента");
  }

  // контейнер для элементов экстеншена
  let extensionContainer = document.createElement("div");
  sourceContainer.append(extensionContainer);

  // контейнер для кнопки создания связки
  let buttonContainer = document.createElement("div");
  extensionContainer.append(buttonContainer);

  // контейнер для списка связок
  let issuesContainer = document.createElement("div");
  issuesContainer.classList.add(["keys-container"]);
  extensionContainer.append(issuesContainer);

  let omnideskCaseKey = Utils.getOmnideskCaseKey();
  let jiraDomain = (await chrome.storage.local.get("jiraDomain")).jiraDomain;
  let apiDomain = (await chrome.storage.local.get("apiDomain")).apiDomain;

  if (!jiraDomain) {
    throw new Error("Не найден jiraDomain в local storage");
  }
  
  if (!apiDomain) {
    throw new Error("Не найден apiDomain в local storage");
  }

  let showIssuesService = new ShowIssuesService(issuesContainer, apiDomain, jiraDomain, omnideskCaseKey);
  await showIssuesService.showIssues();

  let createBunchService = new CreateBunchService(buttonContainer, apiDomain, jiraDomain, omnideskCaseKey, showIssuesService);
  await createBunchService.insertModalToPage();
  createBunchService.insertOpenButtonToPage();

  await new ReplacingLinksService(apiDomain, jiraDomain, showIssuesService).initObserver();

})();