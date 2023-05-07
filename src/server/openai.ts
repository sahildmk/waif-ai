import { env } from "@/env.mjs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: env.OPENAI_API_ORG_ID,
    apiKey: env.OPENAI_API_KEY,
});

const globalForOpenAi = globalThis as unknown as {
    openai: OpenAIApi | undefined;
};

export const openai =
    globalForOpenAi.openai ??
    new OpenAIApi(configuration);

if (env.NODE_ENV !== "production") globalForOpenAi.openai = openai;
