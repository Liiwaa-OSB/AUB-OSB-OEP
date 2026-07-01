$(document).ready(function(){
    // Get campaign from URL (e.g., ?campaign=uae)
    var urlParams = new URLSearchParams(window.location.search);
    var campaign = urlParams.get('campaign');
    var defaultCountry = 'lb'; // default Lebanon

    // Full mapping from campaign to country code (lowercase for intlTelInput)
    switch (campaign) {
        case 'uae': defaultCountry = 'ae'; break;
        case 'ksa': defaultCountry = 'sa'; break;
        case 'kwt': defaultCountry = 'kw'; break;
        case 'qat': defaultCountry = 'qa'; break;
        case 'jor': defaultCountry = 'jo'; break;
        case 'nyc': defaultCountry = 'us'; break;
        case 'fra': defaultCountry = 'fr'; break;
        default: defaultCountry = 'lb'; break;
    }

    var input = document.querySelector("#phone");
    var iti = window.intlTelInput(input, {
        excludeCountries: ["il"],
        hiddenInput: "00N0Y00000QGl8g",
        preferredCountries: [defaultCountry],
        initialCountry: defaultCountry,
        separateDialCode: true,
        utilsScript: "build/js/utils.js",
    });

    // Remove name from visible input so only the hidden input submits
    $(input).removeAttr('name');

    // Set country_code hidden field when user changes country
    function updateCountryCode() {
        $('#country_code').val(iti.getSelectedCountryData().iso2.toUpperCase());
    }
    updateCountryCode();
    input.addEventListener("countrychange", updateCountryCode);

    $("form").validate();

    // Phone validation
    var errorMap = ["Invalid number. ", "Invalid country code. ", "Too short. ", "Too long. ", "Invalid number. "];
    $.validator.addMethod('Validphonenumber', function (value, element) {
        var errorCode = iti.getValidationError();
        $.validator.messages.Validphonenumber = errorMap[errorCode] || "Invalid number";
        return iti.isValidNumber();
    }, "Invalid Phone Number");

    
    $("#phone").rules("add", { Validphonenumber: true });
});