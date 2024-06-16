import useTheme from 'hooks/useTheme';
import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import FlexedJustifiedAligned from 'styled/FlexedJustifiedAligned';
import {normalize} from 'utils/normalize';
import FlexedJustifiedBetween from 'styled/FlexedJustifiedBetween';
import {
  CONTACT_ADDRESS_LABELS,
  CONTACT_EMAIL_LABELS,
  CONTACT_IM_LABELS,
  CONTACT_PHONE_LABELS,
  CONTACT_TAGS,
} from 'constants/contactTags';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {MT} from 'styled/MT';
import {getStatusBarHeight} from 'utils/getStatusBarHeight';
import {width} from 'utils/device';
import {contact_empty} from 'assets/images';
import Accordion from 'react-native-collapsible/Accordion';
import OI from 'react-native-vector-icons/Octicons';
import {
  AddContactInputDropDown,
  AddContactInputNormal,
} from 'components/Inputs/AddContactInput';
import useImageCropper from 'hooks/useImageCropper';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {dispatchSnackBar} from 'utils/snackbar';
import useKeyboardListener from 'hooks/useKeyboardListener';
import CreateContactModalHeader from 'components/Contacts/CreateContactModalHeader';
import ContactsImageUploadOptionsDrawer from './ContactsImageUploadOptionsDrawer';
import SwitchButton from 'components/Buttons/SwitchButton';
const HeaderIconSize = normalize(25);

const phoneNumberDoc = {
  label: 'Home',
  number: '',
};

const emailDoc = {
  label: 'Home',
  email: '',
};

const postalAddressDoc = {
  label: 'Home',
  formattedAddress: '',
  street: '',
  pobox: '',
  neighborhood: '',
  city: '',
  region: '',
  state: '',
  postCode: '',
  country: '',
};

const iMDoc = {username: '', service: 'Facebook'};

const ContactDocumentTemplate = {
  backTitle: '',
  prefix: '',
  givenName: '',
  middleName: '',
  familyName: '',
  suffix: '',
  phoneNumbers: [phoneNumberDoc],

  jobTitle: '',
  company: '',
  department: '',
  emailAddresses: [emailDoc],

  postalAddresses: [postalAddressDoc],
  // birthday: {year: 1988, month: 1, day: 1},
  imAddresses: [iMDoc],
  isStarred: false,
  isBlocked: false,
  hasThumbnail: false,
  thumbnailPath: '',
  tags: [],
};

const SECTIONS = [
  {
    title: 'Personal Details',
  },
  {
    title: 'Professional Details',
  },
  {
    title: 'Other Details',
  },
];

