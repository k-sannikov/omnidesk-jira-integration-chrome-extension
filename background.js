import SettingsController from "./api/settings-controller.js";

chrome.runtime.onStartup.addListener(async () => {
  const apiDomain = "https://localhost:7193";

  await chrome.storage.local.set({ apiDomain: apiDomain });

  try {
    let response = await new SettingsController(apiDomain).getSettings();
    if (response.ok) {
      let jiraDomain = (await response.json()).jiraDomain;
      await chrome.storage.local.set({ jiraDomain: jiraDomain });
    } else {
      throw Error("Не получен актуальный JiraDomain");
    }
  } catch (error) {
    await chrome.storage.local.remove("jiraDomain");
  }
});