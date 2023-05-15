import Highlight from "@tiptap/extension-highlight";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  editor: Editor;
};

const Tiptap: React.FC<Props> = ({ editor: Editor }) => {
  return <EditorContent editor={Editor} className="flex flex-1 flex-col" />;
};

export default Tiptap;
