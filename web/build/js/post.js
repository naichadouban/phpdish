webpackJsonp([2],{

/***/ "./assets/js/post.js":
/*!***************************!*\
  !*** ./assets/js/post.js ***!
  \***************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! ../modules/common.js */ "./assets/modules/common.js");

var _util = __webpack_require__(/*! ../modules/util.js */ "./assets/modules/util.js");

var _util2 = _interopRequireDefault(_util);

var _editor = __webpack_require__(/*! ../modules/md-editor/editor.js */ "./assets/modules/md-editor/editor.js");

var _editor2 = _interopRequireDefault(_editor);

var _buttonLock2 = __webpack_require__(/*! ../modules/button-lock.js */ "./assets/modules/button-lock.js");

var _buttonLock3 = _interopRequireDefault(_buttonLock2);

var _simplemde = __webpack_require__(/*! simplemde */ "./node_modules/simplemde/src/js/simplemde.js");

var _simplemde2 = _interopRequireDefault(_simplemde);

var _inlineAttachment = __webpack_require__(/*! ../modules/inline-attachment.js */ "./assets/modules/inline-attachment.js");

var _inlineAttachment2 = _interopRequireDefault(_inlineAttachment);

var _highlight = __webpack_require__(/*! highlight.js */ "./node_modules/highlight.js/lib/index.js");

var _highlight2 = _interopRequireDefault(_highlight);

var _qrcodePayment = __webpack_require__(/*! ../modules/qrcode-payment.js */ "./assets/modules/qrcode-payment.js");

var _qrcodePayment2 = _interopRequireDefault(_qrcodePayment);

var _blueimpMd = __webpack_require__(/*! blueimp-md5 */ "./node_modules/blueimp-md5/js/md5.js");

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! jquery-validation */ "./node_modules/jquery-validation/dist/jquery.validate.js");


/**
 * Post Details
 */
