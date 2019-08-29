$(document).ready(function () {

    var MenuList = function () {
        var list = [];

        return {
            get : function () {
                if(list.length == 0) {
                    $.ajax({
                        url : './note/dir.json',
                        async : false,
                        success : function (data) {
                            list = data;
                        }
                    });
                }
                return list;
            },
            getFiles : function (i) {
                return list[i].files;
            }

        };
    }();

    var Note = function () {
        var cache = {};

        return {
            getNote : function (path) {
                if(cache[path]) {
                    return cache[path];
                } else {
                    $.ajax({
                        url : './note' + path,
                        async : false,
                        success : function (data) {
                            cache[path] = data;
                        }
                    });
                }
                return cache[path];
            }
        };
    }();

    //init page
    function createMenu() {
        var menuContainer = $('.menu-list');
        var menus = MenuList.get();
        var tpl = $('#menuTpl').html();
        for(var i = 0; i < menus.length; i++) {
            menuContainer.append(
                tpl.replace("@title", menus[i].title)
            );
        }
    }

    function registerMenuClick() {
        $('.menu-slice').each(function (i, ele) {
            $(ele).click(function () {
                preMenuClick();
                $(ele).addClass('active');
                changeNote(MenuList.getFiles(i));
            });
        });
    }

    function preMenuClick() {
        $('.menu-slice').each(function (i, ele) {
            if($(ele).hasClass('active')) {
                $(ele).removeClass('active');
            }
        });
    }
    
    function changeNote(files) {
        clearNote();
        loadNote(files);
        createNoteIndex();
        selectNote();
        openLink();
    }

    function clearNote() {
        $(".note").empty();
        $(".note-list").empty();
    }
    
    function loadNote(files) {
        $(".note").html("");
        $.each(files, function (i, file) {
            $(".note").append(
                $(Note.getNote(file)).attr('id', "note-" + i)
            );
        });
    }

    function createNoteIndex() {
        var noteListTpl = $('#noteListTpl').html();

        $('.note-card').each(function (i, ele) {
            $(".note-list").append(
                noteListTpl
                    .replace("@id", i)
                    .replace("@title", $(ele).data("title"))
            );
        });
    }
    
    function selectNote() {
        $('.note-list-title').each(function (i, ele) {
            $(ele).click(function () {
                //window.location = '#note-' + $(this).data('id');
                $('.note').scrollTop($('#note-' + $(this).data('id')).prop('offsetTop') - 6);
                // console.log($('#note-' + $(this).data('id')).prop('offsetTop'));
                // console.log($('.note').scrollTop());
            });
        });
    }

    function openLink() {
        $('.example-btn').each(function (i, ele) {
            $(ele).click(function () {
                window.open($(this).data('link'));
            });
        });
    }

    function init() {
        createMenu();
        registerMenuClick();
    }

    init();
});