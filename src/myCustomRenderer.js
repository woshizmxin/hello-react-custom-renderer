import ReactReconciler from 'react-reconciler';

function traceWrap(hostConfig) {
  let traceWrappedHostConfig = {};
  Object.keys(hostConfig).map(key => {
    const func = hostConfig[key];
    traceWrappedHostConfig[key] = (...args) => {
      console.trace(key);
      return func(...args);
    };
  });
  return traceWrappedHostConfig;
}

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => {
    console.log("prepareForCommit");
  },
  resetAfterCommit: () => {
    console.log("resetAfterCommit");
  },
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type, props) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  /**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const domElement = document.createElement(type);
    console.log("createInstance: "+type);
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
      } else if (propName === 'onClick') {
        domElement.addEventListener('click', propValue);
      } else if (propName === 'className') {
        domElement.setAttribute('class', propValue);
      } else {
        const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },
  createTextInstance: text => {
    console.log("createTextInstance ");
    return document.createTextNode(text);
  },
  appendInitialChild: (parent, child) => {
    console.log("appendInitialChild: parent: "+parent.constructor.name+" child: "+child.constructor.name);
    parent.appendChild(child);
  },
  appendChild(parent, child) {
    console.log("appendChild: parent: "+parent.constructor.name+" child: "+child.constructor.name);
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {},
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    console.log("appendChildToContainer: parent: "+parent.constructor.name+" child: "+child.constructor.name);
    parent.appendChild(child);
  },
  prepareUpdate(domElement, oldProps, newProps) {
    // console.log(
    //     "prepareUpdate: domElement: " + domElement.constructor.name+ "oldProps: " + oldProps + " newProps: " + newProps);
    return true;
  },
  commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
    console.log("commitUpdate: domElement: " + domElement.constructor.name);
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      console.log("propName: " + propName + " propValue: "+propValue);
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
      } else {
        const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
  },
  commitTextUpdate(textInstance, oldText, newText) {
    console.log("commitTextUpdate: ");
    textInstance.text = newText;
  },
  removeChild(parentInstance, child) {
    console.log("removeChild: ");
    parentInstance.removeChild(child);
  }
};
const ReactReconcilerInst = ReactReconciler(hostConfig);
export default {
  render: (reactElement, domElement, callback) => {
    // Create a root Container if it doesnt exist
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback);
  }
};
