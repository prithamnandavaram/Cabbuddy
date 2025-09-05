import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import OfferSeat from './pages/OfferSeat'
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage'
import Error from './pages/Error'
import RideDetail from './pages/RideDetail'
import Profile from './pages/Profile'
import { useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'

function App() {
  const { user } = useContext(AuthContext);

  // Ensure token is available whenever the user is logged in
  useEffect(() => {
    if (user && !localStorage.getItem("authToken")) {
      console.log("App: User is logged in but no token found, generating one");
      
      // Create a client-side token
      if (user.user && user.user._id) {
        const clientToken = JSON.stringify({
          id: user.user._id,
          isAdmin: user.isAdmin || false,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          iat: Math.floor(Date.now() / 1000)
        });
        const token = btoa(clientToken);
        console.log("App: Generated token from user data");
        localStorage.setItem("authToken", token);
      }
    }
  }, [user]);

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/*" element={<Error />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/offer-seat" element={<OfferSeat />} />
      <Route path="/ride/:rideId" element={<RideDetail />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
