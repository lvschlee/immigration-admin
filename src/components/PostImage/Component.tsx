import { ref, getStorage } from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';

import { app } from '../../firebase';

type PostImageType = {
  src: string;
}

export function PostImage({ src }: PostImageType) {
  const storage = getStorage(app);
  const [value, loading] = useDownloadURL(
    ref(storage, src)
  );

  if (loading) {
    return (
      <span>Загружается</span>
    )
  }

  return (
    <img src={value} alt="" height="150" />
  )
}