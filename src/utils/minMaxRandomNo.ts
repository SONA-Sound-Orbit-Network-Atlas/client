interface MinMaxProps {
  min: number;
  max: number;
  step?: number;
}

export default function minMaxRandomNo(minMaxArray: MinMaxProps[]) {
  return minMaxArray.map((data) => {
    const step = data.step ?? 1; // step 없으면 기본 1
    const steps = Math.floor((data.max - data.min) / step);
    const randStep = Math.floor(Math.random() * (steps + 1));
    return +(data.min + randStep * step).toFixed(2);
  });
}
