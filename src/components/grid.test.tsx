import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Item } from './item';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Grid, { calculate } from './grid';


const jsdom = require('jsdom');
const { JSDOM } = jsdom;

configure({ adapter: new Adapter() });

const items: JSX.Element[] = Array.from(Array(50)).map((_, i) => <Item id={i} key={i} />);
  
const getWrapper = () => {
  return mount(<Grid itemHeight={250} itemWidth={250} items={items} height={500} width={400}/>);
};

describe('Grid', () => {

  it('renders', () => {
    const wrapper = getWrapper();
    expect(wrapper.length).toBeTruthy();
  });
  
  it('has class name', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid').length).toBeTruthy();
  });

  it('has correct wrapper height', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid').props().style.height).toEqual(500);
  });

  it('has a ref to the main div', () => {
    const wrapper = getWrapper();
    expect(wrapper.instance().gridElement).toBeTruthy();
  });

  it('allows to set width', () => {
    const noWidth = mount(<Grid itemHeight={250} itemWidth={250} items={items} height={500}/>); 
    expect(noWidth.find('.grid').props().style.width).toEqual('auto');

    const withWidth = mount(<Grid itemHeight={250} itemWidth={250} items={items} height={500} width={400}/>); 
    expect(withWidth.find('.grid').props().style.width).toEqual(400);
  });

  it('sets wrapper width to state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state().wrapperWidth).toEqual(0);
  });

  it('sets wrapper height to state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state().wrapperHeight).toEqual(0);
  });

 

  it('sets items count on mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.state().itemsCount).toEqual(50);
  });

  it('sets rest of data on mount', () => {
    const wrapper = getWrapper();
    expect(wrapper.state().itemsCount).toEqual(50);
    expect(wrapper.state().itemWidth).toEqual(250);
    expect(wrapper.state().itemHeight).toEqual(250);
  });

  it('contains inner div', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid .grid-inner').length).toBeTruthy();
  }); 

  it('each child contains a wrapper', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid .grid-inner .item-wrapper').length).toEqual(wrapper.find('.grid .grid-inner .item-outer').length);
  }); 

  it('sets inner height based on amount of items', () => {
    const wrapper = mount(<Grid itemHeight={250} itemWidth={250} items={items} height={500} width={500}/>); 
    const instance = wrapper.setState({ wrapperWidth: 500, wrapperHeight: 500 });
    expect(wrapper.find('.grid .grid-inner').props().style.height).toEqual(6250);
  });

  it('should contain styles for mobile', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid').props().style.WebkitOverflowScrolling).toBeTruthy();
  });
  
  it('should display some children in inner container', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid .grid-inner .item-outer').length).toBeGreaterThan(1); 
  });

  it('should add listener on scroll', () => {
    const wrapper = getWrapper();
    const spy = jest.spyOn(calculate, 'itemsInRow');
    const el = wrapper.find('.grid').instance();
    el.dispatchEvent(new window.Event('scroll'));
    expect(spy).toBeCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('shows space-before item', () => {
    expect(getWrapper().find('.grid .space-before').length).toBe(1); 
  });

  it('shows space-after item', () => {
    expect(getWrapper().find('.grid .space-after').length).toBe(1); 
  });
});


describe('Calculator', () => {

  it('calculates items in row', () => {
    expect(calculate.itemsInRow({ wrapperWidth: 1000, itemWidth: 250 })).toEqual(4);
    expect(calculate.itemsInRow({ wrapperWidth: 999, itemWidth: 250 })).toEqual(3);
  });

  it('calculates correct wrapper height', () => {
    const calculated = calculate.wrapperHeight({ 
      wrapperWidth: 500, 
      itemWidth: 250,
      itemHeight: 250, 
      itemsCount: 50,
    });
    expect(calculated).toEqual(6250);
  });

  it('should have function visibleItems that returns items that are visible', () => {
    const visibleItems = calculate.visibleItemIndices({
      itemsInRow: 2,
      totalItems: 8,
      itemHeight: 20,
      amountScrolled: 30,
      wrapperHeight: 20,
    });

    expect(visibleItems).toEqual({ first: 3, last: 6 });
  }); 

  it('should have function visibleItems that returns items that are visible take_2', () => {
    const visibleItems = calculate.visibleItemIndices({
      itemsInRow: 3,
      totalItems: 11,
      itemHeight: 20,
      amountScrolled: 30,
      wrapperHeight: 20,
    });

    expect(visibleItems).toEqual({ first: 4, last: 9 });
  }); 

  it('calculates space before', () => {
    const calculated = calculate.spaceBefore({ first: 5, itemHeight: 20, itemsInRow: 2 });
    expect(calculated).toEqual(40);
  });

  it('calculates space before', () => {
    const calculated = calculate.spaceBefore({ first: 6, itemHeight: 20, itemsInRow: 1 });
    expect(calculated).toEqual(100);
  });

  it('calculates space after', () => {
    const calculated = calculate.spaceAfter({ last: 6, itemHeight: 20, itemsInRow: 2, containerHeight: 100 });
    expect(calculated).toEqual(40);
  });

  it('calculates space after take 2', () => {
    const calculated = calculate.spaceAfter({ last: 6, itemHeight: 20, itemsInRow: 3, containerHeight: 100 });
    expect(calculated).toEqual(60);
  });
  
});


