(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 113:
/*!***************************!*\
  !*** E:/app/util/util.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.formatTime = formatTime;exports.geTel = geTel;exports.formatScore = formatScore;exports.getCurDateYM = getCurDateYM;exports.formatTimeYMDHM = formatTimeYMDHM;exports.formatTimeString = formatTimeString;exports.disposalPrice = disposalPrice;exports.countBrowseNum = countBrowseNum;exports.getTitleByType = getTitleByType; /*
                                                                                                                                                                                                                                                                                                                                                                                                                     * @Author: tango
                                                                                                                                                                                                                                                                                                                                                                                                                     * @Date: 2019-12-26 16:34:09
                                                                                                                                                                                                                                                                                                                                                                                                                     * @LastEditors  : your name
                                                                                                                                                                                                                                                                                                                                                                                                                     * @LastEditTime : 2019-12-31 17:15:27
                                                                                                                                                                                                                                                                                                                                                                                                                     * @Description: file content
                                                                                                                                                                                                                                                                                                                                                                                                                     */
var formatNumber = function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

function formatTime(value, type) {
  value = Number(value);
  var date = new Date(value); // 一定要记得写这个，不然会报date.getFullYear is not a function
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (type === 1) {
    return [hour, minute].map(formatNumber).join(':');
  } else if (type === 2) {
    return [year, month, day].map(formatNumber).join('/');
  } else if (type === 3) {
    return [month, day].map(formatNumber).join('/');
  } else {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }
}

function geTel(tel) {
  var reg = /^(\d{3})\d{4}(\d{4})$/;
  if (tel) {
    console.log(1);
    return tel.replace(reg, '$1****$2');
  } else {
    return '';
  }
}

function formatScore(n) {
  var n1 = Number(n).toFixed(2);
  return n1.substring(n1.length - 1) === '0' ? n1.substring(0, 3) : n1.substring(0, 4);
}

// export function formatTime(value) {

//   var date = new Date(value)

//   var Y = date.getFullYear() + '/'
//   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
//   var D = date.getDate() + ' '
//   var h = date.getHours() + ':'
//   var m = date.getMinutes() + ':'
//   var s = date.getSeconds()
//   var df = Y + M + D + h + m + s
//   return df
// }

// 获得当前年月
function getCurDateYM() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month > 9 ? month : '0' + month;
  return "".concat(year, "-").concat(month);
}

// 格式化时间 Y-M-D HH:MM:ss
function formatTimeYMDHM(number) {
  number = typeof number === 'number' ? number : Number(number);
  var now = new Date(number);
  var year = now.getFullYear();

  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var seconds = now.getSeconds();
  month = month > 9 ? month : '0' + month;
  date = date > 9 ? date : '0' + date;
  hour = hour > 9 ? hour : '0' + hour;
  minute = minute > 9 ? minute : '0' + minute;
  seconds = seconds > 9 ? seconds : '0' + seconds;
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
}
// 格式化时间 Y-M-D HH:MM:ss
function formatTimeString(number) {
  number = typeof number === 'number' ? number : Number(number);
  var now = new Date(number);
  var year = now.getFullYear();

  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var seconds = now.getSeconds();
  return year + '年' + month + '月' + date + '日' + hour + '时';
}
// 格式price/useScore
function disposalPrice(list) {
  return list.map(function (item) {
    item['price'] = item['price'] ? item['price'] / 100 : '';
    item['useScore'] = item['useScore'] ? item['useScore'] / 100 : '';
    return item;
  });
}

function countBrowseNum(num) {
  if (!num) return num;
  if (num > 99999) return parseInt(num / 10000) + 'w+';
  return num / 10000 < 1 ? num : Math.floor(num / 10000 * 10) / 10 + 'w+';
}


function getTitleByType(type) {
  switch (type) {
    case 0:return "浏览记录";
    case 1:return "点赞记录";
    case 2:return "收藏记录";
    default:return "其它";}

}

/***/ }),

/***/ 12:
/*!*****************************!*\
  !*** E:/app/util/config.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.amapConfig = exports.qiniuUpload = exports.imConfig = exports.specialConfig = exports.httpConfig = exports.wexinConfig = void 0; //配制基础功能项目
var wexinConfig = {
  AppID: 'wx09fb2ae3ba9efbff',
  version: '1.0.0' };exports.wexinConfig = wexinConfig;


var httpConfig = {
  //测试环境
  baseURL: 'https://testmini.madrock.com.cn',
  // baseURL: 'http://192.168.1.167:8081',
  //生产环境
  // baseURL: '//mini.madrock.com.cn',
  //预发布环境
  // baseURL: '//premini.madrock.com.cn'; ,
  header: {
    'content-type': 'application/x-www-form-urlencoded' },

  method: 'GET',
  dataType: 'json',
  responseType: 'text' };exports.httpConfig = httpConfig;


var specialConfig = {
  storeId: '1196334167697264640' };exports.specialConfig = specialConfig;


var imConfig = {
  // 请前往开发者后台 -> 创建应用可获取 appkey https://developer.rongcloud.cn
  appkey: 'vnroth0kv8djo' };exports.imConfig = imConfig;


var qiniuUpload = {
  url: "https://upload-z0.qiniup.com" };exports.qiniuUpload = qiniuUpload;


var amapConfig = {
  wxKey: "61f0af2839b206735867f22ff0018858",
  jsKey: "3e64b444457a3e646e1e59b74f34e309",
  types: [120000],
  point: '104.06667,30.66667' };exports.amapConfig = amapConfig;

/***/ }),

/***/ 122:
/*!**************************!*\
  !*** E:/app/util/map.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * 微信小程序JavaScriptSDK
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @version 1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @date 2017-01-10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @author jaysonzhou@tencent.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */

var ERROR_CONF = {
  KEY_ERR: 311,
  KEY_ERR_MSG: 'key格式错误',
  PARAM_ERR: 310,
  PARAM_ERR_MSG: '请求参数信息有误',
  SYSTEM_ERR: 600,
  SYSTEM_ERR_MSG: '系统错误',
  WX_ERR_CODE: 1000,
  WX_OK_CODE: 200 };

var BASE_URL = 'https://apis.map.qq.com/ws/';
var URL_SEARCH = BASE_URL + 'place/v1/search';
var URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';
var URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';
var URL_CITY_LIST = BASE_URL + 'district/v1/list';
var URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';
var URL_DISTANCE = BASE_URL + 'distance/v1/';
var Utils = {
  /**
                 * 得到终点query字符串
                 * @param {Array|String} 检索数据
                 */
  location2query: function location2query(data) {
    if (typeof data === 'string') {
      return data;
    }
    var query = '';
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      if (query) {
        query += ';';
      }
      if (d.location) {
        query = query + d.location.lat + ',' + d.location.lng;
      }
      if (d.latitude && d.longitude) {
        query = query + d.latitude + ',' + d.longitude;
      }
    }
    return query;
  },

  /**
        * 使用微信接口进行定位
        */
  getWXLocation: function getWXLocation(success, fail, complete) {
    wx.getLocation({
      type: 'gcj02',
      success: success,
      fail: fail,
      complete: complete });

  },

  /**
        * 获取location参数
        */
  getLocationParam: function getLocationParam(location) {
    if (typeof location === 'string') {
      var locationArr = location.split(',');
      if (locationArr.length === 2) {
        location = {
          latitude: location.split(',')[0],
          longitude: location.split(',')[1] };

      } else {
        location = {};
      }
    }
    return location;
  },

  /**
        * 回调函数默认处理
        */
  polyfillParam: function polyfillParam(param) {
    param.success = param.success || function () {};
    param.fail = param.fail || function () {};
    param.complete = param.complete || function () {};
  },

  /**
        * 验证param对应的key值是否为空
        *
        * @param {Object} param 接口参数
        * @param {String} key 对应参数的key
        */
  checkParamKeyEmpty: function checkParamKeyEmpty(param, key) {
    if (!param[key]) {
      var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + key + '参数格式有误');
      param.fail(errconf);
      param.complete(errconf);
      return true;
    }
    return false;
  },

  /**
        * 验证参数中是否存在检索词keyword
        *
        * @param {Object} param 接口参数
        */
  checkKeyword: function checkKeyword(param) {
    return !this.checkParamKeyEmpty(param, 'keyword');
  },

  /**
        * 验证location值
        *
        * @param {Object} param 接口参数
        */
  checkLocation: function checkLocation(param) {
    var location = this.getLocationParam(param.location);
    if (!location || !location.latitude || !location.longitude) {
      var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误');
      param.fail(errconf);
      param.complete(errconf);
      return false;
    }
    return true;
  },

  /**
        * 构造错误数据结构
        * @param {Number} errCode 错误码
        * @param {Number} errMsg 错误描述
        */
  buildErrorConfig: function buildErrorConfig(errCode, errMsg) {
    return {
      status: errCode,
      message: errMsg };

  },

  /**
        * 构造微信请求参数，公共属性处理
        *
        * @param {Object} param 接口参数
        * @param {Object} param 配置项
        */
  buildWxRequestConfig: function buildWxRequestConfig(param, options) {
    var that = this;
    options.header = { 'content-type': 'application/json' };
    options.method = 'GET';
    options.success = function (res) {
      var data = res.data;
      if (data.status === 0) {
        param.success(data);
      } else {
        param.fail(data);
      }
    };
    options.fail = function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, result.errMsg));
    };
    options.complete = function (res) {
      var statusCode = +res.statusCode;
      switch (statusCode) {
        case ERROR_CONF.WX_ERR_CODE:{
            param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
            break;
          }
        case ERROR_CONF.WX_OK_CODE:{
            var data = res.data;
            if (data.status === 0) {
              param.complete(data);
            } else {
              param.complete(that.buildErrorConfig(data.status, data.message));
            }
            break;
          }
        default:{
            param.complete(that.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG));
          }}

    };
    return options;
  },

  /**
        * 处理用户参数是否传入坐标进行不同的处理
        */
  locationProcess: function locationProcess(param, locationsuccess, locationfail, locationcomplete) {
    var that = this;
    locationfail = locationfail || function (res) {
      res.statusCode = ERROR_CONF.WX_ERR_CODE;
      param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
    };
    locationcomplete = locationcomplete || function (res) {
      if (res.statusCode == ERROR_CONF.WX_ERR_CODE) {
        param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
      }
    };
    if (!param.location) {
      that.getWXLocation(locationsuccess, locationfail, locationcomplete);
    } else if (that.checkLocation(param)) {
      var location = Utils.getLocationParam(param.location);
      locationsuccess(location);
    }
  } };var


QQMapWX = /*#__PURE__*/function () {
  /**
                                       * 构造函数
                                       *
                                       * @param {Object} options 接口参数,key 为必选参数
                                       */
  function QQMapWX(options) {_classCallCheck(this, QQMapWX);
    if (!options.key) {
      throw Error('key值不能为空');
    }
    this.key = options.key;
  }

  /**
       * POI周边检索
       *
       * @param {Object} options 接口参数对象
       *
       * 参数对象结构可以参考
       * @see http://lbs.qq.com/webservice_v1/guide-search.html
       */_createClass(QQMapWX, [{ key: "search", value: function search(
    options) {
      var that = this;
      options = options || {};

      Utils.polyfillParam(options);

      if (!Utils.checkKeyword(options)) {
        return;
      }

      var requestParam = {
        keyword: options.keyword,
        orderby: options.orderby || '_distance',
        page_size: options.page_size || 10,
        page_index: options.page_index || 1,
        output: 'json',
        key: that.key };


      if (options.address_format) {
        requestParam.address_format = options.address_format;
      }

      if (options.filter) {
        requestParam.filter = options.filter;
      }

      var distance = options.distance || '1000';
      var auto_extend = options.auto_extend || 1;

      var locationsuccess = function locationsuccess(result) {
        requestParam.boundary = 'nearby(' + result.latitude + ',' + result.longitude + ',' + distance + ',' + auto_extend + ')';
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_SEARCH,
          data: requestParam }));

      };
      Utils.locationProcess(options, locationsuccess);
    }

    /**
         * sug模糊检索
         *
         * @param {Object} options 接口参数对象
         *
         * 参数对象结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-suggestion.html
         */ }, { key: "getSuggestion", value: function getSuggestion(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (!Utils.checkKeyword(options)) {
        return;
      }

      var requestParam = {
        keyword: options.keyword,
        region: options.region || '全国',
        region_fix: options.region_fix || 0,
        policy: options.policy || 0,
        output: 'json',
        key: that.key };

      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_SUGGESTION,
        data: requestParam }));

    }

    /**
         * 逆地址解析
         *
         * @param {Object} options 接口参数对象
         *
         * 请求参数结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-gcoder.html
         */ }, { key: "reverseGeocoder", value: function reverseGeocoder(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);
      var requestParam = {
        coord_type: options.coord_type || 5,
        get_poi: options.get_poi || 0,
        output: 'json',
        key: that.key };

      if (options.poi_options) {
        requestParam.poi_options = options.poi_options;
      }

      var locationsuccess = function locationsuccess(result) {
        requestParam.location = result.latitude + ',' + result.longitude;
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_GET_GEOCODER,
          data: requestParam }));

      };
      Utils.locationProcess(options, locationsuccess);
    }

    /**
         * 地址解析
         *
         * @param {Object} options 接口参数对象
         *
         * 请求参数结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-geocoder.html
         */ }, { key: "geocoder", value: function geocoder(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'address')) {
        return;
      }

      var requestParam = {
        address: options.address,
        output: 'json',
        key: that.key };


      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_GET_GEOCODER,
        data: requestParam }));

    }

    /**
         * 获取城市列表
         *
         * @param {Object} options 接口参数对象
         *
         * 请求参数结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-region.html
         */ }, { key: "getCityList", value: function getCityList(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);
      var requestParam = {
        output: 'json',
        key: that.key };


      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_CITY_LIST,
        data: requestParam }));

    }

    /**
         * 获取对应城市ID的区县列表
         *
         * @param {Object} options 接口参数对象
         *
         * 请求参数结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-region.html
         */ }, { key: "getDistrictByCityId", value: function getDistrictByCityId(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'id')) {
        return;
      }

      var requestParam = {
        id: options.id || '',
        output: 'json',
        key: that.key };


      wx.request(Utils.buildWxRequestConfig(options, {
        url: URL_AREA_LIST,
        data: requestParam }));

    }

    /**
         * 用于单起点到多终点的路线距离(非直线距离)计算：
         * 支持两种距离计算方式：步行和驾车。
         * 起点到终点最大限制直线距离10公里。
         *
         * @param {Object} options 接口参数对象
         *
         * 请求参数结构可以参考
         * http://lbs.qq.com/webservice_v1/guide-distance.html
         */ }, { key: "calculateDistance", value: function calculateDistance(
    options) {
      var that = this;
      options = options || {};
      Utils.polyfillParam(options);

      if (Utils.checkParamKeyEmpty(options, 'to')) {
        return;
      }

      var requestParam = {
        mode: options.mode || 'walking',
        to: Utils.location2query(options.to),
        output: 'json',
        key: that.key };


      var locationsuccess = function locationsuccess(result) {
        requestParam.from = result.latitude + ',' + result.longitude;
        wx.request(Utils.buildWxRequestConfig(options, {
          url: URL_DISTANCE,
          data: requestParam }));

      };
      if (options.from) {
        options.location = options.from;
      }

      Utils.locationProcess(options, locationsuccess);
    } }]);return QQMapWX;}();var _default =


QQMapWX;exports.default = _default;

/***/ }),

/***/ 13:
/*!*******************************!*\
  !*** E:/app/util/services.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  "use strict";
  if ( true && typeof module !== undefined) {
    module.exports = factory();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(window, function () {
  var RongIMLib,
  RongIMClient,
  appKey,
  token,
  token2,
  connectToken,
  targetIdList = [],
  targetId = "user9", // 接受者默认 id
  targetId2 = "user10", // 接收者默认值 id
  recallMessage = null,
  clearMessage,
  mockVoice = getMockVoice();

  var modules;

  var UploadUrl = 'https://upload.qiniup.com';

  //加入聊天室后，可以用任意一个发送消息的方法发送消息，只需要conversationType为CHATROOM
  var chatRoomId = "chatRoomId-008"; // 聊天室 Id,可任意指定，能区分不同聊天室即可

  var publicServiceId = "Rong_shuise";

  function markMessage(message) {
    recallMessage = JSON.parse(JSON.stringify(message));
    clearMessage = JSON.parse(JSON.stringify(message));;
  }

  function init(params, callbacks, modulesConf) {
    params = params || {};
    modules = modulesConf || {};
    var navi = params.navi || "",
    api = params.api || "",
    imClient = params.imClient,
    protobuf = modules.protobuf || null,
    dataProvider = null,
    config = {},
    imInstance = null;

    // 存储到全局
    appKey = params.appKey;
    token = params.token;
    token2 = params.token2;
    connectToken = params.connectToken;
    RongIMLib = modules.RongIMLib || {};
    RongIMClient = RongIMLib.RongIMClient;
    targetIdList = params.targetIds || [];
    if (targetIdList.length > 0) {
      targetId = targetIdList[0];
    }
    if (targetIdList.length > 1) {
      targetId2 = targetIdList[1];
    }

    // 私有云切换navi导航，私有云格式 '120.92.10.214:8888'
    if (navi !== "") {
      config.navi = navi;
    }

    // 私有云切换api,私有云格式 '172.20.210.38:81:8888'
    if (api !== "") {
      config.api = api;
    }

    // support protobuf url + function
    if (protobuf !== null) {
      config.protobuf = protobuf;
    }

    // 引入桌面版 C++ SDK
    if (imClient) {
      dataProvider = new RongIMLib.VCDataProvider(imClient);
    }

    RongIMLib.RongIMClient.init(appKey, dataProvider, config);

    imInstance = RongIMClient.getInstance();

    /*
                                                 设置连接状态监听器
                                              */
    RongIMClient.setConnectionStatusListener({
      onChanged: function onChanged(status) {

        console.log(status);

        switch (status) {
          case RongIMLib.ConnectionStatus["CONNECTED"]:
          case 0:
            console.log("连接成功");
            callbacks.getInstance && callbacks.getInstance(imInstance);
            break;

          case RongIMLib.ConnectionStatus["CONNECTING"]:
          case 1:
            console.log("连接中");
            break;

          case RongIMLib.ConnectionStatus["DISCONNECTED"]:
          case 2:
            // callbacks.networkError && callbacks.networkError("网络不可用");
            console.log("当前用户主动断开链接");
            break;

          case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
          case 3:
            callbacks.networkError && callbacks.networkError("网络不可用");
            console.log("网络不可用");
            break;

          case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
          case 4:
            console.log("未知原因，连接关闭");
            break;

          case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
          case 6:
            callbacks.networkError && callbacks.networkError("用户账户在其他设备登录，本机会被踢掉线");
            console.log("用户账户在其他设备登录，本机会被踢掉线");
            break;

          case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
          case 12:
            console.log("当前运行域名错误，请检查安全域名配置");
            break;}

      } });



    /*
                文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器
                  注意事项：
                    1：为了看到接收效果，需要另外一个用户向本用户发消息
                    2：判断会话唯一性 ：conversationType + targetId
                    3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
                    4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
            */

    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function onReceived(message) {
        // 判断消息类型
        callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
      } });



    registerMessage("PersonMessage", ["content", "user"]);

    RongIMClient.connect(connectToken, {
      onSuccess: function onSuccess(userId) {
        RongIMClient.Conversation.watch(function (list) {
          callbacks.watchConversationList(list);
        });
        console.log(RongIMLib);
        callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId });
      },
      onTokenIncorrect: function onTokenIncorrect() {
        callbacks.onTokenIncorrect && callbacks.onTokenIncorrect();
        console.log("token无效");
      },
      onError: function onError(errorCode) {
        console.log(errorCode);
      } },
    params.userId);


  };


  var Status = {
    changeUser: function changeUser(callbacks) {
      RongIMClient.getInstance().logout();
      connectToken = connectToken === token ? token2 : token;
      var params = {
        appKey: appKey,
        token: token,
        token2: token2,
        targetIds: [targetId, targetId2],
        connectToken: connectToken };


      init(params, callbacks, modules);
    },

    /*
          断开连接 
        */
    disconnect: function disconnect() {
      /*
                                       文档：http://www.rongcloud.cn/docs/api/js/RongIMClient.html
                                       */

      RongIMClient.getInstance().logout();
      console.log('断开连接 成功');
    },

    /*
           重新连接
        */
    reconnect: function reconnect() {

      var callback = {
        onSuccess: function onSuccess(userId) {
          console.log('reconnect success. ' + userId);
        },
        onTokenIncorrect: function onTokenIncorrect() {
          console.log('token 无效');
        },
        onError: function onError(errorCode) {
          console.log(errorcode);
        } };


      RongIMClient.reconnect(callback, {
        auto: true,
        url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js?d=' + Date.now(),
        rate: [100, 1000, 3000, 6000, 10000] });

      // RongIMClient.connect(token, {
      //     onSuccess: function(userId) {
      //         callback(null, '重新链接成功, 用户 id: ' + userId)
      //     },
      //     onTokenIncorrect: function() {
      //         callback('重新链接失败, token 无效');
      //     },
      //     onError:function(errorCode){
      //         var info = '';
      //         switch (errorCode) {
      //             case RongIMLib.ErrorCode.TIMEOUT:
      //                 info = '超时';
      //                 break;
      //             case RongIMLib.ErrorCode.UNKNOWN_ERROR:
      //                 info = '未知错误';
      //                 break;
      //             case RongIMLib.ErrorCode.UNACCEPTABLE_PROTOCOL_VERSION:
      //                 info = '不可接受的协议版本';
      //                 break;
      //             case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
      //                 info = 'appkey不正确';
      //                 break;
      //             case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
      //                 info = '服务器不可用';
      //                 break;
      //       }
      //       callback("重新链接 失败, " + info);
      //     }
      // });
    },

    /*
           设置自己在线状态
        */
    setUserStatus: function setUserStatus(callback) {
      /*
                                                         自定义在线状态(举例)：
                                                         
                                                         1、在线
                                                             status : 10 
                                                           2、离开
                                                             status : 11 
                                                           3、忙碌
                                                             status : 12  
                                                       */



      var status = 10;
      RongIMClient.getInstance().setUserStatus(status, {
        onSuccess: function onSuccess(status) {
          callback(null, '设置在线状态成功: ' + status);
        },
        onError: callback });

    },

    /*
           查询其他人在线状态
        */
    getUserStatus: function getUserStatus() {
      var params = {
        userIds: targetIdList };

      RongIMClient.getInstance().setUserStatusListener(params, function (userStatus) {
        callback(null, '获取用户在线状态成功' + JSON.stringify(userStatus));
      });
    } };


  var Message = {
    /*
                      文字消息
                   */
    sendText: function sendText(callback, obj, user) {
      /*
                                                      文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
                                                             http://rongcloud.cn/docs/api/js/TextMessage.html
                                                      1: 单条消息整体不得大于128K
                                                      2: conversationType 类型是 number，targetId 类型是 string
                                                      */
      /*
                                                             1、不要多端登陆，保证所有端都离线
                                                             2、接收 push 设备设置:
                                                                 （1）打开系统通知提醒
                                                                 （2）小米设置 “授权管理” －> “自己的应用” 为自启动
                                                                 （3）应用内不要屏蔽新消息通知
                                                             3、内置消息类型，默认 push，自定义消息类型需要
                                                                pushData 显示逻辑顺序：自定义 > 默认
                                                             4、发送其他消息类型与发送 TextMessage 逻辑、方式一致
                                                         */
      var pushData = "pushData" + Date.now();
      var isMentioned = false;

      var msg = new RongIMLib.TextMessage({
        content: obj.content,
        user: user });

      /*
                           单聊类型
                           更多会话类型可参考 http://www.rongcloud.cn/docs/web_api_demo.html#conversation
                        */
      var conversationType = RongIMLib.ConversationType.PRIVATE;;

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function onSuccess(message) {
          console.log('发送消息成功, 信息为: ', message);
          callback(message);
        },
        onError: function onError(errorCode) {
          console.log('发送消息失败', errorCode);
        } },
      isMentioned, pushData);
    },

    /*
           图片消息
        */
    sendImage: function sendImage(callback, obj, user) {
      /*
                                                        文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html
                                                          需自行解决文件上传
                                                        上传插件（含获取缩略图方法）: https://github.com/rongcloud/rongcloud-web-im-upload
                                                        
                                                        缩略图必须是base64码的jpg图，而且不带前缀"data:image/jpeg;base64,"，不得超过100K
                                                        压缩：https://github.com/rongcloud/rongcloud-web-im-upload/blob/master/resize.html
                                                        */

      var content = {
        imageUri: obj.url || "http://rongcloud.cn/images/newVersion/log_wx.png",
        content: obj.base64 || getBase64Image(),
        user: user };


      var msg = new RongIMLib.ImageMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(message);
        },
        onError: callback });

    },

    /*
           文件消息
        */
    sendFile: function sendFile(callback) {
      /*
                                           文档：http://www.rongcloud.cn/docs/api/js/ImageMessage.html
                                             upload组件：https://github.com/rongcloud/rongcloud-web-im-upload
                                           上传插件文档: http://rongcloud.cn/docs/web.html#上传插件
                                             单条消息整体不得大于128K
                                             文件消息分两步：
                                               1、上传文件至文件服务器
                                               2、发送文件信息和文件 URL
                                           */



      var content = {
        name: "log_wx", // 文件名称
        size: "20k", // 文件大小，单位自己约定
        type: "png", // 文件的后缀名，例如 png、js、doc ...
        fileUrl: "http://rongcloud.cn/images/newVersion/log_wx.png" // 文件地址
      };

      var msg = new RongIMLib.FileMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(null, message);
        },
        onError: callback });

    },

    /*
           音频消息
        */
    sendVoice: function sendVoice(callback) {
      /*
                                             文档：http://www.rongcloud.cn/docs/api/js/VoiceMessage.html
                                               需自行解决录音和转码问题，要求编码为base64格式amr，不带前缀，不得超过100K
                                               声音播放：https://rongcloud.github.io/websdk-demo/voice.html
                                             */


      var content = {
        content: mockVoice,
        duration: 20 };


      var msg = new RongIMLib.VoiceMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(null, message);
        },
        onError: callback });

    },

    /*
           @ 消息
        */
    sendAt: function sendAt(callback) {
      /*
                                       @ 消息对象
                                       全部：RongIMLib.MentionedType.ALL；
                                       部分：RongIMLib.MentionedType.PART
                                       
                                       文档说明：http://support.rongcloud.cn/kb/NjE1
                                       接收@代码：https://rongcloud.github.io/websdk-demo/connect-check.html
                                       */
      var mentioneds = new RongIMLib.MentionedInfo();
      mentioneds.type = RongIMLib.MentionedType.PART;
      mentioneds.userIdList = [targetId, targetId2];

      var content = {
        content: "This is a at message!",
        extra: "extra info",
        mentionedInfo: mentioneds };


      var msg = new RongIMLib.TextMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(null, message);
        },
        onError: callback },
      true);
    },

    /*
           位置消息
        */
    sendLocation: function sendLocation(callback) {
      /*
                                                   文档：http://www.rongcloud.cn/docs/api/js/LocationMessage.html
                                                     缩略图必须是base64码的jpg图，而且不带前缀"data:image/jpeg;base64,"，不得超过100K
                                                     需要自己做显示效果，一般显示逻辑：图片加链接，传入经纬度并跳转进入地图网站
                                                   */


      var content = {
        "content": getBase64Image(),
        "latitude": "24.114",
        "longitude": "334.221",
        "poi": "北京市朝阳区北苑路北辰泰岳大厦" };


      var msg = new RongIMLib.LocationMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(null, message);
        },
        onError: callback });

    },

    /*
           富文本消息
        */
    sendRichContent: function sendRichContent(callback) {
      /*
                                                         文档: http://www.rongcloud.cn/docs/api/js/RichContentMessage.html
                                                         */
      var content = {
        "title": "sendRichContentMessage",
        "content": "<a href=\"http://www.rongcloud.cn\">hello</a>",
        "imageUri": "http://www.demo.com/1.jpg",
        "url": "http://www.rongcloud.cn/",
        "extra": "{\"key\":\"value\"}" };


      var msg = new RongIMLib.RichContentMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          markMessage(message);
          callback(null, message);
        },
        onError: callback });

    },

    /*
           自定义消息
        */
    sendRegister: function sendRegister(callback, obj, user) {
      /*
                                                              文档：http://www.rongcloud.cn/docs/web_api_demo.html#自定义消息
                                                                注意事项：
                                                                  1：init之前注册新消息类型
                                                                  2：对应接收 onReceived: function (message) {}
                                                                      message.messageType == "PersonMessage"
                                                                  3：需要自己做解析实现
                                                              */

      // var propertys = ["name","age","gender"]; // 消息类中的属性名。


      var msg = new RongIMClient.RegisterMessage.PersonMessage({
        content: obj.content,
        user: user });




      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, obj.targetId, msg, {
        onSuccess: function onSuccess(message) {
          console.log('发送消息成功, 信息为: ', message);
          callback(message);
        },
        onError: function onError(errorCode) {
          console.log('发送自定义消息失败');
        } });

    },

    /*
           撤回消息
        */
    sendRecall: function sendRecall(callback) {
      if (recallMessage == null) {
        console.log('请先发送任意一条消息再执行撤回');
        callback('请先发送任意一条消息再执行撤回');
        return;
      }
      /*
        注意事项:
            消息撤回服务器端没有时间限制，由客户端决定
         */
      RongIMClient.getInstance().sendRecallMessage(recallMessage, {
        onSuccess: function onSuccess(message) {
          callback(null, message);
        },
        onError: callback });

    },

    /*
           同步状态消息
        */
    sendSyncReadStatus: function sendSyncReadStatus(callback) {
      /*
                                                               具体处理说明文档： http://support.rongcloud.cn/kb/NjE0
                                                               一端发送，其他端接受并做同步更新
                                                               */
      var sentTime = 1486975569605;

      var content = {
        lastMessageSendTime: sentTime };


      var msg = new RongIMLib.SyncReadStatusMessage(content);

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function onSuccess(message) {
          callback(null, message);
        },
        onError: callback });

    },

    /*
           检查是否有未读消息
        */
    checkUnread: function checkUnread(callback) {
      /*
                                                 文档: http://www.rongcloud.cn/docs/web.html#unread_message
                                                   此接口必须在init()方法之后调用，但不依赖于connect
                                                 只返回true/false，不返回具体的未读数量
                                                 若连接成功后调用此方法将一直返回 false。
                                                 */

      RongIMClient.getInstance().hasRemoteUnreadMessages(token, {
        onSuccess: function onSuccess(hasMessage) {
          callback(null, {
            hasMessage: hasMessage,
            tip: '此接口必须在init()方法之后调用，但不依赖于connect. 只返回true/false. 不返回具体的未读数量. 若连接成功后调用此方法将一直返回 false' });

        },
        onError: callback });

    },

    /*
           消息接收
        */
    receive: function receive(callback) {
      callback(null, '请见 init 方法里的 RongIMClient.setOnReceiveMessageListener');
    },

    /*
           获取历史消息列表
        */
    getHistory: function getHistory(callback, obj) {
      /*
                                                    文档：http://www.rongcloud.cn/docs/web_api_demo.html#获取历史消息
                                                      注意事项：
                                                        1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
                                                        2：登录开发者后台可以直接开启 https://developer.rongcloud.cn/app
                                                        2：timestrap第二次拉取必须为null才能实现循环拉取
                                                    */

      var count = 15; // 2 <= count <= 20
      var timestamp = 0; //0, 1483950413013

      var conversationType = RongIMLib.ConversationType.PRIVATE;

      RongIMClient.getInstance().getHistoryMessages(conversationType, obj.targetId, timestamp, count, {
        onSuccess: function onSuccess(list, hasMsg) {
          //可通过sort订制其他顺序
          // list.sort(function(a, b) {
          //     return a.sentTime < b.sentTime;
          // });
          callback(list);
        },
        onError: function onError() {
          console.log("获取列表错误");
        } });

    },

    /*
           清除历史消息
        */
    clearHistory: function clearHistory(callback) {
      /*
                                                       文档：http://www.rongcloud.cn/docs/web_api_demo.html#会话接口
                                                         注意事项：必须开通历史消息云存储
                                                         参数说明：
                                                       timestamp 取值范围:  timestamp >=0 并且 timestamp <= 当前会话最后一条消息的 sentTime
                                                   */


      if (!clearMessage) {
        return callback('请先发一条消息');
      }
      var params = {
        conversationType: clearMessage.conversationType,
        targetId: clearMessage.targetId,
        timestamp: clearMessage.sentTime };

      RongIMClient.getInstance().clearRemoteHistoryMessages(params, {
        onSuccess: function onSuccess() {
          callback('清除历史消息成功');
        },
        onError: function onError(err) {
          err = '请排查: 历史消息云存储是否开通, ' + err;
          callback(err);
        } });

    } };


  var Conversation = {
    /*
                           获取会话列表
                        */
    getList: function getList(callback) {
      /*
                                         文档：http://www.rongcloud.cn/docs/web_api_demo.html#会话接口
                                             http://www.rongcloud.cn/docs/web.html#5_2、同步会话列表
                                             http://www.rongcloud.cn/docs/api/js/Conversation.html
                                           历史消息云存储开通位置：https://developer.rongcloud.cn/service/roam/rXxI4IAJjxRAD72SpQ==
                                           注意事项：
                                             1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
                                             2：只有发过消息才能生成会话
                                         */


      var conversationTypes = [RongIMLib.ConversationType.PRIVATE];
      // var conversationTypes =null
      var count = 150;
      RongIMClient.getInstance().getConversationList({
        onSuccess: function onSuccess(list) {
          callback(list);
        } },

      conversationTypes, count);
    },

    /*
           获取会话
        */
    getDetail: function getDetail(callback) {
      /*
                                             注意:
                                                 需在 getConversationList 方法执行之后执行，否则返回null
                                              */

      var conversationType = RongIMLib.ConversationType.PRIVATE;
      RongIMClient.getInstance().getConversation(conversationType, targetId, {
        onSuccess: function onSuccess(result) {
          callback(null, result);
        },
        onError: callback });

    },

    /*
           获取会话未读数
        */
    getUnreadCount: function getUnreadCount(callback) {
      /*
                                                           阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
                                                           每次接受新消息后通过重新调用此方法计算
                                                       */

      var conversationType = RongIMLib.ConversationType.PRIVATE;
      RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
        onSuccess: function onSuccess(count) {
          callback(null, count);
        },
        onError: callback });

    },

    /*
           获取总未读数
        */
    getTotalUnreadCount: function getTotalUnreadCount(callback) {
      /*
                                                                     阅读时间戳缓存在 localStorage 中，消息状态根据发送时间和阅读时间戳对比判断
                                                                     每次接受新消息后通过重新调用此方法计算
                                                                  */
      RongIMClient.getInstance().getTotalUnreadCount({
        onSuccess: function onSuccess(count) {
          callback(null, count);
        },
        onError: callback });

    },

    /*
           清除未读数
        */
    clearUnreadCount: function clearUnreadCount(callback, obj) {
      /*
                                                                    此方法清除当前端的未读数，并不会多端同步，
                                                                    多端同步需要发送 SyncReadStatusMessage：http://support.rongcloud.cn/kb/NjE0
                                                                 */
      // conversationType
      var conversationType = RongIMLib.ConversationType.PRIVATE;
      RongIMClient.getInstance().clearUnreadCount(conversationType, obj.targetId, {
        onSuccess: function onSuccess() {
          callback('清除未读数成功');
        },
        onError: callback });

    },

    /*
           清除总未读数
        */
    clearTotalUnreadCount: function clearTotalUnreadCount(callback) {
      RongIMClient.getInstance().clearTotalUnreadCount({
        onSuccess: function onSuccess() {
          callback(null, '清除总未读数成功');
        },
        onError: callback });

    },

    /*
           删除会话
        */
    remove: function remove(callback, obj) {
      var conversationType = RongIMLib.ConversationType.PRIVATE;
      RongIMClient.getInstance().removeConversation(conversationType, obj.targetId, {
        onSuccess: function onSuccess() {
          callback('删除会话成功');
        },
        onError: callback });

    },

    /*
           删除所有会话
        */
    clear: function clear(callback) {
      RongIMClient.getInstance().clearConversations({
        onSuccess: function onSuccess() {
          callback(null, '清除会话成功');
        },
        onError: callback });

    } };


  var Chatroom = {
    /*
                       加入聊天室
                    */
    enter: function enter(callback) {
      /*
                                     文档: http://www.rongcloud.cn/docs/web_api_demo.html#聊天室
                                       聊天室不支持通过 getHistoryMessages 方法获取历史消息，
                                       count：//拉取最近的会话内容（最多50条），-1不拉取 
                                     */



      RongIMClient.getInstance().joinChatRoom(chatRoomId, 10, {
        onSuccess: function onSuccess() {
          callback(null, '加入聊天室成功');
        },
        onError: callback });

    },

    /*
           聊天室发消息
        */
    sendTextMessage: function sendTextMessage(callback) {
      var content = {
        content: "hello，time：" + new Date().getTime(),
        extra: "RongCloud" };


      var conversationType = RongIMLib.ConversationType.CHATROOM;
      var msg = new RongIMLib.TextMessage(content);

      RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, {
        onSuccess: function onSuccess(message) {
          callback(null, message);
        },
        onError: callback });

    },

    /*
           聊天室发题目
        */
    sendQAMessage: function sendQAMessage(callback) {
      /*
                                                     文档：http://www.rongcloud.cn/docs/web_api_demo.html#自定义消息
                                                       注意事项：
                                                         1：init之前注册新消息类型
                                                         2：对应接收 onReceived: function (message) {}
                                                             message.messageType == "PersonMessage"
                                                         3：需要自己做解析实现
                                                     */

      var propertys = ["title", "submitAPI", "questions"]; // 消息类中的属性名。
      registerMessage("QA", propertys);

      var questions = [
      {
        id: 8560,
        question: "中国首都是那个城市？",
        answers: [{ id: 9901, answer: '上海', bingo: 9904 },
        { id: 9903, answer: '武汉', bingo: 9904 },
        { id: 9904, answer: '北京', bingo: 9904 },
        { id: 9905, answer: '深圳', bingo: 9904 }] },

      {
        id: 8561,
        question: "世界上最大的岛是那个？",
        answers: [{ id: 9906, answer: '马达加斯加', bingo: 9909 },
        { id: 9907, answer: '海南', bingo: 9909 },
        { id: 9908, answer: '台湾', bingo: 9909 },
        { id: 9909, answer: '格陵兰', bingo: 9909 }] },

      {
        id: 8562,
        question: "冰与火之歌里，那个家族的徽章是狼？",
        answers: [{ id: 9910, answer: '史塔克', bingo: 9910 },
        { id: 9911, answer: '塔格利安', bingo: 9910 },
        { id: 9912, answer: '兰尼斯特', bingo: 9910 }] },

      {
        id: 8563,
        question: "地球上最大的哺乳动物是？",
        answers: [{ id: 9913, answer: '鲸鱼', bingo: 9913 },
        { id: 9914, answer: '大象', bingo: 9913 },
        { id: 9915, answer: '巨蟒', bingo: 9913 },
        { id: 9916, answer: '恐龙', bingo: 9913 }] },

      {
        id: 8564,
        question: "人们常说的花季是几岁？",
        answers: [{ id: 9917, answer: 15, bingo: 9920 },
        { id: 9918, answer: 20, bingo: 9920 },
        { id: 9919, answer: 18, bingo: 9920 },
        { id: 9920, answer: 16, bingo: 9920 }] },

      {
        id: 8565,
        question: "成龙、林志颖、郭德纲最年轻的是谁？",
        answers: [{ id: 9921, answer: '成龙', bingo: 9921 },
        { id: 9922, answer: '林志颖', bingo: 9921 },
        { id: 9923, answer: '郭德纲', bingo: 9921 }] },

      {
        id: 8565,
        question: "劳动法规定，劳动者试用期不能超过几个月？",
        answers: [{ id: 9921, answer: 3, bingo: 9921 },
        { id: 9922, answer: 6, bingo: 9921 },
        { id: 9923, answer: 9, bingo: 9921 },
        { id: 9924, answer: 12, bingo: 9921 }] },

      {
        id: 8566,
        question: "融云成立几年了？",
        answers: [{ id: 9921, answer: 4, bingo: 9921 },
        { id: 9922, answer: 5, bingo: 9921 },
        { id: 9923, answer: 3, bingo: 9921 },
        { id: 9924, answer: 2, bingo: 9921 }] },

      {
        id: 8567,
        question: "变脸是我国哪个戏剧的绝活？",
        answers: [{ id: 9921, answer: '川剧', bingo: 9921 },
        { id: 9922, answer: '京剧', bingo: 9921 },
        { id: 9923, answer: '豫剧', bingo: 9921 },
        { id: 9924, answer: '评剧', bingo: 9921 }] }];



      var qIndex = Math.floor(Math.random() * 5);

      var content = {
        title: "冲顶大会",
        submitAPI: "http://abc.com/check",
        questions: JSON.stringify([questions[qIndex]]) };


      var msg = new RongIMClient.RegisterMessage.QA(content);

      var conversationType = RongIMLib.ConversationType.CHATROOM;
      RongIMClient.getInstance().sendMessage(conversationType, chatRoomId, msg, {
        onSuccess: function onSuccess(message) {
          callback(null, message);
        },
        onError: callback });

    },

    /*
           退出聊天室
        */
    quit: function quit(callback) {
      RongIMClient.getInstance().quitChatRoom(chatRoomId, {
        onSuccess: function onSuccess() {
          callback(null, '退出聊天室成功');
        },
        onError: callback });

    },

    /*
           获取聊天室信息
        */
    getInfo: function getInfo(callback) {
      /*
                                         需确认 当前用户 已加入聊天室
                                         */
      var order = RongIMLib.GetChatRoomType.REVERSE; // 排序方式。
      var memberCount = 10; // 获取聊天室人数 （范围 0-20 ）

      RongIMClient.getInstance().getChatRoomInfo(chatRoomId, memberCount, order, {
        onSuccess: function onSuccess(chatRoom) {
          callback(null, chatRoom);
        },
        onError: callback });

    } };




  /*
         公众号
         RongIMLib.ConversationType = {
             APP_PUBLIC_SERVICE : "应用服务平台 mc",
             PUBLIC_SERVICE : "公众服务平台 mp"
         };
         */
  var Public = {
    /*
                     获取已关注公众号
                  */
    getList: function getList(callback) {
      /* 
                                         getRemotePublicServiceList = function (mpId, conversationType, pullMessageTime, callback)  
                                         */
      RongIMClient.getInstance().getPublicServiceList({
        onSuccess: function onSuccess(list) {
          callback(null, list);
        },
        onError: callback });

    },

    /*
           查找公众号
        */
    search: function search(callback) {
      /*
                                       WebAPI文档：http://www.rongcloud.cn/docs/api/js/RongIMClient.html
                                       iOS文档：http://www.rongcloud.cn/docs/ios_imlib.html#公众服务
                                       */

      var searchType = 1; //[0-exact 1-fuzzy]  文档: http://www.rongcloud.cn/docs/api/js/global.html#SearchType
      var keywords = "Rong";
      RongIMClient.getInstance().searchPublicService(searchType, keywords, {
        onSuccess: function onSuccess(list) {
          callback(null, list);
        },
        onError: callback });

    },

    /*
           订阅公众号
        */
    subscribe: function subscribe(callback) {
      /*
                                             http://www.rongcloud.cn/docs/api/js/RongIMClient.html
                                               */


      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
      RongIMClient.getInstance().subscribePublicService(publicServiceType, publicServiceId, {
        onSuccess: function onSuccess(list) {
          callback(null, list);
        },
        onError: callback });

    },

    /*
           取消订阅公众号
        */
    unsubscribe: function unsubscribe(callback) {
      /*
                                                 http://www.rongcloud.cn/docs/api/js/RongIMClient.html
                                                   */


      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
      RongIMClient.getInstance().unsubscribePublicService(publicServiceType, publicServiceId, {
        onSuccess: function onSuccess(list) {
          callback(null, list);
        },
        onError: callback });

    },

    /*
           获取公众号详情
        */
    getProfile: function getProfile(callback) {
      /*
                                               http://www.rongcloud.cn/docs/api/js/RongIMClient.html
                                                 必须是已经关注的公众号，才能获取到详情
                                               */


      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
      RongIMClient.getInstance().getPublicServiceProfile(publicServiceType, publicServiceId, {
        onSuccess: function onSuccess(profile) {
          callback(null, profile);
        },
        onError: callback });

    },

    /*
           用户给公众号发消息
        */
    sendMessage: function sendMessage(callback) {
      /*
                                                 文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
                                                        http://rongcloud.cn/docs/api/js/TextMessage.html
                                                 1: 单条消息整体不得大于128K
                                                 2: conversationType 类型是 number，targetId 类型是 string
                                                 */
      var content = {
        content: "公众号你好" };


      var msg = new RongIMLib.TextMessage(content);

      var publicServiceType = RongIMLib.ConversationType.APP_PUBLIC_SERVICE; //固定值
      RongIMClient.getInstance().sendMessage(publicServiceType, publicServiceId, msg, {
        onSuccess: function onSuccess(message) {
          callback(null, message);
        },
        onError: callback });

    } };


  var Upload = {
    UploadUrl: UploadUrl,
    getFileToken: function getFileToken(fileType, callback) {
      RongIMClient.getInstance().getFileToken(fileType, {
        onSuccess: function onSuccess(result) {
          var token = result.token;
          callback(null, token);
        },
        onError: callback });

    },
    getFileUrl: function getFileUrl(fileType, hash, callback) {
      RongIMClient.getInstance().getFileUrl(fileType, hash, null, {
        onSuccess: function onSuccess(result) {
          var downloadUrl = result.downloadUrl;
          callback(null, downloadUrl);
        },
        onError: callback });

    } };


  function registerMessage(type, propertys) {
    var messageName = type; // 消息名称。
    var objectName = "s:" + type; // 消息内置名称，请按照此格式命名 *:* 。
    var mesasgeTag = new RongIMLib.MessageTag(true, true); //true true 保存且计数，false false 不保存不计数。

    RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys);
  }

  //获取base64假数据方法
  function getBase64Image() {
    return "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABkAGQDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAMEBQIGAQn/xAAwEAABAwMCBQMCBQUAAAAAAAAAAQIDBAUREiEGEzFBURRhgXGRFSMysdEiM1Kh8P/EABsBAQACAwEBAAAAAAAAAAAAAAADBQEEBgIH/8QALxEAAgIBAwMBBwIHAAAAAAAAAQIAAxEEEiEFBjFRExQiQWFxgQdCIzIzUrGywf/aAAwDAQACEQMRAD8A/Ko2uH3NhpLjUrDHI6KNrmo9uUzuYpucOypBR3KZY2SaI2rpemUXrsp3n6aEDuWlmbbhLjnGcYosOcfPHnH0mrrP6J/H+RI28Szak12yhc3uiRKir/s+cR0cEFXDJTQ8r1EaPWNE6L9C/Z7xRVdSlPLbqSnld/akbGmNXZP+UrxNrH8URMubkdI1+y4w3CIqtx7H0TWUHrvQaaLtb7571qKqksFQUads/FuJw+XVuFxtIBOciain2VpIXbtBJGfMqs4auzmI7ksarkyjHPRHL8FOG3Vk9WtCyFUmTOWOXGMfUludTUrdZ5nSPSRkrkaucK3C7YPR4zxHRyvajZJKXU9PfClF0zs/t7uHWHTaJbqxTqKqX3Orb0scpuGEXY4Izt+IYP05lfUW0rubByCftj88iYbeGru6LmJTtRcZ0K9Ed9ijT0dTV1HpYIXOl3y3pjHXPgu2ypnkv8UzpHK+SbDlz1Rexpwq6F9+mgykrHKjVTqiZXOCDp/afb/X1p1OiFtda2WpYGZXZlqpN25MIoVmCldp3AEg5PMy99tRKtgnAx+TiZz+GLw1WokDXavD02+p1ZaGm5VRc7gzXDS7Izs53j9vud8KSzpdOWxzlY9jlenbbov3/ckoWrUWC5U8SZkbIkip7bfwpZ9vdE6DeNN1vp2nfcV1ZFVrLYpsoqV68YRNwJbcQRyRt8DnxbZaN1bn+3kccE4PznCcU1KO0eipvT9FhRm2P5+Pg+uZa5L7RyW9WLFM5rnx42Yvjx8GGbFHbKi33O3PqFZ+e5Ho1F3b9U+Sn6L3N17uayurqKjUVJdQxdlGac2BQFIxhXztKcrxwARmSWU1UglOCQePXj/kpXZqNudU1qIiJK5ERO24JLo1i3OrV3XnP7+4OM6/oWbq2qKkAe0s/wBzNipv4a/YSgXKK4+jpqum5Ov1TEZq1Y09fbfqUwVHTuo6npV41Wkba4DDOAeGUqwwQRyrEfTORgyR0VxtbxCKrVRzVVFTdFQ066+PrUppeQkdVTY/OR36vjHn38mYDZ6f13qHS9PdpdJaVS3buGAclDuUjIJVlPIZcMPWeXqRyGYcibTr/RTSNqqmzRSVLU/Wj1RFXsqpgrw32dl1/FZ40ldhW6EXSiJjCInUzQXl/f8A3BqLK7mvAZHFoK11rmxfDvtQe0Yer7vn6mRjS1AEY8jHk+PQen4k9JVelrY6zl6uW/XpzjPyalqnr6q41ddQNj1KjpHwPVV1tVeieVMQ6imlgeksMjo3p0c1cKa3b3c1/SNRSLWb2KWe0whCtvK7dwbB5A/afhOMEYJmbqRYDjyRiettNQ9s8kjbI2gga1z5nvRcrjsmUTb2PN0NyqLdVLU0ypvlFa7o5PCnM9yr6lnLnrJXs/xVy4UrHQdy9/W9Q9yXpjup0zO6uRWjbn2/ypUAiqNo8Z3EsT5kVOlCbt/7sccnx95tJfbYkvqG2GJJuudf9OfOMYKjrxUS3OO5VKI90bkVGIuERE7J4KAKPW989d1wRbLQoVxZhK60Bcch2CIocj1YGSrpqlzgfTyTx+ZLWVHq6qWp0aOa9X6c5xkEQOY1Oos1dz6i45dyWJ9STknjjz6SZQFGBAAIZmAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIgACIAAiAAIn/9k=";
  }

  function getMockVoice() {
    return "IyFBTVIKLNEafAAeef/hgmeAH8AD/+ggggAALMWpzAAf+f/hgmYAH8AD/+ggggAALNEazAAf+f/hgmYAH8AD/+ggggAALMWpzAAf+f/hgmYAH8AD/+ggggAALNEazAAf+f/hgmYAH8AD/+ggggAALGOZ4sj90f3jNsZmd0zTB+hv2UiILKcq8B7gAevlY0Ne9XuTxaG9hGeMLGlBXh/xgN8RwHNruSbA1Wu1t5BsLFsQqB/AlYSOzWptJD4Nk1YDU7lyLHRH3w7ADLUOgi/D8b5m8sia7BlILGlmkh/gFJyrWINe7dmE0m6ea5BGLFKhmh/hQ9TFKLyueRE1SZJwWZ3ULFywoh/iu7tj4mtPk9ErsqzPEpamLEq2MB/AaRNLzBOH/q+6pFmZef4eLE4ZKpcxAYR2vyfHoxH2d3xgd+lCLCdBeB/oQZtJxpU9Ead66lb1V4FGLCcrwB/pAd4QxRh3bxLJDiWLtQy8LEgkGB/hAcNT67nM4H3eXcfkI6+QLESLSh/gAd6oG8n/0S9GmmZHk+FALFqQRyyBmc5B5mCl9zSjVw+MRsYSLJxNePMO4b3xBTdj5r7MdveGkhyYLEgWRJdggaA0SU8YdQbE1mkwxheeLF7meYZpMZNXjJ5otNatPMzIYNN0LGkRlJdhUbQVPX+9sed3OK1W0c4oLHSbRYZhCVNiUEq3dcUmHH8jfN8OLIoWEj3BNOA9Ye5YFNwqNYcTeG9wLE4CNB/gNyQekksW2BGI42XIk3OyLIT0NB/gC13ZHTX0FqWIvCsX/ZqcLGgANB/gYgixq1a/LpS5LN5KBPWwLFyjih/gMZaQkE/eSRJFPLn1akVwLEijUh+sA0Q2alotATqHbNTmYIA6LJHtSh/hmbH/y4Lxdih+1Nw5G19wLEYkoh/iJPDp/N7VL0zWSk586WPCLFsGHw7wycYI76p3ZXjS60/jVbjiLE6wwUqwgZyqrYjEaF0ewxoYJ3COLBENOj3AWLKsOYe/x6xKyqWjrjomLA06OaQVZj5PzPQXjkMwXj9y8J6eLBWj5rTeptSV/LpxEWnPi0WM8u60LBnhSWmPh4HkSHFr2Tx6NwG1WQf0LBj9FrUeB4YWDuS9T+j3RXKK14QILBj94tM+R4YSA4WlebpcPEIF+K1ALBjNScI+R4YGAedlGLvseGfkvuGwLBj94yzeB4NvSrNcuFh1jHCAV38uLBlL4yzcJ4YQDZ77NymI2SpQCma+LBjS1rVeB4NZ1nDcrAehU2W/9+fELBnh1pZcJ4YPjsi8KFq62DQartLqLBp21yyeJ5tORhDL0A1EnSDewBqQLA51/pdYZ54MDtEDRFH2etaSd8n6LBnh12geJ5n9cKyTeUyE1nyhiu3QLBr9wtI5Z5tAbRkKWHNBJvbU+m2MLCDSGSzFpzmwz/WVurgHMzXFhl64LBAeoJdh5nmjOJOG2hjJQuNFrJ20LEk7NB/hxm5FpIRqJ/qGc4ELcQgULHSb/h/gRNSTBJ/pTlchtbCFNqRaLHIhNB/hrgYknYxYg7w4x1m1x/feLJrbnpdiTylyQxD/ynA0Vmd1o4UQLHatRD3F1FYU2RUHO+N+3L0Tgt3wLJF+Jlugr4zBPEFfEXxiqUcbAmgGLFOK6B/gBn33sg/tBnsYwn26BzGELE9+HwvRI2GlF/lHlu+G0moY1CaILIQq6Q6gwz8Nu2dUtdpYhavAizOELKAmONIgN/zxV63TRMACSuUfSZp+LMXCRB/pBpZfybCOa1Mth0bAJiNsLHGdE8JuPxylZp4RUPeIm9zQ+MIGLHOYl/AfhiZInK/r+YKOuGoKNIg4LHL2N+gYJtSH3gn10FRP+OD7M+7sLHLyL6TdtsH/+b724zbFylx1rEToLKD2N8I+p44FH+RRoH2nn4IDJkkqLKGsL+Eeh54QmddD1Y1qa5IrfdlgLKGsL6VeJ+YAOZOOSIvKOMDv0dImLHD2yUrlp/taevWj5Iu+pjikQPrYLHbyLvGeDVYDESShWhG6LYSACGzeLHCoInmcOA4/EnkYKzp5RWENKyu6LHGsIrWPGGyie0GVBZ0K8zsoaha0LHOsI0p4eMHrer57Z/QFJb21h850LKVkI0rkzqrr9CeK+LlBLnbqRcwQLHPsNtJkfQMU31zZb1sFI6pbOpmWLHaRIqWmXkJ+lnx24MFoy/1BRS3MLGnINnGADu5kFvQrzRrulcTI4bokLGiuGpZIgcyzx/3fn4jxOxfU11uGLGgBDQ7AHz8HUy7PaNJA/ZKkIESYLE1PNtMghLNCV7LV8AdOcPm5MIPyLEyuWB/g2olMZbYlNHNB493hLLvcLEiBDB+xx5H+YjUsHLBpsNlsTLYQLHCuNh/yj2sNoe9hBEYfRcZ97ELyLKdT5h/Azy5fiSk3pD7aJjTwUE1oLHSfzB/hF2L+gQb/s5aQd9M2F1AQLHSYjrVAp5ngUiFW4Hpxtag8lbhMLJLajrVAUexW0naX4BAwZ8gj+yf6LJOGj0qgGbSDk0eKcL17SPOzZhd8LGqYOrUBR7N3WMKUNMCHxQwdhsDaLKaYOj3BD47ZIc/0yxSYdBdAoW0sLJbbOh/gjLC+UNx79DIVmszFnCeaLKAE5+ADEX4ggPDev2ZZgz5qQAryLJCKdpdgGqW/vk6VeBcNdMN0AnMWLDBjNt+O/2GwTgjT6B7VgwEsuUIALGgVN2nGh6YNT9noVCIgbWK0Hui0LGNQNvEeh+YJjpJub8L3mM8hm7XqLGIVNtM+R+Hz7/8v1TFQclHYZyi4LGNPNtM+x+4bDwYrJOBql8WE9aAYLGLgN2jeB/4CDjHpkJuHutoTaMXiLFIVNrWSx/nkbnrLpn4qTshYYKWwLFNrGw7+B/4WD4jXRgwZLnyi9xsOLFDgNrV+B/tDztzpQwqRLtCIlkbULC9rpNIh5/4ZtyH1QZ6TjslZ6VjiLCrgDQ7vGAYCApDcAjv+U2h/EtGCLCS26h+B+AS+Ae4tLvoCUmaf2bCoLBeVqSweEqtMUiB0mrygMUTj0F8kLBUrqB/LUqnyet7jXNjdGaLrNldQLBdBDQ5rR/YIhaE2+rnlKTGaZDssLCI32j1cJ8ykrRZZdiny00eSJvNuLBGVzB67x5GcMZRHrLFAhsPqUTGSLBKhdB+B7yHuYHNeDX8UXVobXtS+LBCWiJc6RjSzctBVrQq2S4OH4JMgLEFYQB+AhnPPvrN8cnGox3fvmDCYLC2VDQ7pZnZB1GpQa3KM3SO2fvN8LGglslugEJYzy8O4RRHrVVZYbS0qLGoAjtMuernXk7GjRfd54qdFYiZKLMEaH8IkrrTD00eHjcbEUmSrwf9SLIUNfaRAKCimG+zfEOfmWj85ubowLMQKtPEAD6eYBhm23UfSK1RifGPmLEcNfeAAg6t7cm5HrB+5GnvaKfmULMWF1eAAJB7kwoOY1GKlNeJcm2X0LEEca8Koh+pmPLSb7n2EHJnuNrCuLIC0h+AARxKVexe1xhUnUeR3F/hCLB6Vj6RiNww843N3zdkuXZAZfWuULC7yj8I9JsZTl1LkLwYBmZYgMpxuLDBqDQ7tJ44LFTtpARgHGVcwM4XwLCvkdlq+B54Onyf4z6sIfIViiUNMLCufjlu+B+YUy64WzTbzBicKZMo4LCtQdlu8LVYQXx6a7PnRfRELbNzALDWf6pc+GAYNqcGzCE7FM1c1EUYiLDvbd0s8+DSpJgqjYlHjuUdEA3roLDufDLVcOGNBzK0t+l+cOxEMU7LgLDryqFrLOHSXKmMDUbNqTTzm6SM2LFIXd0qmK55E1hrhqS+SYr1cwBqULFvHNNIi/+aCTPu1zoHk8n5vDARYLGmZAB75FeHab5QZwZMOc7+ybqT4LGiIWQ90Ap0fd4DH0eoQO5lzwyNaLFq24h/o96Ht7vc6+gxg6tcjoAs8LEQ3qUolh2sY0XYroiHHuS2SYQJqLCDBQD1DxnMZWKgVYVC3xsVVcqFQLCwhqJZh5m4DsacEsvgO9FidzYuCLGoc1B/oR9c2J7siJrJG7QLzMs8oLFcrRB7oA8Sa6DkgT7cbpRlni77qLF8rHB9AAN4WjsH59/MBxj2oaXKKLDsrVB/gl22w1k2/6Kvcv6FEYVc4LE4kOh/kin5kyDb9Ek2ir16UOchsLEHtsh/gG4TgVYeo5/T/mSSl9PKiLEWGOh/0z8lJ6Lw5lnoQq4qcg7joLGikgh/gBKCaNxoP/qOYUxyzECNoLEiw5h/gJxiwiVk+51kPWn+TWwkELFKfRh/gAqmdt62FL2jW4Crj14DKLIUEgh+hV/5ff400ryadvWIqb35ALFMGwFugE1SANa/zSp1nhmt1F4pgLFwMOyzQBp7gkQ3VNThbLQt0w/cULGuGMB7wEly4OG3cLgLdTl88U3A8LCyhqB/gcrtz05GUJQu7Z0jUc31MLCmaQYb5hsskV1fy9ypV2CvnpKQQLEY3O8I2jVYDGKtAKcW1bUdU8+48LDuaDLVPGDNFRdcsZFPi12JIW9XuLC5pRnmWmDnpv3YKum5BeRyXWm52LDTzQD3S3/4iZtrFvyoSrRJyx2ioLCrzDB/8eHNEzAMvuMbNuM5wvDeqLCrzQFufGGYDrthotBhBpEUeYbyaLCWOQFo+GH4bHqfJ8Dm/BsN34SBQLB1DzA/4eNYPOYI4yYC1J4ZZHFHmLCq3QD1Ks+yeL4slPkz4OVYab+wQLDFtqIdBfsNQ8ygB5HJCYvwaIY6WLDRJnFPCJ6m6ToTbZCPhqXhv2Dw+LE8Nkh7gK6YRKWNP1B2Ry3YZIStILDSjHB7gP5tQ4jn5ATgS0tjJcjD6LGgkNJcAJOZCzKuKU6RXlTcuMn5sLKOVBB7l5On+r8eLdj3+R8VY1wmoLKftdYZgBi0UeXlPkxpZkLn6RKpyLHSh4SzAPV4qoThEgSBltvo2JhjGLHVBDFqCbgCu/X+eYSY+WRprEs92LHSBeFugQlSwB7TgEtKs/U+5uRgCLHQRkw7xFHuqWFjF5tNBhTOGLKMWLFStrh/kF6Gq+JcQ88YC7TlfDGOcLFoZoh+gV7nmzQJ/xKwiZTp39IzoLGQZDB/hAmcJpKq3QEIFb2XfB4eILGgkHh7gCyx4n6ddcccc2UU64A/sLGMrih9RF92+6HZuseFsq96sUbC8LGgkQB/lvQjkvqAKO8F+XNGQbmTSLDgP/h/Sh5nk4xlqA0A7G3bJHXc0LBRUOYY8hgNej/+N7fVXzj9p2LfYLCTVgNInp+NQX/FbslaOxzkRgQ90LBd2flupR+YjiAn+cpLmUrXFye7SLDpHCPl+7dNopT5B25GJgoT+FkqULDFhu6R95+NNZrIGu5wUz9LKSFfALDCvyaRrR+4BFFeFLBiD0WUZSPemLDE7vFv2x+tZQUcrxFtFuNeUeHXaLDCv9aUeJ/4ME6YLt2LuFTBnLlmyLDF4jS3eDVYFHmLP6ikvKSaOWa0uLDUtvS3eWAYMuQSCBUeSXSAP1ttWLDNqGQ7rWByysquMU14dU8/ZGlEcLFTkHw7nmH4d9oAagWUHNrfeAX4QLDv3GFulG6mrCxSdK2HOR9yzGB6eLDpKDB/glfyqVdBmPGr4OYYFyPS8LFXFHj0BnyYP1lE5d9FvD9T1LebaLCruqJYJVptWGswmyBthddtlcM70LCxH4h3kB3ortwu6hwZEC5FLUZ7YLC1cdw6wx4NCVmUiZFLSeVqOidscLJGGeB6hTytZzuXGacMKN5ntpmOSLFok4h9lCST559KwmyrVaWIkKA1CLGgksh/gXOdBLb8owPcjPqEPxHW0LHVFKB6glLRVdo+2yy3iIjCXIZ/MLFGGoh/APNyjiobXj5p0C9zzOYEALFKfmB8EJjzvmx63l9hZB7U/yaEELHKAwB/wRn2gzB+4gBIba3YRs1CELFMQoh/lhnNE7EUjuC4eCMIUd+yeLGOEgj0QZmNczuWYJF0Cr70fNLeYLE9FwB/hwxsaDcgMa+kVV3GikkQQLGghQB/ilnSTp0bfGo6FnFqS6KGqLJaYmD/Go1N2ioRZ6uzrKPEOOeY6LJGFHngR3YJz6wQ9IFQrmTE1oP9ELNA1zaRw1TS0yhomy68wcni1WUQiLJcUH+ABrHx8kv5eykNFZyFUxWQ4LJ3NUeFglQvZcAagM83NAsvBbOaiLJqDveAAD5t9isUv/qIbqCoXQF3mLJY1xeGAgc0z7K2P5zHmxOaDau+oLE5uxeEgCTVtneohZlh9NriSHYZGLAd1n+AMw2btmu7/7pVGxZpUWtcQLBYg8Jfg5+4H0BPUVzSuUkj7OaWuLA/MtyyfLVYXDWoIJtbuvNmNgJGKLBZkm6RfGANJ0MXhBITfky4CABqOLBl1zw78Mq41FeI7rDwNJte9bze6LBfhwh/8OANeV8QDEi0a40JWRV5CLBlprw7pcqNAmdkGzYKd0XrT4tUSLBGQoNMQ55Sws2KidEZFdQxPuUo0LECjew7iR45KfimJGBBhIzqUOQ+wLHHBKB/oJzNDh7hNMhanWTjT2E0yLJMRoJZAaYQXetOQ2Hs0zl9Lj6kiLE5FHB/gHUGSvj3+ONd1Cyee6goyLHsGgh/gGyXhL3nLsGB68ccaZLuILHEQ8w7AROwqrg8oj1jkkjK8p7i8LHSjHB/AH4NWZsc6zFfJOdG0XBkULKCADB6hxqteFf44HdaFj3pM9j9QLHhHKh/APG4HFpPjaSGgdJgZXo62LHEGRh/AJsb2fxeKVnjkdo0IoHmOLKHtRh/hMINYBw0sq9vzksf4Oh4KLHSjKh+go9ZND9GUUqEZmyfDwLrOLE4kRw7ACltKP7awJ4v6tpB1DIQYLGsQgw7hCSYBlhPo0YhzJHquE+64LGhvxB+wGdptSzBt0FpnXHpCsDRcLEwZRh9AF0Mf1pD555afVNsz965QLF/tRh+hQfz0Dv08wUuHOFYZ9NJGLFOGOh9IQbNf6c6uuLcIxMU8LwICLFIZHQ5h20zqdpJtTSiv35uQY9OGLE0rRh/gNiQ0FtHLyPlvINYuW8HmLKCL5h/wH/IGkAxx2d79W3sAjRX+LFtBCh+j5nnr6DBIHhLKEPbiReFQLGCfrw7odmYAGIkJCDuOfaBBLP9WLHpHOh/kBHiksaKRZ2gF11xqKjJYLGWGOh+kE2znAD2kgwQW3ADyXjNULGgmOh7k7kywoE1tToUFjyMZ0cekLHmWRh7ATF5TRqk2/ORpiteIwWOKLGgMOh7QhNtW4XX5sFaEukArBENoLFuWRB9gS8GkaPP4+gp9gVE2eUIELHWGzB8hRk6N4d4vx+brHg83xrveLFcqCh5ADraeiSn5JKcCLP5ZT5EmLHQksh+hjgTEhZA1ROB00X1AN99cLGlmxB+li4ZMmtU9iEYrmLKZK104LKEG/h/gkjHJJqBstjV1TZIMVQ9GLFMqoh7AF92qdC8033bD5l75l+0+LGkQwh/AKdND1quXzewahKPVHtraLJCjGB/hBKt5CriqQDfu/EaqXQkeLFafrh7AOeT3KJ/ACkwhOrSbpYQsLJBHzB/ga8tJoefCznqPEOPxVBIiLE+GoB5gHdj8eJH6CbpHCxkVddquLE8rGB7ALuCisqE67liVp78DB4t0LGmF6JdgpJuRGznAFm6YNK+8XN6cLE4kwh9kFmQZX5mqCCW2hqUTyK1KLHKYdh9gVzGZ7m+ttHopsTtVOlMG";
  }

  return {
    init: init,

    Status: Status,
    Message: Message,
    Conversation: Conversation,
    Chatroom: Chatroom,
    Public: Public,
    Upload: Upload };

});

/***/ }),

/***/ 131:
/*!******************************!*\
  !*** E:/app/util/amap-wx.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function AMapWX(a) {this.key = a.key, this.requestConfig = { key: a.key, s: "rsx", platform: "WXJS", appname: a.key, sdkversion: "1.2.0", logversion: "2.0" };}AMapWX.prototype.getWxLocation = function (a, b) {wx.getLocation({ type: "gcj02", success: function success(a) {var c = a.longitude + "," + a.latitude;wx.setStorage({ key: "userLocation", data: c }), b(c);}, fail: function fail(c) {wx.getStorage({ key: "userLocation", success: function success(a) {a.data && b(a.data);} }), a.fail({ errCode: "0", errMsg: c.errMsg || "" });} });}, AMapWX.prototype.getRegeo = function (a) {function c(c) {var d = b.requestConfig;wx.request({ url: "https://restapi.amap.com/v3/geocode/regeo", data: { key: b.key, location: c, extensions: "all", s: d.s, platform: d.platform, appname: b.key, sdkversion: d.sdkversion, logversion: d.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var d, e, f, g, h, i, j, k, l;b.data.status && "1" == b.data.status ? (d = b.data.regeocode, e = d.addressComponent, f = [], g = "", d && d.roads[0] && d.roads[0].name && (g = d.roads[0].name + "附近"), h = c.split(",")[0], i = c.split(",")[1], d.pois && d.pois[0] && (g = d.pois[0].name + "附近", j = d.pois[0].location, j && (h = parseFloat(j.split(",")[0]), i = parseFloat(j.split(",")[1]))), e.provice && f.push(e.provice), e.city && f.push(e.city), e.district && f.push(e.district), e.streetNumber && e.streetNumber.street && e.streetNumber.number ? (f.push(e.streetNumber.street), f.push(e.streetNumber.number)) : (k = "", d && d.roads[0] && d.roads[0].name && (k = d.roads[0].name), f.push(k)), f = f.join(""), l = [{ iconPath: a.iconPath, width: a.iconWidth, height: a.iconHeight, name: f, desc: g, longitude: h, latitude: i, id: 0, regeocodeData: d }], a.success(l)) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this;a.location ? c(a.location) : b.getWxLocation(a, function (a) {c(a);});}, AMapWX.prototype.getWeather = function (a) {function d(d) {var e = "base";a.type && "forecast" == a.type && (e = "all"), wx.request({ url: "https://restapi.amap.com/v3/weather/weatherInfo", data: { key: b.key, city: d, extensions: e, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {function c(a) {var b = { city: { text: "城市", data: a.city }, weather: { text: "天气", data: a.weather }, temperature: { text: "温度", data: a.temperature }, winddirection: { text: "风向", data: a.winddirection + "风" }, windpower: { text: "风力", data: a.windpower + "级" }, humidity: { text: "湿度", data: a.humidity + "%" } };return b;}var d, e;b.data.status && "1" == b.data.status ? b.data.lives ? (d = b.data.lives, d && d.length > 0 && (d = d[0], e = c(d), e["liveData"] = d, a.success(e))) : b.data.forecasts && b.data.forecasts[0] && a.success({ forecast: b.data.forecasts[0] }) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}function e(e) {wx.request({ url: "https://restapi.amap.com/v3/geocode/regeo", data: { key: b.key, location: e, extensions: "all", s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var c, e;b.data.status && "1" == b.data.status ? (e = b.data.regeocode, e.addressComponent ? c = e.addressComponent.adcode : e.aois && e.aois.length > 0 && (c = e.aois[0].adcode), d(c)) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this,c = b.requestConfig;a.city ? d(a.city) : b.getWxLocation(a, function (a) {e(a);});}, AMapWX.prototype.getPoiAround = function (a) {function d(d) {var e = { key: b.key, location: d, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.querytypes && (e["types"] = a.querytypes), a.querykeywords && (e["keywords"] = a.querykeywords), wx.request({ url: "https://restapi.amap.com/v3/place/around", data: e, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var c, d, e, f;if (b.data.status && "1" == b.data.status) {if (b = b.data, b && b.pois) {for (c = [], d = 0; d < b.pois.length; d++) {e = 0 == d ? a.iconPathSelected : a.iconPath, c.push({ latitude: parseFloat(b.pois[d].location.split(",")[1]), longitude: parseFloat(b.pois[d].location.split(",")[0]), iconPath: e, width: 22, height: 32, id: d, name: b.pois[d].name, address: b.pois[d].address });}f = { markers: c, poisData: b.pois }, a.success(f);}} else a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this,c = b.requestConfig;a.location ? d(a.location) : b.getWxLocation(a, function (a) {d(a);});}, AMapWX.prototype.getStaticmap = function (a) {function f(b) {c.push("location=" + b), a.zoom && c.push("zoom=" + a.zoom), a.size && c.push("size=" + a.size), a.scale && c.push("scale=" + a.scale), a.markers && c.push("markers=" + a.markers), a.labels && c.push("labels=" + a.labels), a.paths && c.push("paths=" + a.paths), a.traffic && c.push("traffic=" + a.traffic);var e = d + c.join("&");a.success({ url: e });}var e,b = this,c = [],d = "https://restapi.amap.com/v3/staticmap?";c.push("key=" + b.key), e = b.requestConfig, c.push("s=" + e.s), c.push("platform=" + e.platform), c.push("appname=" + e.appname), c.push("sdkversion=" + e.sdkversion), c.push("logversion=" + e.logversion), a.location ? f(a.location) : b.getWxLocation(a, function (a) {f(a);});}, AMapWX.prototype.getInputtips = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.location && (d["location"] = a.location), a.keywords && (d["keywords"] = a.keywords), a.type && (d["type"] = a.type), a.city && (d["city"] = a.city), a.citylimit && (d["citylimit"] = a.citylimit), wx.request({ url: "https://restapi.amap.com/v3/assistant/inputtips", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.tips && a.success({ tips: b.data.tips });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getDrivingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), a.strategy && (d["strategy"] = a.strategy), a.waypoints && (d["waypoints"] = a.waypoints), a.avoidpolygons && (d["avoidpolygons"] = a.avoidpolygons), a.avoidroad && (d["avoidroad"] = a.avoidroad), wx.request({ url: "https://restapi.amap.com/v3/direction/driving", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.route && a.success({ paths: b.data.route.paths, taxi_cost: b.data.route.taxi_cost || "" });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getWalkingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), wx.request({ url: "https://restapi.amap.com/v3/direction/walking", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.route && a.success({ paths: b.data.route.paths });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getTransitRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), a.strategy && (d["strategy"] = a.strategy), a.city && (d["city"] = a.city), a.cityd && (d["cityd"] = a.cityd), wx.request({ url: "https://restapi.amap.com/v3/direction/transit/integrated", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {if (b && b.data && b.data.route) {var c = b.data.route;a.success({ distance: c.distance || "", taxi_cost: c.taxi_cost || "", transits: c.transits });}}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getRidingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), wx.request({ url: "https://restapi.amap.com/v4/direction/bicycling", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.data && a.success({ paths: b.data.data.paths });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, module.exports.AMapWX = AMapWX;

/***/ }),

/***/ 14:
/*!****************************************!*\
  !*** E:/app/lib/RongIMLib.wx-1.2.0.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
(function (global, factory) { true ? module.exports = factory() : undefined;})(void 0, function () {var getMini = function getMini(global) {var request = global.request;var storage = { set: global.setStorageSync, get: global.getStorageSync, remove: global.removeStorageSync, getKeys: function getKeys() {var res = global.getStorageInfoSync();return res.keys;} };var socket = { connectSocket: global.connectSocket, onSocketOpen: global.onSocketOpen, onSocketError: global.onSocketError, onSocketClose: global.onSocketClose, onSocketMessage: global.onSocketMessage, sendSocketMessage: global.sendSocketMessage, closeSocket: global.closeSocket };return { request: request, storage: storage, socket: socket };};var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _this = undefined;var RongLib = function RongLib(mini) {var OriginJSON = JSON;return function () {var JSON = { stringify: OriginJSON.stringify, parse: function parse(str) {var result = null;try {result = OriginJSON.parse(str);} catch (e) {}return result;} };var Polling = { SetUserStatusInput: function SetUserStatusInput() {var a = {};this.setStatus = function (b) {a.status = b;};this.toArrayBuffer = function () {return a;};}, SetUserStatusOutput: function SetUserStatusOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, GetUserStatusInput: function GetUserStatusInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, GetUserStatusOutput: function GetUserStatusOutput() {var a = {};this.setStatus = function (b) {a.status = b;};this.setSubUserId = function (b) {a.subUserId = b;};this.toArrayBuffer = function () {return a;};}, VoipDynamicInput: function VoipDynamicInput() {var a = {};this.setEngineType = function (b) {a.engineType = b;};this.setChannelName = function (b) {a.channelName = b;};this.setChannelExtra = function (b) {a.channelExtra = b;};this.toArrayBuffer = function () {return a;};}, VoipDynamicOutput: function VoipDynamicOutput() {var a = {};this.setDynamicKey = function (b) {a.dynamicKey = b;};this.toArrayBuffer = function () {return a;};}, SubUserStatusInput: function SubUserStatusInput() {var a = {};this.setUserid = function (b) {a.userid = b;};this.toArrayBuffer = function () {return a;};}, SubUserStatusOutput: function SubUserStatusOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, CleanHisMsgInput: function CleanHisMsgInput() {var a = {};this.setTargetId = function (b) {a.targetId = b;};this.setDataTime = function (b) {a.dataTime = b;};this.setConversationType = function (b) {a.conversationType = b;};this.toArrayBuffer = function () {return a;};}, DeleteMsgInput: function DeleteMsgInput() {var a = {};this.setType = function (b) {a.type = b;};this.setConversationId = function (b) {a.conversationId = b;};this.setMsgs = function (b) {a.msgs = b;};this.toArrayBuffer = function () {return a;};}, DeleteMsg: function DeleteMsg() {var a = {};this.setMsgId = function (b) {a.msgId = b;};this.setMsgDataTime = function (b) {a.msgDataTime = b;};this.setDirect = function (b) {a.direct = b;};this.toArrayBuffer = function () {return a;};}, DeleteMsgOutput: function DeleteMsgOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, SearchMpInput: function SearchMpInput() {var a = {};this.setType = function (b) {a.type = b;};this.setId = function (b) {a.id = b;};this.toArrayBuffer = function () {return a;};}, SearchMpOutput: function SearchMpOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.setInfo = function (b) {a.info = b;};this.toArrayBuffer = function () {return a;};}, MpInfo: function MpInfo() {var a = {};this.setMpid = function (b) {a.mpid = b;};this.setName = function (b) {a.name = b;};this.setType = function (b) {a.type = b;};this.setTime = function (b) {a.time = b;};this.setPortraitUri = function (b) {a.portraitUrl = b;};this.setExtra = function (b) {a.extra = b;};this.toArrayBuffer = function () {return a;};}, PullMpInput: function PullMpInput() {var a = {};this.setMpid = function (b) {a.mpid = b;};this.setTime = function (b) {a.time = b;};this.toArrayBuffer = function () {return a;};}, PullMpOutput: function PullMpOutput() {var a = {};this.setStatus = function (b) {a.status = b;};this.setInfo = function (b) {a.info = b;};this.toArrayBuffer = function () {return a;};}, MPFollowInput: function MPFollowInput() {var a = {};this.setId = function (b) {a.id = b;};this.toArrayBuffer = function () {return a;};}, MPFollowOutput: function MPFollowOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.setInfo = function (b) {a.info = b;};this.toArrayBuffer = function () {return a;};}, NotifyMsg: function NotifyMsg() {var a = {};this.setType = function (b) {a.type = b;};this.setTime = function (b) {a.time = b;};this.setChrmId = function (b) {a.chrmId = b;};this.toArrayBuffer = function () {return a;};}, SyncRequestMsg: function SyncRequestMsg() {var a = {};this.setSyncTime = function (b) {a.syncTime = b || 0;};this.setIspolling = function (b) {a.ispolling = !!b;};this.setIsweb = function (b) {a.isweb = !!b;};this.setIsPullSend = function (b) {a.isPullSend = !!b;};this.setSendBoxSyncTime = function (b) {a.sendBoxSyncTime = b;
          };this.toArrayBuffer = function () {return a;};}, UpStreamMessage: function UpStreamMessage() {var a = {};this.setSessionId = function (b) {a.sessionId = b;};this.setClassname = function (b) {a.classname = b;};this.setContent = function (b) {if (b) {a.content = b;}};this.setPushText = function (b) {a.pushText = b;};this.setUserId = function (b) {a.userId = b;};this.setConfigFlag = function (b) {a.configFlag = b;};this.setAppData = function (b) {a.appData = b;};this.toArrayBuffer = function () {return a;};}, DownStreamMessages: function DownStreamMessages() {var a = {};this.setList = function (b) {a.list = b;};this.setSyncTime = function (b) {a.syncTime = b;};this.setFinished = function (b) {a.finished = b;};this.toArrayBuffer = function () {return a;};}, DownStreamMessage: function DownStreamMessage() {var a = {};this.setFromUserId = function (b) {a.fromUserId = b;};this.setType = function (b) {a.type = b;};this.setGroupId = function (b) {a.groupId = b;};this.setClassname = function (b) {a.classname = b;};this.setContent = function (b) {if (b) {a.content = b;}};this.setDataTime = function (b) {a.dataTime = b;};this.setStatus = function (b) {a.status = b;};this.setMsgId = function (b) {a.msgId = b;};this.toArrayBuffer = function () {return a;};}, CreateDiscussionInput: function CreateDiscussionInput() {var a = {};this.setName = function (b) {a.name = b;};this.toArrayBuffer = function () {return a;};}, CreateDiscussionOutput: function CreateDiscussionOutput() {var a = {};this.setId = function (b) {a.id = b;};this.toArrayBuffer = function () {return a;};}, ChannelInvitationInput: function ChannelInvitationInput() {var a = {};this.setUsers = function (b) {a.users = b;};this.toArrayBuffer = function () {return a;};}, LeaveChannelInput: function LeaveChannelInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, QueryChatroomInfoInput: function QueryChatroomInfoInput() {var a = {};this.setCount = function (b) {a.count = b;};this.setOrder = function (b) {a.order = b;};this.toArrayBuffer = function () {return a;};}, QueryChatroomInfoOutput: function QueryChatroomInfoOutput() {var a = {};this.setUserTotalNums = function (b) {a.userTotalNums = b;};this.setUserInfos = function (b) {a.userInfos = b;};this.toArrayBuffer = function () {return a;};}, ChannelEvictionInput: function ChannelEvictionInput() {var a = {};this.setUser = function (b) {a.user = b;};this.toArrayBuffer = function () {return a;};}, RenameChannelInput: function RenameChannelInput() {var a = {};this.setName = function (b) {a.name = b;};this.toArrayBuffer = function () {return a;};}, ChannelInfoInput: function ChannelInfoInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, ChannelInfoOutput: function ChannelInfoOutput() {var a = {};this.setType = function (b) {a.type = b;};this.setChannelId = function (b) {a.channelId = b;};this.setChannelName = function (b) {a.channelName = b;};this.setAdminUserId = function (b) {a.adminUserId = b;};this.setFirstTenUserIds = function (b) {a.firstTenUserIds = b;};this.setOpenStatus = function (b) {a.openStatus = b;};this.toArrayBuffer = function () {return a;};}, ChannelInfosInput: function ChannelInfosInput() {var a = {};this.setPage = function (b) {a.page = b;};this.setNumber = function (b) {a.number = b;};this.toArrayBuffer = function () {return a;};}, ChannelInfosOutput: function ChannelInfosOutput() {var a = {};this.setChannels = function (b) {a.channels = b;};this.setTotal = function (b) {a.total = b;};this.toArrayBuffer = function () {return a;};}, MemberInfo: function MemberInfo() {var a = {};this.setUserId = function (b) {a.userId = b;};this.setUserName = function (b) {a.userName = b;};this.setUserPortrait = function (b) {a.userPortrait = b;};this.setExtension = function (b) {a.extension = b;};this.toArrayBuffer = function () {return a;};}, GroupMembersInput: function GroupMembersInput() {var a = {};this.setPage = function (b) {a.page = b;};this.setNumber = function (b) {a.number = b;};this.toArrayBuffer = function () {return a;};}, GroupMembersOutput: function GroupMembersOutput() {var a = {};this.setMembers = function (b) {a.members = b;};this.setTotal = function (b) {a.total = b;};this.toArrayBuffer = function () {return a;};}, GetUserInfoInput: function GetUserInfoInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, GetUserInfoOutput: function GetUserInfoOutput() {var a = {};this.setUserId = function (b) {a.userId = b;};this.setUserName = function (b) {a.userName = b;};this.setUserPortrait = function (b) {a.userPortrait = b;};this.toArrayBuffer = function () {return a;};}, GetSessionIdInput: function GetSessionIdInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, GetSessionIdOutput: function GetSessionIdOutput() {var a = {};this.setSessionId = function (b) {a.sessionId = b;};this.toArrayBuffer = function () {return a;};}, GetQNupTokenInput: function GetQNupTokenInput() {var a = {};this.setType = function (b) {a.type = b;};this.toArrayBuffer = function () {return a;};}, GetQNupTokenOutput: function GetQNupTokenOutput() {var a = {};this.setDeadline = function (b) {a.deadline = b;};this.setToken = function (b) {a.token = b;};this.toArrayBuffer = function () {return a;};}, GetQNdownloadUrlInput: function GetQNdownloadUrlInput() {var a = {};this.setType = function (b) {a.type = b;};this.setKey = function (b) {a.key = b;};this.setFileName = function (b) {a.fileName = b;};this.toArrayBuffer = function () {return a;};}, GetQNdownloadUrlOutput: function GetQNdownloadUrlOutput() {var a = {};
          this.setDownloadUrl = function (b) {a.downloadUrl = b;};this.toArrayBuffer = function () {return a;};}, Add2BlackListInput: function Add2BlackListInput() {var a = {};this.setUserId = function (b) {a.userId = b;};this.toArrayBuffer = function () {return a;};}, RemoveFromBlackListInput: function RemoveFromBlackListInput() {var a = {};this.setUserId = function (b) {a.userId = b;};this.toArrayBuffer = function () {return a;};}, QueryBlackListInput: function QueryBlackListInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, QueryBlackListOutput: function QueryBlackListOutput() {var a = {};this.setUserIds = function (b) {a.userIds = b;};this.toArrayBuffer = function () {return a;};}, BlackListStatusInput: function BlackListStatusInput() {var a = {};this.setUserId = function (b) {a.userId = b;};this.toArrayBuffer = function () {return a;};}, BlockPushInput: function BlockPushInput() {var a = {};this.setBlockeeId = function (b) {a.blockeeId = b;};this.toArrayBuffer = function () {return a;};}, ModifyPermissionInput: function ModifyPermissionInput() {var a = {};this.setOpenStatus = function (b) {a.openStatus = b;};this.toArrayBuffer = function () {return a;};}, GroupInput: function GroupInput() {var a = {};this.setGroupInfo = function (b) {for (var i = 0, arr = []; i < b.length; i++) {arr.push({ id: b[i].getContent().id, name: b[i].getContent().name });}a.groupInfo = arr;};this.toArrayBuffer = function () {return a;};}, GroupOutput: function GroupOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, GroupInfo: function GroupInfo() {var a = {};this.setId = function (b) {a.id = b;};this.setName = function (b) {a.name = b;};this.getContent = function () {return a;};this.toArrayBuffer = function () {return a;};}, GroupHashInput: function GroupHashInput() {var a = {};this.setUserId = function (b) {a.userId = b;};this.setGroupHashCode = function (b) {a.groupHashCode = b;};this.toArrayBuffer = function () {return a;};}, GroupHashOutput: function GroupHashOutput() {var a = {};this.setResult = function (b) {a.result = b;};this.toArrayBuffer = function () {return a;};}, ChrmInput: function ChrmInput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, ChrmOutput: function ChrmOutput() {var a = {};this.setNothing = function (b) {a.nothing = b;};this.toArrayBuffer = function () {return a;};}, ChrmPullMsg: function ChrmPullMsg() {var a = {};this.setSyncTime = function (b) {a.syncTime = b;};this.setCount = function (b) {a.count = b;};this.toArrayBuffer = function () {return a;};}, RelationsInput: function RelationsInput() {var a = {};this.setType = function (b) {a.type = b;};this.setMsg = function (b) {a.msg = b;};this.setCount = function (b) {a.count = b;};this.toArrayBuffer = function () {return a;};}, RelationsOutput: function RelationsOutput() {var a = {};this.setInfo = function (b) {a.info = b;};this.toArrayBuffer = function () {return a;};}, RelationInfo: function RelationInfo() {var a = {};this.setType = function (b) {a.type = b;};this.setUserId = function (b) {a.userId = b;};this.setMsg = function (b) {a.msg = b;};this.toArrayBuffer = function () {return a;};}, HistoryMessageInput: function HistoryMessageInput() {var a = {};this.setTargetId = function (b) {a.targetId = b;};this.setDataTime = function (b) {a.dataTime = b;};this.setSize = function (b) {a.size = b;};this.toArrayBuffer = function () {return a;};}, HistoryMessagesOuput: function HistoryMessagesOuput() {var a = {};this.setList = function (b) {a.list = b;};this.setSyncTime = function (b) {a.syncTime = b;};this.setHasMsg = function (b) {a.hasMsg = b;};this.toArrayBuffer = function () {return a;};}, HistoryMsgInput: function HistoryMsgInput() {var a = {};this.setTargetId = function (b) {a.targetId = b;};this.setTime = function (b) {a.time = b;};this.setCount = function (b) {a.count = b;};this.setOrder = function (b) {a.order = b;};this.toArrayBuffer = function () {return a;};}, HistoryMsgOuput: function HistoryMsgOuput() {var a = {};this.setList = function (b) {a.list = b;};this.setSyncTime = function (b) {a.syncTime = b;};this.setHasMsg = function (b) {a.hasMsg = b;};this.toArrayBuffer = function () {return a;};}, RtcQueryListInput: function RtcQueryListInput() {var a = {};this.toArrayBuffer = function () {return a;};this.setOrder = function (b) {a.order = b;};}, RtcKeyDeleteInput: function RtcKeyDeleteInput() {var a = {};this.toArrayBuffer = function () {return a;};this.setKey = function (b) {a.key = b;};}, RtcValueInfo: function RtcValueInfo() {var a = {};this.toArrayBuffer = function () {return a;};this.setKey = function (b) {a.key = b;};this.setValue = function (b) {a.value = b;};}, RtcUserListOutput: function RtcUserListOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setList = function (b) {a.list = b;};this.setToken = function (b) {a.token = b;};}, RtcRoomInfoOutput: function RtcRoomInfoOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setRoomId = function (b) {a.roomId = b;};this.setRoomData = function (b) {a.roomData = b;};this.setUserCount = function (b) {a.userCount = b;};this.setList = function (b) {a.list = b;};}, RtcInput: function RtcInput() {var a = {};this.toArrayBuffer = function () {return a;};this.setRoomType = function (b) {a.roomType = b;};this.setBroadcastType = function (b) {a.broadcastType = b;};}, RtcQryOutput: function RtcQryOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setOutInfo = function (b) {a.outInfo = b;};}, RtcDataInput: function RtcDataInput() {var a = {};this.toArrayBuffer = function () {return a;
          };this.setInterior = function (b) {a.interior = b;};this.setTarget = function (b) {a.target = b;};this.setKey = function (b) {a.key = b;};this.setObjectName = function (b) {a.objectName = b;};this.setContent = function (b) {a.content = b;};}, RtcSetDataInput: function RtcSetDataInput() {var a = {};this.toArrayBuffer = function () {return a;};this.setInterior = function (b) {a.interior = b;};this.setTarget = function (b) {a.target = b;};this.setKey = function (b) {a.key = b;};this.setValue = function (b) {a.value = b;};this.setObjectName = function (b) {a.objectName = b;};this.setContent = function (b) {a.content = b;};}, RtcOutput: function RtcOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setNothing = function (b) {a.nothing = b;};}, RtcTokenOutput: function RtcTokenOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setRtcToken = function (b) {a.rtcToken = b;};}, ChrmNotifyMsg: function ChrmNotifyMsg() {var a = {};this.toArrayBuffer = function () {return a;};this.setType = function (b) {a.type = b;};this.setTime = function (b) {a.time = b;};this.setChrmId = function (b) {a.chrmId = b;};}, ChrmKVEntity: function ChrmKVEntity() {var a = {};this.toArrayBuffer = function () {return a;};this.setKey = function (key) {a.key = key;};this.setValue = function (value) {a.value = value;};this.setStatus = function (b) {a.status = b;};this.setTimestamp = function (b) {a.timestamp = b;};this.setUid = function (b) {a.uid = b;};}, SetChrmKV: function SetChrmKV() {var a = {};this.toArrayBuffer = function () {return a;};this.setEntry = function (b) {a.entry = b;};this.setNotification = function (b) {a.notification = b.toArrayBuffer();};this.setBNotify = function (b) {a.bNotify = b;};this.setType = function (b) {a.type = b;};}, ChrmKVOutput: function ChrmKVOutput() {var a = {};this.toArrayBuffer = function () {return a;};this.setEntries = function (b) {this.entries = b;};this.setBFullUpdate = function (b) {this.bFullUpdate = b;};this.setSyncTime = function (b) {this.syncTime = b;};}, QueryChrmKV: function QueryChrmKV() {var a = {};this.toArrayBuffer = function () {return a;};this.setTimestamp = function (b) {a.timestamp = b;};}, DeleteChrmKV: function DeleteChrmKV() {var a = {};this.toArrayBuffer = function () {return a;};this.setEntry = function (b) {a.entry = b;};this.setBNotify = function (b) {a.bNotify = b;};this.setNotification = function (b) {a.notification = b.toArrayBuffer();};this.setType = function (b) {a.type = b;};} };for (var f in Polling) {Polling[f].decode = function (b) {var back = {},val = JSON.parse(b) || eval("(" + b + ")");for (var i in val) {back[i] = val[i];back["get" + i.charAt(0).toUpperCase() + i.slice(1)] = function () {return val[i];};}return back;};}var md5 = function () {function safe_add(x, y) {var lsw = (x & 65535) + (y & 65535),msw = (x >> 16) + (y >> 16) + (lsw >> 16);return msw << 16 | lsw & 65535;}function bit_rol(num, cnt) {return num << cnt | num >>> 32 - cnt;}function md5_cmn(q, a, b, x, s, t) {return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);}function md5_ff(a, b, c, d, x, s, t) {return md5_cmn(b & c | ~b & d, a, b, x, s, t);}function md5_gg(a, b, c, d, x, s, t) {return md5_cmn(b & d | c & ~d, a, b, x, s, t);}function md5_hh(a, b, c, d, x, s, t) {return md5_cmn(b ^ c ^ d, a, b, x, s, t);}function md5_ii(a, b, c, d, x, s, t) {return md5_cmn(c ^ (b | ~d), a, b, x, s, t);}function binl_md5(x, len) {x[len >> 5] |= 128 << len % 32;x[(len + 64 >>> 9 << 4) + 14] = len;var i,olda,oldb,oldc,oldd,a = 1732584193,b = -271733879,c = -1732584194,d = 271733878;for (i = 0; i < x.length; i += 16) {olda = a;oldb = b;oldc = c;oldd = d;a = md5_ff(a, b, c, d, x[i], 7, -680876936);d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);b = md5_gg(b, c, d, a, x[i], 20, -373897302);a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);d = md5_hh(d, a, b, c, x[i], 11, -358537222);c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);a = md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);a = safe_add(a, olda);b = safe_add(b, oldb);c = safe_add(c, oldc);d = safe_add(d, oldd);}return [a, b, c, d];}function binl2rstr(input) {var i,output = "";for (i = 0; i < input.length * 32; i += 8) {output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);}return output;}function rstr2binl(input) {var i,output = [];output[(input.length >> 2) - 1] = undefined;for (i = 0; i < output.length; i += 1) {output[i] = 0;}for (i = 0; i < input.length * 8; i += 8) {output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;}return output;}function rstr_md5(s) {return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));}function rstr_hmac_md5(key, data) {var i,bkey = rstr2binl(key),ipad = [],opad = [],hash;ipad[15] = opad[15] = undefined;if (bkey.length > 16) {bkey = binl_md5(bkey, key.length * 8);}for (i = 0; i < 16; i += 1) {ipad[i] = bkey[i] ^ 909522486;opad[i] = bkey[i] ^ 1549556828;}hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));}function rstr2hex(input) {var hex_tab = "0123456789abcdef",output = "",x,i;for (i = 0; i < input.length; i += 1) {x = input.charCodeAt(i);output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15);}return output;}function str2rstr_utf8(input) {return unescape(encodeURIComponent(input));}function raw_md5(s) {return rstr_md5(str2rstr_utf8(s));}function hex_md5(s) {return rstr2hex(raw_md5(s));}function raw_hmac_md5(k, d) {return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));}function hex_hmac_md5(k, d) {return rstr2hex(raw_hmac_md5(k, d));}function md5(string, key, raw) {if (!key) {if (!raw) {return hex_md5(string);}return raw_md5(string);}if (!raw) {return hex_hmac_md5(key, string);}return raw_hmac_md5(key, string);}return md5;}();var RongIMLib;(function (RongIMLib) {(function (MentionedType) {MentionedType[MentionedType["ALL"] = 1] = "ALL";MentionedType[MentionedType["PART"] = 2] = "PART";})(RongIMLib.MentionedType || (RongIMLib.MentionedType = {}));var MentionedType = RongIMLib.MentionedType;(function (MethodType) {MethodType[MethodType["CUSTOMER_SERVICE"] = 1] = "CUSTOMER_SERVICE";MethodType[MethodType["RECALL"] = 2] = "RECALL";})(RongIMLib.MethodType || (RongIMLib.MethodType = {}));var MethodType = RongIMLib.MethodType;(function (BlacklistStatus) {BlacklistStatus[BlacklistStatus["IN_BLACK_LIST"] = 0] = "IN_BLACK_LIST";BlacklistStatus[BlacklistStatus["NOT_IN_BLACK_LIST"] = 1] = "NOT_IN_BLACK_LIST";})(RongIMLib.BlacklistStatus || (RongIMLib.BlacklistStatus = {}));var BlacklistStatus = RongIMLib.BlacklistStatus;(function (ConnectionChannel) {ConnectionChannel[ConnectionChannel["XHR_POLLING"] = 0] = "XHR_POLLING";ConnectionChannel[ConnectionChannel["WEBSOCKET"] = 1] = "WEBSOCKET";ConnectionChannel[ConnectionChannel["HTTP"] = 0] = "HTTP";ConnectionChannel[ConnectionChannel["HTTPS"] = 1] = "HTTPS";})(RongIMLib.ConnectionChannel || (RongIMLib.ConnectionChannel = {}));var ConnectionChannel = RongIMLib.ConnectionChannel;(function (CustomerType) {CustomerType[CustomerType["ONLY_ROBOT"] = 1] = "ONLY_ROBOT";CustomerType[CustomerType["ONLY_HUMAN"] = 2] = "ONLY_HUMAN";CustomerType[CustomerType["ROBOT_FIRST"] = 3] = "ROBOT_FIRST";CustomerType[CustomerType["HUMAN_FIRST"] = 4] = "HUMAN_FIRST";})(RongIMLib.CustomerType || (RongIMLib.CustomerType = {}));var CustomerType = RongIMLib.CustomerType;(function (GetChatRoomType) {GetChatRoomType[GetChatRoomType["NONE"] = 0] = "NONE";GetChatRoomType[GetChatRoomType["SQQUENCE"] = 1] = "SQQUENCE";GetChatRoomType[GetChatRoomType["REVERSE"] = 2] = "REVERSE";})(RongIMLib.GetChatRoomType || (RongIMLib.GetChatRoomType = {}));var GetChatRoomType = RongIMLib.GetChatRoomType;(function (ConnectionStatus) {ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";ConnectionStatus[ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 6] = "KICKED_OFFLINE_BY_OTHER_CLIENT";ConnectionStatus[ConnectionStatus["WEBSOCKET_UNAVAILABLE"] = 7] = "WEBSOCKET_UNAVAILABLE";ConnectionStatus[ConnectionStatus["WEBSOCKET_ERROR"] = 8] = "WEBSOCKET_ERROR";ConnectionStatus[ConnectionStatus["NETWORK_UNAVAILABLE"] = 3] = "NETWORK_UNAVAILABLE";ConnectionStatus[ConnectionStatus["DOMAIN_INCORRECT"] = 12] = "DOMAIN_INCORRECT";ConnectionStatus[ConnectionStatus["APPKEY_IS_FAKE"] = 20] = "APPKEY_IS_FAKE";ConnectionStatus[ConnectionStatus["CONNECTION_CLOSED"] = 4] = "CONNECTION_CLOSED";ConnectionStatus[ConnectionStatus["ULTRALIMIT"] = 1101] = "ULTRALIMIT";ConnectionStatus[ConnectionStatus["REQUEST_NAVI"] = 201] = "REQUEST_NAVI";ConnectionStatus[ConnectionStatus["RESPONSE_NAVI"] = 202] = "RESPONSE_NAVI";ConnectionStatus[ConnectionStatus["RESPONSE_NAVI_ERROR"] = 203] = "RESPONSE_NAVI_ERROR";
          ConnectionStatus[ConnectionStatus["RESPONSE_NAVI_TIMEOUT"] = 204] = "RESPONSE_NAVI_TIMEOUT";})(RongIMLib.ConnectionStatus || (RongIMLib.ConnectionStatus = {}));var ConnectionStatus = RongIMLib.ConnectionStatus;(function (ConversationNotificationStatus) {ConversationNotificationStatus[ConversationNotificationStatus["DO_NOT_DISTURB"] = 0] = "DO_NOT_DISTURB";ConversationNotificationStatus[ConversationNotificationStatus["NOTIFY"] = 1] = "NOTIFY";})(RongIMLib.ConversationNotificationStatus || (RongIMLib.ConversationNotificationStatus = {}));var ConversationNotificationStatus = RongIMLib.ConversationNotificationStatus;(function (ConversationType) {ConversationType[ConversationType["NONE"] = 0] = "NONE";ConversationType[ConversationType["PRIVATE"] = 1] = "PRIVATE";ConversationType[ConversationType["DISCUSSION"] = 2] = "DISCUSSION";ConversationType[ConversationType["GROUP"] = 3] = "GROUP";ConversationType[ConversationType["CHATROOM"] = 4] = "CHATROOM";ConversationType[ConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";ConversationType[ConversationType["SYSTEM"] = 6] = "SYSTEM";ConversationType[ConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";ConversationType[ConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";})(RongIMLib.ConversationType || (RongIMLib.ConversationType = {}));var ConversationType = RongIMLib.ConversationType;(function (DiscussionInviteStatus) {DiscussionInviteStatus[DiscussionInviteStatus["OPENED"] = 0] = "OPENED";DiscussionInviteStatus[DiscussionInviteStatus["CLOSED"] = 1] = "CLOSED";})(RongIMLib.DiscussionInviteStatus || (RongIMLib.DiscussionInviteStatus = {}));var DiscussionInviteStatus = RongIMLib.DiscussionInviteStatus;(function (ErrorCode) {ErrorCode[ErrorCode["TIMEOUT"] = -1] = "TIMEOUT";ErrorCode[ErrorCode["UNKNOWN"] = -2] = "UNKNOWN";ErrorCode[ErrorCode["PARAMETER_ERROR"] = -3] = "PARAMETER_ERROR";ErrorCode[ErrorCode["RECALL_MESSAGE"] = 25101] = "RECALL_MESSAGE";ErrorCode[ErrorCode["SEND_FREQUENCY_TOO_FAST"] = 20604] = "SEND_FREQUENCY_TOO_FAST";ErrorCode[ErrorCode["RC_MSG_UNAUTHORIZED"] = 20406] = "RC_MSG_UNAUTHORIZED";ErrorCode[ErrorCode["RC_DISCUSSION_GROUP_ID_INVALID"] = 20407] = "RC_DISCUSSION_GROUP_ID_INVALID";ErrorCode[ErrorCode["FORBIDDEN_IN_GROUP"] = 22408] = "FORBIDDEN_IN_GROUP";ErrorCode[ErrorCode["NOT_IN_DISCUSSION"] = 21406] = "NOT_IN_DISCUSSION";ErrorCode[ErrorCode["NOT_IN_GROUP"] = 22406] = "NOT_IN_GROUP";ErrorCode[ErrorCode["NOT_IN_CHATROOM"] = 23406] = "NOT_IN_CHATROOM";ErrorCode[ErrorCode["FORBIDDEN_IN_CHATROOM"] = 23408] = "FORBIDDEN_IN_CHATROOM";ErrorCode[ErrorCode["RC_CHATROOM_USER_KICKED"] = 23409] = "RC_CHATROOM_USER_KICKED";ErrorCode[ErrorCode["RC_CHATROOM_NOT_EXIST"] = 23410] = "RC_CHATROOM_NOT_EXIST";ErrorCode[ErrorCode["RC_CHATROOM_IS_FULL"] = 23411] = "RC_CHATROOM_IS_FULL";ErrorCode[ErrorCode["RC_CHATROOM_PATAMETER_INVALID"] = 23412] = "RC_CHATROOM_PATAMETER_INVALID";ErrorCode[ErrorCode["CHATROOM_GET_HISTORYMSG_ERROR"] = 23413] = "CHATROOM_GET_HISTORYMSG_ERROR";ErrorCode[ErrorCode["CHATROOM_NOT_OPEN_HISTORYMSG_STORE"] = 23414] = "CHATROOM_NOT_OPEN_HISTORYMSG_STORE";ErrorCode[ErrorCode["CHATROOM_KV_EXCEED"] = 23423] = "CHATROOM_KV_EXCEED";ErrorCode[ErrorCode["CHATROOM_KV_OVERWRITE_INVALID"] = 23424] = "CHATROOM_KV_OVERWRITE_INVALID";ErrorCode[ErrorCode["CHATROOM_KV_STORE_NOT_OPEN"] = 23426] = "CHATROOM_KV_STORE_NOT_OPEN";ErrorCode[ErrorCode["CHATROOM_KEY_NOT_EXIST"] = 23427] = "CHATROOM_KEY_NOT_EXIST";ErrorCode[ErrorCode["SENSITIVE_SHIELD"] = 21501] = "SENSITIVE_SHIELD";ErrorCode[ErrorCode["SENSITIVE_REPLACE"] = 21502] = "SENSITIVE_REPLACE";ErrorCode[ErrorCode["JOIN_IN_DISCUSSION"] = 21407] = "JOIN_IN_DISCUSSION";ErrorCode[ErrorCode["CREATE_DISCUSSION"] = 21408] = "CREATE_DISCUSSION";ErrorCode[ErrorCode["INVITE_DICUSSION"] = 21409] = "INVITE_DICUSSION";ErrorCode[ErrorCode["GET_USERINFO_ERROR"] = 23407] = "GET_USERINFO_ERROR";ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"] = 405] = "REJECTED_BY_BLACKLIST";ErrorCode[ErrorCode["RC_NET_CHANNEL_INVALID"] = 30001] = "RC_NET_CHANNEL_INVALID";ErrorCode[ErrorCode["RC_NET_UNAVAILABLE"] = 30002] = "RC_NET_UNAVAILABLE";ErrorCode[ErrorCode["RC_MSG_RESP_TIMEOUT"] = 30003] = "RC_MSG_RESP_TIMEOUT";ErrorCode[ErrorCode["RC_HTTP_SEND_FAIL"] = 30004] = "RC_HTTP_SEND_FAIL";ErrorCode[ErrorCode["RC_HTTP_REQ_TIMEOUT"] = 30005] = "RC_HTTP_REQ_TIMEOUT";ErrorCode[ErrorCode["RC_HTTP_RECV_FAIL"] = 30006] = "RC_HTTP_RECV_FAIL";ErrorCode[ErrorCode["RC_NAVI_RESOURCE_ERROR"] = 30007] = "RC_NAVI_RESOURCE_ERROR";ErrorCode[ErrorCode["RC_NODE_NOT_FOUND"] = 30008] = "RC_NODE_NOT_FOUND";ErrorCode[ErrorCode["RC_DOMAIN_NOT_RESOLVE"] = 30009] = "RC_DOMAIN_NOT_RESOLVE";ErrorCode[ErrorCode["RC_SOCKET_NOT_CREATED"] = 30010] = "RC_SOCKET_NOT_CREATED";ErrorCode[ErrorCode["RC_SOCKET_DISCONNECTED"] = 30011] = "RC_SOCKET_DISCONNECTED";ErrorCode[ErrorCode["RC_PING_SEND_FAIL"] = 30012] = "RC_PING_SEND_FAIL";ErrorCode[ErrorCode["RC_PONG_RECV_FAIL"] = 30013] = "RC_PONG_RECV_FAIL";ErrorCode[ErrorCode["RC_MSG_SEND_FAIL"] = 30014] = "RC_MSG_SEND_FAIL";ErrorCode[ErrorCode["RC_CONN_ACK_TIMEOUT"] = 31000] = "RC_CONN_ACK_TIMEOUT";ErrorCode[ErrorCode["RC_CONN_PROTO_VERSION_ERROR"] = 31001] = "RC_CONN_PROTO_VERSION_ERROR";ErrorCode[ErrorCode["RC_CONN_ID_REJECT"] = 31002] = "RC_CONN_ID_REJECT";ErrorCode[ErrorCode["RC_CONN_SERVER_UNAVAILABLE"] = 31003] = "RC_CONN_SERVER_UNAVAILABLE";
          ErrorCode[ErrorCode["RC_CONN_USER_OR_PASSWD_ERROR"] = 31004] = "RC_CONN_USER_OR_PASSWD_ERROR";ErrorCode[ErrorCode["RC_CONN_NOT_AUTHRORIZED"] = 31005] = "RC_CONN_NOT_AUTHRORIZED";ErrorCode[ErrorCode["RC_CONN_REDIRECTED"] = 31006] = "RC_CONN_REDIRECTED";ErrorCode[ErrorCode["RC_CONN_PACKAGE_NAME_INVALID"] = 31007] = "RC_CONN_PACKAGE_NAME_INVALID";ErrorCode[ErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"] = 31008] = "RC_CONN_APP_BLOCKED_OR_DELETED";ErrorCode[ErrorCode["RC_CONN_USER_BLOCKED"] = 31009] = "RC_CONN_USER_BLOCKED";ErrorCode[ErrorCode["RC_DISCONN_KICK"] = 31010] = "RC_DISCONN_KICK";ErrorCode[ErrorCode["RC_DISCONN_EXCEPTION"] = 31011] = "RC_DISCONN_EXCEPTION";ErrorCode[ErrorCode["RC_QUERY_ACK_NO_DATA"] = 32001] = "RC_QUERY_ACK_NO_DATA";ErrorCode[ErrorCode["RC_MSG_DATA_INCOMPLETE"] = 32002] = "RC_MSG_DATA_INCOMPLETE";ErrorCode[ErrorCode["BIZ_ERROR_CLIENT_NOT_INIT"] = 33001] = "BIZ_ERROR_CLIENT_NOT_INIT";ErrorCode[ErrorCode["BIZ_ERROR_DATABASE_ERROR"] = 33002] = "BIZ_ERROR_DATABASE_ERROR";ErrorCode[ErrorCode["BIZ_ERROR_INVALID_PARAMETER"] = 33003] = "BIZ_ERROR_INVALID_PARAMETER";ErrorCode[ErrorCode["BIZ_ERROR_NO_CHANNEL"] = 33004] = "BIZ_ERROR_NO_CHANNEL";ErrorCode[ErrorCode["BIZ_ERROR_RECONNECT_SUCCESS"] = 33005] = "BIZ_ERROR_RECONNECT_SUCCESS";ErrorCode[ErrorCode["BIZ_ERROR_CONNECTING"] = 33006] = "BIZ_ERROR_CONNECTING";ErrorCode[ErrorCode["MSG_ROAMING_SERVICE_UNAVAILABLE"] = 33007] = "MSG_ROAMING_SERVICE_UNAVAILABLE";ErrorCode[ErrorCode["MSG_INSERT_ERROR"] = 33008] = "MSG_INSERT_ERROR";ErrorCode[ErrorCode["MSG_DEL_ERROR"] = 33009] = "MSG_DEL_ERROR";ErrorCode[ErrorCode["CONVER_REMOVE_ERROR"] = 34001] = "CONVER_REMOVE_ERROR";ErrorCode[ErrorCode["CONVER_GETLIST_ERROR"] = 34002] = "CONVER_GETLIST_ERROR";ErrorCode[ErrorCode["CONVER_SETOP_ERROR"] = 34003] = "CONVER_SETOP_ERROR";ErrorCode[ErrorCode["CONVER_TOTAL_UNREAD_ERROR"] = 34004] = "CONVER_TOTAL_UNREAD_ERROR";ErrorCode[ErrorCode["CONVER_TYPE_UNREAD_ERROR"] = 34005] = "CONVER_TYPE_UNREAD_ERROR";ErrorCode[ErrorCode["CONVER_ID_TYPE_UNREAD_ERROR"] = 34006] = "CONVER_ID_TYPE_UNREAD_ERROR";ErrorCode[ErrorCode["CONVER_CLEAR_ERROR"] = 34007] = "CONVER_CLEAR_ERROR";ErrorCode[ErrorCode["CLEAR_HIS_ERROR"] = 34010] = "CLEAR_HIS_ERROR";ErrorCode[ErrorCode["CLEAR_HIS_TYPE_ERROR"] = 34008] = "CLEAR_HIS_TYPE_ERROR";ErrorCode[ErrorCode["CLEAR_HIS_TIME_ERROR"] = 34011] = "CLEAR_HIS_TIME_ERROR";ErrorCode[ErrorCode["CONVER_GET_ERROR"] = 34009] = "CONVER_GET_ERROR";ErrorCode[ErrorCode["GROUP_SYNC_ERROR"] = 35001] = "GROUP_SYNC_ERROR";ErrorCode[ErrorCode["GROUP_MATCH_ERROR"] = 35002] = "GROUP_MATCH_ERROR";ErrorCode[ErrorCode["CHATROOM_ID_ISNULL"] = 36001] = "CHATROOM_ID_ISNULL";ErrorCode[ErrorCode["CHARTOOM_JOIN_ERROR"] = 36002] = "CHARTOOM_JOIN_ERROR";ErrorCode[ErrorCode["CHATROOM_HISMESSAGE_ERROR"] = 36003] = "CHATROOM_HISMESSAGE_ERROR";ErrorCode[ErrorCode["CHATROOM_KV_NOT_FOUND"] = 36004] = "CHATROOM_KV_NOT_FOUND";ErrorCode[ErrorCode["BLACK_ADD_ERROR"] = 37001] = "BLACK_ADD_ERROR";ErrorCode[ErrorCode["BLACK_GETSTATUS_ERROR"] = 37002] = "BLACK_GETSTATUS_ERROR";ErrorCode[ErrorCode["BLACK_REMOVE_ERROR"] = 37003] = "BLACK_REMOVE_ERROR";ErrorCode[ErrorCode["DRAF_GET_ERROR"] = 38001] = "DRAF_GET_ERROR";ErrorCode[ErrorCode["DRAF_SAVE_ERROR"] = 38002] = "DRAF_SAVE_ERROR";ErrorCode[ErrorCode["DRAF_REMOVE_ERROR"] = 38003] = "DRAF_REMOVE_ERROR";ErrorCode[ErrorCode["SUBSCRIBE_ERROR"] = 39001] = "SUBSCRIBE_ERROR";ErrorCode[ErrorCode["QNTKN_FILETYPE_ERROR"] = 41001] = "QNTKN_FILETYPE_ERROR";ErrorCode[ErrorCode["QNTKN_GET_ERROR"] = 41002] = "QNTKN_GET_ERROR";ErrorCode[ErrorCode["COOKIE_ENABLE"] = 51001] = "COOKIE_ENABLE";ErrorCode[ErrorCode["GET_MESSAGE_BY_ID_ERROR"] = 61001] = "GET_MESSAGE_BY_ID_ERROR";ErrorCode[ErrorCode["HAVNODEVICEID"] = 24001] = "HAVNODEVICEID";ErrorCode[ErrorCode["DEVICEIDISHAVE"] = 24002] = "DEVICEIDISHAVE";ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";ErrorCode[ErrorCode["FEILD"] = 24009] = "FEILD";ErrorCode[ErrorCode["VOIPISNULL"] = 24013] = "VOIPISNULL";ErrorCode[ErrorCode["NOENGINETYPE"] = 24010] = "NOENGINETYPE";ErrorCode[ErrorCode["NULLCHANNELNAME"] = 24011] = "NULLCHANNELNAME";ErrorCode[ErrorCode["VOIPDYANMICERROR"] = 24012] = "VOIPDYANMICERROR";ErrorCode[ErrorCode["NOVOIP"] = 24014] = "NOVOIP";ErrorCode[ErrorCode["INTERNALERRROR"] = 24015] = "INTERNALERRROR";ErrorCode[ErrorCode["VOIPCLOSE"] = 24016] = "VOIPCLOSE";ErrorCode[ErrorCode["CLOSE_BEFORE_OPEN"] = 51001] = "CLOSE_BEFORE_OPEN";ErrorCode[ErrorCode["ALREADY_IN_USE"] = 51002] = "ALREADY_IN_USE";ErrorCode[ErrorCode["INVALID_CHANNEL_NAME"] = 51003] = "INVALID_CHANNEL_NAME";ErrorCode[ErrorCode["VIDEO_CONTAINER_IS_NULL"] = 51004] = "VIDEO_CONTAINER_IS_NULL";ErrorCode[ErrorCode["DELETE_MESSAGE_ID_IS_NULL"] = 61001] = "DELETE_MESSAGE_ID_IS_NULL";
          /*!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 己方取消已发出的通话请求
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */
          ErrorCode[ErrorCode["CANCEL"] = 1] = "CANCEL";
          /*!
                                                                    己方拒绝收到的通话请求
                                                                    */
          ErrorCode[ErrorCode["REJECT"] = 2] = "REJECT";
          /*!
                                                                    己方挂断
                                                                    */
          ErrorCode[ErrorCode["HANGUP"] = 3] = "HANGUP";
          /*!
                                                                    己方忙碌
                                                                    */
          ErrorCode[ErrorCode["BUSYLINE"] = 4] = "BUSYLINE";
          /*!
                                                                        己方未接听
                                                                        */
          ErrorCode[ErrorCode["NO_RESPONSE"] = 5] = "NO_RESPONSE";
          /*!
                                                                              己方不支持当前引擎
                                                                              */
          ErrorCode[ErrorCode["ENGINE_UN_SUPPORTED"] = 6] = "ENGINE_UN_SUPPORTED";
          /*!
                                                                                              己方网络出错
                                                                                              */
          ErrorCode[ErrorCode["NETWORK_ERROR"] = 7] = "NETWORK_ERROR";
          /*!
                                                                                  对方取消已发出的通话请求
                                                                                  */
          ErrorCode[ErrorCode["REMOTE_CANCEL"] = 11] = "REMOTE_CANCEL";
          /*!
                                                                                   对方拒绝收到的通话请求
                                                                                   */
          ErrorCode[ErrorCode["REMOTE_REJECT"] = 12] = "REMOTE_REJECT";
          /*!
                                                                                   通话过程对方挂断
                                                                                   */
          ErrorCode[ErrorCode["REMOTE_HANGUP"] = 13] = "REMOTE_HANGUP";
          /*!
                                                                                   对方忙碌
                                                                                   */
          ErrorCode[ErrorCode["REMOTE_BUSYLINE"] = 14] = "REMOTE_BUSYLINE";
          /*!
                                                                                       对方未接听
                                                                                       */
          ErrorCode[ErrorCode["REMOTE_NO_RESPONSE"] = 15] = "REMOTE_NO_RESPONSE";
          /*!
                                                                                             对方网络错误
                                                                                             */
          ErrorCode[ErrorCode["REMOTE_ENGINE_UN_SUPPORTED"] = 16] = "REMOTE_ENGINE_UN_SUPPORTED";
          /*!
                                                                                                             对方网络错误
                                                                                                             */
          ErrorCode[ErrorCode["REMOTE_NETWORK_ERROR"] = 17] = "REMOTE_NETWORK_ERROR";
          /*!
                                                                                                 VoIP 不可用
                                                                                                 */
          ErrorCode[ErrorCode["VOIP_NOT_AVALIABLE"] = 18] = "VOIP_NOT_AVALIABLE";})(RongIMLib.ErrorCode || (RongIMLib.ErrorCode = {}));var ErrorCode = RongIMLib.ErrorCode;(function (VoIPMediaType) {VoIPMediaType[VoIPMediaType["MEDIA_AUDIO"] = 1] = "MEDIA_AUDIO";VoIPMediaType[VoIPMediaType["MEDIA_VEDIO"] = 2] = "MEDIA_VEDIO";VoIPMediaType[VoIPMediaType["MEDIA_VIDEO"] = 2] = "MEDIA_VIDEO";})(RongIMLib.VoIPMediaType || (RongIMLib.VoIPMediaType = {}));var VoIPMediaType = RongIMLib.VoIPMediaType;(function (MediaType) {MediaType[MediaType["IMAGE"] = 1] = "IMAGE";MediaType[MediaType["AUDIO"] = 2] = "AUDIO";MediaType[MediaType["VIDEO"] = 3] = "VIDEO";MediaType[MediaType["FILE"] = 100] = "FILE";})(RongIMLib.MediaType || (RongIMLib.MediaType = {}));var MediaType = RongIMLib.MediaType;(function (MessageDirection) {MessageDirection[MessageDirection["SEND"] = 1] = "SEND";MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";})(RongIMLib.MessageDirection || (RongIMLib.MessageDirection = {}));var MessageDirection = RongIMLib.MessageDirection;(function (FileType) {FileType[FileType["IMAGE"] = 1] = "IMAGE";FileType[FileType["AUDIO"] = 2] = "AUDIO";FileType[FileType["VIDEO"] = 3] = "VIDEO";FileType[FileType["FILE"] = 4] = "FILE";})(RongIMLib.FileType || (RongIMLib.FileType = {}));var FileType = RongIMLib.FileType;(function (RealTimeLocationErrorCode) {RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NOT_INIT"] = -1] = "RC_REAL_TIME_LOCATION_NOT_INIT";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_SUCCESS"] = 0] = "RC_REAL_TIME_LOCATION_SUCCESS";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_GPS_DISABLED"] = 1] = "RC_REAL_TIME_LOCATION_GPS_DISABLED";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT"] = 2] = "RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_IS_ON_GOING"] = 3] = "RC_REAL_TIME_LOCATION_IS_ON_GOING";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT"] = 4] = "RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_JOIN_FAILURE"] = 5] = "RC_REAL_TIME_LOCATION_JOIN_FAILURE";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_START_FAILURE"] = 6] = "RC_REAL_TIME_LOCATION_START_FAILURE";RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE"] = 7] = "RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE";})(RongIMLib.RealTimeLocationErrorCode || (RongIMLib.RealTimeLocationErrorCode = {}));var RealTimeLocationErrorCode = RongIMLib.RealTimeLocationErrorCode;(function (RealTimeLocationStatus) {RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_IDLE"] = 0] = "RC_REAL_TIME_LOCATION_STATUS_IDLE";RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_INCOMING"] = 1] = "RC_REAL_TIME_LOCATION_STATUS_INCOMING";RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_OUTGOING"] = 2] = "RC_REAL_TIME_LOCATION_STATUS_OUTGOING";RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_CONNECTED"] = 3] = "RC_REAL_TIME_LOCATION_STATUS_CONNECTED";})(RongIMLib.RealTimeLocationStatus || (RongIMLib.RealTimeLocationStatus = {}));var RealTimeLocationStatus = RongIMLib.RealTimeLocationStatus;(function (ReceivedStatus) {ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";ReceivedStatus[ReceivedStatus["RETRIEVED"] = 8] = "RETRIEVED";ReceivedStatus[ReceivedStatus["UNREAD"] = 0] = "UNREAD";})(RongIMLib.ReceivedStatus || (RongIMLib.ReceivedStatus = {}));var ReceivedStatus = RongIMLib.ReceivedStatus;(function (ReadStatus) {ReadStatus[ReadStatus["READ"] = 1] = "READ";ReadStatus[ReadStatus["LISTENED"] = 2] = "LISTENED";ReadStatus[ReadStatus["DOWNLOADED"] = 4] = "DOWNLOADED";ReadStatus[ReadStatus["RETRIEVED"] = 8] = "RETRIEVED";ReadStatus[ReadStatus["UNREAD"] = 0] = "UNREAD";})(RongIMLib.ReadStatus || (RongIMLib.ReadStatus = {}));var ReadStatus = RongIMLib.ReadStatus;(function (SearchType) {SearchType[SearchType["EXACT"] = 0] = "EXACT";SearchType[SearchType["FUZZY"] = 1] = "FUZZY";})(RongIMLib.SearchType || (RongIMLib.SearchType = {}));
        var SearchType = RongIMLib.SearchType;(function (SentStatus) {SentStatus[SentStatus["SENDING"] = 10] = "SENDING";SentStatus[SentStatus["FAILED"] = 20] = "FAILED";SentStatus[SentStatus["SENT"] = 30] = "SENT";SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";SentStatus[SentStatus["READ"] = 50] = "READ";SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";})(RongIMLib.SentStatus || (RongIMLib.SentStatus = {}));var SentStatus = RongIMLib.SentStatus;(function (ConnectionState) {ConnectionState[ConnectionState["ACCEPTED"] = 0] = "ACCEPTED";ConnectionState[ConnectionState["UNACCEPTABLE_PROTOCOL_VERSION"] = 1] = "UNACCEPTABLE_PROTOCOL_VERSION";ConnectionState[ConnectionState["IDENTIFIER_REJECTED"] = 2] = "IDENTIFIER_REJECTED";ConnectionState[ConnectionState["SERVER_UNAVAILABLE"] = 3] = "SERVER_UNAVAILABLE";ConnectionState[ConnectionState["TOKEN_INCORRECT"] = 4] = "TOKEN_INCORRECT";ConnectionState[ConnectionState["NOT_AUTHORIZED"] = 5] = "NOT_AUTHORIZED";ConnectionState[ConnectionState["REDIRECT"] = 6] = "REDIRECT";ConnectionState[ConnectionState["PACKAGE_ERROR"] = 7] = "PACKAGE_ERROR";ConnectionState[ConnectionState["APP_BLOCK_OR_DELETE"] = 8] = "APP_BLOCK_OR_DELETE";ConnectionState[ConnectionState["BLOCK"] = 9] = "BLOCK";ConnectionState[ConnectionState["TOKEN_EXPIRE"] = 10] = "TOKEN_EXPIRE";ConnectionState[ConnectionState["DEVICE_ERROR"] = 11] = "DEVICE_ERROR";})(RongIMLib.ConnectionState || (RongIMLib.ConnectionState = {}));var ConnectionState = RongIMLib.ConnectionState;(function (RTCAPIType) {RTCAPIType[RTCAPIType["ROOM"] = 1] = "ROOM";RTCAPIType[RTCAPIType["PERSON"] = 2] = "PERSON";})(RongIMLib.RTCAPIType || (RongIMLib.RTCAPIType = {}));var RTCAPIType = RongIMLib.RTCAPIType;(function (ChatroomEntityOpt) {ChatroomEntityOpt[ChatroomEntityOpt["UPDATE"] = 1] = "UPDATE";ChatroomEntityOpt[ChatroomEntityOpt["DELETE"] = 2] = "DELETE";})(RongIMLib.ChatroomEntityOpt || (RongIMLib.ChatroomEntityOpt = {}));var ChatroomEntityOpt = RongIMLib.ChatroomEntityOpt;(function (ChatroomEntityLimit) {ChatroomEntityLimit[ChatroomEntityLimit["KEY"] = 128] = "KEY";ChatroomEntityLimit[ChatroomEntityLimit["VALUE"] = 4096] = "VALUE";})(RongIMLib.ChatroomEntityLimit || (RongIMLib.ChatroomEntityLimit = {}));var ChatroomEntityLimit = RongIMLib.ChatroomEntityLimit;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var RongIMClient = function () {function RongIMClient() {}RongIMClient.getInstance = function () {if (!RongIMClient._instance) {throw new Error("RongIMClient is not initialized. Call .init() method first.");}return RongIMClient._instance;};RongIMClient.showError = function (errorInfo) {var hasConsole = console && console.error;if (hasConsole) {console.error(JSON.stringify(errorInfo));}};RongIMClient.logger = function (params) {var code = params.code;var errorInfo = RongIMClient.LogFactory[code] || params;errorInfo.funcName = params.funcName;errorInfo.msg = params.msg || errorInfo.msg;if (RongIMClient._memoryStore.depend.showError) {RongIMClient.showError(errorInfo);}};RongIMClient.logCallback = function (callback, funcName) {return { onSuccess: callback.onSuccess, onError: function onError(errorCode) {RongIMClient.logger({ code: errorCode, funcName: funcName });callback.onError(errorCode);} };};RongIMClient.logSendCallback = function (callback, funcName) {return { onSuccess: callback.onSuccess, onError: function onError(errorCode, result) {RongIMClient.logger({ code: errorCode, funcName: funcName });callback.onError(errorCode, result);}, onBefore: callback.onBefore };};RongIMClient.init = function (appKey, dataAccessProvider, options, callback) {RongIMClient.statusListeners = [];RongIMClient.messageListeners = [];if (RongIMClient._instance) {return RongIMClient._memoryStore.sdkInfo;}RongIMClient._instance = new RongIMClient();options = options || {};var protocol = "http://",wsScheme = "ws://";var isLocationInvalid = (typeof location === "undefined" ? "undefined" : _typeof(location)) !== "object";if (isLocationInvalid || location.protocol == "https:") {wsScheme = "wss://";protocol = "https://";}var isPolling = false;if (typeof WebSocket != "function") {isPolling = true;}var isIntegrity = function isIntegrity() {var hasWS = typeof WebSocket === "undefined" ? "undefined" : _typeof(WebSocket);var integrity = typeof WebSocket.OPEN == "number";return hasWS && integrity;};if ((typeof WebSocket === "undefined" ? "undefined" : _typeof(WebSocket)) == "object" && isIntegrity()) {isPolling = false;}var supportUserData = function supportUserData() {var element = document.documentElement;return element.addBehavior;};if (RongIMLib.RongUtil.supportLocalStorage()) {RongIMClient._storageProvider = new RongIMLib.LocalStorageProvider();} else {if (supportUserData()) {RongIMClient._storageProvider = new RongIMLib.UserDataProvider();} else {RongIMClient._storageProvider = new RongIMLib.MemeoryProvider();}}var serverIndex = RongIMClient._storageProvider.getItem("serverIndex");RongIMClient.serverStore.index = serverIndex || 0;var pathTmpl = "{0}{1}";var _serverPath = { api: "api.cn.ronghub.com" };RongIMLib.RongUtil.forEach(_serverPath, function (path, key) {_serverPath[key] = RongIMLib.RongUtil.stringFormat(pathTmpl, [protocol, path]);});RongIMLib.RongUtil.forEach(_serverPath, function (path, key) {var hasProto = key in options;var config = { path: options[key], tmpl: pathTmpl, protocol: protocol, sub: true };
              path = hasProto ? RongIMLib.RongUtil.formatProtoclPath(config) : path;options[key] = path;});var navigaters = options.navigaters || [];if (options.navi) {navigaters = [options.navi];}if (!options.navi && RongIMLib.RongUtil.isEqual(navigaters.length, 0)) {navigaters = ["nav.cn.ronghub.com", "nav2-cn.ronghub.com"];}RongIMLib.RongUtil.forEach(navigaters, function (navi, index) {var config = { path: navi, tmpl: pathTmpl, protocol: protocol, sub: true };navi = RongIMLib.RongUtil.formatProtoclPath(config);navigaters[index] = navi;});var _sourcePath = { protobuf: "cdn.ronghub.com/protobuf-2.3.7.min.js" };RongIMLib.RongUtil.forEach(_sourcePath, function (path, key) {_sourcePath[key] = RongIMLib.RongUtil.stringFormat(pathTmpl, [protocol, path]);});RongIMLib.RongUtil.extend(_sourcePath, options);var _defaultOpts = { isPolling: isPolling, wsScheme: wsScheme, protocol: protocol, showError: true, openMp: true, snifferTime: 2000, naviTimeout: 5000, navigaters: navigaters, maxNaviRetry: 10, isNaviJSONP: false, isWSPingJSONP: false, isNotifyConversationList: false, maxConversationCount: 300, cmpUrl: "" };delete options.navigaters;RongIMLib.RongUtil.extend(_defaultOpts, options);if (RongIMLib.RongUtil.isFunction(options.protobuf)) {RongIMClient.Protobuf = options.protobuf;}RongIMClient.userStatusObserver = new RongIMLib.RongObserver();var pather = new RongIMLib.FeaturePatcher();pather.patchAll();var tempStore = { token: "", callback: null, lastReadTime: new RongIMLib.LimitableMap(), historyMessageLimit: new RongIMLib.MemoryCache(), conversationList: [], appKey: appKey, publicServiceMap: new RongIMLib.PublicServiceMap(), providerType: 1, deltaTime: 0, filterMessages: [], isSyncRemoteConverList: true, otherDevice: false, custStore: {}, converStore: { latestMessage: {} }, connectAckTime: 0, voipStategy: 0, isFirstPingMsg: true, depend: options, notification: {} };RongIMClient._memoryStore = tempStore;var isCPlusSDK = dataAccessProvider && Object.prototype.toString.call(dataAccessProvider) == "[object Object]";if (isCPlusSDK) {RongIMClient._dataAccessProvider = dataAccessProvider;} else {RongIMClient._dataAccessProvider = new RongIMLib.ServerDataProvider();}options.appCallback = callback;var sdkInfo = RongIMClient._dataAccessProvider.init(appKey, options);RongIMClient._memoryStore.sdkInfo = sdkInfo;if (isCPlusSDK) {RongIMClient._dataAccessProvider.setServerInfo({ navi: location.protocol + options.navi + "/navi.xml" });}RongIMClient.MessageParams = { TextMessage: { objectName: "RC:TxtMsg", msgTag: new RongIMLib.MessageTag(true, true) }, ImageMessage: { objectName: "RC:ImgMsg", msgTag: new RongIMLib.MessageTag(true, true) }, DiscussionNotificationMessage: { objectName: "RC:DizNtf", msgTag: new RongIMLib.MessageTag(false, true) }, VoiceMessage: { objectName: "RC:VcMsg", msgTag: new RongIMLib.MessageTag(true, true) }, RichContentMessage: { objectName: "RC:ImgTextMsg", msgTag: new RongIMLib.MessageTag(true, true) }, FileMessage: { objectName: "RC:FileMsg", msgTag: new RongIMLib.MessageTag(true, true) }, HQVoiceMessage: { objectName: "RC:HQVCMsg", msgTag: new RongIMLib.MessageTag(true, true) }, HandshakeMessage: { objectName: "", msgTag: new RongIMLib.MessageTag(true, true) }, UnknownMessage: { objectName: "", msgTag: new RongIMLib.MessageTag(true, true) }, LocationMessage: { objectName: "RC:LBSMsg", msgTag: new RongIMLib.MessageTag(true, true) }, InformationNotificationMessage: { objectName: "RC:InfoNtf", msgTag: new RongIMLib.MessageTag(false, true) }, ContactNotificationMessage: { objectName: "RC:ContactNtf", msgTag: new RongIMLib.MessageTag(false, true) }, ProfileNotificationMessage: { objectName: "RC:ProfileNtf", msgTag: new RongIMLib.MessageTag(false, true) }, CommandNotificationMessage: { objectName: "RC:CmdNtf", msgTag: new RongIMLib.MessageTag(false, true) }, PublicServiceRichContentMessage: { objectName: "RC:PSImgTxtMsg", msgTag: new RongIMLib.MessageTag(true, true) }, PublicServiceMultiRichContentMessage: { objectName: "RC:PSMultiImgTxtMsg", msgTag: new RongIMLib.MessageTag(true, true) }, JrmfRedPacketMessage: { objectName: "RCJrmf:RpMsg", msgTag: new RongIMLib.MessageTag(true, true) }, JrmfRedPacketOpenedMessage: { objectName: "RCJrmf:RpOpendMsg", msgTag: new RongIMLib.MessageTag(true, true) }, GroupNotificationMessage: { objectName: "RC:GrpNtf", msgTag: new RongIMLib.MessageTag(false, true) }, CommandMessage: { objectName: "RC:CmdMsg", msgTag: new RongIMLib.MessageTag(false, false) }, TypingStatusMessage: { objectName: "RC:TypSts", msgTag: new RongIMLib.MessageTag(false, false) }, PublicServiceCommandMessage: { objectName: "RC:PSCmd", msgTag: new RongIMLib.MessageTag(false, false) }, RecallCommandMessage: { objectName: "RC:RcCmd", msgTag: new RongIMLib.MessageTag(false, true) }, SyncReadStatusMessage: { objectName: "RC:SRSMsg", msgTag: new RongIMLib.MessageTag(false, false) }, ReadReceiptRequestMessage: { objectName: "RC:RRReqMsg", msgTag: new RongIMLib.MessageTag(false, false) }, ReadReceiptResponseMessage: { objectName: "RC:RRRspMsg", msgTag: new RongIMLib.MessageTag(false, false) }, ChangeModeResponseMessage: { objectName: "RC:CsChaR", msgTag: new RongIMLib.MessageTag(false, false) }, ChangeModeMessage: { objectName: "RC:CSCha", msgTag: new RongIMLib.MessageTag(false, false) }, EvaluateMessage: { objectName: "RC:CsEva", msgTag: new RongIMLib.MessageTag(false, false) }, CustomerContact: { objectName: "RC:CsContact", msgTag: new RongIMLib.MessageTag(false, false) }, HandShakeMessage: { objectName: "RC:CsHs", msgTag: new RongIMLib.MessageTag(false, false) }, HandShakeResponseMessage: { objectName: "RC:CsHsR", msgTag: new RongIMLib.MessageTag(false, false) }, SuspendMessage: { objectName: "RC:CsSp", msgTag: new RongIMLib.MessageTag(false, false) }, TerminateMessage: { objectName: "RC:CsEnd", msgTag: new RongIMLib.MessageTag(false, false) }, CustomerStatusUpdateMessage: { objectName: "RC:CsUpdate", msgTag: new RongIMLib.MessageTag(false, false) }, ReadReceiptMessage: { objectName: "RC:ReadNtf", msgTag: new RongIMLib.MessageTag(false, false) }, RCCombineMessage: { objectName: "RC:CombineMsg", msgTag: new RongIMLib.MessageTag(true, true) }, ChrmKVNotificationMessage: { objectName: "RC:chrmKVNotiMsg", msgTag: new RongIMLib.MessageTag(false, false) } };
            RongIMClient.MessageParams["AcceptMessage"] = { objectName: "RC:VCAccept", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["RingingMessage"] = { objectName: "RC:VCRinging", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["SummaryMessage"] = { objectName: "RC:VCSummary", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["HungupMessage"] = { objectName: "RC:VCHangup", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["InviteMessage"] = { objectName: "RC:VCInvite", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["MediaModifyMessage"] = { objectName: "RC:VCModifyMedia", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageParams["MemberModifyMessage"] = { objectName: "RC:VCModifyMem", msgTag: new RongIMLib.MessageTag(false, false) };RongIMClient.MessageType = { TextMessage: "TextMessage", ImageMessage: "ImageMessage", DiscussionNotificationMessage: "DiscussionNotificationMessage", VoiceMessage: "VoiceMessage", RichContentMessage: "RichContentMessage", HandshakeMessage: "HandshakeMessage", UnknownMessage: "UnknownMessage", LocationMessage: "LocationMessage", InformationNotificationMessage: "InformationNotificationMessage", ContactNotificationMessage: "ContactNotificationMessage", ProfileNotificationMessage: "ProfileNotificationMessage", CommandNotificationMessage: "CommandNotificationMessage", CommandMessage: "CommandMessage", TypingStatusMessage: "TypingStatusMessage", ChangeModeResponseMessage: "ChangeModeResponseMessage", ChangeModeMessage: "ChangeModeMessage", EvaluateMessage: "EvaluateMessage", HandShakeMessage: "HandShakeMessage", HandShakeResponseMessage: "HandShakeResponseMessage", SuspendMessage: "SuspendMessage", TerminateMessage: "TerminateMessage", CustomerContact: "CustomerContact", CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage", SyncReadStatusMessage: "SyncReadStatusMessage", ReadReceiptRequestMessage: "ReadReceiptRequestMessage", ReadReceiptResponseMessage: "ReadReceiptResponseMessage", FileMessage: "FileMessage", HQVoiceMessage: "HQVoiceMessage", AcceptMessage: "AcceptMessage", RingingMessage: "RingingMessage", SummaryMessage: "SummaryMessage", HungupMessage: "HungupMessage", InviteMessage: "InviteMessage", MediaModifyMessage: "MediaModifyMessage", MemberModifyMessage: "MemberModifyMessage", JrmfRedPacketMessage: "JrmfRedPacketMessage", JrmfRedPacketOpenedMessage: "JrmfRedPacketOpenedMessage", GroupNotificationMessage: "GroupNotificationMessage", PublicServiceRichContentMessage: "PublicServiceRichContentMessage", PublicServiceMultiRichContentMessage: "PublicServiceMultiRichContentMessage", PublicServiceCommandMessage: "PublicServiceCommandMessage", RecallCommandMessage: "RecallCommandMessage", ReadReceiptMessage: "ReadReceiptMessage", RCCombineMessage: "RCCombineMessage", ChrmKVNotificationMessage: "ChrmKVNotificationMessage" };RongIMClient.LogFactory = { "-1": { code: "-1", msg: "服务器超时" }, "-2": { code: "-2", msg: "未知原因失败" }, "-3": { code: "-3", msg: "参数错误" }, "-4": { code: "-4", msg: "参数不正确或尚未实例化" }, "25101": { code: "25101", msg: "撤回消息参数错误", desc: "请检查撤回消息参数 https://rongcloud.github.io/websdk-demo/api-test.html" }, "25102": { code: "25101", msg: "只能撤回自发发送的消息" }, "20604": { code: "20604", msg: "发送频率过快", desc: "https://developer.rongcloud.cn/ticket/info/9Q3L6vRKd1cLS7rycA==?type=1" }, "20406": { code: "20406", msg: "被禁言" }, "23407": { code: "23407", msg: "获取用户失败" }, "20407": { code: "20407", msg: "群组Id无效" }, "22408": { code: "22408", msg: "群组被禁言" }, "22406": { code: "22406", msg: "不在群组" }, "35001": { code: "35001", msg: "群组同步异常" }, "35002": { code: "35002", msg: "匹配群信息异常" }, "21406": { code: "21406", msg: "不在讨论组" }, "21407": { code: "21407", msg: "加入讨论失败" }, "21408": { code: "21408", msg: "创建讨论组失败" }, "21409": { code: "21409", msg: "设置讨论组邀请状态失败" }, "23406": { code: "23406", msg: "不在聊天室" }, "23408": { code: "23408", msg: "聊天室被禁言" }, "23409": { code: "23409", msg: "聊天室中成员被踢出" }, "23410": { code: "23410", msg: "聊天室不存在" }, "23411": { code: "23411", msg: "聊天室成员已满" }, "23412": { code: "23412", msg: "获取聊天室信息参数无效" }, "23413": { code: "23413", msg: "聊天室异常" }, "23414": { code: "23414", msg: "没有打开聊天室消息存储" }, "36001": { code: "36001", msg: "加入聊天室Id为空" }, "36002": { code: "36002", msg: "加入聊天室失败" }, "36003": { code: "36003", msg: "拉取聊天室历史消息失败" }, "24001": { code: "24001", msg: "没有注册DeviveId 也就是用户没有登陆" }, "24002": { code: "24002", msg: "用户已经存在" }, "0": { code: "0", msg: "成功" }, "24009": { code: "24009", msg: "没有对应的用户或token" }, "24013": { code: "24013", msg: "voip为空" }, "24010": { code: "24010", msg: "不支持的Voip引擎" }, "24011": { code: "24011", msg: "channelName 是空" }, "24012": { code: "24012", msg: "生成Voipkey失败" }, "24014": { code: "24014", msg: "没有配置voip" }, "24015": { code: "24015", msg: "服务器内部错误" }, "24016": { code: "24016", msg: "VOIP close" }, "30001": { code: "30001", msg: "通信过程中，当前Socket不存在" }, "30002": { code: "30002", msg: "Socket连接不可用" }, "30003": { code: "30003", msg: "通信超时" }, "30004": { code: "30004", msg: "导航操作时，Http请求失败" }, "30005": { code: "30005", msg: "HTTP请求失败" }, "30006": { code: "30006", msg: "HTTP接收失败" }, "30007": { code: "30007", msg: "导航资源错误" }, "30008": { code: "30008", msg: "没有有效数据" }, "30009": { code: "30009", msg: "不存在有效 IP 地址" }, "30010": { code: "30010", msg: "创建 Socket 失败" }, "30011": { code: "30011", msg: " Socket 被断开" }, "30012": { code: "30012", msg: "PING 操作失败" }, "30013": { code: "30013", msg: "PING 超时" }, "30014": { code: "30014", msg: "消息发送失败" }, "30016": { code: "30016", msg: "消息大小超限，最大 128 KB" }, "31000": { code: "31000", msg: "做 connect 连接时，收到的 ACK 超时" }, "31001": { code: "31001", msg: "参数错误" }, "31002": { code: "31002", msg: "参数错误，App Id 错误" }, "31003": { code: "31003", msg: "服务器不可用" }, "31004": { code: "31004", msg: "Token 错误" }, "31005": { code: "31005", msg: "App Id 与 Token 不匹配" }, "31006": { code: "31006", msg: "重定向，地址错误" }, "31007": { code: "31007", msg: "NAME 与后台注册信息不一致" }, "31008": { code: "31008", msg: "APP 被屏蔽、删除或不存在" }, "31009": { code: "31009", msg: "用户被屏蔽" }, "31010": { code: "31010", msg: "Disconnect，由服务器返回，比如用户互踢" }, "31011": { code: "31011", msg: "Disconnect，由服务器返回，比如用户互踢" }, "32001": { code: "32001", msg: "协议层内部错误。query，上传下载过程中数据错误" }, "32002": { code: "32002", msg: "协议层内部错误" }, "33001": { code: "33001", msg: "未调用 init 初始化函数" }, "33002": { code: "33002", msg: "数据库初始化失败" }, "33003": { code: "33003", msg: "传入参数无效" }, "33004": { code: "33004", msg: "通道无效" }, "33005": { code: "33005", msg: "重新连接成功" }, "33006": { code: "33006", msg: "连接中，再调用 connect 被拒绝" }, "33007": { code: "33007", msg: "消息漫游服务未开通" }, "33008": { code: "33008", msg: "消息添加失败" }, "33009": { code: "33009", msg: "消息删除失败" }, "34001": { code: "34001", msg: "删除会话失败" }, "34002": { code: "34002", msg: "拉取历史消息失败" }, "34003": { code: "34003", msg: "会话指定异常" }, "34004": { code: "34004", msg: "获取会话未读消息总数失败" }, "34005": { code: "34005", msg: "获取指定会话类型未读消息数异常" }, "34006": { code: "34006", msg: "获取指定用户ID&会话类型未读消息数异常" }, "34007": { code: "34007", msg: "清除会话消息异常" }, "34008": { code: "34008", msg: "获取会话消息异常" }, "34009": { code: "34009", msg: "清除历史消息会话类型不正确" }, "34010": { code: "34010", msg: "清除历史消息失败，请检查传入参数" }, "37001": { code: "37001", msg: "加入黑名单异常" }, "37002": { code: "37002", msg: "获得指定人员再黑名单中的状态异常" }, "37003": { code: "37003", msg: "移除黑名单异常" }, "405": { code: "405", msg: "在黑名单中" }, "38001": { code: "38001", msg: "获取草稿失败" }, "38002": { code: "38002", msg: "保存草稿失败" }, "38003": { code: "38003", msg: "删除草稿失败" }, "39001": { code: "39001", msg: "关注公众号失败" }, "41001": { code: "41001", msg: "文件类型错误" }, "41002": { code: "41002", msg: "获取七牛token失败" }, "51001": { code: "51001", msg: "未安装或未启动插件" }, "51002": { code: "51002", msg: "视频已经存在" }, "51003": { code: "51003", msg: "无效的channelName" }, "51004": { code: "51004", msg: "视频内容为空" }, "61001": { code: "61001", msg: "删除消息数组长度为 0" } };
            var handler = function handler(message, uris, callback) {var userId = message.senderUserId;var _uris = RongIMClient.roomInfo.users[userId].uris || "[]";if (RongIMLib.RongUtil.isString(_uris)) {_uris = JSON.parse(_uris);}var tUris = JSON.parse(JSON.stringify(_uris));RongIMLib.RongUtil.forEach(tUris, function (_uri, index) {RongIMLib.RongUtil.forEach(uris, function (uri) {if (uri.uri == _uri.uri) {callback(_uri, uri, _uris, index);}});});RongIMClient.roomInfo.users[userId].uris = JSON.stringify(_uris);};var RTCMessage = { RTCPublishResourceMessage: function RTCPublishResourceMessage(message, uris) {var userId = message.senderUserId;var user = RongIMClient.roomInfo.users[userId];if (!user) {user = {};RongIMClient.roomInfo.users[userId] = {};}var _uris = user.uris || "[]";if (RongIMLib.RongUtil.isString(_uris)) {_uris = JSON.parse(_uris);}_uris = _uris.concat(uris);RongIMClient.roomInfo.users[userId].uris = JSON.stringify(_uris);}, RTCUnpublishResourceMessage: function RTCUnpublishResourceMessage(message, uris) {handler(message, uris, function (_uri, uri, _uris, index) {_uris.splice(index, 1);});}, RTCModifyResourceMessage: function RTCModifyResourceMessage(message, uris) {handler(message, uris, function (_uri, uri) {_uri.state = uri.state;});}, RTCUserChangeMessage: function RTCUserChangeMessage(message) {var content = message.content;var users = content.users;var UserState = { JOINED: 0, LEFT: 1, OFFLINE: 2 };RongIMLib.RongUtil.forEach(users, function (user) {var state = user.state;var userId = user.userId;switch (+state) {case UserState.JOINED:RongIMClient.roomInfo.users[userId] = {};break;case UserState.LEFT:case UserState.OFFLINE:delete RongIMClient.roomInfo.users[userId];break;}});} };RongIMClient.RTCInnerListener = function (message) {var func = RTCMessage[message.messageType] || function () {};var content = message.content;var uris = content.uris;func(message, uris);};RongIMClient.Conversation = RongIMClient._dataAccessProvider.Conversation;return sdkInfo;};RongIMClient.initApp = function (config, callback) {RongIMClient.init(config.appkey, config.dataAccessProvider, config.opts, function () {var instance = RongIMClient._instance;var error = null;callback(error, instance);});};RongIMClient.connect = function (token, _callback, userId, serverConf) {RongIMLib.CheckParam.getInstance().check(["string", "object", "string|null|object|global|undefined", "object|null|global|undefined"], "connect", true, arguments);var connectCallback = { onSuccess: _callback.onSuccess, onTokenIncorrect: _callback.onTokenIncorrect, onError: function onError(errorCode) {RongIMClient.logger({ code: errorCode, funcName: "connect" });_callback.onError(errorCode);} };RongIMClient._dataAccessProvider.connect(token, connectCallback, userId, serverConf);};RongIMClient.reconnect = function (callback, config) {var connectCallback = { onSuccess: callback.onSuccess, onTokenIncorrect: callback.onTokenIncorrect, onError: function onError(errorCode) {RongIMClient.logger({ code: errorCode, funcName: "connect" });callback.onError(errorCode);} };RongIMClient._dataAccessProvider.reconnect(connectCallback, config);};RongIMClient.registerMessageType = function (messageType, objectName, messageTag, messageContent, searchProps) {RongIMClient._dataAccessProvider.registerMessageType(messageType, objectName, messageTag, messageContent, searchProps);RongIMClient.RegisterMessage[messageType].messageName = messageType;RongIMClient.MessageType[messageType] = messageType;RongIMClient.MessageParams[messageType] = { objectName: objectName, msgTag: messageTag };};RongIMClient.prototype.registerMessageTypes = function (types) {types = types || {};RongIMClient._dataAccessProvider.registerMessageTypes(types);};RongIMClient.setConnectionStatusListener = function (listener) {if (RongIMClient._dataAccessProvider) {RongIMClient._dataAccessProvider.setConnectionStatusListener(listener);} else {if (RongIMLib.RongUtil.isObject(listener) && RongIMLib.RongUtil.isFunction(listener.onChanged)) {RongIMClient.statusListeners.push(listener.onChanged);}}};RongIMClient.statusWatch = function (watcher) {if (RongIMLib.RongUtil.isFunction(watcher)) {RongIMClient.statusListeners.push(watcher);}};RongIMClient.setOnReceiveMessageListener = function (listener) {if (RongIMClient._dataAccessProvider) {RongIMClient._dataAccessProvider.setOnReceiveMessageListener(listener);} else {if (RongIMLib.RongUtil.isObject(listener) && RongIMLib.RongUtil.isFunction(listener.onReceived)) {RongIMClient.messageListeners.push(listener.onReceived);}}};RongIMClient.prototype.logout = function () {RongIMClient._dataAccessProvider.logout();};RongIMClient.prototype.disconnect = function () {RongIMClient._dataAccessProvider.disconnect();};RongIMClient.prototype.startCustomService = function (custId, callback, content) {if (!custId || !callback) {return;}var msg = new RongIMLib.HandShakeMessage(content);var me = this;RongIMLib.RongIMClient._memoryStore.custStore["isInit"] = true;RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE, custId, msg, { onSuccess: function onSuccess(data) {if (data.isBlack) {callback.onError();me.stopCustomeService(custId, { onSuccess: function onSuccess() {}, onError: function onError() {} });} else {callback.onSuccess();}}, onError: function onError() {callback.onError();}, onBefore: function onBefore() {} });
          };RongIMClient.prototype.stopCustomeService = function (custId, callback) {if (!custId || !callback) {return;}var session = RongIMClient._memoryStore.custStore[custId];if (!session) {return;}var msg = new RongIMLib.SuspendMessage({ sid: session.sid, uid: session.uid, pid: session.pid });this.sendCustMessage(custId, msg, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError() {setTimeout(function () {callback.onError();});} });};RongIMClient.prototype.switchToHumanMode = function (custId, callback) {if (!custId || !callback) {return;}var session = RongIMClient._memoryStore.custStore[custId];if (!session) {return;}var msg = new RongIMLib.ChangeModeMessage({ sid: session.sid, uid: session.uid, pid: session.pid });this.sendCustMessage(custId, msg, callback);};RongIMClient.prototype.evaluateRebotCustomService = function (custId, isRobotResolved, sugest, callback) {if (!custId || !callback) {return;}var session = RongIMClient._memoryStore.custStore[custId];if (!session) {return;}var msg = new RongIMLib.EvaluateMessage({ sid: session.sid, uid: session.uid, pid: session.pid, isRobotResolved: isRobotResolved, sugest: sugest, type: 0 });this.sendCustMessage(custId, msg, callback);};RongIMClient.prototype.evaluateHumanCustomService = function (custId, humanValue, sugest, callback) {if (!custId || !callback) {return;}var session = RongIMClient._memoryStore.custStore[custId];if (!session) {return;}var msg = new RongIMLib.EvaluateMessage({ sid: session.sid, uid: session.uid, pid: session.pid, humanValue: humanValue, sugest: sugest, type: 1 });this.sendCustMessage(custId, msg, callback);};RongIMClient.prototype.sendCustMessage = function (custId, msg, callback) {RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE, custId, msg, { onSuccess: function onSuccess(data) {callback.onSuccess();}, onError: function onError() {callback.onError();}, onBefore: function onBefore() {} });};RongIMClient.prototype.getCurrentConnectionStatus = function () {return RongIMClient._dataAccessProvider.getCurrentConnectionStatus();};RongIMClient.prototype.getConnectionChannel = function () {if (RongIMLib.Transportations._TransportType == RongIMLib.Socket.XHR_POLLING) {return RongIMLib.ConnectionChannel.XHR_POLLING;} else {if (RongIMLib.Transportations._TransportType == RongIMLib.Socket.WEBSOCKET) {return RongIMLib.ConnectionChannel.WEBSOCKET;}}};RongIMClient.prototype.getStorageProvider = function () {if (RongIMClient._memoryStore.providerType == 1) {return "ServerDataProvider";} else {return "OtherDataProvider";}};RongIMClient.prototype.setFilterMessages = function (msgFilterNames) {if (Object.prototype.toString.call(msgFilterNames) == "[object Array]") {RongIMClient._memoryStore.filterMessages = msgFilterNames;}};RongIMClient.prototype.getAgoraDynamicKey = function (engineType, channelName, callback) {RongIMClient._dataAccessProvider.getAgoraDynamicKey(engineType, channelName, callback);};RongIMClient.prototype.getCurrentUserId = function () {return RongIMLib.Bridge._client.userId;};RongIMClient.prototype.getDeltaTime = function () {return RongIMClient._dataAccessProvider.getDelaTime();};RongIMClient.prototype.getMessage = function (messageId, callback) {RongIMClient._dataAccessProvider.getMessage(messageId, RongIMClient.logCallback(callback, "getMessage"));};RongIMClient.prototype.deleteLocalMessages = function (conversationType, targetId, messageIds, callback) {RongIMClient._dataAccessProvider.removeLocalMessage(conversationType, targetId, messageIds, RongIMClient.logCallback(callback, "deleteLocalMessages"));};RongIMClient.prototype.updateMessage = function (message, callback) {RongIMClient._dataAccessProvider.updateMessage(message, RongIMClient.logCallback(callback, "updateMessage"));};RongIMClient.prototype.clearData = function () {return RongIMClient._dataAccessProvider.clearData();};RongIMClient.prototype.clearMessages = function (conversationType, targetId, callback) {RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "clearMessages" });callback.onError(errorCode);});} });};RongIMClient.prototype.clearMessagesUnreadStatus = function (conversationType, targetId, callback) {RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", null, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "clearMessagesUnreadStatus" });callback.onError(errorCode);});} });};RongIMClient.prototype.deleteMessages = function (conversationType, targetId, messages, callback) {RongIMClient._dataAccessProvider.removeMessage(conversationType, targetId, messages, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "deleteMessages" });callback.onError(errorCode);});} });};RongIMClient.prototype.sendLocalMessage = function (message, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "sendLocalMessage", false, arguments);
            RongIMClient._dataAccessProvider.updateMessage(message);this.sendMessage(message.conversationType, message.targetId, message.content, RongIMClient.logSendCallback(callback, "sendLocalMessage"));};RongIMClient.prototype.getPullSetting = function (callback) {RongIMClient._dataAccessProvider.getPullSetting(callback);};RongIMClient.prototype.setOfflineMessageDuration = function (duration, callback) {RongIMLib.CheckParam.getInstance().check(["number", "object"], "setOfflineMessageDuration", true, arguments);RongIMClient._dataAccessProvider.setOfflineMessageDuration(duration, callback);};RongIMClient.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback, mentiondMsg, pushText, appData, methodType, params) {RongIMLib.CheckParam.getInstance().check(["number", "string", "object", "object", "undefined|object|null|global|boolean", "undefined|object|null|global|string", "undefined|object|null|global|string", "undefined|object|null|global|number", "undefined|object|null|global"], "sendMessage", false, arguments);if (!RongIMLib.RongUtil.isString(targetId)) {return sendCallback.onError(RongIMLib.ErrorCode.PARAMETER_ERROR);}RongIMClient._dataAccessProvider.sendMessage(conversationType, targetId, messageContent, RongIMClient.logSendCallback(sendCallback, "sendMessage"), mentiondMsg, pushText, appData, methodType, params);};RongIMClient.prototype.sendReceiptResponse = function (conversationType, targetId, sendCallback) {RongIMClient._dataAccessProvider.sendReceiptResponse(conversationType, targetId, RongIMClient.logSendCallback(sendCallback, "sendReceiptResponse"));};RongIMClient.prototype.sendTypingStatusMessage = function (conversationType, targetId, messageName, sendCallback) {RongIMClient._dataAccessProvider.sendTypingStatusMessage(conversationType, targetId, messageName, RongIMClient.logSendCallback(sendCallback, "sendTypingStatusMessage"));};RongIMClient.prototype.sendStatusMessage = function (messageContent, sendCallback, resultCallback) {throw new Error("Not implemented yet");};RongIMClient.prototype.sendTextMessage = function (conversationType, targetId, content, sendMessageCallback) {RongIMClient._dataAccessProvider.sendTextMessage(conversationType, targetId, content, RongIMClient.logSendCallback(sendMessageCallback, "sendTextMessage"));};RongIMClient.prototype.sendRecallMessage = function (content, sendMessageCallback) {var callback = RongIMClient.logSendCallback(sendMessageCallback, "sendRecallMessage");var senderUserId = content.senderUserId;var userId = RongIMLib.Bridge._client.userId;var isOther = senderUserId != userId;if (isOther) {var callback = RongIMClient.logSendCallback(sendMessageCallback, "sendRecallMessage");callback.onError(RongIMLib.ErrorCode.RECALL_MESSAGE, content);return;}RongIMClient._dataAccessProvider.sendRecallMessage(content, callback);};RongIMClient.prototype.insertMessage = function (conversationType, targetId, content, callback) {RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, content, RongIMClient.logCallback(callback, "insertMessage"));};RongIMClient.prototype.setMessageContent = function (messageId, content, objectName) {RongIMClient._dataAccessProvider.setMessageContent(messageId, content, objectName);};RongIMClient.prototype.setMessageSearchField = function (messageId, content, searchFiles) {RongIMClient._dataAccessProvider.setMessageContent(messageId, content, searchFiles);};RongIMClient.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback, objectname, order) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "number|null|global|object", "number", "object", "undefined|object|null|global|string", "number|null|global|object"], "getHistoryMessages", false, arguments);if (count > 20) {throw new Error("HistroyMessage count must be less than or equal to 20!");}if (conversationType.valueOf() < 0) {throw new Error("ConversationType must be greater than -1");}RongIMClient._dataAccessProvider.getHistoryMessages(conversationType, targetId, timestamp, count, RongIMClient.logCallback(callback, "getHistoryMessages"), objectname, order);};RongIMClient.prototype.getRemoteHistoryMessages = function (conversationType, targetId, timestamp, count, callback, config) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "number|null|global|object", "number", "object", "undefined|null|global|object"], "getRemoteHistoryMessages", false, arguments);var funcName = "getRemoteHistoryMessages";var log = { errorCode: RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR, funcName: "getRemoteHistoryMessages" };if (count > 20) {RongIMClient.logger(log);callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);return;}if (conversationType.valueOf() < 0) {RongIMClient.logger(log);callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);return;}RongIMClient._dataAccessProvider.getRemoteHistoryMessages(conversationType, targetId, timestamp, count, RongIMClient.logCallback(callback, funcName), config);};RongIMClient.prototype.clearHistoryMessages = function (params, callback) {RongIMClient._dataAccessProvider.clearHistoryMessages(params, callback);};RongIMClient.prototype.clearRemoteHistoryMessages = function (params, callback) {RongIMClient._dataAccessProvider.clearRemoteHistoryMessages(params, RongIMClient.logCallback(callback, "clearRemoteHistoryMessages"));
          };RongIMClient.prototype.deleteRemoteMessages = function (conversationType, targetId, messages, callback) {RongIMClient._dataAccessProvider.deleteRemoteMessages(conversationType, targetId, messages, RongIMClient.logCallback(callback, "deleteRemoteMessages"));};RongIMClient.prototype.hasRemoteUnreadMessages = function (token, callback) {RongIMClient._dataAccessProvider.hasRemoteUnreadMessages(token, RongIMClient.logCallback(callback, "hasRemoteUnreadMessages"));};RongIMClient.prototype.getTotalUnreadCount = function (callback, conversationTypes) {RongIMClient._dataAccessProvider.getTotalUnreadCount({ onSuccess: function onSuccess(count) {setTimeout(function () {callback.onSuccess(count);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "getTotalUnreadCount" });callback.onError(errorCode);});} }, conversationTypes);};RongIMClient.prototype.getConversationUnreadCount = function (conversationTypes, callback) {RongIMClient._dataAccessProvider.getConversationUnreadCount(conversationTypes, { onSuccess: function onSuccess(count) {setTimeout(function () {callback.onSuccess(count);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "getConversationUnreadCount" });callback.onError(errorCode);});} });};RongIMClient.prototype.getUnreadCount = function (conversationType, targetId, callback) {RongIMClient._dataAccessProvider.getUnreadCount(conversationType, targetId, { onSuccess: function onSuccess(count) {setTimeout(function () {callback.onSuccess(count);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "getUnreadCount" });callback.onError(errorCode);});} });};RongIMClient.prototype.setUnreadCount = function (conversationType, targetId, count) {RongIMLib.CheckParam.getInstance().check(["number", "string", "number"], "setUnreadCount", false, arguments);RongIMClient._dataAccessProvider.setUnreadCount(conversationType, targetId, count);};RongIMClient.prototype.clearUnreadCountByTimestamp = function (conversationType, targetId, timestamp, callback) {RongIMClient._dataAccessProvider.clearUnreadCountByTimestamp(conversationType, targetId, timestamp, RongIMClient.logCallback(callback, "clearUnreadCountByTimestamp"));};RongIMClient.prototype.clearUnreadCount = function (conversationType, targetId, callback) {RongIMClient._dataAccessProvider.clearUnreadCount(conversationType, targetId, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "clearUnreadCount" });callback.onError(errorCode);});} });};RongIMClient.prototype.clearTotalUnreadCount = function (callback) {RongIMClient._dataAccessProvider.clearTotalUnreadCount({ onSuccess: function onSuccess(bool) {callback.onSuccess(bool);}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "clearTotalUnreadCount" });callback.onError(errorCode);});} });};RongIMClient.prototype.clearLocalStorage = function (callback) {RongIMClient._storageProvider.clearItem();callback();};RongIMClient.prototype.setMessageExtra = function (messageId, value, callback) {RongIMClient._dataAccessProvider.setMessageExtra(messageId, value, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "setMessageExtra" });callback.onError(errorCode);});} });};RongIMClient.prototype.setMessageReceivedStatus = function (messageUId, receivedStatus, callback) {RongIMClient._dataAccessProvider.setMessageReceivedStatus(messageUId, receivedStatus, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "setMessageReceivedStatus" });callback.onError(errorCode);});} });};RongIMClient.prototype.setMessageStatus = function (conersationType, targetId, timestamp, status, callback) {RongIMClient._dataAccessProvider.setMessageStatus(conersationType, targetId, timestamp, status, RongIMClient.logCallback(callback, "setMessageStatus"));};RongIMClient.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {RongIMClient._dataAccessProvider.setMessageSentStatus(messageId, sentStatus, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "setMessageSentStatus" });callback.onError(errorCode);});} });};RongIMClient.prototype.clearTextMessageDraft = function (conversationType, targetId) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "clearTextMessageDraft", false, arguments);var key = "darf_" + conversationType + "_" + targetId;delete RongIMClient._memoryStore[key];return true;};RongIMClient.prototype.getTextMessageDraft = function (conversationType, targetId) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "getTextMessageDraft", false, arguments);
            if (targetId == "" || conversationType < 0) {throw new Error("params error : " + RongIMLib.ErrorCode.DRAF_GET_ERROR);}var key = "darf_" + conversationType + "_" + targetId;return RongIMClient._memoryStore[key];};RongIMClient.prototype.saveTextMessageDraft = function (conversationType, targetId, value) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "string", "object"], "saveTextMessageDraft", false, arguments);var key = "darf_" + conversationType + "_" + targetId;RongIMClient._memoryStore[key] = value;return true;};RongIMClient.prototype.searchConversationByContent = function (keyword, callback, conversationTypes) {RongIMClient._dataAccessProvider.searchConversationByContent(keyword, RongIMClient.logCallback(callback, "searchConversationByContent"), conversationTypes);};RongIMClient.prototype.searchMessageByContent = function (conversationType, targetId, keyword, timestamp, count, total, callback) {RongIMClient._dataAccessProvider.searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total, RongIMClient.logCallback(callback, "searchMessageByContent"));};RongIMClient.prototype.clearCache = function () {RongIMClient._dataAccessProvider.clearCache();};RongIMClient.prototype.clearConversations = function (callback) {var conversationTypes = [];for (var _i = 1; _i < arguments.length; _i++) {conversationTypes[_i - 1] = arguments[_i];}if (conversationTypes.length == 0) {conversationTypes = [RongIMLib.ConversationType.CHATROOM, RongIMLib.ConversationType.CUSTOMER_SERVICE, RongIMLib.ConversationType.DISCUSSION, RongIMLib.ConversationType.GROUP, RongIMLib.ConversationType.PRIVATE, RongIMLib.ConversationType.SYSTEM, RongIMLib.ConversationType.PUBLIC_SERVICE, RongIMLib.ConversationType.APP_PUBLIC_SERVICE];}RongIMClient._dataAccessProvider.clearConversations(conversationTypes, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "clearConversations" });callback.onError(errorCode);});} });};RongIMClient.prototype.getConversation = function (conversationType, targetId, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "getConversation", false, arguments);RongIMClient._dataAccessProvider.getConversation(conversationType, targetId, { onSuccess: function onSuccess(conver) {setTimeout(function () {callback.onSuccess(conver);});}, onError: function onError(error) {setTimeout(function () {RongIMClient.logger({ code: error, funcName: "getConversation" });callback.onError(error);});} });};RongIMClient.prototype.pottingConversation = function (tempConver) {var self = this,isUseReplace = false;RongIMClient._dataAccessProvider.getConversation(tempConver.type, tempConver.userId, { onSuccess: function onSuccess(conver) {if (!conver) {conver = new RongIMLib.Conversation();} else {isUseReplace = true;}conver.conversationType = tempConver.type;conver.targetId = tempConver.userId;conver.latestMessage = RongIMLib.MessageUtil.messageParser(tempConver.msg);conver.latestMessageId = conver.latestMessage.messageId;conver.objectName = conver.latestMessage.objectName;conver.receivedStatus = conver.latestMessage.receivedStatus;conver.receivedTime = conver.latestMessage.receiveTime;conver.sentStatus = conver.latestMessage.sentStatus;conver.sentTime = conver.latestMessage.sentTime;var mentioneds = RongIMClient._storageProvider.getItem("mentioneds_" + RongIMLib.Bridge._client.userId + "_" + conver.conversationType + "_" + conver.targetId);if (mentioneds) {var info = JSON.parse(mentioneds);conver.mentionedMsg = info[tempConver.type + "_" + tempConver.userId];}if (!isUseReplace) {if (RongIMLib.RongUtil.supportLocalStorage()) {conver.unreadMessageCount = RongIMLib.UnreadCountHandler.get(tempConver.type, tempConver.userId);} else {conver.unreadMessageCount = 0;}}if (conver.conversationType == RongIMLib.ConversationType.DISCUSSION) {self.getDiscussion(tempConver.userId, { onSuccess: function onSuccess(info) {conver.conversationTitle = info.name;}, onError: function onError(error) {} });}RongIMClient._dataAccessProvider.addConversation(conver, { onSuccess: function onSuccess(data) {} });}, onError: function onError(error) {} });};RongIMClient.prototype.addConversation = function (conversation, callback) {RongIMClient._dataAccessProvider.addConversation(conversation, callback);};RongIMClient.prototype.sortConversationList = function (conversationList) {var convers = [];for (var i = 0, len = conversationList.length; i < len; i++) {if (!conversationList[i]) {continue;}if (conversationList[i].isTop) {convers.push(conversationList[i]);conversationList.splice(i, 1);continue;}for (var j = 0; j < len - i - 1; j++) {if (conversationList[j].sentTime < conversationList[j + 1].sentTime) {var swap = conversationList[j];conversationList[j] = conversationList[j + 1];conversationList[j + 1] = swap;}}}return RongIMClient._memoryStore.conversationList = convers.concat(conversationList);};RongIMClient.prototype.getConversationList = function (callback, conversationTypes, count, isGetHiddenConvers) {RongIMLib.CheckParam.getInstance().check(["object", "null|undefined|array|object|global", "number|undefined|null|object|global", "boolean|undefined|null|object|global"], "getConversationList", false, arguments);
            RongIMClient._dataAccessProvider.getConversationList({ onSuccess: function onSuccess(data) {if (conversationTypes || RongIMClient._dataAccessProvider) {setTimeout(function () {callback.onSuccess(data);});} else {setTimeout(function () {callback.onSuccess(RongIMClient._memoryStore.conversationList);});}}, onError: function onError(error) {setTimeout(function () {RongIMClient.logger({ code: error, funcName: "getConversationList" });callback.onError(error);});} }, conversationTypes, count, isGetHiddenConvers);};RongIMClient.prototype.getRemoteConversationList = function (callback, conversationTypes, count, isGetHiddenConvers) {RongIMLib.CheckParam.getInstance().check(["object", "null|array|object|global", "number|undefined|null|object|global", "boolean|undefined|null|object|global"], "getRemoteConversationList", false, arguments);RongIMClient._dataAccessProvider.getRemoteConversationList(RongIMClient.logCallback(callback, "getRemoteConversationList"), conversationTypes, count, isGetHiddenConvers);};RongIMClient.prototype.updateConversation = function (conversation) {return RongIMClient._dataAccessProvider.updateConversation(conversation);};RongIMClient.prototype.createConversation = function (conversationType, targetId, converTitle) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "string"], "createConversation", false, arguments);var conver = new RongIMLib.Conversation();conver.targetId = targetId;conver.conversationType = conversationType;conver.conversationTitle = converTitle;conver.latestMessage = {};conver.unreadMessageCount = 0;return conver;};RongIMClient.prototype.removeConversation = function (conversationType, targetId, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "removeConversation", false, arguments);RongIMClient._dataAccessProvider.removeConversation(conversationType, targetId, RongIMClient.logCallback(callback, "removeConversation"));};RongIMClient.prototype.setConversationHidden = function (conversationType, targetId, isHidden) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "boolean"], "setConversationHidden", false, arguments);RongIMClient._dataAccessProvider.setConversationHidden(conversationType, targetId, isHidden);};RongIMClient.prototype.setConversationToTop = function (conversationType, targetId, isTop, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "boolean", "object"], "setConversationToTop", false, arguments);RongIMClient._dataAccessProvider.setConversationToTop(conversationType, targetId, isTop, { onSuccess: function onSuccess(bool) {setTimeout(function () {callback.onSuccess(bool);});}, onError: function onError(errorCode) {setTimeout(function () {RongIMClient.logger({ code: errorCode, funcName: "setConversationToTop" });callback.onError(errorCode);});} });};RongIMClient.prototype.getConversationNotificationStatus = function (conversationType, targetId, callback) {var params = { conversationType: conversationType, targetId: targetId };RongIMClient._dataAccessProvider.getConversationNotificationStatus(params, RongIMClient.logCallback(callback, "getConversationNotificationStatus"));};RongIMClient.prototype.setConversationNotificationStatus = function (conversationType, targetId, notificationStatus, callback) {var params = { conversationType: conversationType, targetId: targetId, status: status };RongIMClient._dataAccessProvider.setConversationNotificationStatus(params, RongIMClient.logCallback(callback, "setConversationNotificationStatus"));};RongIMClient.prototype.getNotificationQuietHours = function (callback) {throw new Error("Not implemented yet");};RongIMClient.prototype.removeNotificationQuietHours = function (callback) {throw new Error("Not implemented yet");};RongIMClient.prototype.setNotificationQuietHours = function (startTime, spanMinutes, callback) {throw new Error("Not implemented yet");};RongIMClient.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "addMemberToDiscussion", false, arguments);RongIMClient._dataAccessProvider.addMemberToDiscussion(discussionId, userIdList, RongIMClient.logCallback(callback, "addMemberToDiscussion"));};RongIMClient.prototype.createDiscussion = function (name, userIdList, callback) {RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "createDiscussion", false, arguments);RongIMClient._dataAccessProvider.createDiscussion(name, userIdList, callback);};RongIMClient.prototype.getDiscussion = function (discussionId, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object"], "getDiscussion", false, arguments);RongIMClient._dataAccessProvider.getDiscussion(discussionId, RongIMClient.logCallback(callback, "getDiscussion"));};RongIMClient.prototype.quitDiscussion = function (discussionId, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitDiscussion", false, arguments);RongIMClient._dataAccessProvider.quitDiscussion(discussionId, RongIMClient.logCallback(callback, "quitDiscussion"));};RongIMClient.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "removeMemberFromDiscussion", false, arguments);
            RongIMClient._dataAccessProvider.removeMemberFromDiscussion(discussionId, userId, RongIMClient.logCallback(callback, "removeMemberFromDiscussion"));};RongIMClient.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "setDiscussionInviteStatus", false, arguments);RongIMClient._dataAccessProvider.setDiscussionInviteStatus(discussionId, status, RongIMClient.logCallback(callback, "setDiscussionInviteStatus"));};RongIMClient.prototype.setDiscussionName = function (discussionId, name, callback) {RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "setDiscussionName", false, arguments);RongIMClient._dataAccessProvider.setDiscussionName(discussionId, name, RongIMClient.logCallback(callback, "setDiscussionName"));};RongIMClient.prototype.joinChatRoom = function (chatroomId, messageCount, callback) {RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom", false, arguments);if (chatroomId == "") {setTimeout(function () {var errorCode = RongIMLib.ErrorCode.CHATROOM_ID_ISNULL;RongIMClient.logger({ code: errorCode, funcName: "joinChatRoom" });callback.onError(RongIMLib.ErrorCode.CHATROOM_ID_ISNULL);});return;}RongIMClient._dataAccessProvider.joinChatRoom(chatroomId, messageCount, RongIMClient.logCallback(callback, "joinChatRoom"));};RongIMClient.prototype.setDeviceInfo = function (device) {RongIMClient._dataAccessProvider.setDeviceInfo(device);};RongIMClient.prototype.setChatroomHisMessageTimestamp = function (chatRoomId, timestamp) {RongIMLib.CheckParam.getInstance().check(["string", "number"], "setChatroomHisMessageTimestamp", false, arguments);RongIMClient._dataAccessProvider.setChatroomHisMessageTimestamp(chatRoomId, timestamp);};RongIMClient.prototype.getChatRoomHistoryMessages = function (chatRoomId, count, order, callback) {RongIMLib.CheckParam.getInstance().check(["string", "number", "number", "object"], "getChatRoomHistoryMessages", false, arguments);RongIMClient._dataAccessProvider.getChatRoomHistoryMessages(chatRoomId, count, order, RongIMClient.logCallback(callback, "getChatRoomHistoryMessages"));};RongIMClient.prototype.getChatRoomInfo = function (chatRoomId, count, order, callback) {RongIMLib.CheckParam.getInstance().check(["string", "number", "number", "object"], "getChatRoomInfo", false, arguments);RongIMClient._dataAccessProvider.getChatRoomInfo(chatRoomId, count, order, RongIMClient.logCallback(callback, "getChatRoomInfo"));};RongIMClient.prototype.quitChatRoom = function (chatroomId, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitChatRoom", false, arguments);RongIMClient._dataAccessProvider.quitChatRoom(chatroomId, RongIMClient.logCallback(callback, "quitChatRoom"));};RongIMClient.prototype.setChatroomEntry = function (chatroomId, chatroomEntry, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object", "object"], "setChatroomEntry", false, arguments);RongIMClient._dataAccessProvider.setChatroomEntry(chatroomId, chatroomEntry, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.forceSetChatroomEntry = function (chatroomId, chatroomEntry, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object", "object"], "setChatroomEntry", false, arguments);RongIMClient._dataAccessProvider.forceSetChatroomEntry(chatroomId, chatroomEntry, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.getChatroomEntry = function (chatroomId, key, callback) {RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "getChatroomEntry", false, arguments);RongIMClient._dataAccessProvider.getChatroomEntry(chatroomId, key, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.getAllChatroomEntries = function (chatroomId, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object"], "getAllChatroomEntries", false, arguments);RongIMClient._dataAccessProvider.getAllChatroomEntries(chatroomId, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.removeChatroomEntry = function (chatroomId, chatroomEntry, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object", "object"], "removeChatroomEntry", false, arguments);RongIMClient._dataAccessProvider.removeChatroomEntry(chatroomId, chatroomEntry, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.forceRemoveChatroomEntry = function (chatroomId, chatroomEntry, callback) {RongIMLib.CheckParam.getInstance().check(["string", "object", "object"], "removeChatroomEntry", false, arguments);RongIMClient._dataAccessProvider.forceRemoveChatroomEntry(chatroomId, chatroomEntry, RongIMClient.logCallback(callback, "setChatroomEntry"));};RongIMClient.prototype.getRemotePublicServiceList = function (callback, pullMessageTime) {RongIMClient._dataAccessProvider.getRemotePublicServiceList(RongIMClient.logCallback(callback, "getRemotePublicServiceList"), pullMessageTime);};RongIMClient.prototype.getPublicServiceList = function (callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["object"], "getPublicServiceList", false, arguments);
              this.getRemotePublicServiceList(RongIMClient.logCallback(callback, "getPublicServiceList"));}};RongIMClient.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "getPublicServiceProfile", false, arguments);RongIMClient._dataAccessProvider.getPublicServiceProfile(publicServiceType, publicServiceId, RongIMClient.logCallback(callback, "getPublicServiceProfile"));}};RongIMClient.prototype.pottingPublicSearchType = function (bussinessType, searchType) {if (RongIMClient._memoryStore.depend.openMp) {var bits = 0;if (bussinessType == 0) {bits |= 3;if (searchType == 0) {bits |= 12;} else {bits |= 48;}} else {if (bussinessType == 1) {bits |= 1;if (searchType == 0) {bits |= 8;} else {bits |= 32;}} else {bits |= 2;if (bussinessType == 0) {bits |= 4;} else {bits |= 16;}}}return bits;}};RongIMClient.prototype.searchPublicService = function (searchType, keywords, callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "searchPublicService", false, arguments);var modules = new RongIMClient.Protobuf.SearchMpInput();modules.setType(this.pottingPublicSearchType(0, searchType));modules.setId(keywords);RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, RongIMClient.logCallback(callback, "searchPublicService"), "SearchMpOutput");}};RongIMClient.prototype.searchPublicServiceByType = function (publicServiceType, searchType, keywords, callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["number", "number", "string", "object"], "searchPublicServiceByType", false, arguments);var type = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? 2 : 1;var modules = new RongIMClient.Protobuf.SearchMpInput();modules.setType(this.pottingPublicSearchType(type, searchType));modules.setId(keywords);RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, RongIMClient.logCallback(callback, "searchPublicServiceByType"), "SearchMpOutput");}};RongIMClient.prototype.subscribePublicService = function (publicServiceType, publicServiceId, callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "subscribePublicService", false, arguments);var modules = new RongIMClient.Protobuf.MPFollowInput(),me = this,follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcFollow" : "mpFollow";modules.setId(publicServiceId);RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess() {me.getRemotePublicServiceList({ onSuccess: function onSuccess() {}, onError: function onError() {} });callback.onSuccess();}, onError: function onError(code) {var errorCode = code;RongIMClient.logger({ code: errorCode, funcName: "subscribePublicService" });callback.onError(code);} }, "MPFollowOutput");}};RongIMClient.prototype.unsubscribePublicService = function (publicServiceType, publicServiceId, callback) {if (RongIMClient._memoryStore.depend.openMp) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "object"], "unsubscribePublicService", false, arguments);var modules = new RongIMClient.Protobuf.MPFollowInput(),follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcUnFollow" : "mpUnFollow";modules.setId(publicServiceId);RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess() {RongIMClient._memoryStore.publicServiceMap.remove(publicServiceType, publicServiceId);callback.onSuccess();}, onError: function onError(code) {var errorCode = code;RongIMClient.logger({ code: errorCode, funcName: "unsubscribePublicService" });callback.onError(code);} }, "MPFollowOutput");}};RongIMClient.prototype.addToBlacklist = function (userId, callback) {RongIMLib.CheckParam.getInstance().check(["string|number", "object"], "addToBlacklist", false, arguments);RongIMClient._dataAccessProvider.addToBlacklist(userId, RongIMClient.logCallback(callback, "addToBlacklist"));};RongIMClient.prototype.getBlacklist = function (callback) {RongIMLib.CheckParam.getInstance().check(["object"], "getBlacklist", false, arguments);RongIMClient._dataAccessProvider.getBlacklist(callback);};RongIMClient.prototype.getBlacklistStatus = function (userId, callback) {RongIMLib.CheckParam.getInstance().check(["string|number", "object"], "getBlacklistStatus", false, arguments);RongIMClient._dataAccessProvider.getBlacklistStatus(userId, RongIMClient.logCallback(callback, "getBlacklistStatus"));};RongIMClient.prototype.removeFromBlacklist = function (userId, callback) {RongIMLib.CheckParam.getInstance().check(["string|number", "object"], "removeFromBlacklist", false, arguments);RongIMClient._dataAccessProvider.removeFromBlacklist(userId, RongIMClient.logCallback(callback, "removeFromBlacklist"));};RongIMClient.prototype.getFileToken = function (fileType, callback) {RongIMLib.CheckParam.getInstance().check(["number", "object"], "getQngetFileTokenTkn", false, arguments);
            RongIMClient._dataAccessProvider.getFileToken(fileType, RongIMClient.logCallback(callback, "getFileToken"));};RongIMClient.prototype.getFileUrl = function (fileType, fileName, oriName, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string", "string|global|object|null", "object"], "getFileUrl", false, arguments);RongIMClient._dataAccessProvider.getFileUrl(fileType, fileName, oriName, RongIMClient.logCallback(callback, "getFileUrl"));};RongIMClient.prototype.addRealTimeLocationListener = function (conversationType, targetId, listener) {throw new Error("Not implemented yet");};RongIMClient.prototype.getRealTimeLocation = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.getRealTimeLocationCurrentState = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.getRealTimeLocationParticipants = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.joinRealTimeLocation = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.quitRealTimeLocation = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.startRealTimeLocation = function (conversationType, targetId) {throw new Error("Not implemented yet");};RongIMClient.prototype.updateRealTimeLocationStatus = function (conversationType, targetId, latitude, longitude) {throw new Error("Not implemented yet");};RongIMClient.prototype.startCall = function (converType, targetId, userIds, mediaType, extra, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string|number", "array", "number", "string", "object"], "startCall", false, arguments);if (RongIMClient._memoryStore.voipStategy) {RongIMClient._voipProvider.startCall(converType, targetId, userIds, mediaType, extra, RongIMClient.logCallback(callback, "startCall"));} else {var errorCode = RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;RongIMClient.logger({ code: errorCode, funcName: "startCall" });callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);}};RongIMClient.prototype.joinCall = function (mediaType, callback) {RongIMLib.CheckParam.getInstance().check(["number", "object"], "joinCall", false, arguments);if (RongIMClient._memoryStore.voipStategy) {RongIMClient._voipProvider.joinCall(mediaType, RongIMClient.logCallback(callback, "joinCall"));} else {var errorCode = RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;RongIMClient.logger({ code: errorCode, funcName: "joinCall" });callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);}};RongIMClient.prototype.hungupCall = function (converType, targetId, reason) {RongIMLib.CheckParam.getInstance().check(["number", "string", "number"], "hungupCall", false, arguments);if (RongIMClient._memoryStore.voipStategy) {RongIMClient._voipProvider.hungupCall(converType, targetId, reason);}};RongIMClient.prototype.changeMediaType = function (converType, targetId, mediaType, callback) {RongIMLib.CheckParam.getInstance().check(["number", "string", "number", "object"], "changeMediaType", false, arguments);if (RongIMClient._memoryStore.voipStategy) {RongIMClient._voipProvider.changeMediaType(converType, targetId, mediaType, RongIMClient.logCallback(callback, "changeMediaType"));} else {var errorCode = RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE;RongIMClient.logger({ code: errorCode, funcName: "changeMediaType" });callback.onError(RongIMLib.ErrorCode.VOIP_NOT_AVALIABLE);}};RongIMClient.prototype.getUnreadMentionedMessages = function (conversationType, targetId) {return RongIMClient._dataAccessProvider.getUnreadMentionedMessages(conversationType, targetId);};RongIMClient.prototype.clearListeners = function () {RongIMClient._dataAccessProvider.clearListeners();};RongIMClient.prototype.getUserStatus = function (userId, callback) {RongIMClient._dataAccessProvider.getUserStatus(userId, RongIMClient.logCallback(callback, "getUserStatus"));};RongIMClient.prototype.setUserStatus = function (status, callback) {RongIMClient._dataAccessProvider.setUserStatus(status, RongIMClient.logCallback(callback, "setUserStatus"));};RongIMClient.prototype.setUserStatusListener = function (params, callback) {var userIds = params.userIds;var multiple = params.multiple;RongIMClient.userStatusObserver.watch({ key: userIds, func: callback, multiple: multiple });RongIMClient._dataAccessProvider.setUserStatusListener(params, callback);};RongIMClient.messageWatch = function (watcher) {RongIMClient.RTCListener = watcher;};RongIMClient.messageSignalWatch = function (watcher) {RongIMClient.RTCSignalLisener = watcher;};RongIMClient.prototype.getRTCUserInfoList = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "getRTCUserInfoList", false, arguments);RongIMClient._dataAccessProvider.getRTCUserInfoList(room, callback);};RongIMClient.prototype.getRTCUserList = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "getRTCUserList", false, arguments);RongIMClient._dataAccessProvider.getRTCUserList(room, callback);};RongIMClient.prototype.setRTCUserInfo = function (room, info, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object", "object"], "setRTCUserInfo", false, arguments);
            RongIMClient._dataAccessProvider.setRTCUserInfo(room, info, callback);};RongIMClient.prototype.removeRTCUserInfo = function (room, info, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object", "object"], "removeRTCUserInfo", false, arguments);RongIMClient._dataAccessProvider.removeRTCUserInfo(room, info, callback);};RongIMClient.prototype.getRTCRoomInfo = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "getRTCRoomInfo", false, arguments);RongIMClient._dataAccessProvider.getRTCRoomInfo(room, callback);};RongIMClient.prototype.setRTCRoomInfo = function (room, info, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object", "object"], "setRTCRoomInfo", false, arguments);RongIMClient._dataAccessProvider.setRTCRoomInfo(room, info, callback);};RongIMClient.prototype.removeRTCRoomInfo = function (room, info, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object", "object"], "removeRTCRoomInfo", false, arguments);RongIMClient._dataAccessProvider.removeRTCRoomInfo(room, info, callback);};RongIMClient.prototype.joinRTCRoom = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "joinRTCRoom", false, arguments);if (RongIMClient.isJoinedRTCRoom) {return callback.onSuccess(RongIMClient.roomInfo);}RongIMClient._dataAccessProvider.joinRTCRoom(room, { onSuccess: function onSuccess(result) {RongIMClient.roomInfo = result;RongIMClient.isJoinedRTCRoom = true;callback.onSuccess(result);}, onError: callback.onError });};RongIMClient.prototype.quitRTCRoom = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "quitRTCRoom", false, arguments);RongIMClient.isJoinedRTCRoom = false;RongIMClient._dataAccessProvider.quitRTCRoom(room, { onSuccess: function onSuccess() {RongIMClient.roomInfo = { users: {}, token: "" };callback.onSuccess(true);}, onError: callback.onError });};RongIMClient.prototype.RTCPing = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "RTCPing", false, arguments);RongIMClient._dataAccessProvider.RTCPing(room, callback);};RongIMClient.prototype.setRTCUserData = function (roomId, key, value, isInner, callback, message) {RongIMLib.CheckParam.getInstance().check(["string", "string", "string", "boolean", "object", "global|object|null|undefined"], "setRTCUserData", false, arguments);RongIMClient._dataAccessProvider.setRTCUserData(roomId, key, value, isInner, callback, message);};RongIMClient.prototype.getRTCUserData = function (roomId, keys, isInner, callback) {RongIMLib.CheckParam.getInstance().check(["string", "array", "boolean", "object", "global|object|null"], "getRTCUserData", false, arguments);RongIMClient._dataAccessProvider.getRTCUserData(roomId, keys, isInner, callback);};RongIMClient.prototype.removeRTCUserData = function (roomId, keys, isInner, callback, message) {RongIMLib.CheckParam.getInstance().check(["string", "array", "boolean", "object", "global|object|null|undefined"], "removeRTCUserData", false, arguments);RongIMClient._dataAccessProvider.removeRTCUserData(roomId, keys, isInner, callback, message);};RongIMClient.prototype.setRTCRoomData = function (roomId, key, value, isInner, callback, message) {RongIMLib.CheckParam.getInstance().check(["string", "string", "string", "boolean", "object", "global|object|null|undefined"], "setRTCRoomData", false, arguments);RongIMClient._dataAccessProvider.setRTCRoomData(roomId, key, value, isInner, callback, message);};RongIMClient.prototype.getRTCRoomData = function (roomId, keys, isInner, callback) {RongIMLib.CheckParam.getInstance().check(["string", "array", "boolean", "object"], "getRTCRoomData", false, arguments);RongIMClient._dataAccessProvider.getRTCRoomData(roomId, keys, isInner, callback);};RongIMClient.prototype.removeRTCRoomData = function (roomId, keys, isInner, callback, message) {RongIMLib.CheckParam.getInstance().check(["string", "array", "boolean", "object", "global|object|null|undefined"], "removeRTCRoomData", false, arguments);RongIMClient._dataAccessProvider.removeRTCRoomData(roomId, keys, isInner, callback, message);};RongIMClient.prototype.setRTCOutData = function (roomId, data, type, callback, message) {RongIMClient._dataAccessProvider.setRTCOutData(roomId, data, type, callback, message);};RongIMClient.prototype.getRTCOutData = function (roomId, userIds, callback) {RongIMClient._dataAccessProvider.getRTCOutData(roomId, userIds, callback);};RongIMClient.prototype.getNavi = function () {return RongIMClient._dataAccessProvider.getNavi();};RongIMClient.prototype.getRTCToken = function (room, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object"], "getRTCToken", false, arguments);return RongIMClient._dataAccessProvider.getRTCToken(room, callback);};RongIMClient.prototype.setRTCState = function (room, content, callback) {RongIMLib.CheckParam.getInstance().check(["object", "object", "object"], "setRTCState", false, arguments);return RongIMClient._dataAccessProvider.setRTCState(room, content, callback);};RongIMClient.prototype.getAppInfo = function () {var appKey = RongIMClient._memoryStore.appKey;return { appKey: appKey };};RongIMClient.prototype.getSDKInfo = function () {return { version: RongIMClient.sdkver };};RongIMClient.RTCListener = function () {};
          RongIMClient.RTCInnerListener = function () {};RongIMClient.RTCSignalLisener = function () {};RongIMClient.currentServer = "";RongIMClient.LogFactory = {};RongIMClient.MessageType = {};RongIMClient.RegisterMessage = {};RongIMClient._memoryStore = { isPullFinished: false, syncMsgQueue: [] };RongIMClient.isNotPullMsg = false;RongIMClient.userStatusObserver = null;RongIMClient.sdkver = "2.5.5";RongIMClient.otherDeviceLoginCount = 0;RongIMClient.serverStore = { index: 0 };RongIMClient.isFirstConnect = true;RongIMClient.roomInfo = { users: {}, token: "" };RongIMClient.invalidWsUrls = [];RongIMClient.isJoinedRTCRoom = false;RongIMClient.statusListeners = [];RongIMClient.messageListeners = [];RongIMClient.userStatusListener = null;return RongIMClient;}();RongIMLib.RongIMClient = RongIMClient;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {(function (Qos) {Qos[Qos["AT_MOST_ONCE"] = 0] = "AT_MOST_ONCE";Qos[Qos["AT_LEAST_ONCE"] = 1] = "AT_LEAST_ONCE";Qos[Qos["EXACTLY_ONCE"] = 2] = "EXACTLY_ONCE";Qos[Qos["DEFAULT"] = 3] = "DEFAULT";})(RongIMLib.Qos || (RongIMLib.Qos = {}));var Qos = RongIMLib.Qos;(function (Type) {Type[Type["CONNECT"] = 1] = "CONNECT";Type[Type["CONNACK"] = 2] = "CONNACK";Type[Type["PUBLISH"] = 3] = "PUBLISH";Type[Type["PUBACK"] = 4] = "PUBACK";Type[Type["QUERY"] = 5] = "QUERY";Type[Type["QUERYACK"] = 6] = "QUERYACK";Type[Type["QUERYCON"] = 7] = "QUERYCON";Type[Type["SUBSCRIBE"] = 8] = "SUBSCRIBE";Type[Type["SUBACK"] = 9] = "SUBACK";Type[Type["UNSUBSCRIBE"] = 10] = "UNSUBSCRIBE";Type[Type["UNSUBACK"] = 11] = "UNSUBACK";Type[Type["PINGREQ"] = 12] = "PINGREQ";Type[Type["PINGRESP"] = 13] = "PINGRESP";Type[Type["DISCONNECT"] = 14] = "DISCONNECT";})(RongIMLib.Type || (RongIMLib.Type = {}));var Type = RongIMLib.Type;var _topic = ["invtDiz", "crDiz", "qnUrl", "userInf", "dizInf", "userInf", "joinGrp", "quitDiz", "exitGrp", "evctDiz", ["", "ppMsgP", "pdMsgP", "pgMsgP", "chatMsg", "pcMsgP", "", "pmcMsgN", "pmpMsgN", "", "", "", "prMsgS", "prMsgP"], "pdOpen", "rename", "uGcmpr", "qnTkn", "destroyChrm", "createChrm", "exitChrm", "queryChrm", "joinChrm", "pGrps", "addBlack", "rmBlack", "getBlack", "blackStat", "addRelation", "qryRelation", "delRelation", "pullMp", "schMp", "qnTkn", "qnUrl", "qryVoipK", "delMsg", "qryCHMsg", "getUserStatus", "setUserStatus", "subUserStatus", "cleanHisMsg"];var Channel = function () {function Channel(cb, self) {this.connectionStatus = -1;var appId = self.appId;var token = encodeURIComponent(self.token);var sdkVer = self.sdkVer;var apiVer = self.apiVer;this.self = self;this.socket = Socket.getInstance().createServer();var that = this;var storage = RongIMLib.RongIMClient._storageProvider;var servers = storage.getItem("servers");servers = JSON.parse(servers) || [];servers = RongIMLib.RongUtil.getValidWsUrlList(servers);var depend = RongIMLib.RongIMClient._memoryStore.depend;if (depend.cmpUrl) {servers = [depend.cmpUrl].concat(servers);}var startConnect = function startConnect(host) {var tpl = "{host}/websocket?appId={appId}&token={token}&sdkVer={sdkVer}&apiVer={apiVer}";that.url = RongIMLib.RongUtil.tplEngine(tpl, { host: host, appId: appId, token: token, sdkVer: sdkVer, apiVer: apiVer });that.socket.connect(that.url, cb);var userId = storage.getItem("rong_current_user");RongIMLib.Navigation.Endpoint = { host: host, userId: userId };};var connectMap = { get: function get$$1() {var totalTimer = new RongIMLib.Timer({ timeout: 1 * 1000 * 15 });var timers = [];var xhrs = [];var isFinished = false;var clearHandler = function clearHandler() {for (var i = 0; i < timers.length; i++) {var timer = timers[i];clearTimeout(timer);}for (var i = 0; i < xhrs.length; i++) {var xhr = xhrs[i];xhr.abort();}timers.length = 0;xhrs.length = 0;};var request = function request(config, callback) {var url = config.url;var time = config.time;if (isFinished) {return;}var timer = setTimeout(function () {var onSuccess = function onSuccess() {if (isFinished) {return;}clearHandler();isFinished = true;totalTimer.pause();callback(url);};var xhr = RongIMLib.MessageUtil.detectCMP({ url: url, success: onSuccess, fail: function fail(code) {console.log(code);} });xhrs.push(xhr);}, time);timers.push(timer);};var snifferCallback = function snifferCallback(url) {var reg = /(http|https):\/\/([^\/]+)/i;var host = url.match(reg)[2];RongIMLib.RongIMClient.currentServer = host;startConnect(host);};var snifferTpl = "{protocol}{server}/ping?r={random}";for (var i = 0; i < servers.length; i++) {var server = servers[i];if (server) {server = RongIMLib.RongUtil.tplEngine(snifferTpl, { protocol: depend.protocol, server: server, random: RongIMLib.RongUtil.getTimestamp() });request({ url: server, time: i * 1000 }, snifferCallback);}}totalTimer.resume(function () {RongIMLib.Navigation.clear();clearHandler();that.socket.fire("StatusChanged", RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);});}, element: function element() {var totalTimer = new RongIMLib.Timer({ timeout: 1 * 1000 * 15 });var timers = [];var elements = [];var isFinished = false;var clearHandler = function clearHandler() {for (var i = 0; i < timers.length; i++) {var timer = timers[i];clearTimeout(timer);}for (var i = 0; i < elements.length; i++) {var el = elements[i];document.body.removeChild(el);}};var request = function request(config, callback) {var url = config.url;var time = config.time;if (isFinished) {return;}var timer = setTimeout(function () {var el = document.createElement("script");el.src = url;document.body.appendChild(el);
                    el.onerror = function () {if (isFinished) {return;}clearHandler();isFinished = true;totalTimer.pause();var url = el.src;callback(url);};elements.push(el);}, time);timers.push(timer);};var snifferCallback = function snifferCallback(url) {var reg = /(http|https):\/\/([^\/]+)/i;var host = url.match(reg)[2];startConnect(host);};var snifferTpl = "//{server}/{path}";for (var i = 0; i < servers.length; i++) {var server = RongIMLib.RongUtil.tplEngine(snifferTpl, { server: servers[i], path: i });request({ url: server, time: i * 1000 }, snifferCallback);}totalTimer.resume(function () {clearHandler();that.socket.fire("StatusChanged", RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);});} };var isWSPingJSONP = depend.isWSPingJSONP;var connectType = isWSPingJSONP ? "element" : "get";connectMap[connectType]();var StatusEvent = Channel._ConnectionStatusListener;var hasEvent = (typeof StatusEvent === "undefined" ? "undefined" : _typeof(StatusEvent)) == "object";var me = this;me.socket.on("StatusChanged", function (code) {if (RongIMLib.Bridge && RongIMLib.Bridge._client && RongIMLib.Bridge._client.channel && me !== RongIMLib.Bridge._client.channel) {return;}if (!hasEvent) {throw new Error("setConnectStatusListener:Parameter format is incorrect");}var isNetworkUnavailable = code == RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;var isWebSocket = !RongIMLib.RongIMClient._memoryStore.depend.isPolling;if (RongIMLib.RongIMClient.isFirstConnect && isNetworkUnavailable && isWebSocket) {code = RongIMLib.ConnectionStatus.WEBSOCKET_UNAVAILABLE;}if (isNetworkUnavailable) {var storage = RongIMLib.RongIMClient._storageProvider;var servers = storage.getItem("servers");servers = JSON.parse(servers);var currentServer = RongIMLib.RongIMClient.currentServer;if (currentServer) {var index = RongIMLib.RongUtil.indexOf(servers, currentServer);if (!RongIMLib.RongUtil.isEqual(index, -1)) {var server = servers.splice(index, 1)[0];servers.push(server);storage.setItem("servers", JSON.stringify(servers));}}}me.connectionStatus = code;setTimeout(function () {StatusEvent.onChanged(code);});var isDisconnected = code == RongIMLib.ConnectionStatus.DISCONNECTED;if (isDisconnected) {self.clearHeartbeat();}var isOtherDevice = code == RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT;if (isOtherDevice) {RongIMLib.RongIMClient.otherDeviceLoginCount++;}var isConnected = code == RongIMLib.ConnectionStatus.CONNECTED;if (isConnected) {RongIMLib.RongIMClient.isFirstConnect = false;}var isWebsocketUnAvailable = code == RongIMLib.ConnectionStatus.WEBSOCKET_UNAVAILABLE;if (isWebsocketUnAvailable) {me.changeConnectType();RongIMLib.RongIMClient.isFirstConnect = false;RongIMLib.RongIMClient.connect(self.token, RongIMLib.RongIMClient._memoryStore.callback);}});this.socket.on("message", self.handler.handleMessage);this.socket.on("disconnect", function (status) {that.socket.fire("StatusChanged", status ? status : 2);});}Channel.prototype.changeConnectType = function () {RongIMLib.RongIMClient._memoryStore.depend.isPolling = !RongIMLib.RongIMClient._memoryStore.depend.isPolling;new RongIMLib.FeatureDectector();};Channel.prototype.writeAndFlush = function (val) {this.socket.send(val);};Channel.prototype.reconnect = function (callback) {RongIMLib.MessageIdHandler.clearMessageId();this.socket = this.socket.reconnect();if (callback) {this.self.reconnectObj = callback;}};Channel.prototype.disconnect = function (status) {this.socket.disconnect(status);};return Channel;}();RongIMLib.Channel = Channel;var Socket = function () {function Socket() {this.socket = null;this._events = {};}Socket.getInstance = function () {return new Socket();};Socket.prototype.connect = function (url, cb) {if (this.socket) {if (url) {RongIMLib.RongIMClient._storageProvider.setItem("rongSDK", this.checkTransport());this.on("connect", cb || new Function());}if (url) {this.currentURL = url;}this.socket.createTransport(url);}return this;};Socket.prototype.createServer = function () {var transport = this.getTransport(this.checkTransport());if (transport === null) {throw new Error("the channel was not supported");}return transport;};Socket.prototype.getTransport = function (transportType) {if (transportType == Socket.XHR_POLLING) {this.socket = new RongIMLib.PollingTransportation(this);} else {if (transportType == Socket.WEBSOCKET) {this.socket = new RongIMLib.SocketTransportation(this);}}return this;};Socket.prototype.send = function (data) {if (this.socket) {if (this.checkTransport() == Socket.WEBSOCKET) {this.socket.send(data);} else {this.socket.send(this._encode(data));}}};Socket.prototype.onMessage = function (data) {this.fire("message", data);};Socket.prototype.disconnect = function (status) {this.socket.disconnect(status);this.fire("disconnect", status);return this;};Socket.prototype.reconnect = function () {if (this.currentURL && RongIMLib.RongIMClient._storageProvider.getItem("rongSDK")) {return this.connect(this.currentURL, null);} else {throw new Error("reconnect:no have URL");}};Socket.prototype.checkTransport = function () {if (RongIMLib.RongIMClient._memoryStore.depend.isPolling) {RongIMLib.Transportations._TransportType = Socket.XHR_POLLING;}return RongIMLib.Transportations._TransportType;};Socket.prototype.fire = function (x, args) {if (x in this._events) {for (var i = 0, ii = this._events[x].length; i < ii; i++) {this._events[x][i](args);
              }}return this;};Socket.prototype.on = function (x, func) {if (!(typeof func == "function" && x)) {return this;}if (x in this._events) {RongIMLib.MessageUtil.indexOf(this._events, func) == -1 && this._events[x].push(func);} else {this._events[x] = [func];}return this;};Socket.prototype.removeEvent = function (x, fn) {if (x in this._events) {for (var a = 0, l = this._events[x].length; a < l; a++) {if (this._events[x][a] == fn) {this._events[x].splice(a, 1);}}}return this;};Socket.prototype._encode = function (x) {var str = "?messageid=" + x.getMessageId() + "&header=" + x.getHeaderFlag() + "&sessionid=" + RongIMLib.RongIMClient._storageProvider.getItem("sId" + RongIMLib.Navigation.Endpoint.userId);if (!/(PubAckMessage|QueryConMessage)/.test(x._name)) {str += "&topic=" + x.getTopic() + "&targetid=" + (x.getTargetId() || "");}return { url: str, data: "getData" in x ? x.getData() : "" };};Socket.XHR_POLLING = "xhr-polling";Socket.WEBSOCKET = "websocket";return Socket;}();RongIMLib.Socket = Socket;var Client = function () {function Client(token, appId) {this.timeoutMillis = 6000;this.timeout_ = 0;this.sdkVer = "";this.apiVer = Math.floor(Math.random() * 1000000);this.channel = null;this.handler = null;this.userId = "";this.reconnectObj = {};this.heartbeat = 0;this.pullMsgHearbeat = 0;this.chatroomId = "";this.SyncTimeQueue = [];this.cacheMessageIds = [];this.token = token;this.appId = appId;this.SyncTimeQueue.state = "complete";this.sdkVer = RongIMLib.RongIMClient.sdkver;}Client.prototype.resumeTimer = function () {var me = this;this.timeout_ = setTimeout(function () {me.channel.disconnect(RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);}, this.timeoutMillis);};Client.prototype.pauseTimer = function () {if (this.timeout_) {clearTimeout(this.timeout_);this.timeout_ = 0;}};Client.prototype.connect = function (_callback) {this.handler = new MessageHandler(this);this.handler.setConnectCallback(_callback);var me = this;this.channel = new Channel(function () {RongIMLib.Transportations._TransportType == Socket.WEBSOCKET && me.keepLive();}, this);this.channel.socket.fire("StatusChanged", RongIMLib.ConnectionStatus.CONNECTING);};Client.prototype.checkSocket = function (callback) {var me = this;me.channel.writeAndFlush(new RongIMLib.PingReqMessage());var count = 0;var checkTimeout = setInterval(function () {if (!RongIMLib.RongIMClient._memoryStore.isFirstPingMsg) {clearInterval(checkTimeout);callback.onSuccess();} else {if (count > 15) {clearInterval(checkTimeout);callback.onError();}}count++;}, 100);};Client.prototype.keepLive = function () {if (this.heartbeat > 0) {clearInterval(this.heartbeat);}var me = this;me.heartbeat = setInterval(function () {me.resumeTimer();me.channel.writeAndFlush(new RongIMLib.PingReqMessage());}, 30000);if (me.pullMsgHearbeat > 0) {clearInterval(me.pullMsgHearbeat);}me.pullMsgHearbeat = setInterval(function () {me.syncTime(true, undefined, undefined, false);}, 180000);};Client.prototype.clearHeartbeat = function () {clearInterval(this.heartbeat);this.heartbeat = 0;this.pauseTimer();clearInterval(this.pullMsgHearbeat);this.pullMsgHearbeat = 0;};Client.prototype.publishMessage = function (_topic, _data, _targetId, _callback, _msg) {var msgId = RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);if (!msgId) {return;}var msg = new RongIMLib.PublishMessage(_topic, _data, _targetId);msg.setMessageId(msgId);if (_callback) {msg.setQos(Qos.AT_LEAST_ONCE);this.handler.putCallback(new RongIMLib.PublishCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), _msg);} else {msg.setQos(Qos.AT_MOST_ONCE);}this.channel.writeAndFlush(msg);};Client.prototype.queryMessage = function (_topic, _data, _targetId, _qos, _callback, pbtype) {if (_topic == "userInf") {if (Client.userInfoMapping[_targetId]) {_callback.onSuccess(Client.userInfoMapping[_targetId]);return;}}var msgId = RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);if (!msgId) {return;}var msg = new RongIMLib.QueryMessage(_topic, _data, _targetId);msg.setMessageId(msgId);msg.setQos(_qos);this.handler.putCallback(new RongIMLib.QueryCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), pbtype);this.channel.writeAndFlush(msg);};Client.prototype.invoke = function (isPullMsg, chrmId, offlineMsg) {var time,modules,str,me = this,target,temp = this.SyncTimeQueue.shift();if (temp == undefined) {return;}this.SyncTimeQueue.state = "pending";var localSyncTime = RongIMLib.SyncTimeUtil.get();var sentBoxTime = localSyncTime.sent;var isPullChatroom = temp.type === 2;if (temp.type != 2) {time = localSyncTime.received;modules = new RongIMLib.RongIMClient.Protobuf.SyncRequestMsg();modules.setIspolling(false);str = "pullMsg";target = this.userId;modules.setSendBoxSyncTime(sentBoxTime);} else {target = temp.chrmId || me.chatroomId;time = RongIMLib.RongIMClient._memoryStore.lastReadTime.get(target + Bridge._client.userId + "CST") || 0;modules = new RongIMLib.RongIMClient.Protobuf.ChrmPullMsg();modules.setCount(0);str = "chrmPull";if (!target) {throw new Error("syncTime:Received messages of chatroom but was not init");}}if (temp.pulltime <= time) {this.SyncTimeQueue.state = "complete";this.invoke(isPullMsg, target, offlineMsg);return;}if (isPullMsg && "setIsPullSend" in modules) {modules.setIsPullSend(true);}modules.setSyncTime(time);this.queryMessage(str, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), target, Qos.AT_LEAST_ONCE, { onSuccess: function onSuccess(collection) {var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime),symbol = target;
                var isChrmPull = str == "chrmPull";if (isChrmPull) {symbol += Bridge._client.userId + "CST";RongIMLib.RongIMClient._memoryStore.lastReadTime.set(symbol, sync);} else {var storage = RongIMLib.RongIMClient._storageProvider;if (sync > storage.getItem(symbol)) {storage.setItem(symbol, sync);}}var list = collection.list;var isPullFinished = collection.finished;if (isChrmPull) {isPullFinished = true;}if (typeof isPullFinished == "undefined") {isPullFinished = true;}RongIMLib.RongIMClient._memoryStore.isPullFinished = isPullFinished;var connectAckTime = RongIMLib.RongIMClient._memoryStore.connectAckTime;var len = list.length;for (var i = 0, count = len; i < len; i++) {count -= 1;var message = list[i];var sentTime = RongIMLib.MessageUtil.int64ToTimestamp(message.dataTime);var isSender = message.direction == RongIMLib.MessageDirection.SEND;var compareTime = isSender ? sentBoxTime : time;if (sentTime > compareTime || isPullChatroom) {var isSyncMessage = false;var isOffLineMessage = sentTime < connectAckTime;Bridge._client.handler.onReceived(message, undefined, isOffLineMessage, count, isSyncMessage, isPullFinished);}}if (len <= 200 && str == "pullMsg") {var Conversation = RongIMLib.RongIMClient._dataAccessProvider.Conversation;var conversationList = RongIMLib.RongIMClient._memoryStore.conversationList;Conversation._notify(conversationList);}me.SyncTimeQueue.state = "complete";me.invoke(isPullMsg, target, offlineMsg);}, onError: function onError(error) {me.SyncTimeQueue.state = "complete";me.invoke(isPullMsg, target, offlineMsg);} }, "DownStreamMessages");};Client.prototype.syncTime = function (_type, pullTime, chrmId, offlineMsg) {this.SyncTimeQueue.push({ type: _type, pulltime: pullTime, chrmId: chrmId });if (this.SyncTimeQueue.length == 1 && this.SyncTimeQueue.state == "complete") {this.invoke(!_type, chrmId, offlineMsg);}};Client.prototype.__init = function (f) {this.handler = new MessageHandler(this);this.handler.setConnectCallback(RongIMLib.RongIMClient._memoryStore.callback);this.channel = new Channel(f, this);};Client.userInfoMapping = {};return Client;}();RongIMLib.Client = Client;var Bridge = function () {function Bridge() {}Bridge.getInstance = function () {return new Bridge();};Bridge.prototype.connect = function (appKey, token, callback) {if (!RongIMLib.RongIMClient.Protobuf) {return;}Bridge._client = new RongIMLib.Navigation().connect(appKey, token, callback);return Bridge._client;};Bridge.prototype.setListener = function () {Channel._ConnectionStatusListener = { onChanged: function onChanged(status) {RongIMLib.RongUtil.forEach(RongIMLib.RongIMClient.statusListeners, function (watch) {RongIMLib.RongUtil.isFunction(watch) && watch(status);});} };Channel._ReceiveMessageListener = { onReceived: function onReceived(msg, count, hasMore) {RongIMLib.RongUtil.forEach(RongIMLib.RongIMClient.messageListeners, function (watch) {RongIMLib.RongUtil.isFunction(watch) && watch(msg, count, hasMore);});} };};Bridge.prototype.reconnect = function (callabck) {Bridge._client.channel.reconnect(callabck);};Bridge.prototype.disconnect = function () {Bridge._client.channel.disconnect(2);};Bridge.prototype.queryMsg = function (topic, content, targetId, callback, pbname) {if (typeof topic != "string") {topic = _topic[topic];}Bridge._client.queryMessage(topic, content, targetId, Qos.AT_MOST_ONCE, callback, pbname);};Bridge.prototype.pubMsg = function (topic, content, targetId, callback, msg, methodType) {if (typeof methodType == "number") {if (methodType == RongIMLib.MethodType.CUSTOMER_SERVICE) {Bridge._client.publishMessage("pcuMsgP", content, targetId, callback, msg);} else {if (methodType == RongIMLib.MethodType.RECALL) {Bridge._client.publishMessage("recallMsg", content, targetId, callback, msg);}}} else {Bridge._client.publishMessage(_topic[10][topic], content, targetId, callback, msg);}};return Bridge;}();RongIMLib.Bridge = Bridge;var MessageHandler = function () {function MessageHandler(client) {this.map = {};this.connectCallback = null;if (!Channel._ReceiveMessageListener) {throw new Error("please set onReceiveMessageListener");}this._onReceived = Channel._ReceiveMessageListener.onReceived;this._client = client;this.syncMsgMap = new Object();}MessageHandler.prototype.putCallback = function (callbackObj, _publishMessageId, _msg) {var item = { Callback: callbackObj, Message: _msg };item.Callback.resumeTimer();this.map[_publishMessageId] = item;};MessageHandler.prototype.setConnectCallback = function (_connectCallback) {if (_connectCallback) {this.connectCallback = new RongIMLib.ConnectAck(_connectCallback.onSuccess, _connectCallback.onError, this._client);}};MessageHandler.prototype.handleChrmKVPullMsg = function (msg) {try {var pbtype = "ChrmNotifyMsg";var data = RongIMLib.CallbackMapping.getInstance().mapping(RongIMLib.RongIMClient.Protobuf[pbtype].decode(msg.data), pbtype);if (data.type === 2) {var timestamp = RongIMLib.MessageUtil.int64ToTimestamp(data.time);RongIMLib.ChrmKVHandler.pull(data.chrmId, timestamp);}} catch (e) {}};MessageHandler.prototype.onReceived = function (msg, pubAckItem, offlineMsg, leftCount, isSync) {var entity,message,con,isStraightMsg = false;if (msg._name != "PublishMessage") {entity = msg;RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId, RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime));} else {if (msg.getTopic() == "s_ntf") {entity = RongIMLib.RongIMClient.Protobuf.NotifyMsg.decode(msg.getData());
                this._client.syncTime(entity.type, RongIMLib.MessageUtil.int64ToTimestamp(entity.time), entity.chrmId);return;} else {if (msg.getTopic() == "s_msg") {isStraightMsg = true;entity = RongIMLib.RongIMClient.Protobuf.DownStreamMessage.decode(msg.getData());var timestamp = RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime);RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId, timestamp);RongIMLib.RongIMClient._memoryStore.lastReadTime.get(this._client.userId, timestamp);} else {if (msg.getTopic() == "s_stat") {entity = RongIMLib.RongIMClient.Protobuf.GetUserStatusOutput.decode(msg.getData());entity = RongIMLib.RongInnerTools.convertUserStatus(entity);RongIMLib.RongIMClient.userStatusObserver.notify({ key: entity.userId, entity: entity });return;} else {if (msg.getTopic() === "s_cmd") {this.handleChrmKVPullMsg(msg);return;} else {if (Bridge._client.sdkVer && Bridge._client.sdkVer == "1.0.0") {return;}entity = RongIMLib.RongIMClient.Protobuf.UpStreamMessage.decode(msg.getData());var tmpTopic = msg.getTopic();var tmpType = tmpTopic.substr(0, 2);if (tmpType == "pp") {entity.type = 1;} else {if (tmpType == "pd") {entity.type = 2;} else {if (tmpType == "pg") {entity.type = 3;} else {if (tmpType == "ch") {entity.type = 4;} else {if (tmpType == "pc") {entity.type = 5;}}}}}entity.groupId = msg.getTargetId();entity.fromUserId = this._client.userId;entity.dataTime = Date.parse(new Date().toString());}}}}if (!entity) {return;}}var isPullFinished = RongIMLib.RongIMClient._memoryStore.isPullFinished;if (!isPullFinished && !offlineMsg && isStraightMsg) {return;}message = RongIMLib.MessageUtil.messageParser(entity, this._onReceived, offlineMsg);var isRTCMessage = message.conversationType == 12;if (isRTCMessage) {RongIMLib.RongIMClient.RTCListener(message);RongIMLib.RongIMClient.RTCInnerListener(message);RongIMLib.RongIMClient.RTCSignalLisener(message);return;}var isRecall = msg.getTopic && msg.getTopic() == "recallMsg";if (isRecall) {var content = message.content;message.conversationType = content.conversationType;message.targetId = content.targetId;message.messageId = null;}if (pubAckItem) {message.messageUId = pubAckItem.getMessageUId();message.sentTime = pubAckItem.getTimestamp();RongIMLib.RongIMClient._storageProvider.setItem(this._client.userId, message.sentTime);}if (message === null) {return;}var isChatroomMessage = message.conversationType == RongIMLib.ConversationType.CHATROOM;if (!isChatroomMessage) {var msgTag = RongIMLib.RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag();if (msgTag >= 0) {RongIMLib.SyncTimeUtil.set(message);}var isSend = message.messageDirection == RongIMLib.MessageDirection.SEND;if (isSend) {var storageProvider = RongIMLib.RongIMClient._storageProvider;var userId = RongIMLib.Bridge._client.userId;var lastSentTime = storageProvider.getItem("last_sentTime_" + userId) || 0;if (message.sentTime <= lastSentTime && !isSync) {return;}}}var msgTag = RongIMLib.RongIMClient.MessageParams[message.messageType].msgTag.getMessageTag();var isPersited = msgTag === 3 || msgTag === 2;if (isPersited) {con = RongIMLib.RongIMClient._dataAccessProvider.getConversation(message.conversationType, message.targetId, { onSuccess: function onSuccess() {}, onError: function onError() {} });if (!con) {con = RongIMLib.RongIMClient.getInstance().createConversation(message.conversationType, message.targetId, "");}if (message.messageDirection == RongIMLib.MessageDirection.RECEIVE && (entity.status & 64) == 64) {var mentioneds = RongIMLib.RongIMClient._storageProvider.getItem("mentioneds_" + Bridge._client.userId + "_" + message.conversationType + "_" + message.targetId);var key = message.conversationType + "_" + message.targetId,info = {};if (message.content && message.content.mentionedInfo) {info[key] = { uid: message.messageUId, time: message.sentTime, mentionedInfo: message.content.mentionedInfo };RongIMLib.RongIMClient._storageProvider.setItem("mentioneds_" + Bridge._client.userId + "_" + message.conversationType + "_" + message.targetId, JSON.stringify(info));mentioneds = JSON.stringify(info);}if (mentioneds) {var info = JSON.parse(mentioneds);con.mentionedMsg = info[key];}}var isReceiver = message.messageDirection == RongIMLib.MessageDirection.RECEIVE;if (isReceiver && message.senderUserId != Bridge._client.userId) {con.unreadMessageCount = con.unreadMessageCount + 1;if (RongIMLib.RongUtil.supportLocalStorage()) {var newUnreadCount = RongIMLib.UnreadCountHandler.add(con.conversationType, message.targetId, 1, message.sentTime);con.unreadMessageCount = newUnreadCount;}}con.receivedTime = new Date().getTime();con.receivedStatus = message.receivedStatus;con.senderUserId = message.sendUserId;con.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;con.latestMessageId = message.messageId;con.latestMessage = message;con.sentTime = message.sentTime;RongIMLib.RongIMClient._dataAccessProvider.addConversation(con, { onSuccess: function onSuccess(data) {if (!offlineMsg) {var Conversation_1 = RongIMLib.RongIMClient._dataAccessProvider.Conversation;var conversationList = RongIMLib.RongIMClient._memoryStore.conversationList;Conversation_1._notify(conversationList);}}, onError: function onError() {} });}if (message.conversationType == RongIMLib.ConversationType.CUSTOMER_SERVICE && (message.messageType == "ChangeModeResponseMessage" || message.messageType == "SuspendMessage" || message.messageType == "HandShakeResponseMessage" || message.messageType == "TerminateMessage" || message.messageType == "CustomerStatusUpdateMessage" || message.messageType == "TextMessage" || message.messageType == "InformationNotificationMessage")) {if (!RongIMLib.RongIMClient._memoryStore.custStore["isInit"]) {return;
              }}if (message.conversationType == RongIMLib.ConversationType.CUSTOMER_SERVICE && message.messageType != "HandShakeResponseMessage") {if (!RongIMLib.RongIMClient._memoryStore.custStore[message.targetId]) {return;}if (message.messageType == "TerminateMessage") {if (RongIMLib.RongIMClient._memoryStore.custStore[message.targetId].sid != message.content.sid) {return;}}}if (message.messageType === RongIMLib.RongIMClient.MessageType["HandShakeResponseMessage"]) {var session = message.content.data;RongIMLib.RongIMClient._memoryStore.custStore[message.targetId] = session;if (session.serviceType == RongIMLib.CustomerType.ONLY_HUMAN || session.serviceType == RongIMLib.CustomerType.HUMAN_FIRST) {if (session.notAutoCha == "1") {RongIMLib.RongIMClient.getInstance().switchToHumanMode(message.targetId, { onSuccess: function onSuccess() {}, onError: function onError() {} });}}}var d = new Date(),m = d.getMonth() + 1,date = d.getFullYear() + "/" + (m.toString().length == 1 ? "0" + m : m) + "/" + d.getDate();var dealtime = new Date(date).getTime() - message.sentTime < 0;if (RongIMLib.RongUtil.supportLocalStorage() && message.messageType === RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime && message.messageDirection == RongIMLib.MessageDirection.SEND) {var sentkey = Bridge._client.userId + message.content.messageUId + "SENT";RongIMLib.RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: message.sentTime, userIds: {} }));} else {if (RongIMLib.RongUtil.supportLocalStorage() && message.messageType === RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"] && dealtime) {var reckey = Bridge._client.userId + message.conversationType + message.targetId + "RECEIVED",recData = JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(reckey));if (recData) {if (message.senderUserId in recData) {if (recData[message.senderUserId].uIds && recData[message.senderUserId].uIds && recData[message.senderUserId].uIds.indexOf(message.content.messageUId) == -1) {recData[message.senderUserId].uIds.push(message.content.messageUId);recData[message.senderUserId].dealtime = message.sentTime;recData[message.senderUserId].isResponse = false;RongIMLib.RongIMClient._storageProvider.setItem(reckey, JSON.stringify(recData));} else {return;}} else {var objSon = { uIds: [message.content.messageUId], dealtime: message.sentTime, isResponse: false };recData[message.senderUserId] = objSon;RongIMLib.RongIMClient._storageProvider.setItem(reckey, JSON.stringify(recData));}} else {var obj = {};obj[message.senderUserId] = { uIds: [message.content.messageUId], dealtime: message.sentTime, isResponse: false };RongIMLib.RongIMClient._storageProvider.setItem(reckey, JSON.stringify(obj));}}}if (RongIMLib.RongUtil.supportLocalStorage() && message.messageType === RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"] && dealtime) {var receiptResponseMsg = message.content,uIds = receiptResponseMsg.receiptMessageDic[Bridge._client.userId],sentkey = "",sentObj;message.receiptResponse || (message.receiptResponse = {});if (uIds) {var cbuIds = [];for (var i = 0, len = uIds.length; i < len; i++) {sentkey = Bridge._client.userId + uIds[i] + "SENT";sentObj = JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(sentkey));if (sentObj && !(message.senderUserId in sentObj.userIds)) {cbuIds.push(uIds[i]);sentObj.count += 1;sentObj.userIds[message.senderUserId] = message.sentTime;message.receiptResponse[uIds[i]] = sentObj.count;RongIMLib.RongIMClient._storageProvider.setItem(sentkey, JSON.stringify(sentObj));}}receiptResponseMsg.receiptMessageDic[Bridge._client.userId] = cbuIds;message.content = receiptResponseMsg;}}var that = this;if (RongIMLib.RongIMClient._voipProvider && ["AcceptMessage", "RingingMessage", "HungupMessage", "InviteMessage", "MediaModifyMessage", "MemberModifyMessage"].indexOf(message.messageType) > -1) {setTimeout(function () {RongIMLib.RongIMClient._voipProvider.onReceived(message);});} else {var count = leftCount || 0;var hasMore = !isPullFinished;that._onReceived(message, count, hasMore);}};MessageHandler.prototype.handleMessage = function (msg) {if (!msg) {return;}switch (msg._name) {case "ConnAckMessage":Bridge._client.handler.connectCallback.process(msg.getStatus(), msg.getUserId(), msg.getTimestamp());break;case "PublishMessage":if (!msg.getSyncMsg() && msg.getQos() != 0) {Bridge._client.channel.writeAndFlush(new RongIMLib.PubAckMessage(msg.getMessageId()));}if (msg.getSyncMsg() && !RongIMLib.RongIMClient._memoryStore.depend.isPolling) {Bridge._client.handler.syncMsgMap[msg.getMessageId()] = msg;} else {Bridge._client.handler.onReceived(msg);}break;case "QueryAckMessage":if (msg.getQos() != 0) {Bridge._client.channel.writeAndFlush(new RongIMLib.QueryConMessage(msg.getMessageId()));}var temp = Bridge._client.handler.map[msg.getMessageId()];if (temp) {temp.Callback.process(msg.getStatus(), msg.getData(), msg.getDate(), temp.Message);delete Bridge._client.handler.map[msg.getMessageId()];}break;case "PubAckMessage":var item = Bridge._client.handler.map[msg.getMessageId()];if (item) {item.Callback.process(msg.getStatus() || 0, msg.getMessageUId(), msg.getTimestamp(), item.Message, msg.getMessageId());delete Bridge._client.handler.map[msg.getMessageId()];} else {var userId = RongIMLib.Bridge._client.userId;
                  RongIMLib.RongIMClient._storageProvider.setItem("last_sentTime_" + userId, msg.timestamp);Bridge._client.handler.onReceived(Bridge._client.handler.syncMsgMap[msg.messageId], msg, null, null, true);delete Bridge._client.handler.syncMsgMap[msg.getMessageId()];}break;case "PingRespMessage":if (RongIMLib.RongIMClient._memoryStore.isFirstPingMsg) {RongIMLib.RongIMClient._memoryStore.isFirstPingMsg = false;} else {Bridge._client.pauseTimer();}break;case "DisconnectMessage":Bridge._client.channel.disconnect(msg.getStatus());break;default:}};return MessageHandler;}();RongIMLib.MessageHandler = MessageHandler;})(RongIMLib || (RongIMLib = {}));var __extends = _this && _this.__extends || function (d, b) {for (var p in b) {if (b.hasOwnProperty(p)) {d[p] = b[p];}}function __() {this.constructor = d;}d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());};var RongIMLib;(function (RongIMLib) {var MessageCallback = function () {function MessageCallback(error) {this.timeout = null;this.onError = null;if (error && typeof error == "number") {this.timeoutMillis = error;} else {this.timeoutMillis = 30000;this.onError = error;}}MessageCallback.prototype.resumeTimer = function () {var me = this;if (this.timeoutMillis > 0 && !this.timeout) {this.timeout = setTimeout(function () {me.readTimeOut(true);}, this.timeoutMillis);}};MessageCallback.prototype.pauseTimer = function () {if (this.timeout) {clearTimeout(this.timeout);this.timeout = null;}};MessageCallback.prototype.readTimeOut = function (isTimeout) {if (isTimeout && this.onError) {this.onError(RongIMLib.ErrorCode.TIMEOUT);} else {this.pauseTimer();}};return MessageCallback;}();RongIMLib.MessageCallback = MessageCallback;var CallbackMapping = function () {function CallbackMapping() {this.publicServiceList = [];}CallbackMapping.getInstance = function () {return new CallbackMapping();};CallbackMapping.prototype.pottingProfile = function (item) {var temp;this.profile = new RongIMLib.PublicServiceProfile();temp = JSON.parse(item.extra);this.profile.isGlobal = temp.isGlobal;this.profile.introduction = temp.introduction;this.profile.menu = temp.menu;this.profile.hasFollowed = temp.follow;this.profile.publicServiceId = item.mpid;this.profile.name = item.name;this.profile.portraitUri = item.portraitUrl;this.profile.conversationType = item.type == "mc" ? RongIMLib.ConversationType.APP_PUBLIC_SERVICE : RongIMLib.ConversationType.PUBLIC_SERVICE;this.publicServiceList.push(this.profile);};CallbackMapping.prototype.mapping = function (entity, tag) {switch (tag) {case "GetUserInfoOutput":var userInfo = new RongIMLib.UserInfo(entity.userId, entity.userName, entity.userPortrait);return userInfo;case "GetQNupTokenOutput":return { deadline: RongIMLib.MessageUtil.int64ToTimestamp(entity.deadline), token: entity.token };case "GetQNdownloadUrlOutput":return { downloadUrl: entity.downloadUrl };case "CreateDiscussionOutput":return entity.id;case "ChannelInfoOutput":var disInfo = new RongIMLib.Discussion();disInfo.creatorId = entity.adminUserId;disInfo.id = entity.channelId;disInfo.memberIdList = entity.firstTenUserIds;disInfo.name = entity.channelName;disInfo.isOpen = entity.openStatus;return disInfo;case "GroupHashOutput":return entity.result;case "QueryBlackListOutput":return entity.userIds;case "SearchMpOutput":case "PullMpOutput":if (entity.info) {var self = this;Array.forEach(entity.info, function (item) {setTimeout(function () {self.pottingProfile(item);}, 100);});}return this.publicServiceList;default:return entity;}};return CallbackMapping;}();RongIMLib.CallbackMapping = CallbackMapping;var PublishCallback = function (_super) {__extends(PublishCallback, _super);function PublishCallback(_cb, _timeout) {_super.call(this, _timeout);this._cb = _cb;this._timeout = _timeout;}PublishCallback.prototype.process = function (_status, messageUId, timestamp, _msg, messageId) {this.readTimeOut();if (_status == 0) {if (_msg) {_msg.setSentStatus = _status;}var isPullFinished = RongIMLib.RongIMClient._memoryStore.isPullFinished;if (isPullFinished) {var userId = RongIMLib.Bridge._client.userId;var stroageProvider = RongIMLib.RongIMClient._storageProvider;stroageProvider.setItem("last_sentTime_" + userId, timestamp);RongIMLib.SyncTimeUtil.set({ messageDirection: RongIMLib.MessageDirection.SEND, sentTime: timestamp });}this._cb({ messageUId: messageUId, timestamp: timestamp, messageId: messageId });} else {this._timeout(_status, { messageUId: messageUId, sentTime: timestamp });}};PublishCallback.prototype.readTimeOut = function (x) {MessageCallback.prototype.readTimeOut.call(this, x);};return PublishCallback;}(MessageCallback);RongIMLib.PublishCallback = PublishCallback;var QueryCallback = function (_super) {__extends(QueryCallback, _super);function QueryCallback(_cb, _timeout) {_super.call(this, _timeout);this._cb = _cb;this._timeout = _timeout;}QueryCallback.prototype.process = function (status, data, serverTime, pbtype) {this.readTimeOut();if (pbtype && data && status == 0) {try {data = CallbackMapping.getInstance().mapping(RongIMLib.RongIMClient.Protobuf[pbtype].decode(data), pbtype);} catch (e) {this._timeout(RongIMLib.ErrorCode.UNKNOWN);return;}if ("GetUserInfoOutput" == pbtype) {RongIMLib.Client.userInfoMapping[data.userId] = data;}this._cb(data);} else {status > 0 ? this._timeout(status) : this._cb(status);}};QueryCallback.prototype.readTimeOut = function (x) {MessageCallback.prototype.readTimeOut.call(this, x);
          };return QueryCallback;}(MessageCallback);RongIMLib.QueryCallback = QueryCallback;var ConnectAck = function (_super) {__extends(ConnectAck, _super);function ConnectAck(_cb, _timeout, client) {_super.call(this, _timeout);this._client = client;this._cb = _cb;this._timeout = _timeout;}ConnectAck.prototype.process = function (status, userId, timestamp) {this.readTimeOut();if (status == 0) {this._client.userId = userId;var self = this;if (!RongIMLib.RongIMClient._memoryStore.depend.isPolling && RongIMLib.RongIMClient._memoryStore.isFirstPingMsg) {RongIMLib.Bridge._client.checkSocket({ onSuccess: function onSuccess() {if (!RongIMLib.RongIMClient.isNotPullMsg) {self._client.syncTime(undefined, undefined, undefined, true);}}, onError: function onError() {RongIMLib.RongIMClient._memoryStore.isFirstPingMsg = false;RongIMLib.RongIMClient.getInstance().disconnect();RongIMLib.RongIMClient.connect(RongIMLib.RongIMClient._memoryStore.token, RongIMLib.RongIMClient._memoryStore.callback);} });} else {if (!RongIMLib.RongIMClient.isNotPullMsg) {self._client.syncTime(undefined, undefined, undefined, true);}}RongIMLib.Bridge._client.channel.socket.fire("StatusChanged", 0);if (this._client.reconnectObj.onSuccess) {this._client.reconnectObj.onSuccess(userId);delete this._client.reconnectObj.onSuccess;} else {var me = this;me._cb(userId);var depend = RongIMLib.RongIMClient._memoryStore.depend;var maxConversationCount = depend.maxConversationCount;var isNotifyConversationList = depend.isNotifyConversationList;isNotifyConversationList && RongIMLib.RongIMClient._dataAccessProvider.getRemoteConversationList({ onSuccess: function onSuccess(conversationList) {var Conversation = RongIMLib.RongIMClient._dataAccessProvider.Conversation;Conversation._notify(conversationList);}, onError: function onError(code) {console.log("内部获取列表失败: %d", code);} }, null, maxConversationCount);}RongIMLib.RongIMClient._memoryStore.connectAckTime = timestamp;if (!(new Date().getTime() - timestamp)) {RongIMLib.RongIMClient._memoryStore.deltaTime = 0;} else {RongIMLib.RongIMClient._memoryStore.deltaTime = new Date().getTime() - timestamp;}} else {if (status == 6) {RongIMLib.RongIMClient.getInstance().disconnect();var me = this;var _client = me._client;var appId = _client.appId,token = _client.token;new RongIMLib.Navigation().requestNavi(token, appId, function () {_client.clearHeartbeat();var newClient = new RongIMLib.Client(token, appId);RongIMLib.Bridge._client = newClient;newClient.__init(function () {RongIMLib.Transportations._TransportType == "websocket" && newClient.keepLive();});}, me._timeout, false);} else {RongIMLib.Bridge._client.channel.socket.socket._status = status;if (this._client.reconnectObj.onError) {this._client.reconnectObj.onError(status);delete this._client.reconnectObj.onError;} else {this._timeout(status);}}}};ConnectAck.prototype.readTimeOut = function (x) {MessageCallback.prototype.readTimeOut.call(this, x);};return ConnectAck;}(MessageCallback);RongIMLib.ConnectAck = ConnectAck;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var Navigation = function () {function Navigation() {}Navigation.clear = function () {var storage = RongIMLib.RongIMClient._storageProvider;storage.removeItem("rc_uid");storage.removeItem("serverIndex");storage.removeItem("rongSDK");};Navigation.prototype.getNaviSuccess = function (result) {var storage = RongIMLib.RongIMClient._storageProvider;storage.setItem("fullnavi", JSON.stringify(result));var server = result.server;if (server) {server += ",";}var backupServer = result.backupServer || "";var tpl = "{server}{backupServer}";var servers = RongIMLib.RongUtil.tplEngine(tpl, { server: server, backupServer: backupServer });servers = servers.split(",");storage.setItem("servers", JSON.stringify(servers));var token = RongIMLib.RongIMClient._memoryStore.token;var uid = RongIMLib.InnerUtil.getUId(token);storage.setItem("rc_uid", uid);var userId = result.userId;storage.setItem("current_user", userId);if (result.voipCallInfo) {var callInfo = JSON.parse(result.voipCallInfo);RongIMLib.RongIMClient._memoryStore.voipStategy = callInfo.strategy;storage.setItem("voipStrategy", callInfo.strategy);}var openMp = result.openMp;storage.setItem("openMp" + uid, openMp);RongIMLib.RongIMClient._memoryStore.depend.openMp = openMp;};Navigation.prototype.connect = function (appId, token, callback) {var oldAppId = RongIMLib.RongIMClient._storageProvider.getItem("appId");if (oldAppId && oldAppId != appId) {RongIMLib.RongIMClient._storageProvider.clearItem();RongIMLib.RongIMClient._storageProvider.setItem("appId", appId);}if (!oldAppId) {RongIMLib.RongIMClient._storageProvider.setItem("appId", appId);}var client = new RongIMLib.Client(token, appId);this.requestNavi(token, appId, function () {client.connect(callback);}, callback.onError, true);return client;};Navigation.prototype.requestNavi = function (token, appId, _onsuccess, _onerror, unignore) {if (unignore) {var uId = md5(token).slice(8, 16);var storage = RongIMLib.RongIMClient._storageProvider;var transportType = storage.getItem("rongSDK");var isSameType = RongIMLib.Transportations._TransportType == transportType;var _old = storage.getItem("rc_uid");var isSameUser = _old == uId;var servers = storage.getItem("servers");var hasServers = typeof servers == "string";if (isSameUser && isSameType && hasServers && RongIMLib.RongUtil.hasValidWsUrl(servers)) {RongIMLib.RongIMClient._memoryStore.voipStategy = storage.getItem("voipStrategy");
                var openMp = storage.getItem("openMp" + uId);RongIMLib.RongIMClient._memoryStore.depend.openMp = openMp;_onsuccess();return;}}Navigation.clear();RongIMLib.RongIMClient.invalidWsUrls = [];var context = this;var StatusEvent = RongIMLib.Channel._ConnectionStatusListener;var depend = RongIMLib.RongIMClient._memoryStore.depend;var navigaters = depend.navigaters;var naviTimeout = depend.naviTimeout;var maxNaviRetry = depend.maxNaviRetry;var isNaviJSONP = depend.isNaviJSONP;var isSupportRequestHeaders = RongIMLib.RongUtil.isSupportRequestHeaders();var isRequestJSONP = !isSupportRequestHeaders || isNaviJSONP;var requestFunc = isRequestJSONP ? context.requestJSONP : context.request;var timer = new RongIMLib.Timer({ timeout: naviTimeout });var internalRetry = 1;var isRange = function isRange() {return internalRetry >= maxNaviRetry;};var indexTools = new RongIMLib.IndexTools({ items: navigaters, onwheel: function onwheel() {internalRetry += 1;} });var consume = function consume() {if (isRange()) {_onerror(RongIMLib.ConnectionStatus.RESPONSE_NAVI_ERROR);return;}var index = indexTools.get();var navi = navigaters[index];indexTools.add();var success = function success(result) {timer.pause();StatusEvent.onChanged(RongIMLib.ConnectionStatus.RESPONSE_NAVI);var code = result.code;if (RongIMLib.RongUtil.isEqual(code, 200)) {context.getNaviSuccess(result);_onsuccess();}if (RongIMLib.RongUtil.isEqual(code, 401)) {_onerror(RongIMLib.ConnectionState.TOKEN_INCORRECT);}if (RongIMLib.RongUtil.isEqual(code, 403)) {StatusEvent.onChanged(RongIMLib.ConnectionStatus.APPKEY_IS_FAKE);}};var error = function error(status) {if (RongIMLib.RongUtil.isEqual(status, 0)) {return;}timer.pause();StatusEvent.onChanged(RongIMLib.ConnectionStatus.RESPONSE_NAVI_ERROR);consume();};StatusEvent.onChanged(RongIMLib.ConnectionStatus.REQUEST_NAVI);var xhr = requestFunc.call(context, navi, appId, token, success, error);timer.resume(function () {StatusEvent.onChanged(RongIMLib.ConnectionStatus.RESPONSE_NAVI_TIMEOUT);xhr.abort();consume();});};consume();};Navigation.prototype.getPath = function (navi, appId, token, callbackName) {var depend = RongIMLib.RongIMClient._memoryStore.depend;var path = depend.isPolling ? "cometnavi" : "navi";token = encodeURIComponent(token);var sdkver = RongIMLib.RongIMClient.sdkver;var random = RongIMLib.RongUtil.getTimestamp();var tpl = "{navi}/{path}.js?appId={appId}&token={token}&callBack={callback}&v={sdkver}&r={random}";var url = RongIMLib.RongUtil.tplEngine(tpl, { navi: navi, path: path, appId: appId, token: token, sdkver: sdkver, random: random, callback: callbackName });return url;};Navigation.prototype.request = function (navi, appId, token, _success, _error) {var url = this.getPath(navi, appId, token, "getServerEndpoint");return RongIMLib.RongUtil.request({ url: url, success: function success(result) {result = result.replace("getServerEndpoint(", "").replace(");", "");var lastIndex = result.lastIndexOf(")");var maxIndex = result.length - 1;if (lastIndex == maxIndex) {result = result.substr(0, lastIndex);}_success(JSON.parse(result));}, error: function error(status, result) {if (status == 401 || status == 403) {_success(JSON.parse(result));} else {_error(status);}} });};Navigation.prototype.requestJSONP = function (navi, appId, token, success, error) {var callbackName = "getServerEndpoint";window.getServerEndpoint = function (result) {var code = result.code;if (code !== 200) {return error(RongIMLib.ConnectionState.TOKEN_INCORRECT);}success(result);};var url = this.getPath(navi, appId, token, callbackName);var xss = document.createElement("script");xss.src = url;document.body.appendChild(xss);xss.onerror = function () {error(RongIMLib.ConnectionState.TOKEN_INCORRECT);};};Navigation.Endpoint = new Object();return Navigation;}();RongIMLib.Navigation = Navigation;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var BaseMessage = function () {function BaseMessage(arg) {this._name = "BaseMessage";this.lengthSize = 0;if (arg instanceof RongIMLib.Header) {this._header = arg;} else {this._header = new RongIMLib.Header(arg, false, RongIMLib.Qos.AT_MOST_ONCE, false);}}BaseMessage.prototype.read = function (In, length) {this.readMessage(In, length);};BaseMessage.prototype.write = function (Out) {var binaryHelper = new RongIMLib.BinaryHelper();var out = binaryHelper.convertStream(Out);this._headerCode = this.getHeaderFlag();out.write(this._headerCode);this.writeMessage(out);return out;};BaseMessage.prototype.getHeaderFlag = function () {return this._header.encode();};BaseMessage.prototype.getLengthSize = function () {return this.lengthSize;};BaseMessage.prototype.toBytes = function () {return this.write([]).getBytesArray();};BaseMessage.prototype.isRetained = function () {return this._header.retain;};BaseMessage.prototype.setRetained = function (retain) {this._header.retain = retain;};BaseMessage.prototype.setQos = function (qos) {this._header.qos = Object.prototype.toString.call(qos) == "[object Object]" ? qos : RongIMLib.Qos[qos];};BaseMessage.prototype.setDup = function (dup) {this._header.dup = dup;};BaseMessage.prototype.isDup = function () {return this._header.dup;};BaseMessage.prototype.getType = function () {return this._header.type;};BaseMessage.prototype.getQos = function () {return this._header.qos;};BaseMessage.prototype.messageLength = function () {return 0;
          };BaseMessage.prototype.writeMessage = function (out) {};BaseMessage.prototype.readMessage = function (In, length) {};BaseMessage.prototype.init = function (args) {var valName,nana,me = this;for (nana in args) {if (!args.hasOwnProperty(nana)) {continue;}valName = nana.replace(/^\w/, function (x) {var tt = x.charCodeAt(0);return "set" + (tt >= 97 ? String.fromCharCode(tt & ~32) : x);});if (valName in me) {if (nana == "status") {me[valName](disconnectStatus[args[nana]] ? disconnectStatus[args[nana]] : args[nana]);} else {me[valName](args[nana]);}}}};return BaseMessage;}();RongIMLib.BaseMessage = BaseMessage;var ConnectMessage = function (_super) {__extends(ConnectMessage, _super);function ConnectMessage(header) {_super.call(this, arguments.length == 0 || arguments.length == 3 ? RongIMLib.Type.CONNECT : arguments[0]);this._name = "ConnectMessage";this.CONNECT_HEADER_SIZE = 12;this.protocolId = "RCloud";this.binaryHelper = new RongIMLib.BinaryHelper();this.protocolVersion = 3;switch (arguments.length) {case 0:case 1:case 3:if (!arguments[0] || arguments[0].length > 64) {throw new Error("ConnectMessage:Client Id cannot be null and must be at most 64 characters long: " + arguments[0]);}this.clientId = arguments[0];this.cleanSession = arguments[1];this.keepAlive = arguments[2];break;}}ConnectMessage.prototype.messageLength = function () {var payloadSize = this.binaryHelper.toMQttString(this.clientId).length;payloadSize += this.binaryHelper.toMQttString(this.willTopic).length;payloadSize += this.binaryHelper.toMQttString(this.will).length;payloadSize += this.binaryHelper.toMQttString(this.appId).length;payloadSize += this.binaryHelper.toMQttString(this.token).length;return payloadSize + this.CONNECT_HEADER_SIZE;};ConnectMessage.prototype.readMessage = function (stream) {this.protocolId = stream.readUTF();this.protocolVersion = stream.readByte();var cFlags = stream.readByte();this.hasAppId = (cFlags & 128) > 0;this.hasToken = (cFlags & 64) > 0;this.retainWill = (cFlags & 32) > 0;this.willQos = cFlags >> 3 & 3;this.hasWill = (cFlags & 4) > 0;this.cleanSession = (cFlags & 32) > 0;this.keepAlive = stream.read() * 256 + stream.read();this.clientId = stream.readUTF();if (this.hasWill) {this.willTopic = stream.readUTF();this.will = stream.readUTF();}if (this.hasAppId) {try {this.appId = stream.readUTF();} catch (ex) {throw new Error(ex);}}if (this.hasToken) {try {this.token = stream.readUTF();} catch (ex) {throw new Error(ex);}}return stream;};ConnectMessage.prototype.writeMessage = function (out) {var stream = this.binaryHelper.convertStream(out);stream.writeUTF(this.protocolId);stream.write(this.protocolVersion);var flags = this.cleanSession ? 2 : 0;flags |= this.hasWill ? 4 : 0;flags |= this.willQos ? this.willQos >> 3 : 0;flags |= this.retainWill ? 32 : 0;flags |= this.hasToken ? 64 : 0;flags |= this.hasAppId ? 128 : 0;stream.write(flags);stream.writeChar(this.keepAlive);stream.writeUTF(this.clientId);if (this.hasWill) {stream.writeUTF(this.willTopic);stream.writeUTF(this.will);}if (this.hasAppId) {stream.writeUTF(this.appId);}if (this.hasToken) {stream.writeUTF(this.token);}return stream;};return ConnectMessage;}(BaseMessage);RongIMLib.ConnectMessage = ConnectMessage;var ConnAckMessage = function (_super) {__extends(ConnAckMessage, _super);function ConnAckMessage(header) {_super.call(this, arguments.length == 0 ? RongIMLib.Type.CONNACK : arguments.length == 1 ? arguments[0] instanceof RongIMLib.Header ? arguments[0] : RongIMLib.Type.CONNACK : null);this._name = "ConnAckMessage";this.MESSAGE_LENGTH = 2;this.binaryHelper = new RongIMLib.BinaryHelper();var me = this;switch (arguments.length) {case 0:case 1:if (!(arguments[0] instanceof RongIMLib.Header)) {if (arguments[0] in RongIMLib.ConnectionState) {if (arguments[0] == null) {throw new Error("ConnAckMessage:The status of ConnAskMessage can't be null");}me.setStatus(arguments[0]);}}break;}}ConnAckMessage.prototype.messageLength = function () {var length = this.MESSAGE_LENGTH;if (this.userId) {length += this.binaryHelper.toMQttString(this.userId).length;}return length;};ConnAckMessage.prototype.readMessage = function (_in, msglength) {_in.read();var result = +_in.read();if (result >= 0 && result <= 12) {this.setStatus(result);} else {throw new Error("Unsupported CONNACK code:" + result);}if (msglength > this.MESSAGE_LENGTH) {this.setUserId(_in.readUTF());var sessionId = _in.readUTF();var timestamp = _in.readLong();this.setTimestamp(timestamp);}};ConnAckMessage.prototype.writeMessage = function (out) {var stream = this.binaryHelper.convertStream(out);stream.write(128);switch (+status) {case 0:case 1:case 2:case 5:case 6:stream.write(+status);break;case 3:case 4:stream.write(3);break;default:throw new Error("Unsupported CONNACK code:" + status);}if (this.userId) {stream.writeUTF(this.userId);}return stream;};ConnAckMessage.prototype.setStatus = function (x) {this.status = x;};ConnAckMessage.prototype.setUserId = function (_userId) {this.userId = _userId;};ConnAckMessage.prototype.getStatus = function () {return this.status;};ConnAckMessage.prototype.getUserId = function () {return this.userId;};ConnAckMessage.prototype.setTimestamp = function (x) {this.timestrap = x;};ConnAckMessage.prototype.getTimestamp = function () {return this.timestrap;};return ConnAckMessage;}(BaseMessage);RongIMLib.ConnAckMessage = ConnAckMessage;var DisconnectMessage = function (_super) {__extends(DisconnectMessage, _super);
          function DisconnectMessage(header) {_super.call(this, header instanceof RongIMLib.Header ? header : RongIMLib.Type.DISCONNECT);this._name = "DisconnectMessage";this.MESSAGE_LENGTH = 2;this.binaryHelper = new RongIMLib.BinaryHelper();if (!(header instanceof RongIMLib.Header)) {if (header in RongIMLib.ConnectionStatus) {this.status = header;}}}DisconnectMessage.prototype.messageLength = function () {return this.MESSAGE_LENGTH;};DisconnectMessage.prototype.readMessage = function (_in) {_in.read();var result = +_in.read();if (result >= 0 && result <= 5) {this.setStatus(disconnectStatus[result] ? disconnectStatus[result] : result);} else {throw new Error("Unsupported CONNACK code:" + result);}};DisconnectMessage.prototype.writeMessage = function (Out) {var out = this.binaryHelper.convertStream(Out);out.write(0);if (+status >= 1 && +status <= 3) {out.write(+status - 1);} else {throw new Error("Unsupported CONNACK code:" + status);}};DisconnectMessage.prototype.setStatus = function (x) {this.status = x;};DisconnectMessage.prototype.getStatus = function () {return this.status;};return DisconnectMessage;}(BaseMessage);RongIMLib.DisconnectMessage = DisconnectMessage;var PingReqMessage = function (_super) {__extends(PingReqMessage, _super);function PingReqMessage(header) {_super.call(this, header && header instanceof RongIMLib.Header ? header : RongIMLib.Type.PINGREQ);this._name = "PingReqMessage";}return PingReqMessage;}(BaseMessage);RongIMLib.PingReqMessage = PingReqMessage;var PingRespMessage = function (_super) {__extends(PingRespMessage, _super);function PingRespMessage(header) {_super.call(this, header && header instanceof RongIMLib.Header ? header : RongIMLib.Type.PINGRESP);this._name = "PingRespMessage";}return PingRespMessage;}(BaseMessage);RongIMLib.PingRespMessage = PingRespMessage;var RetryableMessage = function (_super) {__extends(RetryableMessage, _super);function RetryableMessage(argu) {_super.call(this, argu);this._name = "RetryableMessage";this.binaryHelper = new RongIMLib.BinaryHelper();}RetryableMessage.prototype.messageLength = function () {return 2;};RetryableMessage.prototype.writeMessage = function (Out) {var out = this.binaryHelper.convertStream(Out),Id = this.getMessageId(),lsb = Id & 255,msb = (Id & 65280) >> 8;out.write(msb);out.write(lsb);return out;};RetryableMessage.prototype.readMessage = function (_in, msgLength) {var msgId = _in.read() * 256 + _in.read();this.setMessageId(parseInt(msgId, 10));};RetryableMessage.prototype.setMessageId = function (_messageId) {this.messageId = _messageId;};RetryableMessage.prototype.getMessageId = function () {return this.messageId;};return RetryableMessage;}(BaseMessage);RongIMLib.RetryableMessage = RetryableMessage;var PubAckMessage = function (_super) {__extends(PubAckMessage, _super);function PubAckMessage(header) {_super.call(this, header instanceof RongIMLib.Header ? header : RongIMLib.Type.PUBACK);this.msgLen = 2;this.date = 0;this.millisecond = 0;this.timestamp = 0;this.binaryHelper = new RongIMLib.BinaryHelper();this._name = "PubAckMessage";if (!(header instanceof RongIMLib.Header)) {_super.prototype.setMessageId.call(this, header);}}PubAckMessage.prototype.messageLength = function () {return this.msgLen;};PubAckMessage.prototype.writeMessage = function (Out) {var out = this.binaryHelper.convertStream(Out);RetryableMessage.prototype.writeMessage.call(this, out);};PubAckMessage.prototype.readMessage = function (_in, msgLength) {RetryableMessage.prototype.readMessage.call(this, _in);this.date = _in.readInt();this.status = _in.read() * 256 + _in.read();this.millisecond = _in.read() * 256 + _in.read();this.timestamp = this.date * 1000 + this.millisecond;this.messageUId = _in.readUTF();};PubAckMessage.prototype.setStatus = function (x) {this.status = x;};PubAckMessage.prototype.setTimestamp = function (timestamp) {this.timestamp = timestamp;};PubAckMessage.prototype.setMessageUId = function (messageUId) {this.messageUId = messageUId;};PubAckMessage.prototype.getStatus = function () {return this.status;};PubAckMessage.prototype.getDate = function () {return this.date;};PubAckMessage.prototype.getTimestamp = function () {return this.timestamp;};PubAckMessage.prototype.getMessageUId = function () {return this.messageUId;};return PubAckMessage;}(RetryableMessage);RongIMLib.PubAckMessage = PubAckMessage;var PublishMessage = function (_super) {__extends(PublishMessage, _super);function PublishMessage(header, two, three) {_super.call(this, arguments.length == 1 && header instanceof RongIMLib.Header ? header : arguments.length == 3 ? RongIMLib.Type.PUBLISH : 0);this._name = "PublishMessage";this.binaryHelper = new RongIMLib.BinaryHelper();this.syncMsg = false;if (arguments.length == 3) {this.topic = header;this.targetId = three;this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;}}PublishMessage.prototype.messageLength = function () {var length = 10;length += this.binaryHelper.toMQttString(this.topic).length;length += this.binaryHelper.toMQttString(this.targetId).length;length += this.data.length;return length;};PublishMessage.prototype.writeMessage = function (Out) {var out = this.binaryHelper.convertStream(Out);out.writeUTF(this.topic);out.writeUTF(this.targetId);RetryableMessage.prototype.writeMessage.apply(this, arguments);out.write(this.data);};PublishMessage.prototype.readMessage = function (_in, msgLength) {var pos = 6;
            this.date = _in.readInt();this.topic = _in.readUTF();pos += this.binaryHelper.toMQttString(this.topic).length;this.targetId = _in.readUTF();pos += this.binaryHelper.toMQttString(this.targetId).length;RetryableMessage.prototype.readMessage.apply(this, arguments);this.data = new Array(msgLength - pos);this.data = _in.read(this.data);};PublishMessage.prototype.setTopic = function (x) {this.topic = x;};PublishMessage.prototype.setData = function (x) {this.data = x;};PublishMessage.prototype.setTargetId = function (x) {this.targetId = x;};PublishMessage.prototype.setDate = function (x) {this.date = x;};PublishMessage.prototype.setSyncMsg = function (x) {this.syncMsg = x;};PublishMessage.prototype.getSyncMsg = function () {return this.syncMsg;};PublishMessage.prototype.getTopic = function () {return this.topic;};PublishMessage.prototype.getData = function () {return this.data;};PublishMessage.prototype.getTargetId = function () {return this.targetId;};PublishMessage.prototype.getDate = function () {return this.date;};return PublishMessage;}(RetryableMessage);RongIMLib.PublishMessage = PublishMessage;var QueryMessage = function (_super) {__extends(QueryMessage, _super);function QueryMessage(header, two, three) {_super.call(this, header instanceof RongIMLib.Header ? header : arguments.length == 3 ? RongIMLib.Type.QUERY : null);this.binaryHelper = new RongIMLib.BinaryHelper();this._name = "QueryMessage";if (arguments.length == 3) {this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;this.topic = header;this.targetId = three;}}QueryMessage.prototype.messageLength = function () {var length = 0;length += this.binaryHelper.toMQttString(this.topic).length;length += this.binaryHelper.toMQttString(this.targetId).length;length += 2;length += this.data.length;return length;};QueryMessage.prototype.writeMessage = function (Out) {var out = this.binaryHelper.convertStream(Out);out.writeUTF(this.topic);out.writeUTF(this.targetId);RetryableMessage.prototype.writeMessage.call(this, out);out.write(this.data);};QueryMessage.prototype.readMessage = function (_in, msgLength) {var pos = 0;this.topic = _in.readUTF();this.targetId = _in.readUTF();pos += this.binaryHelper.toMQttString(this.topic).length;pos += this.binaryHelper.toMQttString(this.targetId).length;this.readMessage.apply(this, arguments);pos += 2;this.data = new Array(msgLength - pos);_in.read(this.data);};QueryMessage.prototype.setTopic = function (x) {this.topic = x;};QueryMessage.prototype.setData = function (x) {this.data = x;};QueryMessage.prototype.setTargetId = function (x) {this.targetId = x;};QueryMessage.prototype.getTopic = function () {return this.topic;};QueryMessage.prototype.getData = function () {return this.data;};QueryMessage.prototype.getTargetId = function () {return this.targetId;};return QueryMessage;}(RetryableMessage);RongIMLib.QueryMessage = QueryMessage;var QueryConMessage = function (_super) {__extends(QueryConMessage, _super);function QueryConMessage(messageId) {_super.call(this, messageId instanceof RongIMLib.Header ? messageId : RongIMLib.Type.QUERYCON);this._name = "QueryConMessage";if (!(messageId instanceof RongIMLib.Header)) {_super.prototype.setMessageId.call(this, messageId);}}return QueryConMessage;}(RetryableMessage);RongIMLib.QueryConMessage = QueryConMessage;var QueryAckMessage = function (_super) {__extends(QueryAckMessage, _super);function QueryAckMessage(header) {_super.call(this, header);this._name = "QueryAckMessage";this.binaryHelper = new RongIMLib.BinaryHelper();}QueryAckMessage.prototype.readMessage = function (In, msgLength) {RetryableMessage.prototype.readMessage.call(this, In);this.date = In.readInt();this.setStatus(In.read() * 256 + In.read());if (msgLength > 0) {this.data = new Array(msgLength - 8);this.data = In.read(this.data);}};QueryAckMessage.prototype.getData = function () {return this.data;};QueryAckMessage.prototype.getStatus = function () {return this.status;};QueryAckMessage.prototype.getDate = function () {return this.date;};QueryAckMessage.prototype.setDate = function (x) {this.date = x;};QueryAckMessage.prototype.setStatus = function (x) {this.status = x;};QueryAckMessage.prototype.setData = function (x) {this.data = x;};return QueryAckMessage;}(RetryableMessage);RongIMLib.QueryAckMessage = QueryAckMessage;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var MessageOutputStream = function () {function MessageOutputStream(_out) {var binaryHelper = new RongIMLib.BinaryHelper();this.out = binaryHelper.convertStream(_out);}MessageOutputStream.prototype.writeMessage = function (msg) {if (msg instanceof RongIMLib.BaseMessage) {msg.write(this.out);}};return MessageOutputStream;}();RongIMLib.MessageOutputStream = MessageOutputStream;var MessageInputStream = function () {function MessageInputStream(In, isPolling) {if (!isPolling) {var _in = new RongIMLib.BinaryHelper().convertStream(In);this.flags = _in.readByte();this._in = _in;} else {this.flags = In["headerCode"];}this.header = new RongIMLib.Header(this.flags);this.isPolling = isPolling;this.In = In;}MessageInputStream.prototype.readMessage = function () {switch (this.header.getType()) {case 1:this.msg = new RongIMLib.ConnectMessage(this.header);break;case 2:this.msg = new RongIMLib.ConnAckMessage(this.header);break;case 3:this.msg = new RongIMLib.PublishMessage(this.header);this.msg.setSyncMsg(this.header.getSyncMsg());
                break;case 4:this.msg = new RongIMLib.PubAckMessage(this.header);break;case 5:this.msg = new RongIMLib.QueryMessage(this.header);break;case 6:this.msg = new RongIMLib.QueryAckMessage(this.header);break;case 7:this.msg = new RongIMLib.QueryConMessage(this.header);break;case 9:case 11:case 13:this.msg = new RongIMLib.PingRespMessage(this.header);break;case 8:case 10:case 12:this.msg = new RongIMLib.PingReqMessage(this.header);break;case 14:this.msg = new RongIMLib.DisconnectMessage(this.header);break;default:throw new Error("No support for deserializing " + this.header.getType() + " messages");}if (this.isPolling) {this.msg.init(this.In);} else {this.msg.read(this._in, this.In.length - 1);}return this.msg;};return MessageInputStream;}();RongIMLib.MessageInputStream = MessageInputStream;var Header = function () {function Header(_type, _retain, _qos, _dup) {this.retain = false;this.qos = RongIMLib.Qos.AT_LEAST_ONCE;this.dup = false;this.syncMsg = false;if (_type && +_type == _type && arguments.length == 1) {this.retain = (_type & 1) > 0;this.qos = (_type & 6) >> 1;this.dup = (_type & 8) > 0;this.type = _type >> 4 & 15;this.syncMsg = (_type & 8) == 8;} else {this.type = _type;this.retain = _retain;this.qos = _qos;this.dup = _dup;}}Header.prototype.getSyncMsg = function () {return this.syncMsg;};Header.prototype.getType = function () {return this.type;};Header.prototype.encode = function () {var me = this;switch (this.qos) {case RongIMLib.Qos[0]:me.qos = RongIMLib.Qos.AT_MOST_ONCE;break;case RongIMLib.Qos[1]:me.qos = RongIMLib.Qos.AT_LEAST_ONCE;break;case RongIMLib.Qos[2]:me.qos = RongIMLib.Qos.EXACTLY_ONCE;break;case RongIMLib.Qos[3]:me.qos = RongIMLib.Qos.DEFAULT;break;}var _byte = this.type << 4;_byte |= this.retain ? 1 : 0;_byte |= this.qos << 1;_byte |= this.dup ? 8 : 0;return _byte;};Header.prototype.toString = function () {return "Header [type=" + this.type + ",retain=" + this.retain + ",qos=" + this.qos + ",dup=" + this.dup + "]";};return Header;}();RongIMLib.Header = Header;var BinaryHelper = function () {function BinaryHelper() {}BinaryHelper.prototype.writeUTF = function (str, isGetBytes) {var back = [],byteSize = 0;for (var i = 0, len = str.length; i < len; i++) {var code = str.charCodeAt(i);if (code >= 0 && code <= 127) {byteSize += 1;back.push(code);} else {if (code >= 128 && code <= 2047) {byteSize += 2;back.push(192 | 31 & code >> 6);back.push(128 | 63 & code);} else {if (code >= 2048 && code <= 65535) {byteSize += 3;back.push(224 | 15 & code >> 12);back.push(128 | 63 & code >> 6);back.push(128 | 63 & code);}}}}for (var i = 0, len = back.length; i < len; i++) {if (back[i] > 255) {back[i] &= 255;}}if (isGetBytes) {return back;}if (byteSize <= 255) {return [0, byteSize].concat(back);} else {return [byteSize >> 8, byteSize & 255].concat(back);}};BinaryHelper.prototype.readUTF = function (arr) {if (Object.prototype.toString.call(arr) == "[object String]") {return arr;}var UTF = "",_arr = arr;for (var i = 0, len = _arr.length; i < len; i++) {if (_arr[i] < 0) {_arr[i] += 256;}var one = _arr[i].toString(2),v = one.match(/^1+?(?=0)/);if (v && one.length == 8) {var bytesLength = v[0].length,store = "";for (var st = 0; st < bytesLength; st++) {store += _arr[st + i].toString(2).slice(2);}UTF += String.fromCharCode(parseInt(store, 2));i += bytesLength - 1;} else {UTF += String.fromCharCode(_arr[i]);}}return UTF;};BinaryHelper.prototype.convertStream = function (x) {if (x instanceof RongIMStream) {return x;} else {return new RongIMStream(x);}};BinaryHelper.prototype.toMQttString = function (str) {return this.writeUTF(str);};return BinaryHelper;}();RongIMLib.BinaryHelper = BinaryHelper;var RongIMStream = function () {function RongIMStream(arr) {this.position = 0;this.writen = 0;this.poolLen = 0;this.binaryHelper = new BinaryHelper();this.pool = arr;this.poolLen = arr.length;}RongIMStream.prototype.check = function () {return this.position >= this.pool.length;};RongIMStream.prototype.readInt = function () {if (this.check()) {return -1;}var end = "";for (var i = 0; i < 4; i++) {var t = this.pool[this.position++].toString(16);if (t.length == 1) {t = "0" + t;}end += t.toString(16);}return parseInt(end, 16);};RongIMStream.prototype.readLong = function () {if (this.check()) {return -1;}var end = "";for (var i = 0; i < 8; i++) {var t = this.pool[this.position++].toString(16);if (t.length == 1) {t = "0" + t;}end += t;}return parseInt(end, 16);};RongIMStream.prototype.readTimestamp = function () {if (this.check()) {return -1;}var end = "";for (var i = 0; i < 8; i++) {end += this.pool[this.position++].toString(16);}end = end.substring(2, 8);return parseInt(end, 16);};RongIMStream.prototype.readUTF = function () {if (this.check()) {return -1;}var big = this.readByte() << 8 | this.readByte();return this.binaryHelper.readUTF(this.pool.subarray(this.position, this.position += big));};RongIMStream.prototype.readByte = function () {if (this.check()) {return -1;}var val = this.pool[this.position++];if (val > 255) {val &= 255;}return val;};RongIMStream.prototype.read = function (bytesArray) {if (bytesArray) {return this.pool.subarray(this.position, this.poolLen);} else {return this.readByte();}};RongIMStream.prototype.write = function (_byte) {var b = _byte;if (Object.prototype.toString.call(b).toLowerCase() == "[object array]") {[].push.apply(this.pool, b);} else {if (+b == b) {if (b > 255) {b &= 255;}this.pool.push(b);this.writen++;}}return b;};RongIMStream.prototype.writeChar = function (v) {if (+v != v) {throw new Error("writeChar:arguments type is error");}this.write(v >> 8 & 255);this.write(v & 255);this.writen += 2;
          };RongIMStream.prototype.writeUTF = function (str) {var val = this.binaryHelper.writeUTF(str);[].push.apply(this.pool, val);this.writen += val.length;};RongIMStream.prototype.toComplements = function () {var _tPool = this.pool;for (var i = 0; i < this.poolLen; i++) {if (_tPool[i] > 128) {_tPool[i] -= 256;}}return _tPool;};RongIMStream.prototype.getBytesArray = function (isCom) {if (isCom) {return this.toComplements();}return this.pool;};return RongIMStream;}();RongIMLib.RongIMStream = RongIMStream;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var SocketTransportation = function () {function SocketTransportation(_socket) {this.connected = false;this.isClose = false;this.queue = [];this.empty = new Function();this._socket = _socket;return this;}SocketTransportation.prototype.createTransport = function (url, method) {if (!url) {throw new Error("URL can't be empty");}this.url = url;var depend = RongIMLib.RongIMClient._memoryStore.depend;var wsScheme = depend.wsScheme;var tpl = "{wsScheme}{url}";url = RongIMLib.RongUtil.tplEngine(tpl, { wsScheme: wsScheme, url: url });this.socket = new WebSocket(url);this.socket.binaryType = "arraybuffer";this.addEvent();return this.socket;};SocketTransportation.prototype.send = function (data) {if (!this.connected && !this.isClose) {this.queue.push(data);return;}if (this.isClose) {this._socket.fire("StatusChanged", RongIMLib.ConnectionStatus.CONNECTION_CLOSED);return;}var stream = new RongIMLib.RongIMStream([]),msg = new RongIMLib.MessageOutputStream(stream);msg.writeMessage(data);var val = stream.getBytesArray(true);var binary = new Int8Array(val);this.socket.send(binary.buffer);return this;};SocketTransportation.prototype.onData = function (data) {if (RongIMLib.MessageUtil.isArray(data)) {this._socket.onMessage(new RongIMLib.MessageInputStream(data).readMessage());} else {this._socket.onMessage(new RongIMLib.MessageInputStream(RongIMLib.MessageUtil.ArrayFormInput(data)).readMessage());}return "";};SocketTransportation.prototype.onClose = function (ev) {var me = this;me.isClose = true;me.socket = this.empty;RongIMLib.Bridge._client.clearHeartbeat();if (ev.code == 1006 && !this._status) {var currentTime = new Date().getTime();if (currentTime - me.connectedTime <= SocketTransportation.MinConnectTime) {var host = RongIMLib.RongUtil.getUrlHost(me.url);RongIMLib.RongIMClient.invalidWsUrls.push(host);}me._socket.fire("StatusChanged", RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);} else {me._status = 0;}};SocketTransportation.prototype.onError = function (error) {this._socket.fire("StatusChanged", RongIMLib.ConnectionStatus.WEBSOCKET_ERROR);throw new Error(error);};SocketTransportation.prototype.addEvent = function () {var self = this;self.socket.onopen = function () {self.connected = true;self.isClose = false;self.doQueue();self._socket.fire("connect");self.connectedTime = new Date().getTime();};self.socket.onmessage = function (ev) {if (typeof ev.data == "string") {self.onData(ev.data.split(","));} else {self.onData(ev.data);}};self.socket.onerror = function (ev) {self.onError(ev);};self.socket.onclose = function (ev) {self.onClose(ev);};};SocketTransportation.prototype.doQueue = function () {var self = this;for (var i = 0, len = self.queue.length; i < len; i++) {self.send(self.queue[i]);}};SocketTransportation.prototype.disconnect = function (status) {var me = this;if (me.socket.readyState) {me.isClose = true;if (status) {me._status = status;}me.socket.close();}};SocketTransportation.prototype.reconnect = function () {this.disconnect();this.createTransport(this.url);};SocketTransportation.prototype.close = function () {this.socket.close();};SocketTransportation.MinConnectTime = 5000;return SocketTransportation;}();RongIMLib.SocketTransportation = SocketTransportation;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var PollingTransportation = function () {function PollingTransportation(socket) {this.empty = new Function();this.connected = false;this.pid = +new Date() + Math.random() + "";this.queue = [];this.socket = socket;return this;}PollingTransportation.prototype.createTransport = function (url, method) {if (!url) {throw new Error("Url is empty,Please check it!");}this.url = url;var sid = RongIMLib.RongIMClient._storageProvider.getItem("sId" + RongIMLib.Navigation.Endpoint.userId),me = this;if (sid) {setTimeout(function () {me.onSuccess('{"status":0,"userId":"' + RongIMLib.Navigation.Endpoint.userId + '","headerCode":32,"messageId":0,"sessionid":"' + sid + '"}');me.connected = true;}, 500);return this;}this.getRequest(url, true);return this;};PollingTransportation.prototype.requestFactory = function (url, method, multipart) {var reqest = this.XmlHttpRequest();if (multipart) {reqest.multipart = true;}reqest.open(method || "GET", RongIMLib.RongIMClient._memoryStore.depend.protocol + url);if (method == "POST" && "setRequestHeader" in reqest) {reqest.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");}return reqest;};PollingTransportation.prototype.getRequest = function (url, isconnect) {var me = this;me.xhr = this.requestFactory(url + "&pid=" + encodeURIComponent(me.pid), "GET");var timer = new RongIMLib.Timer({ timeout: 45000 });if ("onload" in me.xhr) {me.xhr.onload = function () {timer.pause();me.xhr.onload = me.empty;if (this.responseText == "lost params") {me.onError();
                } else {me.onSuccess(this.responseText, isconnect);}};me.xhr.onerror = function () {timer.pause();me.disconnect();};} else {me.xhr.onreadystatechange = function () {timer.pause();if (me.xhr.readyState == 4) {me.xhr.onreadystatechange = me.empty;if (/^(200|202)$/.test(me.xhr.status)) {me.onSuccess(me.xhr.responseText, isconnect);} else {if (/^(400|403)$/.test(me.xhr.status)) {me.onError();} else {me.disconnect();}}}};}timer.resume(function () {me.onError();});me.xhr.send();};PollingTransportation.prototype.send = function (data) {var me = this;var _send = me.sendxhr = this.requestFactory(RongIMLib.Navigation.Endpoint.host + "/websocket" + data.url + "&pid=" + encodeURIComponent(me.pid), "POST");if ("onload" in _send) {_send.onload = function () {_send.onload = me.empty;me.onData(_send.responseText);};_send.onerror = function () {_send.onerror = me.empty;};} else {_send.onreadystatechange = function () {if (_send.readyState == 4) {this.onreadystatechange = this.empty;if (/^(202|200)$/.test(_send.status)) {me.onData(_send.responseText);}}};}_send.send(JSON.stringify(data.data));};PollingTransportation.prototype.onData = function (data, header) {if (!data || data == "lost params") {return;}var self = this,val = JSON.parse(data);if (val.userId) {RongIMLib.Navigation.Endpoint.userId = val.userId;}if (header) {RongIMLib.RongIMClient._storageProvider.setItem("sId" + RongIMLib.Navigation.Endpoint.userId, header);}if (!RongIMLib.MessageUtil.isArray(val)) {val = [val];}Array.forEach(val, function (m) {self.socket.fire("message", new RongIMLib.MessageInputStream(m, true).readMessage());});return "";};PollingTransportation.prototype.XmlHttpRequest = function () {var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();if ("undefined" != typeof XMLHttpRequest && hasCORS) {return new XMLHttpRequest();} else {if ("undefined" != typeof XDomainRequest) {return new XDomainRequest();} else {return new ActiveXObject("Microsoft.XMLHTTP");}}};PollingTransportation.prototype.onClose = function () {if (this.xhr) {if (this.xhr.onload) {this.xhr.onreadystatechange = this.xhr.onload = this.empty;} else {this.xhr.onreadystatechange = this.empty;}this.xhr.abort();this.xhr = null;}if (this.sendxhr) {if (this.sendxhr.onload) {this.sendxhr.onreadystatechange = this.sendxhr.onload = this.empty;} else {this.sendxhr.onreadystatechange = this.empty;}this.sendxhr.abort();this.sendxhr = null;}};PollingTransportation.prototype.disconnect = function () {RongIMLib.RongIMClient._storageProvider.removeItem("sId" + RongIMLib.Navigation.Endpoint.userId);RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId + "msgId");this.onClose();};PollingTransportation.prototype.reconnect = function () {this.disconnect();this.createTransport(this.url);};PollingTransportation.prototype.onSuccess = function (responseText, isconnect) {var txt = responseText.match(/"sessionid":"\S+?(?=")/);this.onData(responseText, txt ? txt[0].slice(13) : 0);if (/"headerCode":-32,/.test(responseText)) {RongIMLib.RongIMClient._storageProvider.removeItem("sId" + RongIMLib.Navigation.Endpoint.userId);RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId + "msgId");return;}this.getRequest(RongIMLib.Navigation.Endpoint.host + "/pullmsg.js?sessionid=" + RongIMLib.RongIMClient._storageProvider.getItem("sId" + RongIMLib.Navigation.Endpoint.userId) + "&timestrap=" + encodeURIComponent(new Date().getTime() + Math.random() + ""));this.connected = true;isconnect && this.socket.fire("connect");};PollingTransportation.prototype.onError = function () {RongIMLib.RongIMClient._storageProvider.removeItem("sId" + RongIMLib.Navigation.Endpoint.userId);RongIMLib.RongIMClient._storageProvider.removeItem(RongIMLib.Navigation.Endpoint.userId + "msgId");this.onClose();if (this.connected) {this.connected = false;var code = RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;this.socket.fire("disconnect", code);}};PollingTransportation.prototype.close = function () {this.xhr.abort();this.sendxhr = null;};return PollingTransportation;}();RongIMLib.PollingTransportation = PollingTransportation;})(RongIMLib || (RongIMLib = {}));var typeMapping = { "RC:TxtMsg": "TextMessage", "RC:ImgMsg": "ImageMessage", "RC:VcMsg": "VoiceMessage", "RC:ImgTextMsg": "RichContentMessage", "RC:FileMsg": "FileMessage", "RC:HQVCMsg": "HQVoiceMessage", "RC:LBSMsg": "LocationMessage", "RC:InfoNtf": "InformationNotificationMessage", "RC:ContactNtf": "ContactNotificationMessage", "RC:ProfileNtf": "ProfileNotificationMessage", "RC:CmdNtf": "CommandNotificationMessage", "RC:DizNtf": "DiscussionNotificationMessage", "RC:CmdMsg": "CommandMessage", "RC:TypSts": "TypingStatusMessage", "RC:CsChaR": "ChangeModeResponseMessage", "RC:CsHsR": "HandShakeResponseMessage", "RC:CsEnd": "TerminateMessage", "RC:CsSp": "SuspendMessage", "RC:CsUpdate": "CustomerStatusUpdateMessage", "RC:ReadNtf": "ReadReceiptMessage", "RC:VCAccept": "AcceptMessage", "RC:VCRinging": "RingingMessage", "RC:VCSummary": "SummaryMessage", "RC:VCHangup": "HungupMessage", "RC:VCInvite": "InviteMessage", "RC:VCModifyMedia": "MediaModifyMessage", "RC:VCModifyMem": "MemberModifyMessage", "RC:CsContact": "CustomerContact", "RC:PSImgTxtMsg": "PublicServiceRichContentMessage", "RC:PSMultiImgTxtMsg": "PublicServiceMultiRichContentMessage", "RC:GrpNtf": "GroupNotificationMessage", "RC:PSCmd": "PublicServiceCommandMessage", "RC:RcCmd": "RecallCommandMessage", "RC:SRSMsg": "SyncReadStatusMessage", "RC:RRReqMsg": "ReadReceiptRequestMessage", "RC:RRRspMsg": "ReadReceiptResponseMessage", "RCJrmf:RpMsg": "JrmfRedPacketMessage", "RCJrmf:RpOpendMsg": "JrmfRedPacketOpenedMessage", "RC:CombineMsg": "RCCombineMessage", "RC:chrmKVNotiMsg": "ChrmKVNotificationMessage" },registerMessageTypeMapping = {},HistoryMsgType = { 4: "qryCMsg", 2: "qryDMsg", 3: "qryGMsg", 1: "qryPMsg", 6: "qrySMsg", 7: "qryPMsg", 8: "qryPMsg", 5: "qryCMsg" },disconnectStatus = { 1: 6 };
      var RongIMLib;(function (RongIMLib) {var Transportations = function () {function Transportations() {}Transportations._TransportType = RongIMLib.Socket.WEBSOCKET;return Transportations;}();RongIMLib.Transportations = Transportations;var SyncTimeUtil = function () {function SyncTimeUtil() {}SyncTimeUtil.$getKey = function (message) {var client = RongIMLib.Bridge._client;var userId = client.userId;var direction = message.messageDirection == 1 ? "send" : "receive";var appkey = RongIMLib.RongIMClient._memoryStore.appKey;var tpl = "{appkey}_{userId}_{direction}box";return RongIMLib.RongUtil.tplEngine(tpl, { appkey: appkey, userId: userId, direction: direction });};SyncTimeUtil.set = function (message) {var key = SyncTimeUtil.$getKey(message);var sentTime = message.sentTime;var storage = RongIMLib.RongIMClient._storageProvider;storage.setItem(key, sentTime);};SyncTimeUtil.get = function () {var sent = SyncTimeUtil.$getKey({ messageDirection: RongIMLib.MessageDirection.SEND });var received = SyncTimeUtil.$getKey({ messageDirection: RongIMLib.MessageDirection.RECEIVE });var storage = RongIMLib.RongIMClient._storageProvider;return { sent: Number(storage.getItem(sent) || 0), received: Number(storage.getItem(received) || 0) };};return SyncTimeUtil;}();RongIMLib.SyncTimeUtil = SyncTimeUtil;var MessageUtil = function () {function MessageUtil() {}MessageUtil.checkStorageSize = function () {return JSON.stringify(localStorage).length < 4680000;};MessageUtil.getFirstKey = function (obj) {var str = "";for (var key in obj) {str = key;break;}return str;};MessageUtil.isEmpty = function (obj) {var empty = true;for (var key in obj) {empty = false;break;}return empty;};MessageUtil.ArrayForm = function (typearray) {if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {var arr = new Int8Array(typearray);return [].slice.call(arr);}return typearray;};MessageUtil.ArrayFormInput = function (typearray) {if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {var arr = new Uint8Array(typearray);return arr;}return typearray;};MessageUtil.indexOf = function (arr, item, from) {for (var l = arr.length, i = from < 0 ? Math.max(0, +from) : from || 0; i < l; i++) {if (arr[i] == item) {return i;}}return -1;};MessageUtil.isArray = function (obj) {return Object.prototype.toString.call(obj) == "[object Array]";};MessageUtil.forEach = function (arr, func) {if ([].forEach) {return function (arr, func) {[].forEach.call(arr, func);};} else {return function (arr, func) {for (var i = 0; i < arr.length; i++) {func.call(arr, arr[i], i, arr);}};}};MessageUtil.remove = function (array, func) {for (var i = 0, len = array.length; i < len; i++) {if (func(array[i])) {return array.splice(i, 1)[0];}}return null;};MessageUtil.int64ToTimestamp = function (obj, isDate) {if (obj.low === undefined) {return obj;}var low = obj.low;if (low < 0) {low += 4294967295 + 1;}low = low.toString(16);var timestamp = parseInt(obj.high.toString(16) + "00000000".replace(new RegExp("0{" + low.length + "}$"), low), 16);if (isDate) {return new Date(timestamp);}return timestamp;};MessageUtil.messageParser = function (entity, onReceived, offlineMsg) {var message = new RongIMLib.Message(),content = entity.content,de,objectName = entity.classname,val,isUseDef = false;try {if (RongIMLib.RongIMClient._memoryStore.depend.isPolling) {val = new RongIMLib.BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayForm(content.buffer).slice(content.offset, content.limit) : content);de = JSON.parse(val);} else {val = new RongIMLib.BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayFormInput(content.buffer).subarray(content.offset, content.limit) : content);de = JSON.parse(val);}} catch (ex) {de = val;isUseDef = true;}var IMLib = RongIMLib;if (objectName in typeMapping) {var typeName = typeMapping[objectName];message.content = new IMLib[typeName](de);message.messageType = typeMapping[objectName];} else {if (objectName in registerMessageTypeMapping) {var typeName = registerMessageTypeMapping[objectName];var regMsg = new IMLib.RongIMClient.RegisterMessage[typeName](de);if (isUseDef) {message.content = regMsg.decode(de);} else {message.content = regMsg;}message.messageType = registerMessageTypeMapping[objectName];} else {message.content = new RongIMLib.UnknownMessage({ content: de, objectName: objectName });message.messageType = "UnknownMessage";}}var dateTime = MessageUtil.int64ToTimestamp(entity.dataTime);if (dateTime > 0) {message.sentTime = dateTime;} else {message.sentTime = +new Date();}message.senderUserId = entity.fromUserId;message.conversationType = entity.type;if (entity.fromUserId == RongIMLib.Bridge._client.userId) {message.targetId = entity.groupId;} else {message.targetId = /^[234]$/.test(entity.type || entity.getType()) ? entity.groupId : message.senderUserId;}var selfUserId = RongIMLib.Bridge._client.userId;var isSelfSend = entity.direction == 1 || message.senderUserId === selfUserId;if (isSelfSend) {message.messageDirection = RongIMLib.MessageDirection.SEND;message.senderUserId = RongIMLib.Bridge._client.userId;} else {message.messageDirection = RongIMLib.MessageDirection.RECEIVE;}var isSelfToSelf = message.senderUserId === selfUserId && message.targetId === selfUserId;if (isSelfToSelf) {message.messageDirection = RongIMLib.MessageDirection.RECEIVE;}message.messageUId = entity.msgId;message.receivedTime = new Date().getTime();message.messageId = message.conversationType + "_" + ~~(Math.random() * 16777215);
            message.objectName = objectName;message.receivedStatus = RongIMLib.ReceivedStatus.READ;if ((entity.status & 2) == 2) {message.receivedStatus = RongIMLib.ReceivedStatus.RETRIEVED;}message.offLineMessage = offlineMsg ? true : false;if (!offlineMsg) {if (RongIMLib.RongIMClient._memoryStore.connectAckTime > message.sentTime) {message.offLineMessage = true;}}return message;};MessageUtil.detectCMP = function (options) {options.error = options.fail;return RongIMLib.RongUtil.request(options);};MessageUtil.sign = { converNum: 1, msgNum: 1, isMsgStart: true, isConvStart: true };return MessageUtil;}();RongIMLib.MessageUtil = MessageUtil;var MessageIdHandler = function () {function MessageIdHandler() {}MessageIdHandler.init = function () {this.messageId = +(RongIMLib.RongIMClient._storageProvider.getItem(RongIMLib.Navigation.Endpoint.userId + "msgId") || RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId + "msgId", 0) || 0);};MessageIdHandler.messageIdPlus = function (method) {RongIMLib.RongIMClient._memoryStore.depend.isPolling && this.init();if (this.messageId >= 65535) {this.messageId = 0;}this.messageId++;RongIMLib.RongIMClient._memoryStore.depend.isPolling && RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId + "msgId", this.messageId);return this.messageId;};MessageIdHandler.clearMessageId = function () {this.messageId = 0;RongIMLib.RongIMClient._memoryStore.depend.isPolling && RongIMLib.RongIMClient._storageProvider.setItem(RongIMLib.Navigation.Endpoint.userId + "msgId", this.messageId);};MessageIdHandler.getMessageId = function () {RongIMLib.RongIMClient._memoryStore.depend.isPolling && this.init();return this.messageId;};MessageIdHandler.messageId = 0;return MessageIdHandler;}();RongIMLib.MessageIdHandler = MessageIdHandler;var ChrmKVCaches = function () {function ChrmKVCaches() {this.time = 0;this.cache = {};}ChrmKVCaches.prototype.setTime = function (time) {this.time = time;};ChrmKVCaches.prototype.getTime = function () {return this.time;};ChrmKVCaches.prototype.setValue = function (kvContent) {var key = kvContent.key,timestamp = kvContent.timestamp;this.cache[key] = this.cache[key] || {};this.cache[key] = { value: kvContent.value, userId: kvContent.userId, isDeleted: false, timestamp: timestamp };};ChrmKVCaches.prototype.removeValue = function (kvContent) {var key = kvContent.key,timestamp = kvContent.timestamp;this.cache[key] = this.cache[key] || {};var cache = this.cache[key];this.cache[key] = RongIMLib.RongUtil.extend(cache, { isDeleted: true, userId: kvContent.userId, timestamp: timestamp });};ChrmKVCaches.prototype.getValue = function (key) {this.cache[key] = this.cache[key] || {};var cache = this.cache[key];return cache.isDeleted ? null : cache.value;};ChrmKVCaches.prototype.getAllKV = function () {var kv = {};RongIMLib.RongUtil.forEach(this.cache, function (item, key) {if (!item.isDeleted) {kv[key] = item.value;}});return kv;};ChrmKVCaches.prototype.getSetUserId = function (key) {this.cache[key] = this.cache[key] || {};return this.cache[key].userId;};ChrmKVCaches.prototype.isKeyExisted = function (key) {this.cache[key] = this.cache[key] || {};var cache = this.cache[key];var hasValue = !RongIMLib.RongUtil.isEmpty(cache.value);return hasValue && !cache.isDeleted;};ChrmKVCaches.prototype.clear = function () {this.cache = {};};return ChrmKVCaches;}();var chrmKVCaches = {};var chrmKVProsumerCaches = {};var getKVCache = function getKVCache(chrmId) {var chrmKVCache = chrmKVCaches[chrmId];if (!chrmKVCache) {chrmKVCache = chrmKVCaches[chrmId] = new ChrmKVCaches();}return chrmKVCache;};var getKVProsumer = function getKVProsumer(chrmId) {var kvProsumer = chrmKVProsumerCaches[chrmId];if (!kvProsumer) {kvProsumer = chrmKVProsumerCaches[chrmId] = new RongIMLib.RongUtil.Prosumer();}return kvProsumer;};var ChrmKVHandler = function () {function ChrmKVHandler() {}ChrmKVHandler.pull = function (chrmId, time) {var prosumer = getKVProsumer(chrmId);var event = RongIMLib.RongIMClient._dataAccessProvider.pullChatroomEntry;prosumer.produce({ event: event, chrmId: chrmId, time: time });prosumer.consume(function (params, next) {var event = params.event,chrmId = params.chrmId,time = params.time;var kvCache = getKVCache(chrmId);var currentTime = kvCache.getTime();var isKVNeedUpdated = currentTime < time;if (isKVNeedUpdated) {event(chrmId, currentTime, { onSuccess: function onSuccess(result) {ChrmKVHandler.setEntries(chrmId, result);next();}, onError: next });} else {next();}});};ChrmKVHandler.setEntries = function (chrmId, entity) {var entries = entity.entries,isFullUpdate = entity.bFullUpdate,syncTime = entity.syncTime;var event = isFullUpdate ? ChrmKVHandler.setFullEntries : ChrmKVHandler.setIncreEntries;var kvCache = getKVCache(chrmId);syncTime = MessageUtil.int64ToTimestamp(syncTime);if (RongIMLib.RongUtil.isArray(entries)) {RongIMLib.RongUtil.forEach(entries, function (item) {var setTime = item.timestamp;if (!RongIMLib.RongUtil.isNumber(setTime)) {item.timestamp = MessageUtil.int64ToTimestamp(setTime);}});}kvCache.setTime(syncTime);event(chrmId, entries);};ChrmKVHandler.setEntry = function (chrmId, chatroomEntry, status, userId) {var kvCache = getKVCache(chrmId);var timestamp = chatroomEntry.timestamp || +new Date();var isDelete = RongInnerTools.getChrmEntityByStatus(status).isDelete;var eventName = isDelete ? "removeValue" : "setValue";kvCache[eventName]({ key: chatroomEntry.key, value: chatroomEntry.value, userId: userId, timestamp: timestamp });
          };ChrmKVHandler.setFullEntries = function (chrmId, entries) {var kvCache = getKVCache(chrmId);kvCache.clear();RongIMLib.RongUtil.forEach(entries, function (entity) {entity.timestamp = MessageUtil.int64ToTimestamp(entity.timestamp);kvCache.setValue({ key: entity.key, value: entity.value, userId: entity.uid, timestamp: entity.timestamp });});};ChrmKVHandler.setIncreEntries = function (chrmId, entries) {var kvCache = getKVCache(chrmId);var currentUserId = RongIMLib.RongIMClient.getInstance().getCurrentUserId();var optEvent = function optEvent(entity, isOverwrite, eventName) {var key = entity.key,value = entity.value;var isLatestedKeySetBySelf = kvCache.getSetUserId(key) === currentUserId;var isKeyNotExist = !kvCache.isKeyExisted(key);if (isOverwrite || isLatestedKeySetBySelf || isKeyNotExist) {kvCache[eventName]({ key: key, value: value, userId: entity.uid, timestamp: entity.timestamp });}};RongIMLib.RongUtil.forEach(entries, function (entity) {var entityContent = RongInnerTools.getChrmEntityByStatus(entity.status);var eventName = entityContent.isDelete ? "removeValue" : "setValue";optEvent(entity, entityContent.isOverwrite, eventName);});};ChrmKVHandler.getEntityValue = function (chrmId, key) {var kvCache = getKVCache(chrmId);return kvCache.getValue(key);};ChrmKVHandler.getAllEntityValue = function (chrmId) {var kvCache = getKVCache(chrmId);return kvCache.getAllKV();};ChrmKVHandler.isKeyValid = function (key) {return /^[A-Za-z0-9_=+-]+$/.test(key);};return ChrmKVHandler;}();RongIMLib.ChrmKVHandler = ChrmKVHandler;var AutoDeleteCode = 1;var OverwriteCode = 2;var DeleteOperationCode = 4;var RongInnerTools = function () {function RongInnerTools() {}RongInnerTools.convertUserStatus = function (entity) {entity = RongIMLib.RongUtil.rename(entity, { subUserId: "userId" });var status = JSON.parse(entity.status);var us = status.us;if (!us) {return entity;}entity.status = RongIMLib.RongUtil.rename(us, { o: "online", "p": "platform", s: "status" });return entity;};RongInnerTools.getChrmEntityStatus = function (entity, chatroomOpt) {var status = 0;if (entity.isAutoDelete) {status = status | AutoDeleteCode;}if (entity.isOverwrite) {status = status | OverwriteCode;}switch (chatroomOpt) {case RongIMLib.ChatroomEntityOpt.DELETE:status = status | DeleteOperationCode;break;default:break;}return status;};RongInnerTools.getChrmEntityByStatus = function (status) {var isDelete = !!(status & DeleteOperationCode);var entityOpt = isDelete ? RongIMLib.ChatroomEntityOpt.DELETE : RongIMLib.ChatroomEntityOpt.UPDATE;return { isAutoDelete: !!(status & AutoDeleteCode), isOverwrite: !!(status & OverwriteCode), entityOpt: entityOpt, isDelete: isDelete };};return RongInnerTools;}();RongIMLib.RongInnerTools = RongInnerTools;var UnreadCountHandler = function () {function UnreadCountHandler() {}UnreadCountHandler.getKey = function (type, targetId) {var selfId = RongIMLib.RongIMClient.getInstance().getCurrentUserId();return RongIMLib.RongUtil.tplEngine(UnreadCountHandler.KeyTemp, { selfId: selfId, type: type, targetId: targetId });};UnreadCountHandler.getDetailByKey = function (key) {var detail = { count: 0, sentTime: 0 };var value = RongIMLib.RongIMClient._storageProvider.getItem(key);if (!value) {return detail;}value += "";var unreadItems = value.split("_");var hasUnderline = unreadItems.length > 1;detail.count = Number(unreadItems[0]);if (hasUnderline) {detail.sentTime = Number(unreadItems[1]);}return detail;};UnreadCountHandler.getDetail = function (type, targetId) {var key = UnreadCountHandler.getKey(type, targetId);var detail = UnreadCountHandler.getDetailByKey(key);return detail;};UnreadCountHandler.set = function (type, id, count, sentTime) {var key = UnreadCountHandler.getKey(type, id);var value = sentTime ? RongIMLib.RongUtil.tplEngine(UnreadCountHandler.ValueTemp, { count: count, sentTime: sentTime }) : count;RongIMLib.RongIMClient._storageProvider.setItem(key, value);return count;};UnreadCountHandler.add = function (type, id, plusCount, sentTime) {var detail = UnreadCountHandler.getDetail(type, id),count = detail.count,oldSentTime = detail.sentTime;if (sentTime && sentTime > oldSentTime) {count = count + plusCount;UnreadCountHandler.set(type, id, count, sentTime);}return count;};UnreadCountHandler.get = function (type, id) {var detail = UnreadCountHandler.getDetail(type, id);return detail.count;};UnreadCountHandler.getAll = function (types) {var total = 0;var selfId = RongIMLib.RongIMClient.getInstance().getCurrentUserId();var setTotal = function setTotal(keyList) {RongIMLib.RongUtil.forEach(keyList, function (key) {var detail = UnreadCountHandler.getDetailByKey(key);total += detail.count;});};if (types) {RongIMLib.RongUtil.forEach(types, function (type) {var key = UnreadCountHandler.getKey(type, "");var unreadKeys = RongIMLib.RongIMClient._storageProvider.getItemKeyList(key);setTotal(unreadKeys);});} else {var key = UnreadCountHandler.getKey("", "");var unreadKeys = RongIMLib.RongIMClient._storageProvider.getItemKeyList(key);setTotal(unreadKeys);}return total;};UnreadCountHandler.remove = function (type, targetId) {var key = UnreadCountHandler.getKey(type, targetId);RongIMLib.RongIMClient._storageProvider.removeItem(key);};UnreadCountHandler.clear = function () {var key = UnreadCountHandler.getKey("", "");var keyList = RongIMLib.RongIMClient._storageProvider.getItemKeyList(key);RongIMLib.RongUtil.forEach(keyList, function (key) {RongIMLib.RongIMClient._storageProvider.removeItem(key);
            });};UnreadCountHandler.KeyTemp = "cu{selfId}{type}{targetId}";UnreadCountHandler.ValueTemp = "{count}_{sentTime}";return UnreadCountHandler;}();RongIMLib.UnreadCountHandler = UnreadCountHandler;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var MessageContent = function () {function MessageContent(data) {throw new Error("This method is abstract, you must implement this method in inherited class.");}MessageContent.obtain = function () {throw new Error("This method is abstract, you must implement this method in inherited class.");};return MessageContent;}();RongIMLib.MessageContent = MessageContent;var NotificationMessage = function (_super) {__extends(NotificationMessage, _super);function NotificationMessage() {_super.apply(this, arguments);}return NotificationMessage;}(MessageContent);RongIMLib.NotificationMessage = NotificationMessage;var StatusMessage = function (_super) {__extends(StatusMessage, _super);function StatusMessage() {_super.apply(this, arguments);}return StatusMessage;}(MessageContent);RongIMLib.StatusMessage = StatusMessage;var ModelUtil = function () {function ModelUtil() {}ModelUtil.modelClone = function (object) {var obj = {};for (var item in object) {if (item != "messageName" && "encode" != item) {obj[item] = object[item];}}return obj;};ModelUtil.modleCreate = function (fields, msgType) {var Object = function Object(message) {var me = this;for (var index in fields) {me[fields[index]] = message[fields[index]];}Object.prototype.messageName = msgType;Object.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};};return Object;};return ModelUtil;}();RongIMLib.ModelUtil = ModelUtil;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var CustomerStatusMessage = function () {function CustomerStatusMessage(message) {this.messageName = "CustomerStatusMessage";this.status = message.status;}CustomerStatusMessage.obtain = function () {return null;};CustomerStatusMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return CustomerStatusMessage;}();RongIMLib.CustomerStatusMessage = CustomerStatusMessage;var ChangeModeResponseMessage = function () {function ChangeModeResponseMessage(message) {this.messageName = "ChangeModeResponseMessage";this.code = message.code;this.data = message.data;this.msg = message.msg;}ChangeModeResponseMessage.obtain = function () {return null;};ChangeModeResponseMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ChangeModeResponseMessage;}();RongIMLib.ChangeModeResponseMessage = ChangeModeResponseMessage;var ChangeModeMessage = function () {function ChangeModeMessage(message) {this.messageName = "ChangeModeMessage";this.uid = message.uid;this.sid = message.sid;this.pid = message.pid;}ChangeModeMessage.obtain = function () {return null;};ChangeModeMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ChangeModeMessage;}();RongIMLib.ChangeModeMessage = ChangeModeMessage;var CustomerStatusUpdateMessage = function () {function CustomerStatusUpdateMessage(message) {this.messageName = "CustomerStatusUpdateMessage";this.serviceStatus = message.serviceStatus;this.sid = message.sid;}CustomerStatusUpdateMessage.obtain = function () {return null;};CustomerStatusUpdateMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return CustomerStatusUpdateMessage;}();RongIMLib.CustomerStatusUpdateMessage = CustomerStatusUpdateMessage;var HandShakeMessage = function () {function HandShakeMessage(message) {this.messageName = "HandShakeMessage";if (message) {this.requestInfo = message.requestInfo;this.userInfo = message.userInfo;}}HandShakeMessage.obtain = function () {return null;};HandShakeMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return HandShakeMessage;}();RongIMLib.HandShakeMessage = HandShakeMessage;var CustomerContact = function () {function CustomerContact(message) {this.messageName = "CustomerContact";this.page = message.page;this.nickName = message.nickName;this.routingInfo = message.routingInfo;this.info = message.info;this.requestInfo = message.requestInfo;}CustomerContact.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return CustomerContact;}();RongIMLib.CustomerContact = CustomerContact;var EvaluateMessage = function () {function EvaluateMessage(message) {this.messageName = "EvaluateMessage";this.uid = message.uid;this.sid = message.sid;this.pid = message.pid;this.source = message.source;this.suggest = message.suggest;this.isresolve = message.isresolve;this.type = message.type;}EvaluateMessage.obtain = function () {return null;};EvaluateMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return EvaluateMessage;}();RongIMLib.EvaluateMessage = EvaluateMessage;var HandShakeResponseMessage = function () {function HandShakeResponseMessage(message) {this.messageName = "HandShakeResponseMessage";this.msg = message.msg;this.status = message.status;this.data = message.data;}HandShakeResponseMessage.obtain = function () {return null;};HandShakeResponseMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
          };return HandShakeResponseMessage;}();RongIMLib.HandShakeResponseMessage = HandShakeResponseMessage;var SuspendMessage = function () {function SuspendMessage(message) {this.messageName = "SuspendMessage";this.uid = message.uid;this.sid = message.sid;this.pid = message.pid;}SuspendMessage.obtain = function () {return null;};SuspendMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return SuspendMessage;}();RongIMLib.SuspendMessage = SuspendMessage;var TerminateMessage = function () {function TerminateMessage(message) {this.messageName = "TerminateMessage";this.code = message.code;this.msg = message.msg;this.sid = message.sid;}TerminateMessage.obtain = function () {return null;};TerminateMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return TerminateMessage;}();RongIMLib.TerminateMessage = TerminateMessage;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var IsTypingStatusMessage = function () {function IsTypingStatusMessage(data) {this.messageName = "IsTypingStatusMessage";}IsTypingStatusMessage.prototype.encode = function () {return undefined;};IsTypingStatusMessage.prototype.getMessage = function () {return null;};return IsTypingStatusMessage;}();RongIMLib.IsTypingStatusMessage = IsTypingStatusMessage;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var InformationNotificationMessage = function () {function InformationNotificationMessage(message) {this.messageName = "InformationNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> InformationNotificationMessage.");}this.message = message.message;this.extra = message.extra;if (message.user) {this.user = message.user;}}InformationNotificationMessage.obtain = function (message) {return new InformationNotificationMessage({ message: message, extra: "" });};InformationNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return InformationNotificationMessage;}();RongIMLib.InformationNotificationMessage = InformationNotificationMessage;var CommandMessage = function () {function CommandMessage(message) {this.messageName = "CommandMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> CommandMessage.");}try {if (Object.prototype.toString.call(message.data) == "[object String]") {this.data = JSON.parse(message.data);} else {this.data = message.data;}} catch (e) {this.data = message.data;}this.name = message.name;this.extra = message.extra;}CommandMessage.obtain = function (data) {return new CommandMessage({ data: data, extra: "" });};CommandMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return CommandMessage;}();RongIMLib.CommandMessage = CommandMessage;var ContactNotificationMessage = function () {function ContactNotificationMessage(message) {this.messageName = "ContactNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ContactNotificationMessage.");}this.operation = message.operation;this.targetUserId = message.targetUserId;this.message = message.message;this.extra = message.extra;this.sourceUserId = message.sourceUserId;if (message.user) {this.user = message.user;}}ContactNotificationMessage.obtain = function (operation, sourceUserId, targetUserId, message) {return new InformationNotificationMessage({ operation: operation, sourceUserId: sourceUserId, targetUserId: targetUserId, message: message });};ContactNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};ContactNotificationMessage.CONTACT_OPERATION_ACCEPT_RESPONSE = "ContactOperationAcceptResponse";ContactNotificationMessage.CONTACT_OPERATION_REJECT_RESPONSE = "ContactOperationRejectResponse";ContactNotificationMessage.CONTACT_OPERATION_REQUEST = "ContactOperationRequest";return ContactNotificationMessage;}();RongIMLib.ContactNotificationMessage = ContactNotificationMessage;var ProfileNotificationMessage = function () {function ProfileNotificationMessage(message) {this.messageName = "ProfileNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");}this.operation = message.operation;try {if (Object.prototype.toString.call(message.data) == "[object String]") {this.data = JSON.parse(message.data);} else {this.data = message.data;}} catch (e) {this.data = message.data;}this.extra = message.extra;if (message.user) {this.user = message.user;}}ProfileNotificationMessage.obtain = function (operation, data) {return new ProfileNotificationMessage({ operation: operation, data: data });};ProfileNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ProfileNotificationMessage;}();RongIMLib.ProfileNotificationMessage = ProfileNotificationMessage;var CommandNotificationMessage = function () {function CommandNotificationMessage(message) {this.messageName = "CommandNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
            }try {if (Object.prototype.toString.call(message.data) == "[object String]") {this.data = JSON.parse(message.data);} else {this.data = message.data;}} catch (e) {this.data = message.data;}this.name = message.name;this.extra = message.extra;if (message.user) {this.user = message.user;}}CommandNotificationMessage.obtain = function (name, data) {return new CommandNotificationMessage({ name: name, data: data, extra: "" });};CommandNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return CommandNotificationMessage;}();RongIMLib.CommandNotificationMessage = CommandNotificationMessage;var DiscussionNotificationMessage = function () {function DiscussionNotificationMessage(message) {this.messageName = "DiscussionNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> DiscussionNotificationMessage.");}this.extra = message.extra;this.extension = message.extension;this.type = message.type;this.isHasReceived = message.isHasReceived;this.operation = message.operation;this.user = message.user;if (message.user) {this.user = message.user;}}DiscussionNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return DiscussionNotificationMessage;}();RongIMLib.DiscussionNotificationMessage = DiscussionNotificationMessage;var GroupNotificationMessage = function () {function GroupNotificationMessage(msg) {this.messageName = "GroupNotificationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> GroupNotificationMessage.");}msg.operatorUserId && (this.operatorUserId = msg.operatorUserId);msg.operation && (this.operation = msg.operation);msg.data && (this.data = msg.data);msg.message && (this.message = msg.message);msg.extra && (this.extra = msg.extra);}GroupNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return GroupNotificationMessage;}();RongIMLib.GroupNotificationMessage = GroupNotificationMessage;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var TextMessage = function () {function TextMessage(message) {this.messageName = "TextMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");}this.content = message.content;this.extra = message.extra;if (message.user) {this.user = message.user;}if (message.mentionedInfo) {this.mentionedInfo = message.mentionedInfo;}}TextMessage.obtain = function (text) {return new TextMessage({ extra: "", content: text });};TextMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return TextMessage;}();RongIMLib.TextMessage = TextMessage;var TypingStatusMessage = function () {function TypingStatusMessage(message) {this.messageName = "TypingStatusMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TypingStatusMessage.");}this.typingContentType = message.typingContentType;this.data = message.data;}TypingStatusMessage.obtain = function (typingContentType, data) {return new TypingStatusMessage({ typingContentType: typingContentType, data: data });};TypingStatusMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return TypingStatusMessage;}();RongIMLib.TypingStatusMessage = TypingStatusMessage;var ReadReceiptMessage = function () {function ReadReceiptMessage(message) {this.messageName = "ReadReceiptMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ReadReceiptMessage.");}this.lastMessageSendTime = message.lastMessageSendTime;this.messageUId = message.messageUId;this.type = message.type;}ReadReceiptMessage.obtain = function (messageUId, lastMessageSendTime, type) {return new ReadReceiptMessage({ messageUId: messageUId, lastMessageSendTime: lastMessageSendTime, type: type });};ReadReceiptMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ReadReceiptMessage;}();RongIMLib.ReadReceiptMessage = ReadReceiptMessage;var VoiceMessage = function () {function VoiceMessage(message) {this.messageName = "VoiceMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");}this.content = message.content;this.duration = message.duration;this.extra = message.extra;if (message.user) {this.user = message.user;}if (message.mentionedInfo) {this.mentionedInfo = message.mentionedInfo;}}VoiceMessage.obtain = function (base64Content, duration) {return new VoiceMessage({ content: base64Content, duration: duration, extra: "" });};VoiceMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return VoiceMessage;}();RongIMLib.VoiceMessage = VoiceMessage;var RecallCommandMessage = function () {function RecallCommandMessage(message) {this.messageName = "RecallCommandMessage";this.messageUId = message.messageUId;this.conversationType = message.conversationType;this.targetId = message.targetId;
            this.sentTime = message.sentTime;message.extra && (this.extra = message.extra);message.user && (this.user = message.user);}RecallCommandMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return RecallCommandMessage;}();RongIMLib.RecallCommandMessage = RecallCommandMessage;var ImageMessage = function () {function ImageMessage(message) {this.messageName = "ImageMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");}this.content = message.content;this.imageUri = message.imageUri;message.extra && (this.extra = message.extra);message.user && (this.user = message.user);if (message.mentionedInfo) {this.mentionedInfo = message.mentionedInfo;}}ImageMessage.obtain = function (content, imageUri) {return new ImageMessage({ content: content, imageUri: imageUri, extra: "" });};ImageMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ImageMessage;}();RongIMLib.ImageMessage = ImageMessage;var LocationMessage = function () {function LocationMessage(message) {this.messageName = "LocationMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");}this.latitude = message.latitude;this.longitude = message.longitude;this.poi = message.poi;this.content = message.content;this.extra = message.extra;if (message.user) {this.user = message.user;}if (message.mentionedInfo) {this.mentionedInfo = message.mentionedInfo;}}LocationMessage.obtain = function (latitude, longitude, poi, content) {return new LocationMessage({ latitude: latitude, longitude: longitude, poi: poi, content: content, extra: "" });};LocationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return LocationMessage;}();RongIMLib.LocationMessage = LocationMessage;var RichContentMessage = function () {function RichContentMessage(message) {this.messageName = "RichContentMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");}this.title = message.title;this.content = message.content;this.imageUri = message.imageUri;this.extra = message.extra;this.url = message.url;if (message.user) {this.user = message.user;}}RichContentMessage.obtain = function (title, content, imageUri, url) {return new RichContentMessage({ title: title, content: content, imageUri: imageUri, url: url, extra: "" });};RichContentMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return RichContentMessage;}();RongIMLib.RichContentMessage = RichContentMessage;var JrmfRedPacketMessage = function () {function JrmfRedPacketMessage(message) {this.messageName = "JrmfRedPacketMessage";message && (this.message = message);}JrmfRedPacketMessage.prototype.encode = function () {return "";};return JrmfRedPacketMessage;}();RongIMLib.JrmfRedPacketMessage = JrmfRedPacketMessage;var JrmfRedPacketOpenedMessage = function () {function JrmfRedPacketOpenedMessage(message) {this.messageName = "JrmfRedPacketOpenedMessage";message && (this.message = message);}JrmfRedPacketOpenedMessage.prototype.encode = function () {return "";};return JrmfRedPacketOpenedMessage;}();RongIMLib.JrmfRedPacketOpenedMessage = JrmfRedPacketOpenedMessage;var UnknownMessage = function () {function UnknownMessage(message) {this.messageName = "UnknownMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> UnknownMessage.");}this.message = message;}UnknownMessage.prototype.encode = function () {return "";};return UnknownMessage;}();RongIMLib.UnknownMessage = UnknownMessage;var PublicServiceCommandMessage = function () {function PublicServiceCommandMessage(message) {this.messageName = "PublicServiceCommandMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> PublicServiceCommandMessage.");}this.content = message.content;this.extra = message.extra;this.menuItem = message.menuItem;if (message.user) {this.user = message.user;}if (message.mentionedInfo) {this.mentionedInfo = message.mentionedInfo;}}PublicServiceCommandMessage.obtain = function (item) {return new PublicServiceCommandMessage({ content: "", command: "", menuItem: item, extra: "" });};PublicServiceCommandMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return PublicServiceCommandMessage;}();RongIMLib.PublicServiceCommandMessage = PublicServiceCommandMessage;var PublicServiceMultiRichContentMessage = function () {function PublicServiceMultiRichContentMessage(messages) {this.messageName = "PublicServiceMultiRichContentMessage";this.richContentMessages = messages;}PublicServiceMultiRichContentMessage.prototype.encode = function () {return null;};return PublicServiceMultiRichContentMessage;}();RongIMLib.PublicServiceMultiRichContentMessage = PublicServiceMultiRichContentMessage;var SyncReadStatusMessage = function () {function SyncReadStatusMessage(message) {this.messageName = "SyncReadStatusMessage";message.lastMessageSendTime && (this.lastMessageSendTime = message.lastMessageSendTime);
          }SyncReadStatusMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return SyncReadStatusMessage;}();RongIMLib.SyncReadStatusMessage = SyncReadStatusMessage;var ReadReceiptRequestMessage = function () {function ReadReceiptRequestMessage(message) {this.messageName = "ReadReceiptRequestMessage";message.messageUId && (this.messageUId = message.messageUId);}ReadReceiptRequestMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ReadReceiptRequestMessage;}();RongIMLib.ReadReceiptRequestMessage = ReadReceiptRequestMessage;var ReadReceiptResponseMessage = function () {function ReadReceiptResponseMessage(message) {this.messageName = "ReadReceiptResponseMessage";message.receiptMessageDic && (this.receiptMessageDic = message.receiptMessageDic);}ReadReceiptResponseMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ReadReceiptResponseMessage;}();RongIMLib.ReadReceiptResponseMessage = ReadReceiptResponseMessage;var PublicServiceRichContentMessage = function () {function PublicServiceRichContentMessage(message) {this.messageName = "PublicServiceRichContentMessage";this.richContentMessage = message;}PublicServiceRichContentMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return PublicServiceRichContentMessage;}();RongIMLib.PublicServiceRichContentMessage = PublicServiceRichContentMessage;var FileMessage = function () {function FileMessage(message) {this.messageName = "FileMessage";message.name && (this.name = message.name);message.size && (this.size = message.size);message.type && (this.type = message.type);message.fileUrl && (this.fileUrl = message.fileUrl);message.extra && (this.extra = message.extra);message.user && (this.user = message.user);}FileMessage.obtain = function (msg) {return new FileMessage({ name: msg.name, size: msg.size, type: msg.type, fileUrl: msg.fileUrl });};FileMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return FileMessage;}();RongIMLib.FileMessage = FileMessage;var HQVoiceMessage = function () {function HQVoiceMessage(message) {this.messageName = "HQVoiceMessage";this.type = message.type || "aac";message.localPath && (this.localPath = message.localPath);message.remoteUrl && (this.remoteUrl = message.remoteUrl);message.duration && (this.duration = message.duration);message.extra && (this.extra = message.extra);message.user && (this.user = message.user);}HQVoiceMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return HQVoiceMessage;}();RongIMLib.HQVoiceMessage = HQVoiceMessage;var AcceptMessage = function () {function AcceptMessage(message) {this.messageName = "AcceptMessage";this.mediaId = message.mediaId;this.callId = message.callId;this.mediaType = message.mediaType;this.mode = message.mode;this.subInfo = message.subInfo;}AcceptMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return AcceptMessage;}();RongIMLib.AcceptMessage = AcceptMessage;var RingingMessage = function () {function RingingMessage(message) {this.messageName = "RingingMessage";this.callId = message.callId;}RingingMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return RingingMessage;}();RongIMLib.RingingMessage = RingingMessage;var SummaryMessage = function () {function SummaryMessage(message) {this.messageName = "SummaryMessage";this.caller = message.caller;this.inviter = message.inviter;this.mediaType = message.mediaType;this.memberIdList = message.memberIdList;this.startTime = message.startTime;this.connectedTime = message.connectedTime;this.duration = message.duration;this.status = message.status;}SummaryMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return SummaryMessage;}();RongIMLib.SummaryMessage = SummaryMessage;var HungupMessage = function () {function HungupMessage(message) {this.messageName = "HungupMessage";this.callId = message.callId;this.reason = message.reason;this.mode = message.mode;this.subInfo = message.subInfo;}HungupMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return HungupMessage;}();RongIMLib.HungupMessage = HungupMessage;var InviteMessage = function () {function InviteMessage(message) {this.messageName = "InviteMessage";this.mediaId = message.mediaId;this.callId = message.callId;this.engineType = message.engineType;this.channelInfo = message.channelInfo;this.mediaType = message.mediaType;this.extra = message.extra;this.inviteUserIds = message.inviteUserIds;this.observerUserIds = message.observerUserIds;this.mode = message.mode;this.subInfo = message.subInfo;}InviteMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return InviteMessage;}();RongIMLib.InviteMessage = InviteMessage;var MediaModifyMessage = function () {function MediaModifyMessage(message) {this.messageName = "MediaModifyMessage";this.callId = message.callId;this.mediaType = message.mediaType;this.mode = message.mode;this.subInfo = message.subInfo;}MediaModifyMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
          };return MediaModifyMessage;}();RongIMLib.MediaModifyMessage = MediaModifyMessage;var MemberModifyMessage = function () {function MemberModifyMessage(message) {this.messageName = "MemberModifyMessage";this.modifyMemType = message.modifyMemType;this.callId = message.callId;this.caller = message.caller;this.engineType = message.engineType;this.channelInfo = message.channelInfo;this.mediaType = message.mediaType;this.extra = message.extra;this.inviteUserIds = message.inviteUserIds;this.existedMemberStatusList = message.existedMemberStatusList;this.existedUserPofiles = message.existedUserPofiles;this.observerUserIds = message.observerUserIds;this.mode = message.mode;this.subInfo = message.subInfo;}MemberModifyMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return MemberModifyMessage;}();RongIMLib.MemberModifyMessage = MemberModifyMessage;var RCCombineMessage = function () {function RCCombineMessage(message) {this.messageName = "RCCombineMessage";if (arguments.length == 0) {throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RCCombineMessage.");}this.nameList = message.nameList;this.remoteUrl = message.remoteUrl;if (message.user) {this.user = message.user;}this.summaryList = message.summaryList;}RCCombineMessage.obtain = function (remoteUrl, nameList, summaryList) {return new RCCombineMessage({ extra: "", content: remoteUrl, nameList: nameList, summaryList: summaryList });};RCCombineMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return RCCombineMessage;}();RongIMLib.RCCombineMessage = RCCombineMessage;var ChrmKVNotificationMessage = function () {function ChrmKVNotificationMessage(message) {this.messageName = "ChrmKVNotificationMessage";message.key && (this.key = message.key);message.value && (this.value = message.value);message.type && (this.type = message.type);message.extra && (this.extra = message.extra);message.user && (this.user = message.user);}ChrmKVNotificationMessage.prototype.encode = function () {return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));};return ChrmKVNotificationMessage;}();RongIMLib.ChrmKVNotificationMessage = ChrmKVNotificationMessage;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var ChannelInfo = function () {function ChannelInfo(Id, Key) {this.Id = Id;this.Key = Key;}return ChannelInfo;}();RongIMLib.ChannelInfo = ChannelInfo;var UserStatus = function () {function UserStatus(platform, online, status) {this.platform = platform;this.online = online;this.status = status;}return UserStatus;}();RongIMLib.UserStatus = UserStatus;var MentionedInfo = function () {function MentionedInfo(type, userIdList, mentionedContent) {}return MentionedInfo;}();RongIMLib.MentionedInfo = MentionedInfo;var DeleteMessage = function () {function DeleteMessage(msgId, msgDataTime, direct) {this.msgId = msgId;this.msgDataTime = msgDataTime;this.direct = direct;}return DeleteMessage;}();RongIMLib.DeleteMessage = DeleteMessage;var CustomServiceConfig = function () {function CustomServiceConfig(isBlack, companyName, companyUrl) {}return CustomServiceConfig;}();RongIMLib.CustomServiceConfig = CustomServiceConfig;var CustomServiceSession = function () {function CustomServiceSession(uid, cid, pid, isQuited, type, adminHelloWord, adminOfflineWord) {}return CustomServiceSession;}();RongIMLib.CustomServiceSession = CustomServiceSession;var Conversation = function () {function Conversation(conversationTitle, conversationType, draft, isTop, latestMessage, latestMessageId, notificationStatus, objectName, receivedStatus, receivedTime, senderUserId, senderUserName, sentStatus, sentTime, targetId, unreadMessageCount, senderPortraitUri, isHidden, mentionedMsg, hasUnreadMention, _readTime) {this.conversationTitle = conversationTitle;this.conversationType = conversationType;this.draft = draft;this.isTop = isTop;this.latestMessage = latestMessage;this.latestMessageId = latestMessageId;this.notificationStatus = notificationStatus;this.objectName = objectName;this.receivedStatus = receivedStatus;this.receivedTime = receivedTime;this.senderUserId = senderUserId;this.senderUserName = senderUserName;this.sentStatus = sentStatus;this.sentTime = sentTime;this.targetId = targetId;this.unreadMessageCount = unreadMessageCount;this.senderPortraitUri = senderPortraitUri;this.isHidden = isHidden;this.mentionedMsg = mentionedMsg;this.hasUnreadMention = hasUnreadMention;this._readTime = _readTime;}Conversation.prototype.setTop = function () {RongIMLib.RongIMClient._dataAccessProvider.addConversation(this, { onSuccess: function onSuccess(data) {} });};return Conversation;}();RongIMLib.Conversation = Conversation;var Discussion = function () {function Discussion(creatorId, id, memberIdList, name, isOpen) {this.creatorId = creatorId;this.id = id;this.memberIdList = memberIdList;this.name = name;this.isOpen = isOpen;}return Discussion;}();RongIMLib.Discussion = Discussion;var Group = function () {function Group(id, name, portraitUri) {this.id = id;this.name = name;this.portraitUri = portraitUri;}return Group;}();RongIMLib.Group = Group;var Message = function () {function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType, messageUId, isLocalMessage, offLineMessage, receiptResponse) {this.content = content;
            this.conversationType = conversationType;this.extra = extra;this.objectName = objectName;this.messageDirection = messageDirection;this.messageId = messageId;this.receivedStatus = receivedStatus;this.receivedTime = receivedTime;this.senderUserId = senderUserId;this.sentStatus = sentStatus;this.sentTime = sentTime;this.targetId = targetId;this.messageType = messageType;this.messageUId = messageUId;this.isLocalMessage = isLocalMessage;this.offLineMessage = offLineMessage;this.receiptResponse = receiptResponse;}return Message;}();RongIMLib.Message = Message;var MessageTag = function () {function MessageTag(isCounted, isPersited) {this.isCounted = isCounted;this.isPersited = isPersited;}MessageTag.prototype.getMessageTag = function () {if (this.isCounted && this.isPersited) {return 3;} else {if (this.isCounted) {return 2;} else {if (this.isPersited) {return 1;} else {if (!this.isCounted && !this.isPersited) {return 0;}}}}};MessageTag.getTagByStatus = function (status) {var statusMap = { 3: { isCounted: true, isPersited: true }, 2: { isCounted: true, isPersited: false }, 1: { isCounted: true, isPersited: true }, 0: { isCounted: true, isPersited: true } };return statusMap[status] || statusMap[3];};return MessageTag;}();RongIMLib.MessageTag = MessageTag;var PublicServiceMenuItem = function () {function PublicServiceMenuItem(id, name, type, sunMenuItems, url) {this.id = id;this.name = name;this.type = type;this.sunMenuItems = sunMenuItems;this.url = url;}return PublicServiceMenuItem;}();RongIMLib.PublicServiceMenuItem = PublicServiceMenuItem;var PublicServiceProfile = function () {function PublicServiceProfile(conversationType, introduction, menu, name, portraitUri, publicServiceId, hasFollowed, isGlobal) {this.conversationType = conversationType;this.introduction = introduction;this.menu = menu;this.name = name;this.portraitUri = portraitUri;this.publicServiceId = publicServiceId;this.hasFollowed = hasFollowed;this.isGlobal = isGlobal;}return PublicServiceProfile;}();RongIMLib.PublicServiceProfile = PublicServiceProfile;var UserInfo = function () {function UserInfo(id, name, portraitUri) {this.id = id;this.name = name;this.portraitUri = portraitUri;}return UserInfo;}();RongIMLib.UserInfo = UserInfo;var User = function () {function User(id, token) {this.id = id;this.token = token;}return User;}();RongIMLib.User = User;var Room = function () {function Room(id, user, mode, broadcastType, type) {this.id = id;this.user = user;this.mode = mode;this.broadcastType = broadcastType;this.type = type;}return Room;}();RongIMLib.Room = Room;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var ServerDataProvider = function () {function ServerDataProvider() {this.userStatusListener = null;this.Conversation = { watcher: new RongIMLib.Observer(), watch: function watch(_watcher) {this.watcher.add(_watcher);var conversationList = RongIMLib.RongIMClient._memoryStore.conversationList;this.watcher.emit(conversationList);}, unwatch: function unwatch(_watcher) {this.watcher.remove(_watcher);}, _notify: function _notify(conversationList) {this.watcher.emit(conversationList);} };}ServerDataProvider.prototype.init = function (appKey, options) {new RongIMLib.FeatureDectector(options.appCallback);};ServerDataProvider.prototype.connect = function (token, callback, userId, option) {RongIMLib.RongIMClient.bridge = RongIMLib.Bridge.getInstance();RongIMLib.RongIMClient._memoryStore.token = token;RongIMLib.RongIMClient._memoryStore.callback = callback;userId = userId || "";option = option || {};var isConnecting = false,isConnected = false;if (RongIMLib.Bridge._client && RongIMLib.Bridge._client.channel) {isConnecting = RongIMLib.Bridge._client.channel.connectionStatus == RongIMLib.ConnectionStatus.CONNECTING;isConnected = RongIMLib.Bridge._client.channel.connectionStatus == RongIMLib.ConnectionStatus.CONNECTED;}if (isConnected || isConnecting) {return;}var isGreater = RongIMLib.RongIMClient.otherDeviceLoginCount > 5;if (isGreater) {callback.onError(RongIMLib.ConnectionStatus.ULTRALIMIT);return;}if (option.force) {RongIMLib.RongIMClient._storageProvider.removeItem("servers");}RongIMLib.RongIMClient.bridge.setListener();RongIMLib.RongIMClient.bridge.connect(RongIMLib.RongIMClient._memoryStore.appKey, token, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(e) {if (e == RongIMLib.ConnectionState.TOKEN_INCORRECT || !e) {setTimeout(function () {callback.onTokenIncorrect();});} else {setTimeout(function () {callback.onError(e);});}} });};ServerDataProvider.prototype.reconnect = function (callback, config) {var store = RongIMLib.RongIMClient._memoryStore;var token = store.token;if (!token) {throw new Error("reconnect: token is empty.");}if (RongIMLib.Bridge._client && RongIMLib.Bridge._client.channel && RongIMLib.Bridge._client.channel.connectionStatus != RongIMLib.ConnectionStatus.CONNECTED && RongIMLib.Bridge._client.channel.connectionStatus != RongIMLib.ConnectionStatus.CONNECTING) {config = config || {};var key = config.auto ? "auto" : "custom";var handler = { auto: function auto() {var repeatConnect = function repeatConnect(options) {var step = options.step();var url = options.url;var ping = function ping() {RongIMLib.RongUtil.request({ url: url, success: function success() {options.done();}, error: function error() {repeat();} });};var repeat = function repeat() {var next = step();
                      if (next == "done") {var error = RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;options.done(error);return;}setTimeout(ping, next);};repeat();};var protocol = RongIMLib.RongIMClient._memoryStore.depend.protocol;var url = config.url || "cdn.ronghub.com/RongIMLib-2.2.6.min.js";var pathConfig = { protocol: protocol, path: url };url = RongIMLib.RongUtil.formatProtoclPath(pathConfig);var rate = config.rate || [100, 1000, 3000, 6000, 10000, 18000];rate.push("done");var opts = { url: url, step: function step() {var index = 0;return function () {var time = rate[index];index++;return time;};}, done: function done(error) {if (error) {callback.onError(error);return;}RongIMLib.RongIMClient.connect(token, callback);} };repeatConnect(opts);}, custom: function custom() {RongIMLib.RongIMClient.connect(token, callback);} };handler[key]();}};ServerDataProvider.prototype.logout = function () {RongIMLib.RongIMClient.bridge.disconnect();RongIMLib.RongIMClient.bridge = null;};ServerDataProvider.prototype.disconnect = function () {RongIMLib.RongIMClient.bridge.disconnect();};ServerDataProvider.prototype.sendReceiptResponse = function (conversationType, targetId, sendCallback) {var rspkey = RongIMLib.Bridge._client.userId + conversationType + targetId + "RECEIVED",me = this;if (RongIMLib.RongUtil.supportLocalStorage()) {var valObj = JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(rspkey));if (valObj) {var vals = [];for (var key in valObj) {var tmp = {};tmp[key] = valObj[key].uIds;valObj[key].isResponse || vals.push(tmp);}if (vals.length == 0) {sendCallback.onSuccess();return;}var interval = setInterval(function () {if (vals.length == 1) {clearInterval(interval);}var obj = vals.splice(0, 1)[0];var rspMsg = new RongIMLib.ReadReceiptResponseMessage({ receiptMessageDic: obj });me.sendMessage(conversationType, targetId, rspMsg, { onSuccess: function onSuccess(msg) {var senderUserId = RongIMLib.MessageUtil.getFirstKey(obj);valObj[senderUserId].isResponse = true;RongIMLib.RongIMClient._storageProvider.setItem(rspkey, JSON.stringify(valObj));sendCallback.onSuccess(msg);}, onError: function onError(error, msg) {sendCallback.onError(error, msg);} });}, 200);} else {sendCallback.onSuccess();}} else {sendCallback.onSuccess();}};ServerDataProvider.prototype.sendTypingStatusMessage = function (conversationType, targetId, messageName, sendCallback) {var me = this;if (messageName in RongIMLib.RongIMClient.MessageParams) {me.sendMessage(conversationType, targetId, RongIMLib.TypingStatusMessage.obtain(RongIMLib.RongIMClient.MessageParams[messageName].objectName, ""), { onSuccess: function onSuccess() {setTimeout(function () {sendCallback.onSuccess();});}, onError: function onError(errorCode) {setTimeout(function () {sendCallback.onError(errorCode, null);});}, onBefore: function onBefore() {} });}};ServerDataProvider.prototype.sendRecallMessage = function (content, sendMessageCallback) {var msg = new RongIMLib.RecallCommandMessage({ conversationType: content.conversationType, targetId: content.targetId, sentTime: content.sentTime, messageUId: content.messageUId, extra: content.extra, user: content.user });this.sendMessage(content.conversationType, content.senderUserId, msg, sendMessageCallback, false, null, null, 2);};ServerDataProvider.prototype.sendTextMessage = function (conversationType, targetId, content, sendMessageCallback) {var msgContent = RongIMLib.TextMessage.obtain(content);this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);};ServerDataProvider.prototype.getRemoteHistoryMessages = function (conversationType, targetId, timestamp, count, callback, config) {if (count <= 1) {throw new Error("the count must be greater than 1.");}config = config || {};var order = config.order || 0;var getKey = function getKey() {return [conversationType, targetId, "_", order].join("");};var key = getKey();if (!RongIMLib.RongUtil.isNumber(timestamp)) {timestamp = RongIMLib.RongIMClient._memoryStore.lastReadTime.get(key);}var memoryStore = RongIMLib.RongIMClient._memoryStore;var historyMessageLimit = memoryStore.historyMessageLimit;var limit = historyMessageLimit.get(key) || {};var hasMore = limit.hasMore;var isFecth = hasMore || limit.time != timestamp;if (!isFecth && order == 0) {return callback.onSuccess([], hasMore);}var modules = new RongIMLib.RongIMClient.Protobuf.HistoryMsgInput();modules.setTargetId(targetId);modules.setTime(timestamp);modules.setCount(count);modules.setOrder(order);var topic = HistoryMsgType[conversationType] || HistoryMsgType[RongIMLib.ConversationType.PRIVATE];RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, { onSuccess: function onSuccess(data) {var fetchTime = RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime);RongIMLib.RongIMClient._memoryStore.lastReadTime.set(key, fetchTime);historyMessageLimit.set(key, { hasMore: !!data.hasMsg, time: fetchTime });var list = data.list.reverse(),tempMsg = null,tempDir;var read = RongIMLib.SentStatus.READ;if (RongIMLib.RongUtil.supportLocalStorage()) {for (var i = 0, len = list.length; i < len; i++) {tempMsg = RongIMLib.MessageUtil.messageParser(list[i]);tempDir = JSON.parse(RongIMLib.RongIMClient._storageProvider.getItem(RongIMLib.Bridge._client.userId + tempMsg.messageUId + "SENT"));if (tempDir) {tempMsg.receiptResponse || (tempMsg.receiptResponse = {});
                      tempMsg.receiptResponse[tempMsg.messageUId] = tempDir.count;}tempMsg.sentStatus = read;tempMsg.targetId = targetId;list[i] = tempMsg;}} else {for (var i = 0, len = list.length; i < len; i++) {var tempMsg = RongIMLib.MessageUtil.messageParser(list[i]);tempMsg.sentStatus = read;list[i] = tempMsg;}}setTimeout(function () {callback.onSuccess(list, !!data.hasMsg);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "HistoryMessagesOuput");};ServerDataProvider.prototype.hasRemoteUnreadMessages = function (token, callback) {var xss = null;window.RCCallback = function (x) {setTimeout(function () {callback.onSuccess(!!+x.status);});xss.parentNode.removeChild(xss);};xss = document.createElement("script");xss.src = RongIMLib.RongIMClient._memoryStore.depend.api + "/message/exist.js?appKey=" + encodeURIComponent(RongIMLib.RongIMClient._memoryStore.appKey) + "&token=" + encodeURIComponent(token) + "&callBack=RCCallback&_=" + RongIMLib.RongUtil.getTimestamp();document.body.appendChild(xss);xss.onerror = function () {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.UNKNOWN);});xss.parentNode.removeChild(xss);};};ServerDataProvider.prototype.getRemoteConversationList = function (callback, conversationTypes, count) {var modules = new RongIMLib.RongIMClient.Protobuf.RelationsInput(),self = this;modules.setType(1);if (typeof count == "undefined") {modules.setCount(0);} else {modules.setCount(count);}RongIMLib.RongIMClient.bridge.queryMsg(26, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(list) {if (list.info) {list.info = list.info.reverse();for (var i = 0, len = list.info.length; i < len; i++) {RongIMLib.RongIMClient.getInstance().pottingConversation(list.info[i]);}}var conversations = RongIMLib.RongIMClient._memoryStore.conversationList;setTimeout(function () {if (conversationTypes) {return callback.onSuccess(self.filterConversations(conversationTypes, conversations));}callback.onSuccess(conversations);});}, onError: function onError(error) {callback.onError(error);} }, "RelationsOutput");};ServerDataProvider.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.ChannelInvitationInput();modules.setUsers(userIdList);RongIMLib.RongIMClient.bridge.queryMsg(0, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.createDiscussion = function (name, userIdList, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.CreateDiscussionInput(),self = this;modules.setName(name);RongIMLib.RongIMClient.bridge.queryMsg(1, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(discussId) {if (userIdList.length > 0) {self.addMemberToDiscussion(discussId, userIdList, { onSuccess: function onSuccess() {}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });}setTimeout(function () {callback.onSuccess(discussId);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "CreateDiscussionOutput");};ServerDataProvider.prototype.getDiscussion = function (discussionId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.ChannelInfoInput();modules.setNothing(1);RongIMLib.RongIMClient.bridge.queryMsg(4, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} }, "ChannelInfoOutput");};ServerDataProvider.prototype.quitDiscussion = function (discussionId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.LeaveChannelInput();modules.setNothing(1);RongIMLib.RongIMClient.bridge.queryMsg(7, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} });};ServerDataProvider.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.ChannelEvictionInput();modules.setUser(userId);RongIMLib.RongIMClient.bridge.queryMsg(9, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} });};ServerDataProvider.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.ModifyPermissionInput();modules.setOpenStatus(status.valueOf());RongIMLib.RongIMClient.bridge.queryMsg(11, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess(x) {setTimeout(function () {callback.onSuccess();});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);
                });} });};ServerDataProvider.prototype.setDiscussionName = function (discussionId, name, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RenameChannelInput();modules.setName(name);RongIMLib.RongIMClient.bridge.queryMsg(12, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(errcode) {callback.onError(errcode);} });};ServerDataProvider.prototype.joinChatRoom = function (chatroomId, messageCount, callback) {var e = new RongIMLib.RongIMClient.Protobuf.ChrmInput();e.setNothing(1);RongIMLib.Bridge._client.chatroomId = chatroomId;RongIMLib.RongIMClient.bridge.queryMsg(19, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, { onSuccess: function onSuccess() {var navi = RongIMLib.RongIMClient.getInstance().getNavi();var isOpenKVStorage = navi.kvStorage;if (isOpenKVStorage) {RongIMLib.RongIMClient._dataAccessProvider.pullChatroomEntry(chatroomId, 0, { onSuccess: function onSuccess(result) {RongIMLib.ChrmKVHandler.setEntries(chatroomId, result);setTimeout(function () {callback.onSuccess();});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} });} else {setTimeout(function () {callback.onSuccess();});}var modules = new RongIMLib.RongIMClient.Protobuf.ChrmPullMsg();messageCount == 0 && (messageCount = -1);modules.setCount(messageCount);modules.setSyncTime(0);RongIMLib.Bridge._client.queryMessage("chrmPull", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, { onSuccess: function onSuccess(collection) {var list = collection.list;var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);var latestMessage = list[list.length - 1];if (latestMessage) {latestMessage = RongIMLib.MessageUtil.messageParser(latestMessage);sync = latestMessage.sentTime;}RongIMLib.RongIMClient._memoryStore.lastReadTime.set(chatroomId + RongIMLib.Bridge._client.userId + "CST", sync);var _client = RongIMLib.Bridge._client;for (var i = 0, mlen = list.length; i < mlen; i++) {var uId = "R" + list[i].msgId;if (!(uId in _client.cacheMessageIds)) {_client.cacheMessageIds[uId] = true;var cacheUIds = RongIMLib.RongUtil.keys(_client.cacheMessageIds);if (cacheUIds.length > 10) {uId = cacheUIds[0];delete _client.cacheMessageIds[uId];}if (RongIMLib.RongIMClient._memoryStore.filterMessages.length > 0) {for (var j = 0, flen = RongIMLib.RongIMClient._memoryStore.filterMessages.length; j < flen; j++) {if (RongIMLib.RongIMClient.MessageParams[RongIMLib.RongIMClient._memoryStore.filterMessages[j]].objectName != list[i].classname) {_client.handler.onReceived(list[i]);}}} else {_client.handler.onReceived(list[i]);}}}}, onError: function onError(x) {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.CHATROOM_HISMESSAGE_ERROR);});} }, "DownStreamMessages");}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "ChrmOutput");};ServerDataProvider.prototype.getChatRoomInfo = function (chatRoomId, count, order, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.QueryChatroomInfoInput();modules.setCount(count);modules.setOrder(order);RongIMLib.RongIMClient.bridge.queryMsg("queryChrmI", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatRoomId, { onSuccess: function onSuccess(ret) {var userInfos = ret.userInfos;userInfos.forEach(function (item) {item.time = RongIMLib.MessageUtil.int64ToTimestamp(item.time);});setTimeout(function () {callback.onSuccess(ret);});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} }, "QueryChatroomInfoOutput");};ServerDataProvider.prototype.quitChatRoom = function (chatroomId, callback) {var e = new RongIMLib.RongIMClient.Protobuf.ChrmInput();e.setNothing(1);RongIMLib.RongIMClient.bridge.queryMsg(17, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} }, "ChrmOutput");};ServerDataProvider.prototype.setChatroomHisMessageTimestamp = function (chatRoomId, timestamp) {RongIMLib.RongIMClient._memoryStore.lastReadTime.set("chrhis_" + chatRoomId, timestamp);};ServerDataProvider.prototype.getChatRoomHistoryMessages = function (chatRoomId, count, order, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.HistoryMsgInput();modules.setTargetId(chatRoomId);var timestamp = RongIMLib.RongIMClient._memoryStore.lastReadTime.get("chrhis_" + chatRoomId) || 0;modules.setTime(timestamp);modules.setCount(count);modules.setOrder(order);RongIMLib.RongIMClient.bridge.queryMsg(34, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(data) {RongIMLib.RongIMClient._memoryStore.lastReadTime.set("chrhis_" + chatRoomId, RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime));var list = data.list.reverse();for (var i = 0, len = list.length; i < len; i++) {list[i] = RongIMLib.MessageUtil.messageParser(list[i]);}setTimeout(function () {callback.onSuccess(list, !!data.hasMsg);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "HistoryMsgOuput");
          };ServerDataProvider.prototype.setChatroomEntry = function (chatroomId, chatroomEntry, callback) {var opt = RongIMLib.ChatroomEntityOpt.UPDATE;var key = chatroomEntry.key,value = chatroomEntry.value;var isKeyInValid = !RongIMLib.RongUtil.isLengthLimit(key, RongIMLib.ChatroomEntityLimit.KEY, 1) || !RongIMLib.ChrmKVHandler.isKeyValid(key);var isValueInValid = !RongIMLib.RongUtil.isLengthLimit(value, RongIMLib.ChatroomEntityLimit.VALUE, 1);if (isKeyInValid || isValueInValid) {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.BIZ_ERROR_INVALID_PARAMETER);});} else {this.refreshChatroomEntry(chatroomId, chatroomEntry, opt, callback);}};ServerDataProvider.prototype.forceSetChatroomEntry = function (chatroomId, chatroomEntry, callback) {chatroomEntry.isOverwrite = true;this.setChatroomEntry(chatroomId, chatroomEntry, callback);};ServerDataProvider.prototype.removeChatroomEntry = function (chatroomId, chatroomEntry, callback) {var opt = RongIMLib.ChatroomEntityOpt.DELETE;var key = chatroomEntry.key;var isKeyInValid = !RongIMLib.RongUtil.isLengthLimit(key, RongIMLib.ChatroomEntityLimit.KEY, 1) || !RongIMLib.ChrmKVHandler.isKeyValid(key);if (isKeyInValid) {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.BIZ_ERROR_INVALID_PARAMETER);});} else {this.refreshChatroomEntry(chatroomId, chatroomEntry, opt, callback);}};ServerDataProvider.prototype.forceRemoveChatroomEntry = function (chatroomId, chatroomEntry, callback) {chatroomEntry.isOverwrite = true;this.removeChatroomEntry(chatroomId, chatroomEntry, callback);};ServerDataProvider.prototype.refreshChatroomEntry = function (chatroomId, chatroomEntry, chatroomEntryOpt, callback) {var modules, topic;var key = chatroomEntry.key,value = chatroomEntry.value || "",extra = chatroomEntry.notificationExtra;if (chatroomEntryOpt === RongIMLib.ChatroomEntityOpt.DELETE) {modules = new RongIMLib.RongIMClient.Protobuf.DeleteChrmKV();topic = "delKV";} else {modules = new RongIMLib.RongIMClient.Protobuf.SetChrmKV();topic = "setKV";}var status = RongIMLib.RongInnerTools.getChrmEntityStatus(chatroomEntry, chatroomEntryOpt);var currentUserId = RongIMLib.RongIMClient.getInstance().getCurrentUserId();var entry = { key: key, value: value, uid: currentUserId };if (status) {entry.status = status;}modules.setEntry(entry);if (chatroomEntry.isSendNotification) {modules.setBNotify(true);var msgModules = new RongIMLib.RongIMClient.Protobuf.UpStreamMessage();var msg = new RongIMLib.ChrmKVNotificationMessage({ key: key, value: value, extra: extra, type: chatroomEntryOpt });msgModules.setSessionId(RongIMLib.RongIMClient.MessageParams[msg.messageName].msgTag.getMessageTag());msgModules.setClassname(RongIMLib.RongIMClient.MessageParams[msg.messageName].objectName);msgModules.setContent(msg.encode());modules.setNotification(msgModules);modules.setType(RongIMLib.ConversationType.CHATROOM);}RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, { onSuccess: function onSuccess(ret) {var currentUserId = RongIMLib.RongIMClient.getInstance().getCurrentUserId();RongIMLib.ChrmKVHandler.setEntry(chatroomId, chatroomEntry, status, currentUserId);setTimeout(function () {callback.onSuccess(!!ret);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "ChrmOutput");};ServerDataProvider.prototype.getChatroomEntry = function (chatroomId, key, callback) {var value = RongIMLib.ChrmKVHandler.getEntityValue(chatroomId, key);setTimeout(function () {if (RongIMLib.RongUtil.isEmpty(value)) {callback.onError(RongIMLib.ErrorCode.CHATROOM_KEY_NOT_EXIST);} else {callback.onSuccess(value);}});};ServerDataProvider.prototype.getAllChatroomEntries = function (chatroomId, callback) {setTimeout(function () {var entries = RongIMLib.ChrmKVHandler.getAllEntityValue(chatroomId);callback.onSuccess(entries);});};ServerDataProvider.prototype.pullChatroomEntry = function (chatroomId, time, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.QueryChrmKV();modules.setTimestamp(time);RongIMLib.RongIMClient.bridge.queryMsg("pullKV", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "ChrmKVOutput");};ServerDataProvider.prototype.setMessageStatus = function (conversationType, targetId, timestamp, status, callback) {setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.addToBlacklist = function (userId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.Add2BlackListInput();modules.setUserId(userId);RongIMLib.RongIMClient.bridge.queryMsg(21, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.getBlacklist = function (callback) {var modules = new RongIMLib.RongIMClient.Protobuf.QueryBlackListInput();modules.setNothing(1);RongIMLib.RongIMClient.bridge.queryMsg(23, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(list) {setTimeout(function () {callback.onSuccess(list);
                });}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "QueryBlackListOutput");};ServerDataProvider.prototype.getBlacklistStatus = function (userId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.BlackListStatusInput();modules.setUserId(userId);RongIMLib.RongIMClient.bridge.queryMsg(24, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {setTimeout(function () {callback.onSuccess(RongIMLib.BlacklistStatus[status]);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.removeFromBlacklist = function (userId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RemoveFromBlackListInput();modules.setUserId(userId);RongIMLib.RongIMClient.bridge.queryMsg(22, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess() {setTimeout(function () {callback.onSuccess();});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.getFileToken = function (fileType, callback) {if (!/(1|2|3|4)/.test(fileType.toString())) {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);});return;}var modules = new RongIMLib.RongIMClient.Protobuf.GetQNupTokenInput();modules.setType(fileType);RongIMLib.RongIMClient.bridge.queryMsg(30, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} }, "GetQNupTokenOutput");};ServerDataProvider.prototype.getFileUrl = function (fileType, fileName, oriName, callback) {if (!/(1|2|3|4)/.test(fileType.toString())) {setTimeout(function () {callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);});return;}var modules = new RongIMLib.RongIMClient.Protobuf.GetQNdownloadUrlInput();modules.setType(fileType);modules.setKey(fileName);if (oriName) {modules.setFileName(oriName);}RongIMLib.RongIMClient.bridge.queryMsg(31, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} }, "GetQNdownloadUrlOutput");};ServerDataProvider.prototype.getPullSetting = function (callback) {var modules = new RongIMLib.RongIMClient.Protobuf.PullUserSettingInput();var version = parseInt(RongIMLib.RongIMClient.sdkver);modules.setVersion(version);RongIMLib.RongIMClient.bridge.queryMsg("pullUS", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(result) {result = result || {};result.version = RongIMLib.MessageUtil.int64ToTimestamp(result.version);setTimeout(function () {callback.onSuccess(result);});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} }, "PullUserSettingOutput");};ServerDataProvider.prototype.setOfflineMessageDuration = function (duration, callback) {this.getPullSetting({ onSuccess: function onSuccess(result) {var modules = new RongIMLib.RongIMClient.Protobuf.GetQNupTokenOutput();var version = result.version;modules.setDeadline(version);modules.setToken(duration + "");RongIMLib.RongIMClient.bridge.queryMsg("setOfflineMsgDur", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(data) {setTimeout(function () {callback.onSuccess(data);});}, onError: function onError(errcode) {setTimeout(function () {callback.onError(errcode);});} });}, onError: callback.onError });};ServerDataProvider.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback, mentiondMsg, pushText, appData, methodType, params) {if (!RongIMLib.Bridge._client.channel) {setTimeout(function () {sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE, null);});return;}if (!RongIMLib.Bridge._client.channel.socket.socket.connected) {setTimeout(function () {sendCallback.onError(RongIMLib.ErrorCode.TIMEOUT, null);});throw new Error("connect is timeout! postion:sendMessage");}var isGroup = conversationType == RongIMLib.ConversationType.DISCUSSION || conversationType == RongIMLib.ConversationType.GROUP;var modules = new RongIMLib.RongIMClient.Protobuf.UpStreamMessage();if (mentiondMsg && isGroup) {modules.setSessionId(7);} else {modules.setSessionId(RongIMLib.RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());}pushText && modules.setPushText(pushText);appData && modules.setAppData(appData);if (isGroup && messageContent.messageName == RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"]) {var rspMsg = messageContent;if (rspMsg.receiptMessageDic) {var ids = [];for (var key in rspMsg.receiptMessageDic) {ids.push(key);}modules.setUserId(ids);}}if (isGroup && messageContent.messageName == RongIMLib.RongIMClient.MessageType["SyncReadStatusMessage"]) {modules.setUserId(RongIMLib.Bridge._client.userId);}params = params || {};var userIds = params.userIds;
            if (userIds) {modules.setUserId(userIds);}var flag = 0;if (params.isPush || params.isVoipPush) {flag |= 1;}if (params.isFilerWhiteBlacklist) {flag |= 2;}modules.setConfigFlag(flag);modules.setClassname(RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName);modules.setContent(messageContent.encode());var content = modules.toArrayBuffer();if (Object.prototype.toString.call(content) == "[object ArrayBuffer]") {content = [].slice.call(new Int8Array(content));}var me = this,msg = new RongIMLib.Message();var c = this.getConversation(conversationType, targetId);if (RongIMLib.RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag() == 3) {if (!c) {c = RongIMLib.RongIMClient.getInstance().createConversation(conversationType, targetId, "");}c.sentTime = new Date().getTime();c.sentStatus = RongIMLib.SentStatus.SENDING;c.senderUserName = "";c.senderUserId = RongIMLib.Bridge._client.userId;c.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;c.latestMessage = msg;c.unreadMessageCount = 0;RongIMLib.RongIMClient._dataAccessProvider.addConversation(c, { onSuccess: function onSuccess(data) {} });}RongIMLib.RongIMClient._memoryStore.converStore = c;msg.content = messageContent;msg.conversationType = conversationType;msg.senderUserId = RongIMLib.Bridge._client.userId;msg.objectName = RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName;msg.targetId = targetId;msg.sentTime = new Date().getTime();msg.messageDirection = RongIMLib.MessageDirection.SEND;msg.sentStatus = RongIMLib.SentStatus.SENT;msg.messageType = messageContent.messageName;RongIMLib.RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, { onSuccess: function onSuccess(data) {if (data && data.timestamp) {RongIMLib.RongIMClient._memoryStore.lastReadTime.set("converST_" + RongIMLib.Bridge._client.userId + conversationType + targetId, data.timestamp);}if ((conversationType == RongIMLib.ConversationType.DISCUSSION || conversationType == RongIMLib.ConversationType.GROUP) && messageContent.messageName == RongIMLib.RongIMClient.MessageType["ReadReceiptRequestMessage"]) {var reqMsg = msg.content;var sentkey = RongIMLib.Bridge._client.userId + reqMsg.messageUId + "SENT";RongIMLib.RongIMClient._storageProvider.setItem(sentkey, JSON.stringify({ count: 0, dealtime: data.timestamp, userIds: {} }));}if (RongIMLib.RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {var cacheConversation = RongIMLib.RongIMClient._memoryStore.converStore;cacheConversation.sentStatus = msg.sentStatus;cacheConversation.latestMessage = msg;me.updateConversation(cacheConversation);var Conversation = RongIMLib.RongIMClient._dataAccessProvider.Conversation;Conversation._notify(RongIMLib.RongIMClient._memoryStore.conversationList);RongIMLib.RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, { onSuccess: function onSuccess(ret) {msg = ret;msg.messageUId = data.messageUId;msg.sentTime = data.timestamp;msg.sentStatus = RongIMLib.SentStatus.SENT;msg.messageId = data.messageId;RongIMLib.RongIMClient._dataAccessProvider.updateMessage(msg);}, onError: function onError() {} });}setTimeout(function () {cacheConversation && me.updateConversation(cacheConversation);msg.sentTime = data.timestamp;msg.messageUId = data.messageUId;sendCallback.onSuccess(msg);});}, onError: function onError(errorCode, _msg) {msg.sentStatus = RongIMLib.SentStatus.FAILED;if (_msg) {msg.messageUId = _msg.messageUId;msg.sentTime = _msg.sentTime;}if (RongIMLib.RongIMClient.MessageParams[msg.messageType].msgTag.getMessageTag() == 3) {RongIMLib.RongIMClient._memoryStore.converStore.latestMessage = msg;}RongIMLib.RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, msg, { onSuccess: function onSuccess(ret) {msg.messageId = ret.messageId;RongIMLib.RongIMClient._dataAccessProvider.updateMessage(msg);}, onError: function onError() {} });setTimeout(function () {sendCallback.onError(errorCode, msg);});} }, null, methodType);sendCallback.onBefore && sendCallback.onBefore(RongIMLib.MessageIdHandler.messageId);msg.messageId = RongIMLib.MessageIdHandler.messageId + "";};ServerDataProvider.prototype.setConnectionStatusListener = function (listener) {if (RongIMLib.RongUtil.isObject(listener) && RongIMLib.RongUtil.isFunction(listener.onChanged)) {RongIMLib.RongIMClient.statusListeners.push(listener.onChanged);}};ServerDataProvider.prototype.setOnReceiveMessageListener = function (listener) {if (RongIMLib.RongUtil.isObject(listener) && RongIMLib.RongUtil.isFunction(listener.onReceived)) {RongIMLib.RongIMClient.messageListeners.push(listener.onReceived);}};ServerDataProvider.prototype.registerMessageType = function (messageType, objectName, messageTag, messageContent, searchProps) {if (!messageType) {throw new Error("messageType can't be empty,postion -> registerMessageType");}if (!objectName) {throw new Error("objectName can't be empty,postion -> registerMessageType");}if (Object.prototype.toString.call(messageContent) == "[object Array]") {var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent, messageType);RongIMLib.RongIMClient.RegisterMessage[messageType] = regMsg;} else {if (Object.prototype.toString.call(messageContent) == "[object Function]" || Object.prototype.toString.call(messageContent) == "[object Object]") {if (!messageContent.encode) {throw new Error("encode method has not realized or messageName is undefined-> registerMessageType");
                }if (!messageContent.decode) {throw new Error("decode method has not realized -> registerMessageType");}} else {throw new Error("The index of 3 parameter was wrong type  must be object or function or array-> registerMessageType");}}registerMessageTypeMapping[objectName] = messageType;};ServerDataProvider.prototype.registerMessageTypes = function (messages) {var types = [];var getProtos = function getProtos(proto) {var protos = [];for (var p in proto) {protos.push(p);}return protos;};for (var name in messages) {var message = messages[name];var proto = message.proto;var protos = getProtos(proto);var flag = message.flag || 3;var tag = RongIMLib.MessageTag.getTagByStatus(flag);flag = new RongIMLib.MessageTag(tag.isCounted, tag.isPersited);types.push({ type: name, name: message.name, flag: flag, protos: protos });}var register = function register(message) {var type = message.type;var name = message.name;var flag = message.flag;var protos = message.protos;RongIMLib.RongIMClient.registerMessageType(type, name, flag, protos);};for (var i = 0, len = types.length; i < len; i++) {var message = types[i];register(message);}};ServerDataProvider.prototype.addConversation = function (conversation, callback) {var isAdd = true;for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {if (RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType === conversation.conversationType && RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId === conversation.targetId) {RongIMLib.RongIMClient._memoryStore.conversationList.unshift(RongIMLib.RongIMClient._memoryStore.conversationList.splice(i, 1)[0]);isAdd = false;break;}}if (isAdd) {RongIMLib.RongIMClient._memoryStore.conversationList.unshift(conversation);}callback && callback.onSuccess(true);};ServerDataProvider.prototype.updateConversation = function (conversation) {var conver;for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {var item = RongIMLib.RongIMClient._memoryStore.conversationList[i];if (conversation.conversationType === item.conversationType && conversation.targetId === item.targetId) {conversation.conversationTitle && (item.conversationTitle = conversation.conversationTitle);conversation.senderUserName && (item.senderUserName = conversation.senderUserName);conversation.senderPortraitUri && (item.senderPortraitUri = conversation.senderPortraitUri);conversation.latestMessage && (item.latestMessage = conversation.latestMessage);conversation.sentStatus && (item.sentStatus = conversation.sentStatus);break;}}return conver;};ServerDataProvider.prototype.removeConversation = function (conversationType, targetId, callback) {var mod = new RongIMLib.RongIMClient.Protobuf.RelationsInput();mod.setType(conversationType);RongIMLib.RongIMClient.bridge.queryMsg(27, RongIMLib.MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, { onSuccess: function onSuccess() {var isRemoved = false;var conversations = RongIMLib.RongIMClient._memoryStore.conversationList;var len = conversations.length;for (var i = 0; i < len; i++) {if (conversations[i].conversationType == conversationType && targetId == conversations[i].targetId) {conversations.splice(i, 1);isRemoved = true;break;}}isRemoved && RongIMLib.RongIMClient._dataAccessProvider.Conversation._notify(RongIMLib.RongIMClient._memoryStore.conversationList);callback.onSuccess(true);}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.getMessage = function (messageId, callback) {callback.onSuccess(new RongIMLib.Message());};ServerDataProvider.prototype.addMessage = function (conversationType, targetId, message, callback) {if (callback) {callback.onSuccess(message);}};ServerDataProvider.prototype.removeMessage = function (conversationType, targetId, messages, callback) {RongIMLib.RongIMClient.getInstance().deleteRemoteMessages(conversationType, targetId, messages, callback);};ServerDataProvider.prototype.removeLocalMessage = function (conversationType, targetId, timestamps, callback) {callback.onSuccess(true);};ServerDataProvider.prototype.updateMessage = function (message, callback) {if (callback) {callback.onSuccess(message);}};ServerDataProvider.prototype.deleteRemoteMessages = function (conversationType, targetId, messages, callback) {if (!RongIMLib.RongIMClient.Protobuf.DeleteMsgInput) {throw new Error("SDK Protobuf version is too low");}var modules = new RongIMLib.RongIMClient.Protobuf.DeleteMsgInput();var msgs = [];RongIMLib.RongUtil.forEach(messages, function (msg) {msgs.push({ msgId: msg.messageUId, msgDataTime: msg.sentTime, direct: msg.messageDirection });});modules.setType(conversationType);modules.setConversationId(targetId);modules.setMsgs(msgs);RongIMLib.RongIMClient.bridge.queryMsg("delMsg", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, { onSuccess: function onSuccess(result) {callback.onSuccess(result);}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} }, "DeleteMsgOutput");};ServerDataProvider.prototype.clearRemoteHistoryMessages = function (params, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.CleanHisMsgInput();var conversationType = params.conversationType;var _topic = { 1: "cleanPMsg", 2: "cleanDMsg", 3: "cleanGMsg", 5: "cleanCMsg", 6: "cleanSMsg" };
            var topic = _topic[conversationType];if (!topic) {callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TYPE_ERROR);return;}var timestamp = params.timestamp;if (typeof timestamp != "number") {callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TIME_ERROR);return;}modules.setDataTime(timestamp);var targetId = params.targetId;modules.setTargetId(targetId);RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, { onSuccess: function onSuccess(result) {callback.onSuccess(!result);}, onError: function onError(error) {if (error == 1) {error = RongIMLib.ErrorCode.CLEAR_HIS_ERROR;}setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.clearHistoryMessages = function (params, callback) {this.clearRemoteHistoryMessages(params, callback);};ServerDataProvider.prototype.clearMessages = function (conversationType, targetId, callback) {};ServerDataProvider.prototype.updateMessages = function (conversationType, targetId, key, value, callback) {var me = this;if (key == "readStatus") {if (RongIMLib.RongIMClient._memoryStore.conversationList.length > 0) {me.getConversationList({ onSuccess: function onSuccess(list) {Array.forEach(list, function (conver) {if (conver.conversationType == conversationType && conver.targetId == targetId) {conver.unreadMessageCount = 0;}});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} }, null);}}setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.getConversation = function (conversationType, targetId, callback) {var conver = null;for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {if (RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType == conversationType && RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId == targetId) {conver = RongIMLib.RongIMClient._memoryStore.conversationList[i];if (RongIMLib.RongUtil.supportLocalStorage()) {var count = RongIMLib.UnreadCountHandler.get(conversationType, targetId);if (conver.unreadMessageCount == 0) {conver.unreadMessageCount = Number(count);}}}}setTimeout(function () {callback && callback.onSuccess(conver);});return conver;};ServerDataProvider.prototype.filterConversations = function (types, list) {var conversaions = [];RongIMLib.RongUtil.forEach(types, function (type) {RongIMLib.RongUtil.forEach(list, function (conversation) {if (conversation.conversationType == type) {conversaions.push(conversation);}});});return conversaions;};ServerDataProvider.prototype.getConversationList = function (callback, conversationTypes, count, isHidden) {var that = this;var isSync = RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList;var list = RongIMLib.RongIMClient._memoryStore.conversationList;var isLocalInclude = list.length > count;if (!isSync && isLocalInclude) {setTimeout(function () {var localList = list.slice(0, count);if (conversationTypes) {localList = that.filterConversations(conversationTypes, localList);}callback.onSuccess(localList);});return;}RongIMLib.RongIMClient.getInstance().getRemoteConversationList({ onSuccess: function onSuccess(list) {if (RongIMLib.RongUtil.supportLocalStorage()) {Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (item) {var count = RongIMLib.UnreadCountHandler.get(item.conversationType, item.targetId);if (item.unreadMessageCount == 0) {item.unreadMessageCount = Number(count);}});}RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList = false;setTimeout(function () {callback.onSuccess(list);});}, onError: function onError(errorcode) {setTimeout(function () {callback.onError(errorcode);});} }, conversationTypes, count, isHidden);};ServerDataProvider.prototype.clearCache = function () {var memoryStore = RongIMLib.RongIMClient._memoryStore || {};memoryStore.conversationList = [];memoryStore.isSyncRemoteConverList = true;};ServerDataProvider.prototype.clearConversations = function (conversationTypes, callback) {Array.forEach(conversationTypes, function (conversationType) {Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (conver) {if (conversationType == conver.conversationType) {RongIMLib.RongIMClient.getInstance().removeConversation(conver.conversationType, conver.targetId, { onSuccess: function onSuccess() {}, onError: function onError() {} });}});});setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.setMessageContent = function (messageId, content, objectname) {};ServerDataProvider.prototype.setMessageSearchField = function (messageId, content, searchFiles) {};ServerDataProvider.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback, objectname, order) {var config = { objectname: objectname, order: order };RongIMLib.RongIMClient.getInstance().getRemoteHistoryMessages(conversationType, targetId, timestamp, count, callback, config);};ServerDataProvider.prototype.getTotalUnreadCount = function (callback, conversationTypes) {var count = RongIMLib.UnreadCountHandler.getAll(conversationTypes);callback.onSuccess(count);};ServerDataProvider.prototype.getConversationUnreadCount = function (conversationTypes, callback) {var count = 0;Array.forEach(conversationTypes, function (converType) {Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (conver) {if (conver.conversationType == converType) {count += conver.unreadMessageCount;
                }});});setTimeout(function () {callback.onSuccess(count);});};ServerDataProvider.prototype.setUnreadCount = function (conversationType, targetId, count, sentTime) {sentTime = sentTime || new Date().getTime();RongIMLib.UnreadCountHandler.set(conversationType, targetId, count, sentTime);};ServerDataProvider.prototype.getUnreadCount = function (conversationType, targetId, callback) {var unreadCount = RongIMLib.UnreadCountHandler.get(conversationType, targetId);setTimeout(function () {callback.onSuccess(unreadCount || 0);});};ServerDataProvider.prototype.cleanMentioneds = function (conver) {if (conver) {conver.mentionedMsg = null;var targetId = conver.targetId;var conversationType = conver.conversationType;var mentioneds = RongIMLib.RongIMClient._storageProvider.getItem("mentioneds_" + RongIMLib.Bridge._client.userId + "_" + conversationType + "_" + targetId);if (mentioneds) {var info = JSON.parse(mentioneds);delete info[conversationType + "_" + targetId];if (!RongIMLib.MessageUtil.isEmpty(info)) {RongIMLib.RongIMClient._storageProvider.setItem("mentioneds_" + RongIMLib.Bridge._client.userId + "_" + conversationType + "_" + targetId, JSON.stringify(info));} else {RongIMLib.RongIMClient._storageProvider.removeItem("mentioneds_" + RongIMLib.Bridge._client.userId + "_" + conversationType + "_" + targetId);}}}};ServerDataProvider.prototype.clearUnreadCountByTimestamp = function (conversationType, targetId, timestamp, callback) {setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.clearUnreadCount = function (conversationType, targetId, callback) {var me = this;RongIMLib.UnreadCountHandler.remove(conversationType, targetId);this.getConversation(conversationType, targetId, { onSuccess: function onSuccess(conver) {conver = conver || new RongIMLib.Conversation();var isNotifyConversation = conver.unreadMessageCount;if (conver) {conver.unreadMessageCount = 0;me.cleanMentioneds(conver);}setTimeout(function () {callback.onSuccess(true);isNotifyConversation && RongIMLib.RongIMClient._dataAccessProvider.Conversation._notify(RongIMLib.RongIMClient._memoryStore.conversationList);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.clearTotalUnreadCount = function (callback) {var list = RongIMLib.RongIMClient._memoryStore.conversationList;var me = this;var isNotifyConversation = false;if (list) {for (var i = 0; i < list.length; i++) {var conver = list[i];if (conver) {isNotifyConversation = conver.unreadMessageCount ? true : isNotifyConversation;conver.unreadMessageCount = 0;me.cleanMentioneds(conver);}}}RongIMLib.UnreadCountHandler.clear();setTimeout(function () {callback.onSuccess(true);isNotifyConversation && RongIMLib.RongIMClient._dataAccessProvider.Conversation._notify(RongIMLib.RongIMClient._memoryStore.conversationList);});};ServerDataProvider.prototype.setConversationToTop = function (conversationType, targetId, isTop, callback) {var me = this;this.getConversation(conversationType, targetId, { onSuccess: function onSuccess(conver) {conver.isTop = isTop;me.addConversation(conver, callback);setTimeout(function () {callback.onSuccess(true);});}, onError: function onError(error) {setTimeout(function () {callback.onError(error);});} });};ServerDataProvider.prototype.getConversationNotificationStatus = function (params, callback) {var targetId = params.targetId;var conversationType = params.conversationType;var notification = RongIMLib.RongIMClient._memoryStore.notification;var getKey = function getKey() {return conversationType + "_" + targetId;};var key = getKey();var status = notification[key];if (typeof status == "number") {callback.onSuccess(status);return;}var topics = { 1: "qryPPush", 3: "qryDPush" };var topic = topics[conversationType];if (!topic) {var error = 8001;callback.onError(error);return;}var modules = new RongIMLib.RongIMClient.Protobuf.BlockPushInput();modules.setBlockeeId(targetId);var userId = RongIMLib.Bridge._client.userId;var success = function success(status) {notification[key] = status;setTimeout(function () {callback.onSuccess(status);});};RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {success(status);}, onError: function onError(e) {if (e == 1) {success(e);} else {setTimeout(function () {callback.onError(e);});}} });};ServerDataProvider.prototype.setConversationNotificationStatus = function (params, callback) {var conversationType = params.conversationType;var targetId = params.targetId;var status = params.status;var getKey = function getKey() {return conversationType + "_" + status;};var topics = { "1_1": "blkPPush", "3_1": "blkDPush", "1_0": "unblkPPush", "3_0": "unblkDPush" };var key = getKey();var notification = RongIMLib.RongIMClient._memoryStore.notification;notification[key] = status;var topic = topics[key];if (!topic) {var error = 8001;setTimeout(function () {callback.onError(error);});return;}var modules = new RongIMLib.RongIMClient.Protobuf.BlockPushInput();modules.setBlockeeId(targetId);var userId = RongIMLib.Bridge._client.userId;RongIMLib.RongIMClient.bridge.queryMsg(topic, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {setTimeout(function () {callback.onSuccess(status);
                });}, onError: function onError(e) {setTimeout(function () {callback.onError(e);});} });};ServerDataProvider.prototype.getUserStatus = function (userId, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.GetUserStatusInput();userId = RongIMLib.Bridge._client.userId;RongIMLib.RongIMClient.bridge.queryMsg(35, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {status = RongIMLib.RongInnerTools.convertUserStatus(status);setTimeout(function () {callback.onSuccess(status);});}, onError: function onError(e) {setTimeout(function () {callback.onError(e);});} }, "GetUserStatusOutput");};ServerDataProvider.prototype.setUserStatus = function (status, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.SetUserStatusInput();var userId = RongIMLib.Bridge._client.userId;if (status) {modules.setStatus(status);}RongIMLib.RongIMClient.bridge.queryMsg(36, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {setTimeout(function () {callback.onSuccess(true);});}, onError: function onError(e) {setTimeout(function () {callback.onError(e);});} }, "SetUserStatusOutput");};ServerDataProvider.prototype.subscribeUserStatus = function (userIds, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.SubUserStatusInput();var userId = RongIMLib.Bridge._client.userId;modules.setUserid(userIds);RongIMLib.RongIMClient.bridge.queryMsg(37, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, { onSuccess: function onSuccess(status) {setTimeout(function () {callback && callback.onSuccess(true);});}, onError: function onError(e) {setTimeout(function () {callback && callback.onError(e);});} }, "SubUserStatusOutput");};ServerDataProvider.prototype.setUserStatusListener = function (params, callback) {RongIMLib.RongIMClient.userStatusListener = callback;var userIds = params.userIds || [];if (userIds.length) {RongIMLib.RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);}};ServerDataProvider.prototype.clearListeners = function () {};ServerDataProvider.prototype.setServerInfo = function (info) {};ServerDataProvider.prototype.getUnreadMentionedMessages = function (conversationType, targetId) {return null;};ServerDataProvider.prototype.setConversationHidden = function (conversationType, targetId, isHidden) {};ServerDataProvider.prototype.setMessageExtra = function (messageId, value, callback) {setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {setTimeout(function () {callback.onSuccess(true);});};ServerDataProvider.prototype.getAllConversations = function (callback) {setTimeout(function () {callback.onSuccess([]);});};ServerDataProvider.prototype.getConversationByContent = function (keywords, callback) {setTimeout(function () {callback.onSuccess([]);});};ServerDataProvider.prototype.getMessagesFromConversation = function (conversationType, targetId, keywords, callback) {setTimeout(function () {callback.onSuccess([]);});};ServerDataProvider.prototype.searchConversationByContent = function (keyword, callback, conversationTypes) {setTimeout(function () {callback.onSuccess([]);});};ServerDataProvider.prototype.searchMessageByContent = function (conversationType, targetId, keyword, timestamp, count, total, callback) {setTimeout(function () {callback.onSuccess([]);});};ServerDataProvider.prototype.getDelaTime = function () {return RongIMLib.RongIMClient._memoryStore.deltaTime;};ServerDataProvider.prototype.getCurrentConnectionStatus = function () {var client = RongIMLib.Bridge._client || {};var channel = client.channel || {};var status = RongIMLib.ConnectionStatus.CONNECTION_CLOSED;if (typeof channel.connectionStatus == "number") {status = channel.connectionStatus;}return status;};ServerDataProvider.prototype.getAgoraDynamicKey = function (engineType, channelName, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.VoipDynamicInput();modules.setEngineType(engineType);modules.setChannelName(channelName);RongIMLib.RongIMClient.bridge.queryMsg(32, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(result) {setTimeout(function () {callback.onSuccess(result);});}, onError: function onError(errorCode) {setTimeout(function () {callback.onError(errorCode);});} }, "VoipDynamicOutput");};ServerDataProvider.prototype.setDeviceInfo = function (deviceId) {};ServerDataProvider.prototype.setEnvironment = function (isPrivate) {};ServerDataProvider.prototype.clearData = function () {return true;};ServerDataProvider.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {var profile = RongIMLib.RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);setTimeout(function () {callback.onSuccess(profile);});};ServerDataProvider.prototype.getRemotePublicServiceList = function (callback, pullMessageTime) {if (RongIMLib.RongIMClient._memoryStore.depend.openMp) {var modules = new RongIMLib.RongIMClient.Protobuf.PullMpInput();if (!pullMessageTime) {modules.setTime(0);
              } else {modules.setTime(pullMessageTime);}modules.setMpid("");RongIMLib.RongIMClient.bridge.queryMsg(28, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, { onSuccess: function onSuccess(data) {RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList = data;setTimeout(function () {callback && callback.onSuccess(data);});}, onError: function onError(errorCode) {setTimeout(function () {callback && callback.onError(errorCode);});} }, "PullMpOutput");}};ServerDataProvider.prototype.getRTCUserInfoList = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();modules.setOrder(2);RongIMLib.RongIMClient.bridge.queryMsg("rtcUData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {var users = {};var list = result.list;RongIMLib.RongUtil.forEach(list, function (item) {var userId = item.userId;var tmpData = {};RongIMLib.RongUtil.forEach(item.userData, function (data) {var key = data.key;var value = data.value;tmpData[key] = value;});users[userId] = tmpData;});callback.onSuccess(users);}, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcUserListOutput");};ServerDataProvider.prototype.getRTCUserList = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();modules.setOrder(2);RongIMLib.RongIMClient.bridge.queryMsg("rtcUList", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {callback.onSuccess({ users: result.list });}, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcUserListOutput");};ServerDataProvider.prototype.setRTCUserInfo = function (room, info, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcValueInfo();modules.setKey(info.key);modules.setValue(info.value);RongIMLib.RongIMClient.bridge.queryMsg("rtcUPut", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess() {callback.onSuccess(true);}, onError: function onError(errorCode) {callback.onError(errorCode);} });};ServerDataProvider.prototype.removeRTCUserInfo = function (room, info, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcKeyDeleteInput();var keys = info.keys || [];if (!RongIMLib.RongUtil.isArray(keys)) {keys = [keys];}modules.setKey(keys);RongIMLib.RongIMClient.bridge.queryMsg("rtcUDel", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess() {callback.onSuccess(true);}, onError: function onError(errorCode) {callback.onError(errorCode);} });};ServerDataProvider.prototype.getRTCRoomInfo = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcQueryListInput();modules.setOrder(2);RongIMLib.RongIMClient.bridge.queryMsg("rtcRInfo", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {var room = { id: result.roomId, total: result.userCount };RongIMLib.RongUtil.forEach(result.roomData, function (data) {room[data.key] = data.value;});callback.onSuccess(room);}, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcRoomInfoOutput");};ServerDataProvider.prototype.setRTCRoomInfo = function (room, info, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcValueInfo();modules.setKey(info.key);modules.setValue(info.value);RongIMLib.RongIMClient.bridge.queryMsg("rtcRPut", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess() {callback.onSuccess(true);}, onError: function onError(errorCode) {callback.onError(errorCode);} });};ServerDataProvider.prototype.removeRTCRoomInfo = function (room, info, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcKeyDeleteInput();var keys = info.keys || [];if (!RongIMLib.RongUtil.isArray(keys)) {keys = [keys];}modules.setKey(keys);RongIMLib.RongIMClient.bridge.queryMsg("rtcRDel", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess() {callback.onSuccess(true);}, onError: function onError(errorCode) {callback.onError(errorCode);} });};ServerDataProvider.prototype.joinRTCRoom = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcInput();var mode = room.mode || 0;modules.setRoomType(mode);if (room.broadcastType) {modules.setBroadcastType(room.broadcastType);}RongIMLib.RongIMClient.bridge.queryMsg("rtcRJoin_data", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {var users = {};var list = result.list,token = result.token,sessionId = result.sessionId;RongIMLib.RongUtil.forEach(list, function (item) {var userId = item.userId;var tmpData = {};RongIMLib.RongUtil.forEach(item.userData, function (data) {var key = data.key;var value = data.value;tmpData[key] = value;});users[userId] = tmpData;});callback.onSuccess({ users: users, token: token, sessionId: sessionId });}, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcUserListOutput");};ServerDataProvider.prototype.quitRTCRoom = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.SetUserStatusInput();
            RongIMLib.RongIMClient.bridge.queryMsg("rtcRExit", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess() {callback.onSuccess(true);}, onError: function onError(errorCode) {callback.onError(errorCode);} });};ServerDataProvider.prototype.RTCPing = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcInput();var mode = room.mode || 0;modules.setRoomType(mode);if (room.broadcastType) {modules.setBroadcastType(room.broadcastType);}RongIMLib.RongIMClient.bridge.queryMsg("rtcPing", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, callback);};ServerDataProvider.prototype.setRTCData = function (roomId, key, value, isInner, apiType, callback, message) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcSetDataInput();modules.setInterior(isInner);modules.setTarget(apiType);modules.setKey(key);modules.setValue(value);message = message || {};var name = message.name;var content = message.content;if (name) {modules.setObjectName(name);}if (content) {if (!RongIMLib.RongUtil.isString(content)) {content = JSON.stringify(content);}modules.setContent(content);}RongIMLib.RongIMClient.bridge.queryMsg("rtcSetData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), roomId, callback, "RtcOutput");};ServerDataProvider.prototype.getRTCData = function (roomId, keys, isInner, apiType, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcDataInput();modules.setInterior(isInner);modules.setTarget(apiType);modules.setKey(keys);RongIMLib.RongIMClient.bridge.queryMsg("rtcQryData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), roomId, { onSuccess: function onSuccess(result) {var props = {};var list = result.outInfo;RongIMLib.RongUtil.forEach(list, function (item) {props[item.key] = item.value;});callback.onSuccess(props);}, onError: callback.onError }, "RtcQryOutput");};ServerDataProvider.prototype.removeRTCData = function (roomId, keys, isInner, apiType, callback, message) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcDataInput();modules.setInterior(isInner);modules.setTarget(apiType);modules.setKey(keys);message = message || {};var name = message.name;var content = message.content;if (name) {modules.setObjectName(name);}if (content) {if (!RongIMLib.RongUtil.isString(content)) {content = JSON.stringify(content);}modules.setContent(content);}RongIMLib.RongIMClient.bridge.queryMsg("rtcDelData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), roomId, callback, "RtcOutput");};ServerDataProvider.prototype.setRTCUserData = function (roomId, key, value, isInner, callback, message) {this.setRTCData(roomId, key, value, isInner, RongIMLib.RTCAPIType.PERSON, callback, message);};ServerDataProvider.prototype.getRTCUserData = function (roomId, keys, isInner, callback, message) {this.getRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.PERSON, callback);};ServerDataProvider.prototype.removeRTCUserData = function (roomId, keys, isInner, callback, message) {this.removeRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.PERSON, callback, message);};ServerDataProvider.prototype.setRTCRoomData = function (roomId, key, value, isInner, callback, message) {this.setRTCData(roomId, key, value, isInner, RongIMLib.RTCAPIType.ROOM, callback, message);};ServerDataProvider.prototype.getRTCRoomData = function (roomId, keys, isInner, callback, message) {this.getRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.ROOM, callback);};ServerDataProvider.prototype.removeRTCRoomData = function (roomId, keys, isInner, callback, message) {this.removeRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.ROOM, callback, message);};ServerDataProvider.prototype.setRTCOutData = function (roomId, data, type, callback, message) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcSetOutDataInput();modules.setTarget(type);if (!RongIMLib.RongUtil.isArray(data)) {data = [data];}for (var i = 0; i < data.length; i++) {var item = data[i];if (item.key) {item.key = item.key.toString();}if (item.value) {item.value = item.value.toString();}}modules.setValueInfo(data);message = message || {};var name = message.name;var content = message.content;if (name) {modules.setObjectName(name);}if (content) {if (!RongIMLib.RongUtil.isString(content)) {content = JSON.stringify(content);}modules.setContent(content);}RongIMLib.RongIMClient.bridge.queryMsg("rtcSetOutData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), roomId, callback, "RtcOutput");};ServerDataProvider.prototype.getRTCOutData = function (roomId, userIds, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcQryUserOutDataInput();modules.setUserId(userIds);RongIMLib.RongIMClient.bridge.queryMsg("rtcQryUserOutData", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), roomId, callback, "RtcUserOutDataOutput");};ServerDataProvider.prototype.getNavi = function () {var navi = RongIMLib.RongIMClient._storageProvider.getItem("fullnavi") || "{}";return JSON.parse(navi);};ServerDataProvider.prototype.getRTCToken = function (room, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.RtcInput();var mode = room.mode || 0;modules.setRoomType(mode);if (room.broadcastType) {modules.setBroadcastType(room.broadcastType);}RongIMLib.RongIMClient.bridge.queryMsg("rtcToken", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {callback.onSuccess(result);
              }, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcTokenOutput");};ServerDataProvider.prototype.setRTCState = function (room, content, callback) {var modules = new RongIMLib.RongIMClient.Protobuf.MCFollowInput();var report = content.report;modules.setId(report);RongIMLib.RongIMClient.bridge.queryMsg("rtcUserState", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), room.id, { onSuccess: function onSuccess(result) {callback.onSuccess(result);}, onError: function onError(errorCode) {callback.onError(errorCode);} }, "RtcOutput");};return ServerDataProvider;}();RongIMLib.ServerDataProvider = ServerDataProvider;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var VCDataProvider = function () {function VCDataProvider(addon) {this.Conversation = { watcher: new RongIMLib.Observer(), watch: function watch(_watcher) {}, unwatch: function unwatch(_watcher) {}, _notify: function _notify(conversationList) {} };this.version = "2.8.27";this.userId = "";this.useConsole = false;this.appKey = "";this.token = "";this.connectionStatus = RongIMLib.ConnectionStatus.DISCONNECTED;this.addon = addon;}VCDataProvider.prototype.init = function (appKey, config) {this.appKey = appKey;this.useConsole && console.log("init");config = config || {};config.version = this.version;var sdkInfo = this.addon.initWithAppkey(appKey, config.dbPath, config);if (sdkInfo) {sdkInfo = JSON.parse(sdkInfo);}this.addon.registerMessageType("RC:VcMsg", 3);this.addon.registerMessageType("RC:ImgTextMsg", 3);this.addon.registerMessageType("RC:FileMsg", 3);this.addon.registerMessageType("RC:LBSMsg", 3);this.addon.registerMessageType("RC:PSImgTxtMsg", 3);this.addon.registerMessageType("RC:PSMultiImgTxtMsg", 3);this.addon.registerMessageType("RCJrmf:RpMsg", 3);this.addon.registerMessageType("RCJrmf:RpOpendMsg", 1);this.addon.registerMessageType("RC:GrpNtf", 1);this.addon.registerMessageType("RC:DizNtf", 0);this.addon.registerMessageType("RC:InfoNtf", 0);this.addon.registerMessageType("RC:ContactNtf", 0);this.addon.registerMessageType("RC:ProfileNtf", 0);this.addon.registerMessageType("RC:CmdNtf", 0);this.addon.registerMessageType("RC:CmdMsg", 0);this.addon.registerMessageType("RC:TypSts", 0);this.addon.registerMessageType("RC:CsChaR", 0);this.addon.registerMessageType("RC:CsHsR", 0);this.addon.registerMessageType("RC:CsEnd", 0);this.addon.registerMessageType("RC:CsSp", 0);this.addon.registerMessageType("RC:CsUpdate", 0);this.addon.registerMessageType("RC:CsContact", 0);this.addon.registerMessageType("RC:ReadNtf", 0);this.addon.registerMessageType("RC:VCAccept", 0);this.addon.registerMessageType("RC:VCRinging", 0);this.addon.registerMessageType("RC:VCSummary", 0);this.addon.registerMessageType("RC:VCHangup", 0);this.addon.registerMessageType("RC:VCInvite", 0);this.addon.registerMessageType("RC:VCModifyMedia", 0);this.addon.registerMessageType("RC:VCModifyMem", 0);this.addon.registerMessageType("RC:PSCmd", 0);this.addon.registerMessageType("RC:RcCmd", 0);this.addon.registerMessageType("RC:SRSMsg", 0);this.addon.registerMessageType("RC:RRReqMsg", 0);this.addon.registerMessageType("RC:RRRspMsg", 0);return sdkInfo;};VCDataProvider.prototype.connect = function (token, callback, userId, serverConf) {this.useConsole && console.log("connect");this.userId = userId;this.connectCallback = callback;RongIMLib.Bridge._client = { userId: userId, token: token };serverConf = serverConf || {};var openmp = !!serverConf.openMp;var openus = !!serverConf.openUS;if (serverConf.type) {this.addon.setEnvironment(true);}var me = this;this.addon.connectWithToken(token, userId, function (userId) {me.userId = userId;RongIMLib.Bridge._client.userId = userId;});};VCDataProvider.prototype.setServerInfo = function (info) {"setServerInfo" in this.addon && this.addon.setServerInfo(info.navi);};VCDataProvider.prototype.logout = function () {this.useConsole && console.log("logout");this.disconnect();};VCDataProvider.prototype.disconnect = function () {this.useConsole && console.log("disconnect");this.connectionStatus = RongIMLib.ConnectionStatus.DISCONNECTED;this.addon.disconnect(true);};VCDataProvider.prototype.clearListeners = function () {this.addon.setOnReceiveStatusListener();this.addon.setConnectionStatusListener();this.addon.setOnReceiveMessageListener();};VCDataProvider.prototype.clearData = function () {this.useConsole && console.log("clearData");return this.addon.clearData();};VCDataProvider.prototype.setConnectionStatusListener = function (listener) {var me = this;me.connectListener = listener;this.useConsole && console.log("setConnectionStatusListener");me.addon && me.addon.setConnectionStatusListener(function (result) {var isCurrentConnected = me.connectionStatus === RongIMLib.ConnectionStatus.CONNECTED;var code = result;switch (result) {case 10:code = RongIMLib.ConnectionStatus.CONNECTING;break;case 31004:setTimeout(function () {me.connectCallback.onTokenIncorrect();});return;case 1:case 8:case 9:case 11:case 12:case 31011:case 30000:case 30002:case 30010:if (!isCurrentConnected) {return;}code = RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE;break;case 0:case 33005:code = RongIMLib.ConnectionStatus.CONNECTED;setTimeout(function () {me.connectCallback.onSuccess(me.userId);});break;case 6:code = RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT;
                  break;default:code = result;break;}me.connectionStatus = code;setTimeout(function () {listener.onChanged(code);});});};VCDataProvider.prototype.setOnReceiveMessageListener = function (listener) {var me = this;me.messageListener = listener;this.useConsole && console.log("setOnReceiveMessageListener");me.addon && me.addon.setOnReceiveMessageListener(function (result, leftCount, offline, hasMore) {var message = me.buildMessage(result);message.offLineMessage = offline;setTimeout(function () {var voipMsgTypes = ["AcceptMessage", "RingingMessage", "HungupMessage", "InviteMessage", "MediaModifyMessage", "MemberModifyMessage"];var isVoIPMsg = voipMsgTypes.indexOf(message.messageType) > -1;if (isVoIPMsg) {RongIMLib.RongIMClient._voipProvider && RongIMLib.RongIMClient._voipProvider.onReceived(message);} else {if (message.conversationType == 12) {RongIMLib.RongIMClient.RTCListener(message);RongIMLib.RongIMClient.RTCInnerListener(message);RongIMLib.RongIMClient.RTCSignalLisener(message);} else {listener.onReceived(message, leftCount, hasMore);}}});});};VCDataProvider.prototype.sendTypingStatusMessage = function (conversationType, targetId, messageName, sendCallback) {var me = this;this.useConsole && console.log("sendTypingStatusMessage");if (messageName in RongIMLib.RongIMClient.MessageParams) {me.sendMessage(conversationType, targetId, RongIMLib.TypingStatusMessage.obtain(RongIMLib.RongIMClient.MessageParams[messageName].objectName, ""), { onSuccess: function onSuccess() {setTimeout(function () {sendCallback.onSuccess();});}, onError: function onError(errorCode) {setTimeout(function () {sendCallback.onError(errorCode, null);});}, onBefore: function onBefore() {} });}};VCDataProvider.prototype.setMessageStatus = function (conversationType, targetId, timestamp, status, callback) {this.addon.updateMessageReceiptStatus(conversationType, targetId, timestamp);callback.onSuccess(true);};VCDataProvider.prototype.sendTextMessage = function (conversationType, targetId, content, sendMessageCallback) {var msgContent = RongIMLib.TextMessage.obtain(content);this.useConsole && console.log("sendTextMessage");this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);};VCDataProvider.prototype.getRemoteHistoryMessages = function (conversationType, targetId, timestamp, count, callback, config) {try {var me = this;me.useConsole && console.log("getRemoteHistoryMessages");me.addon.getRemoteHistoryMessages(conversationType, targetId, timestamp ? timestamp : 0, count, function (ret, hasMore) {var list = ret ? JSON.parse(ret).list : [],msgs = [];list.reverse();for (var i = 0, len = list.length; i < len; i++) {var message = me.buildMessage(list[i].obj);message.sentStatus = RongIMLib.SentStatus.READ;msgs[i] = message;}callback.onSuccess(msgs, hasMore ? true : false);}, function (errorCode) {callback.onError(errorCode);});} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getRemoteConversationList = function (callback, conversationTypes, count, isGetHiddenConvers) {try {this.useConsole && console.log("getRemoteConversationList");var converTypes = conversationTypes || [1, 2, 3, 4, 5, 6, 7, 8];var result = this.addon.getConversationList(converTypes);var list = JSON.parse(result).list,convers = [],me = this,index = 0;list.reverse();isGetHiddenConvers = typeof isGetHiddenConvers === "boolean" ? isGetHiddenConvers : false;for (var i = 0, len_1 = list.length; i < len_1; i++) {var tmpObj = list[i].obj,obj = JSON.parse(tmpObj);if (obj != "") {if (obj.isHidden == 1 && isGetHiddenConvers) {continue;}convers[index] = me.buildConversation(tmpObj);index++;}}convers.reverse();var len = convers.length;count = count || len;if (len > count) {convers.length = count;}callback.onSuccess(convers);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.removeConversation = function (conversationType, targetId, callback) {try {this.useConsole && console.log("removeConversation");this.addon.removeConversation(conversationType, targetId);var conversations = RongIMLib.RongIMClient._memoryStore.conversationList;var len = conversations.length;for (var i = 0; i < len; i++) {if (conversations[i].conversationType == conversationType && targetId == conversations[i].targetId) {conversations.splice(i, 1);break;}}callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.joinChatRoom = function (chatRoomId, messageCount, callback) {this.useConsole && console.log("joinChatRoom");this.addon.joinChatRoom(chatRoomId, messageCount, function () {callback.onSuccess();}, function (error) {callback.onError(error);});};VCDataProvider.prototype.quitChatRoom = function (chatRoomId, callback) {this.useConsole && console.log("quitChatRoom");this.addon.quitChatRoom(chatRoomId, function () {callback.onSuccess();}, function (error) {callback.onError(error);});};VCDataProvider.prototype.setChatroomEntry = function (chatroomId, chatroomEntry, callback) {};VCDataProvider.prototype.forceSetChatroomEntry = function (chatroomId, chatroomEntry, callback) {};VCDataProvider.prototype.getChatroomEntry = function (chatroomId, key, callback) {};VCDataProvider.prototype.getAllChatroomEntries = function (chatroomId, callback) {};VCDataProvider.prototype.removeChatroomEntry = function (chatroomId, chatroomEntry, callback) {};VCDataProvider.prototype.forceRemoveChatroomEntry = function (chatroomId, chatroomEntry, callback) {};VCDataProvider.prototype.pullChatroomEntry = function (chatroomId, time, callback) {};
          VCDataProvider.prototype.addToBlacklist = function (userId, callback) {this.useConsole && console.log("addToBlacklist");this.addon.addToBlacklist(userId, function () {callback.onSuccess();}, function (error) {callback.onError(error);});};VCDataProvider.prototype.getBlacklist = function (callback) {this.useConsole && console.log("getBlacklist");this.addon.getBlacklist(function (blacklistors) {callback.onSuccess(blacklistors);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.getBlacklistStatus = function (userId, callback) {this.useConsole && console.log("getBlacklistStatus");this.addon.getBlacklistStatus(userId, function (result) {callback.onSuccess(result);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.removeFromBlacklist = function (userId, callback) {this.useConsole && console.log("removeFromBlacklist");this.addon.removeFromBlacklist(userId, function () {callback.onSuccess();}, function (error) {callback.onError(error);});};VCDataProvider.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback, mentiondMsg, pushText, appData, methodType, params) {var me = this,users = [];me.useConsole && console.log("sendMessage");params = params || {};var isGroup = conversationType == RongIMLib.ConversationType.DISCUSSION || conversationType == RongIMLib.ConversationType.GROUP;if (isGroup && messageContent.messageName == RongIMLib.RongIMClient.MessageType["ReadReceiptResponseMessage"]) {users = [];var rspMsg = messageContent;if (rspMsg.receiptMessageDic) {var ids = [];for (var key in rspMsg.receiptMessageDic) {ids.push(key);}users = ids;}}if (isGroup && messageContent.messageName == RongIMLib.RongIMClient.MessageType["SyncReadStatusMessage"]) {users = [];users.push(me.userId);}var userIds = params.userIds;if (isGroup && userIds) {users = userIds;}var msg = me.addon.sendMessage(conversationType, targetId, RongIMLib.RongIMClient.MessageParams[messageContent.messageName].objectName, messageContent.encode(), pushText || "", appData || "", function (progress) {}, function (message, code) {var msg = me.buildMessage(message);var errorCode = RongIMLib.ErrorCode.SENSITIVE_REPLACE;if (code == errorCode) {return sendCallback.onError(errorCode, msg);}sendCallback.onSuccess(msg);}, function (message, code) {sendCallback.onError(code, me.buildMessage(message));}, users, mentiondMsg);var tempMessage = JSON.parse(msg);sendCallback.onBefore && sendCallback.onBefore(tempMessage.messageId);RongIMLib.MessageIdHandler.messageId = tempMessage.messageId;};VCDataProvider.prototype.registerMessageType = function (messageType, objectName, messageTag, messageContent, searchProps) {this.useConsole && console.log("registerMessageType");this.addon.registerMessageType(objectName, messageTag.getMessageTag(), searchProps);var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent, messageType);RongIMLib.RongIMClient.RegisterMessage[messageType] = regMsg;RongIMLib.RongIMClient.RegisterMessage[messageType].messageName = messageType;registerMessageTypeMapping[objectName] = messageType;RongIMLib.RongIMClient.MessageType[messageType] = messageType;RongIMLib.RongIMClient.MessageParams[messageType] = { objectName: objectName, msgTag: messageTag };typeMapping[objectName] = messageType;};VCDataProvider.prototype.registerMessageTypes = function (messages) {var types = [];var getProtos = function getProtos(proto) {var protos = [];for (var p in proto) {protos.push(p);}return protos;};for (var name in messages) {var message = messages[name];var proto = message.proto;var protos = getProtos(proto);var flag = message.flag || 3;var tag = RongIMLib.MessageTag.getTagByStatus(flag);flag = new RongIMLib.MessageTag(tag.isCounted, tag.isPersited);types.push({ type: name, name: message.name, flag: flag, protos: protos });}var register = function register(message) {var type = message.type;var name = message.name;var flag = message.flag;var protos = message.protos;RongIMLib.RongIMClient.registerMessageType(type, name, flag, protos);};for (var i = 0, len = types.length; i < len; i++) {var message = types[i];register(message);}};VCDataProvider.prototype.addMessage = function (conversationType, targetId, message, callback) {this.useConsole && console.log("addMessage");var direction = message.direction;var msg = this.addon.insertMessage(conversationType, targetId, message.senderUserId, message.objectName, JSON.stringify(message.content), function () {callback.onSuccess(me.buildMessage(msg));}, function () {callback.onError(RongIMLib.ErrorCode.MSG_INSERT_ERROR);}, direction),me = this;};VCDataProvider.prototype.removeMessage = function (conversationType, targetId, messages, callback) {};VCDataProvider.prototype.deleteRemoteMessages = function (conversationType, targetId, messages, callback) {};VCDataProvider.prototype.removeLocalMessage = function (conversationType, targetId, timestamps, callback) {try {this.useConsole && console.log("removeLocalMessage");this.addon.deleteMessages(timestamps);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getMessage = function (messageId, callback) {try {this.useConsole && console.log("getMessage");var msg = this.buildMessage(this.addon.getMessage(messageId));callback.onSuccess(msg);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.clearMessages = function (conversationType, targetId, callback) {try {this.useConsole && console.log("clearMessages");
              this.addon.clearMessages(conversationType, targetId);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.setUnreadCount = function (conversationType, targetId, count) {};VCDataProvider.prototype.getConversation = function (conversationType, targetId, callback) {try {this.useConsole && console.log("getConversation");var ret = this.addon.getConversation(conversationType, targetId);callback.onSuccess(this.buildConversation(ret));} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getConversationList = function (callback, conversationTypes, count, isGetHiddenConvers) {this.useConsole && console.log("getConversationList");this.getRemoteConversationList(callback, conversationTypes, count, isGetHiddenConvers);};VCDataProvider.prototype.clearCache = function () {var memoryStore = RongIMLib.RongIMClient._memoryStore || {};memoryStore.conversationList = [];memoryStore.isSyncRemoteConverList;};VCDataProvider.prototype.clearConversations = function (conversationTypes, callback) {try {this.useConsole && console.log("clearConversations");this.addon.clearConversations();callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.setMessageContent = function (messageId, content, objectName) {content = JSON.stringify(content);this.addon.setMessageContent(messageId, content, objectName);};VCDataProvider.prototype.setMessageSearchField = function (messageId, content, searchFiles) {content = JSON.stringify(content);this.addon.setMessageContent(messageId, content, searchFiles);};VCDataProvider.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback, objectname, direction) {this.useConsole && console.log("getHistoryMessages");if (count <= 0) {callback.onError(RongIMLib.ErrorCode.TIMEOUT);return;}objectname = objectname || "";direction = typeof direction == "undefined" || direction;try {var ret = this.addon.getHistoryMessages(conversationType, targetId, timestamp ? timestamp : 0, count, objectname, direction);var list = ret ? JSON.parse(ret).list : [],msgs = [],me = this;list.reverse();for (var i = 0, len = list.length; i < len; i++) {var message = me.buildMessage(list[i].obj);msgs[i] = message;}callback.onSuccess(msgs, len == count);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.clearRemoteHistoryMessages = function (params, callback) {var conversationType = params.conversationType;var targetId = params.targetId;var timestamp = params.timestamp;var _topic = { 1: true, 2: true, 3: true, 5: true, 6: true };var topic = _topic[conversationType];if (!topic) {callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TYPE_ERROR);return;}if (typeof timestamp != "number") {callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_TIME_ERROR);return;}this.addon.clearRemoteHistoryMessages(+conversationType, targetId, timestamp, function () {callback.onSuccess(true);}, function (errorCode) {if (errorCode == 1) {errorCode = RongIMLib.ErrorCode.CLEAR_HIS_ERROR;}callback.onError(errorCode);});};VCDataProvider.prototype.clearHistoryMessages = function (params, callback) {var conversationType = +params.conversationType;var targetId = params.targetId;try {this.addon.clearMessages(conversationType, targetId);var isSuccess = true;callback.onSuccess(isSuccess);} catch (e) {console.log(e);callback.onError(RongIMLib.ErrorCode.CLEAR_HIS_ERROR);}};VCDataProvider.prototype.getTotalUnreadCount = function (callback, conversationTypes) {try {var result;this.useConsole && console.log("getTotalUnreadCount");if (conversationTypes) {result = this.addon.getTotalUnreadCount(conversationTypes);} else {result = this.addon.getTotalUnreadCount();}callback.onSuccess(result);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getConversationUnreadCount = function (conversationTypes, callback) {this.useConsole && console.log("getConversationUnreadCount");this.getTotalUnreadCount(callback, conversationTypes);};VCDataProvider.prototype.getUnreadCount = function (conversationType, targetId, callback) {try {this.useConsole && console.log("getUnreadCount");var result = this.addon.getUnreadCount(conversationType, targetId);callback.onSuccess(result);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.clearUnreadCount = function (conversationType, targetId, callback) {try {this.useConsole && console.log("clearUnreadCount");var result = this.addon.clearUnreadCount(conversationType, targetId);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.clearTotalUnreadCount = function (callback) {this.useConsole && console.log("clearTotalUnreadCount");};VCDataProvider.prototype.clearUnreadCountByTimestamp = function (conversationType, targetId, timestamp, callback) {try {this.useConsole && console.log("clearUnreadCountByTimestamp");var result = this.addon.clearUnreadCountByTimestamp(conversationType, targetId, timestamp);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.setConversationToTop = function (conversationType, targetId, isTop, callback) {try {this.useConsole && console.log("setConversationToTop");this.addon.setConversationToTop(conversationType, targetId, isTop);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.setConversationHidden = function (conversationType, targetId, isHidden) {this.addon.setConversationHidden(conversationType, targetId, isHidden);
          };VCDataProvider.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {try {this.useConsole && console.log("setMessageReceivedStatus");this.addon.setMessageReceivedStatus(messageId, receivedStatus);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {try {this.useConsole && console.log("setMessageSentStatus");this.addon.setMessageSentStatus(messageId, sentStatus);callback.onSuccess(true);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getFileToken = function (fileType, callback) {this.useConsole && console.log("getFileToken");this.addon.getUploadToken(fileType, function (token) {callback.onSuccess({ token: token });}, function (errorCode) {callback.onError(errorCode);});};VCDataProvider.prototype.getFileUrl = function (fileType, fileName, oriName, callback) {this.useConsole && console.log("getFileUrl");this.addon.getDownloadUrl(fileType, fileName, oriName, function (url) {callback.onSuccess({ downloadUrl: url });}, function (errorCode) {callback.onError(errorCode);});};VCDataProvider.prototype.getPullSetting = function (callback) {this.useConsole && console.log("getPullSetting");};VCDataProvider.prototype.setOfflineMessageDuration = function (duration, callback) {this.useConsole && console.log("setOfflineMessageDuration");};VCDataProvider.prototype.searchConversationByContent = function (keyword, callback, conversationTypes) {var converTypes = [];if (typeof conversationTypes == "undefined") {converTypes = [1, 2, 3, 4, 5, 6, 7];} else {converTypes = conversationTypes;}try {this.useConsole && console.log("searchConversationByContent");var result = this.addon.searchConversationByContent(converTypes, keyword);var list = JSON.parse(result).list,convers = [],me = this;list.reverse();for (var i = 0, len = list.length; i < len; i++) {convers[i] = me.buildConversation(list[i].obj);}callback.onSuccess(convers);} catch (e) {callback.onError(e);}};VCDataProvider.prototype.searchMessageByContent = function (conversationType, targetId, keyword, timestamp, count, total, callback) {var me = this;try {this.useConsole && console.log("searchMessageByContent");this.addon.searchMessageByContent(conversationType, targetId, keyword, timestamp, count, total, function (ret, matched) {var list = ret ? JSON.parse(ret).list : [],msgs = [];list.reverse();for (var i = 0, len = list.length; i < len; i++) {msgs[i] = me.buildMessage(list[i].obj);}callback.onSuccess(msgs, matched);});} catch (e) {callback.onError(e);}};VCDataProvider.prototype.getChatRoomInfo = function (chatRoomId, count, order, callback) {this.useConsole && console.log("getChatRoomInfo");this.addon.getChatroomInfo(chatRoomId, count, order, function (ret, count) {var list = ret ? JSON.parse(ret).list : [],chatRoomInfo = { userInfos: [], userTotalNums: count };if (list.length > 0) {for (var i = 0, len = list.length; i < len; i++) {chatRoomInfo.userInfos.push(JSON.parse(list[i].obj));}}callback.onSuccess(chatRoomInfo);}, function (errcode) {callback.onError(errcode);});};VCDataProvider.prototype.setChatroomHisMessageTimestamp = function (chatRoomId, timestamp) {};VCDataProvider.prototype.getChatRoomHistoryMessages = function (chatRoomId, count, order, callback) {};VCDataProvider.prototype.getDelaTime = function () {return this.addon.getDeltaTime();};VCDataProvider.prototype.getUserStatus = function (userId, callback) {this.addon.getUserStatus(userId, function (status) {var entity = RongIMLib.RongInnerTools.convertUserStatus({ status: status, userId: "" });callback.onSuccess(entity);}, function (code) {callback.onError(code);});};VCDataProvider.prototype.setUserStatus = function (status, callback) {this.addon.setUserStatus(status, function () {callback.onSuccess(true);}, function (code) {callback.onError(code);});};VCDataProvider.prototype.subscribeUserStatus = function (userIds, callback) {this.addon.subscribeUserStatus(userIds, function () {callback && callback.onSuccess(true);}, function (code) {callback && callback.onError(code);});};VCDataProvider.prototype.setUserStatusListener = function (params, callback) {this.addon.setOnReceiveStatusListener(function (userId, status) {var entity = RongIMLib.RongInnerTools.convertUserStatus({ userId: userId, status: status });RongIMLib.RongIMClient.userStatusObserver.notify({ key: userId, entity: entity });});var userIds = params.userIds || [];if (userIds.length) {RongIMLib.RongIMClient._dataAccessProvider.subscribeUserStatus(userIds);}};VCDataProvider.prototype.getUnreadMentionedMessages = function (conversationType, targetId) {var me = this;var mentions = JSON.parse(me.addon.getUnreadMentionedMessages(conversationType, targetId)).list;for (var i = 0, len = mentions.length; i < len; i++) {var temp = JSON.parse(mentions[i].obj);temp.content = JSON.parse(temp.content);mentions[i] = temp;}return mentions;};VCDataProvider.prototype.hasRemoteUnreadMessages = function (token, callback) {callback.onSuccess(false);};VCDataProvider.prototype.sendRecallMessage = function (content, sendMessageCallback) {var me = this;me.addon.recallMessage("RC:RcCmd", JSON.stringify(content), content.push || "", function () {content.objectName = "RC:RcCmd";sendMessageCallback.onSuccess(me.buildMessage(JSON.stringify(content)));}, function (errorCode) {sendMessageCallback.onError(errorCode);});};VCDataProvider.prototype.updateMessage = function (message, callback) {};
          VCDataProvider.prototype.updateMessages = function (conversationType, targetId, key, value, callback) {};VCDataProvider.prototype.reconnect = function (callback) {var token = RongIMLib.Bridge._client.token;this.disconnect();this.connect(token, callback);};VCDataProvider.prototype.sendReceiptResponse = function (conversationType, targetId, sendCallback) {};VCDataProvider.prototype.setMessageExtra = function (messageId, value, callback) {};VCDataProvider.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {};VCDataProvider.prototype.createDiscussion = function (name, userIdList, callback) {};VCDataProvider.prototype.getDiscussion = function (discussionId, callback) {};VCDataProvider.prototype.quitDiscussion = function (discussionId, callback) {};VCDataProvider.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {};VCDataProvider.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {};VCDataProvider.prototype.setDiscussionName = function (discussionId, name, callback) {};VCDataProvider.prototype.setEnvironment = function (isPrivate) {this.addon.setEnvironment(isPrivate);};VCDataProvider.prototype.addConversation = function (conversation, callback) {};VCDataProvider.prototype.updateConversation = function (conversation) {return null;};VCDataProvider.prototype.getConversationNotificationStatus = function (params, callback) {var conversationType = params.conversationType;var targetId = params.targetId;var notification = RongIMLib.RongIMClient._memoryStore.notification;var key = conversationType + "_" + targetId;var status = notification[key];if (typeof status == "number") {callback.onSuccess(status);return;}this.addon.getConversationNotificationStatus(conversationType, targetId, function (status) {notification[key] = status;callback.onSuccess(status);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.setConversationNotificationStatus = function (params, callback) {var conversationType = params.conversationType;var targetId = params.targetId;var status = params.status;var notification = RongIMLib.RongIMClient._memoryStore.notification;var key = conversationType + "_" + targetId;notification[key] = status;var notify = !!status;this.addon.setConversationNotificationStatus(conversationType, targetId, notify, function () {callback.onSuccess(status);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.getCurrentConnectionStatus = function () {return this.addon.getConnectionStatus();};VCDataProvider.prototype.getAgoraDynamicKey = function (engineType, channelName, callback) {var extra = "";this.addon.getVoIPKey(engineType, channelName, extra, function (token) {callback.onSuccess(token);}, function (errorCode) {callback.onError(errorCode);});};VCDataProvider.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {var profile = RongIMLib.RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);callback.onSuccess(profile);};VCDataProvider.prototype.setDeviceInfo = function (device) {var id = device.id || "";this.addon.setDeviceId(id);};VCDataProvider.prototype.getRemotePublicServiceList = function (callback, pullMessageTime) {var publicList = [];var ret = this.addon.getAccounts();var transformProto = function transformProto(ret) {var result = { hasFollowed: false, isGlobal: false, menu: null };if (!ret.obj) {var error = { error: ret };throw new Error("公众账号数据格式错误: " + JSON.stringify(error));}var obj = JSON.parse(ret.obj);var protoMap = { aType: "conversationType", aId: "publicServiceId", aName: "introduction", aUri: "portraitUri", follow: "hasFollowed", isGlobal: "isGlobal" };for (var key in obj) {var val = obj[key];if (key == "aExtra") {var extra = JSON.parse(val);result["hasFollowed"] = extra.follow;result["isGlobal"] = extra.isGlobal;result["menu"] = extra.menu;}var uId = protoMap[key];if (uId) {result[uId] = val;}}return result;};if (ret) {ret = JSON.parse(ret);var list = ret.list;for (var i = 0, len = list.length; i < len; i++) {var item = list[i];item = transformProto(item);publicList.push(item);}}if (publicList.length > 0) {RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList = publicList;}callback.onSuccess(RongIMLib.RongIMClient._memoryStore.publicServiceMap.publicServiceList);};VCDataProvider.prototype.buildMessage = function (result) {var message = new RongIMLib.Message(),ret = JSON.parse(result);message.conversationType = ret.conversationType;message.targetId = ret.targetId;message.messageDirection = ret.direction;message.senderUserId = ret.senderUserId;if (ret.direction == RongIMLib.MessageDirection.RECEIVE) {message.receivedStatus = ret.status;} else {if (ret.direction == RongIMLib.MessageDirection.SEND) {message.sentStatus = ret.status;}}message.sentTime = ret.sentTime;message.objectName = ret.objectName;var content = ret.content ? JSON.parse(ret.content) : ret.content;var messageType = typeMapping[ret.objectName] || registerMessageTypeMapping[ret.objectName];if (content) {content.messageName = messageType;}message.content = content;message.messageId = ret.messageId;message.messageUId = ret.messageUid;message.messageType = messageType;return message;};VCDataProvider.prototype.buildConversation = function (val) {if (val === "") {return null;
            }var conver = new RongIMLib.Conversation(),c = JSON.parse(val),lastestMsg = c.lastestMsg ? this.buildMessage(c.lastestMsg) : {};conver.conversationTitle = c.title;conver.conversationType = c.conversationType;conver.draft = c.draft;conver.isTop = c.isTop;conver.isHidden = c.isHidden;lastestMsg.conversationType = c.conversationType;lastestMsg.targetId = c.targetId;conver.latestMessage = lastestMsg;conver.latestMessageId = lastestMsg.messageId;conver.latestMessage.messageType = typeMapping[lastestMsg.objectName] || registerMessageTypeMapping[lastestMsg.objectName];conver.objectName = lastestMsg.objectName;conver.receivedStatus = RongIMLib.ReceivedStatus.READ;conver.sentTime = lastestMsg.sentTime;conver.senderUserId = lastestMsg.senderUserId;conver.sentStatus = lastestMsg.status;conver.targetId = c.targetId;conver.unreadMessageCount = c.unreadCount;conver.hasUnreadMention = c.m_hasUnreadMention;var mentions = this.getUnreadMentionedMessages(c.conversationType, c.targetId);if (mentions.length > 0) {var mention = mentions.pop();conver.mentionedMsg = { uid: mention.messageUid, time: mention.sentTime, mentionedInfo: mention.content.mentionedInfo, sendUserId: mention.senderUserId };}return conver;};VCDataProvider.prototype.getRTCUserInfoList = function (room, callback) {this.addon.getRTCUsers(room.id, 1, function (result) {callback.onSuccess(result);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.getRTCRoomInfo = function (room, callback) {var order = 2;this.addon.getRTCResouce(room.id, order, function (result) {callback.onSuccess(JSON.parse(result));}, function (error) {callback.onError(error);});};VCDataProvider.prototype.joinRTCRoom = function (room, callback) {var id = room.id;var type = room.type || 0;this.addon.joinRTCRoom(id, type, function (result, token) {var res = JSON.parse(result);var users = {};var list = res.list;RongIMLib.RongUtil.forEach(list, function (item) {var userId = item.id;var tmpData = {};RongIMLib.RongUtil.forEach(item.data, function (data) {var key = data.key;var value = data.value;tmpData[key] = value;});users[userId] = tmpData;});callback.onSuccess({ users: users, token: token });}, function (error) {callback.onError(error);});};VCDataProvider.prototype.quitRTCRoom = function (room, callback) {this.addon.exitRTCRoom(room.id, function () {callback.onSuccess(true);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.RTCPing = function (room, callback) {this.addon.sendRTCPing(room.id, function () {callback.onSuccess(true);}, function (error) {callback.onError(error);});};VCDataProvider.prototype.setRTCData = function (roomId, key, value, isInner, apiType, callback, message) {var context = this;var hanlders = { room_inner: function room_inner(roomId, key, value, name, content, success, error) {context.addon.setRTCInnerData(roomId, RongIMLib.RTCAPIType.ROOM, key, value, name, content, success, error);}, room_outer: function room_outer(roomId, key, value, name, content, success, error) {context.addon.setRTCOuterData(roomId, RongIMLib.RTCAPIType.ROOM, key, value, name, content, success, error);}, user_inner: function user_inner(roomId, key, value, name, content, success, error) {context.addon.setRTCInnerData(roomId, RongIMLib.RTCAPIType.PERSON, key, value, name, content, success, error);}, user_outer: function user_outer(roomId, key, value, name, content, success, error) {context.addon.setRTCOuterData(roomId, RongIMLib.RTCAPIType.PERSON, key, value, name, content, success, error);} };var type = RongIMLib.RTCAPIType.PERSON == apiType ? "user" : "room";var direction = isInner ? "inner" : "outer";var tpl = "{type}_{direction}";var name = RongIMLib.RongUtil.tplEngine(tpl, { type: type, direction: direction });var handler = hanlders[name];if (handler) {message = message || {};var name = message.name;var content = message.content;handler(roomId, key, value, name, content, function () {callback.onSuccess(true);}, function (code) {callback.onError(code);});}};VCDataProvider.prototype.setRTCRoomData = function (roomId, key, value, isInner, callback, message) {this.setRTCData(roomId, key, value, isInner, RongIMLib.RTCAPIType.ROOM, callback, message);};VCDataProvider.prototype.getRTCData = function (roomId, keys, isInner, apiType, callback) {var context = this;var hanlders = { room_inner: function room_inner(roomId, keys, success, error) {context.addon.getRTCInnerData(roomId, RongIMLib.RTCAPIType.ROOM, keys, success, error);}, room_outer: function room_outer(roomId, keys, success, error) {context.addon.getRTCOuterData(roomId, RongIMLib.RTCAPIType.ROOM, keys, success, error);} };var type = RongIMLib.RTCAPIType.PERSON == apiType ? "user" : "room";var direction = isInner ? "inner" : "outer";var tpl = "{type}_{direction}";var name = RongIMLib.RongUtil.tplEngine(tpl, { type: type, direction: direction });var handler = hanlders[name];if (handler) {handler(roomId, keys, function (result) {var res = JSON.parse(result);var props = {};var list = res.list;RongIMLib.RongUtil.forEach(list, function (item) {props[item.key] = item.value;});callback.onSuccess(props);}, function (code) {callback.onError(code);});}};VCDataProvider.prototype.getRTCRoomData = function (roomId, keys, isInner, callback, message) {this.getRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.ROOM, callback);};VCDataProvider.prototype.removeRTCData = function (roomId, keys, isInner, apiType, callback, message) {var context = this;var hanlders = { room_inner: function room_inner(roomId, keys, name, content, success, error) {context.addon.deleteRTCInnerData(roomId, RongIMLib.RTCAPIType.ROOM, keys, name, content, success, error);
              }, room_outer: function room_outer(roomId, keys, name, content, success, error) {context.addon.deleteRTCOuterData(roomId, RongIMLib.RTCAPIType.ROOM, keys, name, content, success, error);}, user_inner: function user_inner(roomId, keys, name, content, success, error) {}, user_outer: function user_outer(roomId, keys, name, content, success, error) {} };var type = RongIMLib.RTCAPIType.PERSON == apiType ? "user" : "room";var direction = isInner ? "inner" : "outer";var tpl = "{type}_{direction}";var name = RongIMLib.RongUtil.tplEngine(tpl, { type: type, direction: direction });var handler = hanlders[name];if (handler) {message = message || {};var name = message.name || "";var content = message.content || "";handler(roomId, keys, name, content, function () {callback.onSuccess(true);}, function (code) {callback.onError(code);});}};VCDataProvider.prototype.removeRTCRoomData = function (roomId, keys, isInner, callback, message) {this.removeRTCData(roomId, keys, isInner, RongIMLib.RTCAPIType.ROOM, callback);};VCDataProvider.prototype.getNavi = function () {var nav = this.addon.getNav();return nav[this.userId];};VCDataProvider.prototype.setRTCOutData = function (roomId, data, type, callback, message) {};VCDataProvider.prototype.getRTCOutData = function (roomId, userId, callback) {};VCDataProvider.prototype.setRTCUserInfo = function (room, info, callback) {};VCDataProvider.prototype.removeRTCUserInfo = function (room, info, callback) {};VCDataProvider.prototype.getRTCUserList = function (room, callback) {};VCDataProvider.prototype.setRTCRoomInfo = function (room, data, callback) {};VCDataProvider.prototype.removeRTCRoomInfo = function (room, data, callback) {};VCDataProvider.prototype.setRTCUserData = function (roomId, key, value, isInner, callback, message) {this.setRTCData(roomId, key, value, isInner, RongIMLib.RTCAPIType.PERSON, callback, message);};VCDataProvider.prototype.getRTCUserData = function (roomId, key, isInner, callback, message) {};VCDataProvider.prototype.removeRTCUserData = function (roomId, key, isInner, callback, message) {};VCDataProvider.prototype.getRTCToken = function (room, callback) {};VCDataProvider.prototype.setRTCState = function (room, content, callback) {};return VCDataProvider;}();RongIMLib.VCDataProvider = VCDataProvider;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var MemeoryProvider = function () {function MemeoryProvider() {this._memeoryStore = {};this.prefix = "rong_";}MemeoryProvider.prototype.setItem = function (composedKey, object) {this._memeoryStore[composedKey] = decodeURIComponent(object);};MemeoryProvider.prototype.getItem = function (composedKey) {return this._memeoryStore[composedKey];};MemeoryProvider.prototype.removeItem = function (composedKey) {if (this.getItem(composedKey)) {delete this._memeoryStore[composedKey];}};MemeoryProvider.prototype.getItemKey = function (regStr) {var me = this,item = null,reg = new RegExp(regStr + "\\w+");for (var key in me._memeoryStore) {var arr = key.match(reg);if (arr) {item = key;}}return item;};MemeoryProvider.prototype.getItemKeyList = function (regStr) {var prefix = this.prefix;var me = this,itemList = [],reg = new RegExp(regStr + "\\w+");for (var key in me._memeoryStore) {var arr = key.match(reg);if (arr) {key = key.substring(prefix.length);itemList.push(key);}}return itemList;};MemeoryProvider.prototype.clearItem = function () {var me = this;for (var key in me._memeoryStore) {delete me._memeoryStore[key];}};MemeoryProvider.prototype.onOutOfQuota = function () {return 4 * 1024;};return MemeoryProvider;}();RongIMLib.MemeoryProvider = MemeoryProvider;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var LocalStorageProvider = function () {function LocalStorageProvider() {this.prefix = "rong_";this._host = "";var d = new Date(),m = d.getMonth() + 1,date = d.getFullYear() + "/" + (m.toString().length == 1 ? "0" + m : m) + "/" + d.getDate(),nowDate = new Date(date).getTime();for (var key in localStorage) {if (key.lastIndexOf("RECEIVED") > -1) {var recObj = JSON.parse(localStorage.getItem(key));for (var key_1 in recObj) {nowDate - recObj[key_1].dealtime > 0 && delete recObj[key_1];}if (RongIMLib.RongUtil.isEmpty(recObj)) {localStorage.removeItem(key);} else {localStorage.setItem(key, JSON.stringify(recObj));}}if (key.lastIndexOf("SENT") > -1) {var sentObj = JSON.parse(localStorage.getItem(key));nowDate - sentObj.dealtime > 0 && localStorage.removeItem(key);}}}LocalStorageProvider.prototype.setItem = function (composedKey, object) {if (composedKey) {composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);localStorage.setItem(composedKey, object);}};LocalStorageProvider.prototype.getItem = function (composedKey) {if (composedKey) {composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);return localStorage.getItem(composedKey ? composedKey : "");}return "";};LocalStorageProvider.prototype.getItemKey = function (composedStr) {var item = "";var _key = this.prefix + composedStr;for (var key in localStorage) {if (key.indexOf(_key) == 0) {item = key;break;}}return item;};LocalStorageProvider.prototype.getItemKeyList = function (composedStr) {var itemList = [];var prefix = this.prefix;var _key = prefix + composedStr;for (var key in localStorage) {if (key.indexOf(_key) == 0) {key = key.substring(prefix.length);itemList.push(key);}}return itemList;};LocalStorageProvider.prototype.removeItem = function (composedKey) {if (composedKey) {composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);
              localStorage.removeItem(composedKey.toString());}};LocalStorageProvider.prototype.clearItem = function () {var me = this;for (var key in localStorage) {if (key.indexOf(me.prefix) > -1) {me.removeItem(key);}}};LocalStorageProvider.prototype.onOutOfQuota = function () {return JSON.stringify(localStorage).length;};return LocalStorageProvider;}();RongIMLib.LocalStorageProvider = LocalStorageProvider;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var UserDataProvider = function () {function UserDataProvider() {this.opersistName = "RongIMLib";this.keyManager = "RongUserDataKeyManager";this._host = "";this.prefix = "rong_";this.oPersist = document.createElement("div");this.oPersist.style.display = "none";this.oPersist.style.behavior = "url('#default#userData')";document.body.appendChild(this.oPersist);this.oPersist.load(this.opersistName);}UserDataProvider.prototype.setItem = function (key, value) {key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);this.oPersist.setAttribute(key, value);var keyNames = this.getItem(this.keyManager);keyNames ? keyNames.indexOf(key) == -1 && (keyNames += "," + key) : keyNames = key;this.oPersist.setAttribute(this.prefix + this.keyManager, keyNames);this.oPersist.save(this.opersistName);};UserDataProvider.prototype.getItem = function (key) {key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);return key ? this.oPersist.getAttribute(key) : key;};UserDataProvider.prototype.removeItem = function (key) {key && key.indexOf(this.prefix) == -1 && (key = this.prefix + key);this.oPersist.removeAttribute(key);this.oPersist.save(this.opersistName);var keyNames = this.getItem(this.keyManager),keyNameArray = keyNames && keyNames.split(",") || [];for (var i = 0, len = keyNameArray.length; i < len; i++) {if (keyNameArray[i] == key) {keyNameArray.splice(i, 1);}}this.oPersist.setAttribute(this.prefix + this.keyManager, keyNameArray.join(","));this.oPersist.save(this.opersistName);};UserDataProvider.prototype.getItemKey = function (composedStr) {var item = null,keyNames = this.getItem(this.keyManager),keyNameArray = keyNames && keyNames.split(",") || [];var _key = this.prefix + composedStr;if (keyNameArray.length) {for (var i = 0, len = keyNameArray.length; i < len; i++) {if (keyNameArray[i] && keyNameArray[i].indexOf(_key) == 0) {item = keyNameArray[i];break;}}}return item;};UserDataProvider.prototype.getItemKeyList = function (composedStr) {var itemList = [],keyNames = this.getItem(this.keyManager),keyNameArray = keyNames && keyNames.split(",") || [];var prefix = this.prefix;var _key = prefix + composedStr;if (keyNameArray.length) {for (var i = 0, len = keyNameArray.length; i < len; i++) {if (keyNameArray[i] && keyNameArray[i].indexOf(_key) == 0) {var keyName = keyNameArray[i];keyName = keyName.substring(prefix.length);itemList.push(keyNameArray[i]);}}}return itemList;};UserDataProvider.prototype.clearItem = function () {var keyNames = this.getItem(this.keyManager),keyNameArray = [],me = this;keyNames && (keyNameArray = keyNames.split(","));if (keyNameArray.length) {for (var i = 0, len = keyNameArray.length; i < len; i++) {keyNameArray[i] && me.removeItem(keyNameArray[i]);}me.removeItem(me.keyManager);}};UserDataProvider.prototype.onOutOfQuota = function () {return 10 * 1024 * 1024;};return UserDataProvider;}();RongIMLib.UserDataProvider = UserDataProvider;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var FeatureDectector = function () {function FeatureDectector(callback) {this.script = document.createElement("script");this.head = document.getElementsByTagName("head")[0];if ("WebSocket" in window && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !RongIMLib.RongIMClient._memoryStore.depend.isPolling) {RongIMLib.Transportations._TransportType = RongIMLib.Socket.WEBSOCKET;if (!RongIMLib.RongIMClient.Protobuf) {var url = RongIMLib.RongIMClient._memoryStore.depend.protobuf;var script = this.script;script.src = url;this.head.appendChild(script);script.onload = script.onreadystatechange = function () {var isLoaded = !this.readyState || this.readyState == "loaded" || this.readyState == "complete";if (isLoaded) {script.onload = script.onreadystatechange = null;if (callback) {callback();}if (!callback) {var token = RongIMLib.RongIMClient._memoryStore.token;var connectCallback = RongIMLib.RongIMClient._memoryStore.callback;token && RongIMLib.RongIMClient.connect(token, connectCallback);}}};}} else {RongIMLib.Transportations._TransportType = "xhr-polling";RongIMLib.RongIMClient.Protobuf = Polling;}}return FeatureDectector;}();RongIMLib.FeatureDectector = FeatureDectector;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var FeaturePatcher = function () {function FeaturePatcher() {}FeaturePatcher.prototype.patchAll = function () {this.patchJSON();this.patchForEach();};FeaturePatcher.prototype.patchForEach = function () {if (!Array.forEach) {Array.forEach = function (arr, func) {for (var i = 0; i < arr.length; i++) {func.call(arr, arr[i], i, arr);}};}};FeaturePatcher.prototype.patchJSON = function () {if (!window["JSON"]) {window["JSON"] = function () {function JSON() {}JSON.parse = function (sJSON) {return eval("(" + sJSON + ")");};JSON.stringify = function (value) {return this.str("", { "": value });};JSON.str = function (key, holder) {var i,k,v,length,partial,value = holder[key],me = this;if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && typeof value.toJSON === "function") {value = value.toJSON(key);
                  }switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {case "string":return me.quote(value);case "number":return isFinite(value) ? String(value) : "null";case "boolean":case "null":return String(value);case "object":if (!value) {return "null";}partial = [];if (Object.prototype.toString.apply(value) === "[object Array]") {length = value.length;for (i = 0; i < length; i += 1) {partial[i] = me.str(i, value) || "null";}v = partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";return v;}for (k in value) {if (Object.prototype.hasOwnProperty.call(value, k)) {v = me.str(k, value);if (v) {partial.push(me.quote(k) + ":" + v);}}}v = partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";return v;}};JSON.quote = function (string) {var me = this;me.rx_escapable.lastIndex = 0;return me.rx_escapable.test(string) ? '"' + string.replace(me.rx_escapable, function (a) {var c = me.meta[a];return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);}) + '"' : '"' + string + '"';};JSON.rx_escapable = new RegExp("[\\\"\\\\\"\0-\x1F\x7F-\x9F\xAD\u0600-\u0604\u070F\u17B4\u17B5\u200C-\u200F\u2028-\u202F\u2060-\u206F\uFEFF\uFFF0-\uFFFF]", "g");JSON.meta = { "\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "''": "\\''", "\\": "\\\\" };return JSON;}();}};return FeaturePatcher;}();RongIMLib.FeaturePatcher = FeaturePatcher;})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {})(RongIMLib || (RongIMLib = {}));var RongIMLib;(function (RongIMLib) {var PublicServiceMap = function () {function PublicServiceMap() {this.publicServiceList = [];}PublicServiceMap.prototype.get = function (publicServiceType, publicServiceId) {for (var i = 0, len = this.publicServiceList.length; i < len; i++) {if (this.publicServiceList[i].conversationType == publicServiceType && publicServiceId == this.publicServiceList[i].publicServiceId) {return this.publicServiceList[i];}}};PublicServiceMap.prototype.add = function (publicServiceProfile) {var isAdd = true,me = this;for (var i = 0, len = this.publicServiceList.length; i < len; i++) {if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {this.publicServiceList.unshift(this.publicServiceList.splice(i, 1)[0]);isAdd = false;break;}}if (isAdd) {this.publicServiceList.unshift(publicServiceProfile);}};PublicServiceMap.prototype.replace = function (publicServiceProfile) {var me = this;for (var i = 0, len = this.publicServiceList.length; i < len; i++) {if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {me.publicServiceList.splice(i, 1, publicServiceProfile);break;}}};PublicServiceMap.prototype.remove = function (conversationType, publicServiceId) {var me = this;for (var i = 0, len = this.publicServiceList.length; i < len; i++) {if (me.publicServiceList[i].conversationType == conversationType && publicServiceId == me.publicServiceList[i].publicServiceId) {this.publicServiceList.splice(i, 1);break;}}};return PublicServiceMap;}();RongIMLib.PublicServiceMap = PublicServiceMap;var ConversationMap = function () {function ConversationMap() {this.conversationList = [];}ConversationMap.prototype.get = function (conversavtionType, targetId) {for (var i = 0, len = this.conversationList.length; i < len; i++) {if (this.conversationList[i].conversationType == conversavtionType && this.conversationList[i].targetId == targetId) {return this.conversationList[i];}}return null;};ConversationMap.prototype.add = function (conversation) {var isAdd = true;for (var i = 0, len = this.conversationList.length; i < len; i++) {if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {this.conversationList.unshift(this.conversationList.splice(i, 1)[0]);isAdd = false;break;}}if (isAdd) {this.conversationList.unshift(conversation);}};ConversationMap.prototype.replace = function (conversation) {for (var i = 0, len = this.conversationList.length; i < len; i++) {if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {this.conversationList.splice(i, 1, conversation);break;}}};ConversationMap.prototype.remove = function (conversation) {for (var i = 0, len = this.conversationList.length; i < len; i++) {if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {this.conversationList.splice(i, 1);break;}}};return ConversationMap;}();RongIMLib.ConversationMap = ConversationMap;var CheckParam = function () {function CheckParam() {}CheckParam.getInstance = function () {if (!CheckParam._instance) {CheckParam._instance = new CheckParam();}return CheckParam._instance;};CheckParam.prototype.logger = function (code, funcName, msg) {RongIMLib.RongIMClient.logger({ code: code, funcName: funcName, msg: msg });};CheckParam.prototype.check = function (f, position, d, c) {if (RongIMLib.RongIMClient._dataAccessProvider || d) {for (var g = 0, e = c.length; g < e; g++) {if (!new RegExp(this.getType(c[g])).test(f[g])) {var msg = "第" + (g + 1) + "个参数错误, 错误类型：" + this.getType(c[g]) + " [" + f[g] + "] -> 位置:" + position;this.logger("-3", position, msg);}}} else {var msg = "该参数不正确或尚未实例化RongIMClient -> 位置:" + position;
              this.logger("-4", position, msg);}};CheckParam.prototype.getType = function (str) {var temp = Object.prototype.toString.call(str).toLowerCase();return temp.slice(8, temp.length - 1);};CheckParam.prototype.checkCookieDisable = function () {document.cookie = "checkCookie=1";var arr = document.cookie.match(new RegExp("(^| )checkCookie=([^;]*)(;|$)")),isDisable = false;if (!arr) {isDisable = true;}document.cookie = "checkCookie=1;expires=Thu, 01-Jan-1970 00:00:01 GMT";return isDisable;};return CheckParam;}();RongIMLib.CheckParam = CheckParam;var LimitableMap = function () {function LimitableMap(limit) {this.map = {};this.keys = [];this.limit = limit || 10;}LimitableMap.prototype.set = function (key, value) {this.map[key] = value;};LimitableMap.prototype.get = function (key) {return this.map[key] || 0;};LimitableMap.prototype.remove = function (key) {delete this.map[key];};return LimitableMap;}();RongIMLib.LimitableMap = LimitableMap;var MemoryCache = function () {function MemoryCache() {this.cache = {};}MemoryCache.prototype.set = function (key, value) {this.cache[key] = value;};MemoryCache.prototype.get = function (key) {return this.cache[key];};MemoryCache.prototype.remove = function (key) {delete this.cache[key];};return MemoryCache;}();RongIMLib.MemoryCache = MemoryCache;var RongAjax = function () {function RongAjax(options) {var me = this;me.xmlhttp = null;me.options = options;var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();if ("undefined" != typeof XMLHttpRequest && hasCORS) {me.xmlhttp = new XMLHttpRequest();} else {if ("undefined" != typeof XDomainRequest) {me.xmlhttp = new XDomainRequest();} else {me.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}}}RongAjax.prototype.send = function (callback) {var me = this;me.options.url || (me.options.url = "http://upload.qiniu.com/putb64/-1");me.xmlhttp.onreadystatechange = function () {if (me.xmlhttp.readyState == 4) {if (me.options.type) {callback();} else {callback(JSON.parse(me.xmlhttp.responseText.replace(/'/g, '"')));}}};me.xmlhttp.open("POST", me.options.url, true);me.xmlhttp.withCredentials = false;if ("setRequestHeader" in me.xmlhttp) {if (me.options.type) {me.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");} else {me.xmlhttp.setRequestHeader("Content-type", "application/octet-stream");me.xmlhttp.setRequestHeader("Authorization", "UpToken " + me.options.token);}}me.xmlhttp.send(me.options.type ? "appKey=" + me.options.appKey + "&deviceId=" + me.options.deviceId + "&timestamp=" + me.options.timestamp + "&deviceInfo=" + me.options.deviceInfo + "&privateInfo=" + JSON.stringify(me.options.privateInfo) : me.options.base64);};return RongAjax;}();RongIMLib.RongAjax = RongAjax;function Prosumer() {var data = [],isConsuming = false;this.produce = function (res) {data.push(res);};this.consume = function (callback, finished) {if (isConsuming) {return;}isConsuming = true;var next = function next() {var res = data.shift();if (RongUtil.isUndefined(res)) {isConsuming = false;finished && finished();return;}callback(res, next);};next();};this.isExeuting = function () {return isConsuming;};}var RongUtil = function () {function RongUtil() {}RongUtil.noop = function () {};RongUtil.isEmpty = function (obj) {var result = true;if (RongUtil.isObject(obj)) {RongUtil.forEach(obj, function () {result = false;});}if (RongUtil.isString(obj) || RongUtil.isArray(obj)) {return obj.length === 0;}if (RongUtil.isNumber(obj)) {return obj === 0;}return result;};RongUtil.isLengthLimit = function (str, maxLen, minLen) {minLen = minLen || 0;var strLen = str.length;return strLen <= maxLen && strLen >= minLen;};RongUtil.MD5 = function (str, key, raw) {return md5(str, key, raw);};RongUtil.isObject = function (obj) {return Object.prototype.toString.call(obj) == "[object Object]";};RongUtil.isArray = function (array) {return Object.prototype.toString.call(array) == "[object Array]";};RongUtil.isString = function (array) {return Object.prototype.toString.call(array) == "[object String]";};RongUtil.isFunction = function (fun) {return Object.prototype.toString.call(fun) == "[object Function]";};RongUtil.isUndefined = function (str) {return Object.prototype.toString.call(str) == "[object Undefined]";};RongUtil.isEqual = function (a, b) {return a === b;};RongUtil.indexOf = function (arrs, item) {var index = -1;for (var i = 0; i < arrs.length; i++) {if (item === arrs[i]) {index = i;break;}}return index;};RongUtil.stringFormat = function (tmpl, vals) {for (var i = 0, len = vals.length; i < len; i++) {var val = vals[i],reg = new RegExp("\\{" + i + "\\}", "g");tmpl = tmpl.replace(reg, val);}return tmpl;};RongUtil.tplEngine = function (temp, data, regexp) {if (!(Object.prototype.toString.call(data) === "[object Array]")) {data = [data];}var ret = [];for (var i = 0, j = data.length; i < j; i++) {ret.push(replaceAction(data[i]));}return ret.join("");function replaceAction(object) {return temp.replace(regexp || /{([^}]+)}/g, function (match, name) {if (match.charAt(0) == "\\") {return match.slice(1);}return object[name] != undefined ? object[name] : "{" + name + "}";});}};RongUtil.forEach = function (obj, callback) {callback = callback || RongUtil.noop;var loopObj = function loopObj() {for (var key in obj) {if (obj.hasOwnProperty(key)) {callback(obj[key], key, obj);}}};var loopArr = function loopArr() {for (var i = 0, len = obj.length; i < len; i++) {callback(obj[i], i);}};if (RongUtil.isObject(obj)) {loopObj();
            }if (RongUtil.isArray(obj)) {loopArr();}};RongUtil.extend = function (source, target, callback, force) {RongUtil.forEach(source, function (val, key) {var hasProto = key in target;if (force && hasProto) {target[key] = val;}if (!hasProto) {target[key] = val;}});return target;};RongUtil.createXHR = function () {var item = { XMLHttpRequest: function (_XMLHttpRequest) {function XMLHttpRequest() {return _XMLHttpRequest.apply(this, arguments);}XMLHttpRequest.toString = function () {return _XMLHttpRequest.toString();};return XMLHttpRequest;}(function () {return new XMLHttpRequest();}), XDomainRequest: function (_XDomainRequest) {function XDomainRequest() {return _XDomainRequest.apply(this, arguments);}XDomainRequest.toString = function () {return _XDomainRequest.toString();};return XDomainRequest;}(function () {return new XDomainRequest();}), ActiveXObject: function (_ActiveXObject) {function ActiveXObject() {return _ActiveXObject.apply(this, arguments);}ActiveXObject.toString = function () {return _ActiveXObject.toString();};return ActiveXObject;}(function () {return new ActiveXObject("Microsoft.XMLHTTP");}) };var isXHR = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();var isXDR = typeof XDomainRequest == "function";var key = isXHR ? "XMLHttpRequest" : isXDR ? "XDomainRequest" : "ActiveXObject";return item[key]();};RongUtil.request = function (opts) {var url = opts.url;var success = opts.success;var error = opts.error || RongUtil.noop;var method = opts.method || "GET";var xhr = RongUtil.createXHR();if ("onload" in xhr) {xhr.onload = function () {xhr.onload = RongUtil.noop;success(xhr.responseText);};xhr.onerror = function () {error(xhr.status, xhr.responseText);xhr.onerror = RongUtil.noop;};} else {xhr.onreadystatechange = function () {if (xhr.readyState == 4) {var status = xhr.status;if (status == 200) {success(xhr.responseText);} else {error(status, xhr.responseText);}}};}xhr.open(method, url, true);xhr.send(null);return xhr;};RongUtil.formatProtoclPath = function (config) {var path = config.path;var protocol = config.protocol;var tmpl = config.tmpl || "{0}{1}";var sub = config.sub;var flag = "://";var index = path.indexOf(flag);var hasProtocol = index > -1;if (hasProtocol) {index += flag.length;path = path.substring(index);}if (sub) {index = path.indexOf("/");var hasPath = index > -1;if (hasPath) {path = path.substr(0, index);}}return RongUtil.stringFormat(tmpl, [protocol, path]);};RongUtil.getUrlHost = function (url) {var index = RongUtil.indexOf(url, "/");return url.substring(0, index);};RongUtil.supportLocalStorage = function () {var support = false;if ((typeof localStorage === "undefined" ? "undefined" : _typeof(localStorage)) == "object") {try {var key = "RC_TMP_KEY",value = "RC_TMP_VAL";localStorage.setItem(key, value);var localVal = localStorage.getItem(key);if (localVal == value) {support = true;}} catch (err) {console.log("localStorage is disabled.");}}return support;};RongUtil.rename = function (origin, newNames) {var isObject = RongUtil.isObject(origin);if (isObject) {origin = [origin];}origin = JSON.parse(JSON.stringify(origin));var updateProperty = function updateProperty(val, key, obj) {delete obj[key];key = newNames[key];obj[key] = val;};RongUtil.forEach(origin, function (item) {RongUtil.forEach(item, function (val, key, obj) {var isRename = key in newNames;(isRename ? updateProperty : RongUtil.noop)(val, key, obj);});});return isObject ? origin[0] : origin;};RongUtil.some = function (arrs, callback) {var has = false;for (var i = 0, len = arrs.length; i < len; i++) {if (callback(arrs[i])) {has = true;break;}}return has;};RongUtil.keys = function (obj) {var props = [];for (var key in obj) {props.push(key);}return props;};RongUtil.isNumber = function (num) {return Object.prototype.toString.call(num) == "[object Number]";};RongUtil.getTimestamp = function () {var date = new Date();return date.getTime();};RongUtil.isSupportRequestHeaders = function () {var userAgent = navigator.userAgent;var isIE = window.ActiveXObject || "ActiveXObject" in window;if (isIE) {var reIE = new RegExp("MSIE (\\d+\\.\\d+);");reIE.test(userAgent);var fIEVersion = parseFloat(RegExp["$1"]);return fIEVersion > 9;}return true;};RongUtil.hasValidWsUrl = function (urls) {try {urls = JSON.parse(urls);} catch (e) {return false;}var validUrlList = RongUtil.getValidWsUrlList(urls);return validUrlList.length > 0;};RongUtil.getValidWsUrlList = function (urls) {var invalidWsUrls = RongIMLib.RongIMClient.invalidWsUrls;var validUrlList = [];RongUtil.forEach(urls, function (url) {if (RongUtil.indexOf(invalidWsUrls, url) === -1) {validUrlList.push(url);}});return validUrlList;};RongUtil.Prosumer = Prosumer;return RongUtil;}();RongIMLib.RongUtil = RongUtil;var RongObserver = function () {function RongObserver() {this.watchers = {};}RongObserver.prototype.genUId = function (key) {var time = new Date().getTime();return [key, time].join("_");};RongObserver.prototype.watch = function (params) {var me = this;var key = params.key;var multiple = params.multiple;key = RongUtil.isArray(key) ? key : [key];var func = params.func;RongUtil.forEach(key, function (k) {k = multiple ? me.genUId(k) : k;me.watchers[k] = func;});};RongObserver.prototype.notify = function (params) {var me = this;var key = params.key;var entity = params.entity;for (var k in me.watchers) {var isNotify = k.indexOf(key) == 0;if (isNotify) {me.watchers[k](entity);}}};RongObserver.prototype.remove = function () {};return RongObserver;
        }();RongIMLib.RongObserver = RongObserver;var Observer = function () {function Observer() {this.observers = [];}Observer.prototype.add = function (observer, force) {if (force) {this.observers = [observer];}if (RongUtil.isFunction(observer)) {this.observers.push(observer);}};Observer.prototype.emit = function (data) {RongUtil.forEach(this.observers, function (observer) {observer(data);});};Observer.prototype.clear = function () {this.observers = [];};Observer.prototype.checkIndexOutBound = function (index, bound) {var isOutBound = index > -1 && index < bound;return isOutBound;};Observer.prototype.removeAt = function (index) {var isOutBound = this.checkIndexOutBound(index, this.observers.length);if (isOutBound) {this.observers.splice(index, 1);}};Observer.prototype.remove = function (observer) {var me = this;if (!observer) {me.clear();return;}if (!RongUtil.isFunction(observer)) {return;}var observerList = me.observers;for (var i = observerList.length - 1; i >= 0; i--) {if (observer === observerList[i]) {me.removeAt(i);}}};return Observer;}();RongIMLib.Observer = Observer;var Timer = function () {function Timer(config) {this.timeout = 0;this.timers = [];this.timeout = config.timeout;}Timer.prototype.resume = function (callback) {var timer = setTimeout(callback, this.timeout);this.timers.push(timer);};Timer.prototype.pause = function () {RongUtil.forEach(this.timers, function (timer) {clearTimeout(timer);});};return Timer;}();RongIMLib.Timer = Timer;var IndexTools = function () {function IndexTools(config) {this.items = [];this.index = 0;this.onwheel = function () {};this.items = config.items;this.onwheel = config.onwheel;}IndexTools.prototype.get = function () {var context = this;var items = context.items;var index = context.index;var isWheel = index >= items.length;if (isWheel) {context.onwheel();}return isWheel ? 0 : index;};IndexTools.prototype.add = function () {this.index += 1;};return IndexTools;}();RongIMLib.IndexTools = IndexTools;var InnerUtil = function () {function InnerUtil() {}InnerUtil.getUId = function (token) {return md5(token).slice(8, 16);};return InnerUtil;}();RongIMLib.InnerUtil = InnerUtil;})(RongIMLib || (RongIMLib = {}));var miniRequest = mini.request,miniStorage = mini.storage,miniSocket = mini.socket;var tools = { request: function request(option, callbacks) {var url = option.url;var method = option.method || "get";method = method.toUpperCase();var data = option.data || {};var header = option.header || {};var xhr = miniRequest({ url: url, method: method, data: data, header: header, success: callbacks.success, fail: callbacks.fail });option.timeout && setTimeout(function () {xhr.abort();}, option.timeout);return xhr;}, socket: function socket(option, callbacks) {var url = option.url;var method = option.method || "get";method = method.toUpperCase();var data = option.data || {};var header = option.header || {};miniSocket.onSocketOpen(function (res) {callbacks.open(miniSocket, res);});miniSocket.onSocketError(callbacks.error);miniSocket.onSocketMessage(callbacks.message);miniSocket.onSocketClose(callbacks.close);miniSocket.connectSocket({ url: url, data: data, method: method, header: header });return miniSocket;} };var initIM = RongIMLib.RongIMClient.init;RongIMLib.RongIMClient.init = function (appKey, dataAccessProvider, options, callback) {options = options || {};options.isNotifyConversationList = true;return initIM(appKey, dataAccessProvider, options, callback);};var WebPollingTransportation = RongIMLib.PollingTransportation;var MiniPollingTransportation = function MiniPollingTransportation(params) {var me = new WebPollingTransportation(params);me.getRequest = function (url, isconnect, options) {options = options || {};var callback = options.callback || function () {};var pid = encodeURIComponent(me.pid);var protocol = RongIMLib.RongIMClient._memoryStore.depend.protocol;var tpl = "{protocol}{url}&pid={pid}";url = RongIMLib.RongUtil.tplEngine(tpl, { protocol: protocol, url: url, pid: pid });me.xhr = tools.request({ url: url, data: { t: Math.random() } }, { success: function success(res) {var isError = res.statusCode == 400;if (isError) {return me.onError();}var data = res.data;var status = data.status;if (status == 3) {return me.onError(RongIMLib.ErrorCode.MINI_PROGAM_SERVICE_NOT_OPEN);}me.onSuccess(JSON.stringify(data), isconnect);callback();}, fail: function fail() {me.onError();} });};me.send = function (data) {RongIMLib.RongIMClient._memoryStore.depend.wsScheme = "wss://";var path = data.url;var servers = RongIMLib.RongIMClient._storageProvider.getItem("servers");servers = JSON.parse(servers);var host = servers[0];var protocol = RongIMLib.RongIMClient._memoryStore.depend.protocol;var pid = encodeURIComponent(me.pid);var tpl = "{protocol}{host}/websocket{path}&pid={pid}";var url = RongIMLib.RongUtil.tplEngine(tpl, { protocol: protocol, host: host, path: path, pid: pid });var body = JSON.stringify(data.data);me.sendxhr = tools.request({ url: url, method: "POST", data: body }, { success: function success(res) {var _data = res.data;if (!_data) {return;}var isBadReq = res.statusCode == 400;if (isBadReq) {console.log("inner sendmessage error", res);return;}_data = JSON.stringify(_data);me.onData(_data);}, fail: function fail(e) {me.connected = false;me.onClose();me.socket.fire("StatusChanged", RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);} });};me.onClose = function () {if (me.xhr) {me.xhr.abort();me.xhr = null;}if (me.sendxhr) {me.sendxhr.abort();
            me.sendxhr = null;}};return me;};RongIMLib.PollingTransportation = MiniPollingTransportation;var WebSocketTransportation = RongIMLib.SocketTransportation;var MiniSocketTransportation = function MiniSocketTransportation(params) {var me = new WebSocketTransportation(params);me.createTransport = function (url) {url = "wss://" + url;var callbacks = { open: function open() {me.connected = true;me.isClose = false;me.socket.fire("connect");}, error: function error() {me.onError();}, message: function message() {me.onData(res.data);}, close: function close(res) {me.onClose(res);} };me.socket = tools.socket(option, callbacks);return me.socket;};me.disconnect = function (status) {me.isClose = true;if (status) {me._status = status;}me.socket.closeSocket();};return me;};RongIMLib.SocketTransportation = MiniSocketTransportation;var LocalStorageProvider = function LocalStorageProvider() {var LocalStorageProviderPrefix = "rong_";var setItem = function setItem(composedKey, object) {var prefix = LocalStorageProviderPrefix;if (composedKey) {composedKey.indexOf(prefix) == -1 && (composedKey = prefix + composedKey);miniStorage.set(composedKey, object);}};var getItem = function getItem(composedKey) {var prefix = LocalStorageProviderPrefix;if (composedKey) {composedKey.indexOf(prefix) == -1 && (composedKey = prefix + composedKey);return miniStorage.get(composedKey);}return "";};var getItemKey = function getItemKey(composedStr) {var prefix = LocalStorageProviderPrefix;if (composedStr.indexOf(prefix) == -1) {composedStr = prefix + composedStr;}var item = "";var keys = miniStorage.getKeys();keys.forEach(function (key) {if (key.indexOf(composedStr) == 0) {item = key;}});return item;};var getItemKeyList = function getItemKeyList(composedStr) {var prefix = LocalStorageProviderPrefix;if (composedStr.indexOf(prefix) == -1) {composedStr = prefix + composedStr;}var itemList = [];var keys = miniStorage.getKeys();keys.forEach(function (key) {if (key.indexOf(composedStr) == 0) {key = key.substring(prefix.length);itemList.push(key);}});return itemList;};var removeItem = function removeItem(composedKey) {var prefix = LocalStorageProviderPrefix;if (composedKey) {composedKey.indexOf(prefix) == -1 && (composedKey = prefix + composedKey);miniStorage.remove(composedKey);}};var clearItem = function clearItem() {var prefix = LocalStorageProviderPrefix;var keys = miniStorage.getKeys();keys.forEach(function (key) {if (key.indexOf(prefix) == 0) {miniStorage.remove(key);}});};return { setItem: setItem, getItem: getItem, getItemKey: getItemKey, getItemKeyList: getItemKeyList, removeItem: removeItem, clearItem: clearItem };};RongIMLib.LocalStorageProvider = LocalStorageProvider;RongIMLib.Navigation.prototype.requestNavi = function (token, appId, onSuccess) {var depend = RongIMLib.RongIMClient._memoryStore.depend;var cometList = depend.cometList || ["cometproxy-cn.ronghub.com", "mini-cn.ronghub.com"];var wsList = depend.wsList || ["wsproxy.cn.ronghub.com"];var isPolling = depend.isPolling;var server = isPolling ? cometList : wsList;RongIMLib.RongIMClient._storageProvider.setItem("servers", JSON.stringify(server));RongIMLib.RongIMClient._memoryStore.depend.protocol = depend.protocol || "https://";RongIMLib.RongIMClient._memoryStore.depend.wsScheme = depend.wsScheme || "wss://";onSuccess();};RongIMLib.RongUtil.supportLocalStorage = function () {return true;};RongIMLib.RongUtil.isSupportRequestHeaders = function () {return true;};RongIMLib.RongUtil.request = function (opts) {opts = opts || {};var success = opts.success;var error = opts.error;opts.method = opts.method || "GET";return tools.request(opts, { success: success, fail: error });};RongIMLib.FeaturePatcher.prototype.patchJSON = function () {};RongIMLib.FeatureDectector = function () {RongIMLib.Transportations._TransportType = "xhr-polling";RongIMLib.RongIMClient.Protobuf = Polling;};return RongIMLib;}();};var mini = getMini(wx);var wx$1 = RongLib(mini);return wx$1;});

/***/ }),

/***/ 17:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 18:
/*!***************************!*\
  !*** E:/app/util/http.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = __webpack_require__(/*! ./config */ 12);


var _md = _interopRequireDefault(__webpack_require__(/*! ./md5.min */ 19));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

Http = /*#__PURE__*/function () {
  function Http(baseConfig) {_classCallCheck(this, Http);
    this.config = baseConfig;
    // 拦截器
    this.interceptors = {
      request: function request(func) {
        if (func) {
          Http.requestBefore = func;
        } else {
          Http.requestBefore = function (request) {return request;};
        }
      },
      response: function response(func) {
        if (func) {
          Http.requestAfter = func;
        } else {
          Http.requestAfter = function (response) {return response;};
        }
      } };

  }_createClass(Http, [{ key: "setConfig", value: function setConfig(









    func) {
      this.config = func(this.config);
    }
    // 判断url是否完整
  }, { key: "beforSend", value: function beforSend(



    params) {
      var timestamp = new Date().getTime();
      var sign = (0, _md.default)('AppID=' + _config.wexinConfig.AppID + '&timestamp=' + timestamp);
      // const userInfo = uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {}
      var userLocationInfo = uni.getStorageSync('userLocationInfo') ? uni.getStorageSync('userLocationInfo') : {};
      var obj = {
        timestamp: timestamp,
        sign: sign,
        // id: userInfo.id || '-1',
        para: JSON.stringify(_objectSpread({
          latitude: userLocationInfo.latitude,
          longitude: userLocationInfo.longitude },

        params)),

        version: _config.wexinConfig.version };

      return obj;
    } }, { key: "request", value: function request()

    {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      options.baseURL = options.baseURL ? options.baseURL : this.config.baseURL;
      options.dataType = options.dataType || this.config.dataType;
      options.url = Http.isCompleteURL(options.url) ? options.url : options.baseURL + options.url;
      options.data = this.beforSend(options.data);


      options.header = _objectSpread({}, options.header,
      this.config.header);

      options.method = options.method || this.config.method;
      options.withCredentials = true;

      options = _objectSpread({}, options,
      Http.requestBefore(options));


      return new Promise(function (resolve, reject) {
        options.success = function (response) {
          if (response.data.code === 500) {
            reject(Http.requestAfter(response));
          } else {
            resolve(Http.requestAfter(response));
          }
        };
        options.fail = function (error) {
          reject(Http.requestAfter(error));
        };
        uni.request(options);
      });
      // uni.request(options).then(res =>{
      // 	// console.log(res);
      // 	if(res && res.data.code === 500){
      // 		reject(Http.requestAfter(res));
      // 	}else{
      // 		reslove(Http.requestAfter(res));
      // 	}
      // }).catch(err =>{
      // 	reject(Http.requestAfter(err));
      // })
      // })
    } }, { key: "get", value: function get(

    url, data) {var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.url = url;
      options.data = data;
      options.method = 'GET';
      return this.request(options);
    } }, { key: "post", value: function post(

    url, data) {var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.url = url;
      options.data = data;
      options.method = 'POST';
      return this.request(options);
    } }], [{ key: "requestBefore", value: function requestBefore(request) {return request;} }, { key: "requestAfter", value: function requestAfter(response) {return response;} }, { key: "isCompleteURL", value: function isCompleteURL(url) {return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);} }]);return Http;}();



Http.install = function (Vue) {
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (this.$options.http) {
        Vue._http = this.$options.http;
      }
    } });

  Object.defineProperty(Vue.prototype, '$http', {
    get: function get() {
      return Vue._http.axios;
    } });

};var _default =

Http;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 19:
/*!******************************!*\
  !*** E:/app/util/md5.min.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__; /**
               * [js-md5]{@link https://github.com/emn178/js-md5}
               *
               * @namespace md5
               * @version 0.7.3
               * @author Chen, Yi-Cyuan [emn178@gmail.com]
               * @copyright Chen, Yi-Cyuan 2014-2017
               * @license MIT
               */
!function () {'use strict';function t(t) {if (t) d[0] = d[16] = d[1] = d[2] = d[3] = d[4] = d[5] = d[6] = d[7] = d[8] = d[9] = d[10] = d[11] = d[12] = d[13] = d[14] = d[15] = 0, this.blocks = d, this.buffer8 = l;else if (a) {var r = new ArrayBuffer(68);this.buffer8 = new Uint8Array(r), this.blocks = new Uint32Array(r);} else this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0;}var r = 'input is invalid type';var e = typeof window === 'object';var i = e ? window : {};i.JS_MD5_NO_WINDOW && (e = !1);var s = !e && typeof self === 'object';var h = !i.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;h ? i = global : s && (i = self);var f = !i.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;var o =  true && __webpack_require__(/*! !webpack amd options */ 22);var a = !i.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';var n = '0123456789abcdef'.split('');var u = [128, 32768, 8388608, -2147483648];var y = [0, 8, 16, 24];var c = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];var p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');var d = [];var l;if (a) {var A = new ArrayBuffer(68);l = new Uint8Array(A), d = new Uint32Array(A);}!i.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) {return Object.prototype.toString.call(t) === '[object Array]';}), !a || !i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) {return typeof t === 'object' && t.buffer && t.buffer.constructor === ArrayBuffer;});var b = function b(r) {return function (e) {return new t(!0).update(e)[r]();};};var v = function v() {var r = b('hex');h && (r = w(r)), r.create = function () {return new t();}, r.update = function (t) {return r.create().update(t);};for (var e = 0; e < c.length; ++e) {var i = c[e];r[i] = b(i);}return r;};var w = function w(t) {var e = eval("require('crypto')");var i = eval("require('buffer').Buffer");var s = function s(_s) {if (typeof _s === 'string') return e.createHash('md5').update(_s, 'utf8').digest('hex');if (_s === null || void 0 === _s) throw r;return _s.constructor === ArrayBuffer && (_s = new Uint8Array(_s)), Array.isArray(_s) || ArrayBuffer.isView(_s) || _s.constructor === i ? e.createHash('md5').update(new i(_s)).digest('hex') : t(_s);};return s;};t.prototype.update = function (t) {if (!this.finalized) {var e;var i = typeof t;if (i !== 'string') {if (i !== 'object') throw r;if (t === null) throw r;if (a && t.constructor === ArrayBuffer) t = new Uint8Array(t);else if (!(Array.isArray(t) || a && ArrayBuffer.isView(t))) throw r;e = !0;}for (var s, h, f = 0, o = t.length, n = this.blocks, u = this.buffer8; f < o;) {if (this.hashed && (this.hashed = !1, n[0] = n[16], n[16] = n[1] = n[2] = n[3] = n[4] = n[5] = n[6] = n[7] = n[8] = n[9] = n[10] = n[11] = n[12] = n[13] = n[14] = n[15] = 0), e) {if (a) for (h = this.start; f < o && h < 64; ++f) {u[h++] = t[f];} else for (h = this.start; f < o && h < 64; ++f) {n[h >> 2] |= t[f] << y[3 & h++];}} else if (a) for (h = this.start; f < o && h < 64; ++f) {(s = t.charCodeAt(f)) < 128 ? u[h++] = s : s < 2048 ? (u[h++] = 192 | s >> 6, u[h++] = 128 | 63 & s) : s < 55296 || s >= 57344 ? (u[h++] = 224 | s >> 12, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), u[h++] = 240 | s >> 18, u[h++] = 128 | s >> 12 & 63, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s);} else for (h = this.start; f < o && h < 64; ++f) {(s = t.charCodeAt(f)) < 128 ? n[h >> 2] |= s << y[3 & h++] : s < 2048 ? (n[h >> 2] |= (192 | s >> 6) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : s < 55296 || s >= 57344 ? (n[h >> 2] |= (224 | s >> 12) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), n[h >> 2] |= (240 | s >> 18) << y[3 & h++], n[h >> 2] |= (128 | s >> 12 & 63) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]);}this.lastByteIndex = h, this.bytes += h - this.start, h >= 64 ? (this.start = h - 64, this.hash(), this.hashed = !0) : this.start = h;}return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this;}}, t.prototype.finalize = function () {if (!this.finalized) {this.finalized = !0;var t = this.blocks;var r = this.lastByteIndex;t[r >> 2] |= u[3 & r], r >= 56 && (this.hashed || this.hash(), t[0] = t[16], t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.bytes << 3, t[15] = this.hBytes << 3 | this.bytes >>> 29, this.hash();}}, t.prototype.hash = function () {var t;var r;var e;var i;var s;var h;var f = this.blocks;this.first ? r = ((r = ((t = ((t = f[0] - 680876937) << 7 | t >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (i = ((i = (-1732584194 ^ 2004318071 & t) + f[1] - 117830708) << 12 | i >>> 20) + t << 0) & (-271733879 ^ t)) + f[2] - 1126478375) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1316259209) << 22 | r >>> 10) + e << 0 : (t = this.h0, r = this.h1, e = this.h2, r = ((r += ((t = ((t += ((i = this.h3) ^ r & (e ^ i)) + f[0] - 680876936) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[1] - 389564586) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[2] + 606105819) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1044525330) << 22 | r >>> 10) + e << 0), r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[4] - 176418897) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[5] + 1200080426) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[6] - 1473231341) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[7] - 45705983) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[8] + 1770035416) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[9] - 1958414417) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[10] - 42063) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[11] - 1990404162) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[12] + 1804603682) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[13] - 40341101) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[14] - 1502002290) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[15] + 1236535329) << 22 | r >>> 10) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[1] - 165796510) << 5 | t >>> 27) + r << 0) ^ r)) + f[6] - 1069501632) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[11] + 643717713) << 14 | e >>> 18) + i << 0) ^ i)) + f[0] - 373897302) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[5] - 701558691) << 5 | t >>> 27) + r << 0) ^ r)) + f[10] + 38016083) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[15] - 660478335) << 14 | e >>> 18) + i << 0) ^ i)) + f[4] - 405537848) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[9] + 568446438) << 5 | t >>> 27) + r << 0) ^ r)) + f[14] - 1019803690) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[3] - 187363961) << 14 | e >>> 18) + i << 0) ^ i)) + f[8] + 1163531501) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[13] - 1444681467) << 5 | t >>> 27) + r << 0) ^ r)) + f[2] - 51403784) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[7] + 1735328473) << 14 | e >>> 18) + i << 0) ^ i)) + f[12] - 1926607734) << 20 | r >>> 12) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[5] - 378558) << 4 | t >>> 28) + r << 0)) + f[8] - 2022574463) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[11] + 1839030562) << 16 | e >>> 16) + i << 0)) + f[14] - 35309556) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[1] - 1530992060) << 4 | t >>> 28) + r << 0)) + f[4] + 1272893353) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[7] - 155497632) << 16 | e >>> 16) + i << 0)) + f[10] - 1094730640) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[13] + 681279174) << 4 | t >>> 28) + r << 0)) + f[0] - 358537222) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[3] - 722521979) << 16 | e >>> 16) + i << 0)) + f[6] + 76029189) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[9] - 640364487) << 4 | t >>> 28) + r << 0)) + f[12] - 421815835) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[15] + 530742520) << 16 | e >>> 16) + i << 0)) + f[2] - 995338651) << 23 | r >>> 9) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[0] - 198630844) << 6 | t >>> 26) + r << 0) | ~e)) + f[7] + 1126891415) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[14] - 1416354905) << 15 | e >>> 17) + i << 0) | ~t)) + f[5] - 57434055) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[12] + 1700485571) << 6 | t >>> 26) + r << 0) | ~e)) + f[3] - 1894986606) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[10] - 1051523) << 15 | e >>> 17) + i << 0) | ~t)) + f[1] - 2054922799) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[8] + 1873313359) << 6 | t >>> 26) + r << 0) | ~e)) + f[15] - 30611744) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[6] - 1560198380) << 15 | e >>> 17) + i << 0) | ~t)) + f[13] + 1309151649) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[4] - 145523070) << 6 | t >>> 26) + r << 0) | ~e)) + f[11] - 1120210379) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[2] + 718787259) << 15 | e >>> 17) + i << 0) | ~t)) + f[9] - 343485551) << 21 | r >>> 11) + e << 0, this.first ? (this.h0 = t + 1732584193 << 0, this.h1 = r - 271733879 << 0, this.h2 = e - 1732584194 << 0, this.h3 = i + 271733878 << 0, this.first = !1) : (this.h0 = this.h0 + t << 0, this.h1 = this.h1 + r << 0, this.h2 = this.h2 + e << 0, this.h3 = this.h3 + i << 0);}, t.prototype.hex = function () {this.finalize();var t = this.h0;var r = this.h1;var e = this.h2;var i = this.h3;return n[t >> 4 & 15] + n[15 & t] + n[t >> 12 & 15] + n[t >> 8 & 15] + n[t >> 20 & 15] + n[t >> 16 & 15] + n[t >> 28 & 15] + n[t >> 24 & 15] + n[r >> 4 & 15] + n[15 & r] + n[r >> 12 & 15] + n[r >> 8 & 15] + n[r >> 20 & 15] + n[r >> 16 & 15] + n[r >> 28 & 15] + n[r >> 24 & 15] + n[e >> 4 & 15] + n[15 & e] + n[e >> 12 & 15] + n[e >> 8 & 15] + n[e >> 20 & 15] + n[e >> 16 & 15] + n[e >> 28 & 15] + n[e >> 24 & 15] + n[i >> 4 & 15] + n[15 & i] + n[i >> 12 & 15] + n[i >> 8 & 15] + n[i >> 20 & 15] + n[i >> 16 & 15] + n[i >> 28 & 15] + n[i >> 24 & 15];}, t.prototype.toString = t.prototype.hex, t.prototype.digest = function () {this.finalize();var t = this.h0;var r = this.h1;var e = this.h2;var i = this.h3;return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & i, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255];}, t.prototype.array = t.prototype.digest, t.prototype.arrayBuffer = function () {this.finalize();var t = new ArrayBuffer(16);var r = new Uint32Array(t);return r[0] = this.h0, r[1] = this.h1, r[2] = this.h2, r[3] = this.h3, t;}, t.prototype.buffer = t.prototype.arrayBuffer, t.prototype.base64 = function () {for (var t, r, e, i = '', s = this.array(), h = 0; h < 15;) {t = s[h++], r = s[h++], e = s[h++], i += p[t >>> 2] + p[63 & (t << 4 | r >>> 4)] + p[63 & (r << 2 | e >>> 6)] + p[63 & e];}return t = s[h], i += p[t >>> 2] + p[t << 4 & 63] + '==';};var _ = v();f ? module.exports = _ : (i.md5 = _, o && !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {return _;}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));}();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/node-libs-browser/mock/process.js */ 20), __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 21);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),

/***/ 21:
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 20)))

/***/ }),

/***/ 22:
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ 23:
/*!*************************!*\
  !*** E:/app/api/api.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _http = _interopRequireDefault(__webpack_require__(/*! ../util/http */ 18));
var _index = _interopRequireDefault(__webpack_require__(/*! ../store/index.js */ 24));
var _config = __webpack_require__(/*! ../util/config */ 12);var _axios;function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

var http = new _http.default(_config.httpConfig);

// 请求拦截器
http.interceptors.request(function (request) {
  request.header['Authorization'] = uni.getStorageSync('token') ? "".concat(uni.getStorageSync('token')) : '';
  return request;
});

// 响应拦截器

http.interceptors.response(function (res) {
  if (res.data) {
    if (res.data.code === 108) {
      _index.default.dispatch('logout');
      uni.switchTab({
        url: '/pages/user/user' });

      return;
    } else if (res.data.code === 413) {
      uni.showToast({
        icon: "none",
        title: res.data.msg || "登录已过期" });

      _index.default.dispatch('logout');
      return;
    }
    // store.dispatch('logout');
  }
  _index.default.commit("setToken", res.header.Authorization);
  return res.data;
});var _default =

{
  // 这里统一管理api请求
  axios: (_axios = {
    // 登录
    login: function login(data) {
      return http.post('/user/login', data);
    },
    //退出
    logout: function logout(data) {
      return http.post('/user/logout', data);
    },
    //获取登录token
    getSessionToken: function getSessionToken(data) {
      return http.post('/user/getToken', data);
    },

    //获取热门案例
    getHotCase: function getHotCase(data) {
      return http.post('/diy/large/mini/quote/hotQuote', data);
    },
    //获取当前用户的记录信息
    getUserRecord: function getUserRecord(data) {
      return http.post('/diy/large/mini/quote/quoteRecord', data);
    },
    //拉取工地参考查询数据
    getSiteResults: function getSiteResults(data) {
      return http.post('/diy/large/mini/quote/selectReferenceResultList', data);
    },
    getUserInfo: function getUserInfo() {
      return http.post('/user/info/detail');
    },
    //设置相关用户的信息
    setUserInfo: function setUserInfo(data) {
      return http.post("/user/info/modify", data);
    },
    //绑定手机号码
    bindUserPhone: function bindUserPhone(data) {
      return http.post('/user/phone', data);
    },
    //上传七牛的token
    getUpToken: function getUpToken() {
      return http.post('/clouds/uptoken/typeId');
    },

    getPlace: function getPlace(data) {
      return http.get('/ws/place/v1/suggestion/', data);
    },

    //搜索条件
    getCategory: function getCategory(data) {
      return http.post('/diy/large/mini/quote/getCategory', data);
    },
    //搜索结果
    getSearch: function getSearch(data) {
      return http.post('/diy/large/mini/quote/search', data);
    },
    // im相关
    imUserRegister: function imUserRegister(data, options) {//im用户注册
      return http.post('/imini/rong/user/register', data, options);
    },
    imUserGet: function imUserGet(data, options) {// 查询im用户信息
      return http.get('/imini/rong/user/get', data, options);
    },
    weChatSubscribe: function weChatSubscribe(data, options) {//授权接收订阅消息
      return http.post('/mini/weChat/subscribe', data, options);
    } }, _defineProperty(_axios, "weChatSubscribe", function weChatSubscribe(
  data, options) {//授权接收订阅消息
    return http.post('/mini/weChat/subscribe', data, options);
  }), _defineProperty(_axios, "imCheckOnline", function imCheckOnline(
  data, options) {// 用户检查在线状态
    return http.get('/imini/rong/user/checkOnline', data, options);
  }), _defineProperty(_axios, "sendSubscribeMsg", function sendSubscribeMsg(
  data, options) {// 发送微信小程序消息
    return http.get('/mini/weChat/sendMsg', data, options);
  }), _defineProperty(_axios, "quoteQuoteDetail", function quoteQuoteDetail(



  data, options) {//案例详情
    return http.post('/diy/large/mini/quote/quoteDetail', data, options);
  }), _defineProperty(_axios, "quoteQuoteMaterials", function quoteQuoteMaterials(
  data, options) {//案例详情材料品牌
    return http.post('/diy/large/mini/quote/quoteMaterials', data, options);
  }), _defineProperty(_axios, "quoteQuoteDynamicList", function quoteQuoteDynamicList(
  data, options) {//案例详情工地实况
    return http.post('/diy/large/mini/quote/dynamicList', data, options);
  }), _defineProperty(_axios, "quoteOnline", function quoteOnline(
  data, options) {//在线咨询
    return http.post('/diy/large/mini/quote/online', data, options);
  }), _defineProperty(_axios, "quoteLike", function quoteLike(
  data, options) {//收藏
    return http.post('/diy/large/mini/quote/quoteLike', data, options);
  }), _defineProperty(_axios, "quoteContent", function quoteContent(
  data, options) {//案例完工照
    return http.post('/diy/large/mini/quote/quoteContent', data, options);
  }), _defineProperty(_axios, "selectDesignResultList", function selectDesignResultList(


  data) {
    return http.post('/diy/large/mini/quote/selectDesignResultList', data);
  }), _defineProperty(_axios, "selectOfferResultList", function selectOfferResultList(

  data) {
    return http.post('/diy/large/mini/quote/selectOfferResultList', data);
  }), _defineProperty(_axios, "getCategoryByArea", function getCategoryByArea(

  data) {
    return http.post('/diy/large/mini/quote/getCategoryByArea', data);
  }), _axios) };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 24:
/*!*****************************!*\
  !*** E:/app/store/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 25));
var _constant = _interopRequireDefault(__webpack_require__(/*! ../util/constant.js */ 26));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    loginStatus: 0, // 0未登录 1微信登陆 2手机号登陆
    userInfo: {},


    fullUserInfo: {},

    //搜索目录缓存
    catalogues: {},
    userLocationInfo: { // 默认经纬度
      latitude: _constant.default.location[1],
      longitude: _constant.default.location[0] },

    userLocationScope: false,
    verificationCode: '',
    storeCurrentIndex: 0,
    //搜索条件
    setSearchInfo: '',
    commonFlag: 'true',
    randCode: null },

  mutations: {
    // // 用户信息
    // setUserInfo (state, status) {
    //   state.userInfo = status
    //   uni.setStorageSync('userInfo', status)
    // },
    // 用户信息
    // setFullUserInfo(state, status) {
    //   state.fullUserInfo = status
    //   uni.setStorageSync('fullUserInfo', status)
    // },
    // 用户登录状态
    setLoginStatus: function setLoginStatus(state, status) {
      state.loginStatus = status;
    },
    setCurrentIndex: function setCurrentIndex(state, status) {
      state.storeCurrentIndex = status;
    },
    setVerificationCode: function setVerificationCode(state, status) {
      state.verificationCode = status;
    },
    // 用户登出
    logout: function logout(state) {
      state.loginStatus = 0;
      state.userInfo = {};
      state.phone = '';
      //    uni.removeStorageSync("userInfo");
      // uni.removeStorageSync("loginWXCode");
      // uni.removeStorageSync("token");
      // wx.clearStorage();	
      uni.removeStorageSync();
      wx.clearStorage();

    },
    // token
    setToken: function setToken(state, token) {
      if (token) {
        uni.setStorageSync('token', token);
      }
    },
    // wx.login code
    setLoginWXCode: function setLoginWXCode(state, status) {
      uni.setStorageSync('loginWXCode', status);
    },
    // 用户位置授权
    setUserLocationScope: function setUserLocationScope(state, status) {
      state.userLocationScope = status;
      uni.setStorageSync('userLocationScope', status);

    },
    // 用户位置信息
    setUserLocationInfo: function setUserLocationInfo(state, status) {
      state.userLocationInfo = status;
      uni.setStorageSync('userLocationInfo', status);
    },
    //用户基本信息
    setUserInfo: function setUserInfo(state, status) {
      state.userInfo = Object.assign(state.userInfo, status);
      uni.setStorageSync('userInfo', state.userInfo);
    },

    //搜索条件
    setSearchInfo: function setSearchInfo(state, list) {
      state.searchInfo = list;
    },

    /**
        * 目录存储
        * @param {Object} state
        * @param {Object} status
        */
    setCatalogues: function setCatalogues(state, status) {
      state.catalogues = status;
      uni.setStorageSync("catalogues", status);
    },

    //公共状态
    setFlag: function setFlag(state, flag) {
      state.commonFlag = flag;
    },

    /**
        * 保存登录的随机code
        * @param {Object} state
        * @param {Object} code
        */
    setRandCode: function setRandCode(state, code) {
      state.randCode = code;
      uni.setStorageSync("randCode", code);
    } },


  actions: {
    setUserInfo: function setUserInfo(context, provider) {
      context.commit('setUserInfo', provider);
    },
    // setFullUserInfo(context, provider) {
    //   context.commit('setFullUserInfo', provider)
    // },
    setLoginStatus: function setLoginStatus(context, provider) {
      context.commit('setLoginStatus', provider);
    },
    logout: function logout(context, provider) {
      context.commit('logout', provider);
    },
    setToken: function setToken(context, provider) {
      context.commit('setToken', provider);
    },
    setLoginWXCode: function setLoginWXCode(context, provider) {
      context.commit('setLoginWXCode', provider);
    },
    setUserLocationScope: function setUserLocationScope(context, provider) {
      context.commit('setUserLocationScope', provider);
    },
    setUserLocationInfo: function setUserLocationInfo(context, provider) {
      context.commit('setUserLocationInfo', provider);
    },
    setVerificationCode: function setVerificationCode(context, provider) {
      context.commit('setVerificationCode', provider);
    },
    //搜索目录
    setCatalogues: function setCatalogues(context, provider) {
      context.commit('setCatalogues', provider);
    },
    //搜索条件
    setSearchInfo: function setSearchInfo(context, provider) {
      context.commit("setSearchInfo", provider);
    },
    setFlag: function setFlag(context, provider) {
      context.commit('setFlag', provider);
    },
    setRandCode: function setRandCode(context, provider) {
      context.commit("setRandCode", provider);
    } } });var _default =



store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 25:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 26:
/*!*******************************!*\
  !*** E:/app/util/constant.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  //经纬度坐标（成都）
  location: [104.06667, 30.66667],
  //工地参考bar
  siteBar: [{
    type: 1,
    name: "前期" },

  {
    type: 2,
    name: "中期" },

  {
    type: 3,
    name: "后期" },

  {
    type: 0,
    name: "全部" }],


  //排序
  items: [
  {
    value: 0,
    content: "默认排序",
    actived: true },

  {
    value: 1,
    content: "距离从近到远",
    actived: false },

  {
    value: 2,
    content: "面积从大到小",
    actived: false },

  {
    value: 3,
    content: "面积从小到大",
    actived: false },

  {
    value: 4,
    content: "预算从高到低",
    actived: false },

  {
    value: 5,
    content: "预算从低到高",
    actived: false }],


  //分页
  page: {
    pageNo: 1,
    pageSize: 20 },

  //默认图片
  defaultImage: "http://tqiniu.madrock.com.cn/rev/case/TEST/undefined/b4f3875e-d4c4-bc08-1cc8-79d2f0ed16ee.jpg",
  //默认图上(详情、动态)
  defaultImg: "../../static/example/default.jpg",
  //默认头像图
  defaultHeadImg: "../../static/default/def_head.png",

  //记录
  records: [{
    coverImg: [
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583301624317&di=e8b576c792c7b01106e096da0940e2b8&imgtype=0&src=http%3A%2F%2Fpic59.nipic.com%2Ffile%2F20150122%2F2431012_170653175688_2.jpg"],

    state: Math.floor(Math.random() * 5 + 1),
    finalPrice: Math.random() * 100000000,
    decorationType: '新房装修',
    customerHouseType: '3室2卫',
    customerHouseArea: Math.floor(Math.random() * 100 + 1),
    time: new Date().getTime(),
    customerHouseAddress: "两江国际社区" }],

  // 位置定位后的项目
  siteList: [{
    coverImgs: [
    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583301624317&di=e8b576c792c7b01106e096da0940e2b8&imgtype=0&src=http%3A%2F%2Fpic59.nipic.com%2Ffile%2F20150122%2F2431012_170653175688_2.jpg"],

    createTime: new Date().getTime(),
    customerAreaName: "青羊区",
    customerCityName: "成都市",
    customerHouseAddress: "新建项目",
    customerGpsAddress: "成都高新区天府大道399号",
    customerHouseArea: Math.floor(Math.random() * 100 + 1),
    customerHouseAreaVal: Math.floor(Math.random() * 100 + 1),
    customerHouseType: "1室1卫",
    distance: 6.694,
    fabulousCount: 0,
    id: 1325,
    latitude: "30.67754",
    longitude: "104.071528",
    stage: Math.floor(Math.random() * 5 + 1),
    stageName: "1阶段",
    totalPrice: Math.random() * 100000000 }],

  // 装修类型
  topItems: [{
    id: 1111,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "整体装修" },

  {
    id: 1112,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "精装房改造" },

  {
    id: 1113,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "老房翻新" },

  {
    id: 1114,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "整体装修" },

  {
    id: 1115,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "出租房装修" },

  {
    id: 1116,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "店铺装修" },

  {
    id: 1117,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "办公室装修" },

  {
    id: 1118,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "别墅大宅" },

  {
    id: 1119,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "出租房装修" },

  {
    id: 1120,
    src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3278128204,644852052&fm=26&gp=0.jpg",
    text: "预算有限" }],


  //查询keys
  searchKeys: ["houseType", "budget", "area", "styleType", "worked"],
  headKey: "decorateType" };exports.default = _default;

/***/ }),

/***/ 27:
/*!*******************************!*\
  !*** E:/app/filter/filter.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  /**
                                                                                                                      * 数字截取
                                                                                                                      * @param {Object} val 值域
                                                                                                                      * @param {Object} div 截取位数
                                                                                                                      */
  number: function number(val, div, bool) {
    if (!bool) {
      return Number(val).toFixed(div);
    } else {
      if (val && val.length > 0) {
        var values = [];
        var split = val.split(".");
        if (split.length > 0) {
          values.push(split[0] ? split[0] : 0);
          if (!split[1]) {
            for (var i = 0; i < div; i++) {
              values.push(0);
            }
          } else {
            var decimals = split[1].split("");
            if (decimals.length > 0) {
              for (var _i = 0; _i < div; _i++) {
                if (!decimals[_i]) {
                  decimals[_i] = 0;
                }
                values.push(decimals[_i]);
              }
            }
          }
        }
        return values.join(".");
      }
      return Number(val).toFixed(div);
    }
  },
  /**
      * 分位数
      * @param {Object} val
      * @param {Object} num 分位标准3位,默认分隔符号","
      */
  quantile: function quantile(val, num) {
    if (!val) return val;
    if (val) {
      var integer = val.toString().split(".")[0];
      var decimal = val.toString().split(".")[1];
      if (!integer) return val;
      var result = [];
      if (integer) {
        var n = integer.toString().split("");
        var count = 0;
        for (var i = n.length - 1; i >= 0; i--) {
          count++;
          result.unshift(n[i]);
          if (!(count % num) && i != 0) {
            result.unshift(',');
          }
        }
      }
      return result.join("") + (decimal.length > 0 ? '.' + decimal.toString() : '');
    }
  },
  /**
      * 时间格式化
      * @param {Object} date 当前时间值（一般为时间戳）
      * @param {Object} fmt 时间自定义格式,ey:'yyyy-MM-dd hh:mm:ss'
      */
  format: function format(date, fmt) {
    if (typeof date === "number") {
      date = new Date(date);
    } else {
      if (date.indexOf("-") > -1) {
        date = date.replace(/-/g, '/').replace(/T/g, ' ').replace(/\+/g, '');
      }
      date = date ? new Date(date) : new Date();
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds() };

    for (var k in o) {
      if (new RegExp("(".concat(k, ")")).test(fmt)) {
        var str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
      }
    }
    return fmt;
  },
  /**
      * 根据要求对数据作取万相关处理
      * @param {Object} val 当前数据
      * @param {Object} dig 位数调整
      */
  digit: function digit(val, dig) {
    if (!val) return val;
    if (val) {
      var nums = val.toString().split(".");
      var iteger = nums[0].split(""),decimal = nums[1];
      //对整数位数取值;
      if (dig > iteger.length) {
        var div = dig - iteger.length;
        while (div > 0) {
          div--;
          iteger.unshift(0);
        }
      }

      iteger.splice(iteger.length - dig, 0, '.');
      return iteger.join("") + (decimal ? decimal + '' : '');
    }
  } };exports.default = _default;

/***/ }),

/***/ 28:
/*!**********************************!*\
  !*** E:/app/router/MinRouter.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var toString = Object.prototype.toString;
var before;

function isObject(value) {
  return toString.call(value) === '[object Object]';
}

function isString(value) {
  return toString.call(value) === '[object String]';
}

function isDefault(value) {
  return value === void 0;
}

function openPage(args) {
  var name;var query = {};
  var queryStr = null;
  var path;var type;var isName = false;

  switch (true) {
    case isObject(args):

      name =


      args.name;type = args.type;var _args$query = args.query;query = _args$query === void 0 ? {} : _args$query;
      break;
    case isString(args):
      name = args;
      break;
    default:
      throw new Error('参数必须是对象或者字符串');}


  if (isObject(query)) {
    queryStr = encodeURIComponent(JSON.stringify(query));
  } else {
    throw new Error('query数据必须是Object');
  }
  this.$minRouter.forEach(function (item) {
    if (item.name === name) {
      path = item.path;
      type = type || item.type || 'navigateTo';
      isName = true;
    }
  });

  if (!isName) {
    throw new Error("\u6CA1\u6709".concat(name, "\u9875\u9762"));
  }

  if (!['navigateTo', 'switchTab', 'reLaunch', 'redirectTo'].includes(type)) {
    throw new Error("name:".concat(name, "\u91CC\u9762\u7684type\u5FC5\u987B\u662F\u4EE5\u4E0B\u7684\u503C['navigateTo', 'switchTab', 'reLaunch', 'redirectTo']"));
  }

  return new Promise(function (resolve, reject) {
    var routers = getCurrentPages();
    var route = null;
    if (routers.length !== 0) {
      var router = routers[routers.length - 1];
      route = router.route;
    }
    var flag = true;

    function next(name) {
      switch (true) {
        case name === undefined:
          break;
        case name === false:
          flag = false;
          break;
        case isString(name):
          flag = false;
          uni[type]({
            url: "/".concat(name),
            success: resolve,
            fail: reject });

          break;}

    }
    before(path, route, next);
    if (flag) {
      uni[type]({
        url: "/".concat(path, "?query=").concat(queryStr),
        success: resolve,
        fail: reject });

    }
  });
}

function beforeEach(callback) {
  before = callback;
}

function parseURL() {
  var query = this.$root.$mp.query.query;
  if (query) {
    return JSON.parse(decodeURIComponent(query));
  } else {
    return {};
  }
}

function install(Vue) {
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (!isDefault(this.$options.minRouter)) {
        Vue._minRouter = this.$options.minRouter;
      }
    } });

  Object.defineProperty(Vue.prototype, '$minRouter', {
    get: function get() {
      return Vue._minRouter._router;
    } });

  Object.defineProperty(Vue.prototype, '$parseURL', {
    get: function get() {
      return Vue._minRouter.parseURL;
    } });

  Object.defineProperty(Vue.prototype, '$openPage', {
    get: function get() {
      return Vue._minRouter.openPage;
    } });

}

function MinRouter(options) {
  if (!(this instanceof MinRouter)) {
    throw Error('MinRouter是一个构造函数，应该用`new`关键字调用');
  }
  isDefault(options) && (options = {});
  this.options = options;
  this._router = options.routes || [];
}

MinRouter.install = install;
MinRouter.prototype.openPage = openPage;
MinRouter.prototype.parseURL = parseURL;
MinRouter.prototype.beforeEach = beforeEach;var _default =

MinRouter;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 29:
/*!*******************************!*\
  !*** E:/app/router/router.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _MinRouter = _interopRequireDefault(__webpack_require__(/*! ./MinRouter */ 28));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/*
                                                                                                                                                                                                                                                                  参数
                                                                                                                                                                                                                                                                    path 路径
                                                                                                                                                                                                                                                                    name 页面名
                                                                                                                                                                                                                                                                    type  页面类型
                                                                                                                                                                                                                                                                  函数
                                                                                                                                                                                                                                                                    打开新页面：this.$openPage({name:页面名,query:{传递参数}})
                                                                                                                                                                                                                                                                    获取传递的参数: this.$parseURL()
                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                  */

// 配置路由
var router = new _MinRouter.default({
  routes: [
  {
    'path': 'pages/index/index',
    'name': 'index',
    'type': 'switchTab',
    'style': {
      'navigationBarTitleText': '首页',
      'enablePullDownRefresh': true,
      'navigationBarBackgroundColor': '#000',
      'navigationBarTextStyle': 'white' } },


  {
    'path': 'pages/user/user',
    'name': 'user',
    'type': 'switchTab',
    'style': {
      'navigationBarTitleText': '我的' } },


  {
    'path': 'pages/user/info',
    'name': 'info',
    'style': {
      'navigationBarTitleText': '个人信息' } },


  {
    "path": "pages/message/message",
    'name': 'message',
    'type': 'switchTab',
    'style': {
      'navigationBarTitleText': '在线装修' } },


  {
    "path": "pages/search/search",
    'name': 'search',
    'style': {
      'navigationBarTitleText': '搜索' } },


  {
    "path": "pages/chat/chat",
    'name': 'chat',
    "style": {
      "navigationBarTitleText": "消息详情" } },


  {
    "path": "pages/area/area",
    'name': 'area',
    "style": {
      "navigationBarTitleText": "一键报价" } },


  {
    "path": "pages/layout/layout",
    'name': 'layout',
    "style": {
      "navigationBarTitleText": "一键报价" } },


  {
    "path": "pages/manner/manner",
    'name': 'manner',
    "style": {
      "navigationBarTitleText": "一键报价" } },


  {
    "path": "pages/result/result",
    'name': 'result',
    "style": {
      "navigationBarTitleText": "一键报价" } },


  {
    "path": "pages/example/example",
    'name': 'example',
    "style": {
      "navigationBarTitleText": "案例详情" } },


  {
    "path": "pages/site/site",
    "name": "site",
    "style": {
      "navigationBarTitleText": "工地参观" } },


  {
    "path": "pages/site-address/site-address",
    "name": "siteAddress",
    "style": {
      "navigationBarTitleText": "工地参观" } },


  {
    "path": "pages/out/out",
    "name": "out",
    "style": {
      "navigationBarTitleText": "out" } }] });





router.beforeEach(function (to, from, next) {
  // console.log('from---',from);
  // console.log('to---',to);

  // if (from === 'pages/index/index' && to === 'pages/my/index') {
  // 不希望跳转就传false
  // next(false)
  // 跳到指定页面
  // next('pages/test/index')
  // }
});var _default =

router;exports.default = _default;

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 36:
/*!*******************************!*\
  !*** E:/app/util/messages.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  AUTH_LOADING: "授权中",
  NO_AUTH: "当前未获授权",
  NO_LOCATION: "暂不支持地理定位",
  FAIL_LOCATION: "地理定位失败",
  FAIL_AUTH: "授权失败",
  FAIL_RESOLVE: "地理解析失败",
  APPLY_AUTH: "需要微信授权才能登录",
  FAIL_LOGIN: "登录失败",
  SUCCESS_LOGIN: "登录成功",
  FAIL_LOGOUT: "退出失败",
  SUCCESS_LOGOUT: "退出成功",

  FAIL_INFO: "拉取接口信息失败",
  SUCCESS_INFO: "更新成功",
  LOADING_FINISH: "数据已加载完毕",
  EMPTY_TEXT: "输入不能为空",
  NO_MATCH_URL: "无效地址",

  UPLOAD_IMG_LOADING: "上传图片中" };exports.default = _default;

/***/ }),

/***/ 4:
/*!*************************!*\
  !*** E:/app/pages.json ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 403:
/*!********************************************************!*\
  !*** E:/app/components/gaoyia-parse/libs/html2json.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;













var _wxDiscode = _interopRequireDefault(__webpack_require__(/*! ./wxDiscode */ 404));
var _htmlparser = _interopRequireDefault(__webpack_require__(/*! ./htmlparser */ 405));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                 * html2Json 改造来自: https://github.com/Jxck/html2json
                                                                                                                                                                 *
                                                                                                                                                                 *
                                                                                                                                                                 * author: Di (微信小程序开发工程师)
                                                                                                                                                                 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                 *               垂直微信小程序开发交流社区
                                                                                                                                                                 *
                                                                                                                                                                 * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                 *
                                                                                                                                                                 * for: 微信小程序富文本解析
                                                                                                                                                                 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                 */function makeMap(str) {var obj = {};var items = str.split(',');for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}return obj;} // Block Elements - HTML 5
var block = makeMap('br,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'); // Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function removeDOCTYPE(html) {
  var isDocument = /<body.*>([^]*)<\/body>/.test(html);
  return isDocument ? RegExp.$1 : html;
}

function trimHtml(html) {
  return html.
  replace(/<!--.*?-->/gi, '').
  replace(/\/\*.*?\*\//gi, '').
  replace(/[ ]+</gi, '<').
  replace(/<script[^]*<\/script>/gi, '').
  replace(/<style[^]*<\/style>/gi, '');
}

function getScreenInfo() {
  var screen = {};
  wx.getSystemInfo({
    success: function success(res) {
      screen.width = res.windowWidth;
      screen.height = res.windowHeight;
    } });

  return screen;
}

function html2json(html, customHandler, imageProp, host) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = _wxDiscode.default.strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    nodes: [],
    imageUrls: [] };


  var screen = getScreenInfo();
  function Node(tag) {
    this.node = 'element';
    this.tag = tag;

    this.$screen = screen;
  }

  (0, _htmlparser.default)(html, {
    start: function start(tag, attrs, unary) {
      // node for this element
      var node = new Node(tag);

      if (bufArray.length !== 0) {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      node.attr = attrs.reduce(function (pre, attr) {var
        name = attr.name;var
        value = attr.value;
        if (name === 'class') {
          node.classStr = value;
        }
        // has multi attibutes
        // make it array of attribute
        if (name === 'style') {
          node.styleStr = value;
        }
        if (value.match(/ /)) {
          value = value.split(' ');
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});

      // 优化样式相关属性
      if (node.classStr) {
        node.classStr += " ".concat(node.tag);
      } else {
        node.classStr = node.tag;
      }
      if (node.tagType === 'inline') {
        node.classStr += ' inline';
      }

      // 对img添加额外数据
      if (node.tag === 'img') {
        var imgUrl = node.attr.src;
        imgUrl = _wxDiscode.default.urlToHttpUrl(imgUrl, imageProp.domain);
        Object.assign(node.attr, imageProp, {
          src: imgUrl || '' });

        if (imgUrl) {
          results.imageUrls.push(imgUrl);
        }
      }

      // 处理a标签属性
      if (node.tag === 'a') {
        node.attr.href = node.attr.href || '';
      }

      // 处理font标签样式属性
      if (node.tag === 'font') {
        var fontSize = [
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
        '-webkit-xxx-large'];

        var styleAttrs = {
          color: 'color',
          face: 'font-family',
          size: 'font-size' };

        if (!node.styleStr) node.styleStr = '';
        Object.keys(styleAttrs).forEach(function (key) {
          if (node.attr[key]) {
            var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.styleStr += "".concat(styleAttrs[key], ": ").concat(value, ";");
          }
        });
      }

      // 临时记录source资源
      if (node.tag === 'source') {
        results.source = node.attr.src;
      }

      if (customHandler.start) {
        customHandler.start(node, results);
      }

      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var _parent = bufArray[0] || results;
        if (_parent.nodes === undefined) {
          _parent.nodes = [];
        }
        _parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) {
        console.error('invalid state: mismatch end tag');
      }

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (customHandler.end) {
        customHandler.end(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (!parent.nodes) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      if (!text.trim()) return;

      var node = {
        node: 'text',
        text: text };


      if (customHandler.chars) {
        customHandler.chars(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    } });


  return results;
}var _default =

html2json;exports.default = _default;

/***/ }),

/***/ 404:
/*!********************************************************!*\
  !*** E:/app/components/gaoyia-parse/libs/wxDiscode.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // HTML 支持的数学符号
function strNumDiscode(str) {
  str = str.replace(/&forall;|&#8704;|&#x2200;/g, '∀');
  str = str.replace(/&part;|&#8706;|&#x2202;/g, '∂');
  str = str.replace(/&exist;|&#8707;|&#x2203;/g, '∃');
  str = str.replace(/&empty;|&#8709;|&#x2205;/g, '∅');
  str = str.replace(/&nabla;|&#8711;|&#x2207;/g, '∇');
  str = str.replace(/&isin;|&#8712;|&#x2208;/g, '∈');
  str = str.replace(/&notin;|&#8713;|&#x2209;/g, '∉');
  str = str.replace(/&ni;|&#8715;|&#x220b;/g, '∋');
  str = str.replace(/&prod;|&#8719;|&#x220f;/g, '∏');
  str = str.replace(/&sum;|&#8721;|&#x2211;/g, '∑');
  str = str.replace(/&minus;|&#8722;|&#x2212;/g, '−');
  str = str.replace(/&lowast;|&#8727;|&#x2217;/g, '∗');
  str = str.replace(/&radic;|&#8730;|&#x221a;/g, '√');
  str = str.replace(/&prop;|&#8733;|&#x221d;/g, '∝');
  str = str.replace(/&infin;|&#8734;|&#x221e;/g, '∞');
  str = str.replace(/&ang;|&#8736;|&#x2220;/g, '∠');
  str = str.replace(/&and;|&#8743;|&#x2227;/g, '∧');
  str = str.replace(/&or;|&#8744;|&#x2228;/g, '∨');
  str = str.replace(/&cap;|&#8745;|&#x2229;/g, '∩');
  str = str.replace(/&cup;|&#8746;|&#x222a;/g, '∪');
  str = str.replace(/&int;|&#8747;|&#x222b;/g, '∫');
  str = str.replace(/&there4;|&#8756;|&#x2234;/g, '∴');
  str = str.replace(/&sim;|&#8764;|&#x223c;/g, '∼');
  str = str.replace(/&cong;|&#8773;|&#x2245;/g, '≅');
  str = str.replace(/&asymp;|&#8776;|&#x2248;/g, '≈');
  str = str.replace(/&ne;|&#8800;|&#x2260;/g, '≠');
  str = str.replace(/&le;|&#8804;|&#x2264;/g, '≤');
  str = str.replace(/&ge;|&#8805;|&#x2265;/g, '≥');
  str = str.replace(/&sub;|&#8834;|&#x2282;/g, '⊂');
  str = str.replace(/&sup;|&#8835;|&#x2283;/g, '⊃');
  str = str.replace(/&nsub;|&#8836;|&#x2284;/g, '⊄');
  str = str.replace(/&sube;|&#8838;|&#x2286;/g, '⊆');
  str = str.replace(/&supe;|&#8839;|&#x2287;/g, '⊇');
  str = str.replace(/&oplus;|&#8853;|&#x2295;/g, '⊕');
  str = str.replace(/&otimes;|&#8855;|&#x2297;/g, '⊗');
  str = str.replace(/&perp;|&#8869;|&#x22a5;/g, '⊥');
  str = str.replace(/&sdot;|&#8901;|&#x22c5;/g, '⋅');
  return str;
}

// HTML 支持的希腊字母
function strGreeceDiscode(str) {
  str = str.replace(/&Alpha;|&#913;|&#x391;/g, 'Α');
  str = str.replace(/&Beta;|&#914;|&#x392;/g, 'Β');
  str = str.replace(/&Gamma;|&#915;|&#x393;/g, 'Γ');
  str = str.replace(/&Delta;|&#916;|&#x394;/g, 'Δ');
  str = str.replace(/&Epsilon;|&#917;|&#x395;/g, 'Ε');
  str = str.replace(/&Zeta;|&#918;|&#x396;/g, 'Ζ');
  str = str.replace(/&Eta;|&#919;|&#x397;/g, 'Η');
  str = str.replace(/&Theta;|&#920;|&#x398;/g, 'Θ');
  str = str.replace(/&Iota;|&#921;|&#x399;/g, 'Ι');
  str = str.replace(/&Kappa;|&#922;|&#x39a;/g, 'Κ');
  str = str.replace(/&Lambda;|&#923;|&#x39b;/g, 'Λ');
  str = str.replace(/&Mu;|&#924;|&#x39c;/g, 'Μ');
  str = str.replace(/&Nu;|&#925;|&#x39d;/g, 'Ν');
  str = str.replace(/&Xi;|&#925;|&#x39d;/g, 'Ν');
  str = str.replace(/&Omicron;|&#927;|&#x39f;/g, 'Ο');
  str = str.replace(/&Pi;|&#928;|&#x3a0;/g, 'Π');
  str = str.replace(/&Rho;|&#929;|&#x3a1;/g, 'Ρ');
  str = str.replace(/&Sigma;|&#931;|&#x3a3;/g, 'Σ');
  str = str.replace(/&Tau;|&#932;|&#x3a4;/g, 'Τ');
  str = str.replace(/&Upsilon;|&#933;|&#x3a5;/g, 'Υ');
  str = str.replace(/&Phi;|&#934;|&#x3a6;/g, 'Φ');
  str = str.replace(/&Chi;|&#935;|&#x3a7;/g, 'Χ');
  str = str.replace(/&Psi;|&#936;|&#x3a8;/g, 'Ψ');
  str = str.replace(/&Omega;|&#937;|&#x3a9;/g, 'Ω');

  str = str.replace(/&alpha;|&#945;|&#x3b1;/g, 'α');
  str = str.replace(/&beta;|&#946;|&#x3b2;/g, 'β');
  str = str.replace(/&gamma;|&#947;|&#x3b3;/g, 'γ');
  str = str.replace(/&delta;|&#948;|&#x3b4;/g, 'δ');
  str = str.replace(/&epsilon;|&#949;|&#x3b5;/g, 'ε');
  str = str.replace(/&zeta;|&#950;|&#x3b6;/g, 'ζ');
  str = str.replace(/&eta;|&#951;|&#x3b7;/g, 'η');
  str = str.replace(/&theta;|&#952;|&#x3b8;/g, 'θ');
  str = str.replace(/&iota;|&#953;|&#x3b9;/g, 'ι');
  str = str.replace(/&kappa;|&#954;|&#x3ba;/g, 'κ');
  str = str.replace(/&lambda;|&#955;|&#x3bb;/g, 'λ');
  str = str.replace(/&mu;|&#956;|&#x3bc;/g, 'μ');
  str = str.replace(/&nu;|&#957;|&#x3bd;/g, 'ν');
  str = str.replace(/&xi;|&#958;|&#x3be;/g, 'ξ');
  str = str.replace(/&omicron;|&#959;|&#x3bf;/g, 'ο');
  str = str.replace(/&pi;|&#960;|&#x3c0;/g, 'π');
  str = str.replace(/&rho;|&#961;|&#x3c1;/g, 'ρ');
  str = str.replace(/&sigmaf;|&#962;|&#x3c2;/g, 'ς');
  str = str.replace(/&sigma;|&#963;|&#x3c3;/g, 'σ');
  str = str.replace(/&tau;|&#964;|&#x3c4;/g, 'τ');
  str = str.replace(/&upsilon;|&#965;|&#x3c5;/g, 'υ');
  str = str.replace(/&phi;|&#966;|&#x3c6;/g, 'φ');
  str = str.replace(/&chi;|&#967;|&#x3c7;/g, 'χ');
  str = str.replace(/&psi;|&#968;|&#x3c8;/g, 'ψ');
  str = str.replace(/&omega;|&#969;|&#x3c9;/g, 'ω');
  str = str.replace(/&thetasym;|&#977;|&#x3d1;/g, 'ϑ');
  str = str.replace(/&upsih;|&#978;|&#x3d2;/g, 'ϒ');
  str = str.replace(/&piv;|&#982;|&#x3d6;/g, 'ϖ');
  str = str.replace(/&middot;|&#183;|&#xb7;/g, '·');
  return str;
}

function strcharacterDiscode(str) {
  // 加入常用解析

  // str = str.replace(/&nbsp;|&#32;|&#x20;/g, "&nbsp;");
  // str = str.replace(/&ensp;|&#8194;|&#x2002;/g, '&ensp;');
  // str = str.replace(/&#12288;|&#x3000;/g, '<span class=\'spaceshow\'>　</span>');
  // str = str.replace(/&emsp;|&#8195;|&#x2003;/g, '&emsp;');
  // str = str.replace(/&quot;|&#34;|&#x22;/g, "\"");
  // str = str.replace(/&apos;|&#39;|&#x27;/g, "&apos;");
  // str = str.replace(/&acute;|&#180;|&#xB4;/g, "´");
  // str = str.replace(/&times;|&#215;|&#xD7;/g, "×");
  // str = str.replace(/&divide;|&#247;|&#xF7;/g, "÷");
  // str = str.replace(/&amp;|&#38;|&#x26;/g, '&amp;');
  // str = str.replace(/&lt;|&#60;|&#x3c;/g, '&lt;');
  // str = str.replace(/&gt;|&#62;|&#x3e;/g, '&gt;');

  str = str.replace(/&nbsp;|&#32;|&#x20;/g, "<span class='spaceshow'> </span>");
  str = str.replace(/&ensp;|&#8194;|&#x2002;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&#12288;|&#x3000;/g, '<span class=\'spaceshow\'>　</span>');
  str = str.replace(/&emsp;|&#8195;|&#x2003;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&quot;|&#34;|&#x22;/g, '"');
  str = str.replace(/&quot;|&#39;|&#x27;/g, "'");
  str = str.replace(/&acute;|&#180;|&#xB4;/g, '´');
  str = str.replace(/&times;|&#215;|&#xD7;/g, '×');
  str = str.replace(/&divide;|&#247;|&#xF7;/g, '÷');
  str = str.replace(/&amp;|&#38;|&#x26;/g, '&');
  str = str.replace(/&lt;|&#60;|&#x3c;/g, '<');
  str = str.replace(/&gt;|&#62;|&#x3e;/g, '>');
  return str;
}

// HTML 支持的其他实体
function strOtherDiscode(str) {
  str = str.replace(/&OElig;|&#338;|&#x152;/g, 'Œ');
  str = str.replace(/&oelig;|&#339;|&#x153;/g, 'œ');
  str = str.replace(/&Scaron;|&#352;|&#x160;/g, 'Š');
  str = str.replace(/&scaron;|&#353;|&#x161;/g, 'š');
  str = str.replace(/&Yuml;|&#376;|&#x178;/g, 'Ÿ');
  str = str.replace(/&fnof;|&#402;|&#x192;/g, 'ƒ');
  str = str.replace(/&circ;|&#710;|&#x2c6;/g, 'ˆ');
  str = str.replace(/&tilde;|&#732;|&#x2dc;/g, '˜');
  str = str.replace(/&thinsp;|$#8201;|&#x2009;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&zwnj;|&#8204;|&#x200C;/g, '<span class=\'spaceshow\'>‌</span>');
  str = str.replace(/&zwj;|$#8205;|&#x200D;/g, '<span class=\'spaceshow\'>‍</span>');
  str = str.replace(/&lrm;|$#8206;|&#x200E;/g, '<span class=\'spaceshow\'>‎</span>');
  str = str.replace(/&rlm;|&#8207;|&#x200F;/g, '<span class=\'spaceshow\'>‏</span>');
  str = str.replace(/&ndash;|&#8211;|&#x2013;/g, '–');
  str = str.replace(/&mdash;|&#8212;|&#x2014;/g, '—');
  str = str.replace(/&lsquo;|&#8216;|&#x2018;/g, '‘');
  str = str.replace(/&rsquo;|&#8217;|&#x2019;/g, '’');
  str = str.replace(/&sbquo;|&#8218;|&#x201a;/g, '‚');
  str = str.replace(/&ldquo;|&#8220;|&#x201c;/g, '“');
  str = str.replace(/&rdquo;|&#8221;|&#x201d;/g, '”');
  str = str.replace(/&bdquo;|&#8222;|&#x201e;/g, '„');
  str = str.replace(/&dagger;|&#8224;|&#x2020;/g, '†');
  str = str.replace(/&Dagger;|&#8225;|&#x2021;/g, '‡');
  str = str.replace(/&bull;|&#8226;|&#x2022;/g, '•');
  str = str.replace(/&hellip;|&#8230;|&#x2026;/g, '…');
  str = str.replace(/&permil;|&#8240;|&#x2030;/g, '‰');
  str = str.replace(/&prime;|&#8242;|&#x2032;/g, '′');
  str = str.replace(/&Prime;|&#8243;|&#x2033;/g, '″');
  str = str.replace(/&lsaquo;|&#8249;|&#x2039;/g, '‹');
  str = str.replace(/&rsaquo;|&#8250;|&#x203a;/g, '›');
  str = str.replace(/&oline;|&#8254;|&#x203e;/g, '‾');
  str = str.replace(/&euro;|&#8364;|&#x20ac;/g, '€');
  str = str.replace(/&trade;|&#8482;|&#x2122;/g, '™');
  str = str.replace(/&larr;|&#8592;|&#x2190;/g, '←');
  str = str.replace(/&uarr;|&#8593;|&#x2191;/g, '↑');
  str = str.replace(/&rarr;|&#8594;|&#x2192;/g, '→');
  str = str.replace(/&darr;|&#8595;|&#x2193;/g, '↓');
  str = str.replace(/&harr;|&#8596;|&#x2194;/g, '↔');
  str = str.replace(/&crarr;|&#8629;|&#x21b5;/g, '↵');
  str = str.replace(/&lceil;|&#8968;|&#x2308;/g, '⌈');
  str = str.replace(/&rceil;|&#8969;|&#x2309;/g, '⌉');
  str = str.replace(/&lfloor;|&#8970;|&#x230a;/g, '⌊');
  str = str.replace(/&rfloor;|&#8971;|&#x230b;/g, '⌋');
  str = str.replace(/&loz;|&#9674;|&#x25ca;/g, '◊');
  str = str.replace(/&spades;|&#9824;|&#x2660;/g, '♠');
  str = str.replace(/&clubs;|&#9827;|&#x2663;/g, '♣');
  str = str.replace(/&hearts;|&#9829;|&#x2665;/g, '♥');
  str = str.replace(/&diams;|&#9830;|&#x2666;/g, '♦');
  return str;
}

function strDiscode(str) {
  str = strNumDiscode(str);
  str = strGreeceDiscode(str);
  str = strcharacterDiscode(str);
  str = strOtherDiscode(str);
  return str;
}

function urlToHttpUrl(url, domain) {
  if (/^\/\//.test(url)) {
    return "https:".concat(url);
  } else if (/^\//.test(url)) {
    return "https://".concat(domain).concat(url);
  }
  return url;
}var _default =

{
  strDiscode: strDiscode,
  urlToHttpUrl: urlToHttpUrl };exports.default = _default;

/***/ }),

/***/ 405:
/*!*********************************************************!*\
  !*** E:/app/components/gaoyia-parse/libs/htmlparser.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /**
                                                                                                      *
                                                                                                      * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
                                                                                                      *
                                                                                                      * author: Di (微信小程序开发工程师)
                                                                                                      * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                      *               垂直微信小程序开发交流社区
                                                                                                      *
                                                                                                      * github地址: https://github.com/icindy/wxParse
                                                                                                      *
                                                                                                      * for: 微信小程序富文本解析
                                                                                                      * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                      */
// Regular Expressions for parsing tags and attributes

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z0-9_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z0-9_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}
  return obj;
}

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var last = html;
  var stack = [];

  stack.last = function () {return stack[stack.length - 1];};

  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    var pos;
    if (!tagName) {
      pos = 0;
    } else {
      // Find the closest opened tag of the same type
      tagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos] === tagName) break;
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) handler.end(stack[i]);
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = empty[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function genAttr(matches, name) {
        var value = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[name] ? name : '');

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }

  while (html) {
    chars = true;

    if (html.indexOf('</') === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf('<') === 0) {
      match = html.match(startTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf('<');
      var text = '';
      while (index === 0) {
        text += '<';
        html = html.substring(1);
        index = html.indexOf('<');
      }
      text += index < 0 ? html : html.substring(0, index);
      html = index < 0 ? '' : html.substring(index);

      if (handler.chars) handler.chars(text);
    }

    if (html === last) throw new Error("Parse Error: ".concat(html));
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
}var _default =

HTMLParser;exports.default = _default;

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25720200116005","_inBundle":false,"_integrity":"sha512-RZFw3WAaS/CZTzzv9JPaWvmoNitojD/06vPdHSzlqZi8GbuE222lFuyochEjrGkG8rPPrWHAnwfoPBuQVtkfdg==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25720200116005.tgz","_shasum":"08bb17aba91c84a981f33d74153aa3dd07b578ad","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a129bde60de35f7ef497f43d5a45b4556231995c","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25720200116005"};

/***/ }),

/***/ 7:
/*!******************************************!*\
  !*** E:/app/pages.json?{"type":"style"} ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "找装修", "enablePullDownRefresh": true }, "pages/message/message": { "navigationBarTitleText": "在线装修" }, "pages/chat/chat": { "navigationBarTitleText": "消息详情" }, "pages/area/area": { "navigationBarTitleText": "一键报价" }, "pages/manner/manner": { "navigationBarTitleText": "一键报价" }, "pages/result/result": { "navigationBarTitleText": "一键报价" }, "pages/search/search": { "navigationBarTitleText": "搜索", "onReachBottomDistance": 50 }, "pages/layout/layout": { "navigationBarTitleText": "一键报价" }, "pages/example/example": { "navigationBarTitleText": "案例详情" }, "pages/user/user": { "navigationBarTitleText": "在线装修", "navigationBarBackgroundColor": "#F4711B", "navigationBarTextStyle": "white" }, "pages/user/record": { "navigationBarTitleText": "浏览记录", "enablePullDownRefresh": true, "onReachBottomDistance": 50 }, "pages/site/site": { "navigationBarTitleText": "工地参观", "onReachBottomDistance": 50 }, "pages/site-address/site-address": { "navigationBarTitleText": "工地参观", "onReachBottomDistance": 50 }, "pages/user/info": { "navigationBarTitleText": "个人资料" }, "pages/out/out": {} }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "在线装修", "navigationBarBackgroundColor": "#fff", "backgroundColor": "#fff" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!*****************************************!*\
  !*** E:/app/pages.json?{"type":"stat"} ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__0DAC711" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map