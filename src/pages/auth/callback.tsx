import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // If there's an error in the URL, don't try to get the session
        if (error) {
          logger.error('Auth callback error', { error, errorDescription });
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          logger.error('Error getting session', { error: sessionError });
          navigate('/auth/signin');
          return;
        }

        if (session) {
          logger.info('Successfully authenticated', { userId: session.user.id });
          navigate('/dashboard');
        } else {
          logger.warn('No session found after callback');
          navigate('/auth/signin');
        }
      } catch (error) {
        logger.error('Error in auth callback', { error });
        navigate('/auth/signin');
      }
    };

    handleAuthCallback();
  }, [navigate, error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {errorDescription || 'Authentication failed. Please try again.'}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/auth/signin')}>
              Back to Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth/signup')}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing sign in...</h1>
        <p className="text-muted-foreground">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
} 