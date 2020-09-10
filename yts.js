export default class YTS {

    constructor(baseUrl = 'https://yts.mx/') {
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }

        this.baseUrl = baseUrl;
    }

    /**
     * Makes a request to the yts api
     * @param {String} relative API endpoint to access
     * @param {Object=} getParams Parameters to append to the url
     * @param {RequestInit=} opts Options to give to the fetch call
     */
    fetch(relative, getParams, opts) {
        if (relative.startsWith('/')) {
            relative = 'api/v2' + relative;
        } else {
            relative = 'api/v2' + '/' + relative;
        }

        const url = new URL(relative, this.baseUrl);

        if (getParams) {
            for (var i in getParams) {
                url.searchParams.append(i, getParams[i]);
            }
        }

        return window.fetch(url, getParams, opts);
    }

    /**
     * Searches movies that match some criteria
     * @param {String} query String to match with the movies title/IMDb code, actors name/IMDb code, Director Name/IMDb code
     * @param {Number} page Page number
     * @param {Number} itemsPerPage Number of items to display per page
     * @param {Number} minimumRating Minimum IMDb rating
     * @param {String} genre One of IMDbs genre
     * @param {'title'|'year'|'rating'|'peers'|'seeds'|'download_count'|'like_count'|'date_added'} sortBy Field to use when sorting results
     * @param {'asc'|'desc'} sortMode Sort results in ascending or descending order
     * @param {Boolean} withRtRatings Include RottenTomatoes ratings?
     */
    async searchMovies(query, page = 1, itemsPerPage = 20, minimumRating = 0, genre = 'all', sortBy = 'date_added', sortMode = 'desc', withRtRatings = false) {
        var params = {};

        if (query) {
            params.query_term = query;
        }
        if (minimumRating) {
            params.minimum_rating = minimumRating;
        }

        params.genre = genre;
        params.page = page;
        params.limit = itemsPerPage;
        params.sort_by = sortBy;
        params.orderby_by = sortMode;
        params.with_rt_ratings = withRtRatings;

        var res = await this.fetch('/list_movies.json', params);
        var body = await res.json();

        if (body.status !== 'ok') {
            throw body.status_message;
        } else {
            return body.data;
        }
    }
}