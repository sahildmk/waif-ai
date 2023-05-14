import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ProcessRequestAsync } from "@/utils/process-request";
import { InitPrompt } from "@/utils/prompt";
import { type CreateChatCompletionResponse } from "openai";

const PromtResponseSchema = z.array(
  z.object({
    emotion: z.string(),
    associatedText: z.string(),
  })
);

type PromptResponseType = z.infer<typeof PromtResponseSchema>;

export type AnalysisResponseType = {
  rawPromptResponse: CreateChatCompletionResponse;
  parsedPromptResponse: PromptResponseType;
};

export const analysisRouter = createTRPCRouter({
  analyse: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ProcessRequestAsync(async () => {
        const response = await ctx.openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: InitPrompt(input.text),
            },
          ],
          temperature: 0.2,
        });

        let completion = response.data.choices[0]?.message?.content;

        completion = completion?.replaceAll("'", '"');

        console.log(completion);

        let promptResponse: PromptResponseType = [];
        try {
          promptResponse = PromtResponseSchema.parse(
            JSON.parse(completion ?? "[]")
          );
        } catch (error) {
          console.log((error as Error).message);
        }

        return {
          rawPromptResponse: response.data,
          parsedPromptResponse: promptResponse,
        };
      });
    }),
});
