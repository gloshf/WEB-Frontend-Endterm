$(document).ready(function () {

  function showMessage(input, isOk, text) {
    var message = $('.field-feedback[data-for="' + input.attr('id') + '"]');

    input.removeClass('is-valid is-invalid');
    message.removeClass('ok error');

    if (isOk) {
      input.addClass('is-valid');
      message.addClass('ok').text('✔ ' + text);
    } else {
      input.addClass('is-invalid');
      message.addClass('error').text('✘ ' + text);
    }
    return isOk;   // true or false, so the caller knows the result
  }

  if ($('#registerForm').length) {

    var emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

    function checkName() {
      var value = $('#regName').val().trim();
      if (value === '') return showMessage($('#regName'), false, 'Name is required.');
      if (value.length < 2) return showMessage($('#regName'), false, 'Name must have at least 2 letters.');
      return showMessage($('#regName'), true, 'Looks good!');
    }

    function checkEmail() {
      var value = $('#regEmail').val().trim();
      if (value === '') return showMessage($('#regEmail'), false, 'Email is required.');
      if (!emailPattern.test(value)) return showMessage($('#regEmail'), false, 'Enter a valid email, e.g. name@example.com.');
      return showMessage($('#regEmail'), true, 'Valid email.');
    }

    function checkPassword() {
      var value = $('#regPassword').val();
      if (value === '') return showMessage($('#regPassword'), false, 'Password is required.');
      if (value.length < 8) return showMessage($('#regPassword'), false, 'Use at least 8 characters.');
      return showMessage($('#regPassword'), true, 'Password accepted.');
    }

    function checkConfirm() {
      var value = $('#regConfirm').val();
      if (value === '') return showMessage($('#regConfirm'), false, 'Please confirm your password.');
      if (value !== $('#regPassword').val()) return showMessage($('#regConfirm'), false, 'Passwords do not match.');
      return showMessage($('#regConfirm'), true, 'Passwords match.');
    }

    function checkMessage() {
      var value = $('#regMessage').val().trim();
      if (value === '') return showMessage($('#regMessage'), false, 'Message is required.');
      if (value.length < 10) return showMessage($('#regMessage'), false, 'Write at least 10 characters.');
      return showMessage($('#regMessage'), true, 'Thank you!');
    }

    function showStrength() {
      var password = $('#regPassword').val();
      var points = 0;

      if (password.length >= 8) points++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
      if (/[0-9]/.test(password)) points++;
      if (/[^A-Za-z0-9]/.test(password)) points++;

      var width = '0%';
      var color = '';
      var text = '';

      if (password !== '') {
        if (points <= 1) {
          width = '33%'; color = '#e0444d'; text = 'Weak';
        } else if (points <= 3) {
          width = '66%'; color = '#f0b429'; text = 'Medium';
        } else {
          width = '100%'; color = '#2ea66a'; text = 'Strong';
        }
        text = 'Password strength: ' + text;
      }

      $('#strengthFill').css({ width: width, background: color });
      $('#strengthLabel').text(text).css('color', color);
    }

    $('#regName').on('input', checkName);
    $('#regEmail').on('input', checkEmail);
    $('#regMessage').on('input', checkMessage);
    $('#regConfirm').on('input', checkConfirm);

    $('#regPassword').on('input', function () {
      showStrength();
      checkPassword();
      if ($('#regConfirm').val() !== '') checkConfirm();
    });


    $('#registerForm').on('submit', function (event) {
      event.preventDefault();


      var nameOk = checkName();
      var emailOk = checkEmail();
      var passwordOk = checkPassword();
      var confirmOk = checkConfirm();
      var messageOk = checkMessage();

      if (nameOk && emailOk && passwordOk && confirmOk && messageOk) {
        // success
        var userName = $('#regName').val().trim();
        $('#formAlert').hide().html('<div class="alert alert-success mb-0"></div>').fadeIn(300);
        $('#formAlert .alert').text('Welcome to MovieVerse, ' + userName + '! Your account has been created.');

        this.reset();
        $('#registerForm .form-control').removeClass('is-valid is-invalid');
        $('.field-feedback').text('');
        showStrength();
      } else {

        $('#formAlert').hide().html('<div class="alert alert-danger mb-0">Please fix the highlighted fields before submitting.</div>').fadeIn(300);
      }
    });
  }



  if ($('#movieGrid').length) {

    var selectedCategory = 'all';

    function filterMovies() {

      var searchText = $('#movieSearch').val().toLowerCase().trim();
      var shown = 0;

      $('.movie-card').each(function () {
        var card = $(this);
        var cardText = card.text().toLowerCase();
        var cardCategory = card.data('category');
        var categoryOk = (selectedCategory === 'all' || cardCategory === selectedCategory);
        var searchOk = cardText.indexOf(searchText) !== -1;

        if (categoryOk && searchOk) {
          card.show();
          shown++;
        } else {
          card.hide();
        }
      });

      $('#noResults').toggle(shown === 0);
      $('#resultCount').text('Showing ' + shown + ' of ' + $('.movie-card').length + ' movies');
    }

    $('#movieSearch').on('input', filterMovies);

    $('.filter-btn').on('click', function () {
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      selectedCategory = $(this).data('category');
      filterMovies();
    });

    filterMovies();
  }

  if ($('#ratingsBody').length) {

    var defaultMovies = [
      { id: 1, title: 'Avengers: Endgame',   genre: 'Action',   rating: 8.4, votes: 1932 },
      { id: 2, title: 'The Lord of Rings',   genre: 'Fantasy',  rating: 9.2, votes: 1704 },
      { id: 3, title: 'La La Land',          genre: 'Romance',  rating: 8.0, votes: 1318 },
      { id: 4, title: 'Lovely Runner',       genre: 'Romance',  rating: 8.6, votes: 582 },
      { id: 5, title: '7 Qaraqshy',          genre: 'History',  rating: 7.4, votes: 726 },
      { id: 6, title: 'Parasite',            genre: 'Thriller', rating: 9.0, votes: 1245 },
      { id: 7, title: 'Project Hail Mary',   genre: 'Sci-Fi',   rating: 8.6, votes: 982 },
      { id: 8, title: 'Resident Evil',       genre: 'Horror',   rating: 7.6, votes: 1456 }
    ];

    var movies = defaultMovies.slice();
    var nextId = 9;
    var idToDelete = 0;

    var saved = localStorage.getItem('movieverse_ratings_v1');
    if (saved) {
      movies = JSON.parse(saved);
      nextId = 1;
      for (var i = 0; i < movies.length; i++) {
        if (movies[i].id >= nextId) nextId = movies[i].id + 1;
      }
    }

    function saveMovies() {
      localStorage.setItem('movieverse_ratings_v1', JSON.stringify(movies));
    }

    function findMovie(id) {
      for (var i = 0; i < movies.length; i++) {
        if (movies[i].id === id) return movies[i];
      }
    }

    var movieModal = new bootstrap.Modal('#movieModal');
    var deleteModal = new bootstrap.Modal('#deleteModal');

    function showTable() {
      $('#ratingsBody').empty();

      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

        var row = $('<tr>').attr('data-id', movie.id);
        row.append($('<td>').text(i + 1));
        row.append($('<td>').text(movie.title));
        row.append($('<td>').text(movie.genre));
        row.append($('<td>').text('★ ' + movie.rating.toFixed(1)));
        row.append($('<td>').text(movie.votes.toLocaleString('en-US')));   // 1932 -> 1,932
        row.append('<td><button type="button" class="row-btn edit-btn">Edit</button>' +
                   '<button type="button" class="row-btn danger delete-btn">Delete</button></td>');

        $('#ratingsBody').append(row);
      }
    }

    function clearFormMessages() {
      $('#movieForm .form-control').removeClass('is-valid is-invalid');
      $('#movieForm .field-feedback').text('');
    }

    function checkMovieForm() {
      var title = $('#mTitle').val().trim();
      var rating = Number($('#mRating').val());
      var votes = Number($('#mVotes').val());

      var titleOk = showMessage($('#mTitle'), title !== '', title !== '' ? 'Title is OK.' : 'Title is required.');

      var ratingIsGood = ($('#mRating').val() !== '' && rating >= 1 && rating <= 10);
      var ratingOk = showMessage($('#mRating'), ratingIsGood, ratingIsGood ? 'Rating is OK.' : 'Enter a rating from 1 to 10.');

      var votesIsGood = ($('#mVotes').val() !== '' && votes >= 0 && votes % 1 === 0);
      var votesOk = showMessage($('#mVotes'), votesIsGood, votesIsGood ? 'Votes are OK.' : 'Enter a whole number, 0 or more.');

      return titleOk && ratingOk && votesOk;
    }

    $('#mTitle, #mRating, #mVotes').on('input', checkMovieForm);


    $('#addMovieBtn').on('click', function () {
      $('#movieModalTitle').text('Add movie');
      $('#movieForm')[0].reset();
      $('#movieId').val('');
      clearFormMessages();
      movieModal.show();
    });

    $('#ratingsBody').on('click', '.edit-btn', function () {
      var id = Number($(this).closest('tr').attr('data-id'));
      var movie = findMovie(id);

      $('#movieModalTitle').text('Edit movie');
      $('#movieId').val(movie.id);
      $('#mTitle').val(movie.title);
      $('#mGenre').val(movie.genre);
      $('#mRating').val(movie.rating);
      $('#mVotes').val(movie.votes);
      clearFormMessages();
      movieModal.show();
    });

    $('#movieForm').on('submit', function (event) {
      event.preventDefault();
      if (!checkMovieForm()) return;

      var id = $('#movieId').val();

      if (id === '') {
        movies.push({
          id: nextId,
          title: $('#mTitle').val().trim(),
          genre: $('#mGenre').val(),
          rating: Number($('#mRating').val()),
          votes: Number($('#mVotes').val())
        });
        nextId++;
      } else {
        var movie = findMovie(Number(id));
        movie.title = $('#mTitle').val().trim();
        movie.genre = $('#mGenre').val();
        movie.rating = Number($('#mRating').val());
        movie.votes = Number($('#mVotes').val());
      }

      saveMovies();
      showTable();
      movieModal.hide();
    });

    $('#ratingsBody').on('click', '.delete-btn', function () {
      idToDelete = Number($(this).closest('tr').attr('data-id'));
      $('#deleteName').text(findMovie(idToDelete).title);
      deleteModal.show();
    });


    $('#confirmDeleteBtn').on('click', function () {
      var newList = [];
      for (var i = 0; i < movies.length; i++) {
        if (movies[i].id !== idToDelete) newList.push(movies[i]);
      }
      movies = newList;

      saveMovies();
      showTable();
      deleteModal.hide();
    });

    $('#resetDataBtn').on('click', function () {
      movies = defaultMovies.slice();
      nextId = 9;
      saveMovies();
      showTable();
    });

    showTable();
  }

  if ($('#galleryGrid').length) {

    var images = $('.gallery-item');
    var total = images.length;
    var current = 0;


    function showImage(number) {
      if (number >= total) number = 0;
      if (number < 0) number = total - 1;
      current = number;

      var item = images.eq(current);
      $('#lbImage').attr('src', item.attr('data-full'));
      $('#lbCaption').html(item.attr('data-caption') + ' (' + (current + 1) + ' / ' + total + ')');
    }

    function openLightbox(number) {
      showImage(number);
      $('#lightbox').fadeIn(300);
    }

    function closeLightbox() {
      $('#lightbox').fadeOut(300);
    }

    function changeImage(number) {
      $('.lb-figure').fadeOut(200, function () {
        showImage(number);
        $('.lb-figure').fadeIn(300);
      });
    }

    images.on('click', function () {
      openLightbox(Number($(this).attr('data-index')));
    });

    $('#lbNext').on('click', function () { changeImage(current + 1); });
    $('#lbPrev').on('click', function () { changeImage(current - 1); });
    $('#lbClose').on('click', closeLightbox);
    $('#lightbox').on('click', function (event) {
      if (event.target === this) closeLightbox();
    });

    $(document).on('keydown', function (event) {
      if (!$('#lightbox').is(':visible')) return;

      if (event.key === 'ArrowRight') changeImage(current + 1);
      if (event.key === 'ArrowLeft') changeImage(current - 1);
      if (event.key === 'Escape') closeLightbox();
    });
  }



  if ($('.trailer-screen video').length) {

    $('.trailer-screen video').on('play', function () {
      var playingVideo = this;

      // go through all videos and pause every one except the playing video
      $('.trailer-screen video').each(function () {
        if (this !== playingVideo) this.pause();
      });
    });
  }

  if ($('#reviewForm').length) {

    var reviews = [];

    var savedReviews = localStorage.getItem('movieverse_reviews_v1');
    if (savedReviews) reviews = JSON.parse(savedReviews);


    function makeStars(score) {
      var starCount = Math.ceil(score / 2);
      var stars = '';
      for (var i = 1; i <= 5; i++) {
        if (i <= starCount) stars += '★';
        else stars += '☆';
      }
      return stars;
    }

    function makeInitials(name) {
      var words = name.split(' ');
      var letters = words[0][0];
      if (words.length > 1) letters += words[words.length - 1][0];
      return letters.toUpperCase();
    }


    function makeCard(review) {
      var card = $('<article class="review-card"></article>');

      var top = $('<div class="review-top"></div>');
      top.append($('<div class="avatar"></div>').text(makeInitials(review.name)));

      var info = $('<div></div>');
      info.append($('<h3></h3>').text(review.name));
      info.append($('<span class="review-stars"></span>').text(makeStars(review.score)));
      top.append(info);

      card.append(top);
      card.append($('<p></p>').text('"' + review.text + '"'));
      card.append($('<small></small>').text('Reviewed: ' + review.movie));
      return card;
    }


    for (var i = 0; i < reviews.length; i++) {
      $('#reviewGrid').prepend(makeCard(reviews[i]));
    }

    $('#reviewForm').on('submit', function (event) {
      event.preventDefault();

      var name = $('#reviewer').val().trim();
      var text = $('#review').val().trim();


      if (name === '' || text === '') {
        $('#reviewAlert').hide().html('<div class="alert alert-danger mb-0">Please enter your name and write a review.</div>').fadeIn(250);
        return;
      }

      var review = {
        name: name,
        movie: $('#movie').val(),
        score: Number($('#score').val()),
        text: text
      };

      reviews.push(review);
      localStorage.setItem('movieverse_reviews_v1', JSON.stringify(reviews));

      makeCard(review).hide().prependTo('#reviewGrid').fadeIn(500);

      this.reset();
      $('#reviewAlert').hide().html('<div class="alert alert-success mb-0">Thank you! Your review was published.</div>').fadeIn(250);
    });
  }

});