var $addComment = $('#add-comment');
$addComment.length > 0 && function ($) {
    //代码高亮
    $('pre code').each(function (i, block) {
        _highlight2.default.highlightBlock(block);
    });
    //添加评论的表单
    var $addCommentForm = $('#add-comment-form');
    var editor = void 0;

    if ($addCommentForm.length > 0) {
        var $commentBody = $('#comment_original_body');
        var $preview = $addComment.find('[data-action="preview"]');
        var $previewPanel = $addComment.find('[data-role="preview-panel"]');
        editor = new _editor2.default($commentBody, $preview, $previewPanel);

        var $btn = $addCommentForm.find('[data-role="submit"]');
        var _buttonLock = (0, _buttonLock3.default)($btn);
        $addCommentForm.on('submit', function () {
            if (_buttonLock.isDisabled()) {
                return false;
            }
            var body = editor.getContent();
            if (body.length === 0) {
                _util2.default.dialog.message(Translator.trans('ui.please_fill_in_content')).flash();
                return false;
            }
            _buttonLock.lock();
            var csrfToken = $('#comment__token').val();
            _util2.default.request('comment.add', window.postId, {
                comment: {
                    original_body: body,
                    _token: csrfToken
                }
            }).done(function (response) {
                editor.setContent('');
                _util2.default.dialog.message(Translator.trans('post.reply_success')).flash(function () {
                    return location.reload();
                });
            }).fail(function (response) {
                _util2.default.dialog.message(response.responseJSON.error);
            }).always(function () {
                _buttonLock.release();
            });
            return false;
        });
    }

    //Reply list
    var $repliesPanel = $('#reply-list');
    $repliesPanel.find('[data-role="reply"]').each(function () {
        var $this = $(this);
        var replyId = $this.data('reply-id');
        var username = $this.data('username');
        //回复层主
        if (editor) {
            $this.find('[data-action="mention"]').on('click', function () {
                editor.appendContent('@' + username + ' ');
                _util2.default.goHash('#add-comment-form');
            });
        }
        //删除回复
        var $removeAction = $this.find('[data-action="remove"]');
        var buttonLock = (0, _buttonLock3.default)($removeAction);
        $removeAction.on('click', function () {
            if (buttonLock.isDisabled()) {
                return false;
            }
            buttonLock.lock();
            _util2.default.dialog.confirm(Translator.trans('post.confirm_remove_the_comment')).then(function () {
                _util2.default.request('comment.delete', replyId).done(function () {
                    _util2.default.dialog.message(Translator.trans('post.comment_have_been_remove')).flash(2, function () {
                        $this.fadeOut();
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

        //点赞
        var $voteAction = $this.find('[data-action="vote"]');
        var voteLock = (0, _buttonLock3.default)($voteAction);
        var $icon = $voteAction.find('.fa');
        $voteAction.on('click', function () {
            if (voteLock.isDisabled()) {
                return false;
            }
            voteLock.lock();
            $icon.removeClass('wobble animated');
            _util2.default.request('comment.vote', replyId).done(function (response) {
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

    //Post Action
    var $postAction = $('[data-role="post-action"]');
    var $removeAction = $postAction.find('[data-action="remove"]');
    var buttonLock = (0, _buttonLock3.default)($removeAction);
    $removeAction.on('click', function () {
        if (buttonLock.isDisabled()) {
            return false;
        }
        buttonLock.lock();
        _util2.default.dialog.confirm(Translator.trans('post.confirm_remove_the_post')).then(function () {
            _util2.default.request('post.delete', window.postId).done(function () {
                _util2.default.dialog.message(Translator.trans('post.post_have_been_remove')).flash(2, function () {
                    location.href = _util2.default.route.getRoutePath('posts');
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

    //投票
    var $voteAction = $('[data-role="vote-post"]');
    var voteButtonLock = (0, _buttonLock3.default)($voteAction);
    $voteAction.on('click', function () {
        if (voteButtonLock.isDisabled()) {
            return false;
        }
        voteButtonLock.lock();
        _util2.default.request('post.vote', window.postId).done(function (response) {
            var $number = $voteAction.find('.number');
            $number.html(response.vote_count);
            if (response.vote_count > 0) {
                $number.removeClass('hidden');
            } else {
                $number.addClass('hidden');
            }
            //已经投票的，变成可投票状态
            if (response.is_voted) {
                $voteAction.removeClass('u-btn-outline-primary').addClass('u-btn-primary');
                $voteAction.data('voted', true);
            } else {
                $voteAction.removeClass('u-btn-primary').addClass('u-btn-outline-primary');
                $voteAction.data('voted', false);
            }
        }).fail(function (response) {
            _util2.default.dialog.message(response.responseJSON.error).flash(3);
        }).always(function () {
            voteButtonLock.release();
        });
    });

    //购买
    var $buy = $('[data-role="buy"]');
    $buy.length > 0 && function () {
        var buttonLock = (0, _buttonLock3.default)($buy);
        var slug = $buy.data('slug');
        $buy.on('click', function () {
            var wait = _util2.default.dialog.wait.ballPulse();
            _util2.default.request('category.follow', { 'slug': slug }).done(function (response) {
                if (response.require_payment) {
                    new _qrcodePayment2.default(response.qrcode);
                    return;
                } else {
                    location.reload();
                }
            }).fail(function (response) {
                _util2.default.dialog.message(response.responseJSON.error).flash();
            }).always(function () {
                wait.close();
                buttonLock.release();
            });
        });
    }($);
}($);

/**
 * 添加文章
 */
var postBody = document.getElementById('post_originalBody');
var $postBody = $(postBody);
$postBody.length > 0 && function ($) {
    var $postTitle = $('#post_title');
    var $addPostForm = $('#add-post-form');
    var $addPostBtn = $('[data-action="add-post"]');

    if (postBody) {
        var simplemde = new _simplemde2.default({
            element: postBody,
            autofocus: true,
            spellChecker: false,
            status: false,
            indentWithTabs: false,
            tabSize: 4,
            autosave: {
                enabled: true,
                uniqueId: 'post_' + (0, _blueimpMd2.default)(location.pathname),
                delay: 1000
            },
            toolbar: ["bold", "italic", "heading", "|", "quote", "code", "table", "horizontal-rule", "unordered-list", "ordered-list", "|", "link", "image", "|", "side-by-side", "fullscreen", "preview", "|", {
                name: 'guide',
                action: 'https://github.com/riku/Markdown-Syntax-CN/blob/master/syntax.md',
                className: 'fa fa-info-circle',
                title: Translator.trans('editor.markdown_synax')
            }]
        });
        new _inlineAttachment2.default(simplemde.codemirror); //处理附件上传的功能

        $addPostBtn.on('click', function () {
            if ($postTitle.val().length === 0 || simplemde.value().length === 0) {
                _util2.default.dialog.message(Translator.trans('post.title_content_cannot_be_empty')).flash();
                return false;
            }
            var buttonLock = (0, _buttonLock3.default)($addPostBtn).lock();
            _util2.default.dialog.confirm(Translator.trans('post.confirm_publish_the_post')).then(function () {
                $addPostForm.submit();
                return true;
            }, function () {
                buttonLock.release();
                return false;
            });
            return false;
        });
    }

    //添加文章验证
    $addPostForm.validate({
        rules: {
            'post[title]': {
                required: true,
                rangelength: [10, 150]
            }
        },
        messages: {
            'post[title]': {
                required: Translator.trans('post.validation.title.required'),
                rangelength: Translator.trans('post.validation.title.length')
            }
        }
    });
}($);
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

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


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

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/codemirror-spell-checker/src/js/spell-checker.js":
/*!***********************************************************************!*\
  !*** ./node_modules/codemirror-spell-checker/src/js/spell-checker.js ***!
  \***********************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Use strict mode (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)



// Requires
var Typo = __webpack_require__(/*! typo-js */ "./node_modules/typo-js/typo.js");


// Create function
function CodeMirrorSpellChecker(options) {
	// Initialize
	options = options || {};


	// Verify
	if(typeof options.codeMirrorInstance !== "function" || typeof options.codeMirrorInstance.defineMode !== "function") {
		console.log("CodeMirror Spell Checker: You must provide an instance of CodeMirror via the option `codeMirrorInstance`");
		return;
	}


	// Because some browsers don't support this functionality yet
	if(!String.prototype.includes) {
		String.prototype.includes = function() {
			"use strict";
			return String.prototype.indexOf.apply(this, arguments) !== -1;
		};
	}


	// Define the new mode
	options.codeMirrorInstance.defineMode("spell-checker", function(config) {
		// Load AFF/DIC data
		if(!CodeMirrorSpellChecker.aff_loading) {
			CodeMirrorSpellChecker.aff_loading = true;
			var xhr_aff = new XMLHttpRequest();
			xhr_aff.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", true);
			xhr_aff.onload = function() {
				if(xhr_aff.readyState === 4 && xhr_aff.status === 200) {
					CodeMirrorSpellChecker.aff_data = xhr_aff.responseText;
					CodeMirrorSpellChecker.num_loaded++;

					if(CodeMirrorSpellChecker.num_loaded == 2) {
						CodeMirrorSpellChecker.typo = new Typo("en_US", CodeMirrorSpellChecker.aff_data, CodeMirrorSpellChecker.dic_data, {
							platform: "any"
						});
					}
				}
			};
			xhr_aff.send(null);
		}

		if(!CodeMirrorSpellChecker.dic_loading) {
			CodeMirrorSpellChecker.dic_loading = true;
			var xhr_dic = new XMLHttpRequest();
			xhr_dic.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", true);
			xhr_dic.onload = function() {
				if(xhr_dic.readyState === 4 && xhr_dic.status === 200) {
					CodeMirrorSpellChecker.dic_data = xhr_dic.responseText;
					CodeMirrorSpellChecker.num_loaded++;

					if(CodeMirrorSpellChecker.num_loaded == 2) {
						CodeMirrorSpellChecker.typo = new Typo("en_US", CodeMirrorSpellChecker.aff_data, CodeMirrorSpellChecker.dic_data, {
							platform: "any"
						});
					}
				}
			};
			xhr_dic.send(null);
		}


		// Define what separates a word
		var rx_word = "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ";


		// Create the overlay and such
		var overlay = {
			token: function(stream) {
				var ch = stream.peek();
				var word = "";

				if(rx_word.includes(ch)) {
					stream.next();
					return null;
				}

				while((ch = stream.peek()) != null && !rx_word.includes(ch)) {
					word += ch;
					stream.next();
				}

				if(CodeMirrorSpellChecker.typo && !CodeMirrorSpellChecker.typo.check(word))
					return "spell-error"; // CSS class: cm-spell-error

				return null;
			}
		};

		var mode = options.codeMirrorInstance.getMode(
			config, config.backdrop || "text/plain"
		);

		return options.codeMirrorInstance.overlayMode(mode, overlay, true);
	});
}


// Initialize data globally to reduce memory consumption
CodeMirrorSpellChecker.num_loaded = 0;
CodeMirrorSpellChecker.aff_loading = false;
CodeMirrorSpellChecker.dic_loading = false;
CodeMirrorSpellChecker.aff_data = "";
CodeMirrorSpellChecker.dic_data = "";
CodeMirrorSpellChecker.typo;


// Export
module.exports = CodeMirrorSpellChecker;

/***/ }),

/***/ "./node_modules/codemirror/addon/display/fullscreen.js":
/*!*************************************************************!*\
  !*** ./node_modules/codemirror/addon/display/fullscreen.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineOption("fullScreen", false, function(cm, val, old) {
    if (old == CodeMirror.Init) old = false;
    if (!old == !val) return;
    if (val) setFullscreen(cm);
    else setNormal(cm);
  });

  function setFullscreen(cm) {
    var wrap = cm.getWrapperElement();
    cm.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset,
                                  width: wrap.style.width, height: wrap.style.height};
    wrap.style.width = "";
    wrap.style.height = "auto";
    wrap.className += " CodeMirror-fullscreen";
    document.documentElement.style.overflow = "hidden";
    cm.refresh();
  }

  function setNormal(cm) {
    var wrap = cm.getWrapperElement();
    wrap.className = wrap.className.replace(/\s*CodeMirror-fullscreen\b/, "");
    document.documentElement.style.overflow = "";
    var info = cm.state.fullScreenRestore;
    wrap.style.width = info.width; wrap.style.height = info.height;
    window.scrollTo(info.scrollLeft, info.scrollTop);
    cm.refresh();
  }
});


/***/ }),

/***/ "./node_modules/codemirror/addon/display/placeholder.js":
/*!**************************************************************!*\
  !*** ./node_modules/codemirror/addon/display/placeholder.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  CodeMirror.defineOption("placeholder", "", function(cm, val, old) {
    var prev = old && old != CodeMirror.Init;
    if (val && !prev) {
      cm.on("blur", onBlur);
      cm.on("change", onChange);
      cm.on("swapDoc", onChange);
      onChange(cm);
    } else if (!val && prev) {
      cm.off("blur", onBlur);
      cm.off("change", onChange);
      cm.off("swapDoc", onChange);
      clearPlaceholder(cm);
      var wrapper = cm.getWrapperElement();
      wrapper.className = wrapper.className.replace(" CodeMirror-empty", "");
    }

    if (val && !cm.hasFocus()) onBlur(cm);
  });

  function clearPlaceholder(cm) {
    if (cm.state.placeholder) {
      cm.state.placeholder.parentNode.removeChild(cm.state.placeholder);
      cm.state.placeholder = null;
    }
  }
  function setPlaceholder(cm) {
    clearPlaceholder(cm);
    var elt = cm.state.placeholder = document.createElement("pre");
    elt.style.cssText = "height: 0; overflow: visible";
    elt.style.direction = cm.getOption("direction");
    elt.className = "CodeMirror-placeholder";
    var placeHolder = cm.getOption("placeholder")
    if (typeof placeHolder == "string") placeHolder = document.createTextNode(placeHolder)
    elt.appendChild(placeHolder)
    cm.display.lineSpace.insertBefore(elt, cm.display.lineSpace.firstChild);
  }

  function onBlur(cm) {
    if (isEmpty(cm)) setPlaceholder(cm);
  }
  function onChange(cm) {
    var wrapper = cm.getWrapperElement(), empty = isEmpty(cm);
    wrapper.className = wrapper.className.replace(" CodeMirror-empty", "") + (empty ? " CodeMirror-empty" : "");

    if (empty) setPlaceholder(cm);
    else clearPlaceholder(cm);
  }

  function isEmpty(cm) {
    return (cm.lineCount() === 1) && (cm.getLine(0) === "");
  }
});


/***/ }),

/***/ "./node_modules/codemirror/addon/edit/continuelist.js":
/*!************************************************************!*\
  !*** ./node_modules/codemirror/addon/edit/continuelist.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var listRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/,
      emptyListRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/,
      unorderedListRE = /[*+-]\s/;

  CodeMirror.commands.newlineAndIndentContinueMarkdownList = function(cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections(), replacements = [];
    for (var i = 0; i < ranges.length; i++) {
      var pos = ranges[i].head;
      var eolState = cm.getStateAfter(pos.line);
      var inList = eolState.list !== false;
      var inQuote = eolState.quote !== 0;

      var line = cm.getLine(pos.line), match = listRE.exec(line);
      var cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch));
      if (!ranges[i].empty() || (!inList && !inQuote) || !match || cursorBeforeBullet) {
        cm.execCommand("newlineAndIndent");
        return;
      }
      if (emptyListRE.test(line)) {
        if (!/>\s*$/.test(line)) cm.replaceRange("", {
          line: pos.line, ch: 0
        }, {
          line: pos.line, ch: pos.ch + 1
        });
        replacements[i] = "\n";
      } else {
        var indent = match[1], after = match[5];
        var numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0);
        var bullet = numbered ? (parseInt(match[3], 10) + 1) + match[4] : match[2].replace("x", " ");
        replacements[i] = "\n" + indent + bullet + after;

        if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
      }
    }

    cm.replaceSelections(replacements);
  };

  // Auto-updating Markdown list numbers when a new item is added to the
  // middle of a list
  function incrementRemainingMarkdownListNumbers(cm, pos) {
    var startLine = pos.line, lookAhead = 0, skipCount = 0;
    var startItem = listRE.exec(cm.getLine(startLine)), startIndent = startItem[1];

    do {
      lookAhead += 1;
      var nextLineNumber = startLine + lookAhead;
      var nextLine = cm.getLine(nextLineNumber), nextItem = listRE.exec(nextLine);

      if (nextItem) {
        var nextIndent = nextItem[1];
        var newNumber = (parseInt(startItem[3], 10) + lookAhead - skipCount);
        var nextNumber = (parseInt(nextItem[3], 10)), itemNumber = nextNumber;

        if (startIndent === nextIndent && !isNaN(nextNumber)) {
          if (newNumber === nextNumber) itemNumber = nextNumber + 1;
          if (newNumber > nextNumber) itemNumber = newNumber + 1;
          cm.replaceRange(
            nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]),
          {
            line: nextLineNumber, ch: 0
          }, {
            line: nextLineNumber, ch: nextLine.length
          });
        } else {
          if (startIndent.length > nextIndent.length) return;
          // This doesn't run if the next line immediatley indents, as it is
          // not clear of the users intention (new indented item or same level)
          if ((startIndent.length < nextIndent.length) && (lookAhead === 1)) return;
          skipCount += 1;
        }
      }
    } while (nextItem);
  }
});


/***/ }),

/***/ "./node_modules/codemirror/addon/mode/overlay.js":
/*!*******************************************************!*\
  !*** ./node_modules/codemirror/addon/mode/overlay.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.overlayMode = function(base, overlay, combine) {
  return {
    startState: function() {
      return {
        base: CodeMirror.startState(base),
        overlay: CodeMirror.startState(overlay),
        basePos: 0, baseCur: null,
        overlayPos: 0, overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function(state) {
      return {
        base: CodeMirror.copyState(base, state.base),
        overlay: CodeMirror.copyState(overlay, state.overlay),
        basePos: state.basePos, baseCur: null,
        overlayPos: state.overlayPos, overlayCur: null
      };
    },

    token: function(stream, state) {
      if (stream != state.streamSeen ||
          Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);

      // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null
      if (state.overlayCur == null) return state.baseCur;
      else if (state.baseCur != null &&
               state.overlay.combineTokens ||
               combine && state.overlay.combineTokens == null)
        return state.baseCur + " " + state.overlayCur;
      else return state.overlayCur;
    },

    indent: base.indent && function(state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,

    innerMode: function(state) { return {state: state.base, mode: base}; },

    blankLine: function(state) {
      var baseToken, overlayToken;
      if (base.blankLine) baseToken = base.blankLine(state.base);
      if (overlay.blankLine) overlayToken = overlay.blankLine(state.overlay);

      return overlayToken == null ?
        baseToken :
        (combine && baseToken != null ? baseToken + " " + overlayToken : overlayToken);
    }
  };
};

});


/***/ }),

/***/ "./node_modules/codemirror/addon/selection/mark-selection.js":
/*!*******************************************************************!*\
  !*** ./node_modules/codemirror/addon/selection/mark-selection.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Because sometimes you need to mark the selected *text*.
//
// Adds an option 'styleSelectedText' which, when enabled, gives
// selected text the CSS class given as option value, or
// "CodeMirror-selectedtext" when the value is not a string.

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineOption("styleSelectedText", false, function(cm, val, old) {
    var prev = old && old != CodeMirror.Init;
    if (val && !prev) {
      cm.state.markedSelection = [];
      cm.state.markedSelectionStyle = typeof val == "string" ? val : "CodeMirror-selectedtext";
      reset(cm);
      cm.on("cursorActivity", onCursorActivity);
      cm.on("change", onChange);
    } else if (!val && prev) {
      cm.off("cursorActivity", onCursorActivity);
      cm.off("change", onChange);
      clear(cm);
      cm.state.markedSelection = cm.state.markedSelectionStyle = null;
    }
  });

  function onCursorActivity(cm) {
    if (cm.state.markedSelection)
      cm.operation(function() { update(cm); });
  }

  function onChange(cm) {
    if (cm.state.markedSelection && cm.state.markedSelection.length)
      cm.operation(function() { clear(cm); });
  }

  var CHUNK_SIZE = 8;
  var Pos = CodeMirror.Pos;
  var cmp = CodeMirror.cmpPos;

  function coverRange(cm, from, to, addAt) {
    if (cmp(from, to) == 0) return;
    var array = cm.state.markedSelection;
    var cls = cm.state.markedSelectionStyle;
    for (var line = from.line;;) {
      var start = line == from.line ? from : Pos(line, 0);
      var endLine = line + CHUNK_SIZE, atEnd = endLine >= to.line;
      var end = atEnd ? to : Pos(endLine, 0);
      var mark = cm.markText(start, end, {className: cls});
      if (addAt == null) array.push(mark);
      else array.splice(addAt++, 0, mark);
      if (atEnd) break;
      line = endLine;
    }
  }

  function clear(cm) {
    var array = cm.state.markedSelection;
    for (var i = 0; i < array.length; ++i) array[i].clear();
    array.length = 0;
  }

  function reset(cm) {
    clear(cm);
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++)
      coverRange(cm, ranges[i].from(), ranges[i].to());
  }

  function update(cm) {
    if (!cm.somethingSelected()) return clear(cm);
    if (cm.listSelections().length > 1) return reset(cm);

    var from = cm.getCursor("start"), to = cm.getCursor("end");

    var array = cm.state.markedSelection;
    if (!array.length) return coverRange(cm, from, to);

    var coverStart = array[0].find(), coverEnd = array[array.length - 1].find();
    if (!coverStart || !coverEnd || to.line - from.line <= CHUNK_SIZE ||
        cmp(from, coverEnd.to) >= 0 || cmp(to, coverStart.from) <= 0)
      return reset(cm);

    while (cmp(from, coverStart.from) > 0) {
      array.shift().clear();
      coverStart = array[0].find();
    }
    if (cmp(from, coverStart.from) < 0) {
      if (coverStart.to.line - from.line < CHUNK_SIZE) {
        array.shift().clear();
        coverRange(cm, from, coverStart.to, 0);
      } else {
        coverRange(cm, from, coverStart.from, 0);
      }
    }

    while (cmp(to, coverEnd.to) < 0) {
      array.pop().clear();
      coverEnd = array[array.length - 1].find();
    }
    if (cmp(to, coverEnd.to) > 0) {
      if (to.line - coverEnd.from.line < CHUNK_SIZE) {
        array.pop().clear();
        coverRange(cm, coverEnd.from, to);
      } else {
        coverRange(cm, coverEnd.to, to);
      }
    }
  }
});


/***/ }),

/***/ "./node_modules/codemirror/mode/gfm/gfm.js":
/*!*************************************************!*\
  !*** ./node_modules/codemirror/mode/gfm/gfm.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(/*! ../../lib/codemirror */ "./node_modules/codemirror/lib/codemirror.js"), __webpack_require__(/*! ../markdown/markdown */ "./node_modules/codemirror/mode/markdown/markdown.js"), __webpack_require__(/*! ../../addon/mode/overlay */ "./node_modules/codemirror/addon/mode/overlay.js"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../markdown/markdown", "../../addon/mode/overlay"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i

CodeMirror.defineMode("gfm", function(config, modeConfig) {
  var codeDepth = 0;
  function blankLine(state) {
    state.code = false;
    return null;
  }
  var gfmOverlay = {
    startState: function() {
      return {
        code: false,
        codeBlock: false,
        ateSpace: false
      };
    },
    copyState: function(s) {
      return {
        code: s.code,
        codeBlock: s.codeBlock,
        ateSpace: s.ateSpace
      };
    },
    token: function(stream, state) {
      state.combineTokens = null;

      // Hack to prevent formatting override inside code blocks (block and inline)
      if (state.codeBlock) {
        if (stream.match(/^```+/)) {
          state.codeBlock = false;
          return null;
        }
        stream.skipToEnd();
        return null;
      }
      if (stream.sol()) {
        state.code = false;
      }
      if (stream.sol() && stream.match(/^```+/)) {
        stream.skipToEnd();
        state.codeBlock = true;
        return null;
      }
      // If this block is changed, it may need to be updated in Markdown mode
      if (stream.peek() === '`') {
        stream.next();
        var before = stream.pos;
        stream.eatWhile('`');
        var difference = 1 + stream.pos - before;
        if (!state.code) {
          codeDepth = difference;
          state.code = true;
        } else {
          if (difference === codeDepth) { // Must be exact
            state.code = false;
          }
        }
        return null;
      } else if (state.code) {
        stream.next();
        return null;
      }
      // Check if space. If so, links can be formatted later on
      if (stream.eatSpace()) {
        state.ateSpace = true;
        return null;
      }
      if (stream.sol() || state.ateSpace) {
        state.ateSpace = false;
        if (modeConfig.gitHubSpice !== false) {
          if(stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?=.{0,6}\d)(?:[a-f0-9]{7,40}\b)/)) {
            // User/Project@SHA
            // User@SHA
            // SHA
            state.combineTokens = true;
            return "link";
          } else if (stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) {
            // User/Project#Num
            // User#Num
            // #Num
            state.combineTokens = true;
            return "link";
          }
        }
      }
      if (stream.match(urlRE) &&
          stream.string.slice(stream.start - 2, stream.start) != "](" &&
          (stream.start == 0 || /\W/.test(stream.string.charAt(stream.start - 1)))) {
        // URLs
        // Taken from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        // And then (issue #1160) simplified to make it not crash the Chrome Regexp engine
        // And then limited url schemes to the CommonMark list, so foo:bar isn't matched as a URL
        state.combineTokens = true;
        return "link";
      }
      stream.next();
      return null;
    },
    blankLine: blankLine
  };

  var markdownConfig = {
    taskLists: true,
    strikethrough: true,
    emoji: true
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = "markdown";
  return CodeMirror.overlayMode(CodeMirror.getMode(config, markdownConfig), gfmOverlay);

}, "markdown");

  CodeMirror.defineMIME("text/x-gfm", "gfm");
});


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

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
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

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


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

/***/ "./node_modules/simplemde/src/js/codemirror/tablist.js":
/*!*************************************************************!*\
  !*** ./node_modules/simplemde/src/js/codemirror/tablist.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

var CodeMirror = __webpack_require__(/*! codemirror */ "./node_modules/codemirror/lib/codemirror.js");

CodeMirror.commands.tabAndIndentMarkdownList = function (cm) {
	var ranges = cm.listSelections();
	var pos = ranges[0].head;
	var eolState = cm.getStateAfter(pos.line);
	var inList = eolState.list !== false;

	if (inList) {
		cm.execCommand("indentMore");
		return;
	}

	if (cm.options.indentWithTabs) {
		cm.execCommand("insertTab");
	}
	else {
		var spaces = Array(cm.options.tabSize + 1).join(" ");
		cm.replaceSelection(spaces);
	}
};

CodeMirror.commands.shiftTabAndUnindentMarkdownList = function (cm) {
	var ranges = cm.listSelections();
	var pos = ranges[0].head;
	var eolState = cm.getStateAfter(pos.line);
	var inList = eolState.list !== false;

	if (inList) {
		cm.execCommand("indentLess");
		return;
	}

	if (cm.options.indentWithTabs) {
		cm.execCommand("insertTab");
	}
	else {
		var spaces = Array(cm.options.tabSize + 1).join(" ");
		cm.replaceSelection(spaces);
	}
};


/***/ }),

/***/ "./node_modules/simplemde/src/js/simplemde.js":
/*!****************************************************!*\
  !*** ./node_modules/simplemde/src/js/simplemde.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*global require,module*/

var CodeMirror = __webpack_require__(/*! codemirror */ "./node_modules/codemirror/lib/codemirror.js");
__webpack_require__(/*! codemirror/addon/edit/continuelist.js */ "./node_modules/codemirror/addon/edit/continuelist.js");
__webpack_require__(/*! ./codemirror/tablist */ "./node_modules/simplemde/src/js/codemirror/tablist.js");
__webpack_require__(/*! codemirror/addon/display/fullscreen.js */ "./node_modules/codemirror/addon/display/fullscreen.js");
__webpack_require__(/*! codemirror/mode/markdown/markdown.js */ "./node_modules/codemirror/mode/markdown/markdown.js");
__webpack_require__(/*! codemirror/addon/mode/overlay.js */ "./node_modules/codemirror/addon/mode/overlay.js");
__webpack_require__(/*! codemirror/addon/display/placeholder.js */ "./node_modules/codemirror/addon/display/placeholder.js");
__webpack_require__(/*! codemirror/addon/selection/mark-selection.js */ "./node_modules/codemirror/addon/selection/mark-selection.js");
__webpack_require__(/*! codemirror/mode/gfm/gfm.js */ "./node_modules/codemirror/mode/gfm/gfm.js");
__webpack_require__(/*! codemirror/mode/xml/xml.js */ "./node_modules/codemirror/mode/xml/xml.js");
var CodeMirrorSpellChecker = __webpack_require__(/*! codemirror-spell-checker */ "./node_modules/codemirror-spell-checker/src/js/spell-checker.js");
var marked = __webpack_require__(/*! marked */ "./node_modules/marked/lib/marked.js");


// Some variables
var isMac = /Mac/.test(navigator.platform);

// Mapping of actions that can be bound to keyboard shortcuts or toolbar buttons
var bindings = {
	"toggleBold": toggleBold,
	"toggleItalic": toggleItalic,
	"drawLink": drawLink,
	"toggleHeadingSmaller": toggleHeadingSmaller,
	"toggleHeadingBigger": toggleHeadingBigger,
	"drawImage": drawImage,
	"toggleBlockquote": toggleBlockquote,
	"toggleOrderedList": toggleOrderedList,
	"toggleUnorderedList": toggleUnorderedList,
	"toggleCodeBlock": toggleCodeBlock,
	"togglePreview": togglePreview,
	"toggleStrikethrough": toggleStrikethrough,
	"toggleHeading1": toggleHeading1,
	"toggleHeading2": toggleHeading2,
	"toggleHeading3": toggleHeading3,
	"cleanBlock": cleanBlock,
	"drawTable": drawTable,
	"drawHorizontalRule": drawHorizontalRule,
	"undo": undo,
	"redo": redo,
	"toggleSideBySide": toggleSideBySide,
	"toggleFullScreen": toggleFullScreen
};

var shortcuts = {
	"toggleBold": "Cmd-B",
	"toggleItalic": "Cmd-I",
	"drawLink": "Cmd-K",
	"toggleHeadingSmaller": "Cmd-H",
	"toggleHeadingBigger": "Shift-Cmd-H",
	"cleanBlock": "Cmd-E",
	"drawImage": "Cmd-Alt-I",
	"toggleBlockquote": "Cmd-'",
	"toggleOrderedList": "Cmd-Alt-L",
	"toggleUnorderedList": "Cmd-L",
	"toggleCodeBlock": "Cmd-Alt-C",
	"togglePreview": "Cmd-P",
	"toggleSideBySide": "F9",
	"toggleFullScreen": "F11"
};

var getBindingName = function(f) {
	for(var key in bindings) {
		if(bindings[key] === f) {
			return key;
		}
	}
	return null;
};

var isMobile = function() {
	var check = false;
	(function(a) {
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};


/**
 * Fix shortcut. Mac use Command, others use Ctrl.
 */
function fixShortcut(name) {
	if(isMac) {
		name = name.replace("Ctrl", "Cmd");
	} else {
		name = name.replace("Cmd", "Ctrl");
	}
	return name;
}


/**
 * Create icon element for toolbar.
 */
function createIcon(options, enableTooltips, shortcuts) {
	options = options || {};
	var el = document.createElement("a");
	enableTooltips = (enableTooltips == undefined) ? true : enableTooltips;

	if(options.title && enableTooltips) {
		el.title = createTootlip(options.title, options.action, shortcuts);

		if(isMac) {
			el.title = el.title.replace("Ctrl", "⌘");
			el.title = el.title.replace("Alt", "⌥");
		}
	}

	el.tabIndex = -1;
	el.className = options.className;
	return el;
}

function createSep() {
	var el = document.createElement("i");
	el.className = "separator";
	el.innerHTML = "|";
	return el;
}

function createTootlip(title, action, shortcuts) {
	var actionName;
	var tooltip = title;

	if(action) {
		actionName = getBindingName(action);
		if(shortcuts[actionName]) {
			tooltip += " (" + fixShortcut(shortcuts[actionName]) + ")";
		}
	}

	return tooltip;
}

/**
 * The state of CodeMirror at the given position.
 */
function getState(cm, pos) {
	pos = pos || cm.getCursor("start");
	var stat = cm.getTokenAt(pos);
	if(!stat.type) return {};

	var types = stat.type.split(" ");

	var ret = {},
		data, text;
	for(var i = 0; i < types.length; i++) {
		data = types[i];
		if(data === "strong") {
			ret.bold = true;
		} else if(data === "variable-2") {
			text = cm.getLine(pos.line);
			if(/^\s*\d+\.\s/.test(text)) {
				ret["ordered-list"] = true;
			} else {
				ret["unordered-list"] = true;
			}
		} else if(data === "atom") {
			ret.quote = true;
		} else if(data === "em") {
			ret.italic = true;
		} else if(data === "quote") {
			ret.quote = true;
		} else if(data === "strikethrough") {
			ret.strikethrough = true;
		} else if(data === "comment") {
			ret.code = true;
		} else if(data === "link") {
			ret.link = true;
		} else if(data === "tag") {
			ret.image = true;
		} else if(data.match(/^header(\-[1-6])?$/)) {
			ret[data.replace("header", "heading")] = true;
		}
	}
	return ret;
}


// Saved overflow setting
var saved_overflow = "";

/**
 * Toggle full screen of the editor.
 */
function toggleFullScreen(editor) {
	// Set fullscreen
	var cm = editor.codemirror;
	cm.setOption("fullScreen", !cm.getOption("fullScreen"));


	// Prevent scrolling on body during fullscreen active
	if(cm.getOption("fullScreen")) {
		saved_overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = saved_overflow;
	}


	// Update toolbar class
	var wrap = cm.getWrapperElement();

	if(!/fullscreen/.test(wrap.previousSibling.className)) {
		wrap.previousSibling.className += " fullscreen";
	} else {
		wrap.previousSibling.className = wrap.previousSibling.className.replace(/\s*fullscreen\b/, "");
	}


	// Update toolbar button
	var toolbarButton = editor.toolbarElements.fullscreen;

	if(!/active/.test(toolbarButton.className)) {
		toolbarButton.className += " active";
	} else {
		toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
	}


	// Hide side by side if needed
	var sidebyside = cm.getWrapperElement().nextSibling;
	if(/editor-preview-active-side/.test(sidebyside.className))
		toggleSideBySide(editor);
}


/**
 * Action for toggling bold.
 */
function toggleBold(editor) {
	_toggleBlock(editor, "bold", editor.options.blockStyles.bold);
}


/**
 * Action for toggling italic.
 */
function toggleItalic(editor) {
	_toggleBlock(editor, "italic", editor.options.blockStyles.italic);
}


/**
 * Action for toggling strikethrough.
 */
function toggleStrikethrough(editor) {
	_toggleBlock(editor, "strikethrough", "~~");
}

/**
 * Action for toggling code block.
 */
function toggleCodeBlock(editor) {
	var fenceCharsToInsert = editor.options.blockStyles.code;

	function fencing_line(line) {
		/* return true, if this is a ``` or ~~~ line */
		if(typeof line !== "object") {
			throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " + typeof line + ": " + line;
		}
		return line.styles && line.styles[2] && line.styles[2].indexOf("formatting-code-block") !== -1;
	}

	function token_state(token) {
		// base goes an extra level deep when mode backdrops are used, e.g. spellchecker on
		return token.state.base.base || token.state.base;
	}

	function code_type(cm, line_num, line, firstTok, lastTok) {
		/*
		 * Return "single", "indented", "fenced" or false
		 *
		 * cm and line_num are required.  Others are optional for efficiency
		 *   To check in the middle of a line, pass in firstTok yourself.
		 */
		line = line || cm.getLineHandle(line_num);
		firstTok = firstTok || cm.getTokenAt({
			line: line_num,
			ch: 1
		});
		lastTok = lastTok || (!!line.text && cm.getTokenAt({
			line: line_num,
			ch: line.text.length - 1
		}));
		var types = firstTok.type ? firstTok.type.split(" ") : [];
		if(lastTok && token_state(lastTok).indentedCode) {
			// have to check last char, since first chars of first line aren"t marked as indented
			return "indented";
		} else if(types.indexOf("comment") === -1) {
			// has to be after "indented" check, since first chars of first indented line aren"t marked as such
			return false;
		} else if(token_state(firstTok).fencedChars || token_state(lastTok).fencedChars || fencing_line(line)) {
			return "fenced";
		} else {
			return "single";
		}
	}

	function insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert) {
		var start_line_sel = cur_start.line + 1,
			end_line_sel = cur_end.line + 1,
			sel_multi = cur_start.line !== cur_end.line,
			repl_start = fenceCharsToInsert + "\n",
			repl_end = "\n" + fenceCharsToInsert;
		if(sel_multi) {
			end_line_sel++;
		}
		// handle last char including \n or not
		if(sel_multi && cur_end.ch === 0) {
			repl_end = fenceCharsToInsert + "\n";
			end_line_sel--;
		}
		_replaceSelection(cm, false, [repl_start, repl_end]);
		cm.setSelection({
			line: start_line_sel,
			ch: 0
		}, {
			line: end_line_sel,
			ch: 0
		});
	}

	var cm = editor.codemirror,
		cur_start = cm.getCursor("start"),
		cur_end = cm.getCursor("end"),
		tok = cm.getTokenAt({
			line: cur_start.line,
			ch: cur_start.ch || 1
		}), // avoid ch 0 which is a cursor pos but not token
		line = cm.getLineHandle(cur_start.line),
		is_code = code_type(cm, cur_start.line, line, tok);
	var block_start, block_end, lineCount;

	if(is_code === "single") {
		// similar to some SimpleMDE _toggleBlock logic
		var start = line.text.slice(0, cur_start.ch).replace("`", ""),
			end = line.text.slice(cur_start.ch).replace("`", "");
		cm.replaceRange(start + end, {
			line: cur_start.line,
			ch: 0
		}, {
			line: cur_start.line,
			ch: 99999999999999
		});
		cur_start.ch--;
		if(cur_start !== cur_end) {
			cur_end.ch--;
		}
		cm.setSelection(cur_start, cur_end);
		cm.focus();
	} else if(is_code === "fenced") {
		if(cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
			// use selection

			// find the fenced line so we know what type it is (tilde, backticks, number of them)
			for(block_start = cur_start.line; block_start >= 0; block_start--) {
				line = cm.getLineHandle(block_start);
				if(fencing_line(line)) {
					break;
				}
			}
			var fencedTok = cm.getTokenAt({
				line: block_start,
				ch: 1
			});
			var fence_chars = token_state(fencedTok).fencedChars;
			var start_text, start_line;
			var end_text, end_line;
			// check for selection going up against fenced lines, in which case we don't want to add more fencing
			if(fencing_line(cm.getLineHandle(cur_start.line))) {
				start_text = "";
				start_line = cur_start.line;
			} else if(fencing_line(cm.getLineHandle(cur_start.line - 1))) {
				start_text = "";
				start_line = cur_start.line - 1;
			} else {
				start_text = fence_chars + "\n";
				start_line = cur_start.line;
			}
			if(fencing_line(cm.getLineHandle(cur_end.line))) {
				end_text = "";
				end_line = cur_end.line;
				if(cur_end.ch === 0) {
					end_line += 1;
				}
			} else if(cur_end.ch !== 0 && fencing_line(cm.getLineHandle(cur_end.line + 1))) {
				end_text = "";
				end_line = cur_end.line + 1;
			} else {
				end_text = fence_chars + "\n";
				end_line = cur_end.line + 1;
			}
			if(cur_end.ch === 0) {
				// full last line selected, putting cursor at beginning of next
				end_line -= 1;
			}
			cm.operation(function() {
				// end line first, so that line numbers don't change
				cm.replaceRange(end_text, {
					line: end_line,
					ch: 0
				}, {
					line: end_line + (end_text ? 0 : 1),
					ch: 0
				});
				cm.replaceRange(start_text, {
					line: start_line,
					ch: 0
				}, {
					line: start_line + (start_text ? 0 : 1),
					ch: 0
				});
			});
			cm.setSelection({
				line: start_line + (start_text ? 1 : 0),
				ch: 0
			}, {
				line: end_line + (start_text ? 1 : -1),
				ch: 0
			});
			cm.focus();
		} else {
			// no selection, search for ends of this fenced block
			var search_from = cur_start.line;
			if(fencing_line(cm.getLineHandle(cur_start.line))) { // gets a little tricky if cursor is right on a fenced line
				if(code_type(cm, cur_start.line + 1) === "fenced") {
					block_start = cur_start.line;
					search_from = cur_start.line + 1; // for searching for "end"
				} else {
					block_end = cur_start.line;
					search_from = cur_start.line - 1; // for searching for "start"
				}
			}
			if(block_start === undefined) {
				for(block_start = search_from; block_start >= 0; block_start--) {
					line = cm.getLineHandle(block_start);
					if(fencing_line(line)) {
						break;
					}
				}
			}
			if(block_end === undefined) {
				lineCount = cm.lineCount();
				for(block_end = search_from; block_end < lineCount; block_end++) {
					line = cm.getLineHandle(block_end);
					if(fencing_line(line)) {
						break;
					}
				}
			}
			cm.operation(function() {
				cm.replaceRange("", {
					line: block_start,
					ch: 0
				}, {
					line: block_start + 1,
					ch: 0
				});
				cm.replaceRange("", {
					line: block_end - 1,
					ch: 0
				}, {
					line: block_end,
					ch: 0
				});
			});
			cm.focus();
		}
	} else if(is_code === "indented") {
		if(cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch) {
			// use selection
			block_start = cur_start.line;
			block_end = cur_end.line;
			if(cur_end.ch === 0) {
				block_end--;
			}
		} else {
			// no selection, search for ends of this indented block
			for(block_start = cur_start.line; block_start >= 0; block_start--) {
				line = cm.getLineHandle(block_start);
				if(line.text.match(/^\s*$/)) {
					// empty or all whitespace - keep going
					continue;
				} else {
					if(code_type(cm, block_start, line) !== "indented") {
						block_start += 1;
						break;
					}
				}
			}
			lineCount = cm.lineCount();
			for(block_end = cur_start.line; block_end < lineCount; block_end++) {
				line = cm.getLineHandle(block_end);
				if(line.text.match(/^\s*$/)) {
					// empty or all whitespace - keep going
					continue;
				} else {
					if(code_type(cm, block_end, line) !== "indented") {
						block_end -= 1;
						break;
					}
				}
			}
		}
		// if we are going to un-indent based on a selected set of lines, and the next line is indented too, we need to
		// insert a blank line so that the next line(s) continue to be indented code
		var next_line = cm.getLineHandle(block_end + 1),
			next_line_last_tok = next_line && cm.getTokenAt({
				line: block_end + 1,
				ch: next_line.text.length - 1
			}),
			next_line_indented = next_line_last_tok && token_state(next_line_last_tok).indentedCode;
		if(next_line_indented) {
			cm.replaceRange("\n", {
				line: block_end + 1,
				ch: 0
			});
		}

		for(var i = block_start; i <= block_end; i++) {
			cm.indentLine(i, "subtract"); // TODO: this doesn't get tracked in the history, so can't be undone :(
		}
		cm.focus();
	} else {
		// insert code formatting
		var no_sel_and_starting_of_line = (cur_start.line === cur_end.line && cur_start.ch === cur_end.ch && cur_start.ch === 0);
		var sel_multi = cur_start.line !== cur_end.line;
		if(no_sel_and_starting_of_line || sel_multi) {
			insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert);
		} else {
			_replaceSelection(cm, false, ["`", "`"]);
		}
	}
}

/**
 * Action for toggling blockquote.
 */
function toggleBlockquote(editor) {
	var cm = editor.codemirror;
	_toggleLine(cm, "quote");
}

/**
 * Action for toggling heading size: normal -> h1 -> h2 -> h3 -> h4 -> h5 -> h6 -> normal
 */
function toggleHeadingSmaller(editor) {
	var cm = editor.codemirror;
	_toggleHeading(cm, "smaller");
}

/**
 * Action for toggling heading size: normal -> h6 -> h5 -> h4 -> h3 -> h2 -> h1 -> normal
 */
function toggleHeadingBigger(editor) {
	var cm = editor.codemirror;
	_toggleHeading(cm, "bigger");
}

/**
 * Action for toggling heading size 1
 */
function toggleHeading1(editor) {
	var cm = editor.codemirror;
	_toggleHeading(cm, undefined, 1);
}

/**
 * Action for toggling heading size 2
 */
function toggleHeading2(editor) {
	var cm = editor.codemirror;
	_toggleHeading(cm, undefined, 2);
}

/**
 * Action for toggling heading size 3
 */
function toggleHeading3(editor) {
	var cm = editor.codemirror;
	_toggleHeading(cm, undefined, 3);
}


/**
 * Action for toggling ul.
 */
function toggleUnorderedList(editor) {
	var cm = editor.codemirror;
	_toggleLine(cm, "unordered-list");
}


/**
 * Action for toggling ol.
 */
function toggleOrderedList(editor) {
	var cm = editor.codemirror;
	_toggleLine(cm, "ordered-list");
}

/**
 * Action for clean block (remove headline, list, blockquote code, markers)
 */
function cleanBlock(editor) {
	var cm = editor.codemirror;
	_cleanBlock(cm);
}

/**
 * Action for drawing a link.
 */
function drawLink(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	var url = "http://";
	if(options.promptURLs) {
		url = prompt(options.promptTexts.link);
		if(!url) {
			return false;
		}
	}
	_replaceSelection(cm, stat.link, options.insertTexts.link, url);
}

/**
 * Action for drawing an img.
 */
function drawImage(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	var url = "http://";
	if(options.promptURLs) {
		url = prompt(options.promptTexts.image);
		if(!url) {
			return false;
		}
	}
	_replaceSelection(cm, stat.image, options.insertTexts.image, url);
}

/**
 * Action for drawing a table.
 */
function drawTable(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	_replaceSelection(cm, stat.table, options.insertTexts.table);
}

/**
 * Action for drawing a horizontal rule.
 */
function drawHorizontalRule(editor) {
	var cm = editor.codemirror;
	var stat = getState(cm);
	var options = editor.options;
	_replaceSelection(cm, stat.image, options.insertTexts.horizontalRule);
}


/**
 * Undo action.
 */
function undo(editor) {
	var cm = editor.codemirror;
	cm.undo();
	cm.focus();
}


/**
 * Redo action.
 */
function redo(editor) {
	var cm = editor.codemirror;
	cm.redo();
	cm.focus();
}


/**
 * Toggle side by side preview
 */
function toggleSideBySide(editor) {
	var cm = editor.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;
	var toolbarButton = editor.toolbarElements["side-by-side"];
	var useSideBySideListener = false;
	if(/editor-preview-active-side/.test(preview.className)) {
		preview.className = preview.className.replace(
			/\s*editor-preview-active-side\s*/g, ""
		);
		toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
		wrapper.className = wrapper.className.replace(/\s*CodeMirror-sided\s*/g, " ");
	} else {
		// When the preview button is clicked for the first time,
		// give some time for the transition from editor.css to fire and the view to slide from right to left,
		// instead of just appearing.
		setTimeout(function() {
			if(!cm.getOption("fullScreen"))
				toggleFullScreen(editor);
			preview.className += " editor-preview-active-side";
		}, 1);
		toolbarButton.className += " active";
		wrapper.className += " CodeMirror-sided";
		useSideBySideListener = true;
	}

	// Hide normal preview if active
	var previewNormal = wrapper.lastChild;
	if(/editor-preview-active/.test(previewNormal.className)) {
		previewNormal.className = previewNormal.className.replace(
			/\s*editor-preview-active\s*/g, ""
		);
		var toolbar = editor.toolbarElements.preview;
		var toolbar_div = wrapper.previousSibling;
		toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
		toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
	}

	var sideBySideRenderingFunction = function() {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
	};

	if(!cm.sideBySideRenderingFunction) {
		cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
	}

	if(useSideBySideListener) {
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);
		cm.on("update", cm.sideBySideRenderingFunction);
	} else {
		cm.off("update", cm.sideBySideRenderingFunction);
	}

	// Refresh to fix selection being off (#309)
	cm.refresh();
}


/**
 * Preview action.
 */
function togglePreview(editor) {
	var cm = editor.codemirror;
	var wrapper = cm.getWrapperElement();
	var toolbar_div = wrapper.previousSibling;
	var toolbar = editor.options.toolbar ? editor.toolbarElements.preview : false;
	var preview = wrapper.lastChild;
	if(!preview || !/editor-preview/.test(preview.className)) {
		preview = document.createElement("div");
		preview.className = "editor-preview";
		wrapper.appendChild(preview);
	}
	if(/editor-preview-active/.test(preview.className)) {
		preview.className = preview.className.replace(
			/\s*editor-preview-active\s*/g, ""
		);
		if(toolbar) {
			toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
			toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
		}
	} else {
		// When the preview button is clicked for the first time,
		// give some time for the transition from editor.css to fire and the view to slide from right to left,
		// instead of just appearing.
		setTimeout(function() {
			preview.className += " editor-preview-active";
		}, 1);
		if(toolbar) {
			toolbar.className += " active";
			toolbar_div.className += " disabled-for-preview";
		}
	}
	preview.innerHTML = editor.options.previewRender(editor.value(), preview);

	// Turn off side by side if needed
	var sidebyside = cm.getWrapperElement().nextSibling;
	if(/editor-preview-active-side/.test(sidebyside.className))
		toggleSideBySide(editor);
}

function _replaceSelection(cm, active, startEnd, url) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var text;
	var start = startEnd[0];
	var end = startEnd[1];
	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	if(url) {
		end = end.replace("#url#", url);
	}
	if(active) {
		text = cm.getLine(startPoint.line);
		start = text.slice(0, startPoint.ch);
		end = text.slice(startPoint.ch);
		cm.replaceRange(start + end, {
			line: startPoint.line,
			ch: 0
		});
	} else {
		text = cm.getSelection();
		cm.replaceSelection(start + text + end);

		startPoint.ch += start.length;
		if(startPoint !== endPoint) {
			endPoint.ch += start.length;
		}
	}
	cm.setSelection(startPoint, endPoint);
	cm.focus();
}


function _toggleHeading(cm, direction, size) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	for(var i = startPoint.line; i <= endPoint.line; i++) {
		(function(i) {
			var text = cm.getLine(i);
			var currHeadingLevel = text.search(/[^#]/);

			if(direction !== undefined) {
				if(currHeadingLevel <= 0) {
					if(direction == "bigger") {
						text = "###### " + text;
					} else {
						text = "# " + text;
					}
				} else if(currHeadingLevel == 6 && direction == "smaller") {
					text = text.substr(7);
				} else if(currHeadingLevel == 1 && direction == "bigger") {
					text = text.substr(2);
				} else {
					if(direction == "bigger") {
						text = text.substr(1);
					} else {
						text = "#" + text;
					}
				}
			} else {
				if(size == 1) {
					if(currHeadingLevel <= 0) {
						text = "# " + text;
					} else if(currHeadingLevel == size) {
						text = text.substr(currHeadingLevel + 1);
					} else {
						text = "# " + text.substr(currHeadingLevel + 1);
					}
				} else if(size == 2) {
					if(currHeadingLevel <= 0) {
						text = "## " + text;
					} else if(currHeadingLevel == size) {
						text = text.substr(currHeadingLevel + 1);
					} else {
						text = "## " + text.substr(currHeadingLevel + 1);
					}
				} else {
					if(currHeadingLevel <= 0) {
						text = "### " + text;
					} else if(currHeadingLevel == size) {
						text = text.substr(currHeadingLevel + 1);
					} else {
						text = "### " + text.substr(currHeadingLevel + 1);
					}
				}
			}

			cm.replaceRange(text, {
				line: i,
				ch: 0
			}, {
				line: i,
				ch: 99999999999999
			});
		})(i);
	}
	cm.focus();
}


function _toggleLine(cm, name) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var stat = getState(cm);
	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	var repl = {
		"quote": /^(\s*)\>\s+/,
		"unordered-list": /^(\s*)(\*|\-|\+)\s+/,
		"ordered-list": /^(\s*)\d+\.\s+/
	};
	var map = {
		"quote": "> ",
		"unordered-list": "* ",
		"ordered-list": "1. "
	};
	for(var i = startPoint.line; i <= endPoint.line; i++) {
		(function(i) {
			var text = cm.getLine(i);
			if(stat[name]) {
				text = text.replace(repl[name], "$1");
			} else {
				text = map[name] + text;
			}
			cm.replaceRange(text, {
				line: i,
				ch: 0
			}, {
				line: i,
				ch: 99999999999999
			});
		})(i);
	}
	cm.focus();
}

function _toggleBlock(editor, type, start_chars, end_chars) {
	if(/editor-preview-active/.test(editor.codemirror.getWrapperElement().lastChild.className))
		return;

	end_chars = (typeof end_chars === "undefined") ? start_chars : end_chars;
	var cm = editor.codemirror;
	var stat = getState(cm);

	var text;
	var start = start_chars;
	var end = end_chars;

	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");

	if(stat[type]) {
		text = cm.getLine(startPoint.line);
		start = text.slice(0, startPoint.ch);
		end = text.slice(startPoint.ch);
		if(type == "bold") {
			start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
			end = end.replace(/(\*\*|__)/, "");
		} else if(type == "italic") {
			start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
			end = end.replace(/(\*|_)/, "");
		} else if(type == "strikethrough") {
			start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
			end = end.replace(/(\*\*|~~)/, "");
		}
		cm.replaceRange(start + end, {
			line: startPoint.line,
			ch: 0
		}, {
			line: startPoint.line,
			ch: 99999999999999
		});

		if(type == "bold" || type == "strikethrough") {
			startPoint.ch -= 2;
			if(startPoint !== endPoint) {
				endPoint.ch -= 2;
			}
		} else if(type == "italic") {
			startPoint.ch -= 1;
			if(startPoint !== endPoint) {
				endPoint.ch -= 1;
			}
		}
	} else {
		text = cm.getSelection();
		if(type == "bold") {
			text = text.split("**").join("");
			text = text.split("__").join("");
		} else if(type == "italic") {
			text = text.split("*").join("");
			text = text.split("_").join("");
		} else if(type == "strikethrough") {
			text = text.split("~~").join("");
		}
		cm.replaceSelection(start + text + end);

		startPoint.ch += start_chars.length;
		endPoint.ch = startPoint.ch + text.length;
	}

	cm.setSelection(startPoint, endPoint);
	cm.focus();
}

function _cleanBlock(cm) {
	if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
		return;

	var startPoint = cm.getCursor("start");
	var endPoint = cm.getCursor("end");
	var text;

	for(var line = startPoint.line; line <= endPoint.line; line++) {
		text = cm.getLine(line);
		text = text.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, "");

		cm.replaceRange(text, {
			line: line,
			ch: 0
		}, {
			line: line,
			ch: 99999999999999
		});
	}
}

// Merge the properties of one object into another.
function _mergeProperties(target, source) {
	for(var property in source) {
		if(source.hasOwnProperty(property)) {
			if(source[property] instanceof Array) {
				target[property] = source[property].concat(target[property] instanceof Array ? target[property] : []);
			} else if(
				source[property] !== null &&
				typeof source[property] === "object" &&
				source[property].constructor === Object
			) {
				target[property] = _mergeProperties(target[property] || {}, source[property]);
			} else {
				target[property] = source[property];
			}
		}
	}

	return target;
}

// Merge an arbitrary number of objects into one.
function extend(target) {
	for(var i = 1; i < arguments.length; i++) {
		target = _mergeProperties(target, arguments[i]);
	}

	return target;
}

/* The right word count in respect for CJK. */
function wordCount(data) {
	var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
	var m = data.match(pattern);
	var count = 0;
	if(m === null) return count;
	for(var i = 0; i < m.length; i++) {
		if(m[i].charCodeAt(0) >= 0x4E00) {
			count += m[i].length;
		} else {
			count += 1;
		}
	}
	return count;
}

var toolbarBuiltInButtons = {
	"bold": {
		name: "bold",
		action: toggleBold,
		className: "fa fa-bold",
		title: "Bold",
		default: true
	},
	"italic": {
		name: "italic",
		action: toggleItalic,
		className: "fa fa-italic",
		title: "Italic",
		default: true
	},
	"strikethrough": {
		name: "strikethrough",
		action: toggleStrikethrough,
		className: "fa fa-strikethrough",
		title: "Strikethrough"
	},
	"heading": {
		name: "heading",
		action: toggleHeadingSmaller,
		className: "fa fa-header",
		title: "Heading",
		default: true
	},
	"heading-smaller": {
		name: "heading-smaller",
		action: toggleHeadingSmaller,
		className: "fa fa-header fa-header-x fa-header-smaller",
		title: "Smaller Heading"
	},
	"heading-bigger": {
		name: "heading-bigger",
		action: toggleHeadingBigger,
		className: "fa fa-header fa-header-x fa-header-bigger",
		title: "Bigger Heading"
	},
	"heading-1": {
		name: "heading-1",
		action: toggleHeading1,
		className: "fa fa-header fa-header-x fa-header-1",
		title: "Big Heading"
	},
	"heading-2": {
		name: "heading-2",
		action: toggleHeading2,
		className: "fa fa-header fa-header-x fa-header-2",
		title: "Medium Heading"
	},
	"heading-3": {
		name: "heading-3",
		action: toggleHeading3,
		className: "fa fa-header fa-header-x fa-header-3",
		title: "Small Heading"
	},
	"separator-1": {
		name: "separator-1"
	},
	"code": {
		name: "code",
		action: toggleCodeBlock,
		className: "fa fa-code",
		title: "Code"
	},
	"quote": {
		name: "quote",
		action: toggleBlockquote,
		className: "fa fa-quote-left",
		title: "Quote",
		default: true
	},
	"unordered-list": {
		name: "unordered-list",
		action: toggleUnorderedList,
		className: "fa fa-list-ul",
		title: "Generic List",
		default: true
	},
	"ordered-list": {
		name: "ordered-list",
		action: toggleOrderedList,
		className: "fa fa-list-ol",
		title: "Numbered List",
		default: true
	},
	"clean-block": {
		name: "clean-block",
		action: cleanBlock,
		className: "fa fa-eraser fa-clean-block",
		title: "Clean block"
	},
	"separator-2": {
		name: "separator-2"
	},
	"link": {
		name: "link",
		action: drawLink,
		className: "fa fa-link",
		title: "Create Link",
		default: true
	},
	"image": {
		name: "image",
		action: drawImage,
		className: "fa fa-picture-o",
		title: "Insert Image",
		default: true
	},
	"table": {
		name: "table",
		action: drawTable,
		className: "fa fa-table",
		title: "Insert Table"
	},
	"horizontal-rule": {
		name: "horizontal-rule",
		action: drawHorizontalRule,
		className: "fa fa-minus",
		title: "Insert Horizontal Line"
	},
	"separator-3": {
		name: "separator-3"
	},
	"preview": {
		name: "preview",
		action: togglePreview,
		className: "fa fa-eye no-disable",
		title: "Toggle Preview",
		default: true
	},
	"side-by-side": {
		name: "side-by-side",
		action: toggleSideBySide,
		className: "fa fa-columns no-disable no-mobile",
		title: "Toggle Side by Side",
		default: true
	},
	"fullscreen": {
		name: "fullscreen",
		action: toggleFullScreen,
		className: "fa fa-arrows-alt no-disable no-mobile",
		title: "Toggle Fullscreen",
		default: true
	},
	"separator-4": {
		name: "separator-4"
	},
	"guide": {
		name: "guide",
		action: "https://simplemde.com/markdown-guide",
		className: "fa fa-question-circle",
		title: "Markdown Guide",
		default: true
	},
	"separator-5": {
		name: "separator-5"
	},
	"undo": {
		name: "undo",
		action: undo,
		className: "fa fa-undo no-disable",
		title: "Undo"
	},
	"redo": {
		name: "redo",
		action: redo,
		className: "fa fa-repeat no-disable",
		title: "Redo"
	}
};

var insertTexts = {
	link: ["[", "](#url#)"],
	image: ["![](", "#url#)"],
	table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
	horizontalRule: ["", "\n\n-----\n\n"]
};

var promptTexts = {
	link: "URL for the link:",
	image: "URL of the image:"
};

var blockStyles = {
	"bold": "**",
	"code": "```",
	"italic": "*"
};

/**
 * Interface of SimpleMDE.
 */
function SimpleMDE(options) {
	// Handle options parameter
	options = options || {};


	// Used later to refer to it"s parent
	options.parent = this;


	// Check if Font Awesome needs to be auto downloaded
	var autoDownloadFA = true;

	if(options.autoDownloadFontAwesome === false) {
		autoDownloadFA = false;
	}

	if(options.autoDownloadFontAwesome !== true) {
		var styleSheets = document.styleSheets;
		for(var i = 0; i < styleSheets.length; i++) {
			if(!styleSheets[i].href)
				continue;

			if(styleSheets[i].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1) {
				autoDownloadFA = false;
			}
		}
	}

	if(autoDownloadFA) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css";
		document.getElementsByTagName("head")[0].appendChild(link);
	}


	// Find the textarea to use
	if(options.element) {
		this.element = options.element;
	} else if(options.element === null) {
		// This means that the element option was specified, but no element was found
		console.log("SimpleMDE: Error. No element was found.");
		return;
	}


	// Handle toolbar
	if(options.toolbar === undefined) {
		// Initialize
		options.toolbar = [];


		// Loop over the built in buttons, to get the preferred order
		for(var key in toolbarBuiltInButtons) {
			if(toolbarBuiltInButtons.hasOwnProperty(key)) {
				if(key.indexOf("separator-") != -1) {
					options.toolbar.push("|");
				}

				if(toolbarBuiltInButtons[key].default === true || (options.showIcons && options.showIcons.constructor === Array && options.showIcons.indexOf(key) != -1)) {
					options.toolbar.push(key);
				}
			}
		}
	}


	// Handle status bar
	if(!options.hasOwnProperty("status")) {
		options.status = ["autosave", "lines", "words", "cursor"];
	}


	// Add default preview rendering function
	if(!options.previewRender) {
		options.previewRender = function(plainText) {
			// Note: "this" refers to the options object
			return this.parent.markdown(plainText);
		};
	}


	// Set default options for parsing config
	options.parsingConfig = extend({
		highlightFormatting: true // needed for toggleCodeBlock to detect types of code
	}, options.parsingConfig || {});


	// Merging the insertTexts, with the given options
	options.insertTexts = extend({}, insertTexts, options.insertTexts || {});


	// Merging the promptTexts, with the given options
	options.promptTexts = promptTexts;


	// Merging the blockStyles, with the given options
	options.blockStyles = extend({}, blockStyles, options.blockStyles || {});


	// Merging the shortcuts, with the given options
	options.shortcuts = extend({}, shortcuts, options.shortcuts || {});


	// Change unique_id to uniqueId for backwards compatibility
	if(options.autosave != undefined && options.autosave.unique_id != undefined && options.autosave.unique_id != "")
		options.autosave.uniqueId = options.autosave.unique_id;


	// Update this options
	this.options = options;


	// Auto render
	this.render();


	// The codemirror component is only available after rendering
	// so, the setter for the initialValue can only run after
	// the element has been rendered
	if(options.initialValue && (!this.options.autosave || this.options.autosave.foundSavedValue !== true)) {
		this.value(options.initialValue);
	}
}

