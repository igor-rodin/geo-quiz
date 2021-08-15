export const balloonTemplate = `<div id="geoReviewBalloon" class="balloon">
    <div class="balloon__title">Отзыв:</div>
    <div class="balloon__row">
      <input id="geoUserName" class="balloon__input" type="text" name="name" placeholder="Укажите ваше имя" value=''>
    </div>
    <div class="balloon__row">
      <input id="geoPlace" class="balloon__input" type="text" name="place" placeholder="Укажите место">
    </div>
    <div class="balloon__row">
      <textarea id="geoReview" class="balloon__input balloon__input--textarea" name="review" placeholder="Оставить отзыв"></textarea>
    </div>
    <div class="balloon__row balloon__row--ctr">
      <button id="geoReviewAdd" class="button">Добавить</button>
    </div>
  </div>`;