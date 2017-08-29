$(document).ready(function(){
    var endpoint = "https://mealplan-stg.api.thr1ve.me/api/subscriptions";
    var subscriptionsContainer = $('#active_subscriptions');
    var customerId = subscriptionsContainer.data('customerid');
    var template = $('#subscription_item').html();

    $.get(endpoint+'?shopify_customer_id='+customerId,function(data){
        for(i = 0; i < data.length; i++){
            var item = data[i];
            var order = item.webhook.payload;
            var attributesArray = order.note_attributes;
            var attributes = {};

            for(i2 = 0; i2 < attributesArray.length; i2++){
                var attribute = attributesArray[i2];
                attributes[attribute.name] = attribute.value;
            }

            console.log(attributes);

            subscriptionsContainer.append('<li id="sub_item_' + i +'">'+template+'</li>');
            var li = $('#sub_item_' + i);
            li.find('[data-mealtitle]').html(attributes.mealplan_title);
            li.find('[data-mealimage]').css({backgroundImage: 'url(' + attributes.mealplan_image + ')'});
            li.find('[data-mealcancel]').attr('data-mealcancel', item.id);

            var mealplan_items = JSON.parse(attributes.mealplan_items);
            var meal_total = 0;
            for(i3 = 0; i3 < mealplan_items.length; i3++){
                var line_item = mealplan_items[i3];
                meal_total = meal_total + (line_item.line_price * 0.01);
            }
            li.find('[data-mealcost]').html('$'+meal_total.toFixed(2));

            var original_order_date = moment(order.created_at);
            var order_date_difference = moment().diff(original_order_date, 'w');
            var original_shipping_line = order.shipping_lines[0].code;
            var original_shipping_date = moment(original_shipping_line.split('_')[4]).endOf("day");
            var shipping_date_difference = moment().diff(original_shipping_date, 'w');
            var next_shipping_date = original_shipping_date.add(order_date_difference, 'w');

            if(next_shipping_date.diff(moment(), 'w') > 0 && original_shipping_date.diff(moment(), 's') < 0){
                next_shipping_date = next_shipping_date.add(-1, 'w');
            }

            var next_billing_date = original_order_date.add(order_date_difference + 1, 'w');

            var weeks_remaining = (attributes.mealplan_duration - order_date_difference > 0 ? attributes.mealplan_duration - order_date_difference : 0) + ' of ' + (attributes.mealplan_duration > 1 ? attributes.mealplan_duration + ' weeks' : attributes.mealplan_duration + ' week');
            li.find('[data-weeksremaining]').html(weeks_remaining);
            li.find('[data-nextdelivery]').html(next_shipping_date.format('ddd D MMM, YYYY'));
            li.find('[data-nextpayment]').html(next_billing_date.format('ddd D MMM, YYYY'));
        }

        if(data.length > 0){subscriptionsContainer.show();}
    }).error(function(data){
        console.log(data);
    });

    $('#active_subscriptions').on('click', '[data-mealcancel]', function(e){
        console.log(e);
        var id = e.target.dataset.mealcancel;
        // $.ajax({
        //     url: endpoint+'/'+id,
        //     type: 'DELETE',
        //     dataType: "jsonp",
        //     success: function(result) {
        //         console.log(result);
        //     }
        // });
    });
});