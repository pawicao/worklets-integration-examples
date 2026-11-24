import { NativeModule, requireNativeModule } from 'expo';

declare class CounterModule extends NativeModule {
  getCount(): number;
  addWorkletListener(worklet: object): number;
  removeWorkletListener(id: number): void;
}

export default requireNativeModule<CounterModule>('WithExpoModuleCounter');
