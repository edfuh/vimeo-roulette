(function ($, win) {
    var rId = /\{\{id\}\}/,
        spinner,
        app = win.app = {
            cache : {},
            currId : 0,
            defaults : {
                playerUrl : 'http://player.vimeo.com/video/{{id}}?title=0&byline=0&portrait=0&autoplay=1',
                apiUrl    : 'http://vimeo.com/api/v2/video/{{id}}.json'
            },
            generateId : function () {
                var id = ~~(Math.random() * 3e7);
                app.cache[id] = id;
                return app.currId = id;
            },
            init : function () {
                app.loadEvents();
                $.getScript('https://raw.github.com/fgnass/spin.js/master/spin.js', function () {
                    spinner = new Spinner();
                });
            },
            loadEvents : function () {
                $('.spin-btn').bind('click', app._fetch);

                //TODO
                $(win).bind('beforeunload', function () {
                    $('#frame').prop('src', 'javascript: void(0)');
                });
            }
        };

    app._fetch = function () {
        $.when(app.spinIt()).then(function () {
            console.log(arguments);
            spinner.stop();
            $('<iframe />', {
                width : 400,
                height : 300,
                frameborder : 0,
                webkitAllowFullScreen : 1,
                allowFullScreen : 1,
                src : app.defaults.playerUrl.replace(rId, app.currId)
            }).appendTo($('#vid-box'));
            // $('#frame').attr('src', app.defaults.playerUrl.replace(rId, app.currId));
        }, function () {
            setTimeout(app._fetch, 50);
            console.log('fail');
        });
    };

    app.spinIt = function () {
        app.generateId();

        $('#div').text(app.currId);
        spinner.spin($('#vid-box')[0]);

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