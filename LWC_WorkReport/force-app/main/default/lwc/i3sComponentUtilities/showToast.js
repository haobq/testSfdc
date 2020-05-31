import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CONSTANTS } from './constants';

export function showToast(title, variant, message, mode = 'dismissible') {
  const evt = new ShowToastEvent({
    title,
    variant,
    message,
    mode
  });
  dispatchEvent(evt);
}

export function showSuccessToast(message) {
  showToast(CONSTANTS.TOAST_TITLE.SUCCEED, 'success', message);
}

export function showErrorToast(message) {
  showToast(CONSTANTS.TOAST_TITLE.FAILED, 'error', message);
}

export function showErrorToastPester(message) {
  showToast(CONSTANTS.TOAST_TITLE.FAILED, 'error', message, 'pester');
}

export function showErrorToastWithoutTitle(message) {
  showToast(null, 'error', message);
}