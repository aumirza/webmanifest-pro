export function debounce(cb: CallableFunction, time: number) {
  return function (...args: any[]) {
    setTimeout(() => {
      cb(...args);
    }, time);
  };
}
