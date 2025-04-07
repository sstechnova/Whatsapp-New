import React, { useState, useCallback } from 'react';
import { 
  Bot, 
  Plus, 
  Copy, 
  Trash2, 
  Save,
  ArrowRight,
  MessageSquare,
  Brain,
  FileText,
  Image,
  Send,
  ArrowDown,
  ArrowUp,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  AlertCircle
} from 'lucide-react';
import { nanoid } from 'nanoid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BotNode {
  id: string;
  type: 'message' | 'condition' | 'ai' | 'input' | 'media';
  content: string;
  children: string[];
  conditions?: {
    type: 'text' | 'number' | 'boolean';
    operator: string;
    value: string;
  }[];
  metadata?: {
    responseType?: 'text' | 'options' | 'file';
    options?: string[];
    fileTypes?: string[];
    maxSize?: number;
    aiModel?: string;
    aiTemperature?: number;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio';
  };
}

interface BotFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  nodes: Record<string, BotNode>;
  rootNode: string;
  isActive: boolean;
}

interface SortableNodeProps {
  node: BotNode;
  onEdit: (node: BotNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  isLast: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const SortableNode: React.FC<SortableNodeProps> = ({
  node,
  onEdit,
  onDelete,
  onAddChild,
  isLast,
  onMoveUp,
  onMoveDown
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'condition':
        return <ArrowRight className="w-5 h-5 text-yellow-500" />;
      case 'ai':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'input':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'media':
        return <Image className="w-5 h-5 text-red-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" {...attributes} {...listeners}>
            <div className="cursor-move">
              {getNodeIcon(node.type)}
            </div>
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {node.type} Node
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {onMoveUp && (
              <button
                onClick={onMoveUp}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(node)}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(node.id)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {node.content}
        </div>

        {node.metadata && (
          <div className="mt-2 space-y-1">
            {node.metadata.responseType && (
              <div className="text-xs text-gray-500">
                Response Type: {node.metadata.responseType}
              </div>
            )}
            {node.metadata.options && node.metadata.options.length > 0 && (
              <div className="text-xs text-gray-500">
                Options: {node.metadata.options.join(', ')}
              </div>
            )}
            {node.metadata.aiModel && (
              <div className="text-xs text-gray-500">
                AI Model: {node.metadata.aiModel}
              </div>
            )}
            {node.metadata.mediaUrl && (
              <div className="text-xs text-gray-500">
                Media: {node.metadata.mediaType}
              </div>
            )}
          </div>
        )}

        {node.conditions && node.conditions.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium text-gray-700">Conditions:</div>
            {node.conditions.map((condition, index) => (
              <div key={index} className="text-xs text-gray-500">
                {condition.type} {condition.operator} {condition.value}
              </div>
            ))}
          </div>
        )}

        {!isLast && (
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-0.5 h-4 bg-gray-300"></div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => onAddChild(node.id)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Node
        </button>
      </div>
    </div>
  );
};

const BotBuilder: React.FC = () => {
  const [selectedBot, setSelectedBot] = useState<BotFlow | null>(null);
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<BotNode | null>(null);
  const [newBotName, setNewBotName] = useState('');
  const [newBotDescription, setNewBotDescription] = useState('');
  const [newBotTrigger, setNewBotTrigger] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [bots, setBots] = useState<BotFlow[]>([
    {
      id: 'bot1',
      name: 'Customer Support Bot',
      description: 'Handles common customer support inquiries',
      trigger: 'support, help, assistance',
      isActive: true,
      rootNode: 'node1',
      nodes: {
        'node1': {
          id: 'node1',
          type: 'message',
          content: 'Hello! How can I help you today? Please select one of the following options:',
          children: ['node2', 'node3', 'node4'],
          metadata: {
            responseType: 'options',
            options: ['Product Information', 'Order Status', 'Speak to an Agent']
          }
        },
        'node2': {
          id: 'node2',
          type: 'ai',
          content: 'I can provide information about our products. What would you like to know?',
          children: [],
          metadata: {
            aiModel: 'gpt-4',
            aiTemperature: 0.7
          }
        },
        'node3': {
          id: 'node3',
          type: 'input',
          content: 'Please provide your order number:',
          children: [],
          metadata: {
            responseType: 'text'
          }
        },
        'node4': {
          id: 'node4',
          type: 'message',
          content: 'Connecting you to the next available agent. Please wait a moment.',
          children: []
        }
      }
    }
  ]);

  const handleCreateBot = () => {
    if (!newBotName || !newBotTrigger) return;

    const newBot: BotFlow = {
      id: nanoid(),
      name: newBotName,
      description: newBotDescription,
      trigger: newBotTrigger,
      isActive: true,
      rootNode: 'node1',
      nodes: {
        'node1': {
          id: 'node1',
          type: 'message',
          content: 'Hello! How can I help you today?',
          children: []
        }
      }
    };

    setBots([...bots, newBot]);
    setSelectedBot(newBot);
    setShowNewBotModal(false);
    resetNewBotForm();
  };

  const resetNewBotForm = () => {
    setNewBotName('');
    setNewBotDescription('');
    setNewBotTrigger('');
  };

  const handleCloneBot = (bot: BotFlow) => {
    const clonedBot: BotFlow = {
      ...bot,
      id: nanoid(),
      name: `${bot.name} (Copy)`,
    };
    
    setBots([...bots, clonedBot]);
  };

  const handleDeleteBot = (botId: string) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      setBots(bots.filter(bot => bot.id !== botId));
      if (selectedBot && selectedBot.id === botId) {
        setSelectedBot(null);
      }
    }
  };

  const handleAddNode = (parentId: string) => {
    if (!selectedBot) return;

    const newNode: BotNode = {
      id: nanoid(),
      type: 'message',
      content: '',
      children: []
    };

    setEditingNode(newNode);
    setShowNodeModal(true);

    // Add node to parent's children when saved
    if (parentId) {
      const parent = selectedBot.nodes[parentId];
      if (parent) {
        parent.children.push(newNode.id);
      }
    }
  };

  const handleEditNode = (node: BotNode) => {
    setEditingNode({ ...node });
    setShowNodeModal(true);
  };

  const handleSaveNode = (node: BotNode) => {
    if (!selectedBot || !node.id) return;

    const updatedNodes = {
      ...selectedBot.nodes,
      [node.id]: node
    };

    setSelectedBot({
      ...selectedBot,
      nodes: updatedNodes
    });

    setBots(bots.map(bot => 
      bot.id === selectedBot.id 
        ? { ...bot, nodes: updatedNodes }
        : bot
    ));

    setShowNodeModal(false);
    setEditingNode(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedBot || !window.confirm('Are you sure you want to delete this node?')) return;

    const updatedNodes = { ...selectedBot.nodes };
    delete updatedNodes[nodeId];

    // Remove node from parent's children
    Object.values(updatedNodes).forEach(node => {
      node.children = node.children.filter(id => id !== nodeId);
    });

    setSelectedBot({
      ...selectedBot,
      nodes: updatedNodes
    });

    setBots(bots.map(bot => 
      bot.id === selectedBot.id 
        ? { ...selectedBot, nodes: updatedNodes }
        : bot
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!selectedBot) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Object.keys(selectedBot.nodes).indexOf(active.id as string);
    const newIndex = Object.keys(selectedBot.nodes).indexOf(over.id as string);

    const orderedNodes = arrayMove(
      Object.entries(selectedBot.nodes),
      oldIndex,
      newIndex
    );

    const updatedNodes = Object.fromEntries(orderedNodes);

    setSelectedBot({
      ...selectedBot,
      nodes: updatedNodes
    });

    setBots(bots.map(bot => 
      bot.id === selectedBot.id 
        ? { ...selectedBot, nodes: updatedNodes }
        : bot
    ));
  };

  const handleMoveNode = (nodeId: string, direction: 'up' | 'down') => {
    if (!selectedBot) return;

    const nodeIds = Object.keys(selectedBot.nodes);
    const currentIndex = nodeIds.indexOf(nodeId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= nodeIds.length) return;

    const orderedNodes = arrayMove(
      Object.entries(selectedBot.nodes),
      currentIndex,
      newIndex
    );

    const updatedNodes = Object.fromEntries(orderedNodes);

    setSelectedBot({
      ...selectedBot,
      nodes: updatedNodes
    });

    setBots(bots.map(bot => 
      bot.id === selectedBot.id 
        ? { ...selectedBot, nodes: updatedNodes }
        : bot
    ));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Bot Flow Builder</h1>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={() => setShowNewBotModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Bot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        {/* Bot list */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Your Bots</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {bots.map((bot) => (
                <li key={bot.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <button
                          className="text-sm font-medium text-green-600 truncate hover:text-green-900"
                          onClick={() => setSelectedBot(bot)}
                        >
                          {bot.name}
                        </button>
                        <div className="flex ml-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCloneBot(bot)}
                            className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBot(bot.id)}
                            className="p-1 ml-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Bot className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {bot.description}
                          </p>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                          <p>
                            Trigger: <span className="font-medium">{bot.trigger}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bot builder */}
        <div className="lg:col-span-2">
          {selectedBot ? (
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{selectedBot.name}</h3>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">{selectedBot.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-gray-500">Trigger Keywords:</span>
                  <span className="ml-2 text-xs font-medium text-green-600">{selectedBot.trigger}</span>
                </div>
              </div>

              <div className="p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={Object.keys(selectedBot.nodes)}
                    strategy={verticalListSortingStrategy}
                  >
                    {Object.values(selectedBot.nodes).map((node, index, array) => (
                      <SortableNode
                        key={node.id}
                        node={node}
                        onEdit={handleEditNode}
                        onDelete={handleDeleteNode}
                        onAddChild={(parentId) => handleAddNode(parentId)}
                        isLast={index === array.length - 1}
                        onMoveUp={index > 0 ? () => handleMoveNode(node.id, 'up') : undefined}
                        onMoveDown={index < array.length - 1 ? () => handleMoveNode(node.id, 'down') : undefined}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 bg-white rounded-lg shadow">
              <Bot className="w-16 h-16 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Bot Selected</h3>
              <p className="mt-1 text-sm text-center text-gray-500">
                Select a bot from the list or create a new one to start building your flow.
              </p>
              <button
                type="button"
                onClick={() => setShowNewBotModal(true)}
                className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Bot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New bot modal */}
      {showNewBotModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <Bot className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Bot</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill in the details below to create a new bot flow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bot-name" className="block text-sm font-medium text-gray-700">
                        Bot Name *
                      </label>
                      <input
                        type="text"
                        id="bot-name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newBotName}
                        onChange={(e) => setNewBotName(e.target.value)}
                        placeholder="Customer Support Bot"
                      />
                    </div>

                    <div>
                      <label htmlFor="bot-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="bot-description"
                        rows={3}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newBotDescription}
                        onChange={(e) => setNewBotDescription(e.target.value)}
                        placeholder="Handles common customer support inquiries"
                      />
                    </div>

                    <div>
                      <label htmlFor="bot-trigger" className="block text-sm font-medium text-gray-700">
                        Trigger Keywords *
                      </label>
                      <input
                        type="text"
                        id="bot-trigger"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={newBotTrigger}
                        onChange={(e) => setNewBotTrigger(e.target.value)}
                        placeholder="support, help, assistance"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Comma-separated keywords that will trigger this bot
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateBot}
                >
                  Create Bot
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowNewBotModal(false);
                    resetNewBotForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Node edit modal */}
      {showNodeModal && editingNode && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {editingNode.id ? 'Edit Node' : 'Add Node'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Configure the node settings below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="node-type" className="block text-sm font-medium text-gray-700">
                      Node Type
                    </label>
                    <select
                      id="node-type"
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={editingNode.type}
                      onChange={(e) => setEditingNode({
                        ...editingNode,
                        type: e.target.value as BotNode['type']
                      })}
                    >
                      <option value="message">Message</option>
                      <option value="condition">Condition</option>
                      <option value="ai">AI Response</option>
                      <option value="input">User Input</option>
                      <option value="media">Media</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="node-content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="node-content"
                      rows={3}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      value={editingNode.content}
                      onChange={(e) => setEditingNode({
                        ...editingNode,
                        content: e.target.value
                      })}
                      placeholder="Enter node content..."
                    />
                  </div>

                  {editingNode.type === 'message' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Response Type
                      </label>
                      <select
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        value={editingNode.metadata?.responseType || 'text'}
                        onChange={(e) => setEditingNode({
                          ...editingNode,
                          metadata: {
                            ...editingNode.metadata,
                            responseType: e.target.value as 'text' | 'options' | 'file'
                          }
                        })}
                      >
                        <option value="text">Text</option>
                        <option value="options">Options</option>
                        <option value="file">File Upload</option>
                      </select>

                      {editingNode.metadata?.responseType === 'options' && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options (one per line)
                          </label>
                          <textarea
                            rows={3}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={editingNode.metadata?.options?.join('\n') || ''}
                            onChange={(e) => setEditingNode({
                              ...editingNode,
                              metadata: {
                                ...editingNode.metadata,
                                options: e.target.value.split('\n').filter(Boolean)
                              }
                            })}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {editingNode.type === 'condition' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Conditions
                      </label>
                      {editingNode.conditions?.map((condition, index) => (
                        <div key={index} className="flex items-center mt-2 space-x-2">
                          <select
                            className="block w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={condition.type}
                            onChange={(e) => {
                              const newConditions = [...(editingNode.conditions || [])];
                              newConditions[index] = {
                                ...condition,
                                type: e.target.value as 'text' | 'number' | 'boolean'
                              };
                              setEditingNode({
                                ...editingNode,
                                conditions: newConditions
                              });
                            }}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                          </select>
                          <select
                            className="block w-1/4 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={condition.operator}
                            onChange={(e) => {
                              const newConditions = [...(editingNode.conditions || [])];
                              newConditions[index] = {
                                ...condition,
                                operator: e.target.value
                              };
                              setEditingNode({
                                ...editingNode,
                                conditions: newConditions
                              });
                            }}
                          >
                            <option value="equals">Equals</option>
                            <option value="contains">Contains</option>
                            <option value="greater">Greater than</option>
                            <option value="less">Less than</option>
                          </select>
                          <input
                            type="text"
                            className="block w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            value={condition.value}
                            onChange={(e) => {
                              const newConditions = [...(editingNode.conditions || [])];
                              newConditions[index] = {
                                ...condition,
                                value: e.target.value
                              };
                              setEditingNode({
                                ...editingNode,
                                conditions: newConditions
                              });
                            }}
                            placeholder="Value"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newConditions = [...(editingNode.conditions || [])];
                              newConditions.splice(index, 1);
                              setEditingNode({
                                ...editingNode,
                                conditions: newConditions
                              });
                            }}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setEditingNode({
                          ...editingNode,
                          conditions: [
                            ...(editingNode.conditions || []),
                            { type: 'text', operator: 'equals', value: '' }
                          ]
                        })}
                        className="inline-flex items-center px-3 py-1.5 mt-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Condition
                      </button>
                    </div>
                  )}

                  {editingNode.type === 'ai' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          AI Model
                        </label>
                        <select
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={editingNode.metadata?.aiModel || 'gpt-4'}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            metadata: {
                              ...editingNode.metadata,
                              aiModel: e.target.value
                            }
                          })}
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Temperature
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          className="block w-full mt-1"
                          value={editingNode.metadata?.aiTemperature || 0.7}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            metadata: {
                              ...editingNode.metadata,
                              aiTemperature: parseFloat(e.target.value)
                            }
                          })}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Precise</span>
                          <span>Balanced</span>
                          <span>Creative</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {editingNode.type === 'media' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Media Type
                        </label>
                        <select
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={editingNode.metadata?.mediaType || 'image'}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            metadata: {
                              ...editingNode.metadata,
                              mediaType: e.target.value as 'image' | 'video' | 'audio'
                            }
                          })}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="audio">Audio</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Media URL
                        </label>
                        <input
                          type="url"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          value={editingNode.metadata?.mediaUrl || ''}
                          onChange={(e) => setEditingNode({
                            ...editingNode,
                            metadata: {
                              ...editingNode.metadata,
                              mediaUrl: e.target.value
                            }
                          })}
                          placeholder="https://example.com/media.jpg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleSaveNode(editingNode)}
                >
                  Save Node
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowNodeModal(false);
                    setEditingNode(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotBuilder;