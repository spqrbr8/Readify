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
  books: [],
  
  genres: ["Toate", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Mystery", "Classic", "Dystopian"],

  init() {
      this.checkSession();
      this.loadBooksFromBackend();
      this.loadUserData();
      this.renderUserActions();
      this.renderGenreFilters();
      this.loadSettings();
      this.setupEventListeners();
      this.loadReaderPreferences();
      // Eliminăm apelul vechi fără bookId
      // this.loadReviews();
  },

  async checkSession() {
      try {
          const response = await fetch('server/check_session.php');
          const result = await response.json();
          if (result.success && result.user) {
              this.currentUser = result.user;
              this.renderUserActions();
          }
      } catch (error) {
          console.error('Eroare la verificarea sesiunii:', error);
      }
  },

  async loadBooksFromBackend() {
      try {
          const response = await fetch('server/books.php');
          const result = await response.json();
          if (result.success) {
              this.books = result.books;
              this.renderBooks();
          } else {
              this.books = [];
              this.renderBooks();
              alert('Eroare la încărcarea cărților din baza de date!');
          }
      } catch (e) {
          this.books = [];
          this.renderBooks();
          alert('Eroare la conectare cu serverul!');
      }
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
          let adminBtn = '';
          if (this.currentUser.role === 'admin') {
              adminBtn = `<button class="auth-btn" onclick="App.showAdminPanel()">Admin</button>`;
          }
          container.innerHTML = `
              ${adminBtn}
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
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('authModal').classList.add('show');
  },

  showRegister() {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'block';
      document.getElementById('authModal').classList.add('show');
  },

  switchToLogin() {
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('registerForm').style.display = 'none';
  },

  switchToRegister() {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('registerForm').style.display = 'block';
  },

  closeAuthModal() {
      document.getElementById('authModal').classList.remove('show');
  },

  async login(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {
          email: formData.get('email'),
          password: formData.get('password')
      };

      try {
          const response = await fetch('server/login.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
              return;
          }

          this.currentUser = result.user;
          this.renderUserActions();
          this.closeAuthModal();
      } catch (error) {
          alert('Ошибка при входе: ' + error.message);
      }
  },

  async register(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password')
      };

      try {
          const response = await fetch('server/register.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
              return;
          }

          this.currentUser = result.user;
          this.renderUserActions();
          this.closeAuthModal();
      } catch (error) {
          alert('Ошибка при регистрации: ' + error.message);
      }
  },

  async logout() {
      try {
          const response = await fetch('server/logout.php');
          const result = await response.json();
          
          if (result.success) {
              this.currentUser = null;
              this.renderUserActions();
              const dropdown = document.getElementById('userDropdown');
              if (dropdown) {
                  dropdown.classList.remove('show');
              }
          }
      } catch (error) {
          alert('Ошибка при выходе: ' + error.message);
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

  async renderBookDetails(book) {
      this.currentBook = book;
      
      // Обновляем заголовок и автора
      document.getElementById('bookTitleLarge').textContent = book.title;
      const authorLink = document.getElementById('bookAuthorLink');
      authorLink.textContent = book.author;
      authorLink.onclick = (e) => {
          e.preventDefault();
          this.showAuthorBooks(book.author);
      };
      
      // Обновляем жанры
      const genresContainer = document.getElementById('bookGenres');
      genresContainer.innerHTML = '';
      
      // Проверяем, является ли genres строкой или массивом
      const genres = typeof book.genres === 'string' ? book.genres.split(',') : (Array.isArray(book.genres) ? book.genres : []);
      
      genres.forEach(genre => {
          const genreTag = document.createElement('span');
          genreTag.className = 'genre-tag';
          genreTag.textContent = genre.trim();
          genreTag.onclick = () => this.filterByGenre(genre.trim());
          genresContainer.appendChild(genreTag);
      });
      
      // Обновляем остальные детали
      document.getElementById('bookStatus').textContent = this.getStatusText(book.status);
      document.getElementById('bookChapters').textContent = `${book.chapters} capitole`;
      document.getElementById('bookPublishDate').textContent = new Date(book.publish_date).toLocaleDateString('ro-RO');
      document.getElementById('bookPublisher').textContent = book.publisher;
      document.getElementById('bookDescription').textContent = book.description;
      
      // Обновляем рейтинг
      this.renderRating(book);
      
      // Обновляем прогресс чтения
      this.renderReadingProgress(book);
      
      // Обновляем список глав
      this.renderChaptersList(book);
      
      // Загружаем отзывы
      await this.renderReviews(book.id);
      
      // Загружаем рекомендации
      this.renderRecommendations(book);
      
      // Обновляем кнопку избранного
      this.updateFavoriteButton(book.id);
      
      // Показываем страницу деталей
      this.navigateTo('bookDetails');
  },

  renderRating(book) {
      const starsContainer = document.getElementById('starsLarge');
      const rating = Math.round(book.rating);
      starsContainer.innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      document.getElementById('ratingValue').textContent = book.rating.toFixed(1);
      
      // Получаем общее количество отзывов из статистики рейтингов
      const totalReviews = book.rating_stats ? 
          book.rating_stats.reduce((sum, stat) => sum + parseInt(stat.count), 0) : 0;
      
      document.getElementById('ratingCount').textContent = `(${totalReviews} evaluări)`;

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

  async renderReviews(bookId, page = 1) {
      try {
          const response = await fetch(`server/getReviews.php?bookId=${bookId}&page=${page}`);
          const data = await response.json();
          
          if (data.success) {
              // Обновляем статистику рейтингов в текущей книге
              if (this.currentBook) {
                  this.currentBook.rating_stats = data.rating_stats;
                  this.renderRating(this.currentBook);
              }
              
              const reviewsContainer = document.getElementById('reviewsList');
              const paginationContainer = document.getElementById('reviewsPagination');
              const totalReviewsElement = document.getElementById('totalReviews');
              const averageRatingElement = document.getElementById('averageRating');
              const averageStarsElement = document.getElementById('averageStars');
              const ratingBreakdown = document.getElementById('ratingBreakdown');
              
              // Обновляем общее количество отзывов
              if (totalReviewsElement) {
                  totalReviewsElement.textContent = `${data.pagination.total} recenzii`;
              }
              
              // Рассчитываем средний рейтинг
              let sumRatings = 0;
              let numRatings = 0;
              data.rating_stats.forEach(stat => {
                  sumRatings += parseInt(stat.rating) * parseInt(stat.count);
                  numRatings += parseInt(stat.count);
              });
              const averageRating = numRatings > 0 ? (sumRatings / numRatings).toFixed(1) : '0.0';
              
              // Обновляем средний рейтинг
              if (averageRatingElement) {
                  averageRatingElement.textContent = averageRating;
              }
              if (averageStarsElement) {
                  averageStarsElement.innerHTML = this.generateStars(parseFloat(averageRating));
              }
              
              // Обновляем разбивку рейтингов
              if (ratingBreakdown) {
                  let breakdownHTML = '';
                  for (let i = 5; i >= 1; i--) {
                      const stat = data.rating_stats.find(s => parseInt(s.rating) === i);
                      const count = stat ? parseInt(stat.count) : 0;
                      const percentage = numRatings > 0 ? (count / numRatings) * 100 : 0;
                      
                      breakdownHTML += `
                          <div class="rating-bar">
                              <span>${i} ★</span>
                              <div class="rating-bar-fill">
                                  <div class="rating-bar-progress" style="width: ${percentage}%"></div>
                              </div>
                              <span>${count}</span>
                          </div>
                      `;
                  }
                  ratingBreakdown.innerHTML = breakdownHTML;
              }
              
              // Обновляем список отзывов
              if (data.reviews.length === 0) {
                  reviewsContainer.innerHTML = '<p class="no-reviews">Nicio recenzie încă. Fii primul!</p>';
              } else {
                  reviewsContainer.innerHTML = data.reviews.map(review => `
                      <div class="review-item">
                          <div class="review-header">
                              <div class="reviewer-info">
                                  <div class="reviewer-avatar">
                                      ${review.author_name ? review.author_name.charAt(0).toUpperCase() : '?'}
                                  </div>
                                  <div class="reviewer-details">
                                      <div class="reviewer-name">${review.author_name || 'Anonim'}</div>
                                      <div class="review-date">${new Date(review.created_at).toLocaleDateString('ro-RO')}</div>
                                  </div>
                              </div>
                              <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                          </div>
                          <div class="review-title">${review.title}</div>
                          <div class="review-content">${review.content}</div>
                      </div>
                  `).join('');
              }
              
              // Обновляем пагинацию
              const totalPages = Math.ceil(data.pagination.total / data.pagination.limit);
              let paginationHTML = '';
              
              if (totalPages > 1) {
                  paginationHTML += `
                      <button class="pagination-btn" 
                              onclick="App.loadReviews(${bookId}, ${page - 1})"
                              ${page === 1 ? 'disabled' : ''}>
                          <i class="fas fa-chevron-left"></i>
                      </button>
                  `;
                  
                  for (let i = 1; i <= totalPages; i++) {
                      paginationHTML += `
                          <button class="pagination-btn ${i === page ? 'active' : ''}"
                                  onclick="App.loadReviews(${bookId}, ${i})">
                              ${i}
                          </button>
                      `;
                  }
                  
                  paginationHTML += `
                      <button class="pagination-btn"
                              onclick="App.loadReviews(${bookId}, ${page + 1})"
                              ${page === totalPages ? 'disabled' : ''}>
                          <i class="fas fa-chevron-right"></i>
                      </button>
                  `;
              }
              
              paginationContainer.innerHTML = paginationHTML;
          }
      } catch (error) {
          console.error('Error loading reviews:', error);
      }
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
          // Показываем состояние загрузки
          const textContainer = document.getElementById('readerText');
          textContainer.innerHTML = '<div class="loading">Se încarcă...</div>';
          
          // Получаем данные книги с сервера
          const response = await fetch(`server/get_chapter.php?bookId=${this.currentBook.id}&chapter=${chapterNumber}`);
          const result = await response.json();
          
          if (!result.success) {
              throw new Error(result.error || 'Eroare la încărcarea capitolului');
          }
          
          // Обновляем UI
          document.getElementById('readerChapterTitle').textContent = `Capitol ${chapterNumber}`;
          textContainer.textContent = result.content || 'Conținutul capitolului nu este disponibil.';
          
          // Обновляем кнопки навигации
          const prevBtn = document.querySelector('.nav-btn:first-child');
          const nextBtn = document.querySelector('.nav-btn:last-child');
          prevBtn.disabled = chapterNumber <= 1;
          nextBtn.disabled = chapterNumber >= this.currentBook.chapters;
          
          // Обновляем прогресс
          const progress = (chapterNumber / this.currentBook.chapters) * 100;
          this.updateReaderProgress(Math.round(progress));
          
          // Восстанавливаем позицию прокрутки, если она существует
          if (this.currentBook.userProgress.lastReadPosition && 
              this.currentBook.userProgress.lastChapter === chapterNumber) {
              textContainer.scrollTop = this.currentBook.userProgress.lastReadPosition;
          } else {
              textContainer.scrollTop = 0;
          }
          
          // Сохраняем прогресс
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
      const theme = isLight ? 'light' : 'dark';
      localStorage.setItem('readerTheme', theme);
      // Обновляем значение в настройках
      if (document.getElementById('themeSelect')) {
          document.getElementById('themeSelect').value = theme;
      }
      // Обновляем настройки в объекте App
      this.settings.theme = theme;
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
      
      if (!this.currentBook) {
          alert('Eroare: Carte invalidă');
          return;
      }
      
      const modal = document.getElementById('reviewModal');
      modal.classList.add('show');
      
      // Сбрасываем форму
      const form = modal.querySelector('form');
      form.reset();
      
      // Сбрасываем звезды
      const stars = modal.querySelectorAll('.star-input');
      stars.forEach(star => {
          star.classList.remove('active');
          star.classList.remove('hover');
      });
      
      // Удаляем старые обработчики событий
      stars.forEach(star => {
          const newStar = star.cloneNode(true);
          star.parentNode.replaceChild(newStar, star);
      });
      
      // Инициализируем звезды
      this.setupRatingInput(modal);
  },

  closeReviewModal() {
      document.getElementById('reviewModal').classList.remove('show');
  },

  setupRatingInput(modal) {
      const stars = modal.querySelectorAll('.star-input');
      
      stars.forEach(star => {
          // Обработчик клика
          star.addEventListener('click', () => {
              const rating = star.dataset.rating;
              
              stars.forEach(s => {
                  if (s.dataset.rating <= rating) {
                      s.classList.add('active');
                  } else {
                      s.classList.remove('active');
                  }
              });
          });
          
          // Обработчик наведения
          star.addEventListener('mouseover', () => {
              const rating = star.dataset.rating;
              stars.forEach(s => {
                  if (s.dataset.rating <= rating) {
                      s.classList.add('hover');
                  } else {
                      s.classList.remove('hover');
                  }
              });
          });
          
          // Обработчик ухода мыши
          star.addEventListener('mouseout', () => {
              stars.forEach(s => s.classList.remove('hover'));
          });
      });
  },

  updateStarDisplay(stars, rating) {
      stars.forEach((star, index) => {
          star.classList.toggle('active', index < rating);
      });
  },

  async submitReview(event) {
      event.preventDefault();
      
      if (!this.currentBook) {
          console.error('currentBook is not set');
          alert('Eroare: Carte invalidă');
          return;
      }
      
      const modal = document.getElementById('reviewModal');
      const form = modal.querySelector('form');
      const stars = modal.querySelectorAll('.star-input');
      
      // Находим последнюю активную звезду
      let selectedRating = 0;
      for (let i = stars.length - 1; i >= 0; i--) {
          if (stars[i].classList.contains('active')) {
              selectedRating = parseInt(stars[i].dataset.rating);
              break;
          }
      }
      
      const title = modal.querySelector('[name="reviewTitle"]').value;
      const content = modal.querySelector('[name="reviewContent"]').value;
      
      if (selectedRating === 0 || !title || !content) {
          console.error('Missing required fields:', { rating: selectedRating, title, content });
          alert('Vă rugăm să selectați un rating și să completați toate câmpurile.');
          return;
      }
      
      try {
          const requestData = {
              bookId: this.currentBook.id,
              rating: selectedRating,
              title: title,
              content: content
          };
          
          console.log('Sending review data:', requestData); // Для отладки
          
          const response = await fetch('server/addReview.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
          });
          
          const data = await response.json();
          
          if (data.success) {
              this.closeReviewModal();
              
              // Обновляем информацию о книге
              const bookResponse = await fetch(`server/getBook.php?id=${this.currentBook.id}`);
              const bookData = await bookResponse.json();
              
              if (bookData.success) {
                  this.currentBook = bookData.book;
                  this.renderRating(this.currentBook);
                  await this.loadReviews(this.currentBook.id);
              }
              
              alert('Recenzie adăugată cu succes!');
          } else {
              alert(data.message || 'Eroare la adăugarea recenziei');
          }
      } catch (error) {
          console.error('Error submitting review:', error);
          alert('Eroare la adăugarea recenziei');
      }
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
      // Admin: buton adăugare carte
      const addBookBtn = document.getElementById('addBookBtn');
      if (addBookBtn) {
          addBookBtn.onclick = () => this.showAddBookForm();
      }
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
      // Загружаем тему из localStorage
      const savedTheme = localStorage.getItem('readerTheme') || 'dark';
      const savedFontSize = localStorage.getItem('readerFontSize') || 'medium';
      
      this.settings = {
          theme: savedTheme,
          fontSize: savedFontSize
      };
      
      this.applySettings();
  },

  applySettings() {
      // Применяем тему
      document.body.className = '';
      if (this.settings.theme === 'light') {
          document.body.classList.add('light-theme');
      }
      
      // Обновляем значение в селекте настроек
      if (document.getElementById('themeSelect')) {
          document.getElementById('themeSelect').value = this.settings.theme;
      }
      
      // Применяем размер шрифта
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      document.body.classList.add(`font-${this.settings.fontSize}`);
  },

  changeTheme(theme) {
      this.settings.theme = theme;
      if (theme === 'auto') {
          // Определяем предпочтение системы
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.settings.theme = prefersDark ? 'dark' : 'light';
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('readerTheme', this.settings.theme);
      
      // Применяем настройки
      this.applySettings();
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

  async changeName(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const newName = formData.get('newName');

      try {
          const response = await fetch('server/change_name.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ newName })
          });

          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
              return;
          }

          this.currentUser = result.user;
          this.renderUserActions();
          this.closeChangeNameModal();
          alert('Numele a fost schimbat cu succes!');
      } catch (error) {
          alert('Ошибка при изменении имени: ' + error.message);
      }
  },

  showChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.add('show');
  },

  closeChangePasswordModal() {
      document.getElementById('changePasswordModal').classList.remove('show');
  },

  async changePassword(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (newPassword !== confirmPassword) {
          alert('Parolele nu coincid!');
          return;
      }

      try {
          const response = await fetch('server/change_password.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  currentPassword,
                  newPassword
              })
          });

          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
              return;
          }

          this.closeChangePasswordModal();
          alert('Parola a fost schimbată cu succes!');
      } catch (error) {
          alert('Ошибка при изменении пароля: ' + error.message);
      }
  },

  async deleteAccount() {
      if (!confirm('Ești sigur că vrei să ștergi contul? Această acțiune nu poate fi anulată.')) {
          return;
      }

      try {
          const response = await fetch('server/delete_account.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          const result = await response.json();
          
          if (result.error) {
              alert(result.error);
              return;
          }

          this.currentUser = null;
          this.renderUserActions();
          alert('Contul a fost șters cu succes.');
      } catch (error) {
          alert('Ошибка при удалении аккаунта: ' + error.message);
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
          `;
      }).join('') || '<div>Nu ai progres de lectură activ.</div>';
      document.getElementById('profileProgressBars').innerHTML = progressBars;

      // Obiective de lectură (exemplu: 5 cărți pe lună)
      const month = new Date().getMonth();
      const booksThisMonth = this.history.filter(h => (new Date(h.timestamp)).getMonth() === month)
          .map(h => h.bookId);
      const uniqueBooksThisMonth = [...new Set(booksThisMonth)].length;
      const goal = 5;
      document.getElementById('profileGoals').innerHTML = `
          <div style="margin-bottom: 10px;">Obiectiv: <b>${goal}</b> cărți citite luna aceasta</div>
          <div class="progress-bar" style="margin-bottom: 0;">
              <div class="progress-fill" style="width: ${Math.min(100, uniqueBooksThisMonth/goal*100)}%;"></div>
          </div>
          <div class="progress-info">
              <span>${uniqueBooksThisMonth} / ${goal} cărți</span>
              <span>${uniqueBooksThisMonth >= goal ? '✔️' : ''}</span>
          </div>
      `;

      // Cele mai citite genuri
      const genreCount = {};
      this.books.forEach(b => {
          if (b.userProgress?.currentChapter > 0) {
              (b.genres || []).forEach(g => {
                  genreCount[g] = (genreCount[g] || 0) + 1;
              });
          }
      });
      const topGenres = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([g, c]) => `<span class="tag active">${g} (${c})</span>`)
          .join('') || '<span class="setting-description">Nu există date suficiente.</span>';
      document.getElementById('profileTopGenres').innerHTML = topGenres;

      // Ultima carte citită
      if (this.history.length > 0) {
          const last = this.history[0];
          const book = this.books.find(b => b.id === last.bookId);
          document.getElementById('profileLastRead').innerHTML = book
              ? `<div style="display: flex; align-items: center; gap: 15px;">
                      <div style="width: 40px; height: 60px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                          ${book.cover ? `<img src="${book.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">` : '📖'}
                      </div>
                      <div>
                          <div style="font-weight: 500;">${book.title}</div>
                          <div class="setting-description">de ${book.author}</div>
                      </div>
                 </div>`
              : '<span class="setting-description">Nicio carte citită recent.</span>';
      } else {
          document.getElementById('profileLastRead').innerHTML = '<span class="setting-description">Nicio carte citită recent.</span>';
      }
  },

  updateReaderProgress(progress) {
      document.getElementById('readerProgressFill').style.width = `${progress}%`;
      document.getElementById('readerProgressText').textContent = `${progress}%`;
  },

  loadReaderText(chapter) {
      // Implementați logică pentru a încărca textul capitolului
      console.log('Loading chapter text:', chapter);
  },

  showAdminPanel() {
      if (!this.currentUser || this.currentUser.role !== 'admin') return;
      document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
      document.getElementById('adminPanelPage').style.display = '';
      document.getElementById('adminPanelPage').classList.add('active');
      this.renderAdminTabs();
      this.fetchAdminBooks();
  },

  renderAdminTabs() {
      const booksTab = document.getElementById('adminBooksTab');
      const usersTab = document.getElementById('adminUsersTab');
      const booksSection = document.getElementById('adminBooksSection');
      const usersSection = document.getElementById('adminUsersSection');
      
      booksTab.onclick = () => {
          booksSection.style.display = '';
          usersSection.style.display = 'none';
          this.fetchAdminBooks();
      };
      
      usersTab.onclick = () => {
          booksSection.style.display = 'none';
          usersSection.style.display = '';
          this.fetchAdminUsers();
      };
      
      // Implicit: tabul cărți activ
      booksSection.style.display = '';
      usersSection.style.display = 'none';
      this.fetchAdminBooks();
  },

  async fetchAdminBooks() {
      try {
          const response = await fetch('server/admin_books.php', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
          });
          const result = await response.json();
          if (result.success) {
              this.renderAdminBooks(result.books);
          } else {
              document.getElementById('adminBooksList').innerHTML = '<div style="color:red">Eroare la încărcarea cărților!</div>';
          }
      } catch (e) {
          document.getElementById('adminBooksList').innerHTML = '<div style="color:red">Eroare la conectare cu serverul!</div>';
      }
  },

  renderAdminBooks(books) {
      const container = document.getElementById('adminBooksList');
      if (!books.length) {
          container.innerHTML = '<div>Nu există cărți în baza de date.</div>';
          return;
      }
      container.innerHTML = `<table style="width:100%;border-collapse:collapse;">
          <thead>
              <tr style="background:#222;color:#fff;">
                  <th style="padding:8px;">ID</th>
                  <th style="padding:8px;">Titlu</th>
                  <th style="padding:8px;">Autor</th>
                  <th style="padding:8px;">Genuri</th>
                  <th style="padding:8px;">Status</th>
                  <th style="padding:8px;">Acțiuni</th>
              </tr>
          </thead>
          <tbody>
              ${books.map(book => `
                  <tr>
                      <td style="padding:8px;">${book.id}</td>
                      <td style="padding:8px;">${book.title}</td>
                      <td style="padding:8px;">${book.author}</td>
                      <td style="padding:8px;">${book.genres || ''}</td>
                      <td style="padding:8px;">${book.status}</td>
                      <td style="padding:8px;">
                          <button class="admin-btn edit" onclick="App.editAdminBook(${book.id})">Editează</button>
                          <button class="admin-btn delete" onclick="App.deleteAdminBook(${book.id})">Șterge</button>
                      </td>
                  </tr>
              `).join('')}
          </tbody>
      </table>`;
  },

  showAddBookForm() {
      const formContainer = document.getElementById('addBookFormContainer');
      formContainer.style.display = '';
      formContainer.innerHTML = `
          <form id="adminAddBookForm" style="background:#222;padding:20px;border-radius:8px;margin-bottom:20px;">
              <h3 style="color:#fff;">Adaugă carte nouă</h3>
              <input name="title" class="form-input" placeholder="Titlu" required style="margin-bottom:10px;" />
              <input name="author" class="form-input" placeholder="Autor" required style="margin-bottom:10px;" />
              <input name="genres" class="form-input" placeholder="Genuri (ex: Fantasy,Adventure)" style="margin-bottom:10px;" />
              <select name="status" class="form-input" style="margin-bottom:10px;">
                  <option value="ongoing">În curs</option>
                  <option value="completed">Completă</option>
                  <option value="paused">Întreruptă</option>
              </select>
              <input name="rating" type="number" step="0.1" min="0" max="5" class="form-input" placeholder="Rating (0-5)" style="margin-bottom:10px;" />
              <input name="chapters" type="number" min="1" class="form-input" placeholder="Număr capitole" style="margin-bottom:10px;" />
              <input name="cover" class="form-input" placeholder="URL copertă (opțional)" style="margin-bottom:10px;" />
              <input name="publish_date" type="date" class="form-input" placeholder="Data publicării" style="margin-bottom:10px;" />
              <input name="publisher" class="form-input" placeholder="Editura" style="margin-bottom:10px;" />
              <textarea name="description" class="form-input" placeholder="Descriere" style="margin-bottom:10px;"></textarea>
              <textarea name="content" class="form-input" placeholder="Conținutul cărții" style="margin-bottom:10px;min-height:200px;"></textarea>
              <button type="submit" class="form-btn">Adaugă</button>
              <button type="button" class="form-btn" style="background:#444;margin-top:10px;" onclick="App.hideAddBookForm()">Anulează</button>
          </form>
      `;
      document.getElementById('adminAddBookForm').onsubmit = (e) => this.submitAddBookForm(e);
  },

  hideAddBookForm() {
      const formContainer = document.getElementById('addBookFormContainer');
      formContainer.style.display = 'none';
      formContainer.innerHTML = '';
  },

  async submitAddBookForm(e) {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form).entries());
      try {
          const response = await fetch('server/admin_books.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          const result = await response.json();
          if (result.success) {
              this.hideAddBookForm();
              this.fetchAdminBooks();
              alert('Cartea a fost adăugată cu succes!');
          } else {
              alert(result.error || 'Eroare la adăugare carte!');
          }
      } catch (e) {
          alert('Eroare la conectare cu serverul!');
      }
  },

  async deleteAdminBook(bookId) {
      if (!confirm('Sigur doriți să ștergeți această carte?')) return;
      
      try {
          const response = await fetch('server/admin_books.php', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: bookId })
          });
          
          const result = await response.json();
          
          if (result.success) {
              alert('Cartea a fost ștearsă cu succes!');
              this.fetchAdminBooks(); // Reîncarcă lista de cărți
          } else {
              alert('Eroare la ștergerea cărții: ' + (result.error || 'Eroare necunoscută'));
          }
      } catch (error) {
          console.error('Eroare la ștergerea cărții:', error);
          alert('Eroare la conectare cu serverul!');
      }
  },

  async fetchAdminUsers() {
      try {
          const response = await fetch('server/admin_users.php', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
          });
          const result = await response.json();
          if (result.success) {
              this.renderAdminUsers(result.users);
          } else {
              document.getElementById('adminUsersList').innerHTML = '<div style="color:red">Eroare la încărcarea utilizatorilor!</div>';
          }
      } catch (e) {
          document.getElementById('adminUsersList').innerHTML = '<div style="color:red">Eroare la conectare cu serverul!</div>';
      }
  },

  renderAdminUsers(users) {
      const container = document.getElementById('adminUsersList');
      if (!users.length) {
          container.innerHTML = '<div>Nu există utilizatori în baza de date.</div>';
          return;
      }
      container.innerHTML = `<table style="width:100%;border-collapse:collapse;">
          <thead>
              <tr style="background:#222;color:#fff;">
                  <th style="padding:8px;">ID</th>
                  <th style="padding:8px;">Nume</th>
                  <th style="padding:8px;">Email</th>
                  <th style="padding:8px;">Rol</th>
                  <th style="padding:8px;">Data creării</th>
                  <th style="padding:8px;">Acțiuni</th>
              </tr>
          </thead>
          <tbody>
              ${users.map(user => `
                  <tr>
                      <td style="padding:8px;">${user.id}</td>
                      <td style="padding:8px;">${user.name}</td>
                      <td style="padding:8px;">${user.email}</td>
                      <td style="padding:8px;">${user.role}</td>
                      <td style="padding:8px;">${new Date(user.created_at).toLocaleDateString('ro-RO')}</td>
                      <td style="padding:8px;">
                          <button class="admin-btn edit" onclick="App.editAdminUser(${user.id})">Editează</button>
                          ${user.id !== this.currentUser.id ? 
                              `<button class="admin-btn delete" onclick="App.deleteAdminUser(${user.id})">Șterge</button>` : 
                              ''}
                      </td>
                  </tr>
              `).join('')}
          </tbody>
      </table>`;
  },

  async editAdminUser(userId) {
      try {
          const response = await fetch(`server/get_user.php?id=${userId}`);
          const result = await response.json();
          
          if (result.success) {
              const user = result.user;
              document.getElementById('editUserId').value = user.id;
              document.getElementById('editUserName').value = user.name;
              document.getElementById('editUserEmail').value = user.email;
              document.getElementById('editUserRole').value = user.role;
              document.getElementById('editUserStatus').value = user.status || 'active';
              document.getElementById('editUserPassword').value = '';
              
              document.getElementById('editUserModal').classList.add('show');
          } else {
              alert('Eroare la încărcarea datelor utilizatorului!');
          }
      } catch (error) {
          console.error('Eroare:', error);
          alert('Eroare la încărcarea datelor utilizatorului!');
      }
  },

  closeEditUserModal() {
      document.getElementById('editUserModal').classList.remove('show');
  },

  async submitEditUser(event) {
      event.preventDefault();
      
      const formData = new FormData(event.target);
      const userId = formData.get('userId');
      
      try {
          const response = await fetch('server/edit_user.php', {
              method: 'POST',
              body: formData
          });
          
          const result = await response.json();
          
          if (result.success) {
              alert('Utilizatorul a fost actualizat cu succes!');
              this.closeEditUserModal();
              this.fetchAdminUsers(); // Reîncarcă lista de utilizatori
          } else {
              alert(result.message || 'Eroare la actualizarea utilizatorului!');
          }
      } catch (error) {
          console.error('Eroare:', error);
          alert('Eroare la actualizarea utilizatorului!');
      }
  },

  async deleteAdminUser(userId) {
      if (!confirm('Sigur doriți să ștergeți acest utilizator?')) return;
      
      try {
          const response = await fetch('server/admin_users.php', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: userId })
          });
          
          const result = await response.json();
          
          if (result.success) {
              alert('Utilizatorul a fost șters cu succes!');
              this.fetchAdminUsers();
          } else {
              alert('Eroare la ștergerea utilizatorului: ' + (result.error || 'Eroare necunoscută'));
          }
      } catch (error) {
          console.error('Eroare la ștergerea utilizatorului:', error);
          alert('Eroare la conectare cu serverul!');
      }
  },

  async editAdminBook(bookId) {
      try {
          const response = await fetch(`server/admin_books.php?id=${bookId}`);
          const result = await response.json();
          
          if (result.success) {
              const book = result.book;
              const formContainer = document.getElementById('addBookFormContainer');
              formContainer.style.display = '';
              formContainer.innerHTML = `
                  <form id="adminEditBookForm" style="background:#222;padding:20px;border-radius:8px;margin-bottom:20px;">
                      <h3 style="color:#fff;">Editează carte</h3>
                      <input type="hidden" name="id" value="${book.id}">
                      <input name="title" class="form-input" placeholder="Titlu" value="${book.title}" required style="margin-bottom:10px;" />
                      <input name="author" class="form-input" placeholder="Autor" value="${book.author}" required style="margin-bottom:10px;" />
                      <input name="genres" class="form-input" placeholder="Genuri (ex: Fantasy,Adventure)" value="${book.genres || ''}" style="margin-bottom:10px;" />
                      <select name="status" class="form-input" style="margin-bottom:10px;">
                          <option value="ongoing" ${book.status === 'ongoing' ? 'selected' : ''}>În curs</option>
                          <option value="completed" ${book.status === 'completed' ? 'selected' : ''}>Completă</option>
                          <option value="paused" ${book.status === 'paused' ? 'selected' : ''}>Întreruptă</option>
                      </select>
                      <input name="rating" type="number" step="0.1" min="0" max="5" class="form-input" placeholder="Rating (0-5)" value="${book.rating || ''}" style="margin-bottom:10px;" />
                      <input name="chapters" type="number" min="1" class="form-input" placeholder="Număr capitole" value="${book.chapters || ''}" style="margin-bottom:10px;" />
                      <input name="cover" class="form-input" placeholder="URL copertă (opțional)" value="${book.cover || ''}" style="margin-bottom:10px;" />
                      <input name="publish_date" type="date" class="form-input" placeholder="Data publicării" value="${book.publish_date || ''}" style="margin-bottom:10px;" />
                      <input name="publisher" class="form-input" placeholder="Editura" value="${book.publisher || ''}" style="margin-bottom:10px;" />
                      <textarea name="description" class="form-input" placeholder="Descriere" style="margin-bottom:10px;">${book.description || ''}</textarea>
                      <textarea name="content" class="form-input" placeholder="Conținutul cărții" style="margin-bottom:10px;min-height:400px;">${book.content || ''}</textarea>
                      <button type="submit" class="form-btn">Salvează modificările</button>
                      <button type="button" class="form-btn" style="background:#444;margin-top:10px;" onclick="App.hideAddBookForm()">Anulează</button>
                  </form>
              `;
              document.getElementById('adminEditBookForm').onsubmit = (e) => this.submitEditBookForm(e);
          } else {
              alert('Eroare la încărcarea datelor cărții!');
          }
      } catch (error) {
          console.error('Eroare:', error);
          alert('Eroare la încărcarea datelor cărții!');
      }
  },

  async submitEditBookForm(e) {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form).entries());
      const bookId = data.id;
      delete data.id;
      
      try {
          const response = await fetch('server/admin_books.php', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: bookId, ...data })
          });
          const result = await response.json();
          if (result.success) {
              this.hideAddBookForm();
              this.fetchAdminBooks();
              alert('Cartea a fost actualizată cu succes!');
          } else {
              alert(result.error || 'Eroare la actualizarea cărții!');
          }
      } catch (e) {
          alert('Eroare la conectare cu serverul!');
      }
  },

  downloadPDF: function() {
      if (!this.currentBook) return;
      
      // Redirecționăm către endpoint-ul de descărcare PDF
      window.location.href = `server/download_pdf.php?book_id=${this.currentBook.id}`;
  },

  generateStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      let stars = '';
      
      for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
              stars += '<span class="star filled">★</span>';
          } else if (i === fullStars && hasHalfStar) {
              stars += '<span class="star half">★</span>';
          } else {
              stars += '<span class="star">☆</span>';
          }
      }
      
      return stars;
  },

  // Функция для лайка отзыва
  async toggleLike(reviewId) {
      try {
          const response = await fetch('server/likeReview.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ reviewId })
          });
          
          const data = await response.json();
          
          if (data.success) {
              const likeBtn = document.querySelector(`.review-item[data-review-id="${reviewId}"] .like-btn`);
              const likesCount = likeBtn.querySelector('span');
              
              if (data.action === 'liked') {
                  likeBtn.classList.add('liked');
                  likesCount.textContent = parseInt(likesCount.textContent) + 1;
              } else {
                  likeBtn.classList.remove('liked');
                  likesCount.textContent = parseInt(likesCount.textContent) - 1;
              }
          }
      } catch (error) {
          console.error('Ошибка при обработке лайка:', error);
      }
  },

  // Функция для смены страницы отзывов
  changePage(page) {
      renderReviews(this.currentBook, page);
  },
};
// Initialize the app after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
