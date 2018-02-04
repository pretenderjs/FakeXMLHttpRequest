/*
  Used to set the statusText property of an xhr object
*/
const httpStatusCodes: { [k:number]: string } = {
  100: "Continue",
  101: "Switching Protocols",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  300: "Multiple Choice",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Satisfiable",
  417: "Expectation Failed",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported"
};

/*
  Without mocking, the native XMLHttpRequest object will throw
  an error when attempting to set these headers. We match this behavior.
*/
const unsafeHeaders = {
  "Accept-Charset": true,
  "Accept-Encoding": true,
  "Connection": true,
  "Content-Length": true,
  "Cookie": true,
  "Cookie2": true,
  "Content-Transfer-Encoding": true,
  "Date": true,
  "Expect": true,
  "Host": true,
  "Keep-Alive": true,
  "Referer": true,
  "TE": true,
  "Trailer": true,
  "Transfer-Encoding": true,
  "Upgrade": true,
  "User-Agent": true,
  "Via": true
};

export interface FakeEventInit extends EventInit {
  target?: any
}

export class FakeEvent {
  readonly type: string;
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  cancelBubble = false
  defaultPrevented = false
  lengthComputable: number
  total: number
  loaded: boolean
  target: any = null;

  constructor(type: string, { bubbles = false, cancelable = false, target = null }: FakeEventInit = {}) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
    this.target = target;
  }

  stopPropagation() {}
  preventDefault() {
    this.defaultPrevented = true;
  }
}

/*
  Cross-browser XML parsing. Used to turn
  XML responses into Document objects
  Borrowed from JSpec
*/
function parseXML(text: string): XMLDocument {
  var xmlDoc;

  if (typeof DOMParser != "undefined") {
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "text/xml");
  } else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.loadXML(text);
  }

  return xmlDoc;
}

/*
  Adds an "event" onto the fake xhr object
  that just calls the same-named method. This is
  in case a library adds callbacks for these events.
*/
function _addEventListener(eventName: string, xhr: any){
  xhr.addEventListener(eventName, function(event: FakeEvent) {
    var listener = xhr["on" + eventName];

    if (listener && typeof listener == "function") {
      listener.call(event.target, event);
    }
  });
}

