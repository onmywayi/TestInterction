    function errorHandler(message, ex){
        dwr.util.setValue("error", "Cannot connect to server. Initializing retry logic.", {escapeHtml:false});
        setTimeout(function() { dwr.util.setValue("error", ""); }, 5000)
    }
          
    function updatePollStatus(pollStatus){
        dwr.util.setValue("pollStatus", pollStatus ? "Online" : "Offline", {escapeHtml:false});
    }
          
    function enableUpdates(enabled){
        if (!enabled) {
            dwr.util.setValue("clockDisplay", "This tab/window does not have updates enabled.");
        }else {
            dwr.util.setValue("clockDisplay", "");
        }
        Clock.setEnabledAttribute(enabled);
    }
    
    function setClockStatus(clockStatus) {
        dwr.util.setValue("clockStatus", clockStatus ? "Clock started" : "Clock stopped");
    }
    
    function testFunction() {
        Clock.getData('Lin', {
            callback: function(str) { alert(str); }
        });
    }