import { postData } from "./httpCall";
import { header } from "./header";

export const userLogin = async (loginRequest) => {
  return await postData(
    `${process.env.REACT_APP_BETACARE_URL}/api/auth/login`,
    loginRequest,
    header()
  );
};
