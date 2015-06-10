/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
window.PolymerGestures={},function(a){var b=!1,c=document.createElement("meta");if(c.createShadowRoot){var d=c.createShadowRoot(),e=document.createElement("span");d.appendChild(e),c.addEventListener("testpath",function(a){a.path&&(b=a.path[0]===e),a.stopPropagation()});var f=new CustomEvent("testpath",{bubbles:!0});document.head.appendChild(c),e.dispatchEvent(f),c.parentNode.removeChild(c),d=e=null}c=null;var g={shadow:function(a){return a?a.shadowRoot||a.webkitShadowRoot:void 0},canTarget:function(a){return a&&Boolean(a.elementFromPoint)},targetingShadow:function(a){var b=this.shadow(a);return this.canTarget(b)?b:void 0},olderShadow:function(a){var b=a.olderShadowRoot;if(!b){var c=a.querySelector("shadow");c&&(b=c.olderShadowRoot)}return b},allShadows:function(a){for(var b=[],c=this.shadow(a);c;)b.push(c),c=this.olderShadow(c);return b},searchRoot:function(a,b,c){var d,e;return a?(d=a.elementFromPoint(b,c),d?e=this.targetingShadow(d):a!==document&&(e=this.olderShadow(a)),this.searchRoot(e,b,c)||d):void 0},owner:function(a){if(!a)return document;for(var b=a;b.parentNode;)b=b.parentNode;return b.nodeType!=Node.DOCUMENT_NODE&&b.nodeType!=Node.DOCUMENT_FRAGMENT_NODE&&(b=document),b},findTarget:function(a){if(b&&a.path&&a.path.length)return a.path[0];var c=a.clientX,d=a.clientY,e=this.owner(a.target);return e.elementFromPoint(c,d)||(e=document),this.searchRoot(e,c,d)},findTouchAction:function(a){var c;if(b&&a.path&&a.path.length){for(var d=a.path,e=0;e<d.length;e++)if(c=d[e],c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action")}else for(c=a.target;c;){if(c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action");c=c.parentNode||c.host}return"auto"},LCA:function(a,b){if(a===b)return a;if(a&&!b)return a;if(b&&!a)return b;if(!b&&!a)return document;if(a.contains&&a.contains(b))return a;if(b.contains&&b.contains(a))return b;var c=this.depth(a),d=this.depth(b),e=c-d;for(e>=0?a=this.walk(a,e):b=this.walk(b,-e);a&&b&&a!==b;)a=a.parentNode||a.host,b=b.parentNode||b.host;return a},walk:function(a,b){for(var c=0;a&&b>c;c++)a=a.parentNode||a.host;return a},depth:function(a){for(var b=0;a;)b++,a=a.parentNode||a.host;return b},deepContains:function(a,b){var c=this.LCA(a,b);return c===a},insideNode:function(a,b,c){var d=a.getBoundingClientRect();return d.left<=b&&b<=d.right&&d.top<=c&&c<=d.bottom},path:function(a){var c;if(b&&a.path&&a.path.length)c=a.path;else{c=[];for(var d=this.findTarget(a);d;)c.push(d),d=d.parentNode||d.host}return c}};a.targetFinding=g,a.findTarget=g.findTarget.bind(g),a.deepContains=g.deepContains.bind(g),a.insideNode=g.insideNode}(window.PolymerGestures),function(){function a(a){return"html /deep/ "+b(a)}function b(a){return'[touch-action="'+a+'"]'}function c(a){return"{ -ms-touch-action: "+a+"; touch-action: "+a+";}"}var d=["none","auto","pan-x","pan-y",{rule:"pan-x pan-y",selectors:["pan-x pan-y","pan-y pan-x"]},"manipulation"],e="",f="string"==typeof document.head.style.touchAction,g=!window.ShadowDOMPolyfill&&document.head.createShadowRoot;if(f){d.forEach(function(d){String(d)===d?(e+=b(d)+c(d)+"\n",g&&(e+=a(d)+c(d)+"\n")):(e+=d.selectors.map(b)+c(d.rule)+"\n",g&&(e+=d.selectors.map(a)+c(d.rule)+"\n"))});var h=document.createElement("style");h.textContent=e,document.head.appendChild(h)}}(),function(a){var b=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","pageX","pageY"],c=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0],d=function(){return function(){}},e={preventTap:d,makeBaseEvent:function(a,b){var c=document.createEvent("Event");return c.initEvent(a,b.bubbles||!1,b.cancelable||!1),c.preventTap=e.preventTap(c),c},makeGestureEvent:function(a,b){b=b||Object.create(null);for(var c,d=this.makeBaseEvent(a,b),e=0,f=Object.keys(b);e<f.length;e++)c=f[e],"bubbles"!==c&&"cancelable"!==c&&(d[c]=b[c]);return d},makePointerEvent:function(a,d){d=d||Object.create(null);for(var e,f=this.makeBaseEvent(a,d),g=2;g<b.length;g++)e=b[g],f[e]=d[e]||c[g];f.buttons=d.buttons||0;var h=0;return h=d.pressure?d.pressure:f.buttons?.5:0,f.x=f.clientX,f.y=f.clientY,f.pointerId=d.pointerId||0,f.width=d.width||0,f.height=d.height||0,f.pressure=h,f.tiltX=d.tiltX||0,f.tiltY=d.tiltY||0,f.pointerType=d.pointerType||"",f.hwTimestamp=d.hwTimestamp||0,f.isPrimary=d.isPrimary||!1,f._source=d._source||"",f}};a.eventFactory=e}(window.PolymerGestures),function(a){function b(){if(c){var a=new Map;return a.pointers=d,a}this.keys=[],this.values=[]}var c=window.Map&&window.Map.prototype.forEach,d=function(){return this.size};b.prototype={set:function(a,b){var c=this.keys.indexOf(a);c>-1?this.values[c]=b:(this.keys.push(a),this.values.push(b))},has:function(a){return this.keys.indexOf(a)>-1},"delete":function(a){var b=this.keys.indexOf(a);b>-1&&(this.keys.splice(b,1),this.values.splice(b,1))},get:function(a){var b=this.keys.indexOf(a);return this.values[b]},clear:function(){this.keys.length=0,this.values.length=0},forEach:function(a,b){this.values.forEach(function(c,d){a.call(b,c,this.keys[d],this)},this)},pointers:function(){return this.keys.length}},a.PointerMap=b}(window.PolymerGestures),function(a){var b,c=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","buttons","pointerId","width","height","pressure","tiltX","tiltY","pointerType","hwTimestamp","isPrimary","type","target","currentTarget","which","pageX","pageY","timeStamp","preventTap","tapPrevented","_source"],d=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0,0,0,0,0,0,"",0,!1,"",null,null,0,0,0,0,function(){},!1],e="undefined"!=typeof SVGElementInstance,f=a.eventFactory,g={IS_IOS:!1,pointermap:new a.PointerMap,requiredGestures:new a.PointerMap,eventMap:Object.create(null),eventSources:Object.create(null),eventSourceList:[],gestures:[],dependencyMap:{down:{listeners:0,index:-1},up:{listeners:0,index:-1}},gestureQueue:[],registerSource:function(a,b){var c=b,d=c.events;d&&(d.forEach(function(a){c[a]&&(this.eventMap[a]=c[a].bind(c))},this),this.eventSources[a]=c,this.eventSourceList.push(c))},registerGesture:function(a,b){var c=Object.create(null);c.listeners=0,c.index=this.gestures.length;for(var d,e=0;e<b.exposes.length;e++)d=b.exposes[e].toLowerCase(),this.dependencyMap[d]=c;this.gestures.push(b)},register:function(a,b){for(var c,d=this.eventSourceList.length,e=0;d>e&&(c=this.eventSourceList[e]);e++)c.register.call(c,a,b)},unregister:function(a){for(var b,c=this.eventSourceList.length,d=0;c>d&&(b=this.eventSourceList[d]);d++)b.unregister.call(b,a)},down:function(a){this.requiredGestures.set(a.pointerId,b),this.fireEvent("down",a)},move:function(a){a.type="move",this.fillGestureQueue(a)},up:function(a){this.fireEvent("up",a),this.requiredGestures["delete"](a.pointerId)},cancel:function(a){a.tapPrevented=!0,this.fireEvent("up",a),this.requiredGestures["delete"](a.pointerId)},addGestureDependency:function(a,b){var c=a._pgEvents;if(c&&b)for(var d,e,f,g=Object.keys(c),h=0;h<g.length;h++)f=g[h],c[f]>0&&(d=this.dependencyMap[f],e=d?d.index:-1,b[e]=!0)},eventHandler:function(c){var d=c.type;if("touchstart"===d||"mousedown"===d||"pointerdown"===d||"MSPointerDown"===d)if(c._handledByPG||(b={}),this.IS_IOS){var e=c;if("touchstart"===d){var f=c.changedTouches[0];e={target:c.target,clientX:f.clientX,clientY:f.clientY,path:c.path}}for(var g,h=c.path||a.targetFinding.path(e),i=0;i<h.length;i++)g=h[i],this.addGestureDependency(g,b)}else this.addGestureDependency(c.currentTarget,b);if(!c._handledByPG){var j=this.eventMap&&this.eventMap[d];j&&j(c),c._handledByPG=!0}},listen:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.addEvent(a,c)},unlisten:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.removeEvent(a,c)},addEvent:function(a,b){a.addEventListener(b,this.boundHandler)},removeEvent:function(a,b){a.removeEventListener(b,this.boundHandler)},makeEvent:function(a,b){var c=f.makePointerEvent(a,b);return c.preventDefault=b.preventDefault,c.tapPrevented=b.tapPrevented,c._target=c._target||b.target,c},fireEvent:function(a,b){var c=this.makeEvent(a,b);return this.dispatchEvent(c)},cloneEvent:function(a){for(var b,f=Object.create(null),g=0;g<c.length;g++)b=c[g],f[b]=a[b]||d[g],("target"===b||"relatedTarget"===b)&&e&&f[b]instanceof SVGElementInstance&&(f[b]=f[b].correspondingUseElement);return f.preventDefault=function(){a.preventDefault()},f},dispatchEvent:function(a){var b=a._target;if(b){b.dispatchEvent(a);var c=this.cloneEvent(a);c.target=b,this.fillGestureQueue(c)}},gestureTrigger:function(){for(var a,b,c=0;c<this.gestureQueue.length;c++)if(a=this.gestureQueue[c],b=a._requiredGestures)for(var d,e,f=0;f<this.gestures.length;f++)b[f]&&(d=this.gestures[f],e=d[a.type],e&&e.call(d,a));this.gestureQueue.length=0},fillGestureQueue:function(a){this.gestureQueue.length||requestAnimationFrame(this.boundGestureTrigger),a._requiredGestures=this.requiredGestures.get(a.pointerId),this.gestureQueue.push(a)}};g.boundHandler=g.eventHandler.bind(g),g.boundGestureTrigger=g.gestureTrigger.bind(g),a.dispatcher=g,a.activateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];if(d){var e=g.gestures[d.index];if(a._pgListeners||(g.register(a),a._pgListeners=0),e){var f,h=e.defaultActions&&e.defaultActions[c];switch(a.nodeType){case Node.ELEMENT_NODE:f=a;break;case Node.DOCUMENT_FRAGMENT_NODE:f=a.host;break;default:f=null}h&&f&&!f.hasAttribute("touch-action")&&f.setAttribute("touch-action",h)}a._pgEvents||(a._pgEvents={}),a._pgEvents[c]=(a._pgEvents[c]||0)+1,a._pgListeners++}return Boolean(d)},a.addEventListener=function(b,c,d,e){d&&(a.activateGesture(b,c),b.addEventListener(c,d,e))},a.deactivateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];return d&&(a._pgListeners>0&&a._pgListeners--,0===a._pgListeners&&g.unregister(a),a._pgEvents&&(a._pgEvents[c]>0?a._pgEvents[c]--:a._pgEvents[c]=0)),Boolean(d)},a.removeEventListener=function(b,c,d,e){d&&(a.deactivateGesture(b,c),b.removeEventListener(c,d,e))}}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=25,e=[0,1,4,2],f=0,g=/Linux.*Firefox\//i,h=function(){if(g.test(navigator.userAgent))return!1;try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(a){return!1}}(),i={POINTER_ID:1,POINTER_TYPE:"mouse",events:["mousedown","mousemove","mouseup"],exposes:["down","up","move"],register:function(a){b.listen(a,this.events)},unregister:function(a){a.nodeType!==Node.DOCUMENT_NODE&&b.unlisten(a,this.events)},lastTouches:[],isEventSimulatedFromTouch:function(a){for(var b,c=this.lastTouches,e=a.clientX,f=a.clientY,g=0,h=c.length;h>g&&(b=c[g]);g++){var i=Math.abs(e-b.x),j=Math.abs(f-b.y);if(d>=i&&d>=j)return!0}},prepareEvent:function(a){var c=b.cloneEvent(a);if(c.pointerId=this.POINTER_ID,c.isPrimary=!0,c.pointerType=this.POINTER_TYPE,c._source="mouse",!h){var d=a.type,g=e[a.which]||0;"mousedown"===d?f|=g:"mouseup"===d&&(f&=~g),c.buttons=f}return c},mousedown:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=(c.has(this.POINTER_ID),this.prepareEvent(d));e.target=a.findTarget(d),c.set(this.POINTER_ID,e.target),b.down(e)}},mousemove:function(a){if(!this.isEventSimulatedFromTouch(a)){var d=c.get(this.POINTER_ID);if(d){var e=this.prepareEvent(a);e.target=d,0===(h?e.buttons:e.which)?(h||(f=e.buttons=0),b.cancel(e),this.cleanupMouse(e.buttons)):b.move(e)}}},mouseup:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(this.POINTER_ID),b.up(e),this.cleanupMouse(e.buttons)}},cleanupMouse:function(a){0===a&&c["delete"](this.POINTER_ID)}};a.mouseEvents=i}(window.PolymerGestures),function(a){var b=a.dispatcher,c=(a.targetFinding.allShadows.bind(a.targetFinding),b.pointermap),d=(Array.prototype.map.call.bind(Array.prototype.map),2500),e=25,f=200,g=20,h=!1,i={IS_IOS:!1,events:["touchstart","touchmove","touchend","touchcancel"],exposes:["down","up","move"],register:function(a,c){(this.IS_IOS?c:!c)&&b.listen(a,this.events)},unregister:function(a){this.IS_IOS||b.unlisten(a,this.events)},scrollTypes:{EMITTER:"none",XSCROLLER:"pan-x",YSCROLLER:"pan-y"},touchActionToScrollType:function(a){var b=a,c=this.scrollTypes;return b===c.EMITTER?"none":b===c.XSCROLLER?"X":b===c.YSCROLLER?"Y":"XY"},POINTER_TYPE:"touch",firstTouch:null,isPrimaryTouch:function(a){return this.firstTouch===a.identifier},setPrimaryTouch:function(a){(0===c.pointers()||1===c.pointers()&&c.has(1))&&(this.firstTouch=a.identifier,this.firstXY={X:a.clientX,Y:a.clientY},this.firstTarget=a.target,this.scrolling=null,this.cancelResetClickCount())},removePrimaryPointer:function(a){a.isPrimary&&(this.firstTouch=null,this.firstXY=null,this.resetClickCount())},clickCount:0,resetId:null,resetClickCount:function(){var a=function(){this.clickCount=0,this.resetId=null}.bind(this);this.resetId=setTimeout(a,f)},cancelResetClickCount:function(){this.resetId&&clearTimeout(this.resetId)},typeToButtons:function(a){var b=0;return("touchstart"===a||"touchmove"===a)&&(b=1),b},findTarget:function(b,d){if("touchstart"===this.currentTouchEvent.type){if(this.isPrimaryTouch(b)){var e={clientX:b.clientX,clientY:b.clientY,path:this.currentTouchEvent.path,target:this.currentTouchEvent.target};return a.findTarget(e)}return a.findTarget(b)}return c.get(d)},touchToPointer:function(a){var c=this.currentTouchEvent,d=b.cloneEvent(a),e=d.pointerId=a.identifier+2;d.target=this.findTarget(a,e),d.bubbles=!0,d.cancelable=!0,d.detail=this.clickCount,d.buttons=this.typeToButtons(c.type),d.width=a.webkitRadiusX||a.radiusX||0,d.height=a.webkitRadiusY||a.radiusY||0,d.pressure=a.webkitForce||a.force||.5,d.isPrimary=this.isPrimaryTouch(a),d.pointerType=this.POINTER_TYPE,d._source="touch";var f=this;return d.preventDefault=function(){f.scrolling=!1,f.firstXY=null,c.preventDefault()},d},processTouches:function(a,b){var d=a.changedTouches;this.currentTouchEvent=a;for(var e,f,g=0;g<d.length;g++)e=d[g],f=this.touchToPointer(e),"touchstart"===a.type&&c.set(f.pointerId,f.target),c.has(f.pointerId)&&b.call(this,f),("touchend"===a.type||a._cancel)&&this.cleanUpPointer(f)},shouldScroll:function(b){if(this.firstXY){var c,d=a.targetFinding.findTouchAction(b),e=this.touchActionToScrollType(d);if("none"===e)c=!1;else if("XY"===e)c=!0;else{var f=b.changedTouches[0],g=e,h="Y"===e?"X":"Y",i=Math.abs(f["client"+g]-this.firstXY[g]),j=Math.abs(f["client"+h]-this.firstXY[h]);c=i>=j}return c}},findTouch:function(a,b){for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)if(c.identifier===b)return!0},vacuumTouches:function(a){var b=a.touches;if(c.pointers()>=b.length){var d=[];c.forEach(function(a,c){if(1!==c&&!this.findTouch(b,c-2)){var e=a;d.push(e)}},this),d.forEach(function(a){this.cancel(a),c["delete"](a.pointerId)},this)}},touchstart:function(a){this.vacuumTouches(a),this.setPrimaryTouch(a.changedTouches[0]),this.dedupSynthMouse(a),this.scrolling||(this.clickCount++,this.processTouches(a,this.down))},down:function(a){b.down(a)},touchmove:function(a){if(h)a.cancelable&&this.processTouches(a,this.move);else if(this.scrolling){if(this.firstXY){var b=a.changedTouches[0],c=b.clientX-this.firstXY.X,d=b.clientY-this.firstXY.Y,e=Math.sqrt(c*c+d*d);e>=g&&(this.touchcancel(a),this.scrolling=!0,this.firstXY=null)}}else null===this.scrolling&&this.shouldScroll(a)?this.scrolling=!0:(this.scrolling=!1,a.preventDefault(),this.processTouches(a,this.move))},move:function(a){b.move(a)},touchend:function(a){this.dedupSynthMouse(a),this.processTouches(a,this.up)},up:function(c){c.relatedTarget=a.findTarget(c),b.up(c)},cancel:function(a){b.cancel(a)},touchcancel:function(a){a._cancel=!0,this.processTouches(a,this.cancel)},cleanUpPointer:function(a){c["delete"](a.pointerId),this.removePrimaryPointer(a)},dedupSynthMouse:function(b){var c=a.mouseEvents.lastTouches,e=b.changedTouches[0];if(this.isPrimaryTouch(e)){var f={x:e.clientX,y:e.clientY};c.push(f);var g=function(a,b){var c=a.indexOf(b);c>-1&&a.splice(c,1)}.bind(null,c,f);setTimeout(g,d)}}},j=Event.prototype.stopImmediatePropagation||Event.prototype.stopPropagation;document.addEventListener("click",function(b){var c=b.clientX,d=b.clientY,f=function(a){var b=Math.abs(c-a.x),f=Math.abs(d-a.y);return e>=b&&e>=f},g=a.mouseEvents.lastTouches.some(f),h=a.targetFinding.path(b);if(g){for(var k=0;k<h.length;k++)if(h[k]===i.firstTarget)return;b.preventDefault(),j.call(b)}},!0),a.touchEvents=i}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=window.MSPointerEvent&&"number"==typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,e={events:["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel"],register:function(a){b.listen(a,this.events)},unregister:function(a){a.nodeType!==Node.DOCUMENT_NODE&&b.unlisten(a,this.events)},POINTER_TYPES:["","unavailable","touch","pen","mouse"],prepareEvent:function(a){var c=a;return c=b.cloneEvent(a),d&&(c.pointerType=this.POINTER_TYPES[a.pointerType]),c._source="ms",c},cleanup:function(a){c["delete"](a)},MSPointerDown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(d.pointerId,e.target),b.down(e)},MSPointerMove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},MSPointerUp:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},MSPointerCancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.msEvents=e}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d={events:["pointerdown","pointermove","pointerup","pointercancel"],prepareEvent:function(a){var c=b.cloneEvent(a);return c._source="pointer",c},register:function(a){b.listen(a,this.events)},unregister:function(a){a.nodeType!==Node.DOCUMENT_NODE&&b.unlisten(a,this.events)},cleanup:function(a){c["delete"](a)},pointerdown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(e.pointerId,e.target),b.down(e)},pointermove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},pointerup:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},pointercancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.pointerEvents=d}(window.PolymerGestures),function(a){var b=a.dispatcher,c=window.navigator;window.PointerEvent?b.registerSource("pointer",a.pointerEvents):c.msPointerEnabled?b.registerSource("ms",a.msEvents):(b.registerSource("mouse",a.mouseEvents),void 0!==window.ontouchstart&&b.registerSource("touch",a.touchEvents));var d=navigator.userAgent,e=d.match(/iPad|iPhone|iPod/)&&"ontouchstart"in window;b.IS_IOS=e,a.touchEvents.IS_IOS=e,b.register(document,!0)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","move","up"],exposes:["trackstart","track","trackx","tracky","trackend"],defaultActions:{track:"none",trackx:"pan-y",tracky:"pan-x"},WIGGLE_THRESHOLD:4,clampDir:function(a){return a>0?1:-1},calcPositionDelta:function(a,b){var c=0,d=0;return a&&b&&(c=b.pageX-a.pageX,d=b.pageY-a.pageY),{x:c,y:d}},fireTrack:function(a,b,d){var e=d,f=this.calcPositionDelta(e.downEvent,b),g=this.calcPositionDelta(e.lastMoveEvent,b);if(g.x)e.xDirection=this.clampDir(g.x);else if("trackx"===a)return;if(g.y)e.yDirection=this.clampDir(g.y);else if("tracky"===a)return;var h={bubbles:!0,cancelable:!0,trackInfo:e.trackInfo,relatedTarget:b.relatedTarget,pointerType:b.pointerType,pointerId:b.pointerId,_source:"track"};"tracky"!==a&&(h.x=b.x,h.dx=f.x,h.ddx=g.x,h.clientX=b.clientX,h.pageX=b.pageX,h.screenX=b.screenX,h.xDirection=e.xDirection),"trackx"!==a&&(h.dy=f.y,h.ddy=g.y,h.y=b.y,h.clientY=b.clientY,h.pageY=b.pageY,h.screenY=b.screenY,h.yDirection=e.yDirection);var i=c.makeGestureEvent(a,h);e.downTarget.dispatchEvent(i)},down:function(a){if(a.isPrimary&&("mouse"===a.pointerType?1===a.buttons:!0)){var b={downEvent:a,downTarget:a.target,trackInfo:{},lastMoveEvent:null,xDirection:0,yDirection:0,tracking:!1};d.set(a.pointerId,b)}},move:function(a){var b=d.get(a.pointerId);if(b){if(!b.tracking){var c=this.calcPositionDelta(b.downEvent,a),e=c.x*c.x+c.y*c.y;e>this.WIGGLE_THRESHOLD&&(b.tracking=!0,b.lastMoveEvent=b.downEvent,this.fireTrack("trackstart",a,b))}b.tracking&&(this.fireTrack("track",a,b),this.fireTrack("trackx",a,b),this.fireTrack("tracky",a,b)),b.lastMoveEvent=a}},up:function(a){var b=d.get(a.pointerId);b&&(b.tracking&&this.fireTrack("trackend",a,b),d["delete"](a.pointerId))}};b.registerGesture("track",e)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d={HOLD_DELAY:200,WIGGLE_THRESHOLD:16,events:["down","move","up"],exposes:["hold","holdpulse","release"],heldPointer:null,holdJob:null,pulse:function(){var a=Date.now()-this.heldPointer.timeStamp,b=this.held?"holdpulse":"hold";this.fireHold(b,a),this.held=!0},cancel:function(){clearInterval(this.holdJob),this.held&&this.fireHold("release"),this.held=!1,this.heldPointer=null,this.target=null,this.holdJob=null},down:function(a){a.isPrimary&&!this.heldPointer&&(this.heldPointer=a,this.target=a.target,this.holdJob=setInterval(this.pulse.bind(this),this.HOLD_DELAY))},up:function(a){this.heldPointer&&this.heldPointer.pointerId===a.pointerId&&this.cancel()},move:function(a){if(this.heldPointer&&this.heldPointer.pointerId===a.pointerId){var b=a.clientX-this.heldPointer.clientX,c=a.clientY-this.heldPointer.clientY;b*b+c*c>this.WIGGLE_THRESHOLD&&this.cancel()}},fireHold:function(a,b){var d={bubbles:!0,cancelable:!0,pointerType:this.heldPointer.pointerType,pointerId:this.heldPointer.pointerId,x:this.heldPointer.clientX,y:this.heldPointer.clientY,_source:"hold"};b&&(d.holdTime=b);var e=c.makeGestureEvent(a,d);this.target.dispatchEvent(e)}};b.registerGesture("hold",d)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","up"],exposes:["tap"],down:function(a){a.isPrimary&&!a.tapPrevented&&d.set(a.pointerId,{target:a.target,buttons:a.buttons,x:a.clientX,y:a.clientY})},shouldTap:function(a,b){var c=!0;return"mouse"===a.pointerType&&(c=1^a.buttons&&1&b.buttons),c&&!a.tapPrevented},up:function(b){var e=d.get(b.pointerId);if(e&&this.shouldTap(b,e)){var f=a.targetFinding.LCA(e.target,b.relatedTarget);if(f){var g=c.makeGestureEvent("tap",{bubbles:!0,cancelable:!0,x:b.clientX,y:b.clientY,detail:b.detail,pointerType:b.pointerType,pointerId:b.pointerId,altKey:b.altKey,ctrlKey:b.ctrlKey,metaKey:b.metaKey,shiftKey:b.shiftKey,_source:"tap"});f.dispatchEvent(g)}}d["delete"](b.pointerId)}};c.preventTap=function(a){return function(){a.tapPrevented=!0,d["delete"](a.pointerId)}},b.registerGesture("tap",e)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e=180/Math.PI,f={events:["down","up","move","cancel"],exposes:["pinchstart","pinch","pinchend","rotate"],defaultActions:{pinch:"none",rotate:"none"},reference:{},down:function(b){if(d.set(b.pointerId,b),2==d.pointers()){var c=this.calcChord(),e=this.calcAngle(c);this.reference={angle:e,diameter:c.diameter,target:a.targetFinding.LCA(c.a.target,c.b.target)},this.firePinch("pinchstart",c.diameter,c)}},up:function(a){var b=d.get(a.pointerId),c=d.pointers();if(b){if(2===c){var e=this.calcChord();this.firePinch("pinchend",e.diameter,e)}d["delete"](a.pointerId)}},move:function(a){d.has(a.pointerId)&&(d.set(a.pointerId,a),d.pointers()>1&&this.calcPinchRotate())},cancel:function(a){this.up(a)},firePinch:function(a,b,d){var e=b/this.reference.diameter,f=c.makeGestureEvent(a,{bubbles:!0,cancelable:!0,scale:e,centerX:d.center.x,centerY:d.center.y,_source:"pinch"});this.reference.target.dispatchEvent(f)},fireRotate:function(a,b){var d=Math.round((a-this.reference.angle)%360),e=c.makeGestureEvent("rotate",{bubbles:!0,cancelable:!0,angle:d,centerX:b.center.x,centerY:b.center.y,_source:"pinch"});this.reference.target.dispatchEvent(e)},calcPinchRotate:function(){var a=this.calcChord(),b=a.diameter,c=this.calcAngle(a);b!=this.reference.diameter&&this.firePinch("pinch",b,a),c!=this.reference.angle&&this.fireRotate(c,a)},calcChord:function(){var a=[];d.forEach(function(b){a.push(b)});for(var b,c,e,f=0,g={a:a[0],b:a[1]},h=0;h<a.length;h++)for(var i=a[h],j=h+1;j<a.length;j++){var k=a[j];b=Math.abs(i.clientX-k.clientX),c=Math.abs(i.clientY-k.clientY),e=b+c,e>f&&(f=e,g={a:i,b:k})}return b=Math.abs(g.a.clientX+g.b.clientX)/2,c=Math.abs(g.a.clientY+g.b.clientY)/2,g.center={x:b,y:c},g.diameter=f,g},calcAngle:function(a){var b=a.a.clientX-a.b.clientX,c=a.a.clientY-a.b.clientY;return(360+Math.atan2(c,b)*e)%360}};b.registerGesture("pinch",f)}(window.PolymerGestures);
/* svg.js 1.0.1-32-gcc9a4a3 - svg selector inventor polyfill regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient pattern doc shape symbol use rect ellipse line poly path image text textpath nested hyperlink marker sugar set data memory helpers - svgjs.com/license */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.SVG = factory();
  }
}(this, function() {

  var SVG = this.SVG = function(element) {
    if (SVG.supported) {
      element = new SVG.Doc(element)
  
      if (!SVG.parser)
        SVG.prepare(element)
  
      return element
    }
  }
  
  // Default namespaces
  SVG.ns    = 'http://www.w3.org/2000/svg'
  SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
  SVG.xlink = 'http://www.w3.org/1999/xlink'
  
  // Element id sequence
  SVG.did  = 1000
  
  // Get next named element id
  SVG.eid = function(name) {
    return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)
  }
  
  // Method for element creation
  SVG.create = function(name) {
    /* create element */
    var element = document.createElementNS(this.ns, name)
    
    /* apply unique id */
    element.setAttribute('id', this.eid(name))
    
    return element
  }
  
  // Method for extending objects
  SVG.extend = function() {
    var modules, methods, key, i
    
    /* get list of modules */
    modules = [].slice.call(arguments)
    
    /* get object with extensions */
    methods = modules.pop()
    
    for (i = modules.length - 1; i >= 0; i--)
      if (modules[i])
        for (key in methods)
          modules[i].prototype[key] = methods[key]
  
    /* make sure SVG.Set inherits any newly added methods */
    if (SVG.Set && SVG.Set.inherit)
      SVG.Set.inherit()
  }
  
  // Initialize parsing element
  SVG.prepare = function(element) {
    /* select document body and create invisible svg element */
    var body = document.getElementsByTagName('body')[0]
      , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 0)
      , path = SVG.create('path')
  
    /* insert parsers */
    draw.node.appendChild(path)
  
    /* create parser object */
    SVG.parser = {
      body: body || element.parent
    , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
    , poly: draw.polyline().node
    , path: path
    }
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false


  SVG.get = function(id) {
    var node = document.getElementById(idFromReference(id) || id)
    if (node) return node.instance
  }

  SVG.invent = function(config) {
  	/* create element initializer */
  	var initializer = typeof config.create == 'function' ?
  		config.create :
  		function() {
  			this.constructor.call(this, SVG.create(config.create))
  		}
  
  	/* inherit prototype */
  	if (config.inherit)
  		initializer.prototype = new config.inherit
  
  	/* extend with methods */
  	if (config.extend)
  		SVG.extend(initializer, config.extend)
  
  	/* attach construct method to parent */
  	if (config.construct)
  		SVG.extend(config.parent || SVG.Container, config.construct)
  
  	return initializer
  }

  if (typeof CustomEvent !== 'function') {
    // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    function CustomEvent (event, options) {
      options = options || { bubbles: false, cancelable: false, detail: undefined }
      var e = document.createEvent('CustomEvent')
      e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
      return e
    }
  
    CustomEvent.prototype = window.Event.prototype
  
    window.CustomEvent = CustomEvent
  }
  
  // requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
  (function(w) {
    var lastTime = 0
    var vendors = ['moz', 'webkit']
    
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
      w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
                                w[vendors[x] + 'CancelRequestAnimationFrame']
    }
   
    w.requestAnimationFrame = w.requestAnimationFrame || 
      function(callback) {
        var currTime = new Date().getTime()
        var timeToCall = Math.max(0, 16 - (currTime - lastTime))
        
        var id = w.setTimeout(function() {
          callback(currTime + timeToCall)
        }, timeToCall)
        
        lastTime = currTime + timeToCall
        return id
      }
   
    w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;
  
  }(window))

  SVG.regex = {
    /* parse unit value */
    unit:         /^(-?[\d\.]+)([a-z%]{0,2})$/
    
    /* parse hex value */
  , hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    
    /* parse rgb value */
  , rgb:          /rgb\((\d+),(\d+),(\d+)\)/
    
    /* parse reference id */
  , reference:    /#([a-z0-9\-_]+)/i
  
    /* test hex value */
  , isHex:        /^#[a-f0-9]{3,6}$/i
    
    /* test rgb value */
  , isRgb:        /^rgb\(/
    
    /* test css declaration */
  , isCss:        /[^:]+:[^;]+;?/
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
    /* test for numeric string */
  , isNumber:     /^-?[\d\.]+$/
  
    /* test for percent value */
  , isPercent:    /^-?[\d\.]+%$/
  
    /* test for image url */
  , isImage:      /\.(jpg|jpeg|png|gif)(\?[^=]+.*)?/i
    
    /* test for namespaced event */
  , isEvent:      /^[\w]+:[\w]+$/
  
  }

  SVG.defaults = {
    // Default matrix
    matrix:       '1 0 0 1 0 0'
    
    // Default attribute values
  , attrs: {
      /* fill and stroke */
      'fill-opacity':     1
    , 'stroke-opacity':   1
    , 'stroke-width':     0
    , 'stroke-linejoin':  'miter'
    , 'stroke-linecap':   'butt'
    , fill:               '#000000'
    , stroke:             '#000000'
    , opacity:            1
      /* position */
    , x:                  0
    , y:                  0
    , cx:                 0
    , cy:                 0
      /* size */  
    , width:              0
    , height:             0
      /* radius */  
    , r:                  0
    , rx:                 0
    , ry:                 0
      /* gradient */  
    , offset:             0
    , 'stop-opacity':     1
    , 'stop-color':       '#000000'
      /* text */
    , 'font-size':        16
    , 'font-family':      'Helvetica, Arial, sans-serif'
    , 'text-anchor':      'start'
    }
    
    // Default transformation values
  , trans: function() {
      return {
        /* translate */
        x:        0
      , y:        0
        /* scale */
      , scaleX:   1
      , scaleY:   1
        /* rotate */
      , rotation: 0
        /* skew */
      , skewX:    0
      , skewY:    0
        /* matrix */
      , matrix:   this.matrix
      , a:        1
      , b:        0
      , c:        0
      , d:        1
      , e:        0
      , f:        0
      }
    }
    
  }

  SVG.Color = function(color) {
    var match
    
    /* initialize defaults */
    this.r = 0
    this.g = 0
    this.b = 0
    
    /* parse color */
    if (typeof color === 'string') {
      if (SVG.regex.isRgb.test(color)) {
        /* get rgb values */
        match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
        
        /* parse numeric values */
        this.r = parseInt(match[1])
        this.g = parseInt(match[2])
        this.b = parseInt(match[3])
        
      } else if (SVG.regex.isHex.test(color)) {
        /* get hex values */
        match = SVG.regex.hex.exec(fullHex(color))
  
        /* parse numeric values */
        this.r = parseInt(match[1], 16)
        this.g = parseInt(match[2], 16)
        this.b = parseInt(match[3], 16)
  
      }
      
    } else if (typeof color === 'object') {
      this.r = color.r
      this.g = color.g
      this.b = color.b
      
    }
      
  }
  
  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function() {
      return this.toHex()
    }
    // Build hex value
  , toHex: function() {
      return '#'
        + compToHex(this.r)
        + compToHex(this.g)
        + compToHex(this.b)
    }
    // Build rgb value
  , toRgb: function() {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'
    }
    // Calculate true brightness
  , brightness: function() {
      return (this.r / 255 * 0.30)
           + (this.g / 255 * 0.59)
           + (this.b / 255 * 0.11)
    }
    // Make color morphable
  , morph: function(color) {
      this.destination = new SVG.Color(color)
  
      return this
    }
    // Get morphed color at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* normalise pos */
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
      /* generate morphed color */
      return new SVG.Color({
        r: ~~(this.r + (this.destination.r - this.r) * pos)
      , g: ~~(this.g + (this.destination.g - this.g) * pos)
      , b: ~~(this.b + (this.destination.b - this.b) * pos)
      })
    }
    
  })
  
  // Testers
  
  // Test if given value is a color string
  SVG.Color.test = function(color) {
    color += ''
    return SVG.regex.isHex.test(color)
        || SVG.regex.isRgb.test(color)
  }
  
  // Test if given value is a rgb object
  SVG.Color.isRgb = function(color) {
    return color && typeof color.r == 'number'
                 && typeof color.g == 'number'
                 && typeof color.b == 'number'
  }
  
  // Test if given value is a color
  SVG.Color.isColor = function(color) {
    return SVG.Color.isRgb(color) || SVG.Color.test(color)
  }

  SVG.Array = function(array, fallback) {
    array = (array || []).valueOf()
  
    /* if array is empty and fallback is provided, use fallback */
    if (array.length == 0 && fallback)
      array = fallback.valueOf()
  
    /* parse array */
    this.value = this.parse(array)
  }
  
  SVG.extend(SVG.Array, {
    // Make array morphable
    morph: function(array) {
      this.destination = this.parse(array)
  
      /* normalize length of arrays */
      if (this.value.length != this.destination.length) {
        var lastValue       = this.value[this.value.length - 1]
          , lastDestination = this.destination[this.destination.length - 1]
  
        while(this.value.length > this.destination.length)
          this.destination.push(lastDestination)
        while(this.value.length < this.destination.length)
          this.value.push(lastValue)
      }
  
      return this
    }
    // Clean up any duplicate points
  , settle: function() {
      /* find all unique values */
      for (var i = 0, il = this.value.length, seen = []; i < il; i++)
        if (seen.indexOf(this.value[i]) == -1)
          seen.push(this.value[i])
  
      /* set new value */
      return this.value = seen
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed array */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)
  
      return new SVG.Array(array)
    }
    // Convert array to string
  , toString: function() {
      return this.value.join(' ')
    }
    // Real value
  , valueOf: function() {
      return this.value
    }
    // Parse whitespace separated string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      return this.split(array)
    }
    // Strip unnecessary whitespace
  , split: function(string) {
      return string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g,'').split(' ') 
    }
    // Reverse array
  , reverse: function() {
      this.value.reverse()
  
      return this
    }
  
  })
  


  SVG.PointArray = function() {
    this.constructor.apply(this, arguments)
  }
  
  // Inherit from SVG.Array
  SVG.PointArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PointArray, {
    // Convert array to string
    toString: function() {
      /* convert to a poly point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i].join(','))
  
      return array.join(' ')
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push([
          this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
        , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
        ])
  
      return new SVG.PointArray(array)
    }
    // Parse point string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      /* split points */
      array = this.split(array)
  
      /* parse points */
      for (var i = 0, il = array.length, p, points = []; i < il; i++) {
        p = array[i].split(',')
        points.push([parseFloat(p[0]), parseFloat(p[1])])
      }
  
      return points
    }
    // Move point string
  , move: function(x, y) {
      var box = this.bbox()
  
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      /* move every point */
      if (!isNaN(x) && !isNaN(y))
        for (var i = this.value.length - 1; i >= 0; i--)
          this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]
  
      return this
    }
    // Resize poly string
  , size: function(width, height) {
      var i, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
      }
  
      return this
    }
    // Get bounding box of points
  , bbox: function() {
      SVG.parser.poly.setAttribute('points', this.toString())
  
      return SVG.parser.poly.getBBox()
    }
  
  })

  SVG.PathArray = function(array, fallback) {
    this.constructor.call(this, array, fallback)
  }
  
  // Inherit from SVG.Array
  SVG.PathArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PathArray, {
    // Convert array to string
    toString: function() {
      return arrayToString(this.value)
    }
    // Move path string
  , move: function(x, y) {
  		/* get bounding box of current situation */
  		var box = this.bbox()
  		
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      if (!isNaN(x) && !isNaN(y)) {
        /* move every point */
        for (var l, i = this.value.length - 1; i >= 0; i--) {
          l = this.value[i][0]
  
          if (l == 'M' || l == 'L' || l == 'T')  {
            this.value[i][1] += x
            this.value[i][2] += y
  
          } else if (l == 'H')  {
            this.value[i][1] += x
  
          } else if (l == 'V')  {
            this.value[i][1] += y
  
          } else if (l == 'C' || l == 'S' || l == 'Q')  {
            this.value[i][1] += x
            this.value[i][2] += y
            this.value[i][3] += x
            this.value[i][4] += y
  
            if (l == 'C')  {
              this.value[i][5] += x
              this.value[i][6] += y
            }
  
          } else if (l == 'A')  {
            this.value[i][6] += x
            this.value[i][7] += y
          }
  
        }
      }
  
      return this
    }
    // Resize path string
  , size: function(width, height) {
  		/* get bounding box of current situation */
  		var i, l, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]
  
        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
  
        } else if (l == 'H')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
  
        } else if (l == 'V')  {
          this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
  
        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
          this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
          this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y
  
          if (l == 'C')  {
            this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
            this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
          }
  
        } else if (l == 'A')  {
          /* resize radii */
          this.value[i][1] = (this.value[i][1] * width)  / box.width
          this.value[i][2] = (this.value[i][2] * height) / box.height
  
          /* move position values */
          this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
          this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
        }
  
      }
  
      return this
    }
    // Absolutize and parse path to array
  , parse: function(array) {
      /* if it's already is a patharray, no need to parse it */
      if (array instanceof SVG.PathArray) return array.valueOf()
  
      /* prepare for parsing */
      var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
        , x = 0
        , y = 0
      
      /* populate working path */
      SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
      
      /* get segments */
      segs = SVG.parser.path.pathSegList
  
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
  
        /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
        if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
          if ('x' in seg) x = seg.x
          if ('y' in seg) y = seg.y
  
        } else {
          if ('x1' in seg) x1 = x + seg.x1
          if ('x2' in seg) x2 = x + seg.x2
          if ('y1' in seg) y1 = y + seg.y1
          if ('y2' in seg) y2 = y + seg.y2
          if ('x'  in seg) x += seg.x
          if ('y'  in seg) y += seg.y
  
          if (s == 'm')
            segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
          else if (s == 'l')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
          else if (s == 'h')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
          else if (s == 'v')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
          else if (s == 'c')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
          else if (s == 's')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
          else if (s == 'q')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
          else if (s == 't')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
          else if (s == 'a')
            segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
          else if (s == 'z' || s == 'Z') {
            x = x0
            y = y0
          }
        }
  
        /* record the start of a subpath */
        if (s == 'M' || s == 'm') {
          x0 = x
          y0 = y
        }
      }
  
      /* build internal representation */
      array = []
      segs  = SVG.parser.path.pathSegList
      
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
        x = [s]
  
        if (s == 'M' || s == 'L' || s == 'T')
          x.push(seg.x, seg.y)
        else if (s == 'H')
          x.push(seg.x)
        else if (s == 'V')
          x.push(seg.y)
        else if (s == 'C')
          x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'S')
          x.push(seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'Q')
          x.push(seg.x1, seg.y1, seg.x, seg.y)
        else if (s == 'A')
          x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag|0, seg.sweepFlag|0, seg.x, seg.y)
  
        /* store segment */
        array.push(x)
      }
      
      return array
    }
    // Get bounding box of path
  , bbox: function() {
      SVG.parser.path.setAttribute('d', this.toString())
  
      return SVG.parser.path.getBBox()
    }
  
  })

  SVG.Number = function(value) {
  
    /* initialize defaults */
    this.value = 0
    this.unit = ''
  
    /* parse value */
    if (typeof value === 'number') {
      /* ensure a valid numeric value */
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value
  
    } else if (typeof value === 'string') {
      var match = value.match(SVG.regex.unit)
  
      if (match) {
        /* make value numeric */
        this.value = parseFloat(match[1])
      
        /* normalize percent value */
        if (match[2] == '%')
          this.value /= 100
        else if (match[2] == 's')
          this.value *= 1000
      
        /* store unit */
        this.unit = match[2]
      }
  
    } else {
      if (value instanceof SVG.Number) {
        this.value = value.value
        this.unit  = value.unit
      }
    }
  
  }
  
  SVG.extend(SVG.Number, {
    // Stringalize
    toString: function() {
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      this.value = this + new SVG.Number(number)
  
      return this
    }
    // Subtract number
  , minus: function(number) {
      return this.plus(-new SVG.Number(number))
    }
    // Multiply number
  , times: function(number) {
      this.value = this * new SVG.Number(number)
  
      return this
    }
    // Divide number
  , divide: function(number) {
      this.value = this / new SVG.Number(number)
  
      return this
    }
    // Convert to different unit
  , to: function(unit) {
      if (typeof unit === 'string')
        this.unit = unit
  
      return this
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)
  
      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate new morphed number */
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }
  
  })

  SVG.ViewBox = function(element) {
    var x, y, width, height
      , wm   = 1 /* width multiplier */
      , hm   = 1 /* height multiplier */
      , box  = element.bbox()
      , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
      , we   = element
      , he   = element
  
    /* get dimensions of current node */
    width  = new SVG.Number(element.width())
    height = new SVG.Number(element.height())
  
    /* find nearest non-percentual dimensions */
    while (width.unit == '%') {
      wm *= width.value
      width = new SVG.Number(we instanceof SVG.Doc ? we.parent.offsetWidth : we.parent.width())
      we = we.parent
    }
    while (height.unit == '%') {
      hm *= height.value
      height = new SVG.Number(he instanceof SVG.Doc ? he.parent.offsetHeight : he.parent.height())
      he = he.parent
    }
    
    /* ensure defaults */
    this.x      = box.x
    this.y      = box.y
    this.width  = width  * wm
    this.height = height * hm
    this.zoom   = 1
    
    if (view) {
      /* get width and height from viewbox */
      x      = parseFloat(view[0])
      y      = parseFloat(view[1])
      width  = parseFloat(view[2])
      height = parseFloat(view[3])
      
      /* calculate zoom accoring to viewbox */
      this.zoom = ((this.width / this.height) > (width / height)) ?
        this.height / height :
        this.width  / width
  
      /* calculate real pixel dimensions on parent SVG.Doc element */
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
      
    }
    
  }
  
  //
  SVG.extend(SVG.ViewBox, {
    // Parse viewbox to string
    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
    
  })

  SVG.BBox = function(element) {
    var box
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    /* get values if element is given */
    if (element) {
      try {
        /* actual, native bounding box */
        box = element.node.getBBox()
      } catch(e) {
        /* fallback for some browsers */
        box = {
          x:      element.node.clientLeft
        , y:      element.node.clientTop
        , width:  element.node.clientWidth
        , height: element.node.clientHeight
        }
      }
      
      /* include translations on x an y */
      this.x = box.x + element.trans.x
      this.y = box.y + element.trans.y
      
      /* plain width and height */
      this.width  = box.width  * element.trans.scaleX
      this.height = box.height * element.trans.scaleY
    }
  
    /* add center, right and bottom */
    boxProperties(this)
    
  }
  
  //
  SVG.extend(SVG.BBox, {
    // merge bounding box with another, return a new instance
    merge: function(box) {
      var b = new SVG.BBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add center, right and bottom */
      boxProperties(b)
  
      return b
    }
  
  })

  SVG.RBox = function(element) {
    var e, zoom
      , box = {}
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    if (element) {
      e = element.doc().parent
      zoom = element.doc().viewbox().zoom
      
      /* actual, native bounding box */
      box = element.node.getBoundingClientRect()
      
      /* get screen offset */
      this.x = box.left
      this.y = box.top
      
      /* subtract parent offset */
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
      
      while (e = e.offsetParent) {
        this.x -= e.offsetLeft
        this.y -= e.offsetTop
      }
      
      /* calculate cumulative zoom from svg documents */
      e = element
      while (e = e.parent) {
        if (e.type == 'svg' && e.viewbox) {
          zoom *= e.viewbox().zoom
          this.x -= e.x() || 0
          this.y -= e.y() || 0
        }
      }
    }
    
    /* recalculate viewbox distortion */
    this.x /= zoom
    this.y /= zoom
    this.width  = box.width  /= zoom
    this.height = box.height /= zoom
    
    /* offset by window scroll position, because getBoundingClientRect changes when window is scrolled */
    this.x += typeof window.scrollX === 'number' ? window.scrollX : window.pageXOffset
    this.y += typeof window.scrollY === 'number' ? window.scrollY : window.pageYOffset
  
    /* add center, right and bottom */
    boxProperties(this)
    
  }
  
  //
  SVG.extend(SVG.RBox, {
    // merge rect box with another, return a new instance
    merge: function(box) {
      var b = new SVG.RBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add center, right and bottom */
      boxProperties(b)
  
      return b
    }
  
  })


  SVG.Element = SVG.invent({
    // Initialize node
    create: function(node) {
      /* make stroke value accessible dynamically */
      this._stroke = SVG.defaults.attrs.stroke
  
      /* initialize transformation store with defaults */
      this.trans = SVG.defaults.trans()
      
      /* create circular reference */
      if (this.node = node) {
        this.type = node.nodeName
        this.node.instance = this
      }
    }
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        if (x != null) {
          x = new SVG.Number(x)
          x.value /= this.trans.scaleX
        }
        return this.attr('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        if (y != null) {
          y = new SVG.Number(y)
          y.value /= this.trans.scaleY
        }
        return this.attr('y', y)
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
      }
      // Move element to given x and y values
    , move: function(x, y) {
        return this.x(x).y(y)
      }
      // Move element by its center
    , center: function(x, y) {
        return this.cx(x).cy(y)
      }
      // Set width of element
    , width: function(width) {
        return this.attr('width', width)
      }
      // Set height of element
    , height: function(height) {
        return this.attr('height', height)
      }
      // Set element size to given width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this
          .width(new SVG.Number(p.width))
          .height(new SVG.Number(p.height))
      }
      // Clone element
    , clone: function() {
        var clone , attr
          , type = this.type
        
        /* invoke shape method with shape-specific arguments */
        clone = type == 'rect' || type == 'ellipse' ?
          this.parent[type](0,0) :
        type == 'line' ?
          this.parent[type](0,0,0,0) :
        type == 'image' ?
          this.parent[type](this.src) :
        type == 'text' ?
          this.parent[type](this.content) :
        type == 'path' ?
          this.parent[type](this.attr('d')) :
        type == 'polyline' || type == 'polygon' ?
          this.parent[type](this.attr('points')) :
        type == 'g' ?
          this.parent.group() :
          this.parent[type]()
        
        /* apply attributes attributes */
        attr = this.attr()
        delete attr.id
        clone.attr(attr)
        
        /* copy transformations */
        clone.trans = this.trans
        
        /* apply attributes and translations */
        return clone.transform({})
      }
      // Remove element
    , remove: function() {
        if (this.parent)
          this.parent.removeElement(this)
        
        return this
      }
      // Replace element
    , replace: function(element) {
        this.after(element).remove()
  
        return element
      }
      // Add element to given container and return self
    , addTo: function(parent) {
        return parent.put(this)
      }
      // Add element to given container and return container
    , putIn: function(parent) {
        return parent.add(this)
      }
      // Get parent document
    , doc: function(type) {
        return this._parent(type || SVG.Doc)
      }
      // Set svg element attribute
    , attr: function(a, v, n) {
        if (a == null) {
          /* get an object of attributes */
          a = {}
          v = this.node.attributes
          for (n = v.length - 1; n >= 0; n--)
            a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
          
          return a
          
        } else if (typeof a == 'object') {
          /* apply every attribute individually if an object is passed */
          for (v in a) this.attr(v, a[v])
          
        } else if (v === null) {
            /* remove value */
            this.node.removeAttribute(a)
          
        } else if (v == null) {
          /* act as a getter if the first and only argument is not an object */
          v = this.node.attributes[a]
          return v == null ? 
            SVG.defaults.attrs[a] :
          SVG.regex.isNumber.test(v.nodeValue) ?
            parseFloat(v.nodeValue) : v.nodeValue
        
        } else if (a == 'style') {
          /* redirect to the style method */
          return this.style(v)
        
        } else {
          /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
          if (a == 'stroke-width')
            this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
          else if (a == 'stroke')
            this._stroke = v
  
          /* convert image fill and stroke to patterns */
          if (a == 'fill' || a == 'stroke') {
            if (SVG.regex.isImage.test(v))
              v = this.doc().defs().image(v, 0, 0)
  
            if (v instanceof SVG.Image)
              v = this.doc().defs().pattern(0, 0, function() {
                this.add(v)
              })
          }
          
          /* ensure correct numeric values (also accepts NaN and Infinity) */
          if (typeof v === 'number')
            v = new SVG.Number(v)
  
          /* ensure full hex color */
          else if (SVG.Color.isColor(v))
            v = new SVG.Color(v)
          
          /* parse array values */
          else if (Array.isArray(v))
            v = new SVG.Array(v)
  
          /* if the passed attribute is leading... */
          if (a == 'leading') {
            /* ... call the leading method instead */
            if (this.leading)
              this.leading(v)
          } else {
            /* set given attribute on node */
            typeof n === 'string' ?
              this.node.setAttributeNS(n, a, v.toString()) :
              this.node.setAttribute(a, v.toString())
          }
          
          /* rebuild if required */
          if (this.rebuild && (a == 'font-size' || a == 'x'))
            this.rebuild(a, v)
        }
        
        return this
      }
      // Manage transformations
    , transform: function(o, v) {
        
        if (arguments.length == 0) {
          /* act as a getter if no argument is given */
          return this.trans
          
        } else if (typeof o === 'string') {
          /* act as a getter if only one string argument is given */
          if (arguments.length < 2)
            return this.trans[o]
          
          /* apply transformations as object if key value arguments are given*/
          var transform = {}
          transform[o] = v
          
          return this.transform(transform)
        }
        
        /* ... otherwise continue as a setter */
        var transform = []
        
        /* parse matrix */
        o = parseMatrix(o)
        
        /* merge values */
        for (v in o)
          if (o[v] != null)
            this.trans[v] = o[v]
        
        /* compile matrix */
        this.trans.matrix = this.trans.a
                    + ' ' + this.trans.b
                    + ' ' + this.trans.c
                    + ' ' + this.trans.d
                    + ' ' + this.trans.e
                    + ' ' + this.trans.f
        
        /* alias current transformations */
        o = this.trans
        
        /* add matrix */
        if (o.matrix != SVG.defaults.matrix)
          transform.push('matrix(' + o.matrix + ')')
        
        /* add rotation */
        if (o.rotation != 0)
          transform.push('rotate(' + o.rotation + ' ' + (o.cx == null ? this.bbox().cx : o.cx) + ' ' + (o.cy == null ? this.bbox().cy : o.cy) + ')')
        
        /* add scale */
        if (o.scaleX != 1 || o.scaleY != 1)
          transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')')
        
        /* add skew on x axis */
        if (o.skewX != 0)
          transform.push('skewX(' + o.skewX + ')')
        
        /* add skew on y axis */
        if (o.skewY != 0)
          transform.push('skewY(' + o.skewY + ')')
        
        /* add translation */
        if (o.x != 0 || o.y != 0)
          transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')')
        
        /* update transformations, even if there are none */
        if (transform.length == 0)
          this.node.removeAttribute('transform')
        else
          this.node.setAttribute('transform', transform.join(' '))
        
        return this
      }
      // Dynamic style generator
    , style: function(s, v) {
        if (arguments.length == 0) {
          /* get full style */
          return this.node.style.cssText || ''
        
        } else if (arguments.length < 2) {
          /* apply every style individually if an object is passed */
          if (typeof s == 'object') {
            for (v in s) this.style(v, s[v])
          
          } else if (SVG.regex.isCss.test(s)) {
            /* parse css string */
            s = s.split(';')
  
            /* apply every definition individually */
            for (var i = 0; i < s.length; i++) {
              v = s[i].split(':')
              this.style(v[0].replace(/\s+/g, ''), v[1])
            }
          } else {
            /* act as a getter if the first and only argument is not an object */
            return this.node.style[camelCase(s)]
          }
        
        } else {
          this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
        }
        
        return this
      }
      // Get / set id
    , id: function(id) {
        return this.attr('id', id)
      }
      // Get bounding box
    , bbox: function() {
        return new SVG.BBox(this)
      }
      // Get rect box
    , rbox: function() {
        return new SVG.RBox(this)
      }
      // Checks whether the given point inside the bounding box of the element
    , inside: function(x, y) {
        var box = this.bbox()
        
        return x > box.x
            && y > box.y
            && x < box.x + box.width
            && y < box.y + box.height
      }
      // Show element
    , show: function() {
        return this.style('display', '')
      }
      // Hide element
    , hide: function() {
        return this.style('display', 'none')
      }
      // Is element visible?
    , visible: function() {
        return this.style('display') != 'none'
      }
      // Return id on string conversion
    , toString: function() {
        return this.attr('id')
      }
      // Return array of classes on the node
    , classes: function() {
        var classAttr = this.node.getAttribute('class')
        if (classAttr === null) {
          return []
        } else {
          return classAttr.trim().split(/\s+/)
        }
      }
      // Return true if class exists on the node, false otherwise
    , hasClass: function(className) {
        return this.classes().indexOf(className) != -1
      }
      // Add class to the node
    , addClass: function(className) {
        var classArray
        if (!(this.hasClass(className))) {
          classArray = this.classes()
          classArray.push(className)
          this.node.setAttribute('class', classArray.join(' '))
        }
        return this
      }
      // Remove class from the node
    , removeClass: function(className) {
        var classArray
        if (this.hasClass(className)) {
          classArray = this.classes().filter(function(c) {
            return c != className
          })
          this.node.setAttribute('class', classArray.join(' '))
        }
        return this
      }
      // Toggle the presence of a class on the node
    , toggleClass: function(className) {
        if (this.hasClass(className)) {
          this.removeClass(className)
        } else {
          this.addClass(className)
        }
        return this
      }
      // Get referenced element form attribute value
    , reference: function(attr) {
        return SVG.get(this.attr()[attr])
      }
      // Private: find svg parent by instance
    , _parent: function(parent) {
        var element = this
        
        while (element != null && !(element instanceof parent))
          element = element.parent
  
        return element
      }
    }
  })


  SVG.Parent = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
      // Returns all child elements
      children: function() {
        return this._children || (this._children = [])
      }
      // Add given element at a position
    , add: function(element, i) {
        if (!this.has(element)) {
          /* define insertion index if none given */
          i = i == null ? this.children().length : i
          
          /* remove references from previous parent */
          if (element.parent)
            element.parent.children().splice(element.parent.index(element), 1)
          
          /* add element references */
          this.children().splice(i, 0, element)
          this.node.insertBefore(element.node, this.node.childNodes[i] || null)
          element.parent = this
        }
  
        /* reposition defs */
        if (this._defs) {
          this.node.removeChild(this._defs.node)
          this.node.appendChild(this._defs.node)
        }
        
        return this
      }
      // Basically does the same as `add()` but returns the added element instead
    , put: function(element, i) {
        this.add(element, i)
        return element
      }
      // Checks if the given element is a child
    , has: function(element) {
        return this.index(element) >= 0
      }
      // Gets index of given element
    , index: function(element) {
        return this.children().indexOf(element)
      }
      // Get a element at the given index
    , get: function(i) {
        return this.children()[i]
      }
      // Get first child, skipping the defs node
    , first: function() {
        return this.children()[0]
      }
      // Get the last child
    , last: function() {
        return this.children()[this.children().length - 1]
      }
      // Iterates over all children and invokes a given block
    , each: function(block, deep) {
        var i, il
          , children = this.children()
        
        for (i = 0, il = children.length; i < il; i++) {
          if (children[i] instanceof SVG.Element)
            block.apply(children[i], [i, children])
  
          if (deep && (children[i] instanceof SVG.Container))
            children[i].each(block, deep)
        }
      
        return this
      }
      // Remove a child element at a position
    , removeElement: function(element) {
        this.children().splice(this.index(element), 1)
        this.node.removeChild(element.node)
        element.parent = null
        
        return this
      }
      // Remove all elements in this container
    , clear: function() {
        /* remove children */
        for (var i = this.children().length - 1; i >= 0; i--)
          this.removeElement(this.children()[i])
  
        /* remove defs node */
        if (this._defs)
          this._defs.clear()
  
        return this
      }
     , // Get defs
      defs: function() {
        return this.doc().defs()
      }
    }
    
  })


  SVG.Container = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Parent
  
    // Add class methods
  , extend: {
      // Get the viewBox and calculate the zoom value
      viewbox: function(v) {
        if (arguments.length == 0)
          /* act as a getter if there are no arguments */
          return new SVG.ViewBox(this)
        
        /* otherwise act as a setter */
        v = arguments.length == 1 ?
          [v.x, v.y, v.width, v.height] :
          [].slice.call(arguments)
        
        return this.attr('viewBox', v)
      }
    }
    
  })

  SVG.FX = SVG.invent({
    // Initialize FX object
    create: function(element) {
      /* store target element */
      this.target = element
    }
  
    // Add class methods
  , extend: {
      // Add animation parameters and start animation
      animate: function(d, ease, delay) {
        var akeys, tkeys, skeys, key
          , element = this.target
          , fx = this
        
        /* dissect object if one is passed */
        if (typeof d == 'object') {
          delay = d.delay
          ease = d.ease
          d = d.duration
        }
  
        /* ensure default duration and easing */
        d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
        ease = ease || '<>'
  
        /* process values */
        fx.to = function(pos) {
          var i
  
          /* normalise pos */
          pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
          /* collect attribute keys */
          if (akeys == null) {
            akeys = []
            for (key in fx.attrs)
              akeys.push(key)
  
            /* make sure morphable elements are scaled, translated and morphed all together */
            if (element.morphArray && (fx._plot || akeys.indexOf('points') > -1)) {
              /* get destination */
              var box
                , p = new element.morphArray(fx._plot || fx.attrs.points || element.array)
  
              /* add size */
              if (fx._size) p.size(fx._size.width.to, fx._size.height.to)
  
              /* add movement */
              box = p.bbox()
              if (fx._x) p.move(fx._x.to, box.y)
              else if (fx._cx) p.move(fx._cx.to - box.width / 2, box.y)
  
              box = p.bbox()
              if (fx._y) p.move(box.x, fx._y.to)
              else if (fx._cy) p.move(box.x, fx._cy.to - box.height / 2)
  
              /* delete element oriented changes */
              delete fx._x
              delete fx._y
              delete fx._cx
              delete fx._cy
              delete fx._size
  
              fx._plot = element.array.morph(p)
            }
          }
  
          /* collect transformation keys */
          if (tkeys == null) {
            tkeys = []
            for (key in fx.trans)
              tkeys.push(key)
          }
  
          /* collect style keys */
          if (skeys == null) {
            skeys = []
            for (key in fx.styles)
              skeys.push(key)
          }
  
          /* apply easing */
          pos = ease == '<>' ?
            (-Math.cos(pos * Math.PI) / 2) + 0.5 :
          ease == '>' ?
            Math.sin(pos * Math.PI / 2) :
          ease == '<' ?
            -Math.cos(pos * Math.PI / 2) + 1 :
          ease == '-' ?
            pos :
          typeof ease == 'function' ?
            ease(pos) :
            pos
          
          /* run plot function */
          if (fx._plot) {
            element.plot(fx._plot.at(pos))
  
          } else {
            /* run all x-position properties */
            if (fx._x)
              element.x(fx._x.at(pos))
            else if (fx._cx)
              element.cx(fx._cx.at(pos))
  
            /* run all y-position properties */
            if (fx._y)
              element.y(fx._y.at(pos))
            else if (fx._cy)
              element.cy(fx._cy.at(pos))
  
            /* run all size properties */
            if (fx._size)
              element.size(fx._size.width.at(pos), fx._size.height.at(pos))
          }
  
          /* run all viewbox properties */
          if (fx._viewbox)
            element.viewbox(
              fx._viewbox.x.at(pos)
            , fx._viewbox.y.at(pos)
            , fx._viewbox.width.at(pos)
            , fx._viewbox.height.at(pos)
            )
  
          /* run leading property */
          if (fx._leading)
            element.leading(fx._leading.at(pos))
  
          /* animate attributes */
          for (i = akeys.length - 1; i >= 0; i--)
            element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))
  
          /* animate transformations */
          for (i = tkeys.length - 1; i >= 0; i--)
            element.transform(tkeys[i], at(fx.trans[tkeys[i]], pos))
  
          /* animate styles */
          for (i = skeys.length - 1; i >= 0; i--)
            element.style(skeys[i], at(fx.styles[skeys[i]], pos))
  
          /* callback for each keyframe */
          if (fx._during)
            fx._during.call(element, pos, function(from, to) {
              return at({ from: from, to: to }, pos)
            })
        }
        
        if (typeof d === 'number') {
          /* delay animation */
          this.timeout = setTimeout(function() {
            var start = new Date().getTime()
  
            /* initialize situation object */
            fx.situation = {
              interval: 1000 / 60
            , start:    start
            , play:     true
            , finish:   start + d
            , duration: d
            }
  
            /* render function */
            fx.render = function() {
              
              if (fx.situation.play === true) {
                // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
                var time = new Date().getTime()
                  , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d
                
                /* process values */
                fx.to(pos)
                
                /* finish off animation */
                if (time > fx.situation.finish) {
                  if (fx._plot)
                    element.plot(new SVG.PointArray(fx._plot.destination).settle())
  
                  if (fx._loop === true || (typeof fx._loop == 'number' && fx._loop > 1)) {
                    if (typeof fx._loop == 'number')
                      --fx._loop
                    fx.animate(d, ease, delay)
                  } else {
                    fx._after ? fx._after.apply(element, [fx]) : fx.stop()
                  }
  
                } else {
                  fx.animationFrame = requestAnimationFrame(fx.render)
                }
              } else {
                fx.animationFrame = requestAnimationFrame(fx.render)
              }
              
            }
  
            /* start animation */
            fx.render()
            
          }, new SVG.Number(delay).valueOf())
        }
        
        return this
      }
      // Get bounding box of target element
    , bbox: function() {
        return this.target.bbox()
      }
      // Add animatable attributes
    , attr: function(a, v) {
        if (typeof a == 'object') {
          for (var key in a)
            this.attr(key, a[key])
        
        } else {
          var from = this.target.attr(a)
  
          this.attrs[a] = SVG.Color.isColor(from) ?
            new SVG.Color(from).morph(v) :
          SVG.regex.unit.test(from) ?
            new SVG.Number(from).morph(v) :
            { from: from, to: v }
        }
        
        return this
      }
      // Add animatable transformations
    , transform: function(o, v) {
        if (arguments.length == 1) {
          /* parse matrix string */
          o = parseMatrix(o)
          
          /* dlete matrixstring from object */
          delete o.matrix
          
          /* add rotation-center to transformations */
          this.target.trans.cx = o.cx || null
          this.target.trans.cy = o.cy || null
          
          delete o.cx
          delete o.cy
          
          /* store matrix values */
          for (v in o)
            this.trans[v] = { from: this.target.trans[v], to: o[v] }
          
        } else {
          /* apply transformations as object if key value arguments are given*/
          var transform = {}
          transform[o] = v
          
          this.transform(transform)
        }
        
        return this
      }
      // Add animatable styles
    , style: function(s, v) {
        if (typeof s == 'object')
          for (var key in s)
            this.style(key, s[key])
        
        else
          this.styles[s] = { from: this.target.style(s), to: v }
        
        return this
      }
      // Animatable x-axis
    , x: function(x) {
        this._x = new SVG.Number(this.target.x()).morph(x)
        
        return this
      }
      // Animatable y-axis
    , y: function(y) {
        this._y = new SVG.Number(this.target.y()).morph(y)
        
        return this
      }
      // Animatable center x-axis
    , cx: function(x) {
        this._cx = new SVG.Number(this.target.cx()).morph(x)
        
        return this
      }
      // Animatable center y-axis
    , cy: function(y) {
        this._cy = new SVG.Number(this.target.cy()).morph(y)
        
        return this
      }
      // Add animatable move
    , move: function(x, y) {
        return this.x(x).y(y)
      }
      // Add animatable center
    , center: function(x, y) {
        return this.cx(x).cy(y)
      }
      // Add animatable size
    , size: function(width, height) {
        if (this.target instanceof SVG.Text) {
          /* animate font size for Text elements */
          this.attr('font-size', width)
          
        } else {
          /* animate bbox based size for all other elements */
          var box = this.target.bbox()
  
          this._size = {
            width:  new SVG.Number(box.width).morph(width)
          , height: new SVG.Number(box.height).morph(height)
          }
        }
        
        return this
      }
      // Add animatable plot
    , plot: function(p) {
        this._plot = p
  
        return this
      }
      // Add leading method
    , leading: function(value) {
        if (this.target._leading)
          this._leading = new SVG.Number(this.target._leading).morph(value)
  
        return this
      }
      // Add animatable viewbox
    , viewbox: function(x, y, width, height) {
        if (this.target instanceof SVG.Container) {
          var box = this.target.viewbox()
          
          this._viewbox = {
            x:      new SVG.Number(box.x).morph(x)
          , y:      new SVG.Number(box.y).morph(y)
          , width:  new SVG.Number(box.width).morph(width)
          , height: new SVG.Number(box.height).morph(height)
          }
        }
        
        return this
      }
      // Add animateable gradient update
    , update: function(o) {
        if (this.target instanceof SVG.Stop) {
          if (o.opacity != null) this.attr('stop-opacity', o.opacity)
          if (o.color   != null) this.attr('stop-color', o.color)
          if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
        }
  
        return this
      }
      // Add callback for each keyframe
    , during: function(during) {
        this._during = during
        
        return this
      }
      // Callback after animation
    , after: function(after) {
        this._after = after
        
        return this
      }
      // Make loopable
    , loop: function(times) {
        this._loop = times || true
  
        return this
      }
      // Stop running animation
    , stop: function(fulfill) {
        /* fulfill animation */
        if (fulfill === true) {
  
          this.animate(0)
  
          if (this._after)
            this._after.apply(this.target, [this])
  
        } else {
          /* stop current animation */
          clearTimeout(this.timeout)
          cancelAnimationFrame(this.animationFrame);
  
          /* reset storage for properties that need animation */
          this.attrs     = {}
          this.trans     = {}
          this.styles    = {}
          this.situation = {}
  
          /* delete destinations */
          delete this._x
          delete this._y
          delete this._cx
          delete this._cy
          delete this._size
          delete this._plot
          delete this._loop
          delete this._after
          delete this._during
          delete this._leading
          delete this._viewbox
        }
        
        return this
      }
      // Pause running animation
    , pause: function() {
        if (this.situation.play === true) {
          this.situation.play  = false
          this.situation.pause = new Date().getTime()
        }
  
        return this
      }
      // Play running animation
    , play: function() {
        if (this.situation.play === false) {
          var pause = new Date().getTime() - this.situation.pause
          
          this.situation.finish += pause
          this.situation.start  += pause
          this.situation.play    = true
        }
  
        return this
      }
      
    }
  
    // Define parent class
  , parent: SVG.Element
  
    // Add method to parent elements
  , construct: {
      // Get fx module or create a new one, then animate with given duration and ease
      animate: function(d, ease, delay) {
        return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
      }
      // Stop current animation; this is an alias to the fx instance
    , stop: function(fulfill) {
        if (this.fx)
          this.fx.stop(fulfill)
        
        return this
      }
      // Pause current animation
    , pause: function() {
        if (this.fx)
          this.fx.pause()
  
        return this
      }
      // Play paused current animation
    , play: function() {
        if (this.fx)
          this.fx.play()
  
        return this
      }
      
    }
  })


  SVG.extend(SVG.Element, SVG.FX, {
    // Relative move over x axis
    dx: function(x) {
      return this.x((this.target || this).x() + x)
    }
    // Relative move over y axis
  , dy: function(y) {
      return this.y((this.target || this).y() + y)
    }
    // Relative move over x and y axes
  , dmove: function(x, y) {
      return this.dx(x).dy(y)
    }
  
  })

  ;[  'click'
    , 'dblclick'
    , 'mousedown'
    , 'mouseup'
    , 'mouseover'
    , 'mouseout'
    , 'mousemove'
    // , 'mouseenter' -> not supported by IE
    // , 'mouseleave' -> not supported by IE
    , 'touchstart'
    , 'touchmove'
    , 'touchleave'
    , 'touchend'
    , 'touchcancel' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this
      
      /* bind event to element rather than element node */
      this.node['on' + event] = typeof f == 'function' ?
        function() { return f.apply(self, arguments) } : null
      
      return this
    }
    
  })
  
  // Initialize listeners stack
  SVG.listeners = []
  SVG.handlerMap = []
  
  // Only kept for consistency of API
  SVG.registerEvent = function(){};
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    // create listener, get object-index
    var l     = listener.bind(node.instance || node)
      , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
      , ev    = event.split('.')[0]
      , ns    = event.split('.')[1] || '*'
      
    
    // ensure valid object
    SVG.listeners[index]         = SVG.listeners[index]         || {}
    SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
    SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}
  
    // reference listener
    SVG.listeners[index][ev][ns][listener] = l
  
    // add listener
    node.addEventListener(ev, l, false)
  }
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    var index = SVG.handlerMap.indexOf(node)
      , ev    = event && event.split('.')[0]
      , ns    = event && event.split('.')[1]
  
    if(index == -1) return
    
    if (listener) {
      // remove listener reference
      if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
        // remove listener
        node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)
  
        delete SVG.listeners[index][ev][ns || '*'][listener]
      }
  
    } else if (ns) {
      // remove all listeners for the namespaced event
      if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
        for (listener in SVG.listeners[index][ev][ns])
          SVG.off(node, [ev, ns].join('.'), listener)
  
        delete SVG.listeners[index][ev][ns]
      }
  
    } else if (ev) {
      // remove all listeners for the event
      if (SVG.listeners[index][ev]) {
        for (namespace in SVG.listeners[index][ev])
          SVG.off(node, [ev, namespace].join('.'))
  
        delete SVG.listeners[index][ev]
      }
  
    } else {
      // remove all listeners on a given node
      for (event in SVG.listeners[index])
        SVG.off(node, event)
  
      delete SVG.listeners[index]
  
    }
  }
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener)
      
      return this
    }
    // Unbind event from listener
  , off: function(event, listener) {
      SVG.off(this.node, event, listener)
      
      return this
    }
    // Fire given event
  , fire: function(event, data) {
      
      // Dispatch event
      this.node.dispatchEvent(new CustomEvent(event, {detail:data}))
  
      return this
    }
  })

  SVG.Defs = SVG.invent({
    // Initialize node
    create: 'defs'
  
    // Inherit from
  , inherit: SVG.Container
    
  })

  SVG.G = SVG.invent({
    // Initialize node
    create: 'g'
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        return x == null ? this.trans.x : this.transform('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        return y == null ? this.trans.y : this.transform('y', y)
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a group element
      group: function() {
        return this.put(new SVG.G)
      }
    }
  })

  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function() {
      return this.parent.children()
    }
    // Get the curent position siblings
  , position: function() {
      return this.parent.index(this)
    }
    // Get the next element (will return null if there is none)
  , next: function() {
      return this.siblings()[this.position() + 1]
    }
    // Get the next element (will return null if there is none)
  , previous: function() {
      return this.siblings()[this.position() - 1]
    }
    // Send given element one step forward
  , forward: function() {
      var i = this.position()
      return this.parent.removeElement(this).put(this, i + 1)
    }
    // Send given element one step backward
  , backward: function() {
      var i = this.position()
      
      if (i > 0)
        this.parent.removeElement(this).add(this, i - 1)
  
      return this
    }
    // Send given element all the way to the front
  , front: function() {
      return this.parent.removeElement(this).put(this)
    }
    // Send given element all the way to the back
  , back: function() {
      if (this.position() > 0)
        this.parent.removeElement(this).add(this, 0)
      
      return this
    }
    // Inserts a given element before the targeted element
  , before: function(element) {
      element.remove()
  
      var i = this.position()
      
      this.parent.add(element, i)
  
      return this
    }
    // Insters a given element after the targeted element
  , after: function(element) {
      element.remove()
      
      var i = this.position()
      
      this.parent.add(element, i + 1)
  
      return this
    }
  
  })

  SVG.Mask = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('mask'))
  
      /* keep references to masked elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Unmask all masked elements and remove itself
      remove: function() {
        /* unmask all targets */
        for (var i = this.targets.length - 1; i >= 0; i--)
          if (this.targets[i])
            this.targets[i].unmask()
        delete this.targets
  
        /* remove mask from parent */
        this.parent.removeElement(this)
        
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create masking element
      mask: function() {
        return this.defs().put(new SVG.Mask)
      }
    }
  })
  
  
  SVG.extend(SVG.Element, {
    // Distribute mask to svg element
    maskWith: function(element) {
      /* use given mask or create a new one */
      this.masker = element instanceof SVG.Mask ? element : this.parent.mask().add(element)
  
      /* store reverence on self in mask */
      this.masker.targets.push(this)
      
      /* apply mask */
      return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
    }
    // Unmask element
  , unmask: function() {
      delete this.masker
      return this.attr('mask', null)
    }
    
  })


  SVG.Clip = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('clipPath'))
  
      /* keep references to clipped elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Unclip all clipped elements and remove itself
      remove: function() {
        /* unclip all targets */
        for (var i = this.targets.length - 1; i >= 0; i--)
          if (this.targets[i])
            this.targets[i].unclip()
        delete this.targets
  
        /* remove clipPath from parent */
        this.parent.removeElement(this)
        
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create clipping element
      clip: function() {
        return this.defs().put(new SVG.Clip)
      }
    }
  })
  
  //
  SVG.extend(SVG.Element, {
    // Distribute clipPath to svg element
    clipWith: function(element) {
      /* use given clip or create a new one */
      this.clipper = element instanceof SVG.Clip ? element : this.parent.clip().add(element)
  
      /* store reverence on self in mask */
      this.clipper.targets.push(this)
      
      /* apply mask */
      return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
    }
    // Unclip element
  , unclip: function() {
      delete this.clipper
      return this.attr('clip-path', null)
    }
    
  })

  SVG.Gradient = SVG.invent({
    // Initialize node
    create: function(type) {
      this.constructor.call(this, SVG.create(type + 'Gradient'))
      
      /* store type */
      this.type = type
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // From position
      from: function(x, y) {
        return this.type == 'radial' ?
          this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
          this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
      }
      // To position
    , to: function(x, y) {
        return this.type == 'radial' ?
          this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
          this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
      }
      // Radius for radial gradient
    , radius: function(r) {
        return this.type == 'radial' ?
          this.attr({ r: new SVG.Number(r) }) :
          this
      }
      // Add a color stop
    , at: function(offset, color, opacity) {
        return this.put(new SVG.Stop).update(offset, color, opacity)
      }
      // Update gradient
    , update: function(block) {
        /* remove all stops */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
          block.call(this, this)
        
        return this
      }
      // Return the fill id
    , fill: function() {
        return 'url(#' + this.id() + ')'
      }
      // Alias string convertion to fill
    , toString: function() {
        return this.fill()
      }
    }
    
    // Add parent method
  , construct: {
      // Create gradient element in defs
      gradient: function(type, block) {
        return this.defs().gradient(type, block)
      }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // define gradient
    gradient: function(type, block) {
      return this.put(new SVG.Gradient(type)).update(block)
    }
    
  })
  
  SVG.Stop = SVG.invent({
    // Initialize node
    create: 'stop'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
      // add color stops
      update: function(o) {
        if (typeof o == 'number' || o instanceof SVG.Number) {
          o = {
            offset:  arguments[0]
          , color:   arguments[1]
          , opacity: arguments[2]
          }
        }
  
        /* set attributes */
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
        if (o.color   != null) this.attr('stop-color', o.color)
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
  
        return this
      }
    }
  
  })


  SVG.Pattern = SVG.invent({
    // Initialize node
    create: 'pattern'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Return the fill id
  	  fill: function() {
  	    return 'url(#' + this.id() + ')'
  	  }
  	  // Update pattern by rebuilding
  	, update: function(block) {
  			/* remove content */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
        	block.call(this, this)
        
        return this
  		}
  	  // Alias string convertion to fill
  	, toString: function() {
  	    return this.fill()
  	  }
    }
    
    // Add parent method
  , construct: {
      // Create pattern element in defs
  	  pattern: function(width, height, block) {
  	    return this.defs().pattern(width, height, block)
  	  }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // Define gradient
    pattern: function(width, height, block) {
      return this.put(new SVG.Pattern).update(block).attr({
        x:            0
      , y:            0
      , width:        width
      , height:       height
      , patternUnits: 'userSpaceOnUse'
      })
    }
  
  })

  SVG.Doc = SVG.invent({
    // Initialize node
    create: function(element) {
      /* ensure the presence of a html element */
      this.parent = typeof element == 'string' ?
        document.getElementById(element) :
        element
      
      /* If the target is an svg element, use that element as the main wrapper.
         This allows svg.js to work with svg documents as well. */
      this.constructor
        .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
      
      /* set svg element attributes */
      this
        .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
      
      /* create the <defs> node */
      this._defs = new SVG.Defs
      this._defs.parent = this
      this.node.appendChild(this._defs.node)
  
      /* turn off sub pixel offset by default */
      this.doSpof = false
      
      /* ensure correct rendering */
      if (this.parent != this.node)
        this.stage()
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      /* enable drawing */
      stage: function() {
        var element = this
  
        /* insert element */
        this.parent.appendChild(this.node)
  
        /* fix sub-pixel offset */
        element.spof()
        
        /* make sure sub-pixel offset is fixed every time the window is resized */
        SVG.on(window, 'resize', function() {
          element.spof()
        })
  
        return this
      }
  
      // Creates and returns defs element
    , defs: function() {
        return this._defs
      }
  
      // Fix for possible sub-pixel offset. See:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
    , spof: function() {
        if (this.doSpof) {
          var pos = this.node.getScreenCTM()
          
          if (pos)
            this
              .style('left', (-pos.e % 1) + 'px')
              .style('top',  (-pos.f % 1) + 'px')
        }
        
        return this
      }
  
      // Enable sub-pixel offset
    , fixSubPixelOffset: function() {
        this.doSpof = true
  
        return this
      }
      
        // Removes the doc from the DOM
    , remove: function() {
        if(this.parent) {
          this.parent.removeChild(this.node);
          this.parent = null;
        }
  
        return this;
      }
    }
    
  })


  SVG.Shape = SVG.invent({
    // Initialize node
    create: function(element) {
  	  this.constructor.call(this, element)
  	}
  
    // Inherit from
  , inherit: SVG.Element
  
  })

  SVG.Symbol = SVG.invent({
    // Initialize node
    create: 'symbol'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add parent method
  , construct: {
      // Create a new symbol
      symbol: function() {
        return this.defs().put(new SVG.Symbol)
      }
    }
    
  })

  SVG.Use = SVG.invent({
    // Initialize node
    create: 'use'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Use element as a reference
      element: function(element) {
        /* store target element */
        this.target = element
  
        /* set lined element */
        return this.attr('href', '#' + element, SVG.xlink)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a use element
      use: function(element) {
        return this.put(new SVG.Use).element(element)
      }
    }
  })

  SVG.Rect = SVG.invent({
  	// Initialize node
    create: 'rect'
  
  	// Inherit from
  , inherit: SVG.Shape
  	
  	// Add parent method
  , construct: {
    	// Create a rect element
    	rect: function(width, height) {
    	  return this.put(new SVG.Rect().size(width, height))
    	}
    	
  	}
  	
  })

  SVG.Ellipse = SVG.invent({
    // Initialize node
    create: 'ellipse'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
      }
      // Move over y-axis
    , y: function(y) {
        return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.attr('cx') : this.attr('cx', new SVG.Number(x).divide(this.trans.scaleX))
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.attr('cy') : this.attr('cy', new SVG.Number(y).divide(this.trans.scaleY))
      }
      // Set width of element
    , width: function(width) {
        return width == null ? this.attr('rx') * 2 : this.attr('rx', new SVG.Number(width).divide(2))
      }
      // Set height of element
    , height: function(height) {
        return height == null ? this.attr('ry') * 2 : this.attr('ry', new SVG.Number(height).divide(2))
      }
      // Custom size function
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this.attr({
          rx: new SVG.Number(p.width).divide(2)
        , ry: new SVG.Number(p.height).divide(2)
        })
      }
      
    }
  
    // Add parent method
  , construct: {
      // Create circle element, based on ellipse
      circle: function(size) {
        return this.ellipse(size, size)
      }
      // Create an ellipse
    , ellipse: function(width, height) {
        return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
      }
      
    }
  
  })

  SVG.Line = SVG.invent({
    // Initialize node
    create: 'line'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        var b = this.bbox()
        
        return x == null ? b.x : this.attr({
          x1: this.attr('x1') - b.x + x
        , x2: this.attr('x2') - b.x + x
        })
      }
      // Move over y-axis
    , y: function(y) {
        var b = this.bbox()
        
        return y == null ? b.y : this.attr({
          y1: this.attr('y1') - b.y + y
        , y2: this.attr('y2') - b.y + y
        })
      }
      // Move by center over x-axis
    , cx: function(x) {
        var half = this.bbox().width / 2
        return x == null ? this.x() + half : this.x(x - half)
      }
      // Move by center over y-axis
    , cy: function(y) {
        var half = this.bbox().height / 2
        return y == null ? this.y() + half : this.y(y - half)
      }
      // Set width of element
    , width: function(width) {
        var b = this.bbox()
  
        return width == null ? b.width : this.attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)
      }
      // Set height of element
    , height: function(height) {
        var b = this.bbox()
  
        return height == null ? b.height : this.attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)
      }
      // Set line size by width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this.width(p.width).height(p.height)
      }
      // Set path data
    , plot: function(x1, y1, x2, y2) {
        return this.attr({
          x1: x1
        , y1: y1
        , x2: x2
        , y2: y2
        })
      }
    }
    
    // Add parent method
  , construct: {
      // Create a line element
      line: function(x1, y1, x2, y2) {
        return this.put(new SVG.Line().plot(x1, y1, x2, y2))
      }
    }
  })


  SVG.Polyline = SVG.invent({
    // Initialize node
    create: 'polyline'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polyline element
      polyline: function(p) {
        return this.put(new SVG.Polyline).plot(p)
      }
    }
  })
  
  SVG.Polygon = SVG.invent({
    // Initialize node
    create: 'polygon'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polygon element
      polygon: function(p) {
        return this.put(new SVG.Polygon).plot(p)
      }
    }
  })
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Polygon, {
    // Define morphable array
    morphArray:  SVG.PointArray
    // Plot new path
  , plot: function(p) {
      return this.attr('points', (this.array = new SVG.PointArray(p, [[0,0]])))
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('points', this.array.move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set width of element
  , width: function(width) {
      var b = this.bbox()
  
      return width == null ? b.width : this.size(width, b.height)
    }
    // Set height of element
  , height: function(height) {
      var b = this.bbox()
  
      return height == null ? b.height : this.size(b.width, height) 
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)
  
      return this.attr('points', this.array.size(p.width, p.height))
    }
  
  })

  SVG.Path = SVG.invent({
    // Initialize node
    create: 'path'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Plot new poly points
      plot: function(p) {
        return this.attr('d', (this.array = new SVG.PathArray(p, [['M', 0, 0]])))
      }
      // Move by left top corner
    , move: function(x, y) {
        return this.attr('d', this.array.move(x, y))
      }
      // Move by left top corner over x-axis
    , x: function(x) {
        return x == null ? this.bbox().x : this.move(x, this.bbox().y)
      }
      // Move by left top corner over y-axis
    , y: function(y) {
        return y == null ? this.bbox().y : this.move(this.bbox().x, y)
      }
      // Set element size to given width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
        
        return this.attr('d', this.array.size(p.width, p.height))
      }
      // Set width of element
    , width: function(width) {
        return width == null ? this.bbox().width : this.size(width, this.bbox().height)
      }
      // Set height of element
    , height: function(height) {
        return height == null ? this.bbox().height : this.size(this.bbox().width, height)
      }
      
    }
    
    // Add parent method
  , construct: {
      // Create a wrapped path element
      path: function(d) {
        return this.put(new SVG.Path).plot(d)
      }
    }
  })

  SVG.Image = SVG.invent({
    // Initialize node
    create: 'image'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // (re)load image
      load: function(url) {
        if (!url) return this
  
        var self = this
          , img  = document.createElement('img')
        
        /* preload image */
        img.onload = function() {
          var p = self.doc(SVG.Pattern)
  
          /* ensure image size */
          if (self.width() == 0 && self.height() == 0)
            self.size(img.width, img.height)
  
          /* ensure pattern size if not set */
          if (p && p.width() == 0 && p.height() == 0)
            p.size(self.width(), self.height())
          
          /* callback */
          if (typeof self._loaded === 'function')
            self._loaded.call(self, {
              width:  img.width
            , height: img.height
            , ratio:  img.width / img.height
            , url:    url
            })
        }
  
        return this.attr('href', (img.src = this.src = url), SVG.xlink)
      }
      // Add loade callback
    , loaded: function(loaded) {
        this._loaded = loaded
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create image element, load image and set its size
      image: function(source, width, height) {
        return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
      }
    }
  
  })

  SVG.Text = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('text'))
      
      this._leading = new SVG.Number(1.3)    /* store leading value for rebuilding */
      this._rebuild = true                   /* enable automatic updating of dy values */
      this._build   = false                  /* disable build mode for adding multiple lines */
  
      /* set default font */
      this.attr('font-family', SVG.defaults.attrs['font-family'])
    }
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        /* act as getter */
        if (x == null)
          return this.attr('x')
        
        /* move lines as well if no textPath is present */
        if (!this.textPath)
          this.lines.each(function() { if (this.newLined) this.x(x) })
  
        return this.attr('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        var oy = this.attr('y')
          , o  = typeof oy === 'number' ? oy - this.bbox().y : 0
  
        /* act as getter */
        if (y == null)
          return typeof oy === 'number' ? oy - o : oy
  
        return this.attr('y', typeof y === 'number' ? y + o : y)
      }
      // Move center over x-axis
    , cx: function(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
      }
      // Move center over y-axis
    , cy: function(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
      }
      // Set the text content
    , text: function(text) {
        /* act as getter */
        if (typeof text === 'undefined') return this.content
        
        /* remove existing content */
        this.clear().build(true)
        
        if (typeof text === 'function') {
          /* call block */
          text.call(this, this)
  
        } else {
          /* store text and make sure text is not blank */
          text = (this.content = text).split('\n')
          
          /* build new lines */
          for (var i = 0, il = text.length; i < il; i++)
            this.tspan(text[i]).newLine()
        }
        
        /* disable build mode and rebuild lines */
        return this.build(false).rebuild()
      }
      // Set font size
    , size: function(size) {
        return this.attr('font-size', size).rebuild()
      }
      // Set / get leading
    , leading: function(value) {
        /* act as getter */
        if (value == null)
          return this._leading
        
        /* act as setter */
        this._leading = new SVG.Number(value)
        
        return this.rebuild()
      }
      // Rebuild appearance type
    , rebuild: function(rebuild) {
        /* store new rebuild flag if given */
        if (typeof rebuild == 'boolean')
          this._rebuild = rebuild
  
        /* define position of all lines */
        if (this._rebuild) {
          var self = this
          
          this.lines.each(function() {
            if (this.newLined) {
              if (!this.textPath)
                this.attr('x', self.attr('x'))
              this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
            }
          })
  
          this.fire('rebuild')
        }
  
        return this
      }
      // Enable / disable build mode
    , build: function(build) {
        this._build = !!build
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create text element
      text: function(text) {
        return this.put(new SVG.Text).text(text)
      }
      // Create plain text element
    , plain: function(text) {
        return this.put(new SVG.Text).plain(text)
      }
    }
  
  })
  
  SVG.TSpan = SVG.invent({
    // Initialize node
    create: 'tspan'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Set text content
      text: function(text) {
        typeof text === 'function' ? text.call(this, this) : this.plain(text)
  
        return this
      }
      // Shortcut dx
    , dx: function(dx) {
        return this.attr('dx', dx)
      }
      // Shortcut dy
    , dy: function(dy) {
        return this.attr('dy', dy)
      }
      // Create new line
    , newLine: function() {
        /* fetch text parent */
        var t = this.doc(SVG.Text)
  
        /* mark new line */
        this.newLined = true
  
        /* apply new hy¡n */
        return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
      }
    }
    
  })
  
  SVG.extend(SVG.Text, SVG.TSpan, {
    // Create plain text node
    plain: function(text) {
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
  
      /* create text node */
      this.node.appendChild(document.createTextNode((this.content = text)))
      
      return this
    }
    // Create a tspan
  , tspan: function(text) {
      var node  = (this.textPath || this).node
        , tspan = new SVG.TSpan
  
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
      
      /* add new tspan and reference */
      node.appendChild(tspan.node)
      tspan.parent = this
  
      /* only first level tspans are considered to be "lines" */
      if (this instanceof SVG.Text)
        this.lines.add(tspan)
  
      return tspan.text(text)
    }
    // Clear all lines
  , clear: function() {
      var node = (this.textPath || this).node
  
      /* remove existing child nodes */
      while (node.hasChildNodes())
        node.removeChild(node.lastChild)
      
      /* reset content references  */
      if (this instanceof SVG.Text) {
        delete this.lines
        this.lines = new SVG.Set
        this.content = ''
      }
      
      return this
    }
    // Get length of text element
  , length: function() {
      return this.node.getComputedTextLength()
    }
  })


  SVG.TextPath = SVG.invent({
    // Initialize node
    create: 'textPath'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Define parent class
  , parent: SVG.Text
  
    // Add parent method
  , construct: {
      // Create path for text to run on
      path: function(d) {
        /* create textPath element */
        this.textPath = new SVG.TextPath
  
        /* move lines to textpath */
        while(this.node.hasChildNodes())
          this.textPath.node.appendChild(this.node.firstChild)
  
        /* add textPath element as child node */
        this.node.appendChild(this.textPath.node)
  
        /* create path in defs */
        this.track = this.doc().defs().path(d)
  
        /* create circular reference */
        this.textPath.parent = this
  
        /* link textPath to path and add content */
        this.textPath.attr('href', '#' + this.track, SVG.xlink)
  
        return this
      }
      // Plot path if any
    , plot: function(d) {
        if (this.track) this.track.plot(d)
        return this
      }
    }
  })

  SVG.Nested = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('svg'))
      
      this.style('overflow', 'visible')
    }
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add parent method
  , construct: {
      // Create nested svg document
      nested: function() {
        return this.put(new SVG.Nested)
      }
    }
  })

  SVG.A = SVG.invent({
    // Initialize node
    create: 'a'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Link url
      to: function(url) {
        return this.attr('href', url, SVG.xlink)
      }
      // Link show attribute
    , show: function(target) {
        return this.attr('show', target, SVG.xlink)
      }
      // Link target attribute
    , target: function(target) {
        return this.attr('target', target)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a hyperlink element
      link: function(url) {
        return this.put(new SVG.A).to(url)
      }
    }
  })
  
  SVG.extend(SVG.Element, {
    // Create a hyperlink element
    linkTo: function(url) {
      var link = new SVG.A
  
      if (typeof url == 'function')
        url.call(link, link)
      else
        link.to(url)
  
      return this.parent.put(link).put(this)
    }
    
  })

  SVG.Marker = SVG.invent({
    // Initialize node
    create: 'marker'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Set width of element
      width: function(width) {
        return this.attr('markerWidth', width)
      }
      // Set height of element
    , height: function(height) {
        return this.attr('markerHeight', height)
      }
      // Set marker refX and refY
    , ref: function(x, y) {
        return this.attr('refX', x).attr('refY', y)
      }
      // Update marker
    , update: function(block) {
        /* remove all content */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
          block.call(this, this)
        
        return this
      }
      // Return the fill id
    , toString: function() {
        return 'url(#' + this.id() + ')'
      }
    }
  
    // Add parent method
  , construct: {
      marker: function(width, height, block) {
        // Create marker element in defs
        return this.defs().marker(width, height, block)
      }
    }
  
  })
  
  SVG.extend(SVG.Defs, {
    // Create marker
    marker: function(width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new SVG.Marker)
        .size(width, height)
        .ref(width / 2, height / 2)
        .viewbox(0, 0, width, height)
        .attr('orient', 'auto')
        .update(block)
    }
    
  })
  
  SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
    // Create and attach markers
    marker: function(marker, width, height, block) {
      var attr = ['marker']
  
      // Build attribute name
      if (marker != 'all') attr.push(marker)
      attr = attr.join('-')
  
      // Set marker attribute
      marker = arguments[1] instanceof SVG.Marker ?
        arguments[1] :
        this.doc().marker(width, height, block)
      
      return this.attr(attr, marker)
    }
    
  })

  var sugar = {
    stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  , fill:   ['color', 'opacity', 'rule']
  , prefix: function(t, a) {
      return a == 'color' ? t : t + '-' + a
    }
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(m) {
    var i, extension = {}
    
    extension[m] = function(o) {
      if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
        this.attr(m, o)
  
      else
        /* set all attributes from sugar.fill and sugar.stroke list */
        for (i = sugar[m].length - 1; i >= 0; i--)
          if (o[sugar[m][i]] != null)
            this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
      
      return this
    }
    
    SVG.extend(SVG.Element, SVG.FX, extension)
    
  })
  
  SVG.extend(SVG.Element, SVG.FX, {
    // Rotation
    rotate: function(deg, x, y) {
      return this.transform({
        rotation: deg || 0
      , cx: x
      , cy: y
      })
    }
    // Skew
  , skew: function(x, y) {
      return this.transform({
        skewX: x || 0
      , skewY: y || 0
      })
    }
    // Scale
  , scale: function(x, y) {
      return this.transform({
        scaleX: x
      , scaleY: y == null ? x : y
      })
    }
    // Translate
  , translate: function(x, y) {
      return this.transform({
        x: x
      , y: y
      })
    }
    // Matrix
  , matrix: function(m) {
      return this.transform({ matrix: m })
    }
    // Opacity
  , opacity: function(value) {
      return this.attr('opacity', value)
    }
  
  })
  
  SVG.extend(SVG.Rect, SVG.Ellipse, SVG.FX, {
    // Add x and y radius
    radius: function(x, y) {
      return this.attr({ rx: x, ry: y || x })
    }
  
  })
  
  SVG.extend(SVG.Path, {
    // Get path length
    length: function() {
      return this.node.getTotalLength()
    }
    // Get point at length
  , pointAt: function(length) {
      return this.node.getPointAtLength(length)
    }
  
  })
  
  SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
    // Set font 
    font: function(o) {
      for (var k in o)
        k == 'leading' ?
          this.leading(o[k]) :
        k == 'anchor' ?
          this.attr('text-anchor', o[k]) :
        k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
          this.attr('font-'+ k, o[k]) :
          this.attr(k, o[k])
      
      return this
    }
    
  })
  


  SVG.Set = SVG.invent({
    // Initialize
    create: function() {
      /* set initial state */
      this.clear()
    }
  
    // Add class methods
  , extend: {
      // Add element to set
      add: function() {
        var i, il, elements = [].slice.call(arguments)
  
        for (i = 0, il = elements.length; i < il; i++)
          this.members.push(elements[i])
        
        return this
      }
      // Remove element from set
    , remove: function(element) {
        var i = this.index(element)
        
        /* remove given child */
        if (i > -1)
          this.members.splice(i, 1)
  
        return this
      }
      // Iterate over all members
    , each: function(block) {
        for (var i = 0, il = this.members.length; i < il; i++)
          block.apply(this.members[i], [i, this.members])
  
        return this
      }
      // Restore to defaults
    , clear: function() {
        /* initialize store */
        this.members = []
  
        return this
      }
      // Checks if a given element is present in set
    , has: function(element) {
        return this.index(element) >= 0
      }
      // retuns index of given element in set
    , index: function(element) {
        return this.members.indexOf(element)
      }
      // Get member at given index
    , get: function(i) {
        return this.members[i]
      }
      // Get first member
    , first: function() {
        return this.get(0)
      }
      // Get last member
    , last: function() {
        return this.get(this.members.length - 1)
      }
      // Default value
    , valueOf: function() {
        return this.members
      }
      // Get the bounding box of all members included or empty box if set has no items
    , bbox: function(){
        var box = new SVG.BBox()
  
        /* return an empty box of there are no members */
        if (this.members.length == 0)
          return box
  
        /* get the first rbox and update the target bbox */
        var rbox = this.members[0].rbox()
        box.x      = rbox.x
        box.y      = rbox.y
        box.width  = rbox.width
        box.height = rbox.height
  
        this.each(function() {
          /* user rbox for correct position and visual representation */
          box = box.merge(this.rbox())
        })
  
        return box
      }
    }
    
    // Add parent method
  , construct: {
      // Create a new set
      set: function() {
        return new SVG.Set
      }
    }
  })
  
  SVG.SetFX = SVG.invent({
    // Initialize node
    create: function(set) {
      /* store reference to set */
      this.set = set
    }
  
  })
  
  // Alias methods
  SVG.Set.inherit = function() {
    var m
      , methods = []
    
    /* gather shape methods */
    for(var m in SVG.Shape.prototype)
      if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
        methods.push(m)
  
    /* apply shape aliasses */
    methods.forEach(function(method) {
      SVG.Set.prototype[method] = function() {
        for (var i = 0, il = this.members.length; i < il; i++)
          if (this.members[i] && typeof this.members[i][method] == 'function')
            this.members[i][method].apply(this.members[i], arguments)
  
        return method == 'animate' ? (this.fx || (this.fx = new SVG.SetFX(this))) : this
      }
    })
  
    /* clear methods for the next round */
    methods = []
  
    /* gather fx methods */
    for(var m in SVG.FX.prototype)
      if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')
        methods.push(m)
  
    /* apply fx aliasses */
    methods.forEach(function(method) {
      SVG.SetFX.prototype[method] = function() {
        for (var i = 0, il = this.set.members.length; i < il; i++)
          this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)
  
        return this
      }
    })
  }
  
  


  SVG.extend(SVG.Element, {
  	// Store data values on svg nodes
    data: function(a, v, r) {
    	if (typeof a == 'object') {
    		for (v in a)
    			this.data(v, a[v])
  
      } else if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a))
        } catch(e) {
          return this.attr('data-' + a)
        }
        
      } else {
        this.attr(
          'data-' + a
        , v === null ?
            null :
          r === true || typeof v === 'string' || typeof v === 'number' ?
            v :
            JSON.stringify(v)
        )
      }
      
      return this
    }
  })

  SVG.extend(SVG.Element, {
    // Remember arbitrary data
    remember: function(k, v) {
      /* remember every item in an object individually */
      if (typeof arguments[0] == 'object')
        for (var v in k)
          this.remember(v, k[v])
  
      /* retrieve memory */
      else if (arguments.length == 1)
        return this.memory()[k]
  
      /* store memory */
      else
        this.memory()[k] = v
  
      return this
    }
  
    // Erase a given memory
  , forget: function() {
      if (arguments.length == 0)
        this._memory = {}
      else
        for (var i = arguments.length - 1; i >= 0; i--)
          delete this.memory()[arguments[i]]
  
      return this
    }
  
    // Initialize or return local memory object
  , memory: function() {
      return this._memory || (this._memory = {})
    }
  
  })

  function camelCase(s) { 
    return s.toLowerCase().replace(/-(.)/g, function(m, g) {
      return g.toUpperCase()
    })
  }
  
  // Ensure to six-based hex 
  function fullHex(hex) {
    return hex.length == 4 ?
      [ '#',
        hex.substring(1, 2), hex.substring(1, 2)
      , hex.substring(2, 3), hex.substring(2, 3)
      , hex.substring(3, 4), hex.substring(3, 4)
      ].join('') : hex
  }
  
  // Component to hex value
  function compToHex(comp) {
    var hex = comp.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }
  
  // Calculate proportional width and height values when necessary
  function proportionalSize(box, width, height) {
    if (width == null || height == null) {
      if (height == null)
        height = box.height / box.width * width
      else if (width == null)
        width = box.width / box.height * height
    }
    
    return {
      width:  width
    , height: height
    }
  }
  
  // Calculate position according to from and to
  function at(o, pos) {
    /* number recalculation (don't bother converting to SVG.Number for performance reasons) */
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * pos :
    
    /* instance recalculation */
    o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :
    
    /* for all other values wait until pos has reached 1 to return the final value */
    pos < 1 ? o.from : o.to
  }
  
  // PathArray Helpers
  function arrayToString(a) {
    for (var i = 0, il = a.length, s = ''; i < il; i++) {
      s += a[i][0]
  
      if (a[i][1] != null) {
        s += a[i][1]
  
        if (a[i][2] != null) {
          s += ' '
          s += a[i][2]
  
          if (a[i][3] != null) {
            s += ' '
            s += a[i][3]
            s += ' '
            s += a[i][4]
  
            if (a[i][5] != null) {
              s += ' '
              s += a[i][5]
              s += ' '
              s += a[i][6]
  
              if (a[i][7] != null) {
                s += ' '
                s += a[i][7]
              }
            }
          }
        }
      }
    }
    
    return s + ' '
  }
  
  // Add more bounding box properties
  function boxProperties(b) {
    b.x2 = b.x + b.width
    b.y2 = b.y + b.height
    b.cx = b.x + b.width / 2
    b.cy = b.y + b.height / 2
  }
  
  // Parse a matrix string
  function parseMatrix(o) {
    if (o.matrix) {
      /* split matrix string */
      var m = o.matrix.replace(/\s/g, '').split(',')
      
      /* pasrse values */
      if (m.length == 6) {
        o.a = parseFloat(m[0])
        o.b = parseFloat(m[1])
        o.c = parseFloat(m[2])
        o.d = parseFloat(m[3])
        o.e = parseFloat(m[4])
        o.f = parseFloat(m[5])
      }
    }
    
    return o
  }
  
  // Get id from reference string
  function idFromReference(url) {
    var m = url.toString().match(SVG.regex.reference)
  
    if (m) return m[1]
  }


  return SVG
}));

