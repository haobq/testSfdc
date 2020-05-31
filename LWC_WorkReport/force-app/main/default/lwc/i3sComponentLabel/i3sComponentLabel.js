import { LightningElement, api, wire, track } from "lwc";
import { CONSTANTS } from "c/i3sComponentConstants";
import {
  regist,
  isEmpty,
  getStoreData,
  DEFAULT_DATA_NAME,
  MAP_DATA2OBJECT
} from "c/i3sComponentUtilities";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class I3sComponentLabel extends LightningElement {
  @api storeName;
  @api label;
  @api value;
  @api fixHeight = 0;
  @api columnName;
  @api horizontal = false;
  @track innerValue;
  @track textClass;
  @track showSection;
  @track objectApiName;
  @track fieldApiName;

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

    this.objectApiName = {
      objectApiName: objName
    };
    this.fieldApiName = colName;

    // columnName未指定の場合のエラー回避
    if (!isEmpty(this.columnName)) {
      if (this.columnName.includes(".")) {
        keys = this.columnName.split(".");
        objName = MAP_DATA2OBJECT[keys[0]];
        colName = keys[1];
      } else {
        objName = MAP_DATA2OBJECT[DEFAULT_DATA_NAME];
        colName = this.columnName;
      }
    }
  }

  get hasHorizontalLabel() {
    return !isEmpty(this.label) && this.horizontal;
  }

  get hasVerticalLabel() {
    return !isEmpty(this.label) && !this.horizontal;
  }

  get innerstyle() {
    return this.fixHeight > 0 && isEmpty(this.innerValue)
      ? "height:" + this.fixHeight + "px"
      : "";
  }

  get title() {
    return isEmpty(this.label) ? "" : this.label + CONSTANTS.ZENKA_SEMI_COLON;
  }

  getColumnValue = (state) => {
    return isEmpty(this.value)
      ? getStoreData(state.data, this.columnName)
      : this.value;
  };

  getShowSection = (state) => {
    return getStoreData(state.control.visibility, this.columnName, true);
  };

  mapStateToProps = (state) => ({
    innerValue: this.getColumnValue(state),
    showSection: this.getShowSection(state)
  });

  connectedCallback() {
    regist(this.mapStateToProps, null, this.storeName)(this);
    this.getObjectFieldApiInfo();
  }
}
