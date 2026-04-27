import { z } from 'zod';

import { newOrganizationPostingSchema } from '../../../server/src/db/tables';

const isDateBeforeToday = (dateValue: string) => {
  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return false;

  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return selectedDate.getTime() < localToday.getTime();
};

export const organizationPostingFormSchema = newOrganizationPostingSchema
  .omit({
    crisis_id: true,
    latitude: true,
    longitude: true,
    start_date: true,
    start_time: true,
    end_date: true,
    end_time: true,
    is_closed: true,
    allows_partial_attendance: true,
  })
  .extend({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_date: z.string().min(1, 'End date is required'),
    end_time: z.string().min(1, 'End time is required'),
    max_volunteers: z.string().optional(),
    minimum_age: z.string().optional(),
    automatic_acceptance: z.boolean(),
    allows_partial_attendance: z.boolean().optional(),
  })
  .refine(data => !isDateBeforeToday(data.start_date), {
    message: 'Start date cannot be in the past',
    path: ['start_date'],
  });

export type OrganizationPostingFormData = z.infer<typeof organizationPostingFormSchema>;

export const organizationPostingEditFormSchema = newOrganizationPostingSchema
  .omit({
    crisis_id: true,
    latitude: true,
    longitude: true,
    start_date: true,
    start_time: true,
    end_date: true,
    end_time: true,
  })
  .extend({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_date: z.string().min(1, 'End date is required'),
    end_time: z.string().min(1, 'End time is required'),
    max_volunteers: z.string().optional(),
    minimum_age: z.string().optional(),
    automatic_acceptance: z.boolean(),
    allows_partial_attendance: z.boolean().optional(),
    is_closed: z.boolean(),
  })
  .refine(data => !isDateBeforeToday(data.start_date), {
    message: 'Start date cannot be in the past',
    path: ['start_date'],
  });

export type OrganizationPostingEditFormData = z.infer<typeof organizationPostingEditFormSchema>;
