class Carousel {
  constructor(idName, transitionTime = 500, holdTime = 5000) {
    this.carouselId = idName;
    this.transitionTime = transitionTime;
    this.holdTime = holdTime;
    this.currentIndex = 0;
    this.prevIndex = null;
    this.nextIndex = 1;
    this.imagesList = null;
    this.carousel = null;
    this.imageWrapper = null;
    this.carouselWidth;
    this.minIndex = null;
    this.maxIndex = null;
    this.prevButton = null;
    this.nextButton = null;
    this.dotButtonList = [];
    this.autoSlideDirection = 1;
    this.isSliding = false;
    this.init();
  }

  init() {
    let carousel = document.getElementById(this.carouselId);
    let imagesList = Array.from(carousel.getElementsByTagName("img"));
    this.imagesList = imagesList;
    this.minIndex = 0;
    this.maxIndex = imagesList.length - 1;
    let leftPosition = 0;

    if (carousel) {
      this.carousel = carousel;
      let imageWrapper = Array.from(carousel.childNodes).find(
        ({ className }) => className == "carousel-image-wrapper"
      );

      this.imageWrapper = imageWrapper;

      carousel.style.width = "100%";
      carousel.style.height = "100%";
      carousel.style.position = "relative";
      carousel.style.overflow = "hidden";

      imageWrapper.style.height = "100%";
      imageWrapper.style.width = "100%";
      imageWrapper.style.position = "absolute";
      this.carouselWidth = imageWrapper.offsetWidth;

      imagesList.forEach((imageItem, index) => {
        imageItem.style.width = "100%";
        imageItem.style.position = "absolute";
        imageItem.style.left = `${index * imageItem.offsetWidth - index}px`;
      });

      this.addButtons();
      this.addDotButton();
      this.autoSlide();
    } else {
      console.error(`Can retrive element with id ${this.carouselId}`);
    }
  }

  addButtons() {
    let prevButton = document.createElement("button");
    let nextButton = document.createElement("button");
    prevButton.innerHTML = "<";
    nextButton.innerHTML = ">";

    prevButton.style.position = "absolute";
    prevButton.style.bottom = "50%";

    nextButton.style.position = "absolute";
    nextButton.style.bottom = "50%";
    nextButton.style.right = "0";

    prevButton.addEventListener("click", () => {
      let nextIndex = this.currentIndex - 1;
      this.moveTo(nextIndex);
    });

    nextButton.addEventListener("click", () => {
      let nextIndex = this.currentIndex + 1;
      this.moveTo(nextIndex);
    });

    prevButton.classList.add("change-button");
    nextButton.classList.add("change-button");

    prevButton.disabled = true;
    this.carousel.appendChild(prevButton);
    this.carousel.appendChild(nextButton);

    this.prevButton = prevButton;
    this.nextButton = nextButton;
  }

  moveTo(nextIndex) {
    let speed = 0;
    let indexDiff = this.currentIndex - nextIndex;
    let currentDotIndex = this.currentIndex;
    this.currentIndex = nextIndex;
    this.isSliding = true;

    let currentPositon = this.imageWrapper.offsetLeft;
    let nextPosition = currentPositon + indexDiff * this.carouselWidth;

    let positionDiff = currentPositon - nextPosition;

    this.disableButton();
    this.dotButtonList[currentDotIndex].classList.remove("active-dot");
    this.dotButtonList[this.currentIndex].classList.add("active-dot");

    speed = -(positionDiff / this.transitionTime) / 0.06;

    let moveImage = setInterval(() => {
      currentPositon = currentPositon + speed;

      this.imageWrapper.style.left = `${currentPositon}px`;

      if (speed < 0) {
        if (currentPositon < nextPosition) {
          this.imageWrapper.style.left = `${nextPosition}px`;
          this.currentPositon = nextPosition;
          clearInterval(moveImage);
          this.enableButton();
        }
      } else {
        if (currentPositon > nextPosition) {
          this.imageWrapper.style.left = `${nextPosition}px`;
          this.currentPositon = nextPosition;
          clearInterval(moveImage);
          this.enableButton();
        }
      }
    }, 1000 / 60);
  }

  disableButton() {
    this.prevButton.disabled = true;
    this.nextButton.disabled = true;

    this.dotButtonList.forEach((dotButton) => {
      dotButton.disabled = true;
    });
  }

  enableButton() {
    this.prevButton.disabled = false;
    this.nextButton.disabled = false;

    if (this.currentIndex == this.minIndex) {
      this.prevButton.disabled = true;
    }

    if (this.currentIndex == this.maxIndex) {
      this.nextButton.disabled = true;
    }

    this.dotButtonList.forEach((dotButton) => {
      dotButton.disabled = false;
    });

    this.isSliding = false;
  }

  addDotButton() {
    let dotContainer = document.createElement("div");

    dotContainer.classList.add("dot-container");

    for (let index = 0; index < this.imagesList.length; index++) {
      let dot = document.createElement("button");
      dot.classList.add("dot-btn");
      dot.id = `dot-id-${index}`;

      dot.addEventListener("click", (event) => {
        if (this.currentIndex != index) {
          this.moveTo(index);
        }
      });

      this.dotButtonList.push(dot);

      dotContainer.appendChild(dot);
    }

    this.dotButtonList[0].classList.add("active-dot");
    this.carousel.appendChild(dotContainer);
  }

  autoSlide() {
    if (this.imagesList.length > 0) {
      setInterval(() => {
        if (!this.isSliding) {
          let nextSlideIndex = 0;
          if (this.currentIndex == this.minIndex) {
            this.autoSlideDirection = 1;
          }
          if (this.currentIndex == this.maxIndex) {
            this.autoSlideDirection = -1;
          }

          nextSlideIndex = this.currentIndex + this.autoSlideDirection;

          this.moveTo(nextSlideIndex);
        }
      }, this.holdTime);
    }
  }
}

let car = new Carousel("carousel-1");
