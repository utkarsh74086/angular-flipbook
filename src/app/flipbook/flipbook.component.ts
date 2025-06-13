import { Component, HostListener, OnInit } from '@angular/core';

interface Page {
  imageUrl: string;
  altText?: string;
}

@Component({
  selector: 'app-flipbook',
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css']
})
export class FlipbookComponent implements OnInit {
  currentPage = 1;
  totalPages = 7;
  isAnimating = false;
  flipDirection = '';
  nextPageIndex: number | null = null;
  prevPageIndex: number | null = null;

  pageFlipAudio!: HTMLAudioElement;

  pages: Page[] = [
    { imageUrl: '../../assets/Screenshot (266).png' },
    { imageUrl: '../../assets/secondpage.png' },
    { imageUrl: '../../assets/Thirdpage.png' },
    { imageUrl: '../../assets/Fourthpage.png' },
    { imageUrl: '../../assets/Fifthpage.png' },
    { imageUrl: '../../assets/sixthpage.png' },
    { imageUrl: '../../assets/seventhpage.png' },
  ];

  ngOnInit() {
    this.pageFlipAudio = new Audio('../../assets/811255__nicolaslikesthiswebsite496__pageturn.mp3');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.prevPage();
    }
  }

  playFlipSound() {
    this.pageFlipAudio.currentTime = 0;
    this.pageFlipAudio.play().catch(error => {
      console.warn('Audio could not play:', error);
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages && !this.isAnimating) {
      this.isAnimating = true;
      this.flipDirection = 'right';
      this.nextPageIndex = this.currentPage;

      this.playFlipSound();

      setTimeout(() => {
        this.currentPage++;
        this.flipDirection = '';
        this.nextPageIndex = null;
        this.isAnimating = false;
      }, 600);
    }
  }

  prevPage() {
    if (this.currentPage > 1 && !this.isAnimating) {
      this.isAnimating = true;
      this.flipDirection = 'left';
      this.prevPageIndex = this.currentPage - 2;

      this.playFlipSound();

      setTimeout(() => {
        this.currentPage--;
        this.flipDirection = '';
        this.prevPageIndex = null;
        this.isAnimating = false;
      }, 600);
    }
  }

  onSwipeLeft() {
    this.nextPage();
  }

  onSwipeRight() {
    this.prevPage();
  }

  getPageClasses(index: number): string {
    const pageNumber = index + 1;
    let classes = '';

    if (pageNumber === this.currentPage) {
      classes += ' active';
    }

    if (this.flipDirection === 'right' && pageNumber === this.nextPageIndex) {
      classes += ' flipping-right';
    }

    if (this.flipDirection === 'left' && pageNumber === this.prevPageIndex) {
      classes += ' flipping-left';
    }

    return classes.trim();
  }
}
