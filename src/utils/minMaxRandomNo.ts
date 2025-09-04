interface MinMaxProps {
  min: number;
  max: number;
}

export default function minMaxRandomNo(minMaxArray: MinMaxProps[]) {
  return minMaxArray.map((data) => {
    return data.min + Math.floor(Math.random() * (data.max - data.min + 1));
  });
}
