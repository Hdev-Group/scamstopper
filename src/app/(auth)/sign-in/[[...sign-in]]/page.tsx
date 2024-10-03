import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className='w-full h-full flex justify-center items-center'>
        <SignIn />
      </div>
    </main>
  )
}