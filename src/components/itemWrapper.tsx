import * as React from 'react';

interface ItemPropsType {
  child: JSX.Element | React.Component;
  itemsInRow: number;
  height: number;
}

const ItemWrapper = ({ height, itemsInRow,  child }: ItemPropsType) => {
  const style = {
    height, 
    flexBasis: 100 / itemsInRow + '%', 
    flexGrow: 1,
  };
  return (
    <div style={style} className="item-wrapper">
      {child}
    </div>
  );
};


export {
  ItemWrapper, ItemWrapper as default,
};
