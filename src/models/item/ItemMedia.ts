import { MediaType } from '../media/MediaType';

import { ExtractorAudio } from '../media/ExtractorAudio';
import { ExtractorVideo } from '../media/ExtractorVideo';
import { RawAudio } from '../media/RawAudio';
import { RawVideo } from '../media/RawVideo';

export interface ItemMedia {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  releaseDate?: string;
  duration?: number;
  rating?: number;
  filler?: boolean;
  type: MediaType;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  fileType?: string;
  headers?: Record<string, string>;
  sources: (ExtractorVideo | RawVideo | ExtractorAudio | RawAudio)[];
}
