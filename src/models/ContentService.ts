import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import ExtractorAudio from './media/ExtractorAudio';
import ExtractorVideo from './media/ExtractorVideo';
import RawAudio from './media/RawAudio';
import RawVideo from './media/RawVideo';

abstract class ContentService {
  abstract search(query: string, page?: number): Promise<Category>;
  abstract getCategory(category: string, page?: number): Promise<Category>;
  abstract getHomeCategories(): Promise<Category[]>;
  abstract getItemDetails(id: string): Promise<DetailedItem>;
  abstract getItemMedia(id: string): Promise<(ExtractorAudio | ExtractorVideo | RawAudio | RawVideo)[]>;
}

export default ContentService;
