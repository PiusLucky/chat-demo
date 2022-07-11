import { getData, patchData } from "./httpCall";
import { header } from "./header";

export const getOfflineNotification = async ({ token }) => {
  const baseUrl = process.env.REACT_APP_BETACARE_URL;
  const url = `${baseUrl}/api/message/offline-messages/count`;

  return await getData(url, header(token));
};

export const cleanUpNotifications = async (id, token) => {
  const baseUrl = process.env.REACT_APP_BETACARE_URL;
  const url = `${baseUrl}/api/message/offline-messages/cleanup?userId=${id}`;

  return await patchData(url, header(token));
};

export const getMessages = async (id, token) => {
  const baseUrl = process.env.REACT_APP_BETACARE_URL;
  const url = `${baseUrl}/api/message/retrieve?userId=${id}&size=40`;

  return await getData(url, header(token));
};
