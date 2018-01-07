import * as React from 'react';
import './grid.css';
import Grid from './grid';
import { Item } from './item';

const items: JSX.Element[] = Array.from(Array(10000)).map((_, i) => <Item id={i} key={i}/>);

class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
        <Grid itemHeight={250} itemWidth={250} items={items} wrapperHeight={500} />
      </div>

    );
  }
}

export default App;
