/**
  * ログレコーダー
  */
public class i3s_LogRecorder {

    private List<i3s_Log__e> logs = new list<i3s_Log__e>();
    private String action = '';
    private String execClass = '';
    private String userName = UserInfo.getName();
    private String detail = '';
    private Datetime opertionDatetime = System.Now();

    /**
     * コンストラクタ
     */
    public i3s_LogRecorder() {
    }

    /**
     * アクション設定
     * アクションを設定する。
     * @param action アクション設定
     */
    public void setAction(String action) {
        this.action = action;
    }

    /**
     * クラス名設定
     * クラス名を設定する。
     * @param execClass クラス名
     */
    public void setExecClass(String execClass) {
        this.execClass = execClass;
    }

    /**
     * ユーザ名設定
     * ユーザ名を設定する。
     * @param userName ユーザ名
     */
    public void setUserName(String userName) {
        this.userName = userName;
    }

    /**
     * 詳細情報設定
     * 　詳細情報を記録する。
     * 　文字列が128キロバイトより長い場合、128キロバイトで切り捨てられる。
     * @param detail 記録する詳細情報
     */
    public void setDetail(String detail) {
        i3s_Log__e log = newLog();
        log.Detail__c = detail.left(Schema.SObjectType.i3s_Log__e.Fields.Detail__c.getLength());
        logs.add(log);
    }

    /**
     * 詳細情報設定（Exception入力）
     * 　例外情報を記録する。
     * 　文字列が128キロバイトより長い場合、128キロバイトで切り捨てられる。
     * @param e 記録する例外情報
     */
    public void setDetail(Exception e) {
        String exInfo = '<Exception Type>\r\n ' + e.getTypeName();
        exInfo += '\r\n<Message>\r\n ' + e.getMessage();
        exInfo += '\r\n<Line Number>\r\n ' + String.valueOf(e.getLineNumber());
        exInfo += '\r\n<Stack Trace>\r\n ' + e.getStackTraceString();

        i3s_Log__e log = newLog();
        log.Detail__c = exInfo.left(Schema.SObjectType.i3s_Log__e.Fields.Detail__c.getLength());
        logs.add(log);
    }

    /**
     * 新規ログインスタンスを生成して返す。
     */
    private i3s_Log__e newLog() {
        i3s_Log__e log = new i3s_Log__e();
        log.Action__c = this.action;
        log.ExecClass__c = this.execClass;
        log.UserName__c = this.userName;
        log.OperationDatetime__c = opertionDatetime;
        return log;
    }

    /**
     * ログ書き込み
     */
    public boolean writeLog() {
        Boolean result = true;
        List<Database.SaveResult> srList = EventBus.publish(logs);
        for (Database.SaveResult sr : srList) {
            if (!sr.isSuccess()) {
                result = false;
                for (Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' + err.getStatusCode() + ' - ' + err.getMessage());
                }
            }
        }
        return result;
    }

}