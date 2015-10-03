;(function($){
    'use strict'

    var plugin_name = 'sTable';

    var defaults = {
        title: '',
        actions: {},
        fields: {},

    };

    var public_methods = {

    };

    var private_methods = {
        //Checks if 'this' is initialized
        isInitialized: function(){ return $(this).data(plugin_name)?true:false; },
        //initialize
        init: function(){
            $elements = $(this);
            $elements.each(function(){
                if (!isInitialized.apply(this))
                    $(this).data(plugin_name,defaults);
            });
        },
        //check that all elements of an 'arr' array are equal to 'value'
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


        if (options[0] === undefined){
            $elements.each(function(){
                private_methods.init.apply(this, defaults);
            });
        }
        else if (typeof(options[0]) === 'object'){}
        //Handle external (public) function calls
        //TODO: Results overload indexing for results ([i])
        else if (typeof(options[0]) === 'string'){
            //Name of the public function
            var name = options[0];
            //Parameters of the public function as an array
            var parameters = options.slice(1);
            //Return of the public function for each element.
            //values[i] = return of the public function for elements[i]
            var returns = { elements:[], values:[] };

            //validate if the public functino exists.
            if (!public_methods[name])
                throw "'" + name + "' method does not exist.";

            //Calling the public function for each element and keep the results
            //in the returns object.
            $elements.each(function(){
                returns.elements.push(this);
                returns.values.push(public_methods[name].apply(this,parameters));
            });

            //If the return values for all elements were undefined, then we
            //are continuing jquery object chaining, else we are returning
            //the results object.
            if (!private_methods.allArrayEqualTo(returns.values, undefined))
                return returns;
        }

        return $elements;
    }
}(jQuery));

$('div').sTable(null);
