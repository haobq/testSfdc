import {
  isEmpty,
  trimString,
  DEFAULT_DATA_NAME
} from "c/i3sComponentUtilities";

// スピナー表示
export const showSpinner = () => {
  return {
    type: "SHOW_SPINNER"
  };
};

// スピナー非表示
export const hideSpinner = () => {
  return {
    type: "HIDE_SPINNER"
  };
};

// メッセージクリア
export const clearMessage = () => {
  return {
    type: "CLEAR_MESSAGES"
  };
};

// errorsクリア
export const clearErrors = () => {
  return {
    type: "CLEAR_ERRORS"
  };
};

// warnsクリア
export const clearWarns = () => {
  return {
    type: "CLEAR_WARNS"
  };
};

// warnsクリア
export const clearInfos = () => {
  return {
    type: "CLEAR_INFOS"
  };
};

// 通知フラグクリア
export const clearNotification = () => {
  return {
    type: "CLEAR_NOTIFICATION"
  };
};

// 成功メッセージクリア
export const clearSuccessMessage = () => {
  return {
    type: "CLEAR_SUCCESSES"
  };
};

// メッセージ追加
export const addMessages = (messages) => {
  return {
    type: "ADD_MESSAGES",
    payload: {
      successes: messages.successes,
      infos: messages.infos,
      warns: messages.warns,
      errors: messages.errors,
      singleValidationErrors: messages.singleValidationErrors
    }
  };
};

// open dialog
export const openDialog = (title, contents) => {
  return {
    type: "OPEN_DIALOG",
    payload: {
      title,
      contents
    }
  };
};

// close dialog
export const closeDialog = () => {
  return {
    type: "CLOSE_DIALOG"
  };
};

// send custom event
export const sendCustomEvent = (eventType, eventName, params) => {
  return {
    type: "SEND_CUSTOM_EVENT",
    payload: {
      eventType,
      eventName,
      params
    }
  };
};

// clear custom event
export const clearCustomEvent = () => {
  return {
    type: "CLEAR_CUSTOM_EVENT"
  };
};

// 共通部品OnBlurイベント
export const handleOnblur = (event) => {
  let key = event.target.name;

  // 階層が入っている
  let keys = [];

  if (isEmpty(key)) {
    return {};
  }

  // 項目名のみの場合、default objectを入れる
  if (!key.includes(".")) {
    keys.push(DEFAULT_DATA_NAME);
    keys.push(key);
  } else {
    keys = key.split(".");
  }

  // 業務ロジックにはstoreが必要なため、payloadに入れておく
  return {
    type: "ONBLUR_EVENT",
    payload: {
      objName: keys[0],
      colName: keys[1]
    }
  };
};

// 共通部品ONCHANGEイベント
export const handleInputChanged = (event) => {
  let value = event.target.value;
  let key = event.target.name;

  // Group Nameを重複しなように、先頭にStoreNameがついているため
  if (event.target.type === "radio") {
    const idx = key.indexOf("_");
    key = key.slice(idx + 1);
  }

  // 階層が入っている
  let keys = [];

  if (isEmpty(key)) {
    return {};
  }

  // 項目名のみの場合、default objectを入れる
  if (!key.includes(".")) {
    keys.push(DEFAULT_DATA_NAME);
    keys.push(key);
  } else {
    keys = key.split(".");
  }

  if (event.target.type === "checkbox") {
    value = event.target.checked;
  }

  // textとtextareaの場合、trim
  if (
    event.target.type === "text" ||
    event.target.nodeName === "LIGHTNING-TEXTAREA"
  ) {
    value = trimString(value);
  }

  // 業務ロジックにはstoreが必要なため、payloadに入れておく
  return {
    type: "data/UPDATE_COLUMN_ONCHANGE_EVENT",
    payload: {
      objName: keys[0],
      colName: keys[1],
      value: value
    }
  };
};

/* Store更新 */
export const mergeStore = (newStore) => {
  return {
    type: "MERGE_STORE",
    payload: newStore
  };
};

/* label */
export const setCustomLabels = (label) => {
  return {
    type: "label/SET_CUSTOM_LABELS",
    payload: { label }
  };
};

// ボタンのOnclickイベント
export const handlebuttonClicked = (btnName, pageName) => {
  let type = "button/CLICKED_EVENT";
  if (!isEmpty(pageName)) {
    type += "/" + pageName.toUpperCase();
  }
  // 業務ロジックにはstoreが必要なため、payloadに入れておく
  return {
    type,
    payload: {
      btnName
    }
  };
};

/* LookupSearch dosearchイベント */
export const doLookupSearch = (caller, keyword) => {
  return {
    type: "lookup/SEARCH",
    payload: {
      caller: caller,
      keyword: keyword
    }
  };
};

// 検索結果更新
export const updSearchResults = (key, value) => {
  return {
    type: "data/info/searchResults/UPDATE",
    payload: {
      key: key,
      value: value
    }
  };
};

// 検索結果クリア
export const clearSearchResults = () => {
  return {
    type: "data/info/searchResults/CLEAR"
  };
};

// 選択値更新
export const updSearchSelection = (key, value) => {
  return {
    type: "data/info/searchSelection/UPDATE",
    payload: {
      caller: key,
      value: value
    }
  };
};

/* LookupSearch set input valueイベント */
export const setLookupInputValue = (caller, value) => {
  return {
    type: "data/info/searchInput/UPDATE",
    payload: {
      caller,
      value
    }
  };
};

// 選択値クリア
export const clearSearchSelection = (key) => {
  return {
    type: "data/info/searchSelection/CLEAR",
    payload: {
      caller: key
    }
  };
};

/* LookupSearch foucsイベント */
export const setLookupInputFoucs = (key) => {
  return {
    type: "data/info/searchInput/SET_FOUCS",
    payload: {
      caller: key
    }
  };
};

/* LookupSearch clear foucsイベント */
export const clearLookupInputFoucs = () => {
  return {
    type: "data/info/searchInput/CLEAR_FOUCS"
  };
};

/* DataTable display allイベント */
export const displayAll = (params) => {
  let type = "dataTable/DISPLAY_ALL";
  if (!isEmpty(params.pageName)) {
    type += "/" + params.pageName.toUpperCase();
  }

  return {
    type,
    payload: {
      params
    }
  };
};

/* DataTable checkbox onchangeイベント */
export const checkInDataTable = (params) => {
  return {
    type: "dataTable/UPDATE_CHECKBOX_ONCHANGE_EVENT",
    payload: {
      params
    }
  };
};

/* DataTable button onclickイベント */
export const handleDataTableButtonClicked = (event) => {
  const params = event.detail;
  return {
    type: "dataTable/BUTTON_CLICKED_EVENT",
    payload: {
      params
    }
  };
};

/* DataTable hyperlink(標準画面へ) onclickイベント */
export const openRecord = (event) => {
  const targetId = event.detail;
  return {
    type: "dataTable/OPEN_RECORD",
    payload: {
      targetId
    }
  };
};

/* DataTable hyperlink onclickイベント */
export const openLink = (event) => {
  const params = event.detail;
  return {
    type: "dataTable/OPEN_LINK",
    payload: {
      params
    }
  };
};

/* 確認ダイヤログ×ボタンイベント */
export const closeConfirmDialog = (section) => {
  return {
    type: "CLOSE_CONFIRM_DIALOG",
    payload: {
      section
    }
  };
};
