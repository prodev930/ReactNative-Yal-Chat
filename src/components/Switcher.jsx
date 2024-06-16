import React, {useContext, useEffect, useState} from 'react';
import styled, {useTheme} from 'styled-components/native';
import {normalScale, normalize} from 'utils/normalize';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {width} from 'utils/device';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {ScreenNameContext} from '../../App';
const modules = {
  sms: 'sms',
  calls: 'calls',
};
const Switcher = ({}) => {
  const currentRoute = useContext(ScreenNameContext);
  const [activeModule, setActiveModule] = useState();
  const theme = useTheme();
  const navigation = useNavigation();

  const handleModuleSwitch = module => {
    setActiveModule(module);
    if (module === modules.sms) {
      navigation.navigate(screens.APP.SMS);
    } else if (module === modules.calls) {
      navigation.navigate(screens.APP.CALLS);
    }
  };

  useEffect(() => {
    if (currentRoute === screens.APP.SMS) {
      setActiveModule(modules.sms);
    } else {
      setActiveModule(modules.calls);
    }
  }, [currentRoute]);

  return (
    <Container>
      <ContainerFixedOverlay>
        <ContainerButtonTextContainer
          onPress={() => handleModuleSwitch(modules.calls)}>
          <FontAwesome6
            name="phone"
            size={normalize(15)}
            color={
              activeModule === modules.calls
                ? theme.colors.switcherTextActive
                : theme.colors.switcherText
            }
          />
          <ContainerButtonText active={activeModule === modules.calls}>
            Calls
          </ContainerButtonText>
        </ContainerButtonTextContainer>
        <ContainerButtonTextContainer
          onPress={() => handleModuleSwitch(modules.sms)}>
          <FontAwesome6
            name="message"
            size={normalize(15)}
            color={
              activeModule === modules.sms
                ? theme.colors.switcherTextActive
                : theme.colors.switcherText
            }
          />
          <ContainerButtonText active={activeModule === modules.sms}>
            Chat
          </ContainerButtonText>
        </ContainerButtonTextContainer>
      </ContainerFixedOverlay>
      <ContainerFixedUnderlay activeModule={activeModule}>
        <ContainerButton />
      </ContainerFixedUnderlay>
    </Container>
  );
};

export default Switcher;

const height = 50;
const gap = 10;

const Container = styled.View`
  position: absolute;
  bottom: ${normalize(10)}px;
  height: ${normalize(height)}px;
  width: ${props => width - props.theme.spacings.normalScale.s18 * 2}px;
  left: ${props => props.theme.spacings.normalScale.s18}px;
`;

const ContainerFixedUnderlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${props =>
    props.activeModule === modules.calls ? 'flex-start' : 'flex-end'};
  height: ${normalize(height)}px;
  padding: 0px ${normalize(gap / 2)}px;
  background-color: ${props => props.theme.colors.switcherBG};
  border-radius: 20000px;
`;

const ContainerFixedOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${normalize(height)}px;
  padding: 0px ${normalize(gap / 2)}px;
  background-color: transparent;
  border-radius: 20000px;
  z-index: 20;
`;

const ContainerButton = styled.View`
  width: 40%;
  height: ${normalize(height - gap)}px;
  border-radius: 20000px;
  background-color: ${props => props.theme.colors.primary};
`;

const ContainerButtonTextContainer = styled.TouchableOpacity`
  width: 40%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${normalScale(10)}px;
  height: ${normalize(height - gap)}px;
  border-radius: 20000px;
`;

const ContainerButtonText = styled.Text`
  color: ${props =>
    props.active
      ? props.theme.colors.switcherTextActive
      : props.theme.colors.switcherText};
  font-size: ${props => props.theme.fontSize.f16}px;
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeight.w400};
`;