/** svg.path.js - v0.6.0 - 2014-08-15
 * http://otm.github.io/svg.path.js/
 * Copyright (c) 2014 Nils Lagerkvist; Licensed under the  MIT license /
 */
(function(){var a=Function.prototype.call.bind(Array.prototype.slice);SVG.extend(SVG.Path,{M:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("M",b,this._redrawEnabled),1===this._segments.length?this.plot("M"+b[0]+" "+b[1]):this},m:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("m",b,this._redrawEnabled),1===this._segments.length?this.plot("m"+b[0]+" "+b[1]):this},L:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("L",b,this._redrawEnabled)},l:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("l",b,this._redrawEnabled)},H:function(a){return this.addSegment("H",[a],this._redrawEnabled)},h:function(a){return this.addSegment("h",[a],this._redrawEnabled)},V:function(a){return this.addSegment("V",[a],this._redrawEnabled)},v:function(a){return this.addSegment("v",[a],this._redrawEnabled)},C:function(b,c,d){return d=3===arguments.length?[b.x,b.y,c.x,c.y,d.x,d.y]:a(arguments),this.addSegment("C",d,this._redrawEnabled)},c:function(b,c,d){return d=3===arguments.length?[b.x,b.y,c.x,c.y,d.x,d.y]:a(arguments),this.addSegment("c",d,this._redrawEnabled)},S:function(b,c){return c=2===arguments.length?[b.x,b.y,c.x,c.y]:a(arguments),this.addSegment("S",c,this._redrawEnabled)},s:function(b,c){return c=2===arguments.length?[b.x,b.y,c.x,c.y]:a(arguments),this.addSegment("s",c,this._redrawEnabled)},Q:function(b,c){return c=2===arguments.length?[b.x,b.y,c.x,c.y]:a(arguments),this.addSegment("Q",c,this._redrawEnabled)},q:function(b,c){return c=2===arguments.length?[b.x,b.y,c.x,c.y]:a(arguments),this.addSegment("q",c,this._redrawEnabled)},T:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("T",b,this._redrawEnabled)},t:function(b){return b=1===arguments.length?[b.x,b.y]:a(arguments),this.addSegment("t",b,this._redrawEnabled)},A:function(b,c,d,e,f,g){return g=6===arguments.length?[b,c,d,e,f,g.x,g.y]:a(arguments),this.addSegment("A",g,this._redrawEnabled)},a:function(b,c,d,e,f,g){return g=6===arguments.length?[b,c,d,e,f,g.x,g.y]:a(arguments),this.addSegment("a",g,this._redrawEnabled)},Z:function(){return this.addSegment("Z",[],this._redrawEnabled)},addSegment:function(a,b,c){var d={type:a,coords:b};return this._segments||(this._segments=[]),this._segments.push(d),c!==!1&&this._drawSegment(d),this},clear:function(){return this._segments&&(this._segments.length=0),this._lastSegment=null,this.plot()},getSegmentCount:function(){return this._segments.length},getSegment:function(a){return this._segments[a]},removeSegment:function(a){return this._segments.splice(a,1),this.redraw()},replaceSegment:function(a,b){return this._segments.splice(a,1,b),this.redraw()},drawAnimated:function(a){a=a||{},a.duration=a.duration||"1000",a.easing=a.easing||"<>",a.delay=a.delay||0;var b=this.length();this.stroke({width:2,dasharray:b+" "+b,dashoffset:b});var c=this.animate(a.duration,a.easing,a.delay);return c.stroke({dashoffset:0}),this},update:function(a){return a===!0&&(this._redrawEnabled=!1),a===!1&&(this._redrawEnabled=!0),!!this._redrawEnabled},redraw:function(){return this._lastSegment=null,this.attr("d",""),this._drawSegment(this._segments)},_drawSegment:function(a){var b="",c=this._lastSegment;Array.isArray(a)||(a=[a]);for(var d=0;d<a.length;d+=1)b+=c===a[d].type?" "+a[d].coords.join(" "):" "+a[d].type+a[d].coords.join(" "),c=a[d].type;return this._lastSegment=c,this.attr("d",(this.attr("d")||"")+b)}})}).call(this);
SVG.ForiegnObject = function() {
  this.constructor.call(this, SVG.create('foreignObject'))
  
  /* store type */
  this.type = 'foreignObject'
}

