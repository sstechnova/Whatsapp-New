import React, { useState, useCallback } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import { BotNode } from '../types/bot';
import { 
  MessageSquare, 
  Brain, 
  ArrowRight, 
  FileText, 
  Image,
  Workflow,
  X,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';

interface BotFlowCanvasProps {
  nodes: Record<string, BotNode>;
  onNodeAdd: (node: BotNode) => void;
  onNodeUpdate: (node: BotNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeConnect: (sourceId: string, targetId: string) => void;
}

interface NodeProps {
  node: BotNode;
  onEdit: () => void;
  onDelete: () => void;
  onConnect: () => void;
  isSelected: boolean;
  onClick: () => void;
}

const Node: React.FC<NodeProps> = ({
  node,
  onEdit,
  onDelete,
  onConnect,
  isSelected,
  onClick
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
    data: { type: 'node' }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

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
      case 'flow':
        return <Workflow className="w-5 h-5 text-indigo-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute bg-white rounded-lg shadow-sm border ${
        isSelected ? 'border-green-500' : 'border-gray-200'
      } w-64`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getNodeIcon(node.type)}
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {node.type} Node
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {node.content || 'No content'}
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
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConnect();
          }}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Connection
        </button>
      </div>

      {/* Connection points */}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 cursor-pointer" />
      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 cursor-pointer" />
    </div>
  );
};

const BotFlowCanvas: React.FC<BotFlowCanvasProps> = ({
  nodes,
  onNodeAdd,
  onNodeUpdate,
  onNodeDelete,
  onNodeConnect
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { setNodeRef } = useDroppable({
    id: 'flow-canvas',
    data: {
      accepts: ['node']
    }
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (connectingFrom) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [connectingFrom]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (connectingFrom) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Create new node at click position
      const newNode: BotNode = {
        id: nanoid(),
        type: 'message',
        content: '',
        children: [],
        position
      };

      onNodeAdd(newNode);
      onNodeConnect(connectingFrom, newNode.id);
      setConnectingFrom(null);
    } else {
      setSelectedNode(null);
    }
  }, [connectingFrom, onNodeAdd, onNodeConnect]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        onNodeConnect(connectingFrom, nodeId);
      }
      setConnectingFrom(null);
    } else {
      setSelectedNode(nodeId);
    }
  }, [connectingFrom, onNodeConnect]);

  return (
    <div
      ref={setNodeRef}
      id="flow-canvas"
      className="flex-1 bg-gray-50 rounded-lg overflow-hidden relative"
      style={{ minHeight: '600px' }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Nodes */}
      {Object.values(nodes).map((node) => (
        <Node
          key={node.id}
          node={node}
          onEdit={() => onNodeUpdate(node)}
          onDelete={() => onNodeDelete(node.id)}
          onConnect={() => setConnectingFrom(node.id)}
          isSelected={selectedNode === node.id}
          onClick={() => handleNodeSelect(node.id)}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 pointer-events-none">
        {Object.values(nodes).map((node) =>
          node.children.map((childId) => {
            const child = nodes[childId];
            if (!child || !node.position || !child.position) return null;

            const startX = node.position.x + 256; // Node width
            const startY = node.position.y + 40; // Half node height
            const endX = child.position.x;
            const endY = child.position.y + 40;

            const controlPoint1X = startX + 50;
            const controlPoint1Y = startY;
            const controlPoint2X = endX - 50;
            const controlPoint2Y = endY;

            return (
              <path
                key={`${node.id}-${childId}`}
                d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
                stroke="#9CA3AF"
                strokeWidth="2"
                fill="none"
              />
            );
          })
        )}

        {/* Active connection line */}
        {connectingFrom && nodes[connectingFrom]?.position && (
          <path
            d={`M ${nodes[connectingFrom].position!.x + 256} ${nodes[connectingFrom].position!.y + 40} L ${mousePosition.x} ${mousePosition.y}`}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="4"
            fill="none"
          />
        )}
      </svg>
    </div>
  );
};

export default BotFlowCanvas;