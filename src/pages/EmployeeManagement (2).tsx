<select
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="border rounded px-3 py-2"
  aria-label="Employee status filter"
  title="Employee status filter"
>
  <option value="all">All Status</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
  <option value="terminated">Terminated</option>
  <option value="on-leave">On Leave</option>
</select> 