'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

interface Dish {
  id: string;
  name: string;
  servings: number;
  type: 'VEG' | 'NON_VEG';
  description: string;
  imageUrl: string | null;
}

export default function EditDish({ params }: { params: { id: string } }) {
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/api/dishes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDish(data);
        } else {
          throw new Error('Failed to fetch dish');
        }
      } catch (error) {
        console.error('Error fetching dish:', error);
        toast({ title: 'Failed to fetch dish', variant: 'destructive' });
      }
    };

    if ((session?.user as any)?.userType === 'SUPPLIER') {
      fetchDish();
    }
  }, [params.id, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dish) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', dish?.name);
    formData.append('servings', dish?.servings.toString());
    formData.append('type', dish?.type);
    formData.append('description', dish?.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`/api/dishes/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({ title: 'Dish updated successfully' });
        router.push('/my-dishes');
      } else {
        throw new Error('Failed to update dish');
      }
    } catch (error) {
      console.error('Error updating dish:', error);
      toast({ title: 'Failed to update dish', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  if (!dish) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Edit Dish</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Dish Name</Label>
            <Input
              id="name"
              value={dish?.name}
              onChange={(e) => setDish({ ...dish, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              value={dish?.servings}
              onChange={(e) =>
                setDish({ ...dish, servings: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label>Type</Label>
            <RadioGroup
              value={dish?.type}
              onValueChange={(value) =>
                setDish({ ...dish, type: value as 'VEG' | 'NON_VEG' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="VEG"
                  id="veg"
                  className="border-green-500 text-green-500"
                />
                <Label htmlFor="veg" className="text-green-700">
                  Vegetarian
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NON_VEG" id="non-veg" />
                <Label htmlFor="non-veg">Non-Vegetarian</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={dish?.description}
              onChange={(e) =>
                setDish({ ...dish, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Dish Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {dish?.imageUrl && (
            <div className="mt-2">
              <Label>Current Image</Label>
              <Image
                src={dish?.imageUrl}
                alt="Current dish image"
                width={200}
                height={200}
                className="mt-1 rounded-md"
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Dish'}
          </Button>
        </form>
      </div>
    </div>
  );
}
