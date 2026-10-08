import { useState } from 'react'
import { scrollToTop } from '../utils/scroll.js'
import { skeletonTime, wait } from '../utils/wait.js'

function buildDraft(filterNames, getParam) {
  const draft = {}
  filterNames.forEach(function (name) {
    draft[name] = getParam(name) || ''
  })
  return draft
}

// Filter dropdowns edit draft values; Apply filters writes them to the URL and shows a short skeleton
function usePendingFilters(filterNames, getParam, setParams, refreshData, options) {
  const resetPage = options?.resetPage !== false

  const [draft, setDraft] = useState(function () {
    return buildDraft(filterNames, getParam)
  })
  const [filterLoading, setFilterLoading] = useState(false)

  const appliedKey = filterNames
    .map(function (name) {
      return getParam(name)
    })
    .join('\n')
  const [lastAppliedKey, setLastAppliedKey] = useState(appliedKey)

  // Reset the dropdowns when the applied filters change elsewhere, like a summary card click
  if (appliedKey !== lastAppliedKey) {
    setLastAppliedKey(appliedKey)
    setDraft(buildDraft(filterNames, getParam))
  }

  function setDraftFilter(name, value) {
    setDraft(function (prev) {
      const next = { ...prev }
      next[name] = value || ''
      return next
    })
  }

  async function applyFilters() {
    setFilterLoading(true)
    scrollToTop(true)
    const changes = {}
    if (resetPage) {
      changes.page = 1
    }
    filterNames.forEach(function (name) {
      changes[name] = draft[name] || null
    })
    setParams(changes)
    try {
      const minimumWait = wait(skeletonTime)
      if (refreshData) {
        await refreshData()
      }
      await minimumWait
    } finally {
      setFilterLoading(false)
    }
  }

  async function clearAppliedFilters() {
    const empty = {}
    filterNames.forEach(function (name) {
      empty[name] = ''
    })
    setDraft(empty)
    setFilterLoading(true)
    scrollToTop(true)
    const changes = {}
    if (resetPage) {
      changes.page = 1
    }
    filterNames.forEach(function (name) {
      changes[name] = null
    })
    setParams(changes)
    try {
      const minimumWait = wait(skeletonTime)
      if (refreshData) {
        await refreshData()
      }
      await minimumWait
    } finally {
      setFilterLoading(false)
    }
  }

  return {
    draft: draft,
    setDraftFilter: setDraftFilter,
    applyFilters: applyFilters,
    clearAppliedFilters: clearAppliedFilters,
    filterLoading: filterLoading,
  }
}

export default usePendingFilters
