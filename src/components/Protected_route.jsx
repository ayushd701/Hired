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

  // if(user.unsafeMetadata.role === "candidate" && pathname === '/post-job') {
  //   return <Navigate to="/jobs" />
  // }

  // if(user.unsafeMetadata.role === "recruiter" && pathname === '/jobs') {
  //   return <Navigate to="/post-job" />
  // }

  return (
    children
  )
}

export default Protected_route
