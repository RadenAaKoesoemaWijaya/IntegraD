'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '../dashboard/icons';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { User, Settings } from 'lucide-react';

const profileFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
  emailNotifications: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfilePage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: 'Budi Santoso',
      email: 'budi.santoso@example.com',
      bio: 'Health data analyst with a passion for public health informatics.',
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated.',
    });
    console.log(data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
       <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">SehatData</h1>
        </div>
        <nav className="ml-4 hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/upload" className="hover:text-foreground transition-colors">Data Management</Link>
            <Link href="/search" className="hover:text-foreground transition-colors">Pencarian Data</Link>
            <Link href="/profile" className="text-primary font-semibold">Profile</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Admin Settings</span>
                </Link>
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">User Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" {...register('bio')} placeholder="Tell us a little about yourself" />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password. Please enter your current password to set a new one.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" {...register('currentPassword')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...register('newPassword')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications from us.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email.</p>
                  </div>
                  <Switch id="emailNotifications" {...register('emailNotifications')} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get critical alerts on your phone.</p>
                    </div>
                  <Switch id="smsNotifications" {...register('smsNotifications')} />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
