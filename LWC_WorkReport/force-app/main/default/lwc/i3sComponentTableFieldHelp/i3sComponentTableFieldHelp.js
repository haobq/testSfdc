import { LightningElement, api, track } from "lwc";

export default class I3sComponentTableFieldHelp extends LightningElement {
  @track bodyMessage;
  @api topmargin;
  @api leftmarginn;
  @api message;

  get message() {
    return this.bodyMessage;
  }

  set message(value) {
    this.bodyMessage = value;
  }

  get style() {
    return `position: fixed; background-color:color; top:${this.topmargin}px; left:${this.leftmarginn}px`;
  }
}