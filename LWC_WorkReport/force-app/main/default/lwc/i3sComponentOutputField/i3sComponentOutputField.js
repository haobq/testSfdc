import { LightningElement, api } from "lwc";
import { isEmpty } from "c/i3sComponentUtilities";

export default class I3sComponentOutputField extends LightningElement {
  @api object;
  @api column;

  get fieldValue() {
    return this.object[this.column.fieldName];
  }

  get targetId() {
    return isEmpty(this.column.targetIdField)
      ? ""
      : this.object[this.column.targetIdField];
  }

  get isHyperLink() {
    return (
      !isEmpty(this.targetId) ||
      (!isEmpty(this.column.paramFields) &&
        this.object[this.column.hyperLinkConditionField])
    );
  }

  get isDate() {
    return this.column.type === "DATE";
  }

  get isDatetime() {
    return this.column.type === "DATETIME";
  }

  get isCheckbox() {
    return this.column.type === "CHECKBOX";
  }

  get isButton() {
    return this.column.type === "BUTTON";
  }

  get isOther() {
    return (
      this.column.type !== "DATE" &&
      this.column.type !== "DATETIME" &&
      this.column.type !== "CHECKBOX" &&
      this.column.type !== "BUTTON"
    );
  }

  onCheckBoxChanged = (event) => {
    const params = {
      fieldName: this.column.fieldName,
      value: event.target.checked,
      index: this.object.index - 1
    };

    // send event to aura
    const customevent = new CustomEvent("checked", { detail: params });
    // dispatches the event.
    this.dispatchEvent(customevent);
  };

  onButtonClicked = () => {
    const params = {
      buttonName: this.column.buttonName,
      index: this.object.index - 1
    };

    // send event to aura
    const customevent = new CustomEvent("clicked", { detail: params });
    // dispatches the event.
    this.dispatchEvent(customevent);
  };

  onOpenLink() {
    // 標準画面へ
    if (!isEmpty(this.targetId)) {
      this.openRecord();
    } else {
      this.openLink();
    }
  }

  openRecord() {
    // send event to aura
    const customevent = new CustomEvent("openrecord", {
      detail: this.targetId
    });
    // dispatches the event.
    this.dispatchEvent(customevent);
  }

  openLink() {
    const fields = this.column.paramFields.split(",");
    const params = {};
    // 項目名を識別子にする
    params.fieldName = this.column.fieldName;
    fields.forEach((field) => {
      params[field] = this.object[field];
    });

    // send event to aura
    const customevent = new CustomEvent("openlink", { detail: params });
    // dispatches the event.
    this.dispatchEvent(customevent);
  }
}
