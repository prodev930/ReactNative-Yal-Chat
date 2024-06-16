import {BASE_DIMENSIONS, height, width} from './device';

const scale = width / BASE_DIMENSIONS.width;

const normalize = size => Math.round(scale * size);

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = BASE_DIMENSIONS.width;
const guidelineBaseHeight = BASE_DIMENSIONS.height;

const normalizedWidth = size => parseInt((width / guidelineBaseWidth) * size);
const normalizedHeight = size =>
  parseInt((height / guidelineBaseHeight) * size);

const normalScale = size => normalizedWidth(size);
const verticalScale = size => normalizedHeight(size);
const moderateScale = (size, factor = 0.5) =>
  parseInt(size + (normalScale(size) - size) * factor);
const lineHeightScale = (fontSize, factor = 1.2) =>
  Math.ceil(normalizedHeight(fontSize * factor));

export {normalScale, verticalScale, moderateScale, lineHeightScale, normalize};
