

//Time in seconds to display new messages incomming
var timeToDisplayNewMessage = 1.5

var session_id = getCookie("soyouman");

if (typeof websocket_protocol != "undefined")
{
    var chatSocket = new WebSocket(
    websocket_protocol + '://' + window.location.host +
    '/ws/SYM/conversation/' + session_id + '/');
}


/**
 * Scroll to the bottom of the message list
 */
function ScrollHeight() {
    var objDiv = document.getElementById("last");
    if(objDiv)
        objDiv.scrollTop = objDiv.scrollHeight;
    return;
}

/**
 * Get current time
 */
function Time() {
    var time = new Date().toLocaleTimeString('en-GB', {hour: "numeric", minute: "numeric"});
    return time.toString();
}

function setFocus(){
    $("#message").focus();
}

function submitForm() {
    if($('#message').val())
        $('#btnHide').click();
}

/**
 * Get a cookie by its name
 */
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

/**
 * Handle the instructions incoming from the socket, if the instruction is wait,
 * the function is recursively called
 */
function handle_instructions(instructions, index){
    
    data = instructions[index]
    timeWait = 0.0
    ScrollHeight();

    if (data != null){
        if(data.type == "display_message" && data.message){

            add_message_to_dialog(data);
        }
        else if(data.type == "show_loading"){

            $("#load").show();

        }
        else if(data.type == "hide_loading"){

            $("#load").hide();
        }
        else if(data.type == "set_template" && data.message){

            $(".chatlogs-interaction").html(data.message);
        }
        else if(data.type == "wait"){

            timeWait = data.amount;
        }

        setTimeout(function(){
            ScrollHeight();
            setFocus();
        }, 100)

        setTimeout(function(){
            handle_instructions(instructions, index+=1);
        }, timeWait)
    }
}

/**
 * Physically add a message to the conversation
 */
function add_message_to_dialog(data) {

    $(".chatlogs-messages").append($(data.message))

    if(data.show_loading){
        $("#load").show()
    }
    else {
        $("#load").hide()
    }
}
