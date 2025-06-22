import { app } from '@/src/app';

export default {
  fetch: async (request: Request): Promise<Response> =>
    await app.handle(request),
};
