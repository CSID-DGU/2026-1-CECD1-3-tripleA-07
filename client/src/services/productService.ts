import { request } from './api';
import { Product } from '@/types/product';

export type SortType = 'CREATED_AT_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC' | 'QUANTITY_DESC';

// Swagger에 맞춘 응답 타입 (페이징 데이터)
export interface PageProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
}

export const productService = {
  // 목록 조회 (페이징/검색 지원)
  getProducts: (keyword?: string, page: number = 0, size: number = 20, sort: SortType = 'CREATED_AT_DESC') => {
    const params = new URLSearchParams({ sort, page: String(page), size: String(size) });
    if (keyword) params.set('keyword', keyword);
    return request<PageProductResponse>(`/api/v1/products?${params}`);
  },
  
  createProduct: (product: Omit<Product, 'id'>) => 
    request('/api/v1/products', { method: 'POST', body: JSON.stringify(product) }),
  
  updateProduct: (id: number, product: Omit<Product, 'id'>) =>
    request(`/api/v1/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  
  deleteProduct: (id: number) => 
    request(`/api/v1/products/${id}`, { method: 'DELETE' }),
};
