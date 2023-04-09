class KeyBunchController {
  _baseUrl;

  constructor(domain) {
    this._baseUrl = `${domain}/api/key-bunch`;
  }

  async getBunchesByOmnideskKey(omnideskKey) {
    let url = `${this._baseUrl}/get/${omnideskKey}`;
    return await Utils.fetchWithTimeout(url, { method: "GET" });
  }

  async createBunch(body) {
    let url = `${this._baseUrl}/add`;
    return await Utils.fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  }

  async deleteBunch(omnideskKey, jiraIssueId) {
    let url = `${this._baseUrl}/delete/${omnideskKey}/${jiraIssueId}`;
    return await Utils.fetchWithTimeout(url, { method: "DELETE" });
  }
}