import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Sliders,
  Trash2,
  Check,
} from 'lucide-react';
import { MUSIC_TRACKS, MusicTrackInfo } from '../audio/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  sfxVolume: number;
  musicVolume: number;
  currentTrackIndex: number;
  isMusicPlaying: boolean;
  onToggleMute: () => void;
  onSetSfxVolume: (v: number) => void;
  onSetMusicVolume: (v: number) => void;
  onSelectTrack: (trackIndex: number) => void;
  onTogglePlayMusic: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  sfxVolume,
  musicVolume,
  currentTrackIndex,
  isMusicPlaying,
  onToggleMute,
  onSetSfxVolume,
  onSetMusicVolume,
  onSelectTrack,
  onTogglePlayMusic,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Bezárás"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Hang & Zene Beállítások
            </h2>
            <p className="text-sm text-slate-400">
              5 pályánként változó zenék és hanghatások
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          {/* Master Volume / Mute */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  isMuted
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-white">Némítás (Mute)</h4>
                <p className="text-xs text-slate-400">
                  {isMuted ? 'Minden hang kikapcsolva' : 'Hangok és zene aktív'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleMute}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {isMuted ? 'Visszakapcsolás' : 'Némítás'}
            </button>
          </div>

          {/* Volume Sliders */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            {/* Music Volume */}
            <div>
              <div className="flex justify-between items-center mb-1 text-slate-300 font-medium">
                <span className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-pink-400" />
                  Háttérzene Hangerő:
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => onSetMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="flex justify-between items-center mb-1 text-slate-300 font-medium">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  Hangeffektek (Lépés, Tolás, Győzelem):
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => onSetSfxVolume(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Soundtrack Jukebox / Track Selector */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  Zeneszámok (5 pályánként automatikusan vált)
                </h4>
                <p className="text-xs text-slate-400">
                  Itt manuálisan is kipróbálhatod vagy beállíthatod a kedvenced:
                </p>
              </div>

              <button
                onClick={onTogglePlayMusic}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs transition"
              >
                {isMusicPlaying && !isMuted ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    Szünet
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Lejátszás
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {MUSIC_TRACKS.map((track, idx) => {
                const isCurrent = idx === currentTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(idx)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isCurrent
                        ? 'bg-purple-950/40 border-purple-500/60 text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isCurrent
                            ? 'bg-purple-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                          <span>{track.title}</span>
                          <span className="text-[10px] text-purple-300 font-normal">
                            ({track.bpm} BPM)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {track.worldName}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                      {track.description.split('.')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-800">
            <span>Mentett pályák és csillagok törlése:</span>
            <button
              onClick={() => {
                if (confirm('Biztosan törölni szeretnéd a mentett pályarekordokat?')) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Rekordok törlése
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/20 active:scale-95"
          >
            Mentés & Bezárás
          </button>
        </div>
      </div>
    </div>
  );
};
