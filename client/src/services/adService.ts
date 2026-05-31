import { request } from './api';
import { Ad } from '@/types/ad';

export const adService = {
  getAds: (productId?: number) => {
    const params = new URLSearchParams();
    if (productId !== undefined) params.set('productId', String(productId));
    const query = params.toString() ? `?${params}` : '';
    return request<Ad[]>(`/api/v1/advertisements${query}`);
  },
};
