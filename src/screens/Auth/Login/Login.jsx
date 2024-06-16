import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {authScreensLogo} from 'assets/images';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
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
          Enter Your Mobile Number
        </AuthBoldText>
        <AuthLightText style={{paddingTop: 4}}>
          We will send you confirmation code
        </AuthLightText>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            paddingTop: 32,
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
          <View style={{width: '60%', marginLeft: 20}}>
            <TextInput
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 100,
                paddingLeft: 16,
                color: '#000',
              }}
              placeholder="8447650007"
              placeholderTextColor={'#000'}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
      <View style={{paddingBottom: 20}}>
        <AuthButton
          onPress={() => {
            navigation.navigate('OTP_VERIFY');
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Send OTP
          </Text>
        </AuthButton>
      </View>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
});
