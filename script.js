var taskCount = 0,
    stepCount = 0;

$(document).ready(function() {
    $('#title0').keypress(handleGhostText);
    $('#title0').focusout(handleGhostText);

    //$('#sig0').keydown(checkStepAdd);
    $('.addBtn').click(addStep);

    $('.addBtn').click();
    document.activeElement.blur();
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

    //If its a tab and not moving up the tree
    if (event.keyCode === 9 && !event.shiftKey) {
        //only add a step if you are currently focused on the last step
        if (targetStepDiv.get(0) === $('div.step', targetStepDiv.parent()).last().get(0)) {
            addStep(targetStepDiv.parent());

            event.stopPropagation();
            return false;
        }
    }
};

//EXPECTING THE TARGET TO BE THE ADD BUTTON
var addStep = function(event) {
    console.log("ADDING STEP");

    var newStep = createNewStep(++stepCount);

    //Append to the steps container
    var stepContainer = $(event.target).parent().prev().find('.tSteps');
    stepContainer.append(newStep);

    $('#text' + stepCount).focus();
};

//Check to see if you should delete an empty step
var checkStepDelete = function(event) {
    var target = $(event.target);

    if (target.text().length === 0) {
        console.log("DELETING STEP");
        target.parent().parent().parent().remove();
    }
};

//EXPECTING THE TARGET TO BE THE TRASH ANCHOR
var removeStep = function(event) {
    console.log("REMOVING STEP");
    $(event.target).parent().parent().parent().parent().remove();
};

//EXPECTING THE TARGET TO BE THE COPY ANCHOR
var copyStep = function(event) {
    console.log("COPYING STEP");

    var targetStep = $(event.target).parent().parent().parent().parent();
    var newStep = targetStep.clone(true, true);

    //Change all of the ids
    stepCount++;
    newStep.attr('id', 'step' + stepCount);
    newStep.find('.sText').attr('id', 'text' + stepCount);
    newStep.find('.sSignature').attr('id', 'sig' + stepCount);

    targetStep.after(newStep);

    $('#text' + stepCount).focus();
};

//Create a new step element
var createNewStep = function(idNum) {
    var step = $(document.createElement("div"));
    step.attr({
        "class": "step",
        id: "step" + idNum,
    });
    //step.focusin(toggleHighlight);
    //step.focusout(toggleHighlight);

    var content = $(document.createElement("div"));
    content.attr("class", "sContent");

    var left = $(document.createElement("div"));
    left.attr("class", "sLeft");

    var text = $(document.createElement("p"));
    text.attr({
        "class": "sText",
        id: "text" + idNum,
        contenteditable: "true",
        "data-ghost": "Enter step text"
    });
    //text.focusout(checkStepDelete);
    text.keypress(handleGhostText);
    text.focusout(handleGhostText);

    var right = $(document.createElement("div"));
    right.attr("class", "sRight");

    var signature = $(document.createElement("select"));
    signature.attr({
        "name": "sSignature",
        id: "sig" + idNum
    });
    //signature.keydown(checkStepAdd);

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
    copyLi.click(copyStep);

    var trashLi = $(document.createElement("li"));
    trashLi.append($("<a />", {"class": "trash"}));
    trashLi.click(removeStep);

    list.append(copyLi);
    list.append(trashLi);

    bar.append(list);

    return bar;
};

var toggleHighlight = function(event) {
    $(event.target).parent().parent().parent().toggleClass("highlight");
};
