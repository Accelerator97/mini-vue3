import { readonly, isReadonly, isProxy } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const origin = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(origin);
    expect(wrapped).not.toBe(origin);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(origin)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
    expect(wrapped.foo).toBe(1);
  });

  it("warn then call set ", () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 10,
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });
});
