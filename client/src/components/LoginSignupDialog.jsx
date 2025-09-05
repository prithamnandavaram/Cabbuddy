import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/AuthContext"
import axios from "axios"

// Always use the deployed API in production
const apiUri = import.meta.env.MODE === 'production' 
  ? "https://cabbuddy-tzte.onrender.com/api" 
  : (import.meta.env.VITE_API_URL || "http://localhost:8080/api");

const LoginSignupDialog = () => {
  const { loading, error, dispatch } = useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });

  const handleLogin = async (event) => {
    event.preventDefault();
    
    // Validate form data
    if (!loginData.email || !loginData.password) {
      dispatch({type: "LOGIN_FAILED", payload: {message: "Email and password are required"}})
      return;
    }
    
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const res = await axios.post(`${apiUri}/auth/login`, loginData, {withCredentials: true})
      console.log("Login response:", res.data);
      
      // Store token in localStorage if it exists in response
      if (res.data.token) {
        console.log("Token received from server, storing in localStorage");
        localStorage.setItem("authToken", res.data.token);
      } else {
        console.log("No token found in login response, generating one client-side");
        // Generate a client-side token if the server doesn't provide one
        // This is a workaround until the backend is updated
        if (res.data.user && res.data.user._id) {
          const clientToken = JSON.stringify({
            id: res.data.user._id,
            isAdmin: res.data.isAdmin || false,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
            iat: Math.floor(Date.now() / 1000)
          });
          const encodedToken = btoa(clientToken);
          console.log("Generated client-side token:", encodedToken);
          localStorage.setItem("authToken", encodedToken);
        } else {
          console.log("Could not generate client-side token, insufficient user data");
        }
      }
      
      dispatch({type:"LOGIN_SUCCESS", payload: res.data})
      setLoginData({ email: "", password: "" })
    } catch(err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "An error occurred during login";
      dispatch({type: "LOGIN_FAILED", payload: {message: errorMessage}})
    }
  };


  const handleSignup = async (event) => {
    event.preventDefault();
    
    // Validate form data
    if (!signupData.name || !signupData.email || !signupData.password) {
      dispatch({type: "LOGIN_FAILED", payload: {message: "All fields are required"}})
      return;
    }
    
    // Password validation
    if (signupData.password.length < 8) {
      dispatch({type: "LOGIN_FAILED", payload: {message: "Password must be at least 8 characters long"}})
      return;
    }
    
    // Log API URL for debugging
    console.log("API URL being used:", apiUri);
    
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Ensure we're posting to the correct endpoint
      const url = `${apiUri}/auth/register`;
      console.log("Posting to URL:", url);
      console.log("With data:", signupData);
      
      const res = await axios.post(url, signupData, {withCredentials: true})
      console.log("Signup response:", res.data);
      
      // Store token in localStorage if it exists in response
      if (res.data.token) {
        console.log("Token received from server, storing in localStorage");
        localStorage.setItem("authToken", res.data.token);
      } else {
        console.log("No token found in signup response, generating one client-side");
        // Generate a client-side token if the server doesn't provide one
        // This is a workaround until the backend is updated
        if (res.data.user && res.data.user._id) {
          const clientToken = JSON.stringify({
            id: res.data.user._id,
            isAdmin: res.data.isAdmin || false,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
            iat: Math.floor(Date.now() / 1000)
          });
          const encodedToken = btoa(clientToken);
          console.log("Generated client-side token:", encodedToken);
          localStorage.setItem("authToken", encodedToken);
        } else {
          console.log("Could not generate client-side token, insufficient user data");
        }
      }
      
      dispatch({type:"LOGIN_SUCCESS", payload: res.data})
      setSignupData({ name: "", email: "", password: "" })
    } catch(err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "An error occurred during signup";
      console.error("Error details:", err.response?.data || "No detailed error");
      dispatch({type: "LOGIN_FAILED", payload: {message: errorMessage}})
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login</Button>
      </DialogTrigger>
        <DialogContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 my-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">SignUp</TabsTrigger>
            </TabsList>
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md mb-4">
                <span className="text-sm text-destructive font-medium">{error?.message}</span>
              </div>
            )}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Welcome back</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" autoComplete="email" type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" autoComplete="current-password" type="password" required value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={loading} type="submit">Log in</Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <Card>
                <CardHeader>
                  <CardTitle>Signup</CardTitle>
                  <CardDescription>Create a new account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" autoComplete="name" value={signupData.name} required onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newemail">Email</Label>
                    <Input id="newemail" autoComplete="email" type="email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newpassword">Password</Label>
                    <Input id="newpassword" autoComplete="new-password" type="password" required value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={loading} type="submit">Sign up</Button>
                </CardFooter>
              </Card>
            </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
    </Dialog>
  )
}

export default LoginSignupDialog