import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
          Welcome to Food Sharing App
        </h1>
        <p className="text-lg md:text-xl text-green-700 mb-8">
          Connect with your community, share excess food, and reduce waste together.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/login">
            <Button className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600 text-lg px-8 py-3">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 text-lg px-8 py-3">
              Register
            </Button>
          </Link>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Share</h3>
              <p className="text-gray-600">List your excess food for others in need.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Connect</h3>
              <p className="text-gray-600">Match with people who can use your extra food.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Reduce Waste</h3>
              <p className="text-gray-600">Help the environment by reducing food waste.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}