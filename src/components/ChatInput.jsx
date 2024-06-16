import React from 'react';
import styled from 'styled-components/native';
import {verticalScale} from 'utils/normalize';

const ChatInput = () => {
  return <Cover></Cover>;
};

export default ChatInput;

const Cover = styled.View`
  height: ${verticalScale(90)}px;
  background-color: red;
`;
