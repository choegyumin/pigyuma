import { ShapeDrawingElement, TextDrawingElement, Workspace } from '@pigyuma/ui-design-tool';
import { useState } from 'react';

const Home = () => {
  const [data] = useState([
    new TextDrawingElement({
      fontSize: { value: 28, unitType: 'px' },
      lineHeight: { value: 150, unitType: 'percent' },
      fontWeight: { value: 400 },
      letterSpacing: { value: 0, unitType: 'px' },
      children: 'WOW',
    }),
    new ShapeDrawingElement({
      type: 'container',
      x: { value: 50, unitType: 'px' },
      y: { value: 50, unitType: 'px' },
      width: { value: 50, unitType: 'fixed' },
      height: { value: 50, unitType: 'fixed' },
      children: [
        new TextDrawingElement({
          fontSize: { value: 14, unitType: 'px' },
          lineHeight: { value: 150, unitType: 'percent' },
          fontWeight: { value: 400 },
          letterSpacing: { value: 0, unitType: 'px' },
          children: '50',
        }),
      ],
    }),
    new ShapeDrawingElement({
      type: 'container',
      x: { value: 100, unitType: 'px' },
      y: { value: 100, unitType: 'px' },
      width: { value: 100, unitType: 'fixed' },
      height: { value: 100, unitType: 'fixed' },
      children: [
        new TextDrawingElement({
          fontSize: { value: 16, unitType: 'px' },
          lineHeight: { value: 150, unitType: 'percent' },
          fontWeight: { value: 400 },
          letterSpacing: { value: 0, unitType: 'px' },
          children: '100',
        }),
      ],
    }),
    new ShapeDrawingElement({
      type: 'container',
      x: { value: 200, unitType: 'px' },
      y: { value: 200, unitType: 'px' },
      width: { value: 200, unitType: 'fixed' },
      height: { value: 200, unitType: 'fixed' },
      children: [
        new TextDrawingElement({
          fontSize: { value: 20, unitType: 'px' },
          lineHeight: { value: 150, unitType: 'percent' },
          fontWeight: { value: 400 },
          letterSpacing: { value: 0, unitType: 'px' },
          children: '200',
        }),
      ],
    }),
    new ShapeDrawingElement({
      type: 'container',
      x: { value: 400, unitType: 'px' },
      y: { value: 400, unitType: 'px' },
      width: { value: 400, unitType: 'fixed' },
      height: { value: 400, unitType: 'fixed' },
      children: [
        new TextDrawingElement({
          fontSize: { value: 28, unitType: 'px' },
          lineHeight: { value: 150, unitType: 'percent' },
          fontWeight: { value: 400 },
          letterSpacing: { value: 0, unitType: 'px' },
          children: '400',
        }),
      ],
    }),
  ]);

  return <Workspace data={data} />;
};
Home.displayName = 'Home';

export default Home;
