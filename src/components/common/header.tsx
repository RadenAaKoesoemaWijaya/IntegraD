
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Settings, LogIn } from 'lucide-react';
import { Logo } from '../dashboard/icons';
import LocaleSwitcher from './locale-switcher';

type HeaderProps = {
  dictionary: any;
  lang: string;
};

export function Header({ dictionary, lang }: HeaderProps) {
    const pathname = usePathname();

    const navLinks = [
        { href: `/${lang}`, label: dictionary.navigation.dashboard, path: '' },
        { href: `/${lang}/upload`, label: dictionary.navigation.dataManagement, path: '/upload' },
        { href: `/${lang}/search`, label: dictionary.navigation.dataSearch, path: '/search' },
        { href: `/${lang}/monitoring`, label: dictionary.navigation.monitoring, path: '/monitoring' },
        { href: `/${lang}/reporting`, label: dictionary.navigation.reporting, path: '/reporting' },
        { href: `/${lang}/surveillance`, label: dictionary.navigation.surveillance, path: '/surveillance' },
    ];
    
    // Don't show the full header on the login page
    const isLoginPage = pathname.includes('/login');

    const checkActivePath = (currentPath: string, linkPath: string) => {
        if (linkPath === '') return currentPath === `/${lang}`;
        return currentPath.startsWith(`/${lang}${linkPath}`);
    };

    return (
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6 no-print">
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">{dictionary.appName}</h1>
            </div>
            {!isLoginPage && (
                 <nav className="ml-4 hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={
                                checkActivePath(pathname, link.path)
                                    ? 'text-primary font-semibold'
                                    : 'hover:text-foreground transition-colors'
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            )}
            <div className="ml-auto flex items-center gap-2">
                <LocaleSwitcher />
                {!isLoginPage ? (
                    <>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/${lang}/profile`}>
                                <User className="h-5 w-5" />
                                <span className="sr-only">Profile</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/${lang}/admin`}>
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </Button>
                    </>
                ) : (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${lang}/login`}>
                            <LogIn className="h-5 w-5" />
                            <span className="sr-only">Login</span>
                        </Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