SVG.ForiegnObject.prototype = new SVG.Shape

SVG.extend(SVG.ForiegnObject, {
  appendChild: function (child, attrs) {
    var newChild = typeof(child)=='string' ? document.createElement(child) : child
    if (typeof(attrs)=='object'){
      for(a in attrs) newChild[a] = attrs[a]
    }
    this.node.appendChild(newChild)
    return this  
  },
  getChild: function (index) {
    return this.node.childNodes[index]
  }
})

SVG.extend(SVG.Container, {
  foreignObject: function(width, height) {
    return this.put(new SVG.ForiegnObject).size(width == null ? 100 : width, height == null ? 100 : height)
  }
})
// svg.draggable.js 0.1.0 - Copyright (c) 2014 Wout Fierens - Licensed under the MIT license
// extended by Florian Loch
// added PEP support and some modifications by: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element draggable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    draggable: function(context, constraint, attachToEls) {
      var startDrag, drag, endDrag
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove draggable if already present */
      if (typeof this.fixedDrag === 'function')
        this.fixedDrag();
      
      /* ensure constraint object */
      constraint = constraint || {}
      
      /* start dragging */
      startDrag = function(event) {
        event = event || window.event
        element.startEventDrag = event;

        /* invoke any callbacks */
        if (context.dragstart)
          context.dragstart(event)

        /* prevent selection dragging */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while dragging */
      drag = function(event) {
        event = event || window.event
        
        if (element.startEventDrag) {
          /* calculate move position */
          var rotation  = context.absoluteRotation * Math.PI / 180;
          var bbox = {
            x: element.x(),
            y: element.y()
          };
          var zoom = context.workspace.absoluteScale * context.workspace.scale;
          var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / zoom;
          var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / zoom;
          /* caculate new position [with rotation correction] */
          x = bbox.x + ddx;
          y = bbox.y + ddy;
          if (typeof constraint === 'function') {
            var coord = constraint(x, y)

            if (typeof coord === 'object') {
              if (typeof coord.x != 'boolean' || coord.x)
                element.x(typeof coord.x === 'number' ? coord.x : x)
              if (typeof coord.y != 'boolean' || coord.y)
                element.y(typeof coord.y === 'number' ? coord.y : y)

            } else if (typeof coord === 'boolean' && coord) {
              element.move(x, y)
              // update context
              context.x = x;
              context.y = y;
            }

          } else if (typeof constraint === 'object') {
            /* keep element within constrained box */
            if (constraint.minX != null && x < constraint.minX)
              x = constraint.minX
            else if (constraint.maxX != null && x > constraint.maxX - width)
              x = constraint.maxX - width
            
            if (constraint.minY != null && y < constraint.minY)
              y = constraint.minY
            else if (constraint.maxY != null && y > constraint.maxY - height)
              y = constraint.maxY - height

            element.move(x, y)
            // update context
            context.x = x;
            context.y = y;
          }

          /* invoke any callbacks */
          if (context.dragmove)
            context.dragmove(event)
        }
        event.stopPropagation();
      }
      
      /* when dragging ends */
      endDrag = function(event) {
        event = event || window.event

        /* reset store */
        element.startEventDrag    = null
        element.startPositionDrag = null

        /* invoke any callbacks */
        if (context.dragend)
          context.dragend(event)
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startDrag);
        PolymerGestures.addEventListener(el.node, 'track', drag);
        PolymerGestures.addEventListener(el.node, 'trackend', endDrag);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable draggable */
      element.fixedDrag = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startDrag);
          PolymerGestures.removeEventListener(el.node, 'track', drag);
          PolymerGestures.removeEventListener(el.node, 'trackend', endDrag);
        });
        
        startDrag = drag = endDrag = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);
