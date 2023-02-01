export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };

  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    // setup函数会返回function（视为render函数） 或者 Object
    const setupResult = setup();
 
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // TODO function

  if (typeof setupResult === "object") {
    // 如果组件对象上有setup函数 执行返回的是object 那么注入到组件实例的setupState属性上
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  // 获取组件对象 
  const Component = instance.type;

  if (Component.render) {
    // 如果组件对象上有render函数，赋值给组件实例的render函数
    instance.render = Component.render;
  }
}
