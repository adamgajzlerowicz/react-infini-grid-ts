import * as React from 'react';
import './grid.css';

import { Grid } from './grid';

const Item = ({ id }: {id: number}) => {
  return (
    <div className="item-outer">
    <div className="item-inner">
    Item : {id + 1}
    </div>
    </div>
  );
};

const items: JSX.Element[] = Array.from(Array(50)).map((_, i) => <Item id={i} key={i}/>);

class App extends React.Component<{}, {}> {
  render() {
    const height: number = window.innerHeight;
    return (
      <div className="App">
      <Grid items={items} height={height} itemHeight={260} itemWidth={250}/>
      </div>
    );
  }
}

export default App;
