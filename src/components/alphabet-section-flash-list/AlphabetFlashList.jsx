import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {height} from 'utils/device';
import VerticalSlider from './Slider';
import {normalScale, normalize, verticalScale} from 'utils/normalize';
const AlphabetFlashList = ({
  renderListItem,
  renderSectionHeader,
  stickyHeaderIndices,
  minIndex,
  maxIndex,
  searchKey,
  disableSendMessageButton,
  ...props
}) => {
  const listRef = useRef(null);
  const [value, setValue] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState({
    value: Object.keys(stickyHeaderIndices)[0],
    index: stickyHeaderIndices[Object.keys(stickyHeaderIndices)[0]],
  });
  const renderItem = ({item}) => {
    if (typeof item === 'string') {
      // Rendering header
      return renderSectionHeader(item);
    } else {
      // Render item
      return renderListItem(item);
    }
  };

  useEffect(() => {
    if (selectedLetter && listRef && listRef.current) {
      listRef.current.scrollToIndex({
        animated: true,
        index: selectedLetter.index,
      });
    }
  }, [selectedLetter]);

  useEffect(() => {
    setValue(Object.keys(stickyHeaderIndices).length);
    setSelectedLetter({
      value: Object.keys(stickyHeaderIndices)[0],
      index: stickyHeaderIndices[Object.keys(stickyHeaderIndices)[0]],
    });
  }, [stickyHeaderIndices]);

  return (
    <View style={{flex: 1}}>
      {maxIndex && maxIndex > 0 ? (
        <SliderContainer>
          <SliderInnerContainer>
            {Object.keys(stickyHeaderIndices).map((v, i) => (
              <TouchableOpacity
                key={v}
                onPress={() => {
                  setSelectedLetter({
                    value: Object.keys(stickyHeaderIndices)[i],
                    index:
                      stickyHeaderIndices[Object.keys(stickyHeaderIndices)[i]],
                  });
                  setValue(i);
                }}>
                <SliderText highlight={selectedLetter?.value === v}>
                  {v}
                </SliderText>
              </TouchableOpacity>
            ))}
          </SliderInnerContainer>

          <VerticalSlider
            value={value}
            onChange={value => {
              setSelectedLetter({
                value: Object.keys(stickyHeaderIndices).reverse()[value],
                index:
                  stickyHeaderIndices[
                    Object.keys(stickyHeaderIndices).reverse()[value]
                  ],
              });
              setValue(value);
            }}
            height={height / 1.5}
            width={normalScale(10)}
            step={1}
            min={minIndex}
            max={maxIndex}
            borderRadius={5}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
          />
        </SliderContainer>
      ) : null}
      {searchKey &&
      searchKey.length &&
      /^\+?\d+$/.test(searchKey) &&
      !disableSendMessageButton
        ? renderListItem({
            phoneNumber: searchKey,
            givenName: `Send To ${searchKey}`,
            familyName: '',
          })
        : null}
      <FlashList
        ref={listRef}
        stickyHeaderIndices={Object.values(stickyHeaderIndices)}
        renderItem={renderItem}
        getItemType={item => {
          // To achieve better performance, specify the type based on the item
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        estimatedItemSize={100}
        {...props}
      />
    </View>
  );
};

export default AlphabetFlashList;

const SliderContainer = styled.View`
  z-index: 90;
  width: ${normalScale(30)}px;
  height: ${normalize(height / 1.5)}px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: ${verticalScale(15)}px;
  top: ${verticalScale(30)}px;
  border-radius: 50000px;
  background-color: ${props =>
    props.theme.colors.VerticalSliderBackgroundColor};
`;

const SliderInnerContainer = styled.View`
  /* padding: ${verticalScale(10)}px 0px; */
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  justify-content: space-around;
  align-items: center;
`;

const SliderText = styled.Text`
  color: ${props =>
    props.highlight
      ? props.theme.colors.primary
      : props.theme.colors.VerticalSliderTextColor};
  font-weight: ${props => props.theme.fontWeight.w500};
`;
