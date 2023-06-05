import React from 'react';

const Box = React.forwardRef((props, ref) => {
  const { as = 'div', ...elementProps } = props;
  return React.createElement(as, { ...elementProps, ref });
});
Box.displayName = 'Box';

export default Box;
