import React from 'react';
import styled from 'styled-components/native';
import {normalScale, normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';
import {SolidButton} from './Buttons/SolidButton';
import ChipButton from 'components/Buttons/ChipButton';

const iconSize = normalize(25);

const CreateContactModalHeader = ({
  closeAddContactDrawer,
  addContact,
  editContact,
  editModeContact,
}) => {
  const theme = useTheme();
  return (
    <Container>
      <ContainerIcons onPress={closeAddContactDrawer}>
        <MCI
          name="close"
          size={iconSize}
          color={theme.colors.AddContactHeaderIconColor}
        />
      </ContainerIcons>
      <ContainerText>
        <TextStyled>
          {editModeContact ? 'Edit Contact' : 'Create contact'}
        </TextStyled>
      </ContainerText>
      <ContainerButton>
        {editModeContact ? (
          <ChipButton onPress={editContact} width={100}>
            Update
          </ChipButton>
        ) : (
          <ChipButton onPress={addContact} width={100}>
            Save
          </ChipButton>
        )}
      </ContainerButton>
      <ContainerIcons>
        <ContainerIcons onPress={() => null}>
          <MCI
            name="dots-vertical"
            size={iconSize}
            color={theme.colors.AddContactHeaderIconColor}
          />
        </ContainerIcons>
      </ContainerIcons>
    </Container>
  );
};

export default CreateContactModalHeader;

const Container = styled.View`
  height: ${normalScale(80)}px;
  border-bottom-color: ${props =>
    props.theme.colors.AddContactHeaderBorderBottomColor};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  flex-direction: row;
  padding: 0px ${normalize(20)}px;
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

const ContainerButton = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

const TextStyled = styled.Text`
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f18}px;
  color: ${props => props.theme.colors.AddContactHeaderIconColor};
`;