type EventHandlerObject = { handleEvent: Function }
interface EventsListenersMap {
  [k: string]: (EventHandlerObject | Function)[];
}
export class EventedObject {
  private eventListeners: EventsListenersMap = {}
  constructor() {
    let eventNames = ["loadstart", "progress", "load", "abort", "loadend"];
    for (let i = eventNames.length - 1; i >= 0; i--) {
      _addEventListener(eventNames[i], this);
    }
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's addEventListener function
  */
  addEventListener(event: string, listener: Function) {
    this.eventListeners[event] = this.eventListeners[event] || [];
    this.eventListeners[event].push(listener);
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's removeEventListener function
  */
  removeEventListener(event: string, listener: Function) {
    var listeners = this.eventListeners[event] || [];

    for (var i = 0, l = listeners.length; i <


      l; ++i) {
      if (listeners[i] == listener) {
        return listeners.splice(i, 1);
      }
    }
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's dispatchEvent function
  */
  dispatchEvent(event: { type: string, [k: string]: any }) {
    var type = event.type;
    var listeners = this.eventListeners[type] || [];

    for (var i = 0; i < listeners.length; i++) {
      if (typeof listeners[i] === "function") {
        (<Function>listeners[i]).call(this, event);
      } else {
        (<EventHandlerObject>listeners[i]).handleEvent(event);
      }
    }

    return !!event.defaultPrevented;
  }

  /*
    Triggers an `onprogress` event with the given parameters.
  */
  _progress(lengthComputable: number, loaded: boolean, total: number) {
    var event = new FakeEvent('progress');
    event.target = this;
    event.lengthComputable = lengthComputable;
    event.loaded = loaded;
    event.total = total;
    this.dispatchEvent(event);
  }
}

export interface FakeHeaders {
  [key: string]: any
}

/*
  Constructor for a fake window.XMLHttpRequest
*/
class FakeXMLHttpRequest extends EventedObject {
  static UNSENT = 0
  static OPENED = 1
  static HEADERS_RECEIVED = 2
  static LOADING = 3
  static DONE = 4

  readyState: number = FakeXMLHttpRequest.UNSENT
  requestHeaders: FakeHeaders = {}
  responseHeaders?: FakeHeaders
  requestBody: any = null
  status: number = 0
  statusText: string = ""
  upload = new EventedObject()
  async = true
  method: string
  url: string
  username?: string
  password?: string
  withCredentials = false
  responseText: string | null = null
  responseXML: XMLDocument | null = null
  sendFlag = false
  errorFlag = false;
  aborted = false;
  onSend?: Function
  onerror?: Function
  onload?: (e: FakeEvent) => void
  onreadystatechange?: (e: FakeEvent) => void
  private forceMimeType?: string
  private chunkSize?: number


  /*
    Duplicates the behavior of native XMLHttpRequest's open function
  */
  open(method: string, url: string, async?: any, username?: string, password?: string) {
    this.method = method;
    this.url = url;
    if (typeof async === 'boolean') {
      this.async = async;
    }
    this.username = username;
    this.password = password;
    this._readyStateChange(FakeXMLHttpRequest.OPENED);
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's setRequestHeader function
  */
  setRequestHeader(header: string, value: string) {
    this._verifyState();

    if (unsafeHeaders.hasOwnProperty(header) || /^(Sec-|Proxy-)/.test(header)) {
      throw new Error("Refused to set unsafe header \"" + header + "\"");
    }

    if (this.requestHeaders[header] !== undefined) {
      this.requestHeaders[header] += "," + value;
    } else {
      this.requestHeaders[header] = value;
    }
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's send function
  */
  send(data: any) {
    this._verifyState();

    if (!/^(get|head)$/i.test(this.method)) {
      var hasContentTypeHeader = false

      Object.keys(this.requestHeaders).forEach(function (key) {
        if (key.toLowerCase() === 'content-type') {
          hasContentTypeHeader = true;
        }
      });

      if (!hasContentTypeHeader && !(data || '').toString().match('FormData')) {
        this.requestHeaders["Content-Type"] = "text/plain;charset=UTF-8";
      }

      this.requestBody = data;
    }

    this.errorFlag = false;
    this.sendFlag = this.async;
    this._readyStateChange(FakeXMLHttpRequest.OPENED);

    if (typeof this.onSend == "function") {
      this.onSend(this);
    }

    this.dispatchEvent(new FakeEvent("loadstart", { bubbles: false, cancelable: false, target: this }));
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's abort function
  */
  abort() {
    this.aborted = true;
    this.responseText = null;
    this.errorFlag = true;
    this.requestHeaders = {};

    if (this.readyState > FakeXMLHttpRequest.UNSENT && this.sendFlag) {
      this._readyStateChange(FakeXMLHttpRequest.DONE);
      this.sendFlag = false;
    }

    this.readyState = FakeXMLHttpRequest.UNSENT;

    this.dispatchEvent(new FakeEvent("abort", { bubbles: false, cancelable: false, target: this }));
    if (typeof this.onerror === "function") {
      this.onerror();
    }
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's getResponseHeader function
  */
  getResponseHeader(headerName: string) {
    if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
      return null;
    }

    if (/^Set-Cookie2?$/i.test(headerName)) {
      return null;
    }

    headerName = headerName.toLowerCase();

    if (this.responseHeaders) {
      for (var h in this.responseHeaders) {
        if (h.toLowerCase() == headerName) {
          return this.responseHeaders[h];
        }
      }
    }

    return null;
  }

  /*
    Duplicates the behavior of native XMLHttpRequest's getAllResponseHeaders function
  */
  getAllResponseHeaders() {
    if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
      return "";
    }

    var headers = "";
    if (this.responseHeaders) {
      for (var header in this.responseHeaders) {
        if (this.responseHeaders.hasOwnProperty(header) && !/^Set-Cookie2?$/i.test(header)) {
          headers += header + ": " + this.responseHeaders[header] + "\r\n";
        }
      }
    }

    return headers;
  }

  /*
  Duplicates the behavior of native XMLHttpRequest's overrideMimeType function
  */
  overrideMimeType(mimeType: any) {
    if (typeof mimeType === "string") {
      this.forceMimeType = mimeType.toLowerCase();
    }
  }


  /*
    Places a FakeXMLHttpRequest object into the passed
    state.
  */
  _readyStateChange(state: number) {
    this.readyState = state;

    if (typeof this.onreadystatechange == "function") {
      this.onreadystatechange(new FakeEvent("readystatechange"));
    }

    this.dispatchEvent(new FakeEvent("readystatechange"));

    if (this.readyState == FakeXMLHttpRequest.DONE) {
      this.dispatchEvent(new FakeEvent("load", { bubbles: false, cancelable: false, target: this }));
      this.dispatchEvent(new FakeEvent("loadend", { bubbles: false, cancelable: false, target: this }));
    }
  }


  /*
    Sets the FakeXMLHttpRequest object's response headers and
    places the object into readyState 2
  */
  _setResponseHeaders(headers: FakeHeaders) {
    this.responseHeaders = {};

    for (var header in headers) {
      if (headers.hasOwnProperty(header)) {
        this.responseHeaders[header] = headers[header];
      }
    }

    if (this.forceMimeType) {
      this.responseHeaders['Content-Type'] = this.forceMimeType;
    }

    if (this.async) {
      this._readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
    } else {
      this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;
    }
  }

  /*
    Sets the FakeXMLHttpRequest object's response body and
    if body text is XML, sets responseXML to parsed document
    object
  */
  _setResponseBody(body: string) {
    this._verifyRequestSent();
    this._verifyHeadersReceived();
    verifyResponseBodyType(body);

    var chunkSize = this.chunkSize || 10;
    var index = 0;
    this.responseText = "";

    do {
      if (this.async) {
        this._readyStateChange(FakeXMLHttpRequest.LOADING);
      }

      this.responseText += body.substring(index, index + chunkSize);
      index += chunkSize;
    } while (index < body.length);

    var type = this.getResponseHeader("Content-Type");

    if (this.responseText && (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
      try {
        this.responseXML = parseXML(this.responseText);
      } catch (e) {
        // Unable to parse XML - no biggie
      }
    }

    if (this.async) {
      this._readyStateChange(FakeXMLHttpRequest.DONE);
    } else {
      this.readyState = FakeXMLHttpRequest.DONE;
    }
  }

  /*
    Forces a response on to the FakeXMLHttpRequest object.

    This is the public API for faking responses. This function
    takes a number status, headers object, and string body:

    ```
    xhr.respond(404, {Content-Type: 'text/plain'}, "Sorry. This object was not found.")

    ```
  */
  respond(status: number = 200, headers: FakeHeaders = {}, body = "") {
    this._setResponseHeaders(headers);
    this.status = status;
    this.statusText = httpStatusCodes[this.status];
    this._setResponseBody(body);
  }

  private _verifyState() {
    if (this.readyState !== FakeXMLHttpRequest.OPENED) {
      throw new Error("INVALID_STATE_ERR");
    }

    if (this.sendFlag) {
      throw new Error("INVALID_STATE_ERR");
    }
  }

  private _verifyRequestSent() {
    if (this.readyState == FakeXMLHttpRequest.DONE) {
      throw new Error("Request done");
    }
  }

  private _verifyHeadersReceived() {
    if (this.async && this.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
      throw new Error("No headers received");
    }
  }
}

// for (var property in FakeXMLHttpRequestProto) {
//   FakeXMLHttpRequest.prototype[property] = FakeXMLHttpRequestProto[property];
// }

function verifyResponseBodyType(body: any) {
  if (typeof body !== "string") {
    var error = new Error("Attempted to respond to fake XMLHttpRequest with " +
      body + ", which is not a string.");
    error.name = "InvalidBodyException";
    throw error;
  }
}

export default FakeXMLHttpRequest;