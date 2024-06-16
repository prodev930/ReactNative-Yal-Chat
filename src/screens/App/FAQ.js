import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {themeColorCombinations} from 'constants/theme';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {FAQ_QUESTIONS} from 'constants/questionsFAQ';
import {FlashList} from '@shopify/flash-list';
import AccordionItem from 'components/accordionItem/AccordionItem';
import {MotiView, MotiText} from 'moti';
import CommonAnimatedHeader from 'components/commonHeader/CommonAnimatedHeader';

const FAQ = () => {
  const navigation = useNavigation();

  const renderQuestions = ({item, index, array}) => {
    return <AccordionItem item={item} index={index} array={array} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themeColorCombinations?.light.background} />

      <CommonAnimatedHeader title="FAQ" />
      <View style={styles.body}>
        <FlatList
          data={FAQ_QUESTIONS}
          keyExtractor={item => {
            return item?.key;
          }}
          renderItem={renderQuestions}
          initialNumToRender={6}
        />
      </View>
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColorCombinations?.light.background,
    paddingHorizontal: 16,
    // paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    alignItems: 'center',
    // justifyContent:""
  },
  headerText: {
    fontSize: 16,
    color: themeColorCombinations?.light?.textcolor,
    fontWeight: '500',
  },
  body: {
    flex: 1,
    // paddingHorizontal: 16,
  },
});
