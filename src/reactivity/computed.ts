import { ReactiveEffect } from "./effect";

class ComputedRef {
  private _getter: any;
  private _dirty = true;
  private _value: any;
  private _effect: any;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    // 当依赖的响应式对象发生改变时 dirty设置为true
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
      return this._value;
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRef(getter);
}
