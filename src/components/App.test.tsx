import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';

configure({ adapter: new Adapter() });

describe('App', () => {
  
  const component = renderer.create(<App />);
  const tree = component.toJSON();

  it('renders without crashing', () => {
    expect(tree).toBeTruthy();
  });

  it('has class name', () => {
    expect(tree.props.className).toEqual('App');
  });
  
  it('renders Grid comopnent', () => {
    expect(tree.children[0].children[0]).toEqual('Grid');
  });

});
