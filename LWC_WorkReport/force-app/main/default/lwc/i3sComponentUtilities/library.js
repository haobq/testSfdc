import { isEmpty } from "./i3sComponentUtilities";

export function* reduxSagaCall(...params) {
  if (!isEmpty(window.ReduxSaga)) {
    const { call } = window.ReduxSaga.effects;
    return yield call(...params);
  }
  return null;
}

export function* reduxSagaPut(...params) {
  if (!isEmpty(window.ReduxSaga)) {
    const { put } = window.ReduxSaga.effects;
    return yield put(...params);
  }
  return null;
}

export function* reduxSagaSelect(...params) {
  if (!isEmpty(window.ReduxSaga)) {
    const { select } = window.ReduxSaga.effects;
    return yield select(...params);
  }
  return null;
}