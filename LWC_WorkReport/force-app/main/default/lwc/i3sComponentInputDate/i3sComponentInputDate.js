import { LightningElement, api, wire, track } from "lwc";
import { handleInputChanged } from "c/i3sComponentActions";
import {
  regist,
  isEmpty,
  getStoreData,
  getDisabled,
  DEFAULT_DATA_NAME,
  MAP_DATA2OBJECT,
  getI3sComponentClass,
  getSingleValidationErrors
} from "c/i3sComponentUtilities";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import ErrMsg_InputInvalidDate from "@salesforce/label/c.ErrMsg_InputInvalidDate";

const mapDispatchToProps = {
  handleInputChanged
};

export default class I3sComponentInputDate extends LightningElement {
  @api storeName;
  @api columnName;
  @api label;
  @api outerClass;
  @track innerClass;
  @track value;
  @track disabled;
  @track objectApiName;
  @track fieldApiName;
  @track validationErrors;
  ErrMsg_InputInvalidDate = ErrMsg_InputInvalidDate;

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo({ data, error }) {
    if (data && this.label === undefined) {
      const column = data.fields[this.fieldApiName];
      if (!isEmpty(column)) {
        this.label = column.label;
      }
    } else if (error) {
      console.log(error);
    }
  }

  getObjectFieldApiInfo() {
    let objName;
    let colName;
    let keys;
    if (this.columnName.includes(".")) {
      keys = this.columnName.split(".");
      objName = MAP_DATA2OBJECT[keys[0]];
      colName = keys[1];
    } else {
      objName = MAP_DATA2OBJECT[DEFAULT_DATA_NAME];
      colName = this.columnName;
    }

    this.objectApiName = {
      objectApiName: objName
    };
    this.fieldApiName = colName;
  }

  get variant() {
    return isEmpty(this.label) ? "label-hidden" : "standard";
  }

  mapStateToProps = (state) => ({
    value: getStoreData(state.data, this.columnName),
    disabled: getDisabled(state.control.disabled, this.columnName, false),
    innerClass: getI3sComponentClass(state, this.columnName, this.outerClass),
    validationErrors: getSingleValidationErrors(state, this.columnName)
  });

  connectedCallback() {
    regist(this.mapStateToProps, mapDispatchToProps, this.storeName)(this);
    this.getObjectFieldApiInfo();
  }
}
