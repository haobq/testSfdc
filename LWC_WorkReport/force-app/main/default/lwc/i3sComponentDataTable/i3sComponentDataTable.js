import { LightningElement, api, track } from "lwc";
import { regist, isEmpty } from "c/i3sComponentUtilities";
import {
  openRecord,
  openLink,
  displayAll,
  checkInDataTable,
  handleDataTableButtonClicked
} from "c/i3sComponentActions";
import Lbl_RelatedListShowAll from "@salesforce/label/c.RelatedList_ShowAll";

const mapDispatchToProps = {
  openLink,
  openRecord,
  displayAll,
  checkInDataTable,
  handleDataTableButtonClicked
};

export default class i3sComponentDataTable extends LightningElement {
  @api showHeader;
  @api componentName;
  @api tableSize;
  @api isOpenedAsTab = false;
  @api iconName;
  @api title;
  @api storeName;
  @api pageName;
  @api showIndex = false;
  @track columns = [];
  @track records = [];
  @track total;
  @track fieldHelpMsg = {};

  get heading() {
    return this.title + " (" + this.total + ")";
  }

  get hasRecords() {
    return !isEmpty(this.records) && this.records.length > 0;
  }

  get showDisplayAll() {
    return (
      !this.isOpenedAsTab && this.total > this.tableSize && this.tableSize > 0
    );
  }

  handleChecked = (event) => {
    const params = Object.assign({}, event.detail);
    params.componentName = this.componentName;
    params.isShowAll = this.isOpenedAsTab;
    this.checkInDataTable(params);
  };

  handleOnMouseOver(event) {
    let index = event.currentTarget.dataset.index;
    let fieldname = event.currentTarget.dataset.fieldname;
    if (
      !isEmpty(this.records) &&
      this.records.length >= index &&
      index > 0 &&
      fieldname
    ) {
      let record = this.records[index - 1];
      if (record && Object.prototype.hasOwnProperty.call(record, fieldname)) {
        this.fieldHelpMsg = {
          message: record[fieldname],
          left: event.clientX,
          top: event.clientY
        };
      }
    }
  }

  handleOnMouseOut() {
    this.fieldHelpMsg = {};
  }

  getTotalCount = (state) => {
    const relatedList = this.isOpenedAsTab
      ? state.data.showAll[this.componentName]
      : state.data[this.componentName];
    if (isEmpty(relatedList)) {
      return 0;
    }

    if (!isEmpty(relatedList.columns)) {
      this.columns = relatedList.columns.map((column) => {
        column.class = column.type === "Number" ? "numeric-align" : "";
        return column;
      });
    }

    if (!isEmpty(relatedList.records)) {
      // tableSizeを超えた場合、tableSize分だけを表示する(すべて表示モードを除く)
      if (relatedList.records.length > this.tableSize && !this.isOpenedAsTab) {
        relatedList.records = relatedList.records.slice(0, this.tableSize);
      }
      this.records = relatedList.records.map((record, index) => {
        record.index = index + 1;
        return record;
      });
    }
    return isEmpty(relatedList.total) ? 0 : relatedList.total;
  };

  // すべて表示
  displayAllByTab() {
    const params = {
      title: this.title,
      pageName: this.pageName,
      iconName: this.iconName,
      componentName: this.componentName
    };
    this.displayAll(params);
  }

  mapStateToProps = (state) => ({
    total: this.getTotalCount(state)
  });

  // Expose the labels to use in the template.
  label = {
    Lbl_RelatedListShowAll
  };

  connectedCallback() {
    regist(this.mapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}
