import React from 'react';

const Box = React.forwardRef((props, ref) => {
  const { as = 'div', ...componentProps } = props;
  const elementProps = { ...componentProps, ref };
  delete elementProps.component;
  return React.createElement(as, elementProps);
});
Box.displayName = 'Box';

export default Box;
