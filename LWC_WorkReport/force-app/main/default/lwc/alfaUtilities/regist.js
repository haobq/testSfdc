import { DEFAULT_STORE_NAME } from './constants';

// Reduxフローに作成したステート情報とディスパッチ処理を登録する
export default function regist(
  mapStateToAttributes,
  mapDispatchToAttributes,
  storeName = DEFAULT_STORE_NAME
) {
  return (component) => {
    const { bindActionCreators } = window.Redux;
    const { getState, subscribe, dispatch } = window.reduxStores[storeName];

    // Store内のステートとコンポーネントの属性をリンクする
    if (mapStateToAttributes) {
      const handleStateChanges = () => {
        const state = getState();
        const attributeMap = mapStateToAttributes(state, component);

        Object.entries(attributeMap).forEach(([key, value]) => {
          // コンポーネントの中の同一キー名の”フィールド”を更新
          component[key] = value;
        });
      };

      // ハンドラ実行
      handleStateChanges();

      // コンポーネントの廃棄時にハンドラをクリアするために必要
      component.unsubscribe = subscribe(handleStateChanges);
    }

    // Actionのディスパッチャーへの登録
    if (mapDispatchToAttributes) {
      const attributeDispatchMap =
        typeof mapDispatchToAttributes === 'function'
          ? mapDispatchToAttributes(dispatch, component)
          : bindActionCreators(mapDispatchToAttributes, dispatch);

      Object.entries(attributeDispatchMap).forEach(([key, value]) => {
        // コンポーネントの中の同一キー名の”ファンクション”を更新
        component[key] = value;
      });
    }
  };
}