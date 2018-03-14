
  var d = new Date();
  var months = ["Januar", "Februar","Mars","April","Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
  var m = months[d.getMonth()];
  var days ="";

  window.onload = function() {
  document.getElementById('month').textContent = m + " " + d.getFullYear();

  // Months with 31 days
  if(m=0,2,4,6,7,9,11){
    for (i = 1; i < 32; i++) {
      days += "<li>" + [i] + "</li>";
    };
// February with 28 days
  }else if (m=1) {
    for (i = 1; i < 28; i++) {
      days += "<li>" + [i] + "</li>";
    };
// Months with 30 days
  } else {
    for (i = 1; i < 31; i++) {
      days += "<li>" + [i] + "</li>";
    };
  }
document.getElementById('days').innerHTML = days;
};
