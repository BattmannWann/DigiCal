import { useState, useEffect, useCallback } from "react";
import AxiosInstance from "./AxiosInstance";

const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback( async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(endpoint);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData};
};

export default useFetchData;
