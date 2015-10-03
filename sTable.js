;(function($){
    'use strict'

    /*  Plugin name
     *  CHANGE 'NAME' TO YOUR PLUGIN NAME
     */
    var plugin_name = 'NAME';

    /*  default properties which will assigned to elements in initialization
     */
    var defaults = {
        //INSERT YOUR PROPERTIES HERE
    };

    /*  public methods are functions which can be called by
     *  $(elements).PLUGIN_NAME('FUNCTION_NAME',ARG1,ARG2,...);
     *  'this' refers to the DOM elements which your plugin
     *  called on it.
     */
    var public_methods = {
        /*  With this public method you can set and get properties associated
         *  with the initialized element.
         *
         *  Get all properties associated to initialized DOM as an object
         *     $(ELEMENTS).PLUGIN_NAME('option')
         *  Set all properties object to the OBJECT
         *     $(ELEMENTS).PLUGIN_NAME('option', OBJECT)
         *  Get property value by giving the property key. if you
         *  have nested objects for your properties, use '.' in
         *  between your key names.
         *     $(ELEMENTS).PLUGIN_NAME('option','key_path')
         *  Set property value by giving the property (key) and value
         *  VALUE. if you have nested objects for your properties (keys),
         *  use '.' in between your key names.
         *     $(ELEMENTS).PLUGIN_NAME('option','key_path',VALUE)
         */
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
        },
        //DEFINE YOUR PUBLIC FUNCTIONS HERE.
    };

    /*  private methods are functions which are not visible and accessible by
     *  the user of your plugin.
     *  Best practice is to consider your first argument as the
     *  DOM element or elements which you want the private function works on.
     *  this way, you don't have to worry about 'this' value in your function.
     *  you can call private methods like this
     *    private_methods.FUNCTION_NAME(ARG_WHICH_IS_ELEMENTS, ARG2, ...);
     *  but if you want to set the 'this' value in your function use:
     *    private_methods.FUNCTION_NAME.call(THIS_VALUE, ARG1, ARG2, ...);
     *  THIS_VALUE is the value of 'this' keyword in your private function.
     */
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
        //get one option, which is specified by string 'option'
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
        /*  set one option, which is specified by string 'option' to 'value'
         *  NOTICE: setOptions does not check for element isInitialized or not.
         *  if the key specified in option doesn't exist, nothing happens
         */
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
        /*  get the properties object associated to the element.
         *  If there are more than one element, the first
         *  element options will be returned.
         */
        getOptions: function(element){
            if (!private_methods.isInitialized(element))
                return null;
            return $(element).data(plugin_name);
        },
        /*  set the properties object associated to the element to options object.
         *  options object will be save by $.data('PLUGIN_NAME',options)
         *  NOTICE: setOptions does not check for element isInitialized or not.
         */
        setOptions: function(elements,options){
            $(elements).each(function(){
                var settings = $.extend(true,{},private_methods.getOptions(this),options);
                $(this).data(plugin_name,settings);
            });

        },
        //DEFINE YOUR PRIVATE FUNCTIONS HERE.
    };

    $.fn[plugin_name] = function(){
        var $elements = this;
        //Converting arguments to array to use array method benefits
        var options = [].slice.call(arguments);

        //If no argument provided to plugin, just initialize elements.
        if (options[0] == undefined){
            private_methods.init($elements);
        }
        /*  If one argument is provided and that argument is object, then
         *  we are assuming that we want to initial the elements with this
         *  object or we are just updating the options.
         */
        else if (typeof(options[0]) === 'object'){
            private_methods.init($elements);
            private_methods.setOptions($elements,options[0]);
        }
        /*  If one argument is provided and that argument is string, then
         *  we are assuming that we want to call a function with that name.
         *  The rest of the arguments will be redirected to our public function
         *  parameters.
         *  the 'option' value for the first argument which is used to set
         *  and get options from and to initialized elements, is defined as
         *  an public function, which you can refer to that in public_methods
         *  object.
         */
        else if (typeof(options[0]) === 'string'){
            //Name of the public function
            var name = options[0];
            //Parameters of the public function as an array
            var parameters = options.slice(1);
            //Return value of the public function for each element.
            //only the first value (if it isn't undefined) will be
            //returned.
            var returns = [];

            //validate if the public function exists.
            if (!public_methods[name])
                throw "'" + name + "' method does not exist.";

            //Calling the public function for each element and keep the results
            //in the returns object.
            $elements.each(function(){
                returns.push(public_methods[name].apply(this,parameters));
            });

            //If the first returns item is undefined then we're returning
            //the jQuery object and continue chaining.
            if (returns[0] !== undefined)
                return returns[0];
        }

        return $elements;
    }
}(jQuery));