/**
 * Default markdown render.
 */
SimpleMDE.prototype.markdown = function(text) {
	if(marked) {
		// Initialize
		var markedOptions = {};


		// Update options
		if(this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === false) {
			markedOptions.breaks = false;
		} else {
			markedOptions.breaks = true;
		}

		if(this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === true && window.hljs) {
			markedOptions.highlight = function(code) {
				return window.hljs.highlightAuto(code).value;
			};
		}


		// Set options
		marked.setOptions(markedOptions);


		// Return
		return marked(text);
	}
};

/**
 * Render editor to the given element.
 */
SimpleMDE.prototype.render = function(el) {
	if(!el) {
		el = this.element || document.getElementsByTagName("textarea")[0];
	}

	if(this._rendered && this._rendered === el) {
		// Already rendered.
		return;
	}

	this.element = el;
	var options = this.options;

	var self = this;
	var keyMaps = {};

	for(var key in options.shortcuts) {
		// null stands for "do not bind this command"
		if(options.shortcuts[key] !== null && bindings[key] !== null) {
			(function(key) {
				keyMaps[fixShortcut(options.shortcuts[key])] = function() {
					bindings[key](self);
				};
			})(key);
		}
	}

	keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
	keyMaps["Tab"] = "tabAndIndentMarkdownList";
	keyMaps["Shift-Tab"] = "shiftTabAndUnindentMarkdownList";
	keyMaps["Esc"] = function(cm) {
		if(cm.getOption("fullScreen")) toggleFullScreen(self);
	};

	document.addEventListener("keydown", function(e) {
		e = e || window.event;

		if(e.keyCode == 27) {
			if(self.codemirror.getOption("fullScreen")) toggleFullScreen(self);
		}
	}, false);

	var mode, backdrop;
	if(options.spellChecker !== false) {
		mode = "spell-checker";
		backdrop = options.parsingConfig;
		backdrop.name = "gfm";
		backdrop.gitHubSpice = false;

		CodeMirrorSpellChecker({
			codeMirrorInstance: CodeMirror
		});
	} else {
		mode = options.parsingConfig;
		mode.name = "gfm";
		mode.gitHubSpice = false;
	}

	this.codemirror = CodeMirror.fromTextArea(el, {
		mode: mode,
		backdrop: backdrop,
		theme: "paper",
		tabSize: (options.tabSize != undefined) ? options.tabSize : 2,
		indentUnit: (options.tabSize != undefined) ? options.tabSize : 2,
		indentWithTabs: (options.indentWithTabs === false) ? false : true,
		lineNumbers: false,
		autofocus: (options.autofocus === true) ? true : false,
		extraKeys: keyMaps,
		lineWrapping: (options.lineWrapping === false) ? false : true,
		allowDropFileTypes: ["text/plain"],
		placeholder: options.placeholder || el.getAttribute("placeholder") || "",
		styleSelectedText: (options.styleSelectedText != undefined) ? options.styleSelectedText : true
	});

	if(options.forceSync === true) {
		var cm = this.codemirror;
		cm.on("change", function() {
			cm.save();
		});
	}

	this.gui = {};

	if(options.toolbar !== false) {
		this.gui.toolbar = this.createToolbar();
	}
	if(options.status !== false) {
		this.gui.statusbar = this.createStatusbar();
	}
	if(options.autosave != undefined && options.autosave.enabled === true) {
		this.autosave();
	}

	this.gui.sideBySide = this.createSideBySide();

	this._rendered = this.element;


	// Fixes CodeMirror bug (#344)
	var temp_cm = this.codemirror;
	setTimeout(function() {
		temp_cm.refresh();
	}.bind(temp_cm), 0);
};

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem throw QuotaExceededError. We're going to detect this and set a variable accordingly.
function isLocalStorageAvailable() {
	if(typeof localStorage === "object") {
		try {
			localStorage.setItem("smde_localStorage", 1);
			localStorage.removeItem("smde_localStorage");
		} catch(e) {
			return false;
		}
	} else {
		return false;
	}

	return true;
}

