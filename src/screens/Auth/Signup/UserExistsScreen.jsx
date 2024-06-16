import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';
import {authScreensLogo} from 'assets/images';
import {useNavigation} from '@react-navigation/native';

const UserExistsScreen = () => {
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
        <AuthBoldText style={{paddingTop: 26}}>User Exists</AuthBoldText>
        <AuthLightText style={{paddingTop: 4}}>
          You’ve been already here, kindly login to proceed.
        </AuthLightText>
      </View>
      <View style={{paddingBottom: 20}}>
        <AuthButton
          onPress={() => {
            navigation.navigate('VERIFICATION_FAILED');
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: '600'}}>
            Take Me To Login
          </Text>
        </AuthButton>
      </View>
    </Container>
  );
};

export default UserExistsScreen;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
});
