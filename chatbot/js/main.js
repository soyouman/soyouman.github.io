//EVENT SECTION
$(document).ready(function () {

    //scroll down when keyword show up for mobile and tablet
    var _originalSize = $(window).width() + $(window).height()
    $(window).resize(function(){
        if($(window).width() + $(window).height() != _originalSize){
            ScrollHeight();
        }
    });

    $('body').on('click', '.span-button button', function(){
        $('.span-button button').removeClass('acceptButton-green').removeClass('acceptButton-white').addClass('acceptButton-disabled')
    })

    //Map paperClip click
    $('body').on('click', '.icon-attachment', function(){
        $('#id_document').click();
    });

    //Trigger the submit when a file is chosen by the user
    $('body').on('change', '#id_document', function(){
        $('#formSend').attr("sub-attach", true);
        $('#formSend').submit();
    });

    // Trigger the submit when the user press the key ENTER (key=13)
    $('#message').keypress(function (e) {
        if (e.keyCode == 13)
        {
            e.preventDefault();
            submitForm();
        }
    });

    //Prevent multiple sent during page reload
    $('body').on('click', '#btnSend', function(e) {
        e.preventDefault();
        submitForm();
    });

    // Trigger the messages sent with the socket
    $('body').on('submit', '#formSend', function(e) {
        if(!$(this).attr("sub-attach")) {
             chatSocket.send(JSON.stringify({
                "method": "send_message",
                "session_id": session_id,
                "message": $(this).find("#message").val()
             }));

             $("#message").val("");

             return false
        }
    });

    //for each new last messages, display them with a timer
    var countNewMessages = 1;
    $('.hide').each(function(){
        var obj = $(this);

        setTimeout(function(){

            obj.removeClass("hide");
            ScrollHeight();

        }, timeToDisplayNewMessage * 1000 * countNewMessages);

        countNewMessages+=1;
    }).promise().done(function(){

        //remove the loading gif section
        setTimeout(function(){
            $("#load").hide();

        }, timeToDisplayNewMessage * 1000 * (countNewMessages - 1));
    })

    ScrollHeight();

    //Timer at the end of the conversation
    var timerBeforeReload = $('#autoReset > p > span');
    if(timerBeforeReload)
    {
        var remainTime = timerBeforeReload.html();
        if(!isNaN(remainTime))
            remainTime = 30;

        var interval = setInterval(function(){
            remainTime--;
            timerBeforeReload.html(remainTime)
            if(remainTime < 0)
            {
                clearInterval(interval);
                $('.btnReset').click();
            }
        }, 1000);
    }
});
