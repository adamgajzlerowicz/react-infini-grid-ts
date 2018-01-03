import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Index from './index';

describe('index', () => {

  it('renders without crashing', () => {
    require('./index');
    expect(document.getElementById('root')._reactRootContainer).toBeTruthy();
  });

});
