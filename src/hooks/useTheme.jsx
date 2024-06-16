import {darkTheme, lightTheme} from 'constants/theme';
import {useColorScheme} from 'react-native';
const useTheme = () => {
  const colorScheme = useColorScheme();

  return colorScheme === 'light'
    ? {...lightTheme, colorScheme, contentStyle: 'dark-content'}
    : colorScheme === 'dark'
    ? {...darkTheme, colorScheme, contentStyle: 'light-content'}
    : {...lightTheme, colorScheme, contentStyle: 'dark-content'};
};

export default useTheme;
