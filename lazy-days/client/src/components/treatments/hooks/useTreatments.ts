import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const { data, isLoading, error } = useQuery(
    queryKeys.treatments,
    getTreatments,
  );
  console.log('useTreatments: ', data);
  if (isLoading) {
    return [];
  }

  if (error) {
    return [];
  }
  return data;
}
