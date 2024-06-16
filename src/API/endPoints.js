const originDev = 'cb5f-2402-a00-1b1-1988-ec3d-8bac-3a90-3129.ngrok-free.app/';
const apiRootDev = `https://${originDev}`;
const apiRoot = apiRootDev;
// https://
// const originProd = '52.66.211.195:3001/';
// const apiRootProd = `http://${originProd}`;
// const apiRoot = apiRootProd;

const apiVersion = 'api/';
const apiRootWithVersion = `${apiRoot}${apiVersion}`;

const servicePaths = {
  auth: 'auth',
  verification: 'verification',
};

export default endPoints = {
  auth: {
    login: `${apiRootWithVersion}${servicePaths.auth}/login`,
    signup: `${apiRootWithVersion}${servicePaths.auth}/signup`,
  },
  verification: {
    resendOTP: `${apiRootWithVersion}${servicePaths.verification}/resendOTP`,
    submitLoginOTP: `${apiRootWithVersion}${servicePaths.verification}/submitLoginOTP`,
    submitSignupOTP: `${apiRootWithVersion}${servicePaths.verification}/submitSignupOTP`,
  },
};
