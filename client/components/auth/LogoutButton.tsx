'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const { logout } = useAuth();

  return <Button onClick={logout}>Logout</Button>;
}
