/*!
 * flamingo.js v1.1.0
 * A lightweight, powerful, and intuitive JavaScript framework.
 *
 * Author: Kiwi.JS
 * GitHub: https://github.com/searchbirds/flamingo.js
 * 
 * Copyright (c) 2023 Kiwi.JS
 * Released under the MIT License
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Kiwi = factory());
}(this, (function() {
    'use strict';
    
    // Utility functions
    const utils = {
        isObject: function(obj) {
            return obj !== null && typeof obj === 'object';
        },
        isFunction: function(fn) {
            return typeof fn === 'function';
        },
        isArray: Array.isArray,
        isString: function(str) {
            return typeof str === 'string';
        },
        isNumber: function(num) {
            return typeof num === 'number' && !isNaN(num);
        },
        isBoolean: function(bool) {
            return typeof bool === 'boolean';
        },
        isUndefined: function(val) {
            return val === undefined;
        },
        isNull: function(val) {
            return val === null;
        },
        isPrimitive: function(val) {
            return (
                val === null ||
                typeof val === 'boolean' ||
                typeof val === 'number' ||
                typeof val === 'string' ||
                typeof val === 'undefined'
            );
        },
        each: function(obj, fn) {
            if (this.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    fn(obj[i], i);
                }
            } else if (this.isObject(obj)) {
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        fn(obj[key], key);
                    }
                }
            }
        },
        map: function(obj, fn) {
            if (this.isArray(obj)) {
                return obj.map(fn);
            } else if (this.isObject(obj)) {
                const result = {};
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        result[key] = fn(obj[key], key);
                    }
                }
                return result;
            }
            return [];
        },
        filter: function(obj, fn) {
            if (this.isArray(obj)) {
                return obj.filter(fn);
            } else if (this.isObject(obj)) {
                const result = {};
                for (let key in obj) {
                    if (obj.hasOwnProperty(key) && fn(obj[key], key)) {
                        result[key] = obj[key];
                    }
                }
                return result;
            }
            return this.isArray(obj) ? [] : {};
        },
        find: function(arr, fn) {
            if (!this.isArray(arr)) return undefined;
            return arr.find(fn);
        },
        extend: function(target, ...sources) {
            sources.forEach(source => {
                for (let key in source) {
                    if (source.hasOwnProperty(key)) {
                        if (this.isObject(source[key]) && this.isObject(target[key])) {
                            this.extend(target[key], source[key]);
                        } else {
                            target[key] = source[key];
                        }
                    }
                }
            });
            return target;
        },
        clone: function(obj) {
            if (this.isPrimitive(obj)) return obj;
            
            if (this.isArray(obj)) {
                return obj.map(item => this.clone(item));
            }
            
            if (this.isObject(obj)) {
                const result = {};
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        result[key] = this.clone(obj[key]);
                    }
                }
                return result;
            }
            
            return obj;
        },
        debounce: function(fn, delay) {
            let timer = null;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },
        throttle: function(fn, limit) {
            let inThrottle;
            return function() {
                const context = this;
                const args = arguments;
                if (!inThrottle) {
                    fn.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        capitalize: function(str) {
            if (!this.isString(str)) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        camelCase: function(str) {
            if (!this.isString(str)) return '';
            return str.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
        },
        kebabCase: function(str) {
            if (!this.isString(str)) return '';
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        },
        trim: function(str) {
            if (!this.isString(str)) return '';
            return str.trim();
        }
    };

    // DOM manipulation
    const dom = {
        query: function(selector, context = document) {
            return context.querySelector(selector);
        },
        queryAll: function(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },
        create: function(tagName, attributes = {}, children = []) {
            const element = document.createElement(tagName);
            
            // Set attributes
            for (let key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    if (key === 'style' && utils.isObject(attributes[key])) {
                        Object.assign(element.style, attributes[key]);
                    } else if (key === 'className') {
                        element.className = attributes[key];
                    } else if (key === 'dataset' && utils.isObject(attributes[key])) {
                        for (let dataKey in attributes[key]) {
                            if (attributes[key].hasOwnProperty(dataKey)) {
                                element.dataset[dataKey] = attributes[key][dataKey];
                            }
                        }
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                }
            }
            
            // Append children
            if (utils.isArray(children)) {
                children.forEach(child => {
                    if (utils.isString(child)) {
                        element.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        element.appendChild(child);
                    }
                });
            } else if (utils.isString(children)) {
                element.textContent = children;
            }
            
            return element;
        },
        on: function(element, event, handler, options) {
            if (element) {
                element.addEventListener(event, handler, options);
            }
            return this;
        },
        off: function(element, event, handler, options) {
            if (element) {
                element.removeEventListener(event, handler, options);
            }
            return this;
        },
        delegate: function(element, eventType, selector, handler) {
            if (!element) return this;
            
            element.addEventListener(eventType, function(e) {
                for (let target = e.target; target && target !== this; target = target.parentNode) {
                    if (target.matches(selector)) {
                        handler.call(target, e);
                        break;
                    }
                }
            }, false);
            
            return this;
        },
        addClass: function(element, className) {
            if (element && className) {
                if (utils.isArray(className)) {
                    className.forEach(cls => element.classList.add(cls));
                } else {
                    element.classList.add(className);
                }
            }
            return this;
        },
        removeClass: function(element, className) {
            if (element && className) {
                if (utils.isArray(className)) {
                    className.forEach(cls => element.classList.remove(cls));
                } else {
                    element.classList.remove(className);
                }
            }
            return this;
        },
        toggleClass: function(element, className, force) {
            if (element && className) {
                if (utils.isUndefined(force)) {
                    element.classList.toggle(className);
                } else {
                    element.classList.toggle(className, force);
                }
            }
            return this;
        },
        hasClass: function(element, className) {
            return element && className ? element.classList.contains(className) : false;
        },
        attr: function(element, name, value) {
            if (!element) return null;
            
            if (utils.isObject(name)) {
                for (let key in name) {
                    if (name.hasOwnProperty(key)) {
                        element.setAttribute(key, name[key]);
                    }
                }
                return this;
            }
            
            if (value === undefined) {
                return element.getAttribute(name);
            }
            
            element.setAttribute(name, value);
            return this;
        },
        removeAttr: function(element, name) {
            if (element && name) {
                element.removeAttribute(name);
            }
            return this;
        },
        css: function(element, prop, value) {
            if (!element) return this;
            
            if (utils.isObject(prop)) {
                Object.keys(prop).forEach(key => {
                    element.style[key] = prop[key];
                });
            } else if (value !== undefined) {
                element.style[prop] = value;
            } else {
                return getComputedStyle(element)[prop];
            }
            
            return this;
        },
        html: function(element, content) {
            if (!element) return content === undefined ? '' : this;
            
            if (content === undefined) {
                return element.innerHTML;
            }
            
            element.innerHTML = content;
            return this;
        },
        text: function(element, content) {
            if (!element) return content === undefined ? '' : this;
            
            if (content === undefined) {
                return element.textContent;
            }
            
            element.textContent = content;
            return this;
        },
        val: function(element, value) {
            if (!element) return value === undefined ? '' : this;
            
            if (value === undefined) {
                return element.value;
            }
            
            element.value = value;
            return this;
        },
        append: function(parent, child) {
            if (parent && child) {
                if (utils.isString(child)) {
                    parent.insertAdjacentHTML('beforeend', child);
                } else {
                    parent.appendChild(child);
                }
            }
            return this;
        },
        prepend: function(parent, child) {
            if (parent && child) {
                if (utils.isString(child)) {
                    parent.insertAdjacentHTML('afterbegin', child);
                } else {
                    parent.insertBefore(child, parent.firstChild);
                }
            }
            return this;
        },
        before: function(element, newNode) {
            if (element && element.parentNode && newNode) {
                if (utils.isString(newNode)) {
                    element.insertAdjacentHTML('beforebegin', newNode);
                } else {
                    element.parentNode.insertBefore(newNode, element);
                }
            }
            return this;
        },
        after: function(element, newNode) {
            if (element && element.parentNode && newNode) {
                if (utils.isString(newNode)) {
                    element.insertAdjacentHTML('afterend', newNode);
                } else {
                    element.parentNode.insertBefore(newNode, element.nextSibling);
                }
            }
            return this;
        },
        remove: function(element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            return this;
        },
        empty: function(element) {
            if (element) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }
            return this;
        },
        closest: function(element, selector) {
            if (!element) return null;
            return element.closest(selector);
        },
        position: function(element) {
            if (!element) return { top: 0, left: 0 };
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            };
        },
        offset: function(element) {
            if (!element) return { top: 0, left: 0 };
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            };
        },
        width: function(element) {
            if (!element) return 0;
            return element.offsetWidth;
        },
        height: function(element) {
            if (!element) return 0;
            return element.offsetHeight;
        },
        outerWidth: function(element, includeMargin = false) {
            if (!element) return 0;
            let width = element.offsetWidth;
            if (includeMargin) {
                const style = getComputedStyle(element);
                width += parseInt(style.marginLeft) + parseInt(style.marginRight);
            }
            return width;
        },
        outerHeight: function(element, includeMargin = false) {
            if (!element) return 0;
            let height = element.offsetHeight;
            if (includeMargin) {
                const style = getComputedStyle(element);
                height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            }
            return height;
        }
    };

    // HTTP client
    const http = {
        request: function(options = {}) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                const method = options.method ? options.method.toUpperCase() : 'GET';
                const url = options.url || '';
                const async = options.async !== false;
                const data = options.data || null;
                const headers = options.headers || {};
                const timeout = options.timeout || 0;
                
                xhr.open(method, url, async);
                
                // Set headers
                for (let key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                }
                
                // Set timeout
                if (timeout > 0) {
                    xhr.timeout = timeout;
                }
                
                // Handle response
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let response;
                        try {
                            response = JSON.parse(xhr.responseText);
                        } catch (e) {
                            response = xhr.responseText;
                        }
                        resolve({
                            data: response,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: xhr.getAllResponseHeaders(),
                            xhr: xhr
                        });
                    } else {
                        reject({
                            data: xhr.responseText,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: xhr.getAllResponseHeaders(),
                            xhr: xhr
                        });
                    }
                };
                
                // Handle error
                xhr.onerror = function() {
                    reject({
                        data: xhr.responseText,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers: xhr.getAllResponseHeaders(),
                        xhr: xhr
                    });
                };
                
                // Handle timeout
                xhr.ontimeout = function() {
                    reject({
                        data: 'Request timeout',
                        status: 0,
                        statusText: 'timeout',
                        headers: '',
                        xhr: xhr
                    });
                };
                
                // Send request
                if (method === 'GET' || method === 'HEAD' || !data) {
                    xhr.send();
                } else {
                    if (utils.isObject(data) && !(data instanceof FormData)) {
                        if (!headers['Content-Type']) {
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.send(JSON.stringify(data));
                        } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                            const params = new URLSearchParams();
                            for (let key in data) {
                                if (data.hasOwnProperty(key)) {
                                    params.append(key, data[key]);
                                }
                            }
                            xhr.send(params.toString());
                        } else {
                            xhr.send(JSON.stringify(data));
                        }
                    } else {
                        xhr.send(data);
                    }
                }
            });
        },
        get: function(url, options = {}) {
            return this.request(utils.extend({ method: 'GET', url }, options));
        },
        post: function(url, data, options = {}) {
            return this.request(utils.extend({ method: 'POST', url, data }, options));
        },
        put: function(url, data, options = {}) {
            return this.request(utils.extend({ method: 'PUT', url, data }, options));
        },
        patch: function(url, data, options = {}) {
            return this.request(utils.extend({ method: 'PATCH', url, data }, options));
        },
        delete: function(url, options = {}) {
            return this.request(utils.extend({ method: 'DELETE', url }, options));
        }
    };

    // Event system
    class EventEmitter {
        constructor() {
            this._events = {};
            this._maxListeners = 10;
        }
        
        on(event, callback) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            
            if (this._events[event].length >= this._maxListeners) {
                console.warn(`Warning: Event "${event}" has exceeded the maximum number of listeners (${this._maxListeners}).`);
            }
            
            this._events[event].push(callback);
            return this;
        }
        
        off(event, callback) {
            if (!this._events[event]) return this;
            
            if (!callback) {
                delete this._events[event];
            } else {
                this._events[event] = this._events[event].filter(cb => cb !== callback);
            }
            
            return this;
        }
        
        emit(event, ...args) {
            if (!this._events[event]) return false;
            
            this._events[event].forEach(callback => {
                callback.apply(this, args);
            });
            
            return true;
        }
        
        once(event, callback) {
            const onceCallback = (...args) => {
                this.off(event, onceCallback);
                callback.apply(this, args);
            };
            
            return this.on(event, onceCallback);
        }
        
        setMaxListeners(n) {
            this._maxListeners = n;
            return this;
        }
        
        getMaxListeners() {
            return this._maxListeners;
        }
        
        listenerCount(event) {
            return this._events[event] ? this._events[event].length : 0;
        }
        
        eventNames() {
            return Object.keys(this._events);
        }
    }

    // Simple reactive system
    class Observer {
        constructor(data, callback) {
            this.data = data;
            this.callback = callback;
            this.observe(data);
        }
        
        observe(obj) {
            if (!utils.isObject(obj)) return;
            
            Object.keys(obj).forEach(key => {
                let value = obj[key];
                
                if (utils.isObject(value)) {
                    this.observe(value);
                }
                
                Object.defineProperty(obj, key, {
                    get: () => value,
                    set: newValue => {
                        if (value === newValue) return;
                        
                        const oldValue = value;
                        value = newValue;
                        
                        if (utils.isObject(newValue)) {
                            this.observe(newValue);
                        }
                        
                        this.callback(key, newValue, oldValue);
                    }
                });
            });
        }
    }

    // Template engine
    class Template {
        constructor(options = {}) {
            this.options = utils.extend({
                delimiters: ['{{', '}}'],
                escape: true
            }, options);
            
            this.cache = {};
        }
        
        compile(template) {
            if (this.cache[template]) {
                return this.cache[template];
            }
            
            const delimiters = this.options.escape ? 
                this.escapeRegExp(this.options.delimiters[0]) + '\\s*(.+?)\\s*' + this.escapeRegExp(this.options.delimiters[1]) :
                this.options.delimiters[0] + '\\s*(.+?)\\s*' + this.options.delimiters[1];
            
            const pattern = new RegExp(delimiters, 'g');
            
            const tokens = [];
            let lastIndex = 0;
            let match;
            
            while ((match = pattern.exec(template)) !== null) {
                if (match.index > lastIndex) {
                    tokens.push({
                        type: 'text',
                        value: template.substring(lastIndex, match.index)
                    });
                }
                
                tokens.push({
                    type: 'expression',
                    value: match[1].trim()
                });
                
                lastIndex = pattern.lastIndex;
            }
            
            if (lastIndex < template.length) {
                tokens.push({
                    type: 'text',
                    value: template.substring(lastIndex)
                });
            }
            
            const render = (data) => {
                return tokens.map(token => {
                    if (token.type === 'text') {
                        return token.value;
                    } else {
                        try {
                            // Simple evaluation of expressions
                            const value = new Function('data', `with(data) { return ${token.value}; }`)(data);
                            return value !== undefined ? value : '';
                        } catch (e) {
                            console.error(`Template error: ${e.message}`);
                            return '';
                        }
                    }
                }).join('');
            };
            
            this.cache[template] = render;
            return render;
        }
        
        render(template, data) {
            const renderFn = this.compile(template);
            return renderFn(data);
        }
        
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    // Router
    class Router extends EventEmitter {
        constructor(options = {}) {
            super();
            
            this.options = utils.extend({
                mode: 'hash', // 'hash' or 'history'
                root: '/'
            }, options);
            
            this.routes = [];
            this.currentRoute = null;
            
            this._init();
        }
        
        _init() {
            if (this.options.mode === 'history') {
                window.addEventListener('popstate', this._handlePopState.bind(this));
            } else {
                window.addEventListener('hashchange', this._handleHashChange.bind(this));
            }
        }
        
        _handlePopState() {
            this.navigate(window.location.pathname.replace(this.options.root, ''));
        }
        
        _handleHashChange() {
            const hash = window.location.hash.slice(1);
            this.navigate(hash);
        }
        
        add(path, handler) {
            this.routes.push({ path, handler });
            return this;
        }
        
        remove(path) {
            this.routes = this.routes.filter(route => route.path !== path);
            return this;
        }
        
        navigate(path, replace = false) {
            const route = this._findRoute(path);
            
            if (route) {
                this.currentRoute = {
                    path,
                    params: this._extractParams(route.path, path)
                };
                
                route.handler(this.currentRoute.params);
                this.emit('navigate', this.currentRoute);
                
                if (this.options.mode === 'history') {
                    const url = this.options.root + path;
                    if (replace) {
                        window.history.replaceState({}, '', url);
                    } else {
                        window.history.pushState({}, '', url);
                    }
                } else {
                    if (replace) {
                        window.location.replace('#' + path);
                    } else {
                        window.location.hash = path;
                    }
                }
                
                return true;
            }
            
            return false;
        }
        
        _findRoute(path) {
            for (let i = 0; i < this.routes.length; i++) {
                const route = this.routes[i];
                const pattern = this._pathToRegExp(route.path);
                
                if (pattern.test(path)) {
                    return route;
                }
            }
            
            return null;
        }
        
        _pathToRegExp(path) {
            const pattern = path
                .replace(/\//g, '\\/') // Escape forward slashes
                .replace(/:\w+/g, '([^/]+)'); // Replace :param with capture group
            
            return new RegExp('^' + pattern + '$');
        }
        
        _extractParams(routePath, path) {
            const params = {};
            const paramNames = (routePath.match(/:\w+/g) || []).map(param => param.slice(1));
            const paramValues = path.match(this._pathToRegExp(routePath)) || [];
            
            paramNames.forEach((name, index) => {
                params[name] = paramValues[index + 1];
            });
            
            return params;
        }
        
        start() {
            if (this.options.mode === 'history') {
                this.navigate(window.location.pathname.replace(this.options.root, ''));
            } else {
                const hash = window.location.hash.slice(1);
                this.navigate(hash || '/');
            }
            
            return this;
        }
    }

    // Animation system
    class Animation {
        constructor(options = {}) {
            this.options = utils.extend({
                duration: 300,
                easing: 'linear',
                delay: 0
            }, options);
            
            this.easings = {
                linear: t => t,
                easeInQuad: t => t * t,
                easeOutQuad: t => t * (2 - t),
                easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
                easeInCubic: t => t * t * t,
                easeOutCubic: t => (--t) * t * t + 1,
                easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
                easeInQuart: t => t * t * t * t,
                easeOutQuart: t => 1 - (--t) * t * t * t,
                easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
            };
        }
        
        animate(element, properties, options = {}) {
            return new Promise(resolve => {
                const opts = utils.extend({}, this.options, options);
                const startTime = performance.now() + opts.delay;
                const easing = typeof opts.easing === 'function' ? opts.easing : this.easings[opts.easing] || this.easings.linear;
                const startValues = {};
                const endValues = {};
                
                // Get start and end values
                for (let prop in properties) {
                    if (properties.hasOwnProperty(prop)) {
                        let startValue = parseFloat(getComputedStyle(element)[prop]) || 0;
                        let endValue = parseFloat(properties[prop]);
                        let unit = (properties[prop] + '').replace(/^[+-]?\d+(?:\.\d+)?/, '') || '';
                        
                        startValues[prop] = { value: startValue, unit };
                        endValues[prop] = { value: endValue, unit };
                    }
                }
                
                const tick = (currentTime) => {
                    if (currentTime < startTime) {
                        requestAnimationFrame(tick);
                        return;
                    }
                    
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / opts.duration, 1);
                    const easedProgress = easing(progress);
                    
                    // Update properties
                    for (let prop in startValues) {
                        if (startValues.hasOwnProperty(prop)) {
                            const start = startValues[prop].value;
                            const end = endValues[prop].value;
                            const unit = startValues[prop].unit;
                            const value = start + (end - start) * easedProgress;
                            
                            element.style[prop] = value + unit;
                        }
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        // Ensure final values are set
                        for (let prop in endValues) {
                            if (endValues.hasOwnProperty(prop)) {
                                element.style[prop] = endValues[prop].value + endValues[prop].unit;
                            }
                        }
                        
                        if (opts.complete) {
                            opts.complete.call(element);
                        }
                        
                        resolve(element);
                    }
                };
                
                requestAnimationFrame(tick);
            });
        }
        
        fadeIn(element, options = {}) {
            element.style.opacity = 0;
            element.style.display = options.display || 'block';
            
            return this.animate(element, { opacity: 1 }, options);
        }
        
        fadeOut(element, options = {}) {
            return this.animate(element, { opacity: 0 }, utils.extend({}, options, {
                complete: () => {
                    element.style.display = 'none';
                    if (options.complete) {
                        options.complete.call(element);
                    }
                }
            }));
        }
        
        slideDown(element, options = {}) {
            const height = element.scrollHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.display = options.display || 'block';
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            
            return this.animate(element, {
                height: height + 'px',
                paddingTop: '',
                paddingBottom: '',
                marginTop: '',
                marginBottom: ''
            }, utils.extend({}, options, {
                complete: () => {
                    element.style.height = '';
                    element.style.overflow = '';
                    if (options.complete) {
                        options.complete.call(element);
                    }
                }
            }));
        }
        
        slideUp(element, options = {}) {
            element.style.overflow = 'hidden';
            element.style.height = element.offsetHeight + 'px';
            
            return this.animate(element, {
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0
            }, utils.extend({}, options, {
                complete: () => {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                    element.style.paddingTop = '';
                    element.style.paddingBottom = '';
                    element.style.marginTop = '';
                    element.style.marginBottom = '';
                    if (options.complete) {
                        options.complete.call(element);
                    }
                }
            }));
        }
    }

    // Main Kiwi class
    class Kiwi extends EventEmitter {
        constructor(options = {}) {
            super();
            
            this.options = utils.extend({
                element: null,
                data: {},
                methods: {},
                computed: {},
                watch: {},
                template: null,
                templateEngine: null,
                created: null,
                beforeMount: null,
                mounted: null,
                beforeUpdate: null,
                updated: null,
                beforeDestroy: null,
                destroyed: null
            }, options);
            
            this.el = typeof this.options.element === 'string' 
                ? dom.query(this.options.element) 
                : this.options.element;
                
            if (!this.el && this.options.element) {
                console.warn(`Kiwi: Element "${this.options.element}" not found.`);
            }
            
            // Initialize data
            this.data = {};
            
            // Initialize computed properties
            this.computed = {};
            
            // Initialize template engine
            this.templateEngine = this.options.templateEngine || new Template();
            
            // Initialize animation system
            this.animation = new Animation();
            
            // Call created hook
            if (utils.isFunction(this.options.created)) {
                this.options.created.call(this);
            }
            
            // Bind methods
            this._bindMethods();
            
            // Setup computed properties
            this._setupComputed();
            
            // Setup reactivity
            this._setupReactivity();
            
            // Setup watchers
            this._setupWatchers();
            
            // Call beforeMount hook
            if (utils.isFunction(this.options.beforeMount)) {
                this.options.beforeMount.call(this);
            }
            
            // Render template if provided
            if (this.options.template && this.el) {
                this._renderTemplate();
            }
            
            // Call mounted hook
            if (utils.isFunction(this.options.mounted)) {
                this.options.mounted.call(this);
            }
            
            return this;
        }
        
        _bindMethods() {
            const methods = this.options.methods || {};
            
            utils.each(methods, (method, key) => {
                if (utils.isFunction(method)) {
                    this[key] = method.bind(this);
                }
            });
        }
        
        _setupComputed() {
            const computed = this.options.computed || {};
            
            utils.each(computed, (getter, key) => {
                if (utils.isFunction(getter)) {
                    Object.defineProperty(this.computed, key, {
                        get: () => getter.call(this),
                        enumerable: true,
                        configurable: true
                    });
                    
                    Object.defineProperty(this, key, {
                        get: () => this.computed[key],
                        enumerable: true,
                        configurable: true
                    });
                }
            });
        }
        
        _setupReactivity() {
            // Copy initial data
            utils.extend(this.data, this.options.data);
            
            // Create observer
            this.observer = new Observer(this.data, (key, newValue, oldValue) => {
                this.emit('dataChange', key, newValue, oldValue);
                
                // Call beforeUpdate hook
                if (utils.isFunction(this.options.beforeUpdate)) {
                    this.options.beforeUpdate.call(this, key, newValue, oldValue);
                }
                
                // Re-render template if provided
                if (this.options.template && this.el) {
                    this._renderTemplate();
                }
                
                // Call updated hook
                if (utils.isFunction(this.options.updated)) {
                    this.options.updated.call(this, key, newValue, oldValue);
                }
            });
            
            // Proxy data properties to the instance
            Object.keys(this.data).forEach(key => {
                Object.defineProperty(this, key, {
                    get: () => this.data[key],
                    set: value => {
                        this.data[key] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
            });
        }
        
        _setupWatchers() {
            const watch = this.options.watch || {};
            
            utils.each(watch, (handler, key) => {
                this.$watch(key, handler);
            });
        }
        
        _renderTemplate() {
            if (!this.el || !this.options.template) return;
            
            // Merge data and computed properties for template rendering
            const templateData = utils.extend({}, this.data, this.computed);
            
            // Render template
            const html = this.templateEngine.render(this.options.template, templateData);
            
            // Update DOM
            this.el.innerHTML = html;
        }
        
        // Public API
        $set(key, value) {
            if (typeof key === 'object') {
                utils.each(key, (val, k) => {
                    this.$set(k, val);
                });
            } else {
                if (this.data[key] === undefined) {
                    // Add new property
                    this.data[key] = value;
                    
                    // Make it reactive
                    this.observer.observe(this.data);
                    
                    // Proxy to instance
                    Object.defineProperty(this, key, {
                        get: () => this.data[key],
                        set: val => {
                            this.data[key] = val;
                        },
                        enumerable: true,
                        configurable: true
                    });
                } else {
                    // Update existing property
                    this.data[key] = value;
                }
            }
            
            return this;
        }
        
        $get(key) {
            return key ? this.data[key] : this.data;
        }
        
        $watch(key, callback) {
            if (utils.isObject(key)) {
                utils.each(key, (handler, k) => {
                    this.$watch(k, handler);
                });
                return this;
            }
            
            const watcher = (changedKey, newValue, oldValue) => {
                if (changedKey === key) {
                    callback.call(this, newValue, oldValue);
                }
            };
            
            this.on('dataChange', watcher);
            
            // Return unwatcher function
            return () => {
                this.off('dataChange', watcher);
            };
        }
        
        $nextTick(callback) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const result = callback ? callback.call(this) : null;
                    resolve(result);
                }, 0);
            });
        }
        
        $destroy() {
            // Call beforeDestroy hook
            if (utils.isFunction(this.options.beforeDestroy)) {
                this.options.beforeDestroy.call(this);
            }
            
            // Clean up event listeners
            this._events = {};
            
            // Call destroyed hook
            if (utils.isFunction(this.options.destroyed)) {
                this.options.destroyed.call(this);
            }
            
            // Clear references
            this.el = null;
            this.options = null;
            this.data = null;
            this.computed = null;
            this.observer = null;
            this.templateEngine = null;
            this.animation = null;
        }
        
        // Animation methods
        $animate(element, properties, options) {
            return this.animation.animate(element, properties, options);
        }
        
        $fadeIn(element, options) {
            return this.animation.fadeIn(element, options);
        }
        
        $fadeOut(element, options) {
            return this.animation.fadeOut(element, options);
        }
        
        $slideDown(element, options) {
            return this.animation.slideDown(element, options);
        }
        
        $slideUp(element, options) {
            return this.animation.slideUp(element, options);
        }
    }

    // Static methods and properties
    Kiwi.version = '1.1.0';
    
    // Expose utilities
    Kiwi.utils = utils;
    Kiwi.dom = dom;
    Kiwi.http = http;
    
    // Expose classes
    Kiwi.EventEmitter = EventEmitter;
    Kiwi.Template = Template;
    Kiwi.Router = Router;
    Kiwi.Animation = Animation;
    
    // Plugin system
    Kiwi.plugins = {};
    
    Kiwi.use = function(plugin, options = {}) {
        if (utils.isFunction(plugin)) {
            plugin(Kiwi, options);
        } else if (utils.isObject(plugin) && utils.isFunction(plugin.install)) {
            plugin.install(Kiwi, options);
        }
        return Kiwi;
    };
    
    // Create a Kiwi instance without new keyword
    Kiwi.create = function(options) {
        return new Kiwi(options);
    };
    
    // Helper to create a component definition
    Kiwi.component = function(name, definition) {
        if (!Kiwi.components) {
            Kiwi.components = {};
        }
        
        Kiwi.components[name] = definition;
        return definition;
    };
    
    return Kiwi;
})));