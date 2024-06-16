import Snackbar from 'react-native-snackbar';

export const dispatchSnackBar = ({text, duration, color, action}) => {
  Snackbar.show(
    action
      ? {
          backgroundColor: color,
          numberOfLines: 5,
          text,
          duration:
            duration === 'indefinite'
              ? Snackbar.LENGTH_INDEFINITE
              : duration === 'long'
              ? Snackbar.LENGTH_LONG
              : Snackbar.LENGTH_SHORT,
          action: {
            text: action.text,
            textColor: action.textColor,
            onPress: action.onPress,
          },
        }
      : {
          backgroundColor: color,
          numberOfLines: 5,
          text,
          duration:
            duration === 'indefinite'
              ? Snackbar.LENGTH_INDEFINITE
              : duration === 'long'
              ? Snackbar.LENGTH_LONG
              : Snackbar.LENGTH_SHORT,
        },
  );
};
