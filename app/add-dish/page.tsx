'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

export default function AddDish() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useDefaultAddress, setUseDefaultAddress] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { data: session } = useSession()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setImageFile(file)
      } else {
        toast({
          title: 'Please select a JPEG or PNG image',
          variant: 'destructive'
        })
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    if (imageFile) {
      formData.append('image', imageFile)
    }
    formData.append(
      'pickupAddress',
      useDefaultAddress
        ? (session?.user as any)?.address
        : (formData.get('pickupAddress') as string)
    )
    formData.append('supplierId', (session?.user as any)?.id)

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        toast({ title: 'Dish added successfully!' })
        router.push('/feed')
      } else {
        throw new Error('Failed to add dish')
      }
    } catch (error) {
      toast({ title: 'Error adding dish', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4 pb-20'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md'
      >
        <h2 className='mb-6 text-center text-2xl font-bold text-green-800'>
          Add a Dish
        </h2>

        <div className='space-y-2'>
          <Label htmlFor='name'>Food Name</Label>
          <Input id='name' name='name' required />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='servings'>Number of People it Can Feed</Label>
          <Input id='servings' name='servings' type='number' min='1' required />
        </div>

        <div className='space-y-2'>
          <Label>Type</Label>
          <RadioGroup defaultValue='VEG' name='type'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem
                value='VEG'
                id='veg'
                className='border-green-500 text-green-500'
              />
              <Label htmlFor='veg' className='text-green-700'>
                Vegetarian
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='NON_VEG' id='non-veg' />
              <Label htmlFor='non-veg'>Non-Vegetarian</Label>
            </div>
          </RadioGroup>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea id='description' name='description' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='image'>Dish Image (optional)</Label>
          <Input
            id='image'
            name='image'
            type='file'
            accept='image/jpeg,image/png'
            onChange={handleImageChange}
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='useDefaultAddress'
              checked={useDefaultAddress}
              onCheckedChange={checked =>
                setUseDefaultAddress(checked as boolean)
              }
            />
            <Label htmlFor='useDefaultAddress'>Use default address</Label>
          </div>
        </div>

        {!useDefaultAddress && (
          <div className='space-y-2'>
            <Label htmlFor='pickupAddress'>Pickup Address</Label>
            <Textarea id='pickupAddress' name='pickupAddress' />
          </div>
        )}

        <Button
          type='submit'
          className='w-full bg-green-500 text-white hover:bg-green-600'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Dish'}
        </Button>
      </form>
    </div>
  )
}
