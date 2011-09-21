(function ($, win) {
    var rId = /\{\{id\}\}/,
        app = win.app = {
        currId : 0,
        defaults : {
            playerUrl : 'http://player.vimeo.com/video/{{id}}?title=0&byline=0&portrait=0&autoplay=1',
            apiUrl    : 'http://vimeo.com/api/v2/video/{{id}}.json'
        },
        generateId : function () {
            return app.currId = ~~(Math.random() * 3e7);
        },
        init : function () {
            app.loadEvents();
        },
        loadEvents : function () {
            $('button').bind('click', function () {
                $.when(app.spinIt()).then(function () {
                    console.log(arguments);
                    $('#frame').prop('src', app.defaults.playerUrl.replace(rId, app.currId));
                }, function () {
                    console.log(arguments);
                });
            });
            
            //TODO
            $(win).bind('beforeunload', function () {
                $('#frame').prop('src', 'javascript: void(0)');
            });
        }
    };

    app.spinIt = function () {
        app.generateId();

        $('#div').text(app.currId);

        var dfd = $.Deferred();

        $.ajax({
            url : app.defaults.apiUrl.replace(rId, app.currId),
            dataType : 'jsonp'
        })
        .done(function (result) {
            if (result.length) {
                dfd.resolve(result);
                //console.log(result);
            } else {
                dfd.reject();
            }
        });

        return dfd.promise();
    };

    $(app.init);
}(jQuery, this));