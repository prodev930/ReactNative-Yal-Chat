import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {categoryRules} from 'utils/categoryRulesSchema';
import {normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';

const ContactChip = ({selected, setSelected}) => {
  const theme = useTheme();
  const handleCategoryPress = c => {
    const includes =
      selected && selected.filter(v => v.phoneNumber === c.phoneNumber).length;
    if (includes) {
      setSelected([...selected.filter(v => v.phoneNumber !== c.phoneNumber)]);
    } else {
      setSelected([...selected, c]);
    }
  };

  return (
    <Cover>
      {selected.map(item => (
        <ListItemContainer onPress={() => handleCategoryPress(item)}>
          <ListItemText>{`${item.givenName} ${item.familyName}`}</ListItemText>
          <MCI
            name={'close'}
            size={normalize(15)}
            color={theme.colors.ContactChipIcon}
          />
        </ListItemContainer>
      ))}
    </Cover>
  );
};

export default ContactChip;

const Cover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const ListItemContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${props => props.theme.colors.ContactChipBackground};
  gap: ${props => props.theme.spacings.normalScale.s12 * 0.1}px;
  padding: ${props => props.theme.spacings.verticalScale.s12 * 0.2}px
    ${props => props.theme.spacings.normalScale.s18 * 0.5}px;
  margin-right: ${normalize(5)}px;
  margin-bottom: ${normalize(5)}px;
  border-radius: ${normalize(5)}px;
`;
const ListItemText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.ContactChipText};
`;
