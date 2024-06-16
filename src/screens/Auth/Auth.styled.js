import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {normalize} from 'utils/normalize';

export const AuthFooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: ${props => props.theme.spacings.verticalScale.s24 * 2}px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 25%;
`;

export const AuthMainContainer = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f24}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.white};
`;

export const Welcome = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f36}px;
  font-weight: ${props => props.theme.fontWeight.w300};
  color: ${props => props.color};
  text-align: center;
`;

export const SubTitleText = styled.Text`
  text-align: center;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f15}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.dark};
`;

export const InputTitleText = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f12}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.dark};
`;

export const AuthContentContainerTop = styled.View`
  background-color: transparent;
  height: 30%;
  width: 100%;
  position: absolute;
  top: 0;
  justify-content: center;
  align-items: center;
`;

export const AuthContentContainer = styled.View`
  background-color: ${props => props.theme.colors.bg};
  z-index: 20;
  height: 75%;
  width: 100%;
  position: absolute;
  bottom: 0;
  border-radius: ${normalize(30)}px ${normalize(30)}px 0px 0px;
  padding: ${props => props.theme.spacings.verticalScale.s24}px
    ${props => props.theme.spacings.normalScale.s42}px;
`;

export const LinkText = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f15}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.dark};
`;

export const LinkTextHighlight = styled.Text`
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize.f15}px;
  font-weight: ${props => props.theme.fontWeight.w400};
  color: ${props => props.theme.colors.primary};
  text-decoration: underline;
`;
