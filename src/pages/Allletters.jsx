import React, { useEffect } from 'react'
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
import { DeleteXIcon } from '../assets/HeroIcons'

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
      if (apiCall === 'time' && search !== '') {
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

  useEffect(() => {
    setSearch('')
    setLetterNoSearch('')
    setFromDepartment('')
    setToDepartment('')
    setUser('')
  }, [apiCall])

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

  const { data: letterByNo } = useQuery({
    queryKey: ['letters', jwtToken, letterNoSearch],
    queryFn: () => getLetterByNumber(letterNoSearch, jwtToken),
    enabled: !!letterNoSearch,
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

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setPageNumber(0)
  }

  const customSelectStyles = {
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: '#4a5568',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: 'rgb(66, 153, 225)',
      borderWidth: '2px',
      borderRadius: '30px',
      transition: 'border-color 0.2s ease',
      backgroundColor: '#FEF08A',
      '&:hover': {
        borderColor: 'rgb(29, 78, 216)',
      },
    }),
  }

  return (
    <div className="mb-4 ml-6 mr-5 mt-4 flex-grow rounded-2xl border-2 border-darkblue-900 bg-gradient-to-r from-gray-300 to-gray-100 py-2 shadow-lg">
      <div className="mb-1 flex items-center justify-center gap-5 border-b-2 border-gray-300 pb-1">
        <div className="ml-2 flex items-center justify-center rounded-lg border border-gray-500 bg-white px-2 py-2">
          <span className="text-darkblue-400">Axtarış növü:</span>
          <select
            value={apiCall}
            onChange={handleApiChange}
            className="ml-1 rounded-lg border border-gray-500 bg-yellow-200 px-2 text-darkblue-400"
          >
            <option value="number">Məktubun &#8470;-si</option>
            <option value="time">Tarix</option>
            <option value="from">Haradan</option>
            <option value="to">Hara</option>
            <option value="created by">Müəllif</option>
          </select>
        </div>
        {apiCall === 'number' && (
          <div className="ml-2 flex items-center justify-center rounded-lg border border-gray-500 bg-white px-2 py-2">
            <span className="text-darkblue-400">Məktublar:</span>
            <input
              type="number"
              value={letterNoSearch}
              placeholder="0"
              onChange={(e) => {
                setLetterNoSearch(e.target.value.replace(/\D/g, ''))
              }}
              className="ml-2 rounded-lg border border-gray-500 bg-yellow-200 pl-2 text-darkblue-400"
            />
            <button
              onClick={() => setLetterNoSearch('')}
              className="ml-4 rounded-lg border border-gray-500 bg-red-500 px-2 text-white"
            >
              <DeleteXIcon />
            </button>
          </div>
        )}
        {apiCall === 'time' && (
          <div className="ml-2 flex items-center justify-center rounded-lg border border-gray-500 bg-white px-2 py-2">
            <span className="text-darkblue-400">Tarix:</span>
            <input type="date" value={search} placeholder="search" onChange={handleSearchİnputChange} />
            <button
              onClick={() => setSearch('')}
              className="ml-4 rounded-lg border border-gray-500 bg-red-500 px-2 text-white"
            >
              <DeleteXIcon />
            </button>
          </div>
        )}
        {apiCall === 'from' && (
          <div className="ml-2 flex items-center justify-center rounded-md">
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
              placeholder="Haradan"
              styles={customSelectStyles}
            />
            <button
              onClick={() => {
                setFromDepartment(null)
                setSearch('')
              }}
              className="text-md ml-2 rounded-[20px] border-2 border-darkblue-400 bg-red-500 px-1 py-1 text-white"
            >
              <DeleteXIcon />
            </button>
          </div>
        )}
        {apiCall === 'to' && (
          <div className="ml-2 flex items-center justify-center rounded-md">
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
              placeholder="Hara"
              styles={customSelectStyles}
            />
            <button
              onClick={() => {
                setToDepartment(null)
                setSearch('')
              }}
              className="text-md ml-2 rounded-[20px] border-2 border-darkblue-400 bg-red-500 px-1 py-1 text-white"
            >
              <DeleteXIcon />
            </button>
          </div>
        )}
        {apiCall === 'created by' && (
          <div className="ml-2 flex items-center justify-center rounded-md">
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
              placeholder="Müəllif"
              styles={customSelectStyles}
            />
            <button
              onClick={() => {
                setUser(null)
                setSearch('')
              }}
              className="text-md ml-2 rounded-[20px] border-2 border-darkblue-400 bg-red-500 px-1 py-1 text-white"
            >
              <DeleteXIcon />
            </button>
          </div>
        )}
        <div className="ml-2 flex items-center justify-center rounded-lg border border-gray-500 bg-white px-2 py-2">
          <span className="text-darkblue-400">Sırala:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="ml-1 rounded-lg border border-gray-500  bg-yellow-200 px-2 text-darkblue-400"
          >
            <option value="letterNo">Məktubun &#8470;-si</option>
            <option value="date">Tarix</option>
          </select>
        </div>
      </div>
      <div className="min-h-[37rem] bg-white">
        <table className="max-h-60 w-full border-collapse overflow-y-scroll bg-white font-sans">
          <thead>
            <tr className="bg-yellow-200">
              <th className="border border-gray-400 px-2 py-1">Məktubun &#8470;</th>
              <th className="border border-gray-400 px-2 py-1">Haradan</th>
              <th className="border border-gray-400 px-2 py-1">Hara</th>
              <th className="border border-gray-400 px-2 py-1">Mühümlük</th>
              <th className="border border-gray-400 px-1 py-0">Müəllif</th>
              <th className="border border-gray-400 px-2 py-1">Tarix</th>
              <th className="border border-gray-400 px-2 py-1">Qeyd</th>
            </tr>
          </thead>
          <tbody>
            {!letterNoSearch &&
              letters?.content?.length &&
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
              ))}
            {!isLoading && !letterNoSearch && !letters?.content?.length && (
              <tr>
                <td>Tapilmadi</td>
              </tr>
            )}
            {letterNoSearch && letterByNo?.letterNo && (
              <tr>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.letterNo}</td>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.fromDepartment.name}</td>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.toDepartment.name}</td>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.importanceDegree.name}</td>
                <td className="cursor-pointer border border-gray-400 px-1 py-0">
                  {letterByNo.createdBy.firstName} {letterByNo.createdBy.lastName}{' '}
                  {letterByNo.createdBy.fatherName}
                </td>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.date}</td>
                <td className="border border-gray-400 px-1 py-0">{letterByNo.note}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center gap-4 border-t-2 border-gray-500 pt-1">
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
        </select>
        <button
          onClick={handleNextPage}
          className="focus:shadow-outline rounded bg-blue-800 px-2 py-1 font-bold text-white hover:bg-blue-900 focus:outline-none"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AllLetters
