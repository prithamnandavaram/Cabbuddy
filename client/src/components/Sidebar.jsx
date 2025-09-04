import React from 'react'
import { IndianRupee, Clock, Hourglass } from 'lucide-react'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Checkbox } from './ui/checkbox'

const Sidebar = ({ onChange, selectedSort = 'Earliest Departure', selectedDeparture = [] }) => {
  const sortBy = [
    { 
      icon: <IndianRupee size={16} />,
      title: "Earliest Departure", 
    },
    {
      icon: <Clock size={16} />,
      title: "Price"
    },
    {
      icon: <Hourglass size={16} />,
      title: "Shortest ride"
    },
  ]
  const departureTime= [
    {
      name: "departure_before_six_am",
      title: "Before 6:00"
    },
    {
      name: "departure_six_to_noon",
      title: "6:00 - 12:00"
    },
    {
      name: "departure_noon_to_six",
      title: "12:00 - 18:00"
    },
  ]
  
  // Local state for UI
  const [sort, setSort] = React.useState(selectedSort);
  const [departure, setDeparture] = React.useState(selectedDeparture);

  // Handle sort change
  const handleSortChange = (value) => {
    setSort(value);
    if (onChange) onChange({ sort: value, departure });
  };
  // Handle departure filter change
  const handleDepartureChange = (name) => {
    let updated = departure.includes(name)
      ? departure.filter((d) => d !== name)
      : [...departure, name];
    setDeparture(updated);
    if (onChange) onChange({ sort, departure: updated });
  };
  // Clear filter
  const handleClear = () => {
    setSort('Earliest Departure');
    setDeparture([]);
    if (onChange) onChange({ sort: 'Earliest Departure', departure: [] });
  };

  return (
    <aside className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 px-4 text-lg font-semibold">Sort by</h2>
          <span className="mb-2 px-4 text-sm text-primary text-right underline cursor-pointer" onClick={handleClear}>Clear Filter</span>
        </div>
        <RadioGroup value={sort} onValueChange={handleSortChange}>
          {sortBy.map(s => 
            <Label key={s.title} htmlFor={s.title} className="flex gap-2 items-center justify-between rounded-md bg-popover p-4 hover:bg-accent hover:text-accent-foreground">
              {s.icon}
              {s.title}
              <RadioGroupItem value={s.title} className="ml-auto" id={s.title} />
            </Label>
          )}
        </RadioGroup>
      </div>

      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Departure time</h2>
        {departureTime.map(d => 
          <Label key={d.title} htmlFor={d.name} aria-label={d.name} className="flex gap-2 items-center justify-between rounded-md bg-popover p-4 hover:bg-accent hover:text-accent-foreground">
            {d.title}
            <Checkbox name={d.name} id={d.name} checked={departure.includes(d.name)} onCheckedChange={() => handleDepartureChange(d.name)} />
          </Label>
        )}
      </div>
    </aside>
  )
}

export default Sidebar