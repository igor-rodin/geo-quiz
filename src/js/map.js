import { balloonTemplate } from "./balloon";

document.addEventListener('DOMContentLoaded', () => {
  ymaps.ready(init);
  function init() {
    let myMap = new ymaps.Map("map", {
      center: [55.749693, 37.600925],
      zoom: 16,
      controls: ['zoomControl'],
      behaviors: ['drag']
    });

    const geoReviews = [];

    const MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
      balloonTemplate
    );
    myMap.events.add('click', (event) => {
      console.log('Click on map');
      const coord = event.get('coords');
      const myBalloon = myMap.balloon;
      myBalloon.open(coord, { contentBody: balloonTemplate })
        .then(() => {
          const addReviewBtn = document.querySelector('#geoReviewAdd');
          addReviewBtn.addEventListener('click', (event) => {
            const balloonData = getDataFromBallon(document.querySelector('#geoReviewBalloon'));
            const date = getFormatedDate(new Date());
            if (date) {
              const geoReview = {
                reviewDate: date,
                coord: coord,
                userName: balloonData.name,
                reviewPlace: [balloonData.place],
                review: balloonData.review,
              };
              geoReviews.push(geoReview);
              let placeMark = new ymaps.Placemark(geoReview.coord,
                {
                },
                {
                  iconLayout: 'default#image',
                  balloonContentLayout: MyBalloonContentLayoutClass
                });
              myMap.geoObjects.add(placeMark);
              console.log('DATE', geoReviews);
            }
            myBalloon.close();
          });
        });
    });

    function getFormatedDate(date) {
      return `${date.getDate().toString().padStart(2, 0)}.${date.getMonth().toString().padStart(2, 0)}.${date.getFullYear()}`;
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

    function setBallonData(balloonElem, reviewData) {
      if (!balloonElem) {
        return;
      }
      console.log('reviewData', reviewData);
      const userName = balloonElem.querySelector('#geoUserName');
      userName.value = reviewData?.userName;
      const place = balloonElem.querySelector('#geoPlace');
      place.value = reviewData?.reviewPlace[0];
      const review = balloonElem.querySelector('#geoReview');
      review.value = reviewData?.review;
    }

    myMap.geoObjects.events.add('click', function (e) {
      const placeMark = e.get('target');
      placeMark.events.add('balloonopen', (event) => {
        console.log('BALLON_OPEN', document.querySelector('#geoReviewBalloon'));
        // setBallonData(document.querySelector('#geoReviewBalloon'), geoReviews[0]);
      })
      console.log('PLACE_MARK_COORD', placeMark.geometry.getCoordinates());
      placeMark.balloon.open(placeMark.geometry.getCoordinates())
        .then(() => {
          setBallonData(document.querySelector('#geoReviewBalloon'), geoReviews[0]);
        });
    });

    // const markerCoords = [
    //   [55.758881, 37.582928],
    //   [55.759081, 37.622228],
    //   [55.749878, 37.603466],
    //   [55.743083, 37.580838],
    // ];

    // const markers = new ymaps.GeoObjectCollection({}, {
    //   draggable: false,
    //   iconLayout: 'default#image',
    //   balloonContentLayout: MyBalloonContentLayoutClass

    // });

    // markerCoords.forEach(coord => {
    //   markers.add(new ymaps.Placemark(coord))
    // });

    // myMap.geoObjects.add(markers);
  }
});