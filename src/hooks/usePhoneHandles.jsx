import {getPhoneAccountHandlesN} from 'nativeModules';
import {useEffect, useState} from 'react';

const usePhoneHandles = () => {
  const [phoneHandles, setPhoneHandles] = useState(null);
  const handleGetPhoneAccountHandles = async () => {
    try {
      const handles = await getPhoneAccountHandlesN();
      setPhoneHandles([...handles]);
    } catch (err) {
      console.log({err});
    }
  };

  useEffect(() => {
    handleGetPhoneAccountHandles();
  }, []);

  return {phoneHandles};
};

export default usePhoneHandles;
