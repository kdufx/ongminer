!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";var r,i=n(1),o="ByteArray",a="Integer",u="String",s="Boolean",f={contractHash:"",txHost:function(t){return"https://explorer.ont.io/transaction/"+t}},h="";function c(t){return e=encodeURIComponent(l(t)),dApi.client.api.utils.strToHex(e);var e}function l(t){return(t=t.replace(/[\'\"\\\/\b\f\n\r\t]/g,"")).replace(/[\-\_\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\'\<\>\?]/g,"")}function p(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";console.info(t,e)}function g(t){return dApi.client.api.utils.hexToStr(t)}function d(t){return function(t){for(var e="",n=new Uint8Array(t),r=0;r<n.byteLength;r++){var i=n[r].toString(16);e+=i=0===i.length?"00":1===i.length?"0"+i:i}return e}(i.decode(t)).substr(2,40)}function y(t){return d(t)}function v(t){return new BigNumber(t).shiftedBy(9).toNumber()}window.App={nextBlock:null,mineBlocks:[],init:function(){this.initData()},msg:function(t){$(".msg-content").text(t),$("#msg-modal").addClass("active")},msgClose:function(){$(".modal").removeClass("active")},ruleTip:function(){$(".modal-rule-content").html("<div class='card-body'>这个一个基于星云链的挖矿游戏，只要你解开下一个区块Key,你将获得 1 NAS的奖励</div><div class='mt-3'>虽然这是个游戏，但你获得的NAS却是真实的</div><div class='mt-3'>每一次挖掘你需要消耗0.0001个NAS，并获得一个随机key，如果与下一个区块匹配，即挖矿成功！</div>"),$("#modal-rule").addClass("active")},startLoading:function(){$(".loading-lg").removeClass("hide")},endLoading:function(){$(".loading-lg").addClass("hide")},statusLog:function(t){var e=$("#status").html();e+="<div class='mt-2'>Log："+t+"</div>",$("#status").html(e),p("statusLog",t)},miningLog:function(t){var e=$("#status").html();e+="<div class='mining-log mt-2'>Log："+t+"</div>",$("#status").html(e),p("miningLog",t)},initData:function(){var t=this,e=""==h;if(this.statusLog("正在加载用户..."),e)this.statusLog("错误：钱包未安装");else{this.statusLog("当前用户："+h),this.statusLog("正在加载数据..."),this.startLoading();var n=[{type:o,value:y(h)}];this.callContract("getUser",n,function(e){t.endLoading(),t.statusLog("载入完成..."),e?(p("user:",r=JSON.parse(g(e))),t.statusLog(0==r.bids.length?"已挖到0个区块":"已挖到"+r.bids.join(",")+"号区块"),""==r.pm&&t.statusLog("上一次无挖矿记录..."),t.reloadBlocks()):p("欢迎新用户，还没挖过矿")})}},reloadBlocks:function(){var t=this;this.statusLog("加载区块数据..."),this.callContract("getBlockNumber",[],function(n){if(n){var r=parseInt(g(n));p("blocks:",r),r>0?e(1,10,r):t.statusLog("暂无区块...")}});var e=function e(r,i,o){var u=r+i>o?o:r+i;t.callContract("getBlocks",[{type:a,value:r},{type:a,value:u}],function(a){if(a){var s=JSON.parse(g(a));p("start:"+r+", end:"+u+", blocks:",s),s.forEach(function(e){t.mineBlocks.push(e)}),u==o?n():e(u,i,o)}})},n=function(){this.statusLog("区块加载完成..."),this.statusLog("准备挖矿..."),this.ruleTip()}},getBaseData:function(){},getBaseDataCB:function(t){App.endLoading();var e=JSON.parse(t.result);if(0!=e.length){App.statusLog("载入完成..."),account=e.account,App.statusLog("当前账户："+account);var n=e.preMine;e.builder?$("#builder").removeClass("hide"):$("#builder").addClass("hide");var r=e.myblocks;App.statusLog(null==r?"已挖到0个区块":"已挖到"+r.join(",")+"号区块"),null==n?App.statusLog("上一次无挖矿记录..."):(preMineKey=n[0],App.statusLog("上一次挖矿获得key:"+preMineKey+(n[1]>0?"，成功挖到"+n[1]+"号区块，获得1个NAS":"，未能成功挖到矿。"))),nextKey=e.nextKey,$(".nav-block-nextKey").text("下一个区块key："+nextKey),App.initBlocks(e.blocks)}else App.statusLog("载入失败Error")},initBlocks:function(t){this.statusLog("加载区块数据..."),console.log(t);var e="";t.forEach(function(t){preHash=t.hash,blockHeight=t.height,e+='<div class="popover popover-left"><div class="btn block m-1">'+t.height+'</div><div class="popover-container"><div class="card"><div class="card-header">height：'+t.height+'</div><div class="card-body">preHash：'+t.preHash+'</div><div class="card-body">hash：'+t.hash+'</div><div class="card-body">mine Key：'+t.key+'</div><div class="card-body">timestamp：'+t.timestamp+'</div><div class="card-footer">from：'+t.miner+"</div></div></div></div>"}),$(".miner-block").html(e),$(".nav-block-height").text("区块高度："+blockHeight),$(".nav-block-preHash").text("上一个区块哈希："+preHash),this.statusLog("区块加载完成..."),this.statusLog("准备挖矿..."),this.ruleTip()},startMining:function(){nebPay.call(dappAddress,"0.0001","startMining","",{listener:this.startMiningCB})},startMiningCB:function(t){if(null==t.txhash)return App.miningLog("挖矿失败..."+t);App.miningLog("正在挖矿..."),App.startLoading(),clearInterval(App.startMiningTimer),App.startMiningTimer=setInterval(function(){App.getMiningResult()},5e3)},getMiningResult:function(){nebPay.simulateCall(dappAddress,"0","getMining","",{listener:this.getMiningResultCB})},getMiningResultCB:function(t){if("null"==t.result)return App.miningLog("正在挖矿...");var e=JSON.parse(t.result);if(e.length>0){if(e[0]==preMineKey)return App.miningLog("正在挖矿...");App.endLoading(),preMineKey=e[0],App.miningLog("挖矿获得Key："+preMineKey+(e[1]>0?"，成功挖到"+e[1]+"号区块，获得1个NAS":"，但未能成功挖到下一个区块。")),clearInterval(App.startMiningTimer),App.miningLog("挖矿结束...")}},getBalance:function(){nebPay.simulateCall(dappAddress,"0","balance","",{listener:this.getBalanceCB})},getBalanceCB:function(t){var e=JSON.parse(t.result);console.log("balance="+e),App.statusLog("balance: "+nebPay.toNas(e))},deposit:function(){var t=$("#modal-deposit-input").val().trim();console.log("deposit="+t),nebPay.call(dappAddress,t,"deposit","",{listener:this.depositCB})},depositCB:function(t){console.log("depositCB="+t),t.txhash&&App.msgClose()},takeout:function(){var t=$("#modal-takeout-input").val().trim();console.log("takeout="+t);var e="["+t+"]";nebPay.call(dappAddress,"0","takeout",e,{listener:this.takeoutCB})},takeoutCB:function(t){console.log("takeoutCB="+t),t.txhash&&App.msgClose()},invokeContract:function(t,e,n){var r=this,i=f.contractHash,o=t;dApi.client.api.smartContract.invoke({scriptHash:i,operation:o,args:e,gasPrice:500,gasLimit:2e6}).then(function(t){if(t){p("invoke:",t);var e=!0,i="",o=t.result.length>0?t.result[0]:null;o&&"6572726f72"==o[0]?(i=g(o[1]),e=!1):n&&n(!0),e||r.statusLog("挖矿失败:"+i)}else n&&n(!1)}).catch(function(e){p(t+"___Error:",e),"TIMEOUT"==e?(r.statusLog("挖矿超时！请稍后刷新"),setTimeout(function(){n(!0)},3e3)):n(!1)})},callContract:function(t,e,n){var r=f.contractHash,i=t;dApi.client.api.smartContract.invokeRead({scriptHash:r,operation:i,args:e}).then(function(t){n&&n(t)}).catch(function(e){n(!1),p(t+"___Error:",e)})}},window.Admin={show:function(){$("#builder").removeClass("hide")},init:function(){var t=y(h),e=[{type:o,value:t}];App.invokeContract("init",e,function(t){t&&App.reloadUser()})},start:function(){var t=y(h),e=[{type:o,value:t}];App.invokeContract("start",e,function(t){t&&App.reloadRound()})},addSkin:function(t,e,n){var r=y(h),i=[{type:o,value:r},{type:u,value:c(t)},{type:a,value:v(e)},{type:a,value:n}];App.invokeContract("addSkin",i,function(t){t&&App.reloadUser()})},setSkin:function(t,e,n,r,i){var f=y(h),l=[{type:o,value:f},{type:a,value:t},{type:u,value:c(e)},{type:a,value:v(n)},{type:a,value:r},{type:s,value:i}];App.invokeContract("setSkin",l,function(t){t&&App.reloadUser()})},addBotBlock:function(t,e){var n=y(h),r=[{type:o,value:n},{type:a,value:t},{type:a,value:e}];App.invokeContract("addBotBlock",r,function(t){t&&App.reloadUser()})},setSkinQualify:function(t,e,n){var r=[{type:o,value:y(h)},{type:o,value:y(t)},{type:a,value:e},{type:s,value:n}];App.invokeContract("setSkinQualify",r,function(t){t&&App.reloadUser()})},setDipRate:function(t,e){var n=[{type:o,value:y(h)},{type:a,value:t},{type:a,value:e}];App.invokeContract("setDipRate",n,function(t){t&&App.reloadUser()})},setPosition:function(t,e,n){var r=[{type:o,value:y(h)},{type:a,value:t},{type:a,value:e},{type:a,value:n}];App.invokeContract("setPosition",r,function(t){t&&App.reloadUser()})},setRoundTime:function(t){var e=[{type:o,value:y(h)},{type:a,value:t}];App.invokeContract("setRoundTime",e,function(t){t&&App.reloadRound()})},depositPool:function(t){t=v(t);var e=y(h),n=[{type:o,value:e},{type:a,value:t}];App.invokeContract("depositPool",n,function(t){t&&t&&App.reloadRound()})},getContractBalance:function(){App.callContract("getContractBalance",[],function(t){var e;p("getContractBalance:",(e=g(t),function(t,e){return e=Math.pow(10,e),Math.round(t*e)/e}(e=new BigNumber(e).shiftedBy(-9).toNumber(),3)))})},getBlock:function(t){var e=[{type:u,value:t}];App.callContract("getBlock",e,function(t){p("getBlock:",g(t))})},getUserByRid:function(t){var e=y(h),n=[{type:o,value:e},{type:a,value:t}];App.callContract("getUser",n,function(t){p("getUserByRid:",g(t))})}},window.Local={set:function(t,e){localStorage.setItem(t,e)},get:function(t){return localStorage.getItem(t)}},window.addEventListener("load",function(){dApi.client.registerClient({}),dApi.client.api.asset.getAccount().then(function(t){h=t,p("当前地址：",t),function(){if(""==h)return $("#noExtension").removeClass("hide"),void $(".mainPage").addClass("hide");App.init()}()}).catch(function(t){p("ERROR：",t)})})},function(t,e,n){(function(t,e){(function(){var n,r,i,o;for(i=(null!==t?t.exports:void 0)||(window.Base58={}),n="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",r={},o=0;o<n.length;)r[n.charAt(o)]=o,o++;i.encode=function(t){var e,r,i;if(0===t.length)return"";for(o=void 0,i=void 0,r=[0],o=0;o<t.length;){for(i=0;i<r.length;)r[i]<<=8,i++;for(r[0]+=t[o],e=0,i=0;i<r.length;)r[i]+=e,e=r[i]/58|0,r[i]%=58,++i;for(;e;)r.push(e%58),e=e/58|0;o++}for(o=0;0===t[o]&&o<t.length-1;)r.push(0),o++;return r.reverse().map(function(t){return n[t]}).join("")},i.decode=function(t){var n,i,a,u;if(0===t.length)return new("undefined"!=typeof Uint8Array&&null!==Uint8Array?Uint8Array:e)(0);for(o=void 0,u=void 0,n=[0],o=0;o<t.length;){if(!((i=t[o])in r))throw"Base58.decode received unacceptable input. Character '"+i+"' is not in the Base58 alphabet.";for(u=0;u<n.length;)n[u]*=58,u++;for(n[0]+=r[i],a=0,u=0;u<n.length;)n[u]+=a,a=n[u]>>8,n[u]&=255,++u;for(;a;)n.push(255&a),a>>=8;o++}for(o=0;"1"===t[o]&&o<t.length-1;)n.push(0),o++;return new("undefined"!=typeof Uint8Array&&null!==Uint8Array?Uint8Array:e)(n.reverse())}}).call(this)}).call(this,n(2)(t),n(3).Buffer)},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,n){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var r=n(5),i=n(6),o=n(7);function a(){return s.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function u(t,e){if(a()<e)throw new RangeError("Invalid typed array length");return s.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=s.prototype:(null===t&&(t=new s(e)),t.length=e),t}function s(t,e,n){if(!(s.TYPED_ARRAY_SUPPORT||this instanceof s))return new s(t,e,n);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return f(this,t,e,n)}function f(t,e,n,r){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,n,r){if(e.byteLength,n<0||e.byteLength<n)throw new RangeError("'offset' is out of bounds");if(e.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");e=void 0===n&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,n):new Uint8Array(e,n,r);s.TYPED_ARRAY_SUPPORT?(t=e).__proto__=s.prototype:t=l(t,e);return t}(t,e,n,r):"string"==typeof e?function(t,e,n){"string"==typeof n&&""!==n||(n="utf8");if(!s.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|g(e,n),i=(t=u(t,r)).write(e,n);i!==r&&(t=t.slice(0,i));return t}(t,e,n):function(t,e){if(s.isBuffer(e)){var n=0|p(e.length);return 0===(t=u(t,n)).length?t:(e.copy(t,0,0,n),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(r=e.length)!=r?u(t,0):l(t,e);if("Buffer"===e.type&&o(e.data))return l(t,e.data)}var r;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function c(t,e){if(h(e),t=u(t,e<0?0:0|p(e)),!s.TYPED_ARRAY_SUPPORT)for(var n=0;n<e;++n)t[n]=0;return t}function l(t,e){var n=e.length<0?0:0|p(e.length);t=u(t,n);for(var r=0;r<n;r+=1)t[r]=255&e[r];return t}function p(t){if(t>=a())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a().toString(16)+" bytes");return 0|t}function g(t,e){if(s.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var n=t.length;if(0===n)return 0;for(var r=!1;;)switch(e){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return $(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return j(t).length;default:if(r)return $(t).length;e=(""+e).toLowerCase(),r=!0}}function d(t,e,n){var r=t[e];t[e]=t[n],t[n]=r}function y(t,e,n,r,i){if(0===t.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=i?0:t.length-1),n<0&&(n=t.length+n),n>=t.length){if(i)return-1;n=t.length-1}else if(n<0){if(!i)return-1;n=0}if("string"==typeof e&&(e=s.from(e,r)),s.isBuffer(e))return 0===e.length?-1:v(t,e,n,r,i);if("number"==typeof e)return e&=255,s.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,n):Uint8Array.prototype.lastIndexOf.call(t,e,n):v(t,[e],n,r,i);throw new TypeError("val must be string, number or Buffer")}function v(t,e,n,r,i){var o,a=1,u=t.length,s=e.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(t.length<2||e.length<2)return-1;a=2,u/=2,s/=2,n/=2}function f(t,e){return 1===a?t[e]:t.readUInt16BE(e*a)}if(i){var h=-1;for(o=n;o<u;o++)if(f(t,o)===f(e,-1===h?0:o-h)){if(-1===h&&(h=o),o-h+1===s)return h*a}else-1!==h&&(o-=o-h),h=-1}else for(n+s>u&&(n=u-s),o=n;o>=0;o--){for(var c=!0,l=0;l<s;l++)if(f(t,o+l)!==f(e,l)){c=!1;break}if(c)return o}return-1}function A(t,e,n,r){n=Number(n)||0;var i=t.length-n;r?(r=Number(r))>i&&(r=i):r=i;var o=e.length;if(o%2!=0)throw new TypeError("Invalid hex string");r>o/2&&(r=o/2);for(var a=0;a<r;++a){var u=parseInt(e.substr(2*a,2),16);if(isNaN(u))return a;t[n+a]=u}return a}function w(t,e,n,r){return H($(e,t.length-n),t,n,r)}function m(t,e,n,r){return H(function(t){for(var e=[],n=0;n<t.length;++n)e.push(255&t.charCodeAt(n));return e}(e),t,n,r)}function b(t,e,n,r){return m(t,e,n,r)}function B(t,e,n,r){return H(j(e),t,n,r)}function E(t,e,n,r){return H(function(t,e){for(var n,r,i,o=[],a=0;a<t.length&&!((e-=2)<0);++a)n=t.charCodeAt(a),r=n>>8,i=n%256,o.push(i),o.push(r);return o}(e,t.length-n),t,n,r)}function R(t,e,n){return 0===e&&n===t.length?r.fromByteArray(t):r.fromByteArray(t.slice(e,n))}function _(t,e,n){n=Math.min(t.length,n);for(var r=[],i=e;i<n;){var o,a,u,s,f=t[i],h=null,c=f>239?4:f>223?3:f>191?2:1;if(i+c<=n)switch(c){case 1:f<128&&(h=f);break;case 2:128==(192&(o=t[i+1]))&&(s=(31&f)<<6|63&o)>127&&(h=s);break;case 3:o=t[i+1],a=t[i+2],128==(192&o)&&128==(192&a)&&(s=(15&f)<<12|(63&o)<<6|63&a)>2047&&(s<55296||s>57343)&&(h=s);break;case 4:o=t[i+1],a=t[i+2],u=t[i+3],128==(192&o)&&128==(192&a)&&128==(192&u)&&(s=(15&f)<<18|(63&o)<<12|(63&a)<<6|63&u)>65535&&s<1114112&&(h=s)}null===h?(h=65533,c=1):h>65535&&(h-=65536,r.push(h>>>10&1023|55296),h=56320|1023&h),r.push(h),i+=c}return function(t){var e=t.length;if(e<=P)return String.fromCharCode.apply(String,t);var n="",r=0;for(;r<e;)n+=String.fromCharCode.apply(String,t.slice(r,r+=P));return n}(r)}e.Buffer=s,e.SlowBuffer=function(t){+t!=t&&(t=0);return s.alloc(+t)},e.INSPECT_MAX_BYTES=50,s.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=a(),s.poolSize=8192,s._augment=function(t){return t.__proto__=s.prototype,t},s.from=function(t,e,n){return f(null,t,e,n)},s.TYPED_ARRAY_SUPPORT&&(s.prototype.__proto__=Uint8Array.prototype,s.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&s[Symbol.species]===s&&Object.defineProperty(s,Symbol.species,{value:null,configurable:!0})),s.alloc=function(t,e,n){return function(t,e,n,r){return h(e),e<=0?u(t,e):void 0!==n?"string"==typeof r?u(t,e).fill(n,r):u(t,e).fill(n):u(t,e)}(null,t,e,n)},s.allocUnsafe=function(t){return c(null,t)},s.allocUnsafeSlow=function(t){return c(null,t)},s.isBuffer=function(t){return!(null==t||!t._isBuffer)},s.compare=function(t,e){if(!s.isBuffer(t)||!s.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var n=t.length,r=e.length,i=0,o=Math.min(n,r);i<o;++i)if(t[i]!==e[i]){n=t[i],r=e[i];break}return n<r?-1:r<n?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(t,e){if(!o(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);var n;if(void 0===e)for(e=0,n=0;n<t.length;++n)e+=t[n].length;var r=s.allocUnsafe(e),i=0;for(n=0;n<t.length;++n){var a=t[n];if(!s.isBuffer(a))throw new TypeError('"list" argument must be an Array of Buffers');a.copy(r,i),i+=a.length}return r},s.byteLength=g,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)d(this,e,e+1);return this},s.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)d(this,e,e+3),d(this,e+1,e+2);return this},s.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)d(this,e,e+7),d(this,e+1,e+6),d(this,e+2,e+5),d(this,e+3,e+4);return this},s.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?_(this,0,t):function(t,e,n){var r=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if((n>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return S(this,e,n);case"utf8":case"utf-8":return _(this,e,n);case"ascii":return C(this,e,n);case"latin1":case"binary":return T(this,e,n);case"base64":return R(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return L(this,e,n);default:if(r)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),r=!0}}.apply(this,arguments)},s.prototype.equals=function(t){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){var t="",n=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(t+=" ... ")),"<Buffer "+t+">"},s.prototype.compare=function(t,e,n,r,i){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===n&&(n=t?t.length:0),void 0===r&&(r=0),void 0===i&&(i=this.length),e<0||n>t.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&e>=n)return 0;if(r>=i)return-1;if(e>=n)return 1;if(this===t)return 0;for(var o=(i>>>=0)-(r>>>=0),a=(n>>>=0)-(e>>>=0),u=Math.min(o,a),f=this.slice(r,i),h=t.slice(e,n),c=0;c<u;++c)if(f[c]!==h[c]){o=f[c],a=h[c];break}return o<a?-1:a<o?1:0},s.prototype.includes=function(t,e,n){return-1!==this.indexOf(t,e,n)},s.prototype.indexOf=function(t,e,n){return y(this,t,e,n,!0)},s.prototype.lastIndexOf=function(t,e,n){return y(this,t,e,n,!1)},s.prototype.write=function(t,e,n,r){if(void 0===e)r="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)r=e,n=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-e;if((void 0===n||n>i)&&(n=i),t.length>0&&(n<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var o=!1;;)switch(r){case"hex":return A(this,t,e,n);case"utf8":case"utf-8":return w(this,t,e,n);case"ascii":return m(this,t,e,n);case"latin1":case"binary":return b(this,t,e,n);case"base64":return B(this,t,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return E(this,t,e,n);default:if(o)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),o=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var P=4096;function C(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;i<n;++i)r+=String.fromCharCode(127&t[i]);return r}function T(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;i<n;++i)r+=String.fromCharCode(t[i]);return r}function S(t,e,n){var r=t.length;(!e||e<0)&&(e=0),(!n||n<0||n>r)&&(n=r);for(var i="",o=e;o<n;++o)i+=N(t[o]);return i}function L(t,e,n){for(var r=t.slice(e,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function U(t,e,n){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function k(t,e,n,r,i,o){if(!s.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(n+r>t.length)throw new RangeError("Index out of range")}function M(t,e,n,r){e<0&&(e=65535+e+1);for(var i=0,o=Math.min(t.length-n,2);i<o;++i)t[n+i]=(e&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function I(t,e,n,r){e<0&&(e=4294967295+e+1);for(var i=0,o=Math.min(t.length-n,4);i<o;++i)t[n+i]=e>>>8*(r?i:3-i)&255}function x(t,e,n,r,i,o){if(n+r>t.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function O(t,e,n,r,o){return o||x(t,0,n,4),i.write(t,e,n,r,23,4),n+4}function Y(t,e,n,r,o){return o||x(t,0,n,8),i.write(t,e,n,r,52,8),n+8}s.prototype.slice=function(t,e){var n,r=this.length;if((t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t),s.TYPED_ARRAY_SUPPORT)(n=this.subarray(t,e)).__proto__=s.prototype;else{var i=e-t;n=new s(i,void 0);for(var o=0;o<i;++o)n[o]=this[o+t]}return n},s.prototype.readUIntLE=function(t,e,n){t|=0,e|=0,n||U(t,e,this.length);for(var r=this[t],i=1,o=0;++o<e&&(i*=256);)r+=this[t+o]*i;return r},s.prototype.readUIntBE=function(t,e,n){t|=0,e|=0,n||U(t,e,this.length);for(var r=this[t+--e],i=1;e>0&&(i*=256);)r+=this[t+--e]*i;return r},s.prototype.readUInt8=function(t,e){return e||U(t,1,this.length),this[t]},s.prototype.readUInt16LE=function(t,e){return e||U(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUInt16BE=function(t,e){return e||U(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUInt32LE=function(t,e){return e||U(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUInt32BE=function(t,e){return e||U(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readIntLE=function(t,e,n){t|=0,e|=0,n||U(t,e,this.length);for(var r=this[t],i=1,o=0;++o<e&&(i*=256);)r+=this[t+o]*i;return r>=(i*=128)&&(r-=Math.pow(2,8*e)),r},s.prototype.readIntBE=function(t,e,n){t|=0,e|=0,n||U(t,e,this.length);for(var r=e,i=1,o=this[t+--r];r>0&&(i*=256);)o+=this[t+--r]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*e)),o},s.prototype.readInt8=function(t,e){return e||U(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},s.prototype.readInt16LE=function(t,e){e||U(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt16BE=function(t,e){e||U(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt32LE=function(t,e){return e||U(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,e){return e||U(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readFloatLE=function(t,e){return e||U(t,4,this.length),i.read(this,t,!0,23,4)},s.prototype.readFloatBE=function(t,e){return e||U(t,4,this.length),i.read(this,t,!1,23,4)},s.prototype.readDoubleLE=function(t,e){return e||U(t,8,this.length),i.read(this,t,!0,52,8)},s.prototype.readDoubleBE=function(t,e){return e||U(t,8,this.length),i.read(this,t,!1,52,8)},s.prototype.writeUIntLE=function(t,e,n,r){(t=+t,e|=0,n|=0,r)||k(this,t,e,n,Math.pow(2,8*n)-1,0);var i=1,o=0;for(this[e]=255&t;++o<n&&(i*=256);)this[e+o]=t/i&255;return e+n},s.prototype.writeUIntBE=function(t,e,n,r){(t=+t,e|=0,n|=0,r)||k(this,t,e,n,Math.pow(2,8*n)-1,0);var i=n-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+n},s.prototype.writeUInt8=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,1,255,0),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},s.prototype.writeUInt16LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):M(this,t,e,!0),e+2},s.prototype.writeUInt16BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):M(this,t,e,!1),e+2},s.prototype.writeUInt32LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):I(this,t,e,!0),e+4},s.prototype.writeUInt32BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):I(this,t,e,!1),e+4},s.prototype.writeIntLE=function(t,e,n,r){if(t=+t,e|=0,!r){var i=Math.pow(2,8*n-1);k(this,t,e,n,i-1,-i)}var o=0,a=1,u=0;for(this[e]=255&t;++o<n&&(a*=256);)t<0&&0===u&&0!==this[e+o-1]&&(u=1),this[e+o]=(t/a>>0)-u&255;return e+n},s.prototype.writeIntBE=function(t,e,n,r){if(t=+t,e|=0,!r){var i=Math.pow(2,8*n-1);k(this,t,e,n,i-1,-i)}var o=n-1,a=1,u=0;for(this[e+o]=255&t;--o>=0&&(a*=256);)t<0&&0===u&&0!==this[e+o+1]&&(u=1),this[e+o]=(t/a>>0)-u&255;return e+n},s.prototype.writeInt8=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,1,127,-128),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},s.prototype.writeInt16LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):M(this,t,e,!0),e+2},s.prototype.writeInt16BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):M(this,t,e,!1),e+2},s.prototype.writeInt32LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,2147483647,-2147483648),s.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):I(this,t,e,!0),e+4},s.prototype.writeInt32BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),s.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):I(this,t,e,!1),e+4},s.prototype.writeFloatLE=function(t,e,n){return O(this,t,e,!0,n)},s.prototype.writeFloatBE=function(t,e,n){return O(this,t,e,!1,n)},s.prototype.writeDoubleLE=function(t,e,n){return Y(this,t,e,!0,n)},s.prototype.writeDoubleBE=function(t,e,n){return Y(this,t,e,!1,n)},s.prototype.copy=function(t,e,n,r){if(n||(n=0),r||0===r||(r=this.length),e>=t.length&&(e=t.length),e||(e=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),t.length-e<r-n&&(r=t.length-e+n);var i,o=r-n;if(this===t&&n<e&&e<r)for(i=o-1;i>=0;--i)t[i+e]=this[i+n];else if(o<1e3||!s.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)t[i+e]=this[i+n];else Uint8Array.prototype.set.call(t,this.subarray(n,n+o),e);return o},s.prototype.fill=function(t,e,n,r){if("string"==typeof t){if("string"==typeof e?(r=e,e=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!s.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<n)throw new RangeError("Out of range index");if(n<=e)return this;var o;if(e>>>=0,n=void 0===n?this.length:n>>>0,t||(t=0),"number"==typeof t)for(o=e;o<n;++o)this[o]=t;else{var a=s.isBuffer(t)?t:$(new s(t,r).toString()),u=a.length;for(o=0;o<n-e;++o)this[o+e]=a[o%u]}return this};var D=/[^+\/0-9A-Za-z-_]/g;function N(t){return t<16?"0"+t.toString(16):t.toString(16)}function $(t,e){var n;e=e||1/0;for(var r=t.length,i=null,o=[],a=0;a<r;++a){if((n=t.charCodeAt(a))>55295&&n<57344){if(!i){if(n>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(a+1===r){(e-=3)>-1&&o.push(239,191,189);continue}i=n;continue}if(n<56320){(e-=3)>-1&&o.push(239,191,189),i=n;continue}n=65536+(i-55296<<10|n-56320)}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,n<128){if((e-=1)<0)break;o.push(n)}else if(n<2048){if((e-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(n<65536){if((e-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function j(t){return r.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(D,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function H(t,e,n,r){for(var i=0;i<r&&!(i+n>=e.length||i>=t.length);++i)e[i+n]=t[i];return i}}).call(this,n(4))},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";e.byteLength=function(t){var e=f(t),n=e[0],r=e[1];return 3*(n+r)/4-r},e.toByteArray=function(t){for(var e,n=f(t),r=n[0],a=n[1],u=new o(function(t,e,n){return 3*(e+n)/4-n}(0,r,a)),s=0,h=a>0?r-4:r,c=0;c<h;c+=4)e=i[t.charCodeAt(c)]<<18|i[t.charCodeAt(c+1)]<<12|i[t.charCodeAt(c+2)]<<6|i[t.charCodeAt(c+3)],u[s++]=e>>16&255,u[s++]=e>>8&255,u[s++]=255&e;2===a&&(e=i[t.charCodeAt(c)]<<2|i[t.charCodeAt(c+1)]>>4,u[s++]=255&e);1===a&&(e=i[t.charCodeAt(c)]<<10|i[t.charCodeAt(c+1)]<<4|i[t.charCodeAt(c+2)]>>2,u[s++]=e>>8&255,u[s++]=255&e);return u},e.fromByteArray=function(t){for(var e,n=t.length,i=n%3,o=[],a=0,u=n-i;a<u;a+=16383)o.push(h(t,a,a+16383>u?u:a+16383));1===i?(e=t[n-1],o.push(r[e>>2]+r[e<<4&63]+"==")):2===i&&(e=(t[n-2]<<8)+t[n-1],o.push(r[e>>10]+r[e>>4&63]+r[e<<2&63]+"="));return o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",u=0,s=a.length;u<s;++u)r[u]=a[u],i[a.charCodeAt(u)]=u;function f(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var n=t.indexOf("=");return-1===n&&(n=e),[n,n===e?0:4-n%4]}function h(t,e,n){for(var i,o,a=[],u=e;u<n;u+=3)i=(t[u]<<16&16711680)+(t[u+1]<<8&65280)+(255&t[u+2]),a.push(r[(o=i)>>18&63]+r[o>>12&63]+r[o>>6&63]+r[63&o]);return a.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},function(t,e){e.read=function(t,e,n,r,i){var o,a,u=8*i-r-1,s=(1<<u)-1,f=s>>1,h=-7,c=n?i-1:0,l=n?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-h)-1,p>>=-h,h+=u;h>0;o=256*o+t[e+c],c+=l,h-=8);for(a=o&(1<<-h)-1,o>>=-h,h+=r;h>0;a=256*a+t[e+c],c+=l,h-=8);if(0===o)o=1-f;else{if(o===s)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,r),o-=f}return(p?-1:1)*a*Math.pow(2,o-r)},e.write=function(t,e,n,r,i,o){var a,u,s,f=8*o-i-1,h=(1<<f)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=r?0:o-1,g=r?1:-1,d=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(u=isNaN(e)?1:0,a=h):(a=Math.floor(Math.log(e)/Math.LN2),e*(s=Math.pow(2,-a))<1&&(a--,s*=2),(e+=a+c>=1?l/s:l*Math.pow(2,1-c))*s>=2&&(a++,s/=2),a+c>=h?(u=0,a=h):a+c>=1?(u=(e*s-1)*Math.pow(2,i),a+=c):(u=e*Math.pow(2,c-1)*Math.pow(2,i),a=0));i>=8;t[n+p]=255&u,p+=g,u/=256,i-=8);for(a=a<<i|u,f+=i;f>0;t[n+p]=255&a,p+=g,a/=256,f-=8);t[n+p-g]|=128*d}},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}}]);