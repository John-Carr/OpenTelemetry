import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Chart from "react-apexcharts";
import Status from "./../Components/DataViews/Status";
import ViewModal from "./../Components/Forms/ViewForm";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import axios from "axios";
import GPS from "../Components/DataViews/GPS";
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
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
    title: {
      text: "Battery Voltage",
      align: "left",
    },
    tooltip: {
      enabled: true,
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
const edit = true;
function DataDisplay(props) {
  const { vehicle, name } = useParams();
  // Layout and graphs are linked by i
  const [layouts, setLayouts] = useState({ lg: [], md: [] });
  /**
   * graphs[n] = {type: String options: {values: [], id: []}}
   */
  const [graphs, setGraphs] = useState([]);
  const [counter, setCounter] = useState(0);
  const [cols, setCols] = useState();
  const addItem = (itemsToAdd) => {
    // copy states
    let newLayouts = { ...layouts };
    let newGraphs = [...graphs];
    // Create new objects to add to state
    let newLayout = {
      i: counter.toString(),
      x: (newLayouts.lg.length * 2) % (cols || 12), // TODO update this to support more screens
      y: Infinity, // puts it at the bottom
      w: 4,
      h: 5,
    };
    let newGraphOptions = JSON.parse(JSON.stringify(defaultOptions));
    // Parse the values from the passed object
    let title = [];
    let labels = [];
    for (let val in itemsToAdd) {
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
    // Update the temp arrays
    newGraphs.push(newGraphOptions);
    newLayouts.lg.push(newLayout);
    // Update the state
    setCounter((c) => c + 1);
    setLayouts(newLayouts);
    setGraphs(newGraphs);
  };
  const handleRemove = (e) => {
    const updatedGraphs = [...graphs];
    const updatedLayout = { ...layouts };
    // remove from graphs list
    for (const el in updatedGraphs) {
      const element = updatedGraphs[el];
      // check to see if the indexes match if so we found the one we want to remove
      if (element.info.i === e.target.dataset.idx) {
        updatedGraphs.splice(el, 1);
      }
    }
    // go through the layouts and remove refrences to the graph
    for (const el in updatedLayout) {
      if (Object.hasOwnProperty.call(updatedLayout, el)) {
        const element = updatedLayout[el];
        for (let j = 0; j < element.length; j++) {
          if (element[j].i === e.target.dataset.idx) {
            // remove from object list
            updatedLayout[el].splice(j, 1);
            // only ever remove one
            break;
          }
        }
      }
    }
    setGraphs(updatedGraphs);
    setLayouts(updatedLayout);
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
    } else if (el.info.type === "time") {
      el.options.chart.toolbar.show = !edit;
      el.options.tooltip.enabled = !edit;
      el.options.chart.zoom.enabled = !edit;
      return (
        <Chart
          height="100%"
          options={el.options}
          series={el.info.series}
          type="line"
        />
      );
    } else if (el.info.type === "GPS") {
      return <GPS />;
    }
  };
  const onBreakpointChange = (breakpoint, cols) => {
    setCols(cols);
  };
  const handleSave = () => {
    console.log(vehicle);
    console.log(name);
    console.log(layouts);
    console.log(graphs);
    let item = {
      graphs: graphs,
      layouts: layouts,
      name: name,
      vehicle: vehicle,
    };
    axios.post("/api/views", item);
  };
  return (
    <>
      <ViewModal onAdd={addItem} />
      <Button onClick={handleSave}>Save</Button>
      <ResponsiveGridLayout
        className="layout"
        isDraggable={edit}
        isResizable={edit}
        rowHeight={50}
        layouts={layouts}
        onLayoutChange={(curr, all) => {
          setLayouts(all);
        }}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {graphs.map((el) => (
          <div style={edit ? { border: "dashed" } : null} key={el.info.i}>
            {edit && (
              <span
                data-idx={el.info.i}
                className="remove"
                onClick={handleRemove}
                style={{
                  cursor: "pointer",
                  marginRight: "1rem",
                  right: 0,
                  top: 0,
                  position: "absolute",
                  zIndex: 100,
                }}
              >
                x
              </span>
            )}
            {generateGraph(el)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </>
  );
}
export default DataDisplay;
