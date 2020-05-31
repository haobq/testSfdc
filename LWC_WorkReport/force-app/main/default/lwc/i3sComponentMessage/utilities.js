import { addMessages } from "c/i3sComponentActions";
import {
  isEmpty,
  hasElements,
  reduxSagaPut,
  CONSTANTS
} from "c/i3sComponentUtilities";

// エラーオブジェクトをJSON文字列に変換する
// 使い方：JSON.stringify(errors, jsonFriendlyErrorReplacer, 2)
export const jsonFriendlyErrorReplacer = (key, value) => {
  if (value instanceof Error) {
    return {
      ...key,
      ...value,
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }
  return value;
};

// メッセージ表示処理
// apexから返ってきたresultと同じ構造で
// メッセージはそのまま表示できる
export function* showMessage(message) {
  if (isEmpty(message)) {
    return;
  }

  // messageを整形する
  let msg = {
    successes: message.successes,
    infos: message.infos,
    warns: message.warns,
    errors: message.errors,
    singleValidationErrors: message.singleValidationErrors
  };

  if (
    hasElements(msg.successes) ||
    hasElements(msg.infos) ||
    hasElements(msg.warns) ||
    hasElements(msg.errors) ||
    hasElements(msg.singleValidationErrors)
  ) {
    // messageを出す
    yield reduxSagaPut(addMessages(msg));
  }
}

// 例外処理
export function* handleException(error) {
  const msg = JSON.stringify(error, jsonFriendlyErrorReplacer, CONSTANTS.TAB);
  console.log("msg:" + msg);
  let errMsg;

  if (Array.isArray(error.body)) {
    // UI API read errors
    error.body.forEach((err) => {
      errMsg += isEmpty(errMsg) ? err.message : CONSTANTS.LF + err.message;
    });
  } else if (error.body && typeof error.body.message === "string") {
    // UI API DML, Apex and network errors
    errMsg = error.body.message;
    if (!isEmpty(error.body.stackTrace)) {
      errMsg += CONSTANTS.LF + error.body.stackTrace;
    }
  } else if (typeof error.message === "string") {
    // javascript errors
    errMsg = error.message;
    // debug modeをonにし、stack情報を確認する
    console.info(error.stack);
  }

  // メッセージを加工する
  const message = { errors: [{ message: errMsg }] };
  // エラーを表示する
  yield showMessage(message);
}
