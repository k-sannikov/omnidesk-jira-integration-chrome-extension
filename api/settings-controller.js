export default class SettingsController {
  _baseUrl;

  constructor(domain) {
    this._baseUrl = `${domain}/api/settings`;
  }

  async getSettings() {
    let url = `${this._baseUrl}/get`;
    return await fetch(url, { method: "GET" });
  }
}