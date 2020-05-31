import { LightningElement, api, track } from 'lwc';
import { closeDialog } from 'c/alfaActions';
import { regist, isEmpty } from 'c/alfaUtilities';
import Btn_Confirm from '@salesforce/label/c.EPCC_Btn_Confirm';

const mapStateToProps = state => ({
  dialog: state.dialog
});

const mapDispatchToProps = {
  closeDialog,
};

export default class AlfaComponentDialog extends LightningElement {
  @api storeName;
  @track dialog;

  get showDialog() {
    return !isEmpty(this.dialog) && !isEmpty(this.dialog.title);
  }

  // Expose the labels to use in the template.
  label = {
    Btn_Confirm,
  }

  connectedCallback() {
    regist(mapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}