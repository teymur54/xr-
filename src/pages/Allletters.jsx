import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  getAllLetters,
  getLetterByNumber,
  getLettersByDate,
  getLettersCreatedBy,
  getLettersFrom,
  getLettersTo,
} from '../api/axiosApi'
import useDebounce from '../hooks/useDebounce'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const AllLetters = () => {
  const { auth } = useAuth()
  const { jwtToken } = auth || null
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortBy, setSortBy] = useState('letterNo')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [apiCall, setApiCall] = useState('')

  const {
    isSuccess,
    isLoading,
    isError,
    data: letters,
  } = useQuery({
    queryKey: ['lettersData', pageSize, pageNumber, sortBy, debouncedSearch, apiCall],
    queryFn: () => {
      if (apiCall === 'number') {
        return getLetterByNumber(search, jwtToken)
      } else if (apiCall === 'time') {
        return getLettersByDate(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'from') {
        return getLettersFrom(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'to') {
        return getLettersTo(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'created by') {
        return getLettersCreatedBy(search, pageSize, pageNumber, sortBy, jwtToken)
      } else {
        return getAllLetters(jwtToken, pageSize, pageNumber, sortBy)
      }
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!jwtToken,
  })

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1)
    }
  }

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPageNumber(0)
  }

  const handleNextPage = () => {
    if (!letters.last) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1)
    }
  }

  const handleSearchİnputChange = (e) => {
    const value = e.target.value
    const sanitizedValue = value.replace(/[^\w\dƏəХх-]/g, '')
    setSearch(sanitizedValue)
  }

  const handleApiChange = (e) => {
    const selectedValue = e.target.value
    setApiCall(selectedValue)
  }

  return (
    <div className="mb-4 ml-6 mr-5 mt-4 flex-grow rounded-2xl border border-gray-500 bg-gradient-to-r from-gray-100 to-gray-50 p-5">
      <div className="mb-1 border-b-2 border-gray-300 pb-1">
        <button
          onClick={handlePreviousPage}
          className="focus:shadow-outline rounded bg-blue-800 px-2 py-1 font-bold text-white hover:bg-blue-900 focus:outline-none"
        >
          Previous
        </button>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="rounded border border-gray-300 bg-white px-0 py-1 focus:border-blue-500 focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
        <button
          onClick={handleNextPage}
          className="focus:shadow-outline rounded bg-blue-800 px-2 py-1 font-bold text-white hover:bg-blue-900 focus:outline-none"
        >
          Next
        </button>
        Search type:
        <select value={apiCall} onChange={handleApiChange}>
          <option value="">No search</option>
          <option value="number">Based on letters number</option>
          <option value="time">Based on time</option>
          <option value="from">Based on From</option>
          <option value="to">Based on To</option>
          <option value="created by">Based on created By</option>
        </select>
        Search:
        <input type="text" value={search} placeholder="search" onChange={handleSearchİnputChange} />
      </div>

      <table className="max-h-60 w-full overflow-y-scroll bg-white font-sans">
        <thead>
          <tr className="bg-yellow-200">
            <th className="border border-gray-400 px-2 py-1">Məktubun &#8470;</th>
            <th className="border border-gray-400 px-2 py-1">Haradan</th>
            <th className="border border-gray-400 px-2 py-1">Hara</th>
            <th className="border border-gray-400 px-2 py-1">Mühümlük</th>
            <th className="border border-gray-400 px-2 py-1">Paket</th>
            <th className="border border-gray-400 px-1 py-0">Müəllif</th>
            <th className="border border-gray-400 px-2 py-1">Tarix</th>
            <th className="border border-gray-400 px-2 py-1">Qeyd</th>
          </tr>
        </thead>
        <tbody>
          {letters && letters?.content?.length > 0 ? (
            letters?.content?.map((letter, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-1 py-0">{letter.letterNo}</td>
                <td className="border border-gray-400 px-1 py-0">{letter.fromDepartment.name}</td>
                <td className="border border-gray-400 px-1 py-0">{letter.toDepartment.name}</td>
                <td className="border border-gray-400 px-1 py-0">{letter.importanceDegree}</td>
                <td className="border border-gray-400 px-1 py-0">{letter.envelope}</td>
                <td className="cursor-pointer border border-gray-400 px-1 py-0">
                  {letter.createdBy.firstName} {letter.createdBy.lastName}
                </td>
                <td className="border border-gray-400 px-1 py-0">{letter.date}</td>
                <td className="border border-gray-400 px-1 py-0">{letter.note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AllLetters
