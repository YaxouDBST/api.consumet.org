import axios from 'axios';

export interface Manga {
  id: string;
  title: string;
  image: string;
  url?: string;
  releaseDate?: string;
  headerForImage?: boolean;
}

export interface MangaDetail {
  id: string;
  title: string;
  image: string;
  description: string;
  status?: string;
  genres?: string[];
  chapters?: Array<{
    id: string;
    title: string;
    releaseDate?: string;
  }>;
}

export interface ChapterPage {
  img: string;
  page: number;
  title: string;
}

const BASE_URL = 'http://localhost:3000';
let contentType: 'manga' | 'anime' | 'comics' = 'manga'; // Current content type being browsed

// Set the content type to fetch
export const setContentType = (type: 'manga' | 'anime' | 'comics') => {
  contentType = type;
};

// Get current content type
export const getContentType = () => contentType;

// Get trending content
export const getTrending = async (): Promise<Manga[]> => {
  try {
    let endpoint = '';
    
    if (contentType === 'anime') {
      endpoint = `${BASE_URL}/anime/gogoanime/trending`;
    } else if (contentType === 'comics') {
      endpoint = `${BASE_URL}/comics/getComics/trending`;
    } else {
      endpoint = `${BASE_URL}/manga/mangadex/trending`;
    }
    
    const response = await axios.get(endpoint, { timeout: 15000 });
    const results = response.data.results || response.data || [];
    
    if (!Array.isArray(results)) {
      console.warn('Trending results not an array:', results);
      return [];
    }
    
    return results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      image: item.image || item.cover,
      url: item.url,
      releaseDate: item.releaseDate,
      headerForImage: item.headerForImage,
    })).slice(0, 12);
  } catch (error) {
    console.error(`Error fetching trending ${contentType}:`, error);
    return [];
  }
};

// Get latest content
export const getLatest = async (): Promise<Manga[]> => {
  try {
    let endpoint = '';
    
    if (contentType === 'anime') {
      endpoint = `${BASE_URL}/anime/gogoanime/recent-episodes`;
    } else if (contentType === 'comics') {
      endpoint = `${BASE_URL}/comics/getComics/recent`;
    } else {
      endpoint = `${BASE_URL}/manga/mangadex/recent`;
    }
    
    const response = await axios.get(endpoint, { timeout: 15000 });
    const results = response.data.results || response.data || [];
    
    if (!Array.isArray(results)) {
      console.warn('Latest results not an array:', results);
      return [];
    }
    
    return results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      image: item.image || item.cover,
      url: item.url,
      releaseDate: item.releaseDate,
      headerForImage: item.headerForImage,
    })).slice(0, 12);
  } catch (error) {
    console.error(`Error fetching latest ${contentType}:`, error);
    return [];
  }
};

// Search for content
export const search = async (query: string): Promise<Manga[]> => {
  if (!query.trim()) return [];
  
  try {
    let endpoint = '';
    
    if (contentType === 'anime') {
      endpoint = `${BASE_URL}/anime/gogoanime/${encodeURIComponent(query)}`;
    } else if (contentType === 'comics') {
      endpoint = `${BASE_URL}/comics/getComics/${encodeURIComponent(query)}`;
    } else {
      endpoint = `${BASE_URL}/manga/mangadex/${encodeURIComponent(query)}`;
    }
    
    console.log(`Searching ${contentType} with query: ${query}`);
    console.log(`Endpoint: ${endpoint}`);
    
    const response = await axios.get(endpoint, { timeout: 15000 });
    const results = response.data.results || response.data || [];
    
    console.log(`Search results:`, results);
    
    if (!Array.isArray(results)) {
      console.warn('Search results not an array:', results);
      return [];
    }
    
    return results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      image: item.image || item.cover,
      url: item.url,
      releaseDate: item.releaseDate,
      headerForImage: item.headerForImage,
    }));
  } catch (error) {
    console.error(`Error searching ${contentType}:`, error);
    return [];
  }
};

// Get details for content
export const getDetails = async (contentId: string): Promise<MangaDetail | null> => {
  try {
    let endpoint = '';
    
    if (contentType === 'anime') {
      endpoint = `${BASE_URL}/anime/gogoanime/info?id=${contentId}`;
    } else if (contentType === 'comics') {
      endpoint = `${BASE_URL}/comics/getComics/info?id=${contentId}`;
    } else {
      endpoint = `${BASE_URL}/manga/mangadex/info?id=${contentId}`;
    }
    
    const response = await axios.get(endpoint, { timeout: 15000 });
    return {
      id: response.data.id,
      title: response.data.title || response.data.name,
      image: response.data.image || response.data.cover,
      description: response.data.description || response.data.synopsis || '',
      status: response.data.status,
      genres: response.data.genres,
      chapters: response.data.chapters,
    };
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
};

// Get chapter/episode pages or stream
export const getChapterPages = async (chapterId: string): Promise<ChapterPage[]> => {
  try {
    let endpoint = '';
    
    if (contentType === 'anime') {
      endpoint = `${BASE_URL}/anime/gogoanime/watch?episodeId=${chapterId}`;
    } else if (contentType === 'comics') {
      endpoint = `${BASE_URL}/comics/getComics/read?chapterId=${chapterId}`;
    } else {
      endpoint = `${BASE_URL}/manga/mangadex/read?chapterId=${chapterId}`;
    }
    
    const response = await axios.get(endpoint, { timeout: 15000 });
    return response.data.pages || response.data || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};

// Get available content types
export const getContentTypes = () => {
  return [
    { id: 'manga', label: 'Manga', icon: '📚' },
    { id: 'anime', label: 'Anime', icon: '🎬' },
    { id: 'comics', label: 'Manhuas', icon: '🖼️' },
  ];
};

// Export for backward compatibility
export const mangaAPI = {
  getTrending,
  getLatest,
  search,
  getDetails,
  getChapterPages,
  getContentTypes,
  setContentType,
  getContentType,
};

export default mangaAPI;
