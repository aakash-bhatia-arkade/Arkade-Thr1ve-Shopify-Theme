var collFilters = jQuery('.filter-wrap .js-filter-tags');
collFilters.change(function() {
	var newTags = [];
	collFilters.each(function() {
		if (jQuery(this).prop('checked')) {
			newTags.push(jQuery(this).val());
		}
	});
	if (newTags.length) {
		var query = newTags.join('+');
		window.location.href = jQuery('{{ 'tag' | link_to_tag: 'tag' }}').attr('href').replace('tag', query);
	}
	else {
		{% if collection.handle %}
			window.location.href = '/collections/{{ collection.handle }}';
		{% elsif collection.products.first.type == collection.title %}
			window.location.href = '{{ collection.title | url_for_type }}';
		{% elsif collection.products.first.vendor == collection.title %}
			window.location.href = '{{ collection.title | url_for_vendor }}';
		{% endif %}
	}
});

//Clear all Filters
jQuery('.clear-filters').click(function() {
	collFilters.each(function() {
		//Check whether any checkboxes are checked
		if(jQuery(this).prop('checked'))
		{
			//Clear each & every checkbox by setting the checked status to false
			jQuery(this).prop('checked', false);
		}
	});

	//Refresh the window and show all the products
	{% if collection.handle %}
		window.location.href = '/collections/{{ collection.handle }}';
	{% elsif collection.products.first.type == collection.title %}
		window.location.href = '{{ collection.title | url_for_type }}';
	{% elsif collection.products.first.vendor == collection.title %}
		window.location.href = '{{ collection.title | url_for_vendor }}';
	{% endif %}
});