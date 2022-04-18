export default function randomInteger(min, max) {
  const random = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(random);
}
