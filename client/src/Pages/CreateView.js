import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import Chart from "react-apexcharts";
import Status from "./../Components/DataViews/Status";
import ViewModal from "./../Components/Forms/ViewForm";
const defaultOptions = {
  options: {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
    title: {
      text: "Battery Voltage",
      align: "left",
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};
const initLayout = [
  { i: "a", x: 0, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
  { i: "b", x: 1, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
  { i: "c", x: 4, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
];
// function to set initial layout
const setInitLayout = () => {
  let ls = {};
  //   if (global.localStorage) {
  //     try {
  //       ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
  //     } catch (e) {
  //       /*Ignore*/
  //     }
  //   }
  if (!ls.layout) {
    ls.layout = initLayout;
  }
  return ls.layout;
};
function CreateView(props) {
  const [counter, setCounter] = useState(0);
  const [cols, setCols] = useState(0);
  // Holds the position of the widgets in state
  const [layout, setLayout] = useState(setInitLayout);
  const addItem = (itemsToAdd) => {
    // copy state
    let newList = [...layout];
    let newInfo = {
      layout: {
        i: counter,
        x: (layout.length * 2) % (cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      },
      info: {
        type: "",
        title: "",
        values: [],
      },
    };
    console.log(itemsToAdd);
    // if the first value is an enum we can assume all the others are enums
    let title = [];
    let labels = [];
    for (let val in itemsToAdd) {
      labels.push(itemsToAdd[val][1].name);
      if (title.indexOf(itemsToAdd[val][0]) < 0) {
        title.push(itemsToAdd[val][0]);
      }
    }
    if (itemsToAdd[0][1].isEnum) {
      newInfo.info.type = "status";
    } else {
      newInfo.info.type = "time";
    }
    newInfo.info.title = title;
    newInfo.info.values = labels;
    console.log(newInfo);
    // inc counter b/c we are adding a new item and the id needs to be unique
    setCounter((c) => c + 1);
    newList.push(newInfo);
    setLayout(newList);
  };
  const onBreakpointChange = (breakpoint, cols) => {
    setCols(cols);
  };
  const generateLayout = (el) => {
    if ((el.info.type = "status"))
      return (
        <Status
          item={{
            title: "BMS",
            values: [
              ["Trip:", "Battery fault"],
              ["shit", "i dont know"],
              ["john", "is Cool"],
            ],
          }}
        />
      );
  };
  return (
    <>
      <ViewModal onAdd={addItem} />
      <GridLayout
        className="layout"
        layout={layout}
        onLayoutChange={setLayout}
        cols={12}
        rowHeight={30}
        width={1200}
        onBreakpointChange={onBreakpointChange}
      >
        <div key="a">
          <Chart
            options={defaultOptions.options}
            series={defaultOptions.series}
            type="line"
          />
        </div>
        <div key="b">
          <Status
            item={{
              title: "BMS",
              values: [
                ["Trip:", "Battery fault"],
                ["shit", "i dont know"],
                ["john", "is Cool"],
              ],
            }}
          />
        </div>
        <div key="c">c</div>
      </GridLayout>
    </>
  );
}

export default CreateView;
