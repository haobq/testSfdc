import {
  CONSTANTS,
  DEFAULT_STORE_NAME,
  DEFAULT_DATA_NAME,
  MAP_DATA2OBJECT
} from "./constants";
import regist from "./regist";
import { reduxSagaCall, reduxSagaPut, reduxSagaSelect } from "./library";
import {
  showToast,
  showSuccessToast,
  showErrorToast,
  showErrorToastWithoutTitle
} from "./showToast";

export const isEmpty = (element) => {
  return element === undefined || element === null || element === "";
};

export const isObject = (obj) => {
  return obj && typeof obj === "object";
};

export const hasElements = (element) => {
  return !isEmpty(element) && element.length > 0;
};

export const hasProperty = (obj, key) => {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
};

export const getObjectPorperties = (json) => {
  let properties = "";

  if (isEmpty(json)) {
    return properties;
  }

  for (let key in json) {
    properties += key + ":" + json[key] + CONSTANTS.LF;
  }

  return properties;
};

export const mergeObject = (...objects) => {
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = oVal;
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeObject(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
};

export const getKey2Value = (mapValue2Key) => {
  if (isEmpty(mapValue2Key)) {
    return {};
  }

  let key2value = {};
  Object.entries(mapValue2Key).forEach(([key, value]) => {
    key2value[value] = key;
  });

  return key2value;
};

export const copyObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const getStoreData = (state, key, defaultValue = null) => {
  let result = state;

  if (isEmpty(key)) {
    return defaultValue;
  }

  // object.column
  if (key.includes(".")) {
    key.split(".").forEach((name) => {
      if (hasProperty(result, name)) {
        result = result[name];
      } else {
        result = defaultValue;
      }
    });
  } else {
    // defaultの場合、columnだけ
    result = state[DEFAULT_DATA_NAME][key];
  }

  if (isEmpty(result)) {
    return defaultValue;
  }

  return result;
};

export const getDisabled = (disabled, key, defaultValue) => {
  return (
    disabled.allColumns === true || getStoreData(disabled, key, defaultValue)
  );
};

export const getStoreRadio = (state, key) => {
  let result = state;
  let keys;
  const MAX_HIERARCHY_OF_RADIO = 3;

  if (isEmpty(key)) {
    return false;
  }

  keys = key.split(".");
  if (keys.length < MAX_HIERARCHY_OF_RADIO) {
    keys.unshift(DEFAULT_DATA_NAME);
  }

  keys.forEach((name) => {
    if (hasProperty(result, name)) {
      result = result[name];
    } else {
      result = false;
    }
  });

  return result === true;
};

export const getSectionVisibility = (state, key) => {
  if (isEmpty(state) || isEmpty(state.section) || isEmpty(state.section[key])) {
    return true;
  }
  return state.section[key];
};

export const getAreaVisibility = (state, key) => {
  if (isEmpty(state) || isEmpty(state.area) || isEmpty(state.area[key])) {
    return true;
  }
  return state.area[key];
};

export const addDays = (start, day) => {
  let dt = new Date(start);
  const dateDigit = 2;
  dt.setDate(dt.getDate() + day);
  const dd = String(dt.getDate()).padStart(dateDigit, "0");
  const mm = String(dt.getMonth() + 1).padStart(dateDigit, "0");
  const yyyy = dt.getFullYear();
  dt = yyyy + "-" + mm + "-" + dd;
  return dt;
};

export const getSingleValidationErrors = (state, columnName) => {
  let errMsgs = [];
  const validationErrors = state.message.singleValidationErrors;
  if (!hasElements(validationErrors)) {
    return [];
  }

  // 単項目Validationエラー
  validationErrors.forEach((error) => {
    // object名がついている場合、object nameを取り除く
    const columnWithoutObject = columnName.split(".").pop();
    if (error.field === columnWithoutObject) {
      errMsgs.push(error.message);
    }
  });
  return errMsgs;
};

export const getI3sComponentClass = (state, columnName, outerClass) => {
  const visible = getStoreData(state.control.visibility, columnName, true);
  if (visible === false) {
    return "slds-hide";
  }
  const validationErrors = getSingleValidationErrors(state, columnName);
  const errClass = hasElements(validationErrors) ? "slds-has-error" : "";

  return [errClass, outerClass].join(CONSTANTS.HANKA_SPACE);
};

export const formatMessages = (msgObjects) => {
  let newMessages = [];
  if (!hasElements(msgObjects)) {
    return newMessages;
  }

  msgObjects.forEach((msgObject, index) => {
    const msg = msgObject.message;
    newMessages.push({
      key: index,
      msgs: msg.split(CONSTANTS.LF)
    });
  });

  return newMessages;
};

export const stringJoin = (...values) => {
  return [...values].join("");
};

export const trimString = (str) => {
  if (!isEmpty(str)) {
    return str.trim();
  }
  return str;
};

export const getNewStoreName = () => {
  const RIGHT_LEN = 2;
  const dt = new Date();
  const yyyy = dt.getFullYear();
  const mm = ("00" + (dt.getMonth() + 1)).slice(-RIGHT_LEN);
  const dd = ("00" + dt.getDate()).slice(-RIGHT_LEN);
  const hh = ("00" + dt.getHours()).slice(-RIGHT_LEN);
  const mi = ("00" + dt.getMinutes()).slice(-RIGHT_LEN);
  const ss = ("00" + dt.getSeconds()).slice(-RIGHT_LEN);
  return yyyy + mm + dd + hh + mi + ss;
};

export {
  reduxSagaCall,
  reduxSagaPut,
  reduxSagaSelect,
  DEFAULT_STORE_NAME,
  DEFAULT_DATA_NAME,
  MAP_DATA2OBJECT,
  CONSTANTS,
  regist,
  showToast,
  showSuccessToast,
  showErrorToast,
  showErrorToastWithoutTitle
};
