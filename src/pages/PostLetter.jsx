import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLetter, getAllDegrees, getAllDepartments } from '../api/axiosApi'
import Select from 'react-select'
import toast from 'react-hot-toast'
import '../styles/tailwind.css'

const PostLetter = () => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const { jwtToken } = auth || null

  const [letterNo, setLetterNo] = useState('')
  const [fromDepartment, setFromDepartment] = useState(null)
  const [toDepartment, setToDepartment] = useState(null)
  const [degree, setDegree] = useState(null)
  const [envelope, setEnvelope] = useState({ value: '1', label: 1 })
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  const createLetterMutation = useMutation({
    mutationFn: (letterData) => createLetter(letterData, jwtToken),
    onSuccess: () => {
      toast.success('Məktub uğurla əlavə olundu', { duration: 1000 })
      queryClient.invalidateQueries('letterData')
    },
    onError: (error) => {
      setError(error)
    },
  })

  const { data: departments } = useQuery({
    queryKey: ['departments', jwtToken],
    queryFn: () => getAllDepartments(jwtToken),
    enabled: !!jwtToken,
    staleTime: 1000 * 60 * 5,
  })

  const { data: degrees } = useQuery({
    queryKey: ['degrees', jwtToken],
    queryFn: () => getAllDegrees(jwtToken),
    enabled: !!jwtToken,
    staleTime: 1000 * 60 * 5,
  })

  const resetForm = () => {
    setLetterNo('')
    setDate('')
    setNote('')
    setEnvelope({ value: '1', label: 1 })
    setFromDepartment(null)
    setToDepartment(null)
    setDegree(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const letterData = {
      letterNo,
      fromDepartment: {
        id: Number(fromDepartment.value),
      },
      toDepartment: {
        id: Number(toDepartment.value),
      },
      importanceDegree: {
        id: Number(degree.value),
      },
      envelope: Number(envelope),
      date,
      note,
    }
    createLetterMutation.mutate(letterData)
    resetForm()
    console.log('success')
  }

  const customSelectStyles = {
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: 'black',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: 'rgb(66, 153, 225)',
      borderWidth: '2px',
      borderRadius: '30px',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: 'rgb(29, 78, 216)',
      },
    }),
  }

  return (
    <>
      <div className="w-300 mb-4 ml-6 mt-4 rounded-2xl border-2 border-solid border-darkblue-800 bg-gradient-to-r from-gray-300 to-gray-100 px-6 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label>
            <span className="font-bold">Məktub &#8470;:</span>
            <input
              className="input-style"
              type="number"
              value={letterNo}
              onChange={(e) => {
                const enteredValue = e.target.value
                const onlyNumbers = enteredValue.replace(/[^0-9]/g, '') //
                setLetterNo(onlyNumbers)
              }}
              required
            />
          </label>
          <label>
            <span className="font-bold">Haradan:</span>
            <Select
              value={fromDepartment}
              onChange={setFromDepartment}
              options={departments?.map((department) => ({ value: department.id, label: department.name }))}
              required
              placeholder="Haradan"
              noOptionsMessage={() => 'Yanlış seçim'}
              styles={customSelectStyles}
            />
          </label>
          <label>
            <span className="font-bold">Hara:</span>
            <Select
              value={toDepartment}
              onChange={setToDepartment}
              options={departments?.map((department) => ({ value: department.id, label: department.name }))}
              required
              placeholder="Hara"
              noOptionsMessage={() => 'Yanlış seçim'}
              styles={customSelectStyles}
            />
          </label>
          <label>
            <span className="font-bold">Mühümlük dərəcəsi:</span>
            <Select
              value={degree}
              onChange={setDegree}
              options={degrees?.map((degree) => ({ value: degree.id, label: degree.name }))}
              required
              placeholder="Mühümlük"
              noOptionsMessage={() => 'Yanlış seçim'}
              styles={customSelectStyles}
            />
          </label>
          <label>
            <span className="font-bold">Paket:</span>
            <Select
              value={envelope}
              onChange={setEnvelope}
              options={[
                { value: '1', label: 1 },
                { value: '2', label: 2 },
                { value: '3', label: 3 },
              ]}
              required
              placeholder="Paket"
              noOptionsMessage={() => 'Yanlış seçim'}
              styles={customSelectStyles}
            />
          </label>
          <label>
            <span className="font-bold">Tarix:</span>
            <input
              className="input-style"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            <span className="font-bold">Qeydlər:</span>
            <textarea
              className="input-style"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={7}
            />
          </label>
          <button
            className="w-24 rounded-lg bg-red-500 px-4 py-2 text-lg text-white hover:bg-red-600"
            type="submit"
          >
            Təsdiqlə
          </button>
        </form>
      </div>
    </>
  )
}

export default PostLetter
