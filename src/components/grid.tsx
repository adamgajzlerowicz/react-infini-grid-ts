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

interface CalculateSpaceBeforeType {
  itemHeight: number;
  itemsInRow: number;
  first: number;
}

interface CalculateSpaceAfterType {
  itemHeight: number;
  containerHeight: number;
  itemsInRow: number;
  last: number;
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

  visibleItemIndices: ({ totalItems, itemsInRow, itemHeight, wrapperHeight, amountScrolled }: CalculateVisibleItemsType) => {
    const first = Math.floor(amountScrolled / itemHeight) * itemsInRow + 1; 
    let last =  Math.ceil((amountScrolled + wrapperHeight) / itemHeight) * itemsInRow;  
    if (last > totalItems) {
      last = totalItems;
    }
    return { first, last }; 
  },

  spaceBefore: ({ first, itemHeight, itemsInRow }: CalculateSpaceBeforeType) => {
    const result =  itemHeight * (first - 1) / itemsInRow;
    if (result && result > 0 && result !== Infinity) {
      return result;
    }
    return 0;
  },

  spaceAfter: ({ last, itemHeight, itemsInRow, containerHeight } : CalculateSpaceAfterType) => {
    const result = containerHeight - last * itemHeight / itemsInRow;
    if (result < itemHeight) {
      return 0;
    }
    return result;
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
    return true;
  }

  render() {
    const style = { ...gridStyle, height: this.props.wrapperHeight, width: this.props.wrapperWidth || 'auto' };
    
    const height = calculate.wrapperHeight(this.state); 

    const itemsInRow = calculate.itemsInRow({ wrapperWidth: this.props.wrapperWidth ? this.props.wrapperWidth : 0 , itemWidth: this.props.itemWidth }); 
      
    const visibleIndices = calculate.visibleItemIndices({
      itemsInRow,
      wrapperHeight: this.props.wrapperHeight,
      totalItems: this.state.itemsCount,
      itemHeight: this.props.itemHeight,
      amountScrolled: this.gridElement ? this.gridElement.scrollTop : 0,
    }); 

    const { first, last } = visibleIndices;

    const visibleItems = this.props.items.slice(first - 1, last);

    const spaceBefore = calculate.spaceBefore({
      first,
      itemsInRow, 
      itemHeight: this.props.itemHeight,
    });

    const spaceAfter = calculate.spaceAfter({
      last, itemsInRow, itemHeight: this.props.itemHeight, containerHeight: height, 
    });

    console.log(spaceAfter);

    return (
      <div 
        className="grid" 
        style={style} 
        ref={(e: HTMLDivElement) => {this.gridElement = e;}} 
      >
        <div className="grid-inner" style={{ height, ...gridInner }}>
          <div className="space-before" style={{ height: spaceBefore,  flexBasis: '100%', flexGrow: 1, display: spaceBefore ? 'block' : 'none' }}/>
          {map((el: React.Component | JSX.Element) => <ItemWrapper key={Math.random()} height={this.props.itemHeight} itemsInRow={itemsInRow} child={el} />, visibleItems)}
          <div className="space-after" style={{ height: spaceAfter,  flexBasis: '100%', flexGrow: 1, display: spaceAfter ? 'block' : 'none' }}/>
        </div>
      </div>
    );
  }
}

export {
  Grid, calculate, Grid as default,
};