SimpleMDE.prototype.autosave = function() {
	if(isLocalStorageAvailable()) {
		var simplemde = this;

		if(this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
			console.log("SimpleMDE: You must set a uniqueId to use the autosave feature");
			return;
		}

		if(simplemde.element.form != null && simplemde.element.form != undefined) {
			simplemde.element.form.addEventListener("submit", function() {
				localStorage.removeItem("smde_" + simplemde.options.autosave.uniqueId);
			});
		}

		if(this.options.autosave.loaded !== true) {
			if(typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) == "string" && localStorage.getItem("smde_" + this.options.autosave.uniqueId) != "") {
				this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId));
				this.options.autosave.foundSavedValue = true;
			}

			this.options.autosave.loaded = true;
		}

		localStorage.setItem("smde_" + this.options.autosave.uniqueId, simplemde.value());

		var el = document.getElementById("autosaved");
		if(el != null && el != undefined && el != "") {
			var d = new Date();
			var hh = d.getHours();
			var m = d.getMinutes();
			var dd = "am";
			var h = hh;
			if(h >= 12) {
				h = hh - 12;
				dd = "pm";
			}
			if(h == 0) {
				h = 12;
			}
			m = m < 10 ? "0" + m : m;

			el.innerHTML = "Autosaved: " + h + ":" + m + " " + dd;
		}

		this.autosaveTimeoutId = setTimeout(function() {
			simplemde.autosave();
		}, this.options.autosave.delay || 10000);
	} else {
		console.log("SimpleMDE: localStorage not available, cannot autosave");
	}
};

