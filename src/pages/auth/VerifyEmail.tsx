import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Bus, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        const response = await api.auth.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        toast.success('Email verified successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may be invalid or expired.');
        toast.error(error.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Bus className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EasySewa
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Email Verification</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verifying Your Email</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {status === 'loading' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Verifying your email...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mb-4" />
                  <p className="text-lg font-medium text-center mb-2">Email Verified!</p>
                  <p className="text-sm text-muted-foreground text-center">{message}</p>
                  <p className="text-xs text-muted-foreground mt-4">Redirecting to login...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <XCircle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-lg font-medium text-center mb-2">Verification Failed</p>
                  <p className="text-sm text-muted-foreground text-center">{message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {status === 'error' && (
                <>
                  <Link to="/login" className="w-full">
                    <Button className="w-full">Go to Login</Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Sign Up Again</Button>
                  </Link>
                </>
              )}
              {status === 'success' && (
                <Link to="/login" className="w-full">
                  <Button className="w-full">Continue to Login</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyEmail;

