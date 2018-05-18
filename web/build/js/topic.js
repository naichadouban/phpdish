webpackJsonp([1],{

/***/ "./assets/js/topic.js":
/*!****************************!*\
  !*** ./assets/js/topic.js ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! module/common.js */ "./assets/modules/common.js");

var _util = __webpack_require__(/*! ../modules/util.js */ "./assets/modules/util.js");

var _util2 = _interopRequireDefault(_util);

var _store = __webpack_require__(/*! store */ "./node_modules/store/dist/store.legacy.js");

var _store2 = _interopRequireDefault(_store);

var _socialShareButton = __webpack_require__(/*! social-share-button.js */ "./node_modules/social-share-button.js/dist/social-share.min.js");

var _socialShareButton2 = _interopRequireDefault(_socialShareButton);

var _buttonLock = __webpack_require__(/*! ../modules/button-lock.js */ "./assets/modules/button-lock.js");

var _buttonLock2 = _interopRequireDefault(_buttonLock);

var _editor = __webpack_require__(/*! ../modules/md-editor/editor.js */ "./assets/modules/md-editor/editor.js");

var _editor2 = _interopRequireDefault(_editor);

var _codemirrorEditor = __webpack_require__(/*! ../modules/md-editor/codemirror-editor.js */ "./assets/modules/md-editor/codemirror-editor.js");

var _codemirrorEditor2 = _interopRequireDefault(_codemirrorEditor);

var _highlight = __webpack_require__(/*! highlight.js */ "./node_modules/highlight.js/lib/index.js");

var _highlight2 = _interopRequireDefault(_highlight);

var _ajaxtab = __webpack_require__(/*! ../modules/ajaxtab.js */ "./assets/modules/ajaxtab.js");

var _ajaxtab2 = _interopRequireDefault(_ajaxtab);

__webpack_require__(/*! selectize */ "./node_modules/selectize/dist/js/selectize.js");

var _actions = __webpack_require__(/*! ../modules/actions */ "./assets/modules/actions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//话题列表页
//AjaxTab
new _ajaxtab2.default($('[data-pjax-container]'), {
    container: '#list-container',
    loader: '#loader',
    before: function before(container) {
        _util2.default.htmlPlaceholder(container);
    },
    success: function success(container) {
        new _actions.FollowUserIntialization(container);
        new _actions.FollowThreadIntialization(container);
    }
});

//话题详情页
(function ($) {

    //分享
    new _socialShareButton2.default('.social-share-container', {
        'theme': 'default'
    });
    //代码高亮
    $('pre code').each(function (i, block) {
        _highlight2.default.highlightBlock(block);
    });

    (function () {
        //话题操作
        var $topicAction = $('[data-role="topic-action"]');
        var $removeAction = $topicAction.find('[data-action="remove"]');
        var $recommendAction = $topicAction.find('[data-action="recommend"]');
        var $topAction = $topicAction.find('[data-action="stick-top"]');
        var $voteAction = $topicAction.find('[data-action="vote"]');

        var buttonLock = (0, _buttonLock2.default)($removeAction);
        $removeAction.on('click', function () {
            if (buttonLock.isDisabled()) {
                return false;
            }
            buttonLock.lock();
            _util2.default.dialog.confirm(Translator.trans('topic.confirm_remove_the_topic')).then(function () {
                _util2.default.request('topic.delete', window.topicId).done(function () {
                    _util2.default.dialog.message(Translator.trans('topic.topic_have_been_remove')).flash(2, function () {
                        location.href = '/';
                    });
                }).fail(function (response) {
                    _util2.default.dialog.message(response.responseJSON.error).flash(3);
                }).always(function () {
                    buttonLock.release();
                });
            }, function () {
                buttonLock.release();
            });
        });
        //推荐位
        var recommendButtonLock = (0, _buttonLock2.default)($recommendAction);
        $recommendAction.on('click', function () {
            if (recommendButtonLock.isDisabled()) {
                return false;
            }
            recommendButtonLock.lock();
            var isRecommended = $recommendAction.data('recommend');
            var message = Translator.trans(isRecommended ? 'topic.confirm_cancel_recommend_the_topic' : 'topic.confirm_recommend_the_topic');

            _util2.default.dialog.confirm(message).then(function () {
                _util2.default.request('topic.toggleRecommend', window.topicId).done(function (response) {
                    var message = Translator.trans(response.is_recommended ? 'topic.topic_has_been_recommend' : 'topic.topic_has_been_cancel_recommend');
                    _util2.default.dialog.message(message).flash(2, function () {
                        location.reload();
                    });
                }).fail(function (response) {
                    _util2.default.dialog.message(response.responseJSON.error).flash(3);
                }).always(function () {
                    recommendButtonLock.release();
                });
            }, function () {
                recommendButtonLock.release();
            });
        });
        //置顶位
        var topButtonLock = (0, _buttonLock2.default)($topAction);
        $topAction.on('click', function () {
            if (topButtonLock.isDisabled()) {
                return false;
            }
            topButtonLock.lock();
            var isTop = $topAction.data('is-top');
            var message = Translator.trans(isTop ? 'topic.confirm_cancel_set_top_the_topic' : 'topic.confirm_set_top_the_topic');

            _util2.default.dialog.confirm(message).then(function () {
                _util2.default.request('topic.toggleTop', window.topicId).done(function (response) {
                    var message = Translator.trans(response.is_top ? 'topic.topic_has_been_set_top' : 'topic.topic_has_been_cancel_set_top');
                    _util2.default.dialog.message(message).flash(2, function () {
                        location.reload();
                    });
                }).fail(function (response) {
                    _util2.default.dialog.message(response.responseJSON.error).flash(3);
                }).always(function () {
                    topButtonLock.release();
                });
            }, function () {
                topButtonLock.release();
            });
        });

        //投票
        var voteButtonLock = (0, _buttonLock2.default)($voteAction);
        $voteAction.on('click', function () {
            if (voteButtonLock.isDisabled()) {
                return false;
            }
            voteButtonLock.lock();
            _util2.default.request('topic.vote', window.topicId).done(function (response) {
                var $number = $voteAction.find('.number');
                $number.html(response.vote_count);
                if (response.vote_count > 0) {
                    $number.removeClass('hidden');
                } else {
                    $number.addClass('hidden');
                }
                //已经投票的，变成可投票状态
                if (response.is_voted) {
                    $voteAction.find('.fa').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
                    $voteAction.data('voted', true);
                    //加一特效
                    var $increase = $('<div class="one-increase">+1</div>');
                    $increase.insertBefore($voteAction);
                    $increase.addClass('fadeOutUp animated');
                } else {
                    $voteAction.find('.fa').removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up');
                    $voteAction.data('voted', false);
                }
            }).fail(function (response) {
                _util2.default.dialog.message(response.responseJSON.error).flash(3);
            }).always(function () {
                voteButtonLock.release();
            });
        });
    })($);

    //回复窗口
    (function () {
        var $replyTopic = $('#reply-topic');
        var $addReplyForm = $('#add-reply-form');
        var $repliesPanel = $('#reply-list');
        var editor = void 0;
        //form 表单
        if ($addReplyForm.length > 0) {
            var $replyBody = $('#reply_original_body');
            var $preview = $replyTopic.find('[data-action="preview"]');
            var $previewPanel = $replyTopic.find('[data-role="preview-panel"]');
            var $submitBtn = $addReplyForm.find('[data-role="submit-form"]');
            editor = new _editor2.default($replyBody, $preview, $previewPanel);
            var replyTopicLock = (0, _buttonLock2.default)($submitBtn);
            //添加回复表单提交
            $addReplyForm.on('submit', function () {
                if (replyTopicLock.isDisabled()) {
                    return false;
                }
                var body = editor.getContent();
                if (body.length === 0) {
                    _util2.default.dialog.message(Translator.trans('ui.please_fill_in_content')).flash();
                    return false;
                }
                replyTopicLock.lock();
                _util2.default.request('topic.addReply', window.topicId, $addReplyForm).success(function (response) {
                    $replyBody.val('');
                    _util2.default.dialog.message(Translator.trans('post.reply_success')).flash(0.5, function () {
                        return location.reload();
                    });
                }).complete(function () {
                    replyTopicLock.release();
                });
                return false;
            });
        }

        //Reply list
        $repliesPanel.find('[data-role="reply"]').each(function () {
            var $this = $(this);
            var replyId = $this.data('reply-id');
            var username = $this.data('username');
            //回复层主
            if (editor) {
                $this.find('[data-action="mention"]').on('click', function () {
                    editor.appendContent('@' + username + ' ');
                    _util2.default.goHash('#add-reply-form');
                });
            }
            //删除回复
            var $removeAction = $this.find('[data-action="remove"]');
            var buttonLock = (0, _buttonLock2.default)($removeAction);
            $removeAction.on('click', function () {
                if (buttonLock.isDisabled()) {
                    return false;
                }
                buttonLock.lock();
                _util2.default.dialog.confirm(Translator.trans('topic.confirm_remove_the_comment')).then(function () {
                    _util2.default.request('topicReply.delete', replyId).done(function () {
                        $this.fadeOut();
                    }).fail(function (response) {
                        _util2.default.dialog.message(response.responseJSON.error).flash(3);
                    }).always(function () {
                        buttonLock.release();
                    });
                }, function () {
                    buttonLock.release();
                });
            });
            //点赞
            var $voteAction = $this.find('[data-action="vote"]');
            var voteLock = (0, _buttonLock2.default)($voteAction);
            var $icon = $voteAction.find('.fa');
            $voteAction.on('click', function () {
                if (voteLock.isDisabled()) {
                    return false;
                }
                voteLock.lock();
                $icon.removeClass('wobble animated');
                _util2.default.request('topicReply.vote', replyId).done(function (response) {
                    var $number = $voteAction.find('.number');

                    $number.html(response.vote_count);
                    if (response.vote_count > 0) {
                        $number.removeClass('hidden');
                    } else {
                        $number.addClass('hidden');
                    }
                    //已经投票的，变成可投票状态
                    if (response.is_voted) {
                        $icon.removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
                        $voteAction.data('voted', true);
                        //加一特效
                        // const $increase = $('<div class="one-increase">+1</div>');
                        // $increase.insertBefore($voteAction);
                        // $increase.addClass('fadeOutUp animated');
                    } else {
                        $icon.removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up');
                        $voteAction.data('voted', false);
                    }
                    $icon.addClass('wobble animated');
                }).fail(function (response) {
                    _util2.default.dialog.message(response.responseJSON.error).flash(3);
                }).always(function () {
                    voteLock.release();
                });
            });
        });
    })();
})($);

/**
 * 添加topic
 */
(function ($) {
    var editorElement = document.getElementById("topic_originalBody");
    var $preview = $('[data-action="preview"]');
    var $previewPanel = $('[data-role="preview-panel"]');
    var $topicTitle = $('#topic_title');
    var $topicBody = $(editorElement);

    if (editorElement) {
        var editor = new _codemirrorEditor2.default($topicBody, $preview, $previewPanel);
        //提交表单
        $('#add-topic-form').on('submit', function () {
            if ($topicTitle.val().length === 0 || editor.getContent().length === 0) {
                _util2.default.dialog.message(Translator.trans('topic.please_fill_in_blank')).flash();
                return false;
            }
            $topicBody.val(editor.getContent());

            _store2.default.remove('topic_draft');
        });

        //tags input
        var $topicThreads = $('#topic_threads');
        $topicThreads.selectize({
            valueField: 'name',
            labelField: 'name',
            searchField: 'name',
            create: true,
            createOnBlur: true,
            placeholder: Translator.trans('topic.add_topic'),
            maxItems: 5,
            load: function load(query, callback) {
                if (!query.length) return callback();
                _util2.default.request('thread.autocomplete', {}, { 'query': query }).done(function (response) {
                    callback(response.threads.slice(0, 10));
                });
            }
        });
        var selectize = $topicThreads.get(0).selectize;
        //recommend thread
        $('#add-topic').find('[data-role="recommend-threads"] a').on('click', function () {
            var value = $(this).text();
            selectize.createItem(value);
            selectize.addItem(value, false);
        });
    }
})($);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./assets/modules/ajaxtab.js":
/*!***********************************!*\
  !*** ./assets/modules/ajaxtab.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

__webpack_require__(/*! jquery-pjax */ "./node_modules/jquery-pjax/jquery.pjax.js");

var _util = __webpack_require__(/*! ../modules/util.js */ "./assets/modules/util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AjaxTab = function AjaxTab($element, options) {
    var _this = this;

    (0, _classCallCheck3.default)(this, AjaxTab);

    $.pjax.defaults.timeout = 50000;

    this.element = $element;
    this.container = $(options.container);
    this.element.pjax('li a', options.container);
    this.options = options;
    this.element.on('pjax:click', function (event) {
        var $target = $(event.target);
        var $selfTab = $target.parent();
        $selfTab.siblings().removeClass('active').end().addClass('active');
    });

    this.loader = $(this.options.loader);

    //绑定事件
    $(document).on('pjax:beforeSend', function (event, xhr, options) {
        if (typeof _this.options.before === 'function') {
            _this.options.before.call(_this, _this.container, xhr);
        }
        _this.loader.show();
    });

    $(document).on('pjax:success', function (event, data, status, xhr, options) {
        if (typeof _this.options.success === 'function') {
            _this.options.success.call(_this, _this.container, xhr, data, status, options);
        }
    });

    $(document).on('pjax:complete', function (event, xhr, textStatus, options) {
        if (typeof _this.options.complete === 'function') {
            _this.options.complete.call(_this, event, xhr, textStatus, options);
        }
        _this.loader.hide();
    });

    // Util.htmlPlaceholder(this.container);
};

exports.default = AjaxTab;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./assets/modules/inline-attachment.js":
/*!*********************************************!*\
  !*** ./assets/modules/inline-attachment.js ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

__webpack_require__(/*! inline-attachment/src/inline-attachment.js */ "./node_modules/inline-attachment/src/inline-attachment.js");

__webpack_require__(/*! inline-attachment/src/jquery.inline-attachment.js */ "./node_modules/inline-attachment/src/jquery.inline-attachment.js");

__webpack_require__(/*! inline-attachment/src/codemirror-4.inline-attachment.js */ "./node_modules/inline-attachment/src/codemirror-4.inline-attachment.js");

var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _util = __webpack_require__(/*! ./util.js */ "./assets/modules/util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var InlineAttachment = function InlineAttachment(element, options) {
    (0, _classCallCheck3.default)(this, InlineAttachment);

    options = _jquery2.default.extend({
        uploadUrl: _util2.default.route.getRoutePath('upload'),
        jsonFieldName: 'path'
    }, options);
    if (element instanceof _jquery2.default) {
        element.inlineattachment(options);
    } else {
        inlineAttachment.editors.codemirror4.attach(element, options);
    }
};

exports.default = InlineAttachment;

/***/ }),

/***/ "./assets/modules/md-editor/base-editor.js":
/*!*************************************************!*\
  !*** ./assets/modules/md-editor/base-editor.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _marked = __webpack_require__(/*! marked */ "./node_modules/marked/lib/marked.js");

var _marked2 = _interopRequireDefault(_marked);

var _textcomplete = __webpack_require__(/*! textcomplete/lib/textcomplete */ "./node_modules/textcomplete/lib/textcomplete.js");

var _textcomplete2 = _interopRequireDefault(_textcomplete);

var _textarea = __webpack_require__(/*! textcomplete/lib/textarea */ "./node_modules/textcomplete/lib/textarea.js");

var _textarea2 = _interopRequireDefault(_textarea);

var _emojione = __webpack_require__(/*! emojione */ "./node_modules/emojione/lib/js/emojione.js");

var _emojione2 = _interopRequireDefault(_emojione);

var _twemoji = __webpack_require__(/*! twemoji */ "./node_modules/twemoji/2/twemoji.npm.js");

var _twemoji2 = _interopRequireDefault(_twemoji);

var _highlight = __webpack_require__(/*! highlight.js */ "./node_modules/highlight.js/lib/index.js");

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_marked2.default.setOptions({
    highlight: function highlight(code) {
        return _highlight2.default.highlightAuto(code).value;
    },
    sanitize: true
});

var BaseEditor = function () {
    function BaseEditor($textarea, $preview, $previewContainer) {
        var _this = this;

        (0, _classCallCheck3.default)(this, BaseEditor);

        this.textarea = $textarea;
        this.preview = $preview;
        this.previewContainer = $previewContainer;
        this.textCompleteTextArea = new _textarea2.default(this.textarea[0]);
        this.textComplete = new _textcomplete2.default(this.textCompleteTextArea);
        this.preview.on('click', function () {
            _this.previewContainer.toggleClass('hidden');
        });
    }

    (0, _createClass3.default)(BaseEditor, [{
        key: 'getPlugins',
        value: function getPlugins() {
            return [];
        }
    }, {
        key: 'rePreview',
        value: function rePreview() {
            this.previewContainer.html(this.getHtml() || Translator.trans('editor.no_preview'));
        }

        /**
         * 获取编辑器内容
         * @returns {*}
         */

    }, {
        key: 'getContent',
        value: function getContent() {
            return this.textarea.val();
        }

        /**
         * 设置内容
         * @param content
         * @returns {MDEditor}
         */

    }, {
        key: 'setContent',
        value: function setContent(content) {
            this.textarea.val(content);
            return this;
        }
    }, {
        key: 'appendContent',
        value: function appendContent(content) {
            this.setContent(this.getContent() + content);
            return this;
        }

        /**
         * 获取解析之后的html内容
         * @returns {*}
         */

    }, {
        key: 'getHtml',
        value: function getHtml() {
            return _twemoji2.default.parse(_emojione2.default.shortnameToUnicode((0, _marked2.default)(this.getContent())));
        }

        /**
         * 启动插件
         */

    }, {
        key: 'enablePlugin',
        value: function enablePlugin() {
            var _this2 = this;

            this.getPlugins().forEach(function (plugin) {
                var callback = plugin;
                if ((typeof plugin === 'undefined' ? 'undefined' : (0, _typeof3.default)(plugin)) === 'object') {
                    callback = plugin.callback;
                }
                callback.call(_this2);
            });
            return this;
        }
    }]);
    return BaseEditor;
}();

exports.default = BaseEditor;

/***/ }),

/***/ "./assets/modules/md-editor/codemirror-editor.js":
/*!*******************************************************!*\
  !*** ./assets/modules/md-editor/codemirror-editor.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseEditor = __webpack_require__(/*! ./base-editor.js */ "./assets/modules/md-editor/base-editor.js");

var _baseEditor2 = _interopRequireDefault(_baseEditor);

var _codemirror = __webpack_require__(/*! codemirror */ "./node_modules/codemirror/lib/codemirror.js");

var _codemirror2 = _interopRequireDefault(_codemirror);

__webpack_require__(/*! codemirror/mode/markdown/markdown.js */ "./node_modules/codemirror/mode/markdown/markdown.js");

var _draftPlugin = __webpack_require__(/*! ./draft-plugin.js */ "./assets/modules/md-editor/draft-plugin.js");

var _draftPlugin2 = _interopRequireDefault(_draftPlugin);

var _inlineAttachmentPlugin = __webpack_require__(/*! ./inline-attachment-plugin.js */ "./assets/modules/md-editor/inline-attachment-plugin.js");

var _inlineAttachmentPlugin2 = _interopRequireDefault(_inlineAttachmentPlugin);

var _blueimpMd = __webpack_require__(/*! blueimp-md5 */ "./node_modules/blueimp-md5/js/md5.js");

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CodeMirrorEditor = function (_BaseEditor) {
    (0, _inherits3.default)(CodeMirrorEditor, _BaseEditor);

    function CodeMirrorEditor($textarea, $preview, $previewContainer) {
        (0, _classCallCheck3.default)(this, CodeMirrorEditor);

        var _this = (0, _possibleConstructorReturn3.default)(this, (CodeMirrorEditor.__proto__ || Object.getPrototypeOf(CodeMirrorEditor)).call(this, $textarea, $preview, $previewContainer));

        _this.codeMirrorEditor = _codemirror2.default.fromTextArea($textarea[0], {
            mode: 'markdown',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 4
            // theme: 'yeti'
        });
        _this.handleContentChange();
        _this.enablePlugin();
        return _this;
    }

    (0, _createClass3.default)(CodeMirrorEditor, [{
        key: 'getContent',
        value: function getContent() {
            return this.codeMirrorEditor.getValue();
        }
    }, {
        key: 'setContent',
        value: function setContent(content) {
            this.codeMirrorEditor.setValue(content);
        }
    }, {
        key: 'handleContentChange',
        value: function handleContentChange() {
            var _this2 = this;

            this.codeMirrorEditor.on('change', function () {
                var html = _this2.getHtml();
                _this2.previewContainer.html(html || Translator.trans('editor.no_preview'));
            });
        }
    }, {
        key: 'getPlugins',
        value: function getPlugins() {
            var _this3 = this;

            return [function () {
                _inlineAttachmentPlugin2.default.call(_this3, _this3.codeMirrorEditor);
            }, function () {
                _draftPlugin2.default.call(_this3, {
                    key: 'topic_' + (0, _blueimpMd2.default)(location.pathname)
                });
            }];
        }
    }]);
    return CodeMirrorEditor;
}(_baseEditor2.default);

exports.default = CodeMirrorEditor;

/***/ }),

/***/ "./assets/modules/md-editor/draft-plugin.js":
/*!**************************************************!*\
  !*** ./assets/modules/md-editor/draft-plugin.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (options) {
    var _this = this;

    options = _jquery2.default.extend({
        key: '_draft',
        titleElement: null
    }, options);

    //还原draft
    var draft = _store2.default.get(options.key) || {};
    if (draft.body) {
        this.setContent(draft.body);
    }
    this.codeMirrorEditor.on('change', function () {
        var markdown = _this.getContent();
        //设置draft
        _store2.default.set(options.key, {
            title: options.titleElement ? options.titleElement.val() : null,
            body: markdown
        });
    });
};

var _jquery = __webpack_require__(/*! jquery */ "jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _store = __webpack_require__(/*! store */ "./node_modules/store/dist/store.legacy.js");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./assets/modules/md-editor/editor.js":
/*!********************************************!*\
  !*** ./assets/modules/md-editor/editor.js ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _mentionPlugin = __webpack_require__(/*! ./mention-plugin.js */ "./assets/modules/md-editor/mention-plugin.js");

var _mentionPlugin2 = _interopRequireDefault(_mentionPlugin);

var _emojiPlugin = __webpack_require__(/*! ./emoji-plugin.js */ "./assets/modules/md-editor/emoji-plugin.js");

var _emojiPlugin2 = _interopRequireDefault(_emojiPlugin);

var _inlineAttachmentPlugin = __webpack_require__(/*! ./inline-attachment-plugin.js */ "./assets/modules/md-editor/inline-attachment-plugin.js");

var _inlineAttachmentPlugin2 = _interopRequireDefault(_inlineAttachmentPlugin);

var _baseEditor = __webpack_require__(/*! ./base-editor.js */ "./assets/modules/md-editor/base-editor.js");

var _baseEditor2 = _interopRequireDefault(_baseEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Editor = function (_BaseEditor) {
    (0, _inherits3.default)(Editor, _BaseEditor);

    function Editor($textarea, $preview, $previewContainer) {
        (0, _classCallCheck3.default)(this, Editor);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, $textarea, $preview, $previewContainer));

        _this.handleContentChange();
        _this.enablePlugin();
        return _this;
    }

    (0, _createClass3.default)(Editor, [{
        key: 'getPlugins',
        value: function getPlugins() {
            return [_mentionPlugin2.default, _emojiPlugin2.default, _inlineAttachmentPlugin2.default];
        }
    }, {
        key: 'handleContentChange',
        value: function handleContentChange() {
            var _this2 = this;

            this.textarea.on('keyup', function () {
                _this2.rePreview();
            });
        }
    }]);
    return Editor;
}(_baseEditor2.default);

exports.default = Editor;

/***/ }),

/***/ "./assets/modules/md-editor/emoji-plugin.js":
/*!**************************************************!*\
  !*** ./assets/modules/md-editor/emoji-plugin.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _twemoji = __webpack_require__(/*! twemoji */ "./node_modules/twemoji/2/twemoji.npm.js");

var _twemoji2 = _interopRequireDefault(_twemoji);

var _lodash = __webpack_require__(/*! lodash */ "lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emojis = __webpack_require__(/*! emojilib/emojis.json */ "./node_modules/emojilib/emojis.json");


var emoji = function emoji() {

    _lodash2.default.each(emojis, function (emoji, name) {
        emoji.keywords.unshift(name);
    });

    this.textComplete.register([{
        id: 'emoji',
        match: /(^|\s)[:：]([a-z0-9+\-\_]*)$/,
        search: function search(term, callback) {
            var emojiNames = [];
            _lodash2.default.forEach(emojis, function (emoji, name) {
                if (emoji.keywords.join(' ').toLowerCase().indexOf(term.toLowerCase()) > -1) {
                    emojiNames.push(name);
                }
            });
            callback(emojiNames);
        },
        template: function template(name) {
            return _twemoji2.default.parse(emojis[name].char) + ' ' + name;
        },
        replace: function replace(name) {
            return '$1:' + name + ': ';
        }
    }]);
};

exports.default = emoji;

/***/ }),

/***/ "./assets/modules/md-editor/inline-attachment-plugin.js":
/*!**************************************************************!*\
  !*** ./assets/modules/md-editor/inline-attachment-plugin.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (element) {
    var _this = this;

    // console.log(this);
    var inlineAttachment = new _inlineAttachment2.default(element || this.textarea, {
        onFileUploaded: function onFileUploaded(response) {
            _this.rePreview();
        }
    });
};

var _inlineAttachment = __webpack_require__(/*! ../inline-attachment.js */ "./assets/modules/inline-attachment.js");

var _inlineAttachment2 = _interopRequireDefault(_inlineAttachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),

/***/ "./assets/modules/md-editor/mention-plugin.js":
/*!****************************************************!*\
  !*** ./assets/modules/md-editor/mention-plugin.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, _) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var users = findUser();
    this.textComplete.register([{
        match: /\B@(\S*)$/,
        search: function search(term, callback) {
            callback(users.filter(function (username) {
                return username.startsWith(term) || username.toLowerCase().startsWith(term.toLowerCase());
            }));
        },
        index: 1,
        replace: function replace(mention) {
            return '@' + mention + ' ';
        }
    }]);
};

function findUser() {
    var users = $('[data-username]').map(function () {
        return $(this).data('username');
    });
    return _.uniq(users);
}

;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "jquery"), __webpack_require__(/*! lodash */ "lodash")))

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/create.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/create.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ "./node_modules/core-js/library/fn/object/create.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js":
/*!***********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/set-prototype-of.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ "./node_modules/core-js/library/fn/object/set-prototype-of.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/inherits.js":
/*!********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/inherits.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ "./node_modules/babel-runtime/core-js/object/set-prototype-of.js");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ "./node_modules/babel-runtime/core-js/object/create.js");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),

/***/ "./node_modules/babel-runtime/helpers/possibleConstructorReturn.js":
/*!*************************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \*************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),

/***/ "./node_modules/blueimp-md5/js/md5.js":
/*!********************************************!*\
  !*** ./node_modules/blueimp-md5/js/md5.js ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[((len + 64) >>> 9 << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return md5
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
})(this)


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/create.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/create.js ***!
  \**********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ "./node_modules/core-js/library/modules/es6.object.create.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/set-prototype-of.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/set-prototype-of.js ***!
  \********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.setPrototypeOf;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_set-proto.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_set-proto.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js")(Function.call, __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/library/modules/_object-gopd.js").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.create.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.create.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js") });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.set-prototype-of.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \*****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(/*! ./_set-proto */ "./node_modules/core-js/library/modules/_set-proto.js").set });


/***/ }),

/***/ "./node_modules/emojilib/emojis.json":
/*!*******************************************!*\
  !*** ./node_modules/emojilib/emojis.json ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = {"100":{"keywords":["score","perfect","numbers","century","exam","quiz","test","pass","hundred"],"char":"💯","fitzpatrick_scale":false,"category":"symbols"},"1234":{"keywords":["numbers","blue-square"],"char":"🔢","fitzpatrick_scale":false,"category":"symbols"},"grinning":{"keywords":["face","smile","happy","joy",":D","grin"],"char":"😀","fitzpatrick_scale":false,"category":"people"},"grimacing":{"keywords":["face","grimace","teeth"],"char":"😬","fitzpatrick_scale":false,"category":"people"},"grin":{"keywords":["face","happy","smile","joy","kawaii"],"char":"😁","fitzpatrick_scale":false,"category":"people"},"joy":{"keywords":["face","cry","tears","weep","happy","happytears","haha"],"char":"😂","fitzpatrick_scale":false,"category":"people"},"rofl":{"keywords":["face","rolling","floor","laughing","lol","haha"],"char":"🤣","fitzpatrick_scale":false,"category":"people"},"smiley":{"keywords":["face","happy","joy","haha",":D",":)","smile","funny"],"char":"😃","fitzpatrick_scale":false,"category":"people"},"smile":{"keywords":["face","happy","joy","funny","haha","laugh","like",":D",":)"],"char":"😄","fitzpatrick_scale":false,"category":"people"},"sweat_smile":{"keywords":["face","hot","happy","laugh","sweat","smile","relief"],"char":"😅","fitzpatrick_scale":false,"category":"people"},"laughing":{"keywords":["happy","joy","lol","satisfied","haha","face","glad","XD","laugh"],"char":"😆","fitzpatrick_scale":false,"category":"people"},"innocent":{"keywords":["face","angel","heaven","halo"],"char":"😇","fitzpatrick_scale":false,"category":"people"},"wink":{"keywords":["face","happy","mischievous","secret",";)","smile","eye"],"char":"😉","fitzpatrick_scale":false,"category":"people"},"blush":{"keywords":["face","smile","happy","flushed","crush","embarrassed","shy","joy"],"char":"😊","fitzpatrick_scale":false,"category":"people"},"slightly_smiling_face":{"keywords":["face","smile"],"char":"🙂","fitzpatrick_scale":false,"category":"people"},"upside_down_face":{"keywords":["face","flipped","silly","smile"],"char":"🙃","fitzpatrick_scale":false,"category":"people"},"relaxed":{"keywords":["face","blush","massage","happiness"],"char":"☺️","fitzpatrick_scale":false,"category":"people"},"yum":{"keywords":["happy","joy","tongue","smile","face","silly","yummy","nom","delicious","savouring"],"char":"😋","fitzpatrick_scale":false,"category":"people"},"relieved":{"keywords":["face","relaxed","phew","massage","happiness"],"char":"😌","fitzpatrick_scale":false,"category":"people"},"heart_eyes":{"keywords":["face","love","like","affection","valentines","infatuation","crush","heart"],"char":"😍","fitzpatrick_scale":false,"category":"people"},"kissing_heart":{"keywords":["face","love","like","affection","valentines","infatuation","kiss"],"char":"😘","fitzpatrick_scale":false,"category":"people"},"kissing":{"keywords":["love","like","face","3","valentines","infatuation","kiss"],"char":"😗","fitzpatrick_scale":false,"category":"people"},"kissing_smiling_eyes":{"keywords":["face","affection","valentines","infatuation","kiss"],"char":"😙","fitzpatrick_scale":false,"category":"people"},"kissing_closed_eyes":{"keywords":["face","love","like","affection","valentines","infatuation","kiss"],"char":"😚","fitzpatrick_scale":false,"category":"people"},"stuck_out_tongue_winking_eye":{"keywords":["face","prank","childish","playful","mischievous","smile","wink","tongue"],"char":"😜","fitzpatrick_scale":false,"category":"people"},"zany":{"keywords":["face","goofy","crazy"],"char":"🤪","fitzpatrick_scale":false,"category":"people"},"raised_eyebrow":{"keywords":["face","distrust","scepticism","disapproval","disbelief","surprise"],"char":"🤨","fitzpatrick_scale":false,"category":"people"},"monocle":{"keywords":["face","stuffy","wealthy"],"char":"🧐","fitzpatrick_scale":false,"category":"people"},"stuck_out_tongue_closed_eyes":{"keywords":["face","prank","playful","mischievous","smile","tongue"],"char":"😝","fitzpatrick_scale":false,"category":"people"},"stuck_out_tongue":{"keywords":["face","prank","childish","playful","mischievous","smile","tongue"],"char":"😛","fitzpatrick_scale":false,"category":"people"},"money_mouth_face":{"keywords":["face","rich","dollar","money"],"char":"🤑","fitzpatrick_scale":false,"category":"people"},"nerd_face":{"keywords":["face","nerdy","geek","dork"],"char":"🤓","fitzpatrick_scale":false,"category":"people"},"sunglasses":{"keywords":["face","cool","smile","summer","beach","sunglass"],"char":"😎","fitzpatrick_scale":false,"category":"people"},"star_struck":{"keywords":["face","smile","starry","eyes","grinning"],"char":"🤩","fitzpatrick_scale":false,"category":"people"},"clown_face":{"keywords":["face"],"char":"🤡","fitzpatrick_scale":false,"category":"people"},"cowboy_hat_face":{"keywords":["face","cowgirl","hat"],"char":"🤠","fitzpatrick_scale":false,"category":"people"},"hugs":{"keywords":["face","smile","hug"],"char":"🤗","fitzpatrick_scale":false,"category":"people"},"smirk":{"keywords":["face","smile","mean","prank","smug","sarcasm"],"char":"😏","fitzpatrick_scale":false,"category":"people"},"no_mouth":{"keywords":["face","hellokitty"],"char":"😶","fitzpatrick_scale":false,"category":"people"},"neutral_face":{"keywords":["indifference","meh",":|","neutral"],"char":"😐","fitzpatrick_scale":false,"category":"people"},"expressionless":{"keywords":["face","indifferent","-_-","meh","deadpan"],"char":"😑","fitzpatrick_scale":false,"category":"people"},"unamused":{"keywords":["indifference","bored","straight face","serious","sarcasm"],"char":"😒","fitzpatrick_scale":false,"category":"people"},"roll_eyes":{"keywords":["face","eyeroll","frustrated"],"char":"🙄","fitzpatrick_scale":false,"category":"people"},"thinking":{"keywords":["face","hmmm","think","consider"],"char":"🤔","fitzpatrick_scale":false,"category":"people"},"lying_face":{"keywords":["face","lie","pinocchio"],"char":"🤥","fitzpatrick_scale":false,"category":"people"},"hand_over_mouth":{"keywords":["face","whoops","shock","surprise"],"char":"🤭","fitzpatrick_scale":false,"category":"people"},"shushing":{"keywords":["face","quiet","shhh"],"char":"🤫","fitzpatrick_scale":false,"category":"people"},"symbols_over_mouth":{"keywords":["face","swearing","cursing","cussing","profanity","expletive"],"char":"🤬","fitzpatrick_scale":false,"category":"people"},"exploding_head":{"keywords":["face","shocked","mind","blown"],"char":"🤯","fitzpatrick_scale":false,"category":"people"},"flushed":{"keywords":["face","blush","shy","flattered"],"char":"😳","fitzpatrick_scale":false,"category":"people"},"disappointed":{"keywords":["face","sad","upset","depressed",":("],"char":"😞","fitzpatrick_scale":false,"category":"people"},"worried":{"keywords":["face","concern","nervous",":("],"char":"😟","fitzpatrick_scale":false,"category":"people"},"angry":{"keywords":["mad","face","annoyed","frustrated"],"char":"😠","fitzpatrick_scale":false,"category":"people"},"rage":{"keywords":["angry","mad","hate","despise"],"char":"😡","fitzpatrick_scale":false,"category":"people"},"pensive":{"keywords":["face","sad","depressed","upset"],"char":"😔","fitzpatrick_scale":false,"category":"people"},"confused":{"keywords":["face","indifference","huh","weird","hmmm",":/"],"char":"😕","fitzpatrick_scale":false,"category":"people"},"slightly_frowning_face":{"keywords":["face","frowning","disappointed","sad","upset"],"char":"🙁","fitzpatrick_scale":false,"category":"people"},"frowning_face":{"keywords":["face","sad","upset","frown"],"char":"☹","fitzpatrick_scale":false,"category":"people"},"persevere":{"keywords":["face","sick","no","upset","oops"],"char":"😣","fitzpatrick_scale":false,"category":"people"},"confounded":{"keywords":["face","confused","sick","unwell","oops",":S"],"char":"😖","fitzpatrick_scale":false,"category":"people"},"tired_face":{"keywords":["sick","whine","upset","frustrated"],"char":"😫","fitzpatrick_scale":false,"category":"people"},"weary":{"keywords":["face","tired","sleepy","sad","frustrated","upset"],"char":"😩","fitzpatrick_scale":false,"category":"people"},"triumph":{"keywords":["face","gas","phew","proud","pride"],"char":"😤","fitzpatrick_scale":false,"category":"people"},"open_mouth":{"keywords":["face","surprise","impressed","wow","whoa",":O"],"char":"😮","fitzpatrick_scale":false,"category":"people"},"scream":{"keywords":["face","munch","scared","omg"],"char":"😱","fitzpatrick_scale":false,"category":"people"},"fearful":{"keywords":["face","scared","terrified","nervous","oops","huh"],"char":"😨","fitzpatrick_scale":false,"category":"people"},"cold_sweat":{"keywords":["face","nervous","sweat"],"char":"😰","fitzpatrick_scale":false,"category":"people"},"hushed":{"keywords":["face","woo","shh"],"char":"😯","fitzpatrick_scale":false,"category":"people"},"frowning":{"keywords":["face","aw","what"],"char":"😦","fitzpatrick_scale":false,"category":"people"},"anguished":{"keywords":["face","stunned","nervous"],"char":"😧","fitzpatrick_scale":false,"category":"people"},"cry":{"keywords":["face","tears","sad","depressed","upset",":'("],"char":"😢","fitzpatrick_scale":false,"category":"people"},"disappointed_relieved":{"keywords":["face","phew","sweat","nervous"],"char":"😥","fitzpatrick_scale":false,"category":"people"},"drooling_face":{"keywords":["face"],"char":"🤤","fitzpatrick_scale":false,"category":"people"},"sleepy":{"keywords":["face","tired","rest","nap"],"char":"😪","fitzpatrick_scale":false,"category":"people"},"sweat":{"keywords":["face","hot","sad","tired","exercise"],"char":"😓","fitzpatrick_scale":false,"category":"people"},"sob":{"keywords":["face","cry","tears","sad","upset","depressed"],"char":"😭","fitzpatrick_scale":false,"category":"people"},"dizzy_face":{"keywords":["spent","unconscious","xox","dizzy"],"char":"😵","fitzpatrick_scale":false,"category":"people"},"astonished":{"keywords":["face","xox","surprised","poisoned"],"char":"😲","fitzpatrick_scale":false,"category":"people"},"zipper_mouth_face":{"keywords":["face","sealed","zipper","secret"],"char":"🤐","fitzpatrick_scale":false,"category":"people"},"nauseated_face":{"keywords":["face","vomit","gross","green","sick","throw up","ill"],"char":"🤢","fitzpatrick_scale":false,"category":"people"},"sneezing_face":{"keywords":["face","gesundheit","sneeze","sick","allergy"],"char":"🤧","fitzpatrick_scale":false,"category":"people"},"vomiting":{"keywords":["face","sick"],"char":"🤮","fitzpatrick_scale":false,"category":"people"},"mask":{"keywords":["face","sick","ill","disease"],"char":"😷","fitzpatrick_scale":false,"category":"people"},"face_with_thermometer":{"keywords":["sick","temperature","thermometer","cold","fever"],"char":"🤒","fitzpatrick_scale":false,"category":"people"},"face_with_head_bandage":{"keywords":["injured","clumsy","bandage","hurt"],"char":"🤕","fitzpatrick_scale":false,"category":"people"},"sleeping":{"keywords":["face","tired","sleepy","night","zzz"],"char":"😴","fitzpatrick_scale":false,"category":"people"},"zzz":{"keywords":["sleepy","tired","dream"],"char":"💤","fitzpatrick_scale":false,"category":"people"},"poop":{"keywords":["hankey","shitface","fail","turd","shit"],"char":"💩","fitzpatrick_scale":false,"category":"people"},"smiling_imp":{"keywords":["devil","horns"],"char":"😈","fitzpatrick_scale":false,"category":"people"},"imp":{"keywords":["devil","angry","horns"],"char":"👿","fitzpatrick_scale":false,"category":"people"},"japanese_ogre":{"keywords":["monster","red","mask","halloween","scary","creepy","devil","demon","japanese","ogre"],"char":"👹","fitzpatrick_scale":false,"category":"people"},"japanese_goblin":{"keywords":["red","evil","mask","monster","scary","creepy","japanese","goblin"],"char":"👺","fitzpatrick_scale":false,"category":"people"},"skull":{"keywords":["dead","skeleton","creepy","death"],"char":"💀","fitzpatrick_scale":false,"category":"people"},"ghost":{"keywords":["halloween","spooky","scary"],"char":"👻","fitzpatrick_scale":false,"category":"people"},"alien":{"keywords":["UFO","paul","weird","outer_space"],"char":"👽","fitzpatrick_scale":false,"category":"people"},"robot":{"keywords":["computer","machine","bot"],"char":"🤖","fitzpatrick_scale":false,"category":"people"},"smiley_cat":{"keywords":["animal","cats","happy","smile"],"char":"😺","fitzpatrick_scale":false,"category":"people"},"smile_cat":{"keywords":["animal","cats","smile"],"char":"😸","fitzpatrick_scale":false,"category":"people"},"joy_cat":{"keywords":["animal","cats","haha","happy","tears"],"char":"😹","fitzpatrick_scale":false,"category":"people"},"heart_eyes_cat":{"keywords":["animal","love","like","affection","cats","valentines","heart"],"char":"😻","fitzpatrick_scale":false,"category":"people"},"smirk_cat":{"keywords":["animal","cats","smirk"],"char":"😼","fitzpatrick_scale":false,"category":"people"},"kissing_cat":{"keywords":["animal","cats","kiss"],"char":"😽","fitzpatrick_scale":false,"category":"people"},"scream_cat":{"keywords":["animal","cats","munch","scared","scream"],"char":"🙀","fitzpatrick_scale":false,"category":"people"},"crying_cat_face":{"keywords":["animal","tears","weep","sad","cats","upset","cry"],"char":"😿","fitzpatrick_scale":false,"category":"people"},"pouting_cat":{"keywords":["animal","cats"],"char":"😾","fitzpatrick_scale":false,"category":"people"},"palms_up":{"keywords":["hands","gesture","cupped","prayer"],"char":"🤲","fitzpatrick_scale":true,"category":"people"},"raised_hands":{"keywords":["gesture","hooray","yea","celebration","hands"],"char":"🙌","fitzpatrick_scale":true,"category":"people"},"clap":{"keywords":["hands","praise","applause","congrats","yay"],"char":"👏","fitzpatrick_scale":true,"category":"people"},"wave":{"keywords":["hands","gesture","goodbye","solong","farewell","hello","hi","palm"],"char":"👋","fitzpatrick_scale":true,"category":"people"},"call_me_hand":{"keywords":["hands","gesture"],"char":"🤙","fitzpatrick_scale":true,"category":"people"},"+1":{"keywords":["thumbsup","yes","awesome","good","agree","accept","cool","hand","like"],"char":"👍","fitzpatrick_scale":true,"category":"people"},"-1":{"keywords":["thumbsdown","no","dislike","hand"],"char":"👎","fitzpatrick_scale":true,"category":"people"},"facepunch":{"keywords":["angry","violence","fist","hit","attack","hand"],"char":"👊","fitzpatrick_scale":true,"category":"people"},"fist":{"keywords":["fingers","hand","grasp"],"char":"✊","fitzpatrick_scale":true,"category":"people"},"fist_left":{"keywords":["hand","fistbump"],"char":"🤛","fitzpatrick_scale":true,"category":"people"},"fist_right":{"keywords":["hand","fistbump"],"char":"🤜","fitzpatrick_scale":true,"category":"people"},"v":{"keywords":["fingers","ohyeah","hand","peace","victory","two"],"char":"✌","fitzpatrick_scale":true,"category":"people"},"ok_hand":{"keywords":["fingers","limbs","perfect","ok","okay"],"char":"👌","fitzpatrick_scale":true,"category":"people"},"raised_hand":{"keywords":["fingers","stop","highfive","palm","ban"],"char":"✋","fitzpatrick_scale":true,"category":"people"},"raised_back_of_hand":{"keywords":["fingers","raised","backhand"],"char":"🤚","fitzpatrick_scale":true,"category":"people"},"open_hands":{"keywords":["fingers","butterfly","hands","open"],"char":"👐","fitzpatrick_scale":true,"category":"people"},"muscle":{"keywords":["arm","flex","hand","summer","strong","biceps"],"char":"💪","fitzpatrick_scale":true,"category":"people"},"pray":{"keywords":["please","hope","wish","namaste","highfive"],"char":"🙏","fitzpatrick_scale":true,"category":"people"},"handshake":{"keywords":["agreement","shake"],"char":"🤝","fitzpatrick_scale":false,"category":"people"},"point_up":{"keywords":["hand","fingers","direction","up"],"char":"☝","fitzpatrick_scale":true,"category":"people"},"point_up_2":{"keywords":["fingers","hand","direction","up"],"char":"👆","fitzpatrick_scale":true,"category":"people"},"point_down":{"keywords":["fingers","hand","direction","down"],"char":"👇","fitzpatrick_scale":true,"category":"people"},"point_left":{"keywords":["direction","fingers","hand","left"],"char":"👈","fitzpatrick_scale":true,"category":"people"},"point_right":{"keywords":["fingers","hand","direction","right"],"char":"👉","fitzpatrick_scale":true,"category":"people"},"fu":{"keywords":["hand","fingers","rude","middle","flipping"],"char":"🖕","fitzpatrick_scale":true,"category":"people"},"raised_hand_with_fingers_splayed":{"keywords":["hand","fingers","palm"],"char":"🖐","fitzpatrick_scale":true,"category":"people"},"love_you":{"keywords":["hand","fingers","gesture"],"char":"🤟","fitzpatrick_scale":true,"category":"people"},"metal":{"keywords":["hand","fingers","evil_eye","sign_of_horns","rock_on"],"char":"🤘","fitzpatrick_scale":true,"category":"people"},"crossed_fingers":{"keywords":["good","lucky"],"char":"🤞","fitzpatrick_scale":true,"category":"people"},"vulcan_salute":{"keywords":["hand","fingers","spock","star trek"],"char":"🖖","fitzpatrick_scale":true,"category":"people"},"writing_hand":{"keywords":["lower_left_ballpoint_pen","stationery","write","compose"],"char":"✍","fitzpatrick_scale":true,"category":"people"},"selfie":{"keywords":["camera","phone"],"char":"🤳","fitzpatrick_scale":true,"category":"people"},"nail_care":{"keywords":["beauty","manicure","finger","fashion","nail"],"char":"💅","fitzpatrick_scale":true,"category":"people"},"lips":{"keywords":["mouth","kiss"],"char":"👄","fitzpatrick_scale":false,"category":"people"},"tongue":{"keywords":["mouth","playful"],"char":"👅","fitzpatrick_scale":false,"category":"people"},"ear":{"keywords":["face","hear","sound","listen"],"char":"👂","fitzpatrick_scale":true,"category":"people"},"nose":{"keywords":["smell","sniff"],"char":"👃","fitzpatrick_scale":true,"category":"people"},"eye":{"keywords":["face","look","see","watch","stare"],"char":"👁","fitzpatrick_scale":false,"category":"people"},"eyes":{"keywords":["look","watch","stalk","peek","see"],"char":"👀","fitzpatrick_scale":false,"category":"people"},"brain":{"keywords":["smart","intelligent"],"char":"🧠","fitzpatrick_scale":false,"category":"people"},"bust_in_silhouette":{"keywords":["user","person","human"],"char":"👤","fitzpatrick_scale":false,"category":"people"},"busts_in_silhouette":{"keywords":["user","person","human","group","team"],"char":"👥","fitzpatrick_scale":false,"category":"people"},"speaking_head":{"keywords":["user","person","human","sing","say","talk"],"char":"🗣","fitzpatrick_scale":false,"category":"people"},"baby":{"keywords":["child","boy","girl","toddler"],"char":"👶","fitzpatrick_scale":true,"category":"people"},"child":{"keywords":["gender-neutral","young"],"char":"🧒","fitzpatrick_scale":true,"category":"people"},"boy":{"keywords":["man","male","guy","teenager"],"char":"👦","fitzpatrick_scale":true,"category":"people"},"girl":{"keywords":["female","woman","teenager"],"char":"👧","fitzpatrick_scale":true,"category":"people"},"adult":{"keywords":["gender-neutral","person"],"char":"🧑","fitzpatrick_scale":true,"category":"people"},"man":{"keywords":["mustache","father","dad","guy","classy","sir","moustache"],"char":"👨","fitzpatrick_scale":true,"category":"people"},"woman":{"keywords":["female","girls","lady"],"char":"👩","fitzpatrick_scale":true,"category":"people"},"blonde_woman":{"keywords":["woman","female","girl","blonde","person"],"char":"👱‍♀️","fitzpatrick_scale":true,"category":"people"},"blonde_man":{"keywords":["man","male","boy","blonde","guy","person"],"char":"👱","fitzpatrick_scale":true,"category":"people"},"bearded_person":{"keywords":["person","bewhiskered"],"char":"🧔","fitzpatrick_scale":true,"category":"people"},"older_adult":{"keywords":["human","elder","senior","gender-neutral"],"char":"🧓","fitzpatrick_scale":true,"category":"people"},"older_man":{"keywords":["human","male","men","old","elder","senior"],"char":"👴","fitzpatrick_scale":true,"category":"people"},"older_woman":{"keywords":["human","female","women","lady","old","elder","senior"],"char":"👵","fitzpatrick_scale":true,"category":"people"},"man_with_gua_pi_mao":{"keywords":["male","boy","chinese"],"char":"👲","fitzpatrick_scale":true,"category":"people"},"woman_with_headscarf":{"keywords":["female","hijab","mantilla","tichel"],"char":"🧕","fitzpatrick_scale":true,"category":"people"},"woman_with_turban":{"keywords":["female","indian","hinduism","arabs","woman"],"char":"👳‍♀️","fitzpatrick_scale":true,"category":"people"},"man_with_turban":{"keywords":["male","indian","hinduism","arabs"],"char":"👳","fitzpatrick_scale":true,"category":"people"},"policewoman":{"keywords":["woman","police","law","legal","enforcement","arrest","911","female"],"char":"👮‍♀️","fitzpatrick_scale":true,"category":"people"},"policeman":{"keywords":["man","police","law","legal","enforcement","arrest","911"],"char":"👮","fitzpatrick_scale":true,"category":"people"},"construction_worker_woman":{"keywords":["female","human","wip","build","construction","worker","labor","woman"],"char":"👷‍♀️","fitzpatrick_scale":true,"category":"people"},"construction_worker_man":{"keywords":["male","human","wip","guy","build","construction","worker","labor"],"char":"👷","fitzpatrick_scale":true,"category":"people"},"guardswoman":{"keywords":["uk","gb","british","female","royal","woman"],"char":"💂‍♀️","fitzpatrick_scale":true,"category":"people"},"guardsman":{"keywords":["uk","gb","british","male","guy","royal"],"char":"💂","fitzpatrick_scale":true,"category":"people"},"female_detective":{"keywords":["human","spy","detective","female","woman"],"char":"🕵️‍♀️","fitzpatrick_scale":true,"category":"people"},"male_detective":{"keywords":["human","spy","detective"],"char":"🕵","fitzpatrick_scale":true,"category":"people"},"woman_health_worker":{"keywords":["doctor","nurse","therapist","healthcare","woman","human"],"char":"👩‍⚕️","fitzpatrick_scale":true,"category":"people"},"man_health_worker":{"keywords":["doctor","nurse","therapist","healthcare","man","human"],"char":"👨‍⚕️","fitzpatrick_scale":true,"category":"people"},"woman_farmer":{"keywords":["rancher","gardener","woman","human"],"char":"👩‍🌾","fitzpatrick_scale":true,"category":"people"},"man_farmer":{"keywords":["rancher","gardener","man","human"],"char":"👨‍🌾","fitzpatrick_scale":true,"category":"people"},"woman_cook":{"keywords":["chef","woman","human"],"char":"👩‍🍳","fitzpatrick_scale":true,"category":"people"},"man_cook":{"keywords":["chef","man","human"],"char":"👨‍🍳","fitzpatrick_scale":true,"category":"people"},"woman_student":{"keywords":["graduate","woman","human"],"char":"👩‍🎓","fitzpatrick_scale":true,"category":"people"},"man_student":{"keywords":["graduate","man","human"],"char":"👨‍🎓","fitzpatrick_scale":true,"category":"people"},"woman_singer":{"keywords":["rockstar","entertainer","woman","human"],"char":"👩‍🎤","fitzpatrick_scale":true,"category":"people"},"man_singer":{"keywords":["rockstar","entertainer","man","human"],"char":"👨‍🎤","fitzpatrick_scale":true,"category":"people"},"woman_teacher":{"keywords":["instructor","professor","woman","human"],"char":"👩‍🏫","fitzpatrick_scale":true,"category":"people"},"man_teacher":{"keywords":["instructor","professor","man","human"],"char":"👨‍🏫","fitzpatrick_scale":true,"category":"people"},"woman_factory_worker":{"keywords":["assembly","industrial","woman","human"],"char":"👩‍🏭","fitzpatrick_scale":true,"category":"people"},"man_factory_worker":{"keywords":["assembly","industrial","man","human"],"char":"👨‍🏭","fitzpatrick_scale":true,"category":"people"},"woman_technologist":{"keywords":["coder","developer","engineer","programmer","software","woman","human","laptop","computer"],"char":"👩‍💻","fitzpatrick_scale":true,"category":"people"},"man_technologist":{"keywords":["coder","developer","engineer","programmer","software","man","human","laptop","computer"],"char":"👨‍💻","fitzpatrick_scale":true,"category":"people"},"woman_office_worker":{"keywords":["business","manager","woman","human"],"char":"👩‍💼","fitzpatrick_scale":true,"category":"people"},"man_office_worker":{"keywords":["business","manager","man","human"],"char":"👨‍💼","fitzpatrick_scale":true,"category":"people"},"woman_mechanic":{"keywords":["plumber","woman","human","wrench"],"char":"👩‍🔧","fitzpatrick_scale":true,"category":"people"},"man_mechanic":{"keywords":["plumber","man","human","wrench"],"char":"👨‍🔧","fitzpatrick_scale":true,"category":"people"},"woman_scientist":{"keywords":["biologist","chemist","engineer","physicist","woman","human"],"char":"👩‍🔬","fitzpatrick_scale":true,"category":"people"},"man_scientist":{"keywords":["biologist","chemist","engineer","physicist","man","human"],"char":"👨‍🔬","fitzpatrick_scale":true,"category":"people"},"woman_artist":{"keywords":["painter","woman","human"],"char":"👩‍🎨","fitzpatrick_scale":true,"category":"people"},"man_artist":{"keywords":["painter","man","human"],"char":"👨‍🎨","fitzpatrick_scale":true,"category":"people"},"woman_firefighter":{"keywords":["fireman","woman","human"],"char":"👩‍🚒","fitzpatrick_scale":true,"category":"people"},"man_firefighter":{"keywords":["fireman","man","human"],"char":"👨‍🚒","fitzpatrick_scale":true,"category":"people"},"woman_pilot":{"keywords":["aviator","plane","woman","human"],"char":"👩‍✈️","fitzpatrick_scale":true,"category":"people"},"man_pilot":{"keywords":["aviator","plane","man","human"],"char":"👨‍✈️","fitzpatrick_scale":true,"category":"people"},"woman_astronaut":{"keywords":["space","rocket","woman","human"],"char":"👩‍🚀","fitzpatrick_scale":true,"category":"people"},"man_astronaut":{"keywords":["space","rocket","man","human"],"char":"👨‍🚀","fitzpatrick_scale":true,"category":"people"},"woman_judge":{"keywords":["justice","court","woman","human"],"char":"👩‍⚖️","fitzpatrick_scale":true,"category":"people"},"man_judge":{"keywords":["justice","court","man","human"],"char":"👨‍⚖️","fitzpatrick_scale":true,"category":"people"},"mrs_claus":{"keywords":["woman","female","xmas","mother christmas"],"char":"🤶","fitzpatrick_scale":true,"category":"people"},"santa":{"keywords":["festival","man","male","xmas","father christmas"],"char":"🎅","fitzpatrick_scale":true,"category":"people"},"sorceress":{"keywords":["woman","female","mage","witch"],"char":"🧙‍♀️","fitzpatrick_scale":true,"category":"people"},"wizard":{"keywords":["man","male","mage","sorcerer"],"char":"🧙‍♂️","fitzpatrick_scale":true,"category":"people"},"woman_elf":{"keywords":["woman","female"],"char":"🧝‍♀️","fitzpatrick_scale":true,"category":"people"},"man_elf":{"keywords":["man","male"],"char":"🧝‍♂️","fitzpatrick_scale":true,"category":"people"},"woman_vampire":{"keywords":["woman","female"],"char":"🧛‍♀️","fitzpatrick_scale":true,"category":"people"},"man_vampire":{"keywords":["man","male","dracula"],"char":"🧛‍♂️","fitzpatrick_scale":true,"category":"people"},"woman_zombie":{"keywords":["woman","female","undead","walking dead"],"char":"🧟‍♀️","fitzpatrick_scale":false,"category":"people"},"man_zombie":{"keywords":["man","male","dracula","undead","walking dead"],"char":"🧟‍♂️","fitzpatrick_scale":false,"category":"people"},"woman_genie":{"keywords":["woman","female"],"char":"🧞‍♀️","fitzpatrick_scale":false,"category":"people"},"man_genie":{"keywords":["man","male"],"char":"🧞‍♂️","fitzpatrick_scale":false,"category":"people"},"mermaid":{"keywords":["woman","female","merwoman","ariel"],"char":"🧜‍♀️","fitzpatrick_scale":false,"category":"people"},"merman":{"keywords":["man","male","triton"],"char":"🧜‍♂️","fitzpatrick_scale":false,"category":"people"},"woman_fairy":{"keywords":["woman","female"],"char":"🧚‍♀️","fitzpatrick_scale":false,"category":"people"},"man_fairy":{"keywords":["man","male"],"char":"🧚‍♂️","fitzpatrick_scale":false,"category":"people"},"angel":{"keywords":["heaven","wings","halo"],"char":"👼","fitzpatrick_scale":true,"category":"people"},"pregnant_woman":{"keywords":["baby"],"char":"🤰","fitzpatrick_scale":true,"category":"people"},"breastfeeding":{"keywords":["nursing","baby"],"char":"🤱","fitzpatrick_scale":true,"category":"people"},"princess":{"keywords":["girl","woman","female","blond","crown","royal","queen"],"char":"👸","fitzpatrick_scale":true,"category":"people"},"prince":{"keywords":["boy","man","male","crown","royal","king"],"char":"🤴","fitzpatrick_scale":true,"category":"people"},"bride_with_veil":{"keywords":["couple","marriage","wedding","woman","bride"],"char":"👰","fitzpatrick_scale":true,"category":"people"},"man_in_tuxedo":{"keywords":["couple","marriage","wedding","groom"],"char":"🤵","fitzpatrick_scale":true,"category":"people"},"running_woman":{"keywords":["woman","walking","exercise","race","running","female"],"char":"🏃‍♀️","fitzpatrick_scale":true,"category":"people"},"running_man":{"keywords":["man","walking","exercise","race","running"],"char":"🏃","fitzpatrick_scale":true,"category":"people"},"walking_woman":{"keywords":["human","feet","steps","woman","female"],"char":"🚶‍♀️","fitzpatrick_scale":true,"category":"people"},"walking_man":{"keywords":["human","feet","steps"],"char":"🚶","fitzpatrick_scale":true,"category":"people"},"dancer":{"keywords":["female","girl","woman","fun"],"char":"💃","fitzpatrick_scale":true,"category":"people"},"man_dancing":{"keywords":["male","boy","fun","dancer"],"char":"🕺","fitzpatrick_scale":true,"category":"people"},"dancing_women":{"keywords":["female","bunny","women","girls"],"char":"👯","fitzpatrick_scale":true,"category":"people"},"dancing_men":{"keywords":["male","bunny","men","boys"],"char":"👯‍♂️","fitzpatrick_scale":true,"category":"people"},"couple":{"keywords":["pair","people","human","love","date","dating","like","affection","valentines","marriage"],"char":"👫","fitzpatrick_scale":true,"category":"people"},"two_men_holding_hands":{"keywords":["pair","couple","love","like","bromance","friendship","people","human"],"char":"👬","fitzpatrick_scale":true,"category":"people"},"two_women_holding_hands":{"keywords":["pair","friendship","couple","love","like","female","people","human"],"char":"👭","fitzpatrick_scale":true,"category":"people"},"bowing_woman":{"keywords":["woman","female","girl"],"char":"🙇‍♀️","fitzpatrick_scale":true,"category":"people"},"bowing_man":{"keywords":["man","male","boy"],"char":"🙇","fitzpatrick_scale":true,"category":"people"},"man_facepalming":{"keywords":["man","male","boy","disbelief"],"char":"🤦","fitzpatrick_scale":true,"category":"people"},"woman_facepalming":{"keywords":["woman","female","girl","disbelief"],"char":"🤦‍♀️","fitzpatrick_scale":true,"category":"people"},"woman_shrugging":{"keywords":["woman","female","girl","confused","indifferent","doubt"],"char":"🤷","fitzpatrick_scale":true,"category":"people"},"man_shrugging":{"keywords":["man","male","boy","confused","indifferent","doubt"],"char":"🤷‍♂️","fitzpatrick_scale":true,"category":"people"},"tipping_hand_woman":{"keywords":["female","girl","woman","human","information"],"char":"💁","fitzpatrick_scale":true,"category":"people"},"tipping_hand_man":{"keywords":["male","boy","man","human","information"],"char":"💁‍♂️","fitzpatrick_scale":true,"category":"people"},"no_good_woman":{"keywords":["female","girl","woman","nope"],"char":"🙅","fitzpatrick_scale":true,"category":"people"},"no_good_man":{"keywords":["male","boy","man","nope"],"char":"🙅‍♂️","fitzpatrick_scale":true,"category":"people"},"ok_woman":{"keywords":["women","girl","female","pink","human","woman"],"char":"🙆","fitzpatrick_scale":true,"category":"people"},"ok_man":{"keywords":["men","boy","male","blue","human","man"],"char":"🙆‍♂️","fitzpatrick_scale":true,"category":"people"},"raising_hand_woman":{"keywords":["female","girl","woman"],"char":"🙋","fitzpatrick_scale":true,"category":"people"},"raising_hand_man":{"keywords":["male","boy","man"],"char":"🙋‍♂️","fitzpatrick_scale":true,"category":"people"},"pouting_woman":{"keywords":["female","girl","woman"],"char":"🙎","fitzpatrick_scale":true,"category":"people"},"pouting_man":{"keywords":["male","boy","man"],"char":"🙎‍♂️","fitzpatrick_scale":true,"category":"people"},"frowning_woman":{"keywords":["female","girl","woman","sad","depressed","discouraged","unhappy"],"char":"🙍","fitzpatrick_scale":true,"category":"people"},"frowning_man":{"keywords":["male","boy","man","sad","depressed","discouraged","unhappy"],"char":"🙍‍♂️","fitzpatrick_scale":true,"category":"people"},"haircut_woman":{"keywords":["female","girl","woman"],"char":"💇","fitzpatrick_scale":true,"category":"people"},"haircut_man":{"keywords":["male","boy","man"],"char":"💇‍♂️","fitzpatrick_scale":true,"category":"people"},"massage_woman":{"keywords":["female","girl","woman","head"],"char":"💆","fitzpatrick_scale":true,"category":"people"},"massage_man":{"keywords":["male","boy","man","head"],"char":"💆‍♂️","fitzpatrick_scale":true,"category":"people"},"woman_in_steamy_room":{"keywords":["female","woman","spa","steamroom","sauna"],"char":"🧖‍♀️","fitzpatrick_scale":true,"category":"people"},"man_in_steamy_room":{"keywords":["male","man","spa","steamroom","sauna"],"char":"🧖‍♂️","fitzpatrick_scale":true,"category":"people"},"couple_with_heart_woman_man":{"keywords":["pair","love","like","affection","human","dating","valentines","marriage"],"char":"💑","fitzpatrick_scale":true,"category":"people"},"couple_with_heart_woman_woman":{"keywords":["pair","love","like","affection","human","dating","valentines","marriage"],"char":"👩‍❤️‍👩","fitzpatrick_scale":false,"category":"people"},"couple_with_heart_man_man":{"keywords":["pair","love","like","affection","human","dating","valentines","marriage"],"char":"👨‍❤️‍👨","fitzpatrick_scale":false,"category":"people"},"couplekiss_man_woman":{"keywords":["pair","valentines","love","like","dating","marriage"],"char":"💏","fitzpatrick_scale":true,"category":"people"},"couplekiss_woman_woman":{"keywords":["pair","valentines","love","like","dating","marriage"],"char":"👩‍❤️‍💋‍👩","fitzpatrick_scale":false,"category":"people"},"couplekiss_man_man":{"keywords":["pair","valentines","love","like","dating","marriage"],"char":"👨‍❤️‍💋‍👨","fitzpatrick_scale":false,"category":"people"},"family_man_woman_boy":{"keywords":["home","parents","child","mom","dad","father","mother","people","human"],"char":"👪","fitzpatrick_scale":true,"category":"people"},"family_man_woman_girl":{"keywords":["home","parents","people","human","child"],"char":"👨‍👩‍👧","fitzpatrick_scale":false,"category":"people"},"family_man_woman_girl_boy":{"keywords":["home","parents","people","human","children"],"char":"👨‍👩‍👧‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_woman_boy_boy":{"keywords":["home","parents","people","human","children"],"char":"👨‍👩‍👦‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_woman_girl_girl":{"keywords":["home","parents","people","human","children"],"char":"👨‍👩‍👧‍👧","fitzpatrick_scale":false,"category":"people"},"family_woman_woman_boy":{"keywords":["home","parents","people","human","children"],"char":"👩‍👩‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_woman_girl":{"keywords":["home","parents","people","human","children"],"char":"👩‍👩‍👧","fitzpatrick_scale":false,"category":"people"},"family_woman_woman_girl_boy":{"keywords":["home","parents","people","human","children"],"char":"👩‍👩‍👧‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_woman_boy_boy":{"keywords":["home","parents","people","human","children"],"char":"👩‍👩‍👦‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_woman_girl_girl":{"keywords":["home","parents","people","human","children"],"char":"👩‍👩‍👧‍👧","fitzpatrick_scale":false,"category":"people"},"family_man_man_boy":{"keywords":["home","parents","people","human","children"],"char":"👨‍👨‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_man_girl":{"keywords":["home","parents","people","human","children"],"char":"👨‍👨‍👧","fitzpatrick_scale":false,"category":"people"},"family_man_man_girl_boy":{"keywords":["home","parents","people","human","children"],"char":"👨‍👨‍👧‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_man_boy_boy":{"keywords":["home","parents","people","human","children"],"char":"👨‍👨‍👦‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_man_girl_girl":{"keywords":["home","parents","people","human","children"],"char":"👨‍👨‍👧‍👧","fitzpatrick_scale":false,"category":"people"},"family_woman_boy":{"keywords":["home","parent","people","human","child"],"char":"👩‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_girl":{"keywords":["home","parent","people","human","child"],"char":"👩‍👧","fitzpatrick_scale":false,"category":"people"},"family_woman_girl_boy":{"keywords":["home","parent","people","human","children"],"char":"👩‍👧‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_boy_boy":{"keywords":["home","parent","people","human","children"],"char":"👩‍👦‍👦","fitzpatrick_scale":false,"category":"people"},"family_woman_girl_girl":{"keywords":["home","parent","people","human","children"],"char":"👩‍👧‍👧","fitzpatrick_scale":false,"category":"people"},"family_man_boy":{"keywords":["home","parent","people","human","child"],"char":"👨‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_girl":{"keywords":["home","parent","people","human","child"],"char":"👨‍👧","fitzpatrick_scale":false,"category":"people"},"family_man_girl_boy":{"keywords":["home","parent","people","human","children"],"char":"👨‍👧‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_boy_boy":{"keywords":["home","parent","people","human","children"],"char":"👨‍👦‍👦","fitzpatrick_scale":false,"category":"people"},"family_man_girl_girl":{"keywords":["home","parent","people","human","children"],"char":"👨‍👧‍👧","fitzpatrick_scale":false,"category":"people"},"coat":{"keywords":["jacket"],"char":"🧥","fitzpatrick_scale":false,"category":"people"},"womans_clothes":{"keywords":["fashion","shopping_bags","female"],"char":"👚","fitzpatrick_scale":false,"category":"people"},"tshirt":{"keywords":["fashion","cloth","casual","shirt","tee"],"char":"👕","fitzpatrick_scale":false,"category":"people"},"jeans":{"keywords":["fashion","shopping"],"char":"👖","fitzpatrick_scale":false,"category":"people"},"necktie":{"keywords":["shirt","suitup","formal","fashion","cloth","business"],"char":"👔","fitzpatrick_scale":false,"category":"people"},"dress":{"keywords":["clothes","fashion","shopping"],"char":"👗","fitzpatrick_scale":false,"category":"people"},"bikini":{"keywords":["swimming","female","woman","girl","fashion","beach","summer"],"char":"👙","fitzpatrick_scale":false,"category":"people"},"kimono":{"keywords":["dress","fashion","women","female","japanese"],"char":"👘","fitzpatrick_scale":false,"category":"people"},"lipstick":{"keywords":["female","girl","fashion","woman"],"char":"💄","fitzpatrick_scale":false,"category":"people"},"kiss":{"keywords":["face","lips","love","like","affection","valentines"],"char":"💋","fitzpatrick_scale":false,"category":"people"},"footprints":{"keywords":["feet","tracking","walking","beach"],"char":"👣","fitzpatrick_scale":false,"category":"people"},"high_heel":{"keywords":["fashion","shoes","female","pumps","stiletto"],"char":"👠","fitzpatrick_scale":false,"category":"people"},"sandal":{"keywords":["shoes","fashion","flip flops"],"char":"👡","fitzpatrick_scale":false,"category":"people"},"boot":{"keywords":["shoes","fashion"],"char":"👢","fitzpatrick_scale":false,"category":"people"},"mans_shoe":{"keywords":["fashion","male"],"char":"👞","fitzpatrick_scale":false,"category":"people"},"athletic_shoe":{"keywords":["shoes","sports","sneakers"],"char":"👟","fitzpatrick_scale":false,"category":"people"},"socks":{"keywords":["stockings","clothes"],"char":"🧦","fitzpatrick_scale":false,"category":"people"},"gloves":{"keywords":["hands","winter","clothes"],"char":"🧤","fitzpatrick_scale":false,"category":"people"},"scarf":{"keywords":["neck","winter","clothes"],"char":"🧣","fitzpatrick_scale":false,"category":"people"},"womans_hat":{"keywords":["fashion","accessories","female","lady","spring"],"char":"👒","fitzpatrick_scale":false,"category":"people"},"tophat":{"keywords":["magic","gentleman","classy","circus"],"char":"🎩","fitzpatrick_scale":false,"category":"people"},"billed_hat":{"keywords":["cap","baseball"],"char":"🧢","fitzpatrick_scale":false,"category":"people"},"rescue_worker_helmet":{"keywords":["construction","build"],"char":"⛑","fitzpatrick_scale":false,"category":"people"},"mortar_board":{"keywords":["school","college","degree","university","graduation","cap","hat","legal","learn","education"],"char":"🎓","fitzpatrick_scale":false,"category":"people"},"crown":{"keywords":["king","kod","leader","royalty","lord"],"char":"👑","fitzpatrick_scale":false,"category":"people"},"school_satchel":{"keywords":["student","education","bag","backpack"],"char":"🎒","fitzpatrick_scale":false,"category":"people"},"pouch":{"keywords":["bag","accessories","shopping"],"char":"👝","fitzpatrick_scale":false,"category":"people"},"purse":{"keywords":["fashion","accessories","money","sales","shopping"],"char":"👛","fitzpatrick_scale":false,"category":"people"},"handbag":{"keywords":["fashion","accessory","accessories","shopping"],"char":"👜","fitzpatrick_scale":false,"category":"people"},"briefcase":{"keywords":["business","documents","work","law","legal","job","career"],"char":"💼","fitzpatrick_scale":false,"category":"people"},"eyeglasses":{"keywords":["fashion","accessories","eyesight","nerdy","dork","geek"],"char":"👓","fitzpatrick_scale":false,"category":"people"},"dark_sunglasses":{"keywords":["face","cool","accessories"],"char":"🕶","fitzpatrick_scale":false,"category":"people"},"ring":{"keywords":["wedding","propose","marriage","valentines","diamond","fashion","jewelry","gem","engagement"],"char":"💍","fitzpatrick_scale":false,"category":"people"},"closed_umbrella":{"keywords":["weather","rain","drizzle"],"char":"🌂","fitzpatrick_scale":false,"category":"people"},"dog":{"keywords":["animal","friend","nature","woof","puppy","pet","faithful"],"char":"🐶","fitzpatrick_scale":false,"category":"animals_and_nature"},"cat":{"keywords":["animal","meow","nature","pet","kitten"],"char":"🐱","fitzpatrick_scale":false,"category":"animals_and_nature"},"mouse":{"keywords":["animal","nature","cheese_wedge","rodent"],"char":"🐭","fitzpatrick_scale":false,"category":"animals_and_nature"},"hamster":{"keywords":["animal","nature"],"char":"🐹","fitzpatrick_scale":false,"category":"animals_and_nature"},"rabbit":{"keywords":["animal","nature","pet","spring","magic","bunny"],"char":"🐰","fitzpatrick_scale":false,"category":"animals_and_nature"},"fox_face":{"keywords":["animal","nature","face"],"char":"🦊","fitzpatrick_scale":false,"category":"animals_and_nature"},"bear":{"keywords":["animal","nature","wild"],"char":"🐻","fitzpatrick_scale":false,"category":"animals_and_nature"},"panda_face":{"keywords":["animal","nature","panda"],"char":"🐼","fitzpatrick_scale":false,"category":"animals_and_nature"},"koala":{"keywords":["animal","nature"],"char":"🐨","fitzpatrick_scale":false,"category":"animals_and_nature"},"tiger":{"keywords":["animal","cat","danger","wild","nature","roar"],"char":"🐯","fitzpatrick_scale":false,"category":"animals_and_nature"},"lion":{"keywords":["animal","nature"],"char":"🦁","fitzpatrick_scale":false,"category":"animals_and_nature"},"cow":{"keywords":["beef","ox","animal","nature","moo","milk"],"char":"🐮","fitzpatrick_scale":false,"category":"animals_and_nature"},"pig":{"keywords":["animal","oink","nature"],"char":"🐷","fitzpatrick_scale":false,"category":"animals_and_nature"},"pig_nose":{"keywords":["animal","oink"],"char":"🐽","fitzpatrick_scale":false,"category":"animals_and_nature"},"frog":{"keywords":["animal","nature","croak","toad"],"char":"🐸","fitzpatrick_scale":false,"category":"animals_and_nature"},"squid":{"keywords":["animal","nature","ocean","sea"],"char":"🦑","fitzpatrick_scale":false,"category":"animals_and_nature"},"octopus":{"keywords":["animal","creature","ocean","sea","nature","beach"],"char":"🐙","fitzpatrick_scale":false,"category":"animals_and_nature"},"shrimp":{"keywords":["animal","ocean","nature","seafood"],"char":"🦐","fitzpatrick_scale":false,"category":"animals_and_nature"},"monkey_face":{"keywords":["animal","nature","circus"],"char":"🐵","fitzpatrick_scale":false,"category":"animals_and_nature"},"gorilla":{"keywords":["animal","nature","circus"],"char":"🦍","fitzpatrick_scale":false,"category":"animals_and_nature"},"see_no_evil":{"keywords":["monkey","animal","nature","haha"],"char":"🙈","fitzpatrick_scale":false,"category":"animals_and_nature"},"hear_no_evil":{"keywords":["animal","monkey","nature"],"char":"🙉","fitzpatrick_scale":false,"category":"animals_and_nature"},"speak_no_evil":{"keywords":["monkey","animal","nature","omg"],"char":"🙊","fitzpatrick_scale":false,"category":"animals_and_nature"},"monkey":{"keywords":["animal","nature","banana","circus"],"char":"🐒","fitzpatrick_scale":false,"category":"animals_and_nature"},"chicken":{"keywords":["animal","cluck","nature","bird"],"char":"🐔","fitzpatrick_scale":false,"category":"animals_and_nature"},"penguin":{"keywords":["animal","nature"],"char":"🐧","fitzpatrick_scale":false,"category":"animals_and_nature"},"bird":{"keywords":["animal","nature","fly","tweet","spring"],"char":"🐦","fitzpatrick_scale":false,"category":"animals_and_nature"},"baby_chick":{"keywords":["animal","chicken","bird"],"char":"🐤","fitzpatrick_scale":false,"category":"animals_and_nature"},"hatching_chick":{"keywords":["animal","chicken","egg","born","baby","bird"],"char":"🐣","fitzpatrick_scale":false,"category":"animals_and_nature"},"hatched_chick":{"keywords":["animal","chicken","baby","bird"],"char":"🐥","fitzpatrick_scale":false,"category":"animals_and_nature"},"duck":{"keywords":["animal","nature","bird","mallard"],"char":"🦆","fitzpatrick_scale":false,"category":"animals_and_nature"},"eagle":{"keywords":["animal","nature","bird"],"char":"🦅","fitzpatrick_scale":false,"category":"animals_and_nature"},"owl":{"keywords":["animal","nature","bird","hoot"],"char":"🦉","fitzpatrick_scale":false,"category":"animals_and_nature"},"bat":{"keywords":["animal","nature","blind","vampire"],"char":"🦇","fitzpatrick_scale":false,"category":"animals_and_nature"},"wolf":{"keywords":["animal","nature","wild"],"char":"🐺","fitzpatrick_scale":false,"category":"animals_and_nature"},"boar":{"keywords":["animal","nature"],"char":"🐗","fitzpatrick_scale":false,"category":"animals_and_nature"},"horse":{"keywords":["animal","brown","nature"],"char":"🐴","fitzpatrick_scale":false,"category":"animals_and_nature"},"unicorn":{"keywords":["animal","nature","mystical"],"char":"🦄","fitzpatrick_scale":false,"category":"animals_and_nature"},"honeybee":{"keywords":["animal","insect","nature","bug","spring","honey"],"char":"🐝","fitzpatrick_scale":false,"category":"animals_and_nature"},"bug":{"keywords":["animal","insect","nature","worm"],"char":"🐛","fitzpatrick_scale":false,"category":"animals_and_nature"},"butterfly":{"keywords":["animal","insect","nature","caterpillar"],"char":"🦋","fitzpatrick_scale":false,"category":"animals_and_nature"},"snail":{"keywords":["slow","animal","shell"],"char":"🐌","fitzpatrick_scale":false,"category":"animals_and_nature"},"beetle":{"keywords":["animal","insect","nature","ladybug"],"char":"🐞","fitzpatrick_scale":false,"category":"animals_and_nature"},"ant":{"keywords":["animal","insect","nature","bug"],"char":"🐜","fitzpatrick_scale":false,"category":"animals_and_nature"},"grasshopper":{"keywords":["animal","cricket","chirp"],"char":"🦗","fitzpatrick_scale":false,"category":"animals_and_nature"},"spider":{"keywords":["animal","arachnid"],"char":"🕷","fitzpatrick_scale":false,"category":"animals_and_nature"},"scorpion":{"keywords":["animal","arachnid"],"char":"🦂","fitzpatrick_scale":false,"category":"animals_and_nature"},"crab":{"keywords":["animal","crustacean"],"char":"🦀","fitzpatrick_scale":false,"category":"animals_and_nature"},"snake":{"keywords":["animal","evil","nature","hiss","python"],"char":"🐍","fitzpatrick_scale":false,"category":"animals_and_nature"},"lizard":{"keywords":["animal","nature","reptile"],"char":"🦎","fitzpatrick_scale":false,"category":"animals_and_nature"},"t-rex":{"keywords":["animal","nature","dinosaur","tyrannosaurus","extinct"],"char":"🦖","fitzpatrick_scale":false,"category":"animals_and_nature"},"sauropod":{"keywords":["animal","nature","dinosaur","brachiosaurus","brontosaurus","diplodocus","extinct"],"char":"🦕","fitzpatrick_scale":false,"category":"animals_and_nature"},"turtle":{"keywords":["animal","slow","nature","tortoise"],"char":"🐢","fitzpatrick_scale":false,"category":"animals_and_nature"},"tropical_fish":{"keywords":["animal","swim","ocean","beach","nemo"],"char":"🐠","fitzpatrick_scale":false,"category":"animals_and_nature"},"fish":{"keywords":["animal","food","nature"],"char":"🐟","fitzpatrick_scale":false,"category":"animals_and_nature"},"blowfish":{"keywords":["animal","nature","food","sea","ocean"],"char":"🐡","fitzpatrick_scale":false,"category":"animals_and_nature"},"dolphin":{"keywords":["animal","nature","fish","sea","ocean","flipper","fins","beach"],"char":"🐬","fitzpatrick_scale":false,"category":"animals_and_nature"},"shark":{"keywords":["animal","nature","fish","sea","ocean","jaws","fins","beach"],"char":"🦈","fitzpatrick_scale":false,"category":"animals_and_nature"},"whale":{"keywords":["animal","nature","sea","ocean"],"char":"🐳","fitzpatrick_scale":false,"category":"animals_and_nature"},"whale2":{"keywords":["animal","nature","sea","ocean"],"char":"🐋","fitzpatrick_scale":false,"category":"animals_and_nature"},"crocodile":{"keywords":["animal","nature","reptile","lizard","alligator"],"char":"🐊","fitzpatrick_scale":false,"category":"animals_and_nature"},"leopard":{"keywords":["animal","nature"],"char":"🐆","fitzpatrick_scale":false,"category":"animals_and_nature"},"zebra":{"keywords":["animal","nature","stripes","safari"],"char":"🦓","fitzpatrick_scale":false,"category":"animals_and_nature"},"tiger2":{"keywords":["animal","nature","roar"],"char":"🐅","fitzpatrick_scale":false,"category":"animals_and_nature"},"water_buffalo":{"keywords":["animal","nature","ox","cow"],"char":"🐃","fitzpatrick_scale":false,"category":"animals_and_nature"},"ox":{"keywords":["animal","cow","beef"],"char":"🐂","fitzpatrick_scale":false,"category":"animals_and_nature"},"cow2":{"keywords":["beef","ox","animal","nature","moo","milk"],"char":"🐄","fitzpatrick_scale":false,"category":"animals_and_nature"},"deer":{"keywords":["animal","nature","horns","venison"],"char":"🦌","fitzpatrick_scale":false,"category":"animals_and_nature"},"dromedary_camel":{"keywords":["animal","hot","desert","hump"],"char":"🐪","fitzpatrick_scale":false,"category":"animals_and_nature"},"camel":{"keywords":["animal","nature","hot","desert","hump"],"char":"🐫","fitzpatrick_scale":false,"category":"animals_and_nature"},"giraffe":{"keywords":["animal","nature","spots","safari"],"char":"🦒","fitzpatrick_scale":false,"category":"animals_and_nature"},"elephant":{"keywords":["animal","nature","nose","th","circus"],"char":"🐘","fitzpatrick_scale":false,"category":"animals_and_nature"},"rhinoceros":{"keywords":["animal","nature","horn"],"char":"🦏","fitzpatrick_scale":false,"category":"animals_and_nature"},"goat":{"keywords":["animal","nature"],"char":"🐐","fitzpatrick_scale":false,"category":"animals_and_nature"},"ram":{"keywords":["animal","sheep","nature"],"char":"🐏","fitzpatrick_scale":false,"category":"animals_and_nature"},"sheep":{"keywords":["animal","nature","wool","shipit"],"char":"🐑","fitzpatrick_scale":false,"category":"animals_and_nature"},"racehorse":{"keywords":["animal","gamble","luck"],"char":"🐎","fitzpatrick_scale":false,"category":"animals_and_nature"},"pig2":{"keywords":["animal","nature"],"char":"🐖","fitzpatrick_scale":false,"category":"animals_and_nature"},"rat":{"keywords":["animal","mouse","rodent"],"char":"🐀","fitzpatrick_scale":false,"category":"animals_and_nature"},"mouse2":{"keywords":["animal","nature","rodent"],"char":"🐁","fitzpatrick_scale":false,"category":"animals_and_nature"},"rooster":{"keywords":["animal","nature","chicken"],"char":"🐓","fitzpatrick_scale":false,"category":"animals_and_nature"},"turkey":{"keywords":["animal","bird"],"char":"🦃","fitzpatrick_scale":false,"category":"animals_and_nature"},"dove":{"keywords":["animal","bird"],"char":"🕊","fitzpatrick_scale":false,"category":"animals_and_nature"},"dog2":{"keywords":["animal","nature","friend","doge","pet","faithful"],"char":"🐕","fitzpatrick_scale":false,"category":"animals_and_nature"},"poodle":{"keywords":["dog","animal","101","nature","pet"],"char":"🐩","fitzpatrick_scale":false,"category":"animals_and_nature"},"cat2":{"keywords":["animal","meow","pet","cats"],"char":"🐈","fitzpatrick_scale":false,"category":"animals_and_nature"},"rabbit2":{"keywords":["animal","nature","pet","magic","spring"],"char":"🐇","fitzpatrick_scale":false,"category":"animals_and_nature"},"chipmunk":{"keywords":["animal","nature","rodent","squirrel"],"char":"🐿","fitzpatrick_scale":false,"category":"animals_and_nature"},"hedgehog":{"keywords":["animal","nature","spiny"],"char":"🦔","fitzpatrick_scale":false,"category":"animals_and_nature"},"paw_prints":{"keywords":["animal","tracking","footprints","dog","cat","pet","feet"],"char":"🐾","fitzpatrick_scale":false,"category":"animals_and_nature"},"dragon":{"keywords":["animal","myth","nature","chinese","green"],"char":"🐉","fitzpatrick_scale":false,"category":"animals_and_nature"},"dragon_face":{"keywords":["animal","myth","nature","chinese","green"],"char":"🐲","fitzpatrick_scale":false,"category":"animals_and_nature"},"cactus":{"keywords":["vegetable","plant","nature"],"char":"🌵","fitzpatrick_scale":false,"category":"animals_and_nature"},"christmas_tree":{"keywords":["festival","vacation","december","xmas","celebration"],"char":"🎄","fitzpatrick_scale":false,"category":"animals_and_nature"},"evergreen_tree":{"keywords":["plant","nature"],"char":"🌲","fitzpatrick_scale":false,"category":"animals_and_nature"},"deciduous_tree":{"keywords":["plant","nature"],"char":"🌳","fitzpatrick_scale":false,"category":"animals_and_nature"},"palm_tree":{"keywords":["plant","vegetable","nature","summer","beach","mojito","tropical"],"char":"🌴","fitzpatrick_scale":false,"category":"animals_and_nature"},"seedling":{"keywords":["plant","nature","grass","lawn","spring"],"char":"🌱","fitzpatrick_scale":false,"category":"animals_and_nature"},"herb":{"keywords":["vegetable","plant","medicine","weed","grass","lawn"],"char":"🌿","fitzpatrick_scale":false,"category":"animals_and_nature"},"shamrock":{"keywords":["vegetable","plant","nature","irish","clover"],"char":"☘","fitzpatrick_scale":false,"category":"animals_and_nature"},"four_leaf_clover":{"keywords":["vegetable","plant","nature","lucky","irish"],"char":"🍀","fitzpatrick_scale":false,"category":"animals_and_nature"},"bamboo":{"keywords":["plant","nature","vegetable","panda","pine_decoration"],"char":"🎍","fitzpatrick_scale":false,"category":"animals_and_nature"},"tanabata_tree":{"keywords":["plant","nature","branch","summer"],"char":"🎋","fitzpatrick_scale":false,"category":"animals_and_nature"},"leaves":{"keywords":["nature","plant","tree","vegetable","grass","lawn","spring"],"char":"🍃","fitzpatrick_scale":false,"category":"animals_and_nature"},"fallen_leaf":{"keywords":["nature","plant","vegetable","leaves"],"char":"🍂","fitzpatrick_scale":false,"category":"animals_and_nature"},"maple_leaf":{"keywords":["nature","plant","vegetable","ca","fall"],"char":"🍁","fitzpatrick_scale":false,"category":"animals_and_nature"},"ear_of_rice":{"keywords":["nature","plant"],"char":"🌾","fitzpatrick_scale":false,"category":"animals_and_nature"},"hibiscus":{"keywords":["plant","vegetable","flowers","beach"],"char":"🌺","fitzpatrick_scale":false,"category":"animals_and_nature"},"sunflower":{"keywords":["nature","plant","fall"],"char":"🌻","fitzpatrick_scale":false,"category":"animals_and_nature"},"rose":{"keywords":["flowers","valentines","love","spring"],"char":"🌹","fitzpatrick_scale":false,"category":"animals_and_nature"},"wilted_flower":{"keywords":["plant","nature","flower"],"char":"🥀","fitzpatrick_scale":false,"category":"animals_and_nature"},"tulip":{"keywords":["flowers","plant","nature","summer","spring"],"char":"🌷","fitzpatrick_scale":false,"category":"animals_and_nature"},"blossom":{"keywords":["nature","flowers","yellow"],"char":"🌼","fitzpatrick_scale":false,"category":"animals_and_nature"},"cherry_blossom":{"keywords":["nature","plant","spring","flower"],"char":"🌸","fitzpatrick_scale":false,"category":"animals_and_nature"},"bouquet":{"keywords":["flowers","nature","spring"],"char":"💐","fitzpatrick_scale":false,"category":"animals_and_nature"},"mushroom":{"keywords":["plant","vegetable"],"char":"🍄","fitzpatrick_scale":false,"category":"animals_and_nature"},"chestnut":{"keywords":["food","squirrel"],"char":"🌰","fitzpatrick_scale":false,"category":"animals_and_nature"},"jack_o_lantern":{"keywords":["halloween","light","pumpkin","creepy","fall"],"char":"🎃","fitzpatrick_scale":false,"category":"animals_and_nature"},"shell":{"keywords":["nature","sea","beach"],"char":"🐚","fitzpatrick_scale":false,"category":"animals_and_nature"},"spider_web":{"keywords":["animal","insect","arachnid","silk"],"char":"🕸","fitzpatrick_scale":false,"category":"animals_and_nature"},"earth_americas":{"keywords":["globe","world","USA","international"],"char":"🌎","fitzpatrick_scale":false,"category":"animals_and_nature"},"earth_africa":{"keywords":["globe","world","international"],"char":"🌍","fitzpatrick_scale":false,"category":"animals_and_nature"},"earth_asia":{"keywords":["globe","world","east","international"],"char":"🌏","fitzpatrick_scale":false,"category":"animals_and_nature"},"full_moon":{"keywords":["nature","yellow","twilight","planet","space","night","evening","sleep"],"char":"🌕","fitzpatrick_scale":false,"category":"animals_and_nature"},"waning_gibbous_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep","waxing_gibbous_moon"],"char":"🌖","fitzpatrick_scale":false,"category":"animals_and_nature"},"last_quarter_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌗","fitzpatrick_scale":false,"category":"animals_and_nature"},"waning_crescent_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌘","fitzpatrick_scale":false,"category":"animals_and_nature"},"new_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌑","fitzpatrick_scale":false,"category":"animals_and_nature"},"waxing_crescent_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌒","fitzpatrick_scale":false,"category":"animals_and_nature"},"first_quarter_moon":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌓","fitzpatrick_scale":false,"category":"animals_and_nature"},"waxing_gibbous_moon":{"keywords":["nature","night","sky","gray","twilight","planet","space","evening","sleep"],"char":"🌔","fitzpatrick_scale":false,"category":"animals_and_nature"},"new_moon_with_face":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌚","fitzpatrick_scale":false,"category":"animals_and_nature"},"full_moon_with_face":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌝","fitzpatrick_scale":false,"category":"animals_and_nature"},"first_quarter_moon_with_face":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌛","fitzpatrick_scale":false,"category":"animals_and_nature"},"last_quarter_moon_with_face":{"keywords":["nature","twilight","planet","space","night","evening","sleep"],"char":"🌜","fitzpatrick_scale":false,"category":"animals_and_nature"},"sun_with_face":{"keywords":["nature","morning","sky"],"char":"🌞","fitzpatrick_scale":false,"category":"animals_and_nature"},"crescent_moon":{"keywords":["night","sleep","sky","evening","magic"],"char":"🌙","fitzpatrick_scale":false,"category":"animals_and_nature"},"star":{"keywords":["night","yellow"],"char":"⭐","fitzpatrick_scale":false,"category":"animals_and_nature"},"star2":{"keywords":["night","sparkle","awesome","good","magic"],"char":"🌟","fitzpatrick_scale":false,"category":"animals_and_nature"},"dizzy":{"keywords":["star","sparkle","shoot","magic"],"char":"💫","fitzpatrick_scale":false,"category":"animals_and_nature"},"sparkles":{"keywords":["stars","shine","shiny","cool","awesome","good","magic"],"char":"✨","fitzpatrick_scale":false,"category":"animals_and_nature"},"comet":{"keywords":["space"],"char":"☄","fitzpatrick_scale":false,"category":"animals_and_nature"},"sunny":{"keywords":["weather","nature","brightness","summer","beach","spring"],"char":"☀️","fitzpatrick_scale":false,"category":"animals_and_nature"},"sun_behind_small_cloud":{"keywords":["weather"],"char":"🌤","fitzpatrick_scale":false,"category":"animals_and_nature"},"partly_sunny":{"keywords":["weather","nature","cloudy","morning","fall","spring"],"char":"⛅","fitzpatrick_scale":false,"category":"animals_and_nature"},"sun_behind_large_cloud":{"keywords":["weather"],"char":"🌥","fitzpatrick_scale":false,"category":"animals_and_nature"},"sun_behind_rain_cloud":{"keywords":["weather"],"char":"🌦","fitzpatrick_scale":false,"category":"animals_and_nature"},"cloud":{"keywords":["weather","sky"],"char":"☁️","fitzpatrick_scale":false,"category":"animals_and_nature"},"cloud_with_rain":{"keywords":["weather"],"char":"🌧","fitzpatrick_scale":false,"category":"animals_and_nature"},"cloud_with_lightning_and_rain":{"keywords":["weather","lightning"],"char":"⛈","fitzpatrick_scale":false,"category":"animals_and_nature"},"cloud_with_lightning":{"keywords":["weather","thunder"],"char":"🌩","fitzpatrick_scale":false,"category":"animals_and_nature"},"zap":{"keywords":["thunder","weather","lightning bolt","fast"],"char":"⚡","fitzpatrick_scale":false,"category":"animals_and_nature"},"fire":{"keywords":["hot","cook","flame"],"char":"🔥","fitzpatrick_scale":false,"category":"animals_and_nature"},"boom":{"keywords":["bomb","explode","explosion","collision","blown"],"char":"💥","fitzpatrick_scale":false,"category":"animals_and_nature"},"snowflake":{"keywords":["winter","season","cold","weather","christmas","xmas"],"char":"❄️","fitzpatrick_scale":false,"category":"animals_and_nature"},"cloud_with_snow":{"keywords":["weather"],"char":"🌨","fitzpatrick_scale":false,"category":"animals_and_nature"},"snowman":{"keywords":["winter","season","cold","weather","christmas","xmas","frozen","without_snow"],"char":"⛄","fitzpatrick_scale":false,"category":"animals_and_nature"},"snowman_with_snow":{"keywords":["winter","season","cold","weather","christmas","xmas","frozen"],"char":"☃","fitzpatrick_scale":false,"category":"animals_and_nature"},"wind_face":{"keywords":["gust","air"],"char":"🌬","fitzpatrick_scale":false,"category":"animals_and_nature"},"dash":{"keywords":["wind","air","fast","shoo","fart","smoke","puff"],"char":"💨","fitzpatrick_scale":false,"category":"animals_and_nature"},"tornado":{"keywords":["weather","cyclone","twister"],"char":"🌪","fitzpatrick_scale":false,"category":"animals_and_nature"},"fog":{"keywords":["weather"],"char":"🌫","fitzpatrick_scale":false,"category":"animals_and_nature"},"open_umbrella":{"keywords":["weather","spring"],"char":"☂","fitzpatrick_scale":false,"category":"animals_and_nature"},"umbrella":{"keywords":["rainy","weather","spring"],"char":"☔","fitzpatrick_scale":false,"category":"animals_and_nature"},"droplet":{"keywords":["water","drip","faucet","spring"],"char":"💧","fitzpatrick_scale":false,"category":"animals_and_nature"},"sweat_drops":{"keywords":["water","drip","oops"],"char":"💦","fitzpatrick_scale":false,"category":"animals_and_nature"},"ocean":{"keywords":["sea","water","wave","nature","tsunami","disaster"],"char":"🌊","fitzpatrick_scale":false,"category":"animals_and_nature"},"green_apple":{"keywords":["fruit","nature"],"char":"🍏","fitzpatrick_scale":false,"category":"food_and_drink"},"apple":{"keywords":["fruit","mac","school"],"char":"🍎","fitzpatrick_scale":false,"category":"food_and_drink"},"pear":{"keywords":["fruit","nature","food"],"char":"🍐","fitzpatrick_scale":false,"category":"food_and_drink"},"tangerine":{"keywords":["food","fruit","nature","orange"],"char":"🍊","fitzpatrick_scale":false,"category":"food_and_drink"},"lemon":{"keywords":["fruit","nature"],"char":"🍋","fitzpatrick_scale":false,"category":"food_and_drink"},"banana":{"keywords":["fruit","food","monkey"],"char":"🍌","fitzpatrick_scale":false,"category":"food_and_drink"},"watermelon":{"keywords":["fruit","food","picnic","summer"],"char":"🍉","fitzpatrick_scale":false,"category":"food_and_drink"},"grapes":{"keywords":["fruit","food","wine"],"char":"🍇","fitzpatrick_scale":false,"category":"food_and_drink"},"strawberry":{"keywords":["fruit","food","nature"],"char":"🍓","fitzpatrick_scale":false,"category":"food_and_drink"},"melon":{"keywords":["fruit","nature","food"],"char":"🍈","fitzpatrick_scale":false,"category":"food_and_drink"},"cherries":{"keywords":["food","fruit"],"char":"🍒","fitzpatrick_scale":false,"category":"food_and_drink"},"peach":{"keywords":["fruit","nature","food"],"char":"🍑","fitzpatrick_scale":false,"category":"food_and_drink"},"pineapple":{"keywords":["fruit","nature","food"],"char":"🍍","fitzpatrick_scale":false,"category":"food_and_drink"},"coconut":{"keywords":["fruit","nature","food","palm"],"char":"🥥","fitzpatrick_scale":false,"category":"food_and_drink"},"kiwi_fruit":{"keywords":["fruit","food"],"char":"🥝","fitzpatrick_scale":false,"category":"food_and_drink"},"avocado":{"keywords":["fruit","food"],"char":"🥑","fitzpatrick_scale":false,"category":"food_and_drink"},"broccoli":{"keywords":["fruit","food","vegetable"],"char":"🥦","fitzpatrick_scale":false,"category":"food_and_drink"},"tomato":{"keywords":["fruit","vegetable","nature","food"],"char":"🍅","fitzpatrick_scale":false,"category":"food_and_drink"},"eggplant":{"keywords":["vegetable","nature","food","aubergine"],"char":"🍆","fitzpatrick_scale":false,"category":"food_and_drink"},"cucumber":{"keywords":["fruit","food","pickle"],"char":"🥒","fitzpatrick_scale":false,"category":"food_and_drink"},"carrot":{"keywords":["vegetable","food","orange"],"char":"🥕","fitzpatrick_scale":false,"category":"food_and_drink"},"hot_pepper":{"keywords":["food","spicy","chilli","chili"],"char":"🌶","fitzpatrick_scale":false,"category":"food_and_drink"},"potato":{"keywords":["food","tuber","vegatable","starch"],"char":"🥔","fitzpatrick_scale":false,"category":"food_and_drink"},"corn":{"keywords":["food","vegetable","plant"],"char":"🌽","fitzpatrick_scale":false,"category":"food_and_drink"},"sweet_potato":{"keywords":["food","nature"],"char":"🍠","fitzpatrick_scale":false,"category":"food_and_drink"},"peanuts":{"keywords":["food","nut"],"char":"🥜","fitzpatrick_scale":false,"category":"food_and_drink"},"honey_pot":{"keywords":["bees","sweet","kitchen"],"char":"🍯","fitzpatrick_scale":false,"category":"food_and_drink"},"croissant":{"keywords":["food","bread","french"],"char":"🥐","fitzpatrick_scale":false,"category":"food_and_drink"},"bread":{"keywords":["food","wheat","breakfast","toast"],"char":"🍞","fitzpatrick_scale":false,"category":"food_and_drink"},"baguette_bread":{"keywords":["food","bread","french"],"char":"🥖","fitzpatrick_scale":false,"category":"food_and_drink"},"pretzel":{"keywords":["food","bread","twisted"],"char":"🥨","fitzpatrick_scale":false,"category":"food_and_drink"},"cheese":{"keywords":["food","chadder"],"char":"🧀","fitzpatrick_scale":false,"category":"food_and_drink"},"egg":{"keywords":["food","chicken","breakfast"],"char":"🥚","fitzpatrick_scale":false,"category":"food_and_drink"},"bacon":{"keywords":["food","breakfast","pork","pig","meat"],"char":"🥓","fitzpatrick_scale":false,"category":"food_and_drink"},"steak":{"keywords":["food","cow","meat","cut","chop","lambchop","porkchop"],"char":"🥩","fitzpatrick_scale":false,"category":"food_and_drink"},"pancakes":{"keywords":["food","breakfast","flapjacks","hotcakes"],"char":"🥞","fitzpatrick_scale":false,"category":"food_and_drink"},"poultry_leg":{"keywords":["food","meat","drumstick","bird","chicken","turkey"],"char":"🍗","fitzpatrick_scale":false,"category":"food_and_drink"},"meat_on_bone":{"keywords":["good","food","drumstick"],"char":"🍖","fitzpatrick_scale":false,"category":"food_and_drink"},"fried_shrimp":{"keywords":["food","animal","appetizer","summer"],"char":"🍤","fitzpatrick_scale":false,"category":"food_and_drink"},"fried_egg":{"keywords":["food","breakfast","kitchen","egg"],"char":"🍳","fitzpatrick_scale":false,"category":"food_and_drink"},"hamburger":{"keywords":["meat","fast food","beef","cheeseburger","mcdonalds","burger king"],"char":"🍔","fitzpatrick_scale":false,"category":"food_and_drink"},"fries":{"keywords":["chips","snack","fast food"],"char":"🍟","fitzpatrick_scale":false,"category":"food_and_drink"},"stuffed_flatbread":{"keywords":["food","flatbread","stuffed","gyro"],"char":"🥙","fitzpatrick_scale":false,"category":"food_and_drink"},"hotdog":{"keywords":["food","frankfurter"],"char":"🌭","fitzpatrick_scale":false,"category":"food_and_drink"},"pizza":{"keywords":["food","party"],"char":"🍕","fitzpatrick_scale":false,"category":"food_and_drink"},"sandwich":{"keywords":["food","lunch","bread"],"char":"🥪","fitzpatrick_scale":false,"category":"food_and_drink"},"canned_food":{"keywords":["food","soup"],"char":"🥫","fitzpatrick_scale":false,"category":"food_and_drink"},"spaghetti":{"keywords":["food","italian","noodle"],"char":"🍝","fitzpatrick_scale":false,"category":"food_and_drink"},"taco":{"keywords":["food","mexican"],"char":"🌮","fitzpatrick_scale":false,"category":"food_and_drink"},"burrito":{"keywords":["food","mexican"],"char":"🌯","fitzpatrick_scale":false,"category":"food_and_drink"},"green_salad":{"keywords":["food","healthy","lettuce"],"char":"🥗","fitzpatrick_scale":false,"category":"food_and_drink"},"shallow_pan_of_food":{"keywords":["food","cooking","casserole","paella"],"char":"🥘","fitzpatrick_scale":false,"category":"food_and_drink"},"ramen":{"keywords":["food","japanese","noodle","chopsticks"],"char":"🍜","fitzpatrick_scale":false,"category":"food_and_drink"},"stew":{"keywords":["food","meat","soup"],"char":"🍲","fitzpatrick_scale":false,"category":"food_and_drink"},"fish_cake":{"keywords":["food","japan","sea","beach","narutomaki","pink","swirl","kamaboko","surimi","ramen"],"char":"🍥","fitzpatrick_scale":false,"category":"food_and_drink"},"fortune_cookie":{"keywords":["food","prophecy"],"char":"🥠","fitzpatrick_scale":false,"category":"food_and_drink"},"sushi":{"keywords":["food","fish","japanese","rice"],"char":"🍣","fitzpatrick_scale":false,"category":"food_and_drink"},"bento":{"keywords":["food","japanese","box"],"char":"🍱","fitzpatrick_scale":false,"category":"food_and_drink"},"curry":{"keywords":["food","spicy","hot","indian"],"char":"🍛","fitzpatrick_scale":false,"category":"food_and_drink"},"rice_ball":{"keywords":["food","japanese"],"char":"🍙","fitzpatrick_scale":false,"category":"food_and_drink"},"rice":{"keywords":["food","china","asian"],"char":"🍚","fitzpatrick_scale":false,"category":"food_and_drink"},"rice_cracker":{"keywords":["food","japanese"],"char":"🍘","fitzpatrick_scale":false,"category":"food_and_drink"},"oden":{"keywords":["food","japanese"],"char":"🍢","fitzpatrick_scale":false,"category":"food_and_drink"},"dango":{"keywords":["food","dessert","sweet","japanese","barbecue","meat"],"char":"🍡","fitzpatrick_scale":false,"category":"food_and_drink"},"shaved_ice":{"keywords":["hot","dessert","summer"],"char":"🍧","fitzpatrick_scale":false,"category":"food_and_drink"},"ice_cream":{"keywords":["food","hot","dessert"],"char":"🍨","fitzpatrick_scale":false,"category":"food_and_drink"},"icecream":{"keywords":["food","hot","dessert","summer"],"char":"🍦","fitzpatrick_scale":false,"category":"food_and_drink"},"pie":{"keywords":["food","dessert","pastry"],"char":"🥧","fitzpatrick_scale":false,"category":"food_and_drink"},"cake":{"keywords":["food","dessert"],"char":"🍰","fitzpatrick_scale":false,"category":"food_and_drink"},"birthday":{"keywords":["food","dessert","cake"],"char":"🎂","fitzpatrick_scale":false,"category":"food_and_drink"},"custard":{"keywords":["dessert","food"],"char":"🍮","fitzpatrick_scale":false,"category":"food_and_drink"},"candy":{"keywords":["snack","dessert","sweet","lolly"],"char":"🍬","fitzpatrick_scale":false,"category":"food_and_drink"},"lollipop":{"keywords":["food","snack","candy","sweet"],"char":"🍭","fitzpatrick_scale":false,"category":"food_and_drink"},"chocolate_bar":{"keywords":["food","snack","dessert","sweet"],"char":"🍫","fitzpatrick_scale":false,"category":"food_and_drink"},"popcorn":{"keywords":["food","movie theater","films","snack"],"char":"🍿","fitzpatrick_scale":false,"category":"food_and_drink"},"dumpling":{"keywords":["food","empanada","pierogi","potsticker"],"char":"🥟","fitzpatrick_scale":false,"category":"food_and_drink"},"doughnut":{"keywords":["food","dessert","snack","sweet","donut"],"char":"🍩","fitzpatrick_scale":false,"category":"food_and_drink"},"cookie":{"keywords":["food","snack","oreo","chocolate","sweet","dessert"],"char":"🍪","fitzpatrick_scale":false,"category":"food_and_drink"},"milk_glass":{"keywords":["beverage","drink","cow"],"char":"🥛","fitzpatrick_scale":false,"category":"food_and_drink"},"beer":{"keywords":["relax","beverage","drink","drunk","party","pub","summer","alcohol","booze"],"char":"🍺","fitzpatrick_scale":false,"category":"food_and_drink"},"beers":{"keywords":["relax","beverage","drink","drunk","party","pub","summer","alcohol","booze"],"char":"🍻","fitzpatrick_scale":false,"category":"food_and_drink"},"clinking_glasses":{"keywords":["beverage","drink","party","alcohol","celebrate","cheers"],"char":"🥂","fitzpatrick_scale":false,"category":"food_and_drink"},"wine_glass":{"keywords":["drink","beverage","drunk","alcohol","booze"],"char":"🍷","fitzpatrick_scale":false,"category":"food_and_drink"},"tumbler_glass":{"keywords":["drink","beverage","drunk","alcohol","liquor","booze","bourbon","scotch","whisky","glass","shot"],"char":"🥃","fitzpatrick_scale":false,"category":"food_and_drink"},"cocktail":{"keywords":["drink","drunk","alcohol","beverage","booze","mojito"],"char":"🍸","fitzpatrick_scale":false,"category":"food_and_drink"},"tropical_drink":{"keywords":["beverage","cocktail","summer","beach","alcohol","booze","mojito"],"char":"🍹","fitzpatrick_scale":false,"category":"food_and_drink"},"champagne":{"keywords":["drink","wine","bottle","celebration"],"char":"🍾","fitzpatrick_scale":false,"category":"food_and_drink"},"sake":{"keywords":["wine","drink","drunk","beverage","japanese","alcohol","booze"],"char":"🍶","fitzpatrick_scale":false,"category":"food_and_drink"},"tea":{"keywords":["drink","bowl","breakfast","green","british"],"char":"🍵","fitzpatrick_scale":false,"category":"food_and_drink"},"cup_with_straw":{"keywords":["drink","soda"],"char":"🥤","fitzpatrick_scale":false,"category":"food_and_drink"},"coffee":{"keywords":["beverage","caffeine","latte","espresso"],"char":"☕","fitzpatrick_scale":false,"category":"food_and_drink"},"baby_bottle":{"keywords":["food","container","milk"],"char":"🍼","fitzpatrick_scale":false,"category":"food_and_drink"},"spoon":{"keywords":["cutlery","kitchen","tableware"],"char":"🥄","fitzpatrick_scale":false,"category":"food_and_drink"},"fork_and_knife":{"keywords":["cutlery","kitchen"],"char":"🍴","fitzpatrick_scale":false,"category":"food_and_drink"},"plate_with_cutlery":{"keywords":["food","eat","meal","lunch","dinner","restaurant"],"char":"🍽","fitzpatrick_scale":false,"category":"food_and_drink"},"bowl_with_spoon":{"keywords":["food","breakfast","cereal","oatmeal","porridge"],"char":"🥣","fitzpatrick_scale":false,"category":"food_and_drink"},"takeout_box":{"keywords":["food","leftovers"],"char":"🥡","fitzpatrick_scale":false,"category":"food_and_drink"},"chopsticks":{"keywords":["food"],"char":"🥢","fitzpatrick_scale":false,"category":"food_and_drink"},"soccer":{"keywords":["sports","football"],"char":"⚽","fitzpatrick_scale":false,"category":"activity"},"basketball":{"keywords":["sports","balls","NBA"],"char":"🏀","fitzpatrick_scale":false,"category":"activity"},"football":{"keywords":["sports","balls","NFL"],"char":"🏈","fitzpatrick_scale":false,"category":"activity"},"baseball":{"keywords":["sports","balls"],"char":"⚾","fitzpatrick_scale":false,"category":"activity"},"tennis":{"keywords":["sports","balls","green"],"char":"🎾","fitzpatrick_scale":false,"category":"activity"},"volleyball":{"keywords":["sports","balls"],"char":"🏐","fitzpatrick_scale":false,"category":"activity"},"rugby_football":{"keywords":["sports","team"],"char":"🏉","fitzpatrick_scale":false,"category":"activity"},"8ball":{"keywords":["pool","hobby","game","luck","magic"],"char":"🎱","fitzpatrick_scale":false,"category":"activity"},"golf":{"keywords":["sports","business","flag","hole","summer"],"char":"⛳","fitzpatrick_scale":false,"category":"activity"},"golfing_woman":{"keywords":["sports","business","woman","female"],"char":"🏌️‍♀️","fitzpatrick_scale":false,"category":"activity"},"golfing_man":{"keywords":["sports","business"],"char":"🏌","fitzpatrick_scale":true,"category":"activity"},"ping_pong":{"keywords":["sports","pingpong"],"char":"🏓","fitzpatrick_scale":false,"category":"activity"},"badminton":{"keywords":["sports"],"char":"🏸","fitzpatrick_scale":false,"category":"activity"},"goal_net":{"keywords":["sports"],"char":"🥅","fitzpatrick_scale":false,"category":"activity"},"ice_hockey":{"keywords":["sports"],"char":"🏒","fitzpatrick_scale":false,"category":"activity"},"field_hockey":{"keywords":["sports"],"char":"🏑","fitzpatrick_scale":false,"category":"activity"},"cricket":{"keywords":["sports"],"char":"🏏","fitzpatrick_scale":false,"category":"activity"},"ski":{"keywords":["sports","winter","cold","snow"],"char":"🎿","fitzpatrick_scale":false,"category":"activity"},"skier":{"keywords":["sports","winter","snow"],"char":"⛷","fitzpatrick_scale":true,"category":"activity"},"snowboarder":{"keywords":["sports","winter"],"char":"🏂","fitzpatrick_scale":true,"category":"activity"},"person_fencing":{"keywords":["sports","fencing","sword"],"char":"🤺","fitzpatrick_scale":false,"category":"activity"},"women_wrestling":{"keywords":["sports","wrestlers"],"char":"🤼‍♀️","fitzpatrick_scale":true,"category":"activity"},"men_wrestling":{"keywords":["sports","wrestlers"],"char":"🤼‍♂️","fitzpatrick_scale":true,"category":"activity"},"woman_cartwheeling":{"keywords":["gymnastics"],"char":"🤸‍♀️","fitzpatrick_scale":true,"category":"activity"},"man_cartwheeling":{"keywords":["gymnastics"],"char":"🤸‍♂️","fitzpatrick_scale":true,"category":"activity"},"woman_playing_handball":{"keywords":["sports"],"char":"🤾‍♀️","fitzpatrick_scale":true,"category":"activity"},"man_playing_handball":{"keywords":["sports"],"char":"🤾‍♂️","fitzpatrick_scale":true,"category":"activity"},"ice_skate":{"keywords":["sports"],"char":"⛸","fitzpatrick_scale":false,"category":"activity"},"curling_stone":{"keywords":["sports"],"char":"🥌","fitzpatrick_scale":false,"category":"activity"},"sled":{"keywords":["sleigh","luge","toboggan"],"char":"🛷","fitzpatrick_scale":false,"category":"activity"},"bow_and_arrow":{"keywords":["sports"],"char":"🏹","fitzpatrick_scale":false,"category":"activity"},"fishing_pole_and_fish":{"keywords":["food","hobby","summer"],"char":"🎣","fitzpatrick_scale":false,"category":"activity"},"boxing_glove":{"keywords":["sports","fighting"],"char":"🥊","fitzpatrick_scale":false,"category":"activity"},"martial_arts_uniform":{"keywords":["judo","karate","taekwondo"],"char":"🥋","fitzpatrick_scale":false,"category":"activity"},"rowing_woman":{"keywords":["sports","hobby","water","ship","woman","female"],"char":"🚣‍♀️","fitzpatrick_scale":false,"category":"activity"},"rowing_man":{"keywords":["sports","hobby","water","ship"],"char":"🚣","fitzpatrick_scale":true,"category":"activity"},"climbing_woman":{"keywords":["sports","hobby","woman","female","rock"],"char":"🧗‍♀️","fitzpatrick_scale":true,"category":"activity"},"climbing_man":{"keywords":["sports","hobby","man","male","rock"],"char":"🧗‍♂️","fitzpatrick_scale":true,"category":"activity"},"swimming_woman":{"keywords":["sports","exercise","human","athlete","water","summer","woman","female"],"char":"🏊‍♀️","fitzpatrick_scale":false,"category":"activity"},"swimming_man":{"keywords":["sports","exercise","human","athlete","water","summer"],"char":"🏊","fitzpatrick_scale":true,"category":"activity"},"woman_playing_water_polo":{"keywords":["sports","pool"],"char":"🤽‍♀️","fitzpatrick_scale":true,"category":"activity"},"man_playing_water_polo":{"keywords":["sports","pool"],"char":"🤽‍♂️","fitzpatrick_scale":true,"category":"activity"},"woman_in_lotus_position":{"keywords":["woman","female","meditation","yoga","serenity","zen","mindfulness"],"char":"🧘‍♀️","fitzpatrick_scale":true,"category":"activity"},"man_in_lotus_position":{"keywords":["man","male","meditation","yoga","serenity","zen","mindfulness"],"char":"🧘‍♂️","fitzpatrick_scale":true,"category":"activity"},"surfing_woman":{"keywords":["sports","ocean","sea","summer","beach","woman","female"],"char":"🏄‍♀️","fitzpatrick_scale":false,"category":"activity"},"surfing_man":{"keywords":["sports","ocean","sea","summer","beach"],"char":"🏄","fitzpatrick_scale":true,"category":"activity"},"bath":{"keywords":["clean","shower","bathroom"],"char":"🛀","fitzpatrick_scale":true,"category":"activity"},"basketball_woman":{"keywords":["sports","human","woman","female"],"char":"⛹️‍♀️","fitzpatrick_scale":false,"category":"activity"},"basketball_man":{"keywords":["sports","human"],"char":"⛹","fitzpatrick_scale":true,"category":"activity"},"weight_lifting_woman":{"keywords":["sports","training","exercise","woman","female"],"char":"🏋️‍♀️","fitzpatrick_scale":false,"category":"activity"},"weight_lifting_man":{"keywords":["sports","training","exercise"],"char":"🏋","fitzpatrick_scale":true,"category":"activity"},"biking_woman":{"keywords":["sports","bike","exercise","hipster","woman","female"],"char":"🚴‍♀️","fitzpatrick_scale":false,"category":"activity"},"biking_man":{"keywords":["sports","bike","exercise","hipster"],"char":"🚴","fitzpatrick_scale":true,"category":"activity"},"mountain_biking_woman":{"keywords":["transportation","sports","human","race","bike","woman","female"],"char":"🚵‍♀️","fitzpatrick_scale":false,"category":"activity"},"mountain_biking_man":{"keywords":["transportation","sports","human","race","bike"],"char":"🚵","fitzpatrick_scale":true,"category":"activity"},"horse_racing":{"keywords":["animal","betting","competition","gambling","luck"],"char":"🏇","fitzpatrick_scale":true,"category":"activity"},"business_suit_levitating":{"keywords":["suit","business","levitate","hover","jump"],"char":"🕴","fitzpatrick_scale":true,"category":"activity"},"trophy":{"keywords":["win","award","contest","place","ftw","ceremony"],"char":"🏆","fitzpatrick_scale":false,"category":"activity"},"running_shirt_with_sash":{"keywords":["play","pageant"],"char":"🎽","fitzpatrick_scale":false,"category":"activity"},"medal_sports":{"keywords":["award","winning"],"char":"🏅","fitzpatrick_scale":false,"category":"activity"},"medal_military":{"keywords":["award","winning","army"],"char":"🎖","fitzpatrick_scale":false,"category":"activity"},"1st_place_medal":{"keywords":["award","winning","first"],"char":"🥇","fitzpatrick_scale":false,"category":"activity"},"2nd_place_medal":{"keywords":["award","second"],"char":"🥈","fitzpatrick_scale":false,"category":"activity"},"3rd_place_medal":{"keywords":["award","third"],"char":"🥉","fitzpatrick_scale":false,"category":"activity"},"reminder_ribbon":{"keywords":["sports","cause","support","awareness"],"char":"🎗","fitzpatrick_scale":false,"category":"activity"},"rosette":{"keywords":["flower","decoration","military"],"char":"🏵","fitzpatrick_scale":false,"category":"activity"},"ticket":{"keywords":["event","concert","pass"],"char":"🎫","fitzpatrick_scale":false,"category":"activity"},"tickets":{"keywords":["sports","concert","entrance"],"char":"🎟","fitzpatrick_scale":false,"category":"activity"},"performing_arts":{"keywords":["acting","theater","drama"],"char":"🎭","fitzpatrick_scale":false,"category":"activity"},"art":{"keywords":["design","paint","draw","colors"],"char":"🎨","fitzpatrick_scale":false,"category":"activity"},"circus_tent":{"keywords":["festival","carnival","party"],"char":"🎪","fitzpatrick_scale":false,"category":"activity"},"woman_juggling":{"keywords":["juggle","balance","skill","multitask"],"char":"🤹‍♀️","fitzpatrick_scale":true,"category":"activity"},"man_juggling":{"keywords":["juggle","balance","skill","multitask"],"char":"🤹‍♂️","fitzpatrick_scale":true,"category":"activity"},"microphone":{"keywords":["sound","music","PA","sing","talkshow"],"char":"🎤","fitzpatrick_scale":false,"category":"activity"},"headphones":{"keywords":["music","score","gadgets"],"char":"🎧","fitzpatrick_scale":false,"category":"activity"},"musical_score":{"keywords":["treble","clef","compose"],"char":"🎼","fitzpatrick_scale":false,"category":"activity"},"musical_keyboard":{"keywords":["piano","instrument","compose"],"char":"🎹","fitzpatrick_scale":false,"category":"activity"},"drum":{"keywords":["music","instrument","drumsticks","snare"],"char":"🥁","fitzpatrick_scale":false,"category":"activity"},"saxophone":{"keywords":["music","instrument","jazz","blues"],"char":"🎷","fitzpatrick_scale":false,"category":"activity"},"trumpet":{"keywords":["music","brass"],"char":"🎺","fitzpatrick_scale":false,"category":"activity"},"guitar":{"keywords":["music","instrument"],"char":"🎸","fitzpatrick_scale":false,"category":"activity"},"violin":{"keywords":["music","instrument","orchestra","symphony"],"char":"🎻","fitzpatrick_scale":false,"category":"activity"},"clapper":{"keywords":["movie","film","record"],"char":"🎬","fitzpatrick_scale":false,"category":"activity"},"video_game":{"keywords":["play","console","PS4","controller"],"char":"🎮","fitzpatrick_scale":false,"category":"activity"},"space_invader":{"keywords":["game","arcade","play"],"char":"👾","fitzpatrick_scale":false,"category":"activity"},"dart":{"keywords":["game","play","bar","target","bullseye"],"char":"🎯","fitzpatrick_scale":false,"category":"activity"},"game_die":{"keywords":["dice","random","tabletop","play","luck"],"char":"🎲","fitzpatrick_scale":false,"category":"activity"},"slot_machine":{"keywords":["bet","gamble","vegas","fruit machine","luck","casino"],"char":"🎰","fitzpatrick_scale":false,"category":"activity"},"bowling":{"keywords":["sports","fun","play"],"char":"🎳","fitzpatrick_scale":false,"category":"activity"},"red_car":{"keywords":["red","transportation","vehicle"],"char":"🚗","fitzpatrick_scale":false,"category":"travel_and_places"},"taxi":{"keywords":["uber","vehicle","cars","transportation"],"char":"🚕","fitzpatrick_scale":false,"category":"travel_and_places"},"blue_car":{"keywords":["transportation","vehicle"],"char":"🚙","fitzpatrick_scale":false,"category":"travel_and_places"},"bus":{"keywords":["car","vehicle","transportation"],"char":"🚌","fitzpatrick_scale":false,"category":"travel_and_places"},"trolleybus":{"keywords":["bart","transportation","vehicle"],"char":"🚎","fitzpatrick_scale":false,"category":"travel_and_places"},"racing_car":{"keywords":["sports","race","fast","formula","f1"],"char":"🏎","fitzpatrick_scale":false,"category":"travel_and_places"},"police_car":{"keywords":["vehicle","cars","transportation","law","legal","enforcement"],"char":"🚓","fitzpatrick_scale":false,"category":"travel_and_places"},"ambulance":{"keywords":["health","911","hospital"],"char":"🚑","fitzpatrick_scale":false,"category":"travel_and_places"},"fire_engine":{"keywords":["transportation","cars","vehicle"],"char":"🚒","fitzpatrick_scale":false,"category":"travel_and_places"},"minibus":{"keywords":["vehicle","car","transportation"],"char":"🚐","fitzpatrick_scale":false,"category":"travel_and_places"},"truck":{"keywords":["cars","transportation"],"char":"🚚","fitzpatrick_scale":false,"category":"travel_and_places"},"articulated_lorry":{"keywords":["vehicle","cars","transportation","express"],"char":"🚛","fitzpatrick_scale":false,"category":"travel_and_places"},"tractor":{"keywords":["vehicle","car","farming","agriculture"],"char":"🚜","fitzpatrick_scale":false,"category":"travel_and_places"},"kick_scooter":{"keywords":["vehicle","kick","razor"],"char":"🛴","fitzpatrick_scale":false,"category":"travel_and_places"},"motorcycle":{"keywords":["race","sports","fast"],"char":"🏍","fitzpatrick_scale":false,"category":"travel_and_places"},"bike":{"keywords":["sports","bicycle","exercise","hipster"],"char":"🚲","fitzpatrick_scale":false,"category":"travel_and_places"},"motor_scooter":{"keywords":["vehicle","vespa","sasha"],"char":"🛵","fitzpatrick_scale":false,"category":"travel_and_places"},"rotating_light":{"keywords":["police","ambulance","911","emergency","alert","error","pinged","law","legal"],"char":"🚨","fitzpatrick_scale":false,"category":"travel_and_places"},"oncoming_police_car":{"keywords":["vehicle","law","legal","enforcement","911"],"char":"🚔","fitzpatrick_scale":false,"category":"travel_and_places"},"oncoming_bus":{"keywords":["vehicle","transportation"],"char":"🚍","fitzpatrick_scale":false,"category":"travel_and_places"},"oncoming_automobile":{"keywords":["car","vehicle","transportation"],"char":"🚘","fitzpatrick_scale":false,"category":"travel_and_places"},"oncoming_taxi":{"keywords":["vehicle","cars","uber"],"char":"🚖","fitzpatrick_scale":false,"category":"travel_and_places"},"aerial_tramway":{"keywords":["transportation","vehicle","ski"],"char":"🚡","fitzpatrick_scale":false,"category":"travel_and_places"},"mountain_cableway":{"keywords":["transportation","vehicle","ski"],"char":"🚠","fitzpatrick_scale":false,"category":"travel_and_places"},"suspension_railway":{"keywords":["vehicle","transportation"],"char":"🚟","fitzpatrick_scale":false,"category":"travel_and_places"},"railway_car":{"keywords":["transportation","vehicle"],"char":"🚃","fitzpatrick_scale":false,"category":"travel_and_places"},"train":{"keywords":["transportation","vehicle","carriage","public","travel"],"char":"🚋","fitzpatrick_scale":false,"category":"travel_and_places"},"monorail":{"keywords":["transportation","vehicle"],"char":"🚝","fitzpatrick_scale":false,"category":"travel_and_places"},"bullettrain_side":{"keywords":["transportation","vehicle"],"char":"🚄","fitzpatrick_scale":false,"category":"travel_and_places"},"bullettrain_front":{"keywords":["transportation","vehicle","speed","fast","public","travel"],"char":"🚅","fitzpatrick_scale":false,"category":"travel_and_places"},"light_rail":{"keywords":["transportation","vehicle"],"char":"🚈","fitzpatrick_scale":false,"category":"travel_and_places"},"mountain_railway":{"keywords":["transportation","vehicle"],"char":"🚞","fitzpatrick_scale":false,"category":"travel_and_places"},"steam_locomotive":{"keywords":["transportation","vehicle","train"],"char":"🚂","fitzpatrick_scale":false,"category":"travel_and_places"},"train2":{"keywords":["transportation","vehicle"],"char":"🚆","fitzpatrick_scale":false,"category":"travel_and_places"},"metro":{"keywords":["transportation","blue-square","mrt","underground","tube"],"char":"🚇","fitzpatrick_scale":false,"category":"travel_and_places"},"tram":{"keywords":["transportation","vehicle"],"char":"🚊","fitzpatrick_scale":false,"category":"travel_and_places"},"station":{"keywords":["transportation","vehicle","public"],"char":"🚉","fitzpatrick_scale":false,"category":"travel_and_places"},"flying_saucer":{"keywords":["transportation","vehicle","ufo"],"char":"🛸","fitzpatrick_scale":false,"category":"travel_and_places"},"helicopter":{"keywords":["transportation","vehicle","fly"],"char":"🚁","fitzpatrick_scale":false,"category":"travel_and_places"},"small_airplane":{"keywords":["flight","transportation","fly","vehicle"],"char":"🛩","fitzpatrick_scale":false,"category":"travel_and_places"},"airplane":{"keywords":["vehicle","transportation","flight","fly"],"char":"✈️","fitzpatrick_scale":false,"category":"travel_and_places"},"flight_departure":{"keywords":["airport","flight","landing"],"char":"🛫","fitzpatrick_scale":false,"category":"travel_and_places"},"flight_arrival":{"keywords":["airport","flight","boarding"],"char":"🛬","fitzpatrick_scale":false,"category":"travel_and_places"},"sailboat":{"keywords":["ship","summer","transportation","water","sailing"],"char":"⛵","fitzpatrick_scale":false,"category":"travel_and_places"},"motor_boat":{"keywords":["ship"],"char":"🛥","fitzpatrick_scale":false,"category":"travel_and_places"},"speedboat":{"keywords":["ship","transportation","vehicle","summer"],"char":"🚤","fitzpatrick_scale":false,"category":"travel_and_places"},"ferry":{"keywords":["boat","ship","yacht"],"char":"⛴","fitzpatrick_scale":false,"category":"travel_and_places"},"passenger_ship":{"keywords":["yacht","cruise","ferry"],"char":"🛳","fitzpatrick_scale":false,"category":"travel_and_places"},"rocket":{"keywords":["launch","ship","staffmode","NASA","outer space","outer_space","fly"],"char":"🚀","fitzpatrick_scale":false,"category":"travel_and_places"},"artificial_satellite":{"keywords":["communication","gps","orbit","spaceflight","NASA","ISS"],"char":"🛰","fitzpatrick_scale":false,"category":"travel_and_places"},"seat":{"keywords":["sit","airplane","transport","bus","flight","fly"],"char":"💺","fitzpatrick_scale":false,"category":"travel_and_places"},"canoe":{"keywords":["boat","paddle","water","ship"],"char":"🛶","fitzpatrick_scale":false,"category":"travel_and_places"},"anchor":{"keywords":["ship","ferry","sea","boat"],"char":"⚓","fitzpatrick_scale":false,"category":"travel_and_places"},"construction":{"keywords":["wip","progress","caution","warning"],"char":"🚧","fitzpatrick_scale":false,"category":"travel_and_places"},"fuelpump":{"keywords":["gas station","petroleum"],"char":"⛽","fitzpatrick_scale":false,"category":"travel_and_places"},"busstop":{"keywords":["transportation","wait"],"char":"🚏","fitzpatrick_scale":false,"category":"travel_and_places"},"vertical_traffic_light":{"keywords":["transportation","driving"],"char":"🚦","fitzpatrick_scale":false,"category":"travel_and_places"},"traffic_light":{"keywords":["transportation","signal"],"char":"🚥","fitzpatrick_scale":false,"category":"travel_and_places"},"checkered_flag":{"keywords":["contest","finishline","race","gokart"],"char":"🏁","fitzpatrick_scale":false,"category":"travel_and_places"},"ship":{"keywords":["transportation","titanic","deploy"],"char":"🚢","fitzpatrick_scale":false,"category":"travel_and_places"},"ferris_wheel":{"keywords":["photo","carnival","londoneye"],"char":"🎡","fitzpatrick_scale":false,"category":"travel_and_places"},"roller_coaster":{"keywords":["carnival","playground","photo","fun"],"char":"🎢","fitzpatrick_scale":false,"category":"travel_and_places"},"carousel_horse":{"keywords":["photo","carnival"],"char":"🎠","fitzpatrick_scale":false,"category":"travel_and_places"},"building_construction":{"keywords":["wip","working","progress"],"char":"🏗","fitzpatrick_scale":false,"category":"travel_and_places"},"foggy":{"keywords":["photo","mountain"],"char":"🌁","fitzpatrick_scale":false,"category":"travel_and_places"},"tokyo_tower":{"keywords":["photo","japanese"],"char":"🗼","fitzpatrick_scale":false,"category":"travel_and_places"},"factory":{"keywords":["building","industry","pollution","smoke"],"char":"🏭","fitzpatrick_scale":false,"category":"travel_and_places"},"fountain":{"keywords":["photo","summer","water","fresh"],"char":"⛲","fitzpatrick_scale":false,"category":"travel_and_places"},"rice_scene":{"keywords":["photo","japan","asia","tsukimi"],"char":"🎑","fitzpatrick_scale":false,"category":"travel_and_places"},"mountain":{"keywords":["photo","nature","environment"],"char":"⛰","fitzpatrick_scale":false,"category":"travel_and_places"},"mountain_snow":{"keywords":["photo","nature","environment","winter","cold"],"char":"🏔","fitzpatrick_scale":false,"category":"travel_and_places"},"mount_fuji":{"keywords":["photo","mountain","nature","japanese"],"char":"🗻","fitzpatrick_scale":false,"category":"travel_and_places"},"volcano":{"keywords":["photo","nature","disaster"],"char":"🌋","fitzpatrick_scale":false,"category":"travel_and_places"},"japan":{"keywords":["nation","country","japanese","asia"],"char":"🗾","fitzpatrick_scale":false,"category":"travel_and_places"},"camping":{"keywords":["photo","outdoors","tent"],"char":"🏕","fitzpatrick_scale":false,"category":"travel_and_places"},"tent":{"keywords":["photo","camping","outdoors"],"char":"⛺","fitzpatrick_scale":false,"category":"travel_and_places"},"national_park":{"keywords":["photo","environment","nature"],"char":"🏞","fitzpatrick_scale":false,"category":"travel_and_places"},"motorway":{"keywords":["road","cupertino","interstate","highway"],"char":"🛣","fitzpatrick_scale":false,"category":"travel_and_places"},"railway_track":{"keywords":["train","transportation"],"char":"🛤","fitzpatrick_scale":false,"category":"travel_and_places"},"sunrise":{"keywords":["morning","view","vacation","photo"],"char":"🌅","fitzpatrick_scale":false,"category":"travel_and_places"},"sunrise_over_mountains":{"keywords":["view","vacation","photo"],"char":"🌄","fitzpatrick_scale":false,"category":"travel_and_places"},"desert":{"keywords":["photo","warm","saharah"],"char":"🏜","fitzpatrick_scale":false,"category":"travel_and_places"},"beach_umbrella":{"keywords":["weather","summer","sunny","sand","mojito"],"char":"🏖","fitzpatrick_scale":false,"category":"travel_and_places"},"desert_island":{"keywords":["photo","tropical","mojito"],"char":"🏝","fitzpatrick_scale":false,"category":"travel_and_places"},"city_sunrise":{"keywords":["photo","good morning","dawn"],"char":"🌇","fitzpatrick_scale":false,"category":"travel_and_places"},"city_sunset":{"keywords":["photo","evening","sky","buildings"],"char":"🌆","fitzpatrick_scale":false,"category":"travel_and_places"},"cityscape":{"keywords":["photo","night life","urban"],"char":"🏙","fitzpatrick_scale":false,"category":"travel_and_places"},"night_with_stars":{"keywords":["evening","city","downtown"],"char":"🌃","fitzpatrick_scale":false,"category":"travel_and_places"},"bridge_at_night":{"keywords":["photo","sanfrancisco"],"char":"🌉","fitzpatrick_scale":false,"category":"travel_and_places"},"milky_way":{"keywords":["photo","space","stars"],"char":"🌌","fitzpatrick_scale":false,"category":"travel_and_places"},"stars":{"keywords":["night","photo"],"char":"🌠","fitzpatrick_scale":false,"category":"travel_and_places"},"sparkler":{"keywords":["stars","night","shine"],"char":"🎇","fitzpatrick_scale":false,"category":"travel_and_places"},"fireworks":{"keywords":["photo","festival","carnival","congratulations"],"char":"🎆","fitzpatrick_scale":false,"category":"travel_and_places"},"rainbow":{"keywords":["nature","happy","unicorn_face","photo","sky","spring"],"char":"🌈","fitzpatrick_scale":false,"category":"travel_and_places"},"houses":{"keywords":["buildings","photo"],"char":"🏘","fitzpatrick_scale":false,"category":"travel_and_places"},"european_castle":{"keywords":["building","royalty","history"],"char":"🏰","fitzpatrick_scale":false,"category":"travel_and_places"},"japanese_castle":{"keywords":["photo","building"],"char":"🏯","fitzpatrick_scale":false,"category":"travel_and_places"},"stadium":{"keywords":["photo","place","sports","concert","venue"],"char":"🏟","fitzpatrick_scale":false,"category":"travel_and_places"},"statue_of_liberty":{"keywords":["american","newyork"],"char":"🗽","fitzpatrick_scale":false,"category":"travel_and_places"},"house":{"keywords":["building","home"],"char":"🏠","fitzpatrick_scale":false,"category":"travel_and_places"},"house_with_garden":{"keywords":["home","plant","nature"],"char":"🏡","fitzpatrick_scale":false,"category":"travel_and_places"},"derelict_house":{"keywords":["abandon","evict","broken","building"],"char":"🏚","fitzpatrick_scale":false,"category":"travel_and_places"},"office":{"keywords":["building","bureau","work"],"char":"🏢","fitzpatrick_scale":false,"category":"travel_and_places"},"department_store":{"keywords":["building","shopping","mall"],"char":"🏬","fitzpatrick_scale":false,"category":"travel_and_places"},"post_office":{"keywords":["building","envelope","communication"],"char":"🏣","fitzpatrick_scale":false,"category":"travel_and_places"},"european_post_office":{"keywords":["building","email"],"char":"🏤","fitzpatrick_scale":false,"category":"travel_and_places"},"hospital":{"keywords":["building","health","surgery","doctor"],"char":"🏥","fitzpatrick_scale":false,"category":"travel_and_places"},"bank":{"keywords":["building","money","sales","cash","business","enterprise"],"char":"🏦","fitzpatrick_scale":false,"category":"travel_and_places"},"hotel":{"keywords":["building","accomodation","checkin"],"char":"🏨","fitzpatrick_scale":false,"category":"travel_and_places"},"convenience_store":{"keywords":["building","shopping","groceries"],"char":"🏪","fitzpatrick_scale":false,"category":"travel_and_places"},"school":{"keywords":["building","student","education","learn","teach"],"char":"🏫","fitzpatrick_scale":false,"category":"travel_and_places"},"love_hotel":{"keywords":["like","affection","dating"],"char":"🏩","fitzpatrick_scale":false,"category":"travel_and_places"},"wedding":{"keywords":["love","like","affection","couple","marriage","bride","groom"],"char":"💒","fitzpatrick_scale":false,"category":"travel_and_places"},"classical_building":{"keywords":["art","culture","history"],"char":"🏛","fitzpatrick_scale":false,"category":"travel_and_places"},"church":{"keywords":["building","religion","christ"],"char":"⛪","fitzpatrick_scale":false,"category":"travel_and_places"},"mosque":{"keywords":["islam","worship","minaret"],"char":"🕌","fitzpatrick_scale":false,"category":"travel_and_places"},"synagogue":{"keywords":["judaism","worship","temple","jewish"],"char":"🕍","fitzpatrick_scale":false,"category":"travel_and_places"},"kaaba":{"keywords":["mecca","mosque","islam"],"char":"🕋","fitzpatrick_scale":false,"category":"travel_and_places"},"shinto_shrine":{"keywords":["temple","japan","kyoto"],"char":"⛩","fitzpatrick_scale":false,"category":"travel_and_places"},"watch":{"keywords":["time","accessories"],"char":"⌚","fitzpatrick_scale":false,"category":"objects"},"iphone":{"keywords":["technology","apple","gadgets","dial"],"char":"📱","fitzpatrick_scale":false,"category":"objects"},"calling":{"keywords":["iphone","incoming"],"char":"📲","fitzpatrick_scale":false,"category":"objects"},"computer":{"keywords":["technology","laptop","screen","display","monitor"],"char":"💻","fitzpatrick_scale":false,"category":"objects"},"keyboard":{"keywords":["technology","computer","type","input","text"],"char":"⌨","fitzpatrick_scale":false,"category":"objects"},"desktop_computer":{"keywords":["technology","computing","screen"],"char":"🖥","fitzpatrick_scale":false,"category":"objects"},"printer":{"keywords":["paper","ink"],"char":"🖨","fitzpatrick_scale":false,"category":"objects"},"computer_mouse":{"keywords":["click"],"char":"🖱","fitzpatrick_scale":false,"category":"objects"},"trackball":{"keywords":["technology","trackpad"],"char":"🖲","fitzpatrick_scale":false,"category":"objects"},"joystick":{"keywords":["game","play"],"char":"🕹","fitzpatrick_scale":false,"category":"objects"},"clamp":{"keywords":["tool"],"char":"🗜","fitzpatrick_scale":false,"category":"objects"},"minidisc":{"keywords":["technology","record","data","disk","90s"],"char":"💽","fitzpatrick_scale":false,"category":"objects"},"floppy_disk":{"keywords":["oldschool","technology","save","90s","80s"],"char":"💾","fitzpatrick_scale":false,"category":"objects"},"cd":{"keywords":["technology","dvd","disk","disc","90s"],"char":"💿","fitzpatrick_scale":false,"category":"objects"},"dvd":{"keywords":["cd","disk","disc"],"char":"📀","fitzpatrick_scale":false,"category":"objects"},"vhs":{"keywords":["record","video","oldschool","90s","80s"],"char":"📼","fitzpatrick_scale":false,"category":"objects"},"camera":{"keywords":["gadgets","photography"],"char":"📷","fitzpatrick_scale":false,"category":"objects"},"camera_flash":{"keywords":["photography","gadgets"],"char":"📸","fitzpatrick_scale":false,"category":"objects"},"video_camera":{"keywords":["film","record"],"char":"📹","fitzpatrick_scale":false,"category":"objects"},"movie_camera":{"keywords":["film","record"],"char":"🎥","fitzpatrick_scale":false,"category":"objects"},"film_projector":{"keywords":["video","tape","record","movie"],"char":"📽","fitzpatrick_scale":false,"category":"objects"},"film_strip":{"keywords":["movie"],"char":"🎞","fitzpatrick_scale":false,"category":"objects"},"telephone_receiver":{"keywords":["technology","communication","dial"],"char":"📞","fitzpatrick_scale":false,"category":"objects"},"phone":{"keywords":["technology","communication","dial","telephone"],"char":"☎️","fitzpatrick_scale":false,"category":"objects"},"pager":{"keywords":["bbcall","oldschool","90s"],"char":"📟","fitzpatrick_scale":false,"category":"objects"},"fax":{"keywords":["communication","technology"],"char":"📠","fitzpatrick_scale":false,"category":"objects"},"tv":{"keywords":["technology","program","oldschool","show","television"],"char":"📺","fitzpatrick_scale":false,"category":"objects"},"radio":{"keywords":["communication","music","podcast","program"],"char":"📻","fitzpatrick_scale":false,"category":"objects"},"studio_microphone":{"keywords":["sing","recording","artist","talkshow"],"char":"🎙","fitzpatrick_scale":false,"category":"objects"},"level_slider":{"keywords":["scale"],"char":"🎚","fitzpatrick_scale":false,"category":"objects"},"control_knobs":{"keywords":["dial"],"char":"🎛","fitzpatrick_scale":false,"category":"objects"},"stopwatch":{"keywords":["time","deadline"],"char":"⏱","fitzpatrick_scale":false,"category":"objects"},"timer_clock":{"keywords":["alarm"],"char":"⏲","fitzpatrick_scale":false,"category":"objects"},"alarm_clock":{"keywords":["time","wake"],"char":"⏰","fitzpatrick_scale":false,"category":"objects"},"mantelpiece_clock":{"keywords":["time"],"char":"🕰","fitzpatrick_scale":false,"category":"objects"},"hourglass_flowing_sand":{"keywords":["oldschool","time","countdown"],"char":"⏳","fitzpatrick_scale":false,"category":"objects"},"hourglass":{"keywords":["time","clock","oldschool","limit","exam","quiz","test"],"char":"⌛","fitzpatrick_scale":false,"category":"objects"},"satellite":{"keywords":["communication","future","radio","space"],"char":"📡","fitzpatrick_scale":false,"category":"objects"},"battery":{"keywords":["power","energy","sustain"],"char":"🔋","fitzpatrick_scale":false,"category":"objects"},"electric_plug":{"keywords":["charger","power"],"char":"🔌","fitzpatrick_scale":false,"category":"objects"},"bulb":{"keywords":["light","electricity","idea"],"char":"💡","fitzpatrick_scale":false,"category":"objects"},"flashlight":{"keywords":["dark","camping","sight","night"],"char":"🔦","fitzpatrick_scale":false,"category":"objects"},"candle":{"keywords":["fire","wax"],"char":"🕯","fitzpatrick_scale":false,"category":"objects"},"wastebasket":{"keywords":["bin","trash","rubbish","garbage","toss"],"char":"🗑","fitzpatrick_scale":false,"category":"objects"},"oil_drum":{"keywords":["barrell"],"char":"🛢","fitzpatrick_scale":false,"category":"objects"},"money_with_wings":{"keywords":["dollar","bills","payment","sale"],"char":"💸","fitzpatrick_scale":false,"category":"objects"},"dollar":{"keywords":["money","sales","bill","currency"],"char":"💵","fitzpatrick_scale":false,"category":"objects"},"yen":{"keywords":["money","sales","japanese","dollar","currency"],"char":"💴","fitzpatrick_scale":false,"category":"objects"},"euro":{"keywords":["money","sales","dollar","currency"],"char":"💶","fitzpatrick_scale":false,"category":"objects"},"pound":{"keywords":["british","sterling","money","sales","bills","uk","england","currency"],"char":"💷","fitzpatrick_scale":false,"category":"objects"},"moneybag":{"keywords":["dollar","payment","coins","sale"],"char":"💰","fitzpatrick_scale":false,"category":"objects"},"credit_card":{"keywords":["money","sales","dollar","bill","payment","shopping"],"char":"💳","fitzpatrick_scale":false,"category":"objects"},"gem":{"keywords":["blue","ruby","diamond","jewelry"],"char":"💎","fitzpatrick_scale":false,"category":"objects"},"balance_scale":{"keywords":["law","fairness","weight"],"char":"⚖","fitzpatrick_scale":false,"category":"objects"},"wrench":{"keywords":["tools","diy","ikea","fix","maintainer"],"char":"🔧","fitzpatrick_scale":false,"category":"objects"},"hammer":{"keywords":["tools","build","create"],"char":"🔨","fitzpatrick_scale":false,"category":"objects"},"hammer_and_pick":{"keywords":["tools","build","create"],"char":"⚒","fitzpatrick_scale":false,"category":"objects"},"hammer_and_wrench":{"keywords":["tools","build","create"],"char":"🛠","fitzpatrick_scale":false,"category":"objects"},"pick":{"keywords":["tools","dig"],"char":"⛏","fitzpatrick_scale":false,"category":"objects"},"nut_and_bolt":{"keywords":["handy","tools","fix"],"char":"🔩","fitzpatrick_scale":false,"category":"objects"},"gear":{"keywords":["cog"],"char":"⚙","fitzpatrick_scale":false,"category":"objects"},"chains":{"keywords":["lock","arrest"],"char":"⛓","fitzpatrick_scale":false,"category":"objects"},"gun":{"keywords":["violence","weapon","pistol","revolver"],"char":"🔫","fitzpatrick_scale":false,"category":"objects"},"bomb":{"keywords":["boom","explode","explosion","terrorism"],"char":"💣","fitzpatrick_scale":false,"category":"objects"},"hocho":{"keywords":["knife","blade","cutlery","kitchen","weapon"],"char":"🔪","fitzpatrick_scale":false,"category":"objects"},"dagger":{"keywords":["weapon"],"char":"🗡","fitzpatrick_scale":false,"category":"objects"},"crossed_swords":{"keywords":["weapon"],"char":"⚔","fitzpatrick_scale":false,"category":"objects"},"shield":{"keywords":["protection","security"],"char":"🛡","fitzpatrick_scale":false,"category":"objects"},"smoking":{"keywords":["kills","tobacco","cigarette","joint","smoke"],"char":"🚬","fitzpatrick_scale":false,"category":"objects"},"skull_and_crossbones":{"keywords":["poison","danger","deadly","scary","death","pirate","evil"],"char":"☠","fitzpatrick_scale":false,"category":"objects"},"coffin":{"keywords":["vampire","dead","die","death","rip","graveyard","cemetery","casket","funeral","box"],"char":"⚰","fitzpatrick_scale":false,"category":"objects"},"funeral_urn":{"keywords":["dead","die","death","rip","ashes"],"char":"⚱","fitzpatrick_scale":false,"category":"objects"},"amphora":{"keywords":["vase","jar"],"char":"🏺","fitzpatrick_scale":false,"category":"objects"},"crystal_ball":{"keywords":["disco","party","magic","circus","fortune_teller"],"char":"🔮","fitzpatrick_scale":false,"category":"objects"},"prayer_beads":{"keywords":["dhikr","religious"],"char":"📿","fitzpatrick_scale":false,"category":"objects"},"barber":{"keywords":["hair","salon","style"],"char":"💈","fitzpatrick_scale":false,"category":"objects"},"alembic":{"keywords":["distilling","science","experiment","chemistry"],"char":"⚗","fitzpatrick_scale":false,"category":"objects"},"telescope":{"keywords":["stars","space","zoom","science","astronomy"],"char":"🔭","fitzpatrick_scale":false,"category":"objects"},"microscope":{"keywords":["laboratory","experiment","zoomin","science","study"],"char":"🔬","fitzpatrick_scale":false,"category":"objects"},"hole":{"keywords":["embarrassing"],"char":"🕳","fitzpatrick_scale":false,"category":"objects"},"pill":{"keywords":["health","medicine","doctor","pharmacy","drug"],"char":"💊","fitzpatrick_scale":false,"category":"objects"},"syringe":{"keywords":["health","hospital","drugs","blood","medicine","needle","doctor","nurse"],"char":"💉","fitzpatrick_scale":false,"category":"objects"},"thermometer":{"keywords":["weather","temperature","hot","cold"],"char":"🌡","fitzpatrick_scale":false,"category":"objects"},"label":{"keywords":["sale","tag"],"char":"🏷","fitzpatrick_scale":false,"category":"objects"},"bookmark":{"keywords":["favorite","label","save"],"char":"🔖","fitzpatrick_scale":false,"category":"objects"},"toilet":{"keywords":["restroom","wc","washroom","bathroom","potty"],"char":"🚽","fitzpatrick_scale":false,"category":"objects"},"shower":{"keywords":["clean","water","bathroom"],"char":"🚿","fitzpatrick_scale":false,"category":"objects"},"bathtub":{"keywords":["clean","shower","bathroom"],"char":"🛁","fitzpatrick_scale":false,"category":"objects"},"key":{"keywords":["lock","door","password"],"char":"🔑","fitzpatrick_scale":false,"category":"objects"},"old_key":{"keywords":["lock","door","password"],"char":"🗝","fitzpatrick_scale":false,"category":"objects"},"couch_and_lamp":{"keywords":["read","chill"],"char":"🛋","fitzpatrick_scale":false,"category":"objects"},"sleeping_bed":{"keywords":["bed","rest"],"char":"🛌","fitzpatrick_scale":true,"category":"objects"},"bed":{"keywords":["sleep","rest"],"char":"🛏","fitzpatrick_scale":false,"category":"objects"},"door":{"keywords":["house","entry","exit"],"char":"🚪","fitzpatrick_scale":false,"category":"objects"},"bellhop_bell":{"keywords":["service"],"char":"🛎","fitzpatrick_scale":false,"category":"objects"},"framed_picture":{"keywords":["photography"],"char":"🖼","fitzpatrick_scale":false,"category":"objects"},"world_map":{"keywords":["location","direction"],"char":"🗺","fitzpatrick_scale":false,"category":"objects"},"parasol_on_ground":{"keywords":["weather","summer"],"char":"⛱","fitzpatrick_scale":false,"category":"objects"},"moyai":{"keywords":["rock","easter island","moai"],"char":"🗿","fitzpatrick_scale":false,"category":"objects"},"shopping":{"keywords":["mall","buy","purchase"],"char":"🛍","fitzpatrick_scale":false,"category":"objects"},"shopping_cart":{"keywords":["trolley"],"char":"🛒","fitzpatrick_scale":false,"category":"objects"},"balloon":{"keywords":["party","celebration","birthday","circus"],"char":"🎈","fitzpatrick_scale":false,"category":"objects"},"flags":{"keywords":["fish","japanese","koinobori","carp","banner"],"char":"🎏","fitzpatrick_scale":false,"category":"objects"},"ribbon":{"keywords":["decoration","pink","girl","bowtie"],"char":"🎀","fitzpatrick_scale":false,"category":"objects"},"gift":{"keywords":["present","birthday","christmas","xmas"],"char":"🎁","fitzpatrick_scale":false,"category":"objects"},"confetti_ball":{"keywords":["festival","party","birthday","circus"],"char":"🎊","fitzpatrick_scale":false,"category":"objects"},"tada":{"keywords":["party","congratulations","birthday","magic","circus","celebration"],"char":"🎉","fitzpatrick_scale":false,"category":"objects"},"dolls":{"keywords":["japanese","toy","kimono"],"char":"🎎","fitzpatrick_scale":false,"category":"objects"},"wind_chime":{"keywords":["nature","ding","spring","bell"],"char":"🎐","fitzpatrick_scale":false,"category":"objects"},"crossed_flags":{"keywords":["japanese","nation","country","border"],"char":"🎌","fitzpatrick_scale":false,"category":"objects"},"izakaya_lantern":{"keywords":["light","paper","halloween","spooky"],"char":"🏮","fitzpatrick_scale":false,"category":"objects"},"email":{"keywords":["letter","postal","inbox","communication"],"char":"✉️","fitzpatrick_scale":false,"category":"objects"},"envelope_with_arrow":{"keywords":["email","communication"],"char":"📩","fitzpatrick_scale":false,"category":"objects"},"incoming_envelope":{"keywords":["email","inbox"],"char":"📨","fitzpatrick_scale":false,"category":"objects"},"e-mail":{"keywords":["communication","inbox"],"char":"📧","fitzpatrick_scale":false,"category":"objects"},"love_letter":{"keywords":["email","like","affection","envelope","valentines"],"char":"💌","fitzpatrick_scale":false,"category":"objects"},"postbox":{"keywords":["email","letter","envelope"],"char":"📮","fitzpatrick_scale":false,"category":"objects"},"mailbox_closed":{"keywords":["email","communication","inbox"],"char":"📪","fitzpatrick_scale":false,"category":"objects"},"mailbox":{"keywords":["email","inbox","communication"],"char":"📫","fitzpatrick_scale":false,"category":"objects"},"mailbox_with_mail":{"keywords":["email","inbox","communication"],"char":"📬","fitzpatrick_scale":false,"category":"objects"},"mailbox_with_no_mail":{"keywords":["email","inbox"],"char":"📭","fitzpatrick_scale":false,"category":"objects"},"package":{"keywords":["mail","gift","cardboard","box","moving"],"char":"📦","fitzpatrick_scale":false,"category":"objects"},"postal_horn":{"keywords":["instrument","music"],"char":"📯","fitzpatrick_scale":false,"category":"objects"},"inbox_tray":{"keywords":["email","documents"],"char":"📥","fitzpatrick_scale":false,"category":"objects"},"outbox_tray":{"keywords":["inbox","email"],"char":"📤","fitzpatrick_scale":false,"category":"objects"},"scroll":{"keywords":["documents","ancient","history","paper"],"char":"📜","fitzpatrick_scale":false,"category":"objects"},"page_with_curl":{"keywords":["documents","office","paper"],"char":"📃","fitzpatrick_scale":false,"category":"objects"},"bookmark_tabs":{"keywords":["favorite","save","order","tidy"],"char":"📑","fitzpatrick_scale":false,"category":"objects"},"bar_chart":{"keywords":["graph","presentation","stats"],"char":"📊","fitzpatrick_scale":false,"category":"objects"},"chart_with_upwards_trend":{"keywords":["graph","presentation","stats","recovery","business","economics","money","sales","good","success"],"char":"📈","fitzpatrick_scale":false,"category":"objects"},"chart_with_downwards_trend":{"keywords":["graph","presentation","stats","recession","business","economics","money","sales","bad","failure"],"char":"📉","fitzpatrick_scale":false,"category":"objects"},"page_facing_up":{"keywords":["documents","office","paper","information"],"char":"📄","fitzpatrick_scale":false,"category":"objects"},"date":{"keywords":["calendar","schedule"],"char":"📅","fitzpatrick_scale":false,"category":"objects"},"calendar":{"keywords":["schedule","date","planning"],"char":"📆","fitzpatrick_scale":false,"category":"objects"},"spiral_calendar":{"keywords":["date","schedule","planning"],"char":"🗓","fitzpatrick_scale":false,"category":"objects"},"card_index":{"keywords":["business","stationery"],"char":"📇","fitzpatrick_scale":false,"category":"objects"},"card_file_box":{"keywords":["business","stationery"],"char":"🗃","fitzpatrick_scale":false,"category":"objects"},"ballot_box":{"keywords":["election","vote"],"char":"🗳","fitzpatrick_scale":false,"category":"objects"},"file_cabinet":{"keywords":["filing","organizing"],"char":"🗄","fitzpatrick_scale":false,"category":"objects"},"clipboard":{"keywords":["stationery","documents"],"char":"📋","fitzpatrick_scale":false,"category":"objects"},"spiral_notepad":{"keywords":["memo","stationery"],"char":"🗒","fitzpatrick_scale":false,"category":"objects"},"file_folder":{"keywords":["documents","business","office"],"char":"📁","fitzpatrick_scale":false,"category":"objects"},"open_file_folder":{"keywords":["documents","load"],"char":"📂","fitzpatrick_scale":false,"category":"objects"},"card_index_dividers":{"keywords":["organizing","business","stationery"],"char":"🗂","fitzpatrick_scale":false,"category":"objects"},"newspaper_roll":{"keywords":["press","headline"],"char":"🗞","fitzpatrick_scale":false,"category":"objects"},"newspaper":{"keywords":["press","headline"],"char":"📰","fitzpatrick_scale":false,"category":"objects"},"notebook":{"keywords":["stationery","record","notes","paper","study"],"char":"📓","fitzpatrick_scale":false,"category":"objects"},"closed_book":{"keywords":["read","library","knowledge","textbook","learn"],"char":"📕","fitzpatrick_scale":false,"category":"objects"},"green_book":{"keywords":["read","library","knowledge","study"],"char":"📗","fitzpatrick_scale":false,"category":"objects"},"blue_book":{"keywords":["read","library","knowledge","learn","study"],"char":"📘","fitzpatrick_scale":false,"category":"objects"},"orange_book":{"keywords":["read","library","knowledge","textbook","study"],"char":"📙","fitzpatrick_scale":false,"category":"objects"},"notebook_with_decorative_cover":{"keywords":["classroom","notes","record","paper","study"],"char":"📔","fitzpatrick_scale":false,"category":"objects"},"ledger":{"keywords":["notes","paper"],"char":"📒","fitzpatrick_scale":false,"category":"objects"},"books":{"keywords":["literature","library","study"],"char":"📚","fitzpatrick_scale":false,"category":"objects"},"open_book":{"keywords":["book","read","library","knowledge","literature","learn","study"],"char":"📖","fitzpatrick_scale":false,"category":"objects"},"link":{"keywords":["rings","url"],"char":"🔗","fitzpatrick_scale":false,"category":"objects"},"paperclip":{"keywords":["documents","stationery"],"char":"📎","fitzpatrick_scale":false,"category":"objects"},"paperclips":{"keywords":["documents","stationery"],"char":"🖇","fitzpatrick_scale":false,"category":"objects"},"scissors":{"keywords":["stationery","cut"],"char":"✂️","fitzpatrick_scale":false,"category":"objects"},"triangular_ruler":{"keywords":["stationery","math","architect","sketch"],"char":"📐","fitzpatrick_scale":false,"category":"objects"},"straight_ruler":{"keywords":["stationery","calculate","length","math","school","drawing","architect","sketch"],"char":"📏","fitzpatrick_scale":false,"category":"objects"},"pushpin":{"keywords":["stationery","mark","here"],"char":"📌","fitzpatrick_scale":false,"category":"objects"},"round_pushpin":{"keywords":["stationery","location","map","here"],"char":"📍","fitzpatrick_scale":false,"category":"objects"},"triangular_flag_on_post":{"keywords":["mark","milestone","place"],"char":"🚩","fitzpatrick_scale":false,"category":"objects"},"white_flag":{"keywords":["losing","loser","lost","surrender","give up","fail"],"char":"🏳","fitzpatrick_scale":false,"category":"objects"},"black_flag":{"keywords":["pirate"],"char":"🏴","fitzpatrick_scale":false,"category":"objects"},"rainbow_flag":{"keywords":["flag","rainbow","pride","gay","lgbt","glbt","queer","homosexual","lesbian","bisexual","transgender"],"char":"🏳️‍🌈","fitzpatrick_scale":false,"category":"objects"},"closed_lock_with_key":{"keywords":["security","privacy"],"char":"🔐","fitzpatrick_scale":false,"category":"objects"},"lock":{"keywords":["security","password","padlock"],"char":"🔒","fitzpatrick_scale":false,"category":"objects"},"unlock":{"keywords":["privacy","security"],"char":"🔓","fitzpatrick_scale":false,"category":"objects"},"lock_with_ink_pen":{"keywords":["security","secret"],"char":"🔏","fitzpatrick_scale":false,"category":"objects"},"pen":{"keywords":["stationery","writing","write"],"char":"🖊","fitzpatrick_scale":false,"category":"objects"},"fountain_pen":{"keywords":["stationery","writing","write"],"char":"🖋","fitzpatrick_scale":false,"category":"objects"},"black_nib":{"keywords":["pen","stationery","writing","write"],"char":"✒️","fitzpatrick_scale":false,"category":"objects"},"memo":{"keywords":["write","documents","stationery","pencil","paper","writing","legal","exam","quiz","test","study","compose"],"char":"📝","fitzpatrick_scale":false,"category":"objects"},"pencil2":{"keywords":["stationery","write","paper","writing","school","study"],"char":"✏️","fitzpatrick_scale":false,"category":"objects"},"crayon":{"keywords":["drawing","creativity"],"char":"🖍","fitzpatrick_scale":false,"category":"objects"},"paintbrush":{"keywords":["drawing","creativity","art"],"char":"🖌","fitzpatrick_scale":false,"category":"objects"},"mag":{"keywords":["search","zoom","find","detective"],"char":"🔍","fitzpatrick_scale":false,"category":"objects"},"mag_right":{"keywords":["search","zoom","find","detective"],"char":"🔎","fitzpatrick_scale":false,"category":"objects"},"heart":{"keywords":["love","like","valentines"],"char":"❤️","fitzpatrick_scale":false,"category":"symbols"},"orange_heart":{"keywords":["love","like","affection","valentines"],"char":"🧡","fitzpatrick_scale":false,"category":"symbols"},"yellow_heart":{"keywords":["love","like","affection","valentines"],"char":"💛","fitzpatrick_scale":false,"category":"symbols"},"green_heart":{"keywords":["love","like","affection","valentines"],"char":"💚","fitzpatrick_scale":false,"category":"symbols"},"blue_heart":{"keywords":["love","like","affection","valentines"],"char":"💙","fitzpatrick_scale":false,"category":"symbols"},"purple_heart":{"keywords":["love","like","affection","valentines"],"char":"💜","fitzpatrick_scale":false,"category":"symbols"},"black_heart":{"keywords":["evil"],"char":"🖤","fitzpatrick_scale":false,"category":"symbols"},"broken_heart":{"keywords":["sad","sorry","break","heart","heartbreak"],"char":"💔","fitzpatrick_scale":false,"category":"symbols"},"heavy_heart_exclamation":{"keywords":["decoration","love"],"char":"❣","fitzpatrick_scale":false,"category":"symbols"},"two_hearts":{"keywords":["love","like","affection","valentines","heart"],"char":"💕","fitzpatrick_scale":false,"category":"symbols"},"revolving_hearts":{"keywords":["love","like","affection","valentines"],"char":"💞","fitzpatrick_scale":false,"category":"symbols"},"heartbeat":{"keywords":["love","like","affection","valentines","pink","heart"],"char":"💓","fitzpatrick_scale":false,"category":"symbols"},"heartpulse":{"keywords":["like","love","affection","valentines","pink"],"char":"💗","fitzpatrick_scale":false,"category":"symbols"},"sparkling_heart":{"keywords":["love","like","affection","valentines"],"char":"💖","fitzpatrick_scale":false,"category":"symbols"},"cupid":{"keywords":["love","like","heart","affection","valentines"],"char":"💘","fitzpatrick_scale":false,"category":"symbols"},"gift_heart":{"keywords":["love","valentines"],"char":"💝","fitzpatrick_scale":false,"category":"symbols"},"heart_decoration":{"keywords":["purple-square","love","like"],"char":"💟","fitzpatrick_scale":false,"category":"symbols"},"peace_symbol":{"keywords":["hippie"],"char":"☮","fitzpatrick_scale":false,"category":"symbols"},"latin_cross":{"keywords":["christianity"],"char":"✝","fitzpatrick_scale":false,"category":"symbols"},"star_and_crescent":{"keywords":["islam"],"char":"☪","fitzpatrick_scale":false,"category":"symbols"},"om":{"keywords":["hinduism","buddhism","sikhism","jainism"],"char":"🕉","fitzpatrick_scale":false,"category":"symbols"},"wheel_of_dharma":{"keywords":["hinduism","buddhism","sikhism","jainism"],"char":"☸","fitzpatrick_scale":false,"category":"symbols"},"star_of_david":{"keywords":["judaism"],"char":"✡","fitzpatrick_scale":false,"category":"symbols"},"six_pointed_star":{"keywords":["purple-square","religion","jewish","hexagram"],"char":"🔯","fitzpatrick_scale":false,"category":"symbols"},"menorah":{"keywords":["hanukkah","candles","jewish"],"char":"🕎","fitzpatrick_scale":false,"category":"symbols"},"yin_yang":{"keywords":["balance"],"char":"☯","fitzpatrick_scale":false,"category":"symbols"},"orthodox_cross":{"keywords":["suppedaneum","religion"],"char":"☦","fitzpatrick_scale":false,"category":"symbols"},"place_of_worship":{"keywords":["religion","church","temple","prayer"],"char":"🛐","fitzpatrick_scale":false,"category":"symbols"},"ophiuchus":{"keywords":["sign","purple-square","constellation","astrology"],"char":"⛎","fitzpatrick_scale":false,"category":"symbols"},"aries":{"keywords":["sign","purple-square","zodiac","astrology"],"char":"♈","fitzpatrick_scale":false,"category":"symbols"},"taurus":{"keywords":["purple-square","sign","zodiac","astrology"],"char":"♉","fitzpatrick_scale":false,"category":"symbols"},"gemini":{"keywords":["sign","zodiac","purple-square","astrology"],"char":"♊","fitzpatrick_scale":false,"category":"symbols"},"cancer":{"keywords":["sign","zodiac","purple-square","astrology"],"char":"♋","fitzpatrick_scale":false,"category":"symbols"},"leo":{"keywords":["sign","purple-square","zodiac","astrology"],"char":"♌","fitzpatrick_scale":false,"category":"symbols"},"virgo":{"keywords":["sign","zodiac","purple-square","astrology"],"char":"♍","fitzpatrick_scale":false,"category":"symbols"},"libra":{"keywords":["sign","purple-square","zodiac","astrology"],"char":"♎","fitzpatrick_scale":false,"category":"symbols"},"scorpius":{"keywords":["sign","zodiac","purple-square","astrology","scorpio"],"char":"♏","fitzpatrick_scale":false,"category":"symbols"},"sagittarius":{"keywords":["sign","zodiac","purple-square","astrology"],"char":"♐","fitzpatrick_scale":false,"category":"symbols"},"capricorn":{"keywords":["sign","zodiac","purple-square","astrology"],"char":"♑","fitzpatrick_scale":false,"category":"symbols"},"aquarius":{"keywords":["sign","purple-square","zodiac","astrology"],"char":"♒","fitzpatrick_scale":false,"category":"symbols"},"pisces":{"keywords":["purple-square","sign","zodiac","astrology"],"char":"♓","fitzpatrick_scale":false,"category":"symbols"},"id":{"keywords":["purple-square","words"],"char":"🆔","fitzpatrick_scale":false,"category":"symbols"},"atom_symbol":{"keywords":["science","physics","chemistry"],"char":"⚛","fitzpatrick_scale":false,"category":"symbols"},"u7a7a":{"keywords":["kanji","japanese","chinese","empty","sky","blue-square"],"char":"🈳","fitzpatrick_scale":false,"category":"symbols"},"u5272":{"keywords":["cut","divide","chinese","kanji","pink-square"],"char":"🈹","fitzpatrick_scale":false,"category":"symbols"},"radioactive":{"keywords":["nuclear","danger"],"char":"☢","fitzpatrick_scale":false,"category":"symbols"},"biohazard":{"keywords":["danger"],"char":"☣","fitzpatrick_scale":false,"category":"symbols"},"mobile_phone_off":{"keywords":["mute","orange-square","silence","quiet"],"char":"📴","fitzpatrick_scale":false,"category":"symbols"},"vibration_mode":{"keywords":["orange-square","phone"],"char":"📳","fitzpatrick_scale":false,"category":"symbols"},"u6709":{"keywords":["orange-square","chinese","have","kanji"],"char":"🈶","fitzpatrick_scale":false,"category":"symbols"},"u7121":{"keywords":["nothing","chinese","kanji","japanese","orange-square"],"char":"🈚","fitzpatrick_scale":false,"category":"symbols"},"u7533":{"keywords":["chinese","japanese","kanji","orange-square"],"char":"🈸","fitzpatrick_scale":false,"category":"symbols"},"u55b6":{"keywords":["japanese","opening hours","orange-square"],"char":"🈺","fitzpatrick_scale":false,"category":"symbols"},"u6708":{"keywords":["chinese","month","moon","japanese","orange-square","kanji"],"char":"🈷️","fitzpatrick_scale":false,"category":"symbols"},"eight_pointed_black_star":{"keywords":["orange-square","shape","polygon"],"char":"✴️","fitzpatrick_scale":false,"category":"symbols"},"vs":{"keywords":["words","orange-square"],"char":"🆚","fitzpatrick_scale":false,"category":"symbols"},"accept":{"keywords":["ok","good","chinese","kanji","agree","yes","orange-circle"],"char":"🉑","fitzpatrick_scale":false,"category":"symbols"},"white_flower":{"keywords":["japanese","spring"],"char":"💮","fitzpatrick_scale":false,"category":"symbols"},"ideograph_advantage":{"keywords":["chinese","kanji","obtain","get","circle"],"char":"🉐","fitzpatrick_scale":false,"category":"symbols"},"secret":{"keywords":["privacy","chinese","sshh","kanji","red-circle"],"char":"㊙️","fitzpatrick_scale":false,"category":"symbols"},"congratulations":{"keywords":["chinese","kanji","japanese","red-circle"],"char":"㊗️","fitzpatrick_scale":false,"category":"symbols"},"u5408":{"keywords":["japanese","chinese","join","kanji","red-square"],"char":"🈴","fitzpatrick_scale":false,"category":"symbols"},"u6e80":{"keywords":["full","chinese","japanese","red-square","kanji"],"char":"🈵","fitzpatrick_scale":false,"category":"symbols"},"u7981":{"keywords":["kanji","japanese","chinese","forbidden","limit","restricted","red-square"],"char":"🈲","fitzpatrick_scale":false,"category":"symbols"},"a":{"keywords":["red-square","alphabet","letter"],"char":"🅰️","fitzpatrick_scale":false,"category":"symbols"},"b":{"keywords":["red-square","alphabet","letter"],"char":"🅱️","fitzpatrick_scale":false,"category":"symbols"},"ab":{"keywords":["red-square","alphabet"],"char":"🆎","fitzpatrick_scale":false,"category":"symbols"},"cl":{"keywords":["alphabet","words","red-square"],"char":"🆑","fitzpatrick_scale":false,"category":"symbols"},"o2":{"keywords":["alphabet","red-square","letter"],"char":"🅾️","fitzpatrick_scale":false,"category":"symbols"},"sos":{"keywords":["help","red-square","words","emergency","911"],"char":"🆘","fitzpatrick_scale":false,"category":"symbols"},"no_entry":{"keywords":["limit","security","privacy","bad","denied","stop","circle"],"char":"⛔","fitzpatrick_scale":false,"category":"symbols"},"name_badge":{"keywords":["fire","forbid"],"char":"📛","fitzpatrick_scale":false,"category":"symbols"},"no_entry_sign":{"keywords":["forbid","stop","limit","denied","disallow","circle"],"char":"🚫","fitzpatrick_scale":false,"category":"symbols"},"x":{"keywords":["no","delete","remove","cancel"],"char":"❌","fitzpatrick_scale":false,"category":"symbols"},"o":{"keywords":["circle","round"],"char":"⭕","fitzpatrick_scale":false,"category":"symbols"},"stop_sign":{"keywords":["stop"],"char":"🛑","fitzpatrick_scale":false,"category":"symbols"},"anger":{"keywords":["angry","mad"],"char":"💢","fitzpatrick_scale":false,"category":"symbols"},"hotsprings":{"keywords":["bath","warm","relax"],"char":"♨️","fitzpatrick_scale":false,"category":"symbols"},"no_pedestrians":{"keywords":["rules","crossing","walking","circle"],"char":"🚷","fitzpatrick_scale":false,"category":"symbols"},"do_not_litter":{"keywords":["trash","bin","garbage","circle"],"char":"🚯","fitzpatrick_scale":false,"category":"symbols"},"no_bicycles":{"keywords":["cyclist","prohibited","circle"],"char":"🚳","fitzpatrick_scale":false,"category":"symbols"},"non-potable_water":{"keywords":["drink","faucet","tap","circle"],"char":"🚱","fitzpatrick_scale":false,"category":"symbols"},"underage":{"keywords":["18","drink","pub","night","minor","circle"],"char":"🔞","fitzpatrick_scale":false,"category":"symbols"},"no_mobile_phones":{"keywords":["iphone","mute","circle"],"char":"📵","fitzpatrick_scale":false,"category":"symbols"},"exclamation":{"keywords":["heavy_exclamation_mark","danger","surprise","punctuation","wow","warning"],"char":"❗","fitzpatrick_scale":false,"category":"symbols"},"grey_exclamation":{"keywords":["surprise","punctuation","gray","wow","warning"],"char":"❕","fitzpatrick_scale":false,"category":"symbols"},"question":{"keywords":["doubt","confused"],"char":"❓","fitzpatrick_scale":false,"category":"symbols"},"grey_question":{"keywords":["doubts","gray","huh","confused"],"char":"❔","fitzpatrick_scale":false,"category":"symbols"},"bangbang":{"keywords":["exclamation","surprise"],"char":"‼️","fitzpatrick_scale":false,"category":"symbols"},"interrobang":{"keywords":["wat","punctuation","surprise"],"char":"⁉️","fitzpatrick_scale":false,"category":"symbols"},"low_brightness":{"keywords":["sun","afternoon","warm","summer"],"char":"🔅","fitzpatrick_scale":false,"category":"symbols"},"high_brightness":{"keywords":["sun","light"],"char":"🔆","fitzpatrick_scale":false,"category":"symbols"},"trident":{"keywords":["weapon","spear"],"char":"🔱","fitzpatrick_scale":false,"category":"symbols"},"fleur_de_lis":{"keywords":["decorative","scout"],"char":"⚜","fitzpatrick_scale":false,"category":"symbols"},"part_alternation_mark":{"keywords":["graph","presentation","stats","business","economics","bad"],"char":"〽️","fitzpatrick_scale":false,"category":"symbols"},"warning":{"keywords":["exclamation","wip","alert","error","problem","issue"],"char":"⚠️","fitzpatrick_scale":false,"category":"symbols"},"children_crossing":{"keywords":["school","warning","danger","sign","driving","yellow-diamond"],"char":"🚸","fitzpatrick_scale":false,"category":"symbols"},"beginner":{"keywords":["badge","shield"],"char":"🔰","fitzpatrick_scale":false,"category":"symbols"},"recycle":{"keywords":["arrow","environment","garbage","trash"],"char":"♻️","fitzpatrick_scale":false,"category":"symbols"},"u6307":{"keywords":["chinese","point","green-square","kanji"],"char":"🈯","fitzpatrick_scale":false,"category":"symbols"},"chart":{"keywords":["green-square","graph","presentation","stats"],"char":"💹","fitzpatrick_scale":false,"category":"symbols"},"sparkle":{"keywords":["stars","green-square","awesome","good","fireworks"],"char":"❇️","fitzpatrick_scale":false,"category":"symbols"},"eight_spoked_asterisk":{"keywords":["star","sparkle","green-square"],"char":"✳️","fitzpatrick_scale":false,"category":"symbols"},"negative_squared_cross_mark":{"keywords":["x","green-square","no","deny"],"char":"❎","fitzpatrick_scale":false,"category":"symbols"},"white_check_mark":{"keywords":["green-square","ok","agree","vote","election","answer","tick"],"char":"✅","fitzpatrick_scale":false,"category":"symbols"},"diamond_shape_with_a_dot_inside":{"keywords":["jewel","blue","gem","crystal","fancy"],"char":"💠","fitzpatrick_scale":false,"category":"symbols"},"cyclone":{"keywords":["weather","swirl","blue","cloud","vortex","spiral","whirlpool","spin","tornado","hurricane","typhoon"],"char":"🌀","fitzpatrick_scale":false,"category":"symbols"},"loop":{"keywords":["tape","cassette"],"char":"➿","fitzpatrick_scale":false,"category":"symbols"},"globe_with_meridians":{"keywords":["earth","international","world","internet","interweb","i18n"],"char":"🌐","fitzpatrick_scale":false,"category":"symbols"},"m":{"keywords":["alphabet","blue-circle","letter"],"char":"Ⓜ️","fitzpatrick_scale":false,"category":"symbols"},"atm":{"keywords":["money","sales","cash","blue-square","payment","bank"],"char":"🏧","fitzpatrick_scale":false,"category":"symbols"},"sa":{"keywords":["japanese","blue-square","katakana"],"char":"🈂️","fitzpatrick_scale":false,"category":"symbols"},"passport_control":{"keywords":["custom","blue-square"],"char":"🛂","fitzpatrick_scale":false,"category":"symbols"},"customs":{"keywords":["passport","border","blue-square"],"char":"🛃","fitzpatrick_scale":false,"category":"symbols"},"baggage_claim":{"keywords":["blue-square","airport","transport"],"char":"🛄","fitzpatrick_scale":false,"category":"symbols"},"left_luggage":{"keywords":["blue-square","travel"],"char":"🛅","fitzpatrick_scale":false,"category":"symbols"},"wheelchair":{"keywords":["blue-square","disabled","a11y","accessibility"],"char":"♿","fitzpatrick_scale":false,"category":"symbols"},"no_smoking":{"keywords":["cigarette","blue-square","smell","smoke"],"char":"🚭","fitzpatrick_scale":false,"category":"symbols"},"wc":{"keywords":["toilet","restroom","blue-square"],"char":"🚾","fitzpatrick_scale":false,"category":"symbols"},"parking":{"keywords":["cars","blue-square","alphabet","letter"],"char":"🅿️","fitzpatrick_scale":false,"category":"symbols"},"potable_water":{"keywords":["blue-square","liquid","restroom","cleaning","faucet"],"char":"🚰","fitzpatrick_scale":false,"category":"symbols"},"mens":{"keywords":["toilet","restroom","wc","blue-square","gender","male"],"char":"🚹","fitzpatrick_scale":false,"category":"symbols"},"womens":{"keywords":["purple-square","woman","female","toilet","loo","restroom","gender"],"char":"🚺","fitzpatrick_scale":false,"category":"symbols"},"baby_symbol":{"keywords":["orange-square","child"],"char":"🚼","fitzpatrick_scale":false,"category":"symbols"},"restroom":{"keywords":["blue-square","toilet","refresh","wc","gender"],"char":"🚻","fitzpatrick_scale":false,"category":"symbols"},"put_litter_in_its_place":{"keywords":["blue-square","sign","human","info"],"char":"🚮","fitzpatrick_scale":false,"category":"symbols"},"cinema":{"keywords":["blue-square","record","film","movie","curtain","stage","theater"],"char":"🎦","fitzpatrick_scale":false,"category":"symbols"},"signal_strength":{"keywords":["blue-square","reception","phone","internet","connection","wifi","bluetooth","bars"],"char":"📶","fitzpatrick_scale":false,"category":"symbols"},"koko":{"keywords":["blue-square","here","katakana","japanese","destination"],"char":"🈁","fitzpatrick_scale":false,"category":"symbols"},"ng":{"keywords":["blue-square","words","shape","icon"],"char":"🆖","fitzpatrick_scale":false,"category":"symbols"},"ok":{"keywords":["good","agree","yes","blue-square"],"char":"🆗","fitzpatrick_scale":false,"category":"symbols"},"up":{"keywords":["blue-square","above","high"],"char":"🆙","fitzpatrick_scale":false,"category":"symbols"},"cool":{"keywords":["words","blue-square"],"char":"🆒","fitzpatrick_scale":false,"category":"symbols"},"new":{"keywords":["blue-square","words","start"],"char":"🆕","fitzpatrick_scale":false,"category":"symbols"},"free":{"keywords":["blue-square","words"],"char":"🆓","fitzpatrick_scale":false,"category":"symbols"},"zero":{"keywords":["0","numbers","blue-square","null"],"char":"0️⃣","fitzpatrick_scale":false,"category":"symbols"},"one":{"keywords":["blue-square","numbers","1"],"char":"1️⃣","fitzpatrick_scale":false,"category":"symbols"},"two":{"keywords":["numbers","2","prime","blue-square"],"char":"2️⃣","fitzpatrick_scale":false,"category":"symbols"},"three":{"keywords":["3","numbers","prime","blue-square"],"char":"3️⃣","fitzpatrick_scale":false,"category":"symbols"},"four":{"keywords":["4","numbers","blue-square"],"char":"4️⃣","fitzpatrick_scale":false,"category":"symbols"},"five":{"keywords":["5","numbers","blue-square","prime"],"char":"5️⃣","fitzpatrick_scale":false,"category":"symbols"},"six":{"keywords":["6","numbers","blue-square"],"char":"6️⃣","fitzpatrick_scale":false,"category":"symbols"},"seven":{"keywords":["7","numbers","blue-square","prime"],"char":"7️⃣","fitzpatrick_scale":false,"category":"symbols"},"eight":{"keywords":["8","blue-square","numbers"],"char":"8️⃣","fitzpatrick_scale":false,"category":"symbols"},"nine":{"keywords":["blue-square","numbers","9"],"char":"9️⃣","fitzpatrick_scale":false,"category":"symbols"},"keycap_ten":{"keywords":["numbers","10","blue-square"],"char":"🔟","fitzpatrick_scale":false,"category":"symbols"},"asterisk":{"keywords":["star","keycap"],"char":"*⃣","fitzpatrick_scale":false,"category":"symbols"},"eject_button":{"keywords":["blue-square"],"char":"⏏️","fitzpatrick_scale":false,"category":"symbols"},"arrow_forward":{"keywords":["blue-square","right","direction","play"],"char":"▶️","fitzpatrick_scale":false,"category":"symbols"},"pause_button":{"keywords":["pause","blue-square"],"char":"⏸","fitzpatrick_scale":false,"category":"symbols"},"next_track_button":{"keywords":["forward","next","blue-square"],"char":"⏭","fitzpatrick_scale":false,"category":"symbols"},"stop_button":{"keywords":["blue-square"],"char":"⏹","fitzpatrick_scale":false,"category":"symbols"},"record_button":{"keywords":["blue-square"],"char":"⏺","fitzpatrick_scale":false,"category":"symbols"},"play_or_pause_button":{"keywords":["blue-square","play","pause"],"char":"⏯","fitzpatrick_scale":false,"category":"symbols"},"previous_track_button":{"keywords":["backward"],"char":"⏮","fitzpatrick_scale":false,"category":"symbols"},"fast_forward":{"keywords":["blue-square","play","speed","continue"],"char":"⏩","fitzpatrick_scale":false,"category":"symbols"},"rewind":{"keywords":["play","blue-square"],"char":"⏪","fitzpatrick_scale":false,"category":"symbols"},"twisted_rightwards_arrows":{"keywords":["blue-square","shuffle","music","random"],"char":"🔀","fitzpatrick_scale":false,"category":"symbols"},"repeat":{"keywords":["loop","record"],"char":"🔁","fitzpatrick_scale":false,"category":"symbols"},"repeat_one":{"keywords":["blue-square","loop"],"char":"🔂","fitzpatrick_scale":false,"category":"symbols"},"arrow_backward":{"keywords":["blue-square","left","direction"],"char":"◀️","fitzpatrick_scale":false,"category":"symbols"},"arrow_up_small":{"keywords":["blue-square","triangle","direction","point","forward","top"],"char":"🔼","fitzpatrick_scale":false,"category":"symbols"},"arrow_down_small":{"keywords":["blue-square","direction","bottom"],"char":"🔽","fitzpatrick_scale":false,"category":"symbols"},"arrow_double_up":{"keywords":["blue-square","direction","top"],"char":"⏫","fitzpatrick_scale":false,"category":"symbols"},"arrow_double_down":{"keywords":["blue-square","direction","bottom"],"char":"⏬","fitzpatrick_scale":false,"category":"symbols"},"arrow_right":{"keywords":["blue-square","next"],"char":"➡️","fitzpatrick_scale":false,"category":"symbols"},"arrow_left":{"keywords":["blue-square","previous","back"],"char":"⬅️","fitzpatrick_scale":false,"category":"symbols"},"arrow_up":{"keywords":["blue-square","continue","top","direction"],"char":"⬆️","fitzpatrick_scale":false,"category":"symbols"},"arrow_down":{"keywords":["blue-square","direction","bottom"],"char":"⬇️","fitzpatrick_scale":false,"category":"symbols"},"arrow_upper_right":{"keywords":["blue-square","point","direction","diagonal","northeast"],"char":"↗️","fitzpatrick_scale":false,"category":"symbols"},"arrow_lower_right":{"keywords":["blue-square","direction","diagonal","southeast"],"char":"↘️","fitzpatrick_scale":false,"category":"symbols"},"arrow_lower_left":{"keywords":["blue-square","direction","diagonal","southwest"],"char":"↙️","fitzpatrick_scale":false,"category":"symbols"},"arrow_upper_left":{"keywords":["blue-square","point","direction","diagonal","northwest"],"char":"↖️","fitzpatrick_scale":false,"category":"symbols"},"arrow_up_down":{"keywords":["blue-square","direction","way","vertical"],"char":"↕️","fitzpatrick_scale":false,"category":"symbols"},"left_right_arrow":{"keywords":["shape","direction","horizontal","sideways"],"char":"↔️","fitzpatrick_scale":false,"category":"symbols"},"arrows_counterclockwise":{"keywords":["blue-square","sync","cycle"],"char":"🔄","fitzpatrick_scale":false,"category":"symbols"},"arrow_right_hook":{"keywords":["blue-square","return","rotate","direction"],"char":"↪️","fitzpatrick_scale":false,"category":"symbols"},"leftwards_arrow_with_hook":{"keywords":["back","return","blue-square","undo","enter"],"char":"↩️","fitzpatrick_scale":false,"category":"symbols"},"arrow_heading_up":{"keywords":["blue-square","direction","top"],"char":"⤴️","fitzpatrick_scale":false,"category":"symbols"},"arrow_heading_down":{"keywords":["blue-square","direction","bottom"],"char":"⤵️","fitzpatrick_scale":false,"category":"symbols"},"hash":{"keywords":["symbol","blue-square","twitter"],"char":"#️⃣","fitzpatrick_scale":false,"category":"symbols"},"information_source":{"keywords":["blue-square","alphabet","letter"],"char":"ℹ️","fitzpatrick_scale":false,"category":"symbols"},"abc":{"keywords":["blue-square","alphabet"],"char":"🔤","fitzpatrick_scale":false,"category":"symbols"},"abcd":{"keywords":["blue-square","alphabet"],"char":"🔡","fitzpatrick_scale":false,"category":"symbols"},"capital_abcd":{"keywords":["alphabet","words","blue-square"],"char":"🔠","fitzpatrick_scale":false,"category":"symbols"},"symbols":{"keywords":["blue-square","music","note","ampersand","percent","glyphs","characters"],"char":"🔣","fitzpatrick_scale":false,"category":"symbols"},"musical_note":{"keywords":["score","tone","sound"],"char":"🎵","fitzpatrick_scale":false,"category":"symbols"},"notes":{"keywords":["music","score"],"char":"🎶","fitzpatrick_scale":false,"category":"symbols"},"wavy_dash":{"keywords":["draw","line","moustache","mustache","squiggle","scribble"],"char":"〰️","fitzpatrick_scale":false,"category":"symbols"},"curly_loop":{"keywords":["scribble","draw","shape","squiggle"],"char":"➰","fitzpatrick_scale":false,"category":"symbols"},"heavy_check_mark":{"keywords":["ok","nike","answer","yes","tick"],"char":"✔️","fitzpatrick_scale":false,"category":"symbols"},"arrows_clockwise":{"keywords":["sync","cycle","round","repeat"],"char":"🔃","fitzpatrick_scale":false,"category":"symbols"},"heavy_plus_sign":{"keywords":["math","calculation","addition","more","increase"],"char":"➕","fitzpatrick_scale":false,"category":"symbols"},"heavy_minus_sign":{"keywords":["math","calculation","subtract","less"],"char":"➖","fitzpatrick_scale":false,"category":"symbols"},"heavy_division_sign":{"keywords":["divide","math","calculation"],"char":"➗","fitzpatrick_scale":false,"category":"symbols"},"heavy_multiplication_x":{"keywords":["math","calculation"],"char":"✖️","fitzpatrick_scale":false,"category":"symbols"},"heavy_dollar_sign":{"keywords":["money","sales","payment","currency","buck"],"char":"💲","fitzpatrick_scale":false,"category":"symbols"},"currency_exchange":{"keywords":["money","sales","dollar","travel"],"char":"💱","fitzpatrick_scale":false,"category":"symbols"},"copyright":{"keywords":["ip","license","circle","law","legal"],"char":"©️","fitzpatrick_scale":false,"category":"symbols"},"registered":{"keywords":["alphabet","circle"],"char":"®️","fitzpatrick_scale":false,"category":"symbols"},"tm":{"keywords":["trademark","brand","law","legal"],"char":"™️","fitzpatrick_scale":false,"category":"symbols"},"end":{"keywords":["words","arrow"],"char":"🔚","fitzpatrick_scale":false,"category":"symbols"},"back":{"keywords":["arrow","words","return"],"char":"🔙","fitzpatrick_scale":false,"category":"symbols"},"on":{"keywords":["arrow","words"],"char":"🔛","fitzpatrick_scale":false,"category":"symbols"},"top":{"keywords":["words","blue-square"],"char":"🔝","fitzpatrick_scale":false,"category":"symbols"},"soon":{"keywords":["arrow","words"],"char":"🔜","fitzpatrick_scale":false,"category":"symbols"},"ballot_box_with_check":{"keywords":["ok","agree","confirm","black-square","vote","election","yes","tick"],"char":"☑️","fitzpatrick_scale":false,"category":"symbols"},"radio_button":{"keywords":["input","old","music","circle"],"char":"🔘","fitzpatrick_scale":false,"category":"symbols"},"white_circle":{"keywords":["shape","round"],"char":"⚪","fitzpatrick_scale":false,"category":"symbols"},"black_circle":{"keywords":["shape","button","round"],"char":"⚫","fitzpatrick_scale":false,"category":"symbols"},"red_circle":{"keywords":["shape","error","danger"],"char":"🔴","fitzpatrick_scale":false,"category":"symbols"},"large_blue_circle":{"keywords":["shape","icon","button"],"char":"🔵","fitzpatrick_scale":false,"category":"symbols"},"small_orange_diamond":{"keywords":["shape","jewel","gem"],"char":"🔸","fitzpatrick_scale":false,"category":"symbols"},"small_blue_diamond":{"keywords":["shape","jewel","gem"],"char":"🔹","fitzpatrick_scale":false,"category":"symbols"},"large_orange_diamond":{"keywords":["shape","jewel","gem"],"char":"🔶","fitzpatrick_scale":false,"category":"symbols"},"large_blue_diamond":{"keywords":["shape","jewel","gem"],"char":"🔷","fitzpatrick_scale":false,"category":"symbols"},"small_red_triangle":{"keywords":["shape","direction","up","top"],"char":"🔺","fitzpatrick_scale":false,"category":"symbols"},"black_small_square":{"keywords":["shape","icon"],"char":"▪️","fitzpatrick_scale":false,"category":"symbols"},"white_small_square":{"keywords":["shape","icon"],"char":"▫️","fitzpatrick_scale":false,"category":"symbols"},"black_large_square":{"keywords":["shape","icon","button"],"char":"⬛","fitzpatrick_scale":false,"category":"symbols"},"white_large_square":{"keywords":["shape","icon","stone","button"],"char":"⬜","fitzpatrick_scale":false,"category":"symbols"},"small_red_triangle_down":{"keywords":["shape","direction","bottom"],"char":"🔻","fitzpatrick_scale":false,"category":"symbols"},"black_medium_square":{"keywords":["shape","button","icon"],"char":"◼️","fitzpatrick_scale":false,"category":"symbols"},"white_medium_square":{"keywords":["shape","stone","icon"],"char":"◻️","fitzpatrick_scale":false,"category":"symbols"},"black_medium_small_square":{"keywords":["icon","shape","button"],"char":"◾","fitzpatrick_scale":false,"category":"symbols"},"white_medium_small_square":{"keywords":["shape","stone","icon","button"],"char":"◽","fitzpatrick_scale":false,"category":"symbols"},"black_square_button":{"keywords":["shape","input","frame"],"char":"🔲","fitzpatrick_scale":false,"category":"symbols"},"white_square_button":{"keywords":["shape","input"],"char":"🔳","fitzpatrick_scale":false,"category":"symbols"},"speaker":{"keywords":["sound","volume","silence","broadcast"],"char":"🔈","fitzpatrick_scale":false,"category":"symbols"},"sound":{"keywords":["volume","speaker","broadcast"],"char":"🔉","fitzpatrick_scale":false,"category":"symbols"},"loud_sound":{"keywords":["volume","noise","noisy","speaker","broadcast"],"char":"🔊","fitzpatrick_scale":false,"category":"symbols"},"mute":{"keywords":["sound","volume","silence","quiet"],"char":"🔇","fitzpatrick_scale":false,"category":"symbols"},"mega":{"keywords":["sound","speaker","volume"],"char":"📣","fitzpatrick_scale":false,"category":"symbols"},"loudspeaker":{"keywords":["volume","sound"],"char":"📢","fitzpatrick_scale":false,"category":"symbols"},"bell":{"keywords":["sound","notification","christmas","xmas","chime"],"char":"🔔","fitzpatrick_scale":false,"category":"symbols"},"no_bell":{"keywords":["sound","volume","mute","quiet","silent"],"char":"🔕","fitzpatrick_scale":false,"category":"symbols"},"black_joker":{"keywords":["poker","cards","game","play","magic"],"char":"🃏","fitzpatrick_scale":false,"category":"symbols"},"mahjong":{"keywords":["game","play","chinese","kanji"],"char":"🀄","fitzpatrick_scale":false,"category":"symbols"},"spades":{"keywords":["poker","cards","suits","magic"],"char":"♠️","fitzpatrick_scale":false,"category":"symbols"},"clubs":{"keywords":["poker","cards","magic","suits"],"char":"♣️","fitzpatrick_scale":false,"category":"symbols"},"hearts":{"keywords":["poker","cards","magic","suits"],"char":"♥️","fitzpatrick_scale":false,"category":"symbols"},"diamonds":{"keywords":["poker","cards","magic","suits"],"char":"♦️","fitzpatrick_scale":false,"category":"symbols"},"flower_playing_cards":{"keywords":["game","sunset","red"],"char":"🎴","fitzpatrick_scale":false,"category":"symbols"},"thought_balloon":{"keywords":["bubble","cloud","speech","thinking","dream"],"char":"💭","fitzpatrick_scale":false,"category":"symbols"},"right_anger_bubble":{"keywords":["caption","speech","thinking","mad"],"char":"🗯","fitzpatrick_scale":false,"category":"symbols"},"speech_balloon":{"keywords":["bubble","words","message","talk","chatting"],"char":"💬","fitzpatrick_scale":false,"category":"symbols"},"left_speech_bubble":{"keywords":["words","message","talk","chatting"],"char":"🗨","fitzpatrick_scale":false,"category":"symbols"},"clock1":{"keywords":["time","late","early","schedule"],"char":"🕐","fitzpatrick_scale":false,"category":"symbols"},"clock2":{"keywords":["time","late","early","schedule"],"char":"🕑","fitzpatrick_scale":false,"category":"symbols"},"clock3":{"keywords":["time","late","early","schedule"],"char":"🕒","fitzpatrick_scale":false,"category":"symbols"},"clock4":{"keywords":["time","late","early","schedule"],"char":"🕓","fitzpatrick_scale":false,"category":"symbols"},"clock5":{"keywords":["time","late","early","schedule"],"char":"🕔","fitzpatrick_scale":false,"category":"symbols"},"clock6":{"keywords":["time","late","early","schedule","dawn","dusk"],"char":"🕕","fitzpatrick_scale":false,"category":"symbols"},"clock7":{"keywords":["time","late","early","schedule"],"char":"🕖","fitzpatrick_scale":false,"category":"symbols"},"clock8":{"keywords":["time","late","early","schedule"],"char":"🕗","fitzpatrick_scale":false,"category":"symbols"},"clock9":{"keywords":["time","late","early","schedule"],"char":"🕘","fitzpatrick_scale":false,"category":"symbols"},"clock10":{"keywords":["time","late","early","schedule"],"char":"🕙","fitzpatrick_scale":false,"category":"symbols"},"clock11":{"keywords":["time","late","early","schedule"],"char":"🕚","fitzpatrick_scale":false,"category":"symbols"},"clock12":{"keywords":["time","noon","midnight","midday","late","early","schedule"],"char":"🕛","fitzpatrick_scale":false,"category":"symbols"},"clock130":{"keywords":["time","late","early","schedule"],"char":"🕜","fitzpatrick_scale":false,"category":"symbols"},"clock230":{"keywords":["time","late","early","schedule"],"char":"🕝","fitzpatrick_scale":false,"category":"symbols"},"clock330":{"keywords":["time","late","early","schedule"],"char":"🕞","fitzpatrick_scale":false,"category":"symbols"},"clock430":{"keywords":["time","late","early","schedule"],"char":"🕟","fitzpatrick_scale":false,"category":"symbols"},"clock530":{"keywords":["time","late","early","schedule"],"char":"🕠","fitzpatrick_scale":false,"category":"symbols"},"clock630":{"keywords":["time","late","early","schedule"],"char":"🕡","fitzpatrick_scale":false,"category":"symbols"},"clock730":{"keywords":["time","late","early","schedule"],"char":"🕢","fitzpatrick_scale":false,"category":"symbols"},"clock830":{"keywords":["time","late","early","schedule"],"char":"🕣","fitzpatrick_scale":false,"category":"symbols"},"clock930":{"keywords":["time","late","early","schedule"],"char":"🕤","fitzpatrick_scale":false,"category":"symbols"},"clock1030":{"keywords":["time","late","early","schedule"],"char":"🕥","fitzpatrick_scale":false,"category":"symbols"},"clock1130":{"keywords":["time","late","early","schedule"],"char":"🕦","fitzpatrick_scale":false,"category":"symbols"},"clock1230":{"keywords":["time","late","early","schedule"],"char":"🕧","fitzpatrick_scale":false,"category":"symbols"},"afghanistan":{"keywords":["af","flag","nation","country","banner"],"char":"🇦🇫","fitzpatrick_scale":false,"category":"flags"},"aland_islands":{"keywords":["Åland","islands","flag","nation","country","banner"],"char":"🇦🇽","fitzpatrick_scale":false,"category":"flags"},"albania":{"keywords":["al","flag","nation","country","banner"],"char":"🇦🇱","fitzpatrick_scale":false,"category":"flags"},"algeria":{"keywords":["dz","flag","nation","country","banner"],"char":"🇩🇿","fitzpatrick_scale":false,"category":"flags"},"american_samoa":{"keywords":["american","ws","flag","nation","country","banner"],"char":"🇦🇸","fitzpatrick_scale":false,"category":"flags"},"andorra":{"keywords":["ad","flag","nation","country","banner"],"char":"🇦🇩","fitzpatrick_scale":false,"category":"flags"},"angola":{"keywords":["ao","flag","nation","country","banner"],"char":"🇦🇴","fitzpatrick_scale":false,"category":"flags"},"anguilla":{"keywords":["ai","flag","nation","country","banner"],"char":"🇦🇮","fitzpatrick_scale":false,"category":"flags"},"antarctica":{"keywords":["aq","flag","nation","country","banner"],"char":"🇦🇶","fitzpatrick_scale":false,"category":"flags"},"antigua_barbuda":{"keywords":["antigua","barbuda","flag","nation","country","banner"],"char":"🇦🇬","fitzpatrick_scale":false,"category":"flags"},"argentina":{"keywords":["ar","flag","nation","country","banner"],"char":"🇦🇷","fitzpatrick_scale":false,"category":"flags"},"armenia":{"keywords":["am","flag","nation","country","banner"],"char":"🇦🇲","fitzpatrick_scale":false,"category":"flags"},"aruba":{"keywords":["aw","flag","nation","country","banner"],"char":"🇦🇼","fitzpatrick_scale":false,"category":"flags"},"australia":{"keywords":["au","flag","nation","country","banner"],"char":"🇦🇺","fitzpatrick_scale":false,"category":"flags"},"austria":{"keywords":["at","flag","nation","country","banner"],"char":"🇦🇹","fitzpatrick_scale":false,"category":"flags"},"azerbaijan":{"keywords":["az","flag","nation","country","banner"],"char":"🇦🇿","fitzpatrick_scale":false,"category":"flags"},"bahamas":{"keywords":["bs","flag","nation","country","banner"],"char":"🇧🇸","fitzpatrick_scale":false,"category":"flags"},"bahrain":{"keywords":["bh","flag","nation","country","banner"],"char":"🇧🇭","fitzpatrick_scale":false,"category":"flags"},"bangladesh":{"keywords":["bd","flag","nation","country","banner"],"char":"🇧🇩","fitzpatrick_scale":false,"category":"flags"},"barbados":{"keywords":["bb","flag","nation","country","banner"],"char":"🇧🇧","fitzpatrick_scale":false,"category":"flags"},"belarus":{"keywords":["by","flag","nation","country","banner"],"char":"🇧🇾","fitzpatrick_scale":false,"category":"flags"},"belgium":{"keywords":["be","flag","nation","country","banner"],"char":"🇧🇪","fitzpatrick_scale":false,"category":"flags"},"belize":{"keywords":["bz","flag","nation","country","banner"],"char":"🇧🇿","fitzpatrick_scale":false,"category":"flags"},"benin":{"keywords":["bj","flag","nation","country","banner"],"char":"🇧🇯","fitzpatrick_scale":false,"category":"flags"},"bermuda":{"keywords":["bm","flag","nation","country","banner"],"char":"🇧🇲","fitzpatrick_scale":false,"category":"flags"},"bhutan":{"keywords":["bt","flag","nation","country","banner"],"char":"🇧🇹","fitzpatrick_scale":false,"category":"flags"},"bolivia":{"keywords":["bo","flag","nation","country","banner"],"char":"🇧🇴","fitzpatrick_scale":false,"category":"flags"},"caribbean_netherlands":{"keywords":["bonaire","flag","nation","country","banner"],"char":"🇧🇶","fitzpatrick_scale":false,"category":"flags"},"bosnia_herzegovina":{"keywords":["bosnia","herzegovina","flag","nation","country","banner"],"char":"🇧🇦","fitzpatrick_scale":false,"category":"flags"},"botswana":{"keywords":["bw","flag","nation","country","banner"],"char":"🇧🇼","fitzpatrick_scale":false,"category":"flags"},"brazil":{"keywords":["br","flag","nation","country","banner"],"char":"🇧🇷","fitzpatrick_scale":false,"category":"flags"},"british_indian_ocean_territory":{"keywords":["british","indian","ocean","territory","flag","nation","country","banner"],"char":"🇮🇴","fitzpatrick_scale":false,"category":"flags"},"british_virgin_islands":{"keywords":["british","virgin","islands","bvi","flag","nation","country","banner"],"char":"🇻🇬","fitzpatrick_scale":false,"category":"flags"},"brunei":{"keywords":["bn","darussalam","flag","nation","country","banner"],"char":"🇧🇳","fitzpatrick_scale":false,"category":"flags"},"bulgaria":{"keywords":["bg","flag","nation","country","banner"],"char":"🇧🇬","fitzpatrick_scale":false,"category":"flags"},"burkina_faso":{"keywords":["burkina","faso","flag","nation","country","banner"],"char":"🇧🇫","fitzpatrick_scale":false,"category":"flags"},"burundi":{"keywords":["bi","flag","nation","country","banner"],"char":"🇧🇮","fitzpatrick_scale":false,"category":"flags"},"cape_verde":{"keywords":["cabo","verde","flag","nation","country","banner"],"char":"🇨🇻","fitzpatrick_scale":false,"category":"flags"},"cambodia":{"keywords":["kh","flag","nation","country","banner"],"char":"🇰🇭","fitzpatrick_scale":false,"category":"flags"},"cameroon":{"keywords":["cm","flag","nation","country","banner"],"char":"🇨🇲","fitzpatrick_scale":false,"category":"flags"},"canada":{"keywords":["ca","flag","nation","country","banner"],"char":"🇨🇦","fitzpatrick_scale":false,"category":"flags"},"canary_islands":{"keywords":["canary","islands","flag","nation","country","banner"],"char":"🇮🇨","fitzpatrick_scale":false,"category":"flags"},"cayman_islands":{"keywords":["cayman","islands","flag","nation","country","banner"],"char":"🇰🇾","fitzpatrick_scale":false,"category":"flags"},"central_african_republic":{"keywords":["central","african","republic","flag","nation","country","banner"],"char":"🇨🇫","fitzpatrick_scale":false,"category":"flags"},"chad":{"keywords":["td","flag","nation","country","banner"],"char":"🇹🇩","fitzpatrick_scale":false,"category":"flags"},"chile":{"keywords":["flag","nation","country","banner"],"char":"🇨🇱","fitzpatrick_scale":false,"category":"flags"},"cn":{"keywords":["china","chinese","prc","flag","country","nation","banner"],"char":"🇨🇳","fitzpatrick_scale":false,"category":"flags"},"christmas_island":{"keywords":["christmas","island","flag","nation","country","banner"],"char":"🇨🇽","fitzpatrick_scale":false,"category":"flags"},"cocos_islands":{"keywords":["cocos","keeling","islands","flag","nation","country","banner"],"char":"🇨🇨","fitzpatrick_scale":false,"category":"flags"},"colombia":{"keywords":["co","flag","nation","country","banner"],"char":"🇨🇴","fitzpatrick_scale":false,"category":"flags"},"comoros":{"keywords":["km","flag","nation","country","banner"],"char":"🇰🇲","fitzpatrick_scale":false,"category":"flags"},"congo_brazzaville":{"keywords":["congo","flag","nation","country","banner"],"char":"🇨🇬","fitzpatrick_scale":false,"category":"flags"},"congo_kinshasa":{"keywords":["congo","democratic","republic","flag","nation","country","banner"],"char":"🇨🇩","fitzpatrick_scale":false,"category":"flags"},"cook_islands":{"keywords":["cook","islands","flag","nation","country","banner"],"char":"🇨🇰","fitzpatrick_scale":false,"category":"flags"},"costa_rica":{"keywords":["costa","rica","flag","nation","country","banner"],"char":"🇨🇷","fitzpatrick_scale":false,"category":"flags"},"croatia":{"keywords":["hr","flag","nation","country","banner"],"char":"🇭🇷","fitzpatrick_scale":false,"category":"flags"},"cuba":{"keywords":["cu","flag","nation","country","banner"],"char":"🇨🇺","fitzpatrick_scale":false,"category":"flags"},"curacao":{"keywords":["curaçao","flag","nation","country","banner"],"char":"🇨🇼","fitzpatrick_scale":false,"category":"flags"},"cyprus":{"keywords":["cy","flag","nation","country","banner"],"char":"🇨🇾","fitzpatrick_scale":false,"category":"flags"},"czech_republic":{"keywords":["cz","flag","nation","country","banner"],"char":"🇨🇿","fitzpatrick_scale":false,"category":"flags"},"denmark":{"keywords":["dk","flag","nation","country","banner"],"char":"🇩🇰","fitzpatrick_scale":false,"category":"flags"},"djibouti":{"keywords":["dj","flag","nation","country","banner"],"char":"🇩🇯","fitzpatrick_scale":false,"category":"flags"},"dominica":{"keywords":["dm","flag","nation","country","banner"],"char":"🇩🇲","fitzpatrick_scale":false,"category":"flags"},"dominican_republic":{"keywords":["dominican","republic","flag","nation","country","banner"],"char":"🇩🇴","fitzpatrick_scale":false,"category":"flags"},"ecuador":{"keywords":["ec","flag","nation","country","banner"],"char":"🇪🇨","fitzpatrick_scale":false,"category":"flags"},"egypt":{"keywords":["eg","flag","nation","country","banner"],"char":"🇪🇬","fitzpatrick_scale":false,"category":"flags"},"el_salvador":{"keywords":["el","salvador","flag","nation","country","banner"],"char":"🇸🇻","fitzpatrick_scale":false,"category":"flags"},"equatorial_guinea":{"keywords":["equatorial","gn","flag","nation","country","banner"],"char":"🇬🇶","fitzpatrick_scale":false,"category":"flags"},"eritrea":{"keywords":["er","flag","nation","country","banner"],"char":"🇪🇷","fitzpatrick_scale":false,"category":"flags"},"estonia":{"keywords":["ee","flag","nation","country","banner"],"char":"🇪🇪","fitzpatrick_scale":false,"category":"flags"},"ethiopia":{"keywords":["et","flag","nation","country","banner"],"char":"🇪🇹","fitzpatrick_scale":false,"category":"flags"},"eu":{"keywords":["european","union","flag","banner"],"char":"🇪🇺","fitzpatrick_scale":false,"category":"flags"},"falkland_islands":{"keywords":["falkland","islands","malvinas","flag","nation","country","banner"],"char":"🇫🇰","fitzpatrick_scale":false,"category":"flags"},"faroe_islands":{"keywords":["faroe","islands","flag","nation","country","banner"],"char":"🇫🇴","fitzpatrick_scale":false,"category":"flags"},"fiji":{"keywords":["fj","flag","nation","country","banner"],"char":"🇫🇯","fitzpatrick_scale":false,"category":"flags"},"finland":{"keywords":["fi","flag","nation","country","banner"],"char":"🇫🇮","fitzpatrick_scale":false,"category":"flags"},"fr":{"keywords":["banner","flag","nation","france","french","country"],"char":"🇫🇷","fitzpatrick_scale":false,"category":"flags"},"french_guiana":{"keywords":["french","guiana","flag","nation","country","banner"],"char":"🇬🇫","fitzpatrick_scale":false,"category":"flags"},"french_polynesia":{"keywords":["french","polynesia","flag","nation","country","banner"],"char":"🇵🇫","fitzpatrick_scale":false,"category":"flags"},"french_southern_territories":{"keywords":["french","southern","territories","flag","nation","country","banner"],"char":"🇹🇫","fitzpatrick_scale":false,"category":"flags"},"gabon":{"keywords":["ga","flag","nation","country","banner"],"char":"🇬🇦","fitzpatrick_scale":false,"category":"flags"},"gambia":{"keywords":["gm","flag","nation","country","banner"],"char":"🇬🇲","fitzpatrick_scale":false,"category":"flags"},"georgia":{"keywords":["ge","flag","nation","country","banner"],"char":"🇬🇪","fitzpatrick_scale":false,"category":"flags"},"de":{"keywords":["german","nation","flag","country","banner"],"char":"🇩🇪","fitzpatrick_scale":false,"category":"flags"},"ghana":{"keywords":["gh","flag","nation","country","banner"],"char":"🇬🇭","fitzpatrick_scale":false,"category":"flags"},"gibraltar":{"keywords":["gi","flag","nation","country","banner"],"char":"🇬🇮","fitzpatrick_scale":false,"category":"flags"},"greece":{"keywords":["gr","flag","nation","country","banner"],"char":"🇬🇷","fitzpatrick_scale":false,"category":"flags"},"greenland":{"keywords":["gl","flag","nation","country","banner"],"char":"🇬🇱","fitzpatrick_scale":false,"category":"flags"},"grenada":{"keywords":["gd","flag","nation","country","banner"],"char":"🇬🇩","fitzpatrick_scale":false,"category":"flags"},"guadeloupe":{"keywords":["gp","flag","nation","country","banner"],"char":"🇬🇵","fitzpatrick_scale":false,"category":"flags"},"guam":{"keywords":["gu","flag","nation","country","banner"],"char":"🇬🇺","fitzpatrick_scale":false,"category":"flags"},"guatemala":{"keywords":["gt","flag","nation","country","banner"],"char":"🇬🇹","fitzpatrick_scale":false,"category":"flags"},"guernsey":{"keywords":["gg","flag","nation","country","banner"],"char":"🇬🇬","fitzpatrick_scale":false,"category":"flags"},"guinea":{"keywords":["gn","flag","nation","country","banner"],"char":"🇬🇳","fitzpatrick_scale":false,"category":"flags"},"guinea_bissau":{"keywords":["gw","bissau","flag","nation","country","banner"],"char":"🇬🇼","fitzpatrick_scale":false,"category":"flags"},"guyana":{"keywords":["gy","flag","nation","country","banner"],"char":"🇬🇾","fitzpatrick_scale":false,"category":"flags"},"haiti":{"keywords":["ht","flag","nation","country","banner"],"char":"🇭🇹","fitzpatrick_scale":false,"category":"flags"},"honduras":{"keywords":["hn","flag","nation","country","banner"],"char":"🇭🇳","fitzpatrick_scale":false,"category":"flags"},"hong_kong":{"keywords":["hong","kong","flag","nation","country","banner"],"char":"🇭🇰","fitzpatrick_scale":false,"category":"flags"},"hungary":{"keywords":["hu","flag","nation","country","banner"],"char":"🇭🇺","fitzpatrick_scale":false,"category":"flags"},"iceland":{"keywords":["is","flag","nation","country","banner"],"char":"🇮🇸","fitzpatrick_scale":false,"category":"flags"},"india":{"keywords":["in","flag","nation","country","banner"],"char":"🇮🇳","fitzpatrick_scale":false,"category":"flags"},"indonesia":{"keywords":["flag","nation","country","banner"],"char":"🇮🇩","fitzpatrick_scale":false,"category":"flags"},"iran":{"keywords":["iran,","islamic","republic","flag","nation","country","banner"],"char":"🇮🇷","fitzpatrick_scale":false,"category":"flags"},"iraq":{"keywords":["iq","flag","nation","country","banner"],"char":"🇮🇶","fitzpatrick_scale":false,"category":"flags"},"ireland":{"keywords":["ie","flag","nation","country","banner"],"char":"🇮🇪","fitzpatrick_scale":false,"category":"flags"},"isle_of_man":{"keywords":["isle","man","flag","nation","country","banner"],"char":"🇮🇲","fitzpatrick_scale":false,"category":"flags"},"israel":{"keywords":["il","flag","nation","country","banner"],"char":"🇮🇱","fitzpatrick_scale":false,"category":"flags"},"it":{"keywords":["italy","flag","nation","country","banner"],"char":"🇮🇹","fitzpatrick_scale":false,"category":"flags"},"cote_divoire":{"keywords":["ivory","coast","flag","nation","country","banner"],"char":"🇨🇮","fitzpatrick_scale":false,"category":"flags"},"jamaica":{"keywords":["jm","flag","nation","country","banner"],"char":"🇯🇲","fitzpatrick_scale":false,"category":"flags"},"jp":{"keywords":["japanese","nation","flag","country","banner"],"char":"🇯🇵","fitzpatrick_scale":false,"category":"flags"},"jersey":{"keywords":["je","flag","nation","country","banner"],"char":"🇯🇪","fitzpatrick_scale":false,"category":"flags"},"jordan":{"keywords":["jo","flag","nation","country","banner"],"char":"🇯🇴","fitzpatrick_scale":false,"category":"flags"},"kazakhstan":{"keywords":["kz","flag","nation","country","banner"],"char":"🇰🇿","fitzpatrick_scale":false,"category":"flags"},"kenya":{"keywords":["ke","flag","nation","country","banner"],"char":"🇰🇪","fitzpatrick_scale":false,"category":"flags"},"kiribati":{"keywords":["ki","flag","nation","country","banner"],"char":"🇰🇮","fitzpatrick_scale":false,"category":"flags"},"kosovo":{"keywords":["xk","flag","nation","country","banner"],"char":"🇽🇰","fitzpatrick_scale":false,"category":"flags"},"kuwait":{"keywords":["kw","flag","nation","country","banner"],"char":"🇰🇼","fitzpatrick_scale":false,"category":"flags"},"kyrgyzstan":{"keywords":["kg","flag","nation","country","banner"],"char":"🇰🇬","fitzpatrick_scale":false,"category":"flags"},"laos":{"keywords":["lao","democratic","republic","flag","nation","country","banner"],"char":"🇱🇦","fitzpatrick_scale":false,"category":"flags"},"latvia":{"keywords":["lv","flag","nation","country","banner"],"char":"🇱🇻","fitzpatrick_scale":false,"category":"flags"},"lebanon":{"keywords":["lb","flag","nation","country","banner"],"char":"🇱🇧","fitzpatrick_scale":false,"category":"flags"},"lesotho":{"keywords":["ls","flag","nation","country","banner"],"char":"🇱🇸","fitzpatrick_scale":false,"category":"flags"},"liberia":{"keywords":["lr","flag","nation","country","banner"],"char":"🇱🇷","fitzpatrick_scale":false,"category":"flags"},"libya":{"keywords":["ly","flag","nation","country","banner"],"char":"🇱🇾","fitzpatrick_scale":false,"category":"flags"},"liechtenstein":{"keywords":["li","flag","nation","country","banner"],"char":"🇱🇮","fitzpatrick_scale":false,"category":"flags"},"lithuania":{"keywords":["lt","flag","nation","country","banner"],"char":"🇱🇹","fitzpatrick_scale":false,"category":"flags"},"luxembourg":{"keywords":["lu","flag","nation","country","banner"],"char":"🇱🇺","fitzpatrick_scale":false,"category":"flags"},"macau":{"keywords":["macao","flag","nation","country","banner"],"char":"🇲🇴","fitzpatrick_scale":false,"category":"flags"},"macedonia":{"keywords":["macedonia,","flag","nation","country","banner"],"char":"🇲🇰","fitzpatrick_scale":false,"category":"flags"},"madagascar":{"keywords":["mg","flag","nation","country","banner"],"char":"🇲🇬","fitzpatrick_scale":false,"category":"flags"},"malawi":{"keywords":["mw","flag","nation","country","banner"],"char":"🇲🇼","fitzpatrick_scale":false,"category":"flags"},"malaysia":{"keywords":["my","flag","nation","country","banner"],"char":"🇲🇾","fitzpatrick_scale":false,"category":"flags"},"maldives":{"keywords":["mv","flag","nation","country","banner"],"char":"🇲🇻","fitzpatrick_scale":false,"category":"flags"},"mali":{"keywords":["ml","flag","nation","country","banner"],"char":"🇲🇱","fitzpatrick_scale":false,"category":"flags"},"malta":{"keywords":["mt","flag","nation","country","banner"],"char":"🇲🇹","fitzpatrick_scale":false,"category":"flags"},"marshall_islands":{"keywords":["marshall","islands","flag","nation","country","banner"],"char":"🇲🇭","fitzpatrick_scale":false,"category":"flags"},"martinique":{"keywords":["mq","flag","nation","country","banner"],"char":"🇲🇶","fitzpatrick_scale":false,"category":"flags"},"mauritania":{"keywords":["mr","flag","nation","country","banner"],"char":"🇲🇷","fitzpatrick_scale":false,"category":"flags"},"mauritius":{"keywords":["mu","flag","nation","country","banner"],"char":"🇲🇺","fitzpatrick_scale":false,"category":"flags"},"mayotte":{"keywords":["yt","flag","nation","country","banner"],"char":"🇾🇹","fitzpatrick_scale":false,"category":"flags"},"mexico":{"keywords":["mx","flag","nation","country","banner"],"char":"🇲🇽","fitzpatrick_scale":false,"category":"flags"},"micronesia":{"keywords":["micronesia,","federated","states","flag","nation","country","banner"],"char":"🇫🇲","fitzpatrick_scale":false,"category":"flags"},"moldova":{"keywords":["moldova,","republic","flag","nation","country","banner"],"char":"🇲🇩","fitzpatrick_scale":false,"category":"flags"},"monaco":{"keywords":["mc","flag","nation","country","banner"],"char":"🇲🇨","fitzpatrick_scale":false,"category":"flags"},"mongolia":{"keywords":["mn","flag","nation","country","banner"],"char":"🇲🇳","fitzpatrick_scale":false,"category":"flags"},"montenegro":{"keywords":["me","flag","nation","country","banner"],"char":"🇲🇪","fitzpatrick_scale":false,"category":"flags"},"montserrat":{"keywords":["ms","flag","nation","country","banner"],"char":"🇲🇸","fitzpatrick_scale":false,"category":"flags"},"morocco":{"keywords":["ma","flag","nation","country","banner"],"char":"🇲🇦","fitzpatrick_scale":false,"category":"flags"},"mozambique":{"keywords":["mz","flag","nation","country","banner"],"char":"🇲🇿","fitzpatrick_scale":false,"category":"flags"},"myanmar":{"keywords":["mm","flag","nation","country","banner"],"char":"🇲🇲","fitzpatrick_scale":false,"category":"flags"},"namibia":{"keywords":["na","flag","nation","country","banner"],"char":"🇳🇦","fitzpatrick_scale":false,"category":"flags"},"nauru":{"keywords":["nr","flag","nation","country","banner"],"char":"🇳🇷","fitzpatrick_scale":false,"category":"flags"},"nepal":{"keywords":["np","flag","nation","country","banner"],"char":"🇳🇵","fitzpatrick_scale":false,"category":"flags"},"netherlands":{"keywords":["nl","flag","nation","country","banner"],"char":"🇳🇱","fitzpatrick_scale":false,"category":"flags"},"new_caledonia":{"keywords":["new","caledonia","flag","nation","country","banner"],"char":"🇳🇨","fitzpatrick_scale":false,"category":"flags"},"new_zealand":{"keywords":["new","zealand","flag","nation","country","banner"],"char":"🇳🇿","fitzpatrick_scale":false,"category":"flags"},"nicaragua":{"keywords":["ni","flag","nation","country","banner"],"char":"🇳🇮","fitzpatrick_scale":false,"category":"flags"},"niger":{"keywords":["ne","flag","nation","country","banner"],"char":"🇳🇪","fitzpatrick_scale":false,"category":"flags"},"nigeria":{"keywords":["flag","nation","country","banner"],"char":"🇳🇬","fitzpatrick_scale":false,"category":"flags"},"niue":{"keywords":["nu","flag","nation","country","banner"],"char":"🇳🇺","fitzpatrick_scale":false,"category":"flags"},"norfolk_island":{"keywords":["norfolk","island","flag","nation","country","banner"],"char":"🇳🇫","fitzpatrick_scale":false,"category":"flags"},"northern_mariana_islands":{"keywords":["northern","mariana","islands","flag","nation","country","banner"],"char":"🇲🇵","fitzpatrick_scale":false,"category":"flags"},"north_korea":{"keywords":["north","korea","nation","flag","country","banner"],"char":"🇰🇵","fitzpatrick_scale":false,"category":"flags"},"norway":{"keywords":["no","flag","nation","country","banner"],"char":"🇳🇴","fitzpatrick_scale":false,"category":"flags"},"oman":{"keywords":["om_symbol","flag","nation","country","banner"],"char":"🇴🇲","fitzpatrick_scale":false,"category":"flags"},"pakistan":{"keywords":["pk","flag","nation","country","banner"],"char":"🇵🇰","fitzpatrick_scale":false,"category":"flags"},"palau":{"keywords":["pw","flag","nation","country","banner"],"char":"🇵🇼","fitzpatrick_scale":false,"category":"flags"},"palestinian_territories":{"keywords":["palestine","palestinian","territories","flag","nation","country","banner"],"char":"🇵🇸","fitzpatrick_scale":false,"category":"flags"},"panama":{"keywords":["pa","flag","nation","country","banner"],"char":"🇵🇦","fitzpatrick_scale":false,"category":"flags"},"papua_new_guinea":{"keywords":["papua","new","guinea","flag","nation","country","banner"],"char":"🇵🇬","fitzpatrick_scale":false,"category":"flags"},"paraguay":{"keywords":["py","flag","nation","country","banner"],"char":"🇵🇾","fitzpatrick_scale":false,"category":"flags"},"peru":{"keywords":["pe","flag","nation","country","banner"],"char":"🇵🇪","fitzpatrick_scale":false,"category":"flags"},"philippines":{"keywords":["ph","flag","nation","country","banner"],"char":"🇵🇭","fitzpatrick_scale":false,"category":"flags"},"pitcairn_islands":{"keywords":["pitcairn","flag","nation","country","banner"],"char":"🇵🇳","fitzpatrick_scale":false,"category":"flags"},"poland":{"keywords":["pl","flag","nation","country","banner"],"char":"🇵🇱","fitzpatrick_scale":false,"category":"flags"},"portugal":{"keywords":["pt","flag","nation","country","banner"],"char":"🇵🇹","fitzpatrick_scale":false,"category":"flags"},"puerto_rico":{"keywords":["puerto","rico","flag","nation","country","banner"],"char":"🇵🇷","fitzpatrick_scale":false,"category":"flags"},"qatar":{"keywords":["qa","flag","nation","country","banner"],"char":"🇶🇦","fitzpatrick_scale":false,"category":"flags"},"reunion":{"keywords":["réunion","flag","nation","country","banner"],"char":"🇷🇪","fitzpatrick_scale":false,"category":"flags"},"romania":{"keywords":["ro","flag","nation","country","banner"],"char":"🇷🇴","fitzpatrick_scale":false,"category":"flags"},"ru":{"keywords":["russian","federation","flag","nation","country","banner"],"char":"🇷🇺","fitzpatrick_scale":false,"category":"flags"},"rwanda":{"keywords":["rw","flag","nation","country","banner"],"char":"🇷🇼","fitzpatrick_scale":false,"category":"flags"},"st_barthelemy":{"keywords":["saint","barthélemy","flag","nation","country","banner"],"char":"🇧🇱","fitzpatrick_scale":false,"category":"flags"},"st_helena":{"keywords":["saint","helena","ascension","tristan","cunha","flag","nation","country","banner"],"char":"🇸🇭","fitzpatrick_scale":false,"category":"flags"},"st_kitts_nevis":{"keywords":["saint","kitts","nevis","flag","nation","country","banner"],"char":"🇰🇳","fitzpatrick_scale":false,"category":"flags"},"st_lucia":{"keywords":["saint","lucia","flag","nation","country","banner"],"char":"🇱🇨","fitzpatrick_scale":false,"category":"flags"},"st_pierre_miquelon":{"keywords":["saint","pierre","miquelon","flag","nation","country","banner"],"char":"🇵🇲","fitzpatrick_scale":false,"category":"flags"},"st_vincent_grenadines":{"keywords":["saint","vincent","grenadines","flag","nation","country","banner"],"char":"🇻🇨","fitzpatrick_scale":false,"category":"flags"},"samoa":{"keywords":["ws","flag","nation","country","banner"],"char":"🇼🇸","fitzpatrick_scale":false,"category":"flags"},"san_marino":{"keywords":["san","marino","flag","nation","country","banner"],"char":"🇸🇲","fitzpatrick_scale":false,"category":"flags"},"sao_tome_principe":{"keywords":["sao","tome","principe","flag","nation","country","banner"],"char":"🇸🇹","fitzpatrick_scale":false,"category":"flags"},"saudi_arabia":{"keywords":["flag","nation","country","banner"],"char":"🇸🇦","fitzpatrick_scale":false,"category":"flags"},"senegal":{"keywords":["sn","flag","nation","country","banner"],"char":"🇸🇳","fitzpatrick_scale":false,"category":"flags"},"serbia":{"keywords":["rs","flag","nation","country","banner"],"char":"🇷🇸","fitzpatrick_scale":false,"category":"flags"},"seychelles":{"keywords":["sc","flag","nation","country","banner"],"char":"🇸🇨","fitzpatrick_scale":false,"category":"flags"},"sierra_leone":{"keywords":["sierra","leone","flag","nation","country","banner"],"char":"🇸🇱","fitzpatrick_scale":false,"category":"flags"},"singapore":{"keywords":["sg","flag","nation","country","banner"],"char":"🇸🇬","fitzpatrick_scale":false,"category":"flags"},"sint_maarten":{"keywords":["sint","maarten","dutch","flag","nation","country","banner"],"char":"🇸🇽","fitzpatrick_scale":false,"category":"flags"},"slovakia":{"keywords":["sk","flag","nation","country","banner"],"char":"🇸🇰","fitzpatrick_scale":false,"category":"flags"},"slovenia":{"keywords":["si","flag","nation","country","banner"],"char":"🇸🇮","fitzpatrick_scale":false,"category":"flags"},"solomon_islands":{"keywords":["solomon","islands","flag","nation","country","banner"],"char":"🇸🇧","fitzpatrick_scale":false,"category":"flags"},"somalia":{"keywords":["so","flag","nation","country","banner"],"char":"🇸🇴","fitzpatrick_scale":false,"category":"flags"},"south_africa":{"keywords":["south","africa","flag","nation","country","banner"],"char":"🇿🇦","fitzpatrick_scale":false,"category":"flags"},"south_georgia_south_sandwich_islands":{"keywords":["south","georgia","sandwich","islands","flag","nation","country","banner"],"char":"🇬🇸","fitzpatrick_scale":false,"category":"flags"},"kr":{"keywords":["south","korea","nation","flag","country","banner"],"char":"🇰🇷","fitzpatrick_scale":false,"category":"flags"},"south_sudan":{"keywords":["south","sd","flag","nation","country","banner"],"char":"🇸🇸","fitzpatrick_scale":false,"category":"flags"},"es":{"keywords":["spain","flag","nation","country","banner"],"char":"🇪🇸","fitzpatrick_scale":false,"category":"flags"},"sri_lanka":{"keywords":["sri","lanka","flag","nation","country","banner"],"char":"🇱🇰","fitzpatrick_scale":false,"category":"flags"},"sudan":{"keywords":["sd","flag","nation","country","banner"],"char":"🇸🇩","fitzpatrick_scale":false,"category":"flags"},"suriname":{"keywords":["sr","flag","nation","country","banner"],"char":"🇸🇷","fitzpatrick_scale":false,"category":"flags"},"swaziland":{"keywords":["sz","flag","nation","country","banner"],"char":"🇸🇿","fitzpatrick_scale":false,"category":"flags"},"sweden":{"keywords":["se","flag","nation","country","banner"],"char":"🇸🇪","fitzpatrick_scale":false,"category":"flags"},"switzerland":{"keywords":["ch","flag","nation","country","banner"],"char":"🇨🇭","fitzpatrick_scale":false,"category":"flags"},"syria":{"keywords":["syrian","arab","republic","flag","nation","country","banner"],"char":"🇸🇾","fitzpatrick_scale":false,"category":"flags"},"taiwan":{"keywords":["tw","flag","nation","country","banner"],"char":"🇹🇼","fitzpatrick_scale":false,"category":"flags"},"tajikistan":{"keywords":["tj","flag","nation","country","banner"],"char":"🇹🇯","fitzpatrick_scale":false,"category":"flags"},"tanzania":{"keywords":["tanzania,","united","republic","flag","nation","country","banner"],"char":"🇹🇿","fitzpatrick_scale":false,"category":"flags"},"thailand":{"keywords":["th","flag","nation","country","banner"],"char":"🇹🇭","fitzpatrick_scale":false,"category":"flags"},"timor_leste":{"keywords":["timor","leste","flag","nation","country","banner"],"char":"🇹🇱","fitzpatrick_scale":false,"category":"flags"},"togo":{"keywords":["tg","flag","nation","country","banner"],"char":"🇹🇬","fitzpatrick_scale":false,"category":"flags"},"tokelau":{"keywords":["tk","flag","nation","country","banner"],"char":"🇹🇰","fitzpatrick_scale":false,"category":"flags"},"tonga":{"keywords":["to","flag","nation","country","banner"],"char":"🇹🇴","fitzpatrick_scale":false,"category":"flags"},"trinidad_tobago":{"keywords":["trinidad","tobago","flag","nation","country","banner"],"char":"🇹🇹","fitzpatrick_scale":false,"category":"flags"},"tunisia":{"keywords":["tn","flag","nation","country","banner"],"char":"🇹🇳","fitzpatrick_scale":false,"category":"flags"},"tr":{"keywords":["turkey","flag","nation","country","banner"],"char":"🇹🇷","fitzpatrick_scale":false,"category":"flags"},"turkmenistan":{"keywords":["flag","nation","country","banner"],"char":"🇹🇲","fitzpatrick_scale":false,"category":"flags"},"turks_caicos_islands":{"keywords":["turks","caicos","islands","flag","nation","country","banner"],"char":"🇹🇨","fitzpatrick_scale":false,"category":"flags"},"tuvalu":{"keywords":["flag","nation","country","banner"],"char":"🇹🇻","fitzpatrick_scale":false,"category":"flags"},"uganda":{"keywords":["ug","flag","nation","country","banner"],"char":"🇺🇬","fitzpatrick_scale":false,"category":"flags"},"ukraine":{"keywords":["ua","flag","nation","country","banner"],"char":"🇺🇦","fitzpatrick_scale":false,"category":"flags"},"united_arab_emirates":{"keywords":["united","arab","emirates","flag","nation","country","banner"],"char":"🇦🇪","fitzpatrick_scale":false,"category":"flags"},"uk":{"keywords":["united","kingdom","great","britain","northern","ireland","flag","nation","country","banner","british","UK","english","england","union jack"],"char":"🇬🇧","fitzpatrick_scale":false,"category":"flags"},"england":{"keywords":["flag","english"],"char":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","fitzpatrick_scale":false,"category":"flags"},"scotland":{"keywords":["flag","scottish"],"char":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","fitzpatrick_scale":false,"category":"flags"},"wales":{"keywords":["flag","welsh"],"char":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","fitzpatrick_scale":false,"category":"flags"},"us":{"keywords":["united","states","america","flag","nation","country","banner"],"char":"🇺🇸","fitzpatrick_scale":false,"category":"flags"},"us_virgin_islands":{"keywords":["virgin","islands","us","flag","nation","country","banner"],"char":"🇻🇮","fitzpatrick_scale":false,"category":"flags"},"uruguay":{"keywords":["uy","flag","nation","country","banner"],"char":"🇺🇾","fitzpatrick_scale":false,"category":"flags"},"uzbekistan":{"keywords":["uz","flag","nation","country","banner"],"char":"🇺🇿","fitzpatrick_scale":false,"category":"flags"},"vanuatu":{"keywords":["vu","flag","nation","country","banner"],"char":"🇻🇺","fitzpatrick_scale":false,"category":"flags"},"vatican_city":{"keywords":["vatican","city","flag","nation","country","banner"],"char":"🇻🇦","fitzpatrick_scale":false,"category":"flags"},"venezuela":{"keywords":["ve","bolivarian","republic","flag","nation","country","banner"],"char":"🇻🇪","fitzpatrick_scale":false,"category":"flags"},"vietnam":{"keywords":["viet","nam","flag","nation","country","banner"],"char":"🇻🇳","fitzpatrick_scale":false,"category":"flags"},"wallis_futuna":{"keywords":["wallis","futuna","flag","nation","country","banner"],"char":"🇼🇫","fitzpatrick_scale":false,"category":"flags"},"western_sahara":{"keywords":["western","sahara","flag","nation","country","banner"],"char":"🇪🇭","fitzpatrick_scale":false,"category":"flags"},"yemen":{"keywords":["ye","flag","nation","country","banner"],"char":"🇾🇪","fitzpatrick_scale":false,"category":"flags"},"zambia":{"keywords":["zm","flag","nation","country","banner"],"char":"🇿🇲","fitzpatrick_scale":false,"category":"flags"},"zimbabwe":{"keywords":["zw","flag","nation","country","banner"],"char":"🇿🇼","fitzpatrick_scale":false,"category":"flags"},"octocat":{"keywords":["animal","octopus","github","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"shipit":{"keywords":["squirrel","detective","animal","sherlock","inspector","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"bowtie":{"keywords":["face","formal","fashion","suit","classy","magic","circus"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"neckbeard":{"keywords":["nerdy","face","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"trollface":{"keywords":["internet","meme","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"godmode":{"keywords":["doom","oldschool"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"goberserk":{"keywords":["doom","rage","bloody","hurt"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"finnadie":{"keywords":["doom","oldschool"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"feelsgood":{"keywords":["doom","oldschool"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"rage1":{"keywords":["angry","mad","hate","despise"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"rage2":{"keywords":["angry","mad","hate","despise"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"rage3":{"keywords":["angry","mad","hate","despise"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"rage4":{"keywords":["angry","mad","hate","despise"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"suspect":{"keywords":["mad","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"},"hurtrealbad":{"keywords":["mad","injured","doom","oldschool","custom_"],"char":null,"fitzpatrick_scale":false,"category":"_custom"}}

/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./node_modules/inline-attachment/src/codemirror-4.inline-attachment.js":
/*!******************************************************************************!*\
  !*** ./node_modules/inline-attachment/src/codemirror-4.inline-attachment.js ***!
  \******************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*jslint newcap: true */
/*global inlineAttachment: false */
/**
 * CodeMirror version for inlineAttachment
 *
 * Call inlineAttachment.attach(editor) to attach to a codemirror instance
 */
(function() {
  'use strict';

  var codeMirrorEditor = function(instance) {

    if (!instance.getWrapperElement) {
      throw "Invalid CodeMirror object given";
    }

    this.codeMirror = instance;
  };

  codeMirrorEditor.prototype.getValue = function() {
    return this.codeMirror.getValue();
  };

  codeMirrorEditor.prototype.insertValue = function(val) {
    this.codeMirror.replaceSelection(val);
  };

  codeMirrorEditor.prototype.setValue = function(val) {
    var cursor = this.codeMirror.getCursor();
    this.codeMirror.setValue(val);
    this.codeMirror.setCursor(cursor);
  };

  /**
   * Attach InlineAttachment to CodeMirror
   *
   * @param {CodeMirror} codeMirror
   */
  codeMirrorEditor.attach = function(codeMirror, options) {

    options = options || {};

    var editor = new codeMirrorEditor(codeMirror),
      inlineattach = new inlineAttachment(options, editor),
      el = codeMirror.getWrapperElement();

    el.addEventListener('paste', function(e) {
      inlineattach.onPaste(e);
    }, false);

    codeMirror.setOption('onDragEvent', function(data, e) {
      if (e.type === "drop") {
        e.stopPropagation();
        e.preventDefault();
        return inlineattach.onDrop(e);
      }
    });
  };

  var codeMirrorEditor4 = function(instance) {
    codeMirrorEditor.call(this, instance);
  };

  codeMirrorEditor4.attach = function(codeMirror, options) {

    options = options || {};

    var editor = new codeMirrorEditor(codeMirror),
      inlineattach = new inlineAttachment(options, editor),
      el = codeMirror.getWrapperElement();

    el.addEventListener('paste', function(e) {
      inlineattach.onPaste(e);
    }, false);

    codeMirror.on('drop', function(data, e) {
      if (inlineattach.onDrop(e)) {
        e.stopPropagation();
        e.preventDefault();
        return true;
      } else {
        return false;
      }
    });
  };

  inlineAttachment.editors.codemirror4 = codeMirrorEditor4;

})();

/***/ }),

/***/ "./node_modules/inline-attachment/src/inline-attachment.js":
/*!*****************************************************************!*\
  !*** ./node_modules/inline-attachment/src/inline-attachment.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*jslint newcap: true */
/*global XMLHttpRequest: false, FormData: false */
/*
 * Inline Text Attachment
 *
 * Author: Roy van Kaathoven
 * Contact: ik@royvankaathoven.nl
 */
(function(document, window) {
  'use strict';

  var inlineAttachment = function(options, instance) {
    this.settings = inlineAttachment.util.merge(options, inlineAttachment.defaults);
    this.editor = instance;
    this.filenameTag = '{filename}';
    this.lastValue = null;
  };

  /**
   * Will holds the available editors
   *
   * @type {Object}
   */
  inlineAttachment.editors = {};

  /**
   * Utility functions
   */
  inlineAttachment.util = {

    /**
     * Simple function to merge the given objects
     *
     * @param {Object[]} object Multiple object parameters
     * @returns {Object}
     */
    merge: function() {
      var result = {};
      for (var i = arguments.length - 1; i >= 0; i--) {
        var obj = arguments[i];
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            result[k] = obj[k];
          }
        }
      }
      return result;
    },

    /**
     * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
     *
     * @param {String} appended Current content
     * @param {String} previous Value which should be appended after the current content
     */
    appendInItsOwnLine: function(previous, appended) {
      return (previous + "\n\n[[D]]" + appended)
        .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
        .replace(/^(\n*)/, "");
    },

    /**
     * Inserts the given value at the current cursor position of the textarea element
     *
     * @param  {HtmlElement} el
     * @param  {String} value Text which will be inserted at the cursor position
     */
    insertTextAtCursor: function(el, text) {
      var scrollPos = el.scrollTop,
        strPos = 0,
        browser = false,
        range;

      if ((el.selectionStart || el.selectionStart === '0')) {
        browser = "ff";
      } else if (document.selection) {
        browser = "ie";
      }

      if (browser === "ie") {
        el.focus();
        range = document.selection.createRange();
        range.moveStart('character', -el.value.length);
        strPos = range.text.length;
      } else if (browser === "ff") {
        strPos = el.selectionStart;
      }

      var front = (el.value).substring(0, strPos);
      var back = (el.value).substring(strPos, el.value.length);
      el.value = front + text + back;
      strPos = strPos + text.length;
      if (browser === "ie") {
        el.focus();
        range = document.selection.createRange();
        range.moveStart('character', -el.value.length);
        range.moveStart('character', strPos);
        range.moveEnd('character', 0);
        range.select();
      } else if (browser === "ff") {
        el.selectionStart = strPos;
        el.selectionEnd = strPos;
        el.focus();
      }
      el.scrollTop = scrollPos;
    }
  };

  /**
   * Default configuration options
   *
   * @type {Object}
   */
  inlineAttachment.defaults = {
    /**
     * URL where the file will be send
     */
    uploadUrl: 'upload_attachment.php',

    /**
     * Which method will be used to send the file to the upload URL
     */
    uploadMethod: 'POST',

    /**
     * Name in which the file will be placed
     */
    uploadFieldName: 'file',

    /**
     * Extension which will be used when a file extension could not
     * be detected
     */
    defaultExtension: 'png',

    /**
     * JSON field which refers to the uploaded file URL
     */
    jsonFieldName: 'filename',

    /**
     * Allowed MIME types
     */
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif'
    ],

    /**
     * Text which will be inserted when dropping or pasting a file.
     * Acts as a placeholder which will be replaced when the file is done with uploading
     */
    progressText: '![Uploading file...]()',

    /**
     * When a file has successfully been uploaded the progressText
     * will be replaced by the urlText, the {filename} tag will be replaced
     * by the filename that has been returned by the server
     */
    urlText: "![file]({filename})",

    /**
     * Text which will be used when uploading has failed
     */
    errorText: "Error uploading file",

    /**
     * Extra parameters which will be send when uploading a file
     */
    extraParams: {},

    /**
     * Extra headers which will be send when uploading a file
     */
    extraHeaders: {},

    /**
     * Before the file is send
     */
    beforeFileUpload: function() {
      return true;
    },

    /**
     * Triggers when a file is dropped or pasted
     */
    onFileReceived: function() {},

    /**
     * Custom upload handler
     *
     * @return {Boolean} when false is returned it will prevent default upload behavior
     */
    onFileUploadResponse: function() {
      return true;
    },

    /**
     * Custom error handler. Runs after removing the placeholder text and before the alert().
     * Return false from this function to prevent the alert dialog.
     *
     * @return {Boolean} when false is returned it will prevent default error behavior
     */
    onFileUploadError: function() {
      return true;
    },

    /**
     * When a file has succesfully been uploaded
     */
    onFileUploaded: function() {}
  };

  /**
   * Uploads the blob
   *
   * @param  {Blob} file blob data received from event.dataTransfer object
   * @return {XMLHttpRequest} request object which sends the file
   */
  inlineAttachment.prototype.uploadFile = function(file) {
    var me = this,
      formData = new FormData(),
      xhr = new XMLHttpRequest(),
      settings = this.settings,
      extension = settings.defaultExtension || settings.defualtExtension;

    if (typeof settings.setupFormData === 'function') {
      settings.setupFormData(formData, file);
    }

    // Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
    // http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
    if (file.name) {
      var fileNameMatches = file.name.match(/\.(.+)$/);
      if (fileNameMatches) {
        extension = fileNameMatches[1];
      }
    }

    var remoteFilename = "image-" + Date.now() + "." + extension;
    if (typeof settings.remoteFilename === 'function') {
      remoteFilename = settings.remoteFilename(file);
    }

    formData.append(settings.uploadFieldName, file, remoteFilename);

    // Append the extra parameters to the formdata
    if (typeof settings.extraParams === "object") {
      for (var key in settings.extraParams) {
        if (settings.extraParams.hasOwnProperty(key)) {
          formData.append(key, settings.extraParams[key]);
        }
      }
    }

    xhr.open('POST', settings.uploadUrl);

    // Add any available extra headers
    if (typeof settings.extraHeaders === "object") {
        for (var header in settings.extraHeaders) {
            if (settings.extraHeaders.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, settings.extraHeaders[header]);
            }
        }
    }

    xhr.onload = function() {
      // If HTTP status is OK or Created
      if (xhr.status === 200 || xhr.status === 201) {
        me.onFileUploadResponse(xhr);
      } else {
        me.onFileUploadError(xhr);
      }
    };
    if (settings.beforeFileUpload(xhr) !== false) {
      xhr.send(formData);
    }
    return xhr;
  };

  /**
   * Returns if the given file is allowed to handle
   *
   * @param {File} clipboard data file
   */
  inlineAttachment.prototype.isFileAllowed = function(file) {
    if (file.kind === 'string') { return false; }
    if (this.settings.allowedTypes.indexOf('*') === 0){
      return true;
    } else {
      return this.settings.allowedTypes.indexOf(file.type) >= 0;
    }
  };

  /**
   * Handles upload response
   *
   * @param  {XMLHttpRequest} xhr
   * @return {Void}
   */
  inlineAttachment.prototype.onFileUploadResponse = function(xhr) {
    if (this.settings.onFileUploadResponse.call(this, xhr) !== false) {
      var result = JSON.parse(xhr.responseText),
        filename = result[this.settings.jsonFieldName];

      if (result && filename) {
        var newValue;
        if (typeof this.settings.urlText === 'function') {
          newValue = this.settings.urlText.call(this, filename, result);
        } else {
          newValue = this.settings.urlText.replace(this.filenameTag, filename);
        }
        var text = this.editor.getValue().replace(this.lastValue, newValue);
        this.editor.setValue(text);
        this.settings.onFileUploaded.call(this, filename);
      }
    }
  };


  /**
   * Called when a file has failed to upload
   *
   * @param  {XMLHttpRequest} xhr
   * @return {Void}
   */
  inlineAttachment.prototype.onFileUploadError = function(xhr) {
    if (this.settings.onFileUploadError.call(this, xhr) !== false) {
      var text = this.editor.getValue().replace(this.lastValue, "");
      this.editor.setValue(text);
    }
  };

  /**
   * Called when a file has been inserted, either by drop or paste
   *
   * @param  {File} file
   * @return {Void}
   */
  inlineAttachment.prototype.onFileInserted = function(file) {
    if (this.settings.onFileReceived.call(this, file) !== false) {
      this.lastValue = this.settings.progressText;
      this.editor.insertValue(this.lastValue);
    }
  };


  /**
   * Called when a paste event occured
   * @param  {Event} e
   * @return {Boolean} if the event was handled
   */
  inlineAttachment.prototype.onPaste = function(e) {
    var result = false,
      clipboardData = e.clipboardData,
      items;

    if (typeof clipboardData === "object") {
      items = clipboardData.items || clipboardData.files || [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (this.isFileAllowed(item)) {
          result = true;
          this.onFileInserted(item.getAsFile());
          this.uploadFile(item.getAsFile());
        }
      }
    }

    if (result) { e.preventDefault(); }

    return result;
  };

  /**
   * Called when a drop event occures
   * @param  {Event} e
   * @return {Boolean} if the event was handled
   */
  inlineAttachment.prototype.onDrop = function(e) {
    var result = false;
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      var file = e.dataTransfer.files[i];
      if (this.isFileAllowed(file)) {
        result = true;
        this.onFileInserted(file);
        this.uploadFile(file);
      }
    }

    return result;
  };

  window.inlineAttachment = inlineAttachment;

})(document, window);


/***/ }),

/***/ "./node_modules/inline-attachment/src/jquery.inline-attachment.js":
/*!************************************************************************!*\
  !*** ./node_modules/inline-attachment/src/jquery.inline-attachment.js ***!
  \************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/*jslint newcap: true */
/*global inlineAttachment: false, jQuery: false */
/**
 * jQuery plugin for inline attach
 *
 * @param {document} document
 * @param {window} window
 * @param {jQuery} $
 */
(function(document, window, $) {
  'use strict';

  inlineAttachment.editors.jquery = {};

  /**
   * Creates a new editor using jQuery
   */
  var editor = function(instance) {

    var $this = $(instance);

    return {
      getValue: function() {
        return $this.val();
      },
      insertValue: function(val) {
        inlineAttachment.util.insertTextAtCursor($this[0], val);
      },
      setValue: function(val) {
        $this.val(val);
      }
    };
  };

  $.fn.inlineattachment = function(options) {

    var set = $(this);

    set.each(function() {

      var $this = $(this),
        ed = new editor($this),
        inlineattach = new inlineAttachment(options, ed);

      $this.bind({
        'paste': function(e) {
          inlineattach.onPaste(e.originalEvent);
        },
        'drop': function(e) {
          e.stopPropagation();
          e.preventDefault();
          inlineattach.onDrop(e.originalEvent);
        },
        'dragenter dragover': function(e) {
          e.stopPropagation();
          e.preventDefault();
        }
      });
    });

    return this;
  };

  inlineAttachment.editors.jquery.Editor = editor;

})(document, window, jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./node_modules/marked/lib/marked.js":
/*!*******************************************!*\
  !*** ./node_modules/marked/lib/marked.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n?(?!hr|heading|lheading| {0,3}>|tag)[^\n]+)+)/,
  text: /^[^\n]+/
};

block._label = /(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b';

block.html = edit(block.html)
  .replace('comment', /<!--[\s\S]*?-->/)
  .replace('closed', /<(tag)[\s\S]+?<\/\1>/)
  .replace('closing', /<tag(?:"[^"]*"|'[^']*'|\s[^'"\/>\s]*)*?\/?>/)
  .replace(/tag/g, block._tag)
  .getRegex();

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  .replace('lheading', block.lheading)
  .replace('tag', '<' + block._tag)
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  .getRegex();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      space,
      i,
      tag,
      l,
      isordered;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      this.tokens.push({
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : ''
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase();
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?[a-zA-Z0-9\-]+(?:"[^"]*"|'[^']*'|\s[^<'">\/\s]*)*?\/?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^_([^\s_](?:[^_]|__)+?[^\s_])_\b|^\*((?:\*\*|[^*])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
};

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;

inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex()

inline._inside = /(?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = edit(inline.link)
  .replace('inside', inline._inside)
  .replace('href', inline._href)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('inside', inline._inside)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
    .replace('email', inline._email)
    .getRegex(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: edit(inline.text)
    .replace(']|', '~]|')
    .replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')
    .getRegex()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
      link,
      text,
      href,
      cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      cap[0] = this.rules._backpedal.exec(cap[0])[0];
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href),
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
      i = 0,
      ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function (text) {
  return text;
}

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
}

TextRenderer.prototype.br = function() {
  return '';
}

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, {renderer: new TextRenderer()})
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)));
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function edit(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  root.marked = marked;
}
})(this || (typeof window !== 'undefined' ? window : global));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/microplugin/src/microplugin.js":
/*!*****************************************************!*\
  !*** ./node_modules/microplugin/src/microplugin.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
}(this, function() {
	var MicroPlugin = {};

	MicroPlugin.mixin = function(Interface) {
		Interface.plugins = {};

		/**
		 * Initializes the listed plugins (with options).
		 * Acceptable formats:
		 *
		 * List (without options):
		 *   ['a', 'b', 'c']
		 *
		 * List (with options):
		 *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
		 *
		 * Hash (with options):
		 *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
		 *
		 * @param {mixed} plugins
		 */
		Interface.prototype.initializePlugins = function(plugins) {
			var i, n, key;
			var self  = this;
			var queue = [];

			self.plugins = {
				names     : [],
				settings  : {},
				requested : {},
				loaded    : {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function(name) {
			var self    = this;
			var plugins = self.plugins;
			var plugin  = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' +  name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
		 * Initializes a plugin.
		 *
		 * @param {string} name
		 */
		Interface.prototype.require = function(name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
		 * Registers a plugin.
		 *
		 * @param {string} name
		 * @param {function} fn
		 */
		Interface.define = function(name, fn) {
			Interface.plugins[name] = {
				'name' : name,
				'fn'   : fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function(vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
}));

/***/ }),

/***/ "./node_modules/selectize/dist/js/selectize.js":
/*!*****************************************************!*\
  !*** ./node_modules/selectize/dist/js/selectize.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * selectize.js (v0.12.4)
 * Copyright (c) 2013–2015 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function(root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery"),__webpack_require__(/*! sifter */ "./node_modules/sifter/sifter.js"),__webpack_require__(/*! microplugin */ "./node_modules/microplugin/src/microplugin.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'), require('sifter'), require('microplugin'));
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
}(this, function($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = (typeof pattern === 'string') ? new RegExp(pattern, 'i') : pattern;
	
		var highlight = function(node) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};
	
		return $element.each(function() {
			highlight(this);
		});
	};
	
	/**
	 * removeHighlight fn copied from highlight v5 and
	 * edited to remove with() and pass js strict mode
	 */
	$.fn.removeHighlight = function() {
		return this.find("span.highlight").each(function() {
			this.parentNode.firstChild.nodeName;
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};
	
	
	var MicroEvent = function() {};
	MicroEvent.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];
	
			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function(event /* , args... */){
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	/**
	 * Mixin will delegate all MicroEvent.js function in the destination object.
	 *
	 * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
	 *
	 * @param {object} the object which will support MicroEvent
	 */
	MicroEvent.mixin = function(destObject){
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++){
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};
	
	var IS_MAC        = /Mac/.test(navigator.userAgent);
	
	var KEY_A         = 65;
	var KEY_COMMA     = 188;
	var KEY_RETURN    = 13;
	var KEY_ESC       = 27;
	var KEY_LEFT      = 37;
	var KEY_UP        = 38;
	var KEY_P         = 80;
	var KEY_RIGHT     = 39;
	var KEY_DOWN      = 40;
	var KEY_N         = 78;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE    = 46;
	var KEY_SHIFT     = 16;
	var KEY_CMD       = IS_MAC ? 91 : 17;
	var KEY_CTRL      = IS_MAC ? 18 : 17;
	var KEY_TAB       = 9;
	
	var TAG_SELECT    = 1;
	var TAG_INPUT     = 2;
	
	// for now, android support in general is too spotty to support validity
	var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
	
	
	var isset = function(object) {
		return typeof object !== 'undefined';
	};
	
	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 * @param {string} value
	 * @returns {string|null}
	 */
	var hash_key = function(value) {
		if (typeof value === 'undefined' || value === null) return null;
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};
	
	/**
	 * Escapes a string for use within HTML.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_html = function(str) {
		return (str + '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
	
	/**
	 * Escapes "$" characters in replacement strings.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_replace = function(str) {
		return (str + '').replace(/\$/g, '$$$$');
	};
	
	var hook = {};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked before the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.before = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked after the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.after = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be invoked once.
	 *
	 * @param {function} fn
	 * @returns {function}
	 */
	var once = function(fn) {
		var called = false;
		return function() {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be called once
	 * every `delay` milliseconds (invoked on the falling edge).
	 *
	 * @param {function} fn
	 * @param {int} delay
	 * @returns {function}
	 */
	var debounce = function(fn, delay) {
		var timeout;
		return function() {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};
	
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 * @param {object} self
	 * @param {array} types
	 * @param {function} fn
	 */
	var debounce_events = function(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};
	
		// override trigger method
		self.trigger = function() {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};
	
		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;
	
		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};
	
	/**
	 * A workaround for http://bugs.jquery.com/ticket/6696
	 *
	 * @param {object} $parent - Parent element to listen on.
	 * @param {string} event - Event name.
	 * @param {string} selector - Descendant selector to filter by.
	 * @param {function} fn - Event handler.
	 */
	var watchChildEvent = function($parent, event, selector, fn) {
		$parent.on(event, selector, function(e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};
	
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 * @param {object} input
	 * @returns {object}
	 */
	var getSelection = function(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};
	
	/**
	 * Copies CSS properties from one element to another.
	 *
	 * @param {object} $from
	 * @param {object} $to
	 * @param {array} properties
	 */
	var transferStyles = function($from, $to, properties) {
		var i, n, styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};
	
	/**
	 * Measures the width of a string within a
	 * parent element (in pixels).
	 *
	 * @param {string} str
	 * @param {object} $parent
	 * @returns {int}
	 */
	var measureString = function(str, $parent) {
		if (!str) {
			return 0;
		}
	
		var $test = $('<test>').css({
			position: 'absolute',
			top: -99999,
			left: -99999,
			width: 'auto',
			padding: 0,
			whiteSpace: 'pre'
		}).text(str).appendTo('body');
	
		transferStyles($parent, $test, [
			'letterSpacing',
			'fontSize',
			'fontFamily',
			'fontWeight',
			'textTransform'
		]);
	
		var width = $test.width();
		$test.remove();
	
		return width;
	};
	
	/**
	 * Sets up an input to grow horizontally as the user
	 * types. If the value is changed manually, you can
	 * trigger the "update" handler to resize:
	 *
	 * $input.trigger('update');
	 *
	 * @param {object} $input
	 */
	var autoGrow = function($input) {
		var currentWidth = null;
	
		var update = function(e, options) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
			options = options || {};
	
			if (e.metaKey || e.altKey) return;
			if (!options.force && $input.data('grow') === false) return;
	
			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = (
					(keyCode >= 97 && keyCode <= 122) || // a-z
					(keyCode >= 65 && keyCode <= 90)  || // A-Z
					(keyCode >= 48 && keyCode <= 57)  || // 0-9
					keyCode === 32 // space
				);
	
				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();
					else character = character.toLowerCase();
					value += character;
				}
			}
	
			placeholder = $input.attr('placeholder');
			if (!value && placeholder) {
				value = placeholder;
			}
	
			width = measureString(value, $input) + 4;
			if (width !== currentWidth) {
				currentWidth = width;
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};
	
		$input.on('keydown keyup update blur', update);
		update();
	};
	
	var domToString = function(d) {
		var tmp = document.createElement('div');
	
		tmp.appendChild(d.cloneNode(true));
	
		return tmp.innerHTML;
	};
	
	var logError = function(message, options){
		if(!options) options = {};
		var component = "Selectize";
	
		console.error(component + ": " + message)
	
		if(options.explanation){
			// console.group is undefined in <IE11
			if(console.group) console.group();
			console.error(options.explanation);
			if(console.group) console.groupEnd();
		}
	}
	
	
	var Selectize = function($input, settings) {
		var key, i, n, dir, input, self = this;
		input = $input[0];
		input.selectize = self;
	
		// detect rtl environment
		var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
		dir = computedStyle ? computedStyle.getPropertyValue('direction') : input.currentStyle && input.currentStyle.direction;
		dir = dir || $input.parents('[dir]:first').attr('dir') || '';
	
		// setup default state
		$.extend(self, {
			order            : 0,
			settings         : settings,
			$input           : $input,
			tabIndex         : $input.attr('tabindex') || '',
			tagType          : input.tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
			rtl              : /rtl/i.test(dir),
	
			eventNS          : '.selectize' + (++Selectize.count),
			highlightedValue : null,
			isOpen           : false,
			isDisabled       : false,
			isRequired       : $input.is('[required]'),
			isInvalid        : false,
			isLocked         : false,
			isFocused        : false,
			isInputHidden    : false,
			isSetup          : false,
			isShiftDown      : false,
			isCmdDown        : false,
			isCtrlDown       : false,
			ignoreFocus      : false,
			ignoreBlur       : false,
			ignoreHover      : false,
			hasOptions       : false,
			currentResults   : null,
			lastValue        : '',
			caretPos         : 0,
			loading          : 0,
			loadedSearches   : {},
	
			$activeOption    : null,
			$activeItems     : [],
	
			optgroups        : {},
			options          : {},
			userOptions      : {},
			items            : [],
			renderCache      : {},
			onSearchChange   : settings.loadThrottle === null ? self.onSearchChange : debounce(self.onSearchChange, settings.loadThrottle)
		});
	
		// search system
		self.sifter = new Sifter(this.options, {diacritics: settings.diacritics});
	
		// build options table
		if (self.settings.options) {
			for (i = 0, n = self.settings.options.length; i < n; i++) {
				self.registerOption(self.settings.options[i]);
			}
			delete self.settings.options;
		}
	
		// build optgroup table
		if (self.settings.optgroups) {
			for (i = 0, n = self.settings.optgroups.length; i < n; i++) {
				self.registerOptionGroup(self.settings.optgroups[i]);
			}
			delete self.settings.optgroups;
		}
	
		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}
	
		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};
	
	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	MicroEvent.mixin(Selectize);
	
	if(typeof MicroPlugin !== "undefined"){
		MicroPlugin.mixin(Selectize);
	}else{
		logError("Dependency MicroPlugin is missing",
			{explanation:
				"Make sure you either: (1) are using the \"standalone\" "+
				"version of Selectize, or (2) require MicroPlugin before you "+
				"load Selectize."}
		);
	}
	
	
	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	$.extend(Selectize.prototype, {
	
		/**
		 * Creates all elements and sets up event bindings.
		 */
		setup: function() {
			var self      = this;
			var settings  = self.settings;
			var eventNS   = self.eventNS;
			var $window   = $(window);
			var $document = $(document);
			var $input    = self.$input;
	
			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var classes;
			var classes_plugins;
			var inputId;
	
			inputMode         = self.settings.mode;
			classes           = $input.attr('class') || '';
	
			$wrapper          = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control          = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input    = $('<input type="text" autocomplete="off" />').appendTo($control).attr('tabindex', $input.is(':disabled') ? '-1' : self.tabIndex);
			$dropdown_parent  = $(settings.dropdownParent || $wrapper);
			$dropdown         = $('<div>').addClass(settings.dropdownClass).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);
	
			if(inputId = $input.attr('id')) {
				$control_input.attr('id', inputId + '-selectized');
				$("label[for='"+inputId+"']").attr('for', inputId + '-selectized');
			}
	
			if(self.settings.copyClassesToDropdown) {
				$dropdown.addClass(classes);
			}
	
			$wrapper.css({
				width: $input[0].style.width
			});
	
			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}
	
			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				$input.attr('multiple', 'multiple');
			}
	
			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}
	
			// if splitOn was not passed in, construct it from the delimiter to allow pasting universally
			if (!self.settings.splitOn && self.settings.delimiter) {
				var delimiterEscaped = self.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				self.settings.splitOn = new RegExp('\\s*' + delimiterEscaped + '+\\s*');
			}
	
			if ($input.attr('autocorrect')) {
				$control_input.attr('autocorrect', $input.attr('autocorrect'));
			}
	
			if ($input.attr('autocapitalize')) {
				$control_input.attr('autocapitalize', $input.attr('autocapitalize'));
			}
	
			self.$wrapper          = $wrapper;
			self.$control          = $control;
			self.$control_input    = $control_input;
			self.$dropdown         = $dropdown;
			self.$dropdown_content = $dropdown_content;
	
			$dropdown.on('mouseenter', '[data-selectable]', function() { return self.onOptionHover.apply(self, arguments); });
			$dropdown.on('mousedown click', '[data-selectable]', function() { return self.onOptionSelect.apply(self, arguments); });
			watchChildEvent($control, 'mousedown', '*:not(input)', function() { return self.onItemSelect.apply(self, arguments); });
			autoGrow($control_input);
	
			$control.on({
				mousedown : function() { return self.onMouseDown.apply(self, arguments); },
				click     : function() { return self.onClick.apply(self, arguments); }
			});
	
			$control_input.on({
				mousedown : function(e) { e.stopPropagation(); },
				keydown   : function() { return self.onKeyDown.apply(self, arguments); },
				keyup     : function() { return self.onKeyUp.apply(self, arguments); },
				keypress  : function() { return self.onKeyPress.apply(self, arguments); },
				resize    : function() { self.positionDropdown.apply(self, []); },
				blur      : function() { return self.onBlur.apply(self, arguments); },
				focus     : function() { self.ignoreBlur = false; return self.onFocus.apply(self, arguments); },
				paste     : function() { return self.onPaste.apply(self, arguments); }
			});
	
			$document.on('keydown' + eventNS, function(e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});
	
			$document.on('keyup' + eventNS, function(e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});
	
			$document.on('mousedown' + eventNS, function(e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						return false;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur(e.target);
					}
				}
			});
	
			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function() {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function() {
				self.ignoreHover = false;
			});
	
			// store original children and tab index so that they can be
			// restored when the destroy() method is called.
			this.revertSettings = {
				$children : $input.children().detach(),
				tabindex  : $input.attr('tabindex')
			};
	
			$input.attr('tabindex', -1).hide().after(self.$wrapper);
	
			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}
	
			// feature detect for the validation API
			if (SUPPORTS_VALIDITY_API) {
				$input.on('invalid' + eventNS, function(e) {
					e.preventDefault();
					self.isInvalid = true;
					self.refreshState();
				});
			}
	
			self.updateOriginalInput();
			self.refreshItems();
			self.refreshState();
			self.updatePlaceholder();
			self.isSetup = true;
	
			if ($input.is(':disabled')) {
				self.disable();
			}
	
			self.on('change', this.onChange);
	
			$input.data('selectize', self);
			$input.addClass('selectized');
			self.trigger('initialize');
	
			// preload options
			if (settings.preload === true) {
				self.onSearchChange('');
			}
	
		},
	
		/**
		 * Sets up default rendering functions.
		 */
		setupTemplates: function() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;
	
			var templates = {
				'optgroup': function(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				}
			};
	
			self.settings.render = $.extend({}, templates, self.settings.render);
		},
	
		/**
		 * Maps fired events to callbacks provided
		 * in the settings used when creating the control.
		 */
		setupCallbacks: function() {
			var key, fn, callbacks = {
				'initialize'      : 'onInitialize',
				'change'          : 'onChange',
				'item_add'        : 'onItemAdd',
				'item_remove'     : 'onItemRemove',
				'clear'           : 'onClear',
				'option_add'      : 'onOptionAdd',
				'option_remove'   : 'onOptionRemove',
				'option_clear'    : 'onOptionClear',
				'optgroup_add'    : 'onOptionGroupAdd',
				'optgroup_remove' : 'onOptionGroupRemove',
				'optgroup_clear'  : 'onOptionGroupClear',
				'dropdown_open'   : 'onDropdownOpen',
				'dropdown_close'  : 'onDropdownClose',
				'type'            : 'onType',
				'load'            : 'onLoad',
				'focus'           : 'onFocus',
				'blur'            : 'onBlur'
			};
	
			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a click event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onClick: function(e) {
			var self = this;
	
			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
			if (!self.isFocused) {
				self.focus();
				e.preventDefault();
			}
		},
	
		/**
		 * Triggered when the main control element
		 * has a mouse down event.
		 *
		 * @param {object} e
		 * @return {boolean}
		 */
		onMouseDown: function(e) {
			var self = this;
			var defaultPrevented = e.isDefaultPrevented();
			var $target = $(e.target);
	
			if (self.isFocused) {
				// retain focus by preventing native handling. if the
				// event target is the input it should not be modified.
				// otherwise, text selection within the input won't work.
				if (e.target !== self.$control_input[0]) {
					if (self.settings.mode === 'single') {
						// toggle dropdown
						self.isOpen ? self.close() : self.open();
					} else if (!defaultPrevented) {
						self.setActiveItem(null);
					}
					return false;
				}
			} else {
				// give control focus
				if (!defaultPrevented) {
					window.setTimeout(function() {
						self.focus();
					}, 0);
				}
			}
		},
	
		/**
		 * Triggered when the value of the control has been changed.
		 * This should propagate the event to the original DOM
		 * input / select element.
		 */
		onChange: function() {
			this.$input.trigger('change');
		},
	
		/**
		 * Triggered on <input> paste.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onPaste: function(e) {
			var self = this;
	
			if (self.isFull() || self.isInputHidden || self.isLocked) {
				e.preventDefault();
				return;
			}
	
			// If a regex or string is included, this will split the pasted
			// input and create Items for each separate value
			if (self.settings.splitOn) {
	
				// Wait for pasted text to be recognized in value
				setTimeout(function() {
					var pastedText = self.$control_input.val();
					if(!pastedText.match(self.settings.splitOn)){ return }
	
					var splitInput = $.trim(pastedText).split(self.settings.splitOn);
					for (var i = 0, n = splitInput.length; i < n; i++) {
						self.createItem(splitInput[i]);
					}
				}, 0);
			}
		},
	
		/**
		 * Triggered on <input> keypress.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyPress: function(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && this.settings.mode === 'multi' && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},
	
		/**
		 * Triggered on <input> keydown.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyDown: function(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;
	
			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}
	
			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					if (self.isOpen) {
						e.preventDefault();
						e.stopPropagation();
						self.close();
					}
					return;
				case KEY_N:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_P:
					if (!e.ctrlKey || e.altKey) break;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
						e.preventDefault();
					}
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.selectOnTab && self.isOpen && self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
	
						// Default behaviour is to jump to the next field, we only want this
						// if the current field doesn't accept any more entries
						if (!self.isFull()) {
							e.preventDefault();
						}
					}
					if (self.settings.create && self.createItem()) {
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}
	
			if ((self.isFull() || self.isInputHidden) && !(IS_MAC ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				return;
			}
		},
	
		/**
		 * Triggered on <input> keyup.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyUp: function(e) {
			var self = this;
	
			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},
	
		/**
		 * Invokes the user-provide option provider / loader.
		 *
		 * Note: this function is debounced in the Selectize
		 * constructor (by `settings.loadThrottle` milliseconds)
		 *
		 * @param {string} value
		 */
		onSearchChange: function(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function(callback) {
				fn.apply(self, [value, callback]);
			});
		},
	
		/**
		 * Triggered on <input> focus.
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		onFocus: function(e) {
			var self = this;
			var wasFocused = self.isFocused;
	
			if (self.isDisabled) {
				self.blur();
				e && e.preventDefault();
				return false;
			}
	
			if (self.ignoreFocus) return;
			self.isFocused = true;
			if (self.settings.preload === 'focus') self.onSearchChange('');
	
			if (!wasFocused) self.trigger('focus');
	
			if (!self.$activeItems.length) {
				self.showInput();
				self.setActiveItem(null);
				self.refreshOptions(!!self.settings.openOnFocus);
			}
	
			self.refreshState();
		},
	
		/**
		 * Triggered on <input> blur.
		 *
		 * @param {object} e
		 * @param {Element} dest
		 */
		onBlur: function(e, dest) {
			var self = this;
			if (!self.isFocused) return;
			self.isFocused = false;
	
			if (self.ignoreFocus) {
				return;
			} else if (!self.ignoreBlur && document.activeElement === self.$dropdown_content[0]) {
				// necessary to prevent IE closing the dropdown when the scrollbar is clicked
				self.ignoreBlur = true;
				self.onFocus(e);
				return;
			}
	
			var deactivate = function() {
				self.close();
				self.setTextboxValue('');
				self.setActiveItem(null);
				self.setActiveOption(null);
				self.setCaret(self.items.length);
				self.refreshState();
	
				// IE11 bug: element still marked as active
				dest && dest.focus && dest.focus();
	
				self.ignoreFocus = false;
				self.trigger('blur');
			};
	
			self.ignoreFocus = true;
			if (self.settings.create && self.settings.createOnBlur) {
				self.createItem(null, false, deactivate);
			} else {
				deactivate();
			}
		},
	
		/**
		 * Triggered when the user rolls over
		 * an option in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionHover: function(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},
	
		/**
		 * Triggered when the user clicks on an option
		 * in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionSelect: function(e) {
			var value, $target, $option, self = this;
	
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
	
			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem(null, function() {
					if (self.settings.closeAfterSelect) {
						self.close();
					}
				});
			} else {
				value = $target.attr('data-value');
				if (typeof value !== 'undefined') {
					self.lastQuery = null;
					self.setTextboxValue('');
					self.addItem(value);
					if (self.settings.closeAfterSelect) {
						self.close();
					} else if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},
	
		/**
		 * Triggered when the user clicks on an item
		 * that has been selected.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onItemSelect: function(e) {
			var self = this;
	
			if (self.isLocked) return;
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
			}
		},
	
		/**
		 * Invokes the provided method that provides
		 * results to a callback---which are then added
		 * as options to the control.
		 *
		 * @param {function} fn
		 */
		load: function(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass(self.settings.loadingClass);
	
			self.loading++;
			fn.apply(self, [function(results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(self.isFocused && !self.isInputHidden);
				}
				if (!self.loading) {
					$wrapper.removeClass(self.settings.loadingClass);
				}
				self.trigger('load', results);
			}]);
		},
	
		/**
		 * Sets the input field of the control to the specified value.
		 *
		 * @param {string} value
		 */
		setTextboxValue: function(value) {
			var $input = this.$control_input;
			var changed = $input.val() !== value;
			if (changed) {
				$input.val(value).triggerHandler('update');
				this.lastValue = value;
			}
		},
	
		/**
		 * Returns the value of the control. If multiple items
		 * can be selected (e.g. <select multiple>), this returns
		 * an array. If only one item can be selected, this
		 * returns a string.
		 *
		 * @returns {mixed}
		 */
		getValue: function() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},
	
		/**
		 * Resets the selected items to the given value.
		 *
		 * @param {mixed} value
		 */
		setValue: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				this.clear(silent);
				this.addItems(value, silent);
			});
		},
	
		/**
		 * Sets the selected item.
		 *
		 * @param {object} $item
		 * @param {object} e (optional)
		 */
		setActiveItem: function($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;
	
			if (self.settings.mode === 'single') return;
			$item = $($item);
	
			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				if (self.isFocused) {
					self.showInput();
				}
				return;
			}
	
			// modify selection
			eventName = e && e.type.toLowerCase();
	
			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end   = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap  = begin;
					begin = end;
					end   = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if ((eventName === 'mousedown' && self.isCtrlDown) || (eventName === 'keydown' && this.isShiftDown)) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}
	
			// ensure control has focus
			self.hideInput();
			if (!this.isFocused) {
				self.focus();
			}
		},
	
		/**
		 * Sets the selected item in the dropdown menu
		 * of available options.
		 *
		 * @param {object} $object
		 * @param {boolean} scroll
		 * @param {boolean} animate
		 */
		setActiveOption: function($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;
	
			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;
	
			$option = $($option);
			if (!$option.length) return;
	
			self.$activeOption = $option.addClass('active');
	
			if (scroll || !isset(scroll)) {
	
				height_menu   = self.$dropdown_content.height();
				height_item   = self.$activeOption.outerHeight(true);
				scroll        = self.$dropdown_content.scrollTop() || 0;
				y             = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top    = y;
				scroll_bottom = y - height_menu + height_item;
	
				if (y + height_item > height_menu + scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_bottom}, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_top}, animate ? self.settings.scrollDuration : 0);
				}
	
			}
		},
	
		/**
		 * Selects all items (CTRL + A).
		 */
		selectAll: function() {
			var self = this;
			if (self.settings.mode === 'single') return;
	
			self.$activeItems = Array.prototype.slice.apply(self.$control.children(':not(input)').addClass('active'));
			if (self.$activeItems.length) {
				self.hideInput();
				self.close();
			}
			self.focus();
		},
	
		/**
		 * Hides the input element out of view, while
		 * retaining its focus.
		 */
		hideInput: function() {
			var self = this;
	
			self.setTextboxValue('');
			self.$control_input.css({opacity: 0, position: 'absolute', left: self.rtl ? 10000 : -10000});
			self.isInputHidden = true;
		},
	
		/**
		 * Restores input visibility.
		 */
		showInput: function() {
			this.$control_input.css({opacity: 1, position: 'relative', left: 0});
			this.isInputHidden = false;
		},
	
		/**
		 * Gives the control focus.
		 */
		focus: function() {
			var self = this;
			if (self.isDisabled) return;
	
			self.ignoreFocus = true;
			self.$control_input[0].focus();
			window.setTimeout(function() {
				self.ignoreFocus = false;
				self.onFocus();
			}, 0);
		},
	
		/**
		 * Forces the control out of focus.
		 *
		 * @param {Element} dest
		 */
		blur: function(dest) {
			this.$control_input[0].blur();
			this.onBlur(null, dest);
		},
	
		/**
		 * Returns a function that scores an object
		 * to show how good of a match it is to the
		 * provided query.
		 *
		 * @param {string} query
		 * @param {object} options
		 * @return {function}
		 */
		getScoreFunction: function(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},
	
		/**
		 * Returns search options for sifter (the system
		 * for scoring and sorting results).
		 *
		 * @see https://github.com/brianreavis/sifter.js
		 * @return {object}
		 */
		getSearchOptions: function() {
			var settings = this.settings;
			var sort = settings.sortField;
			if (typeof sort === 'string') {
				sort = [{field: sort}];
			}
	
			return {
				fields      : settings.searchField,
				conjunction : settings.searchConjunction,
				sort        : sort
			};
		},
	
		/**
		 * Searches through available options and returns
		 * a sorted array of matches.
		 *
		 * Returns an object containing:
		 *
		 *   - query {string}
		 *   - tokens {array}
		 *   - total {int}
		 *   - items {array}
		 *
		 * @param {string} query
		 * @returns {object}
		 */
		search: function(query) {
			var i, value, score, result, calculateScore;
			var self     = this;
			var settings = self.settings;
			var options  = this.getSearchOptions();
	
			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}
	
			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, {score: calculateScore}));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}
	
			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}
	
			return result;
		},
	
		/**
		 * Refreshes the list of available options shown
		 * in the autocomplete dropdown menu.
		 *
		 * @param {boolean} triggerDropdown
		 */
		refreshOptions: function(triggerDropdown) {
			var i, j, k, n, groups, groups_order, option, option_html, optgroup, optgroups, html, html_children, has_create_option;
			var $active, $active_before, $create;
	
			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}
	
			var self              = this;
			var query             = $.trim(self.$control_input.val());
			var results           = self.search(query);
			var $dropdown_content = self.$dropdown_content;
			var active_before     = self.$activeOption && hash_key(self.$activeOption.attr('data-value'));
	
			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}
	
			// render and group available options individually
			groups = {};
			groups_order = [];
	
			for (i = 0; i < n; i++) {
				option      = self.options[results.items[i].id];
				option_html = self.render('option', option);
				optgroup    = option[self.settings.optgroupField] || '';
				optgroups   = $.isArray(optgroup) ? optgroup : [optgroup];
	
				for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
					optgroup = optgroups[j];
					if (!self.optgroups.hasOwnProperty(optgroup)) {
						optgroup = '';
					}
					if (!groups.hasOwnProperty(optgroup)) {
						groups[optgroup] = document.createDocumentFragment();
						groups_order.push(optgroup);
					}
					groups[optgroup].appendChild(option_html);
				}
			}
	
			// sort optgroups
			if (this.settings.lockOptgroupOrder) {
				groups_order.sort(function(a, b) {
					var a_order = self.optgroups[a].$order || 0;
					var b_order = self.optgroups[b].$order || 0;
					return a_order - b_order;
				});
			}
	
			// render optgroup headers & join groups
			html = document.createDocumentFragment();
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].childNodes.length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = document.createDocumentFragment();
					html_children.appendChild(self.render('optgroup_header', self.optgroups[optgroup]));
					html_children.appendChild(groups[optgroup]);
	
					html.appendChild(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: domToString(html_children),
						dom:  html_children
					})));
				} else {
					html.appendChild(groups[optgroup]);
				}
			}
	
			$dropdown_content.html(html);
	
			// highlight matching terms inline
			if (self.settings.highlight && results.query.length && results.tokens.length) {
				$dropdown_content.removeHighlight();
				for (i = 0, n = results.tokens.length; i < n; i++) {
					highlight($dropdown_content, results.tokens[i].regex);
				}
			}
	
			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}
	
			// add create option
			has_create_option = self.canCreate(query);
			if (has_create_option) {
				$dropdown_content.prepend(self.render('option_create', {input: query}));
				$create = $($dropdown_content[0].childNodes[0]);
			}
	
			// activate
			self.hasOptions = results.items.length > 0 || has_create_option;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					$active_before = active_before && self.getOption(active_before);
					if ($active_before && $active_before.length) {
						$active = $active_before;
					} else if (self.settings.mode === 'single' && self.items.length) {
						$active = self.getOption(self.items[0]);
					}
					if (!$active || !$active.length) {
						if ($create && !self.settings.addPrecedence) {
							$active = self.getAdjacentOption($create, 1);
						} else {
							$active = $dropdown_content.find('[data-selectable]:first');
						}
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) { self.open(); }
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) { self.close(); }
			}
		},
	
		/**
		 * Adds an available option. If it already exists,
		 * nothing will happen. Note: this does not refresh
		 * the options list dropdown (use `refreshOptions`
		 * for that).
		 *
		 * Usage:
		 *
		 *   this.addOption(data)
		 *
		 * @param {object|array} data
		 */
		addOption: function(data) {
			var i, n, value, self = this;
	
			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}
	
			if (value = self.registerOption(data)) {
				self.userOptions[value] = true;
				self.lastQuery = null;
				self.trigger('option_add', value, data);
			}
		},
	
		/**
		 * Registers an option to the pool of options.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOption: function(data) {
			var key = hash_key(data[this.settings.valueField]);
			if (typeof key === 'undefined' || key === null || this.options.hasOwnProperty(key)) return false;
			data.$order = data.$order || ++this.order;
			this.options[key] = data;
			return key;
		},
	
		/**
		 * Registers an option group to the pool of option groups.
		 *
		 * @param {object} data
		 * @return {boolean|string}
		 */
		registerOptionGroup: function(data) {
			var key = hash_key(data[this.settings.optgroupValueField]);
			if (!key) return false;
	
			data.$order = data.$order || ++this.order;
			this.optgroups[key] = data;
			return key;
		},
	
		/**
		 * Registers a new optgroup for options
		 * to be bucketed into.
		 *
		 * @param {string} id
		 * @param {object} data
		 */
		addOptionGroup: function(id, data) {
			data[this.settings.optgroupValueField] = id;
			if (id = this.registerOptionGroup(data)) {
				this.trigger('optgroup_add', id, data);
			}
		},
	
		/**
		 * Removes an existing option group.
		 *
		 * @param {string} id
		 */
		removeOptionGroup: function(id) {
			if (this.optgroups.hasOwnProperty(id)) {
				delete this.optgroups[id];
				this.renderCache = {};
				this.trigger('optgroup_remove', id);
			}
		},
	
		/**
		 * Clears all existing option groups.
		 */
		clearOptionGroups: function() {
			this.optgroups = {};
			this.renderCache = {};
			this.trigger('optgroup_clear');
		},
	
		/**
		 * Updates an option available for selection. If
		 * it is visible in the selected items or options
		 * dropdown, it will be re-rendered automatically.
		 *
		 * @param {string} value
		 * @param {object} data
		 */
		updateOption: function(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options, order_old;
	
			value     = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);
	
			// sanity checks
			if (value === null) return;
			if (!self.options.hasOwnProperty(value)) return;
			if (typeof value_new !== 'string') throw new Error('Value must be set in option data');
	
			order_old = self.options[value].$order;
	
			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			data.$order = data.$order || order_old;
			self.options[value_new] = data;
	
			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];
	
			if (cache_items) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (cache_options) {
				delete cache_options[value];
				delete cache_options[value_new];
			}
	
			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}
	
			// invalidate last query because we might have updated the sortField
			self.lastQuery = null;
	
			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},
	
		/**
		 * Removes a single option.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		removeOption: function(value, silent) {
			var self = this;
			value = hash_key(value);
	
			var cache_items = self.renderCache['item'];
			var cache_options = self.renderCache['option'];
			if (cache_items) delete cache_items[value];
			if (cache_options) delete cache_options[value];
	
			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value, silent);
		},
	
		/**
		 * Clears all options.
		 */
		clearOptions: function() {
			var self = this;
	
			self.loadedSearches = {};
			self.userOptions = {};
			self.renderCache = {};
			self.options = self.sifter.items = {};
			self.lastQuery = null;
			self.trigger('option_clear');
			self.clear();
		},
	
		/**
		 * Returns the jQuery element of the option
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getOption: function(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},
	
		/**
		 * Returns the jQuery element of the next or
		 * previous selectable option.
		 *
		 * @param {object} $option
		 * @param {int} direction  can be 1 for next or -1 for previous
		 * @return {object}
		 */
		getAdjacentOption: function($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},
	
		/**
		 * Finds the first element with a "data-value" attribute
		 * that matches the given value.
		 *
		 * @param {mixed} value
		 * @param {object} $els
		 * @return {object}
		 */
		getElementWithValue: function(value, $els) {
			value = hash_key(value);
	
			if (typeof value !== 'undefined' && value !== null) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}
	
			return $();
		},
	
		/**
		 * Returns the jQuery element of the item
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getItem: function(value) {
			return this.getElementWithValue(value, this.$control.children());
		},
	
		/**
		 * "Selects" multiple items at once. Adds them to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItems: function(values, silent) {
			var items = $.isArray(values) ? values : [values];
			for (var i = 0, n = items.length; i < n; i++) {
				this.isPending = (i < n - 1);
				this.addItem(items[i], silent);
			}
		},
	
		/**
		 * "Selects" an item. Adds it to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 * @param {boolean} silent
		 */
		addItem: function(value, silent) {
			var events = silent ? [] : ['change'];
	
			debounce_events(this, events, function() {
				var $item, $option, $options;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, value_next, wasFull;
				value = hash_key(value);
	
				if (self.items.indexOf(value) !== -1) {
					if (inputMode === 'single') self.close();
					return;
				}
	
				if (!self.options.hasOwnProperty(value)) return;
				if (inputMode === 'single') self.clear(silent);
				if (inputMode === 'multi' && self.isFull()) return;
	
				$item = $(self.render('item', self.options[value]));
				wasFull = self.isFull();
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				if (!self.isPending || (!wasFull && self.isFull())) {
					self.refreshState();
				}
	
				if (self.isSetup) {
					$options = self.$dropdown_content.find('[data-selectable]');
	
					// update menu / remove the option (if this is not one item being added as part of series)
					if (!self.isPending) {
						$option = self.getOption(value);
						value_next = self.getAdjacentOption($option, 1).attr('data-value');
						self.refreshOptions(self.isFocused && inputMode !== 'single');
						if (value_next) {
							self.setActiveOption(self.getOption(value_next));
						}
					}
	
					// hide the menu if the maximum number of items have been selected or no options are left
					if (!$options.length || self.isFull()) {
						self.close();
					} else {
						self.positionDropdown();
					}
	
					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
					self.updateOriginalInput({silent: silent});
				}
			});
		},
	
		/**
		 * Removes the selected item matching
		 * the provided value.
		 *
		 * @param {string} value
		 */
		removeItem: function(value, silent) {
			var self = this;
			var $item, i, idx;
	
			$item = (value instanceof $) ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);
	
			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}
	
				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value, silent);
				}
	
				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}
	
				self.refreshState();
				self.updatePlaceholder();
				self.updateOriginalInput({silent: silent});
				self.positionDropdown();
				self.trigger('item_remove', value, $item);
			}
		},
	
		/**
		 * Invokes the `create` method provided in the
		 * selectize options that should provide the data
		 * for the new item, given the user input.
		 *
		 * Once this completes, it will be added
		 * to the item list.
		 *
		 * @param {string} value
		 * @param {boolean} [triggerDropdown]
		 * @param {function} [callback]
		 * @return {boolean}
		 */
		createItem: function(input, triggerDropdown) {
			var self  = this;
			var caret = self.caretPos;
			input = input || $.trim(self.$control_input.val() || '');
	
			var callback = arguments[arguments.length - 1];
			if (typeof callback !== 'function') callback = function() {};
	
			if (typeof triggerDropdown !== 'boolean') {
				triggerDropdown = true;
			}
	
			if (!self.canCreate(input)) {
				callback();
				return false;
			}
	
			self.lock();
	
			var setup = (typeof self.settings.create === 'function') ? this.settings.create : function(input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};
	
			var create = once(function(data) {
				self.unlock();
	
				if (!data || typeof data !== 'object') return callback();
				var value = hash_key(data[self.settings.valueField]);
				if (typeof value !== 'string') return callback();
	
				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(triggerDropdown && self.settings.mode !== 'single');
				callback(data);
			});
	
			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}
	
			return true;
		},
	
		/**
		 * Re-renders the selected item lists.
		 */
		refreshItems: function() {
			this.lastQuery = null;
	
			if (this.isSetup) {
				this.addItem(this.items);
			}
	
			this.refreshState();
			this.updateOriginalInput();
		},
	
		/**
		 * Updates all state-dependent attributes
		 * and CSS classes.
		 */
		refreshState: function() {
			this.refreshValidityState();
			this.refreshClasses();
		},
	
		/**
		 * Update the `required` attribute of both input and control input.
		 *
		 * The `required` property needs to be activated on the control input
		 * for the error to be displayed at the right place. `required` also
		 * needs to be temporarily deactivated on the input since the input is
		 * hidden and can't show errors.
		 */
		refreshValidityState: function() {
			if (!this.isRequired) return false;
	
			var invalid = !this.items.length;
	
			this.isInvalid = invalid;
			this.$control_input.prop('required', invalid);
			this.$input.prop('required', !invalid);
		},
	
		/**
		 * Updates all state-dependent CSS classes.
		 */
		refreshClasses: function() {
			var self     = this;
			var isFull   = self.isFull();
			var isLocked = self.isLocked;
	
			self.$wrapper
				.toggleClass('rtl', self.rtl);
	
			self.$control
				.toggleClass('focus', self.isFocused)
				.toggleClass('disabled', self.isDisabled)
				.toggleClass('required', self.isRequired)
				.toggleClass('invalid', self.isInvalid)
				.toggleClass('locked', isLocked)
				.toggleClass('full', isFull).toggleClass('not-full', !isFull)
				.toggleClass('input-active', self.isFocused && !self.isInputHidden)
				.toggleClass('dropdown-active', self.isOpen)
				.toggleClass('has-options', !$.isEmptyObject(self.options))
				.toggleClass('has-items', self.items.length > 0);
	
			self.$control_input.data('grow', !isFull && !isLocked);
		},
	
		/**
		 * Determines whether or not more items can be added
		 * to the control without exceeding the user-defined maximum.
		 *
		 * @returns {boolean}
		 */
		isFull: function() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},
	
		/**
		 * Refreshes the original <select> or <input>
		 * element to reflect the current state.
		 */
		updateOriginalInput: function(opts) {
			var i, n, options, label, self = this;
			opts = opts || {};
	
			if (self.tagType === TAG_SELECT) {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					label = self.options[self.items[i]][self.settings.labelField] || '';
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected">' + escape_html(label) + '</option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
				self.$input.attr('value',self.$input.val());
			}
	
			if (self.isSetup) {
				if (!opts.silent) {
					self.trigger('change', self.$input.val());
				}
			}
		},
	
		/**
		 * Shows/hide the input placeholder depending
		 * on if there items in the list already.
		 */
		updatePlaceholder: function() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;
	
			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update', {force: true});
		},
	
		/**
		 * Shows the autocomplete dropdown containing
		 * the available options.
		 */
		open: function() {
			var self = this;
	
			if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
			self.focus();
			self.isOpen = true;
			self.refreshState();
			self.$dropdown.css({visibility: 'hidden', display: 'block'});
			self.positionDropdown();
			self.$dropdown.css({visibility: 'visible'});
			self.trigger('dropdown_open', self.$dropdown);
		},
	
		/**
		 * Closes the autocomplete dropdown menu.
		 */
		close: function() {
			var self = this;
			var trigger = self.isOpen;
	
			if (self.settings.mode === 'single' && self.items.length) {
				self.hideInput();
				self.$control_input.blur(); // close keyboard on iOS
			}
	
			self.isOpen = false;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.refreshState();
	
			if (trigger) self.trigger('dropdown_close', self.$dropdown);
		},
	
		/**
		 * Calculates and applies the appropriate
		 * position of the dropdown.
		 */
		positionDropdown: function() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);
	
			this.$dropdown.css({
				width : $control.outerWidth(),
				top   : offset.top,
				left  : offset.left
			});
		},
	
		/**
		 * Resets / clears all selected items
		 * from the control.
		 *
		 * @param {boolean} silent
		 */
		clear: function(silent) {
			var self = this;
	
			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.lastQuery = null;
			self.setCaret(0);
			self.setActiveItem(null);
			self.updatePlaceholder();
			self.updateOriginalInput({silent: silent});
			self.refreshState();
			self.showInput();
			self.trigger('clear');
		},
	
		/**
		 * A helper method for inserting an element
		 * at the current caret position.
		 *
		 * @param {object} $el
		 */
		insertAtCaret: function($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			if (caret === 0) {
				this.$control.prepend($el);
			} else {
				$(this.$control[0].childNodes[caret]).before($el);
			}
			this.setCaret(caret + 1);
		},
	
		/**
		 * Removes the current selected item(s).
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		deleteSelection: function(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;
	
			direction = (e && e.keyCode === KEY_BACKSPACE) ? -1 : 1;
			selection = getSelection(self.$control_input[0]);
	
			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}
	
			// determine items that will be removed
			values = [];
	
			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) { caret++; }
	
				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}
	
			// allow the callback to abort
			if (!values.length || (typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false)) {
				return false;
			}
	
			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}
	
			self.showInput();
			self.positionDropdown();
			self.refreshOptions(true);
	
			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}
	
			return true;
		},
	
		/**
		 * Selects the previous / next item (depending
		 * on the `direction` argument).
		 *
		 * > 0 - right
		 * < 0 - left
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceSelection: function(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;
	
			if (direction === 0) return;
			if (self.rtl) direction *= -1;
	
			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);
	
			if (self.isFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0
					? selection.start === 0 && selection.length === 0
					: selection.start === valueLength;
	
				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
				}
			}
		},
	
		/**
		 * Moves the caret left / right.
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceCaret: function(direction, e) {
			var self = this, fn, $adj;
	
			if (direction === 0) return;
	
			fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				$adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},
	
		/**
		 * Moves the caret to the specified index.
		 *
		 * @param {int} i
		 */
		setCaret: function(i) {
			var self = this;
	
			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}
	
			if(!self.isPending) {
				// the input must be moved by leaving it in place and moving the
				// siblings, due to the fact that focus cannot be restored once lost
				// on mobile webkit devices
				var j, n, fn, $children, $child;
				$children = self.$control.children(':not(input)');
				for (j = 0, n = $children.length; j < n; j++) {
					$child = $($children[j]).detach();
					if (j <  i) {
						self.$control_input.before($child);
					} else {
						self.$control.append($child);
					}
				}
			}
	
			self.caretPos = i;
		},
	
		/**
		 * Disables user input on the control. Used while
		 * items are being asynchronously created.
		 */
		lock: function() {
			this.close();
			this.isLocked = true;
			this.refreshState();
		},
	
		/**
		 * Re-enables user input on the control.
		 */
		unlock: function() {
			this.isLocked = false;
			this.refreshState();
		},
	
		/**
		 * Disables user input on the control completely.
		 * While disabled, it cannot receive focus.
		 */
		disable: function() {
			var self = this;
			self.$input.prop('disabled', true);
			self.$control_input.prop('disabled', true).prop('tabindex', -1);
			self.isDisabled = true;
			self.lock();
		},
	
		/**
		 * Enables the control so that it can respond
		 * to focus and user input.
		 */
		enable: function() {
			var self = this;
			self.$input.prop('disabled', false);
			self.$control_input.prop('disabled', false).prop('tabindex', self.tabIndex);
			self.isDisabled = false;
			self.unlock();
		},
	
		/**
		 * Completely destroys the control and
		 * unbinds all event listeners so that it can
		 * be garbage collected.
		 */
		destroy: function() {
			var self = this;
			var eventNS = self.eventNS;
			var revertSettings = self.revertSettings;
	
			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();
	
			self.$input
				.html('')
				.append(revertSettings.$children)
				.removeAttr('tabindex')
				.removeClass('selectized')
				.attr({tabindex: revertSettings.tabindex})
				.show();
	
			self.$control_input.removeData('grow');
			self.$input.removeData('selectize');
	
			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);
	
			delete self.$input[0].selectize;
		},
	
		/**
		 * A helper method for rendering "item" and
		 * "option" templates, given the data.
		 *
		 * @param {string} templateName
		 * @param {object} data
		 * @returns {string}
		 */
		render: function(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t \r\n]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;
	
			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}
	
			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}
	
			// render markup
			html = $(self.settings.render[templateName].apply(this, [data, escape_html]));
	
			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				html.attr('data-selectable', '');
			}
			else if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html.attr('data-group', id);
			}
			if (templateName === 'option' || templateName === 'item') {
				html.attr('data-value', value || '');
			}
	
			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html[0];
			}
	
			return html[0];
		},
	
		/**
		 * Clears the render cache for a template. If
		 * no template is given, clears all render
		 * caches.
		 *
		 * @param {string} templateName
		 */
		clearCache: function(templateName) {
			var self = this;
			if (typeof templateName === 'undefined') {
				self.renderCache = {};
			} else {
				delete self.renderCache[templateName];
			}
		},
	
		/**
		 * Determines whether or not to display the
		 * create item prompt, given a user input.
		 *
		 * @param {string} input
		 * @return {boolean}
		 */
		canCreate: function(input) {
			var self = this;
			if (!self.settings.create) return false;
			var filter = self.settings.createFilter;
			return input.length
				&& (typeof filter !== 'function' || filter.apply(self, [input]))
				&& (typeof filter !== 'string' || new RegExp(filter).test(input))
				&& (!(filter instanceof RegExp) || filter.test(input));
		}
	
	});
	
	
	Selectize.count = 0;
	Selectize.defaults = {
		options: [],
		optgroups: [],
	
		plugins: [],
		delimiter: ',',
		splitOn: null, // regexp or string for splitting up values from a paste command
		persist: true,
		diacritics: true,
		create: false,
		createOnBlur: false,
		createFilter: null,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		addPrecedence: false,
		selectOnTab: false,
		preload: false,
		allowEmptyOption: false,
		closeAfterSelect: false,
	
		scrollDuration: 60,
		loadThrottle: 300,
		loadingClass: 'loading',
	
		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		valueField: 'value',
		labelField: 'text',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		lockOptgroupOrder: false,
	
		sortField: '$order',
		searchField: ['text'],
		searchConjunction: 'and',
	
		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',
	
		dropdownParent: null,
	
		copyClassesToDropdown: true,
	
		/*
		load                 : null, // function(query, callback) { ... }
		score                : null, // function(search) { ... }
		onInitialize         : null, // function() { ... }
		onChange             : null, // function(value) { ... }
		onItemAdd            : null, // function(value, $item) { ... }
		onItemRemove         : null, // function(value) { ... }
		onClear              : null, // function() { ... }
		onOptionAdd          : null, // function(value, data) { ... }
		onOptionRemove       : null, // function(value) { ... }
		onOptionClear        : null, // function() { ... }
		onOptionGroupAdd     : null, // function(id, data) { ... }
		onOptionGroupRemove  : null, // function(id) { ... }
		onOptionGroupClear   : null, // function() { ... }
		onDropdownOpen       : null, // function($dropdown) { ... }
		onDropdownClose      : null, // function($dropdown) { ... }
		onType               : null, // function(str) { ... }
		onDelete             : null, // function(values) { ... }
		*/
	
		render: {
			/*
			item: null,
			optgroup: null,
			optgroup_header: null,
			option: null,
			option_create: null
			*/
		}
	};
	
	
	$.fn.selectize = function(settings_user) {
		var defaults             = $.fn.selectize.defaults;
		var settings             = $.extend({}, defaults, settings_user);
		var attr_data            = settings.dataAttr;
		var field_label          = settings.labelField;
		var field_value          = settings.valueField;
		var field_optgroup       = settings.optgroupField;
		var field_optgroup_label = settings.optgroupLabelField;
		var field_optgroup_value = settings.optgroupValueField;
	
		/**
		 * Initializes selectize from a <input type="text"> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_textbox = function($input, settings_element) {
			var i, n, values, option;
	
			var data_raw = $input.attr(attr_data);
	
			if (!data_raw) {
				var value = $.trim($input.val() || '');
				if (!settings.allowEmptyOption && !value.length) return;
				values = value.split(settings.delimiter);
				for (i = 0, n = values.length; i < n; i++) {
					option = {};
					option[field_label] = values[i];
					option[field_value] = values[i];
					settings_element.options.push(option);
				}
				settings_element.items = values;
			} else {
				settings_element.options = JSON.parse(data_raw);
				for (i = 0, n = settings_element.options.length; i < n; i++) {
					settings_element.items.push(settings_element.options[i][field_value]);
				}
			}
		};
	
		/**
		 * Initializes selectize from a <select> element.
		 *
		 * @param {object} $input
		 * @param {object} settings_element
		 */
		var init_select = function($input, settings_element) {
			var i, n, tagName, $children, order = 0;
			var options = settings_element.options;
			var optionsMap = {};
	
			var readData = function($el) {
				var data = attr_data && $el.attr(attr_data);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};
	
			var addOption = function($option, group) {
				$option = $($option);
	
				var value = hash_key($option.val());
				if (!value && !settings.allowEmptyOption) return;
	
				// if the option already exists, it's probably been
				// duplicated in another optgroup. in this case, push
				// the current group to the "optgroup" property on the
				// existing option so that it's rendered in both places.
				if (optionsMap.hasOwnProperty(value)) {
					if (group) {
						var arr = optionsMap[value][field_optgroup];
						if (!arr) {
							optionsMap[value][field_optgroup] = group;
						} else if (!$.isArray(arr)) {
							optionsMap[value][field_optgroup] = [arr, group];
						} else {
							arr.push(group);
						}
					}
					return;
				}
	
				var option             = readData($option) || {};
				option[field_label]    = option[field_label] || $option.text();
				option[field_value]    = option[field_value] || value;
				option[field_optgroup] = option[field_optgroup] || group;
	
				optionsMap[value] = option;
				options.push(option);
	
				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};
	
			var addGroup = function($optgroup) {
				var i, n, id, optgroup, $options;
	
				$optgroup = $($optgroup);
				id = $optgroup.attr('label');
	
				if (id) {
					optgroup = readData($optgroup) || {};
					optgroup[field_optgroup_label] = id;
					optgroup[field_optgroup_value] = id;
					settings_element.optgroups.push(optgroup);
				}
	
				$options = $('option', $optgroup);
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};
	
			settings_element.maxItems = $input.attr('multiple') ? null : 1;
	
			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};
	
		return this.each(function() {
			if (this.selectize) return;
	
			var instance;
			var $input = $(this);
			var tag_name = this.tagName.toLowerCase();
			var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
			if (!placeholder && !settings.allowEmptyOption) {
				placeholder = $input.children('option[value=""]').text();
			}
	
			var settings_element = {
				'placeholder' : placeholder,
				'options'     : [],
				'optgroups'   : [],
				'items'       : []
			};
	
			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}
	
			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings_user));
		});
	};
	
	$.fn.selectize.defaults = Selectize.defaults;
	$.fn.selectize.support = {
		validity: SUPPORTS_VALIDITY_API
	};
	
	
	Selectize.define('drag_drop', function(options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;
	
		self.lock = (function() {
			var original = self.lock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.disable();
				return original.apply(self, arguments);
			};
		})();
	
		self.unlock = (function() {
			var original = self.unlock;
			return function() {
				var sortable = self.$control.data('sortable');
				if (sortable) sortable.enable();
				return original.apply(self, arguments);
			};
		})();
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(this, arguments);
	
				var $control = self.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					disabled: self.isLocked,
					start: function(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({overflow: 'visible'});
					},
					stop: function() {
						$control.css({overflow: 'hidden'});
						var active = self.$activeItems ? self.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function() {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		})();
	
	});
	
	Selectize.define('dropdown_header', function(options) {
		var self = this;
	
		options = $.extend({
			title         : 'Untitled',
			headerClass   : 'selectize-dropdown-header',
			titleRowClass : 'selectize-dropdown-header-title',
			labelClass    : 'selectize-dropdown-header-label',
			closeClass    : 'selectize-dropdown-header-close',
	
			html: function(data) {
				return (
					'<div class="' + data.headerClass + '">' +
						'<div class="' + data.titleRowClass + '">' +
							'<span class="' + data.labelClass + '">' + data.title + '</span>' +
							'<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' +
						'</div>' +
					'</div>'
				);
			}
		}, options);
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		})();
	
	});
	
	Selectize.define('optgroup_columns', function(options) {
		var self = this;
	
		options = $.extend({
			equalizeWidth  : true,
			equalizeHeight : true
		}, options);
	
		this.getAdjacentOption = function($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, $option, $options, $optgroup;
	
				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);
	
					if(e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}
	
					$options = $optgroup.find('[data-selectable]');
					$option  = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}
	
				return original.apply(this, arguments);
			};
		})();
	
		var getScrollbarWidth = function() {
			var div;
			var width = getScrollbarWidth.width;
			var doc = document;
	
			if (typeof width === 'undefined') {
				div = doc.createElement('div');
				div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
				div = div.firstChild;
				doc.body.appendChild(div);
				width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
				doc.body.removeChild(div);
			}
			return width;
		};
	
		var equalizeSizes = function() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;
	
			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;
	
			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({height: height_max});
			}
	
			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth() - getScrollbarWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({width: width});
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({width: width_last});
				}
			}
		};
	
		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	
	
	});
	
	Selectize.define('remove_button', function(options) {
		options = $.extend({
				label     : '&times;',
				title     : 'Remove',
				className : 'remove',
				append    : true
			}, options);
	
			var singleClose = function(thisRef, options) {
	
				options.className = 'remove-single';
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					return html_container + html_element;
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var id = $(self.$input.context).attr('id');
							var selectizer = $('#'+id);
	
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							self.clear();
						});
	
					};
				})();
			};
	
			var multiClose = function(thisRef, options) {
	
				var self = thisRef;
				var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
				/**
				 * Appends an element as a child (with raw HTML).
				 *
				 * @param {string} html_container
				 * @param {string} html_element
				 * @return {string}
				 */
				var append = function(html_container, html_element) {
					var pos = html_container.search(/(<\/[^>]+>\s*)$/);
					return html_container.substring(0, pos) + html_element + html_container.substring(pos);
				};
	
				thisRef.setup = (function() {
					var original = self.setup;
					return function() {
						// override the item rendering method to add the button to each
						if (options.append) {
							var render_item = self.settings.render.item;
							self.settings.render.item = function(data) {
								return append(render_item.apply(thisRef, arguments), html);
							};
						}
	
						original.apply(thisRef, arguments);
	
						// add event listener
						thisRef.$control.on('click', '.' + options.className, function(e) {
							e.preventDefault();
							if (self.isLocked) return;
	
							var $item = $(e.currentTarget).parent();
							self.setActiveItem($item);
							if (self.deleteSelection()) {
								self.setCaret(self.items.length);
							}
						});
	
					};
				})();
			};
	
			if (this.settings.mode === 'single') {
				singleClose(this, options);
				return;
			} else {
				multiClose(this, options);
			}
	});
	
	
	Selectize.define('restore_on_backspace', function(options) {
		var self = this;
	
		options.text = options.text || function(option) {
			return option[this.settings.labelField];
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		})();
	});
	

	return Selectize;
}));

/***/ }),

/***/ "./node_modules/sifter/sifter.js":
/*!***************************************!*\
  !*** ./node_modules/sifter/sifter.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
}(this, function() {

	/**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
	var Sifter = function(items, settings) {
		this.items = items;
		this.settings = settings || {diacritics: true};
	};

	/**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
	Sifter.prototype.tokenize = function(query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string : words[i],
				regex  : new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
	Sifter.prototype.iterator = function(object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function(callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
	Sifter.prototype.getScoreFunction = function(search, options) {
		var self, fields, tokens, token_count, nesting;

		self        = this;
		search      = self.prepareSearch(search, options);
		tokens      = search.tokens;
		fields      = search.options.fields;
		token_count = tokens.length;
		nesting     = search.options.nesting;

		/**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
		var scoreValue = function(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
		var scoreObject = (function() {
			var field_count = fields.length;
			if (!field_count) {
				return function() { return 0; };
			}
			if (field_count === 1) {
				return function(token, data) {
					return scoreValue(getattr(data, fields[0], nesting), token);
				};
			}
			return function(token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(getattr(data, fields[i], nesting), token);
				}
				return sum / field_count;
			};
		})();

		if (!token_count) {
			return function() { return 0; };
		}
		if (token_count === 1) {
			return function(data) {
				return scoreObject(tokens[0], data);
			};
		}

		if (search.options.conjunction === 'and') {
			return function(data) {
				var score;
				for (var i = 0, sum = 0; i < token_count; i++) {
					score = scoreObject(tokens[i], data);
					if (score <= 0) return 0;
					sum += score;
				}
				return sum / token_count;
			};
		} else {
			return function(data) {
				for (var i = 0, sum = 0; i < token_count; i++) {
					sum += scoreObject(tokens[i], data);
				}
				return sum / token_count;
			};
		}
	};

	/**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
	Sifter.prototype.getSortFunction = function(search, options) {
		var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;

		self   = this;
		search = self.prepareSearch(search, options);
		sort   = (!search.query && options.sort_empty) || options.sort;

		/**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
		get_field = function(name, result) {
			if (name === '$score') return result.score;
			return getattr(self.items[result.id], name, options.nesting);
		};

		// parse options
		fields = [];
		if (sort) {
			for (i = 0, n = sort.length; i < n; i++) {
				if (search.query || sort[i].field !== '$score') {
					fields.push(sort[i]);
				}
			}
		}

		// the "$score" field is implied to be the primary
		// sort field, unless it's manually specified
		if (search.query) {
			implicit_score = true;
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					implicit_score = false;
					break;
				}
			}
			if (implicit_score) {
				fields.unshift({field: '$score', direction: 'desc'});
			}
		} else {
			for (i = 0, n = fields.length; i < n; i++) {
				if (fields[i].field === '$score') {
					fields.splice(i, 1);
					break;
				}
			}
		}

		multipliers = [];
		for (i = 0, n = fields.length; i < n; i++) {
			multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
		}

		// build function
		fields_count = fields.length;
		if (!fields_count) {
			return null;
		} else if (fields_count === 1) {
			field = fields[0].field;
			multiplier = multipliers[0];
			return function(a, b) {
				return multiplier * cmp(
					get_field(field, a),
					get_field(field, b)
				);
			};
		} else {
			return function(a, b) {
				var i, result, a_value, b_value, field;
				for (i = 0; i < fields_count; i++) {
					field = fields[i].field;
					result = multipliers[i] * cmp(
						get_field(field, a),
						get_field(field, b)
					);
					if (result) return result;
				}
				return 0;
			};
		}
	};

	/**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.prepareSearch = function(query, options) {
		if (typeof query === 'object') return query;

		options = extend({}, options);

		var option_fields     = options.fields;
		var option_sort       = options.sort;
		var option_sort_empty = options.sort_empty;

		if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
		if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
		if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

		return {
			options : options,
			query   : String(query || '').toLowerCase(),
			tokens  : this.tokenize(query),
			total   : 0,
			items   : []
		};
	};

	/**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.search = function(query, options) {
		var self = this, value, score, search, calculateScore;
		var fn_sort;
		var fn_score;

		search  = this.prepareSearch(query, options);
		options = search.options;
		query   = search.query;

		// generate result scoring function
		fn_score = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function(item, id) {
				score = fn_score(item);
				if (options.filter === false || score > 0) {
					search.items.push({'score': score, 'id': id});
				}
			});
		} else {
			self.iterator(self.items, function(item, id) {
				search.items.push({'score': 1, 'id': id});
			});
		}

		fn_sort = self.getSortFunction(search, options);
		if (fn_sort) search.items.sort(fn_sort);

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
		a = asciifold(String(a || ''));
		b = asciifold(String(b || ''));
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	/**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @param  {Boolean} nesting Handle nesting or not
	 * @return {Object}          The resolved property value
	 */
	var getattr = function(obj, name, nesting) {
	    if (!obj || !name) return;
	    if (!nesting) return obj[name];
	    var names = name.split(".");
	    while(names.length && (obj = obj[names.shift()]));
	    return obj;
	};

	var trim = function(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || (typeof $ !== 'undefined' && $.isArray) || function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
		'b': '[b␢βΒB฿𐌁ᛒ]',
		'c': '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
		'd': '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
		'e': '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
		'f': '[fƑƒḞḟ]',
		'g': '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
		'h': '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
		'i': '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
		'j': '[jȷĴĵɈɉʝɟʲ]',
		'k': '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
		'l': '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
		'n': '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
		'o': '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
		'p': '[pṔṕṖṗⱣᵽƤƥᵱ]',
		'q': '[qꝖꝗʠɊɋꝘꝙq̃]',
		'r': '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
		's': '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
		't': '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
		'u': '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
		'v': '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
		'w': '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
		'x': '[xẌẍẊẋχ]',
		'y': '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
		'z': '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]'
	};

	var asciifold = (function() {
		var i, n, k, chunk;
		var foreignletters = '';
		var lookup = {};
		for (k in DIACRITICS) {
			if (DIACRITICS.hasOwnProperty(k)) {
				chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
				foreignletters += chunk;
				for (i = 0, n = chunk.length; i < n; i++) {
					lookup[chunk.charAt(i)] = k;
				}
			}
		}
		var regexp = new RegExp('[' +  foreignletters + ']', 'g');
		return function(str) {
			return str.replace(regexp, function(foreignletter) {
				return lookup[foreignletter];
			}).toLowerCase();
		};
	})();


	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;
}));


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./node_modules/social-share-button.js/dist/social-share.min.js":
/*!**********************************************************************!*\
  !*** ./node_modules/social-share-button.js/dist/social-share.min.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e(__webpack_require__(/*! jQuery */ "jquery")):"function"==typeof define&&define.amd?define(["jQuery"],e):"object"==typeof exports?exports.SocialShare=e(require("jQuery")):t.SocialShare=e(t.jQuery)}(this,function(t){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=48)}([function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){"use strict";e.__esModule=!0;var r=n(49),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}()},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(15),o=n(35),u=n(20),i=Object.defineProperty;e.f=n(5)?Object.defineProperty:function(t,e,n){if(r(t),e=u(e,!0),r(n),o)try{return i(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){t.exports=!n(17)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){t.exports={default:n(55),__esModule:!0}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){"use strict";e.__esModule=!0;var r=n(40),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==(void 0===e?"undefined":(0,o.default)(e))&&"function"!=typeof e?t:e}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(83),u=r(o),i=n(87),f=r(i),c=n(40),a=r(c);e.default=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,a.default)(e)));t.prototype=(0,f.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(u.default?(0,u.default)(t,e):t.__proto__=e)}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),u=r(o),i=n(1),f=r(i),c=n(37),a=r(c),s=n(90),l=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(s),p=function(){function t(e){(0,u.default)(this,t),this.options=a.default.extend({width:575,height:400,iconClass:"social-share-icon social-share-icon-"+this.getName()},e),this.element=this._createDomNode()}return(0,f.default)(t,[{key:"getName",value:function(){return"provider"}},{key:"getElement",value:function(){return this.element}},{key:"_createDomNode",value:function(){var t='<a href="javascript:void(0)" class="'+this.options.iconClass+'"></a>',e=(0,a.default)(t);return this._bindEvents(e),e}},{key:"_createUrl",value:function(){var t=this;return this._getUrlTemplate().replace(/\{(\w+)\}/g,function(e){var n=e.slice(1,-1);return void 0!==t.options[n]?t.options[n]:""})}},{key:"_getUrlTemplate",value:function(){return""}},{key:"_bindEvents",value:function(t){var e=this;t.on("click",function(){l.openWin(e._createUrl(),e.options.width,e.options.height).focus()})}}]),t}();e.default=p},function(t,e,n){var r=n(2),o=n(3),u=n(34),i=n(12),f=function(t,e,n){var c,a,s,l=t&f.F,p=t&f.G,d=t&f.S,v=t&f.P,y=t&f.B,h=t&f.W,_=p?o:o[e]||(o[e]={}),m=_.prototype,b=p?r:d?r[e]:(r[e]||{}).prototype;p&&(n=e);for(c in n)(a=!l&&b&&void 0!==b[c])&&c in _||(s=a?b[c]:n[c],_[c]=p&&"function"!=typeof b[c]?n[c]:y&&a?u(s,r):h&&b[c]==s?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(s):v&&"function"==typeof s?u(Function.call,s):s,v&&((_.virtual||(_.virtual={}))[c]=s,t&f.R&&m&&!m[c]&&i(m,c,s)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},function(t,e,n){var r=n(4),o=n(18);t.exports=n(5)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(64),o=n(21);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(23)("wks"),o=n(19),u=n(2).Symbol,i="function"==typeof u;(t.exports=function(t){return r[t]||(r[t]=i&&u[t]||(i?u:o)("Symbol."+t))}).store=r},function(t,e,n){var r=n(16);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e,n){var r=n(16);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var r=n(23)("keys"),o=n(19);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e,n){var r=n(2),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports=!0},function(t,e){t.exports={}},function(t,e,n){var r=n(15),o=n(63),u=n(29),i=n(22)("IE_PROTO"),f=function(){},c=function(){var t,e=n(36)("iframe"),r=u.length;for(e.style.display="none",n(68).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),c=t.F;r--;)delete c.prototype[u[r]];return c()};t.exports=Object.create||function(t,e){var n;return null!==t?(f.prototype=r(t),n=new f,f.prototype=null,n[i]=t):n=c(),void 0===e?n:o(n,e)}},function(t,e,n){var r=n(43),o=n(29);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(4).f,o=n(7),u=n(14)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,u)&&r(t,u,{configurable:!0,value:e})}},function(t,e,n){e.f=n(14)},function(t,e,n){var r=n(2),o=n(3),u=n(25),i=n(31),f=n(4).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=u?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||f(e,t,{value:i.f(t)})}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var r=n(52);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e,n){t.exports=!n(5)&&!n(17)(function(){return 7!=Object.defineProperty(n(36)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(16),o=n(2).document,u=r(o)&&r(o.createElement);t.exports=function(t){return u?o.createElement(t):{}}},function(e,n){e.exports=t},function(t,e,n){var r=n(21);t.exports=function(t){return Object(r(t))}},function(t,e,n){var r=n(7),o=n(38),u=n(22)("IE_PROTO"),i=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,u)?t[u]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?i:null}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var o=n(58),u=r(o),i=n(73),f=r(i),c="function"==typeof f.default&&"symbol"==typeof u.default?function(t){return typeof t}:function(t){return t&&"function"==typeof f.default&&t.constructor===f.default&&t!==f.default.prototype?"symbol":typeof t};e.default="function"==typeof f.default&&"symbol"===c(u.default)?function(t){return void 0===t?"undefined":c(t)}:function(t){return t&&"function"==typeof f.default&&t.constructor===f.default&&t!==f.default.prototype?"symbol":void 0===t?"undefined":c(t)}},function(t,e,n){"use strict";var r=n(25),o=n(11),u=n(42),i=n(12),f=n(7),c=n(26),a=n(62),s=n(30),l=n(39),p=n(14)("iterator"),d=!([].keys&&"next"in[].keys()),v=function(){return this};t.exports=function(t,e,n,y,h,_,m){a(n,e,y);var b,g,O,x=function(t){if(!d&&t in M)return M[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==h,j=!1,M=t.prototype,P=M[p]||M["@@iterator"]||h&&M[h],k=P||x(h),E=h?S?x("entries"):k:void 0,T="Array"==e?M.entries||P:P;if(T&&(O=l(T.call(new t)))!==Object.prototype&&O.next&&(s(O,w,!0),r||f(O,p)||i(O,p,v)),S&&P&&"values"!==P.name&&(j=!0,k=function(){return P.call(this)}),r&&!m||!d&&!j&&M[p]||i(M,p,k),c[e]=k,c[w]=v,h)if(b={values:S?k:x("values"),keys:_?k:x("keys"),entries:E},m)for(g in b)g in M||u(M,g,b[g]);else o(o.P+o.F*(d||j),e,b);return b}},function(t,e,n){t.exports=n(12)},function(t,e,n){var r=n(7),o=n(13),u=n(65)(!1),i=n(22)("IE_PROTO");t.exports=function(t,e){var n,f=o(t),c=0,a=[];for(n in f)n!=i&&r(f,n)&&a.push(n);for(;e.length>c;)r(f,n=e[c++])&&(~u(a,n)||a.push(n));return a}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var r=n(43),o=n(29).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,e,n){var r=n(33),o=n(18),u=n(13),i=n(20),f=n(7),c=n(35),a=Object.getOwnPropertyDescriptor;e.f=n(5)?a:function(t,e){if(t=u(t),e=i(e,!0),c)try{return a(t,e)}catch(t){}if(f(t,e))return o(!r.f.call(t,e),t[e])}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(0),u=r(o),i=n(1),f=r(i);n(53);var c=n(37),a=r(c),s=n(54),l=r(s),p=n(91),d=r(p),v=n(92),y=r(v),h=n(93),_=r(h),m=n(94),b=r(m),g=n(95),O=r(g),x=n(96),w=r(x),S=function(){function t(e,n){(0,u.default)(this,t),this.container=(0,a.default)(e),this.providerClassMap={baidu:l.default,weibo:d.default,qq:y.default,qzone:_.default,douban:b.default,facebook:O.default,twitter:w.default},this.options=this._resolveOptions(n),this._resolveContainerClass(),this.providers=this._createProviders();for(var r in this.providers)this.container.append(this.providers[r].getElement())}return(0,f.default)(t,[{key:"getProvider",value:function(t){return void 0===this.providers[t]?null:this.providers[t]}},{key:"_createProviders",value:function(){var t={};for(var e in this.options)if(void 0!==this.providerClassMap[e]&&!1!==this.options[e]){var n=this._mergeProviderOptions(this.options[e]);t[e]=new this.providerClassMap[e](n)}return t}},{key:"_resolveOptions",value:function(t){return t=a.default.extend({theme:"default",weibo:!0,qq:!0,qzone:!0,baidu:!0,douban:!0,facebook:!0,twitter:!0},t),void 0===t.title&&(t.title=document.title),void 0===t.url&&(t.url=location.href),void 0===t.summary&&(t.summary=t.title),t}},{key:"_resolveContainerClass",value:function(){var t="social-share-button";this.options.theme&&(t+=" social-share-button-"+this.options.theme),this.container.addClass(t)}},{key:"_mergeProviderOptions",value:function(t){return!0===t&&(t={}),t.title||(t.title=this.options.title),t.url||(t.url=this.options.url),!t.image&&this.options.image&&(t.image=this.options.image),t.summary||(t.summary=this.options.summary),t.image&&(t.image=encodeURIComponent(t.image)),t.url=encodeURIComponent(t.url),t}}]),t}();t.exports=S},function(t,e,n){t.exports={default:n(50),__esModule:!0}},function(t,e,n){n(51);var r=n(3).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(11);r(r.S+r.F*!n(5),"Object",{defineProperty:n(4).f})},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(t){return(0,f.default)(this,e),t.desc||(t.desc=t.summary),t.comment||(t.comment=t.summary),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).call(this,t))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"tieba"}},{key:"_getUrlTemplate",value:function(){return"http://tieba.baidu.com/f/commit/share/openShareApi?url={url}&title={title}&desc={desc}&comment={comment}"}}]),e}(y.default);e.default=h},function(t,e,n){n(56),t.exports=n(3).Object.getPrototypeOf},function(t,e,n){var r=n(38),o=n(39);n(57)("getPrototypeOf",function(){return function(t){return o(r(t))}})},function(t,e,n){var r=n(11),o=n(3),u=n(17);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],i={};i[t]=e(n),r(r.S+r.F*u(function(){n(1)}),"Object",i)}},function(t,e,n){t.exports={default:n(59),__esModule:!0}},function(t,e,n){n(60),n(69),t.exports=n(31).f("iterator")},function(t,e,n){"use strict";var r=n(61)(!0);n(41)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){var r=n(24),o=n(21);t.exports=function(t){return function(e,n){var u,i,f=String(o(e)),c=r(n),a=f.length;return c<0||c>=a?t?"":void 0:(u=f.charCodeAt(c),u<55296||u>56319||c+1===a||(i=f.charCodeAt(c+1))<56320||i>57343?t?f.charAt(c):u:t?f.slice(c,c+2):i-56320+(u-55296<<10)+65536)}}},function(t,e,n){"use strict";var r=n(27),o=n(18),u=n(30),i={};n(12)(i,n(14)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(i,{next:o(1,n)}),u(t,e+" Iterator")}},function(t,e,n){var r=n(4),o=n(15),u=n(28);t.exports=n(5)?Object.defineProperties:function(t,e){o(t);for(var n,i=u(e),f=i.length,c=0;f>c;)r.f(t,n=i[c++],e[n]);return t}},function(t,e,n){var r=n(44);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e,n){var r=n(13),o=n(66),u=n(67);t.exports=function(t){return function(e,n,i){var f,c=r(e),a=o(c.length),s=u(i,a);if(t&&n!=n){for(;a>s;)if((f=c[s++])!=f)return!0}else for(;a>s;s++)if((t||s in c)&&c[s]===n)return t||s||0;return!t&&-1}}},function(t,e,n){var r=n(24),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e,n){var r=n(24),o=Math.max,u=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):u(t,e)}},function(t,e,n){var r=n(2).document;t.exports=r&&r.documentElement},function(t,e,n){n(70);for(var r=n(2),o=n(12),u=n(26),i=n(14)("toStringTag"),f="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),c=0;c<f.length;c++){var a=f[c],s=r[a],l=s&&s.prototype;l&&!l[i]&&o(l,i,a),u[a]=u.Array}},function(t,e,n){"use strict";var r=n(71),o=n(72),u=n(26),i=n(13);t.exports=n(41)(Array,"Array",function(t,e){this._t=i(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),u.Arguments=u.Array,r("keys"),r("values"),r("entries")},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){t.exports={default:n(74),__esModule:!0}},function(t,e,n){n(75),n(80),n(81),n(82),t.exports=n(3).Symbol},function(t,e,n){"use strict";var r=n(2),o=n(7),u=n(5),i=n(11),f=n(42),c=n(76).KEY,a=n(17),s=n(23),l=n(30),p=n(19),d=n(14),v=n(31),y=n(32),h=n(77),_=n(78),m=n(15),b=n(13),g=n(20),O=n(18),x=n(27),w=n(79),S=n(47),j=n(4),M=n(28),P=S.f,k=j.f,E=w.f,T=r.Symbol,L=r.JSON,C=L&&L.stringify,N=d("_hidden"),q=d("toPrimitive"),A={}.propertyIsEnumerable,F=s("symbol-registry"),I=s("symbols"),U=s("op-symbols"),R=Object.prototype,D="function"==typeof T,z=r.QObject,G=!z||!z.prototype||!z.prototype.findChild,W=u&&a(function(){return 7!=x(k({},"a",{get:function(){return k(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=P(R,e);r&&delete R[e],k(t,e,n),r&&t!==R&&k(R,e,r)}:k,V=function(t){var e=I[t]=x(T.prototype);return e._k=t,e},H=D&&"symbol"==typeof T.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof T},Q=function(t,e,n){return t===R&&Q(U,e,n),m(t),e=g(e,!0),m(n),o(I,e)?(n.enumerable?(o(t,N)&&t[N][e]&&(t[N][e]=!1),n=x(n,{enumerable:O(0,!1)})):(o(t,N)||k(t,N,O(1,{})),t[N][e]=!0),W(t,e,n)):k(t,e,n)},J=function(t,e){m(t);for(var n,r=h(e=b(e)),o=0,u=r.length;u>o;)Q(t,n=r[o++],e[n]);return t},K=function(t,e){return void 0===e?x(t):J(x(t),e)},B=function(t){var e=A.call(this,t=g(t,!0));return!(this===R&&o(I,t)&&!o(U,t))&&(!(e||!o(this,t)||!o(I,t)||o(this,N)&&this[N][t])||e)},Y=function(t,e){if(t=b(t),e=g(e,!0),t!==R||!o(I,e)||o(U,e)){var n=P(t,e);return!n||!o(I,e)||o(t,N)&&t[N][e]||(n.enumerable=!0),n}},X=function(t){for(var e,n=E(b(t)),r=[],u=0;n.length>u;)o(I,e=n[u++])||e==N||e==c||r.push(e);return r},Z=function(t){for(var e,n=t===R,r=E(n?U:b(t)),u=[],i=0;r.length>i;)!o(I,e=r[i++])||n&&!o(R,e)||u.push(I[e]);return u};D||(T=function(){if(this instanceof T)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===R&&e.call(U,n),o(this,N)&&o(this[N],t)&&(this[N][t]=!1),W(this,t,O(1,n))};return u&&G&&W(R,t,{configurable:!0,set:e}),V(t)},f(T.prototype,"toString",function(){return this._k}),S.f=Y,j.f=Q,n(46).f=w.f=X,n(33).f=B,n(45).f=Z,u&&!n(25)&&f(R,"propertyIsEnumerable",B,!0),v.f=function(t){return V(d(t))}),i(i.G+i.W+i.F*!D,{Symbol:T});for(var $="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),tt=0;$.length>tt;)d($[tt++]);for(var et=M(d.store),nt=0;et.length>nt;)y(et[nt++]);i(i.S+i.F*!D,"Symbol",{for:function(t){return o(F,t+="")?F[t]:F[t]=T(t)},keyFor:function(t){if(!H(t))throw TypeError(t+" is not a symbol!");for(var e in F)if(F[e]===t)return e},useSetter:function(){G=!0},useSimple:function(){G=!1}}),i(i.S+i.F*!D,"Object",{create:K,defineProperty:Q,defineProperties:J,getOwnPropertyDescriptor:Y,getOwnPropertyNames:X,getOwnPropertySymbols:Z}),L&&i(i.S+i.F*(!D||a(function(){var t=T();return"[null]"!=C([t])||"{}"!=C({a:t})||"{}"!=C(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!H(t)){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);return e=r[1],"function"==typeof e&&(n=e),!n&&_(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!H(e))return e}),r[1]=e,C.apply(L,r)}}}),T.prototype[q]||n(12)(T.prototype,q,T.prototype.valueOf),l(T,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,e,n){var r=n(19)("meta"),o=n(16),u=n(7),i=n(4).f,f=0,c=Object.isExtensible||function(){return!0},a=!n(17)(function(){return c(Object.preventExtensions({}))}),s=function(t){i(t,r,{value:{i:"O"+ ++f,w:{}}})},l=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!u(t,r)){if(!c(t))return"F";if(!e)return"E";s(t)}return t[r].i},p=function(t,e){if(!u(t,r)){if(!c(t))return!0;if(!e)return!1;s(t)}return t[r].w},d=function(t){return a&&v.NEED&&c(t)&&!u(t,r)&&s(t),t},v=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:d}},function(t,e,n){var r=n(28),o=n(45),u=n(33);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var i,f=n(t),c=u.f,a=0;f.length>a;)c.call(t,i=f[a++])&&e.push(i);return e}},function(t,e,n){var r=n(44);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(13),o=n(46).f,u={}.toString,i="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],f=function(t){try{return o(t)}catch(t){return i.slice()}};t.exports.f=function(t){return i&&"[object Window]"==u.call(t)?f(t):o(r(t))}},function(t,e){},function(t,e,n){n(32)("asyncIterator")},function(t,e,n){n(32)("observable")},function(t,e,n){t.exports={default:n(84),__esModule:!0}},function(t,e,n){n(85),t.exports=n(3).Object.setPrototypeOf},function(t,e,n){var r=n(11);r(r.S,"Object",{setPrototypeOf:n(86).set})},function(t,e,n){var r=n(16),o=n(15),u=function(t,e){if(o(t),!r(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,r){try{r=n(34)(Function.call,n(47).f(Object.prototype,"__proto__").set,2),r(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return u(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:u}},function(t,e,n){t.exports={default:n(88),__esModule:!0}},function(t,e,n){n(89);var r=n(3).Object;t.exports=function(t,e){return r.create(t,e)}},function(t,e,n){var r=n(11);r(r.S,"Object",{create:n(27)})},function(t,e,n){"use strict";function r(t,e,n){var r=void 0,o=void 0,u=void 0,i=void 0;return e&&n?(o=document.documentElement.clientWidth/2-e/2,u=(document.documentElement.clientHeight-n)/2,i="status=1,resizable=yes,width="+e+",height="+n+",top="+u+",left="+o,r=window.open(t,"",i)):r=window.open(t),r}Object.defineProperty(e,"__esModule",{value:!0}),e.openWin=r},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(){return(0,f.default)(this,e),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).apply(this,arguments))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"weibo"}},{key:"_getUrlTemplate",value:function(){return"http://service.weibo.com/share/share.php?url={url}&appkey={appKey}&title={title}&pic={image}&searchPic=true"}}]),e}(y.default);e.default=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(t){return(0,f.default)(this,e),t.desc||(t.desc=t.summary),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).call(this,t))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"qq"}},{key:"_getUrlTemplate",value:function(){return"http://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}&source={source}&desc={desc}&pics={image}"}}]),e}(y.default);e.default=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(t){return(0,f.default)(this,e),t.desc||(t.desc=t.summary),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).call(this,t))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"qzone"}},{key:"_getUrlTemplate",value:function(){return"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&desc={desc}&summary={summary}&site={site}"}}]),e}(y.default);e.default=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(){return(0,f.default)(this,e),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).apply(this,arguments))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"douban"}},{key:"_getUrlTemplate",value:function(){return"https://www.douban.com/share/service?name={title}&href={url}&image={image}&url={url}&title={title}"}}]),e}(y.default);e.default=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(){return(0,f.default)(this,e),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).apply(this,arguments))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"facebook"}},{key:"_getUrlTemplate",value:function(){return"https://www.facebook.com/sharer.php?s=100&p[url]={url}&p[images][0]={image}&p[title]={title}&p[summary]={summary}"}}]),e}(y.default);e.default=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),u=r(o),i=n(0),f=r(i),c=n(1),a=r(c),s=n(8),l=r(s),p=n(9),d=r(p),v=n(10),y=r(v),h=function(t){function e(){return(0,f.default)(this,e),(0,l.default)(this,(e.__proto__||(0,u.default)(e)).apply(this,arguments))}return(0,d.default)(e,t),(0,a.default)(e,[{key:"getName",value:function(){return"twitter"}},{key:"_getUrlTemplate",value:function(){return"https://twitter.com/intent/tweet?url={url}&text={title}&via={via}&hashtags={hashtags}"}}]),e}(y.default);e.default=h}])});
//# sourceMappingURL=social-share.min.js.map

/***/ }),

/***/ "./node_modules/store/dist/store.legacy.js":
/*!*************************************************!*\
  !*** ./node_modules/store/dist/store.legacy.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var engine = __webpack_require__(/*! ../src/store-engine */ "./node_modules/store/src/store-engine.js")

var storages = __webpack_require__(/*! ../storages/all */ "./node_modules/store/storages/all.js")
var plugins = [__webpack_require__(/*! ../plugins/json2 */ "./node_modules/store/plugins/json2.js")]

module.exports = engine.createStore(storages, plugins)


/***/ }),

/***/ "./node_modules/store/plugins/json2.js":
/*!*********************************************!*\
  !*** ./node_modules/store/plugins/json2.js ***!
  \*********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = json2Plugin

function json2Plugin() {
	__webpack_require__(/*! ./lib/json2 */ "./node_modules/store/plugins/lib/json2.js")
	return {}
}


/***/ }),

/***/ "./node_modules/store/plugins/lib/json2.js":
/*!*************************************************!*\
  !*** ./node_modules/store/plugins/lib/json2.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* eslint-disable */

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + "-" +
                        f(this.getUTCMonth() + 1) + "-" +
                        f(this.getUTCDate()) + "T" +
                        f(this.getUTCHours()) + ":" +
                        f(this.getUTCMinutes()) + ":" +
                        f(this.getUTCSeconds()) + "Z"
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
                typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value)
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                    (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" +
                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());

/***/ }),

/***/ "./node_modules/store/src/store-engine.js":
/*!************************************************!*\
  !*** ./node_modules/store/src/store-engine.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(/*! ./util */ "./node_modules/store/src/util.js")
var slice = util.slice
var pluck = util.pluck
var each = util.each
var bind = util.bind
var create = util.create
var isList = util.isList
var isFunction = util.isFunction
var isObject = util.isObject

module.exports = {
	createStore: createStore
}

var storeAPI = {
	version: '2.0.12',
	enabled: false,
	
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var data = this.storage.read(this._namespacePrefix + key)
		return this._deserialize(data, optionalDefaultValue)
	},

	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		this.storage.write(this._namespacePrefix + key, this._serialize(value))
		return value
	},

	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		this.storage.remove(this._namespacePrefix + key)
	},

	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this.storage.each(function(val, namespacedKey) {
			callback.call(self, self._deserialize(val), (namespacedKey || '').replace(self._namespaceRegexp, ''))
		})
	},

	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this.storage.clearAll()
	},

	// additional functionality that can't live in plugins
	// ---------------------------------------------------

	// hasNamespace returns true if this store instance has the given namespace.
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},

	// createStore creates a store.js instance with the first
	// functioning storage in the list of storage candidates,
	// and applies the the given mixins to the instance.
	createStore: function() {
		return createStore.apply(this, arguments)
	},
	
	addPlugin: function(plugin) {
		this._addPlugin(plugin)
	},
	
	namespace: function(namespace) {
		return createStore(this.storage, this.plugins, namespace)
	}
}

function _warn() {
	var _console = (typeof console == 'undefined' ? null : console)
	if (!_console) { return }
	var fn = (_console.warn ? _console.warn : _console.log)
	fn.apply(_console, arguments)
}

function createStore(storages, plugins, namespace) {
	if (!namespace) {
		namespace = ''
	}
	if (storages && !isList(storages)) {
		storages = [storages]
	}
	if (plugins && !isList(plugins)) {
		plugins = [plugins]
	}

	var namespacePrefix = (namespace ? '__storejs_'+namespace+'_' : '')
	var namespaceRegexp = (namespace ? new RegExp('^'+namespacePrefix) : null)
	var legalNamespaces = /^[a-zA-Z0-9_\-]*$/ // alpha-numeric + underscore and dash
	if (!legalNamespaces.test(namespace)) {
		throw new Error('store.js namespaces can only have alphanumerics + underscores and dashes')
	}
	
	var _privateStoreProps = {
		_namespacePrefix: namespacePrefix,
		_namespaceRegexp: namespaceRegexp,

		_testStorage: function(storage) {
			try {
				var testStr = '__storejs__test__'
				storage.write(testStr, testStr)
				var ok = (storage.read(testStr) === testStr)
				storage.remove(testStr)
				return ok
			} catch(e) {
				return false
			}
		},

		_assignPluginFnProp: function(pluginFnProp, propName) {
			var oldFn = this[propName]
			this[propName] = function pluginFn() {
				var args = slice(arguments, 0)
				var self = this

				// super_fn calls the old function which was overwritten by
				// this mixin.
				function super_fn() {
					if (!oldFn) { return }
					each(arguments, function(arg, i) {
						args[i] = arg
					})
					return oldFn.apply(self, args)
				}

				// Give mixing function access to super_fn by prefixing all mixin function
				// arguments with super_fn.
				var newFnArgs = [super_fn].concat(args)

				return pluginFnProp.apply(self, newFnArgs)
			}
		},

		_serialize: function(obj) {
			return JSON.stringify(obj)
		},

		_deserialize: function(strVal, defaultVal) {
			if (!strVal) { return defaultVal }
			// It is possible that a raw string value has been previously stored
			// in a storage without using store.js, meaning it will be a raw
			// string value instead of a JSON serialized string. By defaulting
			// to the raw string value in case of a JSON parse error, we allow
			// for past stored values to be forwards-compatible with store.js
			var val = ''
			try { val = JSON.parse(strVal) }
			catch(e) { val = strVal }

			return (val !== undefined ? val : defaultVal)
		},
		
		_addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this.storage = storage
				this.enabled = true
			}
		},

		_addPlugin: function(plugin) {
			var self = this

			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self._addPlugin(plugin)
				})
				return
			}

			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this.plugins, function(seenPlugin) {
				return (plugin === seenPlugin)
			})
			if (seenPlugin) {
				return
			}
			this.plugins.push(plugin)

			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}

			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}

			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
		
		// Put deprecated properties in the private API, so as to not expose it to accidential
		// discovery through inspection of the store object.
		
		// Deprecated: addStorage
		addStorage: function(storage) {
			_warn('store.addStorage(storage) is deprecated. Use createStore([storages])')
			this._addStorage(storage)
		}
	}

	var store = create(_privateStoreProps, storeAPI, {
		plugins: []
	})
	store.raw = {}
	each(store, function(prop, propName) {
		if (isFunction(prop)) {
			store.raw[propName] = bind(store, prop)			
		}
	})
	each(storages, function(storage) {
		store._addStorage(storage)
	})
	each(plugins, function(plugin) {
		store._addPlugin(plugin)
	})
	return store
}


/***/ }),

/***/ "./node_modules/store/src/util.js":
/*!****************************************!*\
  !*** ./node_modules/store/src/util.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var assign = make_assign()
var create = make_create()
var trim = make_trim()
var Global = (typeof window !== 'undefined' ? window : global)

module.exports = {
	assign: assign,
	create: create,
	trim: trim,
	bind: bind,
	slice: slice,
	each: each,
	map: map,
	pluck: pluck,
	isList: isList,
	isFunction: isFunction,
	isObject: isObject,
	Global: Global
}

function make_assign() {
	if (Object.assign) {
		return Object.assign
	} else {
		return function shimAssign(obj, props1, props2, etc) {
			for (var i = 1; i < arguments.length; i++) {
				each(Object(arguments[i]), function(val, key) {
					obj[key] = val
				})
			}			
			return obj
		}
	}
}

function make_create() {
	if (Object.create) {
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
		}
	} else {
		function F() {} // eslint-disable-line no-inner-declarations
		return function create(obj, assignProps1, assignProps2, etc) {
			var assignArgsList = slice(arguments, 1)
			F.prototype = obj
			return assign.apply(this, [new F()].concat(assignArgsList))
		}
	}
}

function make_trim() {
	if (String.prototype.trim) {
		return function trim(str) {
			return String.prototype.trim.call(str)
		}
	} else {
		return function trim(str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
		}
	}
}

function bind(obj, fn) {
	return function() {
		return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
	}
}

function slice(arr, index) {
	return Array.prototype.slice.call(arr, index || 0)
}

function each(obj, fn) {
	pluck(obj, function(val, key) {
		fn(val, key)
		return false
	})
}

function map(obj, fn) {
	var res = (isList(obj) ? [] : {})
	pluck(obj, function(v, k) {
		res[k] = fn(v, k)
		return false
	})
	return res
}

function pluck(obj, fn) {
	if (isList(obj)) {
		for (var i=0; i<obj.length; i++) {
			if (fn(obj[i], i)) {
				return obj[i]
			}
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn(obj[key], key)) {
					return obj[key]
				}
			}
		}
	}
}

function isList(val) {
	return (val != null && typeof val != 'function' && typeof val.length == 'number')
}

function isFunction(val) {
	return val && {}.toString.call(val) === '[object Function]'
}

function isObject(val) {
	return val && {}.toString.call(val) === '[object Object]'
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/store/storages/all.js":
/*!********************************************!*\
  !*** ./node_modules/store/storages/all.js ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
	// Listed in order of usage preference
	__webpack_require__(/*! ./localStorage */ "./node_modules/store/storages/localStorage.js"),
	__webpack_require__(/*! ./oldFF-globalStorage */ "./node_modules/store/storages/oldFF-globalStorage.js"),
	__webpack_require__(/*! ./oldIE-userDataStorage */ "./node_modules/store/storages/oldIE-userDataStorage.js"),
	__webpack_require__(/*! ./cookieStorage */ "./node_modules/store/storages/cookieStorage.js"),
	__webpack_require__(/*! ./sessionStorage */ "./node_modules/store/storages/sessionStorage.js"),
	__webpack_require__(/*! ./memoryStorage */ "./node_modules/store/storages/memoryStorage.js")
]


/***/ }),

/***/ "./node_modules/store/storages/cookieStorage.js":
/*!******************************************************!*\
  !*** ./node_modules/store/storages/cookieStorage.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// cookieStorage is useful Safari private browser mode, where localStorage
// doesn't work but cookies do. This implementation is adopted from
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global
var trim = util.trim

module.exports = {
	name: 'cookieStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var doc = Global.document

function read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" +
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}

function each(callback) {
	var cookies = doc.cookie.split(/; ?/g)
	for (var i = cookies.length - 1; i >= 0; i--) {
		if (!trim(cookies[i])) {
			continue
		}
		var kvp = cookies[i].split('=')
		var key = unescape(kvp[0])
		var val = unescape(kvp[1])
		callback(val, key)
	}
}

function write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function clearAll() {
	each(function(_, key) {
		remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}


/***/ }),

/***/ "./node_modules/store/storages/localStorage.js":
/*!*****************************************************!*\
  !*** ./node_modules/store/storages/localStorage.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

function localStorage() {
	return Global.localStorage
}

function read(key) {
	return localStorage().getItem(key)
}

function write(key, data) {
	return localStorage().setItem(key, data)
}

function each(fn) {
	for (var i = localStorage().length - 1; i >= 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}


/***/ }),

/***/ "./node_modules/store/storages/memoryStorage.js":
/*!******************************************************!*\
  !*** ./node_modules/store/storages/memoryStorage.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// memoryStorage is a useful last fallback to ensure that the store
// is functions (meaning store.get(), store.set(), etc will all function).
// However, stored values will not persist when the browser navigates to
// a new page or reloads the current page.

module.exports = {
	name: 'memoryStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var memoryStorage = {}

function read(key) {
	return memoryStorage[key]
}

function write(key, data) {
	memoryStorage[key] = data
}

function each(callback) {
	for (var key in memoryStorage) {
		if (memoryStorage.hasOwnProperty(key)) {
			callback(memoryStorage[key], key)
		}
	}
}

function remove(key) {
	delete memoryStorage[key]
}

function clearAll(key) {
	memoryStorage = {}
}


/***/ }),

/***/ "./node_modules/store/storages/oldFF-globalStorage.js":
/*!************************************************************!*\
  !*** ./node_modules/store/storages/oldFF-globalStorage.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// oldFF-globalStorage provides storage for Firefox
// versions 6 and 7, where no localStorage, etc
// is available.

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'oldFF-globalStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var globalStorage = Global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(globalStorage[key], key)
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}


/***/ }),

/***/ "./node_modules/store/storages/oldIE-userDataStorage.js":
/*!**************************************************************!*\
  !*** ./node_modules/store/storages/oldIE-userDataStorage.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// oldIE-userDataStorage provides storage for Internet Explorer
// versions 6 and 7, where no localStorage, sessionStorage, etc
// is available.

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'oldIE-userDataStorage',
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var storageName = 'storejs'
var doc = Global.document
var _withStorageEl = _makeIEStorageElFunction()
var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x

function write(unfixedKey, data) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(fixedKey, data)
		storageEl.save(storageName)
	})
}

function read(unfixedKey) {
	if (disable) { return }
	var fixedKey = fixKey(unfixedKey)
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(fixedKey)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(storageEl.getAttribute(attr.name), attr.name)
		}
	})
}

function remove(unfixedKey) {
	var fixedKey = fixKey(unfixedKey)
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(fixedKey)
		storageEl.save(storageName)
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)
	})
}

// Helpers
//////////

// In IE7, keys cannot start with a digit or contain certain chars.
// See https://github.com/marcuswestin/store.js/issues/40
// See https://github.com/marcuswestin/store.js/issues/83
var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
function fixKey(key) {
	return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl

	// Since #userData storage applies only to specific paths, we need to
	// somehow link our data to a specific path.  We choose /favicon.ico
	// as a pretty safe option, since all browsers already make a request to
	// this URL anyway and being a 404 will not hurt us here.  We wrap an
	// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
	// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
	// since the iframe access rules appear to allow direct access and
	// manipulation of the document element, even for a 404 page.  This
	// document can be used instead of the current document (which would
	// have been limited to the current path) to perform #userData storage.
	try {
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}

	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}


/***/ }),

/***/ "./node_modules/store/storages/sessionStorage.js":
/*!*******************************************************!*\
  !*** ./node_modules/store/storages/sessionStorage.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(/*! ../src/util */ "./node_modules/store/src/util.js")
var Global = util.Global

module.exports = {
	name: 'sessionStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

function sessionStorage() {
	return Global.sessionStorage
}

function read(key) {
	return sessionStorage().getItem(key)
}

function write(key, data) {
	return sessionStorage().setItem(key, data)
}

function each(fn) {
	for (var i = sessionStorage().length - 1; i >= 0; i--) {
		var key = sessionStorage().key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return sessionStorage().removeItem(key)
}

function clearAll() {
	return sessionStorage().clear()
}


/***/ }),

/***/ "./node_modules/textarea-caret/index.js":
/*!**********************************************!*\
  !*** ./node_modules/textarea-caret/index.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* jshint browser: true */

(function () {

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');
var isFirefox = (isBrowser && window.mozInnerScreenX != null);

function getCaretCoordinates(element, position, options) {
  if (!isBrowser) {
    throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
  }

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if (el) el.parentNode.removeChild(el);
  }

  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
  var isInput = element.nodeName === 'INPUT';

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput)
    style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      style.lineHeight = computed.height;
    } else {
      style[prop] = computed[prop];
    }
  });

  if (isFirefox) {
    // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
    if (element.scrollHeight > parseInt(computed.height))
      style.overflowY = 'scroll';
  } else {
    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
  }

  div.textContent = element.value.substring(0, position);
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput)
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = getCaretCoordinates;
} else if(isBrowser) {
  window.getCaretCoordinates = getCaretCoordinates;
}

}());


/***/ }),

/***/ "./node_modules/textcomplete/lib/completer.js":
/*!****************************************************!*\
  !*** ./node_modules/textcomplete/lib/completer.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _strategy = __webpack_require__(/*! ./strategy */ "./node_modules/textcomplete/lib/strategy.js");

var _strategy2 = _interopRequireDefault(_strategy);

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CALLBACK_METHODS = ['handleQueryResult'];

/**
 * Complete engine.
 */

var Completer = function (_EventEmitter) {
  _inherits(Completer, _EventEmitter);

  function Completer() {
    _classCallCheck(this, Completer);

    var _this = _possibleConstructorReturn(this, (Completer.__proto__ || Object.getPrototypeOf(Completer)).call(this));

    _this.strategies = [];

    CALLBACK_METHODS.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Completer, [{
    key: 'destroy',
    value: function destroy() {
      this.strategies.forEach(function (strategy) {
        return strategy.destroy();
      });
      return this;
    }

    /**
     * Register a strategy to the completer.
     *
     * @return {this}
     */

  }, {
    key: 'registerStrategy',
    value: function registerStrategy(strategy) {
      this.strategies.push(strategy);
      return this;
    }

    /**
     * @param {string} text - Head to input cursor.
     */

  }, {
    key: 'run',
    value: function run(text) {
      var query = this.extractQuery(text);
      if (query) {
        query.execute(this.handleQueryResult);
      } else {
        this.handleQueryResult([]);
      }
    }

    /**
     * Find a query, which matches to the given text.
     *
     * @private
     */

  }, {
    key: 'extractQuery',
    value: function extractQuery(text) {
      for (var i = 0; i < this.strategies.length; i++) {
        var query = this.strategies[i].buildQuery(text);
        if (query) {
          return query;
        }
      }
      return null;
    }

    /**
     * Callbacked by {@link Query#execute}.
     *
     * @private
     */

  }, {
    key: 'handleQueryResult',
    value: function handleQueryResult(searchResults) {
      this.emit('hit', { searchResults: searchResults });
    }
  }]);

  return Completer;
}(_eventemitter2.default);

exports.default = Completer;
//# sourceMappingURL=completer.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/dropdown.js":
/*!***************************************************!*\
  !*** ./node_modules/textcomplete/lib/dropdown.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _dropdown_item = __webpack_require__(/*! ./dropdown_item */ "./node_modules/textcomplete/lib/dropdown_item.js");

var _dropdown_item2 = _interopRequireDefault(_dropdown_item);

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

var _utils = __webpack_require__(/*! ./utils */ "./node_modules/textcomplete/lib/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_CLASS_NAME = 'dropdown-menu textcomplete-dropdown';

/** @typedef */

/**
 * Encapsulate a dropdown view.
 *
 * @prop {boolean} shown - Whether the #el is shown or not.
 * @prop {DropdownItem[]} items - The array of rendered dropdown items.
 */
var Dropdown = function (_EventEmitter) {
  _inherits(Dropdown, _EventEmitter);

  _createClass(Dropdown, null, [{
    key: 'createElement',
    value: function createElement() {
      var el = document.createElement('ul');
      var style = el.style;
      style.display = 'none';
      style.position = 'absolute';
      style.zIndex = '10000';
      var body = document.body;
      if (body) {
        body.appendChild(el);
      }
      return el;
    }
  }]);

  function Dropdown(options) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

    _this.shown = false;
    _this.items = [];
    _this.footer = options.footer;
    _this.header = options.header;
    _this.maxCount = options.maxCount || 10;
    _this.el.className = options.className || DEFAULT_CLASS_NAME;
    _this.rotate = options.hasOwnProperty('rotate') ? options.rotate : true;
    _this.placement = options.placement;
    var style = options.style;
    if (style) {
      Object.keys(style).forEach(function (key) {
        _this.el.style[key] = style[key];
      });
    }
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Dropdown, [{
    key: 'destroy',
    value: function destroy() {
      var parentNode = this.el.parentNode;
      if (parentNode) {
        parentNode.removeChild(this.el);
      }
      this.clear()._el = null;
      return this;
    }
  }, {
    key: 'render',


    /**
     * Render the given data as dropdown items.
     *
     * @return {this}
     */
    value: function render(searchResults, cursorOffset) {
      var renderEvent = (0, _utils.createCustomEvent)('render', { cancelable: true });
      this.emit('render', renderEvent);
      if (renderEvent.defaultPrevented) {
        return this;
      }
      var rawResults = searchResults.map(function (searchResult) {
        return searchResult.data;
      });
      var dropdownItems = searchResults.slice(0, this.maxCount || searchResults.length).map(function (searchResult) {
        return new _dropdown_item2.default(searchResult);
      });
      this.clear().setStrategyId(searchResults[0]).renderEdge(rawResults, 'header').append(dropdownItems).renderEdge(rawResults, 'footer').setOffset(cursorOffset).show();
      this.emit('rendered', (0, _utils.createCustomEvent)('rendered'));
      return this;
    }

    /**
     * Hide the dropdown then sweep out items.
     *
     * @return {this}
     */

  }, {
    key: 'deactivate',
    value: function deactivate() {
      return this.hide().clear();
    }

    /**
     * @return {this}
     */

  }, {
    key: 'select',
    value: function select(dropdownItem) {
      var detail = { searchResult: dropdownItem.searchResult };
      var selectEvent = (0, _utils.createCustomEvent)('select', { cancelable: true, detail: detail });
      this.emit('select', selectEvent);
      if (selectEvent.defaultPrevented) {
        return this;
      }
      this.deactivate();
      this.emit('selected', (0, _utils.createCustomEvent)('selected', { detail: detail }));
      return this;
    }

    /**
     * @return {this}
     */

  }, {
    key: 'up',
    value: function up(e) {
      return this.shown ? this.moveActiveItem('prev', e) : this;
    }

    /**
     * @return {this}
     */

  }, {
    key: 'down',
    value: function down(e) {
      return this.shown ? this.moveActiveItem('next', e) : this;
    }

    /**
     * Retrieve the active item.
     */

  }, {
    key: 'getActiveItem',
    value: function getActiveItem() {
      return this.items.find(function (item) {
        return item.active;
      });
    }

    /**
     * Add items to dropdown.
     *
     * @private
     */

  }, {
    key: 'append',
    value: function append(items) {
      var _this2 = this;

      var fragment = document.createDocumentFragment();
      items.forEach(function (item) {
        _this2.items.push(item);
        item.appended(_this2);
        fragment.appendChild(item.el);
      });
      this.el.appendChild(fragment);
      return this;
    }

    /** @private */

  }, {
    key: 'setOffset',
    value: function setOffset(cursorOffset) {
      if (cursorOffset.left) {
        this.el.style.left = cursorOffset.left + 'px';
      } else if (cursorOffset.right) {
        this.el.style.right = cursorOffset.right + 'px';
      }
      if (this.isPlacementTop()) {
        var element = document.documentElement;
        if (element) {
          this.el.style.bottom = element.clientHeight - cursorOffset.top + cursorOffset.lineHeight + 'px';
        }
      } else {
        this.el.style.top = cursorOffset.top + 'px';
      }
      return this;
    }

    /**
     * Show the element.
     *
     * @private
     */

  }, {
    key: 'show',
    value: function show() {
      if (!this.shown) {
        var showEvent = (0, _utils.createCustomEvent)('show', { cancelable: true });
        this.emit('show', showEvent);
        if (showEvent.defaultPrevented) {
          return this;
        }
        this.el.style.display = 'block';
        this.shown = true;
        this.emit('shown', (0, _utils.createCustomEvent)('shown'));
      }
      return this;
    }

    /**
     * Hide the element.
     *
     * @private
     */

  }, {
    key: 'hide',
    value: function hide() {
      if (this.shown) {
        var hideEvent = (0, _utils.createCustomEvent)('hide', { cancelable: true });
        this.emit('hide', hideEvent);
        if (hideEvent.defaultPrevented) {
          return this;
        }
        this.el.style.display = 'none';
        this.shown = false;
        this.emit('hidden', (0, _utils.createCustomEvent)('hidden'));
      }
      return this;
    }

    /**
     * Clear search results.
     *
     * @private
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.el.innerHTML = '';
      this.items.forEach(function (item) {
        return item.destroy();
      });
      this.items = [];
      return this;
    }

    /** @private */

  }, {
    key: 'moveActiveItem',
    value: function moveActiveItem(name, e) {
      var activeItem = this.getActiveItem();
      var nextActiveItem = void 0;
      if (activeItem) {
        nextActiveItem = activeItem[name];
      } else {
        nextActiveItem = name === 'next' ? this.items[0] : this.items[this.items.length - 1];
      }
      if (nextActiveItem) {
        nextActiveItem.activate();
        e.preventDefault();
      }
      return this;
    }

    /** @private */

  }, {
    key: 'setStrategyId',
    value: function setStrategyId(searchResult) {
      var strategyId = searchResult && searchResult.strategy.props.id;
      if (strategyId) {
        this.el.setAttribute('data-strategy', strategyId);
      } else {
        this.el.removeAttribute('data-strategy');
      }
      return this;
    }

    /**
     * @private
     * @param {object[]} rawResults - What callbacked by search function.
     */

  }, {
    key: 'renderEdge',
    value: function renderEdge(rawResults, type) {
      var source = (type === 'header' ? this.header : this.footer) || '';
      var content = typeof source === 'function' ? source(rawResults) : source;
      var li = document.createElement('li');
      li.classList.add('textcomplete-' + type);
      li.innerHTML = content;
      this.el.appendChild(li);
      return this;
    }

    /** @private */

  }, {
    key: 'isPlacementTop',
    value: function isPlacementTop() {
      return this.placement === 'top';
    }
  }, {
    key: 'el',
    get: function get() {
      if (!this._el) {
        this._el = Dropdown.createElement();
      }
      return this._el;
    }
  }]);

  return Dropdown;
}(_eventemitter2.default);

exports.default = Dropdown;
//# sourceMappingURL=dropdown.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/dropdown_item.js":
/*!********************************************************!*\
  !*** ./node_modules/textcomplete/lib/dropdown_item.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLASS_NAME = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dropdown = __webpack_require__(/*! ./dropdown */ "./node_modules/textcomplete/lib/dropdown.js");

var _dropdown2 = _interopRequireDefault(_dropdown);

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLASS_NAME = exports.CLASS_NAME = 'textcomplete-item';
var ACTIVE_CLASS_NAME = CLASS_NAME + ' active';
var CALLBACK_METHODS = ['onClick', 'onMouseover'];

/**
 * Encapsulate an item of dropdown.
 */

var DropdownItem = function () {
  function DropdownItem(searchResult) {
    var _this = this;

    _classCallCheck(this, DropdownItem);

    this.searchResult = searchResult;
    this.active = false;

    CALLBACK_METHODS.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });
  }

  _createClass(DropdownItem, [{
    key: 'destroy',


    /**
     * Try to free resources and perform other cleanup operations.
     */
    value: function destroy() {
      this.el.removeEventListener('mousedown', this.onClick, false);
      this.el.removeEventListener('mouseover', this.onMouseover, false);
      this.el.removeEventListener('touchstart', this.onClick, false);
      // This element has already been removed by {@link Dropdown#clear}.
      this._el = null;
    }

    /**
     * Callbacked when it is appended to a dropdown.
     *
     * @see Dropdown#append
     */

  }, {
    key: 'appended',
    value: function appended(dropdown) {
      this.dropdown = dropdown;
      this.siblings = dropdown.items;
      this.index = this.siblings.length - 1;
    }

    /**
     * Deactivate active item then activate itself.
     *
     * @return {this}
     */

  }, {
    key: 'activate',
    value: function activate() {
      if (!this.active) {
        var activeItem = this.dropdown.getActiveItem();
        if (activeItem) {
          activeItem.deactivate();
        }
        this.active = true;
        this.el.className = ACTIVE_CLASS_NAME;
      }
      return this;
    }

    /**
     * Get the next sibling.
     */

  }, {
    key: 'deactivate',


    /** @private */
    value: function deactivate() {
      if (this.active) {
        this.active = false;
        this.el.className = CLASS_NAME;
      }
      return this;
    }

    /** @private */

  }, {
    key: 'onClick',
    value: function onClick(e) {
      e.preventDefault(); // Prevent blur event
      this.dropdown.select(this);
    }

    /** @private */

  }, {
    key: 'onMouseover',
    value: function onMouseover(_) {
      this.activate();
    }
  }, {
    key: 'el',
    get: function get() {
      if (this._el) {
        return this._el;
      }
      var li = document.createElement('li');
      li.className = this.active ? ACTIVE_CLASS_NAME : CLASS_NAME;
      var a = document.createElement('a');
      a.innerHTML = this.searchResult.render();
      li.appendChild(a);
      this._el = li;
      li.addEventListener('mousedown', this.onClick);
      li.addEventListener('mouseover', this.onMouseover);
      li.addEventListener('touchstart', this.onClick);
      return li;
    }
  }, {
    key: 'next',
    get: function get() {
      var nextIndex = void 0;
      if (this.index === this.siblings.length - 1) {
        if (!this.dropdown.rotate) {
          return null;
        }
        nextIndex = 0;
      } else {
        nextIndex = this.index + 1;
      }
      return this.siblings[nextIndex];
    }

    /**
     * Get the previous sibling.
     */

  }, {
    key: 'prev',
    get: function get() {
      var nextIndex = void 0;
      if (this.index === 0) {
        if (!this.dropdown.rotate) {
          return null;
        }
        nextIndex = this.siblings.length - 1;
      } else {
        nextIndex = this.index - 1;
      }
      return this.siblings[nextIndex];
    }
  }]);

  return DropdownItem;
}();

exports.default = DropdownItem;
//# sourceMappingURL=dropdown_item.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/editor.js":
/*!*************************************************!*\
  !*** ./node_modules/textcomplete/lib/editor.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _utils = __webpack_require__(/*! ./utils */ "./node_modules/textcomplete/lib/utils.js");

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Abstract class representing a editor target.
 *
 * Editor classes must implement `#applySearchResult`, `#getCursorOffset`,
 * `#getBeforeCursor` and `#getAfterCursor` methods.
 *
 * @abstract
 */


/** @typedef */
var Editor = function (_EventEmitter) {
  _inherits(Editor, _EventEmitter);

  function Editor() {
    _classCallCheck(this, Editor);

    return _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).apply(this, arguments));
  }

  _createClass(Editor, [{
    key: 'destroy',

    /**
     * It is called when associated textcomplete object is destroyed.
     *
     * @return {this}
     */
    value: function destroy() {
      return this;
    }

    /**
     * It is called when a search result is selected by a user.
     */

  }, {
    key: 'applySearchResult',
    value: function applySearchResult(_) {
      throw new Error('Not implemented.');
    }

    /**
     * The input cursor's absolute coordinates from the window's left
     * top corner.
     */

  }, {
    key: 'getCursorOffset',
    value: function getCursorOffset() {
      throw new Error('Not implemented.');
    }

    /**
     * Editor string value from head to cursor.
     */

  }, {
    key: 'getBeforeCursor',
    value: function getBeforeCursor() {
      throw new Error('Not implemented.');
    }

    /**
     * Editor string value from cursor to tail.
     */

  }, {
    key: 'getAfterCursor',
    value: function getAfterCursor() {
      throw new Error('Not implemented.');
    }

    /** @private */

  }, {
    key: 'emitMoveEvent',
    value: function emitMoveEvent(code) {
      var moveEvent = (0, _utils.createCustomEvent)('move', {
        cancelable: true,
        detail: {
          code: code
        }
      });
      this.emit('move', moveEvent);
      return moveEvent;
    }

    /** @private */

  }, {
    key: 'emitEnterEvent',
    value: function emitEnterEvent() {
      var enterEvent = (0, _utils.createCustomEvent)('enter', { cancelable: true });
      this.emit('enter', enterEvent);
      return enterEvent;
    }

    /** @private */

  }, {
    key: 'emitChangeEvent',
    value: function emitChangeEvent() {
      var changeEvent = (0, _utils.createCustomEvent)('change', {
        detail: {
          beforeCursor: this.getBeforeCursor()
        }
      });
      this.emit('change', changeEvent);
      return changeEvent;
    }

    /** @private */

  }, {
    key: 'emitEscEvent',
    value: function emitEscEvent() {
      var escEvent = (0, _utils.createCustomEvent)('esc', { cancelable: true });
      this.emit('esc', escEvent);
      return escEvent;
    }

    /** @private */

  }, {
    key: 'getCode',
    value: function getCode(e) {
      return e.keyCode === 8 ? 'BS' // backspace
      : e.keyCode === 9 ? 'ENTER' // tab
      : e.keyCode === 13 ? 'ENTER' // enter
      : e.keyCode === 16 ? 'META' // shift
      : e.keyCode === 17 ? 'META' // ctrl
      : e.keyCode === 18 ? 'META' // alt
      : e.keyCode === 27 ? 'ESC' // esc
      : e.keyCode === 38 ? 'UP' // up
      : e.keyCode === 40 ? 'DOWN' // down
      : e.keyCode === 78 && e.ctrlKey ? 'DOWN' // ctrl-n
      : e.keyCode === 80 && e.ctrlKey ? 'UP' // ctrl-p
      : e.keyCode === 91 ? 'META' // left command
      : e.keyCode === 93 ? 'META' // right command
      : 'OTHER';
    }
  }]);

  return Editor;
}(_eventemitter2.default);

exports.default = Editor;
//# sourceMappingURL=editor.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/query.js":
/*!************************************************!*\
  !*** ./node_modules/textcomplete/lib/query.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

var _strategy = __webpack_require__(/*! ./strategy */ "./node_modules/textcomplete/lib/strategy.js");

var _strategy2 = _interopRequireDefault(_strategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Encapsulate matching condition between a Strategy and current editor's value.
 */
var Query = function () {
  function Query(strategy, term, match) {
    _classCallCheck(this, Query);

    this.strategy = strategy;
    this.term = term;
    this.match = match;
  }

  /**
   * Invoke search strategy and callback the given function.
   */


  _createClass(Query, [{
    key: 'execute',
    value: function execute(callback) {
      var _this = this;

      this.strategy.search(this.term, function (results) {
        callback(results.map(function (result) {
          return new _search_result2.default(result, _this.term, _this.strategy);
        }));
      }, this.match);
    }
  }]);

  return Query;
}();

exports.default = Query;
//# sourceMappingURL=query.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/search_result.js":
/*!********************************************************!*\
  !*** ./node_modules/textcomplete/lib/search_result.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strategy = __webpack_require__(/*! ./strategy */ "./node_modules/textcomplete/lib/strategy.js");

var _strategy2 = _interopRequireDefault(_strategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Encapsulate an result of each search results.
 */
var SearchResult = function () {

  /**
   * @param {object} data - An element of array callbacked by search function.
   */
  function SearchResult(data, term, strategy) {
    _classCallCheck(this, SearchResult);

    this.data = data;
    this.term = term;
    this.strategy = strategy;
  }

  _createClass(SearchResult, [{
    key: 'replace',
    value: function replace(beforeCursor, afterCursor) {
      var replacement = this.strategy.replace(this.data);
      if (replacement !== null) {
        if (Array.isArray(replacement)) {
          afterCursor = replacement[1] + afterCursor;
          replacement = replacement[0];
        }
        var match = this.strategy.matchText(beforeCursor);
        if (match) {
          replacement = replacement.replace(/\$&/g, match[0]).replace(/\$(\d+)/g, function (_, p1) {
            return match[parseInt(p1, 10)];
          });
          return [[beforeCursor.slice(0, match.index), replacement, beforeCursor.slice(match.index + match[0].length)].join(''), afterCursor];
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.strategy.template(this.data, this.term);
    }
  }]);

  return SearchResult;
}();

exports.default = SearchResult;
//# sourceMappingURL=search_result.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/strategy.js":
/*!***************************************************!*\
  !*** ./node_modules/textcomplete/lib/strategy.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _query = __webpack_require__(/*! ./query */ "./node_modules/textcomplete/lib/query.js");

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_INDEX = 2;

function DEFAULT_TEMPLATE(value) {
  return value;
}

/**
 * Properties for a strategy.
 *
 * @typedef
 */

/**
 * Encapsulate a single strategy.
 */
var Strategy = function () {
  function Strategy(props) {
    _classCallCheck(this, Strategy);

    this.props = props;
    this.cache = props.cache ? {} : null;
  }

  /**
   * @return {this}
   */


  _createClass(Strategy, [{
    key: 'destroy',
    value: function destroy() {
      this.cache = null;
      return this;
    }

    /**
     * Build a Query object by the given string if this matches to the string.
     *
     * @param {string} text - Head to input cursor.
     */

  }, {
    key: 'buildQuery',
    value: function buildQuery(text) {
      if (typeof this.props.context === 'function') {
        var _context = this.props.context(text);
        if (typeof _context === 'string') {
          text = _context;
        } else if (!_context) {
          return null;
        }
      }
      var match = this.matchText(text);
      return match ? new _query2.default(this, match[this.index], match) : null;
    }
  }, {
    key: 'search',
    value: function search(term, callback, match) {
      if (this.cache) {
        this.searchWithCache(term, callback, match);
      } else {
        this.props.search(term, callback, match);
      }
    }

    /**
     * @param {object} data - An element of array callbacked by search function.
     */

  }, {
    key: 'replace',
    value: function replace(data) {
      return this.props.replace(data);
    }

    /** @private */

  }, {
    key: 'searchWithCache',
    value: function searchWithCache(term, callback, match) {
      var _this = this;

      if (this.cache && this.cache[term]) {
        callback(this.cache[term]);
      } else {
        this.props.search(term, function (results) {
          if (_this.cache) {
            _this.cache[term] = results;
          }
          callback(results);
        }, match);
      }
    }

    /** @private */

  }, {
    key: 'matchText',
    value: function matchText(text) {
      if (typeof this.match === 'function') {
        return this.match(text);
      } else {
        return text.match(this.match);
      }
    }

    /** @private */

  }, {
    key: 'match',
    get: function get() {
      return this.props.match;
    }

    /** @private */

  }, {
    key: 'index',
    get: function get() {
      return typeof this.props.index === 'number' ? this.props.index : DEFAULT_INDEX;
    }
  }, {
    key: 'template',
    get: function get() {
      return this.props.template || DEFAULT_TEMPLATE;
    }
  }]);

  return Strategy;
}();

exports.default = Strategy;
//# sourceMappingURL=strategy.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/textarea.js":
/*!***************************************************!*\
  !*** ./node_modules/textcomplete/lib/textarea.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _update = __webpack_require__(/*! undate/lib/update */ "./node_modules/undate/lib/update.js");

var _update2 = _interopRequireDefault(_update);

var _editor = __webpack_require__(/*! ./editor */ "./node_modules/textcomplete/lib/editor.js");

var _editor2 = _interopRequireDefault(_editor);

var _utils = __webpack_require__(/*! ./utils */ "./node_modules/textcomplete/lib/utils.js");

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getCaretCoordinates = __webpack_require__(/*! textarea-caret */ "./node_modules/textarea-caret/index.js");

var CALLBACK_METHODS = ['onInput', 'onKeydown'];

/**
 * Encapsulate the target textarea element.
 */

var Textarea = function (_Editor) {
  _inherits(Textarea, _Editor);

  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  function Textarea(el) {
    _classCallCheck(this, Textarea);

    var _this = _possibleConstructorReturn(this, (Textarea.__proto__ || Object.getPrototypeOf(Textarea)).call(this));

    _this.el = el;

    CALLBACK_METHODS.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });

    _this.startListening();
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Textarea, [{
    key: 'destroy',
    value: function destroy() {
      _get(Textarea.prototype.__proto__ || Object.getPrototypeOf(Textarea.prototype), 'destroy', this).call(this);
      this.stopListening();
      // Release the element reference early to help garbage collection.
      this.el = null;
      return this;
    }

    /**
     * Implementation for {@link Editor#applySearchResult}
     */

  }, {
    key: 'applySearchResult',
    value: function applySearchResult(searchResult) {
      var replace = searchResult.replace(this.getBeforeCursor(), this.getAfterCursor());
      this.el.focus(); // Clicking a dropdown item removes focus from the element.
      if (Array.isArray(replace)) {
        (0, _update2.default)(this.el, replace[0], replace[1]);
        this.el.dispatchEvent(new Event('input'));
      }
    }

    /**
     * Implementation for {@link Editor#getCursorOffset}
     */

  }, {
    key: 'getCursorOffset',
    value: function getCursorOffset() {
      var elOffset = (0, _utils.calculateElementOffset)(this.el);
      var elScroll = this.getElScroll();
      var cursorPosition = this.getCursorPosition();
      var lineHeight = (0, _utils.getLineHeightPx)(this.el);
      var top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight;
      var left = elOffset.left - elScroll.left + cursorPosition.left;
      if (this.el.dir !== 'rtl') {
        return { top: top, left: left, lineHeight: lineHeight };
      } else {
        var right = document.documentElement ? document.documentElement.clientWidth - left : 0;
        return { top: top, right: right, lineHeight: lineHeight };
      }
    }

    /**
     * Implementation for {@link Editor#getBeforeCursor}
     */

  }, {
    key: 'getBeforeCursor',
    value: function getBeforeCursor() {
      return this.el.value.substring(0, this.el.selectionEnd);
    }

    /**
     * Implementation for {@link Editor#getAfterCursor}
     */

  }, {
    key: 'getAfterCursor',
    value: function getAfterCursor() {
      return this.el.value.substring(this.el.selectionEnd);
    }

    /** @private */

  }, {
    key: 'getElScroll',
    value: function getElScroll() {
      return { top: this.el.scrollTop, left: this.el.scrollLeft };
    }

    /**
     * The input cursor's relative coordinates from the textarea's left
     * top corner.
     *
     * @private
     */

  }, {
    key: 'getCursorPosition',
    value: function getCursorPosition() {
      return getCaretCoordinates(this.el, this.el.selectionEnd);
    }

    /** @private */

  }, {
    key: 'onInput',
    value: function onInput(_) {
      this.emitChangeEvent();
    }

    /** @private */

  }, {
    key: 'onKeydown',
    value: function onKeydown(e) {
      var code = this.getCode(e);
      var event = void 0;
      if (code === 'UP' || code === 'DOWN') {
        event = this.emitMoveEvent(code);
      } else if (code === 'ENTER') {
        event = this.emitEnterEvent();
      } else if (code === 'ESC') {
        event = this.emitEscEvent();
      }
      if (event && event.defaultPrevented) {
        e.preventDefault();
      }
    }

    /** @private */

  }, {
    key: 'startListening',
    value: function startListening() {
      this.el.addEventListener('input', this.onInput);
      this.el.addEventListener('keydown', this.onKeydown);
    }

    /** @private */

  }, {
    key: 'stopListening',
    value: function stopListening() {
      this.el.removeEventListener('input', this.onInput);
      this.el.removeEventListener('keydown', this.onKeydown);
    }
  }]);

  return Textarea;
}(_editor2.default);

exports.default = Textarea;
//# sourceMappingURL=textarea.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/textcomplete.js":
/*!*******************************************************!*\
  !*** ./node_modules/textcomplete/lib/textcomplete.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _completer = __webpack_require__(/*! ./completer */ "./node_modules/textcomplete/lib/completer.js");

var _completer2 = _interopRequireDefault(_completer);

var _editor = __webpack_require__(/*! ./editor */ "./node_modules/textcomplete/lib/editor.js");

var _editor2 = _interopRequireDefault(_editor);

var _dropdown = __webpack_require__(/*! ./dropdown */ "./node_modules/textcomplete/lib/dropdown.js");

var _dropdown2 = _interopRequireDefault(_dropdown);

var _strategy = __webpack_require__(/*! ./strategy */ "./node_modules/textcomplete/lib/strategy.js");

var _strategy2 = _interopRequireDefault(_strategy);

var _search_result = __webpack_require__(/*! ./search_result */ "./node_modules/textcomplete/lib/search_result.js");

var _search_result2 = _interopRequireDefault(_search_result);

var _eventemitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CALLBACK_METHODS = ['handleChange', 'handleEnter', 'handleEsc', 'handleHit', 'handleMove', 'handleSelect'];

/** @typedef */

/**
 * The core of textcomplete. It acts as a mediator.
 */
var Textcomplete = function (_EventEmitter) {
  _inherits(Textcomplete, _EventEmitter);

  /**
   * @param {Editor} editor - Where the textcomplete works on.
   */
  function Textcomplete(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Textcomplete);

    var _this = _possibleConstructorReturn(this, (Textcomplete.__proto__ || Object.getPrototypeOf(Textcomplete)).call(this));

    _this.completer = new _completer2.default();
    _this.isQueryInFlight = false;
    _this.nextPendingQuery = null;
    _this.dropdown = new _dropdown2.default(options.dropdown || {});
    _this.editor = editor;
    _this.options = options;

    CALLBACK_METHODS.forEach(function (method) {
      _this[method] = _this[method].bind(_this);
    });

    _this.startListening();
    return _this;
  }

  /**
   * @return {this}
   */


  _createClass(Textcomplete, [{
    key: 'destroy',
    value: function destroy() {
      var destroyEditor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.completer.destroy();
      this.dropdown.destroy();
      if (destroyEditor) {
        this.editor.destroy();
      }
      this.stopListening();
      return this;
    }

    /**
     * @return {this}
     * @example
     * textcomplete.register([{
     *   match: /(^|\s)(\w+)$/,
     *   search: function (term, callback) {
     *     $.ajax({ ... })
     *       .done(callback)
     *       .fail([]);
     *   },
     *   replace: function (value) {
     *     return '$1' + value + ' ';
     *   }
     * }]);
     */

  }, {
    key: 'register',
    value: function register(strategyPropsArray) {
      var _this2 = this;

      strategyPropsArray.forEach(function (props) {
        _this2.completer.registerStrategy(new _strategy2.default(props));
      });
      return this;
    }

    /**
     * Start autocompleting.
     *
     * @param {string} text - Head to input cursor.
     * @return {this}
     */

  }, {
    key: 'trigger',
    value: function trigger(text) {
      if (this.isQueryInFlight) {
        this.nextPendingQuery = text;
      } else {
        this.isQueryInFlight = true;
        this.nextPendingQuery = null;
        this.completer.run(text);
      }
      return this;
    }

    /** @private */

  }, {
    key: 'handleHit',
    value: function handleHit(_ref) {
      var searchResults = _ref.searchResults;

      if (searchResults.length) {
        this.dropdown.render(searchResults, this.editor.getCursorOffset());
      } else {
        this.dropdown.deactivate();
      }
      this.isQueryInFlight = false;
      if (this.nextPendingQuery !== null) {
        this.trigger(this.nextPendingQuery);
      }
    }

    /** @private */

  }, {
    key: 'handleMove',
    value: function handleMove(e) {
      e.detail.code === 'UP' ? this.dropdown.up(e) : this.dropdown.down(e);
    }

    /** @private */

  }, {
    key: 'handleEnter',
    value: function handleEnter(e) {
      var activeItem = this.dropdown.getActiveItem();
      if (activeItem) {
        this.dropdown.select(activeItem);
        e.preventDefault();
      }
    }

    /** @private */

  }, {
    key: 'handleEsc',
    value: function handleEsc(e) {
      if (this.dropdown.shown) {
        this.dropdown.deactivate();
        e.preventDefault();
      }
    }

    /** @private */

  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      this.trigger(e.detail.beforeCursor);
    }

    /** @private */

  }, {
    key: 'handleSelect',
    value: function handleSelect(selectEvent) {
      this.emit('select', selectEvent);
      if (!selectEvent.defaultPrevented) {
        this.editor.applySearchResult(selectEvent.detail.searchResult);
      }
    }

    /** @private */

  }, {
    key: 'startListening',
    value: function startListening() {
      var _this3 = this;

      this.editor.on('move', this.handleMove).on('enter', this.handleEnter).on('esc', this.handleEsc).on('change', this.handleChange);
      this.dropdown.on('select', this.handleSelect);
      ['show', 'shown', 'render', 'rendered', 'selected', 'hidden', 'hide'].forEach(function (eventName) {
        _this3.dropdown.on(eventName, function () {
          return _this3.emit(eventName);
        });
      });
      this.completer.on('hit', this.handleHit);
    }

    /** @private */

  }, {
    key: 'stopListening',
    value: function stopListening() {
      this.completer.removeAllListeners();
      this.dropdown.removeAllListeners();
      this.editor.removeListener('move', this.handleMove).removeListener('enter', this.handleEnter).removeListener('esc', this.handleEsc).removeListener('change', this.handleChange);
    }
  }]);

  return Textcomplete;
}(_eventemitter2.default);

exports.default = Textcomplete;
//# sourceMappingURL=textcomplete.js.map

/***/ }),

/***/ "./node_modules/textcomplete/lib/utils.js":
/*!************************************************!*\
  !*** ./node_modules/textcomplete/lib/utils.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateElementOffset = calculateElementOffset;
exports.getLineHeightPx = getLineHeightPx;


/**
 * Create a custom event
 *
 * @private
 */
var createCustomEvent = exports.createCustomEvent = function () {
  if (typeof window.CustomEvent === 'function') {
    return function (type, options) {
      return new document.defaultView.CustomEvent(type, {
        cancelable: options && options.cancelable || false,
        detail: options && options.detail || undefined
      });
    };
  } else {
    // Custom event polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#polyfill
    return function (type, options) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(type,
      /* bubbles */false, options && options.cancelable || false, options && options.detail || undefined);
      return event;
    };
  }
}();

/**
 * Get the current coordinates of the `el` relative to the document.
 *
 * @private
 */
function calculateElementOffset(el) {
  var rect = el.getBoundingClientRect();
  var _el$ownerDocument = el.ownerDocument,
      defaultView = _el$ownerDocument.defaultView,
      documentElement = _el$ownerDocument.documentElement;

  var offset = { top: rect.top + defaultView.pageYOffset, left: rect.left + defaultView.pageXOffset };
  if (documentElement) {
    offset.top -= documentElement.clientTop;
    offset.left -= documentElement.clientLeft;
  }
  return offset;
}

var CHAR_CODE_ZERO = '0'.charCodeAt(0);
var CHAR_CODE_NINE = '9'.charCodeAt(0);

function isDigit(charCode) {
  return charCode >= CHAR_CODE_ZERO && charCode <= CHAR_CODE_NINE;
}

/**
 * Returns the line-height of the given node in pixels.
 *
 * @private
 */
function getLineHeightPx(node) {
  var computedStyle = window.getComputedStyle(node);

  // If the char code starts with a digit, it is either a value in pixels,
  // or unitless, as per:
  // https://drafts.csswg.org/css2/visudet.html#propdef-line-height
  // https://drafts.csswg.org/css2/cascade.html#computed-value
  if (isDigit(computedStyle.lineHeight.charCodeAt(0))) {
    // In real browsers the value is *always* in pixels, even for unit-less
    // line-heights. However, we still check as per the spec.
    if (isDigit(computedStyle.lineHeight.charCodeAt(computedStyle.lineHeight.length - 1))) {
      return parseFloat(computedStyle.lineHeight) * parseFloat(computedStyle.fontSize);
    } else {
      return parseFloat(computedStyle.lineHeight);
    }
  }

  // Otherwise, the value is "normal".
  // If the line-height is "normal", calculate by font-size
  var body = document.body;
  if (!body) {
    return 0;
  }
  var tempNode = document.createElement(node.nodeName);
  tempNode.innerHTML = '&nbsp;';
  tempNode.style.fontSize = computedStyle.fontSize;
  tempNode.style.fontFamily = computedStyle.fontFamily;
  body.appendChild(tempNode);
  // Assume the height of the element is the line-height
  var height = tempNode.offsetHeight;
  body.removeChild(tempNode);
  return height;
}
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/undate/lib/update.js":
/*!*******************************************!*\
  !*** ./node_modules/undate/lib/update.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (el, headToCursor, cursorToTail) {
  var curr = el.value,
      // strA + strB1 + strC
  next = headToCursor + (cursorToTail || ''),
      // strA + strB2 + strC
  activeElement = document.activeElement;

  //  Calculate length of strA and strC
  var aLength = 0,
      cLength = 0;
  while (aLength < curr.length && aLength < next.length && curr[aLength] === next[aLength]) {
    aLength++;
  }
  while (curr.length - cLength - 1 >= 0 && next.length - cLength - 1 >= 0 && curr[curr.length - cLength - 1] === next[next.length - cLength - 1]) {
    cLength++;
  }
  aLength = Math.min(aLength, Math.min(curr.length, next.length) - cLength);

  // Select strB1
  el.setSelectionRange(aLength, curr.length - cLength);

  // Get strB2
  var strB2 = next.substring(aLength, next.length - cLength);

  // Replace strB1 with strB2
  el.focus();
  if (!document.execCommand('insertText', false, strB2)) {
    // Document.execCommand returns false if the command is not supported.
    // Firefox and IE returns false in this case.
    el.value = next;

    // Dispatch input event. Note that `new Event("input")` throws an error on IE11
    var event = document.createEvent("Event");
    event.initEvent("input", true, true);
    el.dispatchEvent(event);
  }

  // Move cursor to the end of headToCursor
  el.setSelectionRange(headToCursor.length, headToCursor.length);

  activeElement && activeElement.focus();
  return el;
};

/***/ })

},["./assets/js/topic.js"]);