<Input
  placeholder={placeholder}
  value={searchTerm}
  onChange={(e) => onSearchChange(e.target.value)}
  className="pl-10"
  aria-label="Search input"
  title="Search input"
/>

<Select value={filterValue} onValueChange={onFilterChange} aria-label="Filter select" title="Filter select">
  <SelectTrigger title="Filter select">
    <SelectValue placeholder="Filter by..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    {filterOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select> 