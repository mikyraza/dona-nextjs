"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import MediaPickerModal from '../components/MediaPickerModal';

// ─── WYSIWYG Rich Text Editor (TipTap) ───────────────────────────────────────
export default function RichEditor({ value, onChange, placeholder = "Rédigez votre contenu ici..." }) {
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Ensure controlled updates from external value (if needed)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      const timeout = setTimeout(() => {
        if (editor.getHTML() !== value) {
          editor.commands.setContent(value || '');
        }
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [value, editor]);

  const handleImageSelect = (url) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="rich-editor-container tiptap-container">
      <div className="rich-editor-toolbar" style={{ flexWrap: 'wrap', gap: '4px' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`} title="Gras"><span className="material-symbols-outlined">format_bold</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`} title="Italique"><span className="material-symbols-outlined">format_italic</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`} title="Souligné"><span className="material-symbols-outlined">format_underlined</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`} title="Barré"><span className="material-symbols-outlined">strikethrough_s</span></button>
        
        <span className="toolbar-divider" />
        
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`} title="Titre H2"><span className="material-symbols-outlined">title</span><span style={{fontSize:'10px', position:'absolute', bottom:'2px', right:'2px', fontWeight: 'bold'}}>2</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`} title="Titre H3"><span className="material-symbols-outlined">title</span><span style={{fontSize:'10px', position:'absolute', bottom:'2px', right:'2px', fontWeight: 'bold'}}>3</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`} title="Citation"><span className="material-symbols-outlined">format_quote</span></button>
        
        <span className="toolbar-divider" />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`} title="Liste à puces"><span className="material-symbols-outlined">format_list_bulleted</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`} title="Liste ordonnée"><span className="material-symbols-outlined">format_list_numbered</span></button>
        
        <span className="toolbar-divider" />
        
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`} title="Aligner à gauche"><span className="material-symbols-outlined">format_align_left</span></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`} title="Centrer"><span className="material-symbols-outlined">format_align_center</span></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`} title="Aligner à droite"><span className="material-symbols-outlined">format_align_right</span></button>
        
        <span className="toolbar-divider" />
        
        <button type="button" onClick={() => setIsMediaModalOpen(true)} className="toolbar-btn" title="Insérer une image depuis la médiathèque">
          <span className="material-symbols-outlined">add_photo_alternate</span>
        </button>
      </div>
      <EditorContent editor={editor} className="rich-editor-body" />
      
      <MediaPickerModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        onSelect={handleImageSelect} 
      />

      <style jsx global>{`
        .tiptap-container .ProseMirror {
          min-height: 180px;
          outline: none;
        }
        .tiptap-container .ProseMirror p.is-editor-empty:first-child::before {
          content: '${placeholder}';
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap-container .is-active {
          background-color: #E2E8F0;
          color: #0F172A;
          border-radius: 4px;
        }
        .tiptap-container .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 16px 0;
        }
        .tiptap-container .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #CE0028;
        }
        .tiptap-container .ProseMirror blockquote {
          border-left: 3px solid #CE0028;
          margin-left: 0;
          padding-left: 1rem;
          font-style: italic;
          color: #555;
        }
        
        /* Preview styling for public article feel */
        .public-article-preview {
          border: 1px solid #EAEAEA;
          border-radius: 8px;
          padding: 16px;
          background: #FAFAFA;
          max-height: 400px;
          overflow-y: auto;
          font-family: inherit;
        }
        .public-article-preview h2 {
          font-size: 20px;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #111;
        }
        .public-article-preview h3 {
          font-size: 16px;
          font-weight: 700;
          margin-top: 1.2em;
          margin-bottom: 0.5em;
          color: #333;
        }
        .public-article-preview p {
          font-size: 15px;
          line-height: 1.6;
          color: #444;
          margin-bottom: 1em;
        }
        .public-article-preview img {
          max-width: 100%;
          border-radius: 8px;
          margin: 16px 0;
        }
        .public-article-preview blockquote {
          border-left: 4px solid #CE0028;
          margin: 1.5em 0;
          padding-left: 16px;
          font-style: italic;
          color: #555;
          font-size: 16px;
        }
        .public-article-preview ul, .public-article-preview ol {
          margin-bottom: 1em;
          padding-left: 20px;
          color: #444;
        }
      `}</style>
    </div>
  );
}
