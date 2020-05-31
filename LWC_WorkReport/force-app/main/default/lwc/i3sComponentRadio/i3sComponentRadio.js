import { LightningElement, api, track } from "lwc";
import {
  regist,
  isEmpty,
  getStoreData,
  getStoreRadio
} from "c/i3sComponentUtilities";
import { handleInputChanged } from "c/i3sComponentActions";

const mapDispatchToProps = {
  handleInputChanged
};

export default class I3sComponentRadio extends LightningElement {
  @api storeName;
  @api columnName;
  @api label;
  @api vertical = false;
  @api value;
  @track disabled;
  @track innerClass;
  @track checked;

  // Group Nameを重複しなように、先頭にStoreNameをつける
  get groupName() {
    return this.storeName + "_" + this.columnName;
  }

  get variant() {
    return isEmpty(this.label) ? "label-hidden" : "standard";
  }

  getInnerClass = (state) => {
    const visible = getStoreData(
      state.control.visibility,
      this.columnName,
      true
    );
    if (visible === false) {
      return "slds-hide";
    }
    return this.vertical ? "" : "horizontal";
  };

  getColumnChecked = (state) => {
    let result = getStoreData(state.data, this.columnName);
    return result === this.value;
  };

  getDisabled = (state) => {
    // 個々ラジオボタンの非活性情報を見る（Storeの階層は１階層深くなる）
    const key = this.columnName + "." + this.value;
    return (
      state.control.disabled.allColumns === true ||
      getStoreRadio(state.control.disabled, key)
    );
  };

  mapStateToProps = (state) => ({
    checked: this.getColumnChecked(state),
    disabled: this.getDisabled(state),
    innerClass: this.getInnerClass(state)
  });

  connectedCallback() {
    regist(this.mapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}
