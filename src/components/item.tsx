import * as React from 'react';

const Item = ({ id }: {id: number}) => {
  return (
    <div className="item-outer">
      <div className="item-inner">
        Item : {id + 1}
      </div>
    </div>
  );
};


export {
  Item, Item as default,
};
