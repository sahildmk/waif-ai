import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SearchAndReplace } from "@/components/ui/tiptap/extensions/search-n-replace";
import Tiptap from "@/components/ui/tiptap/tiptap";
import { type AnalysisResponseType } from "@/server/api/routers/analysis";
import { api } from "@/utils/api";
import Highlight from "@tiptap/extension-highlight";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { type Range } from "@tiptap/core";

const Home: NextPage = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<AnalysisResponseType>();
  const prompt = api.analysis.analyse.useMutation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      SearchAndReplace.configure({
        searchResultClass: "search-result",
        caseSensitive: false,
        disableRegex: false,
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
  });

  editor?.chain().setSearchTerm("hello world").run();

  const HandleSubmitPrompt = () => {
    prompt.mutate(
      { text: text },
      {
        onSuccess(data) {
          if (data.ok) setResponse(data.value);
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>What Am I Feeling?</title>
        <meta name="description" content="What Am I Feeling AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-20">
        <section className="flex min-h-screen flex-col items-center gap-5 py-20">
          <div className="mb-5 flex items-start justify-center gap-2">
            <h1 className="text-5xl">What Am I feeling?</h1>
            <Badge>AI</Badge>
          </div>
          <div className="flex w-full max-w-3xl flex-1 flex-col">
            {/* <Textarea
              rows={10}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            /> */}
            {editor && <Tiptap editor={editor} />}
          </div>
          <Button variant={"default"} onClick={HandleSubmitPrompt}>
            {prompt.isLoading ? <LoadingSpinner /> : <>Submit</>}
          </Button>

          <Button
            variant={"secondary"}
            onClick={() => {
              let sResults = editor?.storage.searchAndReplace
                .results as Range[];

              console.log(sResults);

              sResults.forEach((result) => {
                editor?.chain().setTextSelection(result).run();
                editor?.chain().setHighlight().run();
              });

              // editor?.chain().replace().run();

              // editor
              //   ?.chain()
              //   .setTextSelection({ from: 12, to: 20 })
              //   .toggleHighlight()
              //   .run();
            }}
          >
            Highlight
          </Button>
          <div>
            Response:{" "}
            {response?.parsedPromptResponse?.map((val, idx) => {
              return (
                <div key={idx}>
                  {val.emotion} - {val.associatedText} <br /> <br />
                </div>
              );
            })}
          </div>
        </section>
        {/* <div>
          Total tokens: {response?.rawPromptResponse.usage?.total_tokens}
        </div> */}
      </main>
    </>
  );
};

export default Home;
