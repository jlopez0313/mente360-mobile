import { CapacitorMusicControls } from "capacitor-music-controls-plugin";

let elapsedTime = 0;
let isPlaying = true;

// Module-level callback storage — always points to latest handlers
let _onPlay: () => void = () => {};
let _onPause: () => void = () => {};
let _onGoBack: () => void = () => {};
let _onGoNext: () => void = () => {};
let _listenersRegistered = false;

/**
 * Register the background control listeners exactly once.
 * Call this on mount with stable references (or refs).
 */
export const setupListeners = (
  onPlay: () => void,
  onPause: () => void,
  onGoBack: () => void,
  onGoNext: () => void
) => {
  // Always update the stored callbacks so they stay current
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;

  if (_listenersRegistered) return; // Only register once
  _listenersRegistered = true;

  CapacitorMusicControls.addListener("controlsNotification", (action) => {
    handleControlsEvent(action, _onPlay, _onPause, _onGoBack, _onGoNext);
  });

  document.addEventListener("controlsNotification", (event: any) => {
    const info = { message: event.message, position: event.position || 0, elapsed: elapsedTime };
    handleControlsEvent(info, _onPlay, _onPause, _onGoBack, _onGoNext);
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
  onGoNext: () => void
) => {
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;
};

export const create = (baseURL: string, audio: any, duration: number, onPlay: () => void, onPause: () => void, onGoBack: () => void, onGoNext: () => void) => {

  elapsedTime = 0;
  isPlaying = true;

  // Store the initial callbacks
  _onPlay = onPlay;
  _onPause = onPause;
  _onGoBack = onGoBack;
  _onGoNext = onGoNext;

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
    hasScrubbing: false,
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
          handleControlsEvent(action, _onPlay, _onPause, _onGoBack, _onGoNext);
        });

        document.addEventListener("controlsNotification", (event: any) => {
          const info = { message: event.message, position: event.position || 0, elapsed: elapsedTime };
          handleControlsEvent(info, _onPlay, _onPause, _onGoBack, _onGoNext);
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

  // Update the notification display without re-registering listeners
  CapacitorMusicControls.create({
    track: audio.titulo,
    artist: "Mente360",
    album: audio.categoria?.categoria || '',
    cover: baseURL + audio.imagen,
    hasPrev: true,
    hasNext: true,
    hasClose: true,
    duration: duration * 1000,
    elapsed: 0,
    isPlaying: true,
    dismissable: false,
    ticker: audio.titulo,
    playIcon: "media_play",
    pauseIcon: "media_pause",
    prevIcon: "media_prev",
    nextIcon: "media_next",
    closeIcon: "media_close",
    notificationIcon: "notification",
  }).catch((e) => {
    console.error(e);
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

export const toggle = (_isPlaying = true, _elapsed = 0) => {
  isPlaying = _isPlaying;
  CapacitorMusicControls.updateElapsed({ isPlaying: _isPlaying, elapsed: _elapsed });
};

export const handleControlsEvent = (
  action: any,
  onPlay = () => {},
  onPause = () => {},
  onGoBack = () => {},
  onGoNext = () => {}
) => {
  const message = action.message;

  switch (message) {
    case "music-controls-next":
      toggle(true, 0);
      onGoNext();
      break;
    case "music-controls-previous":
      toggle(true, 0);
      onGoBack();
      break;
    case "music-controls-pause":
      toggle(false, action.elapsed);
      onPause();
      break;
    case "music-controls-play":
      toggle(true, action.elapsed);
      onPlay();
      break;
    case "music-controls-destroy":
      destroy();
      break;
    case "music-controls-toggle-play-pause":
      break;
    case "music-controls-skip-to":
      break;
    case "music-controls-skip-forward":
      break;
    case "music-controls-skip-backward":
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
