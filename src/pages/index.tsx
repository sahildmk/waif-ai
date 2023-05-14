import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisResponseType } from "@/server/api/routers/analysis";
import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import { CreateChatCompletionResponse } from "openai";
import { useState } from "react";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<AnalysisResponseType>();
  const prompt = api.analysis.analyse.useMutation();

  return (
    <>
      <Head>
        <title>What Am I Feeling?</title>
        <meta name="description" content="What Am I Feeling AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-20 flex min-h-screen flex-col items-center pt-20">
        <div className="mb-5 flex items-start justify-center gap-2">
          <h1 className="text-5xl">What Am I feeling?</h1>
          <Badge>AI</Badge>
        </div>
        <div className="w-full max-w-3xl pb-5">
          <Textarea
            rows={10}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
        <Button
          variant={"default"}
          onClick={() => {
            prompt.mutate(
              { text: text },
              {
                onSuccess(data) {
                  setResponse(data);
                },
              }
            );
          }}
        >
          Submit
        </Button>
        {prompt.isLoading && "Loading..."}
        <div>
          Response:{" "}
          {response?.parsedPromptResponse?.map((val, idx) => {
            return <div key={idx}>{val.emotion}</div>;
          })}
        </div>
        <div>
          Total tokens: {response?.rawPromptResponse.usage?.total_tokens}
        </div>
      </main>
    </>
  );
};

export default Home;
