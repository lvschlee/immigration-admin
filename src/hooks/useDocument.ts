import { useState, useCallback } from 'react';
import { Firestore, doc, deleteDoc } from 'firebase/firestore';

export function useDocument(db: Firestore, collection: string) {
  const [data] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const remove = useCallback(async (id: string) => {
    const document = doc(db, collection, id)

    try {
      setLoading(true);

      await deleteDoc(document);

    } catch(e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [db, collection]);

  return {
    data,
    loading,
    error,

    remove,
  };
}
