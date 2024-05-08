import { useState } from 'react';
import { useMbWallet } from '@mintbase-js/react';
interface UseRegisterResult {
  register: (eventId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean | null;
}

const useRegister = (): UseRegisterResult => {
  const { selector, activeAccountId } = useMbWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const register = async (eventId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const wallet = await selector.wallet(); 
      const response = await fetch('/api/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, activeAccountId}),
      });
      const data = await response.json();
      const isRegistered = data.success;
      setSuccess(isRegistered);
      return isRegistered;
    } catch (error) {
      console.error('Error registering event:', error);
      setError('Failed to register event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
};

export default useRegister;
