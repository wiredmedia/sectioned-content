/*
 * module:
 * uses:
 * description:
 ---------------------------------------- */
var SECTIONED = (function (module) {

    module.sectionedContent = function(){

        var el = {};

        $(document).ready(function (){ init(); });

        function init(){

            el.postArea = $('#postdivrich');

        }

    }();

    return module;

}(SECTIONED || {}));