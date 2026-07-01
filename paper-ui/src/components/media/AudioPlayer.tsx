import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SketchBorder } from '@paper-ui/core';
import { cn } from '@paper-ui/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

function fmt(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.paused ? a.play() : a.pause();
  }, []);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Number(e.target.value);
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  return (
    <div className={cn('relative', className)} style={{ borderRadius: 8, padding: '12px 16px' }}>
      <SketchBorder stroke="#2c2c2c" strokeWidth={1.6} roughness={1.1} radius={8} />
      <audio ref={audioRef} src={src} preload="metadata" />
      {title && (
        <div style={{ fontSize: '0.82rem', color: '#3a3733', fontFamily: "'Kalam', cursive", marginBottom: 8, fontWeight: 600 }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{ background: '#f0efed', border: '1.5px solid #d4cfc2', borderRadius: 6, cursor: 'pointer', padding: '6px', display: 'flex', color: '#3a3733' }}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={seek}
          style={{ flex: 1, height: 4, accentColor: '#3a3733', cursor: 'pointer' }}
          aria-label="Seek"
        />
        <span style={{ fontSize: '0.72rem', color: '#6b6055', fontFamily: "'Kalam', cursive", minWidth: 70, whiteSpace: 'nowrap' }}>
          {fmt(currentTime)} / {fmt(duration)}
        </span>
        <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6055', padding: 0, display: 'flex' }}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