SimpleMDE.prototype.clearAutosavedValue = function() {
	if(isLocalStorageAvailable()) {
		if(this.options.autosave == undefined || this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
			console.log("SimpleMDE: You must set a uniqueId to clear the autosave value");
			return;
		}

		localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
	} else {
		console.log("SimpleMDE: localStorage not available, cannot autosave");
	}
};

SimpleMDE.prototype.createSideBySide = function() {
	var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;

	if(!preview || !/editor-preview-side/.test(preview.className)) {
		preview = document.createElement("div");
		preview.className = "editor-preview-side";
		wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
	}

	// Syncs scroll  editor -> preview
	var cScroll = false;
	var pScroll = false;
	cm.on("scroll", function(v) {
		if(cScroll) {
			cScroll = false;
			return;
		}
		pScroll = true;
		var height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
		var ratio = parseFloat(v.getScrollInfo().top) / height;
		var move = (preview.scrollHeight - preview.clientHeight) * ratio;
		preview.scrollTop = move;
	});

	// Syncs scroll  preview -> editor
	preview.onscroll = function() {
		if(pScroll) {
			pScroll = false;
			return;
		}
		cScroll = true;
		var height = preview.scrollHeight - preview.clientHeight;
		var ratio = parseFloat(preview.scrollTop) / height;
		var move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;
		cm.scrollTo(0, move);
	};
	return preview;
};

