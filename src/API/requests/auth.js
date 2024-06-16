import {post} from 'API/apiService';
import endPoints from 'API/endPoints';

export const login = async ({countryCode, phoneNumber}) => {
  try {
    const response = await post(endPoints.auth.login, {
      countryCode,
      phoneNumber,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const signup = async ({countryCode, phoneNumber}) => {
  try {
    const response = await post(endPoints.auth.signup, {
      countryCode,
      phoneNumber,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
