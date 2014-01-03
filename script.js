var taskCount = 0,
    stepCount = 0;

$(document).ready(function() {
    $('#title0').keypress(handleGhostText);
    $('#title0').focusout(handleGhostText);
    $('#text0').keypress(handleGhostText);
    $('#text0').focusout(handleGhostText);
    $('#sig0').keydown(checkStepAdd);

    //$('#step0').focusin(toggleHighlight);
    //$('#step0').focusout(toggleHighlight);
});


/*
 * Handle the use of ghost text for the titles and first paragraph.
 * If text is entered, remove the ghost text, if there is no text
 * when the field loses focus, put it back.
 */
var handleGhostText = function(event) {
    var target = $(event.target);

    if (event.type === "focusout") {
        //show :after
        if (target.text().length === 0 && !target.hasClass("empty")) {
            target.addClass("empty");
        }
    } else {
        //get rid of :after
        if (event.charCode && target.hasClass("empty")) {
            target.removeClass("empty");
        }
    }
};

var checkStepAdd = function(event) {
    var targetStepDiv = $(event.target).parent().parent().parent();
    //console.log($('div.step', targetStepDiv.parent()).last());
    //console.log(targetStepDiv);


    //If its a tab and not moving up the tree
    if (event.keyCode === 9 && !event.shiftKey) {
        //only add a step if you are currently focused on the last step
        if (targetStepDiv.get(0) === $('div.step', targetStepDiv.parent()).last().get(0)) {
            console.log("ADDING STEP");

            var newStep = createNewStep(++stepCount);

            //Append to the steps container
            targetStepDiv.parent().append(newStep);
            
            //newStep.focusin(toggleHighlight);
            //newStep.focusout(toggleHighlight);

            $('#text' + stepCount).focusout(checkDeleteStep);
            $('#sig' + stepCount).keydown(checkStepAdd);
            $('#text' + stepCount).focus();

            event.stopPropagation();
            return false;
        }
    }
};

//Check to see if you should delete an empty step
var checkDeleteStep = function(event) {
    var target = $(event.target);

    if (target.text().length === 0) {
        console.log("DELETING STEP");
        target.parent().parent().parent().remove();
    }
};

//Create a new step element
var createNewStep = function(idNum) {
    var step = $(document.createElement("div"));
    step.attr({
        "class": "step",
        id: "step" + idNum,
    });

    var content = $(document.createElement("div"));
    content.attr("class", "sContent");

    var left = $(document.createElement("div"));
    left.attr("class", "sLeft");

    var text = $(document.createElement("p"));
    text.attr({
        "class": "sText",
        id: "text" + idNum,
        contenteditable: "true",
        "data-ghost": "Step text"
    });

    var right = $(document.createElement("div"));
    right.attr("class", "sRight");

    var signature = $(document.createElement("select"));
    signature.attr({
        "name": "sSignature",
        id: "sig" + idNum
    });

    signature.append($("<option />", {value: "-", text: "-"}));
    signature.append($("<option />", {value: "Verify", text: "Verify"}));
    signature.append($("<option />", {value: "Witness", text: "Witness"}));

    right.append(signature);

    left.append(text);

    content.append(left);
    content.append(right);

    step.append(createNewBar());
    step.append(content);

    return step;
};

//Create a new toolbar element.
//Shared amongst tasks/notes/signatures and steps
var createNewBar = function() {
    var bar = $(document.createElement("div"));
    bar.attr("class", "sBar");

    var list = $(document.createElement("ul"));

    var copyLi = $(document.createElement("li"));
    copyLi.append($("<a />", {"class": "copy"}));

    var trashLi = $(document.createElement("li"));
    trashLi.append($("<a />", {"class": "trash"}));

    list.append(copyLi);
    list.append(trashLi);

    bar.append(list);

    return bar;
};

var toggleHighlight = function(event) {
    $(event.target).parent().parent().parent().toggleClass("highlight");
};
