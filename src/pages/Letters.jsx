import React, { useState } from 'react'
import PostLetter from './PostLetter'
import AllLetters from './Allletters'
import { FaCommentAlt } from 'react-icons/fa'

const Letters = () => {
  const [showPost, setShowPost] = useState('false')

  const togglePost = () => {
    setShowPost(!showPost)
  }
  return (
    <>
      <div className="ml absolute left-0 -ml-8 mt-6">
        <button onClick={togglePost} className="w-20 rotate-90 transform">
          <div className="flex items-center justify-between rounded-tr-2xl bg-gray-200 px-2 pb-1 pt-0.5">
            Yarat
            <FaCommentAlt />
          </div>
        </button>
      </div>
      <div className="flex w-full">
        {showPost && <PostLetter />}
        <AllLetters />
      </div>
    </>
  )
}

export default Letters
