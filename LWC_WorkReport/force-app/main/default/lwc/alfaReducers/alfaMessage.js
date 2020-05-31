import { copyObject, hasElements, mergeObject } from 'c/alfaUtilities';

const emptyMessage = {
  successes: [],
  errors: [],
  warns: [],
  infos: [],
  singleValidationErrors: [],
  // Errorがあっても通知は一回のみにするため、通知したらfalseにする
  errorNotification: false,
  validationErrorNotification: false,
};

export function message(state = copyObject(emptyMessage), action) {
  let oldMessage;
  let newMessage;
  let errorNotification;
  let validationErrorNotification;

  switch (action.type) {
    case 'CLEAR_MESSAGES':
      return copyObject(emptyMessage);
    case 'CLEAR_SUCCESSES':
      return {...state, successes: []};
    case 'CLEAR_ERRORS':
      return {...state, errors: []};
    case 'CLEAR_WARNS':
      return {...state, warns: []};
    case 'CLEAR_INFOS':
      return {...state, infos: []};
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        errorNotification: false,
        validationErrorNotification: false,
      };
    case 'ADD_MESSAGES':
      // 複数コンポーネントは同じStoreを使う可能性があるので、messageは常にマージする
      oldMessage = Object.assign({}, state);
      errorNotification = oldMessage.errorNotification || hasElements(action.payload.errors) || hasElements(action.payload.singleValidationErrors);
      validationErrorNotification = oldMessage.validationErrorNotification || hasElements(action.payload.singleValidationErrors);
      newMessage = {
        successes: action.payload.successes,
        errors: action.payload.errors,
        warns: action.payload.warns,
        infos: action.payload.infos,
        singleValidationErrors: action.payload.singleValidationErrors,
        errorNotification,
        validationErrorNotification,
      }
      return mergeObject(oldMessage, newMessage);
    default:
      return state;
  }
}