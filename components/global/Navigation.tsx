'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Menu, X, Home, PlusCircle, List, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const isSupplier = (session?.user as any)?.userType === 'SUPPLIER';

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    ...(isSupplier
      ? [
          { href: '/add-dish', label: 'Add Dish', icon: PlusCircle },
          { href: '/my-dishes', label: 'My Dishes', icon: List },
        ]
      : []),
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center justify-between bg-white p-4 shadow-md md:flex">
        <Link href="/feed" className="text-2xl font-bold text-green-600">
          Food Sharing
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white p-2 shadow-md md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-green-600"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button (now hidden) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 hidden rounded-full"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[300px]">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-lg font-medium"
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}