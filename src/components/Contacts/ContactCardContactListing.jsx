import React, {useContext} from 'react';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {View} from 'react-native';
import {avatar} from 'assets/images';
import useTheme from 'hooks/useTheme';
import {formatName} from 'utils/utilities';
import MyAppThemeContext from 'context/MyAppTheme';
import {themeColorCombinations} from 'constants/theme';

const ContactCardContactListing = ({
  item,
  setSelected,
  selected,
  navigation,
  index,
  openViewContactDrawer,
}) => {
  const theme = useTheme();
  const onPress = () => {
    openViewContactDrawer(item);
  };
  const handleSelection = p => {
    // console.log({item});
  };

  const {theme: mytheme} = useContext(MyAppThemeContext);

  return item ? (
    <Cover
      onPress={onPress}
      onLongPress={handleSelection}
      selected={selected.filter(s => s.phoneNumber === item.phoneNumber).length}
      mytheme={mytheme}
      activeOpacity={0.9}
      >
      <Container>
        <AvatarContainer>
          {selected.filter(s => s.phoneNumber === item.phoneNumber).length ? (
            <AvatarselectedPlaceholder>
              <FontAwesome5 name="check" size={30} />
            </AvatarselectedPlaceholder>
          ) : (
            <AvatarImage
              source={item.hasThumbnail ? {uri: item.thumbnailPath} : avatar}
            />
          )}
        </AvatarContainer>
        <DetailsContainer>
          <View>
            <NameText
              selected={
                selected.filter(s => s.phoneNumber === item.phoneNumber).length
              }
              mytheme={mytheme}>
              {formatName(`${item.displayName}`)}
            </NameText>
          </View>
        </DetailsContainer>
        <FavouriteIconBox>
          {item.isStarred ? (
            <MCI
              name="star"
              color={theme.colors.FavIconColor}
              size={normalize(15)}
            />
          ) : null}
        </FavouriteIconBox>
      </Container>
    </Cover>
  ) : null;
};
export default ContactCardContactListing;

const borderWidth = 0;
const height = 50;

const Cover = styled.TouchableOpacity`
  padding: ${props =>
    `${props.theme.spacings.verticalScale.s12}px ${props.theme.spacings.normalScale.s18}px`};
  background-color: ${props =>
    themeColorCombinations?.[props.mytheme]?.background};
    
`;

const Container = styled.View`
  /* border: ${borderWidth}px solid red; */
  flex-direction: row;
  width: 100%;
  height: ${normalize(height)}px;
`;

const AvatarContainer = styled.View`
  /* border: ${borderWidth}px solid blue; */
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.Image`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: ${normalize(100)}px;
`;

const AvatarselectedPlaceholder = styled.View`
  height: ${normalize(height)}px;
  width: ${normalize(height)}px;
  border-radius: ${normalize(13)}px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.secondary};
`;

const DetailsContainer = styled.View`
  border: ${borderWidth}px solid green;
  flex: 2;
  height: 100%;
  padding: ${props => `${0}px ${props.theme.spacings.normalScale.s12}px`};
  justify-content: center;
`;

const NameText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  font-weight: ${props => props.theme.fontWeight.w600};
  color: ${props => themeColorCombinations?.[props.mytheme]?.textcolor};
  font-family: ${props => props.theme.fontFamily};
`;

const FavouriteIconBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`;
