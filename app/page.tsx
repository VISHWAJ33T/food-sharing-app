import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-bold text-green-800 md:text-5xl">
          Welcome to Food Sharing App
        </h1>
        <p className="mb-8 text-lg text-green-700 md:text-xl">
          Connect with your community, share excess food, and reduce waste
          together.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/login">
            <Button className="w-full bg-green-500 px-8 py-3 text-lg text-white hover:bg-green-600 sm:w-auto">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="w-full bg-blue-500 px-8 py-3 text-lg text-white hover:bg-blue-600 sm:w-auto">
              Register
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              className="w-full border-green-500 px-8 py-3 text-lg text-green-700 hover:bg-green-100 sm:w-auto"
            >
              About Us
            </Button>
          </Link>
        </div>
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold text-green-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-green-700">
                Share
              </h3>
              <p className="text-gray-600">
                List your excess food for others in need.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-green-700">
                Connect
              </h3>
              <p className="text-gray-600">
                Match with people who can use your extra food.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-green-700">
                Reduce Waste
              </h3>
              <p className="text-gray-600">
                Help the environment by reducing food waste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
