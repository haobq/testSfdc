export function spinner(state = {}, action) {
  switch (action.type) {
    // 初期値設定
    case 'INIT_APPLICATION':
      return {
        showSpinner: false
      };
    case 'SHOW_SPINNER':
      return {
        showSpinner: true
      };
    case 'HIDE_SPINNER':
      return {
        showSpinner: false
      };
    default:
      return state;
  }
}