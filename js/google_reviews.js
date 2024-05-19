window.onload = function() {
    fetchGoogleReviews();
  };
  
  function fetchGoogleReviews() {
    const url = 'http://localhost:3000/api/reviews';
  
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      // Сортиране на отзивите по рейтинг в намаляващ ред
      let sortedReviews = data.result.reviews.sort((a, b) => b.rating - a.rating);
      
      // Проверка дали екранът е по-малък от 768px
      if (window.matchMedia("(max-width: 768px)").matches) {
          sortedReviews = sortedReviews.slice(0, 4); // Показва само първите 4 отзива
      }
      
      // Отрисуване на отзивите
      renderReviews(sortedReviews);
      
      // Задаване на еднаква височина на ревютата
      setEqualHeight();
  
      // Ако е на малък екран, добавяме каросел функционалност
      if (window.matchMedia("(max-width: 768px)").matches) {
          initCarousel();
      }
  })
  .catch(error => {
      console.error('Error fetching Google reviews:', error);
  });
  }
  
  function renderReviews(reviews) {
    const reviewContainer = document.getElementById('response-container');
    reviewContainer.innerHTML = ''; // Изчистване на съдържанието на контейнера
  
    // Добавяне на всеки отзив към контейнера
    reviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewContainer.appendChild(reviewElement);
    });
  }
  
  function createReviewElement(review) {
      const reviewElement = document.createElement('div');
      reviewElement.classList.add('review');
  
      const authorContainer = document.createElement('div');
      authorContainer.classList.add('author-container');
  
      // Добавяне на аватарчето
      if (review.profile_photo_url) {
          const profileImage = document.createElement('img');
          profileImage.classList.add('profile-image');
          profileImage.src = review.profile_photo_url;
          authorContainer.appendChild(profileImage);
      }
  
      const authorNameElement = document.createElement('div');
      authorNameElement.classList.add('author-name');
      authorNameElement.textContent = review.author_name;
  
      // Поставяне на името и аватарчето на един ред
      authorContainer.appendChild(authorNameElement);
  
      reviewElement.appendChild(authorContainer);
  
      const ratingElement = document.createElement('div');
      ratingElement.classList.add('rating');
      ratingElement.textContent = 'Rating: ';
  
      const starsContainer = document.createElement('div');
      starsContainer.classList.add('stars-container');
  
      const rating = review.rating;
      for (let i = 0; i < 5; i++) {
          const star = document.createElement('span');
          star.classList.add('star');
          if (i < rating) {
              star.textContent = '★'; // Жълта звезда за пълна оценка
          } else {
              star.textContent = '☆'; // Празна звезда за липсваща оценка
          }
          starsContainer.appendChild(star);
      }
  
      ratingElement.appendChild(starsContainer);
      reviewElement.appendChild(ratingElement);
  
      const relativeTimeElement = document.createElement('div');
      relativeTimeElement.classList.add('relative-time');
      relativeTimeElement.textContent = review.relative_time_description || "Time: N/A"; // Използваме относителното време или по подразбиране "N/A", ако е недостъпно
      reviewElement.appendChild(relativeTimeElement);
  
      const textElement = document.createElement('div');
      textElement.classList.add('text');
      textElement.textContent = review.text || "No review text available";
      reviewElement.appendChild(textElement);
  
      if (review.photos && review.photos.length > 0) {
          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container');
          review.photos.forEach(photo => {
              const imageElement = document.createElement('img');
              imageElement.classList.add('review-image');
              imageElement.src = photo;
              const imageWrapper = document.createElement('div');
              imageWrapper.appendChild(imageElement);
              imageContainer.appendChild(imageWrapper);
          });
          reviewElement.appendChild(imageContainer);
      }
  
      const expandButton = document.createElement('button');
      expandButton.classList.add('expand-button');
      expandButton.textContent = 'Покажи повече';
      expandButton.addEventListener('click', () => {
          reviewElement.classList.toggle('expanded');
          expandButton.textContent = reviewElement.classList.contains('expanded') ? 'Покажи по-малко' : 'Покажи повече';
      });
      reviewElement.appendChild(expandButton);
  
      return reviewElement;
  }
  
  function setMinHeight() {
      const reviewElements = document.querySelectorAll('.review');
      let minHeight = Infinity;
  
      reviewElements.forEach(element => {
          const height = element.offsetHeight;
          if (height < minHeight) {
              minHeight = height;
          }
      });
  
      reviewElements.forEach(element => {
          element.style.height = minHeight + 'px';
      });
  }
  
  // Функция за задаване на всички контейнери за отзиви с еднаква височина
  function setEqualHeight() {
    const reviewElements = document.querySelectorAll('.review');
    let maxHeight = 0;
  
    // Намираме най-голямата височина
    reviewElements.forEach(element => {
        const height = element.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
  
    // Задаваме всичким контейнери за ревюта еднаква височина
    reviewElements.forEach(element => {
        element.style.height = maxHeight + 'px';
    });
  }
  
  function initCarousel() {
    const reviewElements = document.querySelectorAll('.review');
    let currentIndex = 0;
    
    // Показваме първото ревю
    reviewElements[currentIndex].classList.add('active');

    // Създаваме контейнера за бутоните
    const carouselButtonsContainer = document.createElement('div');
    carouselButtonsContainer.classList.add('carousel-buttons');

    // Създаваме бутоните
    const prevButton = document.createElement('button');
    prevButton.classList.add('carousel-button');
    prevButton.textContent = 'Назад';
    prevButton.addEventListener('click', () => {
        reviewElements[currentIndex].classList.remove('active');
        currentIndex = (currentIndex === 0) ? reviewElements.length - 1 : currentIndex - 1;
        reviewElements[currentIndex].classList.add('active');
    });

    const nextButton = document.createElement('button');
    nextButton.classList.add('carousel-button');
    nextButton.textContent = 'Напред';
    nextButton.addEventListener('click', () => {
        reviewElements[currentIndex].classList.remove('active');
        currentIndex = (currentIndex === reviewElements.length - 1) ? 0 : currentIndex + 1;
        reviewElements[currentIndex].classList.add('active');
    });

    // Добавяме бутоните към контейнера
    carouselButtonsContainer.appendChild(prevButton);
    carouselButtonsContainer.appendChild(nextButton);

    // Добавяме контейнера с бутоните към основния контейнер
    const reviewContainer = document.getElementById('response-container');
    reviewContainer.insertBefore(carouselButtonsContainer, reviewContainer.firstChild);
}

  
  // Извикваме функцията fetchGoogleReviews и след това setEqualHeight
  fetchGoogleReviews()
    .then(setTimeout(setEqualHeight, 1000));
  