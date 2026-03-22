import { clsx as clsx$1 } from "clsx";
import * as devalue from "devalue";
import { twMerge } from "tailwind-merge";
import { router, UseFormUtils, config as config$1, mergeDataIntoQueryString, isUrlMethodPair, formDataToObject, resetFormFields, getInitialPageFromDOM, setupProgress } from "@inertiajs/core";
import { createValidator, toSimpleValidationErrors, resolveName } from "laravel-precognition";
import { computePosition, offset, shift, limitShift, flip, size, arrow, hide } from "@floating-ui/dom";
import parse from "style-to-object";
import { tabbable, focusable, isFocusable } from "tabbable";
import "maplibre-gl";
import { cloneDeep, has, set as set$1, get as get$3, isEqual, escape } from "lodash-es";
import createServer from "@inertiajs/core/server";
const HYDRATION_START = "[";
const HYDRATION_START_FAILED = "[?";
const HYDRATION_END = "]";
const ELEMENT_IS_NAMESPACED = 1;
const ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
const ELEMENT_IS_INPUT = 1 << 2;
const UNINITIALIZED = /* @__PURE__ */ Symbol();
const ATTACHMENT_KEY = "@attach";
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
var define_property = Object.defineProperty;
var has_own_property = Object.prototype.hasOwnProperty;
const noop$1 = () => {
};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
  if (value == null || !value && is_boolean) return "";
  const normalized = has_own_property.call(replacements, name) && replacements[name].get(value) || value;
  const assignment = is_boolean ? `=""` : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  if (directives) {
    for (var key of Object.keys(directives)) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key of Object.keys(styles)) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}
const STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function lifecycle_outside_component(name) {
  {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
let micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && true) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks) run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop$1) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update2) || noop$1;
    }
    run2(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update: update2, subscribe: subscribe2 };
}
function derived$1(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set2, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop$1;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set2, update2);
      if (auto) {
        set2(result);
      } else {
        cleanup = typeof result === "function" ? result : noop$1;
      }
    };
    const unsubscribers = stores_array.map(
      (store2, i) => subscribe_to_store(
        store2,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
function get$2(store2) {
  let value;
  subscribe_to_store(store2, (_) => value = _)();
  return value;
}
function without_reactive_context(fn) {
  try {
    return fn();
  } finally {
  }
}
let untracking = false;
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function subscribe_to_store(store2, run2, invalidate) {
  if (store2 == null) {
    run2(void 0);
    if (invalidate) invalidate(void 0);
    return noop$1;
  }
  const unsub = untrack(
    () => store2.subscribe(
      run2,
      // @ts-expect-error
      invalidate
    )
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
const EMPTY_COMMENT = `<!---->`;
const VOID_ELEMENT_NAMES = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
function is_void(name) {
  return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === "!doctype";
}
const DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
function is_boolean_attribute(name) {
  return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
const RAW_TEXT_ELEMENTS = (
  /** @type {const} */
  ["textarea", "script", "style", "title"]
);
function is_raw_text_element(name) {
  return RAW_TEXT_ELEMENTS.includes(
    /** @type {typeof RAW_TEXT_ELEMENTS[number]} */
    name
  );
}
const REGEX_VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9.\-_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]+)*$/u;
let controller = null;
function abort() {
  controller?.abort(STALE_REACTION);
  controller = null;
}
function await_invalid() {
  const error = new Error(`await_invalid
Encountered asynchronous work while rendering synchronously.
https://svelte.dev/e/await_invalid`);
  error.name = "Svelte error";
  throw error;
}
function dynamic_element_invalid_tag(tag) {
  const error = new Error(`dynamic_element_invalid_tag
\`<svelte:element this="${tag}">\` is not a valid element name — the element will not be rendered
https://svelte.dev/e/dynamic_element_invalid_tag`);
  error.name = "Svelte error";
  throw error;
}
function invalid_csp() {
  const error = new Error(`invalid_csp
\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.
https://svelte.dev/e/invalid_csp`);
  error.name = "Svelte error";
  throw error;
}
function lifecycle_function_unavailable(name) {
  const error = new Error(`lifecycle_function_unavailable
\`${name}(...)\` is not available on the server
https://svelte.dev/e/lifecycle_function_unavailable`);
  error.name = "Svelte error";
  throw error;
}
function server_context_required() {
  const error = new Error(`server_context_required
Could not resolve \`render\` context.
https://svelte.dev/e/server_context_required`);
  error.name = "Svelte error";
  throw error;
}
var ssr_context = null;
function set_ssr_context(v) {
  ssr_context = v;
}
function getContext(key) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key)
  );
  return result;
}
function setContext(key, context) {
  get_or_init_context_map().set(key, context);
  return context;
}
function hasContext(key) {
  return get_or_init_context_map().has(key);
}
function getAllContexts() {
  return get_or_init_context_map();
}
function get_or_init_context_map(name) {
  if (ssr_context === null) {
    lifecycle_outside_component();
  }
  return ssr_context.c ??= new Map(get_parent_context(ssr_context) || void 0);
}
function push(fn) {
  ssr_context = { p: ssr_context, c: null, r: null };
}
function pop() {
  ssr_context = /** @type {SSRContext} */
  ssr_context.p;
}
function get_parent_context(ssr_context2) {
  let parent = ssr_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
function unresolved_hydratable(key, stack) {
  {
    console.warn(`https://svelte.dev/e/unresolved_hydratable`);
  }
}
function get_render_context() {
  const store2 = als?.getStore();
  {
    server_context_required();
  }
  return store2;
}
let als = null;
let text_encoder;
let crypto;
const obfuscated_import = (module_name) => import(
  /* @vite-ignore */
  module_name
);
async function sha256(data) {
  text_encoder ??= new TextEncoder();
  crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (
    // @ts-ignore - we don't install node types in the prod build
    // don't use import('node:crypto') directly because static analysers will think we rely on node when we don't
    (await obfuscated_import("node:crypto")).webcrypto
  );
  const hash_buffer = await crypto.subtle.digest("SHA-256", text_encoder.encode(data));
  return base64_encode(hash_buffer);
}
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
class Renderer {
  /**
   * The contents of the renderer.
   * @type {RendererItem[]}
   */
  #out = [];
  /**
   * Any `onDestroy` callbacks registered during execution of this renderer.
   * @type {(() => void)[] | undefined}
   */
  #on_destroy = void 0;
  /**
   * Whether this renderer is a component body.
   * @type {boolean}
   */
  #is_component_body = false;
  /**
   * If set, this renderer is an error boundary. When async collection
   * of the children fails, the failed snippet is rendered instead.
   * @type {{
   * 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
   * 	transformError: (error: unknown) => unknown;
   * 	context: SSRContext | null;
   * } | null}
   */
  #boundary = null;
  /**
   * The type of string content that this renderer is accumulating.
   * @type {RendererType}
   */
  type;
  /** @type {Renderer | undefined} */
  #parent;
  /**
   * Asynchronous work associated with this renderer
   * @type {Promise<void> | undefined}
   */
  promise = void 0;
  /**
   * State which is associated with the content tree as a whole.
   * It will be re-exposed, uncopied, on all children.
   * @type {SSRState}
   * @readonly
   */
  global;
  /**
   * State that is local to the branch it is declared in.
   * It will be shallow-copied to all children.
   *
   * @type {{ select_value: string | undefined }}
   */
  local;
  /**
   * @param {SSRState} global
   * @param {Renderer | undefined} [parent]
   */
  constructor(global, parent) {
    this.#parent = parent;
    this.global = global;
    this.local = parent ? { ...parent.local } : { select_value: void 0 };
    this.type = parent ? parent.type : "body";
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  head(fn) {
    const head2 = new Renderer(this.global, this);
    head2.type = "head";
    this.#out.push(head2);
    head2.child(fn);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async_block(blockers, fn) {
    this.#out.push(BLOCK_OPEN);
    this.async(blockers, fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * @param {Array<Promise<void>>} blockers
   * @param {(renderer: Renderer) => void} fn
   */
  async(blockers, fn) {
    let callback = fn;
    if (blockers.length > 0) {
      const context = ssr_context;
      callback = (renderer) => {
        return Promise.all(blockers).then(() => {
          const previous_context = ssr_context;
          try {
            set_ssr_context(context);
            return fn(renderer);
          } finally {
            set_ssr_context(previous_context);
          }
        });
      };
    }
    this.child(callback);
  }
  /**
   * @param {Array<() => void>} thunks
   */
  run(thunks) {
    const context = ssr_context;
    let promise = Promise.resolve(thunks[0]());
    const promises = [promise];
    for (const fn of thunks.slice(1)) {
      promise = promise.then(() => {
        const previous_context = ssr_context;
        set_ssr_context(context);
        try {
          return fn();
        } finally {
          set_ssr_context(previous_context);
        }
      });
      promises.push(promise);
    }
    promise.catch(noop$1);
    this.promise = promise;
    return promises;
  }
  /**
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child_block(fn) {
    this.#out.push(BLOCK_OPEN);
    this.child(fn);
    this.#out.push(BLOCK_CLOSE);
  }
  /**
   * Create a child renderer. The child renderer inherits the state from the parent,
   * but has its own content.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   */
  child(fn) {
    const child = new Renderer(this.global, this);
    this.#out.push(child);
    const parent = ssr_context;
    set_ssr_context({
      ...ssr_context,
      p: parent,
      c: null,
      r: child
    });
    const result = fn(child);
    set_ssr_context(parent);
    if (result instanceof Promise) {
      result.catch(noop$1);
      result.finally(() => set_ssr_context(null)).catch(noop$1);
      if (child.global.mode === "sync") {
        await_invalid();
      }
      child.promise = result;
    }
    return child;
  }
  /**
   * Render children inside an error boundary. If the children throw and the API-level
   * `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
   * rendered instead. Otherwise the error propagates.
   *
   * @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
   * @param {(renderer: Renderer) => MaybePromise<void>} children_fn
   */
  boundary(props, children_fn) {
    const child = new Renderer(this.global, this);
    this.#out.push(child);
    const parent_context = ssr_context;
    if (props.failed) {
      child.#boundary = {
        failed: props.failed,
        transformError: this.global.transformError,
        context: parent_context
      };
    }
    set_ssr_context({
      ...ssr_context,
      p: parent_context,
      c: null,
      r: child
    });
    try {
      const result = children_fn(child);
      set_ssr_context(parent_context);
      if (result instanceof Promise) {
        if (child.global.mode === "sync") {
          await_invalid();
        }
        result.catch(noop$1);
        child.promise = result;
      }
    } catch (error) {
      set_ssr_context(parent_context);
      const failed_snippet = props.failed;
      if (!failed_snippet) throw error;
      const result = this.global.transformError(error);
      child.#out.length = 0;
      child.#boundary = null;
      if (result instanceof Promise) {
        if (this.global.mode === "sync") {
          await_invalid();
        }
        child.promise = /** @type {Promise<unknown>} */
        result.then((transformed) => {
          set_ssr_context(parent_context);
          child.#out.push(Renderer.#serialize_failed_boundary(transformed));
          failed_snippet(child, transformed, noop$1);
          child.#out.push(BLOCK_CLOSE);
        });
        child.promise.catch(noop$1);
      } else {
        child.#out.push(Renderer.#serialize_failed_boundary(result));
        failed_snippet(child, result, noop$1);
        child.#out.push(BLOCK_CLOSE);
      }
    }
  }
  /**
   * Create a component renderer. The component renderer inherits the state from the parent,
   * but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
   * @param {(renderer: Renderer) => MaybePromise<void>} fn
   * @param {Function} [component_fn]
   * @returns {void}
   */
  component(fn, component_fn) {
    push();
    const child = this.child(fn);
    child.#is_component_body = true;
    pop();
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {(renderer: Renderer) => void} fn
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   * @returns {void}
   */
  select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
    const { value, ...select_attrs } = attrs;
    this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
    this.child((renderer) => {
      renderer.local.select_value = value;
      fn(renderer);
    });
    this.push(`${is_rich ? "<!>" : ""}</select>`);
  }
  /**
   * @param {Record<string, any>} attrs
   * @param {string | number | boolean | ((renderer: Renderer) => void)} body
   * @param {string | undefined} [css_hash]
   * @param {Record<string, boolean> | undefined} [classes]
   * @param {Record<string, string> | undefined} [styles]
   * @param {number | undefined} [flags]
   * @param {boolean | undefined} [is_rich]
   */
  option(attrs, body, css_hash, classes, styles, flags, is_rich) {
    this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
    const close = (renderer, value, { head: head2, body: body2 }) => {
      if (has_own_property.call(attrs, "value")) {
        value = attrs.value;
      }
      if (value === this.local.select_value) {
        renderer.#out.push(' selected=""');
      }
      renderer.#out.push(`>${body2}${is_rich ? "<!>" : ""}</option>`);
      if (head2) {
        renderer.head((child) => child.push(head2));
      }
    };
    if (typeof body === "function") {
      this.child((renderer) => {
        const r = new Renderer(this.global, this);
        body(r);
        if (this.global.mode === "async") {
          return r.#collect_content_async().then((content) => {
            close(renderer, content.body.replaceAll("<!---->", ""), content);
          });
        } else {
          const content = r.#collect_content();
          close(renderer, content.body.replaceAll("<!---->", ""), content);
        }
      });
    } else {
      close(this, body, { body: escape_html(body) });
    }
  }
  /**
   * @param {(renderer: Renderer) => void} fn
   */
  title(fn) {
    const path = this.get_path();
    const close = (head2) => {
      this.global.set_title(head2, path);
    };
    this.child((renderer) => {
      const r = new Renderer(renderer.global, renderer);
      fn(r);
      if (renderer.global.mode === "async") {
        return r.#collect_content_async().then((content) => {
          close(content.head);
        });
      } else {
        const content = r.#collect_content();
        close(content.head);
      }
    });
  }
  /**
   * @param {string | (() => Promise<string>)} content
   */
  push(content) {
    if (typeof content === "function") {
      this.child(async (renderer) => renderer.push(await content()));
    } else {
      this.#out.push(content);
    }
  }
  /**
   * @param {() => void} fn
   */
  on_destroy(fn) {
    (this.#on_destroy ??= []).push(fn);
  }
  /**
   * @returns {number[]}
   */
  get_path() {
    return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
  }
  /**
   * @deprecated this is needed for legacy component bindings
   */
  copy() {
    const copy = new Renderer(this.global, this.#parent);
    copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
    copy.promise = this.promise;
    return copy;
  }
  /**
   * @param {Renderer} other
   * @deprecated this is needed for legacy component bindings
   */
  subsume(other) {
    if (this.global.mode !== other.global.mode) {
      throw new Error(
        "invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!"
      );
    }
    this.local = other.local;
    this.#out = other.#out.map((item) => {
      if (item instanceof Renderer) {
        item.subsume(item);
      }
      return item;
    });
    this.promise = other.promise;
    this.type = other.type;
  }
  get length() {
    return this.#out.length;
  }
  /**
   * Creates the hydration comment that marks the start of a failed boundary.
   * The error is JSON-serialized and embedded inside an HTML comment for the client
   * to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
   * from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
   * handles transparently.
   * @param {unknown} error
   * @returns {string}
   */
  static #serialize_failed_boundary(error) {
    var json = JSON.stringify(error);
    var escaped = json.replace(/>/g, "\\u003e").replace(/</g, "\\u003c");
    return `<!--${HYDRATION_START_FAILED}${escaped}-->`;
  }
  /**
   * Only available on the server and when compiling with the `server` option.
   * Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
   * @returns {RenderOutput}
   */
  static render(component, options = {}) {
    let sync;
    const result = (
      /** @type {RenderOutput} */
      {}
    );
    Object.defineProperties(result, {
      html: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).body;
        }
      },
      head: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).head;
        }
      },
      body: {
        get: () => {
          return (sync ??= Renderer.#render(component, options)).body;
        }
      },
      hashes: {
        value: {
          script: ""
        }
      },
      then: {
        value: (
          /**
           * this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
           *
           * @template TResult1
           * @template [TResult2=never]
           * @param { (value: SyncRenderOutput) => TResult1 } onfulfilled
           * @param { (reason: unknown) => TResult2 } onrejected
           */
          (onfulfilled, onrejected) => {
            {
              const result2 = sync ??= Renderer.#render(component, options);
              const user_result = onfulfilled({
                head: result2.head,
                body: result2.body,
                html: result2.body,
                hashes: { script: [] }
              });
              return Promise.resolve(user_result);
            }
          }
        )
      }
    });
    return result;
  }
  /**
   * Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
   * after awaiting `collect_async`.
   *
   * Child renderers are "porous" and don't affect execution order, but component body renderers
   * create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
   * @returns {Iterable<() => void>}
   */
  *#collect_on_destroy() {
    for (const component of this.#traverse_components()) {
      yield* component.#collect_ondestroy();
    }
  }
  /**
   * Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
   * @returns {Iterable<Renderer>}
   */
  *#traverse_components() {
    for (const child of this.#out) {
      if (typeof child !== "string") {
        yield* child.#traverse_components();
      }
    }
    if (this.#is_component_body) {
      yield this;
    }
  }
  /**
   * @returns {Iterable<() => void>}
   */
  *#collect_ondestroy() {
    if (this.#on_destroy) {
      for (const fn of this.#on_destroy) {
        yield fn;
      }
    }
    for (const child of this.#out) {
      if (child instanceof Renderer && !child.#is_component_body) {
        yield* child.#collect_ondestroy();
      }
    }
  }
  /**
   * Render a component. Throws if any of the children are performing asynchronous work.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
   * @returns {AccumulatedContent}
   */
  static #render(component, options) {
    var previous_context = ssr_context;
    try {
      const renderer = Renderer.#open_render("sync", component, options);
      const content = renderer.#collect_content();
      return Renderer.#close_render(content, renderer);
    } finally {
      abort();
      set_ssr_context(previous_context);
    }
  }
  /**
   * Render a component.
   *
   * @template {Record<string, any>} Props
   * @param {Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
   * @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
   */
  static async #render_async(component, options) {
    const previous_context = ssr_context;
    try {
      const renderer = Renderer.#open_render("async", component, options);
      const content = await renderer.#collect_content_async();
      const hydratables = await renderer.#collect_hydratables();
      if (hydratables !== null) {
        content.head = hydratables + content.head;
      }
      return Renderer.#close_render(content, renderer);
    } finally {
      set_ssr_context(previous_context);
      abort();
    }
  }
  /**
   * Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
   * @param {AccumulatedContent} content
   * @returns {AccumulatedContent}
   */
  #collect_content(content = { head: "", body: "" }) {
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof Renderer) {
        item.#collect_content(content);
      }
    }
    return content;
  }
  /**
   * Collect all of the code from the `out` array and return it as a string.
   * @param {AccumulatedContent} content
   * @returns {Promise<AccumulatedContent>}
   */
  async #collect_content_async(content = { head: "", body: "" }) {
    await this.promise;
    for (const item of this.#out) {
      if (typeof item === "string") {
        content[this.type] += item;
      } else if (item instanceof Renderer) {
        if (item.#boundary) {
          const boundary_content = { head: "", body: "" };
          try {
            await item.#collect_content_async(boundary_content);
            content.head += boundary_content.head;
            content.body += boundary_content.body;
          } catch (error) {
            const { context, failed, transformError } = item.#boundary;
            set_ssr_context(context);
            let transformed = await transformError(error);
            const failed_renderer = new Renderer(item.global, item);
            failed_renderer.type = item.type;
            failed_renderer.#out.push(Renderer.#serialize_failed_boundary(transformed));
            failed(failed_renderer, transformed, noop$1);
            failed_renderer.#out.push(BLOCK_CLOSE);
            await failed_renderer.#collect_content_async(content);
          }
        } else {
          await item.#collect_content_async(content);
        }
      }
    }
    return content;
  }
  async #collect_hydratables() {
    const ctx = get_render_context().hydratable;
    for (const [_, key] of ctx.unresolved_promises) {
      unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
    }
    for (const comparison of ctx.comparisons) {
      await comparison;
    }
    return await this.#hydratable_block(ctx);
  }
  /**
   * @template {Record<string, any>} Props
   * @param {'sync' | 'async'} mode
   * @param {import('svelte').Component<Props>} component
   * @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
   * @returns {Renderer}
   */
  static #open_render(mode, component, options) {
    var previous_context = ssr_context;
    try {
      const renderer = new Renderer(
        new SSRState(
          mode,
          options.idPrefix ? options.idPrefix + "-" : "",
          options.csp,
          options.transformError
        )
      );
      const context = { p: null, c: options.context ?? null, r: renderer };
      set_ssr_context(context);
      renderer.push(BLOCK_OPEN);
      component(renderer, options.props ?? {});
      renderer.push(BLOCK_CLOSE);
      return renderer;
    } finally {
      set_ssr_context(previous_context);
    }
  }
  /**
   * @param {AccumulatedContent} content
   * @param {Renderer} renderer
   * @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
   */
  static #close_render(content, renderer) {
    for (const cleanup of renderer.#collect_on_destroy()) {
      cleanup();
    }
    let head2 = content.head + renderer.global.get_title();
    let body = content.body;
    for (const { hash, code } of renderer.global.css) {
      head2 += `<style id="${hash}">${code}</style>`;
    }
    return {
      head: head2,
      body,
      hashes: {
        script: renderer.global.csp.script_hashes
      }
    };
  }
  /**
   * @param {HydratableContext} ctx
   */
  async #hydratable_block(ctx) {
    if (ctx.lookup.size === 0) {
      return null;
    }
    let entries = [];
    let has_promises = false;
    for (const [k, v] of ctx.lookup) {
      if (v.promises) {
        has_promises = true;
        for (const p of v.promises) await p;
      }
      entries.push(`[${devalue.uneval(k)},${v.serialized}]`);
    }
    let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
    if (has_promises) {
      prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
    }
    const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
    let csp_attr = "";
    if (this.global.csp.nonce) {
      csp_attr = ` nonce="${this.global.csp.nonce}"`;
    } else if (this.global.csp.hash) {
      const hash = await sha256(body);
      this.global.csp.script_hashes.push(`sha256-${hash}`);
    }
    return `
		<script${csp_attr}>${body}<\/script>`;
  }
}
class SSRState {
  /** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
  csp;
  /** @readonly @type {'sync' | 'async'} */
  mode;
  /** @readonly @type {() => string} */
  uid;
  /** @readonly @type {Set<{ hash: string; code: string }>} */
  css = /* @__PURE__ */ new Set();
  /**
   * `transformError` passed to `render`. Called when an error boundary catches an error.
   * Throws by default if unset in `render`.
   * @type {(error: unknown) => unknown}
   */
  transformError;
  /** @type {{ path: number[], value: string }} */
  #title = { path: [], value: "" };
  /**
   * @param {'sync' | 'async'} mode
   * @param {string} id_prefix
   * @param {Csp} csp
   * @param {((error: unknown) => unknown) | undefined} [transformError]
   */
  constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
    this.mode = mode;
    this.csp = { ...csp, script_hashes: [] };
    this.transformError = transformError ?? ((error) => {
      throw error;
    });
    let uid = 1;
    this.uid = () => `${id_prefix}s${uid++}`;
  }
  get_title() {
    return this.#title.value;
  }
  /**
   * Performs a depth-first (lexicographic) comparison using the path. Rejects sets
   * from earlier than or equal to the current value.
   * @param {string} value
   * @param {number[]} path
   */
  set_title(value, path) {
    const current = this.#title.path;
    let i = 0;
    let l = Math.min(path.length, current.length);
    while (i < l && path[i] === current[i]) i += 1;
    if (path[i] === void 0) return;
    if (current[i] === void 0 || path[i] > current[i]) {
      this.#title.path = path;
      this.#title.value = value;
    }
  }
}
const INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function element(renderer, tag, attributes_fn = noop$1, children_fn = noop$1) {
  renderer.push("<!---->");
  if (tag) {
    if (!REGEX_VALID_TAG_NAME.test(tag)) {
      dynamic_element_invalid_tag(tag);
    }
    renderer.push(`<${tag}`);
    attributes_fn();
    renderer.push(`>`);
    if (!is_void(tag)) {
      children_fn();
      if (!is_raw_text_element(tag)) {
        renderer.push(EMPTY_COMMENT);
      }
      renderer.push(`</${tag}>`);
    }
  }
  renderer.push("<!---->");
}
function render(component, options = {}) {
  if (options.csp?.hash && options.csp.nonce) {
    invalid_csp();
  }
  return Renderer.render(
    /** @type {Component<Props>} */
    component,
    options
  );
}
function head(hash, renderer, fn) {
  renderer.head((renderer2) => {
    renderer2.push(`<!--${hash}-->`);
    renderer2.child(fn);
    renderer2.push(EMPTY_COMMENT);
  });
}
function attributes(attrs, css_hash, classes, styles, flags = 0) {
  if (styles) {
    attrs.style = to_style(attrs.style, styles);
  }
  if (attrs.class) {
    attrs.class = clsx(attrs.class);
  }
  if (css_hash || classes) {
    attrs.class = to_class(attrs.class, css_hash, classes);
  }
  let attr_str = "";
  let name;
  const is_html = (flags & ELEMENT_IS_NAMESPACED) === 0;
  const lowercase = (flags & ELEMENT_PRESERVE_ATTRIBUTE_CASE) === 0;
  const is_input = (flags & ELEMENT_IS_INPUT) !== 0;
  for (name of Object.keys(attrs)) {
    if (typeof attrs[name] === "function") continue;
    if (name[0] === "$" && name[1] === "$") continue;
    if (INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
    var value = attrs[name];
    var lower = name.toLowerCase();
    if (lowercase) name = lower;
    if (lower.length > 2 && lower.startsWith("on")) continue;
    if (is_input) {
      if (name === "defaultvalue" || name === "defaultchecked") {
        name = name === "defaultvalue" ? "value" : "checked";
        if (attrs[name]) continue;
      }
    }
    attr_str += attr(name, value, is_html && is_boolean_attribute(name));
  }
  return attr_str;
}
function spread_props(props) {
  const merged_props = {};
  let key;
  for (let i = 0; i < props.length; i++) {
    const obj = props[i];
    if (obj == null) continue;
    for (key of Object.keys(obj)) {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (desc) {
        Object.defineProperty(merged_props, key, desc);
      } else {
        merged_props[key] = obj[key];
      }
    }
  }
  return merged_props;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function attr_class(value, hash, directives) {
  var result = to_class(value, hash, directives);
  return result ? ` class="${escape_html(result, true)}"` : "";
}
function attr_style(value, directives) {
  var result = to_style(value, directives);
  return result ? ` style="${escape_html(result, true)}"` : "";
}
function store_get(store_values, store_name, store2) {
  if (store_name in store_values && store_values[store_name][0] === store2) {
    return store_values[store_name][2];
  }
  store_values[store_name]?.[1]();
  store_values[store_name] = [store2, null, void 0];
  const unsub = subscribe_to_store(
    store2,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name of Object.keys(store_values)) {
    store_values[store_name][1]();
  }
}
function slot(renderer, $$props, name, slot_props, fallback_fn) {
  var slot_fn = $$props.$$slots?.[name];
  if (slot_fn === true) {
    slot_fn = $$props["children"];
  }
  if (slot_fn !== void 0) {
    slot_fn(renderer, slot_props);
  }
}
function rest_props(props, rest) {
  const rest_props2 = {};
  let key;
  for (key of Object.keys(props)) {
    if (!rest.includes(key)) {
      rest_props2[key] = props[key];
    }
  }
  return rest_props2;
}
function sanitize_props(props) {
  const { children, $$slots, ...sanitized } = props;
  return sanitized;
}
function bind_props(props_parent, props_now) {
  for (const key of Object.keys(props_now)) {
    const initial_value = props_parent[key];
    const value = props_now[key];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) {
      props_parent[key] = value;
    }
  }
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
function once(get_value) {
  let value = (
    /** @type {V} */
    UNINITIALIZED
  );
  return () => {
    if (value === UNINITIALIZED) {
      value = get_value();
    }
    return value;
  };
}
function props_id(renderer) {
  const uid = renderer.global.uid();
  renderer.push("<!--$" + uid + "-->");
  return uid;
}
function derived(fn) {
  const get_value = ssr_context === null ? fn : once(fn);
  let updated_value;
  return function(new_value) {
    if (arguments.length === 0) {
      return updated_value ?? get_value();
    }
    updated_value = new_value;
    return updated_value;
  };
}
function AppHead($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { title = "", children } = $$props;
    const appName = "Laravel";
    const fullTitle = derived(() => title ? `${title} - ${appName}` : appName);
    head("6lre40", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(fullTitle())}</title>`);
      });
      children?.($$renderer3);
      $$renderer3.push(`<!---->`);
    });
  });
}
function PlaceholderPattern($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const patternId = `pattern-${Math.random().toString(36).substring(2, 9)}`;
    $$renderer2.push(`<svg class="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" fill="none"><defs><pattern${attr("id", patternId)} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-1 5L5 -1M3 9L8.5 3.5" stroke-width="0.5"></path></pattern></defs><rect stroke="none"${attr("fill", `url(#${patternId})`)} width="100%" height="100%"></rect></svg>`);
  });
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function mount() {
  lifecycle_function_unavailable("mount");
}
function unmount() {
  lifecycle_function_unavailable("unmount");
}
async function tick() {
}
function cn(...inputs) {
  return twMerge(clsx$1(inputs));
}
function toUrl(href) {
  return typeof href === "string" ? href : href.url;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_CONTEXT = /* @__PURE__ */ Symbol("sidebar");
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      class: className = "",
      children
    } = $$props;
    const { isMobile, state: state2, openMobile, setOpenMobile } = getContext(SIDEBAR_CONTEXT);
    if (collapsible === "none") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div data-slot="sidebar"${attr_class(clsx(cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)))}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else if (store_get($$store_subs ??= {}, "$isMobile", isMobile)) {
      $$renderer2.push("<!--[1-->");
      if (store_get($$store_subs ??= {}, "$openMobile", openMobile)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="fixed inset-0 z-50"><button type="button" class="fixed inset-0 bg-black/50" aria-label="Close"></button> <div data-sidebar="sidebar" data-slot="sidebar" data-mobile="true"${attr_class(clsx(cn("fixed inset-y-0 bg-sidebar text-sidebar-foreground h-svh w-(--sidebar-width) p-0", side === "left" ? "left-0 border-r" : "right-0 border-l", className)))}${attr_style(`--sidebar-width: ${SIDEBAR_WIDTH_MOBILE};`)}><div class="flex h-full w-full flex-col">`);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="group peer text-sidebar-foreground hidden md:block" data-slot="sidebar"${attr("data-state", store_get($$store_subs ??= {}, "$state", state2))}${attr("data-collapsible", store_get($$store_subs ??= {}, "$state", state2) === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)}><div${attr_class(clsx(cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)")))}></div> <div${attr_class(clsx(cn(
        "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
        side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
        variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
        className
      )))}><div data-sidebar="sidebar" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SidebarContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="sidebar-content" data-sidebar="content"${attr_class(clsx(cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function SidebarFooter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="sidebar-footer" data-sidebar="footer"${attr_class(clsx(cn("flex flex-col gap-2 p-2", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function SidebarGroup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="sidebar-group" data-sidebar="group"${attr_class(clsx(cn("relative flex w-full min-w-0 flex-col p-2", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function SidebarGroupContent($$renderer, $$props) {
  $$renderer.push(`<div data-slot="sidebar-group-content" data-sidebar="group-content" class="w-full text-sm"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
function SidebarGroupLabel($$renderer, $$props) {
  $$renderer.push(`<div data-slot="sidebar-group-label" data-sidebar="group-label" class="text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&amp;>svg]:size-4 [&amp;>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
function SidebarHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="sidebar-header" data-sidebar="header"${attr_class(clsx(cn("flex flex-col gap-2 p-2", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function SidebarInset($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<main data-slot="sidebar-inset"${attr_class(clsx(cn("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></main>`);
  });
}
function SidebarMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<ul data-slot="sidebar-menu" data-sidebar="menu"${attr_class(clsx(cn("flex w-full min-w-0 flex-col gap-1", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></ul>`);
  });
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
const CLASS_VALUE_PRIMITIVE_TYPES = ["string", "number", "bigint", "boolean"];
function isClassValue(value) {
  if (value === null || value === void 0)
    return true;
  if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value))
    return true;
  if (Array.isArray(value))
    return value.every((item) => isClassValue(item));
  if (typeof value === "object") {
    if (Object.getPrototypeOf(value) !== Object.prototype)
      return false;
    return true;
  }
  return false;
}
const BoxSymbol = /* @__PURE__ */ Symbol("box");
const isWritableSymbol = /* @__PURE__ */ Symbol("is-writable");
function boxWith(getter, setter) {
  const derived$12 = derived(getter);
  if (setter) {
    return {
      [BoxSymbol]: true,
      [isWritableSymbol]: true,
      get current() {
        return derived$12();
      },
      set current(v) {
        setter(v);
      }
    };
  }
  return {
    [BoxSymbol]: true,
    get current() {
      return getter();
    }
  };
}
function isBox(value) {
  return isObject(value) && BoxSymbol in value;
}
function simpleBox(initialValue) {
  let current = initialValue;
  return {
    [BoxSymbol]: true,
    [isWritableSymbol]: true,
    get current() {
      return current;
    },
    set current(v) {
      current = v;
    }
  };
}
function composeHandlers(...handlers) {
  return function(e) {
    for (const handler of handlers) {
      if (!handler)
        continue;
      if (e.defaultPrevented)
        return;
      if (typeof handler === "function") {
        handler.call(this, e);
      } else {
        handler.current?.call(this, e);
      }
    }
  };
}
const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char))
    return void 0;
  return char !== char.toLowerCase();
}
function splitByCase(str) {
  const parts = [];
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = STR_SPLITTERS.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function pascalCase(str) {
  if (!str)
    return "";
  return splitByCase(str).map((p) => upperFirst(p)).join("");
}
function camelCase(str) {
  return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
  return str ? str[0].toLowerCase() + str.slice(1) : "";
}
function cssToStyleObj(css) {
  if (!css)
    return {};
  const styleObj = {};
  function iterator(name, value) {
    if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
      styleObj[pascalCase(name)] = value;
      return;
    }
    if (name.startsWith("--")) {
      styleObj[name] = value;
      return;
    }
    styleObj[camelCase(name)] = value;
  }
  parse(css, iterator);
  return styleObj;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function createParser(matcher, replacer) {
  const regex = RegExp(matcher, "g");
  return (str) => {
    if (typeof str !== "string") {
      throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
    }
    if (!str.match(regex))
      return str;
    return str.replace(regex, replacer);
  };
}
const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
  if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) {
    throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
  }
  return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
function styleToString(style = {}) {
  return styleToCSS(style).replace("\n", " ");
}
const EVENT_LIST = [
  "onabort",
  "onanimationcancel",
  "onanimationend",
  "onanimationiteration",
  "onanimationstart",
  "onauxclick",
  "onbeforeinput",
  "onbeforetoggle",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncompositionend",
  "oncompositionstart",
  "oncompositionupdate",
  "oncontextlost",
  "oncontextmenu",
  "oncontextrestored",
  "oncopy",
  "oncuechange",
  "oncut",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onfocusin",
  "onfocusout",
  "onformdata",
  "ongotpointercapture",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onlostpointercapture",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onpaste",
  "onpause",
  "onplay",
  "onplaying",
  "onpointercancel",
  "onpointerdown",
  "onpointerenter",
  "onpointerleave",
  "onpointermove",
  "onpointerout",
  "onpointerover",
  "onpointerup",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onscroll",
  "onscrollend",
  "onsecuritypolicyviolation",
  "onseeked",
  "onseeking",
  "onselect",
  "onselectionchange",
  "onselectstart",
  "onslotchange",
  "onstalled",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "ontouchcancel",
  "ontouchend",
  "ontouchmove",
  "ontouchstart",
  "ontransitioncancel",
  "ontransitionend",
  "ontransitionrun",
  "ontransitionstart",
  "onvolumechange",
  "onwaiting",
  "onwebkitanimationend",
  "onwebkitanimationiteration",
  "onwebkitanimationstart",
  "onwebkittransitionend",
  "onwheel"
];
const EVENT_LIST_SET = new Set(EVENT_LIST);
function isEventHandler(key) {
  return EVENT_LIST_SET.has(key);
}
function mergeProps(...args) {
  const result = { ...args[0] };
  for (let i = 1; i < args.length; i++) {
    const props = args[i];
    if (!props)
      continue;
    for (const key of Object.keys(props)) {
      const a = result[key];
      const b = props[key];
      const aIsFunction = typeof a === "function";
      const bIsFunction = typeof b === "function";
      if (aIsFunction && typeof bIsFunction && isEventHandler(key)) {
        const aHandler = a;
        const bHandler = b;
        result[key] = composeHandlers(aHandler, bHandler);
      } else if (aIsFunction && bIsFunction) {
        result[key] = executeCallbacks(a, b);
      } else if (key === "class") {
        const aIsClassValue = isClassValue(a);
        const bIsClassValue = isClassValue(b);
        if (aIsClassValue && bIsClassValue) {
          result[key] = clsx$1(a, b);
        } else if (aIsClassValue) {
          result[key] = clsx$1(a);
        } else if (bIsClassValue) {
          result[key] = clsx$1(b);
        }
      } else if (key === "style") {
        const aIsObject = typeof a === "object";
        const bIsObject = typeof b === "object";
        const aIsString = typeof a === "string";
        const bIsString = typeof b === "string";
        if (aIsObject && bIsObject) {
          result[key] = { ...a, ...b };
        } else if (aIsObject && bIsString) {
          const parsedStyle = cssToStyleObj(b);
          result[key] = { ...a, ...parsedStyle };
        } else if (aIsString && bIsObject) {
          const parsedStyle = cssToStyleObj(a);
          result[key] = { ...parsedStyle, ...b };
        } else if (aIsString && bIsString) {
          const parsedStyleA = cssToStyleObj(a);
          const parsedStyleB = cssToStyleObj(b);
          result[key] = { ...parsedStyleA, ...parsedStyleB };
        } else if (aIsObject) {
          result[key] = a;
        } else if (bIsObject) {
          result[key] = b;
        } else if (aIsString) {
          result[key] = a;
        } else if (bIsString) {
          result[key] = b;
        }
      } else {
        result[key] = b !== void 0 ? b : a;
      }
    }
    for (const key of Object.getOwnPropertySymbols(props)) {
      const a = result[key];
      const b = props[key];
      result[key] = b !== void 0 ? b : a;
    }
  }
  if (typeof result.style === "object") {
    result.style = styleToString(result.style).replaceAll("\n", " ");
  }
  if (result.hidden === false) {
    result.hidden = void 0;
    delete result.hidden;
  }
  if (result.disabled === false) {
    result.disabled = void 0;
    delete result.disabled;
  }
  return result;
}
const defaultWindow = void 0;
function getActiveElement$1(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
const event_symbol = /* @__PURE__ */ Symbol("events");
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event);
    }
    if (!event.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function on(element2, type, handler, options = {}) {
  var target_handler = create_event(type, element2, handler, options);
  return () => {
    element2.removeEventListener(type, target_handler, options);
  };
}
let last_propagated_event = null;
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  last_propagated_event = event;
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target[event_symbol]?.[event_name];
        if (delegated != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event.target === current_target)) {
          delegated.call(current_target, event);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event[event_symbol] = handler_element;
    delete event.currentTarget;
  }
}
const SvelteMap = globalThis.Map;
function createSubscriber(_) {
  return () => {
  };
}
class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window: window2 = defaultWindow, document: document2 = window2?.document } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber();
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement$1(this.#document);
  }
}
new ActiveElement();
function isFunction(value) {
  return typeof value === "function";
}
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback2) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback2;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
function runWatcher(sources, flush, effect, options = {}) {
  const { lazy = false } = options;
}
function watch(sources, effect, options) {
  runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
  runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
function get$1(value) {
  if (isFunction(value)) {
    return value();
  }
  return value;
}
class ElementSize {
  // no need to use `$state` here since we are using createSubscriber
  #size = { width: 0, height: 0 };
  #observed = false;
  #options;
  #node;
  #window;
  // we use a derived here to extract the width so that if the width doesn't change we don't get a state update
  // which we would get if we would just use a getter since the version of the subscriber will be changing
  #width = derived(() => {
    this.#subscribe()?.();
    return this.getSize().width;
  });
  // we use a derived here to extract the height so that if the height doesn't change we don't get a state update
  // which we would get if we would just use a getter since the version of the subscriber will be changing
  #height = derived(() => {
    this.#subscribe()?.();
    return this.getSize().height;
  });
  // we need to use a derived here because the class will be created before the node is bound to the ref
  #subscribe = derived(() => {
    const node$ = get$1(this.#node);
    if (!node$) return;
    return createSubscriber();
  });
  constructor(node, options = { box: "border-box" }) {
    this.#window = options.window ?? defaultWindow;
    this.#options = options;
    this.#node = node;
    this.#size = { width: 0, height: 0 };
  }
  calculateSize() {
    const element2 = get$1(this.#node);
    if (!element2 || !this.#window) {
      return;
    }
    const offsetWidth = element2.offsetWidth;
    const offsetHeight = element2.offsetHeight;
    if (this.#options.box === "border-box") {
      return { width: offsetWidth, height: offsetHeight };
    }
    const style = this.#window.getComputedStyle(element2);
    const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const borderWidth = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const contentWidth = offsetWidth - paddingWidth - borderWidth;
    const contentHeight = offsetHeight - paddingHeight - borderHeight;
    return { width: contentWidth, height: contentHeight };
  }
  getSize() {
    return this.#observed ? this.#size : this.calculateSize() ?? this.#size;
  }
  get current() {
    this.#subscribe()?.();
    return this.getSize();
  }
  get width() {
    return this.#width();
  }
  get height() {
    return this.#height();
  }
}
function onDestroyEffect(fn) {
}
function afterSleep(ms, cb) {
  return setTimeout(cb, ms);
}
function afterTick(fn) {
  tick().then(fn);
}
const ELEMENT_NODE = 1;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;
function isHTMLElement$1(node) {
  return isObject(node) && node.nodeType === ELEMENT_NODE && typeof node.nodeName === "string";
}
function isDocument(node) {
  return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
  return isObject(node) && node.constructor?.name === "VisualViewport";
}
function isNode(node) {
  return isObject(node) && node.nodeType !== void 0;
}
function isShadowRoot(node) {
  return isNode(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in node;
}
function contains(parent, child) {
  if (!parent || !child)
    return false;
  if (!isHTMLElement$1(parent) || !isHTMLElement$1(child))
    return false;
  const rootNode = child.getRootNode?.();
  if (parent === child)
    return true;
  if (parent.contains(child))
    return true;
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next)
        return true;
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getDocument(node) {
  if (isDocument(node))
    return node;
  if (isWindow(node))
    return node.document;
  return node?.ownerDocument ?? document;
}
function getWindow(node) {
  if (isShadowRoot(node))
    return getWindow(node.host);
  if (isDocument(node))
    return node.defaultView ?? window;
  if (isHTMLElement$1(node))
    return node.ownerDocument?.defaultView ?? window;
  return window;
}
function getActiveElement(rootNode) {
  let activeElement = rootNode.activeElement;
  while (activeElement?.shadowRoot) {
    const el = activeElement.shadowRoot.activeElement;
    if (el === activeElement)
      break;
    else
      activeElement = el;
  }
  return activeElement;
}
class DOMContext {
  element;
  #root = derived(() => {
    if (!this.element.current) return document;
    const rootNode = this.element.current.getRootNode() ?? document;
    return rootNode;
  });
  get root() {
    return this.#root();
  }
  set root($$value) {
    return this.#root($$value);
  }
  constructor(element2) {
    if (typeof element2 === "function") {
      this.element = boxWith(element2);
    } else {
      this.element = element2;
    }
  }
  getDocument = () => {
    return getDocument(this.root);
  };
  getWindow = () => {
    return this.getDocument().defaultView ?? window;
  };
  getActiveElement = () => {
    return getActiveElement(this.root);
  };
  isActiveElement = (node) => {
    return node === this.getActiveElement();
  };
  getElementById(id) {
    return this.root.getElementById(id);
  }
  querySelector = (selector) => {
    if (!this.root) return null;
    return this.root.querySelector(selector);
  };
  querySelectorAll = (selector) => {
    if (!this.root) return [];
    return this.root.querySelectorAll(selector);
  };
  setTimeout = (callback, delay) => {
    return this.getWindow().setTimeout(callback, delay);
  };
  clearTimeout = (timeoutId) => {
    return this.getWindow().clearTimeout(timeoutId);
  };
}
function createAttachmentKey() {
  return Symbol(ATTACHMENT_KEY);
}
function attachRef(ref, onChange) {
  return {
    [createAttachmentKey()]: (node) => {
      if (isBox(ref)) {
        ref.current = node;
        run(() => onChange?.(node));
        return () => {
          if ("isConnected" in node && node.isConnected)
            return;
          ref.current = null;
          onChange?.(null);
        };
      }
      ref(node);
      run(() => onChange?.(node));
      return () => {
        if ("isConnected" in node && node.isConnected)
          return;
        ref(null);
        onChange?.(null);
      };
    }
  };
}
function boolToEmptyStrOrUndef(condition) {
  return condition ? "" : void 0;
}
class BitsAttrs {
  #variant;
  #prefix;
  attrs;
  constructor(config2) {
    this.#variant = config2.getVariant ? config2.getVariant() : null;
    this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config2.component}-`;
    this.getAttr = this.getAttr.bind(this);
    this.selector = this.selector.bind(this);
    this.attrs = Object.fromEntries(config2.parts.map((part) => [part, this.getAttr(part)]));
  }
  getAttr(part, variantOverride) {
    if (variantOverride)
      return `data-${variantOverride}-${part}`;
    return `${this.#prefix}${part}`;
  }
  selector(part, variantOverride) {
    return `[${this.getAttr(part, variantOverride)}]`;
  }
}
function createBitsAttrs(config2) {
  const bitsAttrs = new BitsAttrs(config2);
  return {
    ...bitsAttrs.attrs,
    selector: bitsAttrs.selector,
    getAttr: bitsAttrs.getAttr
  };
}
const ESCAPE = "Escape";
const isBrowser = typeof document !== "undefined";
const isIOS = getIsIOS();
function getIsIOS() {
  return isBrowser && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
  window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function isHTMLElement(element2) {
  return element2 instanceof HTMLElement;
}
function isElement(element2) {
  return element2 instanceof Element;
}
function isElementOrSVGElement(element2) {
  return element2 instanceof Element || element2 instanceof SVGElement;
}
function isFocusVisible(element2) {
  return element2.matches(":focus-visible");
}
function isNotNull(value) {
  return value !== null;
}
class AnimationsComplete {
  #opts;
  #currentFrame = null;
  constructor(opts) {
    this.#opts = opts;
  }
  #cleanup() {
    if (!this.#currentFrame)
      return;
    window.cancelAnimationFrame(this.#currentFrame);
    this.#currentFrame = null;
  }
  run(fn) {
    this.#cleanup();
    const node = this.#opts.ref.current;
    if (!node)
      return;
    if (typeof node.getAnimations !== "function") {
      this.#executeCallback(fn);
      return;
    }
    this.#currentFrame = window.requestAnimationFrame(() => {
      const animations = node.getAnimations();
      if (animations.length === 0) {
        this.#executeCallback(fn);
        return;
      }
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        this.#executeCallback(fn);
      });
    });
  }
  #executeCallback(fn) {
    const execute = () => {
      fn();
    };
    if (this.#opts.afterTick) {
      afterTick(execute);
    } else {
      execute();
    }
  }
}
class PresenceManager {
  #opts;
  #enabled;
  #afterAnimations;
  #shouldRender = false;
  constructor(opts) {
    this.#opts = opts;
    this.#shouldRender = opts.open.current;
    this.#enabled = opts.enabled ?? true;
    this.#afterAnimations = new AnimationsComplete({ ref: this.#opts.ref, afterTick: this.#opts.open });
    watch(() => this.#opts.open.current, (isOpen) => {
      if (isOpen) this.#shouldRender = true;
      if (!this.#enabled) return;
      this.#afterAnimations.run(() => {
        if (isOpen === this.#opts.open.current) {
          if (!this.#opts.open.current) {
            this.#shouldRender = false;
          }
          this.#opts.onComplete?.();
        }
      });
    });
  }
  get shouldRender() {
    return this.#shouldRender;
  }
}
function noop() {
}
function createId(prefixOrUid, uid) {
  return `bits-${prefixOrUid}`;
}
const BitsConfigContext = new Context("BitsConfig");
function getBitsConfig() {
  const fallback2 = new BitsConfigState(null, {});
  return BitsConfigContext.getOr(fallback2).opts;
}
class BitsConfigState {
  opts;
  constructor(parent, opts) {
    const resolveConfigOption = createConfigResolver(parent, opts);
    this.opts = {
      defaultPortalTo: resolveConfigOption((config2) => config2.defaultPortalTo),
      defaultLocale: resolveConfigOption((config2) => config2.defaultLocale)
    };
  }
}
function createConfigResolver(parent, currentOpts) {
  return (getter) => {
    const configOption = boxWith(() => {
      const value = getter(currentOpts)?.current;
      if (value !== void 0)
        return value;
      if (parent === null)
        return void 0;
      return getter(parent.opts)?.current;
    });
    return configOption;
  };
}
function createPropResolver(configOption, fallback2) {
  return (getProp) => {
    const config2 = getBitsConfig();
    return boxWith(() => {
      const propValue = getProp();
      if (propValue !== void 0)
        return propValue;
      const option = configOption(config2).current;
      if (option !== void 0)
        return option;
      return fallback2;
    });
  };
}
const resolvePortalToProp = createPropResolver((config2) => config2.defaultPortalTo, "body");
function Portal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { to: toProp, children, disabled } = $$props;
    const to = resolvePortalToProp(() => toProp);
    getAllContexts();
    let target = derived(getTarget);
    function getTarget() {
      if (!isBrowser || disabled) return null;
      let localTarget = null;
      if (typeof to.current === "string") {
        const target2 = document.querySelector(to.current);
        localTarget = target2;
      } else {
        localTarget = to.current;
      }
      return localTarget;
    }
    let instance;
    function unmountInstance() {
      if (instance) {
        unmount();
        instance = null;
      }
    }
    watch([() => target(), () => disabled], ([target2, disabled2]) => {
      if (!target2 || disabled2) {
        unmountInstance();
        return;
      }
      instance = mount();
      return () => {
        unmountInstance();
      };
    });
    if (disabled) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function debounce(fn, wait = 500) {
  let timeout = null;
  const debounced = (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
  debounced.destroy = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  return debounced;
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
function isClickTrulyOutside(event, contentNode) {
  const { clientX, clientY } = event;
  const rect = contentNode.getBoundingClientRect();
  return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";
const CONTEXT_MENU_CONTENT_ATTR = "data-context-menu-content";
createBitsAttrs({
  component: "menu",
  parts: [
    "trigger",
    "content",
    "sub-trigger",
    "item",
    "group",
    "group-heading",
    "checkbox-group",
    "checkbox-item",
    "radio-group",
    "radio-item",
    "separator",
    "sub-content",
    "arrow"
  ]
});
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
class DismissibleLayerState {
  static create(opts) {
    return new DismissibleLayerState(opts);
  }
  opts;
  #interactOutsideProp;
  #behaviorType;
  #interceptedEvents = { pointerdown: false };
  #isResponsibleLayer = false;
  #isFocusInsideDOMTree = false;
  #documentObj = void 0;
  #onFocusOutside;
  #unsubClickListener = noop;
  constructor(opts) {
    this.opts = opts;
    this.#behaviorType = opts.interactOutsideBehavior;
    this.#interactOutsideProp = opts.onInteractOutside;
    this.#onFocusOutside = opts.onFocusOutside;
    let unsubEvents = noop;
    const cleanup = () => {
      this.#resetState();
      globalThis.bitsDismissableLayers.delete(this);
      this.#handleInteractOutside.destroy();
      unsubEvents();
    };
    watch([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
      if (!this.opts.enabled.current || !this.opts.ref.current) return;
      afterSleep(1, () => {
        if (!this.opts.ref.current) return;
        globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
        unsubEvents();
        unsubEvents = this.#addEventListeners();
      });
      return cleanup;
    });
  }
  #handleFocus = (event) => {
    if (event.defaultPrevented) return;
    if (!this.opts.ref.current) return;
    afterTick(() => {
      if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target)) return;
      if (event.target && !this.#isFocusInsideDOMTree) {
        this.#onFocusOutside.current?.(event);
      }
    });
  };
  #addEventListeners() {
    return executeCallbacks(
      /**
       * CAPTURE INTERACTION START
       * mark interaction-start event as intercepted.
       * mark responsible layer during interaction start
       * to avoid checking if is responsible layer during interaction end
       * when a new floating element may have been opened.
       */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
      /**
       * BUBBLE INTERACTION START
       * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
       * to avoid prematurely checking if other events were intercepted.
       */
      on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
      /**
       * HANDLE FOCUS OUTSIDE
       */
      on(this.#documentObj, "focusin", this.#handleFocus)
    );
  }
  #handleDismiss = (e) => {
    let event = e;
    if (event.defaultPrevented) {
      event = createWrappedEvent(e);
    }
    this.#interactOutsideProp.current(e);
  };
  #handleInteractOutside = debounce(
    (e) => {
      if (!this.opts.ref.current) {
        this.#unsubClickListener();
        return;
      }
      const isEventValid = this.opts.isValidEvent.current(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);
      if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
        this.#unsubClickListener();
        return;
      }
      let event = e;
      if (event.defaultPrevented) {
        event = createWrappedEvent(event);
      }
      if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
        this.#unsubClickListener();
        return;
      }
      if (e.pointerType === "touch") {
        this.#unsubClickListener();
        this.#unsubClickListener = on(this.#documentObj, "click", this.#handleDismiss, { once: true });
      } else {
        this.#interactOutsideProp.current(event);
      }
    },
    10
  );
  #markInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = true;
  };
  #markNonInterceptedEvent = (e) => {
    this.#interceptedEvents[e.type] = false;
  };
  #markResponsibleLayer = () => {
    if (!this.opts.ref.current) return;
    this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
  };
  #isTargetWithinLayer = (target) => {
    if (!this.opts.ref.current) return false;
    return isOrContainsTarget(this.opts.ref.current, target);
  };
  #resetState = debounce(
    () => {
      for (const eventType in this.#interceptedEvents) {
        this.#interceptedEvents[eventType] = false;
      }
      this.#isResponsibleLayer = false;
    },
    20
  );
  #isAnyEventIntercepted() {
    const i = Object.values(this.#interceptedEvents).some(Boolean);
    return i;
  }
  #onfocuscapture = () => {
    this.#isFocusInsideDOMTree = true;
  };
  #onblurcapture = () => {
    this.#isFocusInsideDOMTree = false;
  };
  props = {
    onfocuscapture: this.#onfocuscapture,
    onblurcapture: this.#onblurcapture
  };
}
function getTopMostDismissableLayer(layersArr = [...globalThis.bitsDismissableLayers]) {
  return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
  const layersArr = [...globalThis.bitsDismissableLayers];
  const topMostLayer = getTopMostDismissableLayer(layersArr);
  if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode.opts.ref.current === node;
}
function isValidEvent(e, node) {
  const target = e.target;
  if (!isElementOrSVGElement(target)) return false;
  const targetIsContextMenuTrigger = Boolean(target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`));
  if ("button" in e && e.button > 0 && !targetIsContextMenuTrigger) return false;
  if ("button" in e && e.button === 0 && targetIsContextMenuTrigger) return true;
  const nodeIsContextMenu = Boolean(node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`));
  if (targetIsContextMenuTrigger && nodeIsContextMenu) return false;
  const ownerDocument = getOwnerDocument(target);
  const isValid = ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
  return isValid;
}
function createWrappedEvent(e) {
  const capturedCurrentTarget = e.currentTarget;
  const capturedTarget = e.target;
  let newEvent;
  if (e instanceof PointerEvent) {
    newEvent = new PointerEvent(e.type, e);
  } else {
    newEvent = new PointerEvent("pointerdown", e);
  }
  let isPrevented = false;
  const wrappedEvent = new Proxy(newEvent, {
    get: (target, prop) => {
      if (prop === "currentTarget") {
        return capturedCurrentTarget;
      }
      if (prop === "target") {
        return capturedTarget;
      }
      if (prop === "preventDefault") {
        return () => {
          isPrevented = true;
          if (typeof target.preventDefault === "function") {
            target.preventDefault();
          }
        };
      }
      if (prop === "defaultPrevented") {
        return isPrevented;
      }
      if (prop in target) {
        return target[prop];
      }
      return e[prop];
    }
  });
  return wrappedEvent;
}
function Dismissible_layer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      interactOutsideBehavior = "close",
      onInteractOutside = noop,
      onFocusOutside = noop,
      id,
      children,
      enabled,
      isValidEvent: isValidEvent2 = () => false,
      ref
    } = $$props;
    const dismissibleLayerState = DismissibleLayerState.create({
      id: boxWith(() => id),
      interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
      onInteractOutside: boxWith(() => onInteractOutside),
      enabled: boxWith(() => enabled),
      onFocusOutside: boxWith(() => onFocusOutside),
      isValidEvent: boxWith(() => isValidEvent2),
      ref
    });
    children?.($$renderer2, { props: dismissibleLayerState.props });
    $$renderer2.push(`<!---->`);
  });
}
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
class EscapeLayerState {
  static create(opts) {
    return new EscapeLayerState(opts);
  }
  opts;
  domContext;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(this.opts.ref);
    let unsubEvents = noop;
    watch(() => opts.enabled.current, (enabled) => {
      if (enabled) {
        globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
        unsubEvents = this.#addEventListener();
      }
      return () => {
        unsubEvents();
        globalThis.bitsEscapeLayers.delete(this);
      };
    });
  }
  #addEventListener = () => {
    return on(this.domContext.getDocument(), "keydown", this.#onkeydown, { passive: false });
  };
  #onkeydown = (e) => {
    if (e.key !== ESCAPE || !isResponsibleEscapeLayer(this)) return;
    const clonedEvent = new KeyboardEvent(e.type, e);
    e.preventDefault();
    const behaviorType = this.opts.escapeKeydownBehavior.current;
    if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
    this.opts.onEscapeKeydown.current(clonedEvent);
  };
}
function isResponsibleEscapeLayer(instance) {
  const layersArr = [...globalThis.bitsEscapeLayers];
  const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
  if (topMostLayer) return topMostLayer[0] === instance;
  const [firstLayerNode] = layersArr[0];
  return firstLayerNode === instance;
}
function Escape_layer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      escapeKeydownBehavior = "close",
      onEscapeKeydown = noop,
      children,
      enabled,
      ref
    } = $$props;
    EscapeLayerState.create({
      escapeKeydownBehavior: boxWith(() => escapeKeydownBehavior),
      onEscapeKeydown: boxWith(() => onEscapeKeydown),
      enabled: boxWith(() => enabled),
      ref
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
class FocusScopeManager {
  static instance;
  #scopeStack = simpleBox([]);
  #focusHistory = /* @__PURE__ */ new WeakMap();
  #preFocusHistory = /* @__PURE__ */ new WeakMap();
  static getInstance() {
    if (!this.instance) {
      this.instance = new FocusScopeManager();
    }
    return this.instance;
  }
  register(scope) {
    const current = this.getActive();
    if (current && current !== scope) {
      current.pause();
    }
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      this.#preFocusHistory.set(scope, activeElement);
    }
    this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
    this.#scopeStack.current.unshift(scope);
  }
  unregister(scope) {
    this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
    const next = this.getActive();
    if (next) {
      next.resume();
    }
  }
  getActive() {
    return this.#scopeStack.current[0];
  }
  setFocusMemory(scope, element2) {
    this.#focusHistory.set(scope, element2);
  }
  getFocusMemory(scope) {
    return this.#focusHistory.get(scope);
  }
  isActiveScope(scope) {
    return this.getActive() === scope;
  }
  setPreFocusMemory(scope, element2) {
    this.#preFocusHistory.set(scope, element2);
  }
  getPreFocusMemory(scope) {
    return this.#preFocusHistory.get(scope);
  }
  clearPreFocusMemory(scope) {
    this.#preFocusHistory.delete(scope);
  }
}
class FocusScope {
  #paused = false;
  #container = null;
  #manager = FocusScopeManager.getInstance();
  #cleanupFns = [];
  #opts;
  constructor(opts) {
    this.#opts = opts;
  }
  get paused() {
    return this.#paused;
  }
  pause() {
    this.#paused = true;
  }
  resume() {
    this.#paused = false;
  }
  #cleanup() {
    for (const fn of this.#cleanupFns) {
      fn();
    }
    this.#cleanupFns = [];
  }
  mount(container) {
    if (this.#container) {
      this.unmount();
    }
    this.#container = container;
    this.#manager.register(this);
    this.#setupEventListeners();
    this.#handleOpenAutoFocus();
  }
  unmount() {
    if (!this.#container) return;
    this.#cleanup();
    this.#handleCloseAutoFocus();
    this.#manager.unregister(this);
    this.#manager.clearPreFocusMemory(this);
    this.#container = null;
  }
  #handleOpenAutoFocus() {
    if (!this.#container) return;
    const event = new CustomEvent("focusScope.onOpenAutoFocus", { bubbles: false, cancelable: true });
    this.#opts.onOpenAutoFocus.current(event);
    if (!event.defaultPrevented) {
      requestAnimationFrame(() => {
        if (!this.#container) return;
        const firstTabbable = this.#getFirstTabbable();
        if (firstTabbable) {
          firstTabbable.focus();
          this.#manager.setFocusMemory(this, firstTabbable);
        } else {
          this.#container.focus();
        }
      });
    }
  }
  #handleCloseAutoFocus() {
    const event = new CustomEvent("focusScope.onCloseAutoFocus", { bubbles: false, cancelable: true });
    this.#opts.onCloseAutoFocus.current?.(event);
    if (!event.defaultPrevented) {
      const preFocusedElement = this.#manager.getPreFocusMemory(this);
      if (preFocusedElement && document.contains(preFocusedElement)) {
        try {
          preFocusedElement.focus();
        } catch {
          document.body.focus();
        }
      }
    }
  }
  #setupEventListeners() {
    if (!this.#container || !this.#opts.trap.current) return;
    const container = this.#container;
    const doc = container.ownerDocument;
    const handleFocus = (e) => {
      if (this.#paused || !this.#manager.isActiveScope(this)) return;
      const target = e.target;
      if (!target) return;
      const isInside = container.contains(target);
      if (isInside) {
        this.#manager.setFocusMemory(this, target);
      } else {
        const lastFocused = this.#manager.getFocusMemory(this);
        if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
          e.preventDefault();
          lastFocused.focus();
        } else {
          const firstTabbable = this.#getFirstTabbable();
          const firstFocusable = this.#getAllFocusables()[0];
          (firstTabbable || firstFocusable || container).focus();
        }
      }
    };
    const handleKeydown = (e) => {
      if (!this.#opts.loop || this.#paused || e.key !== "Tab") return;
      if (!this.#manager.isActiveScope(this)) return;
      const tabbables = this.#getTabbables();
      if (tabbables.length === 0) return;
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };
    this.#cleanupFns.push(on(doc, "focusin", handleFocus, { capture: true }), on(container, "keydown", handleKeydown));
    const observer = new MutationObserver(() => {
      const lastFocused = this.#manager.getFocusMemory(this);
      if (lastFocused && !container.contains(lastFocused)) {
        const firstTabbable = this.#getFirstTabbable();
        const firstFocusable = this.#getAllFocusables()[0];
        const elementToFocus = firstTabbable || firstFocusable;
        if (elementToFocus) {
          elementToFocus.focus();
          this.#manager.setFocusMemory(this, elementToFocus);
        } else {
          container.focus();
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    this.#cleanupFns.push(() => observer.disconnect());
  }
  #getTabbables() {
    if (!this.#container) return [];
    return tabbable(this.#container, { includeContainer: false, getShadowRoot: true });
  }
  #getFirstTabbable() {
    const tabbables = this.#getTabbables();
    return tabbables[0] || null;
  }
  #getAllFocusables() {
    if (!this.#container) return [];
    return focusable(this.#container, { includeContainer: false, getShadowRoot: true });
  }
  static use(opts) {
    let scope = null;
    watch([() => opts.ref.current, () => opts.enabled.current], ([ref, enabled]) => {
      if (ref && enabled) {
        if (!scope) {
          scope = new FocusScope(opts);
        }
        scope.mount(ref);
      } else if (scope) {
        scope.unmount();
        scope = null;
      }
    });
    return {
      get props() {
        return { tabindex: -1 };
      }
    };
  }
}
function Focus_scope($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      enabled = false,
      trapFocus = false,
      loop = false,
      onCloseAutoFocus = noop,
      onOpenAutoFocus = noop,
      focusScope,
      ref
    } = $$props;
    const focusScopeState = FocusScope.use({
      enabled: boxWith(() => enabled),
      trap: boxWith(() => trapFocus),
      loop,
      onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
      onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
      ref
    });
    focusScope?.($$renderer2, { props: focusScopeState.props });
    $$renderer2.push(`<!---->`);
  });
}
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
class TextSelectionLayerState {
  static create(opts) {
    return new TextSelectionLayerState(opts);
  }
  opts;
  domContext;
  #unsubSelectionLock = noop;
  constructor(opts) {
    this.opts = opts;
    this.domContext = new DOMContext(opts.ref);
    let unsubEvents = noop;
    watch(() => this.opts.enabled.current, (isEnabled) => {
      if (isEnabled) {
        globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
        unsubEvents();
        unsubEvents = this.#addEventListeners();
      }
      return () => {
        unsubEvents();
        this.#resetSelectionLock();
        globalThis.bitsTextSelectionLayers.delete(this);
      };
    });
  }
  #addEventListeners() {
    return executeCallbacks(on(this.domContext.getDocument(), "pointerdown", this.#pointerdown), on(this.domContext.getDocument(), "pointerup", composeHandlers(this.#resetSelectionLock, this.opts.onPointerUp.current)));
  }
  #pointerdown = (e) => {
    const node = this.opts.ref.current;
    const target = e.target;
    if (!isHTMLElement(node) || !isHTMLElement(target) || !this.opts.enabled.current) return;
    if (!isHighestLayer(this) || !contains(node, target)) return;
    this.opts.onPointerDown.current(e);
    if (e.defaultPrevented) return;
    this.#unsubSelectionLock = preventTextSelectionOverflow(node, this.domContext.getDocument().body);
  };
  #resetSelectionLock = () => {
    this.#unsubSelectionLock();
    this.#unsubSelectionLock = noop;
  };
}
const getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node, body) {
  const originalBodyUserSelect = getUserSelect(body);
  const originalNodeUserSelect = getUserSelect(node);
  setUserSelect(body, "none");
  setUserSelect(node, "text");
  return () => {
    setUserSelect(body, originalBodyUserSelect);
    setUserSelect(node, originalNodeUserSelect);
  };
}
function setUserSelect(node, value) {
  node.style.userSelect = value;
  node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
  const layersArr = [...globalThis.bitsTextSelectionLayers];
  if (!layersArr.length) return false;
  const highestLayer = layersArr.at(-1);
  if (!highestLayer) return false;
  return highestLayer[0] === instance;
}
function Text_selection_layer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      preventOverflowTextSelection = true,
      onPointerDown = noop,
      onPointerUp = noop,
      id,
      children,
      enabled,
      ref
    } = $$props;
    TextSelectionLayerState.create({
      id: boxWith(() => id),
      onPointerDown: boxWith(() => onPointerDown),
      onPointerUp: boxWith(() => onPointerUp),
      enabled: boxWith(() => enabled && preventOverflowTextSelection),
      ref
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
globalThis.bitsIdCounter ??= { current: 0 };
function useId(prefix = "bits") {
  globalThis.bitsIdCounter.current++;
  return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
class SharedState {
  #factory;
  #subscribers = 0;
  #state;
  #scope;
  constructor(factory) {
    this.#factory = factory;
  }
  #dispose() {
    this.#subscribers -= 1;
    if (this.#scope && this.#subscribers <= 0) {
      this.#scope();
      this.#state = void 0;
      this.#scope = void 0;
    }
  }
  get(...args) {
    this.#subscribers += 1;
    if (this.#state === void 0) {
      this.#scope = () => {
      };
    }
    return this.#state;
  }
}
const lockMap = new SvelteMap();
let initialBodyStyle = null;
let cleanupTimeoutId = null;
let isInCleanupTransition = false;
const anyLocked = boxWith(() => {
  for (const value of lockMap.values()) {
    if (value) return true;
  }
  return false;
});
let cleanupScheduledAt = null;
const bodyLockStackCount = new SharedState(() => {
  function resetBodyStyle() {
    return;
  }
  function cancelPendingCleanup() {
    if (cleanupTimeoutId === null) return;
    window.clearTimeout(cleanupTimeoutId);
    cleanupTimeoutId = null;
  }
  function scheduleCleanupIfNoNewLocks(delay, callback) {
    cancelPendingCleanup();
    isInCleanupTransition = true;
    cleanupScheduledAt = Date.now();
    const currentCleanupId = cleanupScheduledAt;
    const cleanupFn = () => {
      cleanupTimeoutId = null;
      if (cleanupScheduledAt !== currentCleanupId) return;
      if (!isAnyLocked(lockMap)) {
        isInCleanupTransition = false;
        callback();
      } else {
        isInCleanupTransition = false;
      }
    };
    const actualDelay = delay === null ? 24 : delay;
    cleanupTimeoutId = window.setTimeout(cleanupFn, actualDelay);
  }
  function ensureInitialStyleCaptured() {
    if (initialBodyStyle === null && lockMap.size === 0 && !isInCleanupTransition) {
      initialBodyStyle = document.body.getAttribute("style");
    }
  }
  watch(() => anyLocked.current, () => {
    if (!anyLocked.current) return;
    ensureInitialStyleCaptured();
    isInCleanupTransition = false;
    const htmlStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const hasStableGutter = htmlStyle.scrollbarGutter?.includes("stable") || bodyStyle.scrollbarGutter?.includes("stable");
    const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const paddingRight = Number.parseInt(bodyStyle.paddingRight ?? "0", 10);
    const config2 = {
      padding: paddingRight + verticalScrollbarWidth,
      margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10)
    };
    if (verticalScrollbarWidth > 0 && !hasStableGutter) {
      document.body.style.paddingRight = `${config2.padding}px`;
      document.body.style.marginRight = `${config2.margin}px`;
      document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
    }
    document.body.style.overflow = "hidden";
    if (isIOS) {
      on(
        document,
        "touchmove",
        (e) => {
          if (e.target !== document.documentElement) return;
          if (e.touches.length > 1) return;
          e.preventDefault();
        },
        { passive: false }
      );
    }
    afterTick(() => {
      document.body.style.pointerEvents = "none";
      document.body.style.overflow = "hidden";
    });
  });
  return {
    get lockMap() {
      return lockMap;
    },
    resetBodyStyle,
    scheduleCleanupIfNoNewLocks,
    cancelPendingCleanup,
    ensureInitialStyleCaptured
  };
});
class BodyScrollLock {
  #id = useId();
  #initialState;
  #restoreScrollDelay = () => null;
  #countState;
  locked;
  constructor(initialState, restoreScrollDelay = () => null) {
    this.#initialState = initialState;
    this.#restoreScrollDelay = restoreScrollDelay;
    this.#countState = bodyLockStackCount.get();
    if (!this.#countState) return;
    this.#countState.cancelPendingCleanup();
    this.#countState.ensureInitialStyleCaptured();
    this.#countState.lockMap.set(this.#id, this.#initialState ?? false);
    this.locked = boxWith(() => this.#countState.lockMap.get(this.#id) ?? false, (v) => this.#countState.lockMap.set(this.#id, v));
  }
}
function isAnyLocked(map2) {
  for (const [_, value] of map2) {
    if (value) return true;
  }
  return false;
}
function Scroll_lock($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { preventScroll = true, restoreScrollDelay = null } = $$props;
    if (preventScroll) {
      new BodyScrollLock(preventScroll, () => restoreScrollDelay);
    }
  });
}
function get(valueOrGetValue) {
  return typeof valueOrGetValue === "function" ? valueOrGetValue() : valueOrGetValue;
}
function getDPR(element2) {
  if (typeof window === "undefined") return 1;
  const win = element2.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element2, value) {
  const dpr = getDPR(element2);
  return Math.round(value * dpr) / dpr;
}
function getFloatingContentCSSVars(name) {
  return {
    [`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
    [`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
    [`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
    [`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
    [`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`
  };
}
function useFloating(options) {
  const openOption = derived(() => get(options.open) ?? true);
  const middlewareOption = derived(() => get(options.middleware));
  const transformOption = derived(() => get(options.transform) ?? true);
  const placementOption = derived(() => get(options.placement) ?? "bottom");
  const strategyOption = derived(() => get(options.strategy) ?? "absolute");
  const sideOffsetOption = derived(() => get(options.sideOffset) ?? 0);
  const alignOffsetOption = derived(() => get(options.alignOffset) ?? 0);
  const reference = options.reference;
  let x = 0;
  let y = 0;
  const floating = simpleBox(null);
  let strategy = strategyOption();
  let placement = placementOption();
  let middlewareData = {};
  let isPositioned = false;
  const floatingStyles = derived(() => {
    const xVal = floating.current ? roundByDPR(floating.current, x) : x;
    const yVal = floating.current ? roundByDPR(floating.current, y) : y;
    if (transformOption()) {
      return {
        position: strategy,
        left: "0",
        top: "0",
        transform: `translate(${xVal}px, ${yVal}px)`,
        ...floating.current && getDPR(floating.current) >= 1.5 && { willChange: "transform" }
      };
    }
    return { position: strategy, left: `${xVal}px`, top: `${yVal}px` };
  });
  function update2() {
    if (reference.current === null || floating.current === null) return;
    computePosition(reference.current, floating.current, {
      middleware: middlewareOption(),
      placement: placementOption(),
      strategy: strategyOption()
    }).then((position) => {
      const referenceNode = reference.current;
      const referenceHidden = isReferenceHidden(referenceNode);
      if (referenceHidden) {
        middlewareData = {
          ...middlewareData,
          hide: {
            // oxlint-disable-next-line no-explicit-any
            ...middlewareData.hide,
            referenceHidden: true
          }
        };
        return;
      }
      if (!openOption() && x !== 0 && y !== 0) {
        const maxExpectedOffset = Math.max(Math.abs(sideOffsetOption()), Math.abs(alignOffsetOption()), 15);
        if (position.x <= maxExpectedOffset && position.y <= maxExpectedOffset) return;
      }
      x = position.x;
      y = position.y;
      strategy = position.strategy;
      placement = position.placement;
      middlewareData = position.middlewareData;
      isPositioned = true;
    });
  }
  return {
    floating,
    reference,
    get strategy() {
      return strategy;
    },
    get placement() {
      return placement;
    },
    get middlewareData() {
      return middlewareData;
    },
    get isPositioned() {
      return isPositioned;
    },
    get floatingStyles() {
      return floatingStyles();
    },
    get update() {
      return update2;
    }
  };
}
function isReferenceHidden(node) {
  if (!(node instanceof Element)) return false;
  if (!node.isConnected) return true;
  if (node instanceof HTMLElement && node.hidden) return true;
  return node.getClientRects().length === 0;
}
const OPPOSITE_SIDE = { top: "bottom", right: "left", bottom: "top", left: "right" };
const FloatingRootContext = new Context("Floating.Root");
const FloatingContentContext = new Context("Floating.Content");
const FloatingTooltipRootContext = new Context("Floating.Root");
class FloatingRootState {
  static create(tooltip = false) {
    return tooltip ? FloatingTooltipRootContext.set(new FloatingRootState()) : FloatingRootContext.set(new FloatingRootState());
  }
  anchorNode = simpleBox(null);
  customAnchorNode = simpleBox(null);
  triggerNode = simpleBox(null);
  constructor() {
  }
}
class FloatingContentState {
  static create(opts, tooltip = false) {
    return tooltip ? FloatingContentContext.set(new FloatingContentState(opts, FloatingTooltipRootContext.get())) : FloatingContentContext.set(new FloatingContentState(opts, FloatingRootContext.get()));
  }
  opts;
  root;
  // nodes
  contentRef = simpleBox(null);
  wrapperRef = simpleBox(null);
  arrowRef = simpleBox(null);
  contentAttachment = attachRef(this.contentRef);
  wrapperAttachment = attachRef(this.wrapperRef);
  arrowAttachment = attachRef(this.arrowRef);
  // ids
  arrowId = simpleBox(useId());
  #transformedStyle = derived(() => {
    if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
    if (!this.opts.style) return {};
  });
  #updatePositionStrategy = void 0;
  #arrowSize = new ElementSize(() => this.arrowRef.current ?? void 0);
  #arrowWidth = derived(() => this.#arrowSize?.width ?? 0);
  #arrowHeight = derived(() => this.#arrowSize?.height ?? 0);
  #desiredPlacement = derived(() => this.opts.side?.current + (this.opts.align.current !== "center" ? `-${this.opts.align.current}` : ""));
  #boundary = derived(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
  #hasExplicitBoundaries = derived(() => this.#boundary().length > 0);
  get hasExplicitBoundaries() {
    return this.#hasExplicitBoundaries();
  }
  set hasExplicitBoundaries($$value) {
    return this.#hasExplicitBoundaries($$value);
  }
  #detectOverflowOptions = derived(() => ({
    padding: this.opts.collisionPadding.current,
    boundary: this.#boundary().filter(isNotNull),
    altBoundary: this.hasExplicitBoundaries
  }));
  get detectOverflowOptions() {
    return this.#detectOverflowOptions();
  }
  set detectOverflowOptions($$value) {
    return this.#detectOverflowOptions($$value);
  }
  #availableWidth = void 0;
  #availableHeight = void 0;
  #anchorWidth = void 0;
  #anchorHeight = void 0;
  #middleware = derived(() => [
    offset({
      mainAxis: this.opts.sideOffset.current + this.#arrowHeight(),
      alignmentAxis: this.opts.alignOffset.current
    }),
    this.opts.avoidCollisions.current && shift({
      mainAxis: true,
      crossAxis: false,
      limiter: this.opts.sticky.current === "partial" ? limitShift() : void 0,
      ...this.detectOverflowOptions
    }),
    this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
    size({
      ...this.detectOverflowOptions,
      apply: ({ rects, availableWidth, availableHeight }) => {
        const { width: anchorWidth, height: anchorHeight } = rects.reference;
        this.#availableWidth = availableWidth;
        this.#availableHeight = availableHeight;
        this.#anchorWidth = anchorWidth;
        this.#anchorHeight = anchorHeight;
      }
    }),
    this.arrowRef.current && arrow({
      element: this.arrowRef.current,
      padding: this.opts.arrowPadding.current
    }),
    transformOrigin({
      arrowWidth: this.#arrowWidth(),
      arrowHeight: this.#arrowHeight()
    }),
    this.opts.hideWhenDetached.current && hide({ strategy: "referenceHidden", ...this.detectOverflowOptions })
  ].filter(Boolean));
  get middleware() {
    return this.#middleware();
  }
  set middleware($$value) {
    return this.#middleware($$value);
  }
  floating;
  #placedSide = derived(() => getSideFromPlacement(this.floating.placement));
  get placedSide() {
    return this.#placedSide();
  }
  set placedSide($$value) {
    return this.#placedSide($$value);
  }
  #placedAlign = derived(() => getAlignFromPlacement(this.floating.placement));
  get placedAlign() {
    return this.#placedAlign();
  }
  set placedAlign($$value) {
    return this.#placedAlign($$value);
  }
  #arrowX = derived(() => this.floating.middlewareData.arrow?.x ?? 0);
  get arrowX() {
    return this.#arrowX();
  }
  set arrowX($$value) {
    return this.#arrowX($$value);
  }
  #arrowY = derived(() => this.floating.middlewareData.arrow?.y ?? 0);
  get arrowY() {
    return this.#arrowY();
  }
  set arrowY($$value) {
    return this.#arrowY($$value);
  }
  #cannotCenterArrow = derived(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
  get cannotCenterArrow() {
    return this.#cannotCenterArrow();
  }
  set cannotCenterArrow($$value) {
    return this.#cannotCenterArrow($$value);
  }
  contentZIndex;
  #arrowBaseSide = derived(() => OPPOSITE_SIDE[this.placedSide]);
  get arrowBaseSide() {
    return this.#arrowBaseSide();
  }
  set arrowBaseSide($$value) {
    return this.#arrowBaseSide($$value);
  }
  #wrapperProps = derived(() => ({
    id: this.opts.wrapperId.current,
    "data-bits-floating-content-wrapper": "",
    style: {
      ...this.floating.floatingStyles,
      transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
      minWidth: "max-content",
      zIndex: this.contentZIndex,
      "--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
      "--bits-floating-available-width": `${this.#availableWidth}px`,
      "--bits-floating-available-height": `${this.#availableHeight}px`,
      "--bits-floating-anchor-width": `${this.#anchorWidth}px`,
      "--bits-floating-anchor-height": `${this.#anchorHeight}px`,
      ...this.floating.middlewareData.hide?.referenceHidden && { visibility: "hidden", "pointer-events": "none" },
      ...this.#transformedStyle()
    },
    dir: this.opts.dir.current,
    ...this.wrapperAttachment
  }));
  get wrapperProps() {
    return this.#wrapperProps();
  }
  set wrapperProps($$value) {
    return this.#wrapperProps($$value);
  }
  #props = derived(() => ({
    "data-side": this.placedSide,
    "data-align": this.placedAlign,
    style: styleToString({ ...this.#transformedStyle() }),
    ...this.contentAttachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  #arrowStyle = derived(() => ({
    position: "absolute",
    left: this.arrowX ? `${this.arrowX}px` : void 0,
    top: this.arrowY ? `${this.arrowY}px` : void 0,
    [this.arrowBaseSide]: 0,
    "transform-origin": { top: "", right: "0 0", bottom: "center 0", left: "100% 0" }[this.placedSide],
    transform: {
      top: "translateY(100%)",
      right: "translateY(50%) rotate(90deg) translateX(-50%)",
      bottom: "rotate(180deg)",
      left: "translateY(50%) rotate(-90deg) translateX(50%)"
    }[this.placedSide],
    visibility: this.cannotCenterArrow ? "hidden" : void 0
  }));
  get arrowStyle() {
    return this.#arrowStyle();
  }
  set arrowStyle($$value) {
    return this.#arrowStyle($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.#updatePositionStrategy = opts.updatePositionStrategy;
    if (opts.customAnchor) {
      this.root.customAnchorNode.current = opts.customAnchor.current;
    }
    watch(() => opts.customAnchor.current, (customAnchor) => {
      this.root.customAnchorNode.current = customAnchor;
    });
    this.floating = useFloating({
      strategy: () => this.opts.strategy.current,
      placement: () => this.#desiredPlacement(),
      middleware: () => this.middleware,
      reference: this.root.anchorNode,
      open: () => this.opts.enabled.current,
      sideOffset: () => this.opts.sideOffset.current,
      alignOffset: () => this.opts.alignOffset.current
    });
    watch(() => this.contentRef.current, (contentNode) => {
      if (!contentNode || !this.opts.enabled.current) return;
      const win = getWindow(contentNode);
      const rafId = win.requestAnimationFrame(() => {
        if (this.contentRef.current !== contentNode || !this.opts.enabled.current) return;
        const zIndex = win.getComputedStyle(contentNode).zIndex;
        if (zIndex !== this.contentZIndex) {
          this.contentZIndex = zIndex;
        }
      });
      return () => {
        win.cancelAnimationFrame(rafId);
      };
    });
  }
}
class FloatingArrowState {
  static create(opts) {
    return new FloatingArrowState(opts, FloatingContentContext.get());
  }
  opts;
  content;
  constructor(opts, content) {
    this.opts = opts;
    this.content = content;
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    style: this.content.arrowStyle,
    "data-side": this.content.placedSide,
    ...this.content.arrowAttachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function transformOrigin(options) {
  return {
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  };
}
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
function getSideFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[0];
}
function getAlignFromPlacement(placement) {
  return getSideAndAlignFromPlacement(placement)[1];
}
function Floating_layer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, tooltip = false } = $$props;
    FloatingRootState.create(tooltip);
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function Arrow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id = useId(),
      children,
      child,
      width = 10,
      height = 5,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const mergedProps = derived(() => mergeProps(restProps, { id }));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span${attributes({ ...mergedProps() })}>`);
      if (children) {
        $$renderer2.push("<!--[0-->");
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg${attr("width", width)}${attr("height", height)} viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow=""><polygon points="0,0 30,0 15,10" fill="currentColor"></polygon></svg>`);
      }
      $$renderer2.push(`<!--]--></span>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Floating_layer_arrow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { id = useId(), ref = null, $$slots, $$events, ...restProps } = $$props;
    const arrowState = FloatingArrowState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, arrowState.props));
    Arrow($$renderer2, spread_props([mergedProps()]));
    bind_props($$props, { ref });
  });
}
function Floating_layer_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      content,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      id,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding = 0,
      hideWhenDetached = false,
      onPlaced = () => {
      },
      sticky = "partial",
      updatePositionStrategy = "optimized",
      strategy = "fixed",
      dir = "ltr",
      style = {},
      wrapperId = useId(),
      customAnchor = null,
      enabled,
      tooltip = false
    } = $$props;
    const contentState = FloatingContentState.create(
      {
        side: boxWith(() => side),
        sideOffset: boxWith(() => sideOffset),
        align: boxWith(() => align),
        alignOffset: boxWith(() => alignOffset),
        id: boxWith(() => id),
        arrowPadding: boxWith(() => arrowPadding),
        avoidCollisions: boxWith(() => avoidCollisions),
        collisionBoundary: boxWith(() => collisionBoundary),
        collisionPadding: boxWith(() => collisionPadding),
        hideWhenDetached: boxWith(() => hideWhenDetached),
        onPlaced: boxWith(() => onPlaced),
        sticky: boxWith(() => sticky),
        updatePositionStrategy: boxWith(() => updatePositionStrategy),
        strategy: boxWith(() => strategy),
        dir: boxWith(() => dir),
        style: boxWith(() => style),
        enabled: boxWith(() => enabled),
        wrapperId: boxWith(() => wrapperId),
        customAnchor: boxWith(() => customAnchor)
      },
      tooltip
    );
    const mergedProps = derived(() => mergeProps(contentState.wrapperProps, { style: { pointerEvents: "auto" } }));
    content?.($$renderer2, { props: contentState.props, wrapperProps: mergedProps() });
    $$renderer2.push(`<!---->`);
  });
}
function Floating_layer_content_static($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { content } = $$props;
    content?.($$renderer2, { props: {}, wrapperProps: {} });
    $$renderer2.push(`<!---->`);
  });
}
function Popper_content($$renderer, $$props) {
  let {
    content,
    isStatic = false,
    onPlaced,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (isStatic) {
    $$renderer.push("<!--[0-->");
    Floating_layer_content_static($$renderer, { content });
  } else {
    $$renderer.push("<!--[-1-->");
    Floating_layer_content($$renderer, spread_props([{ content, onPlaced }, restProps]));
  }
  $$renderer.push(`<!--]-->`);
}
function Popper_layer_inner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      popper,
      onEscapeKeydown,
      escapeKeydownBehavior,
      preventOverflowTextSelection,
      id,
      onPointerDown,
      onPointerUp,
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      updatePositionStrategy,
      strategy,
      dir,
      preventScroll,
      wrapperId,
      style,
      onPlaced,
      onInteractOutside,
      onCloseAutoFocus,
      onOpenAutoFocus,
      onFocusOutside,
      interactOutsideBehavior = "close",
      loop,
      trapFocus = true,
      isValidEvent: isValidEvent2 = () => false,
      customAnchor = null,
      isStatic = false,
      enabled,
      ref,
      tooltip = false,
      contentPointerEvents = "auto",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    {
      let content = function($$renderer3, { props: floatingProps, wrapperProps }) {
        if (restProps.forceMount && enabled) {
          $$renderer3.push("<!--[0-->");
          Scroll_lock($$renderer3, { preventScroll });
        } else if (!restProps.forceMount) {
          $$renderer3.push("<!--[1-->");
          Scroll_lock($$renderer3, { preventScroll });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          let focusScope = function($$renderer4, { props: focusScopeProps }) {
            Escape_layer($$renderer4, {
              onEscapeKeydown,
              escapeKeydownBehavior,
              enabled,
              ref,
              children: ($$renderer5) => {
                {
                  let children = function($$renderer6, { props: dismissibleProps }) {
                    Text_selection_layer($$renderer6, {
                      id,
                      preventOverflowTextSelection,
                      onPointerDown,
                      onPointerUp,
                      enabled,
                      ref,
                      children: ($$renderer7) => {
                        popper?.($$renderer7, {
                          props: mergeProps(restProps, floatingProps, dismissibleProps, focusScopeProps, { style: { pointerEvents: contentPointerEvents } }),
                          wrapperProps
                        });
                        $$renderer7.push(`<!---->`);
                      }
                    });
                  };
                  Dismissible_layer($$renderer5, {
                    id,
                    onInteractOutside,
                    onFocusOutside,
                    interactOutsideBehavior,
                    isValidEvent: isValidEvent2,
                    enabled,
                    ref,
                    children
                  });
                }
              }
            });
          };
          Focus_scope($$renderer3, {
            onOpenAutoFocus,
            onCloseAutoFocus,
            loop,
            enabled,
            trapFocus,
            forceMount: restProps.forceMount,
            ref,
            focusScope
          });
        }
        $$renderer3.push(`<!---->`);
      };
      Popper_content($$renderer2, {
        isStatic,
        id,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        avoidCollisions,
        collisionBoundary,
        collisionPadding,
        sticky,
        hideWhenDetached,
        updatePositionStrategy,
        strategy,
        dir,
        wrapperId,
        style,
        onPlaced,
        customAnchor,
        enabled,
        tooltip,
        content,
        $$slots: { content: true }
      });
    }
  });
}
function Popper_layer($$renderer, $$props) {
  let {
    popper,
    open,
    onEscapeKeydown,
    escapeKeydownBehavior,
    preventOverflowTextSelection,
    id,
    onPointerDown,
    onPointerUp,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    sticky,
    hideWhenDetached,
    updatePositionStrategy,
    strategy,
    dir,
    preventScroll,
    wrapperId,
    style,
    onPlaced,
    onInteractOutside,
    onCloseAutoFocus,
    onOpenAutoFocus,
    onFocusOutside,
    interactOutsideBehavior = "close",
    loop,
    trapFocus = true,
    isValidEvent: isValidEvent2 = () => false,
    customAnchor = null,
    isStatic = false,
    ref,
    shouldRender,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  if (shouldRender) {
    $$renderer.push("<!--[0-->");
    Popper_layer_inner($$renderer, spread_props([
      {
        popper,
        onEscapeKeydown,
        escapeKeydownBehavior,
        preventOverflowTextSelection,
        id,
        onPointerDown,
        onPointerUp,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        avoidCollisions,
        collisionBoundary,
        collisionPadding,
        sticky,
        hideWhenDetached,
        updatePositionStrategy,
        strategy,
        dir,
        preventScroll,
        wrapperId,
        style,
        onPlaced,
        customAnchor,
        isStatic,
        enabled: open,
        onInteractOutside,
        onCloseAutoFocus,
        onOpenAutoFocus,
        interactOutsideBehavior,
        loop,
        trapFocus,
        isValidEvent: isValidEvent2,
        onFocusOutside,
        forceMount: false,
        ref
      },
      restProps
    ]));
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function Popper_layer_force_mount($$renderer, $$props) {
  let {
    popper,
    onEscapeKeydown,
    escapeKeydownBehavior,
    preventOverflowTextSelection,
    id,
    onPointerDown,
    onPointerUp,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    avoidCollisions,
    collisionBoundary,
    collisionPadding,
    sticky,
    hideWhenDetached,
    updatePositionStrategy,
    strategy,
    dir,
    preventScroll,
    wrapperId,
    style,
    onPlaced,
    onInteractOutside,
    onCloseAutoFocus,
    onOpenAutoFocus,
    onFocusOutside,
    interactOutsideBehavior = "close",
    loop,
    trapFocus = true,
    isValidEvent: isValidEvent2 = () => false,
    customAnchor = null,
    isStatic = false,
    enabled,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  Popper_layer_inner($$renderer, spread_props([
    {
      popper,
      onEscapeKeydown,
      escapeKeydownBehavior,
      preventOverflowTextSelection,
      id,
      onPointerDown,
      onPointerUp,
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      updatePositionStrategy,
      strategy,
      dir,
      preventScroll,
      wrapperId,
      style,
      onPlaced,
      customAnchor,
      isStatic,
      enabled,
      onInteractOutside,
      onCloseAutoFocus,
      onOpenAutoFocus,
      interactOutsideBehavior,
      loop,
      trapFocus,
      isValidEvent: isValidEvent2,
      onFocusOutside
    },
    restProps,
    { forceMount: true }
  ]));
}
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let isInside = false;
  const length = polygon.length;
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] ?? [0, 0];
    const [xj, yj] = polygon[j] ?? [0, 0];
    const intersect = yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}
function isInsideRect(point, rect) {
  return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom;
}
function getSide(triggerRect, contentRect) {
  const triggerCenterX = triggerRect.left + triggerRect.width / 2;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  const contentCenterX = contentRect.left + contentRect.width / 2;
  const contentCenterY = contentRect.top + contentRect.height / 2;
  const deltaX = contentCenterX - triggerCenterX;
  const deltaY = contentCenterY - triggerCenterY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  }
  return deltaY > 0 ? "bottom" : "top";
}
class SafePolygon {
  #opts;
  #buffer;
  #transitIntentTimeout;
  // tracks the cursor position when leaving trigger or content
  #exitPoint = null;
  // tracks what we're moving toward: "content" when leaving trigger, "trigger" when leaving content
  #exitTarget = null;
  #transitTargets = [];
  #trackedTriggerNode = null;
  #leaveFallbackRafId = null;
  #transitIntentTimeoutId = null;
  #cancelLeaveFallback() {
    if (this.#leaveFallbackRafId !== null) {
      cancelAnimationFrame(this.#leaveFallbackRafId);
      this.#leaveFallbackRafId = null;
    }
  }
  #scheduleLeaveFallback() {
    this.#cancelLeaveFallback();
    this.#leaveFallbackRafId = requestAnimationFrame(() => {
      this.#leaveFallbackRafId = null;
      if (!this.#exitPoint || !this.#exitTarget) return;
      this.#clearTracking();
      this.#opts.onPointerExit();
    });
  }
  #cancelTransitIntentTimeout() {
    if (this.#transitIntentTimeoutId !== null) {
      clearTimeout(this.#transitIntentTimeoutId);
      this.#transitIntentTimeoutId = null;
    }
  }
  #scheduleTransitIntentTimeout() {
    if (this.#transitIntentTimeout === null) return;
    this.#cancelTransitIntentTimeout();
    this.#transitIntentTimeoutId = window.setTimeout(
      () => {
        this.#transitIntentTimeoutId = null;
        if (!this.#exitPoint || !this.#exitTarget) return;
        this.#clearTracking();
        this.#opts.onPointerExit();
      },
      this.#transitIntentTimeout
    );
  }
  constructor(opts) {
    this.#opts = opts;
    this.#buffer = opts.buffer ?? 1;
    const transitIntentTimeout = opts.transitIntentTimeout;
    this.#transitIntentTimeout = typeof transitIntentTimeout === "number" && transitIntentTimeout > 0 ? transitIntentTimeout : null;
    watch([opts.triggerNode, opts.contentNode, opts.enabled], ([triggerNode, contentNode, enabled]) => {
      if (!triggerNode || !contentNode || !enabled) {
        this.#trackedTriggerNode = null;
        this.#clearTracking();
        return;
      }
      if (this.#trackedTriggerNode && this.#trackedTriggerNode !== triggerNode) {
        this.#clearTracking();
      }
      this.#trackedTriggerNode = triggerNode;
      const doc = getDocument(triggerNode);
      const handlePointerMove = (e) => {
        this.#onPointerMove([e.clientX, e.clientY], triggerNode, contentNode);
      };
      const handleTriggerLeave = (e) => {
        const target = e.relatedTarget;
        if (isElement(target) && contentNode.contains(target)) {
          return;
        }
        const ignoredTargets = this.#opts.ignoredTargets?.() ?? [];
        if (isElement(target) && ignoredTargets.some((n) => n === target || n.contains(target))) {
          return;
        }
        this.#transitTargets = isElement(target) && ignoredTargets.length > 0 ? ignoredTargets.filter((n) => target.contains(n)) : [];
        this.#exitPoint = [e.clientX, e.clientY];
        this.#exitTarget = "content";
        this.#scheduleLeaveFallback();
      };
      const handleTriggerEnter = () => {
        this.#clearTracking();
      };
      const handleContentEnter = () => {
        this.#clearTracking();
      };
      const handleContentLeave = (e) => {
        const target = e.relatedTarget;
        if (isElement(target) && triggerNode.contains(target)) {
          return;
        }
        this.#exitPoint = [e.clientX, e.clientY];
        this.#exitTarget = "trigger";
        this.#scheduleLeaveFallback();
      };
      return [
        on(doc, "pointermove", handlePointerMove),
        on(triggerNode, "pointerleave", handleTriggerLeave),
        on(triggerNode, "pointerenter", handleTriggerEnter),
        on(contentNode, "pointerenter", handleContentEnter),
        on(contentNode, "pointerleave", handleContentLeave)
      ].reduce(
        (acc, cleanup) => () => {
          acc();
          cleanup();
        },
        () => {
        }
      );
    });
  }
  #onPointerMove(clientPoint, triggerNode, contentNode) {
    if (!this.#exitPoint || !this.#exitTarget) return;
    this.#cancelLeaveFallback();
    this.#scheduleTransitIntentTimeout();
    const triggerRect = triggerNode.getBoundingClientRect();
    const contentRect = contentNode.getBoundingClientRect();
    if (this.#exitTarget === "content" && isInsideRect(clientPoint, contentRect)) {
      this.#clearTracking();
      return;
    }
    if (this.#exitTarget === "trigger" && isInsideRect(clientPoint, triggerRect)) {
      this.#clearTracking();
      return;
    }
    if (this.#exitTarget === "content" && this.#transitTargets.length > 0) {
      for (const transitTarget of this.#transitTargets) {
        const transitRect = transitTarget.getBoundingClientRect();
        if (isInsideRect(clientPoint, transitRect)) return;
        const transitSide = getSide(triggerRect, transitRect);
        const transitCorridor = this.#getCorridorPolygon(triggerRect, transitRect, transitSide);
        if (transitCorridor && isPointInPolygon(clientPoint, transitCorridor)) return;
      }
    }
    const side = getSide(triggerRect, contentRect);
    const corridorPoly = this.#getCorridorPolygon(triggerRect, contentRect, side);
    if (corridorPoly && isPointInPolygon(clientPoint, corridorPoly)) {
      return;
    }
    const targetRect = this.#exitTarget === "content" ? contentRect : triggerRect;
    const safePoly = this.#getSafePolygon(this.#exitPoint, targetRect, side, this.#exitTarget);
    if (isPointInPolygon(clientPoint, safePoly)) {
      return;
    }
    this.#clearTracking();
    this.#opts.onPointerExit();
  }
  #clearTracking() {
    this.#exitPoint = null;
    this.#exitTarget = null;
    this.#transitTargets = [];
    this.#cancelLeaveFallback();
    this.#cancelTransitIntentTimeout();
  }
  /**
   * Creates a rectangular corridor between trigger and content
   * This prevents closing when cursor is in the gap between them
   */
  #getCorridorPolygon(triggerRect, contentRect, side) {
    const buffer = this.#buffer;
    switch (side) {
      case "top":
        return [
          [
            Math.min(triggerRect.left, contentRect.left) - buffer,
            triggerRect.top
          ],
          [
            Math.min(triggerRect.left, contentRect.left) - buffer,
            contentRect.bottom
          ],
          [
            Math.max(triggerRect.right, contentRect.right) + buffer,
            contentRect.bottom
          ],
          [
            Math.max(triggerRect.right, contentRect.right) + buffer,
            triggerRect.top
          ]
        ];
      case "bottom":
        return [
          [
            Math.min(triggerRect.left, contentRect.left) - buffer,
            triggerRect.bottom
          ],
          [
            Math.min(triggerRect.left, contentRect.left) - buffer,
            contentRect.top
          ],
          [
            Math.max(triggerRect.right, contentRect.right) + buffer,
            contentRect.top
          ],
          [
            Math.max(triggerRect.right, contentRect.right) + buffer,
            triggerRect.bottom
          ]
        ];
      case "left":
        return [
          [
            triggerRect.left,
            Math.min(triggerRect.top, contentRect.top) - buffer
          ],
          [
            contentRect.right,
            Math.min(triggerRect.top, contentRect.top) - buffer
          ],
          [
            contentRect.right,
            Math.max(triggerRect.bottom, contentRect.bottom) + buffer
          ],
          [
            triggerRect.left,
            Math.max(triggerRect.bottom, contentRect.bottom) + buffer
          ]
        ];
      case "right":
        return [
          [
            triggerRect.right,
            Math.min(triggerRect.top, contentRect.top) - buffer
          ],
          [
            contentRect.left,
            Math.min(triggerRect.top, contentRect.top) - buffer
          ],
          [
            contentRect.left,
            Math.max(triggerRect.bottom, contentRect.bottom) + buffer
          ],
          [
            triggerRect.right,
            Math.max(triggerRect.bottom, contentRect.bottom) + buffer
          ]
        ];
    }
  }
  /**
   * Creates a triangular/trapezoidal safe zone from the exit point to the target
   */
  #getSafePolygon(exitPoint, targetRect, side, exitTarget) {
    const buffer = this.#buffer * 4;
    const [x, y] = exitPoint;
    const effectiveSide = exitTarget === "trigger" ? this.#flipSide(side) : side;
    switch (effectiveSide) {
      case "top":
        return [
          [x - buffer, y + buffer],
          [x + buffer, y + buffer],
          [targetRect.right + buffer, targetRect.bottom],
          [targetRect.right + buffer, targetRect.top],
          [targetRect.left - buffer, targetRect.top],
          [targetRect.left - buffer, targetRect.bottom]
        ];
      case "bottom":
        return [
          [x - buffer, y - buffer],
          [x + buffer, y - buffer],
          [targetRect.right + buffer, targetRect.top],
          [targetRect.right + buffer, targetRect.bottom],
          [targetRect.left - buffer, targetRect.bottom],
          [targetRect.left - buffer, targetRect.top]
        ];
      case "left":
        return [
          [x + buffer, y - buffer],
          [x + buffer, y + buffer],
          [targetRect.right, targetRect.bottom + buffer],
          [targetRect.left, targetRect.bottom + buffer],
          [targetRect.left, targetRect.top - buffer],
          [targetRect.right, targetRect.top - buffer]
        ];
      case "right":
        return [
          [x - buffer, y - buffer],
          [x - buffer, y + buffer],
          [targetRect.left, targetRect.bottom + buffer],
          [targetRect.right, targetRect.bottom + buffer],
          [targetRect.right, targetRect.top - buffer],
          [targetRect.left, targetRect.top - buffer]
        ];
    }
  }
  #flipSide(side) {
    switch (side) {
      case "top":
        return "bottom";
      case "bottom":
        return "top";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  }
}
class TimeoutFn {
  #interval;
  #cb;
  #timer = null;
  constructor(cb, interval) {
    this.#cb = cb;
    this.#interval = interval;
    this.stop = this.stop.bind(this);
    this.start = this.start.bind(this);
    onDestroyEffect(this.stop);
  }
  #clear() {
    if (this.#timer !== null) {
      window.clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
  stop() {
    this.#clear();
  }
  start(...args) {
    this.#clear();
    this.#timer = window.setTimeout(() => {
      this.#timer = null;
      this.#cb(...args);
    }, this.#interval);
  }
}
const tooltipAttrs = createBitsAttrs({ component: "tooltip", parts: ["content", "trigger"] });
const TooltipProviderContext = new Context("Tooltip.Provider");
const TooltipRootContext = new Context("Tooltip.Root");
class TooltipTriggerRegistryState {
  triggers = /* @__PURE__ */ new Map();
  activeTriggerId = null;
  #activeTriggerNode = derived(() => {
    const activeTriggerId = this.activeTriggerId;
    if (activeTriggerId === null) return null;
    return this.triggers.get(activeTriggerId)?.node ?? null;
  });
  get activeTriggerNode() {
    return this.#activeTriggerNode();
  }
  set activeTriggerNode($$value) {
    return this.#activeTriggerNode($$value);
  }
  #activePayload = derived(() => {
    const activeTriggerId = this.activeTriggerId;
    if (activeTriggerId === null) return null;
    return this.triggers.get(activeTriggerId)?.payload ?? null;
  });
  get activePayload() {
    return this.#activePayload();
  }
  set activePayload($$value) {
    return this.#activePayload($$value);
  }
  register = (record) => {
    const next = new Map(this.triggers);
    next.set(record.id, record);
    this.triggers = next;
    this.#coerceActiveTrigger();
  };
  update = (record) => {
    const next = new Map(this.triggers);
    next.set(record.id, record);
    this.triggers = next;
    this.#coerceActiveTrigger();
  };
  unregister = (id) => {
    if (!this.triggers.has(id)) return;
    const next = new Map(this.triggers);
    next.delete(id);
    this.triggers = next;
    if (this.activeTriggerId === id) {
      this.activeTriggerId = null;
    }
  };
  setActiveTrigger = (id) => {
    if (id === null) {
      this.activeTriggerId = null;
      return;
    }
    if (!this.triggers.has(id)) {
      this.activeTriggerId = null;
      return;
    }
    this.activeTriggerId = id;
  };
  get = (id) => {
    return this.triggers.get(id);
  };
  has = (id) => {
    return this.triggers.has(id);
  };
  getFirstTriggerId = () => {
    const firstEntry = this.triggers.entries().next();
    if (firstEntry.done) return null;
    return firstEntry.value[0];
  };
  #coerceActiveTrigger = () => {
    const activeTriggerId = this.activeTriggerId;
    if (activeTriggerId === null) return;
    if (!this.triggers.has(activeTriggerId)) {
      this.activeTriggerId = null;
    }
  };
}
class TooltipProviderState {
  static create(opts) {
    return TooltipProviderContext.set(new TooltipProviderState(opts));
  }
  opts;
  isOpenDelayed = true;
  isPointerInTransit = simpleBox(false);
  #timerFn;
  #openTooltip = null;
  constructor(opts) {
    this.opts = opts;
    this.#timerFn = new TimeoutFn(
      () => {
        this.isOpenDelayed = true;
      },
      this.opts.skipDelayDuration.current
    );
  }
  #startTimer = () => {
    const skipDuration = this.opts.skipDelayDuration.current;
    if (skipDuration === 0) {
      this.isOpenDelayed = true;
      return;
    } else {
      this.#timerFn.start();
    }
  };
  #clearTimer = () => {
    this.#timerFn.stop();
  };
  onOpen = (tooltip) => {
    if (this.#openTooltip && this.#openTooltip !== tooltip) {
      this.#openTooltip.handleClose();
    }
    this.#clearTimer();
    this.isOpenDelayed = false;
    this.#openTooltip = tooltip;
  };
  onClose = (tooltip) => {
    if (this.#openTooltip === tooltip) {
      this.#openTooltip = null;
    }
    this.#startTimer();
  };
  isTooltipOpen = (tooltip) => {
    return this.#openTooltip === tooltip;
  };
}
class TooltipRootState {
  static create(opts) {
    return TooltipRootContext.set(new TooltipRootState(opts, TooltipProviderContext.get()));
  }
  opts;
  provider;
  #delayDuration = derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
  get delayDuration() {
    return this.#delayDuration();
  }
  set delayDuration($$value) {
    return this.#delayDuration($$value);
  }
  #disableHoverableContent = derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
  get disableHoverableContent() {
    return this.#disableHoverableContent();
  }
  set disableHoverableContent($$value) {
    return this.#disableHoverableContent($$value);
  }
  #disableCloseOnTriggerClick = derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
  get disableCloseOnTriggerClick() {
    return this.#disableCloseOnTriggerClick();
  }
  set disableCloseOnTriggerClick($$value) {
    return this.#disableCloseOnTriggerClick($$value);
  }
  #disabled = derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
  get disabled() {
    return this.#disabled();
  }
  set disabled($$value) {
    return this.#disabled($$value);
  }
  #ignoreNonKeyboardFocus = derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
  get ignoreNonKeyboardFocus() {
    return this.#ignoreNonKeyboardFocus();
  }
  set ignoreNonKeyboardFocus($$value) {
    return this.#ignoreNonKeyboardFocus($$value);
  }
  registry;
  tether;
  contentNode = null;
  contentPresence;
  #wasOpenDelayed = false;
  #timerFn;
  #stateAttr = derived(() => {
    if (!this.opts.open.current) return "closed";
    return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
  });
  get stateAttr() {
    return this.#stateAttr();
  }
  set stateAttr($$value) {
    return this.#stateAttr($$value);
  }
  constructor(opts, provider) {
    this.opts = opts;
    this.provider = provider;
    this.tether = opts.tether.current?.state ?? null;
    this.registry = this.tether?.registry ?? new TooltipTriggerRegistryState();
    this.#timerFn = new TimeoutFn(
      () => {
        this.#wasOpenDelayed = true;
        this.opts.open.current = true;
      },
      this.delayDuration ?? 0
    );
    if (this.tether) {
      this.tether.root = this;
    }
    this.contentPresence = new PresenceManager({
      open: this.opts.open,
      ref: boxWith(() => this.contentNode),
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
    watch(() => this.delayDuration, () => {
      if (this.delayDuration === void 0) return;
      this.#timerFn = new TimeoutFn(
        () => {
          this.#wasOpenDelayed = true;
          this.opts.open.current = true;
        },
        this.delayDuration
      );
    });
    watch(
      () => this.opts.open.current,
      (isOpen) => {
        if (isOpen) {
          this.ensureActiveTrigger();
          this.provider.onOpen(this);
        } else {
          this.provider.onClose(this);
        }
      },
      { lazy: true }
    );
    watch(() => this.opts.triggerId.current, (triggerId) => {
      if (triggerId === this.registry.activeTriggerId) return;
      this.registry.setActiveTrigger(triggerId);
    });
    watch(() => this.registry.activeTriggerId, (activeTriggerId) => {
      if (this.opts.triggerId.current === activeTriggerId) return;
      this.opts.triggerId.current = activeTriggerId;
    });
  }
  handleOpen = () => {
    this.#timerFn.stop();
    this.#wasOpenDelayed = false;
    this.ensureActiveTrigger();
    this.opts.open.current = true;
  };
  handleClose = () => {
    this.#timerFn.stop();
    this.opts.open.current = false;
  };
  #handleDelayedOpen = () => {
    this.#timerFn.stop();
    const shouldSkipDelay = !this.provider.isOpenDelayed;
    const delayDuration = this.delayDuration ?? 0;
    if (shouldSkipDelay || delayDuration === 0) {
      this.#wasOpenDelayed = false;
      this.opts.open.current = true;
    } else {
      this.#timerFn.start();
    }
  };
  onTriggerEnter = (triggerId) => {
    this.setActiveTrigger(triggerId);
    this.#handleDelayedOpen();
  };
  onTriggerLeave = () => {
    if (this.disableHoverableContent) {
      this.handleClose();
    } else {
      this.#timerFn.stop();
    }
  };
  ensureActiveTrigger = () => {
    if (this.registry.activeTriggerId !== null && this.registry.has(this.registry.activeTriggerId)) {
      return;
    }
    if (this.opts.triggerId.current !== null && this.registry.has(this.opts.triggerId.current)) {
      this.registry.setActiveTrigger(this.opts.triggerId.current);
      return;
    }
    const firstTriggerId = this.registry.getFirstTriggerId();
    this.registry.setActiveTrigger(firstTriggerId);
  };
  setActiveTrigger = (triggerId) => {
    this.registry.setActiveTrigger(triggerId);
  };
  registerTrigger = (trigger) => {
    this.registry.register(trigger);
    if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open.current) {
      this.handleClose();
    }
  };
  updateTrigger = (trigger) => {
    this.registry.update(trigger);
    if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open.current) {
      this.handleClose();
    }
  };
  unregisterTrigger = (id) => {
    const isActive = this.registry.activeTriggerId === id;
    this.registry.unregister(id);
    if (isActive && this.opts.open.current) {
      this.handleClose();
    }
  };
  isActiveTrigger = (triggerId) => {
    return this.registry.activeTriggerId === triggerId;
  };
  get triggerNode() {
    return this.registry.activeTriggerNode;
  }
  get activePayload() {
    return this.registry.activePayload;
  }
  get activeTriggerId() {
    return this.registry.activeTriggerId;
  }
}
class TooltipTriggerState {
  static create(opts) {
    if (opts.tether.current) {
      return new TooltipTriggerState(opts, null, opts.tether.current.state);
    }
    return new TooltipTriggerState(opts, TooltipRootContext.get(), null);
  }
  opts;
  root;
  tether;
  attachment;
  #isPointerDown = simpleBox(false);
  #hasPointerMoveOpened = false;
  domContext;
  #transitCheckTimeout = null;
  #mounted = false;
  #lastRegisteredId = null;
  constructor(opts, root, tether) {
    this.opts = opts;
    this.root = root;
    this.tether = tether;
    this.domContext = new DOMContext(opts.ref);
    this.attachment = attachRef(this.opts.ref, (v) => this.#register(v));
    watch(() => this.opts.id.current, () => {
      this.#register(this.opts.ref.current);
    });
    watch(() => this.opts.payload.current, () => {
      this.#register(this.opts.ref.current);
    });
    watch(() => this.opts.disabled.current, () => {
      this.#register(this.opts.ref.current);
    });
  }
  #getRoot = () => {
    return this.tether?.root ?? this.root;
  };
  #isDisabled = () => {
    const root = this.#getRoot();
    return this.opts.disabled.current || Boolean(root?.disabled);
  };
  #register = (node) => {
    if (!this.#mounted) return;
    const id = this.opts.id.current;
    const payload = this.opts.payload.current;
    const disabled = this.opts.disabled.current;
    if (this.#lastRegisteredId && this.#lastRegisteredId !== id) {
      const root2 = this.#getRoot();
      if (this.tether) {
        this.tether.registry.unregister(this.#lastRegisteredId);
      } else {
        root2?.unregisterTrigger(this.#lastRegisteredId);
      }
    }
    const triggerRecord = { id, node, payload, disabled };
    const root = this.#getRoot();
    if (this.tether) {
      if (this.tether.registry.has(id)) {
        this.tether.registry.update(triggerRecord);
      } else {
        this.tether.registry.register(triggerRecord);
      }
      if (disabled && this.tether.registry.activeTriggerId === id && root?.opts.open.current) {
        root.handleClose();
      }
    } else {
      if (root?.registry.has(id)) {
        root.updateTrigger(triggerRecord);
      } else {
        root?.registerTrigger(triggerRecord);
      }
    }
    this.#lastRegisteredId = id;
  };
  #clearTransitCheck = () => {
    if (this.#transitCheckTimeout !== null) {
      clearTimeout(this.#transitCheckTimeout);
      this.#transitCheckTimeout = null;
    }
  };
  handlePointerUp = () => {
    this.#isPointerDown.current = false;
  };
  #onpointerup = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = false;
  };
  #onpointerdown = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = true;
    this.domContext.getDocument().addEventListener(
      "pointerup",
      () => {
        this.handlePointerUp();
      },
      { once: true }
    );
  };
  #onpointerenter = (e) => {
    const root = this.#getRoot();
    if (!root) return;
    if (this.#isDisabled()) {
      if (root.opts.open.current) {
        root.handleClose();
      }
      return;
    }
    if (e.pointerType === "touch") return;
    if (root.provider.isPointerInTransit.current) {
      this.#clearTransitCheck();
      this.#transitCheckTimeout = window.setTimeout(
        () => {
          if (root.provider.isPointerInTransit.current) {
            root.provider.isPointerInTransit.current = false;
            root.onTriggerEnter(this.opts.id.current);
            this.#hasPointerMoveOpened = true;
          }
        },
        250
      );
      return;
    }
    root.onTriggerEnter(this.opts.id.current);
    this.#hasPointerMoveOpened = true;
  };
  #onpointermove = (e) => {
    const root = this.#getRoot();
    if (!root) return;
    if (this.#isDisabled()) {
      if (root.opts.open.current) {
        root.handleClose();
      }
      return;
    }
    if (e.pointerType === "touch") return;
    if (this.#hasPointerMoveOpened) return;
    this.#clearTransitCheck();
    root.provider.isPointerInTransit.current = false;
    root.onTriggerEnter(this.opts.id.current);
    this.#hasPointerMoveOpened = true;
  };
  #onpointerleave = (e) => {
    const root = this.#getRoot();
    if (!root) return;
    if (this.#isDisabled()) return;
    this.#clearTransitCheck();
    if (!root.isActiveTrigger(this.opts.id.current)) {
      this.#hasPointerMoveOpened = false;
      return;
    }
    const relatedTarget = e.relatedTarget;
    if (isElement(relatedTarget)) {
      for (const record of root.registry.triggers.values()) {
        if (record.node !== relatedTarget) continue;
        if (root.provider.opts.skipDelayDuration.current > 0) {
          this.#hasPointerMoveOpened = false;
          return;
        }
        root.handleClose();
        this.#hasPointerMoveOpened = false;
        return;
      }
    }
    root.onTriggerLeave();
    this.#hasPointerMoveOpened = false;
  };
  #onfocus = (e) => {
    const root = this.#getRoot();
    if (!root) return;
    if (this.#isPointerDown.current) return;
    if (this.#isDisabled()) {
      if (root.opts.open.current) {
        root.handleClose();
      }
      return;
    }
    if (root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
    root.setActiveTrigger(this.opts.id.current);
    root.handleOpen();
  };
  #onblur = () => {
    const root = this.#getRoot();
    if (!root || this.#isDisabled()) return;
    root.handleClose();
  };
  #onclick = () => {
    const root = this.#getRoot();
    if (!root || root.disableCloseOnTriggerClick || this.#isDisabled()) return;
    root.handleClose();
  };
  #props = derived(() => {
    const root = this.#getRoot();
    const isOpenForTrigger = Boolean(root?.opts.open.current && root.isActiveTrigger(this.opts.id.current));
    const isDisabled = this.#isDisabled();
    return {
      id: this.opts.id.current,
      "aria-describedby": isOpenForTrigger ? root?.contentNode?.id : void 0,
      "data-state": isOpenForTrigger ? root?.stateAttr : "closed",
      "data-disabled": boolToEmptyStrOrUndef(isDisabled),
      "data-delay-duration": `${root?.delayDuration ?? 0}`,
      [tooltipAttrs.trigger]: "",
      tabindex: isDisabled ? void 0 : this.opts.tabindex.current,
      disabled: this.opts.disabled.current,
      onpointerup: this.#onpointerup,
      onpointerdown: this.#onpointerdown,
      onpointerenter: this.#onpointerenter,
      onpointermove: this.#onpointermove,
      onpointerleave: this.#onpointerleave,
      onfocus: this.#onfocus,
      onblur: this.#onblur,
      onclick: this.#onclick,
      ...this.attachment
    };
  });
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TooltipContentState {
  static create(opts) {
    return new TooltipContentState(opts, TooltipRootContext.get());
  }
  opts;
  root;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
    new SafePolygon({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
      transitIntentTimeout: 180,
      ignoredTargets: () => {
        if (this.root.provider.opts.skipDelayDuration.current === 0) return [];
        const nodes = [];
        const activeTriggerNode = this.root.triggerNode;
        for (const record of this.root.registry.triggers.values()) {
          if (record.node && record.node !== activeTriggerNode) {
            nodes.push(record.node);
          }
        }
        return nodes;
      },
      onPointerExit: () => {
        if (this.root.provider.isTooltipOpen(this.root)) {
          this.root.handleClose();
        }
      }
    });
  }
  onInteractOutside = (e) => {
    if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    "data-state": this.root.stateAttr,
    "data-disabled": boolToEmptyStrOrUndef(this.root.disabled),
    style: { outline: "none" },
    [tooltipAttrs.content]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
function Tooltip$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      open = false,
      triggerId = null,
      onOpenChange = noop,
      onOpenChangeComplete = noop,
      disabled,
      delayDuration,
      disableCloseOnTriggerClick,
      disableHoverableContent,
      ignoreNonKeyboardFocus,
      tether,
      children
    } = $$props;
    const rootState = TooltipRootState.create({
      open: boxWith(() => open, (v) => {
        open = v;
        onOpenChange(v);
      }),
      triggerId: boxWith(() => triggerId, (v) => {
        triggerId = v;
      }),
      delayDuration: boxWith(() => delayDuration),
      disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
      disableHoverableContent: boxWith(() => disableHoverableContent),
      ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
      disabled: boxWith(() => disabled),
      onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
      tether: boxWith(() => tether)
    });
    Floating_layer($$renderer2, {
      tooltip: true,
      children: ($$renderer3) => {
        children?.($$renderer3, {
          open: rootState.opts.open.current,
          triggerId: rootState.activeTriggerId,
          payload: rootState.activePayload
        });
        $$renderer3.push(`<!---->`);
      }
    });
    bind_props($$props, { open, triggerId });
  });
}
function Tooltip_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      id = createId(uid),
      ref = null,
      side = "top",
      sideOffset = 0,
      align = "center",
      avoidCollisions = true,
      arrowPadding = 0,
      sticky = "partial",
      strategy,
      hideWhenDetached = false,
      customAnchor,
      collisionPadding = 0,
      onInteractOutside = noop,
      onEscapeKeydown = noop,
      forceMount = false,
      style,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = TooltipContentState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      onInteractOutside: boxWith(() => onInteractOutside),
      onEscapeKeydown: boxWith(() => onEscapeKeydown)
    });
    const floatingProps = derived(() => ({
      side,
      sideOffset,
      align,
      avoidCollisions,
      arrowPadding,
      sticky,
      hideWhenDetached,
      collisionPadding,
      strategy,
      customAnchor: customAnchor ?? contentState.root.triggerNode
    }));
    const mergedProps = derived(() => mergeProps(restProps, floatingProps(), contentState.props));
    if (forceMount) {
      $$renderer2.push("<!--[0-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer_force_mount($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            enabled: contentState.root.opts.open.current,
            id,
            trapFocus: false,
            loop: false,
            preventScroll: false,
            forceMount: true,
            ref: contentState.opts.ref,
            tooltip: true,
            shouldRender: contentState.shouldRender,
            contentPointerEvents: contentState.root.disableHoverableContent ? "none" : "auto",
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$renderer2.push("<!--[1-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            open: contentState.root.opts.open.current,
            id,
            trapFocus: false,
            loop: false,
            preventScroll: false,
            forceMount: false,
            ref: contentState.opts.ref,
            tooltip: true,
            shouldRender: contentState.shouldRender,
            contentPointerEvents: contentState.root.disableHoverableContent ? "none" : "auto",
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Tooltip_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      children,
      child,
      id = createId(uid),
      disabled = false,
      payload,
      tether,
      type = "button",
      tabindex = 0,
      ref = null,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = TooltipTriggerState.create({
      id: boxWith(() => id),
      disabled: boxWith(() => disabled ?? false),
      tabindex: boxWith(() => tabindex ?? 0),
      payload: boxWith(() => payload),
      tether: boxWith(() => tether),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Tooltip_arrow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { ref = null, $$slots, $$events, ...restProps } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Floating_layer_arrow($$renderer3, spread_props([
        restProps,
        {
          get ref() {
            return ref;
          },
          set ref($$value) {
            ref = $$value;
            $$settled = false;
          }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref });
  });
}
function Tooltip_provider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      children,
      delayDuration = 700,
      disableCloseOnTriggerClick = false,
      disableHoverableContent = false,
      disabled = false,
      ignoreNonKeyboardFocus = false,
      skipDelayDuration = 300
    } = $$props;
    TooltipProviderState.create({
      delayDuration: boxWith(() => delayDuration),
      disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
      disableHoverableContent: boxWith(() => disableHoverableContent),
      disabled: boxWith(() => disabled),
      ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
      skipDelayDuration: boxWith(() => skipDelayDuration)
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function TooltipContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className,
      sideOffset = 4,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    if (Portal) {
      $$renderer2.push("<!--[-->");
      Portal($$renderer2, {
        children: ($$renderer3) => {
          if (Tooltip_content) {
            $$renderer3.push("<!--[-->");
            Tooltip_content($$renderer3, spread_props([
              {
                sideOffset,
                class: cn("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance", className)
              },
              restProps,
              {
                children: ($$renderer4) => {
                  children?.($$renderer4);
                  $$renderer4.push(`<!----> `);
                  if (Tooltip_arrow) {
                    $$renderer4.push("<!--[-->");
                    Tooltip_arrow($$renderer4, { class: "fill-foreground" });
                    $$renderer4.push("<!--]-->");
                  } else {
                    $$renderer4.push("<!--[!-->");
                    $$renderer4.push("<!--]-->");
                  }
                },
                $$slots: { default: true }
              }
            ]));
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
  });
}
const Tooltip = Tooltip$1;
const TooltipTrigger = Tooltip_trigger;
const TooltipProvider = Tooltip_provider;
function SidebarMenuButton($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      asChild = false,
      class: className = "",
      isActive = false,
      size: size2 = "default",
      tooltip,
      children,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const { isMobile, state: state2 } = getContext(SIDEBAR_CONTEXT);
    const base = "peer/menu-button ring-sidebar-ring flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0";
    const sizeClasses = {
      default: "h-8 text-sm",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    };
    const classes = () => {
      const activeClasses = isActive ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "";
      return cn(base, sizeClasses[size2], activeClasses, className);
    };
    if (tooltip) {
      $$renderer2.push("<!--[0-->");
      Tooltip($$renderer2, {
        disabled: store_get($$store_subs ??= {}, "$state", state2) !== "collapsed" || store_get($$store_subs ??= {}, "$isMobile", isMobile),
        children: ($$renderer3) => {
          {
            let child = function($$renderer4, { props: triggerProps }) {
              if (asChild) {
                $$renderer4.push("<!--[0-->");
                children?.($$renderer4, {
                  class: classes(),
                  "data-slot": "sidebar-menu-button",
                  "data-sidebar": "menu-button",
                  "data-size": size2,
                  "data-active": isActive,
                  ...rest,
                  ...triggerProps
                });
                $$renderer4.push(`<!---->`);
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<button${attributes({
                  class: clsx(classes()),
                  type: "button",
                  "data-slot": "sidebar-menu-button",
                  "data-sidebar": "menu-button",
                  "data-size": size2,
                  "data-active": isActive,
                  ...rest,
                  ...triggerProps
                })}>`);
                children?.($$renderer4, {});
                $$renderer4.push(`<!----></button>`);
              }
              $$renderer4.push(`<!--]-->`);
            };
            TooltipTrigger($$renderer3, { child, $$slots: { child: true } });
          }
          $$renderer3.push(`<!----> `);
          TooltipContent($$renderer3, {
            side: "right",
            align: "center",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(tooltip)}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      if (asChild) {
        $$renderer2.push("<!--[0-->");
        children?.($$renderer2, {
          class: classes(),
          "data-slot": "sidebar-menu-button",
          "data-sidebar": "menu-button",
          "data-size": size2,
          "data-active": isActive,
          ...rest
        });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<button${attributes({
          class: clsx(classes()),
          type: "button",
          "data-slot": "sidebar-menu-button",
          "data-sidebar": "menu-button",
          "data-size": size2,
          "data-active": isActive,
          ...rest
        })}>`);
        children?.($$renderer2, {});
        $$renderer2.push(`<!----></button>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SidebarMenuItem($$renderer, $$props) {
  $$renderer.push(`<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></li>`);
}
function SidebarProvider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { defaultOpen = true, class: className = "", children } = $$props;
    const initialOpen = () => {
      if (typeof document === "undefined") return defaultOpen;
      const hasCookie = document.cookie.includes(`${SIDEBAR_COOKIE_NAME}=false`);
      return hasCookie ? false : defaultOpen;
    };
    const open = writable(initialOpen());
    const openMobile = writable(false);
    const isMobile = readable(false, (set2) => {
      if (typeof window === "undefined") {
        return () => {
        };
      }
      const media = window.matchMedia("(max-width: 768px)");
      const update2 = () => set2(media.matches);
      update2();
      media.addEventListener("change", update2);
      return () => media.removeEventListener("change", update2);
    });
    const state2 = derived$1(open, ($open) => $open ? "expanded" : "collapsed");
    const setOpen = (value) => {
      open.set(value);
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    };
    const setOpenMobile = (value) => {
      openMobile.set(value);
    };
    const toggleSidebar = () => {
      if (store_get($$store_subs ??= {}, "$isMobile", isMobile)) {
        setOpenMobile(!store_get($$store_subs ??= {}, "$openMobile", openMobile));
      } else {
        setOpen(!store_get($$store_subs ??= {}, "$open", open));
      }
    };
    const context = {
      state: state2,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    };
    setContext(SIDEBAR_CONTEXT, context);
    TooltipProvider($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div data-slot="sidebar-wrapper"${attr_style(`--sidebar-width: ${SIDEBAR_WIDTH}; --sidebar-width-icon: ${SIDEBAR_WIDTH_ICON};`)}${attr_class(clsx(cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)))}>`);
        children?.($$renderer3);
        $$renderer3.push(`<!----></div>`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size2 = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size2,
        height: size2,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size2) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size: size2,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
function Book_open($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 7v14" }],
    [
      "path",
      {
        "d": "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "book-open" },
    $$sanitized_props,
    {
      /**
       * @component @name BookOpen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgN3YxNCIgLz4KICA8cGF0aCBkPSJNMyAxOGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMWg1YTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxIDQtNGg1YTEgMSAwIDAgMSAxIDF2MTNhMSAxIDAgMCAxLTEgMWgtNmEzIDMgMCAwIDAtMyAzIDMgMyAwIDAgMC0zLTN6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-open
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevrons_up_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m7 15 5 5 5-5" }],
    ["path", { "d": "m7 9 5-5 5 5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chevrons-up-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronsUpDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNyAxNSA1IDUgNS01IiAvPgogIDxwYXRoIGQ9Im03IDkgNS01IDUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevrons-up-down
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle_alert($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Copy($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Eye_off($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      }
    ],
    ["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    [
      "path",
      {
        "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      }
    ],
    ["path", { "d": "m2 2 20 20" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye-off" },
    $$sanitized_props,
    {
      /**
       * @component @name EyeOff
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuNzMzIDUuMDc2YTEwLjc0NCAxMC43NDQgMCAwIDEgMTEuMjA1IDYuNTc1IDEgMSAwIDAgMSAwIC42OTYgMTAuNzQ3IDEwLjc0NyAwIDAgMS0xLjQ0NCAyLjQ5IiAvPgogIDxwYXRoIGQ9Ik0xNC4wODQgMTQuMTU4YTMgMyAwIDAgMS00LjI0Mi00LjI0MiIgLz4KICA8cGF0aCBkPSJNMTcuNDc5IDE3LjQ5OWExMC43NSAxMC43NSAwIDAgMS0xNS40MTctNS4xNTEgMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSA0LjQ0Ni01LjE0MyIgLz4KICA8cGF0aCBkPSJtMiAyIDIwIDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye-off
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Eye($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "eye" },
    $$sanitized_props,
    {
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Folder_git_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"
      }
    ],
    ["circle", { "cx": "13", "cy": "12", "r": "2" }],
    ["path", { "d": "M18 19c-2.8 0-5-2.2-5-5v8" }],
    ["circle", { "cx": "20", "cy": "19", "r": "2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "folder-git-2" },
    $$sanitized_props,
    {
      /**
       * @component @name FolderGit2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMEg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDMuOWEyIDIgMCAwIDEgMS42OS45bC44MSAxLjJhMiAyIDAgMCAwIDEuNjcuOUgyMGEyIDIgMCAwIDEgMiAydjUiIC8+CiAgPGNpcmNsZSBjeD0iMTMiIGN5PSIxMiIgcj0iMiIgLz4KICA8cGF0aCBkPSJNMTggMTljLTIuOCAwLTUtMi4yLTUtNXY4IiAvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iMTkiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/folder-git-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Folder($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "folder" },
    $$sanitized_props,
    {
      /**
       * @component @name Folder
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMjBhMiAyIDAgMCAwIDItMlY4YTIgMiAwIDAgMC0yLTJoLTcuOWEyIDIgMCAwIDEtMS42OS0uOUw5LjYgMy45QTIgMiAwIDAgMCA3LjkzIDNINGEyIDIgMCAwIDAtMiAydjEzYTIgMiAwIDAgMCAyIDJaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/folder
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Layout_grid($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      { "width": "7", "height": "7", "x": "3", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "14", "y": "3", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "14", "y": "14", "rx": "1" }
    ],
    [
      "rect",
      { "width": "7", "height": "7", "x": "3", "y": "14", "rx": "1" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layout-grid" },
    $$sanitized_props,
    {
      /**
       * @component @name LayoutGrid
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iNyIgeD0iMTQiIHk9IjE0IiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-grid
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Loader_circle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
  Icon($$renderer, spread_props([
    { name: "loader-circle" },
    $$sanitized_props,
    {
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Lock_keyhole($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "16", "r": "1" }],
    [
      "rect",
      {
        "x": "3",
        "y": "10",
        "width": "18",
        "height": "12",
        "rx": "2"
      }
    ],
    ["path", { "d": "M7 10V7a5 5 0 0 1 10 0v3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "lock-keyhole" },
    $$sanitized_props,
    {
      /**
       * @component @name LockKeyhole
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE2IiByPSIxIiAvPgogIDxyZWN0IHg9IjMiIHk9IjEwIiB3aWR0aD0iMTgiIGhlaWdodD0iMTIiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik03IDEwVjdhNSA1IDAgMCAxIDEwIDB2MyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/lock-keyhole
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Log_out($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
    ["polyline", { "points": "16 17 21 12 16 7" }],
    ["line", { "x1": "21", "x2": "9", "y1": "12", "y2": "12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "log-out" },
    $$sanitized_props,
    {
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjEgMTIgMTYgNyIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSI5IiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/log-out
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Map$2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
      }
    ],
    ["path", { "d": "M15 5.764v15" }],
    ["path", { "d": "M9 3.236v15" }]
  ];
  Icon($$renderer, spread_props([
    { name: "map" },
    $$sanitized_props,
    {
      /**
       * @component @name Map
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuMTA2IDUuNTUzYTIgMiAwIDAgMCAxLjc4OCAwbDMuNjU5LTEuODNBMSAxIDAgMCAxIDIxIDQuNjE5djEyLjc2NGExIDEgMCAwIDEtLjU1My44OTRsLTQuNTUzIDIuMjc3YTIgMiAwIDAgMS0xLjc4OCAwbC00LjIxMi0yLjEwNmEyIDIgMCAwIDAtMS43ODggMGwtMy42NTkgMS44M0ExIDEgMCAwIDEgMyAxOS4zODFWNi42MThhMSAxIDAgMCAxIC41NTMtLjg5NGw0LjU1My0yLjI3N2EyIDIgMCAwIDEgMS43ODggMHoiIC8+CiAgPHBhdGggZD0iTTE1IDUuNzY0djE1IiAvPgogIDxwYXRoIGQ9Ik05IDMuMjM2djE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/map
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Menu($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["line", { "x1": "4", "x2": "20", "y1": "12", "y2": "12" }],
    ["line", { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }],
    ["line", { "x1": "4", "x2": "20", "y1": "18", "y2": "18" }]
  ];
  Icon($$renderer, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      /**
       * @component @name Menu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE4IiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/menu
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Monitor($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "14", "x": "2", "y": "3", "rx": "2" }
    ],
    ["line", { "x1": "8", "x2": "16", "y1": "21", "y2": "21" }],
    ["line", { "x1": "12", "x2": "12", "y1": "17", "y2": "21" }]
  ];
  Icon($$renderer, spread_props([
    { name: "monitor" },
    $$sanitized_props,
    {
      /**
       * @component @name Monitor
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHg9IjIiIHk9IjMiIHJ4PSIyIiAvPgogIDxsaW5lIHgxPSI4IiB4Mj0iMTYiIHkxPSIyMSIgeTI9IjIxIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTciIHkyPSIyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/monitor
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Moon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]];
  Icon($$renderer, spread_props([
    { name: "moon" },
    $$sanitized_props,
    {
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/moon
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Panel_left_close($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
    ],
    ["path", { "d": "M9 3v18" }],
    ["path", { "d": "m16 15-3-3 3-3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "panel-left-close" },
    $$sanitized_props,
    {
      /**
       * @component @name PanelLeftClose
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE2IDE1LTMtMyAzLTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left-close
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Panel_left_open($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }
    ],
    ["path", { "d": "M9 3v18" }],
    ["path", { "d": "m14 9 3 3-3 3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "panel-left-open" },
    $$sanitized_props,
    {
      /**
       * @component @name PanelLeftOpen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE0IDkgMyAzLTMgMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/panel-left-open
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Refresh_cw($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
    ],
    ["path", { "d": "M21 3v5h-5" }],
    [
      "path",
      { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
    ],
    ["path", { "d": "M8 16H3v5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "refresh-cw" },
    $$sanitized_props,
    {
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Scan_line($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { "d": "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { "d": "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { "d": "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { "d": "M7 12h10" }]
  ];
  Icon($$renderer, spread_props([
    { name: "scan-line" },
    $$sanitized_props,
    {
      /**
       * @component @name ScanLine
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA3VjVhMiAyIDAgMCAxIDItMmgyIiAvPgogIDxwYXRoIGQ9Ik0xNyAzaDJhMiAyIDAgMCAxIDIgMnYyIiAvPgogIDxwYXRoIGQ9Ik0yMSAxN3YyYTIgMiAwIDAgMS0yIDJoLTIiIC8+CiAgPHBhdGggZD0iTTcgMjFINWEyIDIgMCAwIDEtMi0ydi0yIiAvPgogIDxwYXRoIGQ9Ik03IDEyaDEwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/scan-line
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Search($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "search" },
    $$sanitized_props,
    {
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgogIDxwYXRoIGQ9Im0yMSAyMS00LjMtNC4zIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/search
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Settings($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "settings" },
    $$sanitized_props,
    {
      /**
       * @component @name Settings
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/settings
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Shield_check($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }
    ],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "shield-check" },
    $$sanitized_props,
    {
      /**
       * @component @name ShieldCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTNjMCA1LTMuNSA3LjUtNy42NiA4Ljk1YTEgMSAwIDAgMS0uNjctLjAxQzcuNSAyMC41IDQgMTggNCAxM1Y2YTEgMSAwIDAgMSAxLTFjMiAwIDQuNS0xLjIgNi4yNC0yLjcyYTEuMTcgMS4xNyAwIDAgMSAxLjUyIDBDMTQuNTEgMy44MSAxNyA1IDE5IDVhMSAxIDAgMCAxIDEgMXoiIC8+CiAgPHBhdGggZD0ibTkgMTIgMiAyIDQtNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shield-check
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Sun($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "4" }],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "m17.66 17.66 1.41 1.41" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.34 17.66-1.41 1.41" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }]
  ];
  Icon($$renderer, spread_props([
    { name: "sun" },
    $$sanitized_props,
    {
      /**
       * @component @name Sun
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function X($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$renderer, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    };
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    };
    let {
      children,
      asChild = false,
      variant = "default",
      size: size2 = "default",
      class: className = "",
      type = "button",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const classes = () => cn(base, variants[variant], sizes[size2], className);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { class: classes(), ...rest });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({ class: clsx(classes()), type, ...rest })}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function SidebarTrigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { class: className = "" } = $$props;
    const { isMobile, state: state2, toggleSidebar } = getContext(SIDEBAR_CONTEXT);
    Button($$renderer2, {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      class: cn("h-7 w-7", className),
      onclick: toggleSidebar,
      children: ($$renderer3) => {
        if (store_get($$store_subs ??= {}, "$isMobile", isMobile) || store_get($$store_subs ??= {}, "$state", state2) === "collapsed") {
          $$renderer3.push("<!--[0-->");
          Panel_left_open($$renderer3, { class: "size-4" });
        } else {
          $$renderer3.push("<!--[-1-->");
          Panel_left_close($$renderer3, { class: "size-4" });
        }
        $$renderer3.push(`<!--]--> <span class="sr-only">Toggle sidebar</span>`);
      },
      $$slots: { default: true }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function useSidebar() {
  const context = getContext(SIDEBAR_CONTEXT);
  if (!context) {
    throw new Error("Sidebar context is not available");
  }
  return context;
}
function AppContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { variant = "sidebar", class: className = "", children } = $$props;
    if (variant === "sidebar") {
      $$renderer2.push("<!--[0-->");
      SidebarInset($$renderer2, {
        class: className,
        children: ($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<main${attr_class(clsx(cn("mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl", className)))}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></main>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const h = (component, propsOrChildren, childrenOrKey, key = null) => {
  const hasProps = typeof propsOrChildren === "object" && propsOrChildren !== null && !Array.isArray(propsOrChildren);
  return {
    component,
    key: hasProps ? key : typeof childrenOrKey === "number" ? childrenOrKey : null,
    props: hasProps ? propsOrChildren : {},
    children: hasProps ? Array.isArray(childrenOrKey) ? childrenOrKey : childrenOrKey !== null ? [childrenOrKey] : [] : Array.isArray(propsOrChildren) ? propsOrChildren : propsOrChildren !== null ? [propsOrChildren] : []
  };
};
function Render($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let component = $$props["component"];
    let props = fallback($$props["props"], () => ({}), true);
    let children = fallback($$props["children"], () => [], true);
    let key = fallback($$props["key"], null);
    if (component) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!---->`);
      {
        if (children.length > 0) {
          $$renderer2.push("<!--[0-->");
          if (component) {
            $$renderer2.push("<!--[-->");
            component($$renderer2, spread_props([
              props,
              {
                children: ($$renderer3) => {
                  $$renderer3.push(`<!--[-->`);
                  const each_array = ensure_array_like(children);
                  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                    let child = each_array[$$index];
                    Render($$renderer3, spread_props([child]));
                    $$renderer3.push(`<!---->`);
                  }
                  $$renderer3.push(`<!--]-->`);
                },
                $$slots: { default: true }
              }
            ]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else {
          $$renderer2.push("<!--[-1-->");
          if (component) {
            $$renderer2.push("<!--[-->");
            component($$renderer2, spread_props([props]));
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { component, props, children, key });
  });
}
const { set, subscribe } = writable();
const setPage = set;
const page = { subscribe };
function App($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let initialComponent = $$props["initialComponent"];
    let initialPage = $$props["initialPage"];
    let resolveComponent = $$props["resolveComponent"];
    let component = initialComponent;
    let key = null;
    let page2 = { ...initialPage, flash: initialPage.flash ?? {} };
    let renderProps = resolveRenderProps(component, page2, key);
    setPage(page2);
    const isServer = typeof window === "undefined";
    if (!isServer) {
      router.init({
        initialPage,
        resolveComponent,
        swapComponent: async (args) => {
          component = args.component;
          page2 = args.page;
          key = args.preserveState ? key : Date.now();
          renderProps = resolveRenderProps(component, page2, key);
          setPage(page2);
        },
        onFlash: (flash) => {
          page2 = { ...page2, flash };
          setPage(page2);
        }
      });
    }
    function resolveRenderProps(component2, page22, key2 = null) {
      const child = h(component2.default, page22.props, [], key2);
      const layout = component2.layout;
      return layout ? resolveLayout(layout, child, page22.props, key2) : child;
    }
    function resolveLayout(layout, child, pageProps, key2) {
      if (isLayoutFunction(layout)) {
        return layout(h, child);
      }
      if (Array.isArray(layout)) {
        return layout.slice().reverse().reduce((currentRender, layoutComponent) => h(layoutComponent, pageProps, [currentRender], key2), child);
      }
      return h(layout, pageProps, child ? [child] : [], key2);
    }
    function isLayoutFunction(layout) {
      return typeof layout === "function" && layout.length === 2 && typeof layout.prototype === "undefined";
    }
    Render($$renderer2, spread_props([renderProps]));
    bind_props($$props, { initialComponent, initialPage, resolveComponent });
  });
}
const FormContextKey = /* @__PURE__ */ Symbol("InertiaFormContext");
let reservedFormKeys = null;
let bootstrapping = false;
function validateFormDataKeys(data) {
  if (bootstrapping) {
    return;
  }
  if (reservedFormKeys === null) {
    bootstrapping = true;
    const store2 = useForm({});
    reservedFormKeys = new Set(Object.keys(get$2(store2)));
    bootstrapping = false;
  }
  const conflicts = Object.keys(data).filter((key) => reservedFormKeys.has(key));
  if (conflicts.length > 0) {
    console.error(`[Inertia] useForm() data contains field(s) that conflict with form properties: ${conflicts.map((k) => `"${k}"`).join(", ")}. These fields will be overwritten by form methods/properties. Please rename these fields.`);
  }
}
function useForm(...args) {
  const parsedArgs = UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  let precognitionEndpoint = parsedArgs.precognitionEndpoint;
  const data = typeof initialData === "function" ? initialData() : initialData;
  const restored = rememberKey ? router.restore(rememberKey) : null;
  let defaults = cloneDeep(data);
  validateFormDataKeys(defaults);
  let cancelToken = null;
  let recentlySuccessfulTimeoutId = null;
  let transform = (data2) => data2;
  let rememberExcludeKeys = [];
  let defaultsCalledInOnSuccess = false;
  let validatorRef = null;
  let setFormState;
  const withPrecognition = (...args2) => {
    precognitionEndpoint = UseFormUtils.createWayfinderCallback(...args2);
    const formWithPrecognition = () => get$2(store2);
    let withAllErrors = null;
    if (!validatorRef) {
      const validator = createValidator((client) => {
        const { method, url } = precognitionEndpoint();
        const form = formWithPrecognition();
        const transformedData = cloneDeep(transform(form.data()));
        return client[method](url, transformedData);
      }, cloneDeep(defaults));
      validatorRef = validator;
      validator.on("validatingChanged", () => {
        setFormState("validating", validator.validating());
      }).on("validatedChanged", () => {
        setFormState("__valid", validator.valid());
      }).on("touchedChanged", () => {
        setFormState("__touched", validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors ?? config.get("form.withAllErrors") ? validator.errors() : toSimpleValidationErrors(validator.errors());
        setFormState("errors", {});
        formWithPrecognition().setError(validationErrors);
        setFormState("__valid", validator.valid());
      });
    }
    const tap = (value, callback) => {
      callback(value);
      return value;
    };
    if (validatorRef) {
      Object.assign(store2, {});
    }
    store2.update((form) => {
      return Object.assign(store2, {
        ...form,
        __touched: [],
        __valid: [],
        validating: false,
        validator: () => validatorRef,
        validate: (field, config2) => {
          const form2 = formWithPrecognition();
          if (typeof field === "object" && !("target" in field)) {
            config2 = field;
            field = void 0;
          }
          if (field === void 0) {
            validatorRef.validate(config2);
          } else {
            field = resolveName(field);
            const transformedData = transform(form2.data());
            validatorRef.validate(field, get$3(transformedData, field), config2);
          }
          return form2;
        },
        touch: (field, ...fields) => {
          const form2 = formWithPrecognition();
          if (Array.isArray(field)) {
            validatorRef?.touch(field);
          } else if (typeof field === "string") {
            validatorRef?.touch([field, ...fields]);
          } else {
            validatorRef?.touch(field);
          }
          return form2;
        },
        validateFiles: () => tap(formWithPrecognition(), () => validatorRef?.validateFiles()),
        setValidationTimeout: (duration) => tap(formWithPrecognition(), () => validatorRef.setTimeout(duration)),
        withAllErrors: () => tap(formWithPrecognition(), () => withAllErrors = true),
        withoutFileValidation: () => tap(formWithPrecognition(), () => validatorRef?.withoutFileValidation()),
        valid: (field) => formWithPrecognition().__valid.includes(field),
        invalid: (field) => field in formWithPrecognition().errors,
        touched: (field) => {
          const touched = formWithPrecognition().__touched;
          return typeof field === "string" ? touched.includes(field) : touched.length > 0;
        },
        setErrors: (errors) => tap(formWithPrecognition(), () => {
          const form2 = formWithPrecognition();
          form2.setError(errors);
        }),
        forgetError: (field) => tap(formWithPrecognition(), () => {
          const form2 = formWithPrecognition();
          form2.clearErrors(resolveName(field));
        })
      });
    });
    return store2;
  };
  const store2 = writable({
    ...restored ? restored.data : data,
    isDirty: false,
    errors: restored ? restored.errors : {},
    hasErrors: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    processing: false,
    setStore(keyOrData, maybeValue = void 0) {
      store2.update((store3) => {
        return typeof keyOrData === "string" ? set$1(store3, keyOrData, maybeValue) : Object.assign(store3, keyOrData);
      });
    },
    data() {
      return Object.keys(data).reduce((carry, key) => {
        return set$1(carry, key, get$3(this, key));
      }, {});
    },
    transform(callback) {
      transform = callback;
      return this;
    },
    defaults(fieldOrFields, maybeValue) {
      defaultsCalledInOnSuccess = true;
      if (typeof fieldOrFields === "undefined") {
        defaults = cloneDeep(this.data());
      } else {
        defaults = typeof fieldOrFields === "string" ? set$1(cloneDeep(defaults), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults), fieldOrFields);
      }
      validatorRef?.defaults(defaults);
      return this;
    },
    reset(...fields) {
      const clonedData = cloneDeep(defaults);
      if (fields.length === 0) {
        this.setStore(clonedData);
      } else {
        this.setStore(fields.filter((key) => has(clonedData, key)).reduce((carry, key) => {
          return set$1(carry, key, get$3(clonedData, key));
        }, {}));
      }
      validatorRef?.reset(...fields);
      return this;
    },
    setError(fieldOrFields, maybeValue) {
      const errors = typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields;
      setFormState("errors", {
        ...this.errors,
        ...errors
      });
      validatorRef?.setErrors(errors);
      return this;
    },
    clearErrors(...fields) {
      setFormState("errors", Object.keys(this.errors).reduce((carry, field) => ({
        ...carry,
        ...fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}
      }), {}));
      if (validatorRef) {
        if (fields.length === 0) {
          validatorRef.setErrors({});
        } else {
          fields.forEach(validatorRef.forgetError);
        }
      }
      return this;
    },
    resetAndClearErrors(...fields) {
      this.reset(...fields);
      this.clearErrors(...fields);
      return this;
    },
    submit(...args2) {
      const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint);
      defaultsCalledInOnSuccess = false;
      const data2 = transform(this.data());
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setFormState("wasSuccessful", false);
          setFormState("recentlySuccessful", false);
          if (recentlySuccessfulTimeoutId) {
            clearTimeout(recentlySuccessfulTimeoutId);
          }
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setFormState("processing", true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setFormState("progress", event || null);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page2) => {
          setFormState("processing", false);
          setFormState("progress", null);
          this.clearErrors();
          setFormState("wasSuccessful", true);
          setFormState("recentlySuccessful", true);
          recentlySuccessfulTimeoutId = setTimeout(() => setFormState("recentlySuccessful", false), config.get("form.recentlySuccessfulDuration"));
          const onSuccess = options.onSuccess ? await options.onSuccess(page2) : null;
          if (!defaultsCalledInOnSuccess) {
            this.defaults(cloneDeep(get$2(store2).data()));
          }
          return onSuccess;
        },
        onError: (errors) => {
          setFormState("processing", false);
          setFormState("progress", null);
          setFormState("errors", errors);
          validatorRef?.setErrors(errors);
          if (options.onError) {
            return options.onError(errors);
          }
        },
        onCancel: () => {
          setFormState("processing", false);
          setFormState("progress", null);
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          setFormState("processing", false);
          setFormState("progress", null);
          cancelToken = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      if (method === "delete") {
        router.delete(url, { ..._options, data: data2 });
      } else {
        router[method](url, data2, _options);
      }
    },
    get(url, options) {
      this.submit("get", url, options);
    },
    post(url, options) {
      this.submit("post", url, options);
    },
    put(url, options) {
      this.submit("put", url, options);
    },
    patch(url, options) {
      this.submit("patch", url, options);
    },
    delete(url, options) {
      this.submit("delete", url, options);
    },
    cancel() {
      cancelToken?.cancel();
    },
    __remember() {
      const data2 = this.data();
      if (rememberExcludeKeys.length > 0) {
        const filtered = { ...data2 };
        rememberExcludeKeys.forEach((k) => delete filtered[k]);
        return { data: filtered, errors: this.errors };
      }
      return { data: data2, errors: this.errors };
    },
    withPrecognition
  });
  const dontRememberMethod = (...keys) => {
    rememberExcludeKeys = keys;
    return store2;
  };
  Object.assign(store2, {
    withPrecognition,
    dontRemember: dontRememberMethod
  });
  setFormState = (key, value) => {
    store2.update((form) => ({ ...form, [key]: value }));
  };
  store2.subscribe((form) => {
    if (form.isDirty === isEqual(form.data(), defaults)) {
      setFormState("isDirty", !form.isDirty);
    }
    const hasErrors = Object.keys(form.errors).length > 0;
    if (form.hasErrors !== hasErrors) {
      setFormState("hasErrors", !form.hasErrors);
    }
    if (rememberKey) {
      const storedData = router.restore(rememberKey);
      const newData = form.__remember();
      if (!isEqual(storedData, newData)) {
        router.remember(newData, rememberKey);
      }
    }
  });
  return precognitionEndpoint ? store2.withPrecognition(precognitionEndpoint) : store2;
}
function Form($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "getFormData",
    "getData",
    "submit",
    "reset",
    "clearErrors",
    "resetAndClearErrors",
    "setError",
    "defaults",
    "validate",
    "valid",
    "invalid",
    "touch",
    "touched",
    "validator",
    "action",
    "method",
    "headers",
    "queryStringArrayFormat",
    "errorBag",
    "showProgress",
    "transform",
    "options",
    "onCancelToken",
    "onBefore",
    "onStart",
    "onProgress",
    "onFinish",
    "onCancel",
    "onSuccess",
    "onError",
    "onSubmitComplete",
    "disableWhileProcessing",
    "invalidateCacheTags",
    "resetOnError",
    "resetOnSuccess",
    "setDefaultsOnSuccess",
    "validateFiles",
    "validationTimeout",
    "withAllErrors"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let _method, _action, slotErrors;
    const noop2 = () => void 0;
    let action = fallback($$props["action"], "");
    let method = fallback($$props["method"], "get");
    let headers = fallback($$props["headers"], () => ({}), true);
    let queryStringArrayFormat = fallback($$props["queryStringArrayFormat"], "brackets");
    let errorBag = fallback($$props["errorBag"], null);
    let showProgress = fallback($$props["showProgress"], true);
    let transform = fallback($$props["transform"], (data) => data);
    let options = fallback($$props["options"], () => ({}), true);
    let onCancelToken = fallback($$props["onCancelToken"], noop2);
    let onBefore = fallback($$props["onBefore"], noop2);
    let onStart = fallback($$props["onStart"], noop2);
    let onProgress = fallback($$props["onProgress"], noop2);
    let onFinish = fallback($$props["onFinish"], noop2);
    let onCancel = fallback($$props["onCancel"], noop2);
    let onSuccess = fallback($$props["onSuccess"], noop2);
    let onError = fallback($$props["onError"], noop2);
    let onSubmitComplete = fallback($$props["onSubmitComplete"], noop2);
    let disableWhileProcessing = fallback($$props["disableWhileProcessing"], false);
    let invalidateCacheTags = fallback($$props["invalidateCacheTags"], () => [], true);
    let resetOnError = fallback($$props["resetOnError"], false);
    let resetOnSuccess = fallback($$props["resetOnSuccess"], false);
    let setDefaultsOnSuccess = fallback($$props["setDefaultsOnSuccess"], false);
    let validateFiles = fallback($$props["validateFiles"], false);
    let validationTimeout = fallback($$props["validationTimeout"], 1500);
    let withAllErrors = fallback($$props["withAllErrors"], null);
    const getTransformedData = () => {
      const [_url, data] = getUrlAndData();
      return transform(data);
    };
    const form = useForm({}).withPrecognition(() => _method, () => getUrlAndData()[0]).setValidationTimeout(validationTimeout);
    if (validateFiles) {
      form.validateFiles();
    }
    if (withAllErrors ?? config$1.get("form.withAllErrors")) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    let formElement;
    let isDirty = false;
    let defaultData = new FormData();
    function getFormData(submitter) {
      return new FormData(formElement, submitter);
    }
    function getData(submitter) {
      return formDataToObject(getFormData(submitter));
    }
    function getUrlAndData(submitter) {
      return mergeDataIntoQueryString(_method, _action, getData(submitter), queryStringArrayFormat);
    }
    function submit(submitter) {
      const [url, data] = getUrlAndData(submitter);
      const formTarget = submitter?.getAttribute("formtarget");
      if (formTarget === "_blank" && _method === "get") {
        window.open(url, "_blank");
        return;
      }
      const maybeReset = (resetOption) => {
        if (!resetOption) {
          return;
        }
        if (resetOption === true) {
          reset2();
        } else if (resetOption.length > 0) {
          reset2(...resetOption);
        }
      };
      const submitOptions = {
        headers,
        queryStringArrayFormat,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          if (onSuccess) {
            onSuccess(...args);
          }
          if (onSubmitComplete) {
            onSubmitComplete({ reset: reset2, defaults });
          }
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError: (...args) => {
          if (onError) {
            onError(...args);
          }
          maybeReset(resetOnError);
        },
        ...options
      };
      store_get($$store_subs ??= {}, "$form", form).transform(() => transform(data)).submit(_method, url, submitOptions);
      store_get($$store_subs ??= {}, "$form", form).transform(getTransformedData);
    }
    function reset2(...fields) {
      resetFormFields(formElement, defaultData, fields);
      form.reset(...fields);
    }
    function clearErrors(...fields) {
      store_get($$store_subs ??= {}, "$form", form).clearErrors(...fields);
    }
    function resetAndClearErrors(...fields) {
      clearErrors(...fields);
      reset2(...fields);
    }
    function setError(fieldOrFields, maybeValue) {
      store_get($$store_subs ??= {}, "$form", form).setError(typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields);
    }
    function defaults() {
      defaultData = getFormData();
      isDirty = false;
    }
    function validate(field, config2) {
      return form.validate(...UseFormUtils.mergeHeadersForValidation(field, config2, headers));
    }
    function valid(field) {
      return form.valid(field);
    }
    function invalid(field) {
      return form.invalid(field);
    }
    function touch(field, ...fields) {
      return form.touch(field, ...fields);
    }
    function touched(field) {
      return form.touched(field);
    }
    function validator() {
      return form.validator();
    }
    const formContextStore = writable(void 0);
    setContext(FormContextKey, formContextStore);
    _method = isUrlMethodPair(action) ? action.method : (method ?? "get").toLowerCase();
    _action = isUrlMethodPair(action) ? action.url : action;
    {
      form.setValidationTimeout(validationTimeout);
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }
    slotErrors = store_get($$store_subs ??= {}, "$form", form).errors;
    formContextStore.set({
      errors: store_get($$store_subs ??= {}, "$form", form).errors,
      hasErrors: store_get($$store_subs ??= {}, "$form", form).hasErrors,
      processing: store_get($$store_subs ??= {}, "$form", form).processing,
      progress: store_get($$store_subs ??= {}, "$form", form).progress,
      wasSuccessful: store_get($$store_subs ??= {}, "$form", form).wasSuccessful,
      recentlySuccessful: store_get($$store_subs ??= {}, "$form", form).recentlySuccessful,
      isDirty,
      clearErrors,
      resetAndClearErrors,
      setError,
      reset: reset2,
      submit,
      defaults,
      getData,
      getFormData,
      // Precognition
      validator,
      validate,
      touch,
      validating: store_get($$store_subs ??= {}, "$form", form).validating,
      valid,
      invalid,
      touched
    });
    $$renderer2.push(`<form${attributes({
      action: _action,
      method: _method,
      ...$$restProps,
      inert: disableWhileProcessing && store_get($$store_subs ??= {}, "$form", form).processing ? true : void 0
    })}><!--[-->`);
    slot(
      $$renderer2,
      $$props,
      "default",
      {
        errors: slotErrors,
        hasErrors: store_get($$store_subs ??= {}, "$form", form).hasErrors,
        processing: store_get($$store_subs ??= {}, "$form", form).processing,
        progress: store_get($$store_subs ??= {}, "$form", form).progress,
        wasSuccessful: store_get($$store_subs ??= {}, "$form", form).wasSuccessful,
        recentlySuccessful: store_get($$store_subs ??= {}, "$form", form).recentlySuccessful,
        clearErrors,
        resetAndClearErrors,
        setError,
        isDirty,
        submit,
        defaults,
        reset: reset2,
        getData,
        getFormData,
        validator,
        validate,
        touch,
        validating: store_get($$store_subs ??= {}, "$form", form).validating,
        valid: store_get($$store_subs ??= {}, "$form", form).valid,
        invalid: store_get($$store_subs ??= {}, "$form", form).invalid,
        touched: store_get($$store_subs ??= {}, "$form", form).touched
      }
    );
    $$renderer2.push(`<!--]--></form>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      action,
      method,
      headers,
      queryStringArrayFormat,
      errorBag,
      showProgress,
      transform,
      options,
      onCancelToken,
      onBefore,
      onStart,
      onProgress,
      onFinish,
      onCancel,
      onSuccess,
      onError,
      onSubmitComplete,
      disableWhileProcessing,
      invalidateCacheTags,
      resetOnError,
      resetOnSuccess,
      setDefaultsOnSuccess,
      validateFiles,
      validationTimeout,
      withAllErrors,
      getFormData,
      getData,
      submit,
      reset: reset2,
      clearErrors,
      resetAndClearErrors,
      setError,
      defaults,
      validate,
      valid,
      invalid,
      touch,
      touched,
      validator
    });
  });
}
function Link($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "href",
    "as",
    "data",
    "method",
    "replace",
    "preserveScroll",
    "preserveState",
    "preserveUrl",
    "only",
    "except",
    "headers",
    "queryStringArrayFormat",
    "async",
    "prefetch",
    "cacheFor",
    "cacheTags",
    "viewTransition"
  ]);
  $$renderer.component(($$renderer2) => {
    let _method, _href, asProp, elProps;
    let href = fallback($$props["href"], "");
    let as = fallback($$props["as"], "a");
    let data = fallback($$props["data"], () => ({}), true);
    let method = fallback($$props["method"], "get");
    let replace = fallback($$props["replace"], false);
    let preserveScroll = fallback($$props["preserveScroll"], false);
    let preserveState = fallback($$props["preserveState"], null);
    let preserveUrl = fallback($$props["preserveUrl"], false);
    let only = fallback($$props["only"], () => [], true);
    let except = fallback($$props["except"], () => [], true);
    let headers = fallback($$props["headers"], () => ({}), true);
    let queryStringArrayFormat = fallback($$props["queryStringArrayFormat"], "brackets");
    let async = fallback($$props["async"], false);
    let prefetch = fallback($$props["prefetch"], false);
    let cacheFor = fallback($$props["cacheFor"], 0);
    let cacheTags = fallback($$props["cacheTags"], () => [], true);
    let viewTransition = fallback($$props["viewTransition"], false);
    _method = isUrlMethodPair(href) ? href.method : method;
    _href = isUrlMethodPair(href) ? href.url : href;
    asProp = _method !== "get" ? "button" : as.toLowerCase();
    elProps = { a: { href: _href }, button: { type: "button" } }[asProp] || {};
    element(
      $$renderer2,
      asProp,
      () => {
        $$renderer2.push(`${attributes({ ...$$restProps, ...elProps })}`);
      },
      () => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      }
    );
    bind_props($$props, {
      href,
      as,
      data,
      method,
      replace,
      preserveScroll,
      preserveState,
      preserveUrl,
      only,
      except,
      headers,
      queryStringArrayFormat,
      async,
      prefetch,
      cacheFor,
      cacheTags,
      viewTransition
    });
  });
}
async function createInertiaApp({ id = "app", resolve, setup, progress = {}, page: page2, defaults = {} }) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page2 || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name));
  const svelteApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    return setup({
      el: isServer ? null : document.getElementById(id),
      App,
      props: { initialPage, initialComponent, resolveComponent }
    });
  });
  if (isServer && svelteApp) {
    const { html, head: head2, css } = svelteApp;
    return {
      body: useScriptElementForInitialPage ? `<script data-page="${id}" type="application/json">${JSON.stringify(initialPage).replace(/\//g, "\\/")}<\/script><div data-server-rendered="true" id="${id}">${html}</div>` : `<div data-server-rendered="true" id="${id}" data-page="${escape(JSON.stringify(initialPage))}">${html}</div>`,
      head: [head2, css ? `<style data-vite-css>${css.code}</style>` : ""]
    };
  }
  if (!isServer && progress) {
    setupProgress(progress);
  }
}
const config = config$1.extend({});
function AppShell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { variant = "sidebar", class: className = "", children } = $$props;
    const isOpen = derived(() => store_get($$store_subs ??= {}, "$page", page).props.sidebarOpen);
    if (variant === "header") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`flex min-h-screen w-full flex-col ${stringify(className)}`)}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      SidebarProvider($$renderer2, {
        defaultOpen: isOpen(),
        children: ($$renderer3) => {
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        }
      });
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AppLogoIcon($$renderer, $$props) {
  let { class: className = "", $$slots, $$events, ...rest } = $$props;
  $$renderer.push(`<svg${attributes(
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 40 42",
      class: clsx(className),
      ...rest
    },
    void 0,
    void 0,
    void 0,
    3
  )}><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.2 5.633 8.6.855 0 5.633v26.51l16.2 9 16.2-9v-8.442l7.6-4.223V9.856l-8.6-4.777-8.6 4.777V18.3l-5.6 3.111V5.633ZM38 18.301l-5.6 3.11v-6.157l5.6-3.11V18.3Zm-1.06-7.856-5.54 3.078-5.54-3.079 5.54-3.078 5.54 3.079ZM24.8 18.3v-6.157l5.6 3.111v6.158L24.8 18.3Zm-1 1.732 5.54 3.078-13.14 7.302-5.54-3.078 13.14-7.3v-.002Zm-16.2 7.89 7.6 4.222V38.3L2 30.966V7.92l5.6 3.111v16.892ZM8.6 9.3 3.06 6.222 8.6 3.143l5.54 3.08L8.6 9.3Zm21.8 15.51-13.2 7.334V38.3l13.2-7.334v-6.156ZM9.6 11.034l5.6-3.11v14.6l-5.6 3.11v-14.6Z"></path></svg>`);
}
function AppLogo($$renderer) {
  $$renderer.push(`<div class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">`);
  AppLogoIcon($$renderer, { class: "size-5 fill-current text-white dark:text-black" });
  $$renderer.push(`<!----></div> <div class="ml-1 grid flex-1 text-left text-sm"><span class="mb-0.5 truncate leading-tight font-semibold">Laravel Starter Kit</span></div>`);
}
function NavFooter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { items = [], class: className = "" } = $$props;
    SidebarGroup($$renderer2, {
      class: `group-data-[collapsible=icon]:p-0 ${className}`,
      children: ($$renderer3) => {
        SidebarGroupContent($$renderer3, {
          children: ($$renderer4) => {
            SidebarMenu($$renderer4, {
              children: ($$renderer5) => {
                $$renderer5.push(`<!--[-->`);
                const each_array = ensure_array_like(items);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let item = each_array[$$index];
                  SidebarMenuItem($$renderer5, {
                    children: ($$renderer6) => {
                      {
                        let children = function($$renderer7, props) {
                          $$renderer7.push(`<a${attributes({
                            ...props,
                            href: toUrl(item.href),
                            target: "_blank",
                            rel: "noopener noreferrer",
                            class: clsx(props.class)
                          })}>`);
                          if (item.icon) {
                            $$renderer7.push("<!--[0-->");
                            if (item.icon) {
                              $$renderer7.push("<!--[-->");
                              item.icon($$renderer7, { class: "size-4 shrink-0" });
                              $$renderer7.push("<!--]-->");
                            } else {
                              $$renderer7.push("<!--[!-->");
                              $$renderer7.push("<!--]-->");
                            }
                          } else {
                            $$renderer7.push("<!--[-1-->");
                          }
                          $$renderer7.push(`<!--]--> <span>${escape_html(item.title)}</span></a>`);
                        };
                        SidebarMenuButton($$renderer6, {
                          class: "text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100",
                          asChild: true,
                          children,
                          $$slots: { default: true }
                        });
                      }
                    },
                    $$slots: { default: true }
                  });
                }
                $$renderer5.push(`<!--]-->`);
              }
            });
          },
          $$slots: { default: true }
        });
      }
    });
  });
}
const currentUrl = derived$1(page, ($page) => {
  const origin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
  try {
    return new URL($page.url, origin).pathname;
  } catch {
    return $page.url;
  }
});
function currentUrlState() {
  function isCurrentUrl(urlToCheck, current, startsWith = false) {
    const urlString = toUrl(urlToCheck);
    const comparePath = (path) => startsWith ? current.startsWith(path) : path === current;
    if (!urlString.startsWith("http")) {
      return comparePath(urlString);
    }
    try {
      const absoluteUrl = new URL(urlString);
      return comparePath(absoluteUrl.pathname);
    } catch {
      return false;
    }
  }
  function isCurrentOrParentUrl(urlToCheck, current) {
    return isCurrentUrl(urlToCheck, current, true);
  }
  function whenCurrentUrl(urlToCheck, current, ifTrue, ifFalse = null) {
    return isCurrentUrl(urlToCheck, current) ? ifTrue : ifFalse;
  }
  return {
    currentUrl,
    isCurrentUrl,
    isCurrentOrParentUrl,
    whenCurrentUrl
  };
}
function NavMain($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { items = [] } = $$props;
    const { currentUrl: currentUrl2, isCurrentUrl } = currentUrlState();
    SidebarGroup($$renderer2, {
      class: "px-2 py-0",
      children: ($$renderer3) => {
        SidebarGroupLabel($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Platform`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> `);
        SidebarMenu($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            const each_array = ensure_array_like(items);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let item = each_array[$$index];
              SidebarMenuItem($$renderer4, {
                children: ($$renderer5) => {
                  {
                    let children = function($$renderer6, props) {
                      Link($$renderer6, spread_props([
                        props,
                        {
                          href: toUrl(item.href),
                          class: props.class,
                          children: ($$renderer7) => {
                            if (item.icon) {
                              $$renderer7.push("<!--[0-->");
                              if (item.icon) {
                                $$renderer7.push("<!--[-->");
                                item.icon($$renderer7, { class: "size-4 shrink-0" });
                                $$renderer7.push("<!--]-->");
                              } else {
                                $$renderer7.push("<!--[!-->");
                                $$renderer7.push("<!--]-->");
                              }
                            } else {
                              $$renderer7.push("<!--[-1-->");
                            }
                            $$renderer7.push(`<!--]--> <span>${escape_html(item.title)}</span>`);
                          },
                          $$slots: { default: true }
                        }
                      ]));
                    };
                    SidebarMenuButton($$renderer5, {
                      asChild: true,
                      isActive: isCurrentUrl(item.href, store_get($$store_subs ??= {}, "$currentUrl", currentUrl2)),
                      tooltip: item.title,
                      children,
                      $$slots: { default: true }
                    });
                  }
                },
                $$slots: { default: true }
              });
            }
            $$renderer4.push(`<!--]-->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const DROPDOWN_MENU_CONTEXT = /* @__PURE__ */ Symbol("dropdown-menu");
function DropdownMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, class: className = "", children } = $$props;
    const context = {
      open: () => open,
      setOpen: (value) => {
        open = value;
      }
    };
    setContext(DROPDOWN_MENU_CONTEXT, context);
    $$renderer2.push(`<div${attr_class(clsx(cn("relative", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { open });
  });
}
function DropdownMenuContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      align = "start",
      side = "bottom",
      sideOffset = 0,
      class: className = "",
      children
    } = $$props;
    const { open, setOpen } = getContext(DROPDOWN_MENU_CONTEXT);
    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0"
    };
    const sideClasses = {
      bottom: "top-full",
      top: "bottom-full",
      left: "right-full",
      right: "left-full"
    };
    const offsetStyle = () => {
      switch (side) {
        case "top":
          return `margin-bottom: ${sideOffset}px;`;
        case "left":
          return `margin-right: ${sideOffset}px;`;
        case "right":
          return `margin-left: ${sideOffset}px;`;
        default:
          return `margin-top: ${sideOffset}px;`;
      }
    };
    if (open()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(clsx(cn("absolute z-50 min-w-48 rounded-md border bg-popover p-2 text-popover-foreground shadow-md", alignClasses[align] ?? alignClasses.start, sideClasses[side] ?? sideClasses.bottom, className)))}${attr_style(offsetStyle())} role="menu" tabindex="-1">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DropdownMenuGroup($$renderer, $$props) {
  $$renderer.push(`<div class="flex flex-col"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
function DropdownMenuItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { asChild = false, class: className = "", children } = $$props;
    const { setOpen } = getContext(DROPDOWN_MENU_CONTEXT);
    const handleClick = () => setOpen(false);
    const classes = () => cn("flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { class: classes(), onClick: handleClick });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button type="button"${attr_class(clsx(classes()))}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DropdownMenuLabel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div${attr_class(clsx(cn("px-2 py-1.5 text-sm font-semibold", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function DropdownMenuSeparator($$renderer) {
  $$renderer.push(`<div class="my-1 h-px bg-border"></div>`);
}
function DropdownMenuTrigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { asChild = false, children } = $$props;
    const { open, setOpen } = getContext(DROPDOWN_MENU_CONTEXT);
    const handleClick = () => setOpen(!open());
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, {
        onclick: handleClick,
        "aria-expanded": open(),
        "data-state": open() ? "open" : "closed"
      });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button type="button"${attr("aria-expanded", open())}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Avatar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children, $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)),
      ...rest
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function AvatarFallback($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children, $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<div${attributes({
      class: clsx(cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground", className)),
      ...rest
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function AvatarImage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<img${attributes({
      class: clsx(cn("aspect-square h-full w-full", className)),
      ...rest
    })} onload="this.__e=event" onerror="this.__e=event"/>`);
  });
}
function getInitials(fullName) {
  if (!fullName) {
    return "";
  }
  const names = fullName.trim().split(" ");
  if (names.length === 0) {
    return "";
  }
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
}
function UserInfo($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user, showEmail = false } = $$props;
    const showAvatar = derived(() => user.avatar && user.avatar !== "");
    Avatar($$renderer2, {
      class: "h-8 w-8 overflow-hidden rounded-lg",
      children: ($$renderer3) => {
        if (showAvatar()) {
          $$renderer3.push("<!--[0-->");
          AvatarImage($$renderer3, { src: user.avatar, alt: user.name });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        AvatarFallback($$renderer3, {
          class: "rounded-lg text-black dark:text-white",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(getInitials(user.name))}`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-medium">${escape_html(user.name)}</span> `);
    if (showEmail) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="truncate text-xs text-muted-foreground">${escape_html(user.email)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
let urlDefaults = () => ({});
const getValue = (value) => {
  if (value === true) {
    return "1";
  }
  if (value === false) {
    return "0";
  }
  return value.toString();
};
const addNestedParams = (obj, prefix, params) => {
  Object.entries(obj).forEach(([subKey, value]) => {
    if (value === void 0) return;
    const paramKey = `${prefix}[${subKey}]`;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(`${paramKey}[]`, getValue(v)));
    } else if (value !== null && typeof value === "object") {
      addNestedParams(value, paramKey, params);
    } else if (["string", "number", "boolean"].includes(typeof value)) {
      params.set(paramKey, getValue(value));
    }
  });
};
const queryParams = (options) => {
  if (!options || !options.query && !options.mergeQuery) {
    return "";
  }
  const query = options.query ?? options.mergeQuery;
  const includeExisting = options.mergeQuery !== void 0;
  const params = new URLSearchParams(
    includeExisting && typeof window !== "undefined" ? window.location.search : ""
  );
  for (const key in query) {
    const queryValue = query[key];
    if (queryValue === void 0 || queryValue === null) {
      params.delete(key);
      continue;
    }
    if (Array.isArray(queryValue)) {
      if (params.has(`${key}[]`)) {
        params.delete(`${key}[]`);
      }
      queryValue.forEach((value) => {
        params.append(`${key}[]`, value.toString());
      });
    } else if (typeof queryValue === "object") {
      params.forEach((_, paramKey) => {
        if (paramKey.startsWith(`${key}[`)) {
          params.delete(paramKey);
        }
      });
      addNestedParams(queryValue, key, params);
    } else {
      params.set(key, getValue(queryValue));
    }
  }
  const str = params.toString();
  return str.length > 0 ? `?${str}` : "";
};
const applyUrlDefaults = (existing) => {
  const existingParams = { ...existing ?? {} };
  const defaultParams = urlDefaults();
  for (const key in defaultParams) {
    if (existingParams[key] === void 0 && defaultParams[key] !== void 0) {
      existingParams[key] = defaultParams[key];
    }
  }
  return existingParams;
};
const login$2 = (options) => ({
  url: login$2.url(options),
  method: "get"
});
login$2.definition = {
  methods: ["get", "head"],
  url: "/login"
};
login$2.url = (options) => {
  return login$2.definition.url + queryParams(options);
};
login$2.get = (options) => ({
  url: login$2.url(options),
  method: "get"
});
login$2.head = (options) => ({
  url: login$2.url(options),
  method: "head"
});
const loginForm$1 = (options) => ({
  action: login$2.url(options),
  method: "get"
});
loginForm$1.get = (options) => ({
  action: login$2.url(options),
  method: "get"
});
loginForm$1.head = (options) => ({
  action: login$2.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
login$2.form = loginForm$1;
const logout = (options) => ({
  url: logout.url(options),
  method: "post"
});
logout.definition = {
  methods: ["post"],
  url: "/logout"
};
logout.url = (options) => {
  return logout.definition.url + queryParams(options);
};
logout.post = (options) => ({
  url: logout.url(options),
  method: "post"
});
const logoutForm = (options) => ({
  action: logout.url(options),
  method: "post"
});
logoutForm.post = (options) => ({
  action: logout.url(options),
  method: "post"
});
logout.form = logoutForm;
const register = (options) => ({
  url: register.url(options),
  method: "get"
});
register.definition = {
  methods: ["get", "head"],
  url: "/register"
};
register.url = (options) => {
  return register.definition.url + queryParams(options);
};
register.get = (options) => ({
  url: register.url(options),
  method: "get"
});
register.head = (options) => ({
  url: register.url(options),
  method: "head"
});
const registerForm = (options) => ({
  action: register.url(options),
  method: "get"
});
registerForm.get = (options) => ({
  action: register.url(options),
  method: "get"
});
registerForm.head = (options) => ({
  action: register.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
register.form = registerForm;
const home = (options) => ({
  url: home.url(options),
  method: "get"
});
home.definition = {
  methods: ["get", "head"],
  url: "/"
};
home.url = (options) => {
  return home.definition.url + queryParams(options);
};
home.get = (options) => ({
  url: home.url(options),
  method: "get"
});
home.head = (options) => ({
  url: home.url(options),
  method: "head"
});
const homeForm = (options) => ({
  action: home.url(options),
  method: "get"
});
homeForm.get = (options) => ({
  action: home.url(options),
  method: "get"
});
homeForm.head = (options) => ({
  action: home.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
home.form = homeForm;
const dashboard = (options) => ({
  url: dashboard.url(options),
  method: "get"
});
dashboard.definition = {
  methods: ["get", "head"],
  url: "/dashboard"
};
dashboard.url = (options) => {
  return dashboard.definition.url + queryParams(options);
};
dashboard.get = (options) => ({
  url: dashboard.url(options),
  method: "get"
});
dashboard.head = (options) => ({
  url: dashboard.url(options),
  method: "head"
});
const dashboardForm = (options) => ({
  action: dashboard.url(options),
  method: "get"
});
dashboardForm.get = (options) => ({
  action: dashboard.url(options),
  method: "get"
});
dashboardForm.head = (options) => ({
  action: dashboard.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
dashboard.form = dashboardForm;
const map = (options) => ({
  url: map.url(options),
  method: "get"
});
map.definition = {
  methods: ["get", "head"],
  url: "/map"
};
map.url = (options) => {
  return map.definition.url + queryParams(options);
};
map.get = (options) => ({
  url: map.url(options),
  method: "get"
});
map.head = (options) => ({
  url: map.url(options),
  method: "head"
});
const mapForm = (options) => ({
  action: map.url(options),
  method: "get"
});
mapForm.get = (options) => ({
  action: map.url(options),
  method: "get"
});
mapForm.head = (options) => ({
  action: map.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
map.form = mapForm;
const edit$4 = (options) => ({
  url: edit$4.url(options),
  method: "get"
});
edit$4.definition = {
  methods: ["get", "head"],
  url: "/settings/profile"
};
edit$4.url = (options) => {
  return edit$4.definition.url + queryParams(options);
};
edit$4.get = (options) => ({
  url: edit$4.url(options),
  method: "get"
});
edit$4.head = (options) => ({
  url: edit$4.url(options),
  method: "head"
});
const editForm$4 = (options) => ({
  action: edit$4.url(options),
  method: "get"
});
editForm$4.get = (options) => ({
  action: edit$4.url(options),
  method: "get"
});
editForm$4.head = (options) => ({
  action: edit$4.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit$4.form = editForm$4;
const update$3 = (options) => ({
  url: update$3.url(options),
  method: "patch"
});
update$3.definition = {
  methods: ["patch"],
  url: "/settings/profile"
};
update$3.url = (options) => {
  return update$3.definition.url + queryParams(options);
};
update$3.patch = (options) => ({
  url: update$3.url(options),
  method: "patch"
});
const updateForm$3 = (options) => ({
  action: update$3.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
updateForm$3.patch = (options) => ({
  action: update$3.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
update$3.form = updateForm$3;
const destroy$1 = (options) => ({
  url: destroy$1.url(options),
  method: "delete"
});
destroy$1.definition = {
  methods: ["delete"],
  url: "/settings/profile"
};
destroy$1.url = (options) => {
  return destroy$1.definition.url + queryParams(options);
};
destroy$1.delete = (options) => ({
  url: destroy$1.url(options),
  method: "delete"
});
const destroyForm$1 = (options) => ({
  action: destroy$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroyForm$1.delete = (options) => ({
  action: destroy$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroy$1.form = destroyForm$1;
({
  edit: Object.assign(edit$4, edit$4),
  update: Object.assign(update$3, update$3),
  destroy: Object.assign(destroy$1, destroy$1)
});
function UserMenuContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user } = $$props;
    function handleLogout(propsOnClick) {
      return (event) => {
        propsOnClick?.(event);
        router.flushAll();
      };
    }
    DropdownMenuLabel($$renderer2, {
      class: "p-0 font-normal",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`);
        UserInfo($$renderer3, { user, showEmail: true });
        $$renderer3.push(`<!----></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    DropdownMenuSeparator($$renderer2);
    $$renderer2.push(`<!----> `);
    DropdownMenuGroup($$renderer2, {
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, props) {
            Link($$renderer4, {
              class: props.class,
              href: toUrl(edit$4()),
              prefetch: true,
              onclick: props.onClick,
              children: ($$renderer5) => {
                Settings($$renderer5, { class: "mr-2 h-4 w-4" });
                $$renderer5.push(`<!----> Settings`);
              },
              $$slots: { default: true }
            });
          };
          DropdownMenuItem($$renderer3, { asChild: true, children });
        }
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    DropdownMenuSeparator($$renderer2);
    $$renderer2.push(`<!----> `);
    {
      let children = function($$renderer3, props) {
        Link($$renderer3, {
          class: props.class,
          href: logout(),
          as: "button",
          onclick: handleLogout(props.onClick),
          "data-test": "logout-button",
          children: ($$renderer4) => {
            Log_out($$renderer4, { class: "mr-2 h-4 w-4" });
            $$renderer4.push(`<!----> Log out`);
          },
          $$slots: { default: true }
        });
      };
      DropdownMenuItem($$renderer2, { asChild: true, children });
    }
    $$renderer2.push(`<!---->`);
  });
}
function NavUser($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const user = derived(() => store_get($$store_subs ??= {}, "$page", page).props.auth.user);
    const { isMobile, state: sidebarState } = useSidebar();
    SidebarMenu($$renderer2, {
      children: ($$renderer3) => {
        SidebarMenuItem($$renderer3, {
          children: ($$renderer4) => {
            DropdownMenu($$renderer4, {
              class: "w-full",
              children: ($$renderer5) => {
                {
                  let children = function($$renderer6, props) {
                    SidebarMenuButton($$renderer6, {
                      size: "lg",
                      class: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                      "data-test": "sidebar-menu-button",
                      onclick: props.onclick,
                      "aria-expanded": props["aria-expanded"],
                      "data-state": props["data-state"],
                      children: ($$renderer7) => {
                        UserInfo($$renderer7, { user: user() });
                        $$renderer7.push(`<!----> `);
                        Chevrons_up_down($$renderer7, { class: "ml-auto size-4" });
                        $$renderer7.push(`<!---->`);
                      },
                      $$slots: { default: true }
                    });
                  };
                  DropdownMenuTrigger($$renderer5, { asChild: true, children });
                }
                $$renderer5.push(`<!----> `);
                DropdownMenuContent($$renderer5, {
                  class: "w-full min-w-0 rounded-lg",
                  side: store_get($$store_subs ??= {}, "$sidebarState", sidebarState) === "collapsed" && !store_get($$store_subs ??= {}, "$isMobile", isMobile) ? "left" : "top",
                  align: "end",
                  sideOffset: 4,
                  children: ($$renderer6) => {
                    UserMenuContent($$renderer6, { user: user() });
                  }
                });
                $$renderer5.push(`<!---->`);
              },
              $$slots: { default: true }
            });
          },
          $$slots: { default: true }
        });
      }
    });
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AppSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const mainNavItems = [
      { title: "Dashboard", href: dashboard(), icon: Layout_grid },
      { title: "Map", href: map(), icon: Map$2 }
    ];
    const footerNavItems = [
      {
        title: "Repository",
        href: "https://github.com/laravel/svelte-starter-kit",
        icon: Folder_git_2
      },
      {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#svelte",
        icon: Book_open
      }
    ];
    Sidebar($$renderer2, {
      collapsible: "icon",
      variant: "inset",
      children: ($$renderer3) => {
        SidebarHeader($$renderer3, {
          children: ($$renderer4) => {
            SidebarMenu($$renderer4, {
              children: ($$renderer5) => {
                SidebarMenuItem($$renderer5, {
                  children: ($$renderer6) => {
                    {
                      let children2 = function($$renderer7, props) {
                        Link($$renderer7, spread_props([
                          props,
                          {
                            href: toUrl(dashboard()),
                            class: props.class,
                            children: ($$renderer8) => {
                              AppLogo($$renderer8);
                            },
                            $$slots: { default: true }
                          }
                        ]));
                      };
                      SidebarMenuButton($$renderer6, {
                        size: "lg",
                        asChild: true,
                        children: children2,
                        $$slots: { default: true }
                      });
                    }
                  },
                  $$slots: { default: true }
                });
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        SidebarContent($$renderer3, {
          children: ($$renderer4) => {
            NavMain($$renderer4, { items: mainNavItems });
          }
        });
        $$renderer3.push(`<!----> `);
        SidebarFooter($$renderer3, {
          children: ($$renderer4) => {
            NavFooter($$renderer4, { items: footerNavItems });
            $$renderer4.push(`<!----> `);
            NavUser($$renderer4);
            $$renderer4.push(`<!---->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!----> `);
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function Breadcrumb($$renderer, $$props) {
  $$renderer.push(`<nav aria-label="breadcrumb" class="text-sm"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></nav>`);
}
function BreadcrumbItem($$renderer, $$props) {
  $$renderer.push(`<li class="inline-flex items-center gap-1.5"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></li>`);
}
function BreadcrumbLink($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      children,
      asChild = false,
      class: className = "",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const classes = () => cn("transition-colors hover:text-foreground", className);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { class: classes(), ...rest });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a${attributes({ class: clsx(classes()), ...rest })}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></a>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function BreadcrumbList($$renderer, $$props) {
  $$renderer.push(`<ol class="flex flex-wrap items-center gap-1.5"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></ol>`);
}
function BreadcrumbPage($$renderer, $$props) {
  $$renderer.push(`<span class="font-medium text-foreground"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></span>`);
}
function BreadcrumbSeparator($$renderer) {
  $$renderer.push(`<span class="text-muted-foreground">/</span>`);
}
function Breadcrumbs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { breadcrumbs = [] } = $$props;
    Breadcrumb($$renderer2, {
      children: ($$renderer3) => {
        BreadcrumbList($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            const each_array = ensure_array_like(breadcrumbs);
            for (let index = 0, $$length = each_array.length; index < $$length; index++) {
              let item = each_array[index];
              BreadcrumbItem($$renderer4, {
                children: ($$renderer5) => {
                  if (index === breadcrumbs.length - 1) {
                    $$renderer5.push("<!--[0-->");
                    BreadcrumbPage($$renderer5, {
                      children: ($$renderer6) => {
                        $$renderer6.push(`<!---->${escape_html(item.title)}`);
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[-1-->");
                    {
                      let children = function($$renderer6, props) {
                        Link($$renderer6, {
                          href: item.href,
                          class: props.class,
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->${escape_html(item.title)}`);
                          },
                          $$slots: { default: true }
                        });
                      };
                      BreadcrumbLink($$renderer5, { asChild: true, children, $$slots: { default: true } });
                    }
                  }
                  $$renderer5.push(`<!--]-->`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              if (index !== breadcrumbs.length - 1) {
                $$renderer4.push("<!--[0-->");
                BreadcrumbSeparator($$renderer4);
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
      },
      $$slots: { default: true }
    });
  });
}
function AppSidebarHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { breadcrumbs = [] } = $$props;
    $$renderer2.push(`<header class="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"><div class="flex items-center gap-2">`);
    SidebarTrigger($$renderer2, { class: "-ml-1" });
    $$renderer2.push(`<!----> `);
    if (breadcrumbs && breadcrumbs.length > 0) {
      $$renderer2.push("<!--[0-->");
      Breadcrumbs($$renderer2, { breadcrumbs });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></header>`);
  });
}
function AppSidebarLayout($$renderer, $$props) {
  let { breadcrumbs = [], children } = $$props;
  AppShell($$renderer, {
    variant: "sidebar",
    children: ($$renderer2) => {
      AppSidebar($$renderer2, {});
      $$renderer2.push(`<!----> `);
      AppContent($$renderer2, {
        variant: "sidebar",
        class: "overflow-x-hidden",
        children: ($$renderer3) => {
          AppSidebarHeader($$renderer3, { breadcrumbs });
          $$renderer3.push(`<!----> `);
          children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        }
      });
      $$renderer2.push(`<!---->`);
    }
  });
}
function AppLayout_1($$renderer, $$props) {
  let { breadcrumbs = [], children } = $$props;
  AppSidebarLayout($$renderer, {
    breadcrumbs,
    children: ($$renderer2) => {
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    }
  });
}
function Dashboard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const breadcrumbs = [{ title: "Dashboard", href: dashboard() }];
    AppHead($$renderer2, { title: "Dashboard" });
    $$renderer2.push(`<!----> `);
    AppLayout_1($$renderer2, {
      breadcrumbs,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4"><div class="grid auto-rows-min gap-4 md:grid-cols-3"><div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
        PlaceholderPattern($$renderer3);
        $$renderer3.push(`<!----></div> <div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
        PlaceholderPattern($$renderer3);
        $$renderer3.push(`<!----></div> <div class="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">`);
        PlaceholderPattern($$renderer3);
        $$renderer3.push(`<!----></div></div> <div class="relative min-h-screen flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">`);
        PlaceholderPattern($$renderer3);
        $$renderer3.push(`<!----></div></div>`);
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
function MapComponent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { visibleFeatures = [] } = $$props;
    $$renderer2.push(`<div class="h-full w-full"></div>`);
    bind_props($$props, { visibleFeatures });
  });
}
function NavigationMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<nav${attr_class(clsx(cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></nav>`);
  });
}
function NavigationMenuItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<li${attr_class(clsx(cn("list-none", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></li>`);
  });
}
function NavigationMenuList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<ul${attr_class(clsx(cn("group flex flex-1 list-none items-center justify-center gap-1", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></ul>`);
  });
}
function navigationMenuTriggerStyle(className = "") {
  return cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground",
    className
  );
}
const SHEET_CONTEXT = /* @__PURE__ */ Symbol("sheet");
function Sheet($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, children } = $$props;
    const context = {
      open: () => open,
      setOpen: (value) => {
        open = value;
      }
    };
    setContext(SHEET_CONTEXT, context);
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { open });
  });
}
function SheetContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { side = "right", class: className = "", children } = $$props;
    const { open, setOpen } = getContext(SHEET_CONTEXT);
    const sideClasses = {
      right: "inset-y-0 right-0",
      left: "inset-y-0 left-0",
      top: "inset-x-0 top-0",
      bottom: "inset-x-0 bottom-0"
    };
    const sizeClasses = {
      right: "h-full w-3/4 sm:max-w-sm",
      left: "h-full w-3/4 sm:max-w-sm",
      top: "h-auto",
      bottom: "h-auto"
    };
    if (open()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50"><button type="button" class="fixed inset-0 border-0 bg-black/50" aria-label="Close"></button> <div${attr_class(clsx(cn("fixed relative flex flex-col gap-4 overflow-y-auto border-none bg-background p-6 shadow-lg", sideClasses[side] ?? sideClasses.right, sizeClasses[side] ?? sizeClasses.right, className)))}><button type="button" class="ring-offset-background focus-visible:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none" aria-label="Close">`);
      X($$renderer2, { class: "size-4" });
      $$renderer2.push(`<!----> <span class="sr-only">Close</span></button> `);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function SheetHeader($$renderer, $$props) {
  $$renderer.push(`<div class="mb-4 flex flex-col gap-1.5"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
function SheetTitle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<h2${attr_class(clsx(cn("text-lg font-semibold text-foreground", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></h2>`);
  });
}
function SheetTrigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { asChild = false, children } = $$props;
    const { setOpen, open } = getContext(SHEET_CONTEXT);
    const handleClick = () => setOpen(!open());
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { onclick: handleClick, "aria-expanded": open() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button type="button"${attr("aria-expanded", open())}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function AppHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { breadcrumbs = [] } = $$props;
    const auth = derived(() => store_get($$store_subs ??= {}, "$page", page).props.auth);
    const { currentUrl: currentUrl2, isCurrentUrl, whenCurrentUrl } = currentUrlState();
    const activeItemStyles = "text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100";
    const mainNavItems = [
      { title: "Dashboard", href: dashboard(), icon: Layout_grid },
      {
        title: "Map",
        href: "/map",
        // hardcoded for now until Wayfinder regenerates
        icon: Map$2
      }
    ];
    const rightNavItems = [
      {
        title: "Repository",
        href: "https://github.com/laravel/svelte-starter-kit",
        icon: Folder
      },
      {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#svelte",
        icon: Book_open
      }
    ];
    $$renderer2.push(`<div><div class="border-b border-sidebar-border/80"><div class="mx-auto flex h-16 items-center px-4 md:max-w-7xl"><div class="lg:hidden">`);
    Sheet($$renderer2, {
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, props) {
            Button($$renderer4, {
              variant: "ghost",
              size: "icon",
              class: "mr-2 h-9 w-9",
              onclick: props.onclick,
              "aria-expanded": props["aria-expanded"],
              children: ($$renderer5) => {
                Menu($$renderer5, { class: "h-5 w-5" });
              },
              $$slots: { default: true }
            });
          };
          SheetTrigger($$renderer3, { asChild: true, children });
        }
        $$renderer3.push(`<!----> `);
        SheetContent($$renderer3, {
          side: "left",
          class: "w-[300px] p-6",
          children: ($$renderer4) => {
            SheetTitle($$renderer4, {
              class: "sr-only",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Navigation menu`);
              }
            });
            $$renderer4.push(`<!----> `);
            SheetHeader($$renderer4, {
              class: "flex justify-start text-left",
              children: ($$renderer5) => {
                AppLogoIcon($$renderer5, { class: "size-6 fill-current text-black dark:text-white" });
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> <div class="flex h-full flex-1 flex-col justify-between space-y-4 pt-6 pb-10"><nav class="-mx-3 space-y-1"><!--[-->`);
            const each_array = ensure_array_like(mainNavItems);
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let item = each_array[$$index];
              Link($$renderer4, {
                href: toUrl(item.href),
                class: `flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent ${stringify(whenCurrentUrl(item.href, store_get($$store_subs ??= {}, "$currentUrl", currentUrl2), activeItemStyles, "") ?? "")}`,
                children: ($$renderer5) => {
                  if (item.icon) {
                    $$renderer5.push("<!--[0-->");
                    if (item.icon) {
                      $$renderer5.push("<!--[-->");
                      item.icon($$renderer5, { class: "h-5 w-5" });
                      $$renderer5.push("<!--]-->");
                    } else {
                      $$renderer5.push("<!--[!-->");
                      $$renderer5.push("<!--]-->");
                    }
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--> ${escape_html(item.title)}`);
                },
                $$slots: { default: true }
              });
            }
            $$renderer4.push(`<!--]--></nav> <div class="flex flex-col space-y-4"><!--[-->`);
            const each_array_1 = ensure_array_like(rightNavItems);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let item = each_array_1[$$index_1];
              $$renderer4.push(`<a${attr("href", toUrl(item.href))} target="_blank" rel="noopener noreferrer" class="flex items-center space-x-2 text-sm font-medium">`);
              if (item.icon) {
                $$renderer4.push("<!--[0-->");
                if (item.icon) {
                  $$renderer4.push("<!--[-->");
                  item.icon($$renderer4, { class: "h-5 w-5" });
                  $$renderer4.push("<!--]-->");
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push("<!--]-->");
                }
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--> <span>${escape_html(item.title)}</span></a>`);
            }
            $$renderer4.push(`<!--]--></div></div>`);
          }
        });
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> `);
    Link($$renderer2, {
      href: toUrl(dashboard()),
      class: "flex items-center gap-x-2",
      children: ($$renderer3) => {
        AppLogo($$renderer3);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="hidden h-full lg:flex lg:flex-1">`);
    NavigationMenu($$renderer2, {
      class: "ml-10 flex h-full items-stretch",
      children: ($$renderer3) => {
        NavigationMenuList($$renderer3, {
          class: "flex h-full items-stretch space-x-2",
          children: ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(mainNavItems);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let item = each_array_2[$$index_2];
              NavigationMenuItem($$renderer4, {
                class: "relative flex h-full items-center",
                children: ($$renderer5) => {
                  Link($$renderer5, {
                    class: `${stringify(navigationMenuTriggerStyle())} ${stringify(whenCurrentUrl(item.href, store_get($$store_subs ??= {}, "$currentUrl", currentUrl2), activeItemStyles, "") ?? "")} h-9 cursor-pointer px-4`,
                    href: toUrl(item.href),
                    children: ($$renderer6) => {
                      if (item.icon) {
                        $$renderer6.push("<!--[0-->");
                        if (item.icon) {
                          $$renderer6.push("<!--[-->");
                          item.icon($$renderer6, { class: "mr-2 h-4 w-4" });
                          $$renderer6.push("<!--]-->");
                        } else {
                          $$renderer6.push("<!--[!-->");
                          $$renderer6.push("<!--]-->");
                        }
                      } else {
                        $$renderer6.push("<!--[-1-->");
                      }
                      $$renderer6.push(`<!--]--> ${escape_html(item.title)}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----> `);
                  if (isCurrentUrl(item.href, store_get($$store_subs ??= {}, "$currentUrl", currentUrl2))) {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]-->`);
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          }
        });
      }
    });
    $$renderer2.push(`<!----></div> <div class="ml-auto flex items-center space-x-2"><div class="relative flex items-center space-x-1">`);
    Button($$renderer2, {
      variant: "ghost",
      size: "icon",
      class: "group h-9 w-9 cursor-pointer",
      children: ($$renderer3) => {
        Search($$renderer3, { class: "size-5 opacity-80 group-hover:opacity-100" });
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="hidden space-x-1 lg:flex"><!--[-->`);
    const each_array_3 = ensure_array_like(rightNavItems);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let item = each_array_3[$$index_3];
      TooltipProvider($$renderer2, {
        delayDuration: 0,
        children: ($$renderer3) => {
          Tooltip($$renderer3, {
            children: ($$renderer4) => {
              {
                let child = function($$renderer5, { props }) {
                  $$renderer5.push(`<a${attributes({
                    href: toUrl(item.href),
                    target: "_blank",
                    rel: "noopener noreferrer",
                    ...props,
                    class: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 group cursor-pointer"
                  })}><span class="sr-only">${escape_html(item.title)}</span> `);
                  if (item.icon) {
                    $$renderer5.push("<!--[-->");
                    item.icon($$renderer5, { class: "size-5 opacity-80 group-hover:opacity-100" });
                    $$renderer5.push("<!--]-->");
                  } else {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push("<!--]-->");
                  }
                  $$renderer5.push(`</a>`);
                };
                TooltipTrigger($$renderer4, { child, $$slots: { child: true } });
              }
              $$renderer4.push(`<!----> `);
              TooltipContent($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<p>${escape_html(item.title)}</p>`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!---->`);
            },
            $$slots: { default: true }
          });
        }
      });
    }
    $$renderer2.push(`<!--]--></div></div> `);
    DropdownMenu($$renderer2, {
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, props) {
            Button($$renderer4, {
              variant: "ghost",
              size: "icon",
              class: "relative size-10 w-auto rounded-full p-1 focus-within:ring-2 focus-within:ring-primary",
              onclick: props.onclick,
              "aria-expanded": props["aria-expanded"],
              "data-state": props["data-state"],
              children: ($$renderer5) => {
                Avatar($$renderer5, {
                  class: "size-8 overflow-hidden rounded-full",
                  children: ($$renderer6) => {
                    if (auth().user.avatar) {
                      $$renderer6.push("<!--[0-->");
                      AvatarImage($$renderer6, { src: auth().user.avatar, alt: auth().user.name });
                    } else {
                      $$renderer6.push("<!--[-1-->");
                    }
                    $$renderer6.push(`<!--]--> `);
                    AvatarFallback($$renderer6, {
                      class: "rounded-lg bg-neutral-200 font-semibold text-black dark:bg-neutral-700 dark:text-white",
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!---->${escape_html(getInitials(auth().user?.name))}`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!---->`);
                  },
                  $$slots: { default: true }
                });
              },
              $$slots: { default: true }
            });
          };
          DropdownMenuTrigger($$renderer3, { asChild: true, children });
        }
        $$renderer3.push(`<!----> `);
        DropdownMenuContent($$renderer3, {
          align: "end",
          class: "w-56",
          children: ($$renderer4) => {
            UserMenuContent($$renderer4, { user: auth().user });
          }
        });
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></div> `);
    if (breadcrumbs.length > 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex w-full border-b border-sidebar-border/70"><div class="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">`);
      Breadcrumbs($$renderer2, { breadcrumbs });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function MapLayout($$renderer, $$props) {
  let { breadcrumbs = [], children } = $$props;
  AppShell($$renderer, {
    variant: "header",
    class: "flex flex-col h-screen overflow-hidden",
    children: ($$renderer2) => {
      AppHeader($$renderer2, { breadcrumbs });
      $$renderer2.push(`<!----> <div class="flex-1 relative w-full h-full overflow-hidden">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
  });
}
function Map$1($$renderer) {
  let visibleFeatures = [];
  const breadcrumbs = [{ title: "Map", href: "/map" }];
  let $$settled = true;
  let $$inner_renderer;
  function $$render_inner($$renderer2) {
    AppHead($$renderer2, { title: "Map" });
    $$renderer2.push(`<!----> `);
    MapLayout($$renderer2, {
      breadcrumbs,
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex h-full w-full overflow-hidden"><div class="w-96 shrink-0 bg-white border-r shadow-lg overflow-y-auto z-10">`);
        if (visibleFeatures.length === 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="p-8 text-center text-gray-500"><p>No restaurants found in this area.</p> <p class="text-sm mt-2">Try moving the map.</p></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="p-4 border-b bg-gray-50"><h2 class="text-xl font-bold text-gray-800">Restaurants</h2> <p class="text-sm text-gray-500 mt-1">Found ${escape_html(visibleFeatures.length)} places in view</p></div> <div class="divide-y"><!--[-->`);
          const each_array = ensure_array_like(visibleFeatures);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let place = each_array[$$index];
            $$renderer3.push(`<div class="p-4 hover:bg-gray-50 transition-colors text-gray-600"><h3 class="font-semibold text-lg text-gray-800">${escape_html(place.name || "Unnamed Place")}</h3> `);
            if (place.cuisine) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="flex items-center mt-1"><span class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">${escape_html(place.cuisine)}</span></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> <div class="mt-2 text-sm space-y-1">`);
            if (place.street || place.housenumber) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p>${escape_html(place.street || "")} ${escape_html(place.housenumber || "")}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (place.city) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<p>${escape_html(place.postcode || "")} ${escape_html(place.city)}</p>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--> `);
            if (place.website) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<a${attr("href", place.website)} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline truncate block">Website</a>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]--></div></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div> <div class="grow relative h-full">`);
        MapComponent($$renderer3, {
          get visibleFeatures() {
            return visibleFeatures;
          },
          set visibleFeatures($$value) {
            visibleFeatures = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div></div>`);
      }
    });
    $$renderer2.push(`<!---->`);
  }
  do {
    $$settled = true;
    $$inner_renderer = $$renderer.copy();
    $$render_inner($$inner_renderer);
  } while (!$$settled);
  $$renderer.subsume($$inner_renderer);
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Map$1
}, Symbol.toStringTag, { value: "Module" }));
function Welcome($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { canRegister = true } = $$props;
    const auth = derived(() => store_get($$store_subs ??= {}, "$page", page).props.auth);
    AppHead($$renderer2, {
      title: "Welcome",
      children: ($$renderer3) => {
        $$renderer3.push(`<link rel="preconnect" href="https://rsms.me/"/> <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>`);
      }
    });
    $$renderer2.push(`<!----> <div class="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]"><header class="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl"><nav class="flex items-center justify-end gap-4">`);
    if (auth().user) {
      $$renderer2.push("<!--[0-->");
      Link($$renderer2, {
        href: toUrl(dashboard()),
        class: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Dashboard`);
        },
        $$slots: { default: true }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      Link($$renderer2, {
        href: toUrl(login$2()),
        class: "inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Log in`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      if (canRegister) {
        $$renderer2.push("<!--[0-->");
        Link($$renderer2, {
          href: toUrl(register()),
          class: "inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]",
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Register`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></nav></header> <div class="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0"><main class="flex w-full max-w-[335px] flex-col-reverse overflow-hidden rounded-lg lg:max-w-4xl lg:flex-row"><div class="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-5 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"><h1 class="mb-1 font-medium">Let's get started</h1> <p class="mb-2 text-[#706f6c] dark:text-[#A1A09A]">Laravel has an incredibly rich ecosystem. <br/>We suggest
                    starting with the following.</p> <ul class="mb-4 flex flex-col lg:mb-6"><li class="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]"><span class="relative bg-white py-1 dark:bg-[#161615]"><span class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]"><span class="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]"></span></span></span> <span>Read the <a href="https://laravel.com/docs" target="_blank" class="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"><span>Documentation</span> <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5"><path d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001" stroke="currentColor" stroke-linecap="square"></path></svg></a></span></li> <li class="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]"><span class="relative bg-white py-1 dark:bg-[#161615]"><span class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]"><span class="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]"></span></span></span> <span>Watch video tutorials at <a href="https://laracasts.com" target="_blank" class="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"><span>Laracasts</span> <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5"><path d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001" stroke="currentColor" stroke-linecap="square"></path></svg></a></span></li></ul> <ul class="flex gap-3 text-sm leading-normal"><li><a href="https://cloud.laravel.com" target="_blank" class="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white">Deploy now</a></li></ul></div> <div class="bg-[#fff2f2] dark:bg-[#1D0002] relative lg:-ml-px -mb-px lg:mb-0 rounded-t-lg lg:rounded-t-none lg:rounded-r-lg aspect-[335/364] lg:aspect-auto w-full lg:w-[438px] shrink-0 overflow-hidden"><svg class="w-full text-[#F53003] dark:text-[#F61500] transition-all translate-y-0 opacity-100 max-w-none duration-750 starting:opacity-0 motion-safe:starting:translate-y-6" viewBox="0 0 438 104" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2036 -3H0V102.197H49.5189V86.7187H17.2036V-3Z" fill="currentColor"></path><path d="M110.256 41.6337C108.061 38.1275 104.945 35.3731 100.905 33.3681C96.8667 31.3647 92.8016 30.3618 88.7131 30.3618C83.4247 30.3618 78.5885 31.3389 74.201 33.2923C69.8111 35.2456 66.0474 37.928 62.9059 41.3333C59.7643 44.7401 57.3198 48.6726 55.5754 53.1293C53.8287 57.589 52.9572 62.274 52.9572 67.1813C52.9572 72.1925 53.8287 76.8995 55.5754 81.3069C57.3191 85.7173 59.7636 89.6241 62.9059 93.0293C66.0474 96.4361 69.8119 99.1155 74.201 101.069C78.5885 103.022 83.4247 103.999 88.7131 103.999C92.8016 103.999 96.8667 102.997 100.905 100.994C104.945 98.9911 108.061 96.2359 110.256 92.7282V102.195H126.563V32.1642H110.256V41.6337ZM108.76 75.7472C107.762 78.4531 106.366 80.8078 104.572 82.8112C102.776 84.8161 100.606 86.4183 98.0637 87.6206C95.5202 88.823 92.7004 89.4238 89.6103 89.4238C86.5178 89.4238 83.7252 88.823 81.2324 87.6206C78.7388 86.4183 76.5949 84.8161 74.7998 82.8112C73.004 80.8078 71.6319 78.4531 70.6856 75.7472C69.7356 73.0421 69.2644 70.1868 69.2644 67.1821C69.2644 64.1758 69.7356 61.3205 70.6856 58.6154C71.6319 55.9102 73.004 53.5571 74.7998 51.5522C76.5949 49.5495 78.738 47.9451 81.2324 46.7427C83.7252 45.5404 86.5178 44.9396 89.6103 44.9396C92.7012 44.9396 95.5202 45.5404 98.0637 46.7427C100.606 47.9451 102.776 49.5487 104.572 51.5522C106.367 53.5571 107.762 55.9102 108.76 58.6154C109.756 61.3205 110.256 64.1758 110.256 67.1821C110.256 70.1868 109.756 73.0421 108.76 75.7472Z" fill="currentColor"></path><path d="M242.805 41.6337C240.611 38.1275 237.494 35.3731 233.455 33.3681C229.416 31.3647 225.351 30.3618 221.262 30.3618C215.974 30.3618 211.138 31.3389 206.75 33.2923C202.36 35.2456 198.597 37.928 195.455 41.3333C192.314 44.7401 189.869 48.6726 188.125 53.1293C186.378 57.589 185.507 62.274 185.507 67.1813C185.507 72.1925 186.378 76.8995 188.125 81.3069C189.868 85.7173 192.313 89.6241 195.455 93.0293C198.597 96.4361 202.361 99.1155 206.75 101.069C211.138 103.022 215.974 103.999 221.262 103.999C225.351 103.999 229.416 102.997 233.455 100.994C237.494 98.9911 240.611 96.2359 242.805 92.7282V102.195H259.112V32.1642H242.805V41.6337ZM241.31 75.7472C240.312 78.4531 238.916 80.8078 237.122 82.8112C235.326 84.8161 233.156 86.4183 230.614 87.6206C228.07 88.823 225.251 89.4238 222.16 89.4238C219.068 89.4238 216.275 88.823 213.782 87.6206C211.289 86.4183 209.145 84.8161 207.35 82.8112C205.554 80.8078 204.182 78.4531 203.236 75.7472C202.286 73.0421 201.814 70.1868 201.814 67.1821C201.814 64.1758 202.286 61.3205 203.236 58.6154C204.182 55.9102 205.554 53.5571 207.35 51.5522C209.145 49.5495 211.288 47.9451 213.782 46.7427C216.275 45.5404 219.068 44.9396 222.16 44.9396C225.251 44.9396 228.07 45.5404 230.614 46.7427C233.156 47.9451 235.326 49.5487 237.122 51.5522C238.917 53.5571 240.312 55.9102 241.31 58.6154C242.306 61.3205 242.806 64.1758 242.806 67.1821C242.805 70.1868 242.305 73.0421 241.31 75.7472Z" fill="currentColor"></path><path d="M438 -3H421.694V102.197H438V-3Z" fill="currentColor"></path><path d="M139.43 102.197H155.735V48.2834H183.712V32.1665H139.43V102.197Z" fill="currentColor"></path><path d="M324.49 32.1665L303.995 85.794L283.498 32.1665H266.983L293.748 102.197H314.242L341.006 32.1665H324.49Z" fill="currentColor"></path><path d="M376.571 30.3656C356.603 30.3656 340.797 46.8497 340.797 67.1828C340.797 89.6597 356.094 104 378.661 104C391.29 104 399.354 99.1488 409.206 88.5848L398.189 80.0226C398.183 80.031 389.874 90.9895 377.468 90.9895C363.048 90.9895 356.977 79.3111 356.977 73.269H411.075C413.917 50.1328 398.775 30.3656 376.571 30.3656ZM357.02 61.0967C357.145 59.7487 359.023 43.3761 376.442 43.3761C393.861 43.3761 395.978 59.7464 396.099 61.0967H357.02Z" fill="currentColor"></path></svg> <svg class="w-[438px] max-w-none relative -mt-[6.6rem] -ml-8 lg:ml-0 [--stroke-color:#1B1B18] dark:[--stroke-color:#FF750F]" viewBox="0 0 440 392" fill="none" xmlns="http://www.w3.org/2000/svg"><g class="mix-blend-darken dark:mix-blend-normal transition-all delay-300 opacity-100 duration-750 starting:opacity-0 text-[#1B1B18] dark:text-black"><mask id="path-1-mask" maskUnits="userSpaceOnUse" x="-0.328613" y="103" width="338" height="299" fill="black"><rect fill="white" x="-0.328613" y="103" width="338" height="299"></rect><path d="M234.936 400.8C204.136 400.8 178.936 392.4 159.336 375.6C140.136 358.8 130.536 337 130.536 310.2H200.736C200.736 318.2 203.736 324.8 209.736 330C215.736 335.2 223.736 337.8 233.736 337.8C243.336 337.8 251.136 335 257.136 329.4C263.536 323.8 266.736 316.6 266.736 307.8C266.736 299.8 263.936 293.2 258.336 288C252.736 282.8 245.536 280.2 236.736 280.2H199.536V218.4H236.736C243.536 218.4 249.336 216 254.136 211.2C258.936 206.4 261.336 200.4 261.336 193.2C261.336 184.8 258.736 178.2 253.536 173.4C248.336 168.6 241.736 166.2 233.736 166.2C226.536 166.2 220.336 168.4 215.136 172.8C210.336 177.2 207.936 182.8 207.936 189.6H141.336C141.336 164.8 150.136 144.6 167.736 129C185.336 113 207.936 105 235.536 105C263.136 105 285.536 112.2 302.736 126.6C320.336 141 329.136 160 329.136 183.6C329.136 200.8 324.536 214.8 315.336 225.6C306.136 236 294.336 243.2 279.936 247.2C297.136 252 310.736 260.2 320.736 271.8C331.136 283.4 336.336 298 336.336 315.6C336.336 340.4 326.936 360.8 308.136 376.8C289.336 392.8 264.936 400.8 234.936 400.8Z"></path><path d="M26.8714 167.6H1.67139V105.2H94.6714V400.2H26.8714V167.6Z"></path></mask><path d="M234.936 400.8C204.136 400.8 178.936 392.4 159.336 375.6C140.136 358.8 130.536 337 130.536 310.2H200.736C200.736 318.2 203.736 324.8 209.736 330C215.736 335.2 223.736 337.8 233.736 337.8C243.336 337.8 251.136 335 257.136 329.4C263.536 323.8 266.736 316.6 266.736 307.8C266.736 299.8 263.936 293.2 258.336 288C252.736 282.8 245.536 280.2 236.736 280.2H199.536V218.4H236.736C243.536 218.4 249.336 216 254.136 211.2C258.936 206.4 261.336 200.4 261.336 193.2C261.336 184.8 258.736 178.2 253.536 173.4C248.336 168.6 241.736 166.2 233.736 166.2C226.536 166.2 220.336 168.4 215.136 172.8C210.336 177.2 207.936 182.8 207.936 189.6H141.336C141.336 164.8 150.136 144.6 167.736 129C185.336 113 207.936 105 235.536 105C263.136 105 285.536 112.2 302.736 126.6C320.336 141 329.136 160 329.136 183.6C329.136 200.8 324.536 214.8 315.336 225.6C306.136 236 294.336 243.2 279.936 247.2C297.136 252 310.736 260.2 320.736 271.8C331.136 283.4 336.336 298 336.336 315.6C336.336 340.4 326.936 360.8 308.136 376.8C289.336 392.8 264.936 400.8 234.936 400.8Z" fill="currentColor"></path><path d="M26.8714 167.6H1.67139V105.2H94.6714V400.2H26.8714V167.6Z" fill="currentColor"></path><path d="M234.936 400.8C204.136 400.8 178.936 392.4 159.336 375.6C140.136 358.8 130.536 337 130.536 310.2H200.736C200.736 318.2 203.736 324.8 209.736 330C215.736 335.2 223.736 337.8 233.736 337.8C243.336 337.8 251.136 335 257.136 329.4C263.536 323.8 266.736 316.6 266.736 307.8C266.736 299.8 263.936 293.2 258.336 288C252.736 282.8 245.536 280.2 236.736 280.2H199.536V218.4H236.736C243.536 218.4 249.336 216 254.136 211.2C258.936 206.4 261.336 200.4 261.336 193.2C261.336 184.8 258.736 178.2 253.536 173.4C248.336 168.6 241.736 166.2 233.736 166.2C226.536 166.2 220.336 168.4 215.136 172.8C210.336 177.2 207.936 182.8 207.936 189.6H141.336C141.336 164.8 150.136 144.6 167.736 129C185.336 113 207.936 105 235.536 105C263.136 105 285.536 112.2 302.736 126.6C320.336 141 329.136 160 329.136 183.6C329.136 200.8 324.536 214.8 315.336 225.6C306.136 236 294.336 243.2 279.936 247.2C297.136 252 310.736 260.2 320.736 271.8C331.136 283.4 336.336 298 336.336 315.6C336.336 340.4 326.936 360.8 308.136 376.8C289.336 392.8 264.936 400.8 234.936 400.8Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-1-mask)"></path><path d="M26.8714 167.6H1.67139V105.2H94.6714V400.2H26.8714V167.6Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-1-mask)"></path></g><g class="transition-all delay-400 opacity-100 duration-750 starting:opacity-0 motion-safe:starting:-translate-x-[26px] text-[#F3BEC7] dark:text-[#4B0600]"><mask id="path-2-mask" maskUnits="userSpaceOnUse" x="25.3357" y="103" width="338" height="299" fill="black"><rect fill="white" x="25.3357" y="103" width="338" height="299"></rect><path d="M260.6 400.8C229.8 400.8 204.6 392.4 185 375.6C165.8 358.8 156.2 337 156.2 310.2H226.4C226.4 318.2 229.4 324.8 235.4 330C241.4 335.2 249.4 337.8 259.4 337.8C269 337.8 276.8 335 282.8 329.4C289.2 323.8 292.4 316.6 292.4 307.8C292.4 299.8 289.6 293.2 284 288C278.4 282.8 271.2 280.2 262.4 280.2H225.2V218.4H262.4C269.2 218.4 275 216 279.8 211.2C284.6 206.4 287 200.4 287 193.2C287 184.8 284.4 178.2 279.2 173.4C274 168.6 267.4 166.2 259.4 166.2C252.2 166.2 246 168.4 240.8 172.8C236 177.2 233.6 182.8 233.6 189.6H167C167 164.8 175.8 144.6 193.4 129C211 113 233.6 105 261.2 105C288.8 105 311.2 112.2 328.4 126.6C346 141 354.8 160 354.8 183.6C354.8 200.8 350.2 214.8 341 225.6C331.8 236 320 243.2 305.6 247.2C322.8 252 336.4 260.2 346.4 271.8C356.8 283.4 362 298 362 315.6C362 340.4 352.6 360.8 333.8 376.8C315 392.8 290.6 400.8 260.6 400.8Z"></path><path d="M52.5357 167.6H27.3357V105.2H120.336V400.2H52.5357V167.6Z"></path></mask><path d="M260.6 400.8C229.8 400.8 204.6 392.4 185 375.6C165.8 358.8 156.2 337 156.2 310.2H226.4C226.4 318.2 229.4 324.8 235.4 330C241.4 335.2 249.4 337.8 259.4 337.8C269 337.8 276.8 335 282.8 329.4C289.2 323.8 292.4 316.6 292.4 307.8C292.4 299.8 289.6 293.2 284 288C278.4 282.8 271.2 280.2 262.4 280.2H225.2V218.4H262.4C269.2 218.4 275 216 279.8 211.2C284.6 206.4 287 200.4 287 193.2C287 184.8 284.4 178.2 279.2 173.4C274 168.6 267.4 166.2 259.4 166.2C252.2 166.2 246 168.4 240.8 172.8C236 177.2 233.6 182.8 233.6 189.6H167C167 164.8 175.8 144.6 193.4 129C211 113 233.6 105 261.2 105C288.8 105 311.2 112.2 328.4 126.6C346 141 354.8 160 354.8 183.6C354.8 200.8 350.2 214.8 341 225.6C331.8 236 320 243.2 305.6 247.2C322.8 252 336.4 260.2 346.4 271.8C356.8 283.4 362 298 362 315.6C362 340.4 352.6 360.8 333.8 376.8C315 392.8 290.6 400.8 260.6 400.8Z" fill="currentColor"></path><path d="M52.5357 167.6H27.3357V105.2H120.336V400.2H52.5357V167.6Z" fill="currentColor"></path><path d="M260.6 400.8C229.8 400.8 204.6 392.4 185 375.6C165.8 358.8 156.2 337 156.2 310.2H226.4C226.4 318.2 229.4 324.8 235.4 330C241.4 335.2 249.4 337.8 259.4 337.8C269 337.8 276.8 335 282.8 329.4C289.2 323.8 292.4 316.6 292.4 307.8C292.4 299.8 289.6 293.2 284 288C278.4 282.8 271.2 280.2 262.4 280.2H225.2V218.4H262.4C269.2 218.4 275 216 279.8 211.2C284.6 206.4 287 200.4 287 193.2C287 184.8 284.4 178.2 279.2 173.4C274 168.6 267.4 166.2 259.4 166.2C252.2 166.2 246 168.4 240.8 172.8C236 177.2 233.6 182.8 233.6 189.6H167C167 164.8 175.8 144.6 193.4 129C211 113 233.6 105 261.2 105C288.8 105 311.2 112.2 328.4 126.6C346 141 354.8 160 354.8 183.6C354.8 200.8 350.2 214.8 341 225.6C331.8 236 320 243.2 305.6 247.2C322.8 252 336.4 260.2 346.4 271.8C356.8 283.4 362 298 362 315.6C362 340.4 352.6 360.8 333.8 376.8C315 392.8 290.6 400.8 260.6 400.8Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-2-mask)"></path><path d="M52.5357 167.6H27.3357V105.2H120.336V400.2H52.5357V167.6Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-2-mask)"></path></g><g class="mix-blend-color dark:mix-blend-hard-light transition-all delay-400 opacity-100 duration-750 starting:opacity-0 motion-safe:starting:-translate-x-[51px] text-[#F8B803] dark:text-[#391800]"><mask id="path-3-mask" maskUnits="userSpaceOnUse" x="51" y="103" width="338" height="299" fill="black"><rect fill="white" x="51" y="103" width="338" height="299"></rect><path d="M286.264 400.8C255.464 400.8 230.264 392.4 210.664 375.6C191.464 358.8 181.864 337 181.864 310.2H252.064C252.064 318.2 255.064 324.8 261.064 330C267.064 335.2 275.064 337.8 285.064 337.8C294.664 337.8 302.464 335 308.464 329.4C314.864 323.8 318.064 316.6 318.064 307.8C318.064 299.8 315.264 293.2 309.664 288C304.064 282.8 296.864 280.2 288.064 280.2H250.864V218.4H288.064C294.864 218.4 300.664 216 305.464 211.2C310.264 206.4 312.664 200.4 312.664 193.2C312.664 184.8 310.064 178.2 304.864 173.4C299.664 168.6 293.064 166.2 285.064 166.2C277.864 166.2 271.664 168.4 266.464 172.8C261.664 177.2 259.264 182.8 259.264 189.6H192.664C192.664 164.8 201.464 144.6 219.064 129C236.664 113 259.264 105 286.864 105C314.464 105 336.864 112.2 354.064 126.6C371.664 141 380.464 160 380.464 183.6C380.464 200.8 375.864 214.8 366.664 225.6C357.464 236 345.664 243.2 331.264 247.2C348.464 252 362.064 260.2 372.064 271.8C382.464 283.4 387.664 298 387.664 315.6C387.664 340.4 378.264 360.8 359.464 376.8C340.664 392.8 316.264 400.8 286.264 400.8Z"></path><path d="M78.2 167.6H53V105.2H146V400.2H78.2V167.6Z"></path></mask><path d="M286.264 400.8C255.464 400.8 230.264 392.4 210.664 375.6C191.464 358.8 181.864 337 181.864 310.2H252.064C252.064 318.2 255.064 324.8 261.064 330C267.064 335.2 275.064 337.8 285.064 337.8C294.664 337.8 302.464 335 308.464 329.4C314.864 323.8 318.064 316.6 318.064 307.8C318.064 299.8 315.264 293.2 309.664 288C304.064 282.8 296.864 280.2 288.064 280.2H250.864V218.4H288.064C294.864 218.4 300.664 216 305.464 211.2C310.264 206.4 312.664 200.4 312.664 193.2C312.664 184.8 310.064 178.2 304.864 173.4C299.664 168.6 293.064 166.2 285.064 166.2C277.864 166.2 271.664 168.4 266.464 172.8C261.664 177.2 259.264 182.8 259.264 189.6H192.664C192.664 164.8 201.464 144.6 219.064 129C236.664 113 259.264 105 286.864 105C314.464 105 336.864 112.2 354.064 126.6C371.664 141 380.464 160 380.464 183.6C380.464 200.8 375.864 214.8 366.664 225.6C357.464 236 345.664 243.2 331.264 247.2C348.464 252 362.064 260.2 372.064 271.8C382.464 283.4 387.664 298 387.664 315.6C387.664 340.4 378.264 360.8 359.464 376.8C340.664 392.8 316.264 400.8 286.264 400.8Z" fill="currentColor"></path><path d="M78.2 167.6H53V105.2H146V400.2H78.2V167.6Z" fill="currentColor"></path><path d="M286.264 400.8C255.464 400.8 230.264 392.4 210.664 375.6C191.464 358.8 181.864 337 181.864 310.2H252.064C252.064 318.2 255.064 324.8 261.064 330C267.064 335.2 275.064 337.8 285.064 337.8C294.664 337.8 302.464 335 308.464 329.4C314.864 323.8 318.064 316.6 318.064 307.8C318.064 299.8 315.264 293.2 309.664 288C304.064 282.8 296.864 280.2 288.064 280.2H250.864V218.4H288.064C294.864 218.4 300.664 216 305.464 211.2C310.264 206.4 312.664 200.4 312.664 193.2C312.664 184.8 310.064 178.2 304.864 173.4C299.664 168.6 293.064 166.2 285.064 166.2C277.864 166.2 271.664 168.4 266.464 172.8C261.664 177.2 259.264 182.8 259.264 189.6H192.664C192.664 164.8 201.464 144.6 219.064 129C236.664 113 259.264 105 286.864 105C314.464 105 336.864 112.2 354.064 126.6C371.664 141 380.464 160 380.464 183.6C380.464 200.8 375.864 214.8 366.664 225.6C357.464 236 345.664 243.2 331.264 247.2C348.464 252 362.064 260.2 372.064 271.8C382.464 283.4 387.664 298 387.664 315.6C387.664 340.4 378.264 360.8 359.464 376.8C340.664 392.8 316.264 400.8 286.264 400.8Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-3-mask)"></path><path d="M78.2 167.6H53V105.2H146V400.2H78.2V167.6Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-3-mask)"></path></g><g class="mix-blend-multiply dark:mix-blend-normal transition-all delay-400 opacity-100 duration-750 starting:opacity-0 motion-safe:starting:-translate-x-[78px] text-[#F3BEC7] dark:text-[#733000]"><mask id="path-4-mask" maskUnits="userSpaceOnUse" x="76.6643" y="103" width="338" height="299" fill="black"><rect fill="white" x="76.6643" y="103" width="338" height="299"></rect><path d="M311.929 400.8C281.129 400.8 255.929 392.4 236.329 375.6C217.129 358.8 207.529 337 207.529 310.2H277.729C277.729 318.2 280.729 324.8 286.729 330C292.729 335.2 300.729 337.8 310.729 337.8C320.329 337.8 328.129 335 334.129 329.4C340.529 323.8 343.729 316.6 343.729 307.8C343.729 299.8 340.929 293.2 335.329 288C329.729 282.8 322.529 280.2 313.729 280.2H276.529V218.4H313.729C320.529 218.4 326.329 216 331.129 211.2C335.929 206.4 338.329 200.4 338.329 193.2C338.329 184.8 335.729 178.2 330.529 173.4C325.329 168.6 318.729 166.2 310.729 166.2C303.529 166.2 297.329 168.4 292.129 172.8C287.329 177.2 284.929 182.8 284.929 189.6H218.329C218.329 164.8 227.129 144.6 244.729 129C262.329 113 284.929 105 312.529 105C340.129 105 362.529 112.2 379.729 126.6C397.329 141 406.129 160 406.129 183.6C406.129 200.8 401.529 214.8 392.329 225.6C383.129 236 371.329 243.2 356.929 247.2C374.129 252 387.729 260.2 397.729 271.8C408.129 283.4 413.329 298 413.329 315.6C413.329 340.4 403.929 360.8 385.129 376.8C366.329 392.8 341.929 400.8 311.929 400.8Z"></path><path d="M103.864 167.6H78.6643V105.2H171.664V400.2H103.864V167.6Z"></path></mask><path d="M311.929 400.8C281.129 400.8 255.929 392.4 236.329 375.6C217.129 358.8 207.529 337 207.529 310.2H277.729C277.729 318.2 280.729 324.8 286.729 330C292.729 335.2 300.729 337.8 310.729 337.8C320.329 337.8 328.129 335 334.129 329.4C340.529 323.8 343.729 316.6 343.729 307.8C343.729 299.8 340.929 293.2 335.329 288C329.729 282.8 322.529 280.2 313.729 280.2H276.529V218.4H313.729C320.529 218.4 326.329 216 331.129 211.2C335.929 206.4 338.329 200.4 338.329 193.2C338.329 184.8 335.729 178.2 330.529 173.4C325.329 168.6 318.729 166.2 310.729 166.2C303.529 166.2 297.329 168.4 292.129 172.8C287.329 177.2 284.929 182.8 284.929 189.6H218.329C218.329 164.8 227.129 144.6 244.729 129C262.329 113 284.929 105 312.529 105C340.129 105 362.529 112.2 379.729 126.6C397.329 141 406.129 160 406.129 183.6C406.129 200.8 401.529 214.8 392.329 225.6C383.129 236 371.329 243.2 356.929 247.2C374.129 252 387.729 260.2 397.729 271.8C408.129 283.4 413.329 298 413.329 315.6C413.329 340.4 403.929 360.8 385.129 376.8C366.329 392.8 341.929 400.8 311.929 400.8Z" fill="currentColor"></path><path d="M103.864 167.6H78.6643V105.2H171.664V400.2H103.864V167.6Z" fill="currentColor"></path><path d="M311.929 400.8C281.129 400.8 255.929 392.4 236.329 375.6C217.129 358.8 207.529 337 207.529 310.2H277.729C277.729 318.2 280.729 324.8 286.729 330C292.729 335.2 300.729 337.8 310.729 337.8C320.329 337.8 328.129 335 334.129 329.4C340.529 323.8 343.729 316.6 343.729 307.8C343.729 299.8 340.929 293.2 335.329 288C329.729 282.8 322.529 280.2 313.729 280.2H276.529V218.4H313.729C320.529 218.4 326.329 216 331.129 211.2C335.929 206.4 338.329 200.4 338.329 193.2C338.329 184.8 335.729 178.2 330.529 173.4C325.329 168.6 318.729 166.2 310.729 166.2C303.529 166.2 297.329 168.4 292.129 172.8C287.329 177.2 284.929 182.8 284.929 189.6H218.329C218.329 164.8 227.129 144.6 244.729 129C262.329 113 284.929 105 312.529 105C340.129 105 362.529 112.2 379.729 126.6C397.329 141 406.129 160 406.129 183.6C406.129 200.8 401.529 214.8 392.329 225.6C383.129 236 371.329 243.2 356.929 247.2C374.129 252 387.729 260.2 397.729 271.8C408.129 283.4 413.329 298 413.329 315.6C413.329 340.4 403.929 360.8 385.129 376.8C366.329 392.8 341.929 400.8 311.929 400.8Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-4-mask)"></path><path d="M103.864 167.6H78.6643V105.2H171.664V400.2H103.864V167.6Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-4-mask)"></path></g><g class="mix-blend-hard-light transition-all delay-400 opacity-100 duration-750 starting:opacity-0 motion-safe:starting:-translate-x-[102px] text-[#F3BEC7] dark:text-[#4B0600]"><mask id="path-5-mask" maskUnits="userSpaceOnUse" x="102.329" y="103" width="338" height="299" fill="black"><rect fill="white" x="102.329" y="103" width="338" height="299"></rect><path d="M337.593 400.8C306.793 400.8 281.593 392.4 261.993 375.6C242.793 358.8 233.193 337 233.193 310.2H303.393C303.393 318.2 306.393 324.8 312.393 330C318.393 335.2 326.393 337.8 336.393 337.8C345.993 337.8 353.793 335 359.793 329.4C366.193 323.8 369.393 316.6 369.393 307.8C369.393 299.8 366.593 293.2 360.993 288C355.393 282.8 348.193 280.2 339.393 280.2H302.193V218.4H339.393C346.193 218.4 351.993 216 356.793 211.2C361.593 206.4 363.993 200.4 363.993 193.2C363.993 184.8 361.393 178.2 356.193 173.4C350.993 168.6 344.393 166.2 336.393 166.2C329.193 166.2 322.993 168.4 317.793 172.8C312.993 177.2 310.593 182.8 310.593 189.6H243.993C243.993 164.8 252.793 144.6 270.393 129C287.993 113 310.593 105 338.193 105C365.793 105 388.193 112.2 405.393 126.6C422.993 141 431.793 160 431.793 183.6C431.793 200.8 427.193 214.8 417.993 225.6C408.793 236 396.993 243.2 382.593 247.2C399.793 252 413.393 260.2 423.393 271.8C433.793 283.4 438.993 298 438.993 315.6C438.993 340.4 429.593 360.8 410.793 376.8C391.993 392.8 367.593 400.8 337.593 400.8Z"></path><path d="M129.529 167.6H104.329V105.2H197.329V400.2H129.529V167.6Z"></path></mask><path d="M337.593 400.8C306.793 400.8 281.593 392.4 261.993 375.6C242.793 358.8 233.193 337 233.193 310.2H303.393C303.393 318.2 306.393 324.8 312.393 330C318.393 335.2 326.393 337.8 336.393 337.8C345.993 337.8 353.793 335 359.793 329.4C366.193 323.8 369.393 316.6 369.393 307.8C369.393 299.8 366.593 293.2 360.993 288C355.393 282.8 348.193 280.2 339.393 280.2H302.193V218.4H339.393C346.193 218.4 351.993 216 356.793 211.2C361.593 206.4 363.993 200.4 363.993 193.2C363.993 184.8 361.393 178.2 356.193 173.4C350.993 168.6 344.393 166.2 336.393 166.2C329.193 166.2 322.993 168.4 317.793 172.8C312.993 177.2 310.593 182.8 310.593 189.6H243.993C243.993 164.8 252.793 144.6 270.393 129C287.993 113 310.593 105 338.193 105C365.793 105 388.193 112.2 405.393 126.6C422.993 141 431.793 160 431.793 183.6C431.793 200.8 427.193 214.8 417.993 225.6C408.793 236 396.993 243.2 382.593 247.2C399.793 252 413.393 260.2 423.393 271.8C433.793 283.4 438.993 298 438.993 315.6C438.993 340.4 429.593 360.8 410.793 376.8C391.993 392.8 367.593 400.8 337.593 400.8Z" fill="currentColor"></path><path d="M129.529 167.6H104.329V105.2H197.329V400.2H129.529V167.6Z" fill="currentColor"></path><path d="M337.593 400.8C306.793 400.8 281.593 392.4 261.993 375.6C242.793 358.8 233.193 337 233.193 310.2H303.393C303.393 318.2 306.393 324.8 312.393 330C318.393 335.2 326.393 337.8 336.393 337.8C345.993 337.8 353.793 335 359.793 329.4C366.193 323.8 369.393 316.6 369.393 307.8C369.393 299.8 366.593 293.2 360.993 288C355.393 282.8 348.193 280.2 339.393 280.2H302.193V218.4H339.393C346.193 218.4 351.993 216 356.793 211.2C361.593 206.4 363.993 200.4 363.993 193.2C363.993 184.8 361.393 178.2 356.193 173.4C350.993 168.6 344.393 166.2 336.393 166.2C329.193 166.2 322.993 168.4 317.793 172.8C312.993 177.2 310.593 182.8 310.593 189.6H243.993C243.993 164.8 252.793 144.6 270.393 129C287.993 113 310.593 105 338.193 105C365.793 105 388.193 112.2 405.393 126.6C422.993 141 431.793 160 431.793 183.6C431.793 200.8 427.193 214.8 417.993 225.6C408.793 236 396.993 243.2 382.593 247.2C399.793 252 413.393 260.2 423.393 271.8C433.793 283.4 438.993 298 438.993 315.6C438.993 340.4 429.593 360.8 410.793 376.8C391.993 392.8 367.593 400.8 337.593 400.8Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-5-mask)"></path><path d="M129.529 167.6H104.329V105.2H197.329V400.2H129.529V167.6Z" stroke="var(--stroke-color)" stroke-width="2.4" mask="url(#path-5-mask)"></path></g></svg> <div class="absolute inset-0 rounded-t-lg lg:rounded-t-none lg:rounded-r-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"></div></div></main></div> <div class="hidden h-14.5 lg:block"></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Welcome
}, Symbol.toStringTag, { value: "Module" }));
function InputError($$renderer, $$props) {
  let { message = "", class: className = "" } = $$props;
  if (message) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div${attr_class(clsx(className))}><p class="text-sm text-red-600 dark:text-red-500">${escape_html(message)}</p></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      type = "text",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    $$renderer2.push(`<input${attributes(
      {
        type,
        class: clsx(cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)),
        ...rest
      },
      void 0,
      void 0,
      void 0,
      4
    )}/>`);
  });
}
function PasswordInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<div class="relative">`);
    Input($$renderer2, spread_props([
      {
        type: "password",
        class: cn("pr-10", className)
      },
      rest
    ]));
    $$renderer2.push(`<!----> <button type="button" class="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 focus-visible:outline-none focus-visible:ring-[3px]"${attr("aria-label", "Show password")}${attr("tabindex", -1)}>`);
    {
      $$renderer2.push("<!--[-1-->");
      Eye($$renderer2, { class: "size-4" });
    }
    $$renderer2.push(`<!--]--></button></div>`);
  });
}
function Label($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children, $$slots, $$events, ...rest } = $$props;
    $$renderer2.push(`<label${attributes({
      class: clsx(cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)),
      ...rest
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></label>`);
  });
}
function Spinner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", $$slots, $$events, ...rest } = $$props;
    Loader_circle($$renderer2, spread_props([{ class: cn("animate-spin", className) }, rest]));
  });
}
function AuthSimpleLayout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { title = "", description = "", children } = $$props;
    $$renderer2.push(`<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"><div class="w-full max-w-sm"><div class="flex flex-col gap-8"><div class="flex flex-col items-center gap-4">`);
    Link($$renderer2, {
      href: home(),
      class: "flex flex-col items-center gap-2 font-medium",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="mb-1 flex h-9 w-9 items-center justify-center rounded-md">`);
        AppLogoIcon($$renderer3, {
          class: "size-9 fill-current text-(--foreground) dark:text-white"
        });
        $$renderer3.push(`<!----></div> <span class="sr-only">${escape_html(title)}</span>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="space-y-2 text-center"><h1 class="text-xl font-medium">${escape_html(title)}</h1> <p class="text-center text-sm text-muted-foreground">${escape_html(description)}</p></div></div> `);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div></div></div>`);
  });
}
function AuthLayout_1($$renderer, $$props) {
  let { title = "", description = "", children } = $$props;
  AuthSimpleLayout($$renderer, {
    title,
    description,
    children: ($$renderer2) => {
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    }
  });
}
const store$3 = (options) => ({
  url: store$3.url(options),
  method: "post"
});
store$3.definition = {
  methods: ["post"],
  url: "/user/confirm-password"
};
store$3.url = (options) => {
  return store$3.definition.url + queryParams(options);
};
store$3.post = (options) => ({
  url: store$3.url(options),
  method: "post"
});
const storeForm$3 = (options) => ({
  action: store$3.url(options),
  method: "post"
});
storeForm$3.post = (options) => ({
  action: store$3.url(options),
  method: "post"
});
store$3.form = storeForm$3;
const confirm$2 = {
  store: Object.assign(store$3, store$3)
};
function ConfirmPassword($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    AppHead($$renderer2, { title: "Confirm password" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Confirm your password",
      description: "This is a secure area of the application. Please confirm your password before continuing.",
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, { errors, processing }) {
            $$renderer4.push(`<div class="space-y-6"><div class="grid gap-2">`);
            Label($$renderer4, {
              for: "password",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            PasswordInput($$renderer4, {
              id: "password",
              name: "password",
              class: "mt-1 block w-full",
              required: true,
              autocomplete: "current-password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password });
            $$renderer4.push(`<!----></div> <div class="flex items-center">`);
            Button($$renderer4, {
              type: "submit",
              class: "w-full",
              disabled: processing,
              "data-test": "confirm-password-button",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Confirm password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div></div>`);
          };
          Form($$renderer3, spread_props([
            store$3.form(),
            { resetOnSuccess: true, children, $$slots: { default: true } }
          ]));
        }
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ConfirmPassword
}, Symbol.toStringTag, { value: "Module" }));
function TextLink($$renderer, $$props) {
  let {
    href,
    tabindex,
    method,
    as,
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  Link($$renderer, spread_props([
    {
      href,
      tabindex,
      method,
      as,
      class: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
    },
    rest,
    {
      children: ($$renderer2) => {
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
const request = (options) => ({
  url: request.url(options),
  method: "get"
});
request.definition = {
  methods: ["get", "head"],
  url: "/forgot-password"
};
request.url = (options) => {
  return request.definition.url + queryParams(options);
};
request.get = (options) => ({
  url: request.url(options),
  method: "get"
});
request.head = (options) => ({
  url: request.url(options),
  method: "head"
});
const requestForm = (options) => ({
  action: request.url(options),
  method: "get"
});
requestForm.get = (options) => ({
  action: request.url(options),
  method: "get"
});
requestForm.head = (options) => ({
  action: request.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
request.form = requestForm;
const reset = (args, options) => ({
  url: reset.url(args, options),
  method: "get"
});
reset.definition = {
  methods: ["get", "head"],
  url: "/reset-password/{token}"
};
reset.url = (args, options) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { token: args };
  }
  if (Array.isArray(args)) {
    args = {
      token: args[0]
    };
  }
  args = applyUrlDefaults(args);
  const parsedArgs = {
    token: args.token
  };
  return reset.definition.url.replace("{token}", parsedArgs.token.toString()).replace(/\/+$/, "") + queryParams(options);
};
reset.get = (args, options) => ({
  url: reset.url(args, options),
  method: "get"
});
reset.head = (args, options) => ({
  url: reset.url(args, options),
  method: "head"
});
const resetForm = (args, options) => ({
  action: reset.url(args, options),
  method: "get"
});
resetForm.get = (args, options) => ({
  action: reset.url(args, options),
  method: "get"
});
resetForm.head = (args, options) => ({
  action: reset.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
reset.form = resetForm;
const email = (options) => ({
  url: email.url(options),
  method: "post"
});
email.definition = {
  methods: ["post"],
  url: "/forgot-password"
};
email.url = (options) => {
  return email.definition.url + queryParams(options);
};
email.post = (options) => ({
  url: email.url(options),
  method: "post"
});
const emailForm = (options) => ({
  action: email.url(options),
  method: "post"
});
emailForm.post = (options) => ({
  action: email.url(options),
  method: "post"
});
email.form = emailForm;
const update$2 = (options) => ({
  url: update$2.url(options),
  method: "post"
});
update$2.definition = {
  methods: ["post"],
  url: "/reset-password"
};
update$2.url = (options) => {
  return update$2.definition.url + queryParams(options);
};
update$2.post = (options) => ({
  url: update$2.url(options),
  method: "post"
});
const updateForm$2 = (options) => ({
  action: update$2.url(options),
  method: "post"
});
updateForm$2.post = (options) => ({
  action: update$2.url(options),
  method: "post"
});
update$2.form = updateForm$2;
const confirm$1 = (options) => ({
  url: confirm$1.url(options),
  method: "get"
});
confirm$1.definition = {
  methods: ["get", "head"],
  url: "/user/confirm-password"
};
confirm$1.url = (options) => {
  return confirm$1.definition.url + queryParams(options);
};
confirm$1.get = (options) => ({
  url: confirm$1.url(options),
  method: "get"
});
confirm$1.head = (options) => ({
  url: confirm$1.url(options),
  method: "head"
});
const confirmForm$1 = (options) => ({
  action: confirm$1.url(options),
  method: "get"
});
confirmForm$1.get = (options) => ({
  action: confirm$1.url(options),
  method: "get"
});
confirmForm$1.head = (options) => ({
  action: confirm$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
confirm$1.form = confirmForm$1;
const confirmation = (options) => ({
  url: confirmation.url(options),
  method: "get"
});
confirmation.definition = {
  methods: ["get", "head"],
  url: "/user/confirmed-password-status"
};
confirmation.url = (options) => {
  return confirmation.definition.url + queryParams(options);
};
confirmation.get = (options) => ({
  url: confirmation.url(options),
  method: "get"
});
confirmation.head = (options) => ({
  url: confirmation.url(options),
  method: "head"
});
const confirmationForm = (options) => ({
  action: confirmation.url(options),
  method: "get"
});
confirmationForm.get = (options) => ({
  action: confirmation.url(options),
  method: "get"
});
confirmationForm.head = (options) => ({
  action: confirmation.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
confirmation.form = confirmationForm;
({
  request: Object.assign(request, request),
  reset: Object.assign(reset, reset),
  email: Object.assign(email, email),
  update: Object.assign(update$2, update$2),
  confirm: Object.assign(confirm$1, confirm$2),
  confirmation: Object.assign(confirmation, confirmation)
});
function ForgotPassword($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { status = "" } = $$props;
    AppHead($$renderer2, { title: "Forgot password" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Forgot password",
      description: "Enter your email to receive a password reset link",
      children: ($$renderer3) => {
        if (status) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mb-4 text-center text-sm font-medium text-green-600">${escape_html(status)}</div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <div class="space-y-6">`);
        {
          let children = function($$renderer4, { errors, processing }) {
            $$renderer4.push(`<div class="grid gap-2">`);
            Label($$renderer4, {
              for: "email",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Email address`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "email",
              type: "email",
              name: "email",
              autocomplete: "off",
              placeholder: "email@example.com"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.email });
            $$renderer4.push(`<!----></div> <div class="my-6 flex items-center justify-start">`);
            Button($$renderer4, {
              type: "submit",
              class: "w-full",
              disabled: processing,
              "data-test": "email-password-reset-link-button",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Email password reset link`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          };
          Form($$renderer3, spread_props([email.form(), { children, $$slots: { default: true } }]));
        }
        $$renderer3.push(`<!----> <div class="space-x-1 text-center text-sm text-muted-foreground"><span>Or, return to</span> `);
        TextLink($$renderer3, {
          href: login$2(),
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->log in`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div></div>`);
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
function Checkbox($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      checked = false,
      disabled = false,
      class: className = "",
      id,
      name,
      value,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    $$renderer2.push(`<button${attributes({
      type: "button",
      role: "checkbox",
      "aria-checked": checked,
      "data-state": checked ? "checked" : "unchecked",
      "data-slot": "checkbox",
      disabled,
      id,
      class: clsx(cn("peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-lg border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)),
      ...rest
    })}>`);
    if (checked) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div data-slot="checkbox-indicator" class="grid place-content-center text-current transition-none">`);
      Check($$renderer2, { class: "size-3.5" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<input type="hidden"${attr("name", name)}${attr("value", value)}/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { checked });
  });
}
const store$2 = (options) => ({
  url: store$2.url(options),
  method: "post"
});
store$2.definition = {
  methods: ["post"],
  url: "/login"
};
store$2.url = (options) => {
  return store$2.definition.url + queryParams(options);
};
store$2.post = (options) => ({
  url: store$2.url(options),
  method: "post"
});
const storeForm$2 = (options) => ({
  action: store$2.url(options),
  method: "post"
});
storeForm$2.post = (options) => ({
  action: store$2.url(options),
  method: "post"
});
store$2.form = storeForm$2;
({
  store: Object.assign(store$2, store$2)
});
function Login($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { status = "", canResetPassword, canRegister } = $$props;
    AppHead($$renderer2, { title: "Log in" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Log in to your account",
      description: "Enter your email and password below to log in",
      children: ($$renderer3) => {
        if (status) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mb-4 text-center text-sm font-medium text-green-600">${escape_html(status)}</div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          let children = function($$renderer4, { errors, processing }) {
            $$renderer4.push(`<div class="grid gap-6"><div class="grid gap-2">`);
            Label($$renderer4, {
              for: "email",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Email address`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "email",
              type: "email",
              name: "email",
              required: true,
              autocomplete: "email",
              placeholder: "email@example.com"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.email });
            $$renderer4.push(`<!----></div> <div class="grid gap-2"><div class="flex items-center justify-between">`);
            Label($$renderer4, {
              for: "password",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            if (canResetPassword) {
              $$renderer4.push("<!--[0-->");
              TextLink($$renderer4, {
                href: request(),
                class: "text-sm",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Forgot password?`);
                },
                $$slots: { default: true }
              });
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--></div> `);
            PasswordInput($$renderer4, {
              id: "password",
              name: "password",
              required: true,
              autocomplete: "current-password",
              placeholder: "Password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password });
            $$renderer4.push(`<!----></div> <div class="flex items-center justify-between">`);
            Label($$renderer4, {
              for: "remember",
              class: "flex items-center space-x-3",
              children: ($$renderer5) => {
                Checkbox($$renderer5, { id: "remember", name: "remember" });
                $$renderer5.push(`<!----> <span>Remember me</span>`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div> `);
            Button($$renderer4, {
              type: "submit",
              class: "mt-4 w-full",
              disabled: processing,
              "data-test": "login-button",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Log in`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div> `);
            if (canRegister) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="text-center text-sm text-muted-foreground">Don't have an account? `);
              TextLink($$renderer4, {
                href: register(),
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Sign up`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]-->`);
          };
          Form($$renderer3, spread_props([
            store$2.form(),
            {
              resetOnSuccess: ["password"],
              class: "flex flex-col gap-6",
              children,
              $$slots: { default: true }
            }
          ]));
        }
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const store$1 = (options) => ({
  url: store$1.url(options),
  method: "post"
});
store$1.definition = {
  methods: ["post"],
  url: "/register"
};
store$1.url = (options) => {
  return store$1.definition.url + queryParams(options);
};
store$1.post = (options) => ({
  url: store$1.url(options),
  method: "post"
});
const storeForm$1 = (options) => ({
  action: store$1.url(options),
  method: "post"
});
storeForm$1.post = (options) => ({
  action: store$1.url(options),
  method: "post"
});
store$1.form = storeForm$1;
({
  store: Object.assign(store$1, store$1)
});
function Register($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    AppHead($$renderer2, { title: "Register" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Create an account",
      description: "Enter your details below to create your account",
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, { errors, processing }) {
            $$renderer4.push(`<div class="grid gap-6"><div class="grid gap-2">`);
            Label($$renderer4, {
              for: "name",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Name`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "name",
              type: "text",
              required: true,
              autocomplete: "name",
              name: "name",
              placeholder: "Full name"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.name });
            $$renderer4.push(`<!----></div> <div class="grid gap-2">`);
            Label($$renderer4, {
              for: "email",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Email address`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "email",
              type: "email",
              required: true,
              autocomplete: "email",
              name: "email",
              placeholder: "email@example.com"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.email });
            $$renderer4.push(`<!----></div> <div class="grid gap-2">`);
            Label($$renderer4, {
              for: "password",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            PasswordInput($$renderer4, {
              id: "password",
              required: true,
              autocomplete: "new-password",
              name: "password",
              placeholder: "Password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password });
            $$renderer4.push(`<!----></div> <div class="grid gap-2">`);
            Label($$renderer4, {
              for: "password_confirmation",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Confirm password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            PasswordInput($$renderer4, {
              id: "password_confirmation",
              required: true,
              autocomplete: "new-password",
              name: "password_confirmation",
              placeholder: "Confirm password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password_confirmation });
            $$renderer4.push(`<!----></div> `);
            Button($$renderer4, {
              type: "submit",
              class: "mt-2 w-full",
              disabled: processing,
              "data-test": "register-user-button",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Create account`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div> <div class="text-center text-sm text-muted-foreground">Already have an account? `);
            TextLink($$renderer4, {
              href: login$2(),
              class: "underline underline-offset-4",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Log in`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          };
          Form($$renderer3, spread_props([
            store$1.form(),
            {
              resetOnSuccess: ["password", "password_confirmation"],
              class: "flex flex-col gap-6",
              children,
              $$slots: { default: true }
            }
          ]));
        }
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
function ResetPassword($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { token, email: email2 } = $$props;
    AppHead($$renderer2, { title: "Reset password" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Reset password",
      description: "Please enter your new password below",
      children: ($$renderer3) => {
        {
          let children = function($$renderer4, { errors, processing }) {
            $$renderer4.push(`<div class="grid gap-6"><div class="grid gap-2">`);
            Label($$renderer4, {
              for: "email",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Email`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "email",
              type: "email",
              name: "email",
              autocomplete: "email",
              value: email2,
              class: "mt-1 block w-full",
              readonly: true
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.email, class: "mt-2" });
            $$renderer4.push(`<!----></div> <div class="grid gap-2">`);
            Label($$renderer4, {
              for: "password",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            PasswordInput($$renderer4, {
              id: "password",
              name: "password",
              autocomplete: "new-password",
              class: "mt-1 block w-full",
              placeholder: "Password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password });
            $$renderer4.push(`<!----></div> <div class="grid gap-2">`);
            Label($$renderer4, {
              for: "password_confirmation",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Confirm password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            PasswordInput($$renderer4, {
              id: "password_confirmation",
              name: "password_confirmation",
              autocomplete: "new-password",
              class: "mt-1 block w-full",
              placeholder: "Confirm password"
            });
            $$renderer4.push(`<!----> `);
            InputError($$renderer4, { message: errors.password_confirmation });
            $$renderer4.push(`<!----></div> `);
            Button($$renderer4, {
              type: "submit",
              class: "mt-4 w-full",
              disabled: processing,
              "data-test": "reset-password-button",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Reset password`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          };
          Form($$renderer3, spread_props([
            update$2.form(),
            {
              transform: (data) => ({ ...data, token, email: email2 }),
              resetOnSuccess: ["password", "password_confirmation"],
              children,
              $$slots: { default: true }
            }
          ]));
        }
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword
}, Symbol.toStringTag, { value: "Module" }));
const INPUT_OTP_CONTEXT = /* @__PURE__ */ Symbol("input-otp");
function setInputOTPContext(ctx) {
  setContext(INPUT_OTP_CONTEXT, ctx);
}
function getInputOTPContext() {
  return getContext(INPUT_OTP_CONTEXT);
}
function InputOTP($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      maxlength = 6,
      disabled = false,
      id,
      class: className = "",
      children,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    let inputRef;
    let isFocused = false;
    setInputOTPContext({
      value: () => value,
      activeIndex: () => -1,
      isFocused: () => isFocused,
      focus: () => inputRef?.focus()
    });
    $$renderer2.push(`<div${attributes({
      "data-slot": "input-otp",
      class: clsx(cn("relative flex items-center gap-2 has-disabled:opacity-50", className)),
      role: "group",
      ...rest
    })}><input${attr("id", id)}${attr("disabled", disabled, true)} type="text" inputmode="numeric" autocomplete="one-time-code"${attr("value", value)} class="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"/> <div class="pointer-events-none">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div></div>`);
    bind_props($$props, { value });
  });
}
function InputOTPGroup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="input-otp-group"${attr_class(clsx(cn("flex items-center", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function InputOTPSlot($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { index, class: className = "" } = $$props;
    const ctx = getInputOTPContext();
    const char = derived(() => ctx.value()[index]);
    const isActive = derived(() => ctx.isFocused() && ctx.activeIndex() === index);
    const hasFakeCaret = derived(() => isActive() && !char());
    $$renderer2.push(`<div data-slot="input-otp-slot"${attr("data-active", isActive())}${attr_class(clsx(cn("data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]", className)))}>${escape_html(char() ?? "")} `);
    if (hasFakeCaret()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="pointer-events-none absolute inset-0 flex items-center justify-center"><div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
const store = (options) => ({
  url: store.url(options),
  method: "post"
});
store.definition = {
  methods: ["post"],
  url: "/two-factor-challenge"
};
store.url = (options) => {
  return store.definition.url + queryParams(options);
};
store.post = (options) => ({
  url: store.url(options),
  method: "post"
});
const storeForm = (options) => ({
  action: store.url(options),
  method: "post"
});
storeForm.post = (options) => ({
  action: store.url(options),
  method: "post"
});
store.form = storeForm;
const login$1 = {
  store: Object.assign(store, store)
};
function TwoFactorChallenge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let code = "";
    const authConfigContent = derived(() => {
      return {
        title: "Authentication code",
        description: "Enter the authentication code provided by your authenticator application.",
        buttonText: "login using a recovery code"
      };
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      AppHead($$renderer3, { title: "Two-factor authentication" });
      $$renderer3.push(`<!----> `);
      AuthLayout_1($$renderer3, {
        title: authConfigContent().title,
        description: authConfigContent().description,
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="space-y-6">`);
          {
            $$renderer4.push("<!--[0-->");
            {
              let children = function($$renderer5, { errors, processing, clearErrors }) {
                $$renderer5.push(`<input type="hidden" name="code"${attr("value", code)}/> <div class="flex flex-col items-center justify-center space-y-3 text-center"><div class="flex w-full items-center justify-center">`);
                InputOTP($$renderer5, {
                  id: "otp",
                  maxlength: 6,
                  disabled: processing,
                  get value() {
                    return code;
                  },
                  set value($$value) {
                    code = $$value;
                    $$settled = false;
                  },
                  children: ($$renderer6) => {
                    InputOTPGroup($$renderer6, {
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!--[-->`);
                        const each_array = ensure_array_like({ length: 6 });
                        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                          each_array[i];
                          InputOTPSlot($$renderer7, { index: i });
                        }
                        $$renderer7.push(`<!--]-->`);
                      }
                    });
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div> `);
                InputError($$renderer5, { message: errors.code });
                $$renderer5.push(`<!----></div> `);
                Button($$renderer5, {
                  type: "submit",
                  class: "w-full",
                  disabled: processing,
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Continue`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> <div class="text-center text-sm text-muted-foreground"><span>or you can</span> <button type="button" class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500">${escape_html(authConfigContent().buttonText)}</button></div>`);
              };
              Form($$renderer4, spread_props([
                store.form(),
                {
                  class: "space-y-4",
                  resetOnError: true,
                  onError: () => code = "",
                  children,
                  $$slots: { default: true }
                }
              ]));
            }
          }
          $$renderer4.push(`<!--]--></div>`);
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TwoFactorChallenge
}, Symbol.toStringTag, { value: "Module" }));
const notice = (options) => ({
  url: notice.url(options),
  method: "get"
});
notice.definition = {
  methods: ["get", "head"],
  url: "/email/verify"
};
notice.url = (options) => {
  return notice.definition.url + queryParams(options);
};
notice.get = (options) => ({
  url: notice.url(options),
  method: "get"
});
notice.head = (options) => ({
  url: notice.url(options),
  method: "head"
});
const noticeForm = (options) => ({
  action: notice.url(options),
  method: "get"
});
noticeForm.get = (options) => ({
  action: notice.url(options),
  method: "get"
});
noticeForm.head = (options) => ({
  action: notice.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
notice.form = noticeForm;
const verify = (args, options) => ({
  url: verify.url(args, options),
  method: "get"
});
verify.definition = {
  methods: ["get", "head"],
  url: "/email/verify/{id}/{hash}"
};
verify.url = (args, options) => {
  if (Array.isArray(args)) {
    args = {
      id: args[0],
      hash: args[1]
    };
  }
  args = applyUrlDefaults(args);
  const parsedArgs = {
    id: args.id,
    hash: args.hash
  };
  return verify.definition.url.replace("{id}", parsedArgs.id.toString()).replace("{hash}", parsedArgs.hash.toString()).replace(/\/+$/, "") + queryParams(options);
};
verify.get = (args, options) => ({
  url: verify.url(args, options),
  method: "get"
});
verify.head = (args, options) => ({
  url: verify.url(args, options),
  method: "head"
});
const verifyForm = (args, options) => ({
  action: verify.url(args, options),
  method: "get"
});
verifyForm.get = (args, options) => ({
  action: verify.url(args, options),
  method: "get"
});
verifyForm.head = (args, options) => ({
  action: verify.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
verify.form = verifyForm;
const send = (options) => ({
  url: send.url(options),
  method: "post"
});
send.definition = {
  methods: ["post"],
  url: "/email/verification-notification"
};
send.url = (options) => {
  return send.definition.url + queryParams(options);
};
send.post = (options) => ({
  url: send.url(options),
  method: "post"
});
const sendForm = (options) => ({
  action: send.url(options),
  method: "post"
});
sendForm.post = (options) => ({
  action: send.url(options),
  method: "post"
});
send.form = sendForm;
({
  notice: Object.assign(notice, notice),
  verify: Object.assign(verify, verify),
  send: Object.assign(send, send)
});
function VerifyEmail($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { status = "" } = $$props;
    AppHead($$renderer2, { title: "Email verification" });
    $$renderer2.push(`<!----> `);
    AuthLayout_1($$renderer2, {
      title: "Verify email",
      description: "Please verify your email address by clicking on the link we just emailed to you.",
      children: ($$renderer3) => {
        if (status === "verification-link-sent") {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="mb-4 text-center text-sm font-medium text-green-600">A new verification link has been sent to the email address you
            provided during registration.</div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        {
          let children = function($$renderer4, { processing }) {
            Button($$renderer4, {
              type: "submit",
              disabled: processing,
              variant: "secondary",
              children: ($$renderer5) => {
                if (processing) {
                  $$renderer5.push("<!--[0-->");
                  Spinner($$renderer5, {});
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> Resend verification email`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            TextLink($$renderer4, {
              href: logout(),
              as: "button",
              class: "mx-auto block text-sm",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Log out`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          };
          Form($$renderer3, spread_props([
            send.form(),
            {
              class: "space-y-6 text-center",
              children,
              $$slots: { default: true }
            }
          ]));
        }
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: VerifyEmail
}, Symbol.toStringTag, { value: "Module" }));
const appearance = { value: "system" };
const prefersDark = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const isDarkMode = (value) => {
  return value === "dark" || value === "system" && prefersDark();
};
const getResolvedAppearance = () => {
  return isDarkMode(appearance.value) ? "dark" : "light";
};
const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};
const applyTheme = (value) => {
  if (typeof document === "undefined") {
    return;
  }
  const isDark = isDarkMode(value);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};
function updateAppearance(value) {
  appearance.value = value;
  if (typeof window !== "undefined") {
    localStorage.setItem("appearance", value);
  }
  setCookie("appearance", value);
  applyTheme(value);
}
function themeState() {
  return {
    appearance,
    resolvedAppearance: getResolvedAppearance,
    updateAppearance
  };
}
function AppearanceTabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { appearance: appearance2 } = themeState();
    const tabs = [
      { value: "light", Icon: Sun, label: "Light" },
      { value: "dark", Icon: Moon, label: "Dark" },
      { value: "system", Icon: Monitor, label: "System" }
    ];
    $$renderer2.push(`<div class="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let { value, Icon: Icon2, label } = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`flex items-center rounded-md px-3.5 py-1.5 transition-colors ${stringify(appearance2.value === value ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100" : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60")}`)}>`);
      Icon2($$renderer2, { class: "-ml-1 h-4 w-4" });
      $$renderer2.push(`<!----> <span class="ml-1.5 text-sm">${escape_html(label)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Heading($$renderer, $$props) {
  let { title, description = "", variant = "default" } = $$props;
  $$renderer.push(`<header${attr_class(clsx(variant === "small" ? "" : "mb-8 space-y-0.5"))}><h2${attr_class(clsx(variant === "small" ? "mb-0.5 text-base font-medium" : "text-xl font-semibold tracking-tight"))}>${escape_html(title)}</h2> `);
  if (description) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="text-sm text-muted-foreground">${escape_html(description)}</p>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></header>`);
}
function Separator($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      class: className = "",
      orientation = "horizontal",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const base = derived(() => orientation === "vertical" ? "h-full w-px bg-border" : "h-px w-full bg-border");
    $$renderer2.push(`<div${attributes({ class: clsx(cn("shrink-0", base(), className)), ...rest })}></div>`);
  });
}
const edit$3 = (options) => ({
  url: edit$3.url(options),
  method: "get"
});
edit$3.definition = {
  methods: ["get", "head"],
  url: "/settings/appearance"
};
edit$3.url = (options) => {
  return edit$3.definition.url + queryParams(options);
};
edit$3.get = (options) => ({
  url: edit$3.url(options),
  method: "get"
});
edit$3.head = (options) => ({
  url: edit$3.url(options),
  method: "head"
});
const editForm$3 = (options) => ({
  action: edit$3.url(options),
  method: "get"
});
editForm$3.get = (options) => ({
  action: edit$3.url(options),
  method: "get"
});
editForm$3.head = (options) => ({
  action: edit$3.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit$3.form = editForm$3;
({
  edit: Object.assign(edit$3, edit$3)
});
const edit$2 = (options) => ({
  url: edit$2.url(options),
  method: "get"
});
edit$2.definition = {
  methods: ["get", "head"],
  url: "/settings/security"
};
edit$2.url = (options) => {
  return edit$2.definition.url + queryParams(options);
};
edit$2.get = (options) => ({
  url: edit$2.url(options),
  method: "get"
});
edit$2.head = (options) => ({
  url: edit$2.url(options),
  method: "head"
});
const editForm$2 = (options) => ({
  action: edit$2.url(options),
  method: "get"
});
editForm$2.get = (options) => ({
  action: edit$2.url(options),
  method: "get"
});
editForm$2.head = (options) => ({
  action: edit$2.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit$2.form = editForm$2;
({
  edit: Object.assign(edit$2, edit$2)
});
function Layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    const sidebarNavItems = [
      { title: "Profile", href: edit$4() },
      { title: "Security", href: edit$2() },
      { title: "Appearance", href: edit$3() }
    ];
    const { currentUrl: currentUrl2, isCurrentOrParentUrl } = currentUrlState();
    $$renderer2.push(`<div class="px-4 py-6">`);
    Heading($$renderer2, {
      title: "Settings",
      description: "Manage your profile and account settings"
    });
    $$renderer2.push(`<!----> <div class="flex flex-col lg:flex-row lg:space-x-12"><aside class="w-full max-w-xl lg:w-48"><nav class="flex flex-col space-y-1 space-x-0" aria-label="Settings"><!--[-->`);
    const each_array = ensure_array_like(sidebarNavItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      {
        let children2 = function($$renderer3, props) {
          Link($$renderer3, {
            href: toUrl(item.href),
            class: props.class,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(item.title)}`);
            },
            $$slots: { default: true }
          });
        };
        Button($$renderer2, {
          variant: "ghost",
          class: `w-full justify-start ${stringify(isCurrentOrParentUrl(item.href, store_get($$store_subs ??= {}, "$currentUrl", currentUrl2)) ? "bg-muted" : "")}`,
          asChild: true,
          children: children2,
          $$slots: { default: true }
        });
      }
    }
    $$renderer2.push(`<!--]--></nav></aside> `);
    Separator($$renderer2, { class: "my-6 lg:hidden" });
    $$renderer2.push(`<!----> <div class="flex-1 md:max-w-2xl"><section class="max-w-xl space-y-12">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></section></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Appearance($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const breadcrumbItems = [{ title: "Appearance settings", href: edit$3() }];
    AppHead($$renderer2, { title: "Appearance settings" });
    $$renderer2.push(`<!----> `);
    AppLayout_1($$renderer2, {
      breadcrumbs: breadcrumbItems,
      children: ($$renderer3) => {
        $$renderer3.push(`<h1 class="sr-only">Appearance settings</h1> `);
        Layout($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="space-y-6">`);
            Heading($$renderer4, {
              variant: "small",
              title: "Appearance settings",
              description: "Update your account's appearance settings"
            });
            $$renderer4.push(`<!----> `);
            AppearanceTabs($$renderer4);
            $$renderer4.push(`<!----></div>`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Appearance
}, Symbol.toStringTag, { value: "Module" }));
const edit$1 = (options) => ({
  url: edit$1.url(options),
  method: "get"
});
edit$1.definition = {
  methods: ["get", "head"],
  url: "/settings/profile"
};
edit$1.url = (options) => {
  return edit$1.definition.url + queryParams(options);
};
edit$1.get = (options) => ({
  url: edit$1.url(options),
  method: "get"
});
edit$1.head = (options) => ({
  url: edit$1.url(options),
  method: "head"
});
const editForm$1 = (options) => ({
  action: edit$1.url(options),
  method: "get"
});
editForm$1.get = (options) => ({
  action: edit$1.url(options),
  method: "get"
});
editForm$1.head = (options) => ({
  action: edit$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit$1.form = editForm$1;
const update$1 = (options) => ({
  url: update$1.url(options),
  method: "patch"
});
update$1.definition = {
  methods: ["patch"],
  url: "/settings/profile"
};
update$1.url = (options) => {
  return update$1.definition.url + queryParams(options);
};
update$1.patch = (options) => ({
  url: update$1.url(options),
  method: "patch"
});
const updateForm$1 = (options) => ({
  action: update$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
updateForm$1.patch = (options) => ({
  action: update$1.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
update$1.form = updateForm$1;
const destroy = (options) => ({
  url: destroy.url(options),
  method: "delete"
});
destroy.definition = {
  methods: ["delete"],
  url: "/settings/profile"
};
destroy.url = (options) => {
  return destroy.definition.url + queryParams(options);
};
destroy.delete = (options) => ({
  url: destroy.url(options),
  method: "delete"
});
const destroyForm = (options) => ({
  action: destroy.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroyForm.delete = (options) => ({
  action: destroy.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
destroy.form = destroyForm;
const ProfileController = { update: update$1, destroy };
const DIALOG_CONTEXT = /* @__PURE__ */ Symbol("dialog");
function Dialog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, children } = $$props;
    const context = {
      open: () => open,
      setOpen: (value) => {
        open = value;
      }
    };
    setContext(DIALOG_CONTEXT, context);
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { open });
  });
}
function DialogClose($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { asChild = false, children } = $$props;
    const { setOpen } = getContext(DIALOG_CONTEXT);
    const handleClick = () => setOpen(false);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { onClick: handleClick });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button type="button">`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DialogContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    const { open, setOpen } = getContext(DIALOG_CONTEXT);
    if (open()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center"><button type="button" class="fixed inset-0 bg-black/50" aria-label="Close"></button> <div${attr_class(clsx(cn("relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg", className)))} role="dialog" aria-modal="true">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DialogDescription($$renderer, $$props) {
  $$renderer.push(`<p class="text-sm text-muted-foreground"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></p>`);
}
function DialogFooter($$renderer, $$props) {
  $$renderer.push(`<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></div>`);
}
function DialogTitle($$renderer, $$props) {
  $$renderer.push(`<h2 class="text-lg font-semibold leading-none tracking-tight"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></h2>`);
}
function DialogTrigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { asChild = false, children } = $$props;
    const { setOpen, open } = getContext(DIALOG_CONTEXT);
    const handleClick = () => setOpen(true);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      children?.($$renderer2, { onClick: handleClick, "aria-expanded": open() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button type="button"${attr("aria-expanded", open())}>`);
      children?.($$renderer2, {});
      $$renderer2.push(`<!----></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DeleteUser($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="space-y-6">`);
    Heading($$renderer2, {
      variant: "small",
      title: "Delete account",
      description: "Delete your account and all of its resources"
    });
    $$renderer2.push(`<!----> <div class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10"><div class="relative space-y-0.5 text-red-600 dark:text-red-100"><p class="font-medium">Warning</p> <p class="text-sm">Please proceed with caution, this cannot be undone.</p></div> `);
    Dialog($$renderer2, {
      children: ($$renderer3) => {
        DialogTrigger($$renderer3, {
          children: ($$renderer4) => {
            Button($$renderer4, {
              variant: "destructive",
              "data-test": "delete-user-button",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Delete account`);
              },
              $$slots: { default: true }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        DialogContent($$renderer3, {
          children: ($$renderer4) => {
            {
              let children = function($$renderer5, { errors, processing }) {
                $$renderer5.push(`<div class="space-y-3">`);
                DialogTitle($$renderer5, {
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Are you sure you want to delete your account?`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                DialogDescription($$renderer5, {
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Once your account is deleted, all of its
                                resources and data will also be permanently
                                deleted. Please enter your password to confirm
                                you would like to permanently delete your
                                account.`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div> <div class="grid gap-2">`);
                Label($$renderer5, {
                  for: "password",
                  class: "sr-only",
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Password`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                PasswordInput($$renderer5, { id: "password", name: "password", placeholder: "Password" });
                $$renderer5.push(`<!----> `);
                InputError($$renderer5, { message: errors.password });
                $$renderer5.push(`<!----></div> `);
                DialogFooter($$renderer5, {
                  class: "gap-2",
                  children: ($$renderer6) => {
                    DialogClose($$renderer6, {
                      children: ($$renderer7) => {
                        Button($$renderer7, {
                          variant: "secondary",
                          children: ($$renderer8) => {
                            $$renderer8.push(`<!---->Cancel`);
                          },
                          $$slots: { default: true }
                        });
                      }
                    });
                    $$renderer6.push(`<!----> `);
                    Button($$renderer6, {
                      type: "submit",
                      variant: "destructive",
                      disabled: processing,
                      "data-test": "confirm-delete-user-button",
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!---->Delete account`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!---->`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!---->`);
              };
              Form($$renderer4, spread_props([
                ProfileController.destroy.form(),
                {
                  class: "space-y-6",
                  options: { preserveScroll: true },
                  children,
                  $$slots: { default: true }
                }
              ]));
            }
          }
        });
        $$renderer3.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
  });
}
function Profile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { mustVerifyEmail, status = "" } = $$props;
    const breadcrumbItems = [{ title: "Profile settings", href: edit$4() }];
    const user = derived(() => store_get($$store_subs ??= {}, "$page", page).props.auth.user);
    AppHead($$renderer2, { title: "Profile settings" });
    $$renderer2.push(`<!----> `);
    AppLayout_1($$renderer2, {
      breadcrumbs: breadcrumbItems,
      children: ($$renderer3) => {
        $$renderer3.push(`<h1 class="sr-only">Profile settings</h1> `);
        Layout($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-col space-y-6">`);
            Heading($$renderer4, {
              variant: "small",
              title: "Profile information",
              description: "Update your name and email address"
            });
            $$renderer4.push(`<!----> `);
            {
              let children = function($$renderer5, { errors, processing, recentlySuccessful }) {
                $$renderer5.push(`<div class="grid gap-2">`);
                Label($$renderer5, {
                  for: "name",
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Name`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  id: "name",
                  name: "name",
                  class: "mt-1 block w-full",
                  value: user().name,
                  required: true,
                  autocomplete: "name",
                  placeholder: "Full name"
                });
                $$renderer5.push(`<!----> `);
                InputError($$renderer5, { class: "mt-2", message: errors.name });
                $$renderer5.push(`<!----></div> <div class="grid gap-2">`);
                Label($$renderer5, {
                  for: "email",
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Email address`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                Input($$renderer5, {
                  id: "email",
                  type: "email",
                  name: "email",
                  class: "mt-1 block w-full",
                  value: user().email,
                  required: true,
                  autocomplete: "username",
                  placeholder: "Email address"
                });
                $$renderer5.push(`<!----> `);
                InputError($$renderer5, { class: "mt-2", message: errors.email });
                $$renderer5.push(`<!----></div> `);
                if (mustVerifyEmail && !user().email_verified_at) {
                  $$renderer5.push("<!--[0-->");
                  $$renderer5.push(`<div><p class="-mt-4 text-sm text-muted-foreground">Your email address is unverified. `);
                  TextLink($$renderer5, {
                    href: send(),
                    as: "button",
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->Click here to resend the verification email.`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></p> `);
                  if (status === "verification-link-sent") {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="mt-2 text-sm font-medium text-green-600">A new verification link has been sent to
                                    your email address.</div>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                  }
                  $$renderer5.push(`<!--]--></div>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--> <div class="flex items-center gap-4">`);
                Button($$renderer5, {
                  type: "submit",
                  disabled: processing,
                  "data-test": "update-profile-button",
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->Save`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----> `);
                if (recentlySuccessful) {
                  $$renderer5.push("<!--[0-->");
                  $$renderer5.push(`<p class="text-sm text-neutral-600">Saved.</p>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                }
                $$renderer5.push(`<!--]--></div>`);
              };
              Form($$renderer4, spread_props([
                ProfileController.update.form(),
                {
                  class: "space-y-6",
                  options: { preserveScroll: true },
                  children,
                  $$slots: { default: true }
                }
              ]));
            }
            $$renderer4.push(`<!----></div> `);
            DeleteUser($$renderer4);
            $$renderer4.push(`<!---->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Profile
}, Symbol.toStringTag, { value: "Module" }));
const edit = (options) => ({
  url: edit.url(options),
  method: "get"
});
edit.definition = {
  methods: ["get", "head"],
  url: "/settings/security"
};
edit.url = (options) => {
  return edit.definition.url + queryParams(options);
};
edit.get = (options) => ({
  url: edit.url(options),
  method: "get"
});
edit.head = (options) => ({
  url: edit.url(options),
  method: "head"
});
const editForm = (options) => ({
  action: edit.url(options),
  method: "get"
});
editForm.get = (options) => ({
  action: edit.url(options),
  method: "get"
});
editForm.head = (options) => ({
  action: edit.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit.form = editForm;
const update = (options) => ({
  url: update.url(options),
  method: "put"
});
update.definition = {
  methods: ["put"],
  url: "/settings/password"
};
update.url = (options) => {
  return update.definition.url + queryParams(options);
};
update.put = (options) => ({
  url: update.url(options),
  method: "put"
});
const updateForm = (options) => ({
  action: update.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PUT",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
updateForm.put = (options) => ({
  action: update.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PUT",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
update.form = updateForm;
const SecurityController = { update };
function Alert($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const base = "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current";
    const variantClasses = {
      default: "bg-card text-card-foreground",
      destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
    };
    let { variant = "default", class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="alert"${attr_class(clsx(cn(base, variantClasses[variant], className)))} role="alert">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function AlertDescription($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="alert-description"${attr_class(clsx(cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function AlertTitle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="alert-title"${attr_class(clsx(cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function AlertError($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { errors = [], title = "Something went wrong." } = $$props;
    const uniqueErrors = derived(() => [...new Set(errors)]);
    Alert($$renderer2, {
      variant: "destructive",
      children: ($$renderer3) => {
        Circle_alert($$renderer3, { class: "size-4" });
        $$renderer3.push(`<!----> `);
        AlertTitle($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(title)}`);
          }
        });
        $$renderer3.push(`<!----> `);
        AlertDescription($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<ul class="list-inside list-disc text-sm"><!--[-->`);
            const each_array = ensure_array_like(uniqueErrors());
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let error = each_array[$$index];
              $$renderer4.push(`<li>${escape_html(error)}</li>`);
            }
            $$renderer4.push(`<!--]--></ul>`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
  });
}
function Card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="card"${attr_class(clsx(cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function CardContent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="card-content"${attr_class(clsx(cn("px-6", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function CardDescription($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<p data-slot="card-description"${attr_class(clsx(cn("text-muted-foreground text-sm", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></p>`);
  });
}
function CardHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<div data-slot="card-header"${attr_class(clsx(cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function CardTitle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: className = "", children } = $$props;
    $$renderer2.push(`<h3 data-slot="card-title"${attr_class(clsx(cn("leading-none font-semibold", className)))}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></h3>`);
  });
}
const login = (options) => ({
  url: login.url(options),
  method: "get"
});
login.definition = {
  methods: ["get", "head"],
  url: "/two-factor-challenge"
};
login.url = (options) => {
  return login.definition.url + queryParams(options);
};
login.get = (options) => ({
  url: login.url(options),
  method: "get"
});
login.head = (options) => ({
  url: login.url(options),
  method: "head"
});
const loginForm = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.get = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.head = (options) => ({
  action: login.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
login.form = loginForm;
const enable = (options) => ({
  url: enable.url(options),
  method: "post"
});
enable.definition = {
  methods: ["post"],
  url: "/user/two-factor-authentication"
};
enable.url = (options) => {
  return enable.definition.url + queryParams(options);
};
enable.post = (options) => ({
  url: enable.url(options),
  method: "post"
});
const enableForm = (options) => ({
  action: enable.url(options),
  method: "post"
});
enableForm.post = (options) => ({
  action: enable.url(options),
  method: "post"
});
enable.form = enableForm;
const confirm = (options) => ({
  url: confirm.url(options),
  method: "post"
});
confirm.definition = {
  methods: ["post"],
  url: "/user/confirmed-two-factor-authentication"
};
confirm.url = (options) => {
  return confirm.definition.url + queryParams(options);
};
confirm.post = (options) => ({
  url: confirm.url(options),
  method: "post"
});
const confirmForm = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirmForm.post = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirm.form = confirmForm;
const disable = (options) => ({
  url: disable.url(options),
  method: "delete"
});
disable.definition = {
  methods: ["delete"],
  url: "/user/two-factor-authentication"
};
disable.url = (options) => {
  return disable.definition.url + queryParams(options);
};
disable.delete = (options) => ({
  url: disable.url(options),
  method: "delete"
});
const disableForm = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disableForm.delete = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disable.form = disableForm;
const qrCode = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-qr-code"
};
qrCode.url = (options) => {
  return qrCode.definition.url + queryParams(options);
};
qrCode.get = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.head = (options) => ({
  url: qrCode.url(options),
  method: "head"
});
const qrCodeForm = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.get = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.head = (options) => ({
  action: qrCode.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
qrCode.form = qrCodeForm;
const secretKey = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-secret-key"
};
secretKey.url = (options) => {
  return secretKey.definition.url + queryParams(options);
};
secretKey.get = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.head = (options) => ({
  url: secretKey.url(options),
  method: "head"
});
const secretKeyForm = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.get = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.head = (options) => ({
  action: secretKey.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
secretKey.form = secretKeyForm;
const recoveryCodes = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-recovery-codes"
};
recoveryCodes.url = (options) => {
  return recoveryCodes.definition.url + queryParams(options);
};
recoveryCodes.get = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.head = (options) => ({
  url: recoveryCodes.url(options),
  method: "head"
});
const recoveryCodesForm = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.get = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.head = (options) => ({
  action: recoveryCodes.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
recoveryCodes.form = recoveryCodesForm;
const regenerateRecoveryCodes = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.definition = {
  methods: ["post"],
  url: "/user/two-factor-recovery-codes"
};
regenerateRecoveryCodes.url = (options) => {
  return regenerateRecoveryCodes.definition.url + queryParams(options);
};
regenerateRecoveryCodes.post = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
const regenerateRecoveryCodesForm = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodesForm.post = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.form = regenerateRecoveryCodesForm;
({
  login: Object.assign(login, login$1),
  enable: Object.assign(enable, enable),
  confirm: Object.assign(confirm, confirm),
  disable: Object.assign(disable, disable),
  qrCode: Object.assign(qrCode, qrCode),
  secretKey: Object.assign(secretKey, secretKey),
  recoveryCodes: Object.assign(recoveryCodes, recoveryCodes),
  regenerateRecoveryCodes: Object.assign(regenerateRecoveryCodes, regenerateRecoveryCodes)
});
const fetchJson = async (url) => {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
const state = {
  qrCodeSvg: null,
  manualSetupKey: null,
  recoveryCodesList: [],
  errors: []
};
const hasSetupData = () => state.qrCodeSvg !== null && state.manualSetupKey !== null;
function twoFactorAuthState() {
  const fetchQrCode = async () => {
    try {
      const { svg } = await fetchJson(qrCode.url());
      state.qrCodeSvg = svg;
    } catch {
      state.errors = [...state.errors, "Failed to fetch QR code"];
      state.qrCodeSvg = null;
    }
  };
  const fetchSetupKey = async () => {
    try {
      const payload = await fetchJson(secretKey.url());
      const key = typeof payload === "string" ? payload : payload.secretKey ?? payload.secret_key ?? null;
      if (!key) {
        throw new Error("Setup key not found in response");
      }
      state.manualSetupKey = key;
    } catch {
      state.errors = [...state.errors, "Failed to fetch a setup key"];
      state.manualSetupKey = null;
    }
  };
  const clearErrors = () => {
    state.errors = [];
  };
  const clearSetupData = () => {
    state.manualSetupKey = null;
    state.qrCodeSvg = null;
    clearErrors();
  };
  const clearTwoFactorAuthData = () => {
    clearSetupData();
    state.recoveryCodesList = [];
    clearErrors();
  };
  const fetchRecoveryCodes = async () => {
    try {
      clearErrors();
      state.recoveryCodesList = await fetchJson(recoveryCodes.url());
    } catch {
      state.errors = [...state.errors, "Failed to fetch recovery codes"];
      state.recoveryCodesList = [];
    }
  };
  const fetchSetupData = async () => {
    try {
      clearErrors();
      await Promise.all([fetchQrCode(), fetchSetupKey()]);
    } catch {
      state.qrCodeSvg = null;
      state.manualSetupKey = null;
    }
  };
  return {
    state,
    hasSetupData,
    clearSetupData,
    clearErrors,
    clearTwoFactorAuthData,
    fetchQrCode,
    fetchSetupKey,
    fetchSetupData,
    fetchRecoveryCodes
  };
}
function TwoFactorRecoveryCodes($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const twoFactorAuth = twoFactorAuthState();
    let isRecoveryCodesVisible = false;
    async function toggleRecoveryCodesVisibility() {
      if (!isRecoveryCodesVisible && !twoFactorAuth.state.recoveryCodesList.length) {
        await twoFactorAuth.fetchRecoveryCodes();
      }
      isRecoveryCodesVisible = !isRecoveryCodesVisible;
      if (isRecoveryCodesVisible) {
        await tick();
      }
    }
    Card($$renderer2, {
      class: "w-full",
      children: ($$renderer3) => {
        CardHeader($$renderer3, {
          children: ($$renderer4) => {
            CardTitle($$renderer4, {
              class: "flex gap-3",
              children: ($$renderer5) => {
                Lock_keyhole($$renderer5, { class: "size-4" });
                $$renderer5.push(`<!---->2FA recovery codes`);
              }
            });
            $$renderer4.push(`<!----> `);
            CardDescription($$renderer4, {
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Recovery codes let you regain access if you lose your 2FA device.
            Store them in a secure password manager.`);
              }
            });
            $$renderer4.push(`<!---->`);
          }
        });
        $$renderer3.push(`<!----> `);
        CardContent($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">`);
            Button($$renderer4, {
              onclick: toggleRecoveryCodesVisibility,
              class: "w-fit",
              children: ($$renderer5) => {
                if (isRecoveryCodesVisible) {
                  $$renderer5.push("<!--[0-->");
                  Eye_off($$renderer5, { class: "size-4" });
                } else {
                  $$renderer5.push("<!--[-1-->");
                  Eye($$renderer5, { class: "size-4" });
                }
                $$renderer5.push(`<!--]--> ${escape_html(isRecoveryCodesVisible ? "Hide" : "View")} recovery codes`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            if (isRecoveryCodesVisible && twoFactorAuth.state.recoveryCodesList.length) {
              $$renderer4.push("<!--[0-->");
              {
                let children = function($$renderer5, { processing }) {
                  Button($$renderer5, {
                    variant: "secondary",
                    type: "submit",
                    disabled: processing,
                    children: ($$renderer6) => {
                      Refresh_cw($$renderer6, { class: "size-4" });
                      $$renderer6.push(`<!----> Regenerate codes`);
                    },
                    $$slots: { default: true }
                  });
                };
                Form($$renderer4, spread_props([
                  regenerateRecoveryCodes.form(),
                  {
                    options: { preserveScroll: true },
                    onSuccess: () => twoFactorAuth.fetchRecoveryCodes(),
                    children,
                    $$slots: { default: true }
                  }
                ]));
              }
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--></div> <div${attr_class(`relative overflow-hidden transition-all duration-300 ${stringify(isRecoveryCodesVisible ? "h-auto opacity-100" : "h-0 opacity-0")}`)}>`);
            if (twoFactorAuth.state.errors.length) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="mt-6">`);
              AlertError($$renderer4, { errors: twoFactorAuth.state.errors });
              $$renderer4.push(`<!----></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
              $$renderer4.push(`<div class="mt-3 space-y-3"><div class="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm">`);
              if (!twoFactorAuth.state.recoveryCodesList.length) {
                $$renderer4.push("<!--[0-->");
                $$renderer4.push(`<div class="space-y-2"><!--[-->`);
                const each_array = ensure_array_like({ length: 8 });
                for (let n = 0, $$length = each_array.length; n < $$length; n++) {
                  each_array[n];
                  $$renderer4.push(`<div class="h-4 animate-pulse rounded bg-muted-foreground/20"></div>`);
                }
                $$renderer4.push(`<!--]--></div>`);
              } else {
                $$renderer4.push("<!--[-1-->");
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(twoFactorAuth.state.recoveryCodesList);
                for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
                  let code = each_array_1[index];
                  $$renderer4.push(`<div>${escape_html(code)}</div>`);
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]--></div> <p class="text-xs text-muted-foreground select-none">Each recovery code can be used once to access your
                        account and will be removed after use. If you need more,
                        click <span class="font-bold">Regenerate codes</span> above.</p></div>`);
            }
            $$renderer4.push(`<!--]--></div>`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
  });
}
function TwoFactorSetupModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { requiresConfirmation, twoFactorEnabled, isOpen = false } = $$props;
    const { resolvedAppearance } = themeState();
    const twoFactorAuth = twoFactorAuthState();
    let showVerificationStep = false;
    let code = "";
    const modalConfig = derived(() => {
      if (twoFactorEnabled) {
        return {
          title: "Two-factor authentication enabled",
          description: "Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.",
          buttonText: "Close"
        };
      }
      if (showVerificationStep) {
        return {
          title: "Verify authentication code",
          description: "Enter the 6-digit code from your authenticator app",
          buttonText: "Continue"
        };
      }
      return {
        title: "Enable two-factor authentication",
        description: "To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app",
        buttonText: "Continue"
      };
    });
    const qrCodeDataUrl = derived(() => {
      const qrCodeSvg = twoFactorAuth.state.qrCodeSvg;
      if (!qrCodeSvg) {
        return "";
      }
      return `data:image/svg+xml;utf8,${encodeURIComponent(qrCodeSvg)}`;
    });
    async function handleModalNextStep() {
      if (requiresConfirmation) {
        showVerificationStep = true;
        await tick();
        return;
      }
      twoFactorAuth.clearSetupData();
      isOpen = false;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Dialog($$renderer3, {
        get open() {
          return isOpen;
        },
        set open($$value) {
          isOpen = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          DialogContent($$renderer4, {
            class: "sm:max-w-md",
            children: ($$renderer5) => {
              $$renderer5.push(`<div class="flex flex-col items-center justify-center"><div class="mb-3 w-auto rounded-full border border-border bg-card p-0.5 shadow-sm"><div class="relative overflow-hidden rounded-full border border-border bg-muted p-2.5"><div class="absolute inset-0 grid grid-cols-5 opacity-50"><!--[-->`);
              const each_array = ensure_array_like({ length: 5 });
              for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                each_array[i];
                $$renderer5.push(`<div class="border-r border-border last:border-r-0"></div>`);
              }
              $$renderer5.push(`<!--]--></div> <div class="absolute inset-0 grid grid-rows-5 opacity-50"><!--[-->`);
              const each_array_1 = ensure_array_like({ length: 5 });
              for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
                each_array_1[i];
                $$renderer5.push(`<div class="border-b border-border last:border-b-0"></div>`);
              }
              $$renderer5.push(`<!--]--></div> `);
              Scan_line($$renderer5, { class: "relative z-20 size-6 text-foreground" });
              $$renderer5.push(`<!----></div></div> <div class="my-3 space-y-1 text-center">`);
              DialogTitle($$renderer5, {
                children: ($$renderer6) => {
                  $$renderer6.push(`<!---->${escape_html(modalConfig().title)}`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!----> `);
              DialogDescription($$renderer5, {
                children: ($$renderer6) => {
                  $$renderer6.push(`<!---->${escape_html(modalConfig().description)}`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!----></div></div> <div class="relative flex w-auto flex-col items-center justify-center space-y-5">`);
              if (!showVerificationStep) {
                $$renderer5.push("<!--[0-->");
                if (twoFactorAuth.state.errors.length) {
                  $$renderer5.push("<!--[0-->");
                  AlertError($$renderer5, { errors: twoFactorAuth.state.errors });
                } else {
                  $$renderer5.push("<!--[-1-->");
                  $$renderer5.push(`<div class="relative mx-auto flex max-w-md items-center overflow-hidden"><div class="relative mx-auto aspect-square w-64 overflow-hidden rounded-lg border border-border">`);
                  if (!twoFactorAuth.state.qrCodeSvg) {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="absolute inset-0 z-10 flex aspect-square h-auto w-full animate-pulse items-center justify-center bg-background">`);
                    Spinner($$renderer5, { class: "size-6" });
                    $$renderer5.push(`<!----></div>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                    $$renderer5.push(`<div class="relative z-10 overflow-hidden border p-5"><div class="flex aspect-square size-full items-center justify-center [&amp;>svg]:size-full"${attr_style(resolvedAppearance() === "dark" ? "filter: invert(1) brightness(1.5)" : void 0)}><img${attr("src", qrCodeDataUrl())} alt="Two-factor authentication QR code" class="size-full"/></div></div>`);
                  }
                  $$renderer5.push(`<!--]--></div></div> <div class="flex w-full items-center space-x-5">`);
                  Button($$renderer5, {
                    class: "w-full",
                    onclick: handleModalNextStep,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html(modalConfig().buttonText)}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div> <div class="relative flex w-full items-center justify-center"><div class="absolute inset-0 top-1/2 h-px w-full bg-border"></div> <span class="relative bg-card px-2 py-1">or, enter the code manually</span></div> <div class="flex w-full items-center justify-center space-x-2"><div class="flex w-full items-stretch overflow-hidden rounded-xl border border-border">`);
                  if (!twoFactorAuth.state.manualSetupKey) {
                    $$renderer5.push("<!--[0-->");
                    $$renderer5.push(`<div class="flex h-full w-full items-center justify-center bg-muted p-3">`);
                    Spinner($$renderer5, {});
                    $$renderer5.push(`<!----></div>`);
                  } else {
                    $$renderer5.push("<!--[-1-->");
                    $$renderer5.push(`<input type="text" readonly=""${attr("value", twoFactorAuth.state.manualSetupKey)} class="h-full w-full bg-background p-3 text-foreground"/> <button class="relative block h-auto border-l border-border px-3 hover:bg-muted">`);
                    {
                      $$renderer5.push("<!--[-1-->");
                      Copy($$renderer5, { class: "w-4" });
                    }
                    $$renderer5.push(`<!--]--></button>`);
                  }
                  $$renderer5.push(`<!--]--></div></div>`);
                }
                $$renderer5.push(`<!--]-->`);
              } else {
                $$renderer5.push("<!--[-1-->");
                {
                  let children = function($$renderer6, { errors: formErrors, processing }) {
                    $$renderer6.push(`<input type="hidden" name="code"${attr("value", code)}/> <div class="relative w-full space-y-3"><div class="flex w-full flex-col items-center justify-center space-y-3 py-2">`);
                    InputOTP($$renderer6, {
                      id: "otp",
                      maxlength: 6,
                      disabled: processing,
                      get value() {
                        return code;
                      },
                      set value($$value) {
                        code = $$value;
                        $$settled = false;
                      },
                      children: ($$renderer7) => {
                        InputOTPGroup($$renderer7, {
                          children: ($$renderer8) => {
                            $$renderer8.push(`<!--[-->`);
                            const each_array_2 = ensure_array_like({ length: 6 });
                            for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
                              each_array_2[i];
                              InputOTPSlot($$renderer8, { index: i });
                            }
                            $$renderer8.push(`<!--]-->`);
                          }
                        });
                      },
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> `);
                    InputError($$renderer6, { message: formErrors?.confirmTwoFactorAuthentication?.code });
                    $$renderer6.push(`<!----></div> <div class="flex w-full items-center space-x-5">`);
                    Button($$renderer6, {
                      type: "button",
                      variant: "outline",
                      class: "w-auto flex-1",
                      onclick: () => showVerificationStep = false,
                      disabled: processing,
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!---->Back`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----> `);
                    Button($$renderer6, {
                      type: "submit",
                      class: "w-auto flex-1",
                      disabled: processing || code.length < 6,
                      children: ($$renderer7) => {
                        $$renderer7.push(`<!---->Confirm`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer6.push(`<!----></div></div>`);
                  };
                  Form($$renderer5, spread_props([
                    confirm.form(),
                    {
                      resetOnError: true,
                      onFinish: () => code = "",
                      onSuccess: () => isOpen = false,
                      children,
                      $$slots: { default: true }
                    }
                  ]));
                }
              }
              $$renderer5.push(`<!--]--></div>`);
            }
          });
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { isOpen });
  });
}
function Security($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      canManageTwoFactor = false,
      requiresConfirmation = false,
      twoFactorEnabled = false
    } = $$props;
    const breadcrumbs = [{ title: "Security settings", href: edit$2() }];
    const twoFactorAuth = twoFactorAuthState();
    let showSetupModal = false;
    onDestroy(() => twoFactorAuth.clearTwoFactorAuthData());
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      AppHead($$renderer3, { title: "Security settings" });
      $$renderer3.push(`<!----> `);
      AppLayout_1($$renderer3, {
        breadcrumbs,
        children: ($$renderer4) => {
          $$renderer4.push(`<h1 class="sr-only">Security settings</h1> `);
          Layout($$renderer4, {
            children: ($$renderer5) => {
              $$renderer5.push(`<div class="space-y-6">`);
              Heading($$renderer5, {
                variant: "small",
                title: "Update password",
                description: "Ensure your account is using a long, random password to stay secure"
              });
              $$renderer5.push(`<!----> `);
              {
                let children = function($$renderer6, { errors, processing, recentlySuccessful }) {
                  $$renderer6.push(`<div class="grid gap-2">`);
                  Label($$renderer6, {
                    for: "current_password",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Current password`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  PasswordInput($$renderer6, {
                    id: "current_password",
                    name: "current_password",
                    class: "mt-1 block w-full",
                    autocomplete: "current-password",
                    placeholder: "Current password"
                  });
                  $$renderer6.push(`<!----> `);
                  InputError($$renderer6, { message: errors.current_password });
                  $$renderer6.push(`<!----></div> <div class="grid gap-2">`);
                  Label($$renderer6, {
                    for: "password",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->New password`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  PasswordInput($$renderer6, {
                    id: "password",
                    name: "password",
                    class: "mt-1 block w-full",
                    autocomplete: "new-password",
                    placeholder: "New password"
                  });
                  $$renderer6.push(`<!----> `);
                  InputError($$renderer6, { message: errors.password });
                  $$renderer6.push(`<!----></div> <div class="grid gap-2">`);
                  Label($$renderer6, {
                    for: "password_confirmation",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Confirm password`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  PasswordInput($$renderer6, {
                    id: "password_confirmation",
                    name: "password_confirmation",
                    class: "mt-1 block w-full",
                    autocomplete: "new-password",
                    placeholder: "Confirm password"
                  });
                  $$renderer6.push(`<!----> `);
                  InputError($$renderer6, { message: errors.password_confirmation });
                  $$renderer6.push(`<!----></div> <div class="flex items-center gap-4">`);
                  Button($$renderer6, {
                    type: "submit",
                    disabled: processing,
                    "data-test": "update-password-button",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Save password`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  if (recentlySuccessful) {
                    $$renderer6.push("<!--[0-->");
                    $$renderer6.push(`<p class="text-sm text-neutral-600">Saved.</p>`);
                  } else {
                    $$renderer6.push("<!--[-1-->");
                  }
                  $$renderer6.push(`<!--]--></div>`);
                };
                Form($$renderer5, spread_props([
                  SecurityController.update.form(),
                  {
                    class: "space-y-6",
                    options: { preserveScroll: true },
                    resetOnSuccess: true,
                    resetOnError: ["password", "password_confirmation", "current_password"],
                    children,
                    $$slots: { default: true }
                  }
                ]));
              }
              $$renderer5.push(`<!----></div> `);
              if (canManageTwoFactor) {
                $$renderer5.push("<!--[0-->");
                $$renderer5.push(`<div class="space-y-6">`);
                Heading($$renderer5, {
                  variant: "small",
                  title: "Two-factor authentication",
                  description: "Manage your two-factor authentication settings"
                });
                $$renderer5.push(`<!----> `);
                if (!twoFactorEnabled) {
                  $$renderer5.push("<!--[0-->");
                  $$renderer5.push(`<div class="flex flex-col items-start justify-start space-y-4"><p class="text-muted-foreground text-sm">When you enable two-factor authentication, you will
                            be prompted for a secure pin during login. This pin
                            can be retrieved from a TOTP-supported application
                            on your phone.</p> <div>`);
                  if (twoFactorAuth.hasSetupData()) {
                    $$renderer5.push("<!--[0-->");
                    Button($$renderer5, {
                      onclick: () => showSetupModal = true,
                      children: ($$renderer6) => {
                        Shield_check($$renderer6, { class: "size-4" });
                        $$renderer6.push(`<!---->Continue setup`);
                      },
                      $$slots: { default: true }
                    });
                  } else {
                    $$renderer5.push("<!--[-1-->");
                    {
                      let children = function($$renderer6, { processing }) {
                        Button($$renderer6, {
                          type: "submit",
                          disabled: processing,
                          children: ($$renderer7) => {
                            $$renderer7.push(`<!---->Enable 2FA`);
                          },
                          $$slots: { default: true }
                        });
                      };
                      Form($$renderer5, spread_props([
                        enable.form(),
                        {
                          onSuccess: () => showSetupModal = true,
                          children,
                          $$slots: { default: true }
                        }
                      ]));
                    }
                  }
                  $$renderer5.push(`<!--]--></div></div>`);
                } else {
                  $$renderer5.push("<!--[-1-->");
                  $$renderer5.push(`<div class="flex flex-col items-start justify-start space-y-4"><p class="text-muted-foreground text-sm">You will be prompted for a secure, random pin during
                            login, which you can retrieve from the
                            TOTP-supported application on your phone.</p> <div class="relative inline">`);
                  {
                    let children = function($$renderer6, { processing }) {
                      Button($$renderer6, {
                        variant: "destructive",
                        type: "submit",
                        disabled: processing,
                        children: ($$renderer7) => {
                          $$renderer7.push(`<!---->Disable 2FA`);
                        },
                        $$slots: { default: true }
                      });
                    };
                    Form($$renderer5, spread_props([disable.form(), { children, $$slots: { default: true } }]));
                  }
                  $$renderer5.push(`<!----></div> `);
                  TwoFactorRecoveryCodes($$renderer5);
                  $$renderer5.push(`<!----></div>`);
                }
                $$renderer5.push(`<!--]--> `);
                TwoFactorSetupModal($$renderer5, {
                  requiresConfirmation,
                  twoFactorEnabled,
                  get isOpen() {
                    return showSetupModal;
                  },
                  set isOpen($$value) {
                    showSetupModal = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div>`);
              } else {
                $$renderer5.push("<!--[-1-->");
              }
              $$renderer5.push(`<!--]-->`);
            }
          });
          $$renderer4.push(`<!---->`);
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Security
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page2) => createInertiaApp({
    page: page2,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({
        "./pages/Dashboard.svelte": __vite_glob_0_0,
        "./pages/Map.svelte": __vite_glob_0_1,
        "./pages/Welcome.svelte": __vite_glob_0_2,
        "./pages/auth/ConfirmPassword.svelte": __vite_glob_0_3,
        "./pages/auth/ForgotPassword.svelte": __vite_glob_0_4,
        "./pages/auth/Login.svelte": __vite_glob_0_5,
        "./pages/auth/Register.svelte": __vite_glob_0_6,
        "./pages/auth/ResetPassword.svelte": __vite_glob_0_7,
        "./pages/auth/TwoFactorChallenge.svelte": __vite_glob_0_8,
        "./pages/auth/VerifyEmail.svelte": __vite_glob_0_9,
        "./pages/settings/Appearance.svelte": __vite_glob_0_10,
        "./pages/settings/Profile.svelte": __vite_glob_0_11,
        "./pages/settings/Security.svelte": __vite_glob_0_12
      });
      return pages[`./pages/${name}.svelte`];
    },
    setup({ App: App2, props }) {
      return render(App2, { props });
    }
  })
);
