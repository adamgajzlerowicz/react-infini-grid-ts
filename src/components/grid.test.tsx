import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Item } from './item';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Grid, { calculate } from './grid';


const jsdom = require('jsdom');
const { JSDOM } = jsdom;

configure({ adapter: new Adapter() });

const items: JSX.Element[] = Array.from(Array(50)).map((_, i) => <Item id={i} key={i}/>);
  
const getWrapper = () => {
  return mount(<Grid itemHeight={250} itemWidth={250} items={items} wrapperHeight={500} wrapperWidth={400}/>);
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
    const noWidth = mount(<Grid itemHeight={250} itemWidth={250} items={items} wrapperHeight={500}/>); 
    expect(noWidth.find('.grid').props().style.width).toEqual('auto');

    const withWidth = mount(<Grid itemHeight={250} itemWidth={250} items={items} wrapperHeight={500} wrapperWidth={400}/>); 
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

  it('calls calculate size on update', () => {
    const wrapper = getWrapper();
    const spy = jest.spyOn(calculate, 'size');
    wrapper.instance().shouldComponentUpdate();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
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

  it('sets inner height based on amount of items', () => {
    const wrapper = mount(<Grid itemHeight={250} itemWidth={250} items={items} wrapperHeight={500} wrapperWidth={500}/>); 
    const instance = wrapper.setState({ wrapperWidth: 500, wrapperHeight: 500 });
    expect(wrapper.find('.grid .grid-inner').props().style.height).toEqual(6250);
  });


  it('should contain styles for mobile', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('.grid').props().style.WebkitOverflowScrolling).toBeTruthy();
  });
  
});


describe('Calculator', () => {
  it('contains size', () => {
    expect(calculate.size).toBeTruthy();
  });

  it('calculate returns correct params', () => {
    const result = calculate.size({ offsetWidth: 0, itemWidth:0 });
    const keys = Object.keys(result);
    expect(keys).toContain('topSpace');
    expect(keys).toContain('bottomSpace');
    expect(keys).toContain('visibleItems');
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
});


