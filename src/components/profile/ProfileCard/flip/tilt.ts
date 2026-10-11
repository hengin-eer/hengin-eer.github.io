const INVERT_BELOW_DEG = 15;
const UPRIGHT_ABOVE_DEG = 35;

const nextInverted = (current: boolean, beta: number | null): boolean => {
  if (beta === null) return current;
  if (beta < INVERT_BELOW_DEG) return true;
  if (beta > UPRIGHT_ABOVE_DEG) return false;
  return current;
};

export { INVERT_BELOW_DEG, UPRIGHT_ABOVE_DEG, nextInverted };
