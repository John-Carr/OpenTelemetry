import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import Chart from "react-apexcharts";
import Status from "./../Components/DataViews/Status";
import ViewModal from "./../Components/Forms/ViewForm";
const defaultOptions = {
  chart: {
    id: "basic-line",
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
  },
  title: {
    text: "Battery Voltage",
    align: "left",
  },
};
const initLayout = [
  { i: "a", x: 0, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
  { i: "b", x: 1, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
  { i: "c", x: 4, y: 0, w: 3, h: 5, minW: 3, minH: 5 },
];
const minWidth = 3;
const minHeight = 5;
const previewSeries = [
  {
    name: "series-0",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
  {
    name: "series-1",
    data: [91, 70, 60, 49, 50, 45, 40, 30],
  },
  {
    name: "series-2",
    data: [75, 56, 50, 52, 60, 63, 55, 40],
  },
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
    ls.layout = [];
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
    console.log("List: ");
    console.log(newList);
    setLayout(newList);
  };
  const onBreakpointChange = (breakpoint, cols) => {
    setCols(cols);
  };
  const generateLayout = (el) => {
    console.log("element");
    console.log(el);
    console.log(layout);
    if (el.info.type === "status") {
      return (
        <Status
          item={{
            title: el.info.title,
            values: [
              ["Trip:", "Battery fault"],
              ["shit", "i dont know"],
              ["john", "is Cool"],
            ],
          }}
        />
      );
    } else {
      let options = JSON.parse(JSON.stringify(defaultOptions));
      options.chart.id = el.info.title;
      options.title.text = el.info.title;
      let series = [];
      for (let i = 0; i < el.info.values.length; i++) {
        let temp = JSON.parse(JSON.stringify(previewSeries[i]));
        temp.name = el.info.values[i];
        series.push(temp);
      }
      return <Chart options={options} series={series} type="line" />;
    }
  };
  return (
    <>
      <ViewModal onAdd={addItem} />
      <GridLayout
        className="layout"
        onLayoutChange={setLayout}
        cols={12}
        rowHeight={30}
        width={1200}
        onBreakpointChange={onBreakpointChange}
      >
        {layout.map((el, i) => (
          <div data-grid={el.layout} key={i}>
            {generateLayout(el)}
          </div>
        ))}
      </GridLayout>
    </>
  );
}

export default CreateView;
