import useTheme from 'hooks/useTheme';
import React, {useState} from 'react';
import {Modal, ScrollView} from 'react-native';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {MT} from 'styled/MT';
import {getStatusBarHeight} from 'utils/getStatusBarHeight';
import {width} from 'utils/device';
import {avatar} from 'assets/images';
import ViewContactModalHeader from 'components/Contacts/ViewContactModalHeader';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {dispatchSnackBar} from 'utils/snackbar';
import ConfirmationDialogue from 'components/ConfirmationDialouge';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {normalize} from 'utils/normalize';
import IconButton from 'components/Buttons/IconButton';
import {threadQueries} from 'database/models/Threads/Threads.queries';
import {useNavigation} from '@react-navigation/native';
import {screens} from 'constants/screens';
import {handleCall} from 'utils/call';
const ViewContactDrawer = ({
  closeViewContactDrawer,
  contact,
  OpenEditContactDrawer,
  phoneHandles,
}) => {
  const navigation = useNavigation();
  const [deleteConfirmDialouge, setDeleteConfirmDialouge] = useState(false);
  const theme = useTheme();
  const height = getStatusBarHeight();

  const handleCall = () => {};

  const handleMessage = async phoneNumber => {
    try {
      const thread = await threadQueries.getThreadByPhoneNumber(phoneNumber);
      closeViewContactDrawer();
      navigation.navigate(screens.APP.SMS_THREADS, {
        thread_id: thread[0]?.thread_id,
        phone_number: phoneNumber,
      });
    } catch (err) {
      console.log({err});
    }
  };

  const handleBlock = async () => {
    try {
      const result = await ContactQueries.toggleBlock(contact.recordID);
      if (result) {
        dispatchSnackBar({text: 'Done'});
      }
    } catch (err) {
      // console.log({err, msg: 'ViewContactDrawer/handleBlock'});
    }
  };

  const handleEdit = () => {
    OpenEditContactDrawer(contact);
  };

  const handleDelete = () => {
    openDeleteConfirmationDialouge();
  };

  const onPressConfirm = async () => {
    closeViewContactDrawer();
    try {
      const result = await ContactQueries.deleteContact(contact.recordID);
      if (result) {
        dispatchSnackBar({text: 'Deleted'});
        // console.log('starred successfully');
      }
    } catch (err) {
      // console.log({err, msg: 'ViewContactDrawer/onPressConfirm'});
    }
  };
  const onPressCancel = () => {
    closeDeleteConfirmationDialouge();
  };

  const handleStarred = async setIsFavourite => {
    try {
      const result = await ContactQueries.toggleStarred(contact.recordID);
      if (result) {
        dispatchSnackBar({text: 'Done'});
        setIsFavourite(prev => !prev);
        // console.log('starred successfully');
      }
    } catch (err) {
      dispatchSnackBar({text: 'Could not star your contact.'});
      // console.log({err, msg: 'ViewContactDrawer/handleStarred'});
    }
  };

  const openDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(true);
  };
  const closeDeleteConfirmationDialouge = () => {
    setDeleteConfirmDialouge(false);
  };

  return (
    <Modal
      visible={!!contact}
      statusBarTranslucent={true}
      transparent={false}
      animationType="slide">
      <ConfirmationDialogue
        visible={deleteConfirmDialouge}
        title="Delete this Contact?"
        description="This is permanent and can’t be undone"
        onCancelPressed={onPressCancel}
        onConfirmPressed={onPressConfirm}
        cancelText="Cancel"
        confirmText="Delete"
      />
      {contact ? (
        <ViewContactDrawerContainer>
          <MT MT={height} />
          <ViewContactModalHeader
            contact={contact}
            closeViewContactDrawer={closeViewContactDrawer}
            handleEdit={handleEdit}
            handleBlock={handleBlock}
            handleDelete={handleDelete}
            handleStarred={handleStarred}
          />
          <MT MT={theme.spacings.verticalScale.s16} />
          <ProfilePictureContainer>
            <ProfilePictureSquare>
              <ProfilePicture
                source={
                  contact.hasThumbnail
                    ? {
                        uri: contact.thumbnailPath,
                      }
                    : avatar
                }
              />
            </ProfilePictureSquare>
          </ProfilePictureContainer>
          <MT MT={theme.spacings.verticalScale.s18} />
          <Title>{contact.displayName}</Title>
          {contact.tags && contact.tags.length ? (
            <Tags>{`${contact.tags.join(' • ')}`}</Tags>
          ) : null}
          <MT MT={theme.spacings.verticalScale.s42} />
          <ScrollView>
            {contact.phoneNumbers && contact.phoneNumbers.length ? (
              <>
                {contact.phoneNumbers.map(
                  ({label, number, countryCode}, index) => (
                    <Number
                      phoneHandles={phoneHandles}
                      handleMessage={handleMessage}
                      key={index}
                      label={label}
                      number={number}
                      countryCode={countryCode}
                    />
                  ),
                )}
              </>
            ) : null}
            {contact.emailAddresses && contact.emailAddresses.length ? (
              <>
                {contact.emailAddresses.map(({label, email}, index) => (
                  <Email key={index} label={label} email={email} />
                ))}
              </>
            ) : null}
            {contact.imAddresses && contact.imAddresses.length ? (
              <>
                {contact.imAddresses.map(({username, service}, index) => (
                  <ImAddress
                    key={index}
                    username={username}
                    service={service}
                  />
                ))}
              </>
            ) : null}
            {contact.postalAddresses && contact.postalAddresses.length
              ? contact.postalAddresses.map((address, index) => {
                  return (
                    <Address
                      key={index}
                      label={address.label}
                      formattedAddress={address.formattedAddress}
                    />
                  );
                })
              : null}

            {contact && contact.jobTitle ? (
              <ContactViewBox>
                <ContactIconBox>
                  {/* <MCI name={'google-maps'} size={normalize(18)} /> */}
                </ContactIconBox>
                <ContactDetailBox>
                  <LabelText>{'Job Title'}</LabelText>
                  <ValueText>{contact.jobTitle}</ValueText>
                </ContactDetailBox>
                <ContactIconBox />
                <ContactIconBox />
              </ContactViewBox>
            ) : null}
            {contact && contact.department ? (
              <ContactViewBox>
                <ContactIconBox>
                  {/* <MCI name={'google-maps'} size={normalize(18)} /> */}
                </ContactIconBox>
                <ContactDetailBox>
                  <LabelText>{'Department'}</LabelText>
                  <ValueText>{contact.department}</ValueText>
                </ContactDetailBox>
                <ContactIconBox />
                <ContactIconBox />
              </ContactViewBox>
            ) : null}
            {contact && contact.company ? (
              <ContactViewBox>
                <ContactIconBox>
                  {/* <MCI name={'google-maps'} size={normalize(18)} /> */}
                </ContactIconBox>
                <ContactDetailBox>
                  <LabelText>{'Company'}</LabelText>
                  <ValueText>{contact.company}</ValueText>
                </ContactDetailBox>
                <ContactIconBox />
                <ContactIconBox />
              </ContactViewBox>
            ) : null}

            <Text />
            <Text />
            <Text />
            <Text />
            <Text />
            <Text />
            <Text />
            <Text />
          </ScrollView>
        </ViewContactDrawerContainer>
      ) : null}
    </Modal>
  );
};

