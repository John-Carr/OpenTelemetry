import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
function LiveSection(props) {
  const defaultOptions = {
    options: {
      chart: {
        id: "test1",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 1000,
          },
        },
      },
      title: {
        text: "Battery Voltage",
        align: "left",
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      xaxis: {
        type: "datetime",
      },
    },
    series: [
      {
        name: "Pounds",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  };
  const [fields, setFields] = useState([]);
  useEffect(() => {
    axios.get(`/api/telemItem/${props.id}`).then((res) => {
      setFields(res.data.values);
    });
  }, [props.id]);
  return (
    <Container fluid>
      <h1>{props.name}</h1>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {fields.map(({ name }, i) => {
          // this is annoying I couldn't get this to copy any other way
          const graphOptions = JSON.parse(JSON.stringify(defaultOptions));
          graphOptions.options.title.text = name;
          graphOptions.options.chart.id = `chart-${i}`;
          console.log(props.item[name]);
          return (
            <Card key={i}>
              <Chart
                options={graphOptions.options}
                series={
                  graphOptions.series
                  //   props.item[name] > 0
                  //     ? { name: name, data: props.item[name] }
                  //     : { name: name, data: [] }
                }
                type="line"
                width="100%"
              />
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

export default LiveSection;