// svg.pannable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element a pannable area
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    pannable: function(context, constraint, attachToEls, pannableEls) { // exceptions are no pannable elements
      var startPan, pan, endPan
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove pangable if already present */
      if (typeof this.fixedPan === 'function')
        this.fixedPan();
      
      /* ensure constraint object */
      constraint = constraint || {};
      
      /* start panning */
      startPan = function(event) {
        event = event || window.event
        
        /* store event */
        element.startEventPan = event;

        /* invoke any callbacks */
        if (context.panstart)
          context.panstart({zoom: element.startPositionsPan}, event)
        
        /* prevent selection panning */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while panning */
      pan = function(event) {
        event = event || window.event
        
        if (element.startEventPan) {
          /* calculate move position for all children*/
          for (var i = 0; i < pannableEls.length; i++) {
            var child = pannableEls[i];
            var rotation  = context.absoluteRotation * Math.PI / 180;
            var bbox = {
              x: child.x(),
              y: child.y()
            };
            var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / context.absoluteScale;
            var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / context.absoluteScale;
            /* caculate new position [with rotation correction] */
            x = bbox.x + ddx;
            y = bbox.y + ddy;

            /* move the child to its new position, if possible by constraint */
            if (typeof constraint === 'function') {
              var coord = constraint(x, y)

              if (typeof coord === 'object') {
                if (typeof coord.x != 'boolean' || coord.x)
                  child.x(typeof coord.x === 'number' ? coord.x : x)
                if (typeof coord.y != 'boolean' || coord.y)
                  child.y(typeof coord.y === 'number' ? coord.y : y)

              } else if (typeof coord === 'boolean' && coord) {
                child.move(x, y)
              }

            } else if (typeof constraint === 'object') {
              /* keep child within constrained box */
              if (constraint.minX != null && x < constraint.minX)
                x = constraint.minX
              else if (constraint.maxX != null && x > constraint.maxX - width)
                x = constraint.maxX - width

              if (constraint.minY != null && y < constraint.minY)
                y = constraint.minY
              else if (constraint.maxY != null && y > constraint.maxY - height)
                y = constraint.maxY - height

              child.move(x, y)
            }

            /* invoke any callbacks */
            if (context.panmove)
              context.panmove(delta, event)
          }
        }
        event.stopPropagation();
      }
      
      /* when panning ends */
      endPan = function(event) {
        event = event || window.event
        
        /* calculate move position */
        var delta = {
          x:    event.pageX - element.startEventPan.pageX
        , y:    event.pageY - element.startEventPan.pageY
        , zoom: parent.viewbox().zoom
        }
        
        /* reset store */
        element.startEventPan    = null
        element.startPositionsPan = null

        /* invoke any callbacks */
        if (context.panend)
          context.panend(delta, event)
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startPan);
        PolymerGestures.addEventListener(el.node, 'track', pan);
        PolymerGestures.addEventListener(el.node, 'trackend', endPan);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable panable */
      element.fixedPan = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startPan);
          PolymerGestures.removeEventListener(el.node, 'track', pan);
          PolymerGestures.removeEventListener(el.node, 'trackend', endPan);
        });
        
        startPan = pan = endPan = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);
