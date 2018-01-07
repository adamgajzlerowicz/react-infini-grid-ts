import * as React from 'react';
import { isMobile } from './utils';

const gridStyle = {
  display: 'flex',
  flexGrow: 1,
  flexBasis: 1,
  flexWrap: 'wrap' as 'wrap',
  height: 0,
  overflow: 'auto' as 'auto',
  WebkitOverflowScrolling: isMobile() ? 'touch' as 'touch' : undefined,
};


interface GridPropsType {
  items: React.Component[] | JSX.Element[];
  wrapperHeight: number;
  wrapperWidth?: number;
  itemHeight: number;
  itemWidth: number;
}

interface CalculateSizePropsType {
  offsetWidth: number;
  itemWidth: number;
}

interface CalculateWrapperHeightType {
  wrapperWidth: number;
  itemWidth: number;
  itemHeight: number;
  itemsCount: number;
}

const calculate = {
  wrapperHeight: ({ wrapperWidth, itemWidth, itemHeight, itemsCount }: CalculateWrapperHeightType) => {
    const itemsInRow = wrapperWidth && itemWidth ? Math.floor(wrapperWidth / itemWidth) : 0;
    const rowsTotal = itemsCount && itemsInRow ? Math.ceil(itemsCount / itemsInRow) : 0;
    return rowsTotal * itemHeight;
  },
  size: ({ offsetWidth, itemWidth }: CalculateSizePropsType) => {
    return {
      topSpace: 0,
      bottomSpace: 0,
      visibleItems: 0,
    };
  },
  visibleItems: (items: JSX.Element[] | React.Component[]) => {
    return items;
  },
};

class Grid extends React.Component<GridPropsType> {

  constructor(props: GridPropsType) {
    super(props);
  }
  
  gridElement?: HTMLDivElement = undefined;

  state = {
    itemsCount: 0,
    wrapperHeight: 0,
    wrapperWidth: 0,
    itemWidth: 0, 
    itemHeight: 0,
  };

  componentDidMount() {
    this.gridElement && 
      this.setState({ 
        wrapperHeight: this.gridElement.offsetHeight,
        wrapperWidth: this.gridElement.offsetWidth, 
        itemsCount: this.props.items.length,
        itemWidth: this.props.itemWidth,
        itemHeight: this.props.itemHeight,
      });
  }
  
  shouldComponentUpdate(nextProps: Readonly<GridPropsType>, nextState: Readonly<{}>, nextContext: any) {
    calculate.size({ offsetWidth: 0, itemWidth: 0 });
    return true;
  }

  render() {
    const style = { ...gridStyle, height: this.props.wrapperHeight, width: this.props.wrapperWidth || 'auto' };
    const height = calculate.wrapperHeight(this.state); 
    const visibleItems = calculate.visibleItems(this.props.items);
    return (
      <div 
        className="grid" 
        style={style}
        ref={(e: HTMLDivElement) => {this.gridElement = e;}}
      >
        <div className="grid-inner" style={{ height }}>
          {visibleItems}
        </div>
      </div>
    );
  }
}

export {
  Grid, calculate, Grid as default,
};
