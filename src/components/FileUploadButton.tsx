import React, { useState, useRef } from 'react';
import { Paperclip, X, FileText, Image, File } from 'lucide-react';

interface FileUploadButtonProps {
  onFilesSelected?: (files: File[]) => void;
}

export default function FileUploadButton({ onFilesSelected }: FileUploadButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showFileList, setShowFileList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 支持的文件类型
  const supportedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // 验证文件数量
    if (uploadedFiles.length + files.length > 50) {
      alert('最多只能上传50个文件');
      return;
    }

    // 验证每个文件
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // 检查文件大小 (100MB = 100 * 1024 * 1024 bytes)
      if (file.size > 100 * 1024 * 1024) {
        errors.push(`文件 "${file.name}" 超过100MB大小限制`);
        return;
      }

      // 检查文件类型
      if (!supportedTypes.includes(file.type)) {
        errors.push(`文件 "${file.name}" 格式不支持`);
        return;
      }

      validFiles.push(file);
    });

    // 显示错误信息
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    // 添加有效文件
    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      setShowFileList(true);
      onFilesSelected?.(newFiles);
    }

    // 清空input值，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected?.(newFiles);
    
    if (newFiles.length === 0) {
      setShowFileList(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else if (file.type.includes('sheet') || file.type.includes('excel')) {
      return <FileText className="h-4 w-4 text-green-600" />;
    } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
      return <FileText className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative">
      {/* 文件上传按钮 */}
      <button
        onClick={handleButtonClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex-shrink-0 p-3 bg-white/80 backdrop-blur-sm hover:bg-gray-50 rounded-full transition-all duration-200 relative shadow-sm hover:shadow-md border border-gray-200/50 hover:border-gray-300"
      >
        <Paperclip className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors" />
        {uploadedFiles.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg font-semibold">
            {uploadedFiles.length}
          </div>
        )}
      </button>

      {/* 悬浮提示 */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-800/95 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl shadow-xl whitespace-nowrap font-medium">
            支持上传文件(最多50个,每个100MB)接受pdf、doc、xlsx、ppt、txt、图片等
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800/95"></div>
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 文件列表弹窗 */}
      {showFileList && uploadedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-2xl shadow-2xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                已上传文件 ({uploadedFiles.length}/50)
              </h3>
              <button
                onClick={() => setShowFileList(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/80 rounded-xl hover:bg-gray-600/80 transition-colors">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-600/50">
                <button
                  onClick={() => {
                    setUploadedFiles([]);
                    setShowFileList(false);
                    onFilesSelected?.([]);
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium hover:scale-105"
                >
                  清空所有文件
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}