const CreateNewContactDrawer = ({
  visible,
  closeAddContactDrawer,
  editModeContact,
  number,
}) => {
  const {keyBoardVisible, keyBoardHeight, keyBoardHeightPercentage} =
    useKeyboardListener();
  const theme = useTheme();
  const [contact, setContact] = useState({...ContactDocumentTemplate});
  const height = getStatusBarHeight();
  const [activeSections, setActiveSections] = useState([0]);
  const [
    contactsImageUploadOptionsDrawer,
    setContactsImageUploadOptionsDrawer,
  ] = useState(false);
  const closeContactsImageUploadOptionsDrawer = () =>
    setContactsImageUploadOptionsDrawer(false);
  const openContactsImageUploadOptionsDrawer = () =>
    setContactsImageUploadOptionsDrawer(true);
  const [image, openCamera, openGallery, clearImage] = useImageCropper(
    closeContactsImageUploadOptionsDrawer,
  );
  const addContact = async () => {
    try {
      const result = await ContactQueries.addContact(contact, true);
      if (result) {
        closeAddContactDrawer();
        dispatchSnackBar({text: 'Added to Contacts'});
      }
    } catch (error) {
      // console.log({error});
      dispatchSnackBar({text: 'Error Adding Contact'});
    }
  };

  const editContact = async () => {
    try {
      const result = await ContactQueries.editContact(contact);
      if (result) {
        closeAddContactDrawer();
        dispatchSnackBar({text: 'Contact Updated Successfully'});
      }
    } catch (error) {
      console.log({error});
      dispatchSnackBar({text: 'Error Updating Contact'});
    }
  };

  const _renderHeader = section => {
    return (
      <SectionHeader>
        <View style={{width: '90%'}}>
          <FlexedJustifiedAligned>
            <SectionHeaderText>{section.title}</SectionHeaderText>
          </FlexedJustifiedAligned>
        </View>
        <OI
          name={'triangle-down'}
          size={HeaderIconSize}
          color={theme.colors.AddContactSectionHeaderText}
        />
      </SectionHeader>
    );
  };

  const _renderContent = section => {
    return (
      <SectionConentContainer>
        {section.title === 'Personal Details' ? (
          <PersonalDetailsForm setContact={setContact} contact={contact} />
        ) : section.title === 'Professional Details' ? (
          <ProfessionalDetailsForm setContact={setContact} contact={contact} />
        ) : section.title === 'Other Details' ? (
          <OtherDetailsForm setContact={setContact} contact={contact} />
        ) : null}
      </SectionConentContainer>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  useEffect(() => {
    if (image && image.path) {
      setContact({...contact, thumbnailPath: image.path, hasThumbnail: true});
    } else {
      setContact({...contact, thumbnailPath: '', hasThumbnail: false});
    }
  }, [image]);

  useEffect(() => {
    if (editModeContact && editModeContact.recordID) {
      let temp = {...editModeContact};
      delete temp._id;
      delete temp.searchKey;
      temp.phoneNumbers = temp.phoneNumbers.map(({number, label}) => ({
        number,
        label,
      }));
      setContact({...temp});
    }
  }, [editModeContact]);

  useEffect(() => {
    if (number && number.length) {
      let temp = [...contact.phoneNumbers];
      temp[0].number = number;
      setContact({...contact, phoneNumbers: [...temp]});
    }
  }, [number]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent={true}
      transparent={false}
      animationType="slide">
      <ContactsImageUploadOptionsDrawer
        visible={contactsImageUploadOptionsDrawer}
        closeContactsImageUploadOptionsDrawer={
          closeContactsImageUploadOptionsDrawer
        }
        openCamera={openCamera}
        openGallery={openGallery}
      />
      <AddContactDrawerContainer>
        <MT MT={height} />
        <CreateContactModalHeader
          addContact={addContact}
          editContact={editContact}
          editModeContact={editModeContact}
          closeAddContactDrawer={closeAddContactDrawer}
        />
        <MT MT={theme.spacings.verticalScale.s42} />
        <ProfilePictureContainer>
          <ProfilePictureSquare>
            {contact.hasThumbnail ? (
              <RemoveProfilePictureButton onPress={clearImage}>
                <MCI name="close" size={normalize(15)} />
              </RemoveProfilePictureButton>
            ) : null}
            <ProfilePicture
              source={
                contact.hasThumbnail
                  ? {
                      uri: contact.thumbnailPath,
                    }
                  : contact_empty
              }
            />
          </ProfilePictureSquare>
        </ProfilePictureContainer>
        <MT MT={theme.spacings.verticalScale.s18} />
        <FlexedJustifiedAligned>
          <TouchableOpacity onPress={openContactsImageUploadOptionsDrawer}>
            <AddProfilePictureButtonText>
              Add Picture
            </AddProfilePictureButtonText>
          </TouchableOpacity>
        </FlexedJustifiedAligned>
        <MT MT={theme.spacings.verticalScale.s42} />
        <ScrollView>
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
          />
        </ScrollView>
      </AddContactDrawerContainer>
      <MT MT={keyBoardVisible ? keyBoardHeight : 0} />
    </Modal>
  );
};

const PersonalDetailsForm = ({setContact, contact}) => {
  const theme = useTheme();
  const handleChange = (name, v) => {
    setContact({...contact, [name]: v});
  };

  const appendPhoneNumberDoc = () => {
    const existingLabels = contact.phoneNumbers.map(v => v.label);
    const label = CONTACT_PHONE_LABELS.map(v => v.label).filter(
      l => !existingLabels.includes(l),
    )[0];
    if (label) {
      setContact({
        ...contact,
        phoneNumbers: [...contact.phoneNumbers, {...phoneNumberDoc, label}],
      });
    }
  };

  const handleDeletePhoneNumberDoc = index => {
    let phoneNumbers = contact.phoneNumbers.filter((v, i) => i !== index);
    {
      setContact({
        ...contact,
        phoneNumbers,
      });
    }
  };

  const handleChangePhoneNumber = (index, name, value) => {
    const phoneNumbers = [...contact.phoneNumbers];
    phoneNumbers[index] = {...phoneNumbers[index], [name]: value};
    setContact({...contact, phoneNumbers});
  };

  return (
    <View>
      <AddContactInputNormal
        width={90}
        placeholder="First Name"
        value={contact.givenName}
        onChangeText={v => handleChange('givenName', v)}
      />
      <AddContactInputNormal
        width={90}
        placeholder="Middle Name"
        value={contact.middleName}
        onChangeText={v => handleChange('middleName', v)}
      />
      <AddContactInputNormal
        width={90}
        placeholder="Last Name"
        value={contact.familyName}
        onChangeText={v => handleChange('familyName', v)}
      />

      {contact.phoneNumbers.map(({label, number}, index) => (
        <View key={index} style={{flexDirection: 'row', gap: 10}}>
          <FlexedJustifiedBetween style={{gap: 10, width: '90%'}}>
            <View style={{flex: 2}}>
              <AddContactInputNormal
                width={100}
                placeholder="Phone"
                value={number}
                onChangeText={v => handleChangePhoneNumber(index, 'number', v)}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <AddContactInputDropDown
                onSelect={(v, i) => handleChangePhoneNumber(index, 'label', v)}
                defaultValue={label}
                value={label}
                items={CONTACT_PHONE_LABELS.map(v => v.label).filter(
                  l => !contact.phoneNumbers.map(v => v.label).includes(l),
                )}
                width={100}
                placeholder="Label"
              />
            </View>
          </FlexedJustifiedBetween>
          <FlexedJustifiedAligned
            style={{
              width: '10%',
            }}>
            {index === contact.phoneNumbers.length - 1 ? (
              <TouchableOpacity onPress={appendPhoneNumberDoc}>
                <MCI
                  name={'plus'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleDeletePhoneNumberDoc(index)}>
                <MCI
                  name={'close'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            )}
          </FlexedJustifiedAligned>
        </View>
      ))}
    </View>
  );
};

const ProfessionalDetailsForm = ({setContact, contact}) => {
  const theme = useTheme();
  const handleChange = (name, v) => {
    setContact({...contact, [name]: v});
  };

  const appendEmailDoc = () => {
    const existingLabels = contact.emailAddresses.map(v => v.label);
    const label = CONTACT_EMAIL_LABELS.map(v => v.label).filter(
      l => !existingLabels.includes(l),
    )[0];
    if (label) {
      setContact({
        ...contact,
        emailAddresses: [...contact.emailAddresses, {...emailDoc, label}],
      });
    }
  };

  const handleDeleteEmailDoc = index => {
    let emailAddresses = contact.emailAddresses.filter((v, i) => i !== index);
    {
      setContact({
        ...contact,
        emailAddresses,
      });
    }
  };

  const handleChangeEmail = (index, name, value) => {
    const emailAddresses = [...contact.emailAddresses];
    emailAddresses[index] = {...emailAddresses[index], [name]: value};
    setContact({...contact, emailAddresses});
  };

  return (
    <View>
      <AddContactInputNormal
        width={90}
        placeholder="Job Title"
        value={contact.jobTitle}
        onChangeText={v => handleChange('jobTitle', v)}
      />
      <AddContactInputNormal
        width={90}
        placeholder="Company"
        value={contact.company}
        onChangeText={v => handleChange('company', v)}
      />
      <AddContactInputNormal
        width={90}
        placeholder="Department"
        value={contact.department}
        onChangeText={v => handleChange('department', v)}
      />

      {contact.emailAddresses.map(({label, email}, index) => (
        <View key={index} style={{flexDirection: 'row', gap: 10}}>
          <FlexedJustifiedBetween style={{gap: 10, width: '90%'}}>
            <View style={{flex: 2}}>
              <AddContactInputNormal
                width={100}
                placeholder="Email"
                value={email}
                onChangeText={v => handleChangeEmail(index, 'email', v)}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <AddContactInputDropDown
                onSelect={(v, i) => handleChangeEmail(index, 'label', v)}
                defaultValue={label}
                value={label}
                items={CONTACT_EMAIL_LABELS.map(v => v.label).filter(
                  l => !contact.emailAddresses.map(v => v.label).includes(l),
                )}
                width={100}
                placeholder="Label"
              />
            </View>
          </FlexedJustifiedBetween>
          <FlexedJustifiedAligned
            style={{
              width: '10%',
            }}>
            {index === contact.emailAddresses.length - 1 ? (
              <TouchableOpacity onPress={appendEmailDoc}>
                <MCI
                  name={'plus'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleDeleteEmailDoc(index)}>
                <MCI
                  name={'close'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            )}
          </FlexedJustifiedAligned>
        </View>
      ))}
    </View>
  );
};

const OtherDetailsForm = ({setContact, contact}) => {
  const theme = useTheme();

  const appendPostalAddressDoc = () => {
    const existingLabels = contact.postalAddresses.map(v => v.label);
    const label = CONTACT_ADDRESS_LABELS.map(v => v.label).filter(
      l => !existingLabels.includes(l),
    )[0];
    if (label) {
      setContact({
        ...contact,
        postalAddresses: [
          ...contact.postalAddresses,
          {...postalAddressDoc, label},
        ],
      });
    }
  };

  const handleDeletePostalAddressDoc = index => {
    let postalAddresses = contact.postalAddresses.filter((v, i) => i !== index);
    {
      setContact({
        ...contact,
        postalAddresses,
      });
    }
  };

  const handleUpdateAddress = (index, name, value) => {
    const postalAddresses = [...contact.postalAddresses];
    postalAddresses[index] = {...postalAddresses[index], [name]: value};
    setContact({...contact, postalAddresses});
  };

  const appendImDoc = () => {
    const existingLabels = contact.imAddresses.map(v => v.service);
    const service = CONTACT_IM_LABELS.map(v => v.label).filter(
      l => !existingLabels.includes(l),
    )[0];
    if (service) {
      setContact({
        ...contact,
        imAddresses: [...contact.imAddresses, {...iMDoc, service}],
      });
    }
  };

  const handleDeleteImDocDoc = index => {
    let imAddresses = contact.imAddresses.filter((v, i) => i !== index);
    {
      setContact({
        ...contact,
        imAddresses,
      });
    }
  };

  const handleUpdateImAddress = (index, name, value) => {
    const imAddresses = [...contact.imAddresses];
    imAddresses[index] = {...imAddresses[index], [name]: value};
    setContact({...contact, imAddresses});
  };

  const handleStarred = () => {
    setContact({...contact, isStarred: !contact.isStarred});
  };
  const handleBlock = () => {
    setContact({...contact, isBlocked: !contact.isBlocked});
  };

  const handleTagging = t => {
    if (contact.tags.includes(t)) {
      setContact({...contact, tags: contact.tags.filter(tg => tg !== t)});
    } else {
      setContact({...contact, tags: [...contact.tags, t]});
    }
  };

  return (
    <View>
      {contact.postalAddresses.map(
        (
          {
            label,
            formattedAddress,
            street,
            pobox,
            neighborhood,
            city,
            region,
            state,
            postCode,
            country,
          },
          index,
        ) => (
          <View key={index} style={{flexDirection: 'row', gap: 10}}>
            <FlexedJustifiedBetween style={{gap: 10, width: '90%'}}>
              <View style={{flex: 2}}>
                <AddContactInputNormal
                  width={100}
                  placeholder="Address"
                  value={formattedAddress}
                  onChangeText={v =>
                    handleUpdateAddress(index, 'formattedAddress', v)
                  }
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <AddContactInputDropDown
                  onSelect={(v, i) => handleUpdateAddress(index, 'label', v)}
                  defaultValue={label}
                  value={label}
                  items={CONTACT_ADDRESS_LABELS.map(v => v.label).filter(
                    l => !contact.postalAddresses.map(v => v.label).includes(l),
                  )}
                  width={100}
                  placeholder="Label"
                />
              </View>
            </FlexedJustifiedBetween>
            <FlexedJustifiedAligned
              style={{
                width: '10%',
              }}>
              {index === contact.postalAddresses.length - 1 ? (
                <TouchableOpacity onPress={appendPostalAddressDoc}>
                  <MCI
                    name={'plus'}
                    size={normalize(18)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleDeletePostalAddressDoc(index)}>
                  <MCI
                    name={'close'}
                    size={normalize(18)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              )}
            </FlexedJustifiedAligned>
          </View>
        ),
      )}
      {contact.imAddresses.map(({service, username}, index) => (
        <View key={index} style={{flexDirection: 'row', gap: 10}}>
          <FlexedJustifiedBetween style={{gap: 10, width: '90%'}}>
            <View style={{flex: 2}}>
              <AddContactInputNormal
                width={100}
                placeholder="User Name"
                value={username}
                onChangeText={v => handleUpdateImAddress(index, 'username', v)}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <AddContactInputDropDown
                onSelect={(v, i) => handleUpdateImAddress(index, 'service', v)}
                defaultValue={service}
                value={service}
                items={CONTACT_IM_LABELS.map(v => v.label).filter(
                  l => !contact.imAddresses.map(v => v.service).includes(l),
                )}
                width={100}
                placeholder="Service"
              />
            </View>
          </FlexedJustifiedBetween>
          <FlexedJustifiedAligned
            style={{
              width: '10%',
            }}>
            {index === contact.imAddresses.length - 1 ? (
              <TouchableOpacity onPress={appendImDoc}>
                <MCI
                  name={'plus'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleDeleteImDocDoc(index)}>
                <MCI
                  name={'close'}
                  size={normalize(18)}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            )}
          </FlexedJustifiedAligned>
        </View>
      ))}
      <MT MT={theme.spacings.verticalScale.s12} />
      <FlexedJustifiedBetween style={{width: '90%'}}>
        <TitleText>Favorites</TitleText>
        <SwitchButton value={contact.isStarred} onChange={handleStarred} />
      </FlexedJustifiedBetween>
      <MT MT={theme.spacings.verticalScale.s12} />
      <FlexedJustifiedBetween style={{width: '90%'}}>
        <TitleText>Block</TitleText>
        <SwitchButton value={contact.isBlocked} onChange={handleBlock} />
      </FlexedJustifiedBetween>
      <MT MT={theme.spacings.verticalScale.s16} />
      <TitleText>Tags</TitleText>
      <MT MT={theme.spacings.verticalScale.s12} />
      <TagButtonContainer>
        {CONTACT_TAGS.map(({label, icon}) => (
          <TagButton key={label} onPress={() => handleTagging(label)}>
            <MCI
              name={contact.tags.includes(label) ? 'check-circle' : icon}
              color={theme.colors.white}
            />
            <TagButtonText>{label}</TagButtonText>
          </TagButton>
        ))}
      </TagButtonContainer>
      <MT MT={theme.spacings.verticalScale.s36} />
    </View>
  );
};
export default CreateNewContactDrawer;

const AddContactDrawerContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.AddContactDrawerBackground};
`;

const ProfilePictureContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  width: ${width * 0.3}px;
  height: ${width * 0.3}px;
  border-radius: ${width * 0.3}px;
`;

const ProfilePictureSquare = styled.View`
  width: ${width * 0.3}px;
  height: ${width * 0.3}px;
`;

const AddProfilePictureButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.secondary};
  font-weight: ${props => props.theme.fontWeight.w600};
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${normalize(10)}px;
  border-radius: ${normalize(3)}px;
  background-color: ${props => props.theme.colors.AddContactSectionHeaderBG};
  margin: ${normalize(8)}px ${props => props.theme.spacings.normalScale.s16}px;
`;

const SectionHeaderText = styled.Text`
  font-size: ${props => props.theme.fontSize.f14}px;
  color: ${props => props.theme.colors.AddContactSectionHeaderText};
  font-weight: ${props => props.theme.fontWeight.w400};
`;

const SectionConentContainer = styled.View`
  padding: ${normalize(8)}px ${props => props.theme.spacings.normalScale.s36}px;
`;
const TitleText = styled.Text`
  font-size: ${props => props.theme.fontSize.f16}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;

const RemoveProfilePictureButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
`;

const TagButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${normalize(8)}px;
`;

const TagButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${normalize(1)}px ${normalize(5)}px;
  border-radius: ${normalize(3)}px;
  border: 1px solid ${props => props.theme.colors.white};
  gap: ${normalize(8)}px;
`;

const TagButtonText = styled.Text`
  font-size: ${props => props.theme.fontSize.f12}px;
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.w400};
`;
