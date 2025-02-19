import { CapacitorMusicControls } from "capacitor-music-controls-plugin";

let elapsedTime = 0;
let isPlaying = true;

export const create = (baseURL, audio, duration, onPlay, onPause, onGoBack, onGoNext) => {

  console.log( 'has created:', audio, duration )

  // destroy();

  CapacitorMusicControls.create({
    track: audio.titulo, // optional, default : ''
    artist: "Mente360", // optional, default : ''
    album: audio.categoria?.categoria || '', // optional, default: ''
    cover: baseURL + audio.imagen, // optional, default : nothing

    // hide previous/next/close buttons:
    hasPrev: true, // show previous button, optional, default: true
    hasNext: true, // show next button, optional, default: true
    hasClose: true, // show close button, optional, default: false

    // iOS only, all optional
    duration: duration * 1000, // default: 0
    elapsed: elapsedTime, // default: 0
    hasSkipForward: true, // default: false. true value overrides hasNext.
    hasSkipBackward: true, // default: false. true value overrides hasPrev.
    skipForwardInterval: 15, // default: 15.
    skipBackwardInterval: 15, // default: 15.
    hasScrubbing: false, // default: false. Enable scrubbing from control center progress bar

    // Android only, all optional
    isPlaying: isPlaying, // default : true
    dismissable: false, // default : false
    // text displayed in the status bar when the notification (and the ticker) are updated
    ticker: audio.titulo,
    // All icons default to their built-in android equivalents
    // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
    playIcon: "media_play",
    pauseIcon: "media_pause",
    prevIcon: "media_prev",
    nextIcon: "media_next",
    closeIcon: "media_close",
    notificationIcon: "notification",
  })
    .then(() => {
      console.log("background created");

      CapacitorMusicControls.updateElapsed({
        elapsed: elapsedTime,
        isPlaying: true,
      });

      CapacitorMusicControls.addListener("controlsNotification", (action) => {
        console.log("CapacitorMusicControls controlsNotification was fired", action);
        handleControlsEvent(action, onPlay, onPause, onGoBack, onGoNext);
      });

      document.addEventListener("controlsNotification", (event: any) => {
        console.log("document controlsNotification was fired", event);
        const info = { message: event.message, position: event.position || 0, elapsed: elapsedTime };
        handleControlsEvent(info, onPlay, onPause, onGoBack, onGoNext);
      });
    })
    .catch((e) => {
      console.error(e);
    });
};

export const updateElapsed = ( currentTime: number ) => {
    elapsedTime = currentTime * 1000;
}

export const toggle = (_isPlaying = true, _elapsed = 0) => {
  isPlaying = _isPlaying;
  CapacitorMusicControls.updateElapsed({ isPlaying: _isPlaying, elapsed: _elapsed });
  // CapacitorMusicControls.updateDismissable(isPlaying ? false : true);
};

export const handleControlsEvent = (
  action: any,
  onPlay = () => {},
  onPause = () => {},
  onGoBack = () => {},
  onGoNext = () => {}
) => {
  console.log("hello from handleControlsEvent", action);
  const message = action.message;

  switch (message) {
    case "music-controls-next":
      toggle(true, 0);
      onGoNext();
      console.log(" music-controls-next ");
      break;
    case "music-controls-previous":
      toggle(true, 0);
      onGoBack();
      console.log(" music-controls-previous ");
      break;
    case "music-controls-pause":
      console.log(" music-controls-pause ");
      toggle(false, action.elapsed);
      onPause();
      break;
    case "music-controls-play":
      toggle(true, action.elapsed);
      onPlay();
      console.log(" music-controls-play ");
      break;
    case "music-controls-destroy":
      destroy();
      console.log(" music-controls-destroy ");
      break;

    // External controls (iOS only)
    case "music-controls-toggle-play-pause":
      // do something
      console.log(" music-controls-toggle-play-pause ");
      break;
    case "music-controls-skip-to":
      // do something
      console.log(" music-controls-skip-to ");
      break;
    case "music-controls-skip-forward":
      // Do something
      break;
    case "music-controls-skip-backward":
      // Do something
      console.log(" music-controls-skip-backward ");
      break;

    // Headset events (Android only)
    // All media button events are listed below
    case "music-controls-media-button":
      // Do something
      break;
    case "music-controls-headset-unplugged":
      // Do something
      console.log(" music-controls-headset-unplugged");
      break;
    case "music-controls-headset-plugged":
      // Do something
      console.log(" music-controls-headset-plugged ");
      break;
    default:
      break;
  }
};

export const destroy = () => {
  CapacitorMusicControls.destroy();
};
