import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {themeColorCombinations} from 'constants/theme';
import MCI from 'react-native-vector-icons/AntDesign';
import {normalize} from 'utils/normalize';
import {useAccordion} from 'hooks/useAccordion';

const AccordionItem = ({item, index, array}) => {
//   const {animatedRef, setHeight, isOpened, animatedHeightStyle} =
//     useAccordion();

  const AnimatableTouchable =
    Animated.createAnimatedComponent(TouchableOpacity);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleOnpress = () => {
    setIsExpanded(!isExpanded);
  };

  const height = useSharedValue(30);
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  const animtedStyle = useAnimatedStyle(() => {
    const animatedHeight = isExpanded
      ? withSpring(300)
      : withSpring(height?.value, {damping: 17});
    return {
      height: animatedHeight,
    };
  });

  return (
    <Animated.View
      style={[
        {
          marginTop: 13,
          overflow: 'hidden',
        },
        animtedStyle,
      ]}>
      <AnimatableTouchable
        style={{
          flexDirection: 'row',
          backgroundColor: 'lightgrey',
          height: 30,
          alignItems: 'center',
          borderTopRightRadius: 13,
          borderTopLeftRadius: 13,
        }}
        onPress={toggleOnpress}>
        <View style={{width: '80%', paddingLeft: 8}}>
          <Animated.Text style={styles.questionText} numberOfLines={1}>
            {item?.question}
          </Animated.Text>
        </View>
        <View
          style={{
            width: '20%',
            overflow: 'hidden',
            alignItems: 'flex-end',
            paddingRight: 16,
          }}>
          <MCI
            name={!isExpanded ? 'caretdown' : 'caretup'}
            color={'black'}
            size={normalize(15)}
          />
        </View>
      </AnimatableTouchable>
      {/* {isExpanded && ( */}
      <Animated.View
        style={{
          padding: 8,
          // overflow: 'hidden',
          backgroundColor: '#EAE2FF',
          borderBottomRightRadius: 13,
          borderBottomLeftRadius: 13,
        }}>
        <Animated.Text style={styles.text}>{item?.answer}</Animated.Text>
      </Animated.View>
      {/* )} */}
    </Animated.View>
  );
};

export default AccordionItem;

const styles = StyleSheet.create({
  text: {
    color: themeColorCombinations?.light?.textcolor,
  },
  questionText: {
    color: themeColorCombinations?.light?.textcolor,
    fontSize: 14,
  },
});
