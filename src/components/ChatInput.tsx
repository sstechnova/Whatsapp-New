import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Send,
  X,
  Camera,
  File,
  Video,
  Music,
  StopCircle
} from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

interface Attachment {
  file: File;
  type: 'image' | 'video' | 'audio' | 'document';
  preview?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onStartTyping, 
  onStopTyping 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    onStartTyping?.();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
    }, 1000);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = (type: 'image' | 'video' | 'audio' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = getAcceptTypes(type);
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const getAcceptTypes = (type: string) => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      case 'document':
        return '.pdf,.doc,.docx,.xls,.xlsx,.txt';
      default:
        return '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = [];

    for (const file of files) {
      const type = file.type.split('/')[0] as 'image' | 'video' | 'audio' | 'document';
      let preview: string | undefined;

      if (type === 'image') {
        preview = URL.createObjectURL(file);
      }

      newAttachments.push({ file, type, preview });
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Update recording time
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Stop recording after 1 minute
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
          clearInterval(interval);
        }
      }, 60000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (message.trim() || attachments.length > 0 || audioBlob) {
      const files = attachments.map(att => att.file);
      if (audioBlob) {
        const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
        files.push(audioFile);
      }
      onSendMessage(message, files);
      setMessage('');
      setAttachments([]);
      setAudioBlob(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-t border-gray-200">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative">
              {attachment.type === 'image' ? (
                <img
                  src={attachment.preview}
                  alt="attachment"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                  {attachment.type === 'video' && <Video className="w-8 h-8 text-gray-400" />}
                  {attachment.type === 'audio' && <Music className="w-8 h-8 text-gray-400" />}
                  {attachment.type === 'document' && <File className="w-8 h-8 text-gray-400" />}
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice recording UI */}
      {isRecording && (
        <div className="flex items-center justify-between p-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
            <span className="text-red-600">Recording... {formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={stopRecording}
            className="text-red-600 hover:text-red-700"
          >
            <StopCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Audio preview */}
      {audioBlob && !isRecording && (
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
            <button
              onClick={() => setAudioBlob(null)}
              className="ml-2 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center p-4 bg-white">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <Smile className="w-6 h-6" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-10">
              <Picker 
                data={data} 
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <Paperclip className="w-6 h-6" />
          </button>
          {showAttachmentMenu && (
            <div className="absolute bottom-12 left-0 z-10 bg-white rounded-lg shadow-lg py-2">
              <button
                onClick={() => handleAttachmentClick('image')}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleAttachmentClick('video')}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                <Video className="w-5 h-5 mr-2" />
                <span>Video</span>
              </button>
              <button
                onClick={() => handleAttachmentClick('document')}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                <File className="w-5 h-5 mr-2" />
                <span>Document</span>
              </button>
            </div>
          )}
        </div>

        <input
          type="text"
          className="flex-1 mx-4 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />

        {message.trim() || attachments.length > 0 || audioBlob ? (
          <button
            type="button"
            onClick={handleSend}
            className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none"
          >
            <Send className="w-6 h-6" />
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <Mic className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;