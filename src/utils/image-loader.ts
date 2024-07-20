export function ImageLoader({ src, width, quality }) {
  return `${src}?w=${width}&q=${quality || 75}`;
}

export default ImageLoader;
