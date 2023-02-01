import { extend } from "../shared";

let activeEffect: any;
let shouldTrack; // 是否应该收集依赖

export class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true; // 避免重复清空依赖
  onStop?: () => void;
  public scheduler: Function | undefined;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    // 此时应该收集依赖
    shouldTrack = true;
    activeEffect = this;
    // 执行_fn 会触发track
    const result = this._fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

// 收集依赖
const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
  // target(代理的对象) → key → dep
  // 代理对象的依赖容器
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // desMap中某个代理对象某个属性所有的依赖
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return;
  // 添加依赖
  dep.add(activeEffect);
  // 反向收集所有依赖到ReactiveEffect实例对象的deps属性上
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
