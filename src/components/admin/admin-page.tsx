'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, MoreHorizontal, UserPlus, Loader2, AlertTriangle } from 'lucide-react';
import { User as UserType } from './schema';
import { getUsers } from '@/lib/api';
import { Header } from '../common/header';

type AdminPageProps = {
    dictionary: any;
    lang: string;
};

export function AdminPage({ dictionary, lang }: AdminPageProps) {
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { admin: t } = dictionary;

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError(t.errorLoadUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header dictionary={dictionary} lang={lang} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="text-2xl font-semibold text-foreground/90">{t.title}</h2>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                    <CardTitle>{t.userManagement}</CardTitle>
                    <CardDescription>{t.userManagementDesc}</CardDescription>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t.addUser}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">{t.loadingUsers}</p>
                </div>
              ) : error ? (
                <div className="text-red-600 flex items-center justify-center py-8">
                  <AlertTriangle className="mr-2 h-5 w-5" /> {error}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.name}</TableHead>
                      <TableHead>{t.email}</TableHead>
                      <TableHead>{t.role}</TableHead>
                      <TableHead>{t.status}</TableHead>
                      <TableHead><span className="sr-only">{t.actions}</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.status}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t.edit}</DropdownMenuItem>
                              <DropdownMenuItem>{t.changeRole}</DropdownMenuItem>
                              <DropdownMenuItem>{user.status === 'Active' ? t.deactivate : t.activate}</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">{t.delete}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.systemSettings}</CardTitle>
              <CardDescription>{t.systemSettingsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maintenance-mode">{t.maintenanceMode}</Label>
                <div className="flex items-center space-x-2">
                    <Switch id="maintenance-mode" />
                    <Label htmlFor="maintenance-mode">{t.maintenanceModeDesc}</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">{t.sessionTimeout}</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-region">{t.defaultRegion}</Label>
                <Select defaultValue="Jakarta Pusat">
                  <SelectTrigger id="default-region">
                    <SelectValue placeholder={t.selectDefaultRegion} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jakarta Pusat">{dictionary.regions.pusat}</SelectItem>
                    <SelectItem value="Jakarta Utara">{dictionary.regions.utara}</SelectItem>
                    <SelectItem value="Jakarta Barat">{dictionary.regions.barat}</SelectItem>
                    <SelectItem value="Jakarta Selatan">{dictionary.regions.selatan}</SelectItem>
                    <SelectItem value="Jakarta Timur">{dictionary.regions.timur}</SelectItem>
                    <SelectItem value="Kepulauan Seribu">{dictionary.regions.seribu}</SelectItem>
                    <SelectItem value="All">{dictionary.regions.all}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
