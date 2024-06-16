// import React, {useState} from 'react';
// import {
//   InputTitleText,
//   LinkText,
//   LinkTextHighlight,
//   SubTitleText,
//   Title,
//   Welcome,
// } from '../Auth.styled';
// import useTheme from 'hooks/useTheme';
// import {Text, useColorScheme} from 'react-native';
// import {MT} from 'styled/MT';
// import FlexedJustifiedAligned from 'styled/FlexedJustifiedAligned';
// import InputBox from 'components/Inputs/InputBox';
// import DropDown from 'components/Inputs/DropDown';
// import {countryCode} from 'constants/countryCode';
// import {SolidButton} from 'components/Buttons/SolidButton';
// import {AuthFooterContainer} from '../Auth.styled';
// import {screens} from 'constants/screens';
// import AuthWrapper from '../AuthWrapper';
// import {useNavigation} from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {API} from 'API';

// const TitleComponent = () => <Title>Sign Up</Title>;

// const Main = () => {
//   const navigation = useNavigation();
//   const theme = useTheme();
//   const colorSheme = useColorScheme();
//   const [mobile, setMobile] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [country, setCountry] = useState({
//     name: 'India',
//     flag: '🇮🇳',
//     code: 'IN',
//     dial_code: '+91',
//   });

//   const handleSignup = async () => {
//     try {
//       const response = await API.auth.signup({
//         countryCode: `${country.dial_code}`,
//         phoneNumber: `${mobile}`,
//       });
//       if (response.data.success) {
//         const {VT} = response.data;
//         navigation.navigate(screens.AUTH.VERIFICATION, {
//           VT,
//           countryCode: `${country.dial_code}`,
//           phoneNumber: `${mobile}`,
//           from: screens.AUTH.SIGNUP,
//         });
//       }
//     } catch (err) {
//       if (err.response.status === 409) {
//         navigation.navigate(screens.AUTH.USER_EXISTS);
//       }
//     }
//   };

//   return (
//     <>
//       <MT MT={theme.spacings.verticalScale.s12} />
//       <FlexedJustifiedAligned>
//         <Welcome
//           color={
//             colorSheme === 'light' ? theme.colors.primary : theme.colors.white
//           }>
//           Let’s get started
//         </Welcome>
//       </FlexedJustifiedAligned>
//       <FlexedJustifiedAligned>
//         <SubTitleText>Create your new account</SubTitleText>
//       </FlexedJustifiedAligned>
//       <MT MT={theme.spacings.verticalScale.s36} />
//       <InputTitleText>Please enter your phone number</InputTitleText>
//       <MT MT={theme.spacings.verticalScale.s15} />
//       <FlexedJustifiedAligned style={{justifyContent: 'space-between'}}>
//         <DropDown
//           data={countryCode.map(d => ({
//             label: `${d.flag} (${d.dial_code}) ${d.name}`,
//             data: d,
//             disabled: false,
//             icon: false,
//           }))}
//           value={country.flag}
//           onUpdate={setCountry}
//           placeholder={country.flag}
//           width={30}
//           rounded={true}
//         />
//         <InputBox
//           placeholder="000 000 0000"
//           width={65}
//           value={mobile}
//           onChangeText={setMobile}
//           rounded={true}
//           maxLength={10}
//           inputMode="numeric"
//         />
//       </FlexedJustifiedAligned>
//       {/* <MT MT={theme.spacings.verticalScale.s15} />
//       <InputTitleText>Please enter your name</InputTitleText>
//       <MT MT={theme.spacings.verticalScale.s15} />
//       <InputBox
//         PrependIcon={() => (
//           <Icon
//             name="person"
//             size={20}
//             style={{
//               marginRight: theme.spacings.normalScale.s12,
//               color:
//                 colorSheme === 'light'
//                   ? theme.colors.primary
//                   : theme.colors.white,
//             }}
//           />
//         )}
//         placeholder="Jhon Doe"
//         width={100}
//         value={name}
//         onChangeText={setName}
//         rounded={true}
//       /> */}
//       {/* <MT MT={theme.spacings.verticalScale.s15} />
//       <InputTitleText>Please enter your email</InputTitleText>
//       <MT MT={theme.spacings.verticalScale.s15} />
//       <InputBox
//         PrependIcon={() => (
//           <Icon
//             name="email"
//             size={20}
//             style={{
//               marginRight: theme.spacings.normalScale.s12,
//               color:
//                 colorSheme === 'light'
//                   ? theme.colors.primary
//                   : theme.colors.white,
//             }}
//           />
//         )}
//         value={email}
//         onChangeText={setEmail}
//         placeholder="jhondoe@shambyte.co"
//         width={100}
//         rounded={true}
//       /> */}
//       <AuthFooterContainer>
//         <SolidButton
//           disabled={mobile && mobile.length === 10 ? false : true}
//           onPress={handleSignup}
//           width={100}>
//           Sign In
//         </SolidButton>
//         <LinkText>
//           Already have an account?{' '}
//           <LinkTextHighlight
//             onPress={() => navigation.navigate(screens.AUTH.LOGIN)}>
//             Log In
//           </LinkTextHighlight>
//         </LinkText>
//         <Text></Text>
//       </AuthFooterContainer>
//     </>
//   );
// };

