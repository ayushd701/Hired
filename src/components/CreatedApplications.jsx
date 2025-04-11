import { getApplications } from '@/api/apiapplications'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import ApplicationCard from './ApplicationCard'
import { BarLoader } from 'react-spinners'

const CreatedApplications = () => {
  const {isLoaded , user} = useUser()

  const {
    data: dataApplications,
    loading: loadingApplications,
    error: errorApplications,
    fn: fnApplications,
  } = useFetch(getApplications, { user_id: user?.id });

  useEffect(() => {
    fnApplications()
  } , [])

  if (!isLoaded || loadingApplications) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {dataApplications?.map((application) => {
              return <ApplicationCard key={application.id} application={application} isCandidate={application.candidate_id === user?.id}/>
            })}
    </div>
  )
}

export default CreatedApplications
