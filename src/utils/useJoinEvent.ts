import { useState } from 'react';
import { useMbWallet } from '@mintbase-js/react';

interface UseJoinEventResult {
  fetchUser: (eventId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const useJoinEvent = (): UseJoinEventResult => {
  const { activeAccountId } = useMbWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (eventId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    console.log(activeAccountId,eventId);

    try {
      // Here, you would make the API call to check if the user is registered for the event
      const response = await fetch(`/api/fetchData?activeAccountId=${activeAccountId}&eventId=${eventId}`);
      const data = await response.json();
      const registrations = data.registered;
      console.log(data,registrations);
      // Check if the user is already registered for the event
      const isRegistered = registrations;
      setLoading(false);
      return isRegistered;
    } catch (error) {
      console.error('Error checking registration:', error);
      setError('Failed to check registration');
      setLoading(false);
      return false;
    }
  };

  return { fetchUser, loading, error };
};

export default useJoinEvent;
