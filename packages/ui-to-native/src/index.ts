import NativePolledCounter from './NativePolledCounter';

// Workaround: a worklet that reads a method from a TurboModule object crashes the app.
// Read the method on the RN Runtime and give only the function to the worklet.
const { getCount: nativeGetCount } = NativePolledCounter;

export function getCount(): number {
  'worklet';
  return nativeGetCount();
}
