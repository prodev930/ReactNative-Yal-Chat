import useTheme from 'hooks/useTheme';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Text} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingMenu from './FloatingMenu';
import MenuItem from './MenuItem';
import {threadQueries} from 'database/models/Threads/Threads.queries';
const iconSize = normalize(25);
const ThreadActionHeader = ({
  selected,
  onPressClear,
  onPressDelete,
  onPressArchive,
  onPressPin,
}) => {
  const heightAnimation = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const [FloatingMenuVisible, setFloatingMenuVisible] = useState(false);

  const expand = () => {
    Animated.timing(heightAnimation, {
      toValue: 200,
      duration: 200,
      useNativeDriver: false,
    }).start(finished => {
      setVisible(true);
    });
  };

  const collapse = () => {
    Animated.timing(heightAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start(finished => {
      setVisible(false);
    });
  };

  useEffect(() => {
    if (selected && selected.length) {
      if (!visible) {
        expand();
      } else {
        return;
      }
    } else {
      collapse();
    }
  }, [selected]);

  return (
    <Cover
      style={[
        {
          height: heightAnimation.interpolate({
            inputRange: [0, 200],
            outputRange: ['0%', '10%'],
          }),
        },
      ]}>
      <FloatingMenu
        visible={FloatingMenuVisible}
        setVisible={setFloatingMenuVisible}>
        <MenuItem title="Mark as unread" />
        <MenuItem title="Add contact" />
        <MenuItem title="Block" />
      </FloatingMenu>
      <Container>
        <ContainerIcons onPress={onPressClear}>
          <MCI
            name="close"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons>
        <ContainerText>
          <TextStyled>{`${selected.length} selected`}</TextStyled>
        </ContainerText>
        <ContainerIcons onPress={onPressPin}>
          <MCI
            name="pin"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons>
        <ContainerIcons onPress={onPressArchive}>
          <MCI
            name="archive-arrow-down"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons>
        <ContainerIcons onPress={onPressDelete}>
          <MCI
            name="delete"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons>
        {/* <ContainerIcons onPress={() => setFloatingMenuVisible(true)}>
          <MCI
            name="dots-vertical"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons> */}
      </Container>
    </Cover>
  );
};

export default ThreadActionHeader;

const Cover = styled(Animated.View)`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  padding: ${props => `0px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props => props.theme.colors.bubbleBGLeft};
  border-radius: 0px 0px ${normalize(20)}px ${normalize(20)}px;
  justify-content: center;
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ContainerIcons = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ContainerText = styled.View`
  flex: 5;
  align-items: flex-start;
  justify-content: center;
`;

const TextStyled = styled.Text`
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f18}px;
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.MessageActionHeaderIconColor};
`;
