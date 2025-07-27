'use client';

import * as React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HealthData } from './schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type DataEditorDialogProps = {
  children: React.ReactNode;
  variant: 'add' | 'edit';
  initialData?: Omit<HealthData, 'id'> | HealthData;
  onSave: (data: Omit<HealthData, 'id'> | HealthData) => void;
  dictionary: any;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const formSchema = z.object({
  region: z.string().min(1, { message: 'Region is required.' }),
  month: z.enum(months),
  cases: z.coerce.number().int().positive(),
  vaccinations: z.coerce.number().int().positive(),
  patients: z.coerce.number().int().positive(),
});


export function DataEditorDialog({ children, variant, initialData, onSave, dictionary }: DataEditorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { dataEditor: t } = dictionary;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Omit<HealthData, 'id'>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      region: '',
      month: 'Jan',
      cases: 0,
      vaccinations: 0,
      patients: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || {
        region: '',
        month: 'Jan',
        cases: 0,
        vaccinations: 0,
        patients: 0,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: Omit<HealthData, 'id'>) => {
    if (variant === 'edit' && initialData && 'id' in initialData) {
      onSave({ ...data, id: initialData.id });
    } else {
      onSave(data);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{variant === 'edit' ? t.editTitle : t.addTitle}</DialogTitle>
          <DialogDescription>
            {variant === 'edit' ? t.editDesc : t.addDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">{t.region}</Label>
              <Input id="region" {...register('region')} className="col-span-3" />
              {errors.region && <p className="col-span-4 text-right text-red-500 text-xs">{errors.region.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">{t.month}</Label>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder={t.selectMonth} />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m} value={m}>{dictionary.months[m]}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
              />
              {errors.month && <p className="col-span-4 text-right text-red-500 text-xs">{errors.month.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cases" className="text-right">{t.cases}</Label>
              <Input id="cases" type="number" {...register('cases')} className="col-span-3" />
              {errors.cases && <p className="col-span-4 text-right text-red-500 text-xs">{errors.cases.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vaccinations" className="text-right">{t.vaccinations}</Label>
              <Input id="vaccinations" type="number" {...register('vaccinations')} className="col-span-3" />
              {errors.vaccinations && <p className="col-span-4 text-right text-red-500 text-xs">{errors.vaccinations.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patients" className="text-right">{t.patients}</Label>
              <Input id="patients" type="number" {...register('patients')} className="col-span-3" />
              {errors.patients && <p className="col-span-4 text-right text-red-500 text-xs">{errors.patients.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
