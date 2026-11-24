import NativePolledCounter from './NativePolledCounter';

// Workaround: a worklet cannot read a method from a TurboModule object.
const { getCount: nativeGetCount } = NativePolledCounter;

export function getCount(): number {
  'worklet';
  return nativeGetCount();
}
