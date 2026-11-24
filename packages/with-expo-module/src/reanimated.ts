import { installOnUIRuntime, type EventSubscription } from 'expo';
import { useEffect } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import { createSerializable, getUIRuntimeHolder, isWorkletFunction } from 'react-native-worklets';

import NativeCounter from './NativeCounter';

let isInstalledOnUIRuntime = false;

export function addCounterWorkletListener(worklet: (count: number) => void): EventSubscription {
  if (!isWorkletFunction(worklet)) {
    throw new Error("The counter listener must be a worklet. Add the 'worklet' directive.");
  }
  if (!isInstalledOnUIRuntime) {
    installOnUIRuntime(getUIRuntimeHolder());
    isInstalledOnUIRuntime = true;
  }
  const id = NativeCounter.addWorkletListener(createSerializable(worklet));
  return { remove: () => NativeCounter.removeWorkletListener(id) };
}

export function useCounter(): SharedValue<number> {
  const count = useSharedValue(NativeCounter.getCount);

  useEffect(() => {
    const subscription = addCounterWorkletListener((newCount) => {
      'worklet';
      count.set(newCount);
    });
    return () => subscription.remove();
  }, [count]);

  return count;
}
