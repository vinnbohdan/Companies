$(function() {
var id = "";
// get json data from the server and render companies tree   
    $.getJSON( "/data.json", function( data ) {
        var result = jQuery.parseJSON(data);
        $('#jstree').jstree({ 
            'core' : {
                "themes" : {
                "variant" : "large",
                "icons" : false
            },
            'data' : result,
            "multiple" : false
            } 
        });
        $('#jstree').on("select_node.jstree", function (e, data) {
            console.log(data);
            id = data.node.original._id;
            $("#tbNameComp").val(data.node.original.name);
            data.node.parent == "#" ? $("#tbParentName").val("") : $("#tbParentName").val(data.node.original.parentName);
            $("#tbEarnings").val(data.node.original.earnings);
            hideButtons(false);
        });
    });
    
// Validate function
    $('#form').validate({
        rules: {
            tbNameComp: {
                required: true//,
                //equals: names
            },
            tbEarnings: {
                required: true,
                number: true
            }
        },
        messages: {
            tbNameComp: {
                required: "Please specify company name"//,
                //equals: "This company exists"
            },
            tbEarnings: {
                required: "Enter annual earnings",
                number: "Value must be an integer positive number"
            }
        }
    });

// Add button action 
    $("#buttonAdd").click(function () {
        $("#tbNameComp").val("");
        $("#tbParentName").val("");
        $("#tbEarnings").val("");
        switchEdit("#btnInsert");
    });

// Insert button action
    $("#btnInsert").click(function () {
        if ($('#form').valid()) {
            var comp = $("#tbNameComp").val();
            var parent = $("#tbParentName").val();
            var earn = $("#tbEarnings").val();

            $.post("/insert", {tbNameComp : comp, tbParentName: parent, tbEarnings: earn}, function(data, status){
                alert(data);
                location.reload();
            }).fail( function(){
                alert("Problem, Mongo server is unavailable");}
            );
        }
    });

// Edit button action
    $("#buttonEdit").click(function () {
        switchEdit("#btnUpdate");
    });

// Update button action
    $("#btnUpdate").click(function () {
        if ($('#form').valid()) {
            var comp = $("#tbNameComp").val();
            var parent = $("#tbParentName").val();
            var earn = $("#tbEarnings").val();
            var result = confirm("You want to update company " + comp);
            if (result) {
                $.post("/update", {idComp: id, tbNameComp : comp, tbParentName: parent, tbEarnings: earn}, function(data, status){
                    alert("Company " + comp + " was updated successfully");
                    location.reload();
                }).fail( function(){
                    alert("Problem, Mongo server is unavailable");}
                );
            }
        }
    });

// Delete button action
    $("#buttonDelete").click(function () {
        var comp = $("#tbNameComp").val();
        var result = confirm("You want to delete company " + comp);
        if (result) {
            $.post("/delete", {idComp: id}, function(data, status){
                alert("Company " + comp + " was deleted successfully");
                location.reload();
            }).fail( function(){
                alert("Problem, Mongo server is unavailable");}
            );
        }
    });

// Cancel button action
    $("#btnCancel").click(function () {
        $("#tbNameComp").val("");
        $("#tbParentName").val("");
        $("#tbEarnings").val("");
        hideButtons(true);
    });
// function for hiding edit elements
    function hideButtons(vis) {
        $("#hideblock").show();
        $("#btnInsert").hide().prop("disabled", true);
        $("#btnUpdate").hide().prop("disabled", true);
        $("#btnCancel").hide().prop("disabled", true);
        $("#buttonEdit").prop("disabled", vis);
        $("#buttonDelete").prop("disabled", vis);
        $("label.error").hide();
        $("#tbNameComp").prop({"disabled": true});
        $("#tbParentName").prop({"disabled": true});
        $("#tbEarnings").prop({"disabled": true});
    }
// function for showing edit elements
    function switchEdit(button) {
        $("#tbNameComp").prop({"disabled": false});
        $("#tbParentName").prop({"disabled": false});
        $("#tbEarnings").prop({"disabled": false});
        $("#hideblock").hide();
        $(button).show().prop("disabled", false);
        $("#btnCancel").show().prop("disabled", false);
    }
});