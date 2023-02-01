import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // 这里要区分类型 是component还是element 
  processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode,container);
}

function mountComponent(vnode: any,container) {
    // 创建组件实例
    const instance = createComponentInstance(vnode)
    setupComponent(instance)

    setupRenderEffect(instance,container)
}


function setupRenderEffect(instance:any,container){
    const subTree = instance.render()

    // vnode tree 虚拟节点树 → 继续patch
    // vnode → element → mount
    // 递归  如果是组件 继续递归调用 如果是element就渲染出来
    patch(subTree,container)

}
