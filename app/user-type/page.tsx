'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function UserTypeSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleSelection = async (type: 'SUPPLIER' | 'SEEKER') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/type', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: type }),
      });

      if (response.ok) {
        await update({
          ...session,
          user: { ...session?.user, userType: type },
        });
        toast({ title: `You are now a ${type.toLowerCase()}` });
        router.push(type === 'SUPPLIER' ? '/add-dish' : '/feed');
      } else {
        throw new Error('Failed to update user type');
      }
    } catch (error: any) {
      toast({
        title: 'Error updating user type',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-800">
            Select User Type
          </CardTitle>
          <CardDescription className="text-center">
            Are you a food supplier or a food seeker?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => handleSelection('SUPPLIER')}
            disabled={isLoading}
          >
            Food Supplier
          </Button>
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleSelection('SEEKER')}
            disabled={isLoading}
          >
            Food Seeker
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
