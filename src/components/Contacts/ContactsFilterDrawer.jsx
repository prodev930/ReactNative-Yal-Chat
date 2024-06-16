import useTheme from 'hooks/useTheme';
import React, {useState} from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';
import FlexedJustifiedBetween from 'styled/FlexedJustifiedBetween';
import {CONTACT_TAGS} from 'constants/contactTags';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MT} from 'styled/MT';
import SwitchButton from 'components/Buttons/SwitchButton';

const ContactsFilterDrawer = ({
  visible,
  closeFilterDrawer,
  showIncludingTags,
  setShowIcludingTags,
  showStarred,
  setShowStarred,
  showBlocked,
  setShowBlocked,
}) => {
  const theme = useTheme();

  const handleTag = t => {
    if (showIncludingTags.includes(t)) {
      setShowIcludingTags(showIncludingTags.filter(v => v !== t));
    } else {
      setShowIcludingTags([...showIncludingTags, t]);
    }
  };

  const toggleStarred = () => setShowStarred(!showStarred);
  const toggleBlocked = () => setShowBlocked(!showBlocked);

  const clearFilter = () => {
    setShowStarred(false);
    setShowBlocked(false);
    setShowIcludingTags([]);
  };

  return (
    <Modal
      visible={visible}
      statusBarTranslucent={true}
      transparent={true}
      animationType="slide">
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, width: '100%', backgroundColor: 'transparent'}}
        onPress={closeFilterDrawer}>
        <FilterContainer activeOpacity={1}>
          <FlexedJustifiedBetween>
            <MainTitleText>Filter</MainTitleText>
            {!showBlocked &&
            !showStarred &&
            !showIncludingTags.length ? null : (
              <TouchableOpacity onPress={clearFilter}>
                <ClearButtonText>Clear All</ClearButtonText>
              </TouchableOpacity>
            )}
          </FlexedJustifiedBetween>
          <MT MT={theme.spacings.verticalScale.s26} />

          <TitleText>Tags</TitleText>
          <TagButtonContainer>
            {CONTACT_TAGS.map(({label, icon}) => (
              <TagButton key={label} onPress={() => handleTag(label)}>
                <MCI
                  name={showIncludingTags.includes(label) ? 'check' : icon}
                  color={theme.colors.white}
                />
                <TagButtonText>{label}</TagButtonText>
              </TagButton>
            ))}
          </TagButtonContainer>
          <MT MT={theme.spacings.verticalScale.s16} />
          <FlexedJustifiedBetween>
            <TitleText>Blocked</TitleText>
            <SwitchButton onChange={toggleBlocked} value={showBlocked} />
          </FlexedJustifiedBetween>
          <FlexedJustifiedBetween>
            <TitleText>Favorites</TitleText>
            <SwitchButton onChange={toggleStarred} value={showStarred} />
          </FlexedJustifiedBetween>
          <MT MT={theme.spacings.verticalScale.s16} />
        </FilterContainer>
      </TouchableOpacity>
    </Modal>
  );
};

export default ContactsFilterDrawer;

const FilterContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${normalize(30)}px ${normalize(30)}px 0px 0px;
  padding: ${normalize(30)}px;
  justify-content: space-evenly;
`;

const TitleText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;

const MainTitleText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w900};
`;
const ClearButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize.f14}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w900};
`;

const TagButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${normalize(8)}px;
`;

const TagButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${normalize(1)}px ${normalize(5)}px;
  border-radius: ${normalize(3)}px;
  border: 1px solid ${props => props.theme.colors.white};
  gap: ${normalize(8)}px;
`;

const TagButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;
