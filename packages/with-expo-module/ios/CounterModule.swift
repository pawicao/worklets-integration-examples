import ExpoModulesCore
import ExpoModulesWorklets

public final class CounterModule: Module {
  private let lock = NSLock()
  private var count = 0
  private var lastListenerId = 0
  private var listeners: [Int: Worklet] = [:]
  private var timer: DispatchSourceTimer?

  public func definition() -> ModuleDefinition {
    Name("WithExpoModuleCounter")

    Function("getCount") { () -> Int in
      return lock.withLock { count }
    }

    Function("addWorkletListener") { (worklet: Worklet) -> Int in
      return lock.withLock {
        lastListenerId += 1
        listeners[lastListenerId] = worklet
        return lastListenerId
      }
    }

    Function("removeWorkletListener") { (id: Int) in
      lock.withLock { listeners[id] = nil }
    }

    OnCreate {
      startCounter()
    }

    OnDestroy {
      timer?.cancel()
      lock.withLock { listeners.removeAll() }
    }
  }

  private func startCounter() {
    let timer = DispatchSource.makeTimerSource(queue: .global(qos: .userInteractive))
    timer.schedule(deadline: .now(), repeating: .milliseconds(16))
    timer.setEventHandler { [weak self] in
      self?.tick()
    }
    timer.resume()
    self.timer = timer
  }

  private func tick() {
    let newCount = lock.withLock {
      count += 1
      return count
    }
    DispatchQueue.main.async { [weak self] in
      self?.runWorklets(with: newCount)
    }
  }

  private func runWorklets(with newCount: Int) {
    let worklets = lock.withLock { Array(listeners.values) }
    guard !worklets.isEmpty, let runtime = appContext?._uiRuntime as? WorkletRuntime else {
      return
    }
    for worklet in worklets {
      worklet.execute(on: runtime, arguments: [newCount])
    }
  }
}
