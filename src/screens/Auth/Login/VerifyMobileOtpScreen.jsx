import {
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import styled from 'styled-components/native';
import {authScreensLogo} from 'assets/images';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';

const VerifyMobileOtpScreen = () => {
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
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
          Enter Verification Code
        </AuthBoldText>
        <AuthLightText style={{paddingTop: 4, textAlign:"center"}}>
          We are automatically detecting a SMS send to your mobile number
          ******3800
        </AuthLightText>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingTop: 32,
            paddingHorizontal: 32,
          }}>
          <View style={{width: '20%'}}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'#000'}
              maxLength={1}
              ref={inputRef1}
              onChangeText={val => {
                if (val?.toString()?.length == 1) {
                  inputRef2?.current.focus();
                }
              }}
              autoFocus={true}
              keyboardType="number-pad"
            />
          </View>
          <View style={{width: '20%'}}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'#000'}
              maxLength={1}
              ref={inputRef2}
              onChangeText={val => {
                if (val?.toString()?.length == 1) {
                  inputRef3?.current.focus();
                }
              }}
              keyboardType="number-pad"
              onKeyPress={e => {
                if (e.nativeEvent.key == 'Backspace') {
                  inputRef1?.current.focus();
                }
              }}
            />
          </View>
          <View style={{width: '20%'}}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'#000'}
              maxLength={1}
              ref={inputRef3}
              onChangeText={val => {
                if (val?.toString()?.length == 1) {
                  inputRef4?.current.focus();
                }
              }}
              keyboardType="number-pad"
              onKeyPress={e => {
                if (e.nativeEvent.key == 'Backspace') {
                  inputRef2?.current.focus();
                }
              }}
            />
          </View>
          <View style={{width: '20%'}}>
            <TextInput
              style={styles.input}
              placeholderTextColor={'#000'}
              maxLength={1}
              ref={inputRef4}
              keyboardType="number-pad"
              onChangeText={val => {
                if (val?.toString()?.length == 1) {
                  //   Keyboard.dismiss();
                }
              }}
              onKeyPress={e => {
                if (e.nativeEvent.key == 'Backspace') {
                  inputRef3?.current.focus();
                }
              }}
            />
          </View>
        </View>
      </View>
      <View style={{paddingBottom: 20}}>
        <AuthButton
          onPress={() => {
            navigation.navigate(screens.AUTH.SIGNUP);
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Verify
          </Text>
        </AuthButton>
      </View>
    </Container>
  );
};

export default VerifyMobileOtpScreen;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 100,
    // alignItems:"center",
    paddingLeft: 16,
    color: '#000',
  },
});
