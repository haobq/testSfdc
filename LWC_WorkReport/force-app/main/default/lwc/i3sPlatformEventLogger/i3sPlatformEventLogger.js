import createLog from "@salesforce/apex/i3s_LoggerCtrl.createLog";

// ログ出力処理のミドルウェア
export default function createPlatformEventLogger() {
  return ({ getState }) => {
    return (next) => {
      return (action) => {
        if (action.logging && action.logging === true) {
          createLog({ action: action }).catch((e) => {
            console.error(e, getState());
          });
        }

        return next(action);
      };
    };
  };
}