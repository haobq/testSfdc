import { LightningElement, track, api } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";

import reduxResourceURL from "@salesforce/resourceUrl/redux";
import reduxSagaResourceURL from "@salesforce/resourceUrl/reduxSaga";
import reselectResourceURL from "@salesforce/resourceUrl/reselect";

import { DEFAULT_STORE_NAME } from "c/i3sComponentUtilities";
import createDebugLogger from "c/i3sComponentDebugLogger";
import createPlatformEventLogger from "c/i3sPlatformEventLogger";

export default class I3sComponentContainer extends LightningElement {
  @track resourceLoaded = false;
  @api storeName;
  @api reducers;
  @api initialState = {};
  @api useCombineReducers = false;
  @api rootSaga;

  async connectedCallback() {
    // デコレーションされているストア名を直接変更しない
    const storeName_ = this.storeName ? this.storeName : DEFAULT_STORE_NAME;

    // 3rd Party ライブラリのロード
    await Promise.all([
      loadScript(this, reduxResourceURL),
      loadScript(this, reduxSagaResourceURL),
      loadScript(this, reselectResourceURL)
    ]);

    // Redux
    const { createStore, applyMiddleware, combineReducers } = window.Redux;

    // Redux-Saga
    const createSagaMiddleware = window.ReduxSaga.default;

    // Middlewareを付与してStoreを作成する
    const sagaMiddleware = createSagaMiddleware();
    const platformEventLogMiddleware = createPlatformEventLogger();
    const debugLogMiddleware = createDebugLogger(storeName_);
    const store = createStore(
      this.useCombineReducers ? combineReducers(this.reducers) : this.reducers,
      this.initialState,
      applyMiddleware(
        sagaMiddleware,
        platformEventLogMiddleware,
        debugLogMiddleware
      )
    );

    // グローバル領域に名前付きでストアを差し込んでおく
    window.reduxStores = window.reduxStores || {};
    const currentStore = window.reduxStores[storeName_] || {};

    // 複数画面同じstoreを使う場合、Combine Sagas
    store.rootSagas = currentStore.rootSagas || [];
    if (this.rootSaga) {
      store.rootSagas.push(this.rootSaga);
    }

    // Sagaの実行開始
    store.rootSagas.forEach((rootSaga) => {
      sagaMiddleware.run(rootSaga);
    });

    // グローバル領域に名前付きでストアを差し込んでおく
    window.reduxStores[storeName_] = store;

    // プロバイダ初期化処理が完了したので、再レンダリング
    this.resourceLoaded = true;
  }
}
