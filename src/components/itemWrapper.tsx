import * as React from 'react';

interface ItemPropsType {
  width: number;
  height: number;
  margin: number;
  child: JSX.Element | React.Component;
}

const ItemWrapper = ({ width, height, margin, child }: ItemPropsType) => {
  const style = {
    height, margin, flexBasis: width - (2 * margin) - 2,
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
