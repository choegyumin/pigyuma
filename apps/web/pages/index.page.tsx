import { useEvent } from '@pigyuma/react-utils';
import { Button } from '@pigyuma/ui';
import { ArtboardData, ShapeLayer, ShapeLayerData, TextLayer, TextLayerData, Workspace, WorkspaceRef } from '@pigyuma/ui-design-tool';
import React, { useEffect, useRef } from 'react';
import NoSSR from '~/components/NoSSR';

const dummyData: Array<ArtboardData | ShapeLayerData | TextLayerData> = [
  {
    key: 'artboard-1',
    type: 'artboard',
    name: 'My Artboard',
    x: 100,
    y: 100,
    width: 1024,
    height: 768,
    children: [
      {
        key: 'text-layer-wow',
        type: 'layer',
        layerType: 'text',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { length: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 28, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 400 },
        letterSpacing: { length: 0, lengthType: 'px' },
        content: 'WOW',
      },
      {
        key: 'shape-layer-100',
        type: 'layer',
        layerType: 'shape',
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { length: 0 },
        width: { length: 100, lengthType: 'px' },
        height: { length: 100, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: 0 },
        fill: { color: '#faa' },
        children: [
          {
            key: 'text-layer-100',
            type: 'layer',
            layerType: 'text',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { length: 0 },
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
        shapeType: 'container',
        x: { length: 300, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { length: 0 },
        width: { length: 200, lengthType: 'px' },
        height: { length: 200, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: 0 },
        fill: { color: '#afa' },
        children: [
          {
            key: 'text-layer-200',
            type: 'layer',
            layerType: 'text',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { length: 0 },
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
        shapeType: 'container',
        x: { length: 600, lengthType: 'px' },
        y: { length: 100, lengthType: 'px' },
        rotate: { length: 0 },
        width: { length: 300, lengthType: 'px' },
        height: { length: 300, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: 0 },
        fill: { color: '#aaf' },
        children: [
          {
            key: 'text-layer-300',
            type: 'layer',
            layerType: 'text',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { length: 0 },
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
        shapeType: 'container',
        x: { length: 100, lengthType: 'px' },
        y: { length: 550, lengthType: 'px' },
        rotate: { length: 0 },
        width: { length: 350, lengthType: 'px' },
        height: { length: 350, lengthType: 'px' },
        stroke: { color: 'transparent', pattern: 'solid', width: 0 },
        fill: { color: '#ffa' },
        children: [
          {
            key: 'text-layer-inside',
            type: 'layer',
            layerType: 'text',
            x: { length: 0, lengthType: 'auto' },
            y: { length: 0, lengthType: 'auto' },
            rotate: { length: 0 },
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
    shapeType: 'container',
    x: { length: 650, lengthType: 'px' },
    y: { length: 650, lengthType: 'px' },
    rotate: { length: 0 },
    width: { length: 350, lengthType: 'px' },
    height: { length: 350, lengthType: 'px' },
    stroke: { color: 'transparent', pattern: 'solid', width: 0 },
    fill: { color: '#faf' },
    children: [
      {
        key: 'text-layer-outside',
        type: 'layer',
        layerType: 'text',
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { length: 0 },
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
  const workspaceRef = useRef<WorkspaceRef>(null);

  useEffect(() => {
    /** @todo NoSSR을 위한 hook 구현 */
    window.requestAnimationFrame(() => {
      console.log('Records: ', workspaceRef.current?.records);
    });
  }, []);

  const onButtonClick = useEvent(() => {
    const workspace = workspaceRef.current;
    if (workspace == null) {
      return;
    }
    workspace.set<ShapeLayer>('shape-layer-inside', { y: { length: 700, lengthType: 'px' } });
    workspace.set<ShapeLayer>('shape-layer-100', { fill: { color: '#faf' } });
    workspace.set<TextLayer>('text-layer-100', { textColor: { color: 'white' }, content: 'set()' });
    workspace.append(
      'shape-layer-200',
      new TextLayer({
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { length: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'append()',
      }),
    );
    workspace.prepend(
      'shape-layer-300',
      new TextLayer({
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { length: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'prepend()',
      }),
    );
    workspace.insert(
      'text-layer-300',
      new TextLayer({
        x: { length: 0, lengthType: 'auto' },
        y: { length: 0, lengthType: 'auto' },
        rotate: { length: 0 },
        width: { length: 0, lengthType: 'flexible' },
        height: { length: 0, lengthType: 'flexible' },
        textColor: { color: 'black' },
        fontSize: { length: 16, lengthType: 'px' },
        lineHeight: { length: 150, lengthType: 'percent' },
        fontWeight: { value: 900 },
        letterSpacing: { length: 20, lengthType: 'percent' },
        content: 'insert()',
      }),
    );
    workspace.remove('shape-layer-outside');

    console.log('Records: ', workspaceRef.current?.records);
  });

  return (
    <NoSSR>
      <Workspace ref={workspaceRef} initialData={dummyData} />
      <Button
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          border: 0,
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 2px 4px hsl(0 0% 0% / 50%)',
          fontSize: 14,
        }}
        onClick={onButtonClick}
      >
        Workspace API Call Test
      </Button>
    </NoSSR>
  );
};
Home.displayName = 'Home';

export default Home;
