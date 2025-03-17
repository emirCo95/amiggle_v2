'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(email, password);
      await login(email, password);
      router.push('/');
    } catch (err) {
      console.log(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {error && <p className="text-red-500 pb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="pb-2" htmlFor="email">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label className="pb-2" htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="">
          <p>
            Don&apos;t have an account?{' '}
            <Link className="text-blue-600" href="/register">
              Register
            </Link>
          </p>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
