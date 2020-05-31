public with sharing class i3s_LoggerCtrl {
    @AuraEnabled
    public static void createLog(String action, String detail) {
        i3s_Log__e newsEvent = new i3s_Log__e (
            Action__c = action,
            UserName__c = UserInfo.getName(),
            OperationDatetime__c = System.Now(),
            Detail__c = detail
        );
        // イベントを公開する
        Database.SaveResult sr = EventBus.publish(newsEvent);
        if (!sr.isSuccess()) {
            String message = '';
            for (Database.Error err : sr.getErrors()) {
                message += (message == '' ? '' : '\n') + err.getMessage();
            }
            throw new AuraHandledException(message);
        }
    }

}