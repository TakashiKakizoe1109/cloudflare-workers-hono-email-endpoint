import {Hono} from 'hono';
import {bearerAuth} from "hono/bearer-auth";
import {type Env} from "./interface";

export class DIContainer {
  constructor(
    private readonly env: Env,
    private readonly req?: Request,
  ) {
  }

  async cleanup(): Promise<void> {
    // List of methods to be executed at the end of the entire process
  }
}

type Variables = {
  di: DIContainer;
};
export type HonoTypes = {
  Bindings: Env;
  Variables: Variables
};

export const app = new Hono<HonoTypes>();
app.use('*', async (c, next) => {
  const di = new DIContainer(c.env, c.req.raw);
  c.set('di', di);
  const token = c.env.API_TOKEN;
  const auth = bearerAuth({token});
  await auth(c, next)
  if (c.error) {
    // di.logger.write('error', c.error);
  }
  c.executionCtx.waitUntil(di.cleanup());
});