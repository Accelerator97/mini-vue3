export const extend = Object.assign;

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export function hasChanged(v1, v2) {
  return !Object.is(v1, v2);
}