// svg.resizable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element resizable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    resizable: function(context, constraint, attachToEls) {
      var startResize, resize, endResize, initialWidth, initialHeight
        , element = this
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove resizable if already present */
      if (typeof this.fixedResize === 'function')
        this.fixedResize();
      
      /* ensure constraint object */
      constraint = constraint || {}
      
      /* start resizing */
      startResize = function(event) {
        event = event || window.event

        initialWidth = context.width;
        initialHeight = context.height;
        
        /* store event */
        element.startEventResize = event

        /* invoke any callbacks */
        if (context.resizestart)
          context.resizestart(event)

        /* prevent selection resizing */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        event.stopPropagation();
      }
      
      /* while resizing */
      resize = function(event) {
        event = event || window.event
        
        if (element.startEventResize) {
          /* calculate move position */
          var rotation  = context.absoluteRotation * Math.PI / 180;
          var zoom = context.workspace.absoluteScale * context.workspace.scale;
          var ddx = (event.ddx * Math.cos(rotation) + event.ddy * Math.sin(rotation)) / zoom;
          var ddy = (event.ddy * Math.cos(rotation) + event.ddx * Math.sin(-rotation)) / zoom;
          var dx = (event.dx * Math.cos(rotation) + event.dy * Math.sin(rotation)) / zoom;
          var dy = (event.dy * Math.cos(rotation) + event.dx * Math.sin(-rotation)) / zoom;
          
          //TODO: constraints
          if (initialWidth + dx >= 0) {
            context.setWidth(initialWidth + dx);
          }
          if (initialHeight + dy >= 0) {
            context.setHeight(initialHeight + dy);
          }

          /* invoke any callbacks */
          if (context.resizemove)
            context.resizemove(event)
        }
        event.stopPropagation();
      }
      
      /* when resizing ends */
      endResize = function(event) {
        event = event || window.event

        /* reset store */
        element.startEventResize    = null
context
        /* invoke any callbacks */
        if (context.resizeend)
          context.resizeend(event);
        event.stopPropagation();
      }
      
      /* bind mousedown event */
      attachToEls.forEach(function(el) {
        PolymerGestures.addEventListener(el.node, 'trackstart', startResize);
        PolymerGestures.addEventListener(el.node, 'track', resize);
        PolymerGestures.addEventListener(el.node, 'trackend', endResize);
        //fix pointerdown event (down in PolymerGestures)
        PolymerGestures.addEventListener(el.node, 'down', function(e){
          e.preventDefault(); // don't select text with mouse
        });
      });
      
      /* disable resizable */
      element.fixedResize = function() {
        attachToEls.forEach(function(el) {
          PolymerGestures.removeEventListener(el.node, 'trackstart', startResize);
          PolymerGestures.removeEventListener(el.node, 'track', resize);
          PolymerGestures.removeEventListener(el.node, 'trackend', endResize);
        });
        
        startResize = resize = endResize = null
        
        return element
      }
      
      return this
    }
    
  })

}).call(this);
// svg.scalable.js based on svg.draggable.js 0.1.0 by Wout Fierens
// Autor: Carlos Galarza (carloslfu@gmail.com)
;(function() {

  SVG.extend(SVG.Element, {
    // Make element scalable
    // Constraint might be a object (as described in readme.md) or a function in the form "function (x, y)" that gets called before every move.
    // The function can return a boolean or a object of the form {x, y}, to which the element will be moved. "False" skips moving, true moves to raw x, y.
    scalable: function(context, constraint, attachToEls) {
      var mouseWheelScale, mouseMoveTracking, pinch, pinchEnd
        , element = this, constraint
        , parent  = this._parent(SVG.Doc) || this.parent._parent(SVG.Nested);

      if (!attachToEls) {
        attachToEls = [element];
      }
      /* remove scalable if already present */
      if (typeof this.fixedScale === 'function')
        this.fixedScale();
      
      /* ensure constraint object */
      constraint = constraint || {}

      mouseMoveTracking = function(e) {
        //mouse position tracking (for scaling)
        context.mousePosition = mouseToSvg(e, context.root.node);
      };
      /**
       * Handle a mouse-wheel on SVG background.
       * @param {!Event} e Mouse wheel event.
       * @private
       */
      mouseWheelScale = function(e) {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var x = context.mousePosition.x;
        var y = context.mousePosition.y;
        if (context.scalestart)
          context.scalestart(x , y, delta)
        context.zoom(x , y, delta);
        e.preventDefault();
      };
      
      pinchStart = function(e){
        if (context.scalestart)
          context.scalestart(e)
        element.pinchdScale = element.pinchScale;
        element.pinchScale = e.scale;
        var evtPos = {clientX :e.centerX, clientY: e.centerY};
        element.pinchCenter = mouseToSvg(evtPos, context.root.node);
        e.preventDefault();
      };
      pinch = function(e){
        element.pinchdScale = e.scale/element.pinchScale;
        element.pinchScale = e.scale;
        context.zoom(element.pinchCenter.x, element.pinchCenter.y , null, element.pinchdScale);
        e.preventDefault();
        //console.log('pinch event in ' + context.name + ', scale: ' + e.scale);
      };
      
      pinchEnd = function(e){
        dScale = 1;
        element.pinchScale = null;
        e.preventDefault();
      };

      // bind mousedown event
      attachToEls.forEach(function(el) {
        // mousewheel
        el.node.addEventListener('mousemove', mouseMoveTracking); // other browsers
        el.node.addEventListener('DOMMouseScroll', mouseWheelScale); // firefox
        el.node.addEventListener('mousewheel', mouseWheelScale); // other browsers
        // pinch gesture
        PolymerGestures.addEventListener(el.node, 'pinchstart', pinchStart);
        PolymerGestures.addEventListener(el.node, 'pinch', pinch);
        PolymerGestures.addEventListener(el.node, 'pinchend', pinchEnd);
      });
      
      // disable scalable
      element.fixedScale = function() {
        attachToEls.forEach(function(el) {
          el.node.removeEventListener('mousemove', mouseMoveTracking);
          el.node.removeEventListener('DOMMouseScroll', mouseWheelScale);
          el.node.removeEventListener('mousewheel', mouseWheelScale);
          // pinch gesture
          PolymerGestures.removeEventListener(el.node, 'pinchstart', pinchStart);
          PolymerGestures.removeEventListener(el.node, 'pinch', pinch);
          PolymerGestures.removeEventListener(el.node, 'pinchend', pinchEnd);
        });
        
        pinch = pinchEnd = mouseWheelScale = mouseMoveTracking = null

        return element
      }
      
      return this
    }
    
  })

}).call(this);
'use strict'

