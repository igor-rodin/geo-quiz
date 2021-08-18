import { getReviewItemTemplate } from "./review";

export function createPopUpReviews(reviews) {
  if (!reviews.length) {
    return;
  }
  const domReviews = document.createElement('div');
  domReviews.classList.add('reviews', 'reviews--popup');

  const domBtn = document.createElement('button');
  domBtn.classList.add('button--popup');
  domBtn.textContent = '\u00D7';
  domReviews.append(domBtn);

  const domList = document.createElement('ul');
  domList.classList.add('reviews__list--popup');

  domReviews.append(domList);
  reviews.forEach((val) => {
    const domLi = document.createElement('li');
    domLi.classList.add('reviews__item', 'review', 'review--popup');
    domLi.innerHTML = getReviewItemTemplate(val.userName, val.date, val.place, val.review);
    domList.append(domLi);
  })

  return domReviews;
}