import { useEffect, useState } from 'react';

export const useModal = () => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = modal ? 'hidden' : 'visible';
    document.body.style.height = modal ? '100vh' : 'fit';
  }, [modal]);

  return setModal;
};