// Obj.js library for dinamic created classes

// Class for self created objects, ObjJS is level 0 class
var ObjJS = function() {
  this.parentClass_ = Object.create(null);
};

ObjJS.prototype.create = function(classPrototype) {
  if (!classPrototype) {
    throw 'Must have a block protoype as argument'; 
    return;
  }
  if (!classPrototype.constructor) {
    classPrototype.constructor = function(){};
  }
  // create a class of self class
  var createdClass = function(){
    classPrototype.constructor.apply(this, arguments);
    delete this.create; // for cleaner tree
  };
  //createdClass.prototype = Object.create(this);
  createdClass.prototype = ObjJS.cloneObject(this);
  // extend createdClass with classPrototype
  ObjJS.mixin(createdClass, classPrototype, 'true');
  createdClass.prototype.create = ObjJS.prototype.create;
  createdClass.prototype.parentClass_ = this;
  return createdClass;
};

//Clone function extracted from closure library - base.js with some modifications
/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
ObjJS.cloneObject = function(obj) {
  var type = typeof(obj);
  if (obj == null) { // Null is an object in ES5, avoids all the function
    return null;
  }
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = ObjJS.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};

// Extend an existing class with a methods from an object - Mixin pattern
ObjJS.mixin = function(receivingClass, givingMixin, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, arguments[i])
          || override) {
        receivingClass.prototype[arguments[i]] = ObjJS.cloneObject(givingMixin[arguments[i]]);
      }
    }
  } else { //provide all methods
    for (var methodName in givingMixin) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)
          || override) {
        receivingClass.prototype[methodName] = ObjJS.cloneObject(givingMixin[methodName]);
      }
    }
  }
};

// Extend an existing class with a methods from an object - Mixin pattern
ObjJS.mixinObj = function(receivingObj, givingMixin, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingObj, arguments[i])
          || override) {
        receivingObj[arguments[i]] = ObjJS.cloneObject(givingMixin[arguments[i]]);
      }
    }
  } else { //provide all methods
    for (var methodName in givingMixin) {
      if (!Object.hasOwnProperty.call(receivingObj, methodName)
          || override) {
        receivingObj[methodName] = ObjJS.cloneObject(givingMixin[methodName]);
      }
    }
  }
};


// reserved for future use
/*
ObjJS.countElements = function(obj) {
  var i=0;
  for(el in obj){
    i++;
  }
  return i;
};
// Extend an existing class with a methods from another - Mixin pattern
ObjJS.mixinClasses = function(receivingClass, givingClass, override) {
  if (override == undefined) {
    override = false; // 'true' overrides elements
  }
  //only provide certain methods
  if (arguments[3]) {
    for (var i = 3, len = arguments.length; i < len; i++) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, arguments[i])
          || override) {
        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
      }
    }
  } else { //provide all methods
    for (var methodName in givingClass.prototype) {
      if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)
          || override) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
};
*/
// ------------- end of Obj.js library
/*
// useful functions 
// --- for svg coordenates

//function imported from blockly core : utils.js
/**
 * Convert between HTML coordinates and SVG coordinates.
 * @param {number} x X input coordinate.
 * @param {number} y Y input coordinate.
 * @param {boolean} toSvg True to convert to SVG coordinates.
 *     False to convert to mouse/HTML coordinates.
 * @return {!Object} Object with x and y properties in output coordinates.
 */
function convertCoordinates(x, y, toSvg, node) {
  if (toSvg) {
    x -= window.scrollX || window.pageXOffset;
    y -= window.scrollY || window.pageYOffset;
  }
  var svgPoint = node.createSVGPoint();
  svgPoint.x = x;
  svgPoint.y = y;
  var matrix = node.getScreenCTM();
  if (toSvg) {
    matrix = matrix.inverse();
  }
  var xy = svgPoint.matrixTransform(matrix);
  if (!toSvg) {
    xy.x += window.scrollX || window.pageXOffset;
    xy.y += window.scrollY || window.pageYOffset;
  }
  return xy;
};

//function imported from blockly core : utils.js
/**
 * Return the converted coordinates of the given mouse event.
 * The origin (0,0) is the top-left corner of the Blockly svg.
 * @param {!Event} e Mouse event.
 * @return {!Object} Object with .x and .y properties.
 */
function mouseToSvg(e, node) {
  
  var scrollX = window.scrollX || window.pageXOffset;
  var scrollY = window.scrollY || window.pageYOffset;
  return convertCoordinates(e.clientX + scrollX,
                                    e.clientY + scrollY, true, node);
};

// --- for textInput

function setCaretPosition(el, position) {
  el.selectionStart = position;
  el.selectionEnd = position;
  el.focus();
};

// getCaretPosition function not used now
/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
*/
/*
function getCaretPosition (oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus ();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange ();

    // Move selection start to 0 position
    oSel.moveStart ('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return (iCaretPos);
};
*/

function color2negative(hex) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    // Convert to decimal and converts to negative
    var rgb = "#",
        c;
    for (var i = 0; i < 3; ++i) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = (255 - c).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
};


// reserved for future use
/*
function disableSelect(el){			
    if(el.addEventListener){
        el.addEventListener("pointerdown",disabler,"false");
    } else {
        el.attachEvent("onselectstart",disabler);
    }
}
 
function enableSelect(el){
    if(el.addEventListener){
	el.removeEventListener("pointerdown",disabler,"false");
    } else {
        el.detachEvent("onselectstart",disabler);
    }
}
 
function disabler(e){
    if(e.preventDefault){ e.preventDefault(); }
    return false;
}
*/

'use strict'

// GLOBAL TODOs:
//  - All code documentation following JSDOC

// namespace for BBlocks (BB)
var BB = {};

// Component class, all core classes derivates of this.
//  This is an abstract Component class, don't instance this.
//  Create your own components using the Component API
//    Recomendation: only create components from scratch (created of this class)
//    if you want to do a very different thing that you can not to do with existing components
//    (workspaces, blocks and fields)
// Components that will be implemented (in order of priority)(TODO):
//  - Dropdown field
//  - Menu (for context menus and static menus)
//  - Dialog box
//  - Tab (for tabs handling)
//  - Anything awesome component :)
// TODO: documentation for Component API

BB.Component = ObjJS.prototype.create({
  constructor: function(type) {
    this.type = type;
    this.children = [];
    this.nested = false;
    this.level = 0; //level of nesting 0 - main Object
    this.absoluteRotation = 0;
    this.rotation = 0;
    this.offsetX = 0; // offset with the svg root
    this.offsetY = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
    this.rendered_ = false;
    this.initialized_ = false;
    this.selectable = false;
    this.selected_ = false;
    this.preserveChildsOnUnselect = false; // Don't unselect childs when unselect component
    this.selectedClass = '';
  },

  setSelected: function(bool) {
    if (this.selectable && this.selected_ != bool) { // performance optimization and avoids infinite loops
      this.selected_ = bool;
      if (this.selected_) {
        this.root.addClass(this.selectedClass);
        this.toTop();
        if (this.onSelect) {
          this.onSelect();
        }
      } else {
        this.root.removeClass(this.selectedClass);
        if (this.onBlur) {
          this.onBlur();
        }
        if (!this.preserveChildsOnUnselect) {
          this.unselectChilds();
        }
      }
      if (this.onSelectedChange) {
        this.onSelectedChange();
      }
      // Notify parent about this change
      if (this.parent) {
        if (this.selected_ && this.parent.childSelected) {
          this.parent.childSelected(this);
        }
        if (!this.selected_ && this.parent.childUnselected) {
          this.parent.childUnselected(this);
        }
      }
    }
  },

  childSelected: function(child) {
    this.setSelected(true);
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      // unselect all childrens except 'child'
      if (this.children[i] != child && this.children[i].setSelected) {
        this.children[i].setSelected(false);
      }
    }
  },

  unselectChilds: function() {
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      if (this.children[i].setSelected) {
        this.children[i].setSelected(false);
      }
    }
  },

  addWorkspace: function(name, workspacePrototype, options) {
    // generate the block object
    //var workspace = this.createWorkspace(name, workspacePrototype);
    return this.addWorkspace_(new BB.Workspace(name, workspacePrototype, this, options));
  },
  addWorkspace_: function(workspace) {
    if (this.type == 'Block') {
      throw 'Blocks can\'t have Workspaces attached';
      return; //blocks can't have Workspaces attached
    }
    this.children.push(workspace);
    this.children[this.children.length-1].level = this.level + 1;
    this.children[this.children.length-1].parent = this;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length-1]); //callback
    }
    return this.children[this.children.length-1];
  }, 

  addBlock: function(name, blockPrototype, options) {
    // generate the block object
    var block = this.createBlock(name, blockPrototype);
    return this.addBlock_(new block(options));
  },
  addBlock_: function(block) {
    if (block.type != 'Block') {
      throw 'The type of object must be Block';
      return;
    }
    this.children.push(block);
    block.workspace = this;
    block.parent = this;
    block.absoluteRotation = block.absoluteRotation + this.absoluteRotation;
    if (this.childAdded) {
      this.childAdded(this.children[this.children.length-1]); //callback
    }
    return this.children[this.children.length-1];
  },
  // create a block object from a protoype
  createBlock: function(name, blockPrototype) {
    if (!blockPrototype) {
      throw 'Must have a block protoype as argument';
      return;
    }
    if (!blockPrototype.init) {
      throw 'Block protoype must have a init function';
      return;
    }
    // Add a constructor to prototype
    blockPrototype.constructor = function(options){
      BB.Block.call(this, name, options);
    };
    var block = BB.Block.prototype.create(blockPrototype);
    return block;
  },
  //this object to top of this parent Workspace
  toTop: function() {
    if (this.nested) {
      this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
    }
  },
  //this object to top of this parent Workspace and all parents
  toTopPropagate: function() {
    var obj = this;
    if (this.nested) {
      this.workspace.childContainer.node.appendChild(this.container.node); // this in top of SVG
      while (obj.workspace.nested) { //parents in top of our respectives SVGs
        obj = obj.workspace;
        obj.workspace.childContainer.node.appendChild(obj.container.node);
      }
    }
  },
  // Facades for svg functions
  rotate: function(rotation) {
    if (this.container) { // main Workspaces don't have container
      var dRotation = rotation - this.rotation;
      var bbox = this.container.bbox();
      this.rotation = rotation;
      this.notifyRotation(dRotation);
      return this.container.rotate(rotation, bbox.x + this.width/2 + this.offsetX,
                            bbox.y + this.height/2 + this.offsetY);
    }
  },
  // Notify all childrens
  notifyRotation: function(dRotation) {
    this.absoluteRotation += dRotation; // set absoluteScale to svg.js context for pannable elements
    this.children.forEach(function(el) {
      if (el.notifyRotation) {
        el.notifyRotation(dRotation);
      }
    });
  },
  move: function(x, y) {
    if (this.container) { // main Workspaces don't have container
      this.x = x;
      this.y = y;
      this.container.move(this.x, this.y);
      return this;
    } else {
      throw "Main Workspaces don't have container";
    }
  },
  dmove: function(dx, dy) {
    if (this.container) { // main Workspaces don't have container
      this.x += dx;
      this.y += dy; 
      this.container.dmove(dx, dy);
      return this;
    } else {
      throw "Main Workspaces don't have container";
    }
  },
  animate: function() {
    if (this.container) { // main Workspaces don't have container
      return this.container.animate.apply(this.container, arguments);
    } else {
      throw "Main Workspaces don't have container";
    }
  },

  updateRender: function() {
    this.unRender();
    this.render();
  },
  unRender: function() {
    var i, len = this.children.length;
    for (i = 0; i < len; i++) {
      if (this.children[i].unRender) {
        this.children[i].unRender();
      }
    }
    if (this.onUnRender) {
      this.onUnRender();
    }
    if (this.container) {
      this.container.remove();
    } else {
      this.root.remove();
    }
    this.rendered_ = false;
  }
});

// attach a event handler to an array of svg.js elements
BB.attachToEls = function(els, eventName, func) {
  var i;
  var len = els.length;
  for (i = 0; i < len; i++) {
    PolymerGestures.removeEventListener(els[i].node, eventName, func);
    PolymerGestures.addEventListener(els[i].node, eventName, func);
  }
};
//default palettes

BB.colorPalettes = {
  workspace: {
    light: {
      background: {
        nested: '#EDEEEA',
        main: '#fff'
      },
      border: {
        nested: '#1B65A6',
		main: '#ddd'
      },
      dragBoxColor: '#369E58',
      resizeBoxColor: '#F0A509'
    },
    dark: {
      background: {
        nested: '#F2F2F2',
        main: '#222222'
      },
      border: {
        nested: '#1ABC9C',
        main: '#ddd'
      },
      dragBoxColor: '#369E58',
      resizeBoxColor: '#F0A509'
    }
  },
  block: {
    light: {
      background: '#1DA53C',
      border: '#000',
      shadowColor: 'rgba(29, 95, 44, 0.75)',
      lightColor: 'rgb(70, 204, 101)'
    },
    dark: {
      background: '#14925C',
      border: '#fff',
      shadowColor: 'rgba(20, 146, 92, 0.81)',
      lightColor: '#25c17e'
    }
  }
};
'use strict'

// A Block is an svg group that do any behavior, this can contain Fields or other Blocks.
//  This is an abstract Block class, don't instance this.
//  All block prototypes live in blocks folder or create your own using the Block API
//  Block can be instantiable from workspaces with addBlock method, see the basic-demo
// TODOs:
//  - delete a block with remove method and delete key when selected (methods and animation).
//  - documentation for Block API

BB.Block = BB.Component.prototype.create({
  constructor: function(name, options, customOptions)  {
    BB.Component.prototype.constructor.call(this, 'Block');
    this.name = name;
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.width = 20;
    this.height = 20;
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.statement = true;
    this.root = null;
    this.nested = true; // Blocks are nested by default, allows toTopPropagate
    this.fields = [];
    this.attachDraggable = [];
    this.style = {
      className: 'BBComponentBlock'
    };
    this.selectedClass = 'BBComponentBlockSelected';
    // Capabilities of block
    this.selectable = true;
    this.draggable_ = true;
    this.disabled_ = false;
    
    this.metrics = {
      borderRadius: 2,
      borderWidth: 1,
      initialSpace: {x: 4, y: 4},
      finalSpace: {x: 4, y: 4},
      fieldSpace: 5,
      topRowSpace: 1.25,
      bottomRowSpace: 1.25,
      widthType: 'globalWidth',
    };

    // Options
    if (customOptions) { //options of a custom blocks
      this.customOptions = customOptions;
    }
    
    if (!options) {
      return;
    }
    // TODO: Implement validation for options
    this.optionList = ['x',
                       'y',
                       'stylingFunction',
                       'colorPalette',
                       'metrics',
                       'selectable'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options.hasOwnProperty(el)) {
        this[el] = options[el];
      }
    }
    if (options.hasOwnProperty('draggable')) {
      this.draggable_ = options.draggable;
    }
    if (options.hasOwnProperty('selected')) {
      this.selected_ = options.selected;
    }
    if (options.hasOwnProperty('disabled')) {
      this.disabled_ = options.disabled;
    }
    if (options.render) {
      this.render();
    }
  },

  appendField: function(field) {
    field.index = this.fields.length;
    this.fields.push(field);
    return field;
  },

  newRow: function() {
      this.fields.push('newRow');
  },

  widthType: function(type) {
    if (type == 'grouped') {
      this.fields.push('groupedWidth');
    } else if (type == 'global') {
      this.fields.push('globalWidth');
    } else if (type == 'single') {
      this.fields.push('singleWidth');
    } else {
      throw 'Unknown width type';
    }
  },

  render: function() {
    if (!this.workspace) {
      throw 'Blocks must have a workspace to be rendered';
      return;
    }
    if (!this.rendered_) {
      if (!this.colorPalette) {
        this.colorPalette = BB.colorPalettes.block.light; //default palette
      }
      // styling
      this.bgColor = this.colorPalette.background;
      this.borderColor = this.colorPalette.border;
      if (this.stylingFunction) {
        this.stylingFunction();
      }
      if (!this.initialized_) {
        this.init(this.customOptions); // attributes of custom Block
        this.initialized_ = true;
      } else {
        this.root.remove();
      }
      //needs create container before initSVG, because it render the fields
      this.container = this.workspace.root.group();
      this.container.move(this.x, this.y);
      this.initSvg(); // compute graphics for rendering
      //render block - render fields and all block svg
      this.renderBlock_();
      // render children
      this.childContainer = this.workspace.root.group(); 
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].render();
        this.childContainer.add(this.children[i].container);
      }
      this.container.add(this.root);
      this.container.add(this.childContainer);
      // add fields to top of container
      for (var i = 0; i < this.fields.length; i++) {
        if (typeof(this.fields[i]) == 'object') {
          this.fields[i].toTop();
        }
      }
      this.attachDraggable.push(this.root);
      this.updateDraggable();
      this.workspace.childContainer.add(this.container);
      this.workspace.childRendered(this);
      if (this.attach) {
        this.attach(); // attach additional svg elements to block
      }
      if (this.selected_) {
        this.root.addClass(this.selectedClass);
      } else {
        this.root.removeClass(this.selectedClass);
      }
      if (this.disabled_) {
        this.root.fill(this.workspace.style.blockDisabledPattern);
      } else {
        this.root.fill(this.bgColor);
      }
      this.rendered_ = true;
    }
  },

  attachEvents: function(child) {
    this.attachDraggable.push(child);
    this.container.draggable(this.workspace, null, this.attachDraggable);
  },

  updateDraggable: function() {
    // Prevents text selection and default behavior
    var this_ = this;
    if (this.toTopClosure == undefined) {
      this.pereventDefaultClosure = function(e) {
        e.preventDefault();
        e.stopPropagation();
      };
    }
    BB.attachToEls(this.attachDraggable, 'down', this.pereventDefaultClosure);
    if (this.draggable_) {
      this.container.draggable(this, null, this.attachDraggable);
    } else if (this.rendered_) {
      this.container.fixedDrag(); // Remove dragging from container
    }
    if (this.toTopClosure == undefined) {
      this.toTopClosure = function(e) {
        //console.log(this_.name + ' down');
        this_.setSelected(true);
        e.preventDefault();
        e.stopPropagation();
      };
    }
    BB.attachToEls(this.attachDraggable, 'down', this.toTopClosure);
  },

  dragstart: function() {
    this.root.addClass('BBComponentBlockDragging');
  },

  dragend: function() {
    this.root.removeClass('BBComponentBlockDragging');
  },

  setDraggable: function(bool) {
    this.draggable_ = bool;
    if (this.rendered_) {
      this.updateDraggable();
    }
  },

  // calculate metrics ,render fields if not are rendered or if rendered adds
  initSvg: function() {
    var globalWidth = this.metrics.initialSpace.x, box, maxHeight = 0;
    var metrics = {
      width: this.metrics.initialSpace.x,
      y: this.metrics.initialSpace.y
    };
    this.metrics.rows = [];
    this.metrics.numRows = 0;
    var topRowSpace = 0;
    var bottomRowSpace = this.metrics.bottomRowSpace;
    for (var i = 0; i < this.fields.length; i++) {
      if (typeof(this.fields[i]) == 'string') { //field control commands
        switch (this.fields[i]) {
            case 'newRow':
              metrics.y += maxHeight + bottomRowSpace + topRowSpace;
              metrics.width  += this.metrics.finalSpace.x - this.metrics.fieldSpace;
              this.metrics.rows[this.metrics.numRows] = {
                width: metrics.width,
                y: metrics.y,
                height: maxHeight + bottomRowSpace + topRowSpace,
                widthType: this.metrics.widthType
              };
              this.metrics.numRows++;
              topRowSpace = this.metrics.topRowSpace;
              globalWidth = Math.max(metrics.width, globalWidth);
              metrics.width = this.metrics.initialSpace.x;
              maxHeight = 0;
              break;
            case 'globalWidth':
              this.metrics.widthType = 'globalWidth';
              break;
            case 'groupedWidth':
              this.metrics.widthType = 'groupedWidth';
              break;
            case 'singleWidth':
              this.metrics.widthType = 'singleWidth';
              break;
            default:
            throw 'Unknown width type';
        }
      } else {
        // updates incrementally metrics for dinamic fields rendering
        this.metrics.rows[this.metrics.numRows] = {
          width: metrics.width,
          y: metrics.y,
          height: maxHeight + bottomRowSpace + topRowSpace,
          widthType: this.metrics.widthType
        };
        this.fields[i].row = this.metrics.numRows;
        if (this.fields[i].rendered_) {
          this.container.add(this.fields[i].container);
        } else {
          this.fields[i].render();
        }
        box = this.fields[i].bbox();
        this.fields[i].container.move(metrics.width, metrics.y + bottomRowSpace + topRowSpace); // positions the field
        metrics.width += box.width + this.metrics.fieldSpace;
        maxHeight = Math.max(maxHeight, box.height + bottomRowSpace + topRowSpace);
      }
    }
    metrics.width += this.metrics.finalSpace.x - this.metrics.fieldSpace;
    globalWidth = Math.max(metrics.width, globalWidth);
    metrics.y += box.height + bottomRowSpace + topRowSpace + this.metrics.finalSpace.y;
    this.metrics.rows.push({
      width: metrics.width,
      y: metrics.y,
      height: maxHeight,
      widthType: this.metrics.widthType
    });
    this.width = globalWidth;
    this.height = metrics.y;
    // compute widths
    var i, j, groupFound = false, maxWidth;
    for (i = 0; i < this.metrics.rows.length; i++) {
      if (this.metrics.rows[i].widthType == 'groupedWidth') {
        if (groupFound == false) {
          maxWidth = this.metrics.rows[i].width;
          for (j=i+1;j<this.metrics.rows.length && this.metrics.rows[j].widthType == 'groupedWidth'; j++) {
            maxWidth = Math.max(maxWidth, this.metrics.rows[j].width);
          }
          groupFound = true;
        }
        this.metrics.rows[i].width = maxWidth; // uniforms width
      } else {
         if (this.metrics.rows[i].widthType == 'globalWidth') {
           this.metrics.rows[i].width = this.width; // global width
         }
         groupFound = false;
      }
    }
    // compute heights
    var height, lastWidth = this.metrics.rows[0].width;
    this.metrics.rows[0].lastRadius = 'plane';
    for (i = 1; i < this.metrics.rows.length; i++) {
      height = this.metrics.rows[i].height;
      if (lastWidth < this.metrics.rows[i].width) {
        this.metrics.rows[i].lastRadius = 'convex';
        this.metrics.rows[i-1].nextRadius = 'concave';
      }else if (lastWidth > this.metrics.rows[i].width) {
        this.metrics.rows[i].lastRadius = 'concave';
        this.metrics.rows[i-1].nextRadius = 'convex';
      } else {
        this.metrics.rows[i].lastRadius = 'plane';
        this.metrics.rows[i-1].nextRadius = 'plane';
      }
      lastWidth = this.metrics.rows[i].width;
    }
    this.metrics.rows[this.metrics.rows.length-1].nextRadius = 'convex';
  },

  //renders the block root
  renderBlock_: function() {
    //TODO: block root must be a group
    var radius = this.metrics.borderRadius; // for typing
    var rowSpace = this.metrics.rowSpace; // for typing
    if (!this.root) {
      this.root = this.container.path();
    } else {
      this.root.clear(); // if rendered clear and update segments
    }
    this.root.M({x: radius, y: this.height})
                .q({x: -radius, y: 0}, {x: -radius, y: -radius})
                .v(-this.height + 2*radius) // left side
                .q({x: 0, y: -radius}, {x: radius, y: -radius});
    // top
    var row = this.metrics.rows[0]; //for typing
    var height = row.y;
    height -= radius;
    //first row
    this.root.H(row.width - radius)
              .q({x: radius, y: 0}, {x: radius, y: radius});
    //render by row rigth line - middle
    for (var i = 1; i < this.metrics.rows.length ; i++) {
      row = this.metrics.rows[i];
      height = row.y;
      height -= radius;
      if (row.lastRadius == 'convex') {
        this.root.q({x: 0, y: radius}, {x: radius, y: radius})
                 .H(row.width - radius)
                 .q({x: radius, y: 0}, {x: radius, y: radius})
                 .V(height);
      } else if (row.lastRadius == 'concave') {
        this.root.q({x: 0, y: radius}, {x: -radius, y: radius})
                 .H(row.width + radius)
                 .q({x: -radius, y: 0}, {x: -radius, y: radius})
                 .V(height);
      } else if (row.lastRadius == 'plane') {
        this.root.V(height);
      } else {
        throw 'Unsopported type of radius: ' + row.lastRadius;
      }
    }
    var finalRow = this.metrics.rows[this.metrics.rows.length - 1]; //for typing
    var finalWidth = finalRow.width;
    // bottom line
    this.root.q({x: 0, y: radius}, {x: -radius, y: radius})
             .h(-finalWidth + 2*radius).Z();
             // TODO: report border bug in svg, when drag a block with black border, this project dont use that, use svg rect
    // this bug is resolved in chromium 44, TODO: test in chrome 42
             /*.stroke({ color: this.borderColor,
                       opacity: 1,
                       width: this.metrics.borderWidth
              }).fill(this.bgColor);*/
    this.root.fill(this.bgColor);
    this.root.addClass(this.style.className);
  },

  setColor: function(color) {
    this.bgColor = color;
    if (this.rendered_) {
      this.root.fill(color);
    }
  },
  setDisabled: function(bool) {
    this.disabled_ = bool;
    if (this.rendered_) {
      if (this.disabled_) {
        this.root.fill(this.workspace.style.blockDisabledPattern);
      } else {
        this.root.fill(this.bgColor);
      }
    }
  },

  fieldChanged: function(index) {
    // Redraw path
    this.initSvg();
    this.renderBlock_();
  },

  onBlur: function() { // Unselect all fields
    var i, len = this.fields.length;
    for (i = 0; i < len; i++) {
      if (typeof(this.fields[i]) == 'object' && this.fields[i].setSelected) {
        this.fields[i].setSelected(false);
      }
    }
  },
  onUnRender: function() {
    var i, len = this.fields.length;
    for (i = 0; i < len; i++) {
      if (this.fields[i].unRender) {
        this.fields[i].unRender();
      }
    }
  }
});

