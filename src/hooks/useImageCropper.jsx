import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {dispatchSnackBar} from 'utils/snackbar';
const useImageCropper = closeContactsImageUploadOptionsDrawer => {
  const [image, setImage] = useState(null);
  const clearImage = () => setImage(null);
  const openCamera = () =>
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      useFrontCamera: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        setImage(image);
        closeContactsImageUploadOptionsDrawer();
      })
      .catch(error => {
        dispatchSnackBar({text: 'Image Upload Cancelled'});
        closeContactsImageUploadOptionsDrawer();
      });

  const openGallery = () =>
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        setImage(image);
        closeContactsImageUploadOptionsDrawer();
      })
      .catch(error => {
        dispatchSnackBar({text: 'Image Upload Cancelled'});
        closeContactsImageUploadOptionsDrawer();
      });

  return [image, openCamera, openGallery, clearImage];
};

export default useImageCropper;
