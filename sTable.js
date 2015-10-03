;(function($){
    'use strict'

    var plugin_name = 'sTable';

    var defaults = {
        title: 'asdf',
        actions: {
            get: 'http://get.com',
            post: 'http://post.com',
        },
        fields: {
            col1: {
                name: 'id',
                value: '12',
            }
        },

    };

    var public_methods = {
        option: function(){
            var args = [].slice.call(arguments);
            if (args.length === 0){
                return private_methods.getOptions(this);
            }
            else if((args.length === 1) && (typeof(args[0]) === 'object')){
                private_methods.setOptions(args[0]);
            }
            else if((args.length === 1) && (typeof(args[0]) === 'string')){
                return private_methods.getOption(this,args[0]);
            }
            else if((args.length === 2) && (typeof(args[0]) === 'string')){
                private_methods.setOption(this,args[0],args[1]);
            }
        }
    };

    var private_methods = {
        //Checks if the first element in 'elements' is initialized.
        isInitialized: function(element){
            return $(element).data(plugin_name)?true:false;
        },
        //initialize elements with 'defaults' properties.
        init: function(elements){
            var $elements = $(elements);
            $elements.each(function(){
                if (!private_methods.isInitialized(this)){
                    $(this).data(plugin_name,defaults);
                }
            });
        },
        //get the one option, which is specified by string option
        getOption(element,option){
            var $element = $(element);
            var option_arr = option.split('.');
            var value = private_methods.getOptions(element);
            var i;
            for (i=0;i<option_arr.length;i++){
                // ==null is equal to ===null || ===undefined
                if (value[option_arr[i]] == null)
                    return null;
                value = value[option_arr[i]];
            }
            return value;
        },
        setOption: function(element,option,value){
            var $element = $(element);
            var option_arr = option.split('.');
            var target = private_methods.getOptions(element);
            var i;
            for (i=0;i<option_arr.length-1;i++){
                // ==null is equal to ===null || ===undefined
                if (target[option_arr[i]] == null)
                    return null;
                target = target[option_arr[i]];
            }
            target[option_arr[i]] = value
        },
        //get the object associated to the element.
        //If there are more than one element, the first
        //element options will be returned.
        getOptions: function(element){
            if (!private_methods.isInitialized(element))
                return null;
            return $(element).data(plugin_name);
        },
        setOptions: function(elements,options){
            $(elements).each(function(){
                var settings = $.extend(true,{},private_methods.getOptions(this),options);
                $(this).data(plugin_name,settings);
            });

        },
        //check that all elements of an 'arr' array are equal to 'value'
        //TODO: if it isn't needed, delete it.
        allArrayEqualTo: function(arr, value){
            var i;
            for (i=0;i<arr.length;i++)
                if (arr[i] !== value)
                    return false;
            return true;
        },

    };


    $.fn[plugin_name] = function(){
        var $elements = this;
        var options = [].slice.call(arguments);


        if (options[0] == undefined){
            private_methods.init($elements);
        }
        //Handle setting the options to the DOM.
        //It first initialize the DOM and then set options.
        else if (typeof(options[0]) === 'object'){
            private_methods.init($elements);
            private_methods.setOptions($elements,options[0]);
        }
        //Handle external (public) function calls
        //TODO: Results overload indexing for results ([i])
        else if (typeof(options[0]) === 'string'){
            //Name of the public function
            var name = options[0];
            //Parameters of the public function as an array
            var parameters = options.slice(1);
            //Return of the public function for each element.
            //values[i] = return of the public function for elements[i]
            var returns = [];

            //validate if the public functino exists.
            if (!public_methods[name])
                throw "'" + name + "' method does not exist.";

            //Calling the public function for each element and keep the results
            //in the returns object.
            $elements.each(function(){
                returns.push(public_methods[name].apply(this,parameters));
            });

            if (returns[0] !== undefined)
                return returns[0];
        }

        return $elements;
    }
}(jQuery));
