export default removeBackground;
export type { ImageSource, Config };
import { Config } from './schema';
type ImageSource = ImageData | ArrayBuffer | Uint8Array | Blob | URL | string;
declare function removeBackground(image: ImageSource, configuration?: Config): Promise<Blob>;
