import React, { useEffect, useState } from "react";
import config from "./config.json";
import Quagga from "quagga";
import { Box } from "@mui/material";

const Scanner = props => {
  const { onDetected } = props;
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (scanning) {
      const updatedConfig = {
        ...config,
        inputStream: {
          ...config.inputStream,
          constraints: {
            ...config.inputStream.constraints,
            width: 270,
            height: 200,
          },
        },
      };

      Quagga.init(updatedConfig, err => {
        if (err) {
          console.log(err, "error msg");
        }
        Quagga.start();
      });

      //detecting boxes on stream
      Quagga.onProcessed(result => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              Number(drawingCanvas.getAttribute("width")),
              Number(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter(function(box) {
                return box !== result.box;
              })
              .forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2
            });
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 }
            );
          }
        }
      });

      Quagga.onDetected(detected);
    }

    return () => {
      Quagga.stop();
    };
  }, [scanning]);

  const detected = result => {
    onDetected(result.codeResult.code);
    setScanning(false);
    Quagga.stop();
  };

  return (
    <Box sx={{ width: 300, height: 200, overflow: 'hidden' }}>
      <div id="interactive" className="viewport" style={{ width: '100%', height: '100%' }}>
        {!scanning && (
          <button onClick={() => setScanning(true)}>Scan Again</button>
        )}
      </div>
    </Box>
  );
};

export default Scanner;
