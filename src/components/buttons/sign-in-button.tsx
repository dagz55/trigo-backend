import React, { useState } from 'react';
import { signIn } from '@/lib/auth';
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
      console.log('Starting Azure CLI sign-in process...');
      const result = await signIn();
      
      if (result.success) {
        console.log('Successfully signed in via Azure CLI');
        // You might want to trigger a state update or redirect here
      }
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
        className={`bg-[#0078D4] hover:bg-[#0078D4] text-white ${className} relative`}
      >
        {isLoading ? (
          <>
            <span className="opacity-0">SIGN IN WITH AZURE</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          </>
        ) : (
          'SIGN IN WITH AZURE'
        )}
      </Button>
    </div>
  );
}

export default SignInButton;
