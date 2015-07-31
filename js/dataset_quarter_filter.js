(function($){
  Drupal.behaviors.dataset_quarter_filter = {
    attach:function(context, settings){
      var quarterFilter = this;
      quarterFilter.dateQuery = '';

      $('#page-quarterly-activity, #page-quarterly-report').ajaxComplete(function(event, xhr, settings) {
        if (event.target.id === 'page-quarterly-activity' || event.target.id === 'page-quarterly-report') {
          $('#pnl-report-loading').hide();
          $('#page-quarterly-activity .panel-panel').show();

          if($('.feed-icon.processed').length < 6){
            $('.view-quarterly-report-v2 .feed-icon a').text('Export');
            $('.view-quarterly-report-v2 .feed-icon').each(function(){
              var icon = this;
                  if($(icon).parent().children('.view-empty').length === 0){
                    var container = $(icon).parent().parent().parent();
                    if($(container).find('.feed-icon.processed').length === 0){
                      $(icon).insertAfter($(container).children('.pane-title').first());
                      $(icon).css('display', 'inline-block');
                      $(icon).addClass('processed');
                    }
                  }

            });
          }

        }
      });

      $(document).ready(function(){
        var filterElem = $('#page-quarterly-report, #page-quarterly-activity');
          if(filterElem && filterElem.length > 0){

            if($('.select-quarter').length === 0){
              var dateFromUrl = false;
              var year = parseInt(new Date().getFullYear());
              var years = [];
              for(var i = 2011; i <= year; i++){
                  years.push(i);
              }

              var url = window.location.href;
              var urlArr = url.split('/');
              var dateParam = urlArr[urlArr.length - 1];
              var dateArr = [];
              var startDate = '';
              var endDate = '';

              if(dateParam){
                dateArr = dateParam.split(/--/);
                if(dateArr.length === 2){
                  startDate = dateArr[0];
                  endDate = dateArr[1];
                  dateFromUrl = true;
                  quarterFilter.dateQuery = dateParam;
                }
              }

              if(!startDate){
                var today = new Date();
                var month = (today.getMonth() + 1);
                var day = today.getDate();

                if(day < 10){
                  day = '0' + day;
                }
                if(month < 10){
                  month = '0' + month;
                }

                startDate = year + month + day;
              }

              var selectedYear = year;
              var selectedStartMonth = -1;
              var selectedQuarter = 'Q1';

              var startDay = '01';
              var startMonth = '01';
              var endMonth = '03';
              var endDay = '31';

              if(startDate.length === 8){
                  selectedYear = startDate.substring(0,4);
                  selectedStartMonth = startDate.substring(4,6);

                  if(selectedStartMonth > 3){
                    startMonth = '04';
                    endMonth = '06';
                    endDay = '30';
                    selectedQuarter = 'Q2';
                  }
                  if(selectedStartMonth > 6){
                    startMonth = '07';
                    endMonth = '09';
                    endDay = '30';
                    selectedQuarter = 'Q3';
                  }
                  if(selectedStartMonth > 9){
                    startMonth = '10';
                    endMonth = '12';
                    endDay = '31';
                    selectedQuarter = 'Q4';
                  }
              }
              var startDateQuery = year + startMonth + startDay + '--' + year + endMonth + endDay;

              if(dateFromUrl === false && filterElem[0].id !== 'page-quarterly-activity'){
                $('.pnl-quarterly-report #zone-content').show();
                var pnlNotice = $("<div>", {class: "pnl-redirect-notice"});
                $(pnlNotice).html("Please wait, we're redirecting you to the latest quarterly report.");
                $(pnlNotice).prependTo('.pnl-quarterly-report #zone-content .region-content-inner .content').first();

                window.location = "/reports/quarterly-report/" + startDateQuery;
              }
              else{
                $('.pnl-quarterly-report #zone-content').removeClass('container-12');
                $('.pnl-quarterly-report #region-content').removeClass('grid-12');
                $('.pnl-quarterly-report #region-content').addClass('pnl-report-content');

                $('.view-quarterly-report-v2 .feed-icon a').text('Export');
                $('.view-quarterly-report-v2 .feed-icon').each(function(){
                  var icon = this;

                  if($(icon).parent().children('.view-empty').length === 0){
                    $(icon).insertAfter($(icon).parent().parent().parent().children('.pane-title').first());
                    $(icon).css('display', 'inline-block');
                    $(icon).addClass('processed');

                  }
                });

                $('.panel-pane, .panel-separator').show();
                $('.pnl-quarterly-report #zone-content').show();

                var quarters = {'Q1' : 'Q1', 'Q2' : 'Q2', 'Q3' : 'Q3', 'Q4' : 'Q4'};
                var hdnDate = $("<input>", {type: "hidden", id: "hdn-date", value: quarterFilter.dateQuery});

                var pnlFilter = $("<div>", {class: "pnl-filter", id: "pnl-select-quarter"});
                var ddlQuarters = $("<select>", {class: "form-select select-quarter"});
                var ddlYears = $("<select>", {class: "form-select select-year"});
                var btnSelect = $("<a>", {class: "btn btn-apply hidden", html: "Apply", id: "btn-select-quarter"});

                $.each(quarters, function(key, value){
                    $(ddlQuarters).append($('<option>', {value:key}).text(value));
                });

                $.each(years, function(key, value){
                    $(ddlYears).append($('<option>', {value:value}).text(value));
                });

                $(ddlYears).appendTo(pnlFilter);
                $(ddlQuarters).appendTo(pnlFilter);
                $(hdnDate).appendTo(pnlFilter);
                $(btnSelect).appendTo(pnlFilter);

                //if(filterElem[0].id === 'page-quarterly-activity'){
                  var pnlLoading = $("<div>", {id: "pnl-report-loading", class: "pnl-redirect-notice"});
                  $(pnlLoading).html("Loading...");
                  $(pnlLoading).prependTo(filterElem[0]).first();

                  $(pnlFilter).prependTo(filterElem[0]).first();
                //}
                //else{
                  //$(pnlFilter).prependTo('.pnl-quarterly-report #zone-content .region-content-inner .content').first();
                //}

                $('.select-quarter option').each(function(){
                    if($(this).val() === selectedQuarter){
                        $(this).attr('selected', true);
                    }
                });

                $('.select-year option').each(function(){
                    if($(this).val() === selectedYear){
                        $(this).attr('selected', true);
                    }
                });
                $(ddlQuarters).bind('change', filterChange);
                $(ddlYears).bind('change', filterChange);

                filterChange(true);
              }
            }
        }

        function filterChange(firstLoad){
          if(firstLoad === true || filterElem[0].id === 'page-quarterly-activity'){
            $('#page-quarterly-activity .panel-panel').hide();
            $('#pnl-report-loading').show();
          }

            var year = $('.select-year :selected').val();
            var quarter = $('.select-quarter :selected').val();
            var startDay = '01';

            var startMonth = '01';
            var endMonth = '03';
            var endDay = '31';

            if(quarter === 'Q2'){
                startMonth = '04';
                endMonth = '06';
                endDay = '30';
            }
            if(quarter === 'Q3'){
                startMonth = '07';
                endMonth = '09';
                endDay = '30';
            }
            if(quarter === 'Q4'){
                startMonth = '10';
                endMonth = '12';
                endDay = '31';
            }

            var startDate = year + '-' + startMonth + '-' + startDay;
            var endDate = year + '-' + endMonth + '-' + endDay;

            var startDateShort = year + '-' + startMonth;
            var endDateShort = year + '-' + endMonth;

            var quarterInt = quarter.replace('Q', '');
            var startDateQuery = year + startMonth + startDay + '--' + year + endMonth + endDay;

            if(firstLoad !== true && filterElem[0].id === 'page-quarterly-report'){
              var url = window.location.href;
              if($('#hdn-date').length > 0){
                url = url.replace($('#hdn-date').val(), startDateQuery);
              }
              else{
                url = url + "/" + startDateQuery;
              }
              window.location = url;
            }
            else{
              var inputs = $('#page-quarterly-activity, #page-quarterly-report').first('.views-exposed-form').find('input[type=text]'), inputCount = inputs.length;
              inputs.each(function(i){
                if(this.id.indexOf('min') > -1){
                  if(this.id.indexOf('student') > -1 || this.id.indexOf('participant') > -1){
                    $(this).val(startDateShort);
                  }
                  else{
                    $(this).val(startDate);
                  }
                }
                if(this.id.indexOf('max') > -1){
                  if(this.id.indexOf('student') > -1 || this.id.indexOf('participant') > -1){
                    $(this).val(endDateShort);
                  }
                  else{
                    $(this).val(endDate);
                  }
                }
                if(this.id.indexOf('quarter') > -1){
                  $(this).val(quarterInt);
                }
                if(this.id.indexOf('year') > -1){
                  $(this).val(year);
                }

                if(!--inputCount){
                  $('#page-quarterly-activity, #page-quarterly-report').find('.views-exposed-form').each(function(){
                    $(this).find('input[type=text]').first().each(function(){
                      $(this).trigger('change');
                    });
                  })
                  $('#page-quarterly-activity').first('.views-exposed-form').find('input[type=text]').last().each(function(){
                    $(this).trigger('change');
                  });
                }
              });



              if($('#hdn_quarter_dates').length > 0){
                //$('#hdn_quarter_dates input[type=hidden]').val(startDateQuery);
              }

              //$('#edit-submit-quarterly-pi-contribution-activity').click();
              $('#page-quarterly-activity .views-exposed-form input[type=submit]').each(function(){
                //$(this).click();
              });
            }
        }
			});

      $(window).load(function(){
        $('#page-quarterly-activity, #page-quarterly-report').find('.views-exposed-form').each(function(){
          $(this).find('input[type=text]').first().each(function(){
            $(this).trigger('change');
          });
        })
        $('#page-quarterly-activity').first('.views-exposed-form').find('input[type=text]').last().each(function(){
          $(this).trigger('change');
        });
      });
    }


  };
}(jQuery));
