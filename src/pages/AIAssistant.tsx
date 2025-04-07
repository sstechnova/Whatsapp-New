import React, { useState } from 'react';
import { 
  Brain, 
  Upload, 
  FileText, 
  Trash2, 
  Settings,
  MessageSquare,
  Send,
  Plus,
  Save
} from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [assistantName, setAssistantName] = useState('');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [messageInput, setMessageInput] = useState('');
  
  const handleFileUpload = () => {
    // In a real app, this would handle file upload
    const mockFileName = `document-${uploadedFiles.length + 1}.pdf`;
    setUploadedFiles([...uploadedFiles, mockFileName]);
  };
  
  const handleDeleteFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file !== fileName));
  };
  
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { role: 'user', content: messageInput }
      ]);
      
      // Simulate AI response
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: "I'm analyzing your question based on the knowledge from your uploaded documents. Here's what I found..." 
          }
        ]);
      }, 1000);
      
      setMessageInput('');
    }
  };
  
  const handleSaveAssistant = () => {
    // In a real app, this would save the assistant configuration
    setActiveTab('chat');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">AI Assistant</h1>
      
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'setup'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('setup')}
            >
              <Settings className="w-5 h-5 mx-auto mb-1" />
              Setup
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-5 h-5 mx-auto mb-1" />
              Chat
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'setup' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Assistant Configuration</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create a customized AI-powered assistant by uploading files for analysis.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="assistant-name" className="block text-sm font-medium text-gray-700">
                    Assistant Name
                  </label>
                  <input
                    type="text"
                    id="assistant-name"
                    className="block w-full mt-1 border-gray-300 rounded-m d shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    placeholder="Product Knowledge Assistant"
                  />
                </div>
                
                <div>
                  <label htmlFor="assistant-type" className="block text-sm font-medium text-gray-700">
                    Assistant Type
                  </label>
                  <select
                    id="assistant-type"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    defaultValue="knowledge"
                  >
                    <option value="knowledge">Knowledge Base</option>
                    <option value="customer-support">Customer Support</option>
                    <option value="sales">Sales Assistant</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="assistant-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="assistant-description"
                  rows={3}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={assistantDescription}
                  onChange={(e) => setAssistantDescription(e.target.value)}
                  placeholder="This assistant helps answer questions about our products using our documentation."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Knowledge Files
                </label>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative font-medium text-green-600 bg-white rounded-md cursor-pointer hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX, TXT, CSV up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {uploadedFiles.map((file) => (
                      <li key={file} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex items-center flex-1 w-0">
                          <FileText className="flex-shrink-0 w-5 h-5 text-gray-400" />
                          <span className="flex-1 w-0 ml-2 truncate">{file}</span>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:text-red-500"
                            onClick={() => handleDeleteFile(file)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleSaveAssistant}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Assistant
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-300px)]">
              <div className="flex-1 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Brain className="w-16 h-16 text-gray-300" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Ask me anything</h3>
                    <p className="mt-1 text-sm text-center text-gray-500">
                      I can answer questions based on the documents you've uploaded.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="block w-full py-2 pl-3 pr-3 text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Ask a question..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="p-2 ml-2 text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;