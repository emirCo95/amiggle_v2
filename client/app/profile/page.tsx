'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px] h-[30vh] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {user ? (
            <div className="h-full flex flex-col justify-evenly">
              <div className="flex flex-col space-y-4">
                <p className="text-lg flex space-x-2">
                  <strong>Username:</strong>
                  <span>{user.username}</span>
                </p>
                <p className="text-lg flex space-x-2">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </p>
              </div>
              <Button className="w-full">Edit Profile</Button>
            </div>
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
