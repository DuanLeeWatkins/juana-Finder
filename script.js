const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

function getStrains(query) {
  const url = searchURL + apiKey + "/strains/search/race/" + query;
  let strain = "";
  fetch(url)
    .then((res) => res.json())
    .then(async (strains) => {
      let html = "";
      for (let i = 0; i < 20; i++) {
        const urlTwo =
          searchURL + apiKey + "/strains/data/desc/" + strains[i].id;
        let desc = await fetch(urlTwo);
        desc.json().then((data) => {
          html += `
            <div class="col-6 col-with-margins">
                <div class="card" data-strain-id="1">
                    <div class="card-body">
                        <h3 class="card-title h4">${strains[i].name}</h3>
                        <p class="card-text" style="display:block">${data.desc}</p>
                    </div>
                </div>
            </div>
          `;
        });
      }
      $("#strain-cards").html(html);
    });

  $("#results").removeClass("hidden");
}
function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    let strainRace = $("#strain-race").val();

    getStrains(strainRace);
  });
}

$(watchForm);
