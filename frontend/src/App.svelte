<script lang="ts">
  import './app.css';
  import { onMount } from 'svelte';
  import { getFormattedDate, type FormattedDate } from './utils/dateUtils';

  let apiKey: string = '';
  
  interface Article {
    web_url: string;
    headline: { main: string };
    snippet: string;
    multimedia: {
      caption: string;
      credit: string;
      default: {
        url: string;
        height: number;
        width: number;
      };
      thumbnail: {
        url: string;
        height: number;
        width: number;
      };
    };
  }
  
  let articles: Article[] = [];
  let locations = ['Sacramento', 'Davis'];
  // Date formatting
  let currentDate: string = '';
  let dayName: string = '';
  let monthName: string = '';
  let dayOfMonth: string = '';
  let year: string = '';

  function updateDate() {
    const formattedDate = getFormattedDate();
    currentDate = formattedDate.currentDate;
    dayName = formattedDate.dayName;
    monthName = formattedDate.monthName;
    dayOfMonth = formattedDate.dayOfMonth;
    year = formattedDate.year;
  }

  let intervalId: number;

  // Fetch API key and articles sequentially
  onMount(() => {
    updateDate();
    intervalId = window.setInterval(updateDate, 60000);
    fetchData();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

  async function fetchData() {
    try {
      // Fetch the API key
      const keyRes = await fetch('/api/key');
      const keyData = await keyRes.json();
      apiKey = keyData.apiKey;

      // Create location filter query
      const locationQuery = locations
        .map(loc => `timesTag.location.contains:"${loc}"`)
        .join(' OR ');

      // Fetch articles only after the API key is loaded
      const articlesRes = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=(${locationQuery})&api-key=${apiKey}`
      );
      const articlesData = await articlesRes.json();
      articles = articlesData.response.docs;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  // Helper function to get the image URL from an article's multimedia
  function getArticleImage(article: Article): string {
    if (article.multimedia && article.multimedia.default) {
      return article.multimedia.default.url;
    }
    return '/image1.png'; // Fallback image
  }
</script>

<main>
    <header>
        <div class="header-container">
            <div class="date-display">
                <span id="current-date">
                    <span class="day">{dayName}</span>, 
                    <span class="date">{monthName} {dayOfMonth}, {year}</span>
                </span>
                <p>Today's Paper</p>
            </div>
            <div class="nyt-logo">
                <img src="/nyt-logo.png" alt="New York Times Logo">
            </div>
        </div>
        <hr>
        <p>API Key: {apiKey}</p>
    </header>

    <section>
      <div class="container">
        {#each articles as article, i}
          <div class="column">
            <div class="section">
              {#if article.multimedia && article.multimedia.default}
                <img src={article.multimedia.default.url} alt={article.headline.main}>
              {:else}
                <img src="/image1.png" alt="No image available">
              {/if}
              <h2>{article.headline.main}</h2>
              <p>{article.snippet}</p>
              {#if article.multimedia && article.multimedia.caption}
                <p class="caption">{article.multimedia.caption}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
</main>
