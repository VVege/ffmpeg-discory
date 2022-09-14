import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';

export type MediaType = 'mp4' | 'webm' | 'mp3';
export type MediaToolOverlayRect = {x: number, y: number, width: number, height: number}
export class MediaTool {
    private ffmpeg: FFmpeg;

    constructor() {
     this.ffmpeg = createFFmpeg({ log: true });
    }

    load(): Promise<void> {   
        return this.ffmpeg.load();
    }

    destroy() {
        this.ffmpeg.exit();
    }

    /**
     * 格式转换
     * @param from 当前格式 
     * @param to 转换格式
     * @param sourceFile 当前文件
     * @returns 
     */
    async convert(from: MediaType, to: MediaType, sourceFile: Blob | string): Promise<Blob> {
        const buffer = await fetchFile(sourceFile);
        const name = 'test.';
        this.ffmpeg.FS('writeFile', name  + from, buffer);
        await this.ffmpeg.run('-i', name + from, name + to);
        const resultBuffer = this.ffmpeg.FS('readFile', name + to);
        const blob = new Blob([resultBuffer]);
        return blob;
    }

    /**
     * 给视频添加画中画视频
     * @param source 原视频
     * @param overlay 画中画的视频
     * @returns 
     */
    async addOverlay(source: Blob | string, overlay: Blob | string, overlayRect: MediaToolOverlayRect): Promise<Blob> {
        const sourceBuffer = await fetchFile(source);
        this.ffmpeg.FS('writeFile', 'source.mp4', sourceBuffer);

        const overlayBuffer = await fetchFile(overlay);
        this.ffmpeg.FS('writeFile', 'overlay.mp4', overlayBuffer);

        await this.ffmpeg.run('-re', '-i' ,'source.mp4', '-vf', 'movie=overlay.mp4, scale=480x320[test]; [in][test]overlay [out]', '-vcodec', 'libx264', 'output.mp4');

        const resultBuffer = this.ffmpeg.FS('readFile', 'output.mp4');
        const blob = new Blob([resultBuffer]);
        return blob;
    }

    async videoAppendAudio(video: Blob | string, audio: Blob | string): Promise<Blob> {
        const videoBuffer = await fetchFile(video);
        this.ffmpeg.FS('writeFile', 'append-video.mp4', videoBuffer);

        const audioBuffer = await fetchFile(audio);
        this.ffmpeg.FS('writeFile', 'append-audio.mp4', audioBuffer);

    }
}