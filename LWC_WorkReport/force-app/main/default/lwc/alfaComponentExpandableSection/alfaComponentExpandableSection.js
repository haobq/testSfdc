import { LightningElement, api } from 'lwc';

export default class EpccExpandableSection extends LightningElement {
  @api title;
  @api isClosed = false;

  get isOpened() {
    return !this.isClosed;
  }

  get isOpenClass() {
    return (
      'slds-col slds-size_1-of-1 slds-section alfa-custom-section' +
      (this.isClosed ? '' : ' slds-is-open')
    );
  }

  toggle() {
    this.isClosed = !this.isClosed;
  }
}