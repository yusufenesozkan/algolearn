'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Algorithm } from '@/types';

const nodeTypes = {
  start: ({ data }: { data: { label: string } }) => (
    <div className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold">
      {data.label}
    </div>
  ),
  process: ({ data }: { data: { label: string } }) => (
    <div className="bg-blue-500 text-white px-6 py-3 rounded font-semibold">
      {data.label}
    </div>
  ),
  decision: ({ data }: { data: { label: string } }) => (
    <div className="bg-yellow-500 text-white px-6 py-3 transform rotate-45 font-semibold">
      <span className="block transform -rotate-45">{data.label}</span>
    </div>
  ),
  end: ({ data }: { data: { label: string } }) => (
    <div className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold">
      {data.label}
    </div>
  ),
};

interface FlowEditorProps {
  algorithm: Algorithm;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 0 },
    data: { label: 'Başla' },
  },
  {
    id: '2',
    type: 'process',
    position: { x: 250, y: 100 },
    data: { label: 'İşlem' },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 250, y: 200 },
    data: { label: 'Karar?' },
  },
  {
    id: '4',
    type: 'end',
    position: { x: 250, y: 350 },
    data: { label: 'Bitir' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', label: 'Evet' },
];

export default function FlowEditor({ algorithm }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type,
      position: { x: 250, y: nodes.length * 100 + 50 },
      data: { label: type === 'start' ? 'Başla' : type === 'end' ? 'Bitir' : 'Yeni Düğüm' },
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="h-[600px]">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => addNode('process')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + İşlem
        </button>
        <button
          onClick={() => addNode('decision')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          + Karar
        </button>
        <p className="text-gray-500 ml-4 self-center">
          Düğümleri sürükleyip bırakabilir, bağlantıları düzenleyebilirsiniz
        </p>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="border rounded-lg"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
