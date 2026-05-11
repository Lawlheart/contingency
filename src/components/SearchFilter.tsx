interface SearchFilterProps {
  searchFilter: string;
  onSearchFilter: (newSearch: string) => void
}

function SearchFilter({onSearchFilter}: SearchFilterProps) {
  return (
    <div className="type-filter flex flex-wrap gap-4 p-4 justify-center bg-red-950 text-white max-w-96 self-center">
      <label className="text-white text-xl text-bold">
        Search: <input type="text" name="searchFilter" className="text-bold" onChange={(e) => onSearchFilter(e.target.value)} />
      </label>
    </div>
  )
}

export default SearchFilter
