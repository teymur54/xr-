import axios from 'axios'

const BASE_URL = 'http://10.14.33.78:8080/api'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const signIn = async (credentials) => {
  try {
    const response = await instance.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export const verifyJwt = async (jwt) => {
  try {
    const response = await instance.post('/auth/verify', { jwt })
    return response.data
  } catch (error) {
    console.error('Error verifying JWT:', error)
    throw error
  }
}

export const createLetter = async (letterData, token) => {
  try {
    const response = await instance.post('/v1/letters', letterData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating letter:', error)
    throw error
  }
}

export const getAllDepartments = async (token) => {
  try {
    const response = await instance.get('/v1/departments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw error
  }
}

export const getAllDegrees = async (token) => {
  try {
    const response = await instance.get('/v1/degrees', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching importance degrees:', error)
  }
}

export const getAllLetters = async (token, pageSize = 10, pageNumber = 0, sortBy = 'date') => {
  try {
    const response = await instance.get('/v1/letters', {
      params: {
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letters:', error)
    throw error
  }
}

export const getLetterByNumber = async (letterNumber, token) => {
  try {
    const response = await instance.get(`/v1/letter/no/${letterNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letter by number:', error)
    throw error
  }
}

export const getLettersByDate = async (date, pageSize = 5, pageNumber = 0, sortBy = 'date', token) => {
  try {
    const response = await instance.get('/v1/letters/date', {
      params: {
        date,
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letters by date:', error)
    throw error
  }
}

export const getLettersFrom = async (name, pageSize = 5, pageNumber = 0, sortBy = 'letterNo', token) => {
  try {
    const response = await instance.get('/v1/letters/from', {
      params: {
        name,
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letters from a name:', error)
    throw error
  }
}

export const getLettersTo = async (name, pageSize = 5, pageNumber = 0, sortBy = 'letterNo', token) => {
  try {
    const response = await instance.get('/v1/letters/to', {
      params: {
        name,
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letters to a name:', error)
    throw error
  }
}

export const getLettersCreatedBy = async (
  createdBy,
  pageSize = 5,
  pageNumber = 0,
  sortBy = 'letterNo',
  token
) => {
  try {
    const response = await instance.get('/v1/letters/createdBy', {
      params: {
        createdBy,
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching letters created by a user:', error)
    throw error
  }
}

export const getAllUsers = async (token) => {
  try {
    const response = await instance.get('/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching all users:', error)
    throw error
  }
}
