import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootCompent) {
  return {
    mount(rootContainer) {
      // 先转换成虚拟节点 vnode  component → vnode
      // 后续的所有逻辑操作 都会基于虚拟节点vnode
      const vnode = createVNode(rootCompent);

      render(vnode,rootContainer)
    },
  };
}
