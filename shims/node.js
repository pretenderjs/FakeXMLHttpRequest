import { DOMParser } from '@xmldom/xmldom'

global.DOMParser = DOMParser;

import FakeXMLHttpRequest from '../src/fake-xml-http-request.js';

export default FakeXMLHttpRequest;


