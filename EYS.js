$('#regForm .help-block').hide();
$('#div-success').hide();
$('#div-error').hide();

let queryDict = {};
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
let source = ''
source = queryDict.source

//let urlThankYou='/aon_personal_insurance';

//function used to insert the data in salescloud
function validateForm(e){
    console.log('validateForm')
    //function used to insert the data in salescloud
    
    // avoid to execute the actual submit of the form.
    e.preventDefault();
    // $('#div-spinner .help-block').show();
    
    var validateButton = document.getElementById("regBut");
    if (validateButton !== null) {
        validateButton.disabled = true;
    }
    
    var datas = {
        "source":source, 
        "yourName":$('#yourName').val(), 
        "firstName":$('#firstName').val(), 
        "lastName":$('#lastName').val(), 
        "cellNumber":$('#cellNumber').val(), 
        "emailAddress":$('#emailAddress').val(),
        "preferedInsurance" : $('#preferedInsurance option:selected').val(),
    }
    
    console.log("stringify datas, isPersonal, source", JSON.stringify(datas))
    
    //Ajax call to insert the data in salescloud
    $.ajax({
        type: 'POST',
        url:$("#regForm").attr('action'),
        data: datas,
        dataType: 'json',
        success: function(data) {
  console.log('data return ', data)
            if (validateButton !== null) {
                validateButton.disabled = false; // enable the button
            }
            if(data.success == "True") {
                $('#div-spinner .help-block').hide();
    $('#div-success').show(); 
                $('#div-error').hide();
    $( '#regForm' ).each(function(){ 
                    this.reset();
                });
                
            } else {
                //alert("error: "+data.success);
                console.log('data.success:\n' + data.success);
                console.log(data);
     $('#div-error').show();
    $('#div-success').hide();  
            }
        },
        error: function(a, b, c) {
            console.log('error:\n');
            console.log(a);
            console.log(b);
            console.log(c);
            
        }
    });
}



$('#regBut').click(function(event){
    console.log('#regBut')
    if(checkAllInputs()){
        event.preventDefault();
        validateForm(event);
    }
    else{
        event.preventDefault();
    }
})

function checkTermsChecked(){
    let hnd = document.getElementById('accept')
    console.log('hnd', hnd)
    console.log('$(hnd)', $(hnd))
    if(checkCBExistsAndChecked('accept')){
        $('#accept').next('.help-block').css('display', 'none')
        return true
    }
    else{
        $('#accept').next('.help-block').css('display', 'block')
        return false
    }
}

function checkValue(idElement, placeholder){
    let hnd = document.getElementById(idElement)
    console.log(document.getElementById(idElement).value)
    if(document.getElementById(idElement) && (document.getElementById(idElement).value == "" || document.getElementById(idElement).value == placeholder)){
        $(hnd).parent().addClass('has-error')
        $(hnd).next('.help-block').css('display', 'block')
        return false
    }
    else{
        $(hnd).parent().removeClass('has-error')
        return true
    }
}

function isEmail(idEmail) {
    let hnd = document.getElementById(idEmail);
    let email = document.getElementById(idEmail).value;
    console.log('hnd idEmail', email)
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(regex.test(email)){
        $(hnd).parent().removeClass('has-error')
        return regex.test(email);
    }
    else{
        $(hnd).parent().addClass('has-error')
        $(hnd).next('.help-block').css('display', 'block')
    }
    return false;
}

function isPhone(idPhone) {
    let hnd = document.getElementById(idPhone);
    let phone = document.getElementById(idPhone).value;
    console.log('hnd idPhone', phone)
    var regex = /^\d{9,10}$/;
    if(regex.test(phone)){
        $(hnd).parent().removeClass('has-error')
        return true;
    }
    else{
        $(hnd).parent().addClass('has-error')
        $(hnd).next('.help-block').css('display', 'block')
    }
    return false;
}                                        

function checkAllInputs(){
    
    $('#regForm .help-block').hide()
    
    let resYourName = checkValue('yourName', 'First Name');
    let resFirstName = checkValue('firstName', 'First Name');
    let resLastName = checkValue('lastName', 'Last Name');
    let resCellNumber = isPhone('cellNumber');
    let resEmail = isEmail('emailAddress');
    let resInsuranceType = checkValue('preferedInsurance', 'Please select your preferred insurance option');
    let isTermsChecked = checkTermsChecked();
    let test=false
    test = resYourName&&resFirstName&&resLastName&&resCellNumber&&resEmail&&resInsuranceType&&isTermsChecked;
   
    console.log('checkAllInputs ', test)
    if(test){                                               
        console.log('true')
        return true
    }
    else{
        console.log('false')
        return false
    }
}

function checkCBExistsAndChecked(idCB){
    if(document.getElementById(idCB) && document.getElementById(idCB).checked){
        return true
    }
    return false
}