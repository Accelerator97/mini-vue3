import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImp {
  private _value: any;
  private _raw: any;
  public dep;
  public __v_isRef = true;
  constructor(value) {
    // 保存没有处理过的原始值
    this._raw = value;
    // 看看value是不是对象 是的话就用reactive包裹
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    // 对比的时候 用原始值和新值比较 不是和proxy对象比较
    if (!hasChanged(newValue, this._raw)) return;
    this._raw = newValue;
    this._value = convert(newValue);
    // 更新完值之后触发依赖
    triggerEffects(this.dep);
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImp(value);
}

export function isRef(val) {
  return !!val.__v_isRef;
}

export function unRef(val) {
  return isRef(val) ? val.value : val;
}

export function proxyRef(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
