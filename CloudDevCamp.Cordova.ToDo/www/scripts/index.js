// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        document.getElementById('btnNewItem').addEventListener('click', showNewItemModal.bind(this), false);
        document.getElementById('btnHideNewItemModal').addEventListener('click', hideNewItemModal.bind(this), false);
        document.getElementById('btnAddItem').addEventListener('click', addNewItem.bind(this), false);

        updateToDoList();
    };

    function onPause() {
    };

    function onResume() {
        updateToDoList();
    };

    function updateToDoList() {
        var items = getItems();

        $('#content').html('');

        for (var i = items.length - 1; i > -1; i--) {
            if(items[i].IsDeleted == true) { continue; }

            $('#content').append('<div class="list-item' + (items[i].IsCompleted ? ' completed' : '') + '">'
                                    + '<div class="decoration"><span class="circle"><span class="circle-inner"></span></span></div>'
                                    + '<div class="item-content">'
                                        + items[i].Content
                                    + '</div>'
                                    + '<div class="item-actions">'
                                        + '<a class="action-button" data-action="complete" data-id="' + i + '">'
                                            + '<img src="images/icon-complete.png" />'
                                        + '</a>'
                                        + '<a class="action-button" data-action="remove" data-id="' + i + '">'
                                            + '<img src="images/icon-remove.png" />'
                                        + '</a>'
                                    + '</div>'
                               + '</div>');
        }

        $('.list-item').each(function () {
            $(this).click(function () {
                activateListItem(this);
            });

            $(this).on('selectstart', function () {
                return false;
            });
        });

        $('.list-item .action-button').each(function () {
            $(this).click(function () {
                executeItemAction(this);
            });
        });
    }

    function addNewItem() {
        var content = $('#txtNewItemContent').val().trim();
        
        if (content == '') { return; }

        var items = getItems();

        var newItem = {
            Content: content,
            Created: Date.now(),
            IsCompleted: false,
            Completed: null,
            IsDeleted: false,
            Deleted: null
        };

        items.push(newItem);

        setItems(items);

        $('#txtNewItemContent').val('').focus();
        updateToDoList();
    }
    
    function getItems() {
        var items = localStorage.getItem('Items');
        if (items == null) {
            items = [];
        }
        else {
            items = JSON.parse(items);
        }

        return items;
    }

    function setItems(items) {
        items = JSON.stringify(items);
        localStorage.setItem('Items', items);
    }

    function showNewItemModal() {
        $('#modalNewItem').addClass('fade-in');
    }

    function hideNewItemModal() {
        $('#modalNewItem').removeClass('fade-in');
    }

    var actionFlag = false;

    function activateListItem(sender) {
        if (actionFlag) {
            actionFlag = false;
            $('.list-item').removeClass('active');
        }
        else {
            $('.list-item').removeClass('active');
            $(sender).addClass('active');
        }
    }

    function executeItemAction(sender) {
        var id = $(sender).attr('data-id');
        var action = $(sender).attr('data-action');
        var listItem = $(sender).parents('.list-item');

        var items = getItems();
        
        switch (action) {
            case "complete":
                items[id].IsCompleted = true;
                items[id].Completed = Date.now();
                listItem.addClass('completed');
                actionFlag = true;
                break;
            case "remove":
                items[id].IsDeleted = true;
                items[id].Deleted = Date.now();
                listItem.addClass('removed');
                actionFlag = true;
                break;
            default:
                break;
        }

        setItems(items);
    }
} )();