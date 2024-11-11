import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-4">About Food Sharing App</h1>
        <p className="mb-4">
          Food Sharing App is a platform dedicated to reducing food waste and helping those in need. 
          Our mission is to connect people with excess food to those who can use it, creating a more 
          sustainable and caring community.
        </p>
        <h2 className="text-2xl font-semibold text-green-700 mb-2">How It Works</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Suppliers can list their excess food items</li>
          <li>Those in need can browse available food in their area</li>
          <li>Users can arrange pickup or delivery of food items</li>
          <li>Together, we reduce food waste and help our community</li>
        </ul>
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Our Values</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Sustainability: Reducing food waste for a better environment</li>
          <li>Community: Bringing people together to help each other</li>
          <li>Accessibility: Making food available to those who need it most</li>
          <li>Transparency: Building trust through open communication</li>
        </ul>
        <p className="mb-4">
          Join us in our mission to create a world where no food goes to waste and everyone has access to nutritious meals.
        </p>
        <Link href="/">
          <Button className="bg-green-500 text-white hover:bg-green-600">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}