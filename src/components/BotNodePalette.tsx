import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  MessageSquare, 
  Brain, 
  ArrowRight, 
  FileText, 
  Image,
  Workflow
} from 'lucide-react';

interface NodeType {
  type: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const nodeTypes: NodeType[] = [
  {
    type: 'message',
    title: 'Message',
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    description: 'Send a message to the user'
  },
  {
    type: 'condition',
    title: 'Condition',
    icon: <ArrowRight className="w-6 h-6 text-yellow-500" />,
    description: 'Add conditional logic'
  },
  {
    type: 'ai',
    title: 'AI Response',
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    description: 'Generate AI responses'
  },
  {
    type: 'input',
    title: 'User Input',
    icon: <FileText className="w-6 h-6 text-green-500" />,
    description: 'Collect user input'
  },
  {
    type: 'media',
    title: 'Media',
    icon: <Image className="w-6 h-6 text-red-500" />,
    description: 'Send media content'
  },
  {
    type: 'flow',
    title: 'Sub-flow',
    icon: <Workflow className="w-6 h-6 text-indigo-500" />,
    description: 'Link to another flow'
  }
];

interface DraggableNodeProps {
  type: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, title, icon, description }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type,
      isTemplate: true
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-105' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

const BotNodePalette: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Node Types</h2>
      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            title={node.title}
            icon={node.icon}
            description={node.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BotNodePalette;