class Utils {
  static getElementByXPath(xPath) {
    return document.evaluate(
      xPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
  }

  static getOmnideskCaseKey() {
    let pageUrl = new URL(document.URL);
    let match = pageUrl.pathname.match(/\d{3}-\d{6}/gi)
    if (!match) throw new Error("Omnidesk case key not found");
    return match[0];
  }

  static async getHtmlComponent(path) {
    let response = await fetch(chrome.runtime.getURL(`components/${path}`), { method: "GET" });
    let text = await response.text();
    let document = new DOMParser().parseFromString(text, "text/html");
    return document.body.firstElementChild;
  }

  static async fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  }

  static createToast(type, text) {
    new Toast({
      title: false,
      text: text,
      theme: type,
      autohide: true,
      interval: 3000
    });
  }
}

