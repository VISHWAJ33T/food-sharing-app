'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface UserProfile {
  name: string;
  email: string;
  address: string;
  phone: string;
  userType: 'SUPPLIER' | 'SEEKER';
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({ title: 'Failed to fetch profile', variant: 'destructive' });
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast({ title: 'Profile updated successfully' });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    }
  };

  if (!profile) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select
              value={profile.userType}
              onValueChange={(value) => setProfile({ ...profile, userType: value as 'SUPPLIER' | 'SEEKER' })}
              required
            >
              <SelectTrigger className="w-full p-2 border rounded">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPPLIER">SUPPLIER</SelectItem>
                <SelectItem value="SEEKER">SEEKER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Update Profile
          </Button>
          <Button type="button" className="w-full" onClick={() => signOut()}>
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}