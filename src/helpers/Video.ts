export const getYoutubeVideoId = (url: string  = '') => {
    let videoId = null;

    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^\&\?\/]+)/);
    if (match) {
        videoId = match[1];
    }
    
    return videoId;
}