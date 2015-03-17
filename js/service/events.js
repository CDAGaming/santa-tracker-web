/**
 * Simple events system.
 */
var Events = {};

/**
 * Adds a listener for an event.
 *
 * @param {Object} o
 * @param {string} eventName
 * @param {!Function} listener
 * @return {!SantaEventListener}
 */
Events.addListener = function(o, eventName, listener) {
  return new SantaEventListener(o, eventName, listener);
};

/**
 * Triggers a given event.
 *
 * @param {Object} o
 * @param {string} eventName
 * @param {*} var_args
 */
Events.trigger = function(o, eventName, var_args) {
  var listeners = Events.listeners_(o, eventName);
  var args = Events.slice_(arguments, 2);
  for (var id in listeners) {
    var listener = listeners[id];
    listener && listener.invoke_(args);
  }
};

/**
 * @param {Array|Arguments} arr
 * @param {number} start
 * @param {number} opt_end
 * @return {Array}
 */
Events.slice_ = function(arr, start, opt_end) {
  return /** @type Array */ (Function.prototype.call.apply(
      Array.prototype.slice, arguments));
};

/**
 * Namespace for the event object.
 *
 * @type {string}
 */
Events.NAMESPACE_ = '_st_ev';

/**
 * @param {Object} o
 * @param {string} eventName
 * @return {Object.<SantaEventListener>}
 */
Events.listeners_ = function(o, eventName) {
  var all = o[Events.NAMESPACE_];
  if (!all) all = o[Events.NAMESPACE_] = {};

  var ret = all[eventName];
  if (!ret) all[eventName] = ret = {};
  return ret;
};

Events.count_ = 0;

Events.newId_ = function() {
  return Events.count_++;
};

/**
 * @constructor
 */
function SantaEventListener(o, eventName, listener) {
  this.o_ = o;
  this.eventName_ = eventName;
  this.listener_ = listener;
  this.id_ = Events.newId_();

  Events.listeners_(o, eventName)[this.id_] = this;
}

SantaEventListener.prototype.invoke_ = function(args) {
  this.listener_.apply(this.o_, args);
};

window['Events'] = Events;
