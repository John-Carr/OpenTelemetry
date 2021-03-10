import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Chart from "react-apexcharts";
import Status from "./../Components/DataViews/Status";
import ViewModal from "./../Components/Forms/ViewForm";
const ResponsiveGridLayout = WidthProvider(Responsive);
/**
 *
 * @param {JSON} props
 * ```JSON
 * {
 *  editing: Bool // if the layout should be in edit mode
 * }
 * ```
 */
const defaultOptions = {
  options: {
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
  },
  info: {},
};
const previewSeries = [
  {
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
  {
    data: [91, 70, 60, 49, 50, 45, 40, 30],
  },
  {
    data: [75, 56, 50, 52, 60, 63, 55, 40],
  },
];

function DataDisplay(props) {
  // Layout and graphs are linked by i
  const [layouts, setLayouts] = useState([]);
  /**
   * graphs[n] = {type: String options: {values: [], id: []}}
   */
  const [graphs, setGraphs] = useState([]);
  const [counter, setCounter] = useState(0);
  const [cols, setCols] = useState();
  const addItem = (itemsToAdd) => {
    // copy states
    let newLayouts = [...layouts];
    let newGraphs = [...graphs];
    // Create new objects to add to state
    let newLayout = {
      i: counter.toString(),
      x: (newLayouts.length * 2) % (cols || 12),
      y: Infinity, // puts it at the bottom
      w: 4,
      h: 5,
    };
    let newGraphOptions = JSON.parse(JSON.stringify(defaultOptions));
    // Parse the values from the passed object
    let title = [];
    let labels = [];
    for (let val in itemsToAdd) {
      console.log(val);
      // append what will be series data names
      labels.push({
        name: itemsToAdd[val][1].name,
        data: previewSeries[val % previewSeries.length].data,
      });
      if (title.indexOf(itemsToAdd[val][0]) < 0) {
        // append what will be title of the graph
        title.push(itemsToAdd[val][0]);
      }
    }
    // Set the type of the graph for the layout creator
    if (itemsToAdd[0][1].isEnum) {
      newGraphOptions.info.type = "status";
    } else {
      newGraphOptions.info.type = "time";
    }
    // Set title and id for the chart
    newGraphOptions.options.title.text = title.toString();
    newGraphOptions.options.chart.id = title.toString();
    // Set the info for the chart
    newGraphOptions.info.series = labels;
    newGraphOptions.info.i = counter.toString();
    console.log(newGraphOptions);
    // Update the temp arrays
    newGraphs.push(newGraphOptions);
    newLayouts.push(newLayout);
    // Update the state
    setCounter((c) => c + 1);
    setLayouts(newLayouts);
    setGraphs(newGraphs);
  };
  const generateGraph = (el) => {
    // check if the chart is a status or is a time series
    if (el.info.type === "status") {
      // Create a table
      return (
        <Status
          item={{
            title: el.options.title.text,
            values: [
              ["Trip:", "Battery fault"],
              ["shit", "i dont know"],
              ["john", "is Cool"],
            ],
          }}
        />
      );
    } else {
      return <Chart options={el.options} series={el.info.series} type="line" />;
    }
  };
  const onBreakpointChange = (breakpoint, cols) => {
    setCols(cols);
  };
  return (
    <>
      <ViewModal onAdd={addItem} />
      <ResponsiveGridLayout
        className="layout"
        rowHeight={50}
        layouts={layouts}
        onLayoutChange={(curr, all) => {
          setLayouts(curr);
        }}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {graphs.map((el) => (
          <div key={el.info.i}>{generateGraph(el)}</div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
}
export default DataDisplay;
