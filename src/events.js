// Custom event system that doesn't use native addEventListener
const eventRegistry = new Map(); // Store all event handlers

// Add an event listener to an element
function addEvent(element, eventType, handler) {
  // Create a unique key for this element
  const elementKey = element._miniEventId || (element._miniEventId = Math.random().toString(36));
  
  // Initialize registry for this element if not exists
  if (!eventRegistry.has(elementKey)) {
    eventRegistry.set(elementKey, new Map());
  }
  
  const elementEvents = eventRegistry.get(elementKey);
  
  // Initialize event type array if not exists
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, []);
  }
  
  // Add handler to registry
  elementEvents.get(eventType).push(handler);
  
  // Set up our custom event handling
  if (!element._miniEventHandlers) {
    element._miniEventHandlers = {};
  }
  
  // Map event types to element properties
  const eventMap = {
    'click': 'onclick',
    'mouseover': 'onmouseover',
    'mouseout': 'onmouseout',
    'keydown': 'onkeydown',
    'keyup': 'onkeyup',
    'keypress': 'onkeypress',
    'change': 'onchange',
    'blur': 'onblur',
    'focus': 'onfocus',
    'dblclick': 'ondblclick',
    'load': 'onload',
    'hashchange': 'onhashchange',
    'popstate': 'onpopstate'
  };
  
  const eventProp = eventMap[eventType];
  if (eventProp) {
    element[eventProp] = function(event) {
      const handlers = eventRegistry.get(elementKey)?.get(eventType) || [];
      handlers.forEach(handler => {
        try {
          handler.call(element, event);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    };
  }
}

// Remove an event listener from an element
function removeEvent(element, eventType, handler) {
  const elementKey = element._miniEventId;
  if (!elementKey || !eventRegistry.has(elementKey)) return;
  
  const elementEvents = eventRegistry.get(elementKey);
  if (!elementEvents.has(eventType)) return;
  
  const handlers = elementEvents.get(eventType);
  const index = handlers.indexOf(handler);
  if (index > -1) {
    handlers.splice(index, 1);
  }
  
  // If no more handlers, remove the event property
  if (handlers.length === 0) {
    const eventMap = {
      'click': 'onclick',
      'mouseover': 'onmouseover',
      'mouseout': 'onmouseout',
      'keydown': 'onkeydown',
      'keyup': 'onkeyup'
    };
    
    const eventProp = eventMap[eventType];
    if (eventProp) {
      element[eventProp] = null;
    }
  }
}

// Event delegation: handle events for children matching a selector
function addDelegatedEvent(container, selector, eventType, handler) {
  addEvent(container, eventType, function(event) {
    if (event.target.matches(selector)) {
      handler.call(event.target, event);
    }
  });
}

// Add multiple events to an element
function addMultipleEvents(element, events) {
  for (const [eventType, handler] of Object.entries(events)) {
    addEvent(element, eventType, handler);
  }
}

window.MiniEvents = {
  addEvent,
  removeEvent,
  addDelegatedEvent,
  addMultipleEvents
};
