// src/services/category.ts

import type { CategoryChildItem } from '@/types/category'
import { http } from '@/utils/http'

/**
 * 分类列表-小程序
 */
export const getCategoryTopAPI = () => {
  return http<CategoryChildItem[]>({
    method: 'GET',
    url: '/category/top',
  })
}
