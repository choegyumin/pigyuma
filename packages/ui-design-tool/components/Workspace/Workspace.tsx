import {
  isShapeDrawingElementModel,
  isTextDrawingElementModel,
  ShapeDrawingElementValues,
  TextDrawingElementValues,
} from '@/models/DrawingElement';
import clsx from 'clsx';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { WorkspaceProps } from './types';
import * as styles from './Workspace.css';

const Workspace: React.FC<WorkspaceProps> = (props) => {
  const { data, ...attrs } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const draw = (
      selection: d3.Selection<HTMLDivElement, ShapeDrawingElementValues | TextDrawingElementValues, HTMLDivElement | null, unknown>,
    ): typeof selection | undefined => {
      const current = selection;

      current
        .filter(isShapeDrawingElementModel)
        .style('box-sizing', 'border-box')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0')
        .style('transform', ({ x, y }) => `translate3d(${x}, ${y}, 0)`)
        .style('width', ({ width }) => width)
        .style('height', ({ height }) => height)
        .style('border', '4px dashed black')
        .exit()
        .remove();

      current
        .filter(isTextDrawingElementModel)
        .style('font-size', ({ fontSize }) => fontSize)
        .style('line-height', ({ lineHeight }) => lineHeight)
        .style('font-weight', ({ fontWeight }) => fontWeight)
        .style('letter-spacing', ({ letterSpacing }) => letterSpacing)
        .text((value) => value.children as string)
        .exit()
        .remove();

      const children = current
        .selectAll('div')
        .data((data) => data.children as Array<ShapeDrawingElementValues | TextDrawingElementValues>)
        .enter()
        .filter((it) => typeof it === 'object')
        .append('div');

      if (!children.empty()) {
        return draw(children as typeof selection);
      }
    };

    const root = d3
      .select(rootRef.current)
      .selectAll('div')
      .data(data.map((it) => it.values))
      .enter()
      .append('div');
    draw(root);
  }, [data]);

  return <div {...attrs} data-ui-design-tool-name="workspace" ref={rootRef} className={clsx(styles.root, attrs.className)} />;
};
Workspace.displayName = 'Workspace';

export default Workspace;
