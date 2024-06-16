import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import {arrow_icon} from 'assets/images';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';
import {screens} from 'constants/screens';
import {MotiView} from 'moti';
import {MotiPressable} from 'moti/interactions';
import CommonAnimatedHeader from 'components/commonHeader/CommonAnimatedHeader';

const screenWidth = Dimensions.get('screen').width;
const CompromisedThreats = () => {
  const navigation = useNavigation();
  const {theme: mytheme} = useContext(MyAppThemeContext);

  const props = {
    activeStrokeWidth: 15,
    inActiveStrokeWidth: 10,
    inActiveStrokeOpacity: 0.2,
  };
  const props2 = {
    activeStrokeWidth: 12,
    inActiveStrokeWidth: 8,
    inActiveStrokeOpacity: 0.2,
  };

  const chartData = [
    {date: '21/5', value: 18},
    {date: '22/5', value: 20},
    {date: '23/5', value: 8},
    {date: '24/5', value: 14},
    {date: '25/5', value: 6},
    {date: '26/5', value: 28},
  ];

  const scamCategoriesData = [
    {key: 'Total Scams', navigateTo: screens.APP.ALLSCAMS},
    // {key: 'Blocked Scams'},
    {key: 'Scam Categories', navigateTo: ''},
  ];

  const renderCharts = ({item, index, array}) => {
    return (
      <MotiView
        from={{
          scale: 0,
          translateX: -10,
        }}
        delay={200}
        animate={{
          scale: 1,
          translateX: 0,
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}>
        <Text style={{color: '#5F3DB8', paddingBottom: 4, fontSize: 8}}>
          {item?.value}
        </Text>

        <View
          style={[styles.chartHeightView, {height: Number(item?.value * 3)}]}
        />
        <Text style={{color: '#5F3DB8', paddingTop: 4, fontSize: 8}}>
          {item?.date}
        </Text>
      </MotiView>
    );
  };
  const renderScamCategories = ({item, index, array}) => {
    return (
      <MotiPressable
        from={{
          scale: 0,
          translateY: -10,
        }}
        animate={{
          scale: 1,
          translateY: 0,
        }}
        transition={{type: 'timing', duration: 500}}
        delay={index * 300}
        style={styles.scamCategoryListItem}
        activeOpacity={0.6}
        onPress={() => {
          item?.navigateTo
            ? navigation.navigate(item?.navigateTo)
            : Alert.alert(`Hey, You Pressed on ${item?.key}`);
        }}>
        <Text style={styles.scamListItemText}>{item?.key}</Text>
        <View
          style={{backgroundColor: '#E3E3E3', borderRadius: 100, padding: 4}}>
          <Image source={arrow_icon} style={styles.arrowIcon} />
        </View>
      </MotiPressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: themeColorCombinations?.[mytheme]?.background},
      ]}>
      <StatusBar
        backgroundColor={themeColorCombinations?.[mytheme]?.background}
      />

      <CommonAnimatedHeader title="Compromised Threats" />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{paddingVertical: 40, alignItems: 'center'}}>
          <CircularProgressBase
            {...props}
            value={30}
            activeStrokeColor={'#5F3DB8'}
            inActiveStrokeColor={themeColorCombinations?.[mytheme]?.textcolor}
            // activeStrokeSecondaryColor={'#F0F0F0'}
            radius={80}>
            <CircularProgressBase
              {...props2}
              value={80}
              activeStrokeColor={'#05C5E0'}
              radius={50}
              inActiveStrokeColor={themeColorCombinations?.[mytheme]?.textcolor}
            />
            <View
              style={{
                width: 90,
                height: 2,
                backgroundColor: '#5F3DB8',
                borderRadius: 8,
                position: 'absolute',
                right: -30,
                top: 8,
              }}></View>
            <Text
              style={{
                color: '#5F3DB8',
                position: 'absolute',
                right: -66,
                top: 10,
                fontWeight: '900',
                fontSize: 20,
              }}>
              30%
            </Text>
            <Text
              style={{
                color: '#5F3DB8',
                position: 'absolute',
                right: -58,
                top: 34,
                fontSize: 12,
              }}>
              spams
            </Text>

            <View
              style={{
                width: 80,
                height: 2,
                backgroundColor: '#05C5E0',
                borderRadius: 8,
                position: 'absolute',
                left: -40,
                bottom: 60,
              }}
            />
            <Text
              style={{
                color: '#05C5E0',
                position: 'absolute',
                fontWeight: '900',
                fontSize: 20,
                left: -60,
                bottom: 32,
              }}>
              80%
            </Text>
            <Text
              style={{
                color: '#05C5E0',
                position: 'absolute',
                left: -60,
                bottom: 20,
                fontSize: 12,
              }}>
              scams
            </Text>
          </CircularProgressBase>
        </View>
        <MotiView
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          from={{
            scale: 0,
            translateX: -10,
          }}
          delay={100}
          animate={{
            scale: 1,
            translateX: 0,
          }}>
          <TouchableOpacity
            style={styles.scamNumbeView}
            activeOpacity={0.9}
            onPress={() => {
              navigation.navigate(screens.APP.ALLSCAMS);
            }}>
            <Text style={styles.scamNumberText}>300</Text>
            <Text style={styles.scamText}>Scams</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(screens.APP.ALLSPAMS);
            }}
            activeOpacity={0.9}
            style={[styles.scamNumbeView, {backgroundColor: '#F0F0F0'}]}>
            <Text style={[styles.scamNumberText, {color: '#5F3DB8'}]}>324</Text>
            <Text style={[styles.scamText, {color: '#5F3DB8'}]}>Spams</Text>
          </TouchableOpacity>
        </MotiView>
        <View style={styles.graphContainer}>
          <FlatList
            data={chartData}
            renderItem={renderCharts}
            keyExtractor={key => key?.value?.toString()}
            contentContainerStyle={styles.graphFlatlistContainer}
          />
        </View>
        <View>
          <FlatList
            data={scamCategoriesData}
            renderItem={renderScamCategories}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CompromisedThreats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scamNumbeView: {
    width: screenWidth / 2 - 40,
    backgroundColor: '#5F3DB8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  scamNumberText: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 25,
    color: '#FFFFFF',
  },
  scamText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    color: '#FFFFFF',
    paddingTop: 8,
  },
  graphContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    height: 150,
    marginVertical: 16,
    flexDirection: 'row',
  },
  graphFlatlistContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingVertical: 16,
  },
  scamCategoryListItem: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  scamListItemText: {
    color: '#626262',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  chartHeightView: {
    backgroundColor: '#5F3DB8',
    width: 8,
    borderRadius: 10,
  },
  arrowIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
});
