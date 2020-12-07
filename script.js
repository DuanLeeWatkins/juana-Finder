"use strict";

const searchURL = "https://strainapi.evanbusse.com/";
const apiKey = "RcvgwyJ";

// Pagination variables
const ITEMS_PER_PAGE = 60;
let CURRENT_PAGE = 2;
let TOTAL_PAGES = 0;

function renderStrainCard({ id, name }) {
  return `
    <div class="card" data-strain-id="${id}">
        <div class="card-body">
            <h3
              class="card-title h4"
              data-toggle="collapse"
              data-target="#desc-${id}"
              aria-expanded="false"
              aria-controls="desc-${id}">
              ${name}
            </h3>
            <div id="desc-${id}" class="collapse">
              <p class="strain-desc"></p>
            </div>
        </div>
    </div>
  `;
}

function renderStrainCardList(strains) {
  return strains
    .map((strain) => {
      return `
        <div class="col-lg-3 col-md-4 col-sm-6 col-with-margins">
          ${renderStrainCard(strain)}
        </div>
      `;
    })
    .join("");
}

function renderPagination({ currentPage, totalPages }) {
  let buttonsHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const disabledClass = i === currentPage ? "disabled" : "";

    buttonsHTML += `
      <li class="page-item nav-page ${disabledClass}" data-page="${i}">
        <a class="page-link" href="#">${i + 1}</a>
      </li>
    `;
  }

  const disabledPreviousClass = currentPage === 0 ? "disabled" : "";
  const disabledNextClass = currentPage + 1 == totalPages ? "disabled" : "";

  const html = `
      <ul class="pagination justify-content-center">
        <li id="nav-previous" class="page-item ${disabledPreviousClass}">
          <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        
        ${buttonsHTML}

        <li id="nav-next" class="page-item ${disabledNextClass}">
          <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>
        </li>
      </ul>
  `;

  $("#pagination").html(html).removeClass("hidden");
}

function renderStrainPage({ currentPage, itemsPerPage, strains }) {
  const totalPages = Math.ceil(strains.length / itemsPerPage);

  const strainsToDisplay = strains.slice(
    itemsPerPage * currentPage,
    itemsPerPage * currentPage + itemsPerPage
  );

  const html = renderStrainCardList(strainsToDisplay);
  $("#strain-cards").html(html);

  // Fetch strain descriptions from API asynchronously and render in parallel
  strainsToDisplay.forEach(getStrainDescription);

  // Renders the strain pages based on the strains list length divided by the  items per page.
  //If the totalPages is not a whole number, it will get rounded up using Math.ceil.
  renderPagination({ totalPages, currentPage });

  $(".nav-page").click((ev) => {
    ev.preventDefault();

    const requestedPage = $(ev.currentTarget).data("page");
    renderStrainPage({ currentPage: requestedPage, itemsPerPage, strains });
  });

  $("#nav-previous").click((ev) => {
    ev.preventDefault();
    if (currentPage === 0) return;

    const requestedPage = currentPage - 1;
    renderStrainPage({ currentPage: requestedPage, itemsPerPage, strains });
  });

  $("#nav-next").click((ev) => {
    ev.preventDefault();
    if (currentPage === totalPages - 1) return;

    const requestedPage = currentPage + 1;
    renderStrainPage({ currentPage: requestedPage, itemsPerPage, strains });
  });
}

function getStrainDescription(strain) {
  return fetch(searchURL + apiKey + "/strains/data/desc/" + strain.id)
    .then((response) => response.json())
    .then((json) => {
      const $card = $(`.card[data-strain-id=${strain.id}]`);

      $(".strain-desc", $card).html(json.desc).show();
    });
}

function getStrains(query) {
  fetch(searchURL + apiKey + "/strains/search/race/" + query)
    .then((res) => res.json())
    .then((strains) => {
      renderStrainPage({
        currentPage: 0,
        itemsPerPage: 60,
        strains,
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
