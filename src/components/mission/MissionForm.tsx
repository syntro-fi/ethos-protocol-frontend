'use client';

import EligibilityModal from '@/components/EligibilityModal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const SCHEMA = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
});

type MissionFormProps = {
  initialData?: z.infer<typeof SCHEMA>;
  onSubmit: (data: z.infer<typeof SCHEMA>) => void;
  isLoading?: boolean;
};

export default function MissionForm({
  initialData,
  onSubmit,
  isLoading = false,
}: MissionFormProps) {
  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: initialData || {
      title: '',
      description: '',
      deadline: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter mission title"
                  {...field}
                  className="focus-visible:ring-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Statement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the mission objectives..."
                  className="min-h-[120px] focus-visible:ring-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex gap-4">
            <FormLabel className="flex-1">Deadline</FormLabel>
            <FormLabel className="flex-1">Eligibility Criteria</FormLabel>
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild={true}>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                        initialFocus={true}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex-1">
              <EligibilityModal />
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Create Mission'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
