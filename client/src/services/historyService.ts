import { request } from './api';
import { AdHistory } from '@/types/history';

export interface PageHistoryResponse {
  content: AdHistory[];
  totalElements: number;
  totalPages: number;
}

export const historyService = {
  getHistories: (page: number = 0, size: number = 20) => {
    const params = new URLSearchParams({ sort: 'PUBLISHED_AT_DESC', page: String(page), size: String(size) });
    return request<PageHistoryResponse>(`/api/v1/histories?${params}`);
  },
};
