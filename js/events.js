game.events = new function() {
    var canvasPosition; 
    var events = this;
    this.init = function() {
        canvasPosition = getElementPosition(document.getElementById("gameCanvas"));
        document.addEventListener("mousedown", function(e) {
            game.isMouseDown = true;
            handleMouseMove(e);
            document.addEventListener("mousemove", handleMouseMove, true);
        }, true);

        document.addEventListener("mouseup", function() {
            document.removeEventListener("mousemove", handleMouseMove, true);
            game.isMouseDown = false;
            game.mouseX = undefined;
            game.mouseY = undefined;
        }, true);
    };


    function handleMouseMove(e) {
        game.mouseX = (e.clientX - canvasPosition.x) / game.scale;
        game.mouseY = (e.clientY - canvasPosition.y) / game.scale;
    };

    function getElementPosition(element) {
        var elem = element,
            tagname = "",
            x = 0,
            y = 0;

        while ((typeof(elem) === "object") && (typeof(elem.tagName) != "undefined")) {
            y += elem.offsetTop;
            x += elem.offsetLeft;
            tagname = elem.tagName.toUpperCase();

            if (tagname == "BODY") elem = 0;

            if (typeof(elem) == "object") {
                if (typeof(elem.offsetParent) == "object") elem = elem.offsetParent;
            }
        }

        return {
            x: x,
            y: y
        };
    }

};