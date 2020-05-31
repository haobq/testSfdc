import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import {
  regist,
  isEmpty,
  hasElements,
  getStoreData,
  MAP_DATA2OBJECT,
  DEFAULT_DATA_NAME,
  getSingleValidationErrors
} from "c/i3sComponentUtilities";

export default class I3sComponentRadioGroup extends LightningElement {
  @api storeName;
  @api columnName;
  @api vertical = false;
  @api boldTitle = false;
  @api displayLabel = false;
  @api userDefineOptions = false;
  @track innerClass;
  @track innerOptions;
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
      if (!this.userDefineOptions) {
        this.innerOptions = datas;
      }
    } else if (error) {
      console.log("error:" + JSON.stringify(error));
    }
  }

  get label() {
    if (this.displayLabel) {
      const fieldName = this.fieldApiName.fieldApiName;
      if (this.objectInfo && this.objectInfo.data) {
        const column = this.objectInfo.data.fields[fieldName];
        return isEmpty(column) ? "" : column.label;
      }
    }
    return "";
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

  getInnerClass = (state) => {
    const visible = getStoreData(
      state.control.visibility,
      this.columnName,
      true
    );
    return visible === false ? "slds-hide" : "";
  };

  mapStateToProps = (state) => ({
    innerClass: this.getInnerClass(state),
    validationErrors: getSingleValidationErrors(state, this.columnName)
  });

  connectedCallback() {
    regist(this.mapStateToProps, null, this.storeName)(this);
    this.getObjectFieldApiInfo();
  }
}
