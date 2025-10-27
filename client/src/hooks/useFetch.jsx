import axios from "axios"
import { useEffect, useState } from "react"

// Force production API URL when deployed (using URL check instead of env)
const isDeployed = typeof window !== 'undefined' && 
  (window.location.hostname.includes('vercel.app') || 
   window.location.hostname !== 'localhost');

const baseURL = isDeployed
  ? "https://cabbuddy-tzte.onrender.com/api" 
  : (import.meta.env.VITE_API_URL || "http://localhost:8080/api");

// Set up axios to include token in all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

const useFetch = (endpoint, includeCredentials = false) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const url = `${baseURL}/${endpoint}`;

  useEffect(() => {
    setLoading(true)
    const axiosConfig = includeCredentials ? { withCredentials: true } : {};
    axios
      .get(url, axiosConfig)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        setError(err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setLoading(false)
      })
    
  }, [url, includeCredentials])

  function refetch(){
    setLoading(true)
    const axiosConfig = includeCredentials ? { withCredentials: true } : {};
    axios
      .get(url, axiosConfig)
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        setError(err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  
  return { data, loading, error, refetch }
}

export default useFetch