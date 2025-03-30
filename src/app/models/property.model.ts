import { User } from './user.model';

export interface Property {
  id?: number;
  title: string;
  description?: string;
  propertyType: string;
  imageUrl?: string;
  originalImageUrl?: string;
  enhancementType?: string;
  enhancementStyle?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
}
