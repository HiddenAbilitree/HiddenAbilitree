import { ImageResponse } from 'next/og';

export const runtime = `edge`;

export const size = {
  height: 180,
  width: 180,
};

export const contentType = `image/png`;

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: `center`,
        background: `linear-gradient(to bottom, hsl(221, 89%, 22%), hsl(220.8, 89%, 72%))`,
        display: `flex`,
        height: `100%`,
        justifyContent: `center`,
        width: `100%`,
      }}
    />,
    {
      ...size,
    },
  );

export default AppleIcon;
