/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. MIT license */
import '@ungap/global-this';
import { WeakRef } from '@ungap/weakrefs'
import ResizeObserver from 'resize-observer-polyfill';
import 'performance-polyfill'
import 'pointer-events-polyfill'
import BigInt from 'big-integer'
// import 'whatwg-fetch'
window.WeakRef = WeakRef

if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver
}
if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver
}

if (!window.BigInt) {
    window.BigInt = BigInt
}

// Ensure fetch is available
// if (!window.fetch) {
//     console.warn('fetch not available, using polyfill');
// }

if (!window.matchMedia('').addEventListener) {
    let localMatchMedia = window.matchMedia;
    window.matchMedia = function (mql) {
        let res = localMatchMedia(mql);

        res.addEventListener = function (type, listener) {
            res.addListener(listener)
        }
        console.log('matchMedia', mql, res)
        return res
    }
}

if (!('isConnected' in Node.prototype)) {
    Object.defineProperty(Node.prototype, 'isConnected', {
        get() {
            return (
                !this.ownerDocument ||
                !(
                    this.ownerDocument.compareDocumentPosition(this) &
                    this.DOCUMENT_POSITION_DISCONNECTED
                )
            );
        },
    });
}

if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
        var flattened = [];

        function flatten(arr, currentDepth) {
            for (var i = 0; i < arr.length; i++) {
                if (Array.isArray(arr[i]) && currentDepth < depth) {
                    flatten(arr[i], currentDepth + 1);
                } else {
                    flattened.push(arr[i]);
                }
            }
        }

        flatten(this, 0);

        return flattened;
    };
}

export function makeLogProxy(obj) {
    const handler3 = {
        get(target, prop, receiver) {
            const res = Reflect.get(...arguments);
            console.log('get', prop, res)

            return res;
        },
    };
    return new Proxy(obj, handler3)
}

window.makeLogProxy = makeLogProxy

if (!window.queueMicrotask) {
    window.queueMicrotask = function (callback) {
        Promise.resolve()
            .then(callback)
            .catch(e => setTimeout(() => { throw e; }));
    };
}

var ecmaScriptInfo = (function () {
    // () => { is not allowed
    function getESEdition() {
        var array = [];
        switch (true) {
            case !Array.isArray:
                return 3;
            case !window.Promise:
                return 5;
            case !array.includes:
                return 6;
            case !''.padStart:
                return 7;
            case !Promise.prototype.finally:
                return 8;
            case !window.BigInt:
                return 9;
            case !Promise.allSettled:
                return 10;
            case !''.replaceAll:
                return 11;
            case !array.at:
                return 12;
            default:
                return 13;
        }
    }

    function getESYear(edition) {
        return {
            3: 1999,
            5: 2009
        }[edition] || (2009 + edition); // nullish coalescing (??) is not allowed
    }

    var edition = getESEdition();
    var year = getESYear(edition);

    return {
        edition: edition, // usually shortened [edition,]
        year: year,       // usually shortened [year,]
        text: 'Edition: ' + edition + ' | Year: ' + year
        // `Edition: ${edition} | Year: ${year}` is not allowed
    }
})();

console.log('ECMAScript edition', ecmaScriptInfo.edition);
console.log('ECMAScript year', ecmaScriptInfo.year);
console.log('ECMAScript ', ecmaScriptInfo.text);