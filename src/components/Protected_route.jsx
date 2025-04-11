import { useUser } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

const Protected_route = ({children}) => {
  const {isSignedIn , user , isLoaded} = useUser()
  const { pathname } = useLocation()

  if(isLoaded && !isSignedIn) {
    return <Navigate to="/?signIn=true" />
  }

  if(user!== undefined && !user?.unsafeMetadata?.role && pathname !== '/onboarding') {
   return <Navigate to="/onboarding" />
  }

  return (
    children
  )
}

export default Protected_route
