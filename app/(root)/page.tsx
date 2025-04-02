import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InterviewCard from '../../components/InterviewCard'
import {dummyInterviews} from "../../constants/index";


function page() {
  return (
    <>
    <section className='card-cta'>
      <div className='flex flex-col gap-6 max-w-lg'>
        <h2>Ace Your Next Interview with HIREREADY!
        Smart, Fast, and Personalized Interview Preparation.</h2>
        <p>HireReady is an AI-powered interview preparation platform that helps job seekers practice and prepare 
          for interviews with personalized feedback and insights.</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
      </div>
      <Image src="/robot.png" alt="robot" width={500} height={500} className='max-sm:hidden' />
    </section>
    <section className='flex flex-col gap-6 mt-8'>
      <h2>
        Your Interviews
      </h2>
      <div className='interviews-section'>
        {dummyInterviews.map((interview) => (
          <InterviewCard {...interview} key = {interview.id}/>
        ))}
      </div>
    </section>
    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className='interviews-section'>
      {dummyInterviews.map((interview) => (
          <InterviewCard {...interview} key = {interview.id}/>
        ))}
        {/* <p>You haven't taken any interview</p> */}
      </div>
    </section>
    </>
  )
}

export default page