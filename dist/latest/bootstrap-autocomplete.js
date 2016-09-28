/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* =============================================================
	 * bootstrap-autocomplete.js v0.0.1
	 * https://github.com/xcash/bootstrap-autocomplete
	 * =============================================================
	 * Forked from bootstrap3-typeahead.js v3.1.0
	 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
	 * =============================================================
	 * Original written by @mdo and @fat
	 * =============================================================
	 * Copyright 2016 Paolo Casciello @xcash666 and contributors
	 *
	 * Licensed under the MIT License (the 'License');
	 * you may not use this file except in compliance with the License.
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ============================================================ */
	var resolvers_1 = __webpack_require__(1);
	var dropdown_1 = __webpack_require__(2);
	var AutoCompleteNS;
	(function (AutoCompleteNS) {
	    var AutoComplete = (function () {
	        function AutoComplete(element, options) {
	            this._defaults = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                formatResult: this.defaultFormatResult
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            this._settings = $.extend(true, {}, this._defaults, options);
	            console.log('initializing', this._$el);
	            this.init();
	        }
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver == 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keyup', function (evt) {
	                // check key
	                var newValue = _this._$el.val();
	                _this._$el.trigger('autocomplete.search.typed', newValue);
	            });
	            // typed. event launched when field's value changes
	            this._$el.on('autocomplete.search.typed', function (evt, newValue) {
	                _this.defaultEventTyped(newValue);
	            });
	            // search.pre. event launched before actual search
	            this._$el.on('autocomplete.search.pre', function (evt, newValue) {
	                _this.defaultEventPreSearch(newValue);
	            });
	            // search.do. event launched to perform a search, it calls the callback upon search results
	            this._$el.on('autocomplete.search.do', function (evt, newValue, callback) {
	                _this.defaultEventDoSearch(newValue, callback);
	            });
	            // search.post. event launched after the search returns with data, before drawing
	            // receives `results`
	            this._$el.on('autocomplete.search.post', function (evt, results) {
	                _this.defaultEventPostSearch(results);
	            });
	        };
	        AutoComplete.prototype.defaultEventTyped = function (newValue) {
	            // field value changed
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._$el.trigger('autocomplete.search.pre', newValue);
	            }
	        };
	        AutoComplete.prototype.defaultEventPreSearch = function (newValue) {
	            var _this = this;
	            // do nothing, start search
	            this._$el.trigger('autocomplete.search.do', [newValue, function (results) {
	                    // to prevent `this` problems
	                    _this.defaultEventPostSearchCallback(results);
	                }]);
	        };
	        AutoComplete.prototype.defaultEventDoSearch = function (newValue, callback) {
	            // search using current resolver
	            if (this.resolver) {
	                this.resolver.search(newValue, callback);
	            }
	            else {
	                console.error('NO SEARCH RESOLVER DEFINES');
	            }
	        };
	        AutoComplete.prototype.defaultEventPostSearchCallback = function (results) {
	            console.log('callback called', results);
	            this._$el.trigger('autocomplete.search.post', [results]);
	        };
	        AutoComplete.prototype.defaultEventPostSearch = function (results) {
	            this.defaultEventStartShow(results);
	        };
	        AutoComplete.prototype.defaultEventStartShow = function (results) {
	            console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results);
	            this._dd.show();
	        };
	        AutoComplete.prototype.defaultFormatResult = function (item) {
	            if (typeof item === 'string') {
	                return { text: item };
	            }
	            else if (item.text) {
	                return item;
	            }
	            else {
	                // return a toString of the item as last resort
	                console.error('No default formatter for item', item);
	                return { text: item.toString() };
	            }
	        };
	        AutoComplete.NAME = 'autoComplete';
	        return AutoComplete;
	    }());
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (options) {
	        return this.each(function () {
	            var pluginClass;
	            pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);
	            if (!pluginClass) {
	                pluginClass = new AutoCompleteNS.AutoComplete(this, options);
	                $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
	            }
	        });
	    };
	})(jQuery, window, document);
	// (function (root, factory) {
	//   'use strict';
	//   factory(jQuery);
	// }(this, function ($) {
	//   'use strict';
	//   // jshint laxcomma: true
	//  /* TYPEAHEAD PUBLIC CLASS DEFINITION
	//   * ================================= */
	//   var Typeahead = function (element, options) {
	//     this.$element = $(element);
	//     this.options = $.extend({}, $.fn.typeahead.defaults, options);
	//     this.matcher = this.options.matcher || this.matcher;
	//     this.sorter = this.options.sorter || this.sorter;
	//     this.select = this.options.select || this.select;
	//     this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
	//     this.highlighter = this.options.highlighter || this.highlighter;
	//     this.render = this.options.render || this.render;
	//     this.updater = this.options.updater || this.updater;
	//     this.displayText = this.options.displayText || this.displayText;
	//     this.selectedText = this.options.selectedText || this.selectedText;
	//     this.source = this.options.source;
	//     this.delay = this.options.delay;
	//     this.$menu = $(this.options.menu);
	//     this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
	//     this.fitToElement = typeof this.options.fitToElement == 'boolean' ? this.options.fitToElement : false;
	//     this.shown = false;
	//     this.listen();
	//     this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' || this.options.showHintOnFocus === "all" ? this.options.showHintOnFocus : false;
	//     this.afterSelect = this.options.afterSelect;
	//     this.addItem = false;
	//     this.value = this.$element.val() || this.$element.text();
	//   };
	//   Typeahead.prototype = {
	//     constructor: Typeahead,
	//     select: function () {
	//       var val = this.$menu.find('.active').data('value');
	//       this.$element.data('active', val);
	//       if (this.autoSelect || val) {
	//         var newVal = this.updater(val);
	//         // Updater can be set to any random functions via "options" parameter in constructor above.
	//         // Add null check for cases when updater returns void or undefined.
	//         if (!newVal) {
	//           newVal = '';
	//         }
	//         var selectedVal = this.selectedText(newVal);
	//         if (selectedVal !== false) {
	//           this.$element
	//             .val(selectedVal)
	//             .text(this.displayText(newVal) || newVal)
	//             .change();
	//         }
	//         this.afterSelect(newVal);
	//       }
	//       return this.hide();
	//     },
	//     updater: function (item) {
	//       return item;
	//     },
	//     setSource: function (source) {
	//       this.source = source;
	//     },
	//     show: function () {
	//       var pos = $.extend({}, this.$element.position(), {
	//         height: this.$element[0].offsetHeight
	//       });
	//       var scrollHeight = typeof this.options.scrollHeight == 'function' ?
	//           this.options.scrollHeight.call() :
	//           this.options.scrollHeight;
	//       var element;
	//       if (this.shown) {
	//         element = this.$menu;
	//       } else if (this.$appendTo) {
	//         element = this.$menu.appendTo(this.$appendTo);
	//         this.hasSameParent = this.$appendTo.is(this.$element.parent());
	//       } else {
	//         element = this.$menu.insertAfter(this.$element);
	//         this.hasSameParent = true;
	//       }      
	//       if (!this.hasSameParent) {
	//           // We cannot rely on the element position, need to position relative to the window
	//           element.css("position", "fixed");
	//           var offset = this.$element.offset();
	//           pos.top =  offset.top;
	//           pos.left = offset.left;
	//       }
	//       // The rules for bootstrap are: 'dropup' in the parent and 'dropdown-menu-right' in the element.
	//       // Note that to get right alignment, you'll need to specify `menu` in the options to be:
	//       // '<ul class="typeahead dropdown-menu" role="listbox"></ul>'
	//       var dropup = $(element).parent().hasClass('dropup');
	//       var newTop = dropup ? 'auto' : (pos.top + pos.height + scrollHeight);
	//       var right = $(element).hasClass('dropdown-menu-right');
	//       var newLeft = right ? 'auto' : pos.left;
	//       // it seems like setting the css is a bad idea (just let Bootstrap do it), but I'll keep the old
	//       // logic in place except for the dropup/right-align cases.
	//       element.css({ top: newTop, left: newLeft }).show();
	//       if (this.options.fitToElement === true) {
	//           element.css("width", this.$element.outerWidth() + "px");
	//       }
	//       this.shown = true;
	//       return this;
	//     },
	//     hide: function () {
	//       this.$menu.hide();
	//       this.shown = false;
	//       return this;
	//     },
	//     lookup: function (query) {
	//       var items;
	//       if (typeof(query) != 'undefined' && query !== null) {
	//         this.query = query;
	//       } else {
	//         this.query = this.$element.val() || this.$element.text() || '';
	//       }
	//       if (this.query.length < this.options.minLength && !this.options.showHintOnFocus) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       var worker = $.proxy(function () {
	//         if ($.isFunction(this.source)) {
	//           this.source(this.query, $.proxy(this.process, this));
	//         } else if (this.source) {
	//           this.process(this.source);
	//         }
	//       }, this);
	//       clearTimeout(this.lookupWorker);
	//       this.lookupWorker = setTimeout(worker, this.delay);
	//     },
	//     process: function (items) {
	//       var that = this;
	//       items = $.grep(items, function (item) {
	//         return that.matcher(item);
	//       });
	//       items = this.sorter(items);
	//       if (!items.length && !this.options.addItem) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       if (items.length > 0) {
	//         this.$element.data('active', items[0]);
	//       } else {
	//         this.$element.data('active', null);
	//       }
	//       // Add item
	//       if (this.options.addItem){
	//         items.push(this.options.addItem);
	//       }
	//       if (this.options.items == 'all') {
	//         return this.render(items).show();
	//       } else {
	//         return this.render(items.slice(0, this.options.items)).show();
	//       }
	//     },
	//     matcher: function (item) {
	//       var it = this.displayText(item);
	//       return ~it.toLowerCase().indexOf(this.query.toLowerCase());
	//     },
	//     sorter: function (items) {
	//       var beginswith = [];
	//       var caseSensitive = [];
	//       var caseInsensitive = [];
	//       var item;
	//       while ((item = items.shift())) {
	//         var it = this.displayText(item);
	//         if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
	//         else if (~it.indexOf(this.query)) caseSensitive.push(item);
	//         else caseInsensitive.push(item);
	//       }
	//       return beginswith.concat(caseSensitive, caseInsensitive);
	//     },
	//     highlighter: function (item) {
	//       var html = $('<div></div>');
	//       var query = this.query;
	//       var i = item.toLowerCase().indexOf(query.toLowerCase());
	//       var len = query.length;
	//       var leftPart;
	//       var middlePart;
	//       var rightPart;
	//       var strong;
	//       if (len === 0) {
	//         return html.text(item).html();
	//       }
	//       while (i > -1) {
	//         leftPart = item.substr(0, i);
	//         middlePart = item.substr(i, len);
	//         rightPart = item.substr(i + len);
	//         strong = $('<strong></strong>').text(middlePart);
	//         html
	//           .append(document.createTextNode(leftPart))
	//           .append(strong);
	//         item = rightPart;
	//         i = item.toLowerCase().indexOf(query.toLowerCase());
	//       }
	//       return html.append(document.createTextNode(item)).html();
	//     },
	//     render: function (items) {
	//       var that = this;
	//       var self = this;
	//       var activeFound = false;
	//       var data = [];
	//       var _category = that.options.separator;
	//       $.each(items, function (key,value) {
	//         // inject separator
	//         if (key > 0 && value[_category] !== items[key - 1][_category]){
	//           data.push({
	//             __type: 'divider'
	//           });
	//         }
	//         // inject category header
	//         if (value[_category] && (key === 0 || value[_category] !== items[key - 1][_category])){
	//           data.push({
	//             __type: 'category',
	//             name: value[_category]
	//           });
	//         }
	//         data.push(value);
	//       });
	//       items = $(data).map(function (i, item) {
	//         if ((item.__type || false) == 'category'){
	//           return $(that.options.headerHtml).text(item.name)[0];
	//         }
	//         if ((item.__type || false) == 'divider'){
	//           return $(that.options.headerDivider)[0];
	//         }
	//         var text = self.displayText(item);
	//         i = $(that.options.item).data('value', item);
	//         i.find('a').html(that.highlighter(text, item));
	//         if (text == self.$element.val()) {
	//           i.addClass('active');
	//           self.$element.data('active', item);
	//           activeFound = true;
	//         }
	//         return i[0];
	//       });
	//       if (this.autoSelect && !activeFound) {
	//         items.filter(':not(.dropdown-header)').first().addClass('active');
	//         this.$element.data('active', items.first().data('value'));
	//       }
	//       this.$menu.html(items);
	//       return this;
	//     },
	//     displayText: function (item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     selectedText: function(item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     next: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var next = active.next();
	//       if (!next.length) {
	//         next = $(this.$menu.find('li')[0]);
	//       }
	//       next.addClass('active');
	//     },
	//     prev: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var prev = active.prev();
	//       if (!prev.length) {
	//         prev = this.$menu.find('li').last();
	//       }
	//       prev.addClass('active');
	//     },
	//     listen: function () {
	//       this.$element
	//         .on('focus',    $.proxy(this.focus, this))
	//         .on('blur',     $.proxy(this.blur, this))
	//         .on('keypress', $.proxy(this.keypress, this))
	//         .on('input',    $.proxy(this.input, this))
	//         .on('keyup',    $.proxy(this.keyup, this));
	//       if (this.eventSupported('keydown')) {
	//         this.$element.on('keydown', $.proxy(this.keydown, this));
	//       }
	//       this.$menu
	//         .on('click', $.proxy(this.click, this))
	//         .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
	//         .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
	//         .on('mousedown', $.proxy(this.mousedown,this));
	//     },
	//     destroy : function () {
	//       this.$element.data('typeahead',null);
	//       this.$element.data('active',null);
	//       this.$element
	//         .off('focus')
	//         .off('blur')
	//         .off('keypress')
	//         .off('input')
	//         .off('keyup');
	//       if (this.eventSupported('keydown')) {
	//         this.$element.off('keydown');
	//       }
	//       this.$menu.remove();
	//       this.destroyed = true;
	//     },
	//     eventSupported: function (eventName) {
	//       var isSupported = eventName in this.$element;
	//       if (!isSupported) {
	//         this.$element.setAttribute(eventName, 'return;');
	//         isSupported = typeof this.$element[eventName] === 'function';
	//       }
	//       return isSupported;
	//     },
	//     move: function (e) {
	//       if (!this.shown) return;
	//       switch (e.keyCode) {
	//         case 9: // tab
	//         case 13: // enter
	//         case 27: // escape
	//           e.preventDefault();
	//           break;
	//         case 38: // up arrow
	//           // with the shiftKey (this is actually the left parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.prev();
	//           break;
	//         case 40: // down arrow
	//           // with the shiftKey (this is actually the right parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.next();
	//           break;
	//       }
	//     },
	//     keydown: function (e) {
	//       this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
	//       if (!this.shown && e.keyCode == 40) {
	//         this.lookup();
	//       } else {
	//         this.move(e);
	//       }
	//     },
	//     keypress: function (e) {
	//       if (this.suppressKeyPressRepeat) return;
	//       this.move(e);
	//     },
	//     input: function (e) {
	//       // This is a fixed for IE10/11 that fires the input event when a placehoder is changed
	//       // (https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus)
	//       var currentValue = this.$element.val() || this.$element.text();
	//       if (this.value !== currentValue) {
	//         this.value = currentValue;
	//         this.lookup();
	//       }
	//     },
	//     keyup: function (e) {
	//       if (this.destroyed) {
	//         return;
	//       }
	//       switch (e.keyCode) {
	//         case 40: // down arrow
	//         case 38: // up arrow
	//         case 16: // shift
	//         case 17: // ctrl
	//         case 18: // alt
	//           break;
	//         case 9: // tab
	//         case 13: // enter
	//           if (!this.shown) return;
	//           this.select();
	//           break;
	//         case 27: // escape
	//           if (!this.shown) return;
	//           this.hide();
	//           break;
	//       }
	//     },
	//     focus: function (e) {
	//       if (!this.focused) {
	//         this.focused = true;
	//         if (this.options.showHintOnFocus && this.skipShowHintOnFocus !== true) {
	//           if(this.options.showHintOnFocus === "all") {
	//             this.lookup(""); 
	//           } else {
	//             this.lookup();
	//           }
	//         }
	//       }
	//       if (this.skipShowHintOnFocus) {
	//         this.skipShowHintOnFocus = false;
	//       }
	//     },
	//     blur: function (e) {
	//       if (!this.mousedover && !this.mouseddown && this.shown) {
	//         this.hide();
	//         this.focused = false;
	//       } else if (this.mouseddown) {
	//         // This is for IE that blurs the input when user clicks on scroll.
	//         // We set the focus back on the input and prevent the lookup to occur again
	//         this.skipShowHintOnFocus = true;
	//         this.$element.focus();
	//         this.mouseddown = false;
	//       } 
	//     },
	//     click: function (e) {
	//       e.preventDefault();
	//       this.skipShowHintOnFocus = true;
	//       this.select();
	//       this.$element.focus();
	//       this.hide();
	//     },
	//     mouseenter: function (e) {
	//       this.mousedover = true;
	//       this.$menu.find('.active').removeClass('active');
	//       $(e.currentTarget).addClass('active');
	//     },
	//     mouseleave: function (e) {
	//       this.mousedover = false;
	//       if (!this.focused && this.shown) this.hide();
	//     },
	//    /**
	//      * We track the mousedown for IE. When clicking on the menu scrollbar, IE makes the input blur thus hiding the menu.
	//      */
	//     mousedown: function (e) {
	//       this.mouseddown = true;
	//       this.$menu.one("mouseup", function(e){
	//         // IE won't fire this, but FF and Chrome will so we reset our flag for them here
	//         this.mouseddown = false;
	//       }.bind(this));
	//     },
	//   };
	//   /* TYPEAHEAD PLUGIN DEFINITION
	//    * =========================== */
	//   var old = $.fn.typeahead;
	//   $.fn.typeahead = function (option) {
	//     var arg = arguments;
	//     if (typeof option == 'string' && option == 'getActive') {
	//       return this.data('active');
	//     }
	//     return this.each(function () {
	//       var $this = $(this);
	//       var data = $this.data('typeahead');
	//       var options = typeof option == 'object' && option;
	//       if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
	//       if (typeof option == 'string' && data[option]) {
	//         if (arg.length > 1) {
	//           data[option].apply(data, Array.prototype.slice.call(arg, 1));
	//         } else {
	//           data[option]();
	//         }
	//       }
	//     });
	//   };
	//   $.fn.typeahead.defaults = {
	//     source: [],
	//     items: 8,
	//     menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
	//     item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
	//     minLength: 1,
	//     scrollHeight: 0,
	//     autoSelect: true,
	//     afterSelect: $.noop,
	//     addItem: false,
	//     delay: 0,
	//     separator: 'category',
	//     headerHtml: '<li class="dropdown-header"></li>',
	//     headerDivider: '<li class="divider" role="separator"></li>'
	//   };
	//   $.fn.typeahead.Constructor = Typeahead;
	//  /* TYPEAHEAD NO CONFLICT
	//   * =================== */
	//   $.fn.typeahead.noConflict = function () {
	//     $.fn.typeahead = old;
	//     return this;
	//   };
	//  /* TYPEAHEAD DATA-API
	//   * ================== */
	//   $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
	//     var $this = $(this);
	//     if ($this.data('typeahead')) return;
	//     $this.typeahead($this.data());
	//   });
	// }));


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseResolver = (function () {
	    function BaseResolver(options) {
	        this._settings = $.extend(true, {}, this.getDefaults(), options);
	    }
	    BaseResolver.prototype.getDefaults = function () {
	        return {};
	    };
	    BaseResolver.prototype.getResults = function (limit, start, end) {
	        return this.results;
	    };
	    BaseResolver.prototype.search = function (q, cbk) {
	        cbk(this.getResults());
	    };
	    return BaseResolver;
	}());
	var AjaxResolver = (function (_super) {
	    __extends(AjaxResolver, _super);
	    function AjaxResolver(options) {
	        _super.call(this, options);
	        console.log('resolver settings', this._settings);
	    }
	    AjaxResolver.prototype.getDefaults = function () {
	        return {
	            url: '',
	            method: 'get',
	            queryKey: 'q',
	            extraData: {},
	            timeout: undefined,
	        };
	    };
	    AjaxResolver.prototype.search = function (q, cbk) {
	        var _this = this;
	        if (this.jqXHR != null) {
	            this.jqXHR.abort();
	        }
	        var data = {};
	        data[this._settings.queryKey] = q;
	        $.extend(data, this._settings.extraData);
	        this.jqXHR = $.ajax(this._settings.url, {
	            method: this._settings.method,
	            data: data,
	            timeout: this._settings.timeout
	        });
	        this.jqXHR.done(function (result) {
	            cbk(result);
	        });
	        this.jqXHR.fail(function (err) {
	            console.log(err);
	        });
	        this.jqXHR.always(function () {
	            _this.jqXHR = null;
	        });
	    };
	    return AjaxResolver;
	}(BaseResolver));
	exports.AjaxResolver = AjaxResolver;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/*
	 *	Dropdown class. Manages the dropdown drawing
	 */
	var Dropdown = (function () {
	    function Dropdown(e, formatItemCbk) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.init();
	    }
	    Dropdown.prototype.init = function () {
	        // Initialize dropdown
	        var pos = $.extend({}, this._$el.position(), {
	            height: this._$el[0].offsetHeight
	        });
	        // create element
	        this._dd = $('<ul />');
	        // add our class and basic dropdown-menu class
	        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
	        this._dd.insertAfter(this._$el);
	        this._dd.css({ left: pos.left, width: this._$el.outerWidth() });
	        this.initialized = true;
	        // DEBUG - TODO remove
	        // this.show();
	    };
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items) {
	        console.log('updateItems', items);
	        this.items = items;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this._dd.empty();
	        this.items.forEach(function (item) {
	            var itemFormatted = _this.formatItem(item);
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').text(itemFormatted.text));
	            li.on('click', function () {
	                console.log('clicked');
	            });
	            // TODO optimize 
	            _this._dd.append(li);
	        });
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjdjNDNjMGE2MTc1MDg1NmFiNDciLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWtJcEI7QUFsSUQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQXVCRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQWhCaEMsY0FBUyxHQUFPO2lCQUN0QixRQUFRLEVBQVUsTUFBTTtpQkFDeEIsZ0JBQWdCLEVBQU8sRUFBRTtpQkFDekIsU0FBUyxFQUFVLENBQUM7aUJBQ3BCLFlBQVksRUFBWSxJQUFJLENBQUMsbUJBQW1CO2NBQ2pEO2FBWUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FB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QUMsRUFBRSxDQUFDLE9BQU8sRUFBRTtpQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3hCLENBQUMsQ0FBQyxDQUFDO2FBQ0gsaUJBQWlCO2FBQ2pCLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3JCLENBQUMsQ0FBQyxDQUFDO0tBQ0osQ0FBQztLQUVGLGVBQUM7QUFBRCxFQUFDO0FBdkVZLGlCQUFRLFdBdUVwQiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiN2M0M2MwYTYxNzUwODU2YWI0N1xuICoqLyIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC1hdXRvY29tcGxldGUuanMgdjAuMC4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20veGNhc2gvYm9vdHN0cmFwLWF1dG9jb21wbGV0ZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRm9ya2VkIGZyb20gYm9vdHN0cmFwMy10eXBlYWhlYWQuanMgdjMuMS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmFzc2pvYnNlbi9Cb290c3RyYXAtMy1UeXBlYWhlYWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE9yaWdpbmFsIHdyaXR0ZW4gYnkgQG1kbyBhbmQgQGZhdFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTYgUGFvbG8gQ2FzY2llbGxvIEB4Y2FzaDY2NiBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlICh0aGUgJ0xpY2Vuc2UnKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuaW1wb3J0IHsgQWpheFJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcblxubW9kdWxlIEF1dG9Db21wbGV0ZU5TIHtcbiAgZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZSB7XG4gICAgcHVibGljIHN0YXRpYyBOQU1FOnN0cmluZyA9ICdhdXRvQ29tcGxldGUnO1xuXG4gICAgcHJpdmF0ZSBfZWw6RWxlbWVudDtcbiAgICBwcml2YXRlIF8kZWw6SlF1ZXJ5O1xuICAgIHByaXZhdGUgX2RkOkRyb3Bkb3duO1xuXG4gICAgcHJpdmF0ZSBfZGVmYXVsdHM6YW55ID0ge1xuICAgICAgcmVzb2x2ZXI6PHN0cmluZz4gJ2FqYXgnLFxuICAgICAgcmVzb2x2ZXJTZXR0aW5nczo8YW55PiB7fSxcbiAgICAgIG1pbkxlbmd0aDo8bnVtYmVyPiAzLFxuICAgICAgZm9ybWF0UmVzdWx0OjxGdW5jdGlvbj4gdGhpcy5kZWZhdWx0Rm9ybWF0UmVzdWx0XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgX3NldHRpbmdzOntcbiAgICAgIHJlc29sdmVyOnN0cmluZyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6e30sXG4gICAgICBtaW5MZW5ndGg6bnVtYmVyLFxuICAgICAgZm9ybWF0UmVzdWx0OkZ1bmN0aW9uXG4gICAgfTtcblxuICAgIHByaXZhdGUgcmVzb2x2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OkVsZW1lbnQsIG9wdGlvbnM6YW55KSB7XG4gICAgICB0aGlzLl9lbCA9IGVsZW1lbnQ7XG4gICAgICB0aGlzLl8kZWwgPSAkKHRoaXMuX2VsKTtcbiAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX2RlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coJ2luaXRpYWxpemluZycsIHRoaXMuXyRlbCk7XG4gICAgICBcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6dm9pZCB7XG4gICAgICAvLyBiaW5kIGRlZmF1bHQgZXZlbnRzXG4gICAgICB0aGlzLmJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIC8vIFJFU09MVkVSXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXIgPT0gJ2FqYXgnKSB7XG4gICAgICAgIC8vIGNvbmZpZ3VyZSBkZWZhdWx0IHJlc29sdmVyXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBuZXcgQWpheFJlc29sdmVyKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyU2V0dGluZ3MpO1xuICAgICAgfVxuICAgICAgLy8gRHJvcGRvd25cbiAgICAgIHRoaXMuX2RkID0gbmV3IERyb3Bkb3duKHRoaXMuXyRlbCwgdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0KTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSBiaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICB0aGlzLl8kZWwub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjaGVjayBrZXlcblxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnR5cGVkJywgbmV3VmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHR5cGVkLiBldmVudCBsYXVuY2hlZCB3aGVuIGZpZWxkJ3MgdmFsdWUgY2hhbmdlc1xuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLnR5cGVkJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgbmV3VmFsdWU6c3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50VHlwZWQobmV3VmFsdWUpO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy8gc2VhcmNoLnByZS4gZXZlbnQgbGF1bmNoZWQgYmVmb3JlIGFjdHVhbCBzZWFyY2hcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlYXJjaC5wcmUnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCBuZXdWYWx1ZTpzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5kZWZhdWx0RXZlbnRQcmVTZWFyY2gobmV3VmFsdWUpO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy8gc2VhcmNoLmRvLiBldmVudCBsYXVuY2hlZCB0byBwZXJmb3JtIGEgc2VhcmNoLCBpdCBjYWxscyB0aGUgY2FsbGJhY2sgdXBvbiBzZWFyY2ggcmVzdWx0c1xuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLmRvJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgbmV3VmFsdWU6c3RyaW5nLCBjYWxsYmFjazpGdW5jdGlvbikgPT4ge1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudERvU2VhcmNoKG5ld1ZhbHVlLCBjYWxsYmFjayk7XG4gICAgICB9KVxuICAgICAgXG4gICAgICAvLyBzZWFyY2gucG9zdC4gZXZlbnQgbGF1bmNoZWQgYWZ0ZXIgdGhlIHNlYXJjaCByZXR1cm5zIHdpdGggZGF0YSwgYmVmb3JlIGRyYXdpbmdcbiAgICAgIC8vIHJlY2VpdmVzIGByZXN1bHRzYFxuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VhcmNoLnBvc3QnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0LCByZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudFBvc3RTZWFyY2gocmVzdWx0cyk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50VHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5wcmUnLCBuZXdWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRQcmVTZWFyY2gobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGRvIG5vdGhpbmcsIHN0YXJ0IHNlYXJjaFxuICAgICAgdGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWFyY2guZG8nLCBbbmV3VmFsdWUsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAvLyB0byBwcmV2ZW50IGB0aGlzYCBwcm9ibGVtc1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudFBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudERvU2VhcmNoKG5ld1ZhbHVlOnN0cmluZywgY2FsbGJhY2s6RnVuY3Rpb24pOnZvaWQge1xuICAgICAgLy8gc2VhcmNoIHVzaW5nIGN1cnJlbnQgcmVzb2x2ZXJcbiAgICAgIGlmICh0aGlzLnJlc29sdmVyKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZXIuc2VhcmNoKG5ld1ZhbHVlLCBjYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdOTyBTRUFSQ0ggUkVTT0xWRVIgREVGSU5FUycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50UG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjYWxsYmFjayBjYWxsZWQnLCByZXN1bHRzKTtcbiAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnBvc3QnLCBbcmVzdWx0c10pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50UG9zdFNlYXJjaChyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICB0aGlzLmRlZmF1bHRFdmVudFN0YXJ0U2hvdyhyZXN1bHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFN0YXJ0U2hvdyhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICBjb25zb2xlLmxvZyhcImRlZmF1bHRFdmVudFN0YXJ0U2hvd1wiLCByZXN1bHRzKTtcbiAgICAgIC8vIGZvciBldmVyeSByZXN1bHQsIGRyYXcgaXRcbiAgICAgIHRoaXMuX2RkLnVwZGF0ZUl0ZW1zKHJlc3VsdHMpO1xuICAgICAgdGhpcy5fZGQuc2hvdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEZvcm1hdFJlc3VsdChpdGVtOmFueSk6e30ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbSB9O1xuICAgICAgfSBlbHNlIGlmICggaXRlbS50ZXh0ICkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJldHVybiBhIHRvU3RyaW5nIG9mIHRoZSBpdGVtIGFzIGxhc3QgcmVzb3J0XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIGRlZmF1bHQgZm9ybWF0dGVyIGZvciBpdGVtJywgaXRlbSk7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0udG9TdHJpbmcoKSB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn1cblxuKGZ1bmN0aW9uKCQ6IEpRdWVyeVN0YXRpYywgd2luZG93OiBhbnksIGRvY3VtZW50OiBhbnkpIHtcbiAgJC5mbltBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRV0gPSBmdW5jdGlvbihvcHRpb25zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBsdWdpbkNsYXNzOkF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZTtcblxuICAgICAgcGx1Z2luQ2xhc3MgPSAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUpO1xuXG4gICAgICBpZiAoIXBsdWdpbkNsYXNzKSB7XG4gICAgICAgIHBsdWdpbkNsYXNzID0gbmV3IEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZSh0aGlzLCBvcHRpb25zKTsgXG4gICAgICAgICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSwgcGx1Z2luQ2xhc3MpO1xuICAgICAgfVxuXG5cbiAgICB9KTtcbiAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8vIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXG4vLyAgICd1c2Ugc3RyaWN0JztcblxuLy8gICBmYWN0b3J5KGpRdWVyeSk7XG5cbi8vIH0odGhpcywgZnVuY3Rpb24gKCQpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG4vLyAgIC8vIGpzaGludCBsYXhjb21tYTogdHJ1ZVxuXG5cbi8vICAvKiBUWVBFQUhFQUQgUFVCTElDIENMQVNTIERFRklOSVRJT05cbi8vICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgVHlwZWFoZWFkID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbi8vICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbi8vICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMsIG9wdGlvbnMpO1xuLy8gICAgIHRoaXMubWF0Y2hlciA9IHRoaXMub3B0aW9ucy5tYXRjaGVyIHx8IHRoaXMubWF0Y2hlcjtcbi8vICAgICB0aGlzLnNvcnRlciA9IHRoaXMub3B0aW9ucy5zb3J0ZXIgfHwgdGhpcy5zb3J0ZXI7XG4vLyAgICAgdGhpcy5zZWxlY3QgPSB0aGlzLm9wdGlvbnMuc2VsZWN0IHx8IHRoaXMuc2VsZWN0O1xuLy8gICAgIHRoaXMuYXV0b1NlbGVjdCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA6IHRydWU7XG4vLyAgICAgdGhpcy5oaWdobGlnaHRlciA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHRlciB8fCB0aGlzLmhpZ2hsaWdodGVyO1xuLy8gICAgIHRoaXMucmVuZGVyID0gdGhpcy5vcHRpb25zLnJlbmRlciB8fCB0aGlzLnJlbmRlcjtcbi8vICAgICB0aGlzLnVwZGF0ZXIgPSB0aGlzLm9wdGlvbnMudXBkYXRlciB8fCB0aGlzLnVwZGF0ZXI7XG4vLyAgICAgdGhpcy5kaXNwbGF5VGV4dCA9IHRoaXMub3B0aW9ucy5kaXNwbGF5VGV4dCB8fCB0aGlzLmRpc3BsYXlUZXh0O1xuLy8gICAgIHRoaXMuc2VsZWN0ZWRUZXh0ID0gdGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dCB8fCB0aGlzLnNlbGVjdGVkVGV4dDtcbi8vICAgICB0aGlzLnNvdXJjZSA9IHRoaXMub3B0aW9ucy5zb3VyY2U7XG4vLyAgICAgdGhpcy5kZWxheSA9IHRoaXMub3B0aW9ucy5kZWxheTtcbi8vICAgICB0aGlzLiRtZW51ID0gJCh0aGlzLm9wdGlvbnMubWVudSk7XG4vLyAgICAgdGhpcy4kYXBwZW5kVG8gPSB0aGlzLm9wdGlvbnMuYXBwZW5kVG8gPyAkKHRoaXMub3B0aW9ucy5hcHBlbmRUbykgOiBudWxsO1xuLy8gICAgIHRoaXMuZml0VG9FbGVtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA6IGZhbHNlO1xuLy8gICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICB0aGlzLmxpc3RlbigpO1xuLy8gICAgIHRoaXMuc2hvd0hpbnRPbkZvY3VzID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT0gJ2Jvb2xlYW4nIHx8IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIgPyB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzIDogZmFsc2U7XG4vLyAgICAgdGhpcy5hZnRlclNlbGVjdCA9IHRoaXMub3B0aW9ucy5hZnRlclNlbGVjdDtcbi8vICAgICB0aGlzLmFkZEl0ZW0gPSBmYWxzZTtcbi8vICAgICB0aGlzLnZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgfTtcbiAgXG4vLyAgIFR5cGVhaGVhZC5wcm90b3R5cGUgPSB7XG5cbi8vICAgICBjb25zdHJ1Y3RvcjogVHlwZWFoZWFkLFxuXG4vLyAgICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgdmFsID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykuZGF0YSgndmFsdWUnKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgdmFsKTtcbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgfHwgdmFsKSB7XG4vLyAgICAgICAgIHZhciBuZXdWYWwgPSB0aGlzLnVwZGF0ZXIodmFsKTtcbi8vICAgICAgICAgLy8gVXBkYXRlciBjYW4gYmUgc2V0IHRvIGFueSByYW5kb20gZnVuY3Rpb25zIHZpYSBcIm9wdGlvbnNcIiBwYXJhbWV0ZXIgaW4gY29uc3RydWN0b3IgYWJvdmUuXG4vLyAgICAgICAgIC8vIEFkZCBudWxsIGNoZWNrIGZvciBjYXNlcyB3aGVuIHVwZGF0ZXIgcmV0dXJucyB2b2lkIG9yIHVuZGVmaW5lZC5cbi8vICAgICAgICAgaWYgKCFuZXdWYWwpIHtcbi8vICAgICAgICAgICBuZXdWYWwgPSAnJztcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgc2VsZWN0ZWRWYWwgPSB0aGlzLnNlbGVjdGVkVGV4dChuZXdWYWwpO1xuLy8gICAgICAgICBpZiAoc2VsZWN0ZWRWYWwgIT09IGZhbHNlKSB7XG4vLyAgICAgICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAgICAgLnZhbChzZWxlY3RlZFZhbClcbi8vICAgICAgICAgICAgIC50ZXh0KHRoaXMuZGlzcGxheVRleHQobmV3VmFsKSB8fCBuZXdWYWwpXG4vLyAgICAgICAgICAgICAuY2hhbmdlKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdGhpcy5hZnRlclNlbGVjdChuZXdWYWwpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNldFNvdXJjZTogZnVuY3Rpb24gKHNvdXJjZSkge1xuLy8gICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4vLyAgICAgfSxcblxuLy8gICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciBwb3MgPSAkLmV4dGVuZCh7fSwgdGhpcy4kZWxlbWVudC5wb3NpdGlvbigpLCB7XG4vLyAgICAgICAgIGhlaWdodDogdGhpcy4kZWxlbWVudFswXS5vZmZzZXRIZWlnaHRcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQgPT0gJ2Z1bmN0aW9uJyA/XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodC5jYWxsKCkgOlxuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQ7XG5cbi8vICAgICAgIHZhciBlbGVtZW50O1xuLy8gICAgICAgaWYgKHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnU7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMuJGFwcGVuZFRvKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51LmFwcGVuZFRvKHRoaXMuJGFwcGVuZFRvKTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdGhpcy4kYXBwZW5kVG8uaXModGhpcy4kZWxlbWVudC5wYXJlbnQoKSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdHJ1ZTtcbi8vICAgICAgIH0gICAgICBcbiAgICAgIFxuLy8gICAgICAgaWYgKCF0aGlzLmhhc1NhbWVQYXJlbnQpIHtcbi8vICAgICAgICAgICAvLyBXZSBjYW5ub3QgcmVseSBvbiB0aGUgZWxlbWVudCBwb3NpdGlvbiwgbmVlZCB0byBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgd2luZG93XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJwb3NpdGlvblwiLCBcImZpeGVkXCIpO1xuLy8gICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpO1xuLy8gICAgICAgICAgIHBvcy50b3AgPSAgb2Zmc2V0LnRvcDtcbi8vICAgICAgICAgICBwb3MubGVmdCA9IG9mZnNldC5sZWZ0O1xuLy8gICAgICAgfVxuLy8gICAgICAgLy8gVGhlIHJ1bGVzIGZvciBib290c3RyYXAgYXJlOiAnZHJvcHVwJyBpbiB0aGUgcGFyZW50IGFuZCAnZHJvcGRvd24tbWVudS1yaWdodCcgaW4gdGhlIGVsZW1lbnQuXG4vLyAgICAgICAvLyBOb3RlIHRoYXQgdG8gZ2V0IHJpZ2h0IGFsaWdubWVudCwgeW91J2xsIG5lZWQgdG8gc3BlY2lmeSBgbWVudWAgaW4gdGhlIG9wdGlvbnMgdG8gYmU6XG4vLyAgICAgICAvLyAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+J1xuLy8gICAgICAgdmFyIGRyb3B1cCA9ICQoZWxlbWVudCkucGFyZW50KCkuaGFzQ2xhc3MoJ2Ryb3B1cCcpO1xuLy8gICAgICAgdmFyIG5ld1RvcCA9IGRyb3B1cCA/ICdhdXRvJyA6IChwb3MudG9wICsgcG9zLmhlaWdodCArIHNjcm9sbEhlaWdodCk7XG4vLyAgICAgICB2YXIgcmlnaHQgPSAkKGVsZW1lbnQpLmhhc0NsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4vLyAgICAgICB2YXIgbmV3TGVmdCA9IHJpZ2h0ID8gJ2F1dG8nIDogcG9zLmxlZnQ7XG4vLyAgICAgICAvLyBpdCBzZWVtcyBsaWtlIHNldHRpbmcgdGhlIGNzcyBpcyBhIGJhZCBpZGVhIChqdXN0IGxldCBCb290c3RyYXAgZG8gaXQpLCBidXQgSSdsbCBrZWVwIHRoZSBvbGRcbi8vICAgICAgIC8vIGxvZ2ljIGluIHBsYWNlIGV4Y2VwdCBmb3IgdGhlIGRyb3B1cC9yaWdodC1hbGlnbiBjYXNlcy5cbi8vICAgICAgIGVsZW1lbnQuY3NzKHsgdG9wOiBuZXdUb3AsIGxlZnQ6IG5ld0xlZnQgfSkuc2hvdygpO1xuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwid2lkdGhcIiwgdGhpcy4kZWxlbWVudC5vdXRlcldpZHRoKCkgKyBcInB4XCIpO1xuLy8gICAgICAgfVxuICAgIFxuLy8gICAgICAgdGhpcy5zaG93biA9IHRydWU7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kbWVudS5oaWRlKCk7XG4vLyAgICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgbG9va3VwOiBmdW5jdGlvbiAocXVlcnkpIHtcbi8vICAgICAgIHZhciBpdGVtcztcbi8vICAgICAgIGlmICh0eXBlb2YocXVlcnkpICE9ICd1bmRlZmluZWQnICYmIHF1ZXJ5ICE9PSBudWxsKSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpIHx8ICcnO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5xdWVyeS5sZW5ndGggPCB0aGlzLm9wdGlvbnMubWluTGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB2YXIgd29ya2VyID0gJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cbi8vICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbih0aGlzLnNvdXJjZSkpIHtcbi8vICAgICAgICAgICB0aGlzLnNvdXJjZSh0aGlzLnF1ZXJ5LCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpO1xuLy8gICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc291cmNlKSB7XG4vLyAgICAgICAgICAgdGhpcy5wcm9jZXNzKHRoaXMuc291cmNlKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSwgdGhpcyk7XG5cbi8vICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmxvb2t1cFdvcmtlcik7XG4vLyAgICAgICB0aGlzLmxvb2t1cFdvcmtlciA9IHNldFRpbWVvdXQod29ya2VyLCB0aGlzLmRlbGF5KTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJvY2VzczogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbi8vICAgICAgIGl0ZW1zID0gJC5ncmVwKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhhdC5tYXRjaGVyKGl0ZW0pO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gdGhpcy5zb3J0ZXIoaXRlbXMpO1xuXG4vLyAgICAgICBpZiAoIWl0ZW1zLmxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLmFkZEl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXNbMF0pO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBudWxsKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgLy8gQWRkIGl0ZW1cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkSXRlbSl7XG4vLyAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5vcHRpb25zLmFkZEl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLml0ZW1zID09ICdhbGwnKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcykuc2hvdygpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zLnNsaWNlKDAsIHRoaXMub3B0aW9ucy5pdGVtcykpLnNob3coKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICByZXR1cm4gfml0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBzb3J0ZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIGJlZ2luc3dpdGggPSBbXTtcbi8vICAgICAgIHZhciBjYXNlU2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgY2FzZUluc2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgaXRlbTtcblxuLy8gICAgICAgd2hpbGUgKChpdGVtID0gaXRlbXMuc2hpZnQoKSkpIHtcbi8vICAgICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaWYgKCFpdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKSkgYmVnaW5zd2l0aC5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGlmICh+aXQuaW5kZXhPZih0aGlzLnF1ZXJ5KSkgY2FzZVNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGNhc2VJbnNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gYmVnaW5zd2l0aC5jb25jYXQoY2FzZVNlbnNpdGl2ZSwgY2FzZUluc2Vuc2l0aXZlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaHRtbCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4vLyAgICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJ5O1xuLy8gICAgICAgdmFyIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIHZhciBsZW4gPSBxdWVyeS5sZW5ndGg7XG4vLyAgICAgICB2YXIgbGVmdFBhcnQ7XG4vLyAgICAgICB2YXIgbWlkZGxlUGFydDtcbi8vICAgICAgIHZhciByaWdodFBhcnQ7XG4vLyAgICAgICB2YXIgc3Ryb25nO1xuLy8gICAgICAgaWYgKGxlbiA9PT0gMCkge1xuLy8gICAgICAgICByZXR1cm4gaHRtbC50ZXh0KGl0ZW0pLmh0bWwoKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHdoaWxlIChpID4gLTEpIHtcbi8vICAgICAgICAgbGVmdFBhcnQgPSBpdGVtLnN1YnN0cigwLCBpKTtcbi8vICAgICAgICAgbWlkZGxlUGFydCA9IGl0ZW0uc3Vic3RyKGksIGxlbik7XG4vLyAgICAgICAgIHJpZ2h0UGFydCA9IGl0ZW0uc3Vic3RyKGkgKyBsZW4pO1xuLy8gICAgICAgICBzdHJvbmcgPSAkKCc8c3Ryb25nPjwvc3Ryb25nPicpLnRleHQobWlkZGxlUGFydCk7XG4vLyAgICAgICAgIGh0bWxcbi8vICAgICAgICAgICAuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxlZnRQYXJ0KSlcbi8vICAgICAgICAgICAuYXBwZW5kKHN0cm9uZyk7XG4vLyAgICAgICAgIGl0ZW0gPSByaWdodFBhcnQ7XG4vLyAgICAgICAgIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBodG1sLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpdGVtKSkuaHRtbCgpO1xuLy8gICAgIH0sXG5cbi8vICAgICByZW5kZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuLy8gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuLy8gICAgICAgdmFyIGFjdGl2ZUZvdW5kID0gZmFsc2U7XG4vLyAgICAgICB2YXIgZGF0YSA9IFtdO1xuLy8gICAgICAgdmFyIF9jYXRlZ29yeSA9IHRoYXQub3B0aW9ucy5zZXBhcmF0b3I7XG5cbi8vICAgICAgICQuZWFjaChpdGVtcywgZnVuY3Rpb24gKGtleSx2YWx1ZSkge1xuLy8gICAgICAgICAvLyBpbmplY3Qgc2VwYXJhdG9yXG4vLyAgICAgICAgIGlmIChrZXkgPiAwICYmIHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdkaXZpZGVyJ1xuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgLy8gaW5qZWN0IGNhdGVnb3J5IGhlYWRlclxuLy8gICAgICAgICBpZiAodmFsdWVbX2NhdGVnb3J5XSAmJiAoa2V5ID09PSAwIHx8IHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnY2F0ZWdvcnknLFxuLy8gICAgICAgICAgICAgbmFtZTogdmFsdWVbX2NhdGVnb3J5XVxuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSAkKGRhdGEpLm1hcChmdW5jdGlvbiAoaSwgaXRlbSkge1xuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnY2F0ZWdvcnknKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVySHRtbCkudGV4dChpdGVtLm5hbWUpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2RpdmlkZXInKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVyRGl2aWRlcilbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICB2YXIgdGV4dCA9IHNlbGYuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGkgPSAkKHRoYXQub3B0aW9ucy5pdGVtKS5kYXRhKCd2YWx1ZScsIGl0ZW0pO1xuLy8gICAgICAgICBpLmZpbmQoJ2EnKS5odG1sKHRoYXQuaGlnaGxpZ2h0ZXIodGV4dCwgaXRlbSkpO1xuLy8gICAgICAgICBpZiAodGV4dCA9PSBzZWxmLiRlbGVtZW50LnZhbCgpKSB7XG4vLyAgICAgICAgICAgaS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgc2VsZi4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtKTtcbi8vICAgICAgICAgICBhY3RpdmVGb3VuZCA9IHRydWU7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgcmV0dXJuIGlbMF07XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCAmJiAhYWN0aXZlRm91bmQpIHtcbi8vICAgICAgICAgaXRlbXMuZmlsdGVyKCc6bm90KC5kcm9wZG93bi1oZWFkZXIpJykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXMuZmlyc3QoKS5kYXRhKCd2YWx1ZScpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuJG1lbnUuaHRtbChpdGVtcyk7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgZGlzcGxheVRleHQ6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNlbGVjdGVkVGV4dDogZnVuY3Rpb24oaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBuZXh0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgbmV4dCA9IGFjdGl2ZS5uZXh0KCk7XG5cbi8vICAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcbi8vICAgICAgICAgbmV4dCA9ICQodGhpcy4kbWVudS5maW5kKCdsaScpWzBdKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgbmV4dC5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByZXY6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBwcmV2ID0gYWN0aXZlLnByZXYoKTtcblxuLy8gICAgICAgaWYgKCFwcmV2Lmxlbmd0aCkge1xuLy8gICAgICAgICBwcmV2ID0gdGhpcy4kbWVudS5maW5kKCdsaScpLmxhc3QoKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcHJldi5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIGxpc3RlbjogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub24oJ2ZvY3VzJywgICAgJC5wcm94eSh0aGlzLmZvY3VzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdibHVyJywgICAgICQucHJveHkodGhpcy5ibHVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXlwcmVzcycsICQucHJveHkodGhpcy5rZXlwcmVzcywgdGhpcykpXG4vLyAgICAgICAgIC5vbignaW5wdXQnLCAgICAkLnByb3h5KHRoaXMuaW5wdXQsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXVwJywgICAgJC5wcm94eSh0aGlzLmtleXVwLCB0aGlzKSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bicsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnVcbi8vICAgICAgICAgLm9uKCdjbGljaycsICQucHJveHkodGhpcy5jbGljaywgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VlbnRlcicsICdsaScsICQucHJveHkodGhpcy5tb3VzZWVudGVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlbGVhdmUsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZG93bicsICQucHJveHkodGhpcy5tb3VzZWRvd24sdGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgICBkZXN0cm95IDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCd0eXBlYWhlYWQnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub2ZmKCdmb2N1cycpXG4vLyAgICAgICAgIC5vZmYoJ2JsdXInKVxuLy8gICAgICAgICAub2ZmKCdrZXlwcmVzcycpXG4vLyAgICAgICAgIC5vZmYoJ2lucHV0Jylcbi8vICAgICAgICAgLm9mZigna2V5dXAnKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bicpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51LnJlbW92ZSgpO1xuLy8gICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuLy8gICAgIH0sXG5cbi8vICAgICBldmVudFN1cHBvcnRlZDogZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuLy8gICAgICAgdmFyIGlzU3VwcG9ydGVkID0gZXZlbnROYW1lIGluIHRoaXMuJGVsZW1lbnQ7XG4vLyAgICAgICBpZiAoIWlzU3VwcG9ydGVkKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuc2V0QXR0cmlidXRlKGV2ZW50TmFtZSwgJ3JldHVybjsnKTtcbi8vICAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgdGhpcy4kZWxlbWVudFtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGlzU3VwcG9ydGVkO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3ZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG5cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSBsZWZ0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMucHJldigpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgcmlnaHQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQgPSB+JC5pbkFycmF5KGUua2V5Q29kZSwgWzQwLDM4LDksMTMsMjddKTtcbi8vICAgICAgIGlmICghdGhpcy5zaG93biAmJiBlLmtleUNvZGUgPT0gNDApIHtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5cHJlc3M6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0KSByZXR1cm47XG4vLyAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGlucHV0OiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgLy8gVGhpcyBpcyBhIGZpeGVkIGZvciBJRTEwLzExIHRoYXQgZmlyZXMgdGhlIGlucHV0IGV2ZW50IHdoZW4gYSBwbGFjZWhvZGVyIGlzIGNoYW5nZWRcbi8vICAgICAgIC8vIChodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgxMDUzOC9pZS0xMS1maXJlcy1pbnB1dC1ldmVudC1vbi1mb2N1cylcbi8vICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuLy8gICAgICAgICB0aGlzLnZhbHVlID0gY3VycmVudFZhbHVlO1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXl1cDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuLy8gICAgICAgICByZXR1cm47XG4vLyAgICAgICB9XG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4vLyAgICAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbi8vICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuXG5cbi8vICAgICB9LFxuXG4vLyAgICAgZm9jdXM6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuLy8gICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyAmJiB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgIT09IHRydWUpIHtcbi8vICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiKSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cChcIlwiKTsgXG4vLyAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgICBpZiAodGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IGZhbHNlO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBibHVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLm1vdXNlZG92ZXIgJiYgIXRoaXMubW91c2VkZG93biAmJiB0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb3VzZWRkb3duKSB7XG4vLyAgICAgICAgIC8vIFRoaXMgaXMgZm9yIElFIHRoYXQgYmx1cnMgdGhlIGlucHV0IHdoZW4gdXNlciBjbGlja3Mgb24gc2Nyb2xsLlxuLy8gICAgICAgICAvLyBXZSBzZXQgdGhlIGZvY3VzIGJhY2sgb24gdGhlIGlucHV0IGFuZCBwcmV2ZW50IHRoZSBsb29rdXAgdG8gb2NjdXIgYWdhaW5cbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0gXG4vLyAgICAgfSxcblxuLy8gICAgIGNsaWNrOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gZmFsc2U7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCAmJiB0aGlzLnNob3duKSB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAvKipcbi8vICAgICAgKiBXZSB0cmFjayB0aGUgbW91c2Vkb3duIGZvciBJRS4gV2hlbiBjbGlja2luZyBvbiB0aGUgbWVudSBzY3JvbGxiYXIsIElFIG1ha2VzIHRoZSBpbnB1dCBibHVyIHRodXMgaGlkaW5nIHRoZSBtZW51LlxuLy8gICAgICAqL1xuLy8gICAgIG1vdXNlZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2VkZG93biA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51Lm9uZShcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSl7XG4vLyAgICAgICAgIC8vIElFIHdvbid0IGZpcmUgdGhpcywgYnV0IEZGIGFuZCBDaHJvbWUgd2lsbCBzbyB3ZSByZXNldCBvdXIgZmxhZyBmb3IgdGhlbSBoZXJlXG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfS5iaW5kKHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgIH07XG5cblxuLy8gICAvKiBUWVBFQUhFQUQgUExVR0lOIERFRklOSVRJT05cbi8vICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIG9sZCA9ICQuZm4udHlwZWFoZWFkO1xuXG4vLyAgICQuZm4udHlwZWFoZWFkID0gZnVuY3Rpb24gKG9wdGlvbikge1xuLy8gICAgIHZhciBhcmcgPSBhcmd1bWVudHM7XG4vLyAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgb3B0aW9uID09ICdnZXRBY3RpdmUnKSB7XG4vLyAgICAgICByZXR1cm4gdGhpcy5kYXRhKCdhY3RpdmUnKTtcbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKTtcbi8vICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb247XG4vLyAgICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcsIChkYXRhID0gbmV3IFR5cGVhaGVhZCh0aGlzLCBvcHRpb25zKSkpO1xuLy8gICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgZGF0YVtvcHRpb25dKSB7XG4vLyAgICAgICAgIGlmIChhcmcubGVuZ3RoID4gMSkge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXS5hcHBseShkYXRhLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcsIDEpKTtcbi8vICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0oKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzID0ge1xuLy8gICAgIHNvdXJjZTogW10sXG4vLyAgICAgaXRlbXM6IDgsXG4vLyAgICAgbWVudTogJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPicsXG4vLyAgICAgaXRlbTogJzxsaT48YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIHJvbGU9XCJvcHRpb25cIj48L2E+PC9saT4nLFxuLy8gICAgIG1pbkxlbmd0aDogMSxcbi8vICAgICBzY3JvbGxIZWlnaHQ6IDAsXG4vLyAgICAgYXV0b1NlbGVjdDogdHJ1ZSxcbi8vICAgICBhZnRlclNlbGVjdDogJC5ub29wLFxuLy8gICAgIGFkZEl0ZW06IGZhbHNlLFxuLy8gICAgIGRlbGF5OiAwLFxuLy8gICAgIHNlcGFyYXRvcjogJ2NhdGVnb3J5Jyxcbi8vICAgICBoZWFkZXJIdG1sOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCI+PC9saT4nLFxuLy8gICAgIGhlYWRlckRpdmlkZXI6ICc8bGkgY2xhc3M9XCJkaXZpZGVyXCIgcm9sZT1cInNlcGFyYXRvclwiPjwvbGk+J1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLkNvbnN0cnVjdG9yID0gVHlwZWFoZWFkO1xuXG4vLyAgLyogVFlQRUFIRUFEIE5PIENPTkZMSUNUXG4vLyAgICogPT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgJC5mbi50eXBlYWhlYWQgPSBvbGQ7XG4vLyAgICAgcmV0dXJuIHRoaXM7XG4vLyAgIH07XG5cblxuLy8gIC8qIFRZUEVBSEVBRCBEQVRBLUFQSVxuLy8gICAqID09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQoZG9jdW1lbnQpLm9uKCdmb2N1cy50eXBlYWhlYWQuZGF0YS1hcGknLCAnW2RhdGEtcHJvdmlkZT1cInR5cGVhaGVhZFwiXScsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICBpZiAoJHRoaXMuZGF0YSgndHlwZWFoZWFkJykpIHJldHVybjtcbi8vICAgICAkdGhpcy50eXBlYWhlYWQoJHRoaXMuZGF0YSgpKTtcbi8vICAgfSk7XG5cbi8vIH0pKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21haW4udHNcbiAqKi8iLCJcbmNsYXNzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCByZXN1bHRzOkFycmF5PE9iamVjdD47XG5cblx0cHJvdGVjdGVkIF9zZXR0aW5nczphbnk7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHR0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXRSZXN1bHRzKGxpbWl0PzpudW1iZXIsIHN0YXJ0PzpudW1iZXIsIGVuZD86bnVtYmVyKTpBcnJheTxPYmplY3Q+IHtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzO1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRjYmsodGhpcy5nZXRSZXN1bHRzKCkpO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhSZXNvbHZlciBleHRlbmRzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCBqcVhIUjpKUXVlcnlYSFI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdGNvbnNvbGUubG9nKCdyZXNvbHZlciBzZXR0aW5ncycsIHRoaXMuX3NldHRpbmdzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnJyxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRxdWVyeUtleTogJ3EnLFxuXHRcdFx0ZXh0cmFEYXRhOiB7fSxcblx0XHRcdHRpbWVvdXQ6IHVuZGVmaW5lZCxcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRpZiAodGhpcy5qcVhIUiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGE6T2JqZWN0ID0ge307XG5cdFx0ZGF0YVt0aGlzLl9zZXR0aW5ncy5xdWVyeUtleV0gPSBxO1xuXHRcdCQuZXh0ZW5kKGRhdGEsIHRoaXMuX3NldHRpbmdzLmV4dHJhRGF0YSk7XG5cblx0XHR0aGlzLmpxWEhSID0gJC5hamF4KFxuXHRcdFx0dGhpcy5fc2V0dGluZ3MudXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRob2Q6IHRoaXMuX3NldHRpbmdzLm1ldGhvZCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fc2V0dGluZ3MudGltZW91dFxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0aGlzLmpxWEhSLmRvbmUoKHJlc3VsdCkgPT4ge1xuXHRcdFx0Y2JrKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNvbHZlcnMudHNcbiAqKi8iLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIF9kZDpKUXVlcnk7XG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbikge1xuXHRcdHRoaXMuXyRlbCA9IGU7XG5cdFx0dGhpcy5mb3JtYXRJdGVtID0gZm9ybWF0SXRlbUNiaztcblx0XHRcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXHRcblx0cHJvdGVjdGVkIGluaXQoKTp2b2lkIHtcblx0XHQvLyBJbml0aWFsaXplIGRyb3Bkb3duXG5cdFx0bGV0IHBvczphbnkgPSAkLmV4dGVuZCh7fSwgdGhpcy5fJGVsLnBvc2l0aW9uKCksIHtcbiAgICAgICAgXHRcdFx0XHRoZWlnaHQ6IHRoaXMuXyRlbFswXS5vZmZzZXRIZWlnaHRcbiAgICBcdFx0XHRcdH0pO1xuXHRcdFxuXHRcdC8vIGNyZWF0ZSBlbGVtZW50XG5cdFx0dGhpcy5fZGQgPSAkKCc8dWwgLz4nKTtcblx0XHQvLyBhZGQgb3VyIGNsYXNzIGFuZCBiYXNpYyBkcm9wZG93bi1tZW51IGNsYXNzXG5cdFx0dGhpcy5fZGQuYWRkQ2xhc3MoJ2Jvb3RzdHJhcC1hdXRvY29tcGxldGUgZHJvcGRvd24tbWVudScpO1xuXG5cdFx0dGhpcy5fZGQuaW5zZXJ0QWZ0ZXIodGhpcy5fJGVsKTtcblx0XHR0aGlzLl9kZC5jc3MoeyBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdFx0Ly8gREVCVUcgLSBUT0RPIHJlbW92ZVxuXHRcdC8vIHRoaXMuc2hvdygpO1xuXHR9XG5cblx0cHVibGljIHNob3coKTp2b2lkIHtcblx0XHRpZiAoIXRoaXMuc2hvd24pIHtcblx0XHRcdHRoaXMuX2RkLmRyb3Bkb3duKCkuc2hvdygpO1xuXHRcdFx0dGhpcy5zaG93biA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGhpZGUoKTp2b2lkIHtcblx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5oaWRlKCk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdKSB7XG5cdFx0Y29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOnsgaWQ/Om51bWJlciwgdGV4dDpzdHJpbmcgfSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLnRleHQoaXRlbUZvcm1hdHRlZC50ZXh0KVxuXHRcdFx0KTtcblx0XHRcdGxpLm9uKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NsaWNrZWQnKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gVE9ETyBvcHRpbWl6ZSBcblx0XHRcdHRoaXMuX2RkLmFwcGVuZChsaSk7XG5cdFx0fSk7XG5cdH1cblxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Ryb3Bkb3duLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==