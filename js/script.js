import { generateUserkey, currentUser } from './user.js';

const apiKey = 'e04d870c';
const $movies = document.getElementById('movies');
const $formSearch = document.getElementById('formSearch');
const $prevPagination = document.getElementById('prev');
const $nextPagination = document.getElementById('next');
const $currentPage = document.getElementById('currentPage');
const $numPages = document.getElementById('numPages');
const $searchMoviesHidden = document.getElementById('searchHidden');
const $modal = document.getElementById('modal');

const $favoriteButton = document.getElementById('favoriteButton');

const $favoritesMovies = document.getElementById('favoritesMovies');



const validateUser = () => {
    if (!sessionStorage.getItem('login')) {
        window.location.href = '../index.html';
    }
};

const requestAllData = (keyWords, numPage) => {
    return fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${keyWords}&page=${numPage}`)
        .then(response => response.json());
};

const requestSingleData = id => {
    return fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
        .then(response => response.json());
};



const removeOrAddFavorite = event => {

    if (event.target.classList.contains('card-movie__heart')) {
        const imdbId = event.target.id;
        const $chkFavorite = event.target.previousElementSibling;
        if ($chkFavorite.checked) {
            if (confirm('Are you sure delete from favorites?')) {
                removeFavorite(imdbId);
                return 'deleted';
            } else {
                event.preventDefault();//Not disabled check 
            }
        } else {
            addFavorite(imdbId);
        }

    }
};


const drawMovies = async (containerElementId, keyWords, numPage) => {

    const containerElement = document.getElementById(containerElementId)
    const moviesFragment = document.createDocumentFragment();

    onLoadingPag();
    const foundMovies = await requestAllData(keyWords, numPage);

    if (foundMovies.Response === 'True') {
        resultsFragment(foundMovies.totalResults);

        let cont = 0;
        for (const movie of foundMovies.Search) {
            cont++;
            const allDataMovie = await requestSingleData(movie.imdbID);
            moviesFragment.appendChild(createMovie(allDataMovie, cont, 'n'));
        }
        containerElement.innerHTML = '';
        containerElement.appendChild(moviesFragment);
        disabledPaginatorButton();

    } else {
        alert('Not found...');
    }
    loadingFinish();
};

const drawInfoMovieserie = movie => {

    const $infoTitle = document.getElementById('infoTitle');
    const $infoYear = document.getElementById('infoYear');
    const $infoRated = document.getElementById('infoRated');
    const $infoReleased = document.getElementById('infoReleased');
    const $infoRuntime = document.getElementById('infoRuntime');
    const $infoGenre = document.getElementById('infoGenre');
    const $infoDirector = document.getElementById('infoDirector');
    const $infoWriter = document.getElementById('infoWriter');
    const $infoActors = document.getElementById('infoActors');
    const $infoPlot = document.getElementById('infoPlot');
    const $infoAwards = document.getElementById('infoAwards');
    const $infoRatings = document.getElementById('infoRatings');

    $infoTitle.textContent = movie.Title;
    $infoYear.textContent = movie.Year;
    $infoRated.textContent = movie.Rated;
    $infoReleased.textContent = movie.Released;
    $infoRuntime.textContent = movie.Runtime;
    $infoGenre.textContent = movie.Genre;
    $infoDirector.textContent = movie.Director;
    $infoWriter.textContent = movie.Writer;
    $infoActors.textContent = movie.Actors;
    $infoPlot.textContent = movie.Plot;
    $infoAwards.textContent = movie.Awards;


    const ratings = document.createDocumentFragment();
    movie.Ratings.forEach(rating => {
        const trRating = document.createElement('TR');
        trRating.classList.add('modal-info__tr');
        const tdRatingSource = document.createElement('TD');
        const tdRatingSValue = document.createElement('TD');
        tdRatingSource.classList.add('modal-info__td');
        tdRatingSValue.classList.add('modal-info__td');

        tdRatingSource.textContent = rating.Source;
        tdRatingSValue.textContent = rating.Value;

        trRating.append(tdRatingSource, tdRatingSValue);

        ratings.appendChild(trRating);
    });

    $infoRatings.innerHTML = '';
    $infoRatings.appendChild(ratings);

};


const isFavorite = imdbId => currentUser().favorites.includes(imdbId);

const createMovie = (movie, cont, is_favorite) => {

    const elementAllDatMovie = document.createElement('SPAN');
    elementAllDatMovie.textContent = JSON.stringify(movie);
    elementAllDatMovie.id = 'allDataMovieserie';
    elementAllDatMovie.classList.add('hide');

    const cardMovie = document.createElement('DIV');
    cardMovie.classList.add('card-movie');

    const movieTransparent = document.createElement('DIV');
    movieTransparent.classList.add('card-movie__transparent');

    const cardHeader = document.createElement('DIV');
    const headerType = document.createElement('DIV');
    headerType.classList.add('card-movie__type-container');
    const headerFavoriteLabel = document.createElement('LABEL');
    headerFavoriteLabel.classList.add('card-movie__favorite', 'card-movie__heart');
    headerFavoriteLabel.setAttribute('for', `chkFavorite${is_favorite + cont}`);
    headerFavoriteLabel.id = movie.imdbID;

    const headerFavoriteChk = document.createElement('INPUT');
    headerFavoriteChk.type = 'checkbox';
    headerFavoriteChk.id = `chkFavorite${is_favorite + cont}`;
    headerFavoriteChk.classList.add('card-movie__chk', 'hide');

    headerFavoriteChk.checked = isFavorite(movie.imdbID);

    cardHeader.classList.add('card-movie__header');
    const movieType = document.createElement('SPAN');
    movieType.classList.add('card-movie__type');
    movieType.textContent = movie.Type;
    const movieTitle = document.createElement('H2');
    movieTitle.classList.add('card-movie__title');
    movieTitle.textContent = `${movie.Title} (${movie.Year}).`;
    headerType.append(movieType, headerFavoriteChk, headerFavoriteLabel);
    cardHeader.append(headerType, movieTitle);

    const cardBody = document.createElement('DIV');

    cardBody.classList.add('card-movie__body');
    const moviePlot = document.createElement('P');
    moviePlot.classList.add('card-movie__plot');
    moviePlot.textContent = movie.Plot;
    cardBody.appendChild(moviePlot);

    const cardFooter = document.createElement('DIV');

    cardFooter.classList.add('card-movie__footer');
    const movieDirector = document.createElement('SPAN');
    movieDirector.classList.add('card-movie__director');
    movieDirector.textContent = `Director: ${movie.Director}.`;

    const movieGenre = document.createElement('P');
    movieGenre.classList.add('card-movie__genre');
    movieGenre.textContent = movie.Genre + '.';
    cardFooter.append(movieDirector, movieGenre);

    const movieImg = document.createElement('IMG');
    movieImg.classList.add('card-movie__img');
    movieImg.src = movie.Poster === 'N/A' ? './img/img.jfif' : movie.Poster;


    movieTransparent.append(cardHeader, cardBody, cardFooter);


    cardMovie.append(elementAllDatMovie, movieImg, movieTransparent);

    return cardMovie;

};

const resultsFragment = (totalResults) => {

    const numPages = Math.ceil(totalResults / 10);
    $numPages.textContent = numPages;

};



const addFavorite = imdbId => {

    const userToUpdate = currentUser();
    const userId = generateUserkey(userToUpdate.name, userToUpdate.password);
    const favoritescurrentUser = userToUpdate.favorites;

    if (!favoritescurrentUser.includes(imdbId)) favoritescurrentUser.push(imdbId);


    userToUpdate.favorites = favoritescurrentUser;
    localStorage.setItem(userId, JSON.stringify(userToUpdate));

};

const removeFavorite = imdbId => {

    const userToUpdate = currentUser();
    const userId = generateUserkey(userToUpdate.name, userToUpdate.password);
    const favoritescurrentUser = userToUpdate.favorites;


    const indexFavorite = favoritescurrentUser.findIndex(favoriteId => favoriteId === imdbId);

    favoritescurrentUser.splice(indexFavorite, 1);

    userToUpdate.favorites = favoritescurrentUser;
    localStorage.setItem(userId, JSON.stringify(userToUpdate));
};


const changePage = direction => {

    let currentPage = parseInt($currentPage.textContent);
    const numPages = parseInt($numPages.textContent);

    if (direction == 'prev') {
        currentPage--;
        $currentPage.textContent = currentPage;

    } else {

        currentPage++;
        $currentPage.textContent = currentPage;
    }
};

const disabledPaginatorButton = () => {
    if ($currentPage.textContent == 1) {
        $prevPagination.classList.add('paginator__item--disabled');
        $prevPagination.id = '';

    } else {
        $prevPagination.classList.remove('paginator__item--disabled');
        $prevPagination.id = 'prev';
    }

    if ($currentPage.textContent == $numPages.textContent) {
        $nextPagination.classList.add('paginator__item--disabled');
        $nextPagination.id = '';

    } else {
        $nextPagination.classList.remove('paginator__item--disabled');
        $nextPagination.id = 'next';
    }
};

const paginator = () => {

    $prevPagination.addEventListener('click', () => {
        const currentPage = parseInt($currentPage.textContent);
        const currentSearch = $searchMoviesHidden.value;

        if (currentPage !== 1) {
            changePage('prev');
            drawMovies('movies', currentSearch, currentPage - 1);
        }
        disabledPaginatorButton();
    });

    $nextPagination.addEventListener('click', () => {

        const currentPage = parseInt($currentPage.textContent);
        const numPages = parseInt($numPages.textContent);
        const currentSearch = $searchMoviesHidden.value;

        if (currentPage !== numPages) {
            changePage('next');
            drawMovies('movies', currentSearch, currentPage + 1);
        }
        disabledPaginatorButton();
    });
}

const onLoadingPag = () => {

    loading.classList.add('loading');
    body.style = 'overflow:hidden';

};

const loadingFinish = () => {
    loading.classList.remove('loading');
    body.style = 'overflow:""';
};

const showHideFavorites = () => {

    $favoriteButton.addEventListener('click', async () => {


        const movies = [];

        const fragment = document.createDocumentFragment();
        let cont = 1;
        for (const imdbId of currentUser().favorites) {
            const movie = await requestSingleData(imdbId);


            movies.push(movie);
            fragment.appendChild(createMovie(movie, cont, 'f'));

            cont++;
        }

        if (movies.length > 0) {

            $favoritesMovies.innerHTML = '';
            $favoritesMovies.appendChild(fragment);


            containerMovies.classList.add('transparent');

            setTimeout(() => {
                containerMovies.classList.add('hide');
                favorites.classList.remove('hide');
            }, 300);

            setTimeout(() => {
                favorites.classList.remove('transparent');
            }, 320);

        } else {
            alert('You haven´t add favorites.');
        }

    });

    returnToSearch.addEventListener('click', () => {
        favorites.classList.add('transparent');

        drawMovies('movies', $searchMoviesHidden.value, parseInt($currentPage.textContent));

        setTimeout(() => {
            containerMovies.classList.remove('hide');
            favorites.classList.add('hide');
        }, 300);

        setTimeout(() => {
            containerMovies.classList.remove('transparent');
        }, 320);
    });
};


$formSearch.addEventListener('submit', e => {
    e.preventDefault();

    const searchValue = e.currentTarget.firstElementChild.firstElementChild.value;
    $searchMoviesHidden.value = searchValue;

    if (searchValue.trim() && searchValue.length > 3) {


        $currentPage.textContent = 1;
        disabledPaginatorButton();

        drawMovies('movies', searchValue);
    }
});

$movies.addEventListener('click', e => {
    removeOrAddFavorite(e);
    if (!e.target.classList.contains('card-movie__favorite') && !e.target.classList.contains('card-movie__chk')) {
        if (e.target.classList.toString().includes('card-movie')) {

            const jsonMovieInfo = JSON.parse(e.target.closest('.card-movie').firstElementChild.textContent);
            $modal.classList.add('modal-info--show');
            body.style = 'overflow:hidden';

            drawInfoMovieserie(jsonMovieInfo);

        }

    }
});

document.addEventListener('click', e => {
    if (e.target.id === 'modal') {
        $modal.classList.remove('modal-info--show')
        body.style = 'overflow:""';

    };
});

$favoritesMovies.addEventListener('click', e => {
    if (
        e.target.classList.contains('card-movie__heart')
        && removeOrAddFavorite(e) === 'deleted'
    )
        e.target.parentElement.parentElement.parentElement.parentElement.remove();

    if (!e.target.classList.contains('card-movie__favorite') && !e.target.classList.contains('card-movie__chk')) {
        if (e.target.classList.toString().includes('card-movie')) {

            const jsonMovieInfo = JSON.parse(e.target.closest('.card-movie').firstElementChild.textContent);
            $modal.classList.add('modal-info--show');
            drawInfoMovieserie(jsonMovieInfo);

        }

    }
});

document.addEventListener('DOMContentLoaded', () => {

    validateUser();
    drawMovies('movies', 'robot');
    paginator();
    disabledPaginatorButton();
    showHideFavorites();

});





