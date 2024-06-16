import React, {Component} from 'react';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {Animated, StyleSheet} from 'react-native';

export default class SwipeButton extends Component {
  translateY = new Animated.Value(0);
  onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: this.translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );
  render() {
    return (
      <GestureHandlerRootView style={styles.rootViewContainer(this.props)}>
        <PanGestureHandler onGestureEvent={this.onPanGestureEvent}>
          <Animated.View
            style={[
              styles.square(this.props),
              {
                transform: [
                  {
                    translateY: this.translateY,
                  },
                ],
              },
            ]}
          />
        </PanGestureHandler>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  rootViewContainer: props => ({
    width: props.rootViewContainerWidth,
    height: props.rootViewContainerHeight,
    backgroundColor: '#000000',
    alignItems: 'center',
  }),
  square: props => ({
    width: props.buttonWidth,
    height: props.buttonWidth,
    backgroundColor: '#28b5b5',
    borderRadius: 2000,
    marginTop: 22,
  }),
});
