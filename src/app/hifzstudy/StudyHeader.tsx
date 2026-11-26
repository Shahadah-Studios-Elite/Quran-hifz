'use client';

import React from 'react';

interface StudyHeaderProps {
  myPeerId: string;
  remotePeerId: string;
  onChangeRemoteId: (val: string) => void;
  onCopyInvite: () => void;
  onJoinRoom: () => void;
}

export default function StudyHeader({
  myPeerId,
  remotePeerId,
  onChangeRemoteId,
  onCopyInvite,
  onJoinRoom,
}: StudyHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <h1>HifzStudy</h1>
        <a
          href="/#read"
          className="brand-tag"
          style={{ textDecoration: 'none' }}
        >
          ← Back to Quran
        </a>
      </div>

      <div className="study-peer-bar">
        <span className="sf-badge" title="Your PeerJS Room ID">
          ID: <strong>{myPeerId}</strong>
        </span>

        <button onClick={onCopyInvite} title="Copy direct room link">
          Copy Invite Link
        </button>

        <input
          type="text"
          placeholder="Partner ID (qh-...)"
          value={remotePeerId}
          onChange={(e) => onChangeRemoteId(e.target.value)}
          className="study-id-input"
        />

        <button className="play-btn" onClick={onJoinRoom}>
          Join Room
        </button>
      </div>
    </header>
  );
}
