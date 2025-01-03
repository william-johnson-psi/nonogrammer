/*
File: login-logic.js
Author: William Johnson
Date: N/A

Handles all account actions from index.html. Instead of collecting data from each element, 
we just use a form, and then pass in the form data. 
*/
$(document).ready(function() {
    /* Handle Form Submissions, this could be for signin, signup, and signout actions.
       This will grab and serialize the data from the form that was submitted  */
    $(document).on('submit', 'form', function(event) {
        event.preventDefault();
        form = $(this);
        action = form.attr('action');
        formData = form.serialize();
        
        $.ajax({
            url: 'php/api.php',
            method: 'POST',
            data: formData,
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    console.log('Successful action:');
                }
                else {
                    console.log('Successful Action but error in back-end with action |' + action + '|   Error: ' + data.error);
                }
            },
            error: function(jqXHR, status, error) {
                console.log('Error Triggered in API Action Handler: ' + error);
                console.log(jqXHR);
            },
        })

        location.reload(true);
    })


    $(document).on('click', '.link-create-account', () => {
        console.log('hit');
        if ($('#signup-container').hasClass('hidden')) {
            $('#signin-container').addClass('hidden');
            $('#signup-container').removeClass('hidden');
        }
        else {
            $('#signup-container').addClass('hidden');
            $('#signin-container').removeClass('hidden');
        }
    })

    
    /*On Page Load/Reload, check if we are signed in and change necessary elements */ 
    getSignedInUserInfo(toggleUserSession, toggleUserSession, toggleUserSession);
})

/**
 * In the Login Info page, *IF* the user is signed in
 * 1. Hide the sign-in and sign-up containers 
 * 2. Display the sign-out button
 * 3. Display the welcome message with the given username. 
 */
function toggleUserSession(data) {
    if (data.success) {
        $('#signin-container').addClass('hidden');
        $('#signup-container').addClass('hidden');
        $('#welcome-container').append('<h2>Welcome ' + data.username + ' (' + data.userId + ') ! </h2>');
    }
    else {
        $('signin-container').removeClass('hidden');
        $('signin-container').removeClass('hidden');
        $('#welcome-container').empty();
    }
}