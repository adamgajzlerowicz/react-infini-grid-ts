import * as React from 'react';
import * as renderer from 'react-test-renderer';

import ItemWrapper from './itemWrapper';

describe('NothingToShow', () => {

  const Child = () => {
    return <div>blah</div>;
  };

  const component = renderer.create(<ItemWrapper width={250} height={250} margin={10} child={<Child />}/>);
  const tree = component.toJSON();
  
  it('renders', () => {
    expect(tree).toBeTruthy();
  });
  
  it('has class name', () => {
    expect(tree.children[0].children[0]).toEqual('blah');
  });
  

  it('matches the snapshot', () => {
    expect(tree).toMatchSnapshot();
  });

  it('sets correct styles from props', () => {
    expect(tree.props.style.flexBasis).toEqual(228);
  });
  
});
