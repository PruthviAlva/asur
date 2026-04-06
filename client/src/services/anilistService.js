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
}

export default anilistService