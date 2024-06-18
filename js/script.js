/*
File: script.js
GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table
Andy Tran, UMass Lowell Computer Science, andy_tran1@student.uml.edu
Copyright (c) 2024 by Andy. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AT on June 17, 2024 at 11:30 PM
*/

// File Description: 
// This file contains the JavaScript that is run to create and fill out the dynamic table.
// It also contains the jQuery code for tabs, eliminating those tabs, and ensures that
// errors are marked with messages pertaining to what is wrongly inputted in the form.

// This function controls the behavior
// of the entire website.
$(document).ready(function () {
    $("#tabs").tabs();

    // Create a jQuery UI slider with two-way binding for a text input field using a function.
    function createSlider(sliderId, inputId, min, max) {
        $(sliderId).slider({
            min: min,
            max: max,

            // Update the corresponding text input field when the slider value changes.
            // Then, update the table dynamically.
            slide: function (event, ui) {
                $(inputId).val(ui.value);
                updateTable();
            }
        });

        // Update the slider value when the text input field value changes.
        $(inputId).on('input', function () {
            var value = $(this).val();
            $(sliderId).slider('value', value);
            updateTable();
        });
    }

    // Create sliders for each text input field with specified ranges.
    // I chose to double the range of the given parameters.
    createSlider("#minRowSlider", "#minRowVal", -100, 100);
    createSlider("#maxRowSlider", "#maxRowVal", -100, 100);
    createSlider("#minColSlider", "#minColVal", -100, 100);
    createSlider("#maxColSlider", "#maxColVal", -100, 100);

    // Validation rules and messages using the jQuery Validation plugin.
    // These are styled with red in the browser so they are more readable.
    $("#tableForm").validate({
        rules: {
            minRowVal: {
                required: true,
                number: true,
                range: [-100, 100],
                minRowLessThanMaxRow: true
            },
            maxRowVal: {
                required: true,
                number: true,
                range: [-100, 100],
                maxRowGreaterThanMinRow: true
            },
            minColVal: {
                required: true,
                number: true,
                range: [-100, 100],
                minColLessThanMaxCol: true
            },
            maxColVal: {
                required: true,
                number: true,
                range: [-100, 100],
                maxColGreaterThanMinCol: true
            }
        },
        messages: {
            minRowVal: {
                required: "Please enter a minimum row value.",
                number: "Minimum row value must be an integer.",
                range: "Minimum row value must be between -100 and 100.",
                minRowLessThanMaxRow: "Minimum row value must be less than or equal to the maximum row value."
            },
            maxRowVal: {
                required: "Please enter a maximum row value.",
                number: "Maximum row value must be an integer.",
                range: "Maximum row value must be between -100 and 100.",
                maxRowGreaterThanMinRow: "Maximum row value must be greater than or equal to the minimum row value."
            },
            minColVal: {
                required: "Please enter a minimum column value.",
                number: "Minimum column value must be an integer.",
                range: "Minimum column value must be between -100 and 100.",
                minColLessThanMaxCol: "Minimum column value must be less than or equal to the maximum column value."
            },
            maxColVal: {
                required: "Please enter a maximum column value.",
                number: "Maximum column value must be an integer.",
                range: "Maximum column value must be between -100 and 100.",
                maxColGreaterThanMinCol: "Maximum column value must be greater than or equal to the minimum column value."
            }
        },
        submitHandler: function (form) {
            updateTable();
        }
    });

    // Custom validation methods for min-max value comparison.
    $.validator.addMethod("minRowLessThanMaxRow", function (value, element) {
        return parseInt(value) <= parseInt($("#maxRowVal").val());
    }, "Minimum row value must be less than or equal to the maximum row value.");

    $.validator.addMethod("maxRowGreaterThanMinRow", function (value, element) {
        return parseInt(value) >= parseInt($("#minRowVal").val());
    }, "Maximum row value must be greater than or equal to the minimum row value.");

    $.validator.addMethod("minColLessThanMaxCol", function (value, element) {
        return parseInt(value) <= parseInt($("#maxColVal").val());
    }, "Minimum column value must be less than or equal to the maximum column value.");

    $.validator.addMethod("maxColGreaterThanMinCol", function (value, element) {
        return parseInt(value) >= parseInt($("#minColVal").val());
    }, "Maximum column value must be greater than or equal to the minimum column value.");

    // Function to update the table dynamically based on current input values.
    // I've chosen not to have it changed already saved tables so that the user
    // does not accidently change them.
    function updateTable() {
        var minRowVal = parseInt($("#minRowVal").val());
        var maxRowVal = parseInt($("#maxRowVal").val());
        var minColVal = parseInt($("#minColVal").val());
        var maxColVal = parseInt($("#maxColVal").val());
        var tableContainer = $("#tableContainer");
        tableContainer.empty();

        // Create table, header, and body elements.
        var table = $("<table></table>");
        var thead = $("<thead></thead>");
        var tbody = $("<tbody></tbody>");
        var headerRow = $("<tr></tr>");

        // Create the top-left empty header cell.
        // This overlaps every other header so it looks "clean."
        headerRow.append("<th></th>");

        // Create each header cell for the columns.
        for (var i = minColVal; i <= maxColVal; i++) {
            headerRow.append("<th>" + i + "</th>");
        }
        thead.append(headerRow);

        // Create each row and cell for the table body.
        for (i = minRowVal; i <= maxRowVal; i++) {
            var row = $("<tr></tr>");
            row.append("<th>" + i + "</th>");
            for (var j = minColVal; j <= maxColVal; j++) {
                row.append("<td>" + (i * j) + "</td>");
            }

            tbody.append(row);
        }

        // Append the header and body to the table and display it in the container.
        table.append(thead).append(tbody);
        tableContainer.append(table);
    }

    // Form submission event handler to create a new tab with the generated table.
    $("#tableForm").on('submit', function (event) {
        event.preventDefault();
        if ($("#tableForm").valid()) {
            createNewTab();
        }
    });

    // Function to create a new tab with the table based on current input values.
    function createNewTab() {
        var minRowVal = $("#minRowVal").val();
        var maxRowVal = $("#maxRowVal").val();
        var minColVal = $("#minColVal").val();
        var maxColVal = $("#maxColVal").val();
        var params = `Row: [${minRowVal}, ${maxRowVal}] — Col: [${minColVal}, ${maxColVal}]`;
    
        // This adds a tabId to every newly created tab based on the date/time, 
        // which seems to be a viable way to differentiate tabs, from this Stack Overflow post:
        // https://stackoverflow.com/questions/11896160/any-way-to-identify-browser-tab-in-javascript 
        // I used this method because it reminded me of the common C and C++ way of distinguishing
        // between items generated by the code.
        var tabId = "tab-" + (new Date().getTime());
        
        // This creates two div elements, the lower one being a tableContainer with the
        // table-scroll class. This was the reliable way to get the headers from overlapping
        // the table during debugging.
        $("#tabs ul").append(`<li><input type="checkbox" class="tab-checkbox"><a href="#${tabId}">${params}</a> <span class="ui-icon ui-icon-close" role="presentation"></span></li>`);
        $("#tabs").append(`<div id="${tabId}">
                               <div class="table-scroll">
                                   ${$("#tableContainer").html()}
                               </div>
                           </div>`);
        $("#tabs").tabs("refresh");
    
        // Event handler for the close icon to remove the tab.
        $(".ui-icon-close").on("click", function () {
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            $("#tabs").tabs("refresh");
        });
    }

    $("#deleteTabs").on("click", function () {
        $(".tab-checkbox:checked").each(function () {
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
        });
        $("#tabs").tabs("refresh");
    });
});