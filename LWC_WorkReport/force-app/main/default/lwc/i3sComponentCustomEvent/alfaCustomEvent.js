import { LightningElement, api } from "lwc";
import { regist, isEmpty } from "c/i3sComponentUtilities";
import { clearCustomEvent } from "c/i3sComponentActions";

// you should use apply to pass this
export function sendCustomEvent2Aura(event) {
  if (isEmpty(event.detail) || isEmpty(event.detail.eventType)) {
    return;
  }

  // send event to aura component
  const eventType = event.detail.eventType;
  const eventName = event.detail.eventName;
  const params = event.detail.params;
  // send event to aura
  const auraEvent = new CustomEvent("auraevent", {
    detail: { eventType, eventName, params }
  });
  // dispatches the event.
  this.dispatchEvent(auraEvent);
}

export default class I3sComponentCustomEvent extends LightningElement {
  @api storeName;
  eventName;

  set customEvent(customEvent) {
    if (!isEmpty(customEvent.eventType)) {
      // 未変化の場合、なにもしない
      if (customEvent.eventName !== this.eventName) {
        const auraEvent = new CustomEvent("auraevent", {
          detail: {
            eventType: customEvent.eventType,
            eventName: customEvent.eventName,
            params: customEvent.params
          }
        });
        // dispatches the event.
        this.dispatchEvent(auraEvent);
        // clear the event
        this.clearCustomEvent();
      }
    }
    this.eventName = customEvent.eventName;
  }

  mapStateToProps = (state) => ({
    customEvent: state.customEvent
  });

  mapDispatchToProps = {
    clearCustomEvent
  };

  connectedCallback() {
    regist(this.mapStateToProps, this.mapDispatchToProps, this.storeName)(this);
  }
}
