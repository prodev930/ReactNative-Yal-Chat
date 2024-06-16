import styled from 'styled-components/native';

interface SpacerProps {
  width: number;
  height: number;
}

const Spacer = styled.View<SpacerProps>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

export default Spacer;
