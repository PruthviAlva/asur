// AniList uses GraphQL — we use plain fetch, no Apollo needed

const ANILIST_URL = 'https://graphql.anilist.co'

// Generic query executor
const anilistQuery = async (query, variables = {}) => {
    const res = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    })

    if (!res.ok) throw new Error(`AniList API error: ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0].message)
    return json.data
}

// ── GraphQL Queries ───────────────────────────────

// Search by MAL ID — gets richer data than Jikan
const MEDIA_BY_MAL_ID = `
  query ($malId: Int, $type: MediaType) {
    Media(idMal: $malId, type: $type) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      description(asHtml: false)
      bannerImage
      coverImage {
        extraLarge
        large
        color
      }
      trailer {
        id
        site
        thumbnail
      }
      averageScore
      meanScore
      popularity
      trending
      favourites
      rankings {
        rank
        type
        context
        allTime
      }
      genres
      tags {
        name
        rank
        isMediaSpoiler
      }
      studios(isMain: true) {
        nodes {
          name
          siteUrl
        }
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
      externalLinks {
        url
        site
        icon
        color
      }
      siteUrl
    }
  }
`

const CHARACTERS_QUERY = `
  query ($malId: Int, $type: MediaType, $page: Int) {
    Media(idMal: $malId, type: $type) {
      id
      title { english romaji }
      characters(page: $page, perPage: 20, sort: [ROLE, RELEVANCE]) {
        pageInfo {
          total
          currentPage
          hasNextPage
        }
        edges {
          role
          node {
            id
            name {
              full
              native
            }
            image {
              large
              medium
            }
            description(asHtml: false)
            gender
            siteUrl
          }
          voiceActors(language: JAPANESE) {
            id
            name {
              full
              native
            }
            image {
              large
            }
            languageV2
            siteUrl
          }
        }
      }
    }
  }
`

const STAFF_QUERY = `
  query ($malId: Int, $type: MediaType) {
    Media(idMal: $malId, type: $type) {
      id
      title { english romaji }
      staff(perPage: 20, sort: [RELEVANCE]) {
        edges {
          role
          node {
            id
            name { full native }
            image { large }
            primaryOccupations
            siteUrl
          }
        }
      }
    }
  }
`

const RECOMMENDATIONS_QUERY = `
  query ($malId: Int, $type: MediaType) {
    Media(idMal: $malId, type: $type) {
      recommendations(perPage: 10, sort: [RATING_DESC]) {
        nodes {
          rating
          mediaRecommendation {
            idMal
            title { english romaji }
            coverImage { large }
            averageScore
            genres
            type
          }
        }
      }
    }
  }
`

const RELATIONS_QUERY = `
  query ($malId: Int, $type: MediaType) {
    Media(idMal: $malId, type: $type) {
      relations {
        edges {
          relationType
          node {
            idMal
            title { english romaji }
            coverImage { large }
            type
          }
        }
      }
    }
  }
`

const TRENDING_QUERY = `
  query ($page: Int, $type: MediaType) {
    Page(page: $page, perPage: 20) {
      media(sort: TRENDING_DESC, type: $type, isAdult: false) {
        idMal
        id
        title { english romaji }
        coverImage { large color }
        bannerImage
        averageScore
        trending
        genres
        type
        status
        episodes
        chapters
      }
    }
  }
`

const TOP_ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: $type, isAdult: false) {
        idMal
        id
        title { english romaji }
        coverImage { large color }
        averageScore
        popularity
        rank: rankings { rank }
        genres
        status
        episodes
      }
    }
  }
`

const SEASON_QUERY = `
  query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, type: $type, isAdult: false) {
        idMal
        id
        title { english romaji }
        coverImage { large color }
        bannerImage
        averageScore
        popularity
        status
        episodes
      }
    }
  }
`

const UPCOMING_QUERY = `
  query ($page: Int, $perPage: Int, $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      media(status: NOT_YET_RELEASED, sort: POPULARITY_DESC, type: $type, isAdult: false) {
        idMal
        id
        title { english romaji }
        coverImage { large color }
        averageScore
        popularity
        status
        episodes
      }
    }
  }
`

const anilistService = {
    // Get rich media data by MAL ID
    getMediaByMalId: (malId, type = 'ANIME') =>
        anilistQuery(MEDIA_BY_MAL_ID, { malId: Number(malId), type }),

    // Get characters + voice actors
    getCharacters: (malId, type = 'ANIME', page = 1) =>
        anilistQuery(CHARACTERS_QUERY, { malId: Number(malId), type, page }),

    // Get staff (directors, composers etc.)
    getStaff: (malId, type = 'ANIME') =>
        anilistQuery(STAFF_QUERY, { malId: Number(malId), type }),

    // Get recommendations
    getRecommendations: (malId, type = 'ANIME') =>
        anilistQuery(RECOMMENDATIONS_QUERY, { malId: Number(malId), type }),

    // Get AniList trending (richer than Jikan)
    getTrending: (page = 1, type = 'ANIME') =>
        anilistQuery(TRENDING_QUERY, { page, type }),

    // Top anime by score
    getTopAnime: (page = 1, perPage = 10, type = 'ANIME') =>
      anilistQuery(TOP_ANIME_QUERY, { page, perPage, type }),

    // Season now — compute current season/year on client and query AniList
    getSeasonNow: (page = 1, perPage = 10, type = 'ANIME') => {
      const now = new Date()
      const month = now.getMonth() + 1
      let season = 'WINTER'
      if (month >= 3 && month <= 5) season = 'SPRING'
      else if (month >= 6 && month <= 8) season = 'SUMMER'
      else if (month >= 9 && month <= 11) season = 'FALL'
      const year = now.getFullYear()
      return anilistQuery(SEASON_QUERY, { season, seasonYear: year, page, perPage, type })
    },

    // Upcoming (not yet released)
    getUpcoming: (page = 1, perPage = 12, type = 'ANIME') =>
      anilistQuery(UPCOMING_QUERY, { page, perPage, type }),

    // Generic media search
    searchMedia: (search, page = 1, perPage = 24, type = 'ANIME') => {
      const SEARCH_QUERY = `query ($search: String, $page: Int, $perPage: Int, $type: MediaType) { Page(page:$page, perPage:$perPage) { media(search: $search, type: $type, isAdult: false) { idMal id title { english romaji } coverImage { large } averageScore } } }`
      return anilistQuery(SEARCH_QUERY, { search, page, perPage, type })
    },

    // Relations for a media (similar to Jikan relations)
    getRelations: (malId, type = 'ANIME') => anilistQuery(RELATIONS_QUERY, { malId: Number(malId), type }),
}

export default anilistService