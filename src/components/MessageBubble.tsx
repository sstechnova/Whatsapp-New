import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  File, 
  Image as ImageIcon, 
  Video, 
  Music,
  Download,
  Reply,
  Copy,
  Share2,
  MoreVertical,
  Star,
  Trash2,
  X
} from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  status?: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
  replyTo?: {
    content: string;
    sender: string;
  };
  onReply?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
  isStarred?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  sender,
  status,
  attachments,
  replyTo,
  onReply,
  onForward,
  onDelete,
  onStar,
  isStarred
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const isUser = sender === 'user';

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(content);
    setShowActions(false);
  };

  return (
    <>
      <div 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div
          className={`relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
            isUser ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'
          }`}
        >
          {/* Reply indicator */}
          {replyTo && (
            <div className={`mb-2 p-2 rounded ${
              isUser ? 'bg-green-700' : 'bg-gray-200'
            }`}>
              <p className="text-xs opacity-75">{replyTo.sender}</p>
              <p className="text-sm truncate">{replyTo.content}</p>
            </div>
          )}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="space-y-2 mb-2">
              {attachments.map((attachment, index) => (
                <div key={index} className="rounded overflow-hidden">
                  {attachment.type === 'image' ? (
                    <div className="cursor-pointer" onClick={() => setShowImagePreview(attachment.url)}>
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-auto max-h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : attachment.type === 'video' ? (
                    <video
                      src={attachment.url}
                      controls
                      className="w-full h-auto max-h-48"
                      preload="metadata"
                    />
                  ) : attachment.type === 'audio' ? (
                    <audio src={attachment.url} controls className="w-full" preload="metadata" />
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        {getAttachmentIcon(attachment.type)}
                        <span className="ml-2 text-sm truncate">{attachment.name}</span>
                      </div>
                      <a
                        href={attachment.url}
                        download
                        className="ml-2 text-gray-400 hover:text-gray-500"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message content */}
          <p className="break-words whitespace-pre-wrap">{content}</p>
          
          {/* Message footer */}
          <div className={`flex items-center justify-end mt-1 text-xs ${
            isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
            {isStarred && (
              <Star className="w-3 h-3 mr-1 fill-current" />
            )}
            {format(timestamp, 'HH:mm')}
            {isUser && status && (
              <span className="ml-1">
                {status === 'sent' && '✓'}
                {status === 'delivered' && '✓✓'}
                {status === 'read' && (
                  <span className="text-blue-300">✓✓</span>
                )}
              </span>
            )}
          </div>

          {/* Message actions */}
          {showActions && (
            <div className={`absolute ${isUser ? 'left-0' : 'right-0'} -top-8 bg-white rounded-lg shadow-lg py-1 px-2 flex items-center space-x-1`}>
              <button
                onClick={onReply}
                className="p-1 hover:bg-gray-100 rounded"
                title="Reply"
              >
                <Reply className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleCopyText}
                className="p-1 hover:bg-gray-100 rounded"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onForward}
                className="p-1 hover:bg-gray-100 rounded"
                title="Forward"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onStar}
                className="p-1 hover:bg-gray-100 rounded"
                title={isStarred ? "Unstar" : "Star"}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={onDelete}
                className="p-1 hover:bg-gray-100 rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image preview modal */}
      {showImagePreview && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setShowImagePreview(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={showImagePreview}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setShowImagePreview(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;