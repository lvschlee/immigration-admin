import { useState, useCallback } from 'react';
import { ref, FirebaseStorage, deleteObject } from 'firebase/storage';

export function useImage(storage: FirebaseStorage, folder: string) {
  const [data] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const remove = useCallback(async (filename: string) => {
    const imageRef = ref(storage, filename);

    try {
      setLoading(true);

      await deleteObject(imageRef);

    } catch(e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [storage]);

  return {
    data,
    loading,
    error,

    remove,
  };
}
