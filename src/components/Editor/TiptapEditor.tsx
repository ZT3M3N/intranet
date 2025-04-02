import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'
import { useState } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
    }
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
    }
  }

  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleBold().run()
  }

  const toggleItalic = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleItalic().run()
  }

  const toggleStrike = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleStrike().run()
  }

  const toggleBulletList = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleBulletList().run()
  }

  const toggleOrderedList = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleOrderedList().run()
  }

  const toggleBlockquote = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().toggleBlockquote().run()
  }

  const setTextAlign = (align: 'left' | 'center' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().setTextAlign(align).run()
  }

  const undo = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().undo().run()
  }

  const redo = (e: React.MouseEvent) => {
    e.preventDefault()
    editor.chain().focus().redo().run()
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-white border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleStrike}
          className={editor.isActive('strike') ? 'bg-slate-200' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBulletList}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleOrderedList}
          className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setTextAlign('left')}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200' : ''}
        >
          ←
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setTextAlign('center')}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200' : ''}
        >
          ↔
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setTextAlign('right')}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200' : ''}
        >
          →
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-slate-200' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={undo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={redo}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none bg-white text-black"
      />
    </div>
  )
}

export default TiptapEditor 