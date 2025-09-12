import { MediaType } from './MediaType';

export interface RawVideo {
  type: MediaType.RawVideo;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  fileType?: string;
  headers?: Record<string, string>;
}