'use strict'

// A Workspace is an SVG document that can contain Blocks, Workspaces and Fields.
//  This is an abstract Workspace class, don't instance this.
//  All instantiable workspaces live in workspaces folder or create your own using the Workspace API
// TODOs:
//  - scrolling of workspaces
//  - trash (after allows blocks to be removed)
//  - documentation for Workspace API

BB.Workspace = BB.Component.prototype.create({
  constructor: function(name, workspacePrototype, workspace, options) {
    BB.Component.prototype.constructor.call(this, 'Workspace');
    this.name = name;
    this.title = '';
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = 0;
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all childrens
    this.absoluteScale = 1;
    this.scale = 1;
    this.absoluteRotation = 0;
    this.rotation = 0;
    this.border = null;
    this.background = null;
    this.dragBox = null;
    this.resizeBox = null;
    this.scaleSpeed = 1.2;
    this.minScale = 0.3;
    this.maxScale = 10;
    this.offsetX = 0; // offset with the svg root
    this.offsetY = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
    this.centerOffsetX = 0;
    this.centerOffsetY = 0;
    this.pannable = true;
    this.selectable = true;
    this.attachedElements = [];
    this.style = {
      className: 'BBComponentWorkspace'
    };
    if (!workspace) {
      return;
    }
    this.workspace = workspace;
    if (workspacePrototype) {
      ObjJS.mixinObj(this, workspacePrototype, 'true');
    }
    // options
    if (!options) {
    // default options
      return;
    }
    // TODO: Implement validation for options
    this.optionList = ['x',
                       'y',
                       'width',
                       'height',
                       'stylingFunction',
                       'colorPalette',
                       'metrics',
                       'selectable',
                       'title',
                       'preserveChildsOnSelect'];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options[el]) {
        this[el] = options[el];
      }
    }
    if (options.pannable != undefined) {
      this.pannable = pannable;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function() {
    if (!this.workspace) {
      throw 'Workspace must have a div identifier or other workspace for be rendered';
    }
    if (!this.rendered_) {
      // allows nested workspaces
      this.nested =!(typeof(this.workspace) === 'string');
      if (this.nested) {
        this.container = this.workspace.root.group();
        this.container.move(this.x, this.y); //position of nested workspace
        this.root = this.container.nested();
        this.root.size(this.width, this.height);
      } else {
        this.root = SVG(this.workspace).fixSubPixelOffset();
        this.root.size('100%', '100%');
        this.width = '100%';
        this.height = '100%';
      }
      this.style.blockDisabledPattern = this.root.pattern(10, 10, function(add) {
        add.rect(10,10).fill('#aaa')
        add.path('M 0 0 L 10 10 M 10 0 L 0 10').stroke('#cc0')
      });
      if (!this.colorPalette) {
        this.colorPalette = BB.colorPalettes.workspace.light; //default palette
      }
      // styling
      this.bgColor = this.colorPalette.background[this.nested ? 'nested' : 'main'];
      // render elements
      this.background = this.root.rect(this.width, this.height).fill(this.bgColor);
      this.root.attr('style', 'overflow: hidden;'); // hide content out of workspace in nested workspaces
      this.childContainer = this.root.group();
      //this.text = this.root.text(this.level + ''); //TODO: add this to WorkspaceBasic like an example of how attach elements manually
      //this.text = this.root.text(this.name + ' ( level: ' + this.level + ')'); // for debugging
      /*this.children.push({container: this.text,
                          move: function(x,y){this.container.move(x,y)}
                         });
      this.childContainer.add(this.text);*/
      for (var i = 0; i < this.children.length; i++) {
        if (!this.children[i].rendered && this.children[i].render) {
          this.children[i].render();
        }
      }
      if (this.nested) {
        this.workspace.childContainer.add(this.container);
      }
      this.attachPannable = [this.background];//, this.text];
      if (this.pannable) {
        this.childContainer.pannable(this, null, this.attachPannable, [this.childContainer]);
      }
      if (this.init) {
        this.attachedElements = this.init();
        if (this.workspace) { // attached elements can scale his workspace
          var i, len = this.attachedElements.length;
          for (i = 0; i < len; i++) {
            this.attachedElements[i].scalable(this.workspace, this.attachedElements);
          }
        }
      }
      if (this.stylingFunction) {
        this.stylingFunction();
      }
      // unselect all childrens when pointerdown
      var this_ = this;
      BB.attachToEls(this.attachPannable, 'down', function() {
        this_.setSelected(true);
        this_.unselectChilds();
      });
      // attached elements selects workspace
      BB.attachToEls(this.attachedElements, 'down', function() {
        this_.setSelected(true);
      });
      this.attachScalable = [this.background];//, this.text];
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].type == 'Block') {
          this.attachScalable.push(this.children[i]);
        }
      };
      this.childContainer.scalable(this, null, this.attachScalable);
      this.rendered_ = true;
    }
    return this;
  },

  childRendered: function(child) {
    if (child.type == 'Block') {
      this.attachScalable.push(child.container);
      this.childContainer.scalable(this, null, this.attachScalable);
    }
  },

  toScale: function(scale) {
    var fScale = scale/this.scale;
    this.childContainer.scale(scale);
    this.scale = scale;
    this.notifyScaling(fScale);
  },
  // Notify all childrens
  notifyScaling: function(fScale) {
    // set absoluteScale to svg.js context for pannable elements
    this.children.forEach(function(el) {
      if (el.type == 'Workspace') { //only notify the workspaces
        el.absoluteScale *= fScale;
        el.notifyScaling(fScale);
      }
    });
  },

  resize: function(width, height) {
    this.width = width;
    this.height = height;
    this.root.size(width, height);
    this.background.size(width, height);
    if (this.onResize) {
      this.onResize(width, height);
    }
  },
  setWidth: function(width) {
    this.width = width;
    this.root.width(width);
    this.background.width(width);
    if (this.onWidthChanged) {
      this.onWidthChanged(width);
    }
  },
  setHeight: function(height) {
    this.height = height;
    this.root.height(height);
    this.background.height(height);
    if (this.onHeightChanged) {
      this.onHeightChanged(height);
    }
  },
  /**
   * Zooming the workspace centered in (x,y) coordinate with zooming in or out.
   * @param {!number} x X coordinate of center.
   * @param {!number} Y coordinate of center.
   * @param {!number} type Type of zomming (-1 zooming out and 1 zooming in).
   */
  zoom: function(x ,y , type, delta) {
    var speed = this.scaleSpeed, dScale;
    var center = this.root.node.createSVGPoint();
    center.x = x;
    center.y = y;
    center = center.matrixTransform(this.childContainer.node.getCTM().inverse());
    var x = center.x;
    var y = center.y;
    // scale factor
    if (delta){
      dScale = delta;
    } else {
      dScale = (type == 1)?speed:1/speed;
    }
    var matrix = this.childContainer.node.getCTM().translate(-(x*(dScale-1)),-(y*(dScale-1))).scale(dScale);
    // validate if scale is in a valid range
    if (matrix.a >= this.minScale && matrix.a <= this.maxScale) {
      this.toScale(matrix.a);
      this.childContainer.move(matrix.e, matrix.f);
    }
  },
});
'use strict'

// Fields are elements of blocks
//  This is an abstract Field class, don't instance this.
//  All instantiable fields live in fields folder or create your own using the Field API
// TODO: documentation for Field API

BB.Field = BB.Component.prototype.create({
  constructor: function(type){
    BB.Component.prototype.constructor.call(this, type);
    this.rendered_ = false;
    this.index_ = null; // index of field in it parent
  },

// get viewbox of element, override this if is necesary
  bbox: function(type){
    if (this.rendered_) {
      return this.container.bbox();
    } else {
      throw 'Only rendered fields have a container';
    }
  },

// this field to top of this parent
  toTop: function() {
    if (this.parent) {
      this.parent.container.node.appendChild(this.container.node); // this in top of parent
    }
  }
});
'use strict'

// A basic workspace implementation that shows how create workspaces, this is instantiable.
BB.WorkspaceBasic = {
  init: function() {
    // render aditional elements
    this.borderColor = this.colorPalette.border[this.nested ? 'nested' : 'main'];
    if (this.nested) {
      this.dragBoxColor = this.colorPalette.dragBoxColor;
      this.resizeBoxColor = this.colorPalette.resizeBoxColor;
      this.dragBox = this.workspace.root.rect(200, 30)
                         .stroke({ color: '#000', opacity: 0.4, width: 2 })
                         .fill(this.borderColor).radius(1).move(-5, -25);
      this.titleRoot = this.workspace.root.text(this.title).font({size: 20}).fill('#fff').move(0, -25);
      this.resizeButton = this.workspace.root.image(this.imageArrowBase64)
                            .opacity(1)
                            .size(20, 20).move(170, -20);
      this.resizeBox = this.workspace.root.rect(10, 10)
                         .stroke({ color: this.borderColor, opacity: 1, width: 1 })
                         .fill(this.resizeBoxColor).radius(1).move(this.width-5, this.height-5).rotate(45);
      this.resizeArrows = this.workspace.root.image(this.imageArrowBase64)
                            .opacity(0.5)
                            .size(50, 50).move(this.width-25, this.height-25);
      this.borderShadow = this.workspace.root.rect(this.width, this.height).fill('none').radius(5);
      this.border = this.workspace.root.rect(this.width, this.height)
                      .stroke({ color: this.borderColor, opacity: 1, width: 4 }).fill('none').radius(5);
      this.hideResizeControls();
      this.container.add(this.borderShadow);
      this.container.add(this.border);
      this.container.add(this.dragBox);
      this.container.add(this.titleRoot);
      this.container.add(this.resizeButton);
      this.container.add(this.resizeBox);
      this.container.add(this.resizeArrows);
      this.borderShadow.addClass(this.style.className);
      var this_ = this;
      PolymerGestures.addEventListener(this.resizeButton.node, 'down', function(e) {
        if (this_.resizeControls_) {
          this_.hideResizeControls();
        } else {
          this_.showResizeControls();
        }
        e.preventDefault();
        e.stopPropagation();
      });
      this.container.draggable(this, null, [this.dragBox, this.titleRoot, this.border, this.borderShadow]);
      this.container.resizable(this, null, [this.resizeBox, this.resizeArrows]);
      var bbox = this.container.bbox();
      this.offsetX = this.x - bbox.x;
      this.offsetY = this.y - bbox.y;
      this.offsetX2 = this.x + this.height + this.offsetX - bbox.x2;
      this.offsetY2 = this.y + this.width + this.offsetY - bbox.y2;
    } else {
      this.root.attr('style', 'border: 1px solid ' + this.borderColor + ';');
    }
    return (this.nested) ? [this.dragBox, this.titleRoot, this.resizeButton, this.border, this.resizeBox, this.resizeArrows, this.borderShadow] : [];
  },

  showResizeControls: function() {
    this.resizeBox.show();
    this.resizeArrows.show();
    this.resizeControls_ = true;
  },
  hideResizeControls: function() {
    this.resizeBox.hide();
    this.resizeArrows.hide();
    this.resizeControls_ = false;
  },

  onBlur: function() {
    this.hideResizeControls();
  },
  onResize: function(width, height) {
    this.border.size(width, height);
    this.borderShadow.size(width, height);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).move(this.width-5, this.height-5).rotate(45);
      this.resizeArrows.move(this.width-5, this.height-25);
    }
  },
  onWidthChanged: function(width) {
    this.border.width(width);
    this.borderShadow.width(width);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).x(this.width-5).rotate(45);
      this.resizeArrows.x(this.width-25);
    }
  },
  onHeightChanged: function(height) {
    this.border.height(height);
    this.borderShadow.height(height);
    if (this.resizeControls_) {
      this.resizeBox.rotate(0).y(this.height-5).rotate(45);
      this.resizeArrows.y(this.height-25);
    }
  },
  imageArrowBase64: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIzLjY1IDIzLjY1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMy42NSAyMy42NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMC41ODcsMC4wNTdsNi41MjksMC42MjFjMCwwLDAuODY5LTAuMDI3LDAuMzgzLDAuNDU3QzcuMDExLDEuNjI0LDUuODMzLDIuODAxLDUuODMzLDIuODAxUzYuMTIsMy4wOSw2LjU2MywzLjUyNmMxLjI1NCwxLjI1OCwzLjUzOSwzLjU0Myw0LjQ2OSw0LjQ3M2MwLDAsMC4zMTgsMC4xODktMC4wNjQsMC41N2MtMC4zODMsMC4zODctMi4wNzIsMi4wNjgtMi4zNDYsMi4zNDRjLTAuMjY4LDAuMjczLTAuNDc1LDAuMDU3LTAuNDc1LDAuMDU3Yy0wLjkwNC0wLjkwNC0zLjI3LTMuMjY2LTQuNDg0LTQuNDgyQzMuMjcxLDYuMDkyLDMuMDE1LDUuODM1LDMuMDE1LDUuODM1UzIuMDY3LDYuNzgsMS40NzQsNy4zNzRjLTAuNTksMC41OTItMC41ODgtMC4yOTktMC41ODgtMC4yOTlTMC4wNjIsMS4yMjUsMC4wNjIsMC41MkMwLjA2MiwwLjAxNiwwLjU4NywwLjA1NywwLjU4NywwLjA1N3oiLz48cGF0aCBzdHlsZT0iZmlsbDojMDMwMTA0OyIgZD0iTTIzLjEyMiwyMy42MDhsLTYuNTIzLTAuNjIxYzAsMC0wLjg3MSwwLjAyNS0wLjM4Ny0wLjQ2MWMwLjQ4Ni0wLjQ4NCwxLjY2Ni0xLjY2NiwxLjY2Ni0xLjY2NnMtMC4yODctMC4yODUtMC43MjctMC43MjNjLTEuMjU2LTEuMjYtMy41NDEtMy41NDMtNC40NzEtNC40NzljMCwwLTAuMzIyLTAuMTgsMC4wNjItMC41NjRzMi4wNy0yLjA3LDIuMzQ2LTIuMzQ0YzAuMjcxLTAuMjc1LDAuNDc3LTAuMDU5LDAuNDc3LTAuMDU5YzAuOTAyLDAuOTA2LDMuMjcsMy4yNyw0LjQ4Miw0LjQ4MmMwLjM5MywwLjM5NSwwLjY1LDAuNjU0LDAuNjUsMC42NTRzMC45NDktMC45NDcsMS41NDEtMS41NDFjMC41OS0wLjU5MiwwLjU5LDAuMzAxLDAuNTksMC4zMDFzMC44MjIsNS44NTQsMC44MjIsNi41NDlDMjMuNjUxLDIzLjY0NywyMy4xMjIsMjMuNjA4LDIzLjEyMiwyMy42MDh6Ii8+PHBhdGggc3R5bGU9ImZpbGw6IzAzMDEwNDsiIGQ9Ik0wLjAwMSwyMy4wOTRsMC42MTUtNi41MzFjMCwwLTAuMDIzLTAuODY5LDAuNDY1LTAuMzgzYzAuNDg0LDAuNDg2LDEuNjY0LDEuNjY4LDEuNjY0LDEuNjY4UzMuMDMsMTcuNTYxLDMuNDcsMTcuMTJjMS4yNTYtMS4yNTYsMy41NDEtMy41NDEsNC40NzUtNC40NzVjMCwwLDAuMTg0LTAuMzE2LDAuNTY4LDAuMDY2YzAuMzgzLDAuMzg3LDIuMDcsMi4wNzIsMi4zNDQsMi4zNDZjMC4yNzMsMC4yNzEsMC4wNTUsMC40NzcsMC4wNTUsMC40NzdjLTAuOTA2LDAuOTA0LTMuMjY2LDMuMjctNC40OCw0LjQ4NmMtMC4zOTUsMC4zOTMtMC42NTIsMC42NDgtMC42NTIsMC42NDhzMC45NDUsMC45NDcsMS41MzcsMS41MzdjMC41OTIsMC41OTQtMC4yOTcsMC41OS0wLjI5NywwLjU5cy01Ljg1LDAuODI0LTYuNTUxLDAuODI0Qy0wLjA0MiwyMy42MiwwLjAwMSwyMy4wOTQsMC4wMDEsMjMuMDk0eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMjMuNTUyLDAuNTU3bC0wLjYxNSw2LjUyOWMwLDAsMC4wMjMsMC44NjktMC40NjEsMC4zODNjLTAuNDktMC40OS0xLjY2OC0xLjY2NC0xLjY2OC0xLjY2NHMtMC4yODYsMC4yODYtMC43MjUsMC43MjVjLTEuMjU2LDEuMjU2LTMuNTQzLDMuNTQxLTQuNDc1LDQuNDczYzAsMC0wLjE4NCwwLjMxOC0wLjU2OC0wLjA2NnMtMi4wNjgtMi4wNjYtMi4zNDYtMi4zNGMtMC4yNy0wLjI3OS0wLjA1Ny0wLjQ4Mi0wLjA1Ny0wLjQ4MmMwLjkwNi0wLjkwNCwzLjI3LTMuMjY4LDQuNDg0LTQuNDhjMC4zOTYtMC4zOTUsMC42NS0wLjY1MiwwLjY1LTAuNjUycy0wLjk0My0wLjk0NS0xLjUzNy0xLjUzOWMtMC41OTItMC41OTIsMC4yOTktMC41ODYsMC4yOTktMC41ODZzNS44NDktMC44MjgsNi41NTItMC44MjhDMjMuNTk1LDAuMDMsMjMuNTUyLDAuNTU3LDIzLjU1MiwwLjU1N3oiLz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+'
};
'use strict'

// Field svg (a field that contains a pure svg)

// TODOs:
//  - add margins

BB.FieldSvg = BB.Field.prototype.create({
  constructor: function(svg, parent, options)  {
    BB.Field.prototype.constructor.call(this, 'Svg');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    if (svg && typeof(svg) == 'object') {
      this.svg = svg;
    } else {
      throw 'Svg must be a valid SVG.js object';
      return;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldSvg must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.group();
      this.container.add(this.svg);
    }
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
    }
    this.rendered_ = true;
  }
});
'use strict'

