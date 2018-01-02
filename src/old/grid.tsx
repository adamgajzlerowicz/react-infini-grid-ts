import * as React from 'react';

const NothingToShow = () => {
  const styles = {
    flex: 1,
    textAlign: 'center',
  };

  return (
        <div style={styles} className="nothing-to-see">
        There is nothing to see here
        </div>
  );
};

interface GridPropsType {
  items: React.Component[] | JSX.Element[];
  height: number;
  itemHeight: number;
  itemWidth: number;
}

class Grid extends React.Component<GridPropsType> {
    
  state = {
    visibleItems: [],
    heightOfBefore: 0,
    heightOfAfter: 0,
  };
    
  itemStyle = {};
  itemHeight = 0;
  itemWidth = 0;
  gridContainer = document.createElement('div');
  gridItem?: HTMLDivElement = undefined;
  gridStyle = {
    display: 'flex',
    flexGrow: 1,
    flexBasis: 1,
    flexWrap: 'wrap' as 'wrap',
    height: 0,
    overflow: 'auto' as 'auto',
  };

  constructor(props: GridPropsType) {
    super(props);
        
    this.gridStyle.height = props.height;       
        
    this.itemStyle = {
      flex: '1 0 ' + props.itemHeight + 'px',
      minWidth: props.itemWidth,
      height: props.itemHeight,
    };
    this.itemHeight = props.itemHeight;
    this.itemWidth = props.itemWidth;
        
        
    this.buildGrid = this.buildGrid.bind(this);
  }
    
  componentWillUnmount() {
    this.gridContainer.removeEventListener('scroll', this.buildGrid);
  }
    
  buildGrid() {
    const containerWidth = this.gridContainer.offsetWidth;
        
    const itemsInRow = Math.floor(containerWidth / this.props.itemWidth);
        
    const containerHeight = this.gridContainer.offsetHeight;
        
    const itemsInCol = Math.floor(containerHeight / this.props.itemHeight);
        
    const totalContainerHeight = this.props.items.length / itemsInRow * this.props.itemHeight;
        
    const amountScrolled = this.gridContainer.scrollTop;
        
    const rowsOffset = Math.floor(amountScrolled / this.props.itemHeight);
        
    let heightOfAfter = totalContainerHeight - ((itemsInRow + rowsOffset) * this.props.itemHeight);
    if (heightOfAfter < 0) {
      heightOfAfter = 0;
    }
        
    this.setState({
      heightOfAfter,
      visibleItems: this.props.items.slice(rowsOffset * itemsInRow, (itemsInCol + 3 + rowsOffset) * itemsInRow),
      heightOfBefore: rowsOffset * this.props.itemHeight,
    });
  }
    
  componentDidMount() {
    const buildGrid = this.buildGrid;
    
    buildGrid();

    this.gridContainer.addEventListener('scroll', this.buildGrid);

    window.addEventListener('resize', () => buildGrid(), true);
        
  }
    
  componentWillReceiveProps(nextProps: GridPropsType) {
    this.setState({ items: nextProps.items }, () => {
      this.buildGrid();
      this.gridContainer.scrollTop = 0;
    });
  }

  render() {
    const itemsToShow = this.state.visibleItems.map((item) => {
      return (
        <div key={Math.random()} style={this.itemStyle} >
            {item}
        </div>
      );
    });
    return (
            <div 
                style={this.gridStyle} 
                ref={(item: HTMLDivElement) => {this.gridContainer = item;}}
            >
                <div style={{ flex: '1 1 100%', height: this.state.heightOfBefore }}/>
                {itemsToShow.length > 0 ? itemsToShow : <NothingToShow />}
                <div style={{ flex: '1 1 100%', height: this.state.heightOfAfter }}/>
            </div>
    );
  }
}

export { Grid, Grid as default };