export default ViewContactDrawer;

const Number = ({label, number, countryCode, handleMessage, phoneHandles}) => {
  const theme = useTheme();
  return (
    <ContactViewBox>
      <ContactIconBox>
        <MCI name={'phone'} size={normalize(18)} />
      </ContactIconBox>
      <ContactDetailBox>
        <LabelText>{label}</LabelText>
        <ValueText>{number}</ValueText>
      </ContactDetailBox>
      <ContactIconBox>
        <IconButton
          onPress={() => handleMessage(number)}
          iconSize={normalize(15)}
          iconColor={theme.colors.ContactCardActionIcon}
          opacity={1}
          bgColor={theme.colors.ContactCardActionIconBG}
          IconLibrary={MCI}
          iconName={'message-reply-text'}
        />
      </ContactIconBox>
      <ContactIconBox>
        <IconButton
          onPress={() => handleCall(phoneHandles[0].id, number)}
          iconSize={normalize(15)}
          iconColor={theme.colors.ContactCardActionIcon}
          opacity={1}
          bgColor={theme.colors.ContactCardActionIconBG}
          IconLibrary={MCI}
          iconName={'phone'}
        />
      </ContactIconBox>
    </ContactViewBox>
  );
};

const Email = ({label, email}) => {
  return (
    <ContactViewBox>
      <ContactIconBox>
        <MCI name={'email'} size={normalize(18)} />
      </ContactIconBox>
      <ContactDetailBox>
        <LabelText>{label}</LabelText>
        <ValueText>{email}</ValueText>
      </ContactDetailBox>
      <ContactIconBox />
      <ContactIconBox>{/* <Text>0</Text> */}</ContactIconBox>
    </ContactViewBox>
  );
};

const Address = ({label, formattedAddress}) => {
  return (
    <ContactViewBox>
      <ContactIconBox>
        <MCI name={'google-maps'} size={normalize(18)} />
      </ContactIconBox>
      <ContactDetailBox>
        <LabelText>{label}</LabelText>
        <ValueText>{formattedAddress}</ValueText>
      </ContactDetailBox>
      <ContactIconBox />
      <ContactIconBox />
    </ContactViewBox>
  );
};

const ImAddress = ({username, service}) => {
  return (
    <ContactViewBox>
      <ContactIconBox>
        <MCI name={'link-variant'} size={normalize(18)} />
      </ContactIconBox>
      <ContactDetailBox>
        <LabelText>{service}</LabelText>
        <ValueText>{username}</ValueText>
      </ContactDetailBox>
      <ContactIconBox />
      <ContactIconBox />
    </ContactViewBox>
  );
};

const ContactViewBox = styled.View`
  flex-direction: row;
  padding: ${props => props.theme.spacings.verticalScale.s8}px
    ${props => props.theme.spacings.normalScale.s16}px;
`;

const ContactIconBox = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ContactDetailBox = styled.View`
  flex: 3;
  justify-content: center;
  align-items: flex-start;
`;

const LabelText = styled.Text`
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.secondary};
`;
const ValueText = styled.Text`
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f14}px;
  color: ${props => props.theme.colors.AddContactHeaderIconColor};
`;

const ViewContactDrawerContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.AddContactDrawerBackground};
`;

const ProfilePictureContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  width: ${width * 0.4}px;
  height: ${width * 0.4}px;
  border-radius: ${width * 0.4}px;
`;

const ProfilePictureSquare = styled.View`
  width: ${width * 0.4}px;
  height: ${width * 0.4}px;
`;

const Title = styled.Text`
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f18}px;
  color: ${props => props.theme.colors.AddContactHeaderIconColor};
`;

const Tags = styled.Text`
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.w400};
  font-size: ${props => props.theme.fontSize.f10}px;
  color: ${props => props.theme.colors.ContactViewCardLabelText};
`;
