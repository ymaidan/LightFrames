// Add an event listener to an element
function addEvent(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

// Remove an event listener from an element
function removeEvent(element, eventType, handler) {
  element.removeEventListener(eventType, handler);
}

// Event delegation: handle events for children matching a selector
function addDelegatedEvent(container, selector, eventType, handler) {
  container.addEventListener(eventType, function(event) {
    // event.target is the actual element clicked
    if (event.target.matches(selector)) {
      handler.call(event.target, event);
    }
  });
}

// Add multiple events to an element
function addMultipleEvents(element, events) {
  // events is an object: { click: handler1, mouseover: handler2 }
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
