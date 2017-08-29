var stepVars = document.getElementsByClassName("step");
var firstVar = stepVars[0];
if(firstVar.getAttribute("data-step") == 'contact_information'){
   
  var addressField = document.getElementById('checkout_shipping_address_address1');
  var addressContainer = addressField.parentElement.parentElement;

  var cityField = document.getElementById('checkout_shipping_address_city');
  var cityContainer = cityField.parentElement.parentElement;

  var countryContainer = document.querySelector('[data-address-field="country"]');
  var stateContainer = document.querySelector('[data-address-field="province"]');
  var postCodeContainer = document.querySelector('[data-address-field="zip"]');


  var addressFieldsHide = function(boolean){
    cityContainer.dataset.hidden = boolean;
    countryContainer.dataset.hidden = boolean;
    stateContainer.dataset.hidden = boolean;
    postCodeContainer.dataset.hidden = boolean;

    var fallback = document.getElementById('manual-fallback-trigger');
    if(fallback !== null){
      fallback.dataset.hidden = !boolean;
    } 
  }

  var addressFieldsValidate = function(boolean){
    cityContainer.dataset.valid = boolean;
    countryContainer.dataset.valid = boolean;
    stateContainer.dataset.valid = boolean;
    postCodeContainer.dataset.valid = boolean;
  }

  var addressFieldsClear = function(){
    document.getElementById('checkout_shipping_address_city').value = '';
    document.getElementById('checkout_shipping_address_zip').value = '';
  }

  var checkAddressInput = function(){
    if(addressField.dataset.manual !== 'true'){
      addressFieldsHide(true);
      addressFieldsClear();
    }
  }

  var initAddressInput = function(){
    if(addressField.value == '' || cityField.value == ''){
      addressFieldsHide(true); 
      addressFieldsClear();
    }else{
      addressFieldsHide(false);
      addressFieldsValidate(true);
    }
  }

  addressField.onchange = checkAddressInput;
  addressField.onkeyup = checkAddressInput;

  initAddressInput();

  var widget, initAF = function(){
    widget = new AddressFinder.Widget(
      document.getElementById('checkout_shipping_address_address1'),
      'T6AX7NWKQ3DMUHEP8G4C',
      'AU',
      {
        max_results: "8",
        container: addressContainer,
        empty_content: "Looks like we can't find your address",
        position: 'relative',
        strict: "1"
      }
    );
    widget.on('result:select', function(fullAddress, metaData) {

      var composedAddress = metaData.address_line_2 ? metaData.address_line_1 + ', ' + metaData.address_line_2 : metaData.address_line_1;
      document.getElementById('checkout_shipping_address_address1').value = composedAddress;
      document.getElementById('checkout_shipping_address_city').value = metaData.locality_name;

      var stateInput = document.getElementById('checkout_shipping_address_province');
      var stateOption = stateInput.querySelector('[data-code=' + metaData.state_territory + ']');
      stateInput.value = stateOption.value;

      document.getElementById('checkout_shipping_address_zip').value = metaData.postcode;

      addressFieldsHide(false);
      addressFieldsValidate(true);
      cityContainer.classList.remove("field--error");
      postCodeContainer.classList.remove("field--error");
    });

    var para = document.createElement("p");
    para.id = 'manual-fallback-trigger';
    para.dataset.hidden = true;
    para.innerHTML = "Trouble finding your address? <span onclick='manualAddress()'>Enter it manually</span>";
    addressContainer.appendChild(para);
  };


  var manualAddress = function(){
    widget.disable();
    addressField.dataset.manual = true;
    addressFieldsHide(false);
    addressFieldsValidate(false);

    addressField.focus();
    addressField.blur();
    addressField.focus();
  };


  function downloadAF(f){
    var script = document.createElement('script');
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js';
    script.async = true;
    script.onload = f;
    document.body.appendChild(script);
  };

  downloadAF(initAF);
  $('#checkout_shipping_address_address1').on('keydown', function(e){
    if (e.keyCode == 13) {
      document.querySelector('.af_hover').click();
      e.target.blur();
      e.preventDefault();
      document.getElementById('checkout_shipping_address_phone').focus();
    }
  });
  
  var templateWrap = $('#shipping_type').html();
	$(templateWrap).insertAfter('.section--shipping-address');
  
  
  
  $('#address_type_selection').find('.shipping_type_selection input').on('change',function(e){
    var tabId = e.target.dataset.tab;
    
    $('#address_type_notes').find('.tab-pane').removeClass('active');
    $('#'+tabId).addClass('active');
    
  });
  
  $('form').on('submit',function(e){    
    if(document.getElementById('address_type-business').checked && document.getElementById('checkout_shipping_company').value === ''){
    	e.preventDefault();
      	$('#business .field').addClass('field--error');
      	$('#error-for-attributes-business_name').show();
    }
    if(!document.getElementById('checkout_authority_to_leave').checked){
    	e.preventDefault();
      	alert('Authority to leave without signature: Please confirm that our delivery driver can leave the order at your delivery address if nobody is there to sign for it. We will send you an SMS with details of where the order has been left.');
    }
    else if(!document.getElementById('checkout_terms_conditions').checked){
    	e.preventDefault();
      	alert('Please confirm that you have read and accepted our Terms and Conditions.');
    }
    
	if(!validateAddressFieldsOnFormSubmission()) {
      	e.preventDefault();
      	manualAddress();
    	alert('Sorry, the address is not valid. Please fill in the address fields manually.');
    } 
  });
  
  var isHidden = function (el) {
    return (el.offsetParent === null)
  }
  
  var validateAddressFieldsOnFormSubmission = function(){
    
    //When a customer select a stored address from address list, the customer will be directly 
    //proceed to the next step.
    var existing_address_select = document.getElementById('checkout_shipping_address_id')
        
    if(existing_address_select.value) {
    	return true;
    }
    
    if(isHidden(cityContainer) || isHidden(stateContainer) || isHidden(postCodeContainer)) {
    	return false;
    } else {
    	return true;
    }
  }
  
  var restore_attributes = function(){
  	var attributeKeys = Object.keys(window.customCheckoutAttributes);
    attributeKeys.forEach(function(key){
    	var value = window.customCheckoutAttributes[key];
      	console.log(key + ' ' + value);
    });
  }
}