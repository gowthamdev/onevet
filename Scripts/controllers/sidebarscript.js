$(document).ready(function () {
    $(function () {
        $("#select").select2();
    });

    $('#right-part').on('mouseover', '.line-v', function () {
        var leftPosition = $(this).find('.box-position').width() + 28;
        $(this).find('.editbox-check').css({ 'left': leftPosition });
    });
    $('#right-part').on('mouseover', '.condition-over', function () {
        var leftPosition = $(this).find('.box-position-d').width() + 28;
        $(this).find('.editbox-check-d').css({ 'left': leftPosition });
    });
    



    //line graph
  /*  var selectedPoint = 5;
    var endPoint = 8;
    var stepDetails = [
            {
                Step: "Upload report",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Review report",
                    Reviewer: "Corey Taylor"
                },
            {
                Step: "Validate something",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Upload some document",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Answer questionnaire",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Review questionnaire",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Upload more documents",
                Reviewer: "Corey Taylor"
            },
            {
                Step: "Final approval",
                Reviewer: "Corey Taylor"
            },
]*/
    //  $('#right-part').on('click', '#pre', function () {
    /*setTimeout(function () {
        var data = lineGraph(selectedPoint, endPoint);
        $('#lineGraph').html(data);
    }, 1000);
    //  })

    function lineGraph(selectedPoint, endPoint) {
        var graph = '';
        for (var i = 1; i < endPoint; i++) {
            if (i < selectedPoint) {
                if (i == 1) {
                    graph = graph + '<span class="circle circle-click" ng-click="showStepDetails($event)"><span class="hide">' + i + '</span><img src="./images/circlec.svg" width="17px" height="17px"/></span><span class="circle-line">&nbsp;</span>';
                } else {
                    graph = graph + '<span class="circlef circle-click"><span class="hide">' + i + '</span><img src="./images/circlec.svg" width="18px" height="17px"/></span><span class="circle-line">&nbsp;</span>';
                }
            } else {
                if (i == selectedPoint) {
                    graph = graph + '<span class="circlef circle-click"><span class="hide">' + i + '</span><img src="./images/circlei.svg" width="17px" height="17px"/></span><span class="circle-linen">&nbsp;</span>';
                } else {
                    graph = graph + '<span class="circlee circle-click"><span class="hide">' + i + '</span><img src="./images/circle.svg" width="17px" height="17px"/></span><span class="circle-linen">&nbsp;</span>';
                }
            }
        }
        if (endPoint == selectedPoint) {
            graph = graph + '<span class="circlef circle-click last"><span class="hide">' + i + '</span><img src="./images/circlei.svg" width="17px" height="17px"/></span>';
        } else {
            graph = graph + '<span class="circlee circle-click last"><span class="hide">' + i + '</span><img src="./images/circle.svg" width="17px" height="17px"/></span>';
        }
        return graph;
    }
    $('#right-part').on('click', '.circle-click', function () {
        var sp = $(this).find('.hide').text();
        var ep = $(this).parent().find('.last .hide').text();
        var selectedPoint = parseInt(sp);
        var endPoint = parseInt(ep);
        var data = lineGraph(selectedPoint, endPoint);
        $('#lineGraph').html(data);
    });*/
    // })


    $('.less-class').click(function () {

        $('#left-part').removeClass('left_part');
        $('#left-part').addClass('left_partn');
        $('#right-part').removeClass('right_part');
        $('#right-part').addClass('right_partn');
        $('.more-class').removeClass('hide');
        $('.less-class').addClass('hide');
    });


    $('#left-part').on('click', '.more-class', function () {

        $('#left-part').removeClass('left_partn');
        $('#left-part').addClass('left_part');
        $('#right-part').removeClass('right_partn');
        $('#right-part').addClass('right_part');
        $('.less-class').removeClass('hide');
        $('.more-class').addClass('hide');
    });



    // script for mobile sidebar animation
    $('#menu-button').click(function () {
        $('#left-part-mobile').animate({ left: "0px", opacity: "1" }, 400, 'swing');
    });
    $('#sidebar-static-point').on('click', '.hide-side-bar', function () {

        $('#left-part-mobile').animate({ left: "-155px", opacity: "0.5" }, 400, 'swing');
    });

    // dropdown 
    $('.mydrop-down').hide();
    $('.show-drop-down').click(function () {
        $('.mydrop-down').toggle();
    });
    // drop up
    $('#sidebar-static-point').on('click', '#filters', function () {
        if ($('#dropup-filter').hasClass('slide-up')) {
            $('#dropup-filter').addClass('slide-down', 1000);
            $('#dropup-filter').removeClass('slide-up');
        } else {
            $('#dropup-filter').removeClass('slide-down');
            $('#dropup-filter').addClass('slide-up', 1000);
        }
    });
    //localStorage.setItem("prevWindowWidth", $(window).width())
    //// refresh page on resize
    //$(window).resize(function () {
    //    // This will execute whenever the window is resized
    //    // $(window).width(); // New width
    //    var prev = localStorage.getItem("prevWindowWidth");
    //    var cur = $(window).width();
    //    var diff = cur > prev ?( cur - prev) :( prev - cur);
    //    if (diff > 100) {
    //        location.reload();
    //    }
    //    localStorage.setItem("prevWindowWidth", cur);
    //   // if(localStorage.getItem("currentWindowWidth")
       

    //});



});