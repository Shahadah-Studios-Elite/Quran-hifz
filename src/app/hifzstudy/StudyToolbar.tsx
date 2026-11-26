'use client';

import React from 'react';

const COLORS = ['#10b981', '#ffffff', '#f59e0b', '#ef4444', '#38bdf8', '#0f172a'];

interface StudyToolbarProps {
  tool: 'pen' | 'eraser' | 'text';
  color: string;
  brushSize: number;
  onSelectTool: (tool: 'pen' | 'eraser' | 'text') => void;
  onSelectColor: (color: string) => void;
  onChangeSize: (size: number) => void;
  onDownload: () => void;
  onClear: () => void;
}

export default function StudyToolbar({
  tool,
  color,
  brushSize,
  onSelectTool,
  onSelectColor,
  onChangeSize,
  onDownload,
  onClear,
}: StudyToolbarProps) {
  return (
    <div className="study-toolbar">
      <div className="mode-tabs">
        <button
          className={`mode-tab ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => onSelectTool('pen')}
        >
          Pen
        </button>
        <button
          className={`mode-tab ${tool === 'text' ? 'active' : ''}`}
          onClick={() => onSelectTool('text')}
        >
          Type Text
        </button>
        <button
          className={`mode-tab ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => onSelectTool('eraser')}
        >
          Eraser
        </button>
      </div>

      <div className="study-colors">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => {
              onSelectColor(c);
              if (tool === 'eraser') onSelectTool('pen');
            }}
            aria-label={`Select color ${c}`}
            className={`color-dot ${color === c && tool !== 'eraser' ? 'selected' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <label className="study-size-label">
        Size
        <input
          type="range"
          min={1}
          max={10}
          value={brushSize}
          onChange={(e) => onChangeSize(Number(e.target.value))}
        />
      </label>

      <div className="study-board-actions">
        <button onClick={onDownload}>Save PNG</button>
        <button
          onClick={onClear}
          style={{ borderColor: '#ef4444', color: '#f87171' }}
        >
          Clear Board
        </button>
      </div>
    </div>
  );
}
