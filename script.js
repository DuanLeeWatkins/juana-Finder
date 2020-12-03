"use strict";

const itemsPerPage = 60;

const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

function renderPagination({ totalPages, currentPage }) {
  let buttonsHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    buttonsHTML += `
      <li class="page-item ${
        i === currentPage + 1 ? "disabled" : ""
      }"><a class="page-link" href="#">${i}</a></li>
    `;
  }

  const html = `
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 0 ? "disabled" : ""}">
          <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        ${buttonsHTML}
        <li class="page-item ${
          currentPage + 1 == totalPages ? "disabled" : ""
        }">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
  `;

  $("#pagination").html(html).removeClass("hidden");
}

function getStrains(query) {
  fetch(searchURL + apiKey + "/strains/search/race/" + query)
    .then((res) => res.json())
    .then((strains) => {
      let html = "";

      strains.forEach((strain) => {
        html += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-with-margins">
                <div class="card" data-strain-id="${strain.id}">
                    <div class="card-body">
                        <h3 class="card-title h4"
                          data-toggle="collapse"
                          data-target="#desc-${strain.id}"
                          aria-expanded="false"
                          aria-controls="desc-${strain.id}">
                            ${strain.name}
                        </h3>
                        <div id="desc-${strain.id}" class="collapse">
                          <p class="strain-desc"></p>
                        </div>
                    </div>
                </div>
            </div>
          `;
      });

      $("#strain-cards").html(html);
      renderPagination({
        totalPages: Math.ceil(strains.length / itemsPerPage),
        currentPage: 0,
      });

      strains.forEach((strain) => {
        fetch(searchURL + apiKey + "/strains/data/desc/" + strain.id)
          .then((response) => response.json())
          .then((json) => {
            const $card = $(`.card[data-strain-id=${strain.id}]`);

            if (!json.desc) {
              return $card.parent().remove();
            }

            $(".strain-desc", $card).html(json.desc).show();
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
