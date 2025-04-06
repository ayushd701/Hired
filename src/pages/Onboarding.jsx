import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from "react-spinners"
import {Button} from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
  const {user , isLoaded} = useUser()
  const navigate = useNavigate()
  console.log(user)

  const handleRoleSelection = async (role) => {
    await user.update({
      unsafeMetadata : {role}
    }).then(() => {
      navigate(role === "candidate" ? "/jobs" : "/post-job")
    }).catch((error) => {
      console.error("Error updating role:", error)
    })
  }

  useEffect(() => {
    if(user?.unsafeMetadata?.role) {
      navigate(user.unsafeMetadata.role === "candidate" ? "/jobs" : "/post-job")
    }
  },[user])

  if(!isLoaded) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <BarLoader color="#36d7b7" width={"100%"} className='mb-4' />
      </div>
    )
  }
  return (
    <div className='flex flex-col justify-center items-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter font-sans'>I am a...</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button variant="blue" className="h-36 text-2xl" onClick = {() => handleRoleSelection("candidate")} >Candidate</Button>
        <Button variant="destructive" className="h-36 text-2xl" onClick = {() => handleRoleSelection("recruiter")} >Recruiter</Button>
      </div>
    </div>
  )
}

export default Onboarding
