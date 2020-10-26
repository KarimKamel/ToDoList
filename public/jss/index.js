$(".removeCheckBox").on("change", function () {
  if (this.checked) {
    $(".remove").css("display", "inline-block");
  } else {
    $(".remove").css("display", "none");
  }
});

// if ($(".removeCheckBox").is(":checked")) {
//   $(".remove").css("display", "");
// }
