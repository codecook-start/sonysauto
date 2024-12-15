import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
        theme: "snow",
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
