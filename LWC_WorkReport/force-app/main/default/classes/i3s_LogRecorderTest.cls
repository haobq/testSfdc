/**
  * ログレコーダーテストクラス
  */
@isTest
private class i3s_LogRecorderTest {

 /**
  * 　テストケース1
  * 　正常終了の確認
  */
 testMethod static void testCase1() {
  //テスト実行
  Test.startTest();
  i3s_LogRecorder lr = new i3s_LogRecorder();
  lr.setExecClass('TestClass');
  lr.setDetail('エラーログ書き込み単体テスト');
  Boolean resultFlag = lr.writeLog();
  Test.stopTest();
  System.assertEquals(true, resultFlag);
 }

 /**
  * 　テストケース2
  * 　正常終了の確認
  */
 testMethod static void testCase2() {
  //テスト実行
  Test.startTest();
  i3s_LogRecorder lr = new i3s_LogRecorder();
  lr.setExecClass('TestClass');
  lr.setDetail(new CalloutException());
  Boolean resultFlag = lr.writeLog();
  Test.stopTest();
  System.assertEquals(true, resultFlag);
 }

  /**
  * 　テストケース3
  * 　正常終了の確認
  */
 testMethod static void testCase3() {
  //テスト実行
  Test.startTest();
  i3s_LogRecorder lr = new i3s_LogRecorder();
  lr.setExecClass('TestClass');
  lr.setAction('TestAction');
  lr.setUserName('TestUserName');
  lr.setDetail('A'.repeat(Schema.SObjectType.i3s_Log__e.Fields.Detail__c.getLength() + 100));
  lr.setDetail('B'.repeat(100));
  Boolean resultFlag = lr.writeLog();
  Test.stopTest();
  System.assertEquals(true, resultFlag);
 }
}