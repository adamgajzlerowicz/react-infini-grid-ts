import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { isMobile } from './utils';



describe('Utils', () => {
  
  it('returns true', () => {
    const spy = jest.spyOn(document, 'createEvent');
    spy.mockReturnValue(true);
    
    expect(isMobile()).toEqual(true);
    expect(spy).toHaveBeenCalled();
    
    spy.mockReset();
    spy.mockRestore();
  });
  
  it('throws and returns false', () => {
    const createEvent = document.createEvent;

    document.createEvent = () => {
      throw 'dupa';
    };
    
    expect(isMobile()).toBe(false);    

    document.createEvent = createEvent;
  });
  
});
