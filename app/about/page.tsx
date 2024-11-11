import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4'>
      <div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md'>
        <h1 className='mb-4 text-3xl font-bold text-green-800'>
          About Food Sharing App
        </h1>
        <p className='mb-4'>
          Food Sharing App is a platform dedicated to reducing food waste and
          helping those in need. Our mission is to connect people with excess
          food to those who can use it, creating a more sustainable and caring
          community.
        </p>
        <h2 className='mb-2 text-2xl font-semibold text-green-700'>
          How It Works
        </h2>
        <ul className='mb-4 list-inside list-disc'>
          <li>Suppliers can list their excess food items</li>
          <li>Those in need can browse available food in their area</li>
          <li>Users can arrange pickup or delivery of food items</li>
          <li>Together, we reduce food waste and help our community</li>
        </ul>
        <h2 className='mb-2 text-2xl font-semibold text-green-700'>
          Our Values
        </h2>
        <ul className='mb-4 list-inside list-disc'>
          <li>Sustainability: Reducing food waste for a better environment</li>
          <li>Community: Bringing people together to help each other</li>
          <li>
            Accessibility: Making food available to those who need it most
          </li>
          <li>Transparency: Building trust through open communication</li>
        </ul>
        <p className='mb-4'>
          Join us in our mission to create a world where no food goes to waste
          and everyone has access to nutritious meals.
        </p>
        <Link href='/'>
          <Button className='bg-green-500 text-white hover:bg-green-600'>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
