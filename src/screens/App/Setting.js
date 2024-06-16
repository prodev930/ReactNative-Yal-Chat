// import {
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React from 'react';
// import {themeColorCombinations} from 'constants/theme';
// import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useNavigation} from '@react-navigation/native';
// import CommonAnimatedHeader from 'components/commonHeader/CommonAnimatedHeader';
// import {MotiView} from 'moti';

// const Setting = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor={themeColorCombinations?.light.background} />
//       {/* <View style={styles.header}>
//         <View style={{width: '20%'}}>
//           <TouchableOpacity
//             onPress={() => {
//               navigation.goBack();
//             }}>
//             <MCI name="keyboard-backspace" size={30} color={'#5D3AB7'} />
//           </TouchableOpacity>
//         </View>
//         <View>
//           <Text style={styles.headerText}>Settings</Text>
//         </View>
//       </View> */}
//       <CommonAnimatedHeader title="Settings" />
//       <MotiView
//         style={{paddingBottom: 20, paddingHorizontal: 5, paddingTop: 20}}
//         delay={100}
//         from={{
//           translateX: 1,
//           scale: 0,
//         }}
//         animate={{
//           scale: 1,
//           translateX: 5
//         }}
//         >
//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: '600',
//             color: themeColorCombinations?.light?.textcolor,
//           }}>
//           Notifications
//         </Text>
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: '400',
//             color: themeColorCombinations?.light?.textcolor,
//             paddingTop: 6,
//           }}>
//           On
//         </Text>
//       </MotiView>
//       <MotiView style={{paddingBottom: 20, paddingHorizontal: 5}}
//        delay={200}
//        from={{
//          translateX: 1,
//          scale: 0,
//        }}
//        animate={{
//          scale: 1,
//          translateX: 5
//        }}
//       >
//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: '600',
//             color: themeColorCombinations?.light?.textcolor,
//           }}>
//           Ringtone
//         </Text>
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: '400',
//             color: themeColorCombinations?.light?.textcolor,
//             paddingTop: 6,
//           }}>
//           Namo-Namo-ji-shankara
//         </Text>
//       </MotiView>
//     </View>
//   );
// };

// export default Setting;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: themeColorCombinations?.light.background,
//     // paddingTop: 8,
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     // paddingHorizontal: 16,
//     alignItems: 'center',
//     // justifyContent:""
//   },
//   headerText: {
//     fontSize: 16,
//     color: themeColorCombinations?.light?.textcolor,
//     fontWeight: '500',
//   },
// });

import React from 'react';
import {StyleSheet, View, Button, SafeAreaView, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function AccordionItem({isExpanded, children, viewKey, style, duration = 500}) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

export default function Setting() {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={onPress} title="Click me" />
      </View>

      <View style={styles.content}>
        <View style={styles.parent}>
          <AccordionItem isExpanded={open} viewKey="Accordion">
            <View style={styles.box} />
          </AccordionItem>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 24,
  },
  buttonContainer: {
    flex: 1,
    paddingBottom: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    width: 200,
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
  box: {
    height: 120,
    width: 120,
    color: '#f8f9ff',
    backgroundColor: '#b58df1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
