// import React from 'react';
// import {SubTitleText, Title, Welcome} from '../Auth.styled';
// import useTheme from 'hooks/useTheme';
// import {Text, useColorScheme} from 'react-native';
// import {MT} from 'styled/MT';
// import FlexedJustifiedAligned from 'styled/FlexedJustifiedAligned';
// import {SolidButton} from 'components/Buttons/SolidButton';
// import {AuthFooterContainer} from '../Auth.styled';
// import AuthWrapper from '../AuthWrapper';
// import {Logo} from 'assets/svgs';
// import {normalize} from 'utils/normalize';
// import {useNavigation, useRoute} from '@react-navigation/native';

// const TitleComponent = () => {
//   const theme = useTheme();
//   return (
//     <Logo
//       width={normalize(80)}
//       height={normalize(80)}
//       style={{color: theme.colors.white}}
//     />
//   );
// };

// const Main = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {to} = route.params || {};
//   const theme = useTheme();
//   const colorSheme = useColorScheme();
//   return (
//     <>
//       <FlexedJustifiedAligned>
//         <Welcome
//           color={
//             colorSheme === 'light' ? theme.colors.primary : theme.colors.white
//           }>
//           Verification failed!
//         </Welcome>
//       </FlexedJustifiedAligned>
//       <MT MT={theme.spacings.verticalScale.s12} />
//       <FlexedJustifiedAligned>
//         <SubTitleText>{`Something’s wrong, OTP doesn't seem to match.`}</SubTitleText>
//       </FlexedJustifiedAligned>
//       <MT MT={theme.spacings.verticalScale.s36} />
//       <AuthFooterContainer>
//         <SolidButton width={100} onPress={() => navigation.navigate(to)}>
//           Try Again
//         </SolidButton>
//         <Text></Text>
//       </AuthFooterContainer>
//     </>
//   );
// };

// const Verificationfailed = () => {
//   return <AuthWrapper Main={Main} TitleComponent={TitleComponent} />;
// };

// export default Verificationfailed;
import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {authScreensLogo} from 'assets/images';
import {useNavigation} from '@react-navigation/native';

const Verificationfailed = () => {
  const navigation = useNavigation();

  const Container = styled.ScrollView`
    flex: 1;
    backgroundcolor: white;
  `;

  const LogoImage = styled.Image``;

  const AuthButton = styled.TouchableOpacity`
    background-color: #5d3ab7;
    padding: 12px;
    border-radius: 20px;
    margin-horizontal: 20px;
  `;

  const AuthBoldText = styled.Text`
    color: black;
    font-size: 18px;
    font-weight: 500;
  `;

  const AuthLightText = styled.Text`
    color: black;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    padding-horizontal: 12px;
  `;

  return (
    <Container contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={'white'} />
      <View style={styles.upperContainer}>
        <LogoImage
          source={authScreensLogo}
          style={{height: 150, width: 150}}
          resizeMode="contain"
        />
        <AuthBoldText style={{paddingTop: 26}}>
          Verification Failed
        </AuthBoldText>
        <AuthLightText style={{paddingTop: 4}}>
          Somethings wrong OTP doesn’t seems to match
        </AuthLightText>
      </View>
      <View style={{paddingBottom: 20}}>
        <AuthButton
          onPress={() => {
            // navigation.navigate('OTP_VERIFY');
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Try Again
          </Text>
        </AuthButton>
      </View>
    </Container>
  );
};

export default Verificationfailed;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
});
