import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA, ANIME } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // ==================== MANGA PROVIDERS ====================
  const mangaProviders: { [key: string]: any } = {
    mangadex: new MANGA.MangaDex(),
    mangakakalot: new MANGA.MangaKakalot(),
    mangahere: new MANGA.MangaHere(),
    mangasee123: new MANGA.Mangasee123(),
    mangapill: new MANGA.MangaPill(),
    managreader: new MANGA.MangaReader(),
    mangapark: new MANGA.Mangapark(),
  };

  // ==================== ANIME PROVIDERS ====================
  const animeProviders: { [key: string]: any } = {
    gogoanime: new ANIME.Gogoanime(),
    zoro: new ANIME.Zoro(),
    anix: new ANIME.Anix(),
    '9anime': new ANIME.NineAnime(),
    animepahe: new ANIME.AnimePahe(),
    bilibili: new ANIME.Bilibili(),
    crunchyroll: new ANIME.Crunchyroll(),
    marin: new ANIME.Marin(),
    anify: new ANIME.Anify(),
    animefox: new ANIME.AnimeFox(),
    animekai: new ANIME.AnimeKai(),
  };

  // ==================== MANGA ENDPOINTS ====================

  // Search manga across all or specified providers
  fastify.get<{ Querystring: { providers?: string; query: string; page?: string } }>(
    '/manga/search',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { providers, query, page } = request.query as {
        providers?: string;
        query: string;
        page?: string;
      };

      if (!query) {
        return reply.status(400).send({ message: 'Query is required' });
      }

      const pageNum = Math.max(1, parseInt(page || '1'));
      const providerList = providers
        ? providers.split(',').filter((p: string) => mangaProviders[p.toLowerCase()])
        : Object.keys(mangaProviders);

      const results: any[] = [];

      for (const provider of providerList) {
        try {
          const manga = mangaProviders[provider];
          if (manga && manga.search) {
            const res = await manga.search(query, pageNum);
            if (res && res.results && Array.isArray(res.results)) {
              res.results.forEach((item: any) => {
                item._provider = provider;
              });
              results.push(...res.results);
            }
          }
        } catch (err) {
          console.error(`Error searching ${provider} for "${query}":`, err);
        }
      }

      return reply.status(200).send({ results: results.slice(0, 50) });
    }
  );

  // Get manga info/details
  fastify.get<{ Params: { provider: string; id: string } }>(
    '/manga/info/:provider/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { provider, id } = request.params as { provider: string; id: string };
      const decodedId = decodeURIComponent(id);

      const providerLower = provider.toLowerCase();

      if (!mangaProviders[providerLower]) {
        return reply.status(404).send({ message: `Provider ${provider} not found` });
      }

      try {
        const manga = mangaProviders[providerLower];
        const res = await manga.fetchMangaInfo(decodedId);
        res._provider = providerLower;
        return reply.status(200).send(res);
      } catch (err: any) {
        console.error(`Error fetching manga info from ${provider}:`, err);
        return reply.status(500).send({ message: err.message || 'Failed to fetch manga info' });
      }
    }
  );

  // Read manga chapter
  fastify.get<{ Params: { provider: string; chapterId: string } }>(
    '/manga/read/:provider/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { provider, chapterId } = request.params as { provider: string; chapterId: string };
      const decodedChapterId = decodeURIComponent(chapterId);

      const providerLower = provider.toLowerCase();

      if (!mangaProviders[providerLower]) {
        return reply.status(404).send({ message: `Provider ${provider} not found` });
      }

      try {
        const manga = mangaProviders[providerLower];
        const res = await manga.fetchChapterPages(decodedChapterId);
        return reply.status(200).send(res);
      } catch (err: any) {
        console.error(`Error fetching chapter from ${provider}:`, err);
        return reply.status(500).send({ message: err.message || 'Failed to fetch chapter' });
      }
    }
  );

  // ==================== ANIME ENDPOINTS ====================

  // Search anime across all or specified providers
  fastify.get<{ Querystring: { providers?: string; query: string; page?: string } }>(
    '/anime/search',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { providers, query, page } = request.query as {
        providers?: string;
        query: string;
        page?: string;
      };

      if (!query) {
        return reply.status(400).send({ message: 'Query is required' });
      }

      const pageNum = Math.max(1, parseInt(page || '1'));
      const providerList = providers
        ? providers.split(',').filter((p: string) => animeProviders[p.toLowerCase()])
        : ['gogoanime', 'zoro', 'anix', '9anime'];

      const results: any[] = [];

      for (const provider of providerList) {
        try {
          const anime = animeProviders[provider];
          if (anime && anime.search) {
            const res = await anime.search(query, pageNum);
            if (res && res.results && Array.isArray(res.results)) {
              res.results.forEach((item: any) => {
                item._provider = provider;
              });
              results.push(...res.results);
            }
          }
        } catch (err) {
          console.error(`Error searching ${provider} for "${query}":`, err);
        }
      }

      return reply.status(200).send({ results: results.slice(0, 50) });
    }
  );

  // Get anime info/details with fallback providers
  fastify.get<{ Params: { provider: string; id: string } }>(
    '/anime/info/:provider/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { provider, id } = request.params as { provider: string; id: string };
      const decodedId = decodeURIComponent(id);

      const providerLower = provider.toLowerCase();
      const fallbackProviders = ['gogoanime', 'zoro', 'anix', '9anime'];
      let tryProviders = [providerLower, ...fallbackProviders.filter((p) => p !== providerLower)];

      for (const tryProvider of tryProviders) {
        if (!animeProviders[tryProvider]) continue;

        try {
          const anime = animeProviders[tryProvider];
          const res = await anime.fetchAnimeInfo(decodedId);
          if (res && (res.title || res.name)) {
            res._provider = tryProvider;
            return reply.status(200).send(res);
          }
        } catch (err: any) {
          console.error(`Error fetching anime info from ${tryProvider}:`, err.message);
        }
      }

      return reply.status(404).send({ message: 'Failed to fetch anime info from any provider' });
    }
  );

  // Watch anime episode with fallback providers
  fastify.get<{ Params: { provider: string; id: string } }>(
    '/anime/watch/:provider/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { provider, id } = request.params as { provider: string; id: string };
      const decodedId = decodeURIComponent(id);

      const providerLower = provider.toLowerCase();
      const fallbackProviders = ['gogoanime', 'zoro', 'anix', '9anime'];
      let tryProviders = [providerLower, ...fallbackProviders.filter((p) => p !== providerLower)];

      for (const tryProvider of tryProviders) {
        if (!animeProviders[tryProvider]) continue;

        try {
          const anime = animeProviders[tryProvider];
          const res = await anime.fetchEpisodeSources(decodedId);
          if (res && res.sources) {
            return reply.status(200).send(res);
          }
        } catch (err: any) {
          console.error(`Error fetching episode from ${tryProvider}:`, err.message);
        }
      }

      return reply.status(404).send({ message: 'Failed to fetch episode from any provider' });
    }
  );
};

export default routes;
