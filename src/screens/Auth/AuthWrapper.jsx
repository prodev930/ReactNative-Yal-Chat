import React from 'react';
import {
  AuthContentContainer,
  AuthContentContainerTop,
  AuthMainContainer,
} from './Auth.styled';
import useTheme from 'hooks/useTheme';
import {Text, View, useColorScheme} from 'react-native';
import {SquaresDark, SquaresLight} from 'assets/svgs';
import {normalize, verticalScale} from 'utils/normalize';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AuthWrapper = ({Main, TitleComponent, onBackPress}) => {
  const theme = useTheme();
  const colorSheme = useColorScheme();

  return (
    <AuthMainContainer>
      {colorSheme === 'light' ? (
        <SquaresLight style={{position: 'absolute', right: 0, zIndex: 10}} />
      ) : (
        <SquaresDark style={{position: 'absolute', right: 0, zIndex: 10}} />
      )}

      <AuthContentContainerTop>
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0.2, 1]}
          style={{
            width: '100%',
            height: '100%',
          }}
          colors={
            colorSheme === 'light'
              ? [theme.colors.primary, theme.colors.secondary]
              : ['#000000', '#000000']
          }>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: verticalScale(80),
              paddingHorizontal: theme.spacings.normalScale.s24,
            }}>
            {onBackPress ? (
              <Icon
                name="arrow-back"
                size={normalize(25)}
                onPress={() => onBackPress()}
                style={{
                  marginRight: theme.spacings.normalScale.s12,
                  color: theme.colors.white,
                }}
              />
            ) : (
              <Icon
                name="arrow-back"
                size={normalize(25)}
                style={{
                  marginRight: theme.spacings.normalScale.s12,
                  color: 'transparent',
                }}
              />
            )}
            <TitleComponent />
            <Icon
              name="email"
              size={normalize(25)}
              style={{
                marginRight: theme.spacings.normalScale.s12,
                color: 'transparent',
              }}
            />
          </View>
        </LinearGradient>
      </AuthContentContainerTop>
      <AuthContentContainer>
        <Main />
      </AuthContentContainer>
    </AuthMainContainer>
  );
};

export default AuthWrapper;
