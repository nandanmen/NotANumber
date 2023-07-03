type GetArcCenterParams = {
  x0: number;
  y0: number;
  rx: number;
  ry: number;
  xAxisRotation: number;
  largeArc: boolean;
  sweep: boolean;
  x: number;
  y: number;
};

function radian(ux: number, uy: number, vx: number, vy: number) {
  let dot = ux * vx + uy * vy;
  let mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
  let rad = Math.acos(dot / mod);
  if (ux * vy - uy * vx < 0.0) {
    rad = -rad;
  }
  return rad;
}

export function getArcCenter({
  x0,
  y0,
  rx,
  ry,
  xAxisRotation,
  largeArc,
  sweep,
  x,
  y,
}: GetArcCenterParams) {
  let cx, cy, startAngle, deltaAngle, endAngle;
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

  let s_phi = Math.sin(xAxisRotation);
  let c_phi = Math.cos(xAxisRotation);
  let hd_x = (x0 - x) / 2.0; // half diff of x
  let hd_y = (y0 - y) / 2.0; // half diff of y
  let hs_x = (x0 + x) / 2.0; // half sum of x
  let hs_y = (y0 + y) / 2.0; // half sum of y

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
    console.log(xAxisRotation);
    throw Error("start point can not be same as end point");
  }
  let coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
  if (largeArc == sweep) {
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
  if (sweep) {
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
    clockwise: sweep,
  };

  return outputObj;
}

export function getScale(
  p: number,
  q: number,
  h: number,
  k: number,
  rx: number,
  ry: number
) {
  const a = (p - h) ** 2 / rx ** 2;
  const b = (q - k) ** 2 / ry ** 2;
  const s = a + b;
  return Math.sqrt(s);
}
