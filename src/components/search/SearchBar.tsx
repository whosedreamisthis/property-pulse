const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "Studio",
  "Condo",
  "House",
  "Cabin or Cottage",
  "Loft",
  "Room",
  "Other",
];

export default function SearchBar() {
  return (
    <div
      role="search"
      className="flex w-full max-w-2xl flex-col gap-3 md:flex-row md:items-center"
    >
      <label htmlFor="location" className="sr-only">
        Location
      </label>
      <input
        id="location"
        type="text"
        placeholder="Enter Location (City, State, Zip, etc)"
        className="w-full rounded-lg bg-white px-4 py-3 text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 md:w-3/5"
      />

      <label htmlFor="property-type" className="sr-only">
        Property Type
      </label>
      <select
        id="property-type"
        defaultValue="All"
        className="w-full rounded-lg bg-white px-4 py-3 text-gray-950 focus:outline-none focus:ring-2 focus:ring-primary-500 md:w-2/5"
      >
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="w-full rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600 md:w-auto"
      >
        Search
      </button>
    </div>
  );
}
