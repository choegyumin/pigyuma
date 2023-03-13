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
        key: 'text-layer-hi',
        type: 'layer',
        layerType: 'text',
        name: 'Text Layer HI',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'HI',
      },
      {
        key: 'text-layer-hello',
        type: 'layer',
        layerType: 'text',
        name: 'Text Layer Hello',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'Hello',
      },
      {
        key: 'shape-layer-100',
        type: 'layer',
        layerType: 'shape',
        name: 'Shape Layer 100',
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 100, lengthType: 'px' },
        height: { length: 100, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#faa' },
        children: [
          {
            key: 'text-layer-100',
            type: 'layer',
            layerType: 'text',
            name: 'Text Layer 100',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: 'black' },
            fontSize: { length: 14, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: '100',
          },
        ],
      },
      {
        key: 'shape-layer-200',
        type: 'layer',
        layerType: 'shape',
        name: 'Shape Layer 200',
        shapeType: 'container',
        x: { length: 300, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 200, lengthType: 'px' },
        height: { length: 200, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#afa' },
        children: [
          {
            key: 'text-layer-200',
            type: 'layer',
            layerType: 'text',
            name: 'Text Layer 200',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: 'black' },
            fontSize: { length: 16, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: '200',
          },
        ],
      },
      {
        key: 'shape-layer-300',
        type: 'layer',
        layerType: 'shape',
        name: 'Shape Layer 300',
        shapeType: 'container',
        x: { length: 600, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 300, lengthType: 'px' },
        height: { length: 300, lengthType: 'px' },
        stroke: { color: '#333', pattern: 'solid', width: { top: 10, right: 10, bottom: 10, left: 10 } },
        fill: { color: '#aaf' },
        children: [
          {
            key: 'text-layer-300',
            type: 'layer',
            layerType: 'text',
            name: 'Text Layer 300',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: 'black' },
            fontSize: { length: 20, lengthType: 'px' },
            lineHeight: { length: 150, lengthType: 'percent' },
            fontWeight: { value: 400 },
            letterSpacing: { length: 0, lengthType: 'px' },
            content: '300',
          },
        ],
      },
      {
        key: 'shape-layer-inside',
        type: 'layer',
        layerType: 'shape',
        name: 'Shape Layer Inside',
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 550, lengthType: 'px' },
        rotate: { degrees: 0 },
        width: { length: 350, lengthType: 'px' },
        height: { length: 350, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
        fill: { color: '#ffa' },
        children: [
          {
            key: 'text-layer-inside',
            type: 'layer',
            layerType: 'text',
            name: 'Text Layer Inside',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { degrees: 0 },
            width: { length: 0, lengthType: 'flexible' },
            height: { length: 0, lengthType: 'flexible' },
            textColor: { color: 'black' },
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
    key: 'shape-layer-outside',
    type: 'layer',
    layerType: 'shape',
    name: 'Shape Layer Outside',
    shapeType: 'container',
    x: { length: 650, lengthType: 'px' },
    y: { length: 650, lengthType: 'px' },
    rotate: { degrees: 0 },
    width: { length: 350, lengthType: 'px' },
    height: { length: 350, lengthType: 'px' },
    stroke: { color: 'transparent', pattern: 'solid', width: { top: 0, right: 0, bottom: 0, left: 0 } },
    fill: { color: '#faf' },
    children: [
      {
        key: 'text-layer-outside',
        type: 'layer',
        layerType: 'text',
        name: 'Text Layer Outside',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
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
  const uiControllerAPI = useUIController();

  const onButtonClick = useEvent(() => {
    uiControllerAPI.set<ShapeLayer>('shape-layer-inside', { y: { length: 700, lengthType: 'px' } });
    uiControllerAPI.set<ShapeLayer>('shape-layer-100', { fill: { color: '#faf' } });
    uiControllerAPI.set<TextLayer>('text-layer-100', { textColor: { color: 'white' }, content: 'Setted' });
    uiControllerAPI.prepend('shape-layer-200', {
      type: 'layer',
      layerType: 'text',
      name: 'prepend()',
      x: { length: 0, lengthType: 'auto' },
      y: { length: 0, lengthType: 'auto' },
      rotate: { degrees: 0 },
      width: { length: 0, lengthType: 'flexible' },
      height: { length: 0, lengthType: 'flexible' },
      textColor: { color: 'black' },
      fontSize: { length: 16, lengthType: 'px' },
      lineHeight: { length: 150, lengthType: 'percent' },
      fontWeight: { value: 900 },
      letterSpacing: { length: 20, lengthType: 'percent' },
      content: 'Prepended',
    });
    uiControllerAPI.append(
      'shape-layer-200',
      new TextLayer({
        name: 'append()',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'Appended',
      }),
    );
    uiControllerAPI.insertBefore('text-layer-300', {
      type: 'layer',
      layerType: 'text',
      name: 'insertBefore()',
      x: { length: 0, lengthType: 'auto' },
      y: { length: 0, lengthType: 'auto' },
      rotate: { degrees: 0 },
      width: { length: 0, lengthType: 'flexible' },
      height: { length: 0, lengthType: 'flexible' },
      textColor: { color: 'black' },
      fontSize: { length: 16, lengthType: 'px' },
      lineHeight: { length: 150, lengthType: 'percent' },
      fontWeight: { value: 900 },
      letterSpacing: { length: 20, lengthType: 'percent' },
      content: 'Inserted before',
    });
    uiControllerAPI.insertAfter(
      'text-layer-300',
      new TextLayer({
        name: 'insertAfter()',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { degrees: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'Inserted after',
      }),
    );
    uiControllerAPI.remove('shape-layer-outside');
    uiControllerAPI.move('prepend', 'text-layer-hi', 'shape-layer-inside');
    uiControllerAPI.move('insertAfter', 'text-layer-hello', 'text-layer-inside');
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
