'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DrawEvent } from './types';
import StudyHeader from './StudyHeader';
import StudyToolbar from './StudyToolbar';

export default function HifzStudyPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<any[]>([]);

  const [myPeerId, setMyPeerId] = useState<string>('Generating ID...');
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>('Ready to connect');

  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  const [color, setColor] = useState<string>('#10b981');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [textInput, setTextInput] = useState<string>('');
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);

  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 700;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    let active = true;

    const initPeer = () => {
      const PeerClass = (window as any).Peer;
      if (!PeerClass || !active) return;

      const shortCode =
        'qh-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const peer = new PeerClass(shortCode);
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        setMyPeerId(id);
        setStatusMsg('Share your Room ID with your study partner');

        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        if (roomParam && roomParam !== id) {
          setRemotePeerId(roomParam);
          connectToPeer(roomParam, peer);
        }
      });

      peer.on('connection', (conn: any) => {
        setupConnection(conn);
      });

      peer.on('error', (err: any) => {
        setStatusMsg(`Connection notice: ${err.type}`);
      });
    };

    if ((window as any).Peer) {
      initPeer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com';
      script.async = true;
      script.onload = initPeer;
      document.body.appendChild(script);
    }

    return () => {
      active = false;
      peerRef.current?.destroy();
    };
  }, []);

  const setupConnection = (conn: any) => {
    conn.on('open', () => {
      if (!connectionsRef.current.find((c) => c.peer === conn.peer)) {
        connectionsRef.current.push(conn);
        setConnectedPeers(connectionsRef.current.map((c) => c.peer));
        setStatusMsg(`Connected with ${conn.peer}`);
      }
    });

    conn.on('data', (data: unknown) => {
      applyDrawEvent(data as DrawEvent, false);
    });

    conn.on('close', () => {
      connectionsRef.current = connectionsRef.current.filter(
        (c) => c.peer !== conn.peer
      );
      setConnectedPeers(connectionsRef.current.map((c) => c.peer));
      setStatusMsg('Partner disconnected');
    });
  };

  const connectToPeer = (targetId: string, existingPeer?: any) => {
    const p = existingPeer || peerRef.current;
    if (!p || !targetId.trim() || targetId === myPeerId) return;

    setStatusMsg(`Connecting to ${targetId}...`);
    const conn = p.connect(targetId.trim());
    setupConnection(conn);
  };

  const broadcastEvent = (event: DrawEvent) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send(event);
      }
    });
  };

  const applyDrawEvent = (event: DrawEvent, shouldBroadcast: boolean) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (event.type === 'stroke') {
      ctx.strokeStyle = event.color;
      ctx.lineWidth = event.size;
      ctx.beginPath();
      ctx.moveTo(event.x0, event.y0);
      ctx.lineTo(event.x1, event.y1);
      ctx.stroke();
    } else if (event.type === 'text') {
      ctx.fillStyle = event.color;
      ctx.font = `600 ${Math.max(18, event.size * 5)}px var(--font-amiri), sans-serif`;
      ctx.fillText(event.text, event.x, event.y);
    } else if (event.type === 'clear') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (shouldBroadcast) {
      broadcastEvent(event);
    }
  };

  const getCanvasCoords = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);

    if (tool === 'text') {
      setTextPos(pos);
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = pos;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current || tool === 'text') return;

    const currentPos = getCanvasCoords(e);
    const activeColor = tool === 'eraser' ? '#0f172a' : color;
    const activeSize = tool === 'eraser' ? brushSize * 5 : brushSize;

    applyDrawEvent(
      {
        type: 'stroke',
        x0: lastPosRef.current.x,
        y0: lastPosRef.current.y,
        x1: currentPos.x,
        y1: currentPos.y,
        color: activeColor,
        size: activeSize,
      },
      true
    );

    lastPosRef.current = currentPos;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handlePlaceText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textPos || !textInput.trim()) {
      setTextPos(null);
      return;
    }

    applyDrawEvent(
      {
        type: 'text',
        x: textPos.x,
        y: textPos.y,
        text: textInput.trim(),
        color,
        size: brushSize,
      },
      true
    );

    setTextInput('');
    setTextPos(null);
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}/hifzstudy?room=${myPeerId}`;
    navigator.clipboard.writeText(url);
    setStatusMsg('Invite link copied to clipboard!');
  };

  const downloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `quranhifz-board-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="study-wrapper">
      <StudyHeader
        myPeerId={myPeerId}
        remotePeerId={remotePeerId}
        onChangeRemoteId={setRemotePeerId}
        onCopyInvite={copyInviteLink}
        onJoinRoom={() => connectToPeer(remotePeerId)}
      />

      <main className="study-main">
        <div className="study-status-row">
          <span>{statusMsg}</span>
          <span className="sf-badge">
            {connectedPeers.length > 0
              ? `Live (${connectedPeers.length} peer${connectedPeers.length > 1 ? 's' : ''})`
              : 'Solo Mode'}
          </span>
        </div>

        <StudyToolbar
          tool={tool}
          color={color}
          brushSize={brushSize}
          onSelectTool={setTool}
          onSelectColor={setColor}
          onChangeSize={setBrushSize}
          onDownload={downloadBoard}
          onClear={() => applyDrawEvent({ type: 'clear' }, true)}
        />

        {textPos && (
          <form onSubmit={handlePlaceText} className="study-text-prompt">
            <input
              type="text"
              dir="auto"
              autoFocus
              placeholder="Type Arabic or English note..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button type="submit" className="play-btn">
              Place on Board
            </button>
            <button type="button" onClick={() => setTextPos(null)}>
              Cancel
            </button>
          </form>
        )}

        <div className="study-canvas-frame">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="study-canvas"
          />
        </div>
      </main>
    </div>
  );
}
