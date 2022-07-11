import { getData } from "./httpCall";
import { header } from "./header";

export const otherUsers = async (userType, token) => {
  const baseUrl = process.env.REACT_APP_BETACARE_URL;

  const url =
    userType === "PATIENT"
      ? `${baseUrl}/api/message/doctors`
      : `${baseUrl}/api/message/patients`;

  return await getData(url, header(token));
};
