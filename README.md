# Worklets integration examples

These examples show how a React Native library sends native data to the [UI Runtime](https://docs.swmansion.com/react-native-worklets/docs/concepts/runtimeKinds#ui-runtime) of React Native Worklets. A Reanimated shared value then updates while the JavaScript thread is busy.

The Worklets guide [Sending native data to the UI Runtime](https://docs.swmansion.com/react-native-worklets/docs/guides/sending-native-data-to-the-ui-runtime) explains the method. This repository has runnable code for each path. CI tests each path on an Android emulator.

## Paths

| Package                                                 | The data comes from      | It gets to the UI Runtime through                     |
| ------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| [`with-expo-module`](packages/with-expo-module)         | An Expo module           | The `Worklet` type of Expo Modules API                |
| [`with-cpp-turbomodule`](packages/with-cpp-turbomodule) | A C++ TurboModule        | The C++ stable API of Worklets                        |
| [`with-nitro`](packages/with-nitro)                     | A Nitro HybridObject     | A callback and a Nitro `Dispatcher` on the UI Runtime |
| [`with-view-event`](packages/with-view-event)           | A native view            | A Fabric event and a Reanimated event handler         |
| [`ui-to-native`](packages/ui-to-native)                 | A TurboModule method     | A worklet on the UI Runtime that calls the method     |

All packages use the same data source: a native counter that adds 1 about 60 times each second. The first four packages count on a background thread and send each value. In `ui-to-native`, a worklet reads the value once per frame.

Each package has two entry points:

- `.` works without Worklets and Reanimated.
- `./reanimated` gives a shared value. `react-native-worklets` and `react-native-reanimated` are optional peer dependencies.

## The example app

[`apps/example`](apps/example) is an Expo app with a development build. It has one screen for each package. Each screen shows the counter two times: as a shared value that the UI thread updates, and as React state that the JS thread updates. The button "Block the JS thread for 5 s" stops the JS thread. During the block, the shared value continues to change and the React state stops.

## Run the app

You need Node.js (the version in [`.nvmrc`](.nvmrc)), Yarn through Corepack, and Android Studio or Xcode.

```sh
corepack enable
yarn install
cd apps/example
yarn android # or: yarn ios
```

## Tests

[CI](.github/workflows/ci.yml) does these steps:

1. Lint and typecheck.
2. Build a release APK and run the [Maestro](https://maestro.dev) flows in [`apps/example/e2e`](apps/example/e2e) on an Android emulator. Each flow opens one screen, blocks the JS thread, and makes sure that the shared value changes and the React state does not.
3. Build the iOS app for the simulator.

The tests use Maestro because it reads the screen through Android accessibility. Detox waits until the JS thread is idle, and these tests block the JS thread on purpose.

To run the flows on your computer, install Maestro, start an emulator, install a release build, and run `maestro test apps/example/e2e`.

## Versions

Expo SDK 58 (React Native 0.88.1), `react-native-worklets` 0.14.0, `react-native-reanimated` 4.8.0, `react-native-nitro-modules` 0.37.2.
