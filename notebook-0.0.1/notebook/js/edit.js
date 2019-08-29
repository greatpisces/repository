$(document).ready(function () {

    /*全局变量*/
    var Global = {
        host: "http://localhost:8080/notebook/"
    };

    /*dom模板*/
    var Tpl = {
        dirTpl : $('#dirTpl').html(),
        templateTpl : $('#templateTpl').html(),
        templatePreviewTpl : $('#templatePreviewTpl').html(),
        notePreviewTpl : $('#notePreviewTpl').html(),
        exampleTpl : $('#exampleTpl').html(),
        exampleButtonTpl : $('#exampleButtonTpl').html(),
        buttonTpl : $('#buttonTpl').html()
    };

    var Dir = function () {

        var dirs = [];
        var selectedDir = null;

        function load() {
            $.ajax({
                url : '../note/dir.json',
                async : false,
                success : function (data) {
                    dirs = data;
                }
            });
        }

        function render() {
            $.each(dirs, function (i, obj) {
                $('.dir-unit').append(
                    Tpl.dirTpl.replace("@index", obj.id)
                        .replace("@title", obj.title)
                );
            });
        }

        function registerEvent() {
            $('.dir-unit>.dir').each(function (i, ele) {
                clickEvent(ele);
            });

            $('.dir-add').click(function () {
                Dir.addDir({
                    title : $($(this).data("target")).val()
                });
            });
        }

        function clickEvent(ele) {
            $(ele).click(function () {
                if(selectedDir) {
                    $(selectedDir).removeClass('active');
                }
                selectDir(ele);
                $(ele).addClass('active');
                Button.render("add");
                Edit.change({});
            });
        }

        function selectDir(ele) {
            if(ele == null) {
                SubDir.change([]);
            } else {
                $.each(dirs, function (i, dir) {
                    if(dir.id == $(ele).data('index')) {
                        SubDir.change(dir.files);
                    }
                });
            }
            selectedDir = ele;
        }

        function init() {
            load();
            render();
            registerEvent();
        }

        function addDir(obj) {
            $.ajax({
                url : Global.host + "add",
                method : "POST",
                contentType: "application/json;charset=utf-8",
                data : JSON.stringify({
                    title : obj.title
                }),
                success : function (data) {
                    if(data.status == "OK") {
                        var dir = data.data;
                        dirs.push(dir);
                        $('.dir-unit').append(
                            Tpl.dirTpl.replace("@index", dir.id)
                                .replace("@title", dir.title)
                        );
                        clickEvent($('.dir-unit>.dir').last());
                    }
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }

        function removeDir() {
            var id = $(selectedDir).data('index');
            $.ajax({
                url : Global.host + "delete/" + id,
                method : "DELETE",
                success : function (data) {
                    if(data.status == "OK") {
                        $.each(dirs, function (i, dir) {
                            if(dir.id == id) {
                                dirs.splice(i, 1);
                            }
                        });
                        $(selectedDir).remove();
                        selectDir(null);
                    }
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }

        function addFile(obj) {
            $.ajax({
                url : Global.host + "addFile/" + $(selectedDir).data('index'),
                method : "POST",
                data : obj,
                contentType: "text/html;charset=utf-8",
                success : function (data) {
                    if(data.status == "OK") {
                        $.each(dirs, function (i, dir) {
                            if(dir.id == $(selectedDir).data('index')) {
                                dir.files.push(data.data);
                                SubDir.change(dir.files);
                            }
                        });
                    }
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }

        function getId() {
            return $(selectedDir).data('index');
        }

        return {
            init : init,
            addDir : addDir,
            removeDir : removeDir,
            addFile : addFile,
            getId : getId
        };
    }();

    /*子目录*/
    var SubDir = function () {

        var cache = {};
        var paths = null;
        var subDirs = null;
        var selectedSubDir = null;

        function change(dirs) {
            paths = dirs;
            subDirs = [];
            $.each(dirs , function (i, dir) {
                subDirs.push(createSubDir(i, dir));
            });
            render();
        }

        function loadNote(path) {
            if(cache[path]) {
                return cache[path];
            } else {
                $.ajax({
                    url : '../note' + path,
                    async : false,
                    success : function (data) {
                        cache[path] = $(data);
                    }
                });
            }
            return cache[path];
        }

        function createSubDir(index, dir) {
            return $(Tpl.dirTpl.replace("@index", index).replace("@title", loadNote(dir).data('title')))
                .click(function () {
                    if(selectedSubDir != this) {
                        if(selectedSubDir) {
                            $(selectedSubDir).removeClass('active');
                        }
                        selectSubDir(this);
                        $(this).addClass('active');
                        Button.render("edit");
                        Edit.change(processNote(loadNote(dir)));
                    }
                })
        }

        function processNote(note) {
            var example = [];
            $.each(note.find('.note-footer .example-btn'), function (i, btn) {
                example.push(Edit.createExample($(btn).data('link')));
            });
            return {
                title : note.find('.note-header h2').html(),
                content : note.find('.note-body').html(),
                example : example
            };
        }

        function render() {
            $('.sub-dir-unit').empty();
            $.each(subDirs , function (i, subDir) {
                $('.sub-dir-unit').append(subDir);
            })
        }

        function selectSubDir(ele) {
            if(ele == null) {

            } else {

            }
            selectedSubDir = ele;
        }

        function updateFile(obj) {
            var path = paths[$(selectedSubDir).data('index')];
            $.ajax({
                url : Global.host + "updateFile",
                method : "PUT",
                data : JSON.stringify({
                    fileName : path,
                    value : obj
                }),
                contentType: "application/json;charset=utf-8",
                success : function (data) {
                    if(data.status == "OK") {
                        cache[path] = $(obj);
                        $(selectedSubDir).text($('.edit-unit .note-title').val());
                    }
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }

        function deleteFile() {
            var path = paths[$(selectedSubDir).data('index')];
            $.ajax({
                url : Global.host + "deleteFile/" + Dir.getId() + "?fileName=" + path,
                method : "DELETE",
                success : function (data) {
                    if(data.status == "OK") {
                        paths.splice($(selectedSubDir).data('index'), 1);
                        change(paths);
                        Button.render("add");
                        Edit.change({});
                    }
                },
                error : function (err) {
                    console.log(err);
                }
            });
        }

        return {
            change : change,
            updateFile : updateFile,
            deleteFile : deleteFile
        };

    }();

    /*模板*/
    var Template = function () {

        var cache = [];
        var templateCard = [];
        var selectedTemplate = null;

        function load() {
            $.ajax({
                url : '../note/templates.html',
                async : false,
                success : function (data) {
                    var templates = $(data).children();
                    $.each(templates, function (i, template) {
                        var ele = $(template);
                        cache.push({
                            title : ele.data('title'),
                            desc : ele.data('desc'),
                            template : $(ele.html())
                        });
                    });
                }
            });

        }

        function registerEvent() {
            $.each(cache, function (i, template) {
                templateCard.push(
                    $(Tpl.templateTpl.replace("@title", template.title).replace("@desc", template.desc))
                        .data("index", i)
                        .click(function () {
                            if(selectedTemplate != this) {
                                if(selectedTemplate != null) {
                                    $(selectedTemplate).removeClass("active");
                                    cache[$(selectedTemplate).data("index")].template.remove();
                                }
                                selectedTemplate = this;
                                $(selectedTemplate).addClass("active");
                                $('.template-preview').append(cache[i].template);
                            }
                        })
                );
            });

            $('.template-add').click(function () {
                var start = $('.edit-unit textarea').prop('selectionStart');
                var end = $('.edit-unit textarea').prop('selectionEnd');
                var text = $('.edit-unit textarea').val();
                $('.edit-unit textarea').val(text.substring(0, start) + cache[$(selectedTemplate).data("index")].template.prop('outerHTML') + text.substring(end, text.length));
            });
        }

        function render() {
            $.each(templateCard, function (i, template) {
                $('.template-unit').append(template);
            });
        }

        function init() {
            load();
            registerEvent();
            render();
            templateCard[0].click();
        }

        return {
            init : init
        };
    }();

    /*编辑*/
    var Edit = function () {

        var params = {
            title: "",
            content: "<div></div>",
            example: []
        };

        var note = $(Tpl.notePreviewTpl);

        function load() {
            $('.note-preview').append(note);
        }

        function change(obj) {
            params.title = obj.title || "";
            params.content = obj.content || "<div></div>";
            params.example = obj.example || [];
            $('.edit-unit .example-input').remove();
            if(obj) {
                $('.edit-unit .note-title').val(params.title);
                $('.edit-unit textarea').val(params.content);
                $.each(params.example, function (i, example) {
                    $('.edit-unit form').append(example);
                });
            }
            render();
        }

        function render() {
            note.attr("data-title", params.title);
            note.find('.note-header h2').html(params.title);
            note.find('.note-body').html(params.content);
            note.find('.note-footer').empty();
            $.each(params.example, function (i, example) {
                note.find('.note-footer').append(
                    Tpl.exampleButtonTpl
                        .replace("@title", i)
                        .replace("@link", example.find('.note-example').val())
                );
            });
        }

        function registerEvent() {
            $('.edit-unit textarea').bind('input', function () {
                params.content = $(this).val();
                render();
            });
            $('.edit-unit .note-title').bind('input', function () {
                params.title = $(this).val();
                render();
            });
        }

        function addNewExample() {
            var newExample = $(Tpl.exampleTpl);
            params.example.push(newExample);
            $('.edit-unit form').append(newExample);
            newExample.bind('input', function () {
                render();
            });
        }

        function createExample(value) {
            var example = $(Tpl.exampleTpl)
                .bind('input', function () {
                    render();
                });
            example.find('.note-example').val(value);
            return example;
        }
        
        function getNote() {
            return note.prop("outerHTML");
        }

        function init() {
            load();
            registerEvent();
        }


        return {
            init : init,
            addNewExample : addNewExample,
            createExample : createExample,
            change : change,
            getNote : getNote
        };
    }();

    /*按钮*/
    var Button = function () {

        var cache = [];

        var buttons = [
            {
                title : "Submit",
                type : "btn-success",
                phase : ["add"],
                click : function () {
                    //add note
                    Dir.addFile(Edit.getNote());
                }
            },
            {
                title : "Submit",
                type : "btn-success",
                phase : ["edit"],
                click : function () {
                    //update note
                    SubDir.updateFile(Edit.getNote());
                }
            },
            {
                title : "Add Example",
                type : "btn-info",
                phase : ["add", "edit"],
                click : function () {
                    Edit.addNewExample();
                }
            },
            {
                title : "Delete Dir",
                type : "btn-danger",
                phase : ["add"],
                click : function () {
                    Dir.removeDir();
                }
            },
            {
                title : "Delete Note",
                type : "btn-danger",
                phase : ["edit"],
                click : function () {
                    SubDir.deleteFile()
                }
            }
        ];

        function init() {
            createButton();
            render("load");
        }

        function createButton() {
            $.each(buttons, function (i, button) {
                cache.push($(Tpl.buttonTpl.replace("@title", button.title)).addClass(button.type));
            });
        }

        function render(phase) {
            //每次加载按钮，点击事件会失效，重新注册
            $('.edit-tools').empty();
            $.each(buttons, function (i, button) {
                if($.inArray(phase, button.phase) > -1) {
                    cache[i].click(buttons[i].click);
                    $('.edit-tools').append(cache[i]);
                }
            });
        }

        return {
            init : init,
            render : render
        };

    }();

    function init() {
        Dir.init();
        Template.init();
        Edit.init();
        Button.init();
    }

    init();
});