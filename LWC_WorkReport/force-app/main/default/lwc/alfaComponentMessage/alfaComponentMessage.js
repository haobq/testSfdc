import { LightningElement, api, track } from 'lwc';
import { getMessage } from 'c/alfaSelectors';
import {
  clearErrors,
  clearWarns,
  clearInfos,
  clearMessage,
  clearNotification,
  clearSuccessMessage,
}
from 'c/alfaActions';
import {
  regist,
  isEmpty,
  hasElements,
  CONSTANTS,
  showSuccessToast,
  showErrorToastPester,
  showErrorToastWithoutTitle,
}
from 'c/alfaUtilities';
export { showMessage, handleException } from './utilities';
import Btn_Confirm from '@salesforce/label/c.EPCC_Btn_Confirm';
import ErrMsg_SingleValidation from '@salesforce/label/c.EPCC_ErrMsg_SingleValidation';

const mapDispatchToProps = {
  clearErrors,
  clearWarns,
  clearInfos,
  clearMessage,
  clearNotification,
  clearSuccessMessage,
};

export default class AlfaComponentMessage extends LightningElement {
  @api storeName;
  @track message;
  dialogTitle = CONSTANTS.DIALOG_TITLE;
  showInPage = CONSTANTS.DEFAULT_MESSAGE_MODE === CONSTANTS.MESSAGE_MODE.SHOW_IN_PAGE;
  showInToast = CONSTANTS.DEFAULT_MESSAGE_MODE === CONSTANTS.MESSAGE_MODE.SHOW_IN_TOAST;

  get dialogTitle() {
    if (this.hasErrors) {
      return CONSTANTS.DIALOG_TITLE.ERROR;
    }
    if (this.hasWarns) {
      return CONSTANTS.DIALOG_TITLE.WARNING;
    }
    return CONSTANTS.DIALOG_TITLE.INFO;
  }

  get hasErrors() {
    return !isEmpty(this.message) && hasElements(this.message.errors);
  }

  get hasWarns() {
    return !isEmpty(this.message) && hasElements(this.message.warns);
  }

  get hasInfos() {
    return !isEmpty(this.message) && hasElements(this.message.infos);
  }

  // 成功messageは常にToastだから、除外する
  get hasMessages() {
    return this.hasErrors || this.hasWarns || this.hasInfos;
  }

  get showMessageInToast() {
    return CONSTANTS.DEFAULT_MESSAGE_MODE === CONSTANTS.MESSAGE_MODE.SHOW_IN_TOAST && this.hasMessages;
  }

  get showMessageInDialog() {
    return CONSTANTS.DEFAULT_MESSAGE_MODE === CONSTANTS.MESSAGE_MODE.SHOW_IN_DIALOG && this.hasMessages;
  }

  makeMapStateToProps = state => {
    const getVisibleMessage = getMessage();
    const mapStateToProps = s => {
      const msg = {message: getVisibleMessage(s)};
      // 成功メッセージは、常にToast
      if (hasElements(msg.message.successes)) {
        msg.message.successes.forEach(success => {
          showSuccessToast(success.message);
        });
        this.clearSuccessMessage();
      }
      // 失敗の場合、Toastで通知
      // Message画面左上表示モード＆エラーの場合、Toastで通知
      if (this.showInPage && msg.message.errorNotification) {
        // 画面上部へ
        window.scroll(0, 0);
        showErrorToastPester(CONSTANTS.ERROR_MSG.CORRECT_ERRORS);
        this.clearNotification();
      } else if (this.showInToast && msg.message.validationErrorNotification) {
        showErrorToastWithoutTitle(this.label.ErrMsg_SingleValidation);
        this.clearNotification();
      }
      return msg;
    };
    return mapStateToProps(state);
  };

  // Expose the labels to use in the template.
  label = {
    Btn_Confirm,
    ErrMsg_SingleValidation
  }

  connectedCallback() {
    regist(this.makeMapStateToProps, mapDispatchToProps, this.storeName)(this);
  }
}