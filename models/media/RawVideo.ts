import { MediaType } from "./MediaType";

import { Subtitle } from "./Subtitle";

export interface RawVideo {
  type: MediaType.RawVideo;
  url: string;
  name: string;
  language?: string;
  iconUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  fileType?: string;
  headers?: Record<string, string>;
  subtitles?: Subtitle[];
  isM3U8?: boolean;
}
