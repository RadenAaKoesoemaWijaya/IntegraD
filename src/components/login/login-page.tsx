'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import { useToast } from '@/hooks/use-toast';
import { Header } from '../common/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Locale } from '@/i18n-config';

type LoginPageProps = {
    dictionary: any;
    lang: Locale;
};

export function LoginPage({ dictionary, lang }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaValue) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please complete the captcha.",
        });
      return;
    }
    
    // On successful login, redirect to the dashboard with the current language
    router.push(`/${lang}`);

  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header dictionary={dictionary} lang={lang} />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-muted/40">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                                onChange={handleCaptchaChange}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    </div>
  );
};
