import useTheme from 'hooks/useTheme';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingMenu from './FloatingMenu';
import MenuItem from './MenuItem';
const iconSize = normalize(25);
const MessageActionHeader = ({
  selected,
  setSelected,
  onPressCopy,
  onPressDelete,
  onPressClear,
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

  const handleDelete = () => {
    onPressDelete();
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

  const handleClearSelection = () => {
    onPressClear();
    setSelected([]);
  };

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
        {/* <MenuItem title="Share" />
        <MenuItem title="Forward" /> */}
        {/* <MenuItem title="View Details" /> */}
      </FloatingMenu>
      <Container>
        <ContainerIcons onPress={handleClearSelection}>
          <MCI
            name="close"
            size={iconSize}
            color={theme.colors.MessageActionHeaderIconColor}
          />
        </ContainerIcons>
        <ContainerText>
          <TextStyled>{`${selected.length} selected`}</TextStyled>
        </ContainerText>

        {selected.length === 1 ? (
          <ContainerIcons onPress={onPressCopy}>
            <MCI
              name="content-copy"
              size={iconSize}
              color={theme.colors.MessageActionHeaderIconColor}
            />
          </ContainerIcons>
        ) : null}
        <ContainerIcons onPress={handleDelete}>
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

export default MessageActionHeader;

const Cover = styled(Animated.View)`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  padding: ${props => `0px ${props.theme.spacings.normalScale.s18}px`};
  background-color:white;
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
