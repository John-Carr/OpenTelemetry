import React from "react";

function DragAndDrop(props) {
  // Drag State
  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
  };
  const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
  // Drag functions
  const onDragStart = (e) => {
    // We'll access the "data-position" attribute
    // of the current element dragged
    const initialPosition = Number(e.currentTarget.dataset.idx);
    setDragAndDrop({
      // we spread the previous content
      // of the hook variable
      // so we don't override the properties
      // not being updated
      ...dragAndDrop,

      draggedFrom: initialPosition, // set the draggedFrom position
      isDragging: true,
      originalOrder: props.ItemState, // store the current state of "list"
    });

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    e.dataTransfer.setData("text/html", "");
  };

  const onDragOver = (event) => {
    event.preventDefault();

    // Store the content of the original list
    // in this variable that we'll update
    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom;

    // index of the drop area being hovered
    const draggedTo = Number(event.currentTarget.dataset.idx);

    // get the element that's at the position of "draggedFrom"
    const itemDragged = newList[draggedFrom];
    // filter out the item being dragged
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    // update the list
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];
    // since this event fires many times
    // we check if the targets are actually
    // different:
    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,

        // save the updated list state
        // we will render this onDrop
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = () => {
    // we use the updater function
    // for the "list" hook
    props.setItemState(dragAndDrop.updatedOrder);

    // and reset the state of
    // the DnD
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };
  return (
    <>
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          draggable: "true",
          onDragStart: onDragStart,
          onDragOver: onDragOver,
          onDrop: onDrop,
        })
      )}
    </>
  );
}
export default DragAndDrop;
