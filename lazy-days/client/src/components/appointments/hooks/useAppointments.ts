// @ts-nocheck
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

// for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

export function useAppointments(): UseAppointments {
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  const [showAll, setShowAll] = useState(false);

  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { month, year } = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery([queryKeys.appointments, year, month], () =>
      getAppointments(year, month),
    );
  }, [monthYear, queryClient]);

  // useQuery call for appointments for the current monthYear
  const { data: appointments = {} } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      staleTime: 2000,
    },
  );

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
