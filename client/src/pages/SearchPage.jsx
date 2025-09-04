
import RideCard from '@/components/RideCard';
import Search from '@/components/Search';
import Sidebar from '@/components/Sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import useFetch from '@/hooks/useFetch';
import { MoveRight, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const SearchPage = () => {
  const { search } = useLocation();
  const { from, to, date, seat } = Object.fromEntries(new URLSearchParams(search));

  // Add state for sort and filter
  const [sort, setSort] = useState('Earliest Departure');
  const [departureFilter, setDepartureFilter] = useState([]); // e.g. ['departure_before_six_am']

  // Build query string with validation
  const queryParams = [];
  if (from) queryParams.push(`from=${encodeURIComponent(from)}`);
  if (to) queryParams.push(`to=${encodeURIComponent(to)}`);
  if (seat && !isNaN(parseInt(seat))) queryParams.push(`seat=${parseInt(seat)}`);
  if (date) queryParams.push(`date=${date}`);
  else {
    // Add today's date if not provided
    const today = new Date();
    queryParams.push(`date=${today.toISOString().slice(0,10)}`);
  }
  
  if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);
  if (departureFilter.length > 0) queryParams.push(`departure=${departureFilter.join(',')}`);
  const query = queryParams.join('&');
  


  const { loading, data, error, refetch } = useFetch(`rides/find?${query}`);

  // Handler to update sort/filter from Sidebar
  const handleSidebarChange = ({ sort, departure }) => {
    if (sort !== undefined) setSort(sort);
    if (departure !== undefined) setDepartureFilter(departure);
    refetch();
  };

  return (
    <main>
      <div className="z-10 flex justify-center items-center border-b bg-background p-8">
        <Search />
        <Dialog>
          <DialogTrigger className="md:hidden border border-lg p-2 bg-background absolute right-0">
            <SlidersHorizontal />
          </DialogTrigger>
          <DialogContent>
            <Sidebar onChange={handleSidebarChange} selectedSort={sort} selectedDeparture={departureFilter} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="container p-0 max-w-screen-xl grid md:grid-cols-5">
        <div className="hidden md:block">
          <div className="sticky top-16">
            <Sidebar onChange={handleSidebarChange} selectedSort={sort} selectedDeparture={departureFilter} />
          </div>
        </div>
        <div className="col-span-3 py-6 md:col-span-4 lg:border-l">
          <div className="container">

            {loading && (
              <>
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
              </>
            )}
            {error && (
              <div className="text-red-500 text-lg my-4">{typeof error === 'string' ? error : (error?.message || 'An error occurred while searching.')}</div>
            )}
            {data === null && !loading && !error && (
              <div className="text-gray-500 text-lg my-4">No data returned from server.</div>
            )}
            {data && Array.isArray(data.rides) ? (
              <>
                <h3>
                  {from} <MoveRight className="inline-block" /> {to}
                </h3>
                <h3>{data.rides.length} rides available</h3>
                {data.rides.length === 0 ? (
                  <h3 className='text-xl font-semibold'>No rides available based on your search criteria.</h3>
                ) : (
                  data.rides.map((ride) => (
                    <Link key={ride._id} to={`/ride/${ride._id}`}>
                      <RideCard details={ride} />
                    </Link>
                  ))
                )}
              </>
            ) : data && !Array.isArray(data.rides) ? (
              <div className="text-gray-500 text-lg my-4">No rides found or invalid response from server.</div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
