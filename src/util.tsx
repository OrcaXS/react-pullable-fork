/* eslint-disable import/prefer-default-export */
import { useEffect, useRef } from 'react';

export const useTimeout = (callback: () => void, delay: number) => {
  const timeoutReference = useRef<number | undefined>();
  const callbackReference = useRef(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // timeout will be reset.

  useEffect(() => {
    callbackReference.current = callback;
  }, [callback]);

  // Set up the timeout:

  useEffect(() => {
    timeoutReference.current = window.setTimeout(
      () => callbackReference.current(),
      delay,
    );

    // Clear timeout if the components is unmounted or the delay changes:
    return () => window.clearTimeout(timeoutReference.current);
  }, [delay]);

  // In case you want to manually clear the timeout from the consuming component...:
  return timeoutReference;
};
