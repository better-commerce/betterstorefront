import { useEffect, useState, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

//
import { EDITOR_JS_ID, editorTools } from './config';

function ContentEditor({ value = undefined }) {
  const editorRef = useRef();

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITOR_JS_ID,
      onReady: () => {
        editorRef.current = editor;
        // parse raw html content in the view
        const rawDomNodes = document.querySelectorAll('.cdx-block.ce-rawtool')
        rawDomNodes?.forEach((node) => {
          const textAreaNode = node.children[0]
          const rawHtmlValue = textAreaNode?.value || ""
          node.removeChild(textAreaNode)
          node.innerHTML = rawHtmlValue
        })
      },
      readOnly: true,
      data: value, // default value
      tools: editorTools,
    });
  };

  useEffect(() => {
    if (editorRef.current === undefined) {
      initEditor();
    }
    return () => {
      editorRef?.current?.destroy();
      editorRef.current = undefined;
    };
  }, []);

  return (
    <>
      <div id={EDITOR_JS_ID}></div>
    </>
  )
}

export default ContentEditor;

