import { useState } from 'react';
import { useMbWallet } from '@mintbase-js/react';

interface UseFetchCountResult {
  fetchCount: () => Promise<number | null>;
  loading: boolean;
  error: string | null;
}

const UseFetchCount = (): UseFetchCountResult => {
  const { activeAccountId } = useMbWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async (): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/fetchCount?activeAccountId=${activeAccountId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLoading(false);

      // Return the count from the response data
      return data.count;
    } catch (error) {
      console.error('Error fetching count:', error);
      setError('Failed to fetch count');
      setLoading(false);
      return null;
    }
  };

  return { fetchCount, loading, error };
};

export default UseFetchCount;
