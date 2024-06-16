import {FC} from 'react';
import styled from 'styled-components/native';
interface MTProps {
  MT: number;
  children?: React.ReactNode;
}

export const MT: FC<MTProps> = styled.View`
  margin-top: ${props => props.MT}px;
`;
