import { request } from './api';
import { AdHistory } from '@/types/history';

export const historyService = {
  getHistories: (productId?: number) => {
    const params = productId !== undefined ? `?productId=${productId}` : '';
    return request<AdHistory[]>(`/api/v1/advertisements${params}`);
  },
};
