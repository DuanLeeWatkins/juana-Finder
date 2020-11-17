const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

function getStrains(strainType) {}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    let strainType = $("#strain-type").val();
    getStrains(strainType);
  });
}

$(watchForm);
