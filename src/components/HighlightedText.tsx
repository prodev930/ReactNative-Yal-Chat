import React, {FC, PropsWithoutRef} from 'react';
import {findAll} from 'highlight-words-core';
import {View} from 'react-native';
import {CommonStyles} from 'styled/common.styles';

interface HighlightedTextProps {
  searchWords: string[];
  prefix: string;
  textToHighlight: string;
  TextComponent: React.ComponentType<any>;
  textComponentProps: PropsWithoutRef<any>;
}
const HighlightedText: FC<HighlightedTextProps> = ({
  searchWords = [],
  prefix = '',
  textToHighlight,
  TextComponent,
  textComponentProps,
}) => {
  // console.log({searchWords, textToHighlight});
  const splits = findAll({textToHighlight, searchWords});
  return (
    <View style={CommonStyles.row}>
      {splits.map((split, index) => {
        const text = textToHighlight.substr(
          split.start,
          split.end - split.start,
        );
        return (
          <TextComponent
            highlight={split.highlight}
            key={`${prefix}-${text}-${index}`}
            {...textComponentProps}>
            {text}
          </TextComponent>
        );
      })}
    </View>
  );
};

export default HighlightedText;
