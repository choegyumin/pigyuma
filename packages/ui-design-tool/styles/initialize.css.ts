import rotateECursor from '@/images/cursor-e-rotate.svg';
import rotateNCursor from '@/images/cursor-n-rotate.svg';
import rotateNECursor from '@/images/cursor-ne-rotate.svg';
import rotateNWCursor from '@/images/cursor-nw-rotate.svg';
import rotateSCursor from '@/images/cursor-s-rotate.svg';
import rotateSECursor from '@/images/cursor-se-rotate.svg';
import rotateSWCursor from '@/images/cursor-sw-rotate.svg';
import rotateWCursor from '@/images/cursor-w-rotate.svg';
import { globalStyle } from '@vanilla-extract/css';

globalStyle(':root', {
  vars: {
    '--e-rotate': `url(${rotateECursor.src}) 8 8, grab`,
    '--n-rotate': `url(${rotateNCursor.src}) 8 8, grab`,
    '--ne-rotate': `url(${rotateNECursor.src}) 8 8, grab`,
    '--nw-rotate': `url(${rotateNWCursor.src}) 8 8, grab`,
    '--s-rotate': `url(${rotateSCursor.src}) 8 8, grab`,
    '--se-rotate': `url(${rotateSECursor.src}) 8 8, grab`,
    '--sw-rotate': `url(${rotateSWCursor.src}) 8 8, grab`,
    '--w-rotate': `url(${rotateWCursor.src}) 8 8, grab`,
  },
});