SimpleMDE.prototype.createToolbar = function(items) {
	items = items || this.options.toolbar;

	if(!items || items.length === 0) {
		return;
	}
	var i;
	for(i = 0; i < items.length; i++) {
		if(toolbarBuiltInButtons[items[i]] != undefined) {
			items[i] = toolbarBuiltInButtons[items[i]];
		}
	}

	var bar = document.createElement("div");
	bar.className = "editor-toolbar";

	var self = this;

	var toolbarData = {};
	self.toolbar = items;

	for(i = 0; i < items.length; i++) {
		if(items[i].name == "guide" && self.options.toolbarGuideIcon === false)
			continue;

		if(self.options.hideIcons && self.options.hideIcons.indexOf(items[i].name) != -1)
			continue;

		// Fullscreen does not work well on mobile devices (even tablets)
		// In the future, hopefully this can be resolved
		if((items[i].name == "fullscreen" || items[i].name == "side-by-side") && isMobile())
			continue;


		// Don't include trailing separators
		if(items[i] === "|") {
			var nonSeparatorIconsFollow = false;

			for(var x = (i + 1); x < items.length; x++) {
				if(items[x] !== "|" && (!self.options.hideIcons || self.options.hideIcons.indexOf(items[x].name) == -1)) {
					nonSeparatorIconsFollow = true;
				}
			}

			if(!nonSeparatorIconsFollow)
				continue;
		}


		// Create the icon and append to the toolbar
		(function(item) {
			var el;
			if(item === "|") {
				el = createSep();
			} else {
				el = createIcon(item, self.options.toolbarTips, self.options.shortcuts);
			}

			// bind events, special for info
			if(item.action) {
				if(typeof item.action === "function") {
					el.onclick = function(e) {
						e.preventDefault();
						item.action(self);
					};
				} else if(typeof item.action === "string") {
					el.href = item.action;
					el.target = "_blank";
				}
			}

			toolbarData[item.name || item] = el;
			bar.appendChild(el);
		})(items[i]);
	}

	self.toolbarElements = toolbarData;

	var cm = this.codemirror;
	cm.on("cursorActivity", function() {
		var stat = getState(cm);

		for(var key in toolbarData) {
			(function(key) {
				var el = toolbarData[key];
				if(stat[key]) {
					el.className += " active";
				} else if(key != "fullscreen" && key != "side-by-side") {
					el.className = el.className.replace(/\s*active\s*/g, "");
				}
			})(key);
		}
	});

	var cmWrapper = cm.getWrapperElement();
	cmWrapper.parentNode.insertBefore(bar, cmWrapper);
	return bar;
};

SimpleMDE.prototype.createStatusbar = function(status) {
	// Initialize
	status = status || this.options.status;
	var options = this.options;
	var cm = this.codemirror;


	// Make sure the status variable is valid
	if(!status || status.length === 0)
		return;


	// Set up the built-in items
	var items = [];
	var i, onUpdate, defaultValue;

	for(i = 0; i < status.length; i++) {
		// Reset some values
		onUpdate = undefined;
		defaultValue = undefined;


		// Handle if custom or not
		if(typeof status[i] === "object") {
			items.push({
				className: status[i].className,
				defaultValue: status[i].defaultValue,
				onUpdate: status[i].onUpdate
			});
		} else {
			var name = status[i];

			if(name === "words") {
				defaultValue = function(el) {
					el.innerHTML = wordCount(cm.getValue());
				};
				onUpdate = function(el) {
					el.innerHTML = wordCount(cm.getValue());
				};
			} else if(name === "lines") {
				defaultValue = function(el) {
					el.innerHTML = cm.lineCount();
				};
				onUpdate = function(el) {
					el.innerHTML = cm.lineCount();
				};
			} else if(name === "cursor") {
				defaultValue = function(el) {
					el.innerHTML = "0:0";
				};
				onUpdate = function(el) {
					var pos = cm.getCursor();
					el.innerHTML = pos.line + ":" + pos.ch;
				};
			} else if(name === "autosave") {
				defaultValue = function(el) {
					if(options.autosave != undefined && options.autosave.enabled === true) {
						el.setAttribute("id", "autosaved");
					}
				};
			}

			items.push({
				className: name,
				defaultValue: defaultValue,
				onUpdate: onUpdate
			});
		}
	}


	// Create element for the status bar
	var bar = document.createElement("div");
	bar.className = "editor-statusbar";


	// Create a new span for each item
	for(i = 0; i < items.length; i++) {
		// Store in temporary variable
		var item = items[i];


		// Create span element
		var el = document.createElement("span");
		el.className = item.className;


		// Ensure the defaultValue is a function
		if(typeof item.defaultValue === "function") {
			item.defaultValue(el);
		}


		// Ensure the onUpdate is a function
		if(typeof item.onUpdate === "function") {
			// Create a closure around the span of the current action, then execute the onUpdate handler
			this.codemirror.on("update", (function(el, item) {
				return function() {
					item.onUpdate(el);
				};
			}(el, item)));
		}


		// Append the item to the status bar
		bar.appendChild(el);
	}


	// Insert the status bar into the DOM
	var cmWrapper = this.codemirror.getWrapperElement();
	cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
	return bar;
};

/**
 * Get or set the text content.
 */
SimpleMDE.prototype.value = function(val) {
	if(val === undefined) {
		return this.codemirror.getValue();
	} else {
		this.codemirror.getDoc().setValue(val);
		return this;
	}
};


/**
 * Bind static methods for exports.
 */
SimpleMDE.toggleBold = toggleBold;
SimpleMDE.toggleItalic = toggleItalic;
SimpleMDE.toggleStrikethrough = toggleStrikethrough;
SimpleMDE.toggleBlockquote = toggleBlockquote;
SimpleMDE.toggleHeadingSmaller = toggleHeadingSmaller;
SimpleMDE.toggleHeadingBigger = toggleHeadingBigger;
SimpleMDE.toggleHeading1 = toggleHeading1;
SimpleMDE.toggleHeading2 = toggleHeading2;
SimpleMDE.toggleHeading3 = toggleHeading3;
SimpleMDE.toggleCodeBlock = toggleCodeBlock;
SimpleMDE.toggleUnorderedList = toggleUnorderedList;
SimpleMDE.toggleOrderedList = toggleOrderedList;
SimpleMDE.cleanBlock = cleanBlock;
SimpleMDE.drawLink = drawLink;
SimpleMDE.drawImage = drawImage;
SimpleMDE.drawTable = drawTable;
SimpleMDE.drawHorizontalRule = drawHorizontalRule;
SimpleMDE.undo = undo;
SimpleMDE.redo = redo;
SimpleMDE.togglePreview = togglePreview;
SimpleMDE.toggleSideBySide = toggleSideBySide;
SimpleMDE.toggleFullScreen = toggleFullScreen;

/**
 * Bind instance methods for exports.
 */
SimpleMDE.prototype.toggleBold = function() {
	toggleBold(this);
};
SimpleMDE.prototype.toggleItalic = function() {
	toggleItalic(this);
};
SimpleMDE.prototype.toggleStrikethrough = function() {
	toggleStrikethrough(this);
};
SimpleMDE.prototype.toggleBlockquote = function() {
	toggleBlockquote(this);
};
SimpleMDE.prototype.toggleHeadingSmaller = function() {
	toggleHeadingSmaller(this);
};
SimpleMDE.prototype.toggleHeadingBigger = function() {
	toggleHeadingBigger(this);
};
SimpleMDE.prototype.toggleHeading1 = function() {
	toggleHeading1(this);
};
SimpleMDE.prototype.toggleHeading2 = function() {
	toggleHeading2(this);
};
SimpleMDE.prototype.toggleHeading3 = function() {
	toggleHeading3(this);
};
SimpleMDE.prototype.toggleCodeBlock = function() {
	toggleCodeBlock(this);
};
SimpleMDE.prototype.toggleUnorderedList = function() {
	toggleUnorderedList(this);
};
SimpleMDE.prototype.toggleOrderedList = function() {
	toggleOrderedList(this);
};
SimpleMDE.prototype.cleanBlock = function() {
	cleanBlock(this);
};
SimpleMDE.prototype.drawLink = function() {
	drawLink(this);
};
SimpleMDE.prototype.drawImage = function() {
	drawImage(this);
};
SimpleMDE.prototype.drawTable = function() {
	drawTable(this);
};
SimpleMDE.prototype.drawHorizontalRule = function() {
	drawHorizontalRule(this);
};
SimpleMDE.prototype.undo = function() {
	undo(this);
};
SimpleMDE.prototype.redo = function() {
	redo(this);
};
SimpleMDE.prototype.togglePreview = function() {
	togglePreview(this);
};
SimpleMDE.prototype.toggleSideBySide = function() {
	toggleSideBySide(this);
};
SimpleMDE.prototype.toggleFullScreen = function() {
	toggleFullScreen(this);
};

