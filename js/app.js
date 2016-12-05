(function($){

	/*
	 * Scrollbar
	 */
	$('.scrollbar-dynamic').scrollbar();

	/*
	 * iCheck
	 */
	$('input.checkbox-big').iCheck({
	  checkboxClass: 'icheckbox_shroogal-big'
	});
	$('input.radio-inline').each(function(){
		var self = $(this),
		label = self.next(),
		label_text = label.text();
		label.remove();
		self.iCheck({
			checkboxClass: 'icheckbox_line-blue',
			radioClass: 'iradio_line-blue',
			insert: label_text
		});
	});

	/*
	 * Selectmenu
	 */
	$("select").selectmenu();
	$("select.short").selectmenu({
		classes: {
			"ui-widget": "short",
			"ui-selectmenu-menu": "short"
		}
	});
	$("select.wide").selectmenu({
		classes: {
			"ui-widget": "wide"
		}
	});

	/*
	 * Checklist - My info (intro)
	 */
	$('#checklist').on('submit', function(e){
		e.preventDefault();
		var valid = true;
		var form = $(this);
		form.find('input[type="checkbox"]').each(function() {
            var checkbox = $(this);
			if(!checkbox.is(':checked')){
				valid = false;
			}
        });
		if(valid == true){
			var artboard = $('#artboard');
			if(artboard.hasClass('has-overlay')){
				artboard.removeClass('has-overlay');
				var el = $(this).find('button[type="submit"]');
				var video = el.attr('data-video');
				var section = el.attr('data-section');
				triggerVideoNavigation(video, section);
			}
		}else{
			alert('Please accept all the confirmations.');
		}
	});

	/*
	 * Input boxes (Filled - Non filled)
	 */
	$('input[type="text"], input[type="tel"], input[type="email"], input[type="number"]').bind("keyup change", function(){
		if($(this).val() != ''){
			$(this).addClass('filled');
		}else{
			$(this).removeClass('filled');
		}
	});

	/*
	 * Add feedback
	 */
	$('#addFeedback').on('click', function(e){
		e.preventDefault();
		var feedback_list = $('#feedbackList');
		var feedbacks = feedback_list.find('li.row').length;
		var new_id = feedbacks + 1;
		feedback_list.append(
			'<li class="row">'+
			  '<div class="col-xs-1">'+new_id+'</div>'+
			  '<div class="col-xs-10 no-padding-left no-padding-right"><textarea class="form-control scrollbar-dynamic" name="feedback'+new_id+'" id="feedback'+new_id+'"></textarea></div>'+
			  '<div class="col-xs-1 text-right"><a href="#" class="delete">Delete</a></div>'+
            '</li>'
		);
		// Reinitialize scrollbars
		feedback_list.find('.scrollbar-dynamic').scrollbar();
	});

	/*
	 * Delete feedback
	 */
	$('#feedbackList').on('click', '.delete', function(e){
		e.preventDefault();
		var row = $(this).parents('li.row');
		var feedback = row.find('textarea').attr('id');
		if(deleteFeedback(feedback)){
			row.remove();
			//console.log(feedback+' is removed.');
		}else{
			alert('Failed to delete the feedback.');
		}
	});

	/*
	 * Myinfo form open
	 */
	$('#dynamicTabs').on('click', '.trigger-form-expand', function(e){
		e.preventDefault();
		var parent = $(this).parent().parent(); // This li element
		var expanded = parent.parents('.myinfo-list').find('li.expanded'); // Expaned li element(s)
		// Closing expanded row
		expanded.find('.form-content').slideUp(250, function(){
			var status = expanded.find('.status');
			status.html(status.attr('data-previous'));
			if(status.text()!='incomplete'){
				status.addClass('filled');
			}
			expanded.removeClass('expanded');
		});
		// Opening expanding the row
		parent.find('.form-content').slideDown(250, function(){
			var status = parent.find('.status');
			var previous = status.text();
			status.attr('data-previous', previous);
			status.html('completing...').removeClass('filled');
			parent.addClass('expanded');
		});
	});

	/*
	 * Myinfo form close
	 */
	$('#dynamicTabs').on('click', '.close-button', function(e){
		e.preventDefault();
		var parent = $(this).parents('.form-content');
		parent.slideUp(250, function(){
			parent.parent().removeClass('expanded');
			var status = parent.parent().find('.status');
			status.html(status.attr('data-previous'));
			if(status.text()!='incomplete'){
				status.addClass('filled');
			}
		});
	});

	/*
	 * Myinfo form update
	 */
	$('#dynamicTabs').on('submit', '.myinfo-form', function(e){
		e.preventDefault();
		var form_id = $(this).attr('id');
		var fe_data = '';
		var data = {};

		// Name
		if(form_id == 'name'){
			var title = $('input[name="title"]:checked', '#'+form_id).val();
			var first_name = $('input[name="firstname"]', '#'+form_id).val();
			var middle_name = $('input[name="middlename"]', '#'+form_id).val();
			var last_name = $('input[name="lastname"]', '#'+form_id).val();
			fe_data = title +' '+first_name+' '+middle_name+' '+last_name;
			//data = { 'title': title, 'first_name':first_name, 'middle_name':middle_name, 'last_name':last_name };
		}
		// Gender
		if(form_id == 'gender'){
			var gender = $('input[name="gender"]:checked', '#'+form_id).val();
			fe_data = gender;
			//data = { 'gender': gender };
		}
		// Safeguards
		if(form_id == 'safeguards'){
			var vision = $('input[name="impairedvision"]:checked', '#'+form_id).val();
			var hearing = $('input[name="impairedhearing"]:checked', '#'+form_id).val();
			var assistance = $('input[name="needassistance"]:checked', '#'+form_id).val();
			var string = vision+','+hearing+','+assistance;
			var array = string.split(",");
			var count = array.reduce(function(n, val) {
				return n + (val === 'Yes');
			}, 0);
			if(count > 0){
				fe_data = count+' identified';
			}else{
				fe_data = 'None';
			}
			//data = { 'impaired_vision': vision, 'impaired_hearing': hearing, 'need_assistance':assistance };
		}
		// Disability Illness
		if(form_id == 'disabilityIllness'){
			var applicable = $('input[name="applicable"]:checked', '#'+form_id).val();
			// You other form fields here...
			if(applicable == 'Yes'){
				fe_data = 'Applicable';
			}else{
				fe_data = 'Not applicable';
			}
			//data = { 'applicable': applicable };
		}
		// Place of birth
		if(form_id == 'placeOfBirth'){
			var birth_country = $('select[name="birthcountry"]', '#'+form_id).val();
			var birth_state = $('select[name="birthstate"]', '#'+form_id).val();
			fe_data = birth_state+', '+birth_country;
			//data = { 'birth_country': birth_country, 'birth_state':birth_state };
		}
		// Date of birth
		if(form_id == 'dateOfBirth'){
			var birth_year = $('input[name="birthyear"]', '#'+form_id).val();
			var birth_month = $('input[name="birthmonth"]', '#'+form_id).val();
			var birth_day = $('input[name="birthday"]', '#'+form_id).val();
			var suffix = ordinal_suffix(birth_day);
			fe_data = birth_day+suffix+' '+birth_month+', '+birth_year;
			//data = { 'birth_year': birth_year, 'birth_month':birth_month, 'birth_day':birth_day };
		}

		/*
		 * Update forms
		 */
		if(updateMyinfo(data, form_id)){
			$(this).parent().slideUp(250, function(){
				var parent = $(this).parent();
				parent.find('.status').html(fe_data).addClass('filled');
				parent.removeClass('expanded');
				$('input[name="filled"]', '#'+form_id).val(1);

				// Exit, Continue buttons
				var all_filled = true;
				$('#'+form_id).parents('.myinfo-list').find('.myinfo-form').each(function() {
					var filled = $('input[name="filled"]', '#'+$(this).attr('id')).val();
					if(filled == 0){
						all_filled = false;
					}
					//console.log($(this).attr('id')+':'+filled);
				});
				if(all_filled){
					$('#'+form_id).parents('.myinfo-list').find('.form-final').show();
				}
			});
		}
	});


	/*
	 * Custom dropdowns
	 */
	 $('.drop-down').on('click', '.drop-value, .drop-arrow', function(e){
		 var dropdown = $(this).parents('.drop-down');
		 $('.drop-down').not(dropdown).each(function() {
		 	$(this).removeClass('dropped'); // Other dropdowns
			var val = $(this).find('.drop-value');
			var prev = val.attr('data-previous');
			val.html(prev);
		 });
		 dropdown.toggleClass('dropped'); // This dropdown
		 var this_val = dropdown.find('.drop-value');
		 var this_previous = this_val.attr('data-previous');
		 if(dropdown.hasClass('dropped')){
			 this_val.html('select');
		 }else{
			 this_val.html(this_previous);
		 }
	 });
	 $('.drop-content').on('click', 'li', function(e){
		 var val = $(this).text();
		 var dropdown = $(this).parents('.drop-down');
		 dropdown.find('.drop-value').html(val).attr('data-previous', val);
		 dropdown.find('.drop-hidden-value').val(val);
		 dropdown.find('.selected').removeClass('selected'); // Other items
		 $(this).addClass('selected'); // This item
		 dropdown.removeClass('dropped');
	 });

})(jQuery)


/*
 * Some functions to handle forms (For backend)
 */
function saveFeedback(feedback){
	// Ajax ...etc.
	return true // Demonstrate purposes.
}

function deleteFeedback(feedback){
	// Ajax ...etc.
	return true // Demonstrate purposes.
}

function updateMyinfo(data, form){
	// Ajax ...etc.
	return true // Demonstrate purposes.
}

// Function used to add suffix to the day
function ordinal_suffix(day) {
    var i = day % 10, j = day % 100;
    if (i == 1 && j != 11) { return "st"; }
    if (i == 2 && j != 12) { return "nd"; }
    if (i == 3 && j != 13) { return "rd"; }
    return "th";
}
