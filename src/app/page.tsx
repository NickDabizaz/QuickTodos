'use client';

import LandingPage from '@/components/LandingPage'
import { TodoProvider } from '@/contexts/TodoContext'

export default function Home() {
  return (
    <TodoProvider roomId={null}>
      <LandingPage />
    </TodoProvider>
  )
}
