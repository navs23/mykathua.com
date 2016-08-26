/*global $*/
$(document).ready(function(){

    $('.bd-register').on('click',function(){
        
        $('.error-msg ul').empty();
        
        var _value,_expression,_label;
        $("#registerWithUs .required").each(function(e){
            
           _value=$(this).val();
           _label=$(this).prev('label').text();
           _expression= new RegExp($(this).attr('validatorExpression'));
           
           if (!_expression.test(_value))
           {
               $('.error-msg ul').append('<li>Invalid ' + _label + '</li>');
               
           }
           
           
            // /alert($(this).attr('validatorExpression'));
            
        });
        
    });
   
   
       $('#registerWithUs').on('hidden.bs.modal', function () {
   
   $('.error-msg ul').empty();
    
});
    
});