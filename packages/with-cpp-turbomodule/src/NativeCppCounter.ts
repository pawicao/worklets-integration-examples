import { TurboModuleRegistry, type CodegenTypes, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  getCount(): number;
  addWorkletListener(
    uiRuntimeHolder: CodegenTypes.UnsafeObject,
    uiSchedulerHolder: CodegenTypes.UnsafeObject,
    worklet: CodegenTypes.UnsafeObject
  ): number;
  removeWorkletListener(id: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CppCounter');
