import { makeAutoObservable } from "mobx";

export class ContractCodeModel {
  code: string = "";
  constructor() {
    makeAutoObservable(this);
  }

  setCode = (code: string) => {
    this.code = code;
  };
}
