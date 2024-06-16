import {FC} from 'react';
import {ViewProps} from 'react-native';
import styled from 'styled-components/native';

interface WrapperProps extends ViewProps {
  backgroundColor?: string;
}

export const Wrapper: FC<WrapperProps> = styled.View`
  flex: 1;
  background-color: ${props => props.backgroundColor || props.theme.colors.bg};
`;
