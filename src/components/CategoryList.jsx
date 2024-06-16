import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {categoryRules} from 'utils/categoryRulesSchema';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';

const CategoryList = ({category, setCategory, searchOpen}) => {
  const theme = useTheme();
  const heightAnimation = useRef(new Animated.Value(0)).current;

  const handleCategoryPress = c => {
    const includes =
      category && category.filter(v => v.category === c.category).length;
    if (includes) {
      setCategory([...category.filter(v => v.category !== c.category)]);
    } else {
      setCategory([...category, c]);
    }
  };
  const expand = () => {
    Animated.timing(heightAnimation, {
      toValue: 100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const collapse = () => {
    Animated.timing(heightAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (searchOpen) {
      collapse();
    } else {
      expand();
    }
  }, [searchOpen]);

  const renderItem = ({item}) => {
    const highlighted =
      category && category.filter(v => v.category === item.category).length;
    return (
      <ListItemContainer
        onPress={() => handleCategoryPress(item)}
        highlighted={highlighted}>
        <MCI
          name={item.icon}
          color={
            highlighted
              ? theme.colors.threadCardNameHighlightedText
              : theme.colors.threadCardNameText
          }
          size={normalize(15)}
        />
        <ListItemText highlighted={highlighted}>{item.category}</ListItemText>
        {highlighted ? (
          <MCI
            name={'close-circle'}
            size={normalize(15)}
            color={
              highlighted
                ? theme.colors.threadCardNameHighlightedText
                : theme.colors.threadCardNameText
            }
          />
        ) : null}
      </ListItemContainer>
    );
  };

  return (
    <Animated.View
      style={[
        {
          height: heightAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, normalize(40)],
          }),
        },
      ]}>
      <Cover
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={categoryRules.map(({category, icon}) => ({category, icon}))}
        renderItem={renderItem}
      />
    </Animated.View>
  );
};

export default CategoryList;

const Cover = styled.FlatList`
  margin: 0px ${props => props.theme.spacings.normalScale.s18}px
    ${props => props.theme.spacings.verticalScale.s12 * 0.5}px
    ${props => props.theme.spacings.normalScale.s18}px;
`;

const ListItemContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${props =>
    props.highlighted
      ? props.theme.colors.threadHighlightBG
      : props.theme.colors.threadBG};
  gap: ${props => props.theme.spacings.normalScale.s12 * 0.5}px;
  padding: ${props => props.theme.spacings.verticalScale.s12 * 0.5}px
    ${props => props.theme.spacings.normalScale.s18}px;
  border: 1px solid ${props => props.theme.colors.threadHighlightBG};
  margin-right: ${normalize(15)}px;
  border-radius: ${normalize(5)}px;
`;
const ListItemText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props => props.theme.fontWeight.w800};
  color: ${props =>
    props.highlighted
      ? props.theme.colors.threadCardNameHighlightedText
      : props.theme.colors.threadCardNameText};
`;
