import api from './api';
import { Product } from '@/types/product';

// Swagger에 맞춘 응답 타입 (페이징 데이터)
export interface PageProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
}

export const productService = {
  // 목록 조회 (페이징/검색 지원)
  getProducts: (keyword?: string, page: number = 0, size: number = 20) => 
    api.get<PageProductResponse>('/api/v1/products', { params: { keyword, page, size } }),
  
  // 개별 상세 조회 (필요 시 구현)
  getProductById: (id: number) => api.get<Product>(`/api/v1/products/${id}`),
  
  createProduct: (product: Omit<Product, 'id'>) => api.post('/api/v1/products', product),
  
  updateProduct: (id: number, product: Omit<Product, 'id' | 'imageUrl'>) => api.put(`/api/v1/products/${id}`, product),
  
  deleteProduct: (id: number) => api.delete(`/api/v1/products/${id}`),
};
