import { LoopsClient } from "loops";

export const getLoops = (env: Env) => new LoopsClient(env.LOOPS_API_KEY);
