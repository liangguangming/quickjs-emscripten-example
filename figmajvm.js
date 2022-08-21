var CppVm = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined')
      _scriptDir = _scriptDir || __filename;
  return (function(CppVm) {
      CppVm = CppVm || {};

      var Module = typeof CppVm !== "undefined" ? CppVm : {};
      var readyPromiseResolve, readyPromiseReject;
      Module["ready"] = new Promise(function(resolve, reject) {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject
      }
      );
      Module.string_to_ptr = function(text) {
          var ptr = Module._malloc(4 + 2 * text.length);
          HEAP32[ptr >>> 2] = text.length;
          for (var i = 0, p = ptr + 4 >>> 1; i < text.length; i++,
          p++) {
              HEAP16[p] = text.charCodeAt(i)
          }
          return ptr
      }
      ;
      Module.ptr_to_string = function(ptr) {
          var length = HEAP32[ptr >>> 2];
          var text = "";
          for (var i = 0, p = ptr + 4 >>> 1; i < length; i++,
          p++) {
              text += String.fromCharCode(HEAP16[p])
          }
          Module._free(ptr);
          return text
      }
      ;
      Module.int_array_to_ptr = function(array) {
          var ptr = Module._malloc(4 + 4 * array.length);
          HEAP32[ptr >>> 2] = array.length;
          HEAP32.set(new Int32Array(array), ptr + 4 >>> 2);
          return ptr
      }
      ;
      Module.ptr_to_int_array = function(ptr) {
          var length = HEAP32[ptr >>> 2];
          var start = ptr + 4 >>> 2;
          var array = HEAP32.slice(start, start + length);
          Module._free(ptr);
          return array
      }
      ;
      Module.uint8array_to_ptr = function(array) {
          var ptr = Module._malloc(4 + array.length);
          HEAP32[ptr >>> 2] = array.length;
          HEAPU8.set(array, ptr + 4);
          return ptr
      }
      ;
      Module.ptr_to_uint8array = function(ptr) {
          var length = HEAP32[ptr >>> 2];
          var start = ptr + 4;
          var array = HEAPU8.slice(start, start + length);
          Module._free(ptr);
          return array
      }
      ;
      Module.arraybuffer_to_ptr = function(array) {
          var ptr = Module._malloc(4 + array.byteLength);
          HEAP32[ptr >>> 2] = array.byteLength;
          HEAPU8.set(new Uint8Array(array), ptr + 4);
          return ptr
      }
      ;
      Module.ptr_to_arraybuffer = function(ptr) {
          var length = HEAP32[ptr >>> 2];
          var start = ptr + 4;
          var array = HEAPU8.slice(start, start + length);
          Module._free(ptr);
          return array.buffer
      }
      ;
      var moduleOverrides = {};
      var key;
      for (key in Module) {
          if (Module.hasOwnProperty(key)) {
              moduleOverrides[key] = Module[key]
          }
      }
      var arguments_ = [];
      var thisProgram = "./this.program";
      var quit_ = function(status, toThrow) {
          throw toThrow
      };
      var ENVIRONMENT_IS_WEB = typeof window === "object";
      var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
      var scriptDirectory = "";
      function locateFile(path) {
          if (Module["locateFile"]) {
              return Module["locateFile"](path, scriptDirectory)
          }
          return scriptDirectory + path
      }
      var read_, readAsync, readBinary, setWindowTitle;
      function logExceptionOnExit(e) {
          if (e instanceof ExitStatus)
              return;
          var toLog = e;
          err("exiting due to exception: " + toLog)
      }
      var nodeFS;
      var nodePath;
      if (ENVIRONMENT_IS_NODE) {
          if (ENVIRONMENT_IS_WORKER) {
              scriptDirectory = require("path").dirname(scriptDirectory) + "/"
          } else {
              scriptDirectory = __dirname + "/"
          }
          read_ = function shell_read(filename, binary) {
              if (!nodeFS)
                  nodeFS = require("fs");
              if (!nodePath)
                  nodePath = require("path");
              filename = nodePath["normalize"](filename);
              return nodeFS["readFileSync"](filename, binary ? null : "utf8")
          }
          ;
          readBinary = function readBinary(filename) {
              var ret = read_(filename, true);
              if (!ret.buffer) {
                  ret = new Uint8Array(ret)
              }
              assert(ret.buffer);
              return ret
          }
          ;
          readAsync = function readAsync(filename, onload, onerror) {
              if (!nodeFS)
                  nodeFS = require("fs");
              if (!nodePath)
                  nodePath = require("path");
              filename = nodePath["normalize"](filename);
              nodeFS["readFile"](filename, function(err, data) {
                  if (err)
                      onerror(err);
                  else
                      onload(data.buffer)
              })
          }
          ;
          if (process["argv"].length > 1) {
              thisProgram = process["argv"][1].replace(/\\/g, "/")
          }
          arguments_ = process["argv"].slice(2);
          process["on"]("uncaughtException", function(ex) {
              if (!(ex instanceof ExitStatus)) {
                  throw ex
              }
          });
          process["on"]("unhandledRejection", function(reason) {
              throw reason
          });
          quit_ = function(status, toThrow) {
              if (keepRuntimeAlive()) {
                  process["exitCode"] = status;
                  throw toThrow
              }
              logExceptionOnExit(toThrow);
              process["exit"](status)
          }
          ;
          Module["inspect"] = function() {
              return "[Emscripten Module object]"
          }
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
              scriptDirectory = self.location.href
          } else if (typeof document !== "undefined" && document.currentScript) {
              scriptDirectory = document.currentScript.src
          }
          if (_scriptDir) {
              scriptDirectory = _scriptDir
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
              scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
          } else {
              scriptDirectory = ""
          }
          {
              read_ = function(url) {
                  var xhr = new XMLHttpRequest;
                  xhr.open("GET", url, false);
                  xhr.send(null);
                  return xhr.responseText
              }
              ;
              if (ENVIRONMENT_IS_WORKER) {
                  readBinary = function(url) {
                      var xhr = new XMLHttpRequest;
                      xhr.open("GET", url, false);
                      xhr.responseType = "arraybuffer";
                      xhr.send(null);
                      return new Uint8Array(xhr.response)
                  }
              }
              readAsync = function(url, onload, onerror) {
                  var xhr = new XMLHttpRequest;
                  xhr.open("GET", url, true);
                  xhr.responseType = "arraybuffer";
                  xhr.onload = function() {
                      if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                          onload(xhr.response);
                          return
                      }
                      onerror()
                  }
                  ;
                  xhr.onerror = onerror;
                  xhr.send(null)
              }
          }
          setWindowTitle = function(title) {
              document.title = title
          }
      } else {}
      var out = Module["print"] || console.log.bind(console);
      var err = Module["printErr"] || console.warn.bind(console);
      for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
              Module[key] = moduleOverrides[key]
          }
      }
      moduleOverrides = null;
      if (Module["arguments"])
          arguments_ = Module["arguments"];
      if (Module["thisProgram"])
          thisProgram = Module["thisProgram"];
      if (Module["quit"])
          quit_ = Module["quit"];
      function warnOnce(text) {
          if (!warnOnce.shown)
              warnOnce.shown = {};
          if (!warnOnce.shown[text]) {
              warnOnce.shown[text] = 1;
              err(text)
          }
      }
      function convertJsFunctionToWasm(func, sig) {
          if (typeof WebAssembly.Function === "function") {
              var typeNames = {
                  "i": "i32",
                  "j": "i64",
                  "f": "f32",
                  "d": "f64"
              };
              var type = {
                  parameters: [],
                  results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
              };
              for (var i = 1; i < sig.length; ++i) {
                  type.parameters.push(typeNames[sig[i]])
              }
              return new WebAssembly.Function(type,func)
          }
          var typeSection = [1, 0, 1, 96];
          var sigRet = sig.slice(0, 1);
          var sigParam = sig.slice(1);
          var typeCodes = {
              "i": 127,
              "j": 126,
              "f": 125,
              "d": 124
          };
          typeSection.push(sigParam.length);
          for (var i = 0; i < sigParam.length; ++i) {
              typeSection.push(typeCodes[sigParam[i]])
          }
          if (sigRet == "v") {
              typeSection.push(0)
          } else {
              typeSection = typeSection.concat([1, typeCodes[sigRet]])
          }
          typeSection[1] = typeSection.length - 2;
          var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(typeSection, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
          var module = new WebAssembly.Module(bytes);
          var instance = new WebAssembly.Instance(module,{
              "e": {
                  "f": func
              }
          });
          var wrappedFunc = instance.exports["f"];
          return wrappedFunc
      }
      var freeTableIndexes = [];
      var functionsInTableMap;
      function getEmptyTableSlot() {
          if (freeTableIndexes.length) {
              return freeTableIndexes.pop()
          }
          try {
              wasmTable.grow(1)
          } catch (err) {
              if (!(err instanceof RangeError)) {
                  throw err
              }
              throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
          }
          return wasmTable.length - 1
      }
      function addFunctionWasm(func, sig) {
          if (!functionsInTableMap) {
              functionsInTableMap = new WeakMap;
              for (var i = 0; i < wasmTable.length; i++) {
                  var item = wasmTable.get(i);
                  if (item) {
                      functionsInTableMap.set(item, i)
                  }
              }
          }
          if (functionsInTableMap.has(func)) {
              return functionsInTableMap.get(func)
          }
          var ret = getEmptyTableSlot();
          try {
              wasmTable.set(ret, func)
          } catch (err) {
              if (!(err instanceof TypeError)) {
                  throw err
              }
              var wrapped = convertJsFunctionToWasm(func, sig);
              wasmTable.set(ret, wrapped)
          }
          functionsInTableMap.set(func, ret);
          return ret
      }
      var tempRet0 = 0;
      var setTempRet0 = function(value) {
          tempRet0 = value
      };
      var wasmBinary;
      if (Module["wasmBinary"])
          wasmBinary = Module["wasmBinary"];
      var noExitRuntime = Module["noExitRuntime"] || true;
      if (typeof WebAssembly !== "object") {
          abort("no native wasm support detected")
      }
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;
      function assert(condition, text) {
          if (!condition) {
              abort("Assertion failed: " + text)
          }
      }
      function getCFunc(ident) {
          var func = Module["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func
      }
      function ccall(ident, returnType, argTypes, args, opts) {
          var toC = {
              "string": function(str) {
                  var ret = 0;
                  if (str !== null && str !== undefined && str !== 0) {
                      var len = (str.length << 2) + 1;
                      ret = stackAlloc(len);
                      stringToUTF8(str, ret, len)
                  }
                  return ret
              },
              "array": function(arr) {
                  var ret = stackAlloc(arr.length);
                  writeArrayToMemory(arr, ret);
                  return ret
              }
          };
          function convertReturnValue(ret) {
              if (returnType === "string")
                  return UTF8ToString(ret);
              if (returnType === "boolean")
                  return Boolean(ret);
              return ret
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          if (args) {
              for (var i = 0; i < args.length; i++) {
                  var converter = toC[argTypes[i]];
                  if (converter) {
                      if (stack === 0)
                          stack = stackSave();
                      cArgs[i] = converter(args[i])
                  } else {
                      cArgs[i] = args[i]
                  }
              }
          }
          var ret = func.apply(null, cArgs);
          function onDone(ret) {
              if (stack !== 0)
                  stackRestore(stack);
              return convertReturnValue(ret)
          }
          ret = onDone(ret);
          return ret
      }
      var ALLOC_STACK = 1;
      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heap[endPtr] && !(endPtr >= endIdx))
              ++endPtr;
          if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
              return UTF8Decoder.decode(heap.subarray(idx, endPtr))
          } else {
              var str = "";
              while (idx < endPtr) {
                  var u0 = heap[idx++];
                  if (!(u0 & 128)) {
                      str += String.fromCharCode(u0);
                      continue
                  }
                  var u1 = heap[idx++] & 63;
                  if ((u0 & 224) == 192) {
                      str += String.fromCharCode((u0 & 31) << 6 | u1);
                      continue
                  }
                  var u2 = heap[idx++] & 63;
                  if ((u0 & 240) == 224) {
                      u0 = (u0 & 15) << 12 | u1 << 6 | u2
                  } else {
                      u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                  }
                  if (u0 < 65536) {
                      str += String.fromCharCode(u0)
                  } else {
                      var ch = u0 - 65536;
                      str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                  }
              }
          }
          return str
      }
      function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
      }
      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0))
              return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
              var u = str.charCodeAt(i);
              if (u >= 55296 && u <= 57343) {
                  var u1 = str.charCodeAt(++i);
                  u = 65536 + ((u & 1023) << 10) | u1 & 1023
              }
              if (u <= 127) {
                  if (outIdx >= endIdx)
                      break;
                  heap[outIdx++] = u
              } else if (u <= 2047) {
                  if (outIdx + 1 >= endIdx)
                      break;
                  heap[outIdx++] = 192 | u >> 6;
                  heap[outIdx++] = 128 | u & 63
              } else if (u <= 65535) {
                  if (outIdx + 2 >= endIdx)
                      break;
                  heap[outIdx++] = 224 | u >> 12;
                  heap[outIdx++] = 128 | u >> 6 & 63;
                  heap[outIdx++] = 128 | u & 63
              } else {
                  if (outIdx + 3 >= endIdx)
                      break;
                  heap[outIdx++] = 240 | u >> 18;
                  heap[outIdx++] = 128 | u >> 12 & 63;
                  heap[outIdx++] = 128 | u >> 6 & 63;
                  heap[outIdx++] = 128 | u & 63
              }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx
      }
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
      }
      function lengthBytesUTF8(str) {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
              var u = str.charCodeAt(i);
              if (u >= 55296 && u <= 57343)
                  u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
              if (u <= 127)
                  ++len;
              else if (u <= 2047)
                  len += 2;
              else if (u <= 65535)
                  len += 3;
              else
                  len += 4
          }
          return len
      }
      var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
      function allocateUTF8(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = _malloc(size);
          if (ret)
              stringToUTF8Array(str, HEAP8, ret, size);
          return ret
      }
      function writeArrayToMemory(array, buffer) {
          HEAP8.set(array, buffer)
      }
      function writeAsciiToMemory(str, buffer, dontAddNull) {
          for (var i = 0; i < str.length; ++i) {
              HEAP8[buffer++ >> 0] = str.charCodeAt(i)
          }
          if (!dontAddNull)
              HEAP8[buffer >> 0] = 0
      }
      function alignUp(x, multiple) {
          if (x % multiple > 0) {
              x += multiple - x % multiple
          }
          return x
      }
      var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
      function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module["HEAP8"] = HEAP8 = new Int8Array(buf);
          Module["HEAP16"] = HEAP16 = new Int16Array(buf);
          Module["HEAP32"] = HEAP32 = new Int32Array(buf);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
      }
      var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
      var wasmTable;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATMAIN__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      var runtimeExited = false;
      var runtimeKeepaliveCounter = 0;
      function keepRuntimeAlive() {
          return noExitRuntime || runtimeKeepaliveCounter > 0
      }
      function preRun() {
          if (Module["preRun"]) {
              if (typeof Module["preRun"] == "function")
                  Module["preRun"] = [Module["preRun"]];
              while (Module["preRun"].length) {
                  addOnPreRun(Module["preRun"].shift())
              }
          }
          callRuntimeCallbacks(__ATPRERUN__)
      }
      function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__)
      }
      function preMain() {
          callRuntimeCallbacks(__ATMAIN__)
      }
      function exitRuntime() {
          runtimeExited = true
      }
      function postRun() {
          if (Module["postRun"]) {
              if (typeof Module["postRun"] == "function")
                  Module["postRun"] = [Module["postRun"]];
              while (Module["postRun"].length) {
                  addOnPostRun(Module["postRun"].shift())
              }
          }
          callRuntimeCallbacks(__ATPOSTRUN__)
      }
      function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb)
      }
      function addOnInit(cb) {
          __ATINIT__.unshift(cb)
      }
      function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb)
      }
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;
      function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
              Module["monitorRunDependencies"](runDependencies)
          }
      }
      function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
              Module["monitorRunDependencies"](runDependencies)
          }
          if (runDependencies == 0) {
              if (runDependencyWatcher !== null) {
                  clearInterval(runDependencyWatcher);
                  runDependencyWatcher = null
              }
              if (dependenciesFulfilled) {
                  var callback = dependenciesFulfilled;
                  dependenciesFulfilled = null;
                  callback()
              }
          }
      }
      Module["preloadedImages"] = {};
      Module["preloadedAudios"] = {};
      function abort(what) {
          {
              if (Module["onAbort"]) {
                  Module["onAbort"](what)
              }
          }
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -s ASSERTIONS=1 for more info.";
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e
      }
      var dataURIPrefix = "data:application/octet-stream;base64,";
      function isDataURI(filename) {
          return filename.startsWith(dataURIPrefix)
      }
      function isFileURI(filename) {
          return filename.startsWith("file://")
      }
      var wasmBinaryFile;
      wasmBinaryFile = "jsvm-cpp.wasm";
      if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile)
      }
      function getBinary(file) {
          try {
              if (file == wasmBinaryFile && wasmBinary) {
                  return new Uint8Array(wasmBinary)
              }
              if (readBinary) {
                  return readBinary(file)
              } else {
                  throw "both async and sync fetching of the wasm failed"
              }
          } catch (err) {
              abort(err)
          }
      }
      function getBinaryPromise() {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
              if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
                  return fetch(wasmBinaryFile, {
                      credentials: "same-origin"
                  }).then(function(response) {
                      if (!response["ok"]) {
                          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                      }
                      return response["arrayBuffer"]()
                  }).catch(function() {
                      return getBinary(wasmBinaryFile)
                  })
              } else {
                  if (readAsync) {
                      return new Promise(function(resolve, reject) {
                          readAsync(wasmBinaryFile, function(response) {
                              resolve(new Uint8Array(response))
                          }, reject)
                      }
                      )
                  }
              }
          }
          return Promise.resolve().then(function() {
              return getBinary(wasmBinaryFile)
          })
      }
      function createWasm() {
          var info = {
              "env": asmLibraryArg,
              "wasi_snapshot_preview1": asmLibraryArg
          };
          function receiveInstance(instance, module) {
              var exports = instance.exports;
              Module["asm"] = exports;
              wasmMemory = Module["asm"]["memory"];
              updateGlobalBufferAndViews(wasmMemory.buffer);
              wasmTable = Module["asm"]["__indirect_function_table"];
              addOnInit(Module["asm"]["__wasm_call_ctors"]);
              removeRunDependency("wasm-instantiate")
          }
          addRunDependency("wasm-instantiate");
          function receiveInstantiationResult(result) {
              receiveInstance(result["instance"])
          }
          function instantiateArrayBuffer(receiver) {
              return getBinaryPromise().then(function(binary) {
                  return WebAssembly.instantiate(binary, info)
              }).then(function(instance) {
                  return instance
              }).then(receiver, function(reason) {
                  err("failed to asynchronously prepare wasm: " + reason);
                  abort(reason)
              })
          }
          function instantiateAsync() {
              if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                  return fetch(wasmBinaryFile, {
                      credentials: "same-origin"
                  }).then(function(response) {
                      var result = WebAssembly.instantiateStreaming(response, info);
                      return result.then(receiveInstantiationResult, function(reason) {
                          err("wasm streaming compile failed: " + reason);
                          err("falling back to ArrayBuffer instantiation");
                          return instantiateArrayBuffer(receiveInstantiationResult)
                      })
                  })
              } else {
                  return instantiateArrayBuffer(receiveInstantiationResult)
              }
          }
          if (Module["instantiateWasm"]) {
              try {
                  var exports = Module["instantiateWasm"](info, receiveInstance);
                  return exports
              } catch (e) {
                  err("Module.instantiateWasm callback failed with error: " + e);
                  return false
              }
          }
          instantiateAsync().catch(readyPromiseReject);
          return {}
      }
      var tempDouble;
      var tempI64;
      var ASM_CONSTS = {
          70556: function($0, $1, $2, $3, $4) {
              let args = [];
              for (let i = 0; i < $3; i++) {
                  args.push(Module.HEAP32[($2 >> 2) + i])
              }
              try {
                  return Module.invokeCallback($0, $1, args)
              } catch (e) {
                  Module.HEAPU8[$4] = 1;
                  let text;
                  try {
                      let functionName = Module.getRegisteredFunctionName($0) || "<unknown>";
                      text = "in " + functionName;
                      if (e && e.message) {
                          text += ": " + e.message
                      }
                  } catch (e2) {
                      text = "API error trying to convert error message in invokeCallback() -- please contact support"
                  }
                  return Module._jsvm_newString(Module.string_to_ptr(text))
              }
          }
      };
      function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
              var callback = callbacks.shift();
              if (typeof callback == "function") {
                  callback(Module);
                  continue
              }
              var func = callback.func;
              if (typeof func === "number") {
                  if (callback.arg === undefined) {
                      wasmTable.get(func)()
                  } else {
                      wasmTable.get(func)(callback.arg)
                  }
              } else {
                  func(callback.arg === undefined ? null : callback.arg)
              }
          }
      }
      function demangle(func) {
          return func
      }
      function demangleAll(text) {
          var regex = /\b_Z[\w\d_]+/g;
          return text.replace(regex, function(x) {
              var y = demangle(x);
              return x === y ? x : y + " [" + x + "]"
          })
      }
      function handleException(e) {
          if (e instanceof ExitStatus || e == "unwind") {
              return EXITSTATUS
          }
          quit_(1, e)
      }
      function jsStackTrace() {
          var error = new Error;
          if (!error.stack) {
              try {
                  throw new Error
              } catch (e) {
                  error = e
              }
              if (!error.stack) {
                  return "(no stack trace available)"
              }
          }
          return error.stack.toString()
      }
      function ___assert_fail(condition, filename, line, func) {
          abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
      }
      function _atexit(func, arg) {}
      function ___cxa_atexit(a0, a1) {
          return _atexit(a0, a1)
      }
      function _abort() {
          abort("")
      }
      var readAsmConstArgsArray = [];
      function readAsmConstArgs(sigPtr, buf) {
          readAsmConstArgsArray.length = 0;
          var ch;
          buf >>= 2;
          while (ch = HEAPU8[sigPtr++]) {
              var readAsmConstArgsDouble = ch < 105;
              if (readAsmConstArgsDouble && buf & 1)
                  buf++;
              readAsmConstArgsArray.push(readAsmConstArgsDouble ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
              ++buf
          }
          return readAsmConstArgsArray
      }
      function _emscripten_asm_const_int(code, sigPtr, argbuf) {
          var args = readAsmConstArgs(sigPtr, argbuf);
          return ASM_CONSTS[code].apply(null, args)
      }
      function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.copyWithin(dest, src, src + num)
      }
      function emscripten_realloc_buffer(size) {
          try {
              wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
              updateGlobalBufferAndViews(wasmMemory.buffer);
              return 1
          } catch (e) {}
      }
      function _emscripten_resize_heap(requestedSize) {
          var oldSize = HEAPU8.length;
          requestedSize = requestedSize >>> 0;
          var maxHeapSize = 2147483648;
          if (requestedSize > maxHeapSize) {
              return false
          }
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
              var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
              overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
              var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
              var replacement = emscripten_realloc_buffer(newSize);
              if (replacement) {
                  return true
              }
          }
          return false
      }
      var SYSCALLS = {
          mappings: {},
          buffers: [null, [], []],
          printChar: function(stream, curr) {
              var buffer = SYSCALLS.buffers[stream];
              if (curr === 0 || curr === 10) {
                  (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                  buffer.length = 0
              } else {
                  buffer.push(curr)
              }
          },
          varargs: undefined,
          get: function() {
              SYSCALLS.varargs += 4;
              var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
              return ret
          },
          getStr: function(ptr) {
              var ret = UTF8ToString(ptr);
              return ret
          },
          get64: function(low, high) {
              return low
          }
      };
      function _fd_close(fd) {
          return 0
      }
      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}
      function _fd_write(fd, iov, iovcnt, pnum) {
          var num = 0;
          for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAP32[iov + i * 8 >> 2];
              var len = HEAP32[iov + (i * 8 + 4) >> 2];
              for (var j = 0; j < len; j++) {
                  SYSCALLS.printChar(fd, HEAPU8[ptr + j])
              }
              num += len
          }
          HEAP32[pnum >> 2] = num;
          return 0
      }
      function _gettimeofday(ptr) {
          var now = Date.now();
          HEAP32[ptr >> 2] = now / 1e3 | 0;
          HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
          return 0
      }
      function _tzset_impl() {
          var currentYear = (new Date).getFullYear();
          var winter = new Date(currentYear,0,1);
          var summer = new Date(currentYear,6,1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
          HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);
          function extractZone(date) {
              var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
              return match ? match[1] : "GMT"
          }
          var winterName = extractZone(winter);
          var summerName = extractZone(summer);
          var winterNamePtr = allocateUTF8(winterName);
          var summerNamePtr = allocateUTF8(summerName);
          if (summerOffset < winterOffset) {
              HEAP32[__get_tzname() >> 2] = winterNamePtr;
              HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr
          } else {
              HEAP32[__get_tzname() >> 2] = summerNamePtr;
              HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr
          }
      }
      function _tzset() {
          if (_tzset.called)
              return;
          _tzset.called = true;
          _tzset_impl()
      }
      function _localtime_r(time, tmPtr) {
          _tzset();
          var date = new Date(HEAP32[time >> 2] * 1e3);
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          var start = new Date(date.getFullYear(),0,1);
          var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
          var summerOffset = new Date(date.getFullYear(),6,1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >> 2] = dst;
          var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
          HEAP32[tmPtr + 40 >> 2] = zonePtr;
          return tmPtr
      }
      function _setTempRet0(val) {
          setTempRet0(val)
      }
      var ASSERTIONS = false;
      var asmLibraryArg = {
          "__assert_fail": ___assert_fail,
          "__cxa_atexit": ___cxa_atexit,
          "abort": _abort,
          "emscripten_asm_const_int": _emscripten_asm_const_int,
          "emscripten_memcpy_big": _emscripten_memcpy_big,
          "emscripten_resize_heap": _emscripten_resize_heap,
          "fd_close": _fd_close,
          "fd_seek": _fd_seek,
          "fd_write": _fd_write,
          "gettimeofday": _gettimeofday,
          "localtime_r": _localtime_r,
          "setTempRet0": _setTempRet0
      };
      var asm = createWasm();
      var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
          return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments)
      }
      ;
      var _jsvm_reset = Module["_jsvm_reset"] = function() {
          return (_jsvm_reset = Module["_jsvm_reset"] = Module["asm"]["jsvm_reset"]).apply(null, arguments)
      }
      ;
      var _jsvm_didThrow = Module["_jsvm_didThrow"] = function() {
          return (_jsvm_didThrow = Module["_jsvm_didThrow"] = Module["asm"]["jsvm_didThrow"]).apply(null, arguments)
      }
      ;
      var _jsvm_lastThrow = Module["_jsvm_lastThrow"] = function() {
          return (_jsvm_lastThrow = Module["_jsvm_lastThrow"] = Module["asm"]["jsvm_lastThrow"]).apply(null, arguments)
      }
      ;
      var _jsvm_nullHandle = Module["_jsvm_nullHandle"] = function() {
          return (_jsvm_nullHandle = Module["_jsvm_nullHandle"] = Module["asm"]["jsvm_nullHandle"]).apply(null, arguments)
      }
      ;
      var _jsvm_undefinedHandle = Module["_jsvm_undefinedHandle"] = function() {
          return (_jsvm_undefinedHandle = Module["_jsvm_undefinedHandle"] = Module["asm"]["jsvm_undefinedHandle"]).apply(null, arguments)
      }
      ;
      var _jsvm_globalHandle = Module["_jsvm_globalHandle"] = function() {
          return (_jsvm_globalHandle = Module["_jsvm_globalHandle"] = Module["asm"]["jsvm_globalHandle"]).apply(null, arguments)
      }
      ;
      var _jsvm_retainHandle = Module["_jsvm_retainHandle"] = function() {
          return (_jsvm_retainHandle = Module["_jsvm_retainHandle"] = Module["asm"]["jsvm_retainHandle"]).apply(null, arguments)
      }
      ;
      var _jsvm_releaseHandle = Module["_jsvm_releaseHandle"] = function() {
          return (_jsvm_releaseHandle = Module["_jsvm_releaseHandle"] = Module["asm"]["jsvm_releaseHandle"]).apply(null, arguments)
      }
      ;
      var _jsvm_runMicrotasksAndAutorelease = Module["_jsvm_runMicrotasksAndAutorelease"] = function() {
          return (_jsvm_runMicrotasksAndAutorelease = Module["_jsvm_runMicrotasksAndAutorelease"] = Module["asm"]["jsvm_runMicrotasksAndAutorelease"]).apply(null, arguments)
      }
      ;
      var _jsvm_typeof = Module["_jsvm_typeof"] = function() {
          return (_jsvm_typeof = Module["_jsvm_typeof"] = Module["asm"]["jsvm_typeof"]).apply(null, arguments)
      }
      ;
      var _jsvm_isNumber = Module["_jsvm_isNumber"] = function() {
          return (_jsvm_isNumber = Module["_jsvm_isNumber"] = Module["asm"]["jsvm_isNumber"]).apply(null, arguments)
      }
      ;
      var _jsvm_isBoolean = Module["_jsvm_isBoolean"] = function() {
          return (_jsvm_isBoolean = Module["_jsvm_isBoolean"] = Module["asm"]["jsvm_isBoolean"]).apply(null, arguments)
      }
      ;
      var _jsvm_isString = Module["_jsvm_isString"] = function() {
          return (_jsvm_isString = Module["_jsvm_isString"] = Module["asm"]["jsvm_isString"]).apply(null, arguments)
      }
      ;
      var _jsvm_isNull = Module["_jsvm_isNull"] = function() {
          return (_jsvm_isNull = Module["_jsvm_isNull"] = Module["asm"]["jsvm_isNull"]).apply(null, arguments)
      }
      ;
      var _jsvm_isUndefined = Module["_jsvm_isUndefined"] = function() {
          return (_jsvm_isUndefined = Module["_jsvm_isUndefined"] = Module["asm"]["jsvm_isUndefined"]).apply(null, arguments)
      }
      ;
      var _jsvm_isObject = Module["_jsvm_isObject"] = function() {
          return (_jsvm_isObject = Module["_jsvm_isObject"] = Module["asm"]["jsvm_isObject"]).apply(null, arguments)
      }
      ;
      var _jsvm_isArray = Module["_jsvm_isArray"] = function() {
          return (_jsvm_isArray = Module["_jsvm_isArray"] = Module["asm"]["jsvm_isArray"]).apply(null, arguments)
      }
      ;
      var _jsvm_isArrayBuffer = Module["_jsvm_isArrayBuffer"] = function() {
          return (_jsvm_isArrayBuffer = Module["_jsvm_isArrayBuffer"] = Module["asm"]["jsvm_isArrayBuffer"]).apply(null, arguments)
      }
      ;
      var _jsvm_isUint8Array = Module["_jsvm_isUint8Array"] = function() {
          return (_jsvm_isUint8Array = Module["_jsvm_isUint8Array"] = Module["asm"]["jsvm_isUint8Array"]).apply(null, arguments)
      }
      ;
      var _jsvm_isFunction = Module["_jsvm_isFunction"] = function() {
          return (_jsvm_isFunction = Module["_jsvm_isFunction"] = Module["asm"]["jsvm_isFunction"]).apply(null, arguments)
      }
      ;
      var _jsvm_shallowFreezeObject = Module["_jsvm_shallowFreezeObject"] = function() {
          return (_jsvm_shallowFreezeObject = Module["_jsvm_shallowFreezeObject"] = Module["asm"]["jsvm_shallowFreezeObject"]).apply(null, arguments)
      }
      ;
      var _jsvm_getNumber = Module["_jsvm_getNumber"] = function() {
          return (_jsvm_getNumber = Module["_jsvm_getNumber"] = Module["asm"]["jsvm_getNumber"]).apply(null, arguments)
      }
      ;
      var _jsvm_getBoolean = Module["_jsvm_getBoolean"] = function() {
          return (_jsvm_getBoolean = Module["_jsvm_getBoolean"] = Module["asm"]["jsvm_getBoolean"]).apply(null, arguments)
      }
      ;
      var _jsvm_getString = Module["_jsvm_getString"] = function() {
          return (_jsvm_getString = Module["_jsvm_getString"] = Module["asm"]["jsvm_getString"]).apply(null, arguments)
      }
      ;
      var _malloc = Module["_malloc"] = function() {
          return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments)
      }
      ;
      var _jsvm_getArrayBuffer = Module["_jsvm_getArrayBuffer"] = function() {
          return (_jsvm_getArrayBuffer = Module["_jsvm_getArrayBuffer"] = Module["asm"]["jsvm_getArrayBuffer"]).apply(null, arguments)
      }
      ;
      var _jsvm_getUint8Array = Module["_jsvm_getUint8Array"] = function() {
          return (_jsvm_getUint8Array = Module["_jsvm_getUint8Array"] = Module["asm"]["jsvm_getUint8Array"]).apply(null, arguments)
      }
      ;
      var _jsvm_toNumber = Module["_jsvm_toNumber"] = function() {
          return (_jsvm_toNumber = Module["_jsvm_toNumber"] = Module["asm"]["jsvm_toNumber"]).apply(null, arguments)
      }
      ;
      var _jsvm_toBoolean = Module["_jsvm_toBoolean"] = function() {
          return (_jsvm_toBoolean = Module["_jsvm_toBoolean"] = Module["asm"]["jsvm_toBoolean"]).apply(null, arguments)
      }
      ;
      var _jsvm_toString = Module["_jsvm_toString"] = function() {
          return (_jsvm_toString = Module["_jsvm_toString"] = Module["asm"]["jsvm_toString"]).apply(null, arguments)
      }
      ;
      var _jsvm_newNumber = Module["_jsvm_newNumber"] = function() {
          return (_jsvm_newNumber = Module["_jsvm_newNumber"] = Module["asm"]["jsvm_newNumber"]).apply(null, arguments)
      }
      ;
      var _jsvm_newBoolean = Module["_jsvm_newBoolean"] = function() {
          return (_jsvm_newBoolean = Module["_jsvm_newBoolean"] = Module["asm"]["jsvm_newBoolean"]).apply(null, arguments)
      }
      ;
      var _jsvm_newString = Module["_jsvm_newString"] = function() {
          return (_jsvm_newString = Module["_jsvm_newString"] = Module["asm"]["jsvm_newString"]).apply(null, arguments)
      }
      ;
      var _free = Module["_free"] = function() {
          return (_free = Module["_free"] = Module["asm"]["free"]).apply(null, arguments)
      }
      ;
      var _jsvm_newObject = Module["_jsvm_newObject"] = function() {
          return (_jsvm_newObject = Module["_jsvm_newObject"] = Module["asm"]["jsvm_newObject"]).apply(null, arguments)
      }
      ;
      var _jsvm_newObjectWithProto = Module["_jsvm_newObjectWithProto"] = function() {
          return (_jsvm_newObjectWithProto = Module["_jsvm_newObjectWithProto"] = Module["asm"]["jsvm_newObjectWithProto"]).apply(null, arguments)
      }
      ;
      var _jsvm_newArray = Module["_jsvm_newArray"] = function() {
          return (_jsvm_newArray = Module["_jsvm_newArray"] = Module["asm"]["jsvm_newArray"]).apply(null, arguments)
      }
      ;
      var _jsvm_newArrayBuffer = Module["_jsvm_newArrayBuffer"] = function() {
          return (_jsvm_newArrayBuffer = Module["_jsvm_newArrayBuffer"] = Module["asm"]["jsvm_newArrayBuffer"]).apply(null, arguments)
      }
      ;
      var _jsvm_newUint8Array = Module["_jsvm_newUint8Array"] = function() {
          return (_jsvm_newUint8Array = Module["_jsvm_newUint8Array"] = Module["asm"]["jsvm_newUint8Array"]).apply(null, arguments)
      }
      ;
      var _jsvm_newFunction = Module["_jsvm_newFunction"] = function() {
          return (_jsvm_newFunction = Module["_jsvm_newFunction"] = Module["asm"]["jsvm_newFunction"]).apply(null, arguments)
      }
      ;
      var _jsvm_getProto = Module["_jsvm_getProto"] = function() {
          return (_jsvm_getProto = Module["_jsvm_getProto"] = Module["asm"]["jsvm_getProto"]).apply(null, arguments)
      }
      ;
      var _jsvm_getOwnKeys = Module["_jsvm_getOwnKeys"] = function() {
          return (_jsvm_getOwnKeys = Module["_jsvm_getOwnKeys"] = Module["asm"]["jsvm_getOwnKeys"]).apply(null, arguments)
      }
      ;
      var _jsvm_getPropStr = Module["_jsvm_getPropStr"] = function() {
          return (_jsvm_getPropStr = Module["_jsvm_getPropStr"] = Module["asm"]["jsvm_getPropStr"]).apply(null, arguments)
      }
      ;
      var _jsvm_setPropStr = Module["_jsvm_setPropStr"] = function() {
          return (_jsvm_setPropStr = Module["_jsvm_setPropStr"] = Module["asm"]["jsvm_setPropStr"]).apply(null, arguments)
      }
      ;
      var _jsvm_dataDefinePropStr = Module["_jsvm_dataDefinePropStr"] = function() {
          return (_jsvm_dataDefinePropStr = Module["_jsvm_dataDefinePropStr"] = Module["asm"]["jsvm_dataDefinePropStr"]).apply(null, arguments)
      }
      ;
      var _jsvm_accessorDefinePropStr = Module["_jsvm_accessorDefinePropStr"] = function() {
          return (_jsvm_accessorDefinePropStr = Module["_jsvm_accessorDefinePropStr"] = Module["asm"]["jsvm_accessorDefinePropStr"]).apply(null, arguments)
      }
      ;
      var _jsvm_isEqual = Module["_jsvm_isEqual"] = function() {
          return (_jsvm_isEqual = Module["_jsvm_isEqual"] = Module["asm"]["jsvm_isEqual"]).apply(null, arguments)
      }
      ;
      var _jsvm_callFunction = Module["_jsvm_callFunction"] = function() {
          return (_jsvm_callFunction = Module["_jsvm_callFunction"] = Module["asm"]["jsvm_callFunction"]).apply(null, arguments)
      }
      ;
      var _jsvm_evalCode = Module["_jsvm_evalCode"] = function() {
          return (_jsvm_evalCode = Module["_jsvm_evalCode"] = Module["asm"]["jsvm_evalCode"]).apply(null, arguments)
      }
      ;
      var _main = Module["_main"] = function() {
          return (_main = Module["_main"] = Module["asm"]["main"]).apply(null, arguments)
      }
      ;
      var ___errno_location = Module["___errno_location"] = function() {
          return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments)
      }
      ;
      var __get_tzname = Module["__get_tzname"] = function() {
          return (__get_tzname = Module["__get_tzname"] = Module["asm"]["_get_tzname"]).apply(null, arguments)
      }
      ;
      var __get_daylight = Module["__get_daylight"] = function() {
          return (__get_daylight = Module["__get_daylight"] = Module["asm"]["_get_daylight"]).apply(null, arguments)
      }
      ;
      var __get_timezone = Module["__get_timezone"] = function() {
          return (__get_timezone = Module["__get_timezone"] = Module["asm"]["_get_timezone"]).apply(null, arguments)
      }
      ;
      var stackSave = Module["stackSave"] = function() {
          return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(null, arguments)
      }
      ;
      var stackRestore = Module["stackRestore"] = function() {
          return (stackRestore = Module["stackRestore"] = Module["asm"]["stackRestore"]).apply(null, arguments)
      }
      ;
      var stackAlloc = Module["stackAlloc"] = function() {
          return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments)
      }
      ;
      var dynCall_vijjii = Module["dynCall_vijjii"] = function() {
          return (dynCall_vijjii = Module["dynCall_vijjii"] = Module["asm"]["dynCall_vijjii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijiii = Module["dynCall_jijiii"] = function() {
          return (dynCall_jijiii = Module["dynCall_jijiii"] = Module["asm"]["dynCall_jijiii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijjiii = Module["dynCall_jijjiii"] = function() {
          return (dynCall_jijjiii = Module["dynCall_jijjiii"] = Module["asm"]["dynCall_jijjiii"]).apply(null, arguments)
      }
      ;
      var dynCall_jiii = Module["dynCall_jiii"] = function() {
          return (dynCall_jiii = Module["dynCall_jiii"] = Module["asm"]["dynCall_jiii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijiiii = Module["dynCall_jijiiii"] = function() {
          return (dynCall_jijiiii = Module["dynCall_jijiiii"] = Module["asm"]["dynCall_jijiiii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijii = Module["dynCall_jijii"] = function() {
          return (dynCall_jijii = Module["dynCall_jijii"] = Module["asm"]["dynCall_jijii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijiiiii = Module["dynCall_jijiiiii"] = function() {
          return (dynCall_jijiiiii = Module["dynCall_jijiiiii"] = Module["asm"]["dynCall_jijiiiii"]).apply(null, arguments)
      }
      ;
      var dynCall_jijj = Module["dynCall_jijj"] = function() {
          return (dynCall_jijj = Module["dynCall_jijj"] = Module["asm"]["dynCall_jijj"]).apply(null, arguments)
      }
      ;
      var dynCall_viji = Module["dynCall_viji"] = function() {
          return (dynCall_viji = Module["dynCall_viji"] = Module["asm"]["dynCall_viji"]).apply(null, arguments)
      }
      ;
      var dynCall_vij = Module["dynCall_vij"] = function() {
          return (dynCall_vij = Module["dynCall_vij"] = Module["asm"]["dynCall_vij"]).apply(null, arguments)
      }
      ;
      var dynCall_iijijjji = Module["dynCall_iijijjji"] = function() {
          return (dynCall_iijijjji = Module["dynCall_iijijjji"] = Module["asm"]["dynCall_iijijjji"]).apply(null, arguments)
      }
      ;
      var dynCall_iiiji = Module["dynCall_iiiji"] = function() {
          return (dynCall_iiiji = Module["dynCall_iiiji"] = Module["asm"]["dynCall_iiiji"]).apply(null, arguments)
      }
      ;
      var dynCall_iiiij = Module["dynCall_iiiij"] = function() {
          return (dynCall_iiiij = Module["dynCall_iiiij"] = Module["asm"]["dynCall_iiiij"]).apply(null, arguments)
      }
      ;
      var dynCall_iiji = Module["dynCall_iiji"] = function() {
          return (dynCall_iiji = Module["dynCall_iiji"] = Module["asm"]["dynCall_iiji"]).apply(null, arguments)
      }
      ;
      var dynCall_jijij = Module["dynCall_jijij"] = function() {
          return (dynCall_jijij = Module["dynCall_jijij"] = Module["asm"]["dynCall_jijij"]).apply(null, arguments)
      }
      ;
      var dynCall_iijijji = Module["dynCall_iijijji"] = function() {
          return (dynCall_iijijji = Module["dynCall_iijijji"] = Module["asm"]["dynCall_iijijji"]).apply(null, arguments)
      }
      ;
      var dynCall_jij = Module["dynCall_jij"] = function() {
          return (dynCall_jij = Module["dynCall_jij"] = Module["asm"]["dynCall_jij"]).apply(null, arguments)
      }
      ;
      var dynCall_jiji = Module["dynCall_jiji"] = function() {
          return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["dynCall_jiji"]).apply(null, arguments)
      }
      ;
      var dynCall_jii = Module["dynCall_jii"] = function() {
          return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["dynCall_jii"]).apply(null, arguments)
      }
      ;
      var calledRun;
      function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status
      }
      var calledMain = false;
      dependenciesFulfilled = function runCaller() {
          if (!calledRun)
              run();
          if (!calledRun)
              dependenciesFulfilled = runCaller
      }
      ;
      function callMain(args) {
          var entryFunction = Module["_main"];
          var argc = 0;
          var argv = 0;
          try {
              var ret = entryFunction(argc, argv);
              exit(ret, true);
              return ret
          } catch (e) {
              return handleException(e)
          } finally {
              calledMain = true
          }
      }
      function run(args) {
          args = args || arguments_;
          if (runDependencies > 0) {
              return
          }
          preRun();
          if (runDependencies > 0) {
              return
          }
          function doRun() {
              if (calledRun)
                  return;
              calledRun = true;
              Module["calledRun"] = true;
              if (ABORT)
                  return;
              initRuntime();
              preMain();
              readyPromiseResolve(Module);
              if (Module["onRuntimeInitialized"])
                  Module["onRuntimeInitialized"]();
              if (shouldRunNow)
                  callMain(args);
              postRun()
          }
          if (Module["setStatus"]) {
              Module["setStatus"]("Running...");
              setTimeout(function() {
                  setTimeout(function() {
                      Module["setStatus"]("")
                  }, 1);
                  doRun()
              }, 1)
          } else {
              doRun()
          }
      }
      Module["run"] = run;
      function exit(status, implicit) {
          EXITSTATUS = status;
          if (keepRuntimeAlive()) {} else {
              exitRuntime()
          }
          procExit(status)
      }
      function procExit(code) {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
              if (Module["onExit"])
                  Module["onExit"](code);
              ABORT = true
          }
          quit_(code, new ExitStatus(code))
      }
      if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function")
              Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
              Module["preInit"].pop()()
          }
      }
      var shouldRunNow = true;
      if (Module["noInitialRun"])
          shouldRunNow = false;
      run();

      return CppVm.ready
  }
  );
}
)();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = CppVm;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
      return CppVm;
  });
else if (typeof exports === 'object')
  exports["CppVm"] = CppVm;
