import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  getAllLetters,
  getAllUsers,
  getLetterByNumber,
  getLettersByDate,
  getLettersCreatedBy,
  getLettersFrom,
  getLettersTo,
} from '../api/axiosApi'
import useDebounce from '../hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import Select from 'react-select'

const AllLetters = () => {
  const { auth } = useAuth()
  const { jwtToken } = auth || null
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortBy, setSortBy] = useState('letterNo')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [apiCall, setApiCall] = useState('number')
  const [fromDepartment, setFromDepartment] = useState(null)
  const [toDepartment, setToDepartment] = useState(null)
  const [user, setUser] = useState(null)
  const [letterNoSearch, setLetterNoSearch] = useState(false)

  const {
    isSuccess,
    isLoading,
    isError,
    data: letters,
  } = useQuery({
    queryKey: ['lettersData', pageSize, pageNumber, sortBy, debouncedSearch, apiCall],
    queryFn: () => {
      if (apiCall === 'number' && search !== '') {
        return getLetterByNumber(search, jwtToken)
      } else if (apiCall === 'time' && search !== '') {
        return getLettersByDate(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'from' && search !== '') {
        return getLettersFrom(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'to' && search !== '') {
        return getLettersTo(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'created by' && search !== '') {
        return getLettersCreatedBy(search, pageSize, pageNumber, sortBy, jwtToken)
      } else {
        return getAllLetters(jwtToken, pageSize, pageNumber, sortBy)
      }
    },
    staleTime: 1000 * 60 * 3,
    enabled: !!jwtToken,
  })

  const { data: departments } = useQuery({
    queryKey: ['departments', jwtToken],
    queryFn: () => getAllDepartments(jwtToken),
    enabled: !!jwtToken,
    staleTime: 1000 * 60 * 5,
  })

  const { data: users } = useQuery({
    queryKey: ['users', jwtToken],
    queryFn: () => getAllUsers(jwtToken),
    enabled: !!jwtToken,
    staleTime: 1000 * 60 * 5,
  })

  const departmentOptions = departments?.map((department) => ({
    value: department.name,
    label: department.name,
  }))

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} ${user.fatherName}`,
  }))

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
    const sanitizedValue = value.replace(/[^\w\dƏəХх-\s]/g, '')
    setSearch(sanitizedValue)
  }

  const handleApiChange = (e) => {
    const selectedValue = e.target.value
    setApiCall(selectedValue)
  }

  return (
    <div className="mb-4 ml-6 mr-5 mt-4 flex-grow rounded-2xl border-2 border-darkblue-900 bg-gradient-to-r from-gray-300 to-gray-100 py-5 shadow-lg">
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
          <option value="number">Based on letters number</option>
          <option value="time">Based on time</option>
          <option value="from">Based on From</option>
          <option value="to">Based on To</option>
          <option value="created by">Based on created By</option>
        </select>
        {apiCall === 'number' && (
          <span>
            Letters &#8470;
            <input type="number" value={search} placeholder="search" onChange={handleSearchİnputChange} />
            <button onClick={() => setSearch('')}>Clear</button>
          </span>
        )}
        {apiCall === 'time' && (
          <span>
            Tarix:
            <input type="date" value={search} placeholder="search" onChange={handleSearchİnputChange} />
            <button onClick={() => setSearch('')}>Clear</button>
          </span>
        )}
        {apiCall === 'from' && (
          <span>
            <Select
              options={departmentOptions}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setFromDepartment(selectedOption.value)
                  setSearch(selectedOption.value)
                } else {
                  setFromDepartment(null)
                  setSearch('')
                }
              }}
              value={fromDepartment ? { value: fromDepartment, label: fromDepartment } : null}
              placeholder="Select department"
            />
            <button
              onClick={() => {
                setFromDepartment(null)
                setSearch('')
              }}
            >
              Clear
            </button>
          </span>
        )}
        {apiCall === 'to' && (
          <span>
            <Select
              options={departmentOptions}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setToDepartment(selectedOption.value)
                  setSearch(selectedOption.value)
                } else {
                  setToDepartment(null)
                  setSearch('')
                }
              }}
              value={toDepartment ? { value: toDepartment, label: toDepartment } : null}
              placeholder="Select department"
            />
            <button
              onClick={() => {
                setToDepartment(null)
                setSearch('')
              }}
            >
              Clear
            </button>
          </span>
        )}
        {apiCall === 'created by' && (
          <span>
            <Select
              options={userOptions}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setUser(selectedOption.label)
                  setSearch(`${selectedOption.label}`)
                } else {
                  setUser(null)
                  setSearch('')
                }
              }}
              value={user ? { value: user, label: user } : null}
              placeholder="Select user"
            />
            <button
              onClick={() => {
                setUser(null)
                setSearch('')
              }}
            >
              Clear
            </button>
          </span>
        )}
      </div>

      <table className="max-h-60 w-full border-collapse overflow-y-scroll bg-white font-sans">
        <thead>
          <tr className="bg-yellow-200">
            <th className="w-[9%] border border-gray-400 px-2 py-1">Məktubun &#8470;</th>
            <th className="w-[6%] border border-gray-400 px-2 py-1">Haradan</th>
            <th className="w-[6%] border border-gray-400 px-2 py-1">Hara</th>
            <th className="w-[8%] border border-gray-400 px-2 py-1">Mühümlük</th>
            <th className="w-[16%] border border-gray-400 px-1 py-0">Müəllif</th>
            <th className="w-[8%] border border-gray-400 px-2 py-1">Tarix</th>
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
                <td className="border border-gray-400 px-1 py-0">{letter.importanceDegree.name}</td>
                <td className="cursor-pointer border border-gray-400 px-1 py-0">
                  {letter.createdBy.firstName} {letter.createdBy.lastName} {letter.createdBy.fatherName}
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
