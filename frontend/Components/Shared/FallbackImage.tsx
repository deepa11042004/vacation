"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string;
  fallbackSrc: string;
}

// Swaps to fallbackSrc if the primary image fails to load (missing file,
// bad path, network error) instead of leaving a broken image on the card.
export default function FallbackImage({ src, fallbackSrc, alt, ...rest }: FallbackImageProps) {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      {...rest}
      alt={alt}
      src={errored ? fallbackSrc : src}
      onError={() => setErrored(true)}
    />
  );
}
