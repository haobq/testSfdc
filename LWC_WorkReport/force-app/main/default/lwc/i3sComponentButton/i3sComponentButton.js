import { LightningElement, api, track } from "lwc";
import { regist, isEmpty } from "c/i3sComponentUtilities";
import { handlebuttonClicked } from "c/i3sComponentActions";

const mapDispatchToProps = {
  handlebuttonClicked
};

export default class I3sComponentButton extends LightningElement {
  @api storeName;
  @api name;
  @api label;
  @api outerClass;
  // レコードページに配置した各ページを同じstoreName使用するとき、
  // ページ名を付与してsagasに分けられるようにする
  @api pageName;
  @api variant;
  @track innerClass;
  @track disabled;

  onButtonClicked = (event) => {
    this.handlebuttonClicked(event.target.name, this.pageName);
  };

  getInnerClass = (state) => {
    let visible;

    if (isEmpty(this.name || isEmpty(state.control.visibility.button))) {
      return this.outerClass;
    }

    if (isEmpty(this.pageName)) {
      visible = state.control.visibility.button[this.name];
    } else {
      visible = state.control.visibility.button[this.pageName][this.name];
    }
    if (visible === false) {
      return "slds-hide";
    }

    return this.outerClass + " slds-m-right_xx-small";
  };

  getDisabled = (state) => {
    let disabled;
    if (isEmpty(this.name) || isEmpty(state.control.disabled.button)) {
      return false;
    }

    if (isEmpty(this.pageName)) {
      disabled = state.control.disabled.button[this.name];
    } else {
      disabled = state.control.disabled.button[this.pageName][this.name];
    }

    return disabled === true;
  };

  mapStateToProps = (state) => ({
    innerClass: this.getInnerClass(state),
    disabled: this.getDisabled(state)
  });

  connectedCallback() {
    regist(this.mapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}