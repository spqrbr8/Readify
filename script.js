// Application State
const App = {
  currentUser: null,
  currentPage: 'home',
  currentFilters: {
      status: '',
      genre: '',
      search: ''
  },
  bookmarks: new Set(),
  history: [],
  settings: {
      theme: 'dark',
      fontSize: 'medium'
  },
  
  // Sample data - in future this will come from backend
  books: [
      {
          id: 1,
          title: "Dune",
          author: "Frank Herbert",
          genre: "Sci-Fi",
          genres: ["Sci-Fi", "Adventure", "Epic"],
          status: "completed",
          rating: 4.8,
          chapters: 48,
          cover: "",
          description: "Dune este o operă epică de science fiction care explorează teme complexe precum politica, religia, și ecologia într-un univers fascinant.",
          publishDate: "1965-08-01",
          publisher: "Chilton Books",
          reviews: [
              {
                  id: 1,
                  user: "Maria",
                  rating: 5,
                  text: "O capodoperă absolută! Worldbuilding-ul este fenomenal.",
                  date: "2024-01-15",
                  helpful: 12
              }
          ],
          userProgress: {
              currentChapter: 0,
              totalChapters: 48,
              readingTime: 1200 // minute
          },
          updated: new Date(Date.now() - 3600000).toISOString()
      },
      {
          id: 2,
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
          genres: ["Dystopian", "Classic", "Political"],
          status: "completed",
          rating: 4.9,
          chapters: 24,
          cover: "",
          description: "Un roman distopic clasic.",
          publishDate: "1949-06-08",
          publisher: "Secker & Warburg",
          reviews: [],
          userProgress: {
              currentChapter: 0,
              totalChapters: 24,
              readingTime: 600
          },
          updated: new Date(Date.now() - 7200000).toISOString()
      },
      {
          id: 3,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          genre: "Fantasy",
          genres: ["Fantasy", "Adventure"],
          status: "completed",
          rating: 4.7,
          chapters: 19,
          cover: "",
          description: "O aventură magică în Middle-earth.",
          publishDate: "1937-09-21",
          publisher: "George Allen & Unwin",
          reviews: [],
          userProgress: {
              currentChapter: 0,
              totalChapters: 19,
              readingTime: 480
          },
          updated: new Date(Date.now() - 10800000).toISOString()
      },
      {
          id: 4,
          title: "Harry Potter și Piatra Filosofală",
          author: "J.K. Rowling",
          genre: "Fantasy",
          genres: ["Fantasy", "Adventure", "Young Adult"],
          status: "ongoing",
          rating: 4.6,
          chapters: 17,
          cover: "",
          description: "Începutul aventurilor lui Harry Potter.",
          publishDate: "1997-06-26",
          publisher: "Bloomsbury",
          reviews: [],
          userProgress: {
              currentChapter: 0,
              totalChapters: 17,
              readingTime: 400
          },
          updated: new Date(Date.now() - 1800000).toISOString()
      },
      {
          id: 5,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          genre: "Romance",
          genres: ["Romance", "Classic"],
          status: "completed",
          rating: 4.5,
          chapters: 61,
          cover: "",
          description: "Un clasic al literaturii romantice.",
          publishDate: "1813-01-28",
          publisher: "T. Egerton",
          reviews: [],
          userProgress: {
              currentChapter: 0,
              totalChapters: 61,
              readingTime: 900
          },
          updated: new Date(Date.now() - 14400000).toISOString()
      },
      {
          id: 6,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic",
          genres: ["Classic", "Tragedy"],
          status: "completed",
          rating: 4.3,
          chapters: 9,
          cover: "",
          description: "Drama americană din anii '20.",
          publishDate: "1925-04-10",
          publisher: "Charles Scribner's Sons",
          reviews: [],
          userProgress: {
              currentChapter: 0,
              totalChapters: 9,
              readingTime: 300
          },
          updated: new Date(Date.now() - 21600000).toISOString()
      }
  ],
  
  genres: ["Toate", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Mystery", "Classic", "Dystopian"],

  init() {
      this.loadUserData();
      this.renderUserActions();
      this.renderGenreFilters();
      this.renderBooks();
      this.loadSettings();
      this.setupEventListeners();
      this.loadReaderPreferences();
  },

  loadUserData() {
      // In future, this will be loaded from backend
      const userData = {
          bookmarks: [],
          history: []
      };
      
      this.bookmarks = new Set(userData.bookmarks);
      this.history = userData.history;
  },

  renderUserActions() {
      const container = document.getElementById('userActions');
      if (this.currentUser) {
          container.innerHTML = `
              <div class="user-menu">
                  <div class="user-avatar" onclick="App.toggleUserDropdown()">
                      ${this.currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div class="dropdown" id="userDropdown">
                      <div class="dropdown-item" onclick="App.showProfile()">Profil</div>
                      <div class="dropdown-item" onclick="App.showSettings()">Setări</div>
                      <div class="dropdown-item" onclick="App.logout()">Deconectare</div>
                  </div>
              </div>
          `;
      } else {
          container.innerHTML = `
              <button class="auth-btn secondary" onclick="App.showLogin()">Conectare</button>
              <button class="auth-btn" onclick="App.showRegister()">Înregistrare</button>
          `;
      }
  },

  renderGenreFilters() {
      const container = document.getElementById('genreFilters');
      container.innerHTML = this.genres.map(genre => `
          <button class="tag ${genre === 'Toate' ? 'active' : ''}" 
                  onclick="App.filterByGenre('${genre === 'Toate' ? '' : genre}')"
                  data-genre="${genre}">
              ${genre}
          </button>
      `).join('');
  },

  renderBooks(books = null) {
      const booksToRender = books || this.getFilteredBooks();
      const container = document.getElementById('bookGrid');
      
      if (booksToRender.length === 0) {
          container.innerHTML = `
              <div class="no-results">
                  <div class="no-results-icon">📚</div>
                  <div class="no-results-title">Nu s-au găsit cărți</div>
                  <div class="no-results-text">Încearcă să modifici filtrele de căutare</div>
              </div>
          `;
          return;
      }
      
      container.innerHTML = booksToRender.map(book => `
          <div class="book-card" onclick="App.openBook(${book.id})">
              <div class="book-cover">
                  ${book.cover ? 
                      `<img src="${book.cover}" alt="${book.title}">` : 
                      `<div class="placeholder">📖</div>`
                  }
                  <div class="chapter-badge">Cap. ${book.chapters}</div>
                  <div class="status-badge ${book.status}">${this.getStatusText(book.status)}</div>
              </div>
              <div class="book-info">
                  <div class="book-title">${book.title}</div>
                  <div class="book-author">de ${book.author}</div>
                  <div class="book-meta">
                      <div class="rating">
                          <span class="star">★</span>
                          <span>${book.rating}</span>
                      </div>
                      <span>${book.genre}</span>
                  </div>
              </div>
          </div>
      `).join('');
  },

  getFilteredBooks() {
      return this.books.filter(book => {
          const matchesStatus = !this.currentFilters.status || book.status === this.currentFilters.status;
          const matchesGenre = !this.currentFilters.genre || book.genre === this.currentFilters.genre;
          const matchesSearch = !this.currentFilters.search || 
              book.title.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
              book.author.toLowerCase().includes(this.currentFilters.search.toLowerCase());
          
          return matchesStatus && matchesGenre && matchesSearch;
      });
  },

  getStatusText(status) {
      const statusMap = {
          'ongoing': 'În curs',
          'completed': 'Completă',
          'paused': 'Întreruptă'
      };
      return statusMap[status] || status;
  },

  // Navigation
  showHome() {
      this.navigateTo('home');
      this.renderBooks();
  },

  showCatalog() {
      this.navigateTo('catalog');
      const catalogGrid = document.getElementById('catalogGrid');
      catalogGrid.innerHTML = '';
      this.renderBooksInContainer(this.books, catalogGrid);
  },

  showTop() {
      this.navigateTo('top');
      const topBooks = [...this.books].sort((a, b) => b.rating - a.rating);
      const topGrid = document.getElementById('topGrid');
      topGrid.innerHTML = '';
      this.renderBooksInContainer(topBooks, topGrid);
  },

  showBookmarks() {
      this.navigateTo('bookmarks');
      const bookmarkedBooks = this.books.filter(book => this.bookmarks.has(book.id));
      const bookmarksGrid = document.getElementById('bookmarksGrid');
      bookmarksGrid.innerHTML = '';
      this.renderBooksInContainer(bookmarkedBooks, bookmarksGrid);
  },

  showHistory() {
      this.navigateTo('history');
      const historyBooks = this.books.filter(book => 
          this.history.some(h => h.bookId === book.id)
      );
      const historyGrid = document.getElementById('historyGrid');
      historyGrid.innerHTML = '';
      this.renderBooksInContainer(historyBooks, historyGrid);
  },

  navigateTo(page) {
      // Hide all pages
      document.querySelectorAll('.page-view').forEach(view => {
          view.classList.remove('active');
      });
      
      // Show target page
      document.getElementById(page + 'Page').classList.add('active');
      
      // Update navigation
      document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
      });
      document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
      
      this.currentPage = page;
  },

  renderBooksInContainer(books, container) {
      if (books.length === 0) {
          container.innerHTML = `
              <div class="no-results">
                  <div class="no-results-icon">📚</div>
                  <div class="no-results-title">Nu s-au găsit cărți</div>
              </div>
          `;
          return;
      }
      
      container.innerHTML = books.map(book => `
          <div class="book-card" onclick="App.openBook(${book.id})">
              <div class="book-cover">
                  ${book.cover ? 
                      `<img src="${book.cover}" alt="${book.title}">` : 
                      `<div class="placeholder">📖</div>`
                  }
                  <div class="chapter-badge">Cap. ${book.chapters}</div>
                  <div class="status-badge ${book.status}">${this.getStatusText(book.status)}</div>
              </div>
              <div class="book-info">
                  <div class="book-title">${book.title}</div>
                  <div class="book-author">de ${book.author}</div>
                  <div class="book-meta">
                      <div class="rating">
                          <span class="star">★</span>
                          <span>${book.rating}</span>
                      </div>
                      <span>${book.genre}</span>
                  </div>
              </div>
          </div>
      `).join('');
  },

  // Filters
  applyFilters() {
      this.currentFilters.status = document.getElementById('statusFilter').value;
      this.renderBooks();
  },

  filterByGenre(genre) {
      this.currentFilters.genre = genre;
      // Update active tag
      document.querySelectorAll('.tag').forEach(tag => {
          tag.classList.remove('active');
      });
      document.querySelector(`[data-genre="${genre || 'Toate'}"]`).classList.add('active');
      this.renderBooks();
  },

  // Search
  performSearch() {
      this.currentFilters.search = document.getElementById('searchInput').value;
      this.renderBooks();
  },

  // Auth methods
  showLogin() {
      document.getElementById('loginModal').style.display = 'block';
      document.getElementById('registerModal').style.display = 'none';
  },

  showRegister() {
      document.getElementById('registerModal').style.display = 'block';
      document.getElementById('loginModal').style.display = 'none';
  },

  switchToLogin() {
      this.showLogin();
  },

  switchToRegister() {
      this.showRegister();
  },

  closeAuthModal() {
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('registerModal').style.display = 'none';
  },

  async login(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      formData.append('action', 'login');

      try {
          // Eliminăm mesajele de eroare anterioare
          const oldError = document.getElementById('loginError');
          if (oldError) {
              oldError.remove();
          }

          const response = await fetch('auth.php', {
              method: 'POST',
              body: formData
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.success) {
              this.currentUser = {
                  id: data.user.id,
                  name: data.user.username,
                  email: data.user.email || ''
              };
              this.renderUserActions();
              this.closeAuthModal();
              form.reset();
              
              // Reîncărcăm datele utilizatorului
              this.loadUserData();
          } else {
              const errorElement = document.createElement('div');
              errorElement.id = 'loginError';
              errorElement.className = 'error-message';
              errorElement.textContent = data.message || 'A apărut o eroare la conectare. Vă rugăm să încercați din nou.';
              form.insertBefore(errorElement, form.firstChild);
          }
      } catch (error) {
          console.error('Eroare la autentificare:', error);
          const errorElement = document.createElement('div');
          errorElement.id = 'loginError';
          errorElement.className = 'error-message';
          errorElement.textContent = 'A apărut o eroare de conexiune. Vă rugăm să verificați conexiunea la internet și să încercați din nou.';
          form.insertBefore(errorElement, form.firstChild);
      }
  },

  async register(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      formData.append('action', 'register');

      try {
          const response = await fetch('auth.php', {
              method: 'POST',
              body: formData
          });
          
          const data = await response.json();
          
          if (data.success) {
              alert(data.message);
              this.switchToLogin();
          } else {
              alert(data.message);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('A apărut o eroare la înregistrare');
      }
  },

  async logout() {
      try {
          const formData = new FormData();
          formData.append('action', 'logout');
          
          const response = await fetch('auth.php', {
              method: 'POST',
              body: formData
          });
          
          const data = await response.json();
          
          if (data.success) {
              this.currentUser = null;
              this.renderUserActions();
              // Clear user-specific data
              this.bookmarks = new Set();
              this.history = [];
              this.renderBooks();
          }
      } catch (error) {
          console.error('Error:', error);
          alert('A apărut o eroare la deconectare');
      }
  },

  // User menu
  toggleUserDropdown() {
      document.getElementById('userDropdown').classList.toggle('show');
  },

  // Book actions
  openBook(bookId) {
      const book = this.books.find(b => b.id === bookId);
      if (!book) return;
      this.currentBook = book;
      this.navigateTo('bookDetails');
      this.renderBookDetails(book);
      this.addToHistory(bookId);
  },

  renderBookDetails(book) {
      document.getElementById('bookTitleLarge').textContent = book.title;
      document.getElementById('bookAuthorLink').textContent = book.author;
      document.getElementById('bookAuthorLink').onclick = () => this.showAuthorBooks(book.author);

      // Genuri
      const genresContainer = document.getElementById('bookGenres');
      genresContainer.innerHTML = (book.genres || []).map(genre =>
          `<span class="genre-tag" onclick="App.filterByGenre('${genre}')">${genre}</span>`
      ).join('');

      this.renderRating(book);
      this.renderBookMeta(book);
      this.renderReadingProgress(book);
      this.renderReviews(book);
      this.renderRecommendations(book);
      this.updateFavoriteButton(book.id);

      // Cover
      const coverImg = document.getElementById('bookCoverLarge');
      if (coverImg) {
          if (book.cover) {
              coverImg.src = book.cover;
              coverImg.alt = book.title;
          } else {
              coverImg.src = '';
              coverImg.alt = 'Book cover';
          }
      }
  },

  renderRating(book) {
      const starsContainer = document.getElementById('starsLarge');
      const rating = Math.round(book.rating);
      starsContainer.innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      document.getElementById('ratingValue').textContent = book.rating.toFixed(1);
      document.getElementById('ratingCount').textContent = `(${book.reviews?.length || 0} evaluări)`;

      this.renderRatingBreakdown(book);
  },

  renderRatingBreakdown(book) {
      const container = document.getElementById('ratingBreakdown');
      const reviews = book.reviews || [];
      const ratingCounts = [0, 0, 0, 0, 0];
      reviews.forEach(review => {
          if (review.rating >= 1 && review.rating <= 5) {
              ratingCounts[review.rating - 1]++;
          }
      });
      const total = reviews.length || 1;
      container.innerHTML = ratingCounts.map((count, index) => {
          const percentage = (count / total) * 100;
          return `
              <div class="rating-bar">
                  <span>${index + 1}★</span>
                  <div class="rating-bar-fill">
                      <div class="rating-bar-progress" style="width: ${percentage}%"></div>
                  </div>
                  <span>${count}</span>
              </div>
          `;
      }).reverse().join('');
  },

  renderBookMeta(book) {
      document.getElementById('bookStatus').textContent = this.getStatusText(book.status);
      document.getElementById('bookChapters').textContent = book.chapters;
      document.getElementById('bookPublishDate').textContent = book.publishDate ? new Date(book.publishDate).toLocaleDateString('ro-RO') : '';
      document.getElementById('bookPublisher').textContent = book.publisher || '';
      document.getElementById('bookDescription').textContent = book.description || '';
  },

  renderReadingProgress(book) {
      const progress = book.userProgress || { currentChapter: 0, totalChapters: book.chapters, readingTime: 0 };
      const percentage = (progress.currentChapter / progress.totalChapters) * 100;
      document.getElementById('progressFill').style.width = `${percentage}%`;
      document.getElementById('progressText').textContent =
          `Capitol ${progress.currentChapter} din ${progress.totalChapters}`;
      document.getElementById('readingTime').textContent =
          `Timp estimat: ${Math.ceil((progress.readingTime || 0) / 60)} ore`;
      this.renderChaptersList(book);
  },

  renderChaptersList(book) {
      const container = document.getElementById('chaptersList');
      const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
      const current = book.userProgress?.currentChapter || 0;
      container.innerHTML = chapters.map(chapterNum => `
          <div class="chapter-item ${chapterNum <= current ? 'completed' : ''}" 
               onclick="App.selectChapter(${chapterNum})">
              Capitol ${chapterNum}
              ${chapterNum <= current ? '✓' : ''}
          </div>
      `).join('');
  },

  renderReviews(book) {
      const container = document.getElementById('reviewsList');
      const reviews = book.reviews || [];
      if (reviews.length === 0) {
          container.innerHTML = '<p>Nu există recenzii încă. Fii primul care scrie o recenzie!</p>';
          return;
      }
      container.innerHTML = reviews.map(review => `
          <div class="review-item">
              <div class="review-header">
                  <span class="review-author">${review.user}</span>
                  <span class="review-date">${new Date(review.date).toLocaleDateString('ro-RO')}</span>
              </div>
              <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
              <p class="review-text">${review.text}</p>
              <div class="review-helpful">
                  <button class="helpful-btn" onclick="App.markReviewHelpful(${review.id})">
                      👍 Util (${review.helpful})
                  </button>
              </div>
          </div>
      `).join('');
  },

  renderRecommendations(book) {
      const similarBooks = this.books.filter(b =>
          b.id !== book.id &&
          b.genres?.some(genre => (book.genres || []).includes(genre))
      ).slice(0, 6);
      const container = document.getElementById('recommendationsGrid');
      this.renderBooksInContainer(similarBooks, container);
  },

  toggleFavorite() {
      if (!this.currentUser) {
          this.showLogin();
          return;
      }
      const bookId = this.currentBook.id;
      if (this.bookmarks.has(bookId)) {
          this.bookmarks.delete(bookId);
      } else {
          this.bookmarks.add(bookId);
      }
      this.updateFavoriteButton(bookId);
      // Aici ai trimite request la backend
  },

  updateFavoriteButton(bookId) {
      const btn = document.querySelector('.action-btn.favorite');
      if (!btn) return;
      if (this.bookmarks.has(bookId)) {
          btn.classList.add('active');
          btn.innerHTML = '<span class="icon">♥</span> În favorite';
      } else {
          btn.classList.remove('active');
          btn.innerHTML = '<span class="icon">♡</span> Favorite';
      }
  },

  startReading() {
      if (!this.currentUser) {
          this.showLogin();
          return;
      }
      
      // Navigate to reader page
      this.navigateTo('reader');
      
      // Initialize reader
      this.currentChapter = this.currentBook.userProgress?.currentChapter || 1;
      this.loadChapter(this.currentChapter);
      
      // Setup scroll listener
      this.setupScrollListener();
      
      // Update book progress
      if (!this.currentBook.userProgress) {
          this.currentBook.userProgress = {
              currentChapter: 1,
              totalChapters: this.currentBook.chapters,
              readingTime: 0,
              lastReadPosition: 0
          };
      }
  },

  async loadChapter(chapterNumber) {
      try {
          // Show loading state
          const textContainer = document.getElementById('readerText');
          textContainer.innerHTML = '<div class="loading">Se încarcă...</div>';
          
          // In a real app, this would be an API call
          // const response = await fetch(`/api/books/${this.currentBook.id}/chapters/${chapterNumber}`);
          // const chapterData = await response.json();
          
          // For demo, we'll use placeholder text
          const chapterData = {
              title: `Capitol ${chapterNumber}`,
              content: this.generateChapterText(chapterNumber),
              wordCount: 1000
          };
          
          // Update UI
          document.getElementById('readerChapterTitle').textContent = chapterData.title;
          textContainer.textContent = chapterData.content;
          
          // Update navigation buttons
          const prevBtn = document.querySelector('.nav-btn:first-child');
          const nextBtn = document.querySelector('.nav-btn:last-child');
          prevBtn.disabled = chapterNumber <= 1;
          nextBtn.disabled = chapterNumber >= this.currentBook.chapters;
          
          // Update progress
          const progress = (chapterNumber / this.currentBook.chapters) * 100;
          this.updateReaderProgress(Math.round(progress));
          
          // Restore scroll position if exists
          if (this.currentBook.userProgress.lastReadPosition && 
              this.currentBook.userProgress.lastChapter === chapterNumber) {
              textContainer.scrollTop = this.currentBook.userProgress.lastReadPosition;
          } else {
              textContainer.scrollTop = 0;
          }
          
          // Save progress
          await this.saveReadingProgress(chapterNumber);
          
      } catch (error) {
          console.error('Error loading chapter:', error);
          textContainer.innerHTML = '<div class="error">Eroare la încărcarea capitolului. Vă rugăm să încercați din nou.</div>';
      }
  },

  setupScrollListener() {
      const textContainer = document.getElementById('readerText');
      const scrollBtn = document.getElementById('scrollToTopBtn');
      
      textContainer.addEventListener('scroll', () => {
          // Show/hide scroll to top button
          if (textContainer.scrollTop > 300) {
              scrollBtn.classList.add('visible');
          } else {
              scrollBtn.classList.remove('visible');
          }
          
          // Save scroll position
          if (this.currentBook && this.currentChapter) {
              this.currentBook.userProgress.lastReadPosition = textContainer.scrollTop;
              this.currentBook.userProgress.lastChapter = this.currentChapter;
          }
      });
  },

  scrollToTop() {
      const textContainer = document.getElementById('readerText');
      textContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  },

  async saveReadingProgress(chapterNumber) {
      try {
          // Update book progress
          this.currentBook.userProgress.currentChapter = chapterNumber;
          this.currentBook.userProgress.lastChapter = chapterNumber;
          
          // Calculate reading time (in a real app, this would be more accurate)
          const timePerChapter = this.currentBook.userProgress.readingTime / this.currentBook.chapters;
          this.currentBook.userProgress.readingTime = Math.round(timePerChapter * chapterNumber);
          
          // In a real app, this would be an API call
          // await fetch(`/api/books/${this.currentBook.id}/progress`, {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json'
          //     },
          //     body: JSON.stringify({
          //         chapter: chapterNumber,
          //         readingTime: this.currentBook.userProgress.readingTime,
          //         lastReadPosition: this.currentBook.userProgress.lastReadPosition
          //     })
          // });
          
          console.log('Saving progress:', {
              bookId: this.currentBook.id,
              chapter: chapterNumber,
              readingTime: this.currentBook.userProgress.readingTime,
              lastReadPosition: this.currentBook.userProgress.lastReadPosition
          });
          
      } catch (error) {
          console.error('Error saving progress:', error);
      }
  },

  toggleFullscreen() {
      const container = document.querySelector('.reader-container');
      const icon = document.querySelector('.reader-btn:last-child .icon');
      
      if (!document.fullscreenElement) {
          container.requestFullscreen().then(() => {
              container.classList.add('fullscreen');
              icon.textContent = '⮽';
          }).catch(err => {
              console.error('Error entering fullscreen:', err);
          });
      } else {
          document.exitFullscreen().then(() => {
              container.classList.remove('fullscreen');
              icon.textContent = '⛶';
          }).catch(err => {
              console.error('Error exiting fullscreen:', err);
          });
      }
  },

  generateChapterText(chapterNumber) {
      // Generate placeholder text for demo
      const paragraphs = [];
      for (let i = 0; i < 10; i++) {
          paragraphs.push(
              `Acesta este un text demonstrativ pentru capitolul ${chapterNumber}. ` +
              `Acest paragraf conține text generat automat pentru a simula conținutul unei cărți. ` +
              `Într-o aplicație reală, acest text ar fi încărcat dintr-o bază de date sau dintr-un fișier.`
          );
      }
      return paragraphs.join('\n\n');
  },

  prevChapter() {
      if (this.currentChapter > 1) {
          this.currentChapter--;
          this.loadChapter(this.currentChapter);
      }
  },

  nextChapter() {
      if (this.currentChapter < this.currentBook.chapters) {
          this.currentChapter++;
          this.loadChapter(this.currentChapter);
      }
  },

  closeReader() {
      // Save final progress before closing
      if (this.currentBook && this.currentChapter) {
          this.saveReadingProgress(this.currentChapter);
      }
      
      // Return to book details
      this.navigateTo('bookDetails');
  },

  toggleFontSize() {
      const textContainer = document.getElementById('readerText');
      const currentSize = textContainer.className.match(/font-(small|medium|large)/)?.[1] || 'medium';
      
      const sizes = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(currentSize);
      const nextIndex = (currentIndex + 1) % sizes.length;
      
      textContainer.className = textContainer.className.replace(/font-(small|medium|large)/, '');
      textContainer.classList.add(`font-${sizes[nextIndex]}`);
      
      // Save preference
      localStorage.setItem('readerFontSize', sizes[nextIndex]);
  },

  toggleTheme() {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('readerTheme', isLight ? 'light' : 'dark');
  },

  // Load reader preferences
  loadReaderPreferences() {
      const savedFontSize = localStorage.getItem('readerFontSize');
      const savedTheme = localStorage.getItem('readerTheme');
      
      if (savedFontSize) {
          const textContainer = document.getElementById('readerText');
          textContainer.className = textContainer.className.replace(/font-(small|medium|large)/, '');
          textContainer.classList.add(`font-${savedFontSize}`);
      }
      
      if (savedTheme === 'light') {
          document.body.classList.add('light-theme');
      }
  },

  selectChapter(chapterNum) {
      if (!this.currentUser) {
          this.showLogin();
          return;
      }
      
      // Navigate to reader page
      this.navigateTo('reader');
      
      // Set current chapter
      this.currentChapter = chapterNum;
      
      // Load the selected chapter
      this.loadChapter(chapterNum);
      
      // Update book progress
      if (this.currentBook && this.currentBook.userProgress) {
          this.currentBook.userProgress.currentChapter = chapterNum;
          this.saveReadingProgress(chapterNum);
      }
  },

  showReviewForm() {
      if (!this.currentUser) {
          this.showLogin();
          return;
      }
      document.getElementById('reviewModal').classList.add('show');
      this.setupRatingInput();
  },

  closeReviewModal() {
      document.getElementById('reviewModal').classList.remove('show');
  },

  setupRatingInput() {
      const stars = document.querySelectorAll('.star-input');
      let selectedRating = 0;
      stars.forEach((star, index) => {
          star.onclick = () => {
              selectedRating = index + 1;
              this.selectedReviewRating = selectedRating;
              this.updateStarDisplay(stars, selectedRating);
          };
          star.onmouseover = () => {
              this.updateStarDisplay(stars, index + 1);
          };
      });
      document.getElementById('ratingInput').onmouseleave = () => {
          this.updateStarDisplay(stars, this.selectedReviewRating || 0);
      };
      this.selectedReviewRating = 0;
      this.updateStarDisplay(stars, 0);
  },

  updateStarDisplay(stars, rating) {
      stars.forEach((star, index) => {
          star.classList.toggle('active', index < rating);
      });
  },

  submitReview(event) {
      event.preventDefault();
      if (!this.selectedReviewRating) {
          alert('Te rog să selectezi un rating!');
          return;
      }
      const formData = new FormData(event.target);
      const reviewText = formData.get('reviewText');
      const newReview = {
          id: Date.now(),
          user: this.currentUser.name,
          rating: this.selectedReviewRating,
          text: reviewText,
          date: new Date().toISOString(),
          helpful: 0
      };
      if (!this.currentBook.reviews) {
          this.currentBook.reviews = [];
      }
      this.currentBook.reviews.unshift(newReview);
      this.renderReviews(this.currentBook);
      this.renderRating(this.currentBook);
      this.closeReviewModal();
      // Aici ai trimite recenzia la backend
      console.log('New review:', newReview);
  },

  markReviewHelpful(reviewId) {
      if (!this.currentUser) {
          this.showLogin();
          return;
      }
      const review = this.currentBook.reviews.find(r => r.id === reviewId);
      if (review) {
          review.helpful++;
          this.renderReviews(this.currentBook);
      }
      // Aici ai trimite la backend
  },

  addToHistory(bookId) {
      this.history = this.history.filter(h => h.bookId !== bookId);
      this.history.unshift({ bookId, timestamp: Date.now() });
      this.history = this.history.slice(0, 50);
  },

  goBack() {
      this.showHome();
  },

  showAuthorBooks(author) {
      this.currentFilters.search = author;
      this.showCatalog();
      document.getElementById('searchInput').value = author;
      this.performSearch();
  },

  // Event listeners
  setupEventListeners() {
      // Search on Enter
      document.getElementById('searchInput').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              this.performSearch();
          }
      });
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
          if (!e.target.closest('.user-menu')) {
              document.getElementById('userDropdown')?.classList.remove('show');
          }
      });
  },

  // Placeholder methods
  showProfile() {
      console.log('Show profile');
  },

  showCollections() {
      alert('Funcționalitatea de colecții nu este încă implementată.');
  },

  showSettings() {
      this.navigateTo('settings');
      // Arată secțiunea de cont doar dacă utilizatorul este logat
      const accountSettings = document.getElementById('accountSettings');
      if (this.currentUser) {
          accountSettings.style.display = 'block';
      } else {
          accountSettings.style.display = 'none';
      }
      // Setează valorile curente în dropdown-uri
      document.getElementById('themeSelect').value = this.settings.theme;
      document.getElementById('fontSizeSelect').value = this.settings.fontSize;
  },

  // Settings methods
  loadSettings() {
      // Simulează încărcarea setărilor (în viitor de la backend)
      const savedSettings = {
          theme: 'dark',
          fontSize: 'medium'
      };
      this.settings = savedSettings;
      this.applySettings();
  },

  applySettings() {
      document.body.className = '';
      if (this.settings.theme === 'light') {
          document.body.classList.add('light-theme');
      }
      // Remove previous font size classes
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      // Add the selected font size class
      if (this.settings.fontSize === 'small') {
          document.body.classList.add('font-small');
      } else if (this.settings.fontSize === 'large') {
          document.body.classList.add('font-large');
      } else {
          document.body.classList.add('font-medium');
      }
  },

  changeTheme(theme) {
      this.settings.theme = theme;
      if (theme === 'auto') {
          // Detectează preferința sistemului
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.settings.theme = prefersDark ? 'dark' : 'light';
      }
      this.applySettings();
      // Aici ai salva setările pe backend
      console.log('Theme changed to:', theme);
  },

  changeFontSize(size) {
      this.settings.fontSize = size;
      this.applySettings();
      // Aici ai salva setările pe backend
      console.log('Font size changed to:', size);
  },

  showChangeNameModal() {
      document.getElementById('changeNameModal').classList.add('show');
  },

  closeChangeNameModal() {
      document.getElementById('changeNameModal').classList.remove('show');
  },

  changeName(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const newName = formData.get('newName');
      this.currentUser.name = newName;
      this.renderUserActions();
      this.closeChangeNameModal();
      alert('Numele a fost schimbat cu succes!');
  },

  showChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.add('show');
  },

  closeChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.remove('show');
  },

  changePassword(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');
      if (newPassword !== confirmPassword) {
          alert('Parolele nu coincid!');
          return;
      }
      // Aici ai face validarea pe backend
      this.closeChangePasswordModal();
      alert('Parola a fost schimbată cu succes!');
  },

  deleteAccount() {
      if (confirm('Ești sigur că vrei să ștergi contul? Această acțiune nu poate fi anulată.')) {
          // Aici ai șterge contul pe backend
          this.logout();
          alert('Contul a fost șters.');
      }
  },

  // === PROFIL UTILIZATOR ===
  showProfile() {
      this.navigateTo('profile');
      // Avatar și nume/email
      document.getElementById('profileAvatar').textContent = this.currentUser?.name?.charAt(0).toUpperCase() || '?';
      document.getElementById('profileName').textContent = this.currentUser?.name || 'Utilizator';
      document.getElementById('profileEmail').textContent = this.currentUser?.email || '';

      // Statistici personale
      const booksRead = this.books.filter(b => b.userProgress?.currentChapter === b.chapters).length;
      const chaptersRead = this.books.reduce((acc, b) => acc + (b.userProgress?.currentChapter || 0), 0);
      const totalReadingTime = this.books.reduce((acc, b) => acc + Math.floor(((b.userProgress?.currentChapter || 0) / (b.chapters || 1)) * (b.userProgress?.readingTime || 0)), 0);
      const reviewsWritten = this.books.reduce((acc, b) => acc + (b.reviews?.filter(r => r.user === this.currentUser?.name).length || 0), 0);

      document.getElementById('profileBooksRead').textContent = booksRead;
      document.getElementById('profileChaptersRead').textContent = chaptersRead;
      document.getElementById('profileReadingTime').textContent = `${Math.floor(totalReadingTime/60)}h`;
      document.getElementById('profileReviews').textContent = reviewsWritten;

      // Progres de lectură (primele 3 cărți începute dar nu terminate)
      const inProgress = this.books.filter(b => b.userProgress?.currentChapter > 0 && b.userProgress?.currentChapter < b.chapters)
          .slice(0, 3);
      const progressBars = inProgress.map(b => {
          const percent = Math.round((b.userProgress.currentChapter / b.chapters) * 100);
          return `
              <div>
                  <div style="font-weight: 500;">${b.title}</div>
                  <div class="progress-bar" style="margin-bottom: 0;">
                      <div class="progress-fill" style="width: ${percent}%;"></div>
                  </div>
                  <div class="progress-info">
                      <span>Capitol ${b.userProgress.currentChapter} din ${b.chapters}</span>
                      <span>${percent}%</span>
                  </div>
              </div>
          `
      });
  },

  updateReaderProgress(progress) {
      document.getElementById('readerProgressFill').style.width = `${progress}%`;
      document.getElementById('readerProgressText').textContent = `${progress}%`;
  },

  loadReaderText(chapter) {
      // Implementați logică pentru a încărca textul capitolului
      console.log('Loading chapter text:', chapter);
  },
};

// Initialize the app after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});