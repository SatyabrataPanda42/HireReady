import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

  const page = async () => {
    const user = await getCurrentUser();
    if (!user?.id) {
          return <p>Error: User ID is missing. Please sign in again.</p>;
        }
    return (
      <>
          <h3>Interview Generation</h3>
          <Agent userName={user?.name} userId={user?.id} type="generate"/>
      </>
    )
  }

export default page


// const page = async () => {
//   const user = await getCurrentUser();

//   if (!user?.id) {
//     return <p>Error: User ID is missing. Please sign in again.</p>;
//   }

//   return (
//     <>
//         <h3>Interview Generation</h3>
//         <Agent userName={user?.name} userId={user?.id} type="generate"/>
//     </>
//   );
// };
