import { CapacitorMusicControls } from "capacitor-music-controls-plugin";
import { Plugins } from "@capacitor/core";
const { Media } = Plugins;

let elapsedTime = 0;
let intervalId = null;
let isPlaying = true;

export const create = ( title, duration, onPlay, onPause, onGoBack, onGoNext ) => {

  destroy();

  CapacitorMusicControls.create({
    track: title, // optional, default : ''
    artist: "Mente360", // optional, default : ''
    album: "Absolution", // optional, default: ''
    cover:
      "https://media.es.wired.com/photos/6442dda9a566376ee967ba15/4:3/w_2139,h_1604,c_limit/The-Sludgification-Of-Music-Business-503493283.jpg", // optional, default : nothing
    // cover can be a local path (use fullpath 'file:///storage/emulated/...',
    // or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
    // or a remote url ('http://...', 'https://...', 'ftp://...')

    // hide previous/next/close buttons:
    hasPrev: true, // show previous button, optional, default: true
    hasNext: true, // show next button, optional, default: true
    hasClose: true, // show close button, optional, default: false

    // iOS only, all optional
    duration: 5000, // default: 0
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
    ticker: title,
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
      console.log("created");

      intervalId = setInterval(() => {
        elapsedTime++;
        CapacitorMusicControls.updateElapsed({
          elapsed: elapsedTime,
          isPlaying: isPlaying,
          duration: 5000, // default: 0
        })
        .then(() => {
          console.log('success elapsed')
        })
        .catch((e) => {
          console.error(e);
        });
      }, 1000);

      CapacitorMusicControls.addListener('controlsNotification', (action) => {
        console.log("controlsNotification was fired", action);
        handleControlsEvent(action, onPlay, onPause, onGoBack, onGoNext);
      });

      document.addEventListener("controlsNotification", (event) => {
        console.log("controlsNotification was fired", event);
        const info = { message: event.message, position: 0 };
        handleControlsEvent(info, onPlay, onPause, onGoBack, onGoNext);
      });

    })
    .catch((e) => {
      console.error(e);
    });
};

export const toggle = (_isPlaying = true) => {
  isPlaying = _isPlaying
  CapacitorMusicControls.updateIsPlaying({_isPlaying}); // toggle the play/pause notification button
  // CapacitorMusicControls.updateDismissable(isPlaying ? false : true);
};

export const handleControlsEvent = (action, onPlay = () => {}, onPause = () => {}, onGoBack = () => {}, onGoNext = () => {}) => {
  console.log("hello from handleControlsEvent", action);
  const message = action.message;

  switch (message) {
    case "music-controls-next":
      onGoNext();
      console.log(" music-controls-next ");
      break;
    case "music-controls-previous":
      onGoBack();
      console.log(" music-controls-previous ");
      break;
    case "music-controls-pause":
      console.log(" music-controls-pause ");
      toggle(false);
      onPause();
      break;
    case "music-controls-play":
      onPlay();
      console.log(" music-controls-play ");
      toggle(true);
      break;
    case "music-controls-destroy":
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
