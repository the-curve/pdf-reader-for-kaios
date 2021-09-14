// For activiy handling
navigator.mozSetMessageHandler('activity', function(activityRequest) {
    var data = activityRequest.source.data;
    var path = data.blob.name;

    var url = "pdfHandler.html?path=" + path;
    document.location.href = url;
});