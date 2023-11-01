(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blake3 = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('blake3-js');

},{"blake3-js":2}],2:[function(require,module,exports){
module.exports=function(t){var n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)e.d(r,i,function(n){return t[n]}.bind(null,i));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/",e(e.s=3)}([function(t,n,e){"use strict";function r(t){return t>4294967295&&(t-=4294967296),t.toString(2).padStart(32,"0")}function i(t){return parseInt(t,2)}Object.defineProperty(n,"__esModule",{value:!0}),n.intu8=function(t){t>255&&(t-=256);return t.toString(2).padStart(8,"0")},n.intu32=r,n.intu64=function(t){return t.toString(2).padStart(64,"0")},n.bitwiseShift=function(t,n){for(var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:64,r=t.substring(0,e-n),i=0;i<n;i++)r="0"+r;return r},n.u64u32=function(t){return t.substring(32,64)},n.wrappingAdd=function(t,n){var e=i(t)+i(n);e>4294967295&&(e-=4294967296);return r(e)},n.u32hex=function(t){return parseInt(t,2).toString(16).padStart(2,"0")},n.u64int=function(t){return parseInt(t,2)},n.u32int=i,n.u8hex=function(t){return t.toString(16).padStart(2,"0")},n.rotateRight=function(t,n){return t.substring(32-n)+t.substring(0,32-n)},n.xor=function(t,n){for(var e=[],r=0;r<32;r++)e+=t[r]==n[r]?"0":"1";return e},n.or=function(t,n){for(var e=[],r=0;r<32;r++)e+="1"===t[r]||"1"===n[r]?"1":"0";return e},n.and=function(t,n){for(var e=[],r=0;r<32;r++)e+="1"===t[r]&&"1"===n[r]?"1":"0";return e},n.or64=function(t,n){for(var e=[],r=0;r<64;r++)e+="1"===t[r]||"1"===n[r]?"1":"0";return e},n.and64=function(t,n){for(var e=[],r=0;r<64;r++)e+="1"===t[r]&&"1"===n[r]?"1":"0";return e},n.first_8_words=function(t){return t.slice(0,8)},n.words_from_little_endian_bytes=function(t){for(var n=[],e=0;e<t.length;e+=4){if(void 0===t[e]||void 0===t[e+1]||void 0===t[e+2]||void 0===t[e+3])return n;n.push(t[e+3].toString(2).padStart(8,"0")+t[e+2].toString(2).padStart(8,"0")+t[e+1].toString(2).padStart(8,"0")+t[e].toString(2).padStart(8,"0"))}return n},n.little_endian_bytes_from_words=function(t){for(var n=new Uint8Array(4*t.length),e=0;e<n.length;e+=4)n[e]=parseInt(t[e].substring(24,32),2),n[e+1]=parseInt(t[e].substring(16,24),2),n[e+2]=parseInt(t[e].substring(8,16),2),n[e+3]=parseInt(t[e].substring(0,8),2);return n},n.chunkArray=function(t,n){for(var e=[],r=0;r<t.length;r+=chunk)e.push(array.slice(r,r+chunk));return e}},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.g=i,n.round=u,n.permute=o,n.default=function(t,n,e,i,l){var c=[t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],a[0],a[1],a[2],a[3],(0,r.u64u32)(e),(0,r.u64u32)((0,r.bitwiseShift)(e,32)),i,l];c=u(c,n),n=o(n,s),c=u(c,n),n=o(n,s),c=u(c,n),n=o(n,s),c=u(c,n),n=o(n,s),c=u(c,n),n=o(n,s),c=u(c,n),n=o(n,s),c=u(c,n);for(var f=0;f<8;f++)c[f]=(0,r.xor)(c[f],c[f+8]),c[f+8]=(0,r.xor)(c[f+8],t[f]);return c};var r=e(0);function i(t,n,e,i,u,o,a){return t[n]=(0,r.wrappingAdd)((0,r.wrappingAdd)(t[n],t[e]),o),t[u]=(0,r.rotateRight)((0,r.xor)(t[u],t[n]),16),t[i]=(0,r.wrappingAdd)(t[i],t[u]),t[e]=(0,r.rotateRight)((0,r.xor)(t[e],t[i]),12),t[n]=(0,r.wrappingAdd)((0,r.wrappingAdd)(t[n],t[e]),a),t[u]=(0,r.rotateRight)((0,r.xor)(t[u],t[n]),8),t[i]=(0,r.wrappingAdd)(t[i],t[u]),t[e]=(0,r.rotateRight)((0,r.xor)(t[e],t[i]),7),t}function u(t,n){var e=t.slice(0);return e=i(e,0,4,8,12,n[0],n[1]),e=i(e,1,5,9,13,n[2],n[3]),e=i(e,2,6,10,14,n[4],n[5]),e=i(e,3,7,11,15,n[6],n[7]),e=i(e,0,5,10,15,n[8],n[9]),e=i(e,1,6,11,12,n[10],n[11]),e=i(e,2,7,8,13,n[12],n[13]),e=i(e,3,4,9,14,n[14],n[15])}function o(t,n){for(var e=[],r=0;r<16;r++)e[r]=t[n[r]];return e}var a=[(0,r.intu32)(1779033703),(0,r.intu32)(3144134277),(0,r.intu32)(1013904242),(0,r.intu32)(2773480762),(0,r.intu32)(1359893119),(0,r.intu32)(2600822924),(0,r.intu32)(528734635),(0,r.intu32)(1541459225)],s=[2,6,3,10,7,0,4,13,1,11,12,5,9,14,15,8]},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r,i=(r=e(1))&&r.__esModule?r:{default:r},u=e(0);function o(t){return function(t){if(Array.isArray(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function a(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=(0,u.intu32)(8),l=function(){function t(n,e,r,i,u){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.input_chaining_value=n,this.block_words=e,this.counter=r,this.block_len=i,this.flags=u}var n,e,r;return n=t,(e=[{key:"chaining_value",value:function(){return(0,u.first_8_words)((0,i.default)(this.input_chaining_value,this.block_words,this.counter,this.block_len,this.flags))}},{key:"root_output_bytes",value:function(t){for(var n=0,e=[];e.length<t;){var r=(0,i.default)(this.input_chaining_value,this.block_words,(0,u.intu64)(n),this.block_len,(0,u.or)(this.flags,s)),a=!0,l=!1,c=void 0;try{for(var f,h=r[Symbol.iterator]();!(a=(f=h.next()).done);a=!0){var d=f.value;e=[].concat(o(e),o((0,u.little_endian_bytes_from_words)([d])))}}catch(t){l=!0,c=t}finally{try{a||null==h.return||h.return()}finally{if(l)throw c}}n+=1}return e.slice(0,t)}}])&&a(n.prototype,e),r&&a(n,r),t}();n.default=l},function(t,n,e){"use strict";var r=e(4);t.exports=r.default},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=e(0),i=o(e(5)),u=o(e(2));function o(t){return t&&t.__esModule?t:{default:t}}function a(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t){return function(t){if(Array.isArray(t)){for(var n=0,e=new Array(t.length);n<t.length;n++)e[n]=t[n];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var l=(0,r.intu32)(64),c=(0,r.intu32)(4),f=[(0,r.intu32)(1779033703),(0,r.intu32)(3144134277),(0,r.intu32)(1013904242),(0,r.intu32)(2773480762),(0,r.intu32)(1359893119),(0,r.intu32)(2600822924),(0,r.intu32)(528734635),(0,r.intu32)(1541459225)],h=(0,r.intu32)(16),d=(0,r.intu32)(32),_=(0,r.intu32)(64);function v(t,n,e,i){var o=[].concat(s(t.slice(0,8)),s(n.slice(0,8)));return new u.default(e,o,(0,r.intu64)(0),l,(0,r.or)(c,i))}function p(t){for(var n=new Uint8Array(t.length),e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}var g=function(){function t(n,e){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.chunk_state=new i.default(n,0,e),this.key=n,this.cv_stack=[],this.cv_stack_len=0,this.flags=e}var n,e,u;return n=t,u=[{key:"newRegular",value:function(){return new t(f,(0,r.intu32)(0))}},{key:"newKeyed",value:function(n){return"string"==typeof n?n=p(n):input=new Uint8Array(n),new t((0,r.words_from_little_endian_bytes)(n),h)}},{key:"newDeriveKey",value:function(n){var e=new t(f,d);e.update(n);var i=e.finalize(32,"bytes");return new t((0,r.words_from_little_endian_bytes)(i),_)}}],(e=[{key:"pushStack",value:function(t){this.cv_stack[this.cv_stack_len]=t,this.cv_stack_len+=1}},{key:"popStack",value:function(){return this.cv_stack_len-=1,this.cv_stack[this.cv_stack_len]}},{key:"addChunkChainingValue",value:function(t,n){for(;(0,r.u64int)(n)%2==0;)e=this.popStack(),i=t,u=this.key,o=this.flags,t=v(e,i,u,o).chaining_value(),n=(0,r.bitwiseShift)(n,1);var e,i,u,o;return this.pushStack(t),n}},{key:"update",value:function(t){for(t="string"==typeof t?p(t):new Uint8Array(t);t.length;){if(1024==this.chunk_state.len()){var n=this.chunk_state.output().chaining_value(),e=(0,r.intu64)(this.chunk_state.chunk_counter+1);this.addChunkChainingValue(n,e),this.chunk_state=new i.default(this.key,(0,r.u64int)(e),this.flags)}var u=1024-this.chunk_state.len(),o=Math.min(u,t.length);this.chunk_state.update(t.slice(0,o)),t=o===t.length?[]:t.slice(o)}return this}},{key:"finalize",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"hex",e=this.chunk_state.output(),i=this.cv_stack_len;i>0;)i-=1,e=v(this.cv_stack[i],e.chaining_value(),this.key,this.flags);var u=e.root_output_bytes(t);return"hex"==n?u.map(r.u8hex).join(""):u}}])&&a(n.prototype,e),u&&a(n,u),t}();n.default=g},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=e(0),i=o(e(1)),u=o(e(2));function o(t){return t&&t.__esModule?t:{default:t}}function a(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=(0,r.intu32)(1),l=(0,r.intu32)(2),c=function(){function t(n,e,i){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.chaining_value=n,this.chunk_counter=e,(this.block=[]).length=64,this.block.fill((0,r.intu32)(0)),this.block_len=0,this.blocks_compressed=0,this.flags=i}var n,e,o;return n=t,(e=[{key:"len",value:function(){return 64*this.blocks_compressed+this.block_len}},{key:"start_flag",value:function(){return 0===this.blocks_compressed?s:(0,r.intu32)(0)}},{key:"update",value:function(t){for(;t.length;){if(64==this.block_len){var n=(0,r.words_from_little_endian_bytes)(this.block);this.chaining_value=(0,r.first_8_words)((0,i.default)(this.chaining_value,n,(0,r.intu64)(this.chunk_counter),(0,r.intu32)(64),(0,r.or)(this.flags,this.start_flag()))),this.blocks_compressed+=1,(this.block=[]).length=64,this.block.fill((0,r.intu32)(0)),this.block_len=0}for(var e=64-this.block_len,u=Math.min(e,t.length),o=0;o<u;o++){var a=o+this.block_len;this.block[a]=t[o]}this.block_len+=u,t=u===t.length?[]:t.slice(u)}}},{key:"output",value:function(){var t=(0,r.words_from_little_endian_bytes)(this.block),n=new u.default(this.chaining_value,t,(0,r.intu64)(this.chunk_counter),(0,r.intu32)(this.block_len),(0,r.or)((0,r.or)(this.flags,this.start_flag()),l));return n}}])&&a(n.prototype,e),o&&a(n,o),t}();n.default=c}]);
},{}]},{},[1])(1)
});