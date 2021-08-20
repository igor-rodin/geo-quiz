import { balloonTemplate } from "./balloon";
import { reviewPlaceTemplate } from "./review";
import { createPopUpReviews } from "./popUpReviews";

document.addEventListener('DOMContentLoaded', () => {
  ymaps.ready(init);

  function init() {
    let myMap = new ymaps.Map("map", {
      center: [55.749693, 37.600925],
      zoom: 16,
      controls: ['zoomControl'],
      behaviors: ['drag']
    });

    const MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
      balloonTemplate
    );

    const caruselItemContentLayout = ymaps.templateLayoutFactory.createClass(
      reviewPlaceTemplate);

    const STORAGE_NAME = 'georeviews';
    let geoReviews = [];
    let placeMarkers = [];
    let placeMarkId = 0;
    const storage = localStorage;
    if (storage.length && storage.getItem(STORAGE_NAME)) {
      geoReviews = JSON.parse(storage.getItem(STORAGE_NAME));
      placeMarkers = geoReviews.map(createPlaceMark);
    }

    const grClusterer = new ymaps.Clusterer(
      {
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: caruselItemContentLayout,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 60,
        clusterBalloonPagerSize: 3,
        clusterBalloonPagerType: 'marker',
      }
    );
    grClusterer.add(placeMarkers);
    myMap.geoObjects.add(grClusterer);

    myMap.options.set({
      balloonContentLayout: MyBalloonContentLayoutClass
    });

    myMap.events.add('click', (event) => {
      if (!myMap.balloon.isOpen()) {
        const coord = event.get('coords');

        myMap.balloon.open(coord, { geoReview: '', })
          .then(() => {
            const addReviewBtn = document.querySelector('#geoReviewAdd');
            addReviewBtn.addEventListener('click', (event) => {
              const balloonData = getDataFromBallon(document.querySelector('#geoReviewBalloon'));
              const date = new Date();
              const formatedDate = getFormatedDate(date);
              if (balloonData) {
                const geoReview = {
                  coord: coord,
                  placeReviews: [{
                    rawDate: date,
                    reviewFormatedDate: formatedDate,
                    userName: balloonData.name,
                    reviewPlace: balloonData.place,
                    review: balloonData.review
                  }]
                };

                const placeMark = createPlaceMark(geoReview);
                placeMarkers.push(placeMark);
                geoReviews.push(geoReview);
                grClusterer.add(placeMark);
                saveToStorage(storage, STORAGE_NAME, geoReviews);
              };
              myMap.balloon.close();
            });
          });
      }
      else {
        myMap.balloon.close();
      }

    });

    myMap.geoObjects.events.add('click', function (e) {
      const placeMark = e.get('target');
      placeMark.events.add('balloonopen', (event) => {
        const addReviewBtn = document.querySelector('#geoReviewAdd');

        addReviewBtn.addEventListener('click', (event) => {
          const balloonData = getDataFromBallon(document.querySelector('#geoReviewBalloon'));
          const date = new Date();
          const formatedDate = getFormatedDate(date);
          if (balloonData) {
            const review = {
              rawDate: date,
              reviewFormatedDate: formatedDate,
              userName: balloonData.name,
              reviewPlace: balloonData.place,
              review: balloonData.review,
            };
            updatePlaceMark(placeMark, review);
            saveToStorage(storage, STORAGE_NAME, geoReviews);
          };
          placeMark.balloon.close();
        });
      });
    });

    document.addEventListener('click', (event) => {
      if (event.target.id === 'carusel__link') {
        event.preventDefault();
        const selectedPlacemark = placeMarkers[document.querySelector(`#${event.target.id}`).dataset.placemarkid];
        const placeReviews = selectedPlacemark.properties.get('geoReview').placeReviews.map((obj) => (
          {
            userName: obj.userName,
            date: obj.reviewFormatedDate,
            place: obj.reviewPlace,
            review: obj.review
          }));

        const domReviews = createPopUpReviews(placeReviews);
        document.body.append(domReviews);
      }
      else {
        const target = event.target.closest('.reviews--popup');
        if (target) {
          target.remove();
        }
      }
    })

    function createPlaceMark(reviewObject) {
      reviewObject.Id = placeMarkId;
      placeMarkId++;
      const placeMark = new ymaps.Placemark(reviewObject.coord,
        {
          geoReview: reviewObject,
          balloonContentBody: Array.from(new Set(reviewObject.placeReviews.map(obj => obj.reviewPlace))).join(', '),
        },
        {
          balloonContentLayout: MyBalloonContentLayoutClass,
        });

      updateIcon(placeMark, reviewObject.placeReviews);
      return placeMark;
    }

    function updatePlaceMark(mark, reviewObject) {
      const prevRev = mark.properties.get('geoReview');
      prevRev.placeReviews.push(reviewObject);
      prevRev.placeReviews.reverse();
      mark.properties.set({
        geoReview: prevRev
      });
      updateIcon(mark, prevRev.placeReviews);
    }

    function updateIcon(place, reviews) {
      const placeNames = new Set(reviews.map(obj => obj.reviewPlace));
      if (placeNames.size > 1) {
        place.options.set({ 'preset': 'islands#blueIcon' });
        place.properties.set('iconContent', placeNames.size);
      }
      else {
        place.options.set({ 'preset': 'islands#blueDotIcon' });
      }
      place.properties.set({ 'balloonContentBody': Array.from(placeNames).join(', ') });
    };

    function getFormatedDate(date) {
      return `${date.getDate().toString().padStart(2, 0)}.${(date.getMonth() + 1).toString().padStart(2, 0)}.${date.getFullYear()}`;
    }

    function getDataFromBallon(balloonElem) {
      if (!balloonElem) {
        return;
      }
      const name = balloonElem.querySelector('#geoUserName').value.trim();
      const place = balloonElem.querySelector('#geoPlace').value.trim();
      const review = balloonElem.querySelector('#geoReview').value.trim();
      if (!name || !place || !review) {
        return;
      };
      return {
        name, place, review
      };
    }

    function saveToStorage(storage, key, data) {
      storage.setItem(key, JSON.stringify(data,
        ['coord', 'placeReviews', 'rawDate', 'reviewFormatedDate', 'userName', 'reviewPlace', 'review']));
    };
  }
});