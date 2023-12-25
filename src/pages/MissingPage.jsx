import { useNavigate } from 'react-router-dom'

const MissingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-grow flex-col items-center">
      <p className="mt-12 text-center text-3xl">404 not found - Bu səhifəyə mövcud deyil</p>
      <button className="btn mt-7 px-8 py-2" onClick={() => navigate('/')}>
        Əsas səhifəyə qayıt
      </button>
    </div>
  )
}
export default MissingPage
