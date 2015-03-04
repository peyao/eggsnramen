/**
 * Angular Google Analytics - Easy tracking for your AngularJS application
 * @version v0.0.11 - 2015-02-26
 * @link http://github.com/revolunet/angular-google-analytics
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("angular-google-analytics",[]).provider("Analytics",function(){var e,n,t,i,a,c,r=!1,o=!0,s="",u=!1,l="$routeChangeSuccess",d="auto",g=!1,m=!1,_=!1,f=!1,h=!1,p={allowLinker:!0},k=!1;this._logs=[],this.setAccount=function(n){return e=n,!0},this.trackPages=function(e){return o=e,!0},this.trackPrefix=function(e){return s=e,!0},this.setDomainName=function(e){return t=e,!0},this.useDisplayFeatures=function(e){return n=!!e,!0},this.useAnalytics=function(e){return u=!!e,!0},this.useEnhancedLinkAttribution=function(e){return _=!!e,!0},this.useCrossDomainLinker=function(e){return h=!!e,!0},this.setCrossLinkDomains=function(e){return c=e,!0},this.setPageEvent=function(e){return l=e,!0},this.setCookieConfig=function(e){return d=e,!0},this.useECommerce=function(e,n){return g=!!e,m=!!n,!0},this.setRemoveRegExp=function(e){return e instanceof RegExp?(i=e,!0):!1},this.setExperimentId=function(e){return a=e,!0},this.ignoreFirstPageLoad=function(e){return f=!!e,!0},this.trackUrlParams=function(e){return k=!!e,!0},this.$get=["$document","$location","$log","$rootScope","$window",function(v,E,w,y,A){function P(e){!u&&A._gaq&&"function"==typeof e&&e()}function b(e){u&&A.ga&&"function"==typeof e&&e()}function q(){if(!e)return j._log("warn","No account id set to create script tag"),void 0;A._gaq=[],A._gaq.push(["_setAccount",e]),t&&A._gaq.push(["_setDomainName",t]),_&&A._gaq.push(["_require","inpage_linkid","//www.google-analytics.com/plugins/ga/inpage_linkid.js"]),o&&!f&&(i?A._gaq.push(["_trackPageview",L()]):A._gaq.push(["_trackPageview"]));var a;a=n?("https:"===document.location.protocol?"https://":"http://")+"stats.g.doubleclick.net/dc.js":("https:"===document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js",function(){var e=v[0],n=e.createElement("script");n.type="text/javascript",n.async=!0,n.src=a;var t=e.getElementsByTagName("script")[0];t.parentNode.insertBefore(n,t)}(a),r=!0}function C(e,n){return!angular.isUndefined(n)&&"name"in n&&n.name?n.name+"."+e:e}function T(e,n){return e in n&&n[e]}function I(){if(!e)return j._log("warn","No account id set to create analytics script tag"),void 0;if(function(e,n,t,i,a,c,r){e.GoogleAnalyticsObject=a,e[a]=e[a]||function(){(e[a].q=e[a].q||[]).push(arguments)},e[a].l=1*new Date,c=n.createElement(t),r=n.getElementsByTagName(t)[0],c.async=1,c.src=i,r.parentNode.insertBefore(c,r)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),angular.isArray(e)?e.forEach(function(e){var n,t="cookieConfig"in e?e.cookieConfig:d;T("crossDomainLinker",e)&&(e.allowLinker=e.crossDomainLinker),angular.forEach(["name","allowLinker"],function(t){t in e&&(angular.isUndefined(n)&&(n={}),n[t]=e[t])}),angular.isUndefined(n)?A.ga("create",e.tracker,t):A.ga("create",e.tracker,t,n),n&&"allowLinker"in n&&n.allowLinker&&(A.ga(C("require",e),"linker"),T("crossLinkDomains",e)&&A.ga(C("linker:autoLink",e),e.crossLinkDomains))}):h?(A.ga("create",e,d,p),A.ga("require","linker"),c&&A.ga("linker:autoLink",c)):A.ga("create",e,d),n&&A.ga("require","displayfeatures"),o&&!f&&A.ga("send","pageview",L()),A.ga&&(g&&(m?A.ga("require","ec","ec.js"):A.ga("require","ecommerce","ecommerce.js")),_&&A.ga("require","linkid","linkid.js"),a)){var t=document.createElement("script"),i=document.getElementsByTagName("script")[0];t.src="//www.google-analytics.com/cx/api.js?experiment="+a,i.parentNode.insertBefore(t,i)}}var j=this,L=function(){var e=k?E.url():E.path();return i?e.replace(i,""):e};return this._log=function(){arguments.length>0&&(arguments.length>1&&"warn"===arguments[0]&&w.warn(Array.prototype.slice.call(arguments,1)),this._logs.push(arguments))},this._ecommerceEnabled=function(){return g?m?(this._log("warn","Enhanced ecommerce plugin is enabled. Only one plugin(ecommerce/ec) can be used at a time. Use AnalyticsProvider.setECommerce(true, false);"),!1):!0:(this._log("warn","ecommerce not set. Use AnalyticsProvider.setECommerce(true, false);"),!1)},this._enhancedEcommerceEnabled=function(){return g?m?!0:(this._log("warn","Enhanced ecommerce plugin is disabled. Use AnalyticsProvider.setECommerce(true, true);"),!1):(this._log("warn","ecommerce not set. Use AnalyticsProvider.setECommerce(true, true);"),!1)},this._trackPage=function(n,t,i){var a=this,c=arguments;n=n?n:L(),t=t?t:v[0].title,P(function(){A._gaq.push(["_set","title",t]),A._gaq.push(["_trackPageview",s+n]),a._log("_trackPageview",n,t,c)}),b(function(){var r={page:s+n,title:t};angular.isObject(i)&&angular.extend(r,i),angular.isArray(e)?e.forEach(function(e){A.ga(C("send",e),"pageview",r)}):A.ga("send","pageview",r),a._log("pageview",n,t,c)})},this._trackEvent=function(n,t,i,a,c,r){var o=this,s=arguments;P(function(){A._gaq.push(["_trackEvent",n,t,i,a,!!c]),o._log("trackEvent",s)}),b(function(){var u={};angular.isDefined(c)&&(u.nonInteraction=!!c),angular.isObject(r)&&angular.extend(u,r),angular.isArray(e)?e.forEach(function(e){T("trackEvent",e)&&A.ga(C("send",e),"event",n,t,i,a,u)}):A.ga("send","event",n,t,i,a,u),o._log("event",s)})},this._addTrans=function(e,n,t,i,a,c,r,o,s){var u=this,l=arguments;P(function(){A._gaq.push(["_addTrans",e,n,t,i,a,c,r,o]),u._log("_addTrans",l)}),b(function(){u._ecommerceEnabled()&&(A.ga("ecommerce:addTransaction",{id:e,affiliation:n,revenue:t,tax:i,shipping:a,currency:s||"USD"}),u._log("ecommerce:addTransaction",l))})},this._addItem=function(e,n,t,i,a,c){var r=this,o=arguments;P(function(){A._gaq.push(["_addItem",e,n,t,i,a,c]),r._log("_addItem",o)}),b(function(){r._ecommerceEnabled()&&(A.ga("ecommerce:addItem",{id:e,name:t,sku:n,category:i,price:a,quantity:c}),r._log("ecommerce:addItem",o))})},this._trackTrans=function(){var e=this,n=arguments;P(function(){A._gaq.push(["_trackTrans"]),e._log("_trackTrans",n)}),b(function(){e._ecommerceEnabled()&&(A.ga("ecommerce:send"),e._log("ecommerce:send",n))})},this._clearTrans=function(){var e=this,n=arguments;b(function(){e._ecommerceEnabled()&&(A.ga("ecommerce:clear"),e._log("ecommerce:clear",n))})},this._addProduct=function(e,n,t,i,a,c,r,o,s){var u=this,l=arguments;P(function(){A._gaq.push(["_addProduct",e,n,t,i,a,c,r,o,s]),u._log("_addProduct",l)}),b(function(){u._enhancedEcommerceEnabled()&&(A.ga("ec:addProduct",{id:e,name:n,category:t,brand:i,variant:a,price:c,quantity:r,coupon:o,position:s}),u._log("ec:addProduct",l))})},this._addImpression=function(e,n,t,i,a,c,r,o){var s=this,u=arguments;P(function(){A._gaq.push(["_addImpression",e,n,t,i,a,c,r,o]),s._log("_addImpression",u)}),b(function(){s._enhancedEcommerceEnabled()&&A.ga("ec:addImpression",{id:e,name:n,category:a,brand:i,variant:c,list:t,position:r,price:o}),s._log("ec:addImpression",u)})},this._addPromo=function(e,n,t,i){var a=this,c=arguments;P(function(){A._gaq.push(["_addPromo",e,n,t,i]),a._log("_addPromo",arguments)}),b(function(){a._enhancedEcommerceEnabled()&&(A.ga("ec:addPromo",{id:e,name:n,creative:t,position:i}),a._log("ec:addPromo",c))})},this._getActionFieldObject=function(e,n,t,i,a,c,r,o,s){var u={};return e&&(u.id=e),n&&(u.affiliation=n),t&&(u.revenue=t),i&&(u.tax=i),a&&(u.shipping=a),c&&(u.coupon=c),r&&(u.list=r),o&&(u.step=o),s&&(u.option=s),u},this._setAction=function(e,n){var t=this,i=arguments;P(function(){A._gaq.push(["_setAction",e,n]),t._log("__setAction",i)}),b(function(){t._enhancedEcommerceEnabled()&&(A.ga("ec:setAction",e,n),t._log("ec:setAction",i))})},this._trackTransaction=function(e,n,t,i,a,c,r,o,s){this._setAction("purchase",this._getActionFieldObject(e,n,t,i,a,c,r,o,s)),this._pageView()},this._trackRefund=function(e){this._setAction("refund",this._getActionFieldObject(e)),this._pageView()},this._trackCheckOut=function(e,n){this._setAction("checkout",this._getActionFieldObject(null,null,null,null,null,null,null,e,n)),this._pageView()},this._trackCart=function(e){-1!==["add","remove"].indexOf(e)&&(this._setAction(e),this._send("event","UX","click",e+"to cart"))},this._promoClick=function(e){this._setAction("promo_click"),this._send("event","Internal Promotions","click",e)},this._productClick=function(e){this._setAction("click",this._getActionFieldObject(null,null,null,null,null,null,e,null,null)),this._send("event","UX","click",e)},this._send=function(e){var n=this;b(function(){A.ga("send",e),n._log("send",e)})},this._pageView=function(){this._send("pageview")},this._set=function(e,n){var t=this;b(function(){A.ga("set",e,n),t._log("set",e,n)})},u?I():q(),o&&y.$on(l,function(){j._trackPage()}),{_logs:j._logs,cookieConfig:d,displayFeatures:n,ecommerce:g,enhancedEcommerce:m,enhancedLinkAttribution:_,getUrl:L,experimentId:a,ignoreFirstPageLoad:f,ecommerceEnabled:function(){return j._ecommerceEnabled()},enhancedEcommerceEnabled:function(){return j._enhancedEcommerceEnabled()},trackPage:function(e,n,t){j._trackPage(e,n,t)},trackEvent:function(e,n,t,i,a,c){j._trackEvent(e,n,t,i,a,c)},addTrans:function(e,n,t,i,a,c,r,o,s){j._addTrans(e,n,t,i,a,c,r,o,s)},addItem:function(e,n,t,i,a,c){j._addItem(e,n,t,i,a,c)},trackTrans:function(){j._trackTrans()},clearTrans:function(){j._clearTrans()},addProduct:function(e,n,t,i,a,c,r,o,s){j._addProduct(e,n,t,i,a,c,r,o,s)},addPromo:function(e,n,t,i){j._addPromo(e,n,t,i)},addImpression:function(e,n,t,i,a,c,r,o){j._addImpression(e,n,t,i,a,c,r,o)},productClick:function(e){j._productClick(e)},promoClick:function(e){j._promoClick(e)},trackDetail:function(){j._setAction("detail"),j._pageView()},trackCart:function(e){j._trackCart(e)},trackCheckout:function(e,n){j._trackCheckOut(e,n)},trackTransaction:function(e,n,t,i,a,c,r,o,s){j._trackTransaction(e,n,t,i,a,c,r,o,s)},setAction:function(e,n){j._setAction(e,n)},send:function(e){j._send(e)},pageView:function(){j._pageView()},set:function(e,n){j._set(e,n)}}}]});