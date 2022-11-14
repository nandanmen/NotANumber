import { GridBackground } from "./Grid";

type ImageProps = {
  href: string;
};

export function Image({ href }: ImageProps) {
  return (
    <GridBackground>
      <img src={href} />
    </GridBackground>
  );
}
