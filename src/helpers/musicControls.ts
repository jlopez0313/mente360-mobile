import { CapacitorMusicControls } from "capacitor-music-controls-plugin";

let elapsedTime = 0;
let isPlaying = true;

// Module-level callback storage — always points to latest handlers
let _onPlay: () => void = () => {};
let _onPause: () => void = () => {};
let _onGoBack: () => void = () => {};
let _onGoNext: () => void = () => {};
let _onSeek: (percentage: number) => void = () => {};
let _listenersRegistered = false;
let _currentDuration = 0;

/**
 * Register the background control listeners exactly once.
 * Call this on mount with stable references (or refs).
 */
export const setupListeners = (
  onPlay: () => void,
  onPause: () => void,
  onGoBack: () => void,
  onGoNext: () => void,
  onSeek: (percentage: number) => void = () => {}
) => {
  // Always update the stored callbacks so they stay current
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;
  _onSeek = onSeek;

  if (_listenersRegistered) return; // Only register once
  _listenersRegistered = true;

  CapacitorMusicControls.addListener("controlsNotification", (action) => {
    handleControlsEvent(action, _onPlay, _onPause, _onGoBack, _onGoNext, _onSeek);
  });

  document.addEventListener("controlsNotification", (event: any) => {
    const info = { message: event.message, position: event.position || 0, elapsed: elapsedTime };
    handleControlsEvent(info, _onPlay, _onPause, _onGoBack, _onGoNext, _onSeek);
  });
};

/**
 * Update callbacks without re-registering listeners.
 * Call this whenever the callbacks change (e.g., track changes).
 */
export const updateCallbacks = (
  onPlay: () => void,
  onPause: () => void,
  onGoBack: () => void,
  onGoNext: () => void,
  onSeek: (percentage: number) => void = () => {}
) => {
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;
  _onSeek = onSeek;
};

export const create = (
  baseURL: string,
  audio: any,
  duration: number,
  onPlay: () => void,
  onPause: () => void,
  onGoBack: () => void,
  onGoNext: () => void,
  onSeek: (percentage: number) => void = () => {}
) => {

  elapsedTime = 0;
  isPlaying = true;
  _currentDuration = duration;

  // Store the initial callbacks
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;
  _onSeek = onSeek;

  CapacitorMusicControls.create({
    track: audio.titulo,
    artist: "Mente360",
    album: audio.categoria?.categoria || '',
    cover: baseURL + audio.imagen,
    hasPrev: true,
    hasNext: true,
    hasClose: true,
    duration: duration * 1000,
    elapsed: elapsedTime,
    hasSkipForward: true,
    hasSkipBackward: true,
    skipForwardInterval: 15,
    skipBackwardInterval: 15,
    hasScrubbing: true, // Enable scrubbing (seeking via the timeline)
    isPlaying: isPlaying,
    dismissable: false,
    ticker: audio.titulo,
    playIcon: "media_play",
    pauseIcon: "media_pause",
    prevIcon: "media_prev",
    nextIcon: "media_next",
    closeIcon: "media_close",
    notificationIcon: "notification",
  })
    .then(() => {
      CapacitorMusicControls.updateElapsed({
        elapsed: elapsedTime,
        isPlaying: true,
      });

      // Only register listeners once
      if (!_listenersRegistered) {
        _listenersRegistered = true;

        CapacitorMusicControls.addListener("controlsNotification", (action) => {
          handleControlsEvent(action, _onPlay, _onPause, _onGoBack, _onGoNext, _onSeek);
        });

        document.addEventListener("controlsNotification", (event: any) => {
          const info = { message: event.message, position: event.position || 0, elapsed: elapsedTime };
          handleControlsEvent(info, _onPlay, _onPause, _onGoBack, _onGoNext, _onSeek);
        });
      }
    })
    .catch((e) => {
      console.error(e);
    });
};

export const updateTrack = (baseURL: string, audio: any, duration: number) => {
  elapsedTime = 0;
  isPlaying = true;
  _currentDuration = duration;

  // Call the new native updateTrack method so it only updates info without destroying the notification
  (CapacitorMusicControls as any).updateTrack({
    track: audio.titulo,
    artist: "Mente360",
    album: audio.categoria?.categoria || '',
    cover: baseURL + audio.imagen,
    hasPrev: true,
    hasNext: true,
    hasClose: true,
    duration: duration * 1000,
    elapsed: 0,
    hasSkipForward: true,
    hasSkipBackward: true,
    skipForwardInterval: 15,
    skipBackwardInterval: 15,
    hasScrubbing: true, // Also need it true here to keep it interactive
    isPlaying: true,
    dismissable: false,
    ticker: audio.titulo,
    playIcon: "media_play",
    pauseIcon: "media_pause",
    prevIcon: "media_prev",
    nextIcon: "media_next",
    closeIcon: "media_close",
    notificationIcon: "notification",
  }).catch((e: any) => {
    console.error("updateTrack native error", e);
  });
};

export const updateElapsed = (currentTime: number) => {
  elapsedTime = currentTime * 1000;
  try {
    CapacitorMusicControls.updateElapsed({
      elapsed: elapsedTime,
      isPlaying: isPlaying,
    });
  } catch (e) {
    console.error("Error updating elapsed:", e);
  }
};

export const toggle = (_isPlaying = true, _elapsed?: number) => {
  isPlaying = _isPlaying;
  if (_elapsed !== undefined) elapsedTime = _elapsed;
  CapacitorMusicControls.updateElapsed({ isPlaying: _isPlaying, elapsed: elapsedTime });
};

export const handleControlsEvent = (
  action: any,
  onPlay = () => {},
  onPause = () => {},
  onGoBack = () => {},
  onGoNext = () => {},
  onSeek = (_percentage: number) => {}
) => {
  const message = action.message;

  switch (message) {
    case "music-controls-next":
      onGoNext();
      break;
    case "music-controls-previous":
      onGoBack();
      break;
    case "music-controls-pause":
      onPause();
      break;
    case "music-controls-play":
      onPlay();
      break;
    case "music-controls-destroy":
      destroy();
      break;
    case "music-controls-toggle-play-pause":
      break;
    case "music-controls-skip-to":
      // action.position is in seconds for Skip To
      // Convert to percentage as expected by onLoad
      if (_currentDuration > 0) {
        let percent = (action.position / _currentDuration) * 100;
        onSeek(percent);
      }
      break;
    case "music-controls-skip-forward":
      break;
    case "music-controls-skip-backward":
      break;
    case "music-controls-seek-to":
      // Seek via timeline scrubbing (Android returns position in ms)
      if (_currentDuration > 0) {
        let positionSecs = (action.position || 0) / 1000;
        let percent = (positionSecs / _currentDuration) * 100;
        
        // Optimistically update the UI to prevent jumping back before onTimeUpdate catches up
        elapsedTime = action.position;
        toggle(isPlaying, elapsedTime);
        
        onSeek(percent);
      }
      break;
    case "music-controls-media-button":
      break;
    case "music-controls-headset-unplugged":
      break;
    case "music-controls-headset-plugged":
      break;
    default:
      break;
  }
};

export const destroy = () => {
  _listenersRegistered = false;
  CapacitorMusicControls.destroy();
};
