import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { isMobile } from './utils';



describe('Utils', () => {
  it('isMobile returns false', () => {
    console.log(document.createEvent);
    expect(isMobile()).toEqual(false);
  });

});
