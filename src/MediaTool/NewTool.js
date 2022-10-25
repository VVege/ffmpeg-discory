import ffmpeg from "ffmpeg.js";
import { fetchFile} from '@ffmpeg/ffmpeg';
//var testData = new Uint8Array(fs.readFileSync("test.webm"));

export function input(data) {
  // Encode test video to VP8.
  var result = ffmpeg({
    MEMFS: [{ name: "test.mp4", data: data }],
    arguments: ["-i", "test.mp4", "-c:v", "libvpx", "-an", "out.webm"],
    // Ignore stdin read requests.
    stdin: function () { },
  });
  // Write out.webm to disk.
  var out = result.MEMFS[0];
  const blob = new Blob([out.data]);
  return blob;
}


export async function addOverlay(source, overlay, overlayRect) {
  const sourceBuffer = await fetchFile(source);

  const overlayBuffer = await fetchFile(overlay);

  var result = ffmpeg({
    MEMFS: [{ name: "source.mp4", data: sourceBuffer }, {name: 'overlay.mp4', data: overlayBuffer}],
    arguments: ['-re', '-i' ,'source.mp4','-r', '25' ,'-vf', `movie=overlay.mp4, scale=${overlayRect.width}x${overlayRect.height}[test]; [in][test]overlay=x=${overlayRect.x}:y=${overlayRect.y}  [out]`, '-vcodec', 'libx264', 'output.mp4'],
    // Ignore stdin read requests.
    stdin: function () { },
  });
  // Write out.webm to disk.
  var out = result.MEMFS[0];
  const blob = new Blob([out.data]);
  return blob;
}