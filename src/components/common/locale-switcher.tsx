'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, type Locale } from '@/i18n-config';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LocaleSwitcher() {
  const pathName = usePathname();

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const currentLocale = pathName.split('/')[1] as Locale;
  const nextLocale = currentLocale === 'id' ? 'en' : 'id';

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href={redirectedPathName(nextLocale)}>
        <Globe className="h-5 w-5" />
        <span className="sr-only">Switch to {nextLocale === 'en' ? 'English' : 'Indonesian'}</span>
      </Link>
    </Button>
  );
}
