import { isEmpty, formatMessages } from "c/i3sComponentUtilities";

const messageSelector = (state) => state.message;

const emptyMessage = {
  successes: [],
  infos: [],
  warns: [],
  errors: [],
  errorNotification: false,
  validationErrorNotification: false
};

/* message */
export const getMessage = () => {
  const { createSelector } = window.Reselect;
  return createSelector([messageSelector], (message) => {
    if (isEmpty(message)) {
      return emptyMessage;
    }
    const successes = message.successes;
    const infos = formatMessages(message.infos);
    const warns = formatMessages(message.warns);
    const errors = formatMessages(message.errors);
    const errorNotification = message.errorNotification;
    const validationErrorNotification = message.validationErrorNotification;
    return {
      successes,
      errors,
      warns,
      infos,
      errorNotification,
      validationErrorNotification
    };
  });
};