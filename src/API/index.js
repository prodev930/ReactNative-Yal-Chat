import {login, signup} from './requests/auth';
import {
  resendOTP,
  submitLoginOTP,
  submitSignupOTP,
} from './requests/verification';

export const API = {
  auth: {
    login,
    signup,
  },
  verification: {
    submitLoginOTP,
    submitSignupOTP,
    resendOTP,
  },
};
