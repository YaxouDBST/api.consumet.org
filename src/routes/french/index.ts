import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // French scanlation providers metadata
  const frenchProviders: any[] = [
    {
      name: 'AstralManga',
      url: 'https://astral-manga.fr',
      type: 'Madara',
      description: 'French manga scans'
    },
    {
      name: 'LelManga',
      url: 'https://lelmanga.com',
      type: 'MangaReader',
      description: 'French manga reader'
    },
    {
      name: 'MangaScantrad',
      url: 'https://mangascantrad.com',
      type: 'Madara',
      description: 'French manga scanlation'
    },
    {
      name: 'MangasOrigines',
      url: 'https://mangas-origines.fr',
      type: 'Madara',
      description: 'French manga origins'
    },
    {
      name: 'PantheonScan',
      url: 'https://pantheonscan.it',
      type: 'Madara',
      description: 'Pantheon scan group'
    },
    {
      name: 'PhenixScans',
      url: 'https://phenixscans.com',
      type: 'Madara',
      description: 'Phoenix scans group'
    },
    {
      name: 'SushiScan',
      url: 'https://sushiscan.su',
      type: 'Madara',
      description: 'Sushi scans community'
    },
    {
      name: 'SushiScans',
      url: 'https://sushiscans.com',
      type: 'Madara',
      description: 'Sushi scans alternative'
    }
  ];

  // Welcome message with provider list
  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send({
      message: 'Welcome to Consumet French Manga APIs',
      providers: frenchProviders,
      note: 'These are French scanlation groups. Use the main /manga routes with these providers.',
      usage: 'POST to /manga/search or call individual provider endpoints from /manga routes',
    });
  });
};

export default routes;
