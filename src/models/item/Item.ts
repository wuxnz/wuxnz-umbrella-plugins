import { Source } from '../source/Source';

export interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  url: string;
  source: Plugin;
}
