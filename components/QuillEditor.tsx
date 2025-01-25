import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.bubble.css";

type QuillEditorProps = {
  value: string;
  onChange: (content: string) => void;
  className?: HTMLDivElement["className"];
};

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        placeholder: "Write something...",
        theme: "bubble",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }], // Headers
            ["bold", "italic", "underline", "strike"], // Text styles
            [{ color: [] }, { background: [] }], // Text color and background
            [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
            ["blockquote", "code-block"], // Blockquote and code
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            [{ align: [] }], // Text alignment
            ["link", "image", "video"], // Links, images, and videos
            ["clean"], // Remove formatting
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        const html =
          editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (
      quillInstance.current &&
      value !== quillInstance.current.root.innerHTML
    ) {
      quillInstance.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={editorRef} className={className} />;
};

export default QuillEditor;