// Field text

BB.FieldText = BB.Field.prototype.create({
  constructor: function(text, parent, options)  {
    BB.Field.prototype.constructor.call(this, 'Text');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#fff';
    this.size = 15; // px default metrics in svg.js library
    if (text && typeof(text) == 'string') {
      this.text = text;
    } else {
      throw 'Text must be a valid string';
      return;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.fontColor) {
      this.fontColor = options.fontColor;
    }
    if (options.fontFamily) {
      this.fontFamily = options.fontFamily;
    }
    if (options.fontSize) {
      this.fontSize = options.fontSize;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldText must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor)
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
    }
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
    }
    this.rendered_ = true;
  }
});
'use strict'

// Field button

BB.FieldButton = BB.Field.prototype.create({
  constructor: function(text, parent, ondown, options)  {
    BB.Field.prototype.constructor.call(this, 'Button');
    this.children = [];
    this.container = null; // contains attached elements(border) and SVG document
    this.childContainer = null; // svg group that contains all children
    this.root = null;
    this.width = 0;
    this.height = 0;
    this.style = {
      className: 'BBFieldButton',
      classPressedName: 'BBFieldButtonPressed',
      text: {
        fontFamily: 'sans-serif',
        fontColor: '#fff',
        size: 15 // px default metrics in svg.js library
      }
    }
    if (text && typeof(text) == 'string') {
      this.text = text;
    } else {
      throw 'Text must be a valid string';
      return;
    }
    if (ondown) {
      this.ondown = ondown;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    if (options.style) {
      this.style = options.style;
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldButton must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.group()
        .addClass(this.style.className);
      this.textSvg = this.container.text(this.text)
        .font({
          family: this.style.text.fontFamily
          , size: this.style.text.fontSize
        }).fill(this.style.text.fontColor)
        .move(7, 0)
        // TODO: report bug in svg.js when add a text in a container,
        //       don't positioned that properly, this happens when don't calls move function,
        //       by default should be in 0,0 coordinate
        .style('text-rendering: geometricPrecision');
      var textBBox = this.textSvg.bbox();
      this.width = textBBox.width + 14;
      this.height = textBBox.height;
      this.root = (new SVG.Rect).size(this.width, this.height).radius(3);
      this.container.node.insertBefore(this.root.node,this.textSvg.node); // Add root before text(the rect)
        // when scales keeps text proportions
    }
    var this_ = this;
    PolymerGestures.addEventListener(this.container.node, 'down', function(event) {
      this_.container.addClass(this_.style.classPressedName);
      if (this_.ondown) {
        this_.ondown();
      } else {
        // for debugging
        console.log('(Debug) FieldButton don\'t have a ondown handler! .\n Text: ' + this_.text);
      }
      event.preventDefault(); // Don't select text
    });
    PolymerGestures.addEventListener(this.container.node, 'up', function() {
      this_.container.removeClass(this_.style.classPressedName);
    });
    this.rendered_ = true;
  }
});
'use strict';

// Field text input

// Inspiration and ideas for implementation http://making.fiftythree.com/fluid-text-inputs/
// TODOs:
//    - Report Android bug when have 25 characters (TODO: report this bug)
//    - Implement granular character handling (user pair evaluation), performance issue with more than 250 characters
//    - Implement doubletap selection (selects all text)
//    - Better handling of draggable parent
//    - Fix bug when scroll rigth and delete with backspace, bad repositioning (may be bad offset handling).

BB.FieldTextInput = BB.Field.prototype.create({
  // TODO: invert text color when are selected, note that is not trivial.
  constructor: function(text, parent, options)  {
    BB.Field.prototype.constructor.call(this, 'TextInput');
    this.children = [];
    this.container = null; // contains attached elements(border)
    this.childContainer = null; // svg group that contains all children
    this.root = null; // contains the text, this is a nested SVG document (is a container an have it own viewport allowing 'overflow: hidden' css property)
    this.textRoot = null;
    this.fontFamily = 'sans-serif';
    this.fontColor = '#000'; // Must be in hex format to get the negative or modify utils.js/color2negative function to allows other color formats
    // (Not yet implemented negative color for selection, needs an individual tspan for selection and repositioning it beacuse some fonts overlaps letters)
    this.selectionColor = '#3399FF';
    this.backgroundColor = '#FFFFFF'; // background color when is focused
    this.size = 15; // px default metrics in svg.js library
    this.width_ = 0;
    this.minWidth = 10; // When this is not fluid this don't matters
    this.height_ = this.size + 3;
    // Intenals
    this.style = {
      className: 'BBFieldTextInput',
      editableTextBackground: 'BBEditableTextBackground'
    };
    this.textMetrics_ = null;
    this.textWidth_ = 0;
    this.lastTextWidth_ = 0;
    this.initialSpaceX_ = 1;
    this.initialSpaceY_ = 1;
    this.finalSpaceX_ = 1;
    this.finalSpaceY_ = 1;
    this.textRootOffset_ = 1;
    this.offsetX_ = 0; // X scroll offset relative to the text (one line textInput doesn't need offsetY)
    this.initialCursorY_ = 1; // Vertical cursor initial separation relative to SVG element
    this.initialCursorX_ = 0; // Horizontal cursor initial separation relative to SVG element
    this.cursor = null;
    this.cursorXY = {x: 0, y: 0};
    this.cursorState = 0; //0: off, 1: on
    this.cursorInterval = null;
    this.selectable = true;
    this.draggableIndex = -1; // Index of this in attachDraggable array in the parent (if exists)
    this.fluid = true; // fluid or normal text input, true by default

    if (text && typeof(text) == 'string') {
      this.text = text;
      this.mirrorText = text;
    } else {
      throw 'Text must be a valid string';
      return;
    }
    if (parent) {
      this.parent = parent;
    }
    if (!options) {
      return;
    }
    this.optionList = [['fontColor', 'public'],
                       ['fontFamily', 'public'],
                       ['fontSize', 'public'],
                       ['minWidth', 'public'],
                       ['height', 'private'],
                       ['fluid', 'public']];
    for (var i = 0,el; el = this.optionList[i]; i++) {
      if (options.hasOwnProperty(el[0])) {
        var opt = (el[1] == 'public') ? el[0] : el[0] + '_';
        this[opt] = options[el[0]];
      }
    }
    if (options.render) {
      this.render();
    }
  },

  render: function(){
    if (!this.parent) {
      throw 'FieldTextInput must have a parent to be rendered';
      return;
    }
    if (!this.rendered_) {
      this.container = this.parent.container.group().addClass(this.style.className);
      // Background
      this.mainBackground = this.container.rect(0,0);
      // Nested svg as a root allows to use overflow css property
      this.root = this.container.nested().attr('style', 'overflow: hidden;');
      //Mirror root for cursor position, this contains 0 to cursorPosition text (metrics)
      this.mirrorRoot = this.root.text(this.text).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(this.textRootOffset_, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision');
      // Computes text length
      var textLength = this.mirrorRoot.node.getComputedTextLength();
      this.textWidth_ = textLength;
      this.setWidth(textLength);
      this.mainBackground.size(this.width_ + this.initialSpaceX_ + this.finalSpaceX_, this.height_ + this.initialSpaceY_ + this.finalSpaceY_)
        .move(0, 0).addClass(this.style.editableTextBackground).radius(4);
      this.root.size(this.width_, this.height_).move(this.initialSpaceX_, this.initialSpaceY_);
      // Background hides mirrorRoot
      this.background = this.root.rect(this.width_, this.height_).move(0, 0);
      this.selectionRoot =  this.root.rect(0, this.initialCursorY_ + this.size).move(0, 0).fill(this.selectionColor);
      this.textRoot = this.root.text(this.text.replace(/ /g, '\u00a0')).font({
        family: this.fontFamily
        , size: this.fontSize}).fill(this.fontColor).move(this.textRootOffset_, 0) //BUG: svg.js bug when add text to a group
        .style('text-rendering: geometricPrecision'); // when scales keeps proportions
      // Text metrics
      this.getTextMetrics_();
      // Creates a foreign text input for listening keyboard events,
      // this isn't necesary when implemented editable svg text element from SVG 1.2 tiny specification
      // avoid some webkit and blink bugs with textinputs when are rotated and scaled.
      this.foreignTextInput = this.container.foreignObject(0,0).attr({id: 'fobj'})
        .appendChild("input", {type: 'text', value: this.text});
      if (this.fluid) {
        this.setMaxChars(120); // more than 120 characters in one line is not recomended for fluid text inputs
      } else {
        this.setMaxChars(250); // for performance not more than 250 characters
      }
      var this_ = this;

      // Keyboard handler
      var KeyboardHandler = function (e) { // Note that this handles keyup and keydown events
        // compatibility with Chrome and firefox
        var keyId, refreshCursor = false, textChanged = false;
        if (e.key) { // Firefox
          keyId = e.key;
        } else if (e.keyIdentifier) { // Chrome
          keyId = e.keyIdentifier;
        }
        if (keyId == 'Enter') {
          return; // Ignore some keys
        }
        if (e.which == 8 || e.which == 46 || keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firefox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) {
          // Special keys that changes the text: backspace, delete
          if (e.which == 8 || e.which == 46) {
            if (this_.text != e.target.value) {
              this_.text = e.target.value;
              this_.textRoot.text(this_.text.replace(/ /g, '\u00a0')); // Shows spaces with the &nbsp html character
              this_.getTextMetrics_(-1, this_.foreignTextInput.getChild(0).selectionStart); // Update text metrics
              textChanged = true; // flag
            }
          }
        } else { // normal keys
          if (this_.text != e.target.value) {
            this_.text = e.target.value;
            this_.textRoot.text(this_.text.replace(/ /g, '\u00a0'));
            this_.getTextMetrics_(-1, this_.foreignTextInput.getChild(0).selectionStart); // Update text metrics
            textChanged = true;
          }
        }
        // getCaretPosition function not used now
        var selectionStart = this_.foreignTextInput.getChild(0).selectionStart, mirrorText,
            selectionEnd = this_.foreignTextInput.getChild(0).selectionEnd, selectionWidth = 0, i,
            caretPos = selectionStart;
        // Computes the width of selectionRoot (the rect for selected text)
        for (i = selectionStart; i < selectionEnd; i++) {
          selectionWidth += this_.textMetrics_[i];
        }
        if (selectionWidth == 0) {
          this_.showCursor();
        } else {
          this_.hideCursor();
        }
        // The text before the caret
        mirrorText = this_.text.substr(0, caretPos);
        this_.mirrorText = mirrorText;
        this_.mirrorRoot.text(mirrorText.replace(/ /g, '\u00a0'));
        var textLength = this_.mirrorRoot.node.getComputedTextLength();
        // Scrolling and fluid text logic
        if (keyId == 'Left' || keyId == 'Right'
            || keyId == 'Up' || keyId == 'Down' || keyId == 'Home' || keyId == 'End'
            // New keyboard API for firefox see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key
            || keyId == 'ArrowLeft' || keyId == 'ArrowRight' || keyId == 'ArrowUp' || keyId == 'ArrowDown'
           ) { // Modify text have a diferent behavior that only moves in it
          if (-this_.offsetX_ > textLength) {
            this_.offsetX_ = -textLength;
          }
        } else { // Logic for scrolling when modify text
          if (!this_.fluid && -this_.offsetX_ + this_.width_ >= this_.lastTextWidth_ && this_.width_ < this_.lastTextWidth_) {
            this_.offsetX_ = (this_.width - this_.textWidth_ > 0) ? 0 : this_.width_ - this_.textWidth_;
          }
        }
        if (!this_.fluid) {
          if (this_.width_ - this_.offsetX_ <= textLength) {
            this_.offsetX_ = this_.width_ - textLength;
          }
        }
        this_.cursor.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength, this_.initialCursorY_); // Position of cursor
        this_.textRoot.x(this_.initialCursorX_ + this_.offsetX_ + this_.textRootOffset_); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength, this_.initialCursorY_);
        this_.selectionRoot.width(selectionWidth);
        if (textChanged && this_.fluid) {
          this_.setWidth(this_.textWidth_);
        }
      }
      this.foreignTextInput.getChild(0).addEventListener('keyup', KeyboardHandler);
      this.foreignTextInput.getChild(0).addEventListener('keydown', KeyboardHandler);

      // Flag for trackstart
      this.trackStarted = false;
      // Sets caret position with pointer
      this.pointerCaretHandler = function (e) {
        var mousePos = mouseToSvg(e, this_.root.node), i, len, pos1 = 0, pos2 = 0;
        // Mouse position relative to scroll
        mousePos.x -= this_.initialCursorX_ + this_.offsetX_;
        // Find the caret position for this pointerdown event
        for (i = 0, len = this_.textMetrics_.length; i <= len; i++) {
          pos1 = pos2;
          pos2 += ((i == 0) ? 0 : this_.textMetrics_[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics_[i]/2);
          //console.log(pos1 + '<=' + mousePos.x + '<' + pos2) // DEBUGGING LINE
          if (pos1 <= mousePos.x && mousePos.x < pos2) {
            break;
          }
        }
        this_.selectionRoot.width(0);
        this_.mirrorText = this_.text.substr(0, i);
        this_.mirrorRoot.text(this_.mirrorText.replace(/ /g, '\u00a0'));
        setCaretPosition(this_.foreignTextInput.getChild(0), i);
      };
      PolymerGestures.addEventListener(this.root.node, 'up', function(e) {
        if (this_.trackStarted == false && this_.selected_ == false) {
          this_.pointerCaretHandler(e);
          this_.showCursor();
          this_.setSelected(true);
        } else {
          this_.trackStarted = false;
        }
      });
      PolymerGestures.addEventListener(this.root.node, 'down', function(e) {
        if (this_.trackStarted == false && this_.selected_ == true) {
          this_.pointerCaretHandler(e);
          this_.showCursor();
          this_.setSelected(true);
          this_.referenceCursorSelection = this_.foreignTextInput.getChild(0).selectionStart;
          this_.referenceOffsetX_ = this_.offsetX_;
        } else {
          this_.trackStarted = false;
        }
      });
      //Pointertrackstart handler
      PolymerGestures.addEventListener(this.root.node, 'trackstart', function (e) {
        //console.log('trackstart')
        this_.trackStarted = true;
      });
      // Selects text with pointer
      this.pointerCaretSelectionHandler = function (e) {
        // console.log('track')
        // Keeps reference to viewport
        var mousePos = mouseToSvg(e, this_.root.node), i, len, pos1 = 0, pos2 = 0;
        // Mouse position relative to scroll
        mousePos.x -= this_.initialCursorX_ + this_.offsetX_;
        // Find the caret position for this pointerdown event
        if (mousePos.x < 0) {
          i = 0;
        } else { 
          for (i = 0, len = this_.textMetrics_.length; i <= len; i++) {
            pos1 = pos2;
            pos2 += ((i == 0) ? 0 : this_.textMetrics_[i - 1]/2) + ((i == len) ? 0 : this_.textMetrics_[i]/2);
            //console.log(pos1 + '<=' + mousePos.x + '<' + pos2) // DEBUGGING LINE
            if (pos1 <= mousePos.x && mousePos.x < pos2) {
              break;
            }
          }
        }
        var reverseSelection = false;
        // Diferential of offset relative to trackstart event
        var doffsetX_ = this_.offsetX_ - this_.referenceOffsetX_;
        if (e.dx >= doffsetX_) {
          this_.foreignTextInput.getChild(0).selectionStart = this_.referenceCursorSelection;
          this_.foreignTextInput.getChild(0).selectionEnd = i;
        } else {
          this_.foreignTextInput.getChild(0).selectionStart = i;
          this_.foreignTextInput.getChild(0).selectionEnd = this_.referenceCursorSelection;
          reverseSelection = true;
        }
        /*console.log(i)
        console.log('d:'+this_.foreignTextInput.getChild(0).selectionEnd);
        console.log('d:'+this_.foreignTextInput.getChild(0).selectionStart);*/ // DEBUGGING lines
        var selectionStart = this_.foreignTextInput.getChild(0).selectionStart,
            mirrorText, selectionEnd = this_.foreignTextInput.getChild(0).selectionEnd, selectionWidth = 0;
        // Computes the width of selectionRoot (the rect for selected text)
        for (i = selectionStart; i < selectionEnd; i++) {
          selectionWidth += this_.textMetrics_[i];
        }
        if (selectionWidth == 0) {
          this_.showCursor();
        } else {
          this_.hideCursor();
        }
        //console.log('up:' + selectionWidth);
        var textLength = this_.mirrorRoot.node.getComputedTextLength();
        if (!this_.fluid)
        // Scrolling logic
        var selectionDx = (reverseSelection?-1:1)*selectionWidth;
        if (-this_.offsetX_ > textLength + selectionDx) {
          this_.offsetX_ = -textLength - selectionDx;
        }
        if (this_.width_ - this_.offsetX_ <= textLength + selectionDx) {
          this_.offsetX_ = this_.width_ - textLength - selectionDx;
        }
        this_.textRoot.x(this_.initialCursorX_ + this_.offsetX_ + this_.textRootOffset_); // Scrolls the text
        // Moves and resize selectionRoot
        this_.selectionRoot.move(this_.initialCursorX_ + this_.textRootOffset_ + this_.offsetX_ + textLength - (reverseSelection?selectionWidth:0), this_.initialCursorY_);
        this_.selectionRoot.width(selectionWidth);
        this_.setSelected(true);
      };
      this.rendered_ = true;
      var tempSelected = this.selected_;
      this.selected_ = !this.selected_;
      this.setSelected(tempSelected);
    }
  
  },

  showCursor: function (pos) {
    if (pos) {
      this.cursorXY = pos;
    } else {
      var textLength = this.mirrorRoot.node.getComputedTextLength();
      this.cursorXY.x = this.initialCursorX_ + this.textRootOffset_ + this.offsetX_ + textLength;
      this.cursorXY.y = this.initialCursorY_;
    }
    var x = this.cursorXY.x, y = this.cursorXY.y;
    if (!this.cursor) {
      this.cursor = this.root.line(x, y, x, y + this.size + 1).stroke({ width: 1 });
    } else { // If cursor exists moves it
      this.cursor.move(x, y);
    }
    this.hideCursor(); // resets the interval, for responsiveness
    if (!this.cursorInterval) {
      this.cursor.stroke({opacity: 1});
      this.cursorState = 1;
      var this_ = this;
      this.cursorInterval = setInterval(function () {
        if(this_.cursorState == 0) {
          this_.cursor.stroke({opacity: 1});
          this_.cursorState = 1;
        } else {
          this_.cursor.stroke({opacity: 0});
          this_.cursorState = 0;
        }
      }, 530 ); // Interval in ms for the caret
    }
  },

  hideCursor: function () {
    if (this.cursor) {
      this.cursor.stroke({opacity: 0});
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
  },

  // TODO: optimizes this for performance, diff text, only recalc the necesary text
  // keydiff is the key where are changed, this is optional but improves performance
  // if keydiff are defined position is not optional
  // -1 is a normal key that adds text
  // 8 and 46 are backspace and supr keys
  getTextMetrics_: function (keydiff, position) {
    var tempMirrorText = this.text, lastWidth = 0;
    // Keeps last value
    this.lastTextWidth_ = this.textWidth_;
    // Calc text metrics
    var textMetrics_, textLength, textLength2, textLength3, dx1, dx2;
    if (keydiff == undefined || this.textMetrics_ == null) { // Calcs metrics of a whole text
      textMetrics_ = [];
      for (var i = 1, len = this.text.length; i <= len; i++) {
        tempMirrorText = this.text.substr(0, i);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength = this.mirrorRoot.node.getComputedTextLength();
        textMetrics_.push(textLength - lastWidth);
        lastWidth = textLength;
      }
    } else {
      if (position == undefined) {
        throw 'If keydiff are defined position is not optional';
      }
      if (keydiff == -1 && this.text != this.lastText) {
        textMetrics_ = this.textMetrics_;
        tempMirrorText = this.text.substr(0, position - 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength = this.mirrorRoot.node.getComputedTextLength();
        tempMirrorText = this.text.substr(0, position);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength2 = this.mirrorRoot.node.getComputedTextLength();
        dx1 = textLength2 - textLength;
        tempMirrorText = this.text.substr(0, position + 1);
        this.mirrorRoot.text(tempMirrorText.replace(/ /g, '\u00a0')); // TODO: make a setText method that functionality
        textLength3 = this.mirrorRoot.node.getComputedTextLength();
        dx2 = textLength3 - textLength2;
        textMetrics_ =  textMetrics_.slice(0, position - 1).concat([dx1].concat(textMetrics_.slice(position)));
        if (dx2 != 0) {
          textMetrics_ =  textMetrics_.slice(0, position).concat([dx2].concat(textMetrics_.slice(position)));
        }
        //console.log(textMetrics_.length + ' : ' + this.text.length)
      }
    }
    // Keeps lastWidth
    this.textWidth_ =  this.textRoot.node.getComputedTextLength();
    // Keeps lastText
    this.lastText = this.text;
    // Restores mirrorRoot text
    this.mirrorRoot.text(this.text.replace(/ /g, '\u00a0'));
    if (textMetrics_ != undefined) {
      this.textMetrics_ = textMetrics_;
    }
  },
  
  onSelect: function() {
    this.foreignTextInput.getChild(0).focus();
    this.background.fill(this.backgroundColor);
    this.mainBackground.fill(this.backgroundColor);
    this.mainBackground.removeClass(this.style.editableTextBackground);
    this.background.opacity(1);
    this.mirrorRoot.opacity(1);
    this.container.removeClass('BBFieldTextInput');
    this.showCursor();
    PolymerGestures.addEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
    //PolymerGestures.addEventListener(this.root.node, 'trackstart', this.pointerCaretHandler);
    if (this.parent.attachDraggable) {
      // if is focused not drag the parent
      if (this.parent.container.fixedDrag) {
        this.parent.container.fixedDrag();
      }
      this.parent.attachDraggable = this.parent.attachDraggable.slice(0, this.draggableIndex)
        .concat(this.parent.attachDraggable.slice(this.draggableIndex + 1));
      this.draggableIndex = -1;
    }
  },
  onBlur: function() {
    this.foreignTextInput.getChild(0).blur();
    this.selectionRoot.width(0); // Hides selectionRoot
    this.hideCursor();
    this.mainBackground.addClass(this.style.editableTextBackground);
    this.background.opacity(0);
    this.mirrorRoot.opacity(0);
    this.container.addClass('BBFieldTextInput');
    PolymerGestures.removeEventListener(this.root.node, 'track', this.pointerCaretSelectionHandler);
    // if is not focused drag the parent
    if (this.parent.attachDraggable) {
      this.parent.attachDraggable.push(this.container); // This text can drag all parent
      this.draggableIndex = this.parent.attachDraggable.length - 1;
    }
  },
  onSelectedChange: function() {
    // Updates parent draggable handler
    if (this.parent.attachDraggable) {
      this.parent.updateDraggable();
    }
  },
  onUnRender: function() {
    this.hideCursor();
    this.cursor = null;
  },

  // set the max number of chars in the field
  setMaxChars: function(num){
    if (num != undefined) {
      this.maxChars_ = num;
      this.foreignTextInput.getChild(0).maxLength = num;
    } else {
      throw 'Num is not optional';
    }
  },
  
  setWidth: function(width){
    if (width != undefined && typeof(width) == 'number') {
      if (width != this.width_) {
        this.width_ = Math.max(width + 2, this.minWidth);
        if (this.rendered_) {
          this.mainBackground.width(this.width_ + this.initialSpaceX_ + this.finalSpaceX_);
          this.background.width(this.width_);
          this.root.width(this.width_);
          this.parent.fieldChanged(this.index);
        }
      }
    } else {
      throw 'Not valid width';
    }
  },

  // get viewbox, override parent class method
  bbox: function(type){
    if (this.rendered_) {
      var bbox = this.root.viewbox();
      bbox.width_ += this.initialSpaceX_ + this.finalSpaceX_;
      bbox.height_ += this.initialSpaceY_ + this.finalSpaceY_;
      return bbox;
    } else {
      throw 'Only rendered fields have a container';
    }
  }

});
