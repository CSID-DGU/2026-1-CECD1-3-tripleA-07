import { request } from './api';
import { Ad } from '@/types/ad';

export const adService = {
  getAds: (productId?: number) => {
    const params = productId !== undefined ? `?productId=${productId}` : '';
    return request<Ad[]>(`/api/v1/advertisements${params}`);
  },
};
