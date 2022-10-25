import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";

export type MediaType = "mp4" | "webm" | "mp3";
export type MediaToolOverlayRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type MediaToolSource = string | Blob | File;
export type MediaToolAudioInsert = { url: string; duration: number };
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
  async convert(
    from: MediaType,
    to: MediaType,
    sourceFile: MediaToolSource
  ): Promise<Blob> {
    const buffer = await fetchFile(sourceFile);
    const name = "test.";
    this.ffmpeg.FS("writeFile", name + from, buffer);
    await this.ffmpeg.run("-i", name + from, name + to);
    const resultBuffer = this.ffmpeg.FS("readFile", name + to);
    const blob = new Blob([resultBuffer]);
    return blob;
  }

  /**
   * 给视频添加画中画视频
   * @param source 原视频
   * @param overlay 画中画的视频
   * 参考 https://www.kancloud.cn/idzqj/customer/1924358
   * @returns
   */
  async addOverlay(
    source: MediaToolSource,
    overlay: MediaToolSource,
    overlayRect: MediaToolOverlayRect
  ): Promise<Blob> {
    const sourceBuffer = await fetchFile(source);
    this.ffmpeg.FS("writeFile", "source.mp4", sourceBuffer);

    console.log("输出source信息");

    await this.ffmpeg.run("-i", "source.mp4");

    const overlayBuffer = await fetchFile(overlay);
    this.ffmpeg.FS("writeFile", "overlay.mp4", overlayBuffer);

    await this.ffmpeg.run(
      "-re",
      "-i",
      "source.mp4",
      '-r',
      '30000/1001',
      '-video_track_timescale',
      '30k',
      "-vf",
      `movie=overlay.mp4, scale=${overlayRect.width}x${overlayRect.height}[test]; [in][test]overlay=x=${overlayRect.x}:y=${overlayRect.y}  [out]`,
      "-vcodec",
      "libx264",
      "output.mp4"
    );

    const resultBuffer = this.ffmpeg.FS("readFile", "output.mp4");
    const blob = new Blob([resultBuffer]);
    return blob;
  }

  /**
   * 给视频拼接多段音频
   * @param video 视频源
   * @param audios
   * 参考 https://stackoverflow.com/questions/44231906/ffmpeg-how-to-merge-multiple-audio-with-time-offset-into-a-video
   */
  async videoAppendAudio(
    video: MediaToolSource,
    audios: MediaToolAudioInsert[]
  ): Promise<Blob> {
    const videoBuffer = await fetchFile(video);
    this.ffmpeg.FS("writeFile", "append-video.mp4", videoBuffer);

    for (let index = 0; index < audios.length; index++) {
      const element = audios[index];
      const audioBuffer = await fetchFile(element.url);
      this.ffmpeg.FS("writeFile", `${index}.mp3`, audioBuffer);
    }

    let ffmpegCommands: string[] = [];
    for (let index = 0; index < audios.length; index++) {
      ffmpegCommands.push("-i");
      ffmpegCommands.push(`${index}.mp3`);
    }
    ffmpegCommands.push(...["-i", "append-video.mp4"]);

    ffmpegCommands.push("-filter_complex");

    let fileterString = "";
    let delay = 0;
    for (let index = 1; index < audios.length; index++) {
      delay += audios[index - 1].duration;
      fileterString +=
        `[${index}]` +
        "adelay=" +
        `${delay * 1000} | ${delay * 1000}` +
        `[s${index}]` +
        ";";
    }

    fileterString += "[0]";

    for (let index = 1; index < audios.length; index++) {
      fileterString += `[s${index}]`;
    }

    fileterString += `amix=${audios.length}[mixout]`;

    ffmpegCommands.push(fileterString);
    ffmpegCommands.push("-map");
    ffmpegCommands.push(`${audios.length}:v`);
    ffmpegCommands.push("-map");
    ffmpegCommands.push("[mixout]");
    ffmpegCommands.push("-c:v");
    ffmpegCommands.push("copy");
    ffmpegCommands.push("append-result.mp4");

    debugger;
    await this.ffmpeg.run(...ffmpegCommands);

    const resultBuffer = this.ffmpeg.FS("readFile", "append-result.mp4");
    const blob = new Blob([resultBuffer]);
    return blob;
  }
}
