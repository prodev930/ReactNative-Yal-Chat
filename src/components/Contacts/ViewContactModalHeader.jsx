import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {normalScale, normalize} from 'utils/normalize';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from 'hooks/useTheme';

const iconSize = normalize(25);

const ViewContactModalHeader = ({
  closeViewContactDrawer,
  handleEdit,
  handleDelete,
  handleStarred,
  handleBlock,
  contact,
}) => {
  const theme = useTheme();

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (contact.isStarred) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  }, []);

  return (
    <Container>
      <Left>
        <ContainerIcon onPress={closeViewContactDrawer}>
          <MCI
            name="chevron-left"
            size={iconSize}
            color={theme.colors.AddContactHeaderIconColor}
          />
        </ContainerIcon>
      </Left>
      <Right>
        <ContainerIcon onPress={handleEdit}>
          <MCI
            name="pen"
            size={iconSize}
            color={theme.colors.AddContactHeaderIconColor}
          />
        </ContainerIcon>
        <ContainerIcon onPress={() => handleStarred(setIsFavourite)}>
          <MCI
            name="star"
            size={iconSize}
            color={
              isFavourite
                ? theme.colors.secondary
                : theme.colors.AddContactHeaderIconColor
            }
          />
        </ContainerIcon>
        <ContainerIcon onPress={handleBlock}>
          <MCI
            name="block-helper"
            size={iconSize - 8}
            color={
              contact.isBlocked
                ? theme.colors.secondary
                : theme.colors.AddContactHeaderIconColor
            }
          />
        </ContainerIcon>
        <ContainerIcon onPress={handleDelete}>
          <MCI
            name="trash-can"
            size={iconSize}
            color={theme.colors.AddContactHeaderIconColor}
          />
        </ContainerIcon>
      </Right>
    </Container>
  );
};

export default ViewContactModalHeader;

const Container = styled.View`
  height: ${normalScale(80)}px;
  flex-direction: row;
  padding: 0px ${normalize(20)}px;
`;

const Right = styled.View`
  width: 85%;
  flex-direction: row;
  align-items: center;
  gap: ${normalize(10)}px;
  justify-content: flex-end;
`;

const Left = styled.View`
  width: 15%;
  align-items: center;
  justify-content: center;
`;

const ContainerIcon = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;
