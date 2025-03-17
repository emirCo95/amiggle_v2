'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import axios from 'axios';

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [error, setError] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setForm((prev) => ({ ...prev, termsAccepted: !prev.termsAccepted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.termsAccepted) {
      setError('You must accept the terms and policies');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        email: form.email,
        password: form.password,
      });

      if (!res.data) throw new Error('Registration failed');

      alert('Please login to continue!');
      router.push('/login');
    } catch (err) {
      console.log(err);
      setError('Registration failed. Please try again.');
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
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="pb-2" htmlFor="confirmPassword">
            Confirm Password
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={form.termsAccepted}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="terms">
            I accept the{' '}
            <a href="/terms" className="text-blue-600">
              Terms & Policies
            </a>
          </Label>
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
