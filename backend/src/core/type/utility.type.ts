export type Dto<T> = Omit<T, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;