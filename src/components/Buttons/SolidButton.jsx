import useTheme from 'hooks/useTheme';
import React from 'react';
import {ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled, {css} from 'styled-components/native';
import {normalize} from 'utils/normalize';
export const SolidButton = props => {
  const theme = useTheme();
  return (
    <SolidButton_ {...props} disabled={props.disabled || props.loading}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        locations={[0.2, 1]}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingVertical: theme.spacings.verticalScale.s18,
          width: '100%',
          height: '100%',
        }}
        colors={[theme.colors.primary, theme.colors.secondary]}>
        {props.loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <ButtonText style={{textAlignVertical: 'center'}} {...props}>
            {props.children}
          </ButtonText>
        )}
      </LinearGradient>
    </SolidButton_>
  );
};

const SolidButton_ = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: ${props => props.width}%;
  border-radius: ${props => (props.noRadius ? 0 : 40)}px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text`
  text-align: center;
  font-family: ${props => props.theme.fontFamily};
  width: 100%;
  font-size: ${props => props.theme.fontSize.f15}px;
  font-weight: ${props => props.theme.fontWeight.w500};
  color: ${props => props.theme.colors.white};
`;
