!function(e){var t={};function l(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,l),s.l=!0,s.exports}l.m=e,l.c=t,l.d=function(e,t,i){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(l.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)l.d(i,s,function(t){return e[t]}.bind(null,s));return i},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l(l.s=4)}([,,,function(e,t,l){},function(e,t,l){"use strict";l.r(t);class i{constructor(){this.cells=[],this.rules=[{neighbourCountRule:e=>e<=1,currentState:["dead","alive"],nextState:["dead"]},{neighbourCountRule:e=>e>=2&&e<=3,currentState:["alive"],nextState:["alive"]},{neighbourCountRule:e=>3==e,currentState:["dead","alive"],nextState:["alive"]},{neighbourCountRule:e=>e>=4,currentState:["dead","alive"],nextState:["dead"]}],this.compiledRules={a0:"dead",a2:"alive",a3:"alive",a4:"dead",d0:"dead",d2:"dead",d3:"alive",d4:"dead"},this.generationPeriod=500,this.interval=null,this.stepCount=0,this.listener=()=>{}}setCells(e){this.cells=e}setListener(e){this.listener=e}isRunning(){return!!this.interval}countNeighbours(e,t){let l=0;for(let i=Math.max(t-1,0);i<=Math.min(t+1,this.cells.length-1);i++)for(let s=Math.max(e-1,0);s<=Math.min(e+1,this.cells[0].length-1);s++)s===e&&i===t||"alive"!==this.cells[i][s].status||l++;switch(l){case 0:case 1:l=0;break;case 2:case 3:case 4:break;default:l=4}return l}nextGeneration(){let e=[];for(let t=0;t<this.cells.length;t++){let l=this.cells[t],i=[];for(let e=0;e<l.length;e++){let s=l[e],n=this.compiledRules[s.status[0]+this.countNeighbours(e,t)];i.push({x:t,y:e,status:n})}e.push(i)}for(let t=0;t<this.cells.length;t++)this.cells[t]=e[t];this.listener(this.cells),this.stepCount++}start(){this.interval=setInterval(this.nextGeneration.bind(this),this.generationPeriod)}stop(){clearInterval(this.interval),this.interval=null}}l(3);new class{constructor(e=".Life",t=10,l=10){this.selector=e,this.rowCount=t,this.cellCount=l,this.appDomElement=document.querySelector(this.selector),this.appDomElement||(this.appDomElement=document.createElement("div"),this.appDomElement.setAttribute("class","Life"),document.body.appendChild(this.appDomElement)),this.gameDomElement=document.createElement("div"),this.appDomElement.appendChild(this.gameDomElement),this.cells=[];for(let e=0;e<t;e++){let t=[];for(let i=0;i<l;i++)t.push({x:i,y:e,status:"dead"});this.cells.push(t)}this.lifeService=new i,this.lifeService.setCells(this.cells),this.lifeService.setListener(this.render.bind(this)),this.initRender(this.cells),this.startStopDomElement=document.createElement("button"),this.startStopDomElement.innerText="Start",this.startStopDomElement.addEventListener("click",this.startStopHandler.bind(this)),this.appDomElement.appendChild(this.startStopDomElement),this.patternElement=document.createElement("button"),this.patternElement.innerText="Pattern",this.patternElement.addEventListener("click",this.patternHandler.bind(this)),this.appDomElement.appendChild(this.patternElement)}run(){this.lifeService.start()}stop(){this.lifeService.stop()}render(){let e=this.gameDomElement;for(let t=0;t<e.childNodes.length;t++){let l=e.childNodes[t];for(let e=0;e<l.childNodes.length;e++){let i=l.childNodes[e];"alive"!==this.cells[t][e].status?i.setAttribute("alive","false"):i.setAttribute("alive","true")}}}seed(){let e=this.gameDomElement;for(let t=0;t<e.childNodes.length;t++){let l=e.childNodes[t];for(let e=0;e<l.childNodes.length;e++){let i=l.childNodes[e];"true"===i.getAttribute("alive")?this.cells[t][e].status="alive":this.cells[t][e].status="dead",i.removeEventListener("click",this.cellClickHandler)}}}initRender(){let e=this.gameDomElement;for(let t=0;t<this.rowCount;t++){let t=document.createElement("div");t.setAttribute("class","row");for(let e=0;e<this.cellCount;e++){let e=document.createElement("div");e.setAttribute("class","cell"),e.setAttribute("alive","false"),e.addEventListener("click",this.cellClickHandler),t.appendChild(e)}e.appendChild(t)}}cellClickHandler(e){e.preventDefault();let t=e.target;"true"===t.getAttribute("alive")?t.setAttribute("alive","false"):t.setAttribute("alive","true")}startStopHandler(e){if(!this.lifeService.isRunning())return this.seed(),e.target.innerText="Stop",void this.run();this.lifeService.stop();let t=this.gameDomElement;for(let e=0;e<t.childNodes.length;e++){let l=t.childNodes[e];for(let e=0;e<l.childNodes.length;e++){l.childNodes[e].addEventListener("click",this.cellClickHandler)}}e.target.innerText="Start"}displayError(e){console.log(e)}patternHandler(e){if(this.lifeService.isRunning())return;let t=class{static pulsar(){let e=[];return e.push([0,0,1,1,1,0,0,0,1,1,1,0,0]),e.push([0,0,0,0,0,0,0,0,0,0,0,0,0]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([0,0,1,1,1,0,0,0,1,1,1,0,0]),e.push([0,0,0,0,0,0,0,0,0,0,0,0,0]),e.push([0,0,1,1,1,0,0,0,1,1,1,0,0]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([1,0,0,0,0,1,0,1,0,0,0,0,1]),e.push([0,0,0,0,0,0,0,0,0,0,0,0,0]),e.push([0,0,1,1,1,0,0,0,1,1,1,0,0]),e}}.pulsar();if(t.length>this.rowCount||t[0].length>this.cellCount)this.displayError("Could not apply pattern");else for(let e=0;e<t.length;e++)for(let l=0;l<t[0].length;l++)this.gameDomElement.childNodes[e].childNodes[l].setAttribute("alive",!!t[e][l]||"false")}}(".Life",100,100)}]);