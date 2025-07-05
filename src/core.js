// Constants for different types of nodes
const NODE_TYPES = {
    ELEMENT: 'element',
    TEXT: 'text',
    COMPONENT: 'component'
  };
  

  // VIRTUAL DOM CREATION

  /**
   * Creates a virtual DOM node
   * @param {string} tag - HTML tag name (e.g., 'div', 'span')
   * @param {object} attrs - HTML attributes (e.g., {class: 'container', id: 'main'})
   * @param {array} children - Child nodes (can be strings, elements, or other virtual nodes)
   * @returns {object} Virtual DOM node object
   */
  function createVirtualNode(tag, attrs = {}, children = []) {
    // Normalize children - convert strings to text nodes
    const normalizedChildren = children.map(child => {
      if (typeof child === 'string') {
        return createVirtualText(child);
      }
      return child;
    });
    
    return {
      type: NODE_TYPES.ELEMENT,
      tag: tag,
      attrs: attrs,
      children: normalizedChildren,
      key: attrs.key || null // For efficient list updates
    };
  }
  
  /**
   * Creates a text node
   * @param {string} text - Text content
   * @returns {object} Virtual text node object
   */
  function createVirtualText(text) {
    return {
      type: NODE_TYPES.TEXT,
      text: text
    };
  }
  
  /**
   * Checks if an object is a virtual DOM node
   * @param {any} node - Object to check
   * @returns {boolean} True if it's a virtual node
   */
  function isVirtualNode(node) {
    return node && typeof node === 'object' && (node.type === NODE_TYPES.ELEMENT || node.type === NODE_TYPES.TEXT);
  }

  // DOM RENDERING

  /**
   * Creates a real DOM element from a virtual DOM node
   * @param {object} vNode - Virtual DOM node
   * @returns {HTMLElement|Text} Real DOM element
   */
  function createRealElement(vNode) {
    // Handle text nodes
    if (vNode.type === NODE_TYPES.TEXT) {
      return document.createTextNode(vNode.text);
    }
    
    // Handle element nodes
    if (vNode.type === NODE_TYPES.ELEMENT) {
      // Create the element
      const element = document.createElement(vNode.tag);
      
      // Set attributes
      setElementAttributes(element, vNode.attrs);
      
      // Add children
      vNode.children.forEach(child => {
        if (typeof child === 'string') {
          // If child is a string, create a text node
          element.appendChild(document.createTextNode(child));
        } else if (isVirtualNode(child)) {
          // If child is a virtual node, recursively create DOM element
          element.appendChild(createRealElement(child));
        }
      });
      
      return element;
    }
    
    throw new Error(`Unknown node type: ${vNode.type}`);
  }
  
  /**
   * Sets attributes on a DOM element
   * @param {HTMLElement} element - DOM element
   * @param {object} attrs - Attributes object
   */
  function setElementAttributes(element, attrs) {
    Object.keys(attrs).forEach(key => {
      if (key === 'key') return; // Skip key attribute (used for diffing)
      
      if (key.startsWith('on')) {
        // Handle event listeners using our custom MiniEvents system
        const eventName = key.toLowerCase().substring(2); // 'onClick' -> 'click'
        // Store the handler for potential cleanup
        element._miniEventHandlers = element._miniEventHandlers || {};
        element._miniEventHandlers[eventName] = attrs[key];
        // Use MiniEvents instead of native addEventListener
        MiniEvents.addEvent(element, eventName, attrs[key]);
      } else {
        // Handle regular attributes
        element.setAttribute(key, attrs[key]);
      }
    });
  }
  
  /**
   * Renders virtual DOM to a container
   * @param {object} vNode - Virtual DOM node to render
   * @param {HTMLElement} container - Container element
   */
  function renderToDOM(vNode, container) {
    // Clear the container
    container.innerHTML = '';
    
    // Create and append the DOM element
    const domElement = createRealElement(vNode);
    container.appendChild(domElement);
  }
  

  // DIFFING ALGORITHM

  /**
   * Compares two virtual DOM trees and returns patches
   * @param {object} oldVNode - Old virtual DOM node
   * @param {object} newVNode - New virtual DOM node
   * @returns {array} Array of patches to apply
   */
  function diffVirtualNodes(oldVNode, newVNode) {
    const patches = [];
    
    // If one of the nodes is null/undefined
    if (!oldVNode && newVNode) {
      patches.push({ type: 'REPLACE', newNode: newVNode });
      return patches;
    }
    
    if (oldVNode && !newVNode) {
      patches.push({ type: 'REMOVE' });
      return patches;
    }
    
    // If both nodes are text nodes
    if (oldVNode.type === NODE_TYPES.TEXT && newVNode.type === NODE_TYPES.TEXT) {
      if (oldVNode.text !== newVNode.text) {
        patches.push({ type: 'REPLACE', newNode: newVNode });
      }
      return patches;
    }
    
    // If nodes have different types
    if (oldVNode.type !== newVNode.type || oldVNode.tag !== newVNode.tag) {
      patches.push({ type: 'REPLACE', newNode: newVNode });
      return patches;
    }
    
    // Compare attributes
    const attrPatches = diffNodeAttributes(oldVNode.attrs, newVNode.attrs);
    if (attrPatches.length > 0) {
      patches.push({ type: 'UPDATE_ATTRS', patches: attrPatches });
    }
    
    // Compare children
    const childPatches = diffNodeChildren(oldVNode.children, newVNode.children);
    if (childPatches.length > 0) {
      patches.push({ type: 'UPDATE_CHILDREN', patches: childPatches });
    }
    
    return patches;
  }
  
  /**
   * Compares attributes of two nodes
   * @param {object} oldAttrs - Old attributes
   * @param {object} newAttrs - New attributes
   * @returns {array} Attribute patches
   */
  function diffNodeAttributes(oldAttrs, newAttrs) {
    oldAttrs = oldAttrs || {};
    newAttrs = newAttrs || {};
    const patches = [];
    const allKeys = new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)]);
    
    allKeys.forEach(key => {
      if (key === 'key') return; // Skip key attribute
      
      if (!(key in oldAttrs)) {
        // New attribute
        patches.push({ type: 'SET_ATTR', key, value: newAttrs[key] });
      } else if (!(key in newAttrs)) {
        // Removed attribute
        patches.push({ type: 'REMOVE_ATTR', key });
      } else if (oldAttrs[key] !== newAttrs[key]) {
        // Changed attribute
        patches.push({ type: 'SET_ATTR', key, value: newAttrs[key] });
      }
    });
    
    return patches;
  }
  
  /**
   * Compares children of two nodes
   * @param {array} oldChildren - Old children
   * @param {array} newChildren - New children
   * @returns {array} Children patches
   */
  function diffNodeChildren(oldChildren, newChildren) {
    // Ensure children arrays exist
    oldChildren = oldChildren || [];
    newChildren = newChildren || [];
    
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    for (let i = 0; i < maxLength; i++) {
      let oldChild = oldChildren[i];
      let newChild = newChildren[i];
      
      // Convert string children to virtual text nodes
      if (typeof oldChild === 'string') {
        oldChild = createVirtualText(oldChild);
      }
      if (typeof newChild === 'string') {
        newChild = createVirtualText(newChild);
      }
      
      if (!oldChild && newChild) {
        // New child
        patches.push({ type: 'ADD_CHILD', index: i, child: newChild });
      } else if (oldChild && !newChild) {
        // Removed child
        patches.push({ type: 'REMOVE_CHILD', index: i });
      } else if (oldChild && newChild) {
        // Compare children recursively
        const childPatches = diffVirtualNodes(oldChild, newChild);
        if (childPatches.length > 0) {
          patches.push({ type: 'UPDATE_CHILD', index: i, patches: childPatches });
        }
      }
    }
    
    return patches;
  }
  


  // PATCHING (APPLYING CHANGES)
  /**
   * Applies patches to a DOM element
   * @param {HTMLElement} element - DOM element to patch
   * @param {array} patches - Array of patches to apply
   */
  function applyPatchesToDOM(element, patches) {
    patches.forEach(patch => {
      switch (patch.type) {
        case 'REPLACE':
          const newElement = createRealElement(patch.newNode);
          element.parentNode.replaceChild(newElement, element);
          break;
          
        case 'REMOVE':
          element.parentNode.removeChild(element);
          break;
          
        case 'UPDATE_ATTRS':
          patch.patches.forEach(attrPatch => {
            switch (attrPatch.type) {
              case 'SET_ATTR':
                if (attrPatch.key.startsWith('on')) {
                  const eventName = attrPatch.key.toLowerCase().substring(2);
                  // Use MiniEvents instead of native addEventListener
                  MiniEvents.addEvent(element, eventName, attrPatch.value);
                } else {
                  element.setAttribute(attrPatch.key, attrPatch.value);
                }
                break;
              case 'REMOVE_ATTR':
                element.removeAttribute(attrPatch.key);
                break;
            }
          });
          break;
          
        case 'UPDATE_CHILDREN':
          patch.patches.forEach(childPatch => {
            switch (childPatch.type) {
              case 'ADD_CHILD':
                const childElement = createRealElement(childPatch.child);
                element.appendChild(childElement);
                break;
              case 'REMOVE_CHILD':
                if (element.children[childPatch.index]) {
                  element.removeChild(element.children[childPatch.index]);
                }
                break;
              case 'UPDATE_CHILD':
                applyPatchesToDOM(element.children[childPatch.index], childPatch.patches);
                break;
            }
          });
          break;
      }
    });
  }
  

  // PUBLIC API - Make functions available globally
  window.MiniFramework = {
    // Virtual DOM
    createVirtualNode,
    createVirtualText,
    isVirtualNode,
    
    // Rendering
    createRealElement,
    renderToDOM,
    
    // Diffing and Patching
    diffVirtualNodes,
    applyPatchesToDOM,
    
    // Constants
    NODE_TYPES
  };