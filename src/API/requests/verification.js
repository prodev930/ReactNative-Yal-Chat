import {post} from 'API/apiService';
import endPoints from 'API/endPoints';

export const resendOTP = async ({VT}) => {
  try {
    const response = await post(endPoints.verification.resendOTP, {VT});
    return response;
  } catch (err) {
    throw err;
  }
};

export const submitLoginOTP = async ({VT, OTP}) => {
  try {
    const response = await post(endPoints.verification.submitLoginOTP, {
      VT,
      OTP,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const submitSignupOTP = async ({VT, OTP, name, email}) => {
  try {
    const response = await post(endPoints.verification.submitSignupOTP, {
      VT,
      OTP,
      name,
      email,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
