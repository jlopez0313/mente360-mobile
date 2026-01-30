export const getYoutubeLink = (videoID: string | undefined = '') => {
    return `https://www.youtube.com/embed/${getYoutubeVideoId(videoID)}`;
}

export const goToYoutube = (videoID: string | undefined = '') => {
    return `https://www.youtube.com/watch?v=${getYoutubeVideoId(videoID)}`;
}

export const getYoutubeVideoId = (url: string  = '') => {
    let videoId = null;

    const match = url && url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^\&\?\/]+)/);
    if (match) {
        videoId = match[1];
    }
    
    return videoId;
}