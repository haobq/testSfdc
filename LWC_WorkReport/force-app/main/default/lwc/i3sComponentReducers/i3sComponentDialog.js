export function dialog(state = {}, action) {
  switch (action.type) {
    case 'CLOSE_DIALOG':
      return {};
    case 'OPEN_DIALOG':
      return {
        title: action.payload.title,
        contents: action.payload.contents,
      };
    default:
      return state;
  }
}