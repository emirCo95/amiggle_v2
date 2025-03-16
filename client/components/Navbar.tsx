'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import LogoutButton from './auth/LogoutButton';

import logo from '@/public/logo.png';
import Image from 'next/image';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <Image src={logo} alt="logo" width={50} height={50} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-gray-600">
              Dashboard
            </Link>
          )}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden md:flex space-x-4">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="md:hidden" variant="ghost">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetTitle>Menu</SheetTitle>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-lg" onClick={() => setOpen(false)}>
                Home
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-lg"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="mt-4">
                {user ? (
                  <Button onClick={logout} variant="outline" className="w-full">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full mb-2">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
