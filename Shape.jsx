import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import "./shape.css";

const BOX_DATA = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];
const Shape = () => {
  // flatten the 2d Array

  const boxes = useMemo(() => {
    return BOX_DATA.flat();
  }, [BOX_DATA]);

  const countOfVisibleBoxes = useMemo(() => {
    return boxes.reduce((acc, box) => {
      if (box === 1) {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  }, [boxes]);

  console.log(boxes);

  // Using Set

  const [selectedBoxes, setSelectedBoxes] = useState(new Set());
  const [isUnloading, setIsUnloading] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    const { target } = e || {};

    const status = target.getAttribute(`data-status`);
    const index = target.getAttribute(`data-index`);

    if (index == null || status === `hidden` || isUnloading) {
      return;
    }

    setSelectedBoxes((prev) => {
      return new Set(prev.add(index));
    });
  };

  const unload = () => {
    // Removing boxed with 500ms

    setIsUnloading(true);
    const keys = Array.from(selectedBoxes.keys());

    const removeNextKey = () => {
      if (keys.length !== 0) {
        const currentKey = keys.shift();
        setSelectedBoxes((prev) => {
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        });

        timerRef.current = setTimeout(() => {
          removeNextKey();
        }, 500);
      } else {
        // stop
        setIsUnloading(false);
        clearTimeout(timerRef.current);
      }
    };

    removeNextKey();
  };

  useEffect(() => {
    // selectedBoxes.length >= countOfVisibleBoxes

    if (selectedBoxes.size >= countOfVisibleBoxes) {
      // call unloading Function
      unload();
    }
  }, [selectedBoxes]);
  return (
    <div className="grid-lights" onClick={handleClick}>
      {boxes &&
        boxes.map((box, index) => {
          const status = box === 1 ? `visible` : `hidden`;
          const isSelected = selectedBoxes.has(index.toString());
          return (
            <div
              data-index={index}
              data-status={status}
              className={classNames(`box`, status, isSelected && `selected`)}
              key={`data-${index}`}
            />
          );
        })}
    </div>
  );
};

export default Shape;
