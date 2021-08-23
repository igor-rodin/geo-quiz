export const balloonTemplate = `
<h3>$[properties.balloonHeader]</h3>
<div id="geoReviewBalloon" class="balloon">
    {% if properties.geoReview %}
    <div class="reviews balloon__reviews">
      <ul class="reviews__list">
      {% for rev in properties.geoReview.placeReviews %}
        <li class="reviews__item review">
          <div class="review__header">
            <span class="review__user">{{rev.userName}}</span>
            <span class="review__place">{{rev.reviewPlace}}</span>
            <time datetime={{rev.rawDate}} class="review__date">{{rev.reviewFormatedDate}}</time>
          </div>
          <div class="review__text">{{rev.review}}</div>
        </li>
      {% endfor %}
      </ul>
    </div>
    {% endif %}
    <div class="balloon__title">Отзыв:</div>
    <div class="balloon__row">
      <input id="geoUserName" class="balloon__input" type="text" placeholder="Укажите ваше имя">
    </div>
    <div class="balloon__row">
      <input id="geoPlace" class="balloon__input" type="text"  placeholder="Укажите место">
  </div>
    <div class="balloon__row">
      <textarea id="geoReview" class="balloon__input balloon__input--textarea"  placeholder="Оставить отзыв"></textarea>
    </div>
    <div class="balloon__row balloon__row--ctr">
      <button id="geoReviewAdd" class="button">Добавить</button>
    </div>
  </div>`;

export const mapBalloonTemplate = `
<div id="geoReviewBalloon" class="balloon">
    <div class="balloon__title">Отзыв:</div>
    <div class="balloon__row">
      <input id="geoUserName" class="balloon__input" type="text" placeholder="Укажите ваше имя">
    </div>
    <div class="balloon__row">
      <input id="geoPlace" class="balloon__input" type="text"  placeholder="Укажите место">
  </div>
    <div class="balloon__row">
      <textarea id="geoReview" class="balloon__input balloon__input--textarea"  placeholder="Оставить отзыв"></textarea>
    </div>
    <div class="balloon__row balloon__row--ctr">
      <button id="geoReviewAdd" class="button">Добавить</button>
    </div>
  </div>`;