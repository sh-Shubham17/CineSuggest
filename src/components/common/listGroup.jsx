import React from "react";

const ListGroup = (props) => {
  // here also we could do argument desctructuring inplace of object destructuring
  const { items, textProperty, valueProperty, selectedItem, onItemSelect } =
    props;
  return (
    <ul className="list-group ">
      {items.map((item) => (
        <li
          onClick={() => onItemSelect(item)}
          key={item[valueProperty]}
          className={
            item === selectedItem
              ? "list-group-item list-group-item-secondary active"
              : "list-group-item list-group-item-secondary"
          }
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

//assuming every list group data has name and _id property,
//so now after defining default props we need not to send it from movies.jsx( like props)
//but notice these are still in props of listgroup we added as default'props'
//if they have not then we can overrite these default props
ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
