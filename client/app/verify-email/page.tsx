'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying...');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setMessage('Invalid verification link.');
        return;
      }

      const res = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await res.json();
      setMessage(data.message || 'Something went wrong.');
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}
