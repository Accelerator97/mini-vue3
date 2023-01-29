import { reactive } from "../reactive";
import { effect, stop } from "../effect";
describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge: any;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when effect is called", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    // 1.通过effect的第二个参数 传入一个scheduler
    // 2.effect第一次执行的时候 会执行fn
    // 3.当响应式对象 更新的时候 不会执行fn 而是会执行scheduler
    // 4.当执行effect的返回值runner的时候，会执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });

    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    // 1.调用stop方法后，当数值更新，effect里的函数fn不执行
    // 2.调用runner方法，当数值更新，effect里的函数fn执行
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    // 只触发set操作
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    // 触发get、set操作 obj.prop = obj.prop + 1
    obj.prop++
    expect(dummy).toBe(2)
    runner();
    expect(dummy).toBe(4);
  });

  it("onStop", () => {
    // 传入onStop，当调用stop方法时，传入的onStop会被执行
    const obj = reactive({
      foo: 1,
    });

    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );


    stop(runner)
    expect(onStop).toBeCalledTimes(1)

  });
});
