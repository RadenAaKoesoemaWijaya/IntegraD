'use client';

import * as React from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Header } from '../common/header';

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

type ProfilePageProps = {
    dictionary: any;
    lang: string;
};

export function ProfilePage({ dictionary, lang }: ProfilePageProps) {
  const { toast } = useToast();
  const { profile: t } = dictionary;
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
      title: t.updateSuccess,
      description: t.updateSuccessDesc,
    });
    console.log(data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header dictionary={dictionary} lang={lang} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{t.personalInfo}</CardTitle>
                <CardDescription>{t.personalInfoDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="user avatar" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">{t.changePhoto}</Button>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">{t.bio}</Label>
                  <Textarea id="bio" {...register('bio')} placeholder={t.bioPlaceholder} />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t.changePassword}</CardTitle>
                <CardDescription>{t.changePasswordDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">{t.currentPassword}</Label>
                  <Input id="currentPassword" type="password" {...register('currentPassword')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="newPassword">{t.newPassword}</Label>
                  <Input id="newPassword" type="password" {...register('newPassword')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                  <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t.notificationSettings}</CardTitle>
                <CardDescription>{t.notificationSettingsDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="emailNotifications">{t.emailNotifications}</Label>
                    <p className="text-sm text-muted-foreground">{t.emailNotificationsDesc}</p>
                  </div>
                  <Switch id="emailNotifications" {...register('emailNotifications')} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="smsNotifications">{t.smsNotifications}</Label>
                        <p className="text-sm text-muted-foreground">{t.smsNotificationsDesc}</p>
                    </div>
                  <Switch id="smsNotifications" {...register('smsNotifications')} />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">{t.save}</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
