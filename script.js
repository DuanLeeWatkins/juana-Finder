const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

function getStrains(query) {
  fetch(searchURL + apiKey + "/strains/search/race/" + query)
    .then((res) => res.json())
    .then((strains) => {
      let html = "";

      strains.forEach((strain) => {
        html += `
            <div class="col-6 col-with-margins">
                <div class="card" data-strain-id="${strain.id}">
                    <div class="card-body">
                        <h3 class="card-title h4">
                            ${strain.name}
                        </h3>
                        <span class="strain-flavors" style="none:">
                            <span class="badge badge-pill badge-success"></span>

                        </span>
                        <p class="strain-desc" style="display:none"></p>
                    </div>
                </div>
            </div>
          `;
      });


      $("#strain-cards").html(html);

      strains.forEach((strain) => {
        fetch(searchURL + apiKey + "/strains/data/desc/" + strain.id)
          .then((response) => response.json())
          .then((json) => {
            $(`.card[data-strain-id=${strain.id}] .strain-desc`)
              .html(json.desc)
              .show();
          });
      });

      
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
