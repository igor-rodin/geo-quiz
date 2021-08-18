export function getReviewItemTemplate(name, date, place, review) {
  return `<div class="review__header">
            <span class="review__user">${name}</span>
            <span class="review__place">${place}</span>
            <span class="review__date">${date}</span>
          </div>
          <div class="review__text">${review}</div>`
};
export const reviewPlaceTemplate = `<div class="carusel-body"><a id="carusel__link" href='#' class="carusel__link" data-placemarkid="{{ properties.geoReview.Id}}">{{ properties.balloonContentBody }}</a></div>`