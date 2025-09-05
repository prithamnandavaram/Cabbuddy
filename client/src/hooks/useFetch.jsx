import axios from "axios"
import { useEffect, useState } from "react"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// Use environment variable in production, fallback to localhost for development

// Set up axios to include token in all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  console.log("Axios interceptor - token from localStorage:", token ? "Token exists" : "No token found");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header to request");
  } else {
    console.log("No token available, request will proceed without Authorization header");
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