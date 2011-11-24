(function ($, global) {
    var rId = /\{\{id\}\}/,
        app = global.app = {
            cache : {},
            currId : 0,
            defaults : {
                playerUrl : 'http://player.vimeo.com/video/{{id}}?title=0&byline=0&portrait=0&autoplay=1',
                apiUrl    : 'http://vimeo.com/api/v2/video/{{id}}.json'
            }
        },
        frame = $('<iframe />', {
            width : 400,
            height : 300,
            frameborder : 0,
            webkitAllowFullScreen : 1,
            allowFullScreen : 1
        });

    global.RouletteModel = Backbone.Model.extend({
        rand : function (n) {
            n = n || 99;
            return ~~(Math.random() * (Math.random() * n));
        },
        generateId : function () {
            var rand = this.rand,
                id = parseInt(rand(30) + '' + rand(99) + '' +
                              rand(99) + '' + rand(99) + '', 10);

            if (id in app.cache) {
                console.log('cache hit');
                return this.generateId();
            }

            this.cache[id] = id;
            app.currId = id;
            return id;
        },
        spinIt : function () {
            this.generateId();

            $('#div').text(app.currId);
            spinner.spin($('#vid-box')[0]);

            var dfd = $.Deferred();

            $.ajax({
                url : app.defaults.apiUrl.replace(rId, app.currId),
                dataType : 'jsonp'
            })
            .done(function (result) {
                // video doesn't exist
                if (result.length) {
                    dfd.resolve(result);
                    //console.log(result);
                } else {
                    dfd.reject();
                }
            });

            return dfd.promise();
        },
        _fetch : function () {
            $.when(app.spinIt()).then(function () {
                console.log(arguments[0]);
                spinner.stop();
                $('#vid-box').html(frame.attr('src', app.defaults.playerUrl.replace(rId, app.currId)));
            }, function () {
                console.log('fail');
                _.delay(app._fetch, 50);
            });
        }
    });

    global.RouletteView = Backbone.View.extend({
        el : $('#vid-box'),
        events: {
          'click .spin-btn' : 'getVideo',
          'keyup #new-todo' : 'showTooltip',
          'click .todo-clear a' : 'clearCompleted'
        },
        spinner : new Spinner,
        initialize : function() {
            //TODO
            $(global).bind('beforeunload', function () {
                $('#frame').prop('src', 'javascript: void(0)');
            });
        },
        getVideo : function () {
            
        }
    });

    $(app.init);
}(jQuery, this));