SimpleMDE.prototype.isPreviewActive = function() {
	var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.lastChild;

	return /editor-preview-active/.test(preview.className);
};

SimpleMDE.prototype.isSideBySideActive = function() {
	var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();
	var preview = wrapper.nextSibling;

	return /editor-preview-active-side/.test(preview.className);
};

SimpleMDE.prototype.isFullscreenActive = function() {
	var cm = this.codemirror;

	return cm.getOption("fullScreen");
};

SimpleMDE.prototype.getState = function() {
	var cm = this.codemirror;

	return getState(cm);
};

SimpleMDE.prototype.toTextArea = function() {
	var cm = this.codemirror;
	var wrapper = cm.getWrapperElement();

	if(wrapper.parentNode) {
		if(this.gui.toolbar) {
			wrapper.parentNode.removeChild(this.gui.toolbar);
		}
		if(this.gui.statusbar) {
			wrapper.parentNode.removeChild(this.gui.statusbar);
		}
		if(this.gui.sideBySide) {
			wrapper.parentNode.removeChild(this.gui.sideBySide);
		}
	}

	cm.toTextArea();

	if(this.autosaveTimeoutId) {
		clearTimeout(this.autosaveTimeoutId);
		this.autosaveTimeoutId = undefined;
		this.clearAutosavedValue();
	}
};

module.exports = SimpleMDE;

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

/***/ "./node_modules/typo-js/typo.js":
/*!**************************************!*\
  !*** ./node_modules/typo-js/typo.js ***!
  \**************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname, Buffer) {/* globals chrome: false */
/* globals __dirname: false */
/* globals require: false */
/* globals Buffer: false */
/* globals module: false */

/**
 * Typo is a JavaScript implementation of a spellchecker using hunspell-style 
 * dictionaries.
 */

var Typo;

