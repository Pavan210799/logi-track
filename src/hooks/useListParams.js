import { useSearchParams } from 'react-router-dom'

// Keeps the list settings in the address bar, like ?page=2&status=available&view=5
// so a reload (or a shared link) opens the page exactly as it was
function useListParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Change one or more values, e.g. setParams({ page: 2 }). null or '' removes a value
  function setParams(changes) {
    // Start from the address bar, so two changes in a row both stick
    const params = new URLSearchParams(window.location.search)

    Object.keys(changes).forEach(function (key) {
      const value = changes[key]
      // Default values are left out to keep the address short
      const isDefault = value === null || value === '' || value === 'all' || (key === 'page' && value === 1)
      if (isDefault) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    setSearchParams(params, { replace: true })
  }

  // Any other value, like getParam('city'), or '' when it is not set
  function getParam(name) {
    return searchParams.get(name) || ''
  }

  return {
    getParam: getParam,
    search: searchParams.get('search') || '',
    statusFilter: searchParams.get('status') || 'all',
    page: Number(searchParams.get('page')) || 1,
    viewingId: Number(searchParams.get('view')) || null,
    editingId: Number(searchParams.get('edit')) || null,
    isAdding: searchParams.get('add') === 'true',
    setParams: setParams,
  }
}

export default useListParams
