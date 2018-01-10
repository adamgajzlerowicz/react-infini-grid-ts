import * as React from 'react';
import { isMobile } from './utils';
import { ItemWrapper } from './itemWrapper';
import { map } from 'ramda';

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

interface CalculateVisibleItemsType {
  totalItems: number;
  itemsInRow: number;
  wrapperHeight: number;
  amountScrolled: number;
  itemHeight: number;
}

const calculate = {

  wrapperHeight: ({ wrapperWidth, itemWidth, itemHeight, itemsCount }: CalculateWrapperHeightType) => {
    const itemsInRow = calculate.itemsInRow({ wrapperWidth, itemWidth });
    const rowsTotal = itemsCount && itemsInRow ? Math.ceil(itemsCount / itemsInRow) : 0;
    return rowsTotal * itemHeight;
  },

  itemsInRow: ({ wrapperWidth, itemWidth }:{wrapperWidth: number, itemWidth:number}) => {
    return wrapperWidth && itemWidth ? Math.floor(wrapperWidth / itemWidth) : 0;
  },

  size: ({ offsetWidth, itemWidth }: CalculateSizePropsType) => {
    return {
      topSpace: 0,
      bottomSpace: 0,
      visibleItems: 0,
    };
  },

  visibleItemIndices: ({ totalItems, itemsInRow, itemHeight, wrapperHeight, amountScrolled }: CalculateVisibleItemsType) => {
    const first = Math.floor(amountScrolled / itemHeight) * itemsInRow + 1; 

    const last =  Math.floor((amountScrolled + wrapperHeight) / itemHeight) * itemsInRow + itemsInRow;  
    return { first, last }; 
  },

  spaceBefore: () => {
    return 0;
  },

  spaceAfter: () => {
    return 0;
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
    if (this.gridElement) {
      this.setState({
        wrapperHeight: this.gridElement.offsetHeight,
        wrapperWidth: this.gridElement.offsetWidth,
        itemsCount: this.props.items.length,
        itemWidth: this.props.itemWidth,
        itemHeight: this.props.itemHeight,
      });

      this.gridElement.addEventListener('scroll', () => {
        this.setState({ foo: Math.random() });
      });
    }
  }
  
  shouldComponentUpdate(nextProps: Readonly<GridPropsType>, nextState: Readonly<{}>, nextContext: any) {
    // make it smart to not re-render if the same item indexes shown
    calculate.size({ offsetWidth: 0, itemWidth: 0 });
    return true;
  }

  render() {
    const style = { ...gridStyle, height: this.props.wrapperHeight, width: this.props.wrapperWidth || 'auto' };
    const height = calculate.wrapperHeight(this.state); 
    
    const itemsInRow = calculate.itemsInRow({ wrapperWidth: this.props.wrapperWidth ? this.props.wrapperWidth : 0 , itemWidth: this.props.itemWidth }); 

    // const visibleItems: React.Component[] | JSX.Element[] = calculate.visibleItems(this.props.items);
    const visibleIndices = calculate.visibleItemIndices({
      itemsInRow,
      wrapperHeight: this.props.wrapperHeight,
      totalItems: this.state.itemsCount,
      itemHeight: this.props.itemHeight,
      amountScrolled: this.gridElement ? this.gridElement.scrollTop : 0,
    }); 

    const { first, last } = visibleIndices;

    const visibleItems = this.props.items.slice(first, last);

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
