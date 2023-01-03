import { parseSVG, type Command } from "svg-path-parser";
export type { Command } from "svg-path-parser";

export const parse = parseSVG;

export function radian(ux: number, uy: number, vx: number, vy: number) {
  let dot = ux * vx + uy * vy;
  let mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
  let rad = Math.acos(dot / mod);
  if (ux * vy - uy * vx < 0.0) {
    rad = -rad;
  }
  return rad;
}

//conversion_from_endpoint_to_center_parameterization
//sample :  svgArcToCenterParam(200,200,50,50,0,1,1,300,200)
// x1 y1 rx ry φ fA fS x2 y2
export function svgArcToCenterParam(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  phi: number,
  fA: boolean,
  fS: boolean,
  x2: number,
  y2: number
) {
  let cx: number,
    cy: number,
    startAngle: number,
    deltaAngle: number,
    endAngle: number;
  let PIx2 = Math.PI * 2.0;

  if (rx < 0) {
    rx = -rx;
  }
  if (ry < 0) {
    ry = -ry;
  }
  if (rx == 0.0 || ry == 0.0) {
    // invalid arguments
    throw Error("rx and ry can not be 0");
  }

  let s_phi = Math.sin(phi);
  let c_phi = Math.cos(phi);
  let hd_x = (x1 - x2) / 2.0; // half diff of x
  let hd_y = (y1 - y2) / 2.0; // half diff of y
  let hs_x = (x1 + x2) / 2.0; // half sum of x
  let hs_y = (y1 + y2) / 2.0; // half sum of y

  // F6.5.1
  let x1_ = c_phi * hd_x + s_phi * hd_y;
  let y1_ = c_phi * hd_y - s_phi * hd_x;

  // F.6.6 Correction of out-of-range radii
  //   Step 3: Ensure radii are large enough
  let lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
  if (lambda > 1) {
    rx = rx * Math.sqrt(lambda);
    ry = ry * Math.sqrt(lambda);
  }

  let rxry = rx * ry;
  let rxy1_ = rx * y1_;
  let ryx1_ = ry * x1_;
  let sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
  if (!sum_of_sq) {
    throw Error("start point can not be same as end point");
  }
  let coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
  if (fA == fS) {
    coe = -coe;
  }

  // F6.5.2
  let cx_ = (coe * rxy1_) / ry;
  let cy_ = (-coe * ryx1_) / rx;

  // F6.5.3
  cx = c_phi * cx_ - s_phi * cy_ + hs_x;
  cy = s_phi * cx_ + c_phi * cy_ + hs_y;

  let xcr1 = (x1_ - cx_) / rx;
  let xcr2 = (x1_ + cx_) / rx;
  let ycr1 = (y1_ - cy_) / ry;
  let ycr2 = (y1_ + cy_) / ry;

  // F6.5.5
  startAngle = radian(1.0, 0.0, xcr1, ycr1);

  // F6.5.6
  deltaAngle = radian(xcr1, ycr1, -xcr2, -ycr2);
  while (deltaAngle > PIx2) {
    deltaAngle -= PIx2;
  }
  while (deltaAngle < 0.0) {
    deltaAngle += PIx2;
  }
  if (!fS) {
    deltaAngle -= PIx2;
  }
  endAngle = startAngle + deltaAngle;
  while (endAngle > PIx2) {
    endAngle -= PIx2;
  }
  while (endAngle < 0.0) {
    endAngle += PIx2;
  }

  let outputObj = {
    /* cx, cy, startAngle, deltaAngle */ cx: cx,
    cy: cy,
    startAngle: startAngle,
    deltaAngle: deltaAngle,
    endAngle: endAngle,
    clockwise: fS,
  };

  return outputObj;
}

export const getCursorAtIndex = (commands: Command[], index: number) => {
  const cursor = { x: 0, y: 0 };

  for (const command of commands.slice(0, index + 1)) {
    switch (command.code) {
      case "M":
      case "Q":
      case "L":
      case "C": {
        cursor.x = command.x;
        cursor.y = command.y;
        break;
      }
      case "m":
      case "c": {
        cursor.x += command.x;
        cursor.y += command.y;
        break;
      }
      case "v": {
        cursor.y += command.y;
        break;
      }
    }
  }

  return cursor;
};

export const toPath = (command: Command) => {
  const { code, command: _, relative, ...args } = command;
  if (code === "A" || code === "a") {
    return `${code} ${command.rx} ${command.ry} ${command.xAxisRotation} ${
      command.largeArc ? "1" : "0"
    } ${command.sweep ? "1" : "0"} ${command.x} ${command.y}`;
  }
  return `${code} ${Object.values(args).join(" ")}`;
};
