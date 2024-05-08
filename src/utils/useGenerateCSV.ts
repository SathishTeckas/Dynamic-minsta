import { useState } from 'react';

interface UseFetchDataResult {
  fetchData: () => Promise<void>;
  loading: boolean;
  error: string | null;
  csvData: string | null; // Add CSV data
}

const useFetchData = (): UseFetchDataResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCSVData] = useState<string | null>(null); // State to hold CSV data

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/fetchAllData`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const csv = await response.text(); // Convert response to text
      setCSVData(csv); // Set CSV data state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  return { fetchData, loading, error, csvData };
};

export default useFetchData;
