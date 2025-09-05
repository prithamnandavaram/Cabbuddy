import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
const apiUri = import.meta.env.VITE_API_URL || "http://localhost:8080/api"

const formSchema = z.object({
  from: z.string(),
  to: z.string(),
  seat: z.number().min(1).max(10),
  price: z.number().nonnegative(),
  startTime: z.date().min(new Date()),
  endTime: z.date().min(new Date())
})


const PublishCard = () => {
  const { user } = useContext(AuthContext);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      seat: 1,
      price: 0,
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  // Helper function outside of onSubmit
  function toLocalISOString(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  
  const onSubmit = async (data) => {
    try {
      if (!user) {
        toast.error("You must be logged in to publish a ride");
        return;
      }
      
      const body = {
        "availableSeats": data.seat,
        "origin": {
          "place": data.from.trim(),
        },
        "destination": {
          "place": data.to.trim(),
        },
        "startTime": toLocalISOString(new Date(data.startTime)),
        "endTime": toLocalISOString(new Date(data.endTime)),
        "price": data.price
      }
      
      // Log the API URL and request body for debugging
      console.log("Publishing ride to API URL:", `${apiUri}/rides`);
      console.log("Request body:", body);
      console.log("Authentication status:", user ? "Logged in" : "Not logged in");
      
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      console.log("Auth token from localStorage:", token ? "Token exists" : "No token found");
      
      // Check if user data has token
      console.log("User data:", user);
      
      // Include both withCredentials and Authorization header for maximum compatibility
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      };
      
      console.log("Request config:", config);
      
      const response = await axios.post(`${apiUri}/rides`, body, config);
      console.log("Ride creation successful:", response.data);
      toast("The ride has been Created");
      form.reset();
    } catch (error) {
      console.error('POST request failed:', error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error(`Failed to create ride: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create a Ride</CardTitle>
        <CardDescription>Publish your ride with just one click.</CardDescription>
      </CardHeader>
      <CardContent>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="From" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input placeholder="To" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-24">
            <FormField
              control={form.control}
              name="seat"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Available seats</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Button variant="outline" size="icon" type="button" onClick={() => field.value>1 && field.onChange(field.value - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{field.value}</span>
                      <Button variant="outline" size="icon" type="button" onClick={() => field.value<10 && field.onChange(field.value + 1)}  >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" min="0" {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" placeholder="Departure time" {...field}
                    value={field.value ? (() => {
                      const d = new Date(field.value);
                      d.setSeconds(0,0);
                      const pad = n => n.toString().padStart(2, '0');
                      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    })() : ''}
                    onChange={e => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1.5">
                <FormLabel>Arrival Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" placeholder="Arrival time" {...field}
                    value={field.value ? (() => {
                      const d = new Date(field.value);
                      d.setSeconds(0,0);
                      const pad = n => n.toString().padStart(2, '0');
                      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    })() : ''}
                    onChange={e => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Publish</Button>
        </form>
      </Form>
      </CardContent>
      <Toaster />
    </Card>
  )
}

export default PublishCard