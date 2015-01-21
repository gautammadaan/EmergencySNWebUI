function change(){
    var options = document.getElementById('options');
    var search = document.getElementById('search');
    var optionStatus = document.getElementById('optionStatus');
    var value = options.value;
    if(value == "status"){
    	optionStatus.removeAttribute("hidden");
    	search.setAttribute("hidden","hidden");
    	search.removeAttribute("class");
    }else{
    	search.removeAttribute("hidden");
    	search.setAttribute("class", "form-control");
    	optionStatus.setAttribute("hidden","hidden");
    	
    }
}
