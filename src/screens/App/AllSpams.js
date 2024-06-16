import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';
import {goBackIcon} from 'assets/images';
import AllSpamsTopTab from './topTabs/AllSpamsTopTab';
import { useNavigation } from '@react-navigation/native';

const AllSpams = () => {
    const navigation = useNavigation()
  const {theme: mytheme} = useContext(MyAppThemeContext);
  const backgroundColor = themeColorCombinations?.[mytheme]?.background;
  const color = themeColorCombinations?.[mytheme]?.textcolor;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>{
            navigation?.goBack()
          }}>
            <Image source={goBackIcon} style={styles.goBackIconStyles} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {color}]}>Spams</Text>
        </View>
      </View>
        <AllSpamsTopTab />
    </View>
  );
};

export default AllSpams;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goBackIconStyles: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    paddingLeft: 40,
  },
});
