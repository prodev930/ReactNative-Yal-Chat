import React from 'react';
import FloatingMenu from './FloatingMenu';
import MenuItem from './MenuItem';

const HeaderBarSmsMenu = ({visible, setVisible, onPressMarkAllAsRead}) => {
  return (
    <FloatingMenu visible={visible} setVisible={setVisible}>
      <MenuItem onPress={onPressMarkAllAsRead} title="Mark All as Read" />
    </FloatingMenu>
  );
};

export default HeaderBarSmsMenu;
