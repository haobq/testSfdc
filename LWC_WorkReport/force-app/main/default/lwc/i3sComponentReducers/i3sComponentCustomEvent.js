import { CONSTANTS } from "c/i3sComponentUtilities";
export function customEvent(state = {}, action) {
  switch (action.type) {
    case "dataTable/OPEN_RECORD":
      return {
        eventType: CONSTANTS.EVENT_TYPE.OPEN_RECORD,
        eventName: CONSTANTS.EVENT_TYPE.OPEN_RECORD,
        params: {
          targetId: action.payload.targetId
        }
      };
    case "CLEAR_CUSTOM_EVENT":
      return {
        eventType: "",
        eventName: "",
        params: {}
      };
    case "SEND_CUSTOM_EVENT":
      return {
        eventType: action.payload.eventType,
        eventName: action.payload.eventName,
        params: action.payload.params
      };
    default:
      return state;
  }
}
