import { LightningElement, api, track } from "lwc";
import { closeDialog } from "c/i3sComponentActions";
import { regist, isEmpty } from "c/i3sComponentUtilities";
import Btn_Confirm from "@salesforce/label/c.Btn_Confirm";

const mapStateToProps = (state) => ({
  dialog: state.dialog
});

const mapDispatchToProps = {
  closeDialog
};

export default class I3sComponentDialog extends LightningElement {
  @api storeName;
  @track dialog;

  get showDialog() {
    return !isEmpty(this.dialog) && !isEmpty(this.dialog.title);
  }

  // Expose the labels to use in the template.
  label = {
    Btn_Confirm
  };

  connectedCallback() {
    regist(mapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}
