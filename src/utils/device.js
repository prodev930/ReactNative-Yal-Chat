import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');
const aspectRatio = height / width;
export const BASE_DIMENSIONS = Platform?.isPad
  ? {
      width: 1800,
      height: 2560,
    }
  : {
      width: 375,
      height: 812,
    };

export {width, height};
