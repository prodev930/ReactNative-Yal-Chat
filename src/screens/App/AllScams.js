import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';
import {goBackIcon} from 'assets/images';
import {useNavigation} from '@react-navigation/native';
import AllScamsTopTab from './topTabs/AllScamsTopTab';
import CommonAnimatedHeader from 'components/commonHeader/CommonAnimatedHeader';
import {RecentCallsQueries} from 'database/models/RecentCalls/RecentCalls.queries';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {RECENT_CALL_TYPES_MAP} from 'constants/recentCallTypesMap';

const AllScams = () => {
  const navigation = useNavigation();
  const {theme: mytheme} = useContext(MyAppThemeContext);
  const backgroundColor = themeColorCombinations?.[mytheme]?.background;
  const color = themeColorCombinations?.[mytheme]?.textcolor;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  function renderBlocking({item, index, array}) {
    const date = new Date(item?.date);
    const formattedDateHour = date.getHours();
    const formattedDateMin =
      date.getMinutes()?.toString()?.length == 1
        ? `0${date.getMinutes()}`
        : date.getMinutes();
    return (
      <Animated.View
        entering={FadeInDown}
        style={{
          flexDirection: 'row',
          marginTop: 12,
          // borderWidth: 1,
          // borderColor: 'red',
          padding: 8,
          justifyContent: 'space-between',
        }}>
        <Animated.View
          style={{
            height: 40,
            width: 40,
            borderRadius: 18,
            backgroundColor: '#EAE2FF',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MCI name="alert-circle" color="red" size={30} />
        </Animated.View>
        <Animated.View
          style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <Animated.Text
            style={{color: 'black', fontSize: 16, fontWeight: '500'}}>
            {item?.displayName}
          </Animated.Text>
          <Animated.Text style={{color: 'black', fontSize: 12}}>
            {`${RECENT_CALL_TYPES_MAP[item.type]} Call • ${'14:21'}`}
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <Animated.Text style={{color: 'black', fontSize: 12}}>
            {'12/05/2024'}
          </Animated.Text>
          <Animated.Text
            style={{color: 'red', fontSize: 12, fontWeight: '500'}}>
            Blocked by Yal
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    );
  }

  useEffect(() => {
    (async () => {
      let dataForDisplay = [];
      try {
        setLoading(true);
        dataForDisplay = await RecentCallsQueries.getAllRecentCalls();
        // originDataRef.current = dataForDisplay;
      } catch (error) {
        console.log('fetching data on mount', {error});
      } finally {
        setLoading(false);
        setResults(dataForDisplay);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <CommonAnimatedHeader title="All Scams" />
      {/* <AllScamsTopTab /> */}
      <Animated.View>
        <Animated.FlatList data={results} renderItem={renderBlocking} />
      </Animated.View>
    </View>
  );
};

export default AllScams;

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
