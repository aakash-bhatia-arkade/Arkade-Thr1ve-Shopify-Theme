var convertStringToArray = (function() {
	var postcodeList = function(postcodesData) {
		var postCodesArray = postcodesData.split(','),//Split them using comma(,) and store the data
			postCodesRangeArray = [];

		/* Loop through the postcodes array and split them again using hyphen(-) */
		$.each(postCodesArray, function(i, data) {
			dataSplitArray = [];
			dataSplitArray = data.split('-');
			if($.isArray(dataSplitArray) && dataSplitArray.length > 1)
			{
				for(var i = dataSplitArray[0]; i <= dataSplitArray[1]; i++)
				{
					postCodesRangeArray.push(i.toString());
				}
			} else {
				postCodesRangeArray.push(dataSplitArray[0]);
			}
		});

		return postCodesRangeArray;
	}

	return {
		postcodeList: postcodeList
	}
})();