// const Signup = () => (
//   <AuthWrapper Main={Main} TitleComponent={TitleComponent} />
// );

// export default Signup;
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {authScreensLogo} from 'assets/images';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';

const Signup = () => {
  const navigation = useNavigation();

  const Container = styled.ScrollView`
    flex: 1;
    backgroundcolor: white;
    padding-horizontal: 16px;
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
    <Container
      contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
      style={{backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'white'} />
      <View style={styles.upperContainer}>
        <LogoImage
          source={authScreensLogo}
          style={{height: 150, width: 150, alignSelf: 'center'}}
          resizeMode="contain"
        />
        <AuthBoldText style={{paddingTop: 26, alignSelf: 'center'}}>
          Let’s get started
        </AuthBoldText>
        <AuthLightText style={{paddingTop: 4}}>
          Create your account
        </AuthLightText>

        <Text style={{paddingTop: 32, color: 'black'}}>
          Enter your phone number
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}>
          <View style={{width: '20%'}}>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 100,
                paddingLeft: 16,
                color: '#000',
              }}
              placeholder="+91"
              placeholderTextColor={'#000'}
            />
          </View>
          <View style={{width: '70%', marginLeft: 20}}>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 100,
                paddingLeft: 16,
                color: '#000',
              }}
              placeholder="8447650007"
              placeholderTextColor={'#000'}
            />
          </View>
        </View>
        <View>
          <Text style={{paddingTop: 18, color: 'black'}}>Enter your name</Text>
          <View style={{paddingTop: 8}}>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 100,
                paddingLeft: 16,
                color: '#000',
              }}
              placeholder="John Doe"
              placeholderTextColor={'#000'}
            />
          </View>
        </View>
        <View>
          <Text style={{paddingTop: 18, color: 'black'}}>Enter your Email</Text>
          <View style={{paddingTop: 8}}>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 100,
                paddingLeft: 16,
                color: '#000',
              }}
              placeholder="abc@gmail.com"
              placeholderTextColor={'#000'}
            />
          </View>
        </View>
      </View>
      <View style={{paddingBottom: 20}}>
        <AuthButton
          onPress={() => {
            navigation.navigate(screens.AUTH.USER_EXISTS);
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Verify
          </Text>
        </AuthButton>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 8,
          }}>
          <Text style={{color: 'grey'}}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(screens.AUTH.LOGIN);
            }}>
            <Text style={{color: '#5d3ab7'}}>{'  '}Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default Signup;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    paddingTop: 50,
  },
});
