import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'


const Home = () => {
  return (
    <div>
      <Button  ><Link href="/auth/login">Login</Link></Button>
      <Button  ><Link href="/auth/register">Register</Link></Button>
    </div>
  )
}

export default Home

