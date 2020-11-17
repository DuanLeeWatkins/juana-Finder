const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

function getStrains(query) {
  const url = searchURL + apiKey + "/strains/search/race/" + query;
  let strain = "";

  console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((strains) => {
      let html = "";

      for (let i = 0; i < strains.length; i++) {
        strain = strains[i];

        html += `
            <div class="col-6 col-with-margins">
                <div class="card" data-strain-id="1">
                    <div class="card-body">
                        <h3 class="card-title h4">${strain.name}</h3>
                        <p class="card-text" style="display:block"></p>
                    </div>
                </div>
            </div>
          `;
      }

      const url = searchURL + apiKey + "/strains/data/desc/" + strain.id;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          // - [ ] Get the description from the response
          // - [ ] Render the description in the card element

          $(`.card[data-strain-id=${strain.id}] .card-text(html)`);
        });

      $("#strain-cards").html(html);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    let strainRace = $("#strain-race").val();

    getStrains(strainRace);
  });
}

$(watchForm);
