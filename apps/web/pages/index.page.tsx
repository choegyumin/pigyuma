import Button from '@pigyuma/design-system/components/Button';
import mixins from '@pigyuma/design-system/mixins';
import { useEvent } from '@pigyuma/react-utils';
import { ArtboardData, ShapeLayer, ShapeLayerData, TextLayer, TextLayerData, useUIController } from '@pigyuma/ui-design-tool';
import React from 'react';
import Workspace from '~/components/Workspace';

const dummyData: Array<ArtboardData | ShapeLayerData | TextLayerData> = [
  {
    key: 'artboard-1',
    type: 'artboard',
    name: 'My Artboard',
    x: 100,
    y: 100,
    width: 1024,
    height: 768,
    fill: '#fff',
    children: [
      {
        key: 'text-layer-hello',
        type: 'layer',
        layerType: 'text',
        name: 'Hello',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: '#000000' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'Hello',
      },
      {
        key: 'text-layer-world',
        type: 'layer',
        layerType: 'text',
        name: 'World',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: '#000000' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'World',
      },
      {
        key: 'shape-layer-red',
        type: 'layer',
        layerType: 'shape',
        name: 'Red',
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 100, lengthType: 'px' },
        height: { length: 100, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#ffaaaa' },
        children: [
          {
            key: 'text-layer-1234',
            type: 'layer',
            layerType: 'text',
            name: '1234',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: '#000000' },
            fontSize: { length: 14, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: '1234',
          },
        ],
      },
      {
        key: 'shape-layer-green',
        type: 'layer',
        layerType: 'shape',
        name: 'Green',
        shapeType: 'container',
        x: { length: 300, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 200, lengthType: 'px' },
        height: { length: 200, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#aaffaa' },
        children: [
          {
            key: 'text-layer-abcd',
            type: 'layer',
            layerType: 'text',
            name: 'ABCD',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: '#000000' },
            fontSize: { length: 16, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: 'ABCD',
          },
        ],
      },
      {
        key: 'shape-layer-blue',
        type: 'layer',
        layerType: 'shape',
        name: 'Blue',
        shapeType: 'container',
        x: { length: 600, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 300, lengthType: 'px' },
        height: { length: 300, lengthType: 'px' },
        stroke: { color: '#333333', pattern: 'solid', width: { top: 10, right: 10, bottom: 10, left: 10 } },
        fill: { color: '#aaaaff' },
        children: [
          {
            key: 'text-layer-asdf',
            type: 'layer',
            layerType: 'text',
            name: 'ㅁㄴㅇㄹ',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: '#000000' },
            fontSize: { length: 20, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: 'ㅁㄴㅇㄹ',
          },
        ],
      },
      {
        key: 'shape-layer-yellow',
        type: 'layer',
        layerType: 'shape',
        name: 'Yellow',
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 550, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 350, lengthType: 'px' },
        height: { length: 350, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#ffffaa' },
        children: [
          {
            key: 'text-layer-inside',
            type: 'layer',
            layerType: 'text',
            name: 'inside Artboard',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: '#000000' },
            fontSize: { length: 28, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: 'inside Artboard',
          },
        ],
      },
    ],
  },
  {
    key: 'shape-layer-pink',
    type: 'layer',
    layerType: 'shape',
    name: 'Pink',
    shapeType: 'container',
    x: { length: 650, lengthType: 'px' },
    y: { length: 650, lengthType: 'px' },
    rotate: { degrees: 0 },
    width: { length: 350, lengthType: 'px' },
    height: { length: 350, lengthType: 'px' },
    stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
    fill: { color: '#ffaaff' },
    children: [
      {
        key: 'text-layer-outside',
        type: 'layer',
        layerType: 'text',
        name: 'outside Artboard',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: '#000000' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'outside Artboard',
      },
    ],
  },
];

const Home = () => {
  const uiController = useUIController();

  const onButtonClick = useEvent(() => {
    uiController.set<ShapeLayer>('shape-layer-yellow', { y: { length: 700, lengthType: 'px' } });
    uiController.set<ShapeLayer>('shape-layer-Red', { fill: { color: '#ffaaff' } });
    uiController.set<TextLayer>('text-layer-1234', { textColor: { color: '#ffffff' }, content: 'Setted' });
    uiController.prepend('shape-layer-green', {
      type: 'layer',
      layerType: 'text',
      name: 'prepend()',
      x: { length: 0, lengthType: 'auto' },
      y: { length: 0, lengthType: 'auto' },
      rotate: { degrees: 0 },
      width: { length: 0, lengthType: 'flexible' },
      height: { length: 0, lengthType: 'flexible' },
      textColor: { color: '#000000' },
      fontSize: { length: 16, lengthType: 'px' },
      lineHeight: { length: 150, lengthType: 'percent' },
      fontWeight: { value: 900 },
      letterSpacing: { length: 20, lengthType: 'percent' },
      content: 'Prepended',
    });
    uiController.append(
      'shape-layer-green',
      new TextLayer({
        name: 'append()',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: '#000000' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'Appended',
      }),
    );
    uiController.insertBefore('text-layer-asdf', {
      type: 'layer',
      layerType: 'text',
      name: 'insertBefore()',
      x: { length: 0, lengthType: 'auto' },
      y: { length: 0, lengthType: 'auto' },
      rotate: { degrees: 0 },
      width: { length: 0, lengthType: 'flexible' },
      height: { length: 0, lengthType: 'flexible' },
      textColor: { color: '#000000' },
      fontSize: { length: 16, lengthType: 'px' },
      lineHeight: { length: 150, lengthType: 'percent' },
      fontWeight: { value: 900 },
      letterSpacing: { length: 20, lengthType: 'percent' },
      content: 'Inserted before',
    });
    uiController.insertAfter(
      'text-layer-asdf',
      new TextLayer({
        name: 'insertAfter()',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: '#000000' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'Inserted after',
      }),
    );
    uiController.remove('shape-layer-pink');
    uiController.move('prepend', 'text-layer-hello', 'shape-layer-yellow');
    uiController.move('insertAfter', 'text-layer-world', 'text-layer-inside');
  });

  return (
    <>
      <h1 className={mixins.blind}>Pigyuma</h1>
      <Workspace initialData={dummyData} />
      <Button
        style={{
          position: 'fixed',
          bottom: 16,
          right: 22,
          border: 0,
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 2px 4px hsl(0 0% 0% / 50%)',
          fontSize: 14,
        }}
        onClick={onButtonClick}
      >
        UIDesignTool API Call Test
      </Button>
    </>
  );
};
Home.displayName = 'Home';

export default Home;