(function () {
"use strict";

/**
 * Typo constructor.
 *
 * @param {String} [dictionary] The locale code of the dictionary being used. e.g.,
 *                              "en_US". This is only used to auto-load dictionaries.
 * @param {String} [affData]    The data from the dictionary's .aff file. If omitted
 *                              and Typo.js is being used in a Chrome extension, the .aff
 *                              file will be loaded automatically from
 *                              lib/typo/dictionaries/[dictionary]/[dictionary].aff
 *                              In other environments, it will be loaded from
 *                              [settings.dictionaryPath]/dictionaries/[dictionary]/[dictionary].aff
 * @param {String} [wordsData]  The data from the dictionary's .dic file. If omitted
 *                              and Typo.js is being used in a Chrome extension, the .dic
 *                              file will be loaded automatically from
 *                              lib/typo/dictionaries/[dictionary]/[dictionary].dic
 *                              In other environments, it will be loaded from
 *                              [settings.dictionaryPath]/dictionaries/[dictionary]/[dictionary].dic
 * @param {Object} [settings]   Constructor settings. Available properties are:
 *                              {String} [dictionaryPath]: path to load dictionary from in non-chrome
 *                              environment.
 *                              {Object} [flags]: flag information.
 *                              {Boolean} [asyncLoad]: If true, affData and wordsData will be loaded
 *                              asynchronously.
 *                              {Function} [loadedCallback]: Called when both affData and wordsData
 *                              have been loaded. Only used if asyncLoad is set to true. The parameter
 *                              is the instantiated Typo object.
 *
 * @returns {Typo} A Typo object.
 */

Typo = function (dictionary, affData, wordsData, settings) {
	settings = settings || {};

	this.dictionary = null;
	
	this.rules = {};
	this.dictionaryTable = {};
	
	this.compoundRules = [];
	this.compoundRuleCodes = {};
	
	this.replacementTable = [];
	
	this.flags = settings.flags || {}; 
	
	this.memoized = {};

	this.loaded = false;
	
	var self = this;
	
	var path;
	
	// Loop-control variables.
	var i, j, _len, _jlen;
	
	if (dictionary) {
		self.dictionary = dictionary;
		
		// If the data is preloaded, just setup the Typo object.
		if (affData && wordsData) {
			setup();
		}
		// Loading data for Chrome extentions.
		else if (typeof window !== 'undefined' && 'chrome' in window && 'extension' in window.chrome && 'getURL' in window.chrome.extension) {
			if (settings.dictionaryPath) {
				path = settings.dictionaryPath;
			}
			else {
				path = "typo/dictionaries";
			}
			
			if (!affData) readDataFile(chrome.extension.getURL(path + "/" + dictionary + "/" + dictionary + ".aff"), setAffData);
			if (!wordsData) readDataFile(chrome.extension.getURL(path + "/" + dictionary + "/" + dictionary + ".dic"), setWordsData);
		}
		else {
			if (settings.dictionaryPath) {
				path = settings.dictionaryPath;
			}
			else if (true) {
				path = __dirname + '/dictionaries';
			}
			else {
				path = './dictionaries';
			}
			
			if (!affData) readDataFile(path + "/" + dictionary + "/" + dictionary + ".aff", setAffData);
			if (!wordsData) readDataFile(path + "/" + dictionary + "/" + dictionary + ".dic", setWordsData);
		}
	}
	
	function readDataFile(url, setFunc) {
		var response = self._readFile(url, null, settings.asyncLoad);
		
		if (settings.asyncLoad) {
			response.then(function(data) {
				setFunc(data);
			});
		}
		else {
			setFunc(response);
		}
	}

	function setAffData(data) {
		affData = data;

		if (wordsData) {
			setup();
		}
	}

	function setWordsData(data) {
		wordsData = data;

		if (affData) {
			setup();
		}
	}

	function setup() {
		self.rules = self._parseAFF(affData);
		
		// Save the rule codes that are used in compound rules.
		self.compoundRuleCodes = {};
		
		for (i = 0, _len = self.compoundRules.length; i < _len; i++) {
			var rule = self.compoundRules[i];
			
			for (j = 0, _jlen = rule.length; j < _jlen; j++) {
				self.compoundRuleCodes[rule[j]] = [];
			}
		}
		
		// If we add this ONLYINCOMPOUND flag to self.compoundRuleCodes, then _parseDIC
		// will do the work of saving the list of words that are compound-only.
		if ("ONLYINCOMPOUND" in self.flags) {
			self.compoundRuleCodes[self.flags.ONLYINCOMPOUND] = [];
		}
		
		self.dictionaryTable = self._parseDIC(wordsData);
		
		// Get rid of any codes from the compound rule codes that are never used 
		// (or that were special regex characters).  Not especially necessary... 
		for (i in self.compoundRuleCodes) {
			if (self.compoundRuleCodes[i].length === 0) {
				delete self.compoundRuleCodes[i];
			}
		}
		
		// Build the full regular expressions for each compound rule.
		// I have a feeling (but no confirmation yet) that this method of 
		// testing for compound words is probably slow.
		for (i = 0, _len = self.compoundRules.length; i < _len; i++) {
			var ruleText = self.compoundRules[i];
			
			var expressionText = "";
			
			for (j = 0, _jlen = ruleText.length; j < _jlen; j++) {
				var character = ruleText[j];
				
				if (character in self.compoundRuleCodes) {
					expressionText += "(" + self.compoundRuleCodes[character].join("|") + ")";
				}
				else {
					expressionText += character;
				}
			}
			
			self.compoundRules[i] = new RegExp(expressionText, "i");
		}
		
		self.loaded = true;
		
		if (settings.asyncLoad && settings.loadedCallback) {
			settings.loadedCallback(self);
		}
	}
	
	return this;
};

Typo.prototype = {
	/**
	 * Loads a Typo instance from a hash of all of the Typo properties.
	 *
	 * @param object obj A hash of Typo properties, probably gotten from a JSON.parse(JSON.stringify(typo_instance)).
	 */
	
	load : function (obj) {
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				this[i] = obj[i];
			}
		}
		
		return this;
	},
	
	/**
	 * Read the contents of a file.
	 * 
	 * @param {String} path The path (relative) to the file.
	 * @param {String} [charset="ISO8859-1"] The expected charset of the file
	 * @param {Boolean} async If true, the file will be read asynchronously. For node.js this does nothing, all
	 *        files are read synchronously.
	 * @returns {String} The file data if async is false, otherwise a promise object. If running node.js, the data is
	 *          always returned.
	 */
	
	_readFile : function (path, charset, async) {
		charset = charset || "utf8";
		
		if (typeof XMLHttpRequest !== 'undefined') {
			var promise;
			var req = new XMLHttpRequest();
			req.open("GET", path, async);
			
			if (async) {
				promise = new Promise(function(resolve, reject) {
					req.onload = function() {
						if (req.status === 200) {
							resolve(req.responseText);
						}
						else {
							reject(req.statusText);
						}
					};
					
					req.onerror = function() {
						reject(req.statusText);
					}
				});
			}
		
			if (req.overrideMimeType)
				req.overrideMimeType("text/plain; charset=" + charset);
		
			req.send(null);
			
			return async ? promise : req.responseText;
		}
		else if (true) {
			// Node.js
			var fs = __webpack_require__(/*! fs */ 0);
			
			try {
				if (fs.existsSync(path)) {
					var stats = fs.statSync(path);
					
					var fileDescriptor = fs.openSync(path, 'r');
					
					var buffer = new Buffer(stats.size);
					
					fs.readSync(fileDescriptor, buffer, 0, buffer.length, null);
					
					return buffer.toString(charset, 0, buffer.length);
				}
				else {
					console.log("Path " + path + " does not exist.");
				}
			} catch (e) {
				console.log(e);
				return '';
			}
		}
	},
	
	/**
	 * Parse the rules out from a .aff file.
	 *
	 * @param {String} data The contents of the affix file.
	 * @returns object The rules from the file.
	 */
	
	_parseAFF : function (data) {
		var rules = {};
		
		var line, subline, numEntries, lineParts;
		var i, j, _len, _jlen;
		
		// Remove comment lines
		data = this._removeAffixComments(data);
		
		var lines = data.split("\n");
		
		for (i = 0, _len = lines.length; i < _len; i++) {
			line = lines[i];
			
			var definitionParts = line.split(/\s+/);
			
			var ruleType = definitionParts[0];
			
			if (ruleType == "PFX" || ruleType == "SFX") {
				var ruleCode = definitionParts[1];
				var combineable = definitionParts[2];
				numEntries = parseInt(definitionParts[3], 10);
				
				var entries = [];
				
				for (j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++) {
					subline = lines[j];
					
					lineParts = subline.split(/\s+/);
					var charactersToRemove = lineParts[2];
					
					var additionParts = lineParts[3].split("/");
					
					var charactersToAdd = additionParts[0];
					if (charactersToAdd === "0") charactersToAdd = "";
					
					var continuationClasses = this.parseRuleCodes(additionParts[1]);
					
					var regexToMatch = lineParts[4];
					
					var entry = {};
					entry.add = charactersToAdd;
					
					if (continuationClasses.length > 0) entry.continuationClasses = continuationClasses;
					
					if (regexToMatch !== ".") {
						if (ruleType === "SFX") {
							entry.match = new RegExp(regexToMatch + "$");
						}
						else {
							entry.match = new RegExp("^" + regexToMatch);
						}
					}
					
					if (charactersToRemove != "0") {
						if (ruleType === "SFX") {
							entry.remove = new RegExp(charactersToRemove  + "$");
						}
						else {
							entry.remove = charactersToRemove;
						}
					}
					
					entries.push(entry);
				}
				
				rules[ruleCode] = { "type" : ruleType, "combineable" : (combineable == "Y"), "entries" : entries };
				
				i += numEntries;
			}
			else if (ruleType === "COMPOUNDRULE") {
				numEntries = parseInt(definitionParts[1], 10);
				
				for (j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++) {
					line = lines[j];
					
					lineParts = line.split(/\s+/);
					this.compoundRules.push(lineParts[1]);
				}
				
				i += numEntries;
			}
			else if (ruleType === "REP") {
				lineParts = line.split(/\s+/);
				
				if (lineParts.length === 3) {
					this.replacementTable.push([ lineParts[1], lineParts[2] ]);
				}
			}
			else {
				// ONLYINCOMPOUND
				// COMPOUNDMIN
				// FLAG
				// KEEPCASE
				// NEEDAFFIX
				
				this.flags[ruleType] = definitionParts[1];
			}
		}
		
		return rules;
	},
	
	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data The data from an affix file.
	 * @return {String} The cleaned-up data.
	 */
	
	_removeAffixComments : function (data) {
		// Remove comments
		// This used to remove any string starting with '#' up to the end of the line,
		// but some COMPOUNDRULE definitions include '#' as part of the rule.
		// I haven't seen any affix files that use comments on the same line as real data,
		// so I don't think this will break anything.
		data = data.replace(/^\s*#.*$/mg, "");
		
		// Trim each line
		data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '');
		
		// Remove blank lines.
		data = data.replace(/\n{2,}/g, "\n");
		
		// Trim the entire string
		data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		
		return data;
	},
	
	/**
	 * Parses the words out from the .dic file.
	 *
	 * @param {String} data The data from the dictionary file.
	 * @returns object The lookup table containing all of the words and
	 *                 word forms from the dictionary.
	 */
	
	_parseDIC : function (data) {
		data = this._removeDicComments(data);
		
		var lines = data.split("\n");
		var dictionaryTable = {};
		
		function addWord(word, rules) {
			// Some dictionaries will list the same word multiple times with different rule sets.
			if (!dictionaryTable.hasOwnProperty(word)) {
				dictionaryTable[word] = null;
			}
			
			if (rules.length > 0) {
				if (dictionaryTable[word] === null) {
					dictionaryTable[word] = [];
				}

				dictionaryTable[word].push(rules);
			}
		}
		
		// The first line is the number of words in the dictionary.
		for (var i = 1, _len = lines.length; i < _len; i++) {
			var line = lines[i];
			
			var parts = line.split("/", 2);
			
			var word = parts[0];

			// Now for each affix rule, generate that form of the word.
			if (parts.length > 1) {
				var ruleCodesArray = this.parseRuleCodes(parts[1]);
				
				// Save the ruleCodes for compound word situations.
				if (!("NEEDAFFIX" in this.flags) || ruleCodesArray.indexOf(this.flags.NEEDAFFIX) == -1) {
					addWord(word, ruleCodesArray);
				}
				
				for (var j = 0, _jlen = ruleCodesArray.length; j < _jlen; j++) {
					var code = ruleCodesArray[j];
					
					var rule = this.rules[code];
					
					if (rule) {
						var newWords = this._applyRule(word, rule);
						
						for (var ii = 0, _iilen = newWords.length; ii < _iilen; ii++) {
							var newWord = newWords[ii];
							
							addWord(newWord, []);
							
							if (rule.combineable) {
								for (var k = j + 1; k < _jlen; k++) {
									var combineCode = ruleCodesArray[k];
									
									var combineRule = this.rules[combineCode];
									
									if (combineRule) {
										if (combineRule.combineable && (rule.type != combineRule.type)) {
											var otherNewWords = this._applyRule(newWord, combineRule);
											
											for (var iii = 0, _iiilen = otherNewWords.length; iii < _iiilen; iii++) {
												var otherNewWord = otherNewWords[iii];
												addWord(otherNewWord, []);
											}
										}
									}
								}
							}
						}
					}
					
					if (code in this.compoundRuleCodes) {
						this.compoundRuleCodes[code].push(word);
					}
				}
			}
			else {
				addWord(word.trim(), []);
			}
		}
		
		return dictionaryTable;
	},
	
	
	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data The data from a .dic file.
	 * @return {String} The cleaned-up data.
	 */
	
	_removeDicComments : function (data) {
		// I can't find any official documentation on it, but at least the de_DE
		// dictionary uses tab-indented lines as comments.
		
		// Remove comments
		data = data.replace(/^\t.*$/mg, "");
		
		return data;
	},
	
	parseRuleCodes : function (textCodes) {
		if (!textCodes) {
			return [];
		}
		else if (!("FLAG" in this.flags)) {
			return textCodes.split("");
		}
		else if (this.flags.FLAG === "long") {
			var flags = [];
			
			for (var i = 0, _len = textCodes.length; i < _len; i += 2) {
				flags.push(textCodes.substr(i, 2));
			}
			
			return flags;
		}
		else if (this.flags.FLAG === "num") {
			return textCodes.split(",");
		}
	},
	
	/**
	 * Applies an affix rule to a word.
	 *
	 * @param {String} word The base word.
	 * @param {Object} rule The affix rule.
	 * @returns {String[]} The new words generated by the rule.
	 */
	
	_applyRule : function (word, rule) {
		var entries = rule.entries;
		var newWords = [];
		
		for (var i = 0, _len = entries.length; i < _len; i++) {
			var entry = entries[i];
			
			if (!entry.match || word.match(entry.match)) {
				var newWord = word;
				
				if (entry.remove) {
					newWord = newWord.replace(entry.remove, "");
				}
				
				if (rule.type === "SFX") {
					newWord = newWord + entry.add;
				}
				else {
					newWord = entry.add + newWord;
				}
				
				newWords.push(newWord);
				
				if ("continuationClasses" in entry) {
					for (var j = 0, _jlen = entry.continuationClasses.length; j < _jlen; j++) {
						var continuationRule = this.rules[entry.continuationClasses[j]];
						
						if (continuationRule) {
							newWords = newWords.concat(this._applyRule(newWord, continuationRule));
						}
						/*
						else {
							// This shouldn't happen, but it does, at least in the de_DE dictionary.
							// I think the author mistakenly supplied lower-case rule codes instead 
							// of upper-case.
						}
						*/
					}
				}
			}
		}
		
		return newWords;
	},
	
	/**
	 * Checks whether a word or a capitalization variant exists in the current dictionary.
	 * The word is trimmed and several variations of capitalizations are checked.
	 * If you want to check a word without any changes made to it, call checkExact()
	 *
	 * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript re:trimming function
	 *
	 * @param {String} aWord The word to check.
	 * @returns {Boolean}
	 */
	
	check : function (aWord) {
		if (!this.loaded) {
			throw "Dictionary not loaded.";
		}
		
		// Remove leading and trailing whitespace
		var trimmedWord = aWord.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		
		if (this.checkExact(trimmedWord)) {
			return true;
		}
		
		// The exact word is not in the dictionary.
		if (trimmedWord.toUpperCase() === trimmedWord) {
			// The word was supplied in all uppercase.
			// Check for a capitalized form of the word.
			var capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase();
			
			if (this.hasFlag(capitalizedWord, "KEEPCASE")) {
				// Capitalization variants are not allowed for this word.
				return false;
			}
			
			if (this.checkExact(capitalizedWord)) {
				return true;
			}
		}
		
		var lowercaseWord = trimmedWord.toLowerCase();
		
		if (lowercaseWord !== trimmedWord) {
			if (this.hasFlag(lowercaseWord, "KEEPCASE")) {
				// Capitalization variants are not allowed for this word.
				return false;
			}
			
			// Check for a lowercase form
			if (this.checkExact(lowercaseWord)) {
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Checks whether a word exists in the current dictionary.
	 *
	 * @param {String} word The word to check.
	 * @returns {Boolean}
	 */
	
	checkExact : function (word) {
		if (!this.loaded) {
			throw "Dictionary not loaded.";
		}

		var ruleCodes = this.dictionaryTable[word];
		
		var i, _len;
		
		if (typeof ruleCodes === 'undefined') {
			// Check if this might be a compound word.
			if ("COMPOUNDMIN" in this.flags && word.length >= this.flags.COMPOUNDMIN) {
				for (i = 0, _len = this.compoundRules.length; i < _len; i++) {
					if (word.match(this.compoundRules[i])) {
						return true;
					}
				}
			}
		}
		else if (ruleCodes === null) {
			// a null (but not undefined) value for an entry in the dictionary table
			// means that the word is in the dictionary but has no flags.
			return true;
		}
		else if (typeof ruleCodes === 'object') { // this.dictionary['hasOwnProperty'] will be a function.
			for (i = 0, _len = ruleCodes.length; i < _len; i++) {
				if (!this.hasFlag(word, "ONLYINCOMPOUND", ruleCodes[i])) {
					return true;
				}
			}
		}

		return false;
	},
	
	/**
	 * Looks up whether a given word is flagged with a given flag.
	 *
	 * @param {String} word The word in question.
	 * @param {String} flag The flag in question.
	 * @return {Boolean}
	 */
	 
	hasFlag : function (word, flag, wordFlags) {
		if (!this.loaded) {
			throw "Dictionary not loaded.";
		}

		if (flag in this.flags) {
			if (typeof wordFlags === 'undefined') {
				wordFlags = Array.prototype.concat.apply([], this.dictionaryTable[word]);
			}
			
			if (wordFlags && wordFlags.indexOf(this.flags[flag]) !== -1) {
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Returns a list of suggestions for a misspelled word.
	 *
	 * @see http://www.norvig.com/spell-correct.html for the basis of this suggestor.
	 * This suggestor is primitive, but it works.
	 *
	 * @param {String} word The misspelling.
	 * @param {Number} [limit=5] The maximum number of suggestions to return.
	 * @returns {String[]} The array of suggestions.
	 */
	
	alphabet : "",
	
	suggest : function (word, limit) {
		if (!this.loaded) {
			throw "Dictionary not loaded.";
		}

		limit = limit || 5;

		if (this.memoized.hasOwnProperty(word)) {
			var memoizedLimit = this.memoized[word]['limit'];

			// Only return the cached list if it's big enough or if there weren't enough suggestions
			// to fill a smaller limit.
			if (limit <= memoizedLimit || this.memoized[word]['suggestions'].length < memoizedLimit) {
				return this.memoized[word]['suggestions'].slice(0, limit);
			}
		}
		
		if (this.check(word)) return [];
		
		// Check the replacement table.
		for (var i = 0, _len = this.replacementTable.length; i < _len; i++) {
			var replacementEntry = this.replacementTable[i];
			
			if (word.indexOf(replacementEntry[0]) !== -1) {
				var correctedWord = word.replace(replacementEntry[0], replacementEntry[1]);
				
				if (this.check(correctedWord)) {
					return [ correctedWord ];
				}
			}
		}
		
		var self = this;
		self.alphabet = "abcdefghijklmnopqrstuvwxyz";
		
		/*
		if (!self.alphabet) {
			// Use the alphabet as implicitly defined by the words in the dictionary.
			var alphaHash = {};
			
			for (var i in self.dictionaryTable) {
				for (var j = 0, _len = i.length; j < _len; j++) {
					alphaHash[i[j]] = true;
				}
			}
			
			for (var i in alphaHash) {
				self.alphabet += i;
			}
			
			var alphaArray = self.alphabet.split("");
			alphaArray.sort();
			self.alphabet = alphaArray.join("");
		}
		*/
		
		function edits1(words) {
			var rv = [];
			
			var ii, i, j, _iilen, _len, _jlen;
			
			for (ii = 0, _iilen = words.length; ii < _iilen; ii++) {
				var word = words[ii];
				
				for (i = 0, _len = word.length + 1; i < _len; i++) {
					var s = [ word.substring(0, i), word.substring(i) ];
				
					if (s[1]) {
						rv.push(s[0] + s[1].substring(1));
					}
					
					// Eliminate transpositions of identical letters
					if (s[1].length > 1 && s[1][1] !== s[1][0]) {
						rv.push(s[0] + s[1][1] + s[1][0] + s[1].substring(2));
					}

					if (s[1]) {
						for (j = 0, _jlen = self.alphabet.length; j < _jlen; j++) {
							// Eliminate replacement of a letter by itself
							if (self.alphabet[j] != s[1].substring(0,1)){
								rv.push(s[0] + self.alphabet[j] + s[1].substring(1));
							}
						}
					}

					if (s[1]) {
						for (j = 0, _jlen = self.alphabet.length; j < _jlen; j++) {
							rv.push(s[0] + self.alphabet[j] + s[1]);
						}
					}
				}
			}
			
			return rv;
		}
		
		function known(words) {
			var rv = [];
			
			for (var i = 0, _len = words.length; i < _len; i++) {
				if (self.check(words[i])) {
					rv.push(words[i]);
				}
			}
			
			return rv;
		}
		
		function correct(word) {
			// Get the edit-distance-1 and edit-distance-2 forms of this word.
			var ed1 = edits1([word]);
			var ed2 = edits1(ed1);
			
			var corrections = known(ed1.concat(ed2));
			
			var i, _len;
			
			// Sort the edits based on how many different ways they were created.
			var weighted_corrections = {};
			
			for (i = 0, _len = corrections.length; i < _len; i++) {
				if (!(corrections[i] in weighted_corrections)) {
					weighted_corrections[corrections[i]] = 1;
				}
				else {
					weighted_corrections[corrections[i]] += 1;
				}
			}
			
			var sorted_corrections = [];
			
			for (i in weighted_corrections) {
				if (weighted_corrections.hasOwnProperty(i)) {
					sorted_corrections.push([ i, weighted_corrections[i] ]);
				}
			}
			
			function sorter(a, b) {
				if (a[1] < b[1]) {
					return -1;
				}
				
				return 1;
			}
			
			sorted_corrections.sort(sorter).reverse();
			
			var rv = [];

			var capitalization_scheme = "lowercase";
			
			if (word.toUpperCase() === word) {
				capitalization_scheme = "uppercase";
			}
			else if (word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase() === word) {
				capitalization_scheme = "capitalized";
			}
			
			for (i = 0, _len = Math.min(limit, sorted_corrections.length); i < _len; i++) {
				if ("uppercase" === capitalization_scheme) {
					sorted_corrections[i][0] = sorted_corrections[i][0].toUpperCase();
				}
				else if ("capitalized" === capitalization_scheme) {
					sorted_corrections[i][0] = sorted_corrections[i][0].substr(0, 1).toUpperCase() + sorted_corrections[i][0].substr(1);
				}
				
				if (!self.hasFlag(sorted_corrections[i][0], "NOSUGGEST")) {
					rv.push(sorted_corrections[i][0]);
				}
			}
			
			return rv;
		}
		
		this.memoized[word] = {
			'suggestions': correct(word),
			'limit': limit
		};

		return this.memoized[word]['suggestions'];
	}
};
})();

// Support for use as a node.js module.
if (true) {
	module.exports = Typo;
}
/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(/*! ./../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

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

/***/ }),

/***/ 0:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},["./assets/js/post.js"]);