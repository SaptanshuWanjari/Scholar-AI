import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

function fmt(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function VideoPlayer({ src, poster, width, height, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }, []);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const barStyle: React.CSSProperties = {
    width: '100%',
    height: 4,
    accentColor: '#3a3733',
    cursor: 'pointer',
    background: '#d4cfc2',
    borderRadius: 2,
    outline: 'none',
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ width, height, borderRadius: 8 }}
    >
      <SketchBorder stroke="#2c2c2c" strokeWidth={1.8} roughness={1.2} radius={8} />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        onClick={togglePlay}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', background: '#000' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '24px 12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: playing ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
        className="group-hover:opacity-100"
        onMouseEnter={() => { /* keep visible on hover */ }}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={seek}
          style={barStyle}
          aria-label="Seek"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 0, display: 'flex' }}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span style={{ color: '#fff', fontSize: '0.7rem', fontFamily: "'Kalam', cursive", minWidth: 70 }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 0, display: 'flex', marginLeft: 'auto' }}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
