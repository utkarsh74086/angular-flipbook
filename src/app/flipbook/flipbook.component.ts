import { Component, HostListener, OnInit } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc =`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-flipbook',
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css']
})
export class FlipbookComponent implements OnInit {
  currentPage = 1;
  totalPages = 0;
  isAnimating = false;
  flipDirection = '';
  nextPageIndex: number | null = null;
  prevPageIndex: number | null = null;
  canvasPages: string[] = [];

  pageFlipAudio!: HTMLAudioElement;

  ngOnInit() {
    this.pageFlipAudio = new Audio('../../assets/811255__nicolaslikesthiswebsite496__pageturn.mp3'); 
    this.loadPdf('../../assets/Screenshot (266).pdf'); 
  }

  async loadPdf(pdfPath: string) {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    this.totalPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL();
      this.canvasPages.push(dataUrl);
    }
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
    this.pageFlipAudio.play().catch(err => console.warn('Audio play failed:', err));
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

    if (pageNumber === this.currentPage) classes += ' active';
    if (this.flipDirection === 'right' && pageNumber === this.nextPageIndex) classes += ' flipping-right';
    if (this.flipDirection === 'left' && pageNumber === this.prevPageIndex) classes += ' flipping-left';

    return classes.trim();
  }
}
