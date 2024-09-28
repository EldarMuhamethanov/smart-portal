import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";

export class AppSettingsModel {
  darkModeOn: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  initState = () => {
    this.darkModeOn = this._getDarkModeFromStorage();
  };

  setDarkMode = (darkMode: boolean) => {
    this.darkModeOn = darkMode;
    this._updateDarkModeInStorage();
  };

  _getDarkModeFromStorage = () => {
    return LocalStorage.getValue<boolean>("dark-mode-on") || false;
  };

  _updateDarkModeInStorage = () => {
    return LocalStorage.setValue<boolean>("dark-mode-on", this.darkModeOn);
  };
}
