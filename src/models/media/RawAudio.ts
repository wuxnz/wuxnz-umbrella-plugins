import { MediaType } from './MediaType';

export interface RawAudio {
  type: MediaType.RawAudio;
  url: string;
  fileType?: string;
  headers?: Record<string, string>;
}
