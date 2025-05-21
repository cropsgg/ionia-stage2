import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiFile, FiDownload, FiTrash } from 'react-icons/fi';

export type FileAttachment = {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  file?: File;
  uploadedAt?: Date;
  isUploading?: boolean;
  progress?: number;
};

type FileUploadProps = {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'application/pdf']
  disabled?: boolean;
};

const FileUpload: React.FC<FileUploadProps> = ({
  attachments,
  onChange,
  maxFiles = 5,
  maxSize = 10, // Default 10MB
  allowedTypes,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    // Check if adding these files would exceed the limit
    if (attachments.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const newAttachments: FileAttachment[] = [...attachments];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxSize}MB`);
        return;
      }

      // Check file type if restrictions are provided
      if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format`);
        return;
      }

      // Add file to attachments
      newAttachments.push({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        file,
        isUploading: true,
        progress: 0,
      });
    });

    onChange(newAttachments);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Simulate upload progress (in a real app, this would be an actual API upload)
    simulateUpload(newAttachments);
  };

  const simulateUpload = (attachments: FileAttachment[]) => {
    const uploadingAttachments = attachments.filter(a => a.isUploading);
    
    uploadingAttachments.forEach((attachment, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        
        if (progress <= 100) {
          const updatedAttachments = [...attachments];
          const attachmentIndex = updatedAttachments.findIndex(
            a => a.fileName === attachment.fileName && a.fileSize === attachment.fileSize
          );
          
          if (attachmentIndex !== -1) {
            updatedAttachments[attachmentIndex] = {
              ...updatedAttachments[attachmentIndex],
              progress,
            };
            
            onChange(updatedAttachments);
          }
        } else {
          clearInterval(interval);
          
          const updatedAttachments = [...attachments];
          const attachmentIndex = updatedAttachments.findIndex(
            a => a.fileName === attachment.fileName && a.fileSize === attachment.fileSize
          );
          
          if (attachmentIndex !== -1) {
            updatedAttachments[attachmentIndex] = {
              ...updatedAttachments[attachmentIndex],
              isUploading: false,
              fileUrl: URL.createObjectURL(attachment.file as File),
              id: `attachment-${Date.now()}-${index}`,
              uploadedAt: new Date(),
            };
            
            onChange(updatedAttachments);
          }
        }
      }, 300);
    });
  };

  const handleRemove = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    onChange(newAttachments);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📽️';
    return '📎';
  };

  return (
    <div className="w-full">
      {!disabled && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer mb-3"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-1 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {allowedTypes ? `Allowed: ${allowedTypes.join(', ')}` : 'All file types supported'} (Max: {maxSize}MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-3">
          {error}
        </div>
      )}

      {attachments.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-200 border rounded-md">
          {attachments.map((attachment, index) => (
            <li key={attachment.id || index} className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <span className="mr-2 text-lg">{getFileIcon(attachment.fileType)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.fileSize)}
                  </p>
                </div>
              </div>

              {attachment.isUploading ? (
                <div className="w-24">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${attachment.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{attachment.progress}%</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {attachment.fileUrl && (
                    <a 
                      href={attachment.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                      download={attachment.fileName}
                    >
                      <FiDownload />
                    </a>
                  )}
                  {!disabled && (
                    <button 
                      type="button" 
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash />
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload; 