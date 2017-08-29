var stepVars = document.getElementsByClassName("step");
var firstVar = stepVars[0];
if(firstVar.getAttribute("data-step") == 'shipping_method'){
  
  	var doShipping = function(){
    var shippingRecap = document.querySelector('.section--shipping-method');
    var shippingMethodsContainer = document.querySelector('[data-shipping-methods]');
    var shippingMethods = document.querySelectorAll('[data-shipping-method]');
    var shippingOptions = [];

    for(i = 0; i < shippingMethods.length; i++){
      var method = shippingMethods[i];

      var methodValue = method.dataset['shippingMethod'];
      methodValue = methodValue.replace('PI Bespoke Shipping-','');
      var methodArray = methodValue.split('_');

      var zone_key = methodArray[0];
      var zone_id = methodArray[1];
      var zone_slug = methodArray[2];
      var day = methodArray[3];
      var date = methodArray[4];
      var timeStart = methodArray[5];
      var timeEnd = methodArray[6];
      var addressType = methodArray[7];
      var shippingType = methodArray[8].split('-')[0];
      var cost = methodArray[8].split('-')[1];
      var full = methodValue

      var radio = method.getElementsByTagName('input')[0];

      if(addressType !== 'residential'){
        method.parentNode.parentNode.removeChild(method.parentNode);
        continue;
      }
      //method.parentNode.className += date;

      method.parentNode.insertBefore( radio, method);

      if(timeStart.length < 4){timeStart = "0"+timeStart};
      if(timeEnd.length < 4){timeEnd = "0"+timeEnd};

      var label = method.querySelector('[data-shipping-method-label-title]');

      var deliveryWindowOpen = moment(date + ' ' + timeStart , 'YYYY-MM-DD H');
      var deliveryWindowClose = moment(date + ' ' + timeEnd , 'YYYY-MM-DD H');


      var formattedDay = '<strong>' + deliveryWindowOpen.format('dddd') + '</strong>';
      var formattedDate = '<strong>' + deliveryWindowOpen.format('MMM D') + '</strong>';
      var formattedTime = '<span>' + deliveryWindowOpen.format('ha') + ' - ' + deliveryWindowClose.format('ha') + '</span>';

      label.innerHTML = formattedDay + formattedDate + formattedTime;

      var order =  deliveryWindowOpen.format('YYMMDDH')
      method.parentNode.style.cssText = "order:"+order+";";

      shippingOptions.push({
        zone_key:zone_key,
        zone_id:zone_id,
        zone_slug:zone_slug,
        day:day,
        date:date,
        timeStart:timeStart,
        timeEnd:timeEnd,
        addressType:addressType,
        shippingType:shippingType,
        cost:cost,
        full: methodValue
      });
    }
    
    console.log('shippingOptions', shippingOptions);
      
    var shippingInputs = document.querySelectorAll('[name="checkout[shipping_rate][id]"]');
    var isChecked = false;
      
    for(r=0; i<shippingInputs.length; r++) {
      var radio = shippingInputs[r];
      if(radio.checked){isChecked = true;}
    }
      
    if(!isChecked){
    	shippingInputs[0].checked = true;
    }

    //reordering position

    var renderDeliveringTo = function(){
      var deliveringToTemplate = document.getElementById('delivering_to');
      $('.section--shipping-method').before('<div id="shipping-delivering-to" class="section">'+deliveringToTemplate.innerHTML+'</div>');

      var zone = shippingOptions[0].zone_slug.replace('-',' ').toLowerCase();
      var cost = shippingOptions[0].cost.split('-')[0];

      if(cost === "0.00"){cost = "FREE"}
      else{cost = "$"+cost};

      document.getElementById('delivering_to_zone').innerHTML = zone;
      document.getElementById('delivering_to_cost').innerHTML = cost;
    };

    if(shippingOptions.length){
      var shippingMethodTitle = document.querySelector('.section--shipping-method .section__title');
      shippingMethodTitle.innerHTML = "Shipping day/time";
      renderDeliveringTo();
      $('.section.section--shipping-method').addClass('ready');
    }
  };

  var checker = function(){
    if(!$('.content-box[data-poll-refresh]').length){
      doShipping();
    }else{
      setTimeout(function(){
        checker();
      },1000);
    }
  };

  checker();
}
