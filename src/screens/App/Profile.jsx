import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useContext, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {arrow_icon, userProfileIcon} from 'assets/images';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import MyAppThemeContext, {MyAppThemeProvider} from 'context/MyAppTheme';
import {darkTheme, lightTheme, themeColorCombinations} from 'constants/theme';

const Profile = props => {
  const navigation = useNavigation();
  const {routes, index} = navigation.getState();
  const routeName = routes[index].name;
  console.log('🚀 ~ Profile ~ routeName:', routeName);
  const {theme, toggleTheme} = useContext(MyAppThemeContext);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
  };

  const dummyImageUri =
    'https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';
  const [setSelectedImage, setSetSelectedImage] = useState(dummyImageUri);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSetSelectedImage(imageUri);
      }
    });
  };

  const itemList = [
    {name: 'Manage Blocking', navigateTo: screens.APP.MANAGEBLOCKING},
    {name: 'Compromised Threats', navigateTo: screens.APP.COMPROMISEDTHREATS},
    {name: 'Settings', navigateTo: screens.APP.SETTING},
    {name: 'FAQ', navigateTo: screens.APP.FAQ},
  ];

  const renderKeys = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.horizontalKeys}
        onPress={() => {
          navigation.navigate(item?.navigateTo);
        }}>
        <Text
          style={[
            styles.horizontalKeysText,
            {color: themeColorCombinations?.[theme]?.textcolor},
          ]}>
          {item?.name}
        </Text>
        <View style={styles.arrowIconContainer}>
          <Image source={arrow_icon} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: themeColorCombinations?.[theme]?.background,
        },
      ]}>
      <StatusBar
        backgroundColor={theme == 'light' ? '#5E3CB8' : '#131313'}
        barStyle={'dark-content'}
        translucent={true}
      />
      <LinearGradient
        colors={
          theme == 'light'
            ? ['#5E3CB8', 'rgba(60, 50, 160, 0.6)']
            : ['#131313', '#C2C2C2']
        }
        style={styles.upperContainer}
        start={{x: 0.7, y: 0}}
        end={{x: 0.7, y: 1}}>
        <Text style={styles.profileText}>Profile</Text>
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={openImagePicker}>
            <Image
              source={{
                uri: setSelectedImage,
              }}
              style={{height: 100, width: 100, borderRadius: 100}}
            />
          </TouchableOpacity>
          <View style={{paddingTop: 16, alignItems: 'center'}}>
            <Text style={[styles.nameNumberText, {fontWeight: '600'}]}>
              Ankit Yadav
            </Text>
            <Text
              style={[
                styles.nameNumberText,
                {fontSize: 12, fontWeight: '400'},
              ]}>
              +91 8447650007
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={{flex: 1, paddingHorizontal: 32}}>
        <FlatList
          data={itemList}
          keyExtractor={item => {
            return item?.name?.toString();
          }}
          renderItem={renderKeys}
          contentContainerStyle={{paddingTop: 20}}
          // ListFooterComponent={() => {
          //   return (
          //     <TouchableOpacity
          //       style={styles.horizontalKeys}
          //       onPress={handleToggleTheme}>
          //       <Text
          //         style={[
          //           styles.horizontalKeysText,
          //           {color: themeColorCombinations?.[theme]?.textcolor},
          //         ]}>
          //         {'Change App Mode'}
          //       </Text>
          //     </TouchableOpacity>
          //   );
          // }}
        />
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  upperContainer: {
    height: 280,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  nameNumberText: {
    // fontWeight: '600',
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins',
  },
  horizontalKeys: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalKeysText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  arrowIconContainer: {
    height: 26,
    width: 26,
    borderRadius: 100,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  arrowIcon: {
    height: 16,
    width: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    fontFamily: 'Poppins',
    padding: 20,
  },
});
