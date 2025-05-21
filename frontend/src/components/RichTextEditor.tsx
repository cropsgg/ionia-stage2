import React, { useState, useEffect } from 'react';
import { 
  FiBold, FiItalic, FiList, FiLink, FiAlignLeft, 
  FiAlignCenter, FiAlignRight, FiImage, FiCode
} from 'react-icons/fi';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = 'min-h-[200px]',
  disabled = false,
  label,
  error,
}) => {
  const [editorHtml, setEditorHtml] = useState(value);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditorHtml(value);
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSelectionRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (selectionRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(selectionRange);
      }
    }
  };

  const execCommand = (command: string, value: string = '') => {
    if (disabled) return;
    
    // Give focus to the editor if it doesn't have it
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }

    // Restore selection if we have it
    if (selectionRange) {
      restoreSelection();
    }

    // Execute the command
    document.execCommand(command, false, value);

    // Update the editor content
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setEditorHtml(newHtml);
      onChange(newHtml);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setEditorHtml(newHtml);
      onChange(newHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save the selection when user interacts
    saveSelection();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleImageUpload = () => {
    // In a real implementation, you'd open a file picker and upload the image
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      execCommand('insertImage', imageUrl);
    }
  };

  const handleLinkInsert = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className={`border rounded-md ${error ? 'border-red-500' : 'border-gray-300'} overflow-hidden`}>
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-1 flex flex-wrap gap-1">
          <button 
            type="button" 
            onClick={() => execCommand('bold')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Bold"
          >
            <FiBold />
          </button>
          
          <button 
            type="button" 
            onClick={() => execCommand('italic')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Italic"
          >
            <FiItalic />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          
          <button 
            type="button" 
            onClick={() => execCommand('insertUnorderedList')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Bullet List"
          >
            <FiList />
          </button>
          
          <button 
            type="button" 
            onClick={handleLinkInsert}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Insert Link"
          >
            <FiLink />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          
          <button 
            type="button" 
            onClick={() => execCommand('justifyLeft')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Align Left"
          >
            <FiAlignLeft />
          </button>
          
          <button 
            type="button" 
            onClick={() => execCommand('justifyCenter')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Align Center"
          >
            <FiAlignCenter />
          </button>
          
          <button 
            type="button" 
            onClick={() => execCommand('justifyRight')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Align Right"
          >
            <FiAlignRight />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          
          <button 
            type="button" 
            onClick={handleImageUpload}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Insert Image"
          >
            <FiImage />
          </button>
          
          <button 
            type="button" 
            onClick={() => execCommand('formatBlock', '<pre>')}
            className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={disabled}
            title="Code Block"
          >
            <FiCode />
          </button>
        </div>
        
        {/* Editor */}
        <div
          ref={editorRef}
          className={`px-3 py-2 ${height} overflow-y-auto`}
          contentEditable={!disabled}
          dangerouslySetInnerHTML={{ __html: editorHtml || placeholder }}
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          onMouseUp={() => saveSelection()}
          onBlur={() => saveSelection()}
          onPaste={handlePaste}
          style={{ 
            minHeight: '200px',
            color: editorHtml ? 'inherit' : '#9ca3af',
          }}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RichTextEditor; 