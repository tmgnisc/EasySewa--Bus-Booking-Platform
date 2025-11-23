import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Bus, Loader2, Upload, X } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'owner',
  });
  const [busPhoto, setBusPhoto] = useState<File | null>(null);
  const [busDocument, setBusDocument] = useState<File | null>(null);
  const [busPhotoPreview, setBusPhotoPreview] = useState<string | null>(null);
  const [busDocumentPreview, setBusDocumentPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (type === 'photo') {
      setBusPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBusDocument(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: 'photo' | 'document') => {
    if (type === 'photo') {
      setBusPhoto(null);
      setBusPhotoPreview(null);
    } else {
      setBusDocument(null);
      setBusDocumentPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Validate bus owner files
    if (formData.role === 'owner') {
      if (!busPhoto || !busDocument) {
        toast.error('Please upload both bus photo and bus document');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Create FormData
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('password', formData.password);
      submitFormData.append('role', formData.role);

      // Add files for bus owners
      if (formData.role === 'owner') {
        if (busPhoto) submitFormData.append('busPhoto', busPhoto);
        if (busDocument) submitFormData.append('busDocument', busDocument);
      }

      const result = await signup(submitFormData);

      if (result.success) {
        toast.success(result.message || 'Account created successfully!');
        
        // Small delay to show success message
        setTimeout(() => {
          // Navigate based on role
          if (formData.role === 'owner') {
            // Bus owners need to verify email and wait for approval
            toast.info('Please check your email to verify your account. After verification, wait for admin approval.');
            navigate('/login');
          } else {
            // Customers can login immediately
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        toast.error(result.message || 'Failed to create account');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Sign up to start booking bus tickets</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Fill in your details to create an account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value: 'user' | 'owner') => {
                      setFormData({ ...formData, role: value });
                      // Clear files when switching roles
                      if (value === 'user') {
                        setBusPhoto(null);
                        setBusDocument(null);
                        setBusPhotoPreview(null);
                        setBusDocumentPreview(null);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="font-normal cursor-pointer">
                        Customer - Book bus tickets
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owner" id="owner" />
                      <Label htmlFor="owner" className="font-normal cursor-pointer">
                        Bus Owner - Manage buses and schedules
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Bus Owner Document Upload */}
                {formData.role === 'owner' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="busPhoto">Bus Photo *</Label>
                      {busPhotoPreview ? (
                        <div className="relative">
                          <img
                            src={busPhotoPreview}
                            alt="Bus photo preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('photo')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                          <label
                            htmlFor="busPhoto"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload bus photo
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 5MB
                            </span>
                            <input
                              id="busPhoto"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'photo')}
                              required={formData.role === 'owner'}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="busDocument">Bus Document (License/Registration) *</Label>
                      {busDocumentPreview ? (
                        <div className="relative">
                          <img
                            src={busDocumentPreview}
                            alt="Bus document preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('document')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                          <label
                            htmlFor="busDocument"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload bus document
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 5MB
                            </span>
                            <input
                              id="busDocument"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'document')}
                              required={formData.role === 'owner'}
                            />
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Upload a clear photo of your bus license or registration document
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
