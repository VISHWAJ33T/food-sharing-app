'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ClaimRequest {
  id: string;
  status: string;
  user: {
    name: string;
  };
}

interface Dish {
  id: string;
  name: string;
  claimRequests: ClaimRequest[];
}

export default function ManageClaim({ params }: { params: { id: string } }) {
  const [dish, setDish] = useState<Dish | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if ((session?.user as any)?.userType === 'SUPPLIER') {
      fetchDish();
    }
  }, [session]);

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
      toast({ title: 'Failed to fetch dish details', variant: 'destructive' });
    }
  };

  const handleClaimAction = async (
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    try {
      const response = await fetch(`/api/dishes/${params.id}/claim`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status }),
      });
      if (response.ok) {
        toast({ title: `Claim request ${status.toLowerCase()}` });
        fetchDish(); // Refresh the dish details after action
      } else {
        throw new Error(`Failed to ${status.toLowerCase()} claim request`);
      }
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing claim request:`, error);
      toast({
        title: `Failed to ${status.toLowerCase()} claim request`,
        variant: 'destructive',
      });
    }
  };

  if ((session?.user as any)?.userType !== 'SUPPLIER') {
    return <div className="p-4">You must be a supplier to view this page.</div>;
  }

  if (!dish) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-green-800">
          Manage Claims for {dish.name}
        </h1>
        {dish?.claimRequests?.length === 0 ? (
          <p>No pending claim requests for this dish.</p>
        ) : (
          <div className="space-y-4">
            {dish?.claimRequests.map((request) => (
              <div key={request.id} className="rounded-lg border p-4">
                <p className="mb-2 text-gray-600">
                  Requested by: {request?.user?.name}
                </p>
                <p className="mb-4 text-gray-600">Status: {request?.status}</p>
                {request?.status === 'PENDING' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleClaimAction(request?.id, 'APPROVED')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleClaimAction(request?.id, 'REJECTED')}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={() => router.push(`/dish/${params?.id}`)}
          className="mt-6 w-full"
        >
          Back to Dish Details
        </Button>
      </div>
    </div>
  );
}
