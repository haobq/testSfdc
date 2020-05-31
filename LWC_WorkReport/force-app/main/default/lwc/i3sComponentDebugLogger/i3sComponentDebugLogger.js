import { DEFAULT_STORE_NAME } from 'c/alfaUtilities';

// ログ出力処理のミドルウェア
export default function createDebugLogger(storeName = DEFAULT_STORE_NAME) {
  return ({ getState }) => {
    return (next) => {
      return (action) => {
        console.group(`${action.type}%c(${storeName})`, 'font-style: italic');
        console.info('dispatching', action);

        const result = next(action);

        console.log('%c next state', 'color:green', getState());
        console.groupEnd();

        return result;
      };
    };
  };
}