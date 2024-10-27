import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface SignInButtonProps {
  className?: string;
}

export function SignInButton({ className }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUrl = window.location.origin;
      const tenant = '2d18ad4c-992d-4d33-9b1a-7ebc31269f89';
      const authEndpoint = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`;
      
      const params = new URLSearchParams({
        client_id: '04b07795-8ddb-461a-bbee-02f9e1bf7b46',
        response_type: 'code',
        redirect_uri: currentUrl,
        scope: 'https://management.azure.com/.default offline_access',
        response_mode: 'fragment',
      });

      window.location.href = `${authEndpoint}?${params.toString()}`;
      
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Failed to connect to Azure. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end p-4">
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSignIn}
        disabled={isLoading}
        variant="default"
        className={`bg-[#0078D4] hover:bg-[#0078D4] text-white ${className}`}
      >
        {isLoading ? 'SIGNING IN...' : 'SIGN IN WITH AZURE'}
      </Button>
    </div>
  );
}

export default SignInButton;
