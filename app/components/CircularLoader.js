import React from 'react';
import { css } from '@emotion/react';
import { RotateLoader } from 'react-spinners';

const CircularLoader = () => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div className="sweet-loading">
      <RotateLoader color="#36D7B7" loading={true} css={override} size={20} />
    </div>
  );
};

export default CircularLoader;

