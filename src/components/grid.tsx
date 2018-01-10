import * as React from 'react';
import { isMobile } from './utils';
import { ItemWrapper } from './itemWrapper';
import { map } from 'rambda';

const gridStyle = {
  height: 0,
  overflow: 'auto' as 'auto',
  WebkitOverflowScrolling: isMobile() ? 'touch' as 'touch' : undefined,
};

const gridInner = {
  display: 'flex' as 'flex',
  flexGrow: 1,
  flexBasis: 1,
  flexWrap: 'wrap' as 'wrap',
  overflow: 'auto' as 'auto', 
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
    const itemsInRow = calculate.itemsInRow({ wrapperWidth, itemWidth });
    const rowsTotal = itemsCount && itemsInRow ? Math.ceil(itemsCount / itemsInRow) : 0;
    return rowsTotal * itemHeight;
  },
  itemsInRow: ({ wrapperWidth, itemWidth }:{wrapperWidth: number, itemWidth:number}) => {
    // console.log('calculating');
    return wrapperWidth && itemWidth ? Math.floor(wrapperWidth / itemWidth) : 0;
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
    // make it smart to not re-render if the same item indexes shown
    calculate.size({ offsetWidth: 0, itemWidth: 0 });
    return true;
  }

  render() {
    const style = { ...gridStyle, height: this.props.wrapperHeight, width: this.props.wrapperWidth || 'auto' };
    const height = calculate.wrapperHeight(this.state); 
    
    const visibleItems: React.Component[] | JSX.Element[] = calculate.visibleItems(this.props.items);

    const itemsInRow = calculate.itemsInRow({ wrapperWidth: this.props.wrapperWidth ? this.props.wrapperWidth : 0 , itemWidth: this.props.itemWidth }); 
    
    return (
      <div 
        className="grid" 
        style={style} 
        ref={(e: HTMLDivElement) => {this.gridElement = e;}} 
      >
        <div className="grid-inner" style={{ height, ...gridInner }}>
          {map((el: React.Component | JSX.Element) => <ItemWrapper key={Math.random()} height={this.props.itemHeight} itemsInRow={itemsInRow} child={el} />, visibleItems)}
        </div>
      </div>
    );
  }
}

export {
  Grid, calculate, Grid as default,
};
