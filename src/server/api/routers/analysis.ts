import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { InitPrompt } from "@/utils/prompt";
import { CreateChatCompletionResponse } from "openai";

const PromtResponseSchema = z.array(z.object({
    emotion: z.string(),
    associatedText: z.string()
  }))

type PromptResponseType = z.infer<typeof PromtResponseSchema>;

export type AnalysisResponseType = {
  rawPromptResponse: CreateChatCompletionResponse,
  parsedPromptResponse: PromptResponseType,
}

export const analysisRouter = createTRPCRouter({
  analyse: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {

      const response = await ctx.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `${InitPrompt}  ${input.text}`
        }]
      })

      console.log(`{analysis: ${response.data.choices[0]?.message?.content ?? "[]"}}`);

      let promptResponse : PromptResponseType = []
      try {
        promptResponse = PromtResponseSchema.parse(
          JSON.parse(response.data.choices[0]?.message?.content ?? "[]")
          );
      } catch (error) {
        console.log(error.message);
      }

      return {
        rawPromptResponse: response.data,
        parsedPromptResponse: promptResponse
      };
    }),
});
