import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiEdit2 } from 'react-icons/fi';

type Annotation = {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  comment: string;
  color: string; // CSS color code
};

type TextAnnotatorProps = {
  content: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  readOnly?: boolean;
};

const TextAnnotator: React.FC<TextAnnotatorProps> = ({
  content,
  annotations,
  onAnnotationsChange,
  readOnly = false,
}) => {
  const [selectedText, setSelectedText] = useState<{ text: string; start: number; end: number } | null>(null);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [newAnnotationComment, setNewAnnotationComment] = useState('');
  const [newAnnotationColor, setNewAnnotationColor] = useState('#FFD700');

  const contentRef = useRef<HTMLDivElement>(null);
  const annotationFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderContentWithAnnotations();
  }, [content, annotations, activeAnnotation]);

  useEffect(() => {
    // Add click outside listener to close annotation form
    function handleClickOutside(event: MouseEvent) {
      if (
        annotationFormRef.current && 
        !annotationFormRef.current.contains(event.target as Node) &&
        !readOnly
      ) {
        setShowAnnotationForm(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [readOnly]);

  const renderContentWithAnnotations = () => {
    let html = content;
    
    // Sort annotations by startIndex in descending order to avoid index shifting
    const sortedAnnotations = [...annotations].sort((a, b) => b.startIndex - a.startIndex);
    
    for (const annotation of sortedAnnotations) {
      const { id, startIndex, endIndex, text, color } = annotation;
      const isActive = activeAnnotation === id;
      
      const highlightClass = isActive 
        ? 'bg-yellow-300 cursor-pointer relative inline highlighted-text active-highlight' 
        : 'cursor-pointer relative inline highlighted-text';
      
      const highlightedText = `<span 
        class="${highlightClass}" 
        style="background-color: ${color}40;" 
        data-annotation-id="${id}" 
        data-start="${startIndex}" 
        data-end="${endIndex}"
      >${text}<span class="inline-block w-4 h-4 ml-1 relative top-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span></span>`;
      
      html = html.substring(0, startIndex) + highlightedText + html.substring(endIndex);
    }
    
    setEditorContent(html);
  };

  const handleTextSelection = () => {
    if (readOnly) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    // Get the bounds of the selection
    const containerElement = contentRef.current;
    if (!containerElement) return;
    
    // Get the text content of the element
    const fullText = containerElement.textContent || '';
    
    // Calculate start and end positions
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startPos = preSelectionRange.toString().length;
    
    const selectedText = range.toString();
    const endPos = startPos + selectedText.length;
    
    setSelectedText({
      text: selectedText,
      start: startPos,
      end: endPos
    });
    
    setShowAnnotationForm(true);
    setNewAnnotationComment('');
  };

  const addAnnotation = () => {
    if (!selectedText || !newAnnotationComment) return;
    
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      startIndex: selectedText.start,
      endIndex: selectedText.end,
      text: selectedText.text,
      comment: newAnnotationComment,
      color: newAnnotationColor
    };
    
    onAnnotationsChange([...annotations, newAnnotation]);
    setShowAnnotationForm(false);
    setSelectedText(null);
    
    // Clear the selection
    window.getSelection()?.removeAllRanges();
  };

  const removeAnnotation = (id: string) => {
    const updatedAnnotations = annotations.filter(annotation => annotation.id !== id);
    onAnnotationsChange(updatedAnnotations);
    setActiveAnnotation(null);
  };

  const handleAnnotationClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const annotationSpan = target.closest('.highlighted-text');
    
    if (annotationSpan) {
      const annotationId = annotationSpan.getAttribute('data-annotation-id');
      if (annotationId) {
        setActiveAnnotation(activeAnnotation === annotationId ? null : annotationId);
      }
    }
  };

  return (
    <div className="relative border border-gray-200 rounded-md">
      <div className="p-1 bg-gray-50 border-b text-xs text-gray-500 flex items-center">
        {readOnly ? (
          <span>Annotated text (hover over highlights to see comments)</span>
        ) : (
          <span>Select text to add annotations</span>
        )}
      </div>
      
      {/* Text content with annotations */}
      <div 
        ref={contentRef}
        className="p-3 min-h-[150px] relative"
        onMouseUp={readOnly ? undefined : handleTextSelection}
        onClick={handleAnnotationClick}
        dangerouslySetInnerHTML={{ __html: editorContent }}
      />
      
      {/* Annotation form */}
      {showAnnotationForm && selectedText && (
        <div 
          ref={annotationFormRef} 
          className="absolute z-10 w-80 bg-white shadow-lg border border-gray-200 rounded-md p-3 right-0 top-full mt-2"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Add Annotation</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowAnnotationForm(false)}
            >
              <FiX />
            </button>
          </div>
          
          <p className="text-xs bg-gray-50 p-2 rounded mb-2 line-clamp-2">
            "{selectedText.text}"
          </p>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
              value={newAnnotationComment}
              onChange={(e) => setNewAnnotationComment(e.target.value)}
              placeholder="Add your comment here..."
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Highlight Color
            </label>
            <div className="flex space-x-2">
              {['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'].map(color => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer border ${
                    newAnnotationColor === color ? 'border-gray-800 border-2' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewAnnotationColor(color)}
                />
              ))}
            </div>
          </div>
          
          <button
            type="button"
            className="w-full bg-indigo-600 text-white py-1 rounded-md text-sm hover:bg-indigo-700"
            onClick={addAnnotation}
            disabled={!newAnnotationComment}
          >
            Add Annotation
          </button>
        </div>
      )}
      
      {/* Active annotation details */}
      {activeAnnotation && (
        <div className="absolute z-10 w-80 bg-white shadow-lg border border-gray-200 rounded-md p-3 right-0 bottom-0 mb-2 mr-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <FiMessageSquare className="text-gray-500 mr-1" />
              <h3 className="text-sm font-medium">Annotation</h3>
            </div>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setActiveAnnotation(null)}
            >
              <FiX />
            </button>
          </div>
          
          {annotations.find(a => a.id === activeAnnotation)?.comment && (
            <div className="text-sm p-2 bg-gray-50 rounded mb-2">
              {annotations.find(a => a.id === activeAnnotation)?.comment}
            </div>
          )}
          
          {!readOnly && (
            <button
              type="button"
              className="text-red-600 text-xs hover:text-red-800 flex items-center"
              onClick={() => removeAnnotation(activeAnnotation)}
            >
              <FiX className="mr-1" /> Remove Annotation
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TextAnnotator; 