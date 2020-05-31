import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { handleInputChanged } from "c/i3sComponentActions";
import {
  regist,
  isEmpty,
  hasElements,
  DEFAULT_DATA_NAME,
  MAP_DATA2OBJECT,
  getStoreData,
  getDisabled,
  getI3sComponentClass,
  getSingleValidationErrors
} from "c/i3sComponentUtilities";

const mapDispatchToProps = {
  handleInputChanged
};

export default class I3sComponentCombobox extends LightningElement {
  @api label;
  @api storeName;
  @api columnName;
  @api outerClass;
  @api blankValue;
  @api userDefineOptions = false;
  @track innerClass;
  @track innerOptions;
  @track value;
  @track disabled;
  @track objectApiName;
  @track fieldApiName;
  @track objectInfo;
  @track validationErrors;

  @api
  get outerOptions() {
    return this.innerOptions;
  }
  set outerOptions(options) {
    this.innerOptions = isEmpty(options) ? [] : [].concat(options);
    if (this.blankValue && hasElements(this.innerOptions)) {
      this.innerOptions.unshift({
        label: "",
        value: ""
      });
    }
  }

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$objectInfo.data.defaultRecordTypeId",
    fieldApiName: "$fieldApiName"
  })
  wiredPicklist({ error, data }) {
    if (data && data.values) {
      let datas = hasElements(data.values) ? [].concat(data.values) : [];
      if (this.blankValue) {
        datas.unshift({
          label: "",
          value: ""
        });
      }
      if (!this.userDefineOptions) {
        this.innerOptions = datas;
      }
    } else if (error) {
      console.log("error:" + JSON.stringify(error));
    }
  }

  get innerLabel() {
    if (this.label === undefined) {
      const fieldName = this.fieldApiName.fieldApiName;
      if (this.objectInfo && this.objectInfo.data) {
        const column = this.objectInfo.data.fields[fieldName];
        return isEmpty(column) ? "" : column.label;
      }
    }
    return this.label;
  }

  get variant() {
    return isEmpty(this.innerLabel) ? "label-hidden" : "standard";
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
    this.fieldApiName = {
      objectApiName: objName,
      fieldApiName: colName
    };